/**
 * Deployment safety check for the production build.
 *
 * Fails (exit 1) if dist/ contains:
 *   - any .pdf file, or any file whose bytes start with the PDF signature
 *   - a byte-for-byte copy of a local source PDF (compared by SHA-256)
 *   - a path or reference to the private source-material directory
 *   - long verbatim runs of extracted lecture text (when local text files exist)
 *
 * Run automatically at the end of `npm run build`, or alone with `npm run check-build`.
 * Works without local PDFs (for example on Vercel), where only the generic checks apply.
 */
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");
const sourceDirs = ["source-material", "lecture-sources", "private-materials"].map((d) => join(root, d));
const PRIVATE_PATH_PATTERN = /source-material|lecture-sources|private-materials/i;
const TEXT_EXT = /\.(html|js|mjs|css|json|txt|svg|map|xml|webmanifest)$/i;

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const sha256 = (buf) => createHash("sha256").update(buf).digest("hex");

if (!existsSync(dist)) {
  console.error("check-build: dist/ does not exist. Run `npm run build` first.");
  process.exit(1);
}

const problems = [];
const distFiles = walk(dist);

const localPdfs = sourceDirs.flatMap(walk).filter((f) => f.toLowerCase().endsWith(".pdf"));
const pdfHashes = new Map(localPdfs.map((f) => [sha256(readFileSync(f)), relative(root, f)]));

for (const file of distFiles) {
  const rel = relative(root, file);
  const buf = readFileSync(file);
  if (file.toLowerCase().endsWith(".pdf")) problems.push(`${rel}: PDF file in build output`);
  if (buf.subarray(0, 5).toString("latin1") === "%PDF-") problems.push(`${rel}: file content is a PDF`);
  const match = pdfHashes.get(sha256(buf));
  if (match) problems.push(`${rel}: identical to local source file ${match}`);
  if (PRIVATE_PATH_PATTERN.test(rel.split(sep).join("/"))) problems.push(`${rel}: private directory name in output path`);
  if (TEXT_EXT.test(file) && PRIVATE_PATH_PATTERN.test(buf.toString("utf8")))
    problems.push(`${rel}: references a private source-material path`);
}

// Optional verbatim-text check: if the developer has extracted lecture text locally
// (git-ignored *.extracted.txt / *.ocr.txt under the source directories), make sure
// no long passage of it was pasted into the bundle.
const extracted = sourceDirs.flatMap(walk).filter((f) => /\.(extracted|ocr)\.txt$/i.test(f));
if (extracted.length) {
  const bundleText = distFiles
    .filter((f) => TEXT_EXT.test(f))
    .map((f) => readFileSync(f, "utf8"))
    .join("\n")
    .replace(/\s+/g, " ")
    .toLowerCase();
  for (const file of extracted) {
    const words = readFileSync(file, "utf8").replace(/\s+/g, " ").toLowerCase().split(" ");
    const WINDOW = 40;
    let hits = 0;
    for (let i = 0; i + WINDOW <= words.length; i += WINDOW) {
      if (bundleText.includes(words.slice(i, i + WINDOW).join(" "))) hits++;
    }
    if (hits > 0) problems.push(`${relative(root, file)}: ${hits} passage(s) of ${WINDOW}+ words appear verbatim in dist/`);
  }
}

console.log(`check-build: scanned ${distFiles.length} file(s) in dist/`);
console.log(`check-build: compared against ${localPdfs.length} local source PDF(s)${localPdfs.length ? "" : " (none present, generic checks only)"}`);

if (problems.length) {
  console.error(`\ncheck-build: FAILED with ${problems.length} problem(s):`);
  for (const p of problems) console.error(`  x ${p}`);
  process.exit(1);
}

console.log("check-build: OK, no source PDFs or private material found in dist/");
