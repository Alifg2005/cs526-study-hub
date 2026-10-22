import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { QuizRunner } from "../src/components/quiz/QuizRunner";
import { progressStore } from "../src/lib/progress";
import { makeMeta, makeQuestion } from "./fixtures";

const meta = makeMeta();
const questions = Array.from({ length: 20 }, (_, i) => makeQuestion(i + 1));

function setup() {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <QuizRunner meta={meta} questions={questions} seed={12345} />
    </MemoryRouter>,
  );
  return user;
}

const questionText = (n: number) => `Fixture question number ${n} about topic ${n}?`;

describe("QuizRunner", () => {
  it("shows one question at a time with four options and no answers revealed", () => {
    setup();
    expect(screen.getByText("Question 1")).toBeInTheDocument();
    expect(screen.getByText(questionText(1))).toBeInTheDocument();
    expect(screen.queryByText(questionText(2))).not.toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(4);
    expect(screen.queryByText(/correct answer/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Explanation for fixture/)).not.toBeInTheDocument();
  });

  it("keeps answers when moving between questions", async () => {
    const user = setup();
    await user.click(screen.getByLabelText("Wrong answer 1 two"));
    await user.click(screen.getByRole("button", { name: /^next$/i }));
    expect(screen.getByText(questionText(2))).toBeInTheDocument();
    await user.click(screen.getByLabelText("Right answer 2"));
    await user.click(screen.getByRole("button", { name: /previous/i }));
    expect(screen.getByLabelText("Wrong answer 1 two")).toBeChecked();
    expect(screen.getByText("2 answered")).toBeInTheDocument();
  });

  it("jumps to any question from the overview and marks answered ones", async () => {
    const user = setup();
    await user.click(screen.getByLabelText("Right answer 1"));
    expect(screen.getByRole("button", { name: "Question 1, answered" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Question 7, unanswered" }));
    expect(screen.getByText(questionText(7))).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Question 7, unanswered" })).toHaveAttribute("aria-current", "step");
  });

  it("asks for confirmation when questions are unanswered", async () => {
    const user = setup();
    await user.click(screen.getByLabelText("Right answer 1"));
    await user.click(screen.getAllByRole("button", { name: /submit quiz/i })[0]!);
    const dialog = screen.getByRole("alertdialog");
    expect(within(dialog).getByText("19 questions are unanswered")).toBeInTheDocument();

    await user.click(within(dialog).getByRole("button", { name: /first unanswered/i }));
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    expect(screen.getByText(questionText(2))).toBeInTheDocument();
  });

  it("scores a partial submission and shows each answer with its explanation", async () => {
    const user = setup();
    await user.click(screen.getByLabelText("Right answer 1"));
    await user.click(screen.getByRole("button", { name: /^next$/i }));
    await user.click(screen.getByLabelText("Wrong answer 2 one"));
    await user.click(screen.getAllByRole("button", { name: /submit quiz/i })[0]!);
    await user.click(screen.getByRole("button", { name: /submit anyway/i }));

    expect(screen.getByRole("heading", { name: "Your score" })).toBeInTheDocument();
    expect(screen.getByText("5%")).toBeInTheDocument();
    const counts = screen.getAllByRole("definition");
    expect(counts.slice(0, 3).map((c) => c.textContent)).toEqual(["1", "1", "18"]);
    expect(screen.getByText("Explanation for fixture question 2, long enough to pass.")).toBeInTheDocument();
    expect(screen.getAllByText("Not answered")).toHaveLength(18);

    await user.click(screen.getByRole("button", { name: /incorrect/i }));
    expect(screen.getAllByRole("listitem").filter((li) => li.textContent?.includes("Fixture question"))).toHaveLength(1);
    expect(progressStore.getSnapshot()[meta.id]).toMatchObject({ bestScore: 1, lastScore: 1, attempts: 1 });
  });

  it("submits a complete quiz directly and allows a retake", async () => {
    const user = setup();
    for (let i = 1; i <= 20; i++) {
      await user.click(screen.getByLabelText(`Right answer ${i}`));
      if (i < 20) await user.click(screen.getByRole("button", { name: /^next$/i }));
    }
    await user.click(screen.getAllByRole("button", { name: /submit quiz/i })[0]!);
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    expect(screen.getByText("100%")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /retake quiz/i }));
    expect(screen.getByText("Question 1")).toBeInTheDocument();
    expect(screen.getByText("0 answered")).toBeInTheDocument();
    expect(screen.getAllByRole("radio").every((r) => !(r as HTMLInputElement).checked)).toBe(true);
  });
});
