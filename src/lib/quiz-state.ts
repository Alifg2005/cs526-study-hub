import type { OptionId } from "../types/content";
import type { AnswerMap } from "./scoring";

/** Quiz session state, kept separate from UI so it can be tested directly. */
export interface QuizState {
  index: number;
  answers: AnswerMap;
  submitted: boolean;
  /** Seed for option order; changes on every retake. */
  seed: number;
}

export type QuizAction =
  | { type: "select"; questionId: string; optionId: OptionId }
  | { type: "goTo"; index: number }
  | { type: "next" }
  | { type: "previous" }
  | { type: "submit" }
  | { type: "retake"; seed: number };

export function createQuizState(seed: number): QuizState {
  return { index: 0, answers: {}, submitted: false, seed };
}

export function quizReducer(state: QuizState, action: QuizAction, questionCount: number): QuizState {
  const clamp = (i: number) => Math.min(Math.max(i, 0), Math.max(questionCount - 1, 0));
  switch (action.type) {
    case "select":
      if (state.submitted) return state;
      return { ...state, answers: { ...state.answers, [action.questionId]: action.optionId } };
    case "goTo":
      return { ...state, index: clamp(action.index) };
    case "next":
      return { ...state, index: clamp(state.index + 1) };
    case "previous":
      return { ...state, index: clamp(state.index - 1) };
    case "submit":
      return { ...state, submitted: true };
    case "retake":
      return createQuizState(action.seed);
  }
}
