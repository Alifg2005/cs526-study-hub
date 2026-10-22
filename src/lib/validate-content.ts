import type {
  ContentBlock,
  LectureContent,
  LectureMeta,
  LectureStatus,
  OptionId,
} from "../types/content";

import { MIN_ESSAYS, REQUIRED_MCQ_COUNT } from "./constants";
export { MIN_ESSAYS, REQUIRED_MCQ_COUNT };

const STATUSES: LectureStatus[] = ["available", "coming-soon"];
const OPTION_IDS: OptionId[] = ["a", "b", "c", "d"];
/** Options like these break when answers are shuffled for each attempt. */
const POSITIONAL_OPTION = /\b(all|none|both|neither) of the (above|following)\b/i;
/** House style: no em or en dashes in visible copy. */
const BANNED_DASH = /[–—]/;

export interface ValidationReport {
  errors: string[];
  warnings: string[];
}

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const isBlank = (s: unknown) => typeof s !== "string" || s.trim().length === 0;

function collectStrings(value: unknown, path: string, out: [string, string][]): void {
  if (typeof value === "string") out.push([path, value]);
  else if (Array.isArray(value)) value.forEach((v, i) => collectStrings(v, `${path}[${i}]`, out));
  else if (value && typeof value === "object")
    for (const [k, v] of Object.entries(value)) collectStrings(v, `${path}.${k}`, out);
}

function validateBlock(block: ContentBlock, where: string, errors: string[]): void {
  switch (block.type) {
    case "paragraph":
      if (isBlank(block.text)) errors.push(`${where}: empty paragraph`);
      break;
    case "list":
      if (block.items.length === 0 || block.items.some(isBlank)) errors.push(`${where}: list has empty items`);
      break;
    case "steps":
      if (block.items.length === 0 || block.items.some((s) => isBlank(s.title) || isBlank(s.detail)))
        errors.push(`${where}: steps need a title and detail`);
      break;
    case "table":
      if (block.columns.length === 0 || block.rows.length === 0) errors.push(`${where}: table needs columns and rows`);
      block.rows.forEach((row, i) => {
        if (row.length !== block.columns.length)
          errors.push(`${where}: table row ${i} has ${row.length} cells, expected ${block.columns.length}`);
      });
      break;
    case "callout":
      if (isBlank(block.text)) errors.push(`${where}: empty callout`);
      break;
    case "code":
      if (isBlank(block.code)) errors.push(`${where}: empty code block`);
      break;
    case "terms":
      if (block.items.length === 0 || block.items.some((t) => isBlank(t.term) || isBlank(t.definition)))
        errors.push(`${where}: terms need a term and definition`);
      break;
  }
}

