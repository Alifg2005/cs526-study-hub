/**
 * Validates the lecture registry and every content module.
 * Run with `npm run validate-content`. Exits non-zero on any error.
 */
import { lectureRegistry } from "../src/content/registry";
import { lectureContentModules } from "../src/content/lectures";
import { REQUIRED_MCQ_COUNT, validateContent } from "../src/lib/validate-content";

const { errors, warnings } = validateContent(lectureRegistry, lectureContentModules);

console.log("CS526 content validation\n");
for (const meta of [...lectureRegistry].sort((a, b) => a.order - b.order)) {
  const content = lectureContentModules.find((m) => m.lectureId === meta.id);
  const detail = content
    ? `${content.sections.length} sections, ${content.essays.length} essays, ${content.quiz.length}/${REQUIRED_MCQ_COUNT} MCQs`
    : "no content";
  console.log(`  ${meta.id.padEnd(20)} ${meta.status.padEnd(12)} ${detail}`);
}

if (warnings.length) {
  console.log(`\n${warnings.length} warning(s):`);
  for (const w of warnings) console.log(`  ! ${w}`);
}

if (errors.length) {
  console.error(`\n${errors.length} error(s):`);
  for (const e of errors) console.error(`  x ${e}`);
  process.exit(1);
}

console.log("\nAll lecture content is valid.");
