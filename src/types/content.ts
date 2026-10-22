/**
 * Content schema for the CS526 Study Hub.
 *
 * The lecture registry (src/content/registry.ts) owns metadata and availability.
 * Each available lecture has one content module in src/content/lectures/ that
 * satisfies `LectureContent`. Pages and components only read these types.
 */

export type LectureStatus = "available" | "coming-soon";

export interface LectureMeta {
  /** Stable identifier, e.g. "lecture-07-part-1". Never rename once published. */
  id: string;
  /** URL segment, e.g. "07-part-1". */
  slug: string;
  /** Display label for the lecture number, e.g. "7.1". */
  number: string;
  /** Sort position in the course sequence. */
  order: number;
  title: string;
  /** Optional qualifier such as "Part 1". */
  part?: string;
  /** One or two sentences describing what the lecture covers (source-grounded). */
  description: string;
  status: LectureStatus;
  /** True when the lecture is in the announced midterm scope. */
  inMidtermScope: boolean;
}

export interface LearningObjective {
  id: string;
  text: string;
}

export interface KeyTerm {
  term: string;
  definition: string;
}

/**
 * Callout tones:
 * - "exam": an exam-focused tip grounded in the lecture.
 * - "note": a clarification of lecture content.
 * - "supplement": explanation that goes beyond what the slides state.
 *   Always use this tone for supplementary material so readers can tell it apart.
 */
export type CalloutTone = "exam" | "note" | "supplement";

export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "steps"; items: { title: string; detail: string }[] }
  | { type: "table"; caption?: string; columns: string[]; rows: string[][] }
  | { type: "callout"; tone: CalloutTone; title?: string; text: string }
  | { type: "code"; language: "java" | "xml" | "text"; code: string; caption?: string }
  | { type: "terms"; items: KeyTerm[] };

export interface ReviewSection {
  id: string;
  title: string;
  blocks: ContentBlock[];
}

export type EssayKind =
  | "definition"
  | "explanation"
  | "comparison"
  | "process"
  | "architecture"
  | "lifecycle"
  | "application";

export interface EssayQuestion {
  id: string;
  kind: EssayKind;
  objectiveId: string;
  question: string;
  /** Concise, exam-ready answer. */
  shortAnswer: string;
  /** Optional longer explanation for deeper revision. */
  detailedAnswer?: string;
  keywords: string[];
  expectedConcepts: string[];
  /** What the question is testing. */
  assesses: string;
}

export type OptionId = "a" | "b" | "c" | "d";

export interface AnswerOption {
  id: OptionId;
  text: string;
}

export type QuestionKind =
  | "terminology"
  | "concept"
  | "distinction"
  | "application"
  | "comparison"
  | "scenario"
  | "code";

export interface MultipleChoiceQuestion {
  /** Stable identifier, e.g. "l05-q07". */
  id: string;
  objectiveId: string;
  kind: QuestionKind;
  question: string;
  /** Optional short code snippet shown with the question. */
  code?: string;
  options: [AnswerOption, AnswerOption, AnswerOption, AnswerOption];
  correctOptionId: OptionId;
  explanation: string;
}

export interface LectureContent {
  lectureId: string;
  overview: string[];
  objectives: LearningObjective[];
  keyTerms: KeyTerm[];
  sections: ReviewSection[];
  takeaways: string[];
  essays: EssayQuestion[];
  checklist: string[];
  quiz: MultipleChoiceQuestion[];
}

export interface Lecture {
  meta: LectureMeta;
  content: LectureContent | null;
}
