import type { MultipleChoiceQuestion, OptionId } from "../types/content";

/** Selected option per question id. Missing keys mean unanswered. */
export type AnswerMap = Partial<Record<string, OptionId>>;

export type QuestionOutcome = "correct" | "incorrect" | "unanswered";

export interface QuestionResult {
  questionId: string;
  selected: OptionId | null;
  correct: OptionId;
  outcome: QuestionOutcome;
}

export interface QuizScore {
  total: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  /** Whole-number percentage, 0 to 100. */
  percentage: number;
  results: QuestionResult[];
}

/** One point per correct answer; incorrect and unanswered questions score zero. */
export function scoreQuiz(questions: MultipleChoiceQuestion[], answers: AnswerMap): QuizScore {
  const results = questions.map<QuestionResult>((q) => {
    const selected = answers[q.id] ?? null;
    const outcome: QuestionOutcome =
      selected === null ? "unanswered" : selected === q.correctOptionId ? "correct" : "incorrect";
    return { questionId: q.id, selected, correct: q.correctOptionId, outcome };
  });

  const count = (o: QuestionOutcome) => results.filter((r) => r.outcome === o).length;
  const correct = count("correct");
  const total = questions.length;

  return {
    total,
    correct,
    incorrect: count("incorrect"),
    unanswered: count("unanswered"),
    percentage: total === 0 ? 0 : Math.round((correct / total) * 100),
    results,
  };
}

export function countAnswered(questions: MultipleChoiceQuestion[], answers: AnswerMap): number {
  return questions.filter((q) => answers[q.id] !== undefined).length;
}

export function performanceMessage(percentage: number): string {
  if (percentage >= 90) return "Excellent. You have this lecture well under control.";
  if (percentage >= 75) return "Strong result. Review the few you missed and you are ready.";
  if (percentage >= 50) return "A fair start. Revisit the review notes for the topics you missed.";
  return "Worth another pass. Read the review page, then try again.";
}
