import type { AnswerOption } from "../types/content";

/** Builds the four answer options with stable ids a, b, c, d. */
export function options(
  a: string,
  b: string,
  c: string,
  d: string,
): [AnswerOption, AnswerOption, AnswerOption, AnswerOption] {
  return [
    { id: "a", text: a },
    { id: "b", text: b },
    { id: "c", text: c },
    { id: "d", text: d },
  ];
}
