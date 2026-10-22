import { describe, expect, it } from "vitest";
import { lectureContentModules } from "../src/content/lectures";
import { lectureRegistry } from "../src/content/registry";
import { REQUIRED_MCQ_COUNT } from "../src/lib/constants";
import { buildCatalog, isReady, lectures } from "../src/lib/lectures";
import { validateContent } from "../src/lib/validate-content";
import { makeContent, makeMeta, makeQuestion } from "./fixtures";

describe("real lecture content", () => {
  it("passes validation with no errors", () => {
    const report = validateContent(lectureRegistry, lectureContentModules);
    expect(report.errors).toEqual([]);
  });

  it("registers the eight announced midterm modules in order", () => {
    expect(lectures.map((l) => l.meta.id)).toEqual([
      "lecture-01",
      "lecture-02",
      "lecture-03",
      "lecture-04",
      "lecture-05",
      "lecture-06",
      "lecture-07-part-1",
      "lecture-07-part-2",
    ]);
    expect(lectures.every((l) => l.meta.inMidtermScope)).toBe(true);
  });

  it.each(lectures.filter(isReady).map((l) => [l.meta.id, l] as const))(
    "%s has exactly 20 well-formed questions",
    (_, lecture) => {
      const quiz = lecture.content!.quiz;
      expect(quiz).toHaveLength(REQUIRED_MCQ_COUNT);
      for (const q of quiz) {
        expect(q.options).toHaveLength(4);
        expect(q.options.filter((o) => o.id === q.correctOptionId)).toHaveLength(1);
        expect(q.explanation.length).toBeGreaterThan(20);
      }
    },
  );
});

describe("catalog availability", () => {
  it("never attaches content to a coming-soon lecture", () => {
    const meta = makeMeta({ status: "coming-soon" });
    const [lecture] = buildCatalog([meta], [makeContent()]);
    expect(lecture!.content).toBeNull();
    expect(isReady(lecture!)).toBe(false);
  });

  it("sorts by order", () => {
    const catalog = buildCatalog(
      [makeMeta({ id: "b", slug: "b", order: 2 }), makeMeta({ id: "a", slug: "a", order: 1 })],
      [],
    );
    expect(catalog.map((l) => l.meta.id)).toEqual(["a", "b"]);
  });
});

describe("validateContent", () => {
  const valid = () => ({ registry: [makeMeta()], modules: [makeContent()] });

  it("accepts a well-formed fixture", () => {
    const { registry, modules } = valid();
    expect(validateContent(registry, modules).errors).toEqual([]);
  });

  it("fails when an available lecture has fewer than 20 questions", () => {
    const content = makeContent();
    content.quiz = content.quiz.slice(0, 19);
    const { errors } = validateContent([makeMeta()], [content]);
    expect(errors.some((e) => e.includes("exactly 20"))).toBe(true);
  });

  it("fails when a correct answer does not match an option", () => {
    const content = makeContent();
    content.quiz[0] = makeQuestion(1, { correctOptionId: "e" as never });
    expect(validateContent([makeMeta()], [content]).errors.some((e) => e.includes("correctOptionId"))).toBe(true);
  });

  it("fails on missing explanations, duplicate ids and duplicate question text", () => {
    const content = makeContent();
    content.quiz[1] = makeQuestion(2, { explanation: "" });
    content.quiz[2] = makeQuestion(3, { id: content.quiz[0]!.id });
    content.quiz[3] = makeQuestion(4, { question: content.quiz[4]!.question });
    const { errors } = validateContent([makeMeta()], [content]);
    expect(errors.some((e) => e.includes("explanation"))).toBe(true);
    expect(errors.some((e) => e.includes("already used"))).toBe(true);
    expect(errors.some((e) => e.includes("duplicate question text"))).toBe(true);
  });

  it("fails on unknown objective references", () => {
    const content = makeContent();
    content.quiz[0] = makeQuestion(1, { objectiveId: "nope" });
    expect(validateContent([makeMeta()], [content]).errors.some((e) => e.includes("unknown objectiveId"))).toBe(true);
  });

  it("fails on order-dependent options such as 'All of the above'", () => {
    const content = makeContent();
    const q = makeQuestion(1);
    q.options[3] = { id: "d", text: "All of the above" };
    content.quiz[0] = q;
    expect(validateContent([makeMeta()], [content]).errors.some((e) => e.includes("option order"))).toBe(true);
  });

  it("fails when an available lecture has no content module", () => {
    expect(validateContent([makeMeta()], []).errors.some((e) => e.includes("no content module"))).toBe(true);
  });

  it("fails when content exists for a lecture marked coming soon", () => {
    const { errors } = validateContent([makeMeta({ status: "coming-soon" })], [makeContent()]);
    expect(errors.some((e) => e.includes("coming-soon"))).toBe(true);
  });

  it("accepts a coming-soon lecture without content", () => {
    expect(validateContent([makeMeta({ status: "coming-soon" })], []).errors).toEqual([]);
  });

  it("fails on duplicate lecture ids and slugs", () => {
    const { errors } = validateContent([makeMeta(), makeMeta({ order: 2 })], [makeContent()]);
    expect(errors.some((e) => e.includes("duplicate lecture id"))).toBe(true);
    expect(errors.some((e) => e.includes("duplicate slug"))).toBe(true);
  });

  it("fails on em dashes in content", () => {
    const content = makeContent({ takeaways: ["One — two", "T2", "T3"] });
    expect(validateContent([makeMeta()], [content]).errors.some((e) => e.includes("dash"))).toBe(true);
  });

  it("fails on malformed table rows", () => {
    const content = makeContent();
    content.sections[0]!.blocks.push({ type: "table", columns: ["A", "B"], rows: [["only one"]] });
    expect(validateContent([makeMeta()], [content]).errors.some((e) => e.includes("table row"))).toBe(true);
  });

  it("requires essay model answers", () => {
    const content = makeContent();
    content.essays[0] = { ...content.essays[0]!, shortAnswer: " " };
    expect(validateContent([makeMeta()], [content]).errors.some((e) => e.includes("model answer"))).toBe(true);
  });
});
