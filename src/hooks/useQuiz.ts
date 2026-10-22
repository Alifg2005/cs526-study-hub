import { useCallback, useMemo, useReducer } from "react";
import type { AnswerOption, MultipleChoiceQuestion, OptionId } from "../types/content";
import { createQuizState, quizReducer, type QuizAction, type QuizState } from "../lib/quiz-state";
import { countAnswered, scoreQuiz } from "../lib/scoring";
import { newSeed, seededShuffle } from "../lib/shuffle";

/**
 * Drives one quiz session. Option order is shuffled per attempt so position
 * never hints at the answer; stable option ids keep scoring independent of order.
 */
export function useQuiz(questions: MultipleChoiceQuestion[], initialSeed: number = newSeed()) {
  const reducer = useCallback(
    (state: QuizState, action: QuizAction) => quizReducer(state, action, questions.length),
    [questions.length],
  );
  const [state, dispatch] = useReducer(reducer, initialSeed, createQuizState);

  const optionOrder = useMemo(() => {
    const order: Record<string, AnswerOption[]> = {};
    for (const q of questions) order[q.id] = seededShuffle(q.options, state.seed, q.id);
    return order;
  }, [questions, state.seed]);

  const score = useMemo(
    () => (state.submitted ? scoreQuiz(questions, state.answers) : null),
    [questions, state.answers, state.submitted],
  );

  return {
    state,
    current: questions[state.index],
    optionOrder,
    answeredCount: countAnswered(questions, state.answers),
    score,
    select: (questionId: string, optionId: OptionId) => dispatch({ type: "select", questionId, optionId }),
    goTo: (index: number) => dispatch({ type: "goTo", index }),
    next: () => dispatch({ type: "next" }),
    previous: () => dispatch({ type: "previous" }),
    submit: () => dispatch({ type: "submit" }),
    retake: () => dispatch({ type: "retake", seed: newSeed() }),
  };
}