function validateLectureContent(
  meta: LectureMeta,
  content: LectureContent,
  seenQuestionIds: Map<string, string>,
  seenQuestionText: Map<string, string>,
  report: ValidationReport,
): void {
  const { errors, warnings } = report;
  const at = (path: string) => `${meta.id}${path}`;

  if (content.overview.length === 0 || content.overview.some(isBlank)) errors.push(at(": overview is missing"));

  const objectiveIds = new Set<string>();
  if (content.objectives.length < 2) errors.push(at(": needs at least 2 learning objectives"));
  content.objectives.forEach((o, i) => {
    if (isBlank(o.id) || isBlank(o.text)) errors.push(at(`.objectives[${i}]: id and text are required`));
    if (objectiveIds.has(o.id)) errors.push(at(`.objectives[${i}]: duplicate objective id "${o.id}"`));
    objectiveIds.add(o.id);
  });

  if (content.keyTerms.length < 3) errors.push(at(": needs at least 3 key terms"));
  content.keyTerms.forEach((t, i) => {
    if (isBlank(t.term) || isBlank(t.definition)) errors.push(at(`.keyTerms[${i}]: term and definition are required`));
  });

  const sectionIds = new Set<string>();
  if (content.sections.length < 2) errors.push(at(": needs at least 2 review sections"));
  content.sections.forEach((s, i) => {
    const where = at(`.sections[${i}]`);
    if (isBlank(s.id) || isBlank(s.title)) errors.push(`${where}: id and title are required`);
    if (sectionIds.has(s.id)) errors.push(`${where}: duplicate section id "${s.id}"`);
    sectionIds.add(s.id);
    if (s.blocks.length === 0) errors.push(`${where}: section has no content`);
    s.blocks.forEach((b, j) => validateBlock(b, `${where}.blocks[${j}]`, errors));
  });

  if (content.takeaways.length < 3 || content.takeaways.some(isBlank)) errors.push(at(": needs at least 3 takeaways"));
  if (content.checklist.length < 3 || content.checklist.some(isBlank)) errors.push(at(": needs at least 3 checklist items"));

  const essayIds = new Set<string>();
  if (content.essays.length < MIN_ESSAYS) errors.push(at(`: needs at least ${MIN_ESSAYS} essay questions`));
  content.essays.forEach((e, i) => {
    const where = at(`.essays[${i}]`);
    if (isBlank(e.id)) errors.push(`${where}: id is required`);
    if (essayIds.has(e.id)) errors.push(`${where}: duplicate essay id "${e.id}"`);
    essayIds.add(e.id);
    if (!objectiveIds.has(e.objectiveId)) errors.push(`${where}: unknown objectiveId "${e.objectiveId}"`);
    if (isBlank(e.question)) errors.push(`${where}: question is required`);
    if (isBlank(e.shortAnswer)) errors.push(`${where}: model answer is required`);
    if (isBlank(e.assesses)) errors.push(`${where}: "assesses" is required`);
    if (e.keywords.length === 0 || e.keywords.some(isBlank)) errors.push(`${where}: keywords are required`);
    if (e.expectedConcepts.length === 0 || e.expectedConcepts.some(isBlank))
      errors.push(`${where}: expected concepts are required`);
  });

  if (content.quiz.length !== REQUIRED_MCQ_COUNT)
    errors.push(at(`: quiz has ${content.quiz.length} questions, exactly ${REQUIRED_MCQ_COUNT} are required`));

  const objectivesUsed = new Set<string>();
  let correctIsLongest = 0;
  content.quiz.forEach((q, i) => {
    const where = at(`.quiz[${i}]`);
    if (isBlank(q.id)) errors.push(`${where}: id is required`);
    const owner = seenQuestionIds.get(q.id);
    if (owner) errors.push(`${where}: question id "${q.id}" already used in ${owner}`);
    seenQuestionIds.set(q.id, meta.id);

    if (!objectiveIds.has(q.objectiveId)) errors.push(`${where}: unknown objectiveId "${q.objectiveId}"`);
    objectivesUsed.add(q.objectiveId);

    if (isBlank(q.question)) errors.push(`${where}: question text is required`);
    const key = normalize(q.question);
    const dup = seenQuestionText.get(key);
    if (dup) errors.push(`${where}: duplicate question text (also ${dup})`);
    seenQuestionText.set(key, q.id);

    if (q.options.length !== 4) errors.push(`${where}: must have exactly 4 options, has ${q.options.length}`);
    q.options.forEach((o, j) => {
      if (o.id !== OPTION_IDS[j]) errors.push(`${where}: option ${j} must have id "${OPTION_IDS[j]}"`);
      if (isBlank(o.text)) errors.push(`${where}: option "${o.id}" is empty`);
      if (POSITIONAL_OPTION.test(o.text)) errors.push(`${where}: option "${o.id}" depends on option order`);
    });
    const texts = q.options.map((o) => o.text.trim().toLowerCase().replace(/\s+/g, " "));
    if (new Set(texts).size !== texts.length) errors.push(`${where}: options must be distinct`);

    const matches = q.options.filter((o) => o.id === q.correctOptionId);
    if (matches.length !== 1) errors.push(`${where}: correctOptionId "${q.correctOptionId}" must match exactly one option`);

    if (isBlank(q.explanation) || q.explanation.trim().length < 20)
      errors.push(`${where}: explanation is missing or too short`);

    const lengths = q.options.map((o) => o.text.length);
    const correct = q.options.find((o) => o.id === q.correctOptionId);
    if (correct && correct.text.length === Math.max(...lengths) && lengths.filter((l) => l === correct.text.length).length === 1)
      correctIsLongest++;
  });

  for (const o of objectiveIds)
    if (!objectivesUsed.has(o)) warnings.push(at(`: objective "${o}" has no quiz question`));
  if (content.quiz.length > 0 && correctIsLongest / content.quiz.length > 0.5)
    warnings.push(
      at(`: the correct option is the longest in ${correctIsLongest}/${content.quiz.length} questions, which can give answers away`),
    );
}

export function validateContent(registry: LectureMeta[], modules: LectureContent[]): ValidationReport {
  const report: ValidationReport = { errors: [], warnings: [] };
  const { errors } = report;

  const ids = new Set<string>();
  const slugs = new Set<string>();
  const orders = new Set<number>();
  registry.forEach((m, i) => {
    const where = `registry[${i}]${m.id ? ` (${m.id})` : ""}`;
    for (const field of ["id", "slug", "number", "title", "description"] as const)
      if (isBlank(m[field])) errors.push(`${where}: "${field}" is required`);
    if (!STATUSES.includes(m.status)) errors.push(`${where}: invalid status "${m.status}"`);
    if (ids.has(m.id)) errors.push(`${where}: duplicate lecture id`);
    if (slugs.has(m.slug)) errors.push(`${where}: duplicate slug "${m.slug}"`);
    if (orders.has(m.order)) errors.push(`${where}: duplicate order ${m.order}`);
    if (!/^[a-z0-9-]+$/.test(m.slug)) errors.push(`${where}: slug must be lowercase letters, digits and dashes`);
    ids.add(m.id);
    slugs.add(m.slug);
    orders.add(m.order);
  });

  const moduleIds = new Set<string>();
  for (const mod of modules) {
    if (moduleIds.has(mod.lectureId)) errors.push(`content module "${mod.lectureId}" is registered twice`);
    moduleIds.add(mod.lectureId);
    const meta = registry.find((m) => m.id === mod.lectureId);
    if (!meta) errors.push(`content module "${mod.lectureId}" has no registry entry`);
    else if (meta.status !== "available")
      errors.push(`content module "${mod.lectureId}" exists but the registry marks it "${meta.status}"`);
  }

  const seenQuestionIds = new Map<string, string>();
  const seenQuestionText = new Map<string, string>();
  for (const meta of registry) {
    if (meta.status !== "available") continue;
    const content = modules.find((m) => m.lectureId === meta.id);
    if (!content) {
      errors.push(`${meta.id}: marked "available" but has no content module`);
      continue;
    }
    validateLectureContent(meta, content, seenQuestionIds, seenQuestionText, report);
  }

  const strings: [string, string][] = [];
  collectStrings(registry, "registry", strings);
  collectStrings(modules, "content", strings);
  for (const [path, s] of strings)
    if (BANNED_DASH.test(s)) errors.push(`${path}: contains an em or en dash; use a comma, colon or hyphen`);

  return report;
}
