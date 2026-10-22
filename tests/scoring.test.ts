import { describe, expect, it } from "vitest";
import { countAnswered, performanceMessage, scoreQuiz } from "../src/lib/scoring";
import { makeQuestion } from "./fixtures";

const questions = Array.from({ length: 20 }, (_, i) => makeQuestion(i + 1));

describe("scoreQuiz", () => {
  it("awards one point per correct answer, out of 20", () => {
    const answers = Object.fromEntries(questions.map((q) => [q.id, "a" as const]));
    const score = scoreQuiz(questions, answers);
    expect(score).toMatchObject({ total: 20, correct: 20, incorrect: 0, unanswered: 0, percentage: 100 });
  });

  it("separates correct, incorrect and unanswered questions", () => {
    const answers = {
      [questions[0]!.id]: "a" as const,
      [questions[1]!.id]: "b" as const,
      [questions[2]!.id]: "a" as const,
      [questions[3]!.id]: "d" as const,
    };
    const score = scoreQuiz(questions, answers);
    expect(score.correct).toBe(2);
    expect(score.incorrect).toBe(2);
    expect(score.unanswered).toBe(16);
    expect(score.percentage).toBe(10);
    expect(score.results[0]).toEqual({ questionId: questions[0]!.id, selected: "a", correct: "a", outcome: "correct" });
    expect(score.results[1]!.outcome).toBe("incorrect");
    expect(score.results[19]).toMatchObject({ selected: null, outcome: "unanswered" });
  });

  it("gives unanswered questions zero points", () => {
    expect(scoreQuiz(questions, {})).toMatchObject({ correct: 0, unanswered: 20, percentage: 0 });
  });

  it("rounds the percentage to a whole number", () => {
    const three = questions.slice(0, 3);
    expect(scoreQuiz(three, { [three[0]!.id]: "a" }).percentage).toBe(33);
  });

  it("handles an empty quiz without dividing by zero", () => {
    expect(scoreQuiz([], {}).percentage).toBe(0);
  });

  it("counts answered questions", () => {
    expect(countAnswered(questions, { [questions[5]!.id]: "c" })).toBe(1);
  });
});

describe("performanceMessage", () => {
  it("returns a different message per band", () => {
    const messages = new Set([95, 80, 60, 20].map(performanceMessage));
    expect(messages.size).toBe(4);
  });
});
