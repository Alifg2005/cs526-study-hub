import { useEffect, useRef, useState } from "react";
import { AlertTriangle, ArrowLeft, ArrowRight, Send } from "lucide-react";
import type { LectureMeta, MultipleChoiceQuestion } from "../../types/content";
import { useQuiz } from "../../hooks/useQuiz";
import { progressStore } from "../../lib/progress";
import { cn } from "../../lib/cn";
import { Button } from "../ui/Button";
import { ProgressBar } from "../ui/ProgressBar";
import { QuizResults } from "./QuizResults";

const LETTERS = ["A", "B", "C", "D"] as const;

interface QuizRunnerProps {
  meta: LectureMeta;
  questions: MultipleChoiceQuestion[];
  /** Fixed option-order seed, for tests. */
  seed?: number;
}

export function QuizRunner({ meta, questions, seed }: QuizRunnerProps) {
  const quiz = useQuiz(questions, seed);
  const { state, current, optionOrder, answeredCount } = quiz;
  const [confirming, setConfirming] = useState(false);
  const questionRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLDivElement>(null);
  const hasNavigated = useRef(false);

  const total = questions.length;
  const unanswered = total - answeredCount;
  const isLast = state.index === total - 1;

  useEffect(() => {
    if (hasNavigated.current) questionRef.current?.focus();
  }, [state.index]);

  useEffect(() => {
    if (confirming) confirmRef.current?.focus();
  }, [confirming]);

  const navigate = (fn: () => void) => {
    hasNavigated.current = true;
    setConfirming(false);
    fn();
  };

  const finalize = () => {
    const correct = questions.filter((q) => state.answers[q.id] === q.correctOptionId).length;
    progressStore.recordQuiz(meta.id, correct);
    setConfirming(false);
    quiz.submit();
    window.scrollTo({ top: 0 });
  };

  const requestSubmit = () => {
    if (unanswered > 0) setConfirming(true);
    else finalize();
  };

  if (state.submitted && quiz.score) {
    return (
      <QuizResults
        meta={meta}
        questions={questions}
        score={quiz.score}
        onRetake={() => {
          hasNavigated.current = false;
          quiz.retake();
          window.scrollTo({ top: 0 });
        }}
      />
    );
  }

  if (!current) return null;
  const selected = state.answers[current.id];

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-12">
      <div className="min-w-0">
        <div className="flex items-baseline justify-between gap-3 text-sm">
          <p className="font-semibold">
            Question {state.index + 1} <span className="font-normal text-ink-muted">of {total}</span>
          </p>
          <p className="text-ink-muted" aria-live="polite">
            {answeredCount} answered
          </p>
        </div>
        <ProgressBar className="mt-3" value={answeredCount} max={total} label="Questions answered" />

        <div
          key={current.id}
          ref={questionRef}
          tabIndex={-1}
          className="animate-rise mt-6 rounded-2xl border border-line bg-surface p-5 shadow-card outline-none sm:p-7"
        >
          <fieldset>
            <legend className="font-display text-xl font-semibold leading-snug sm:text-2xl">{current.question}</legend>
            {current.code && (
              <pre className="mt-4 overflow-x-auto rounded-xl border border-line bg-surface-2 p-4 font-mono text-sm">
                <code>{current.code}</code>
              </pre>
            )}
            <div className="mt-6 grid grid-cols-1 gap-3">
              {(optionOrder[current.id] ?? current.options).map((option, i) => {
                const id = `${current.id}-${option.id}`;
                return (
                  <label
                    key={option.id}
                    htmlFor={id}
                    className={cn(
                      "flex min-h-14 cursor-pointer items-start gap-3.5 rounded-xl border px-4 py-3.5 transition-colors",
                      "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent",
                      selected === option.id
                        ? "border-accent bg-accent-soft/60"
                        : "border-line bg-surface hover:border-line-strong hover:bg-surface-2/60",
                    )}
                  >
                    <input
                      id={id}
                      type="radio"
                      name={current.id}
                      value={option.id}
                      aria-labelledby={`${id}-text`}
                      checked={selected === option.id}
                      onChange={() => quiz.select(current.id, option.id)}
                      className="sr-only"
                    />
                    <span
                      aria-hidden
                      className={cn(
                        "grid size-7 shrink-0 place-items-center rounded-full border font-mono text-xs font-semibold",
                        selected === option.id
                          ? "border-accent bg-accent text-accent-contrast"
                          : "border-line-strong text-ink-muted",
                      )}
                    >
                      {LETTERS[i]}
                    </span>
                    <span id={`${id}-text`} className="pt-0.5 leading-relaxed">
                      {option.text}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <Button variant="secondary" onClick={() => navigate(quiz.previous)} disabled={state.index === 0}>
            <ArrowLeft aria-hidden size={18} strokeWidth={1.75} />
            Previous
          </Button>
          {isLast ? (
            <Button onClick={requestSubmit}>
              <Send aria-hidden size={18} strokeWidth={1.75} />
              Submit quiz
            </Button>
          ) : (
            <Button onClick={() => navigate(quiz.next)}>
              Next
              <ArrowRight aria-hidden size={18} strokeWidth={1.75} />
            </Button>
          )}
        </div>

        {confirming && (
          <div
            ref={confirmRef}
            role="alertdialog"
            aria-labelledby="confirm-title"
            aria-describedby="confirm-desc"
            tabIndex={-1}
            className="animate-rise mt-6 rounded-2xl border border-warning/50 bg-warning-soft/60 p-5 outline-none"
          >
            <p id="confirm-title" className="flex items-center gap-2 font-semibold">
              <AlertTriangle aria-hidden size={18} strokeWidth={1.75} className="text-warning" />
              {unanswered === 1 ? "1 question is unanswered" : `${unanswered} questions are unanswered`}
            </p>
            <p id="confirm-desc" className="mt-1.5 text-ink-muted">
              Unanswered questions score zero. Submit now, or go back to finish them.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={finalize}>Submit anyway</Button>
              <Button
                variant="secondary"
                onClick={() => navigate(() => quiz.goTo(questions.findIndex((q) => state.answers[q.id] === undefined)))}
              >
                Go to first unanswered
              </Button>
            </div>
          </div>
        )}
      </div>

      <aside aria-label="Question overview" className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl border border-line bg-surface p-5">
          <p className="font-semibold">Overview</p>
          <p className="mt-1 text-sm text-ink-muted">Jump to any question. Answers are kept as you move.</p>
          <ol className="mt-4 grid grid-cols-5 gap-2">
            {questions.map((q, i) => {
              const answered = state.answers[q.id] !== undefined;
              const isCurrent = i === state.index;
              return (
                <li key={q.id}>
                  <button
                    type="button"
                    onClick={() => navigate(() => quiz.goTo(i))}
                    aria-label={`Question ${i + 1}, ${answered ? "answered" : "unanswered"}`}
                    aria-current={isCurrent ? "step" : undefined}
                    className={cn(
                      "grid aspect-square w-full min-w-10 place-items-center rounded-full border font-mono text-sm font-semibold transition-colors",
                      answered ? "border-accent bg-accent-soft text-accent-text" : "border-line text-ink-muted hover:border-line-strong",
                      isCurrent && "ring-2 ring-accent ring-offset-2 ring-offset-surface",
                    )}
                  >
                    {i + 1}
                  </button>
                </li>
              );
            })}
          </ol>
          <div className="mt-4 flex items-center gap-4 text-xs text-ink-muted">
            <span className="flex items-center gap-1.5">
              <span aria-hidden className="size-3 rounded-full border border-accent bg-accent-soft" /> Answered
            </span>
            <span className="flex items-center gap-1.5">
              <span aria-hidden className="size-3 rounded-full border border-line" /> Unanswered
            </span>
          </div>
          <Button className="mt-5 w-full" variant={isLast ? "secondary" : "primary"} onClick={requestSubmit}>
            Submit quiz
          </Button>
        </div>
      </aside>
    </div>
  );
}
