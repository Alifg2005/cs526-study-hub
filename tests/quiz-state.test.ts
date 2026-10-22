import { describe, expect, it } from "vitest";
import { createQuizState, quizReducer, type QuizAction, type QuizState } from "../src/lib/quiz-state";
import { seededShuffle } from "../src/lib/shuffle";

const run = (actions: QuizAction[], count = 20): QuizState =>
  actions.reduce((s, a) => quizReducer(s, a, count), createQuizState(1));

describe("quizReducer", () => {
  it("keeps answers while navigating between questions", () => {
    const state = run([
      { type: "select", questionId: "q1", optionId: "b" },
      { type: "next" },
      { type: "select", questionId: "q2", optionId: "c" },
      { type: "previous" },
    ]);
    expect(state.index).toBe(0);
    expect(state.answers).toEqual({ q1: "b", q2: "c" });
  });

  it("lets the student change an answer before submitting", () => {
    const state = run([
      { type: "select", questionId: "q1", optionId: "b" },
      { type: "select", questionId: "q1", optionId: "d" },
    ]);
    expect(state.answers.q1).toBe("d");
  });

  it("clamps navigation to the question range", () => {
    expect(run([{ type: "previous" }]).index).toBe(0);
    expect(run([{ type: "goTo", index: 99 }]).index).toBe(19);
    expect(run([{ type: "goTo", index: 19 }, { type: "next" }]).index).toBe(19);
  });

  it("locks answers after submission", () => {
    const state = run([
      { type: "select", questionId: "q1", optionId: "a" },
      { type: "submit" },
      { type: "select", questionId: "q1", optionId: "b" },
    ]);
    expect(state.submitted).toBe(true);
    expect(state.answers.q1).toBe("a");
  });

  it("resets everything on retake with a new seed", () => {
    const state = run([
      { type: "select", questionId: "q1", optionId: "a" },
      { type: "goTo", index: 5 },
      { type: "submit" },
      { type: "retake", seed: 42 },
    ]);
    expect(state).toEqual({ index: 0, answers: {}, submitted: false, seed: 42 });
  });
});

describe("seededShuffle", () => {
  const items = ["a", "b", "c", "d"];

  it("is deterministic for the same seed and salt", () => {
    expect(seededShuffle(items, 7, "q1")).toEqual(seededShuffle(items, 7, "q1"));
  });

  it("keeps every item exactly once", () => {
    expect([...seededShuffle(items, 123, "x")].sort()).toEqual(items);
  });

  it("does not mutate the input", () => {
    const copy = [...items];
    seededShuffle(copy, 5);
    expect(copy).toEqual(items);
  });

  it("varies the order across salts", () => {
    const orders = new Set(Array.from({ length: 20 }, (_, i) => seededShuffle(items, 9, `q${i}`).join("")));
    expect(orders.size).toBeGreaterThan(1);
  });
});
