import type { LectureContent, LectureMeta, MultipleChoiceQuestion } from "../src/types/content";
import { options } from "../src/content/helpers";

export function makeQuestion(n: number, overrides: Partial<MultipleChoiceQuestion> = {}): MultipleChoiceQuestion {
  return {
    id: `fx-q${String(n).padStart(2, "0")}`,
    objectiveId: "fx-o1",
    kind: "concept",
    question: `Fixture question number ${n} about topic ${n}?`,
    options: options(`Right answer ${n}`, `Wrong answer ${n} one`, `Wrong answer ${n} two`, `Wrong answer ${n} three`),
    correctOptionId: "a",
    explanation: `Explanation for fixture question ${n}, long enough to pass.`,
    ...overrides,
  };
}

export function makeMeta(overrides: Partial<LectureMeta> = {}): LectureMeta {
  return {
    id: "fx-lecture",
    slug: "fx",
    number: "9",
    order: 1,
    title: "Fixture Lecture",
    description: "A fixture lecture used by tests.",
    status: "available",
    ...overrides,
  };
}

export function makeContent(overrides: Partial<LectureContent> = {}): LectureContent {
  return {
    lectureId: "fx-lecture",
    overview: ["Overview paragraph."],
    objectives: [
      { id: "fx-o1", text: "Objective one" },
      { id: "fx-o2", text: "Objective two" },
    ],
    keyTerms: [
      { term: "A", definition: "Definition A" },
      { term: "B", definition: "Definition B" },
      { term: "C", definition: "Definition C" },
    ],
    sections: [
      { id: "s1", title: "Section one", blocks: [{ type: "paragraph", text: "Text." }] },
      { id: "s2", title: "Section two", blocks: [{ type: "list", items: ["One", "Two"] }] },
    ],
    takeaways: ["T1", "T2", "T3"],
    essays: [1, 2, 3].map((n) => ({
      id: `fx-e${n}`,
      kind: "definition" as const,
      objectiveId: "fx-o2",
      question: `Essay ${n}?`,
      shortAnswer: `Answer ${n}.`,
      keywords: ["k"],
      expectedConcepts: ["c"],
      assesses: "Recall.",
    })),
    checklist: ["C1", "C2", "C3"],
    quiz: Array.from({ length: 20 }, (_, i) => makeQuestion(i + 1)),
    ...overrides,
  };
}
