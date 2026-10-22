import { useState } from "react";
import { BookOpenText, Check, Minus, RotateCcw, X } from "lucide-react";
import type { LectureMeta, MultipleChoiceQuestion } from "../../types/content";
import { performanceMessage, type QuestionOutcome, type QuizScore } from "../../lib/scoring";
import { cn } from "../../lib/cn";
import { Button, ButtonLink } from "../ui/Button";

type Filter = "all" | QuestionOutcome;

const outcomeStyle: Record<QuestionOutcome, { label: string; className: string; Icon: typeof Check }> = {
  correct: { label: "Correct", className: "bg-success-soft text-success", Icon: Check },
  incorrect: { label: "Incorrect", className: "bg-danger-soft text-danger", Icon: X },
  unanswered: { label: "Unanswered", className: "bg-warning-soft text-warning", Icon: Minus },
};

interface QuizResultsProps {
  meta: LectureMeta;
  questions: MultipleChoiceQuestion[];
  score: QuizScore;
  onRetake: () => void;
}

export function QuizResults({ meta, questions, score, onRetake }: QuizResultsProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const filters: { id: Filter; label: string; count: number }[] = [
    { id: "all", label: "All", count: score.total },
    { id: "correct", label: "Correct", count: score.correct },
    { id: "incorrect", label: "Incorrect", count: score.incorrect },
    { id: "unanswered", label: "Unanswered", count: score.unanswered },
  ];

  const rows = questions
    .map((q, i) => ({ q, i, result: score.results[i]! }))
    .filter(({ result }) => filter === "all" || result.outcome === filter);

  return (
    <div>
      <section
        aria-labelledby="results-heading"
        className="animate-rise grid gap-8 rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-8 md:grid-cols-[auto_1fr] md:items-center md:gap-12"
      >
        <div>
          <h2 id="results-heading" className="text-sm font-semibold text-ink-muted">
            Your score
          </h2>
          <p className="mt-1 font-display text-6xl font-semibold tracking-tight tabular-nums">
            {score.correct}
            <span className="text-3xl text-ink-muted">/{score.total}</span>
          </p>
          <p className="mt-1 font-mono text-lg font-semibold text-accent-text">{score.percentage}%</p>
        </div>
        <div>
          <p className="text-lg font-medium leading-relaxed">{performanceMessage(score.percentage)}</p>
          <dl className="mt-5 grid grid-cols-3 gap-3 text-center">
            {(["correct", "incorrect", "unanswered"] as const).map((o) => (
              <div key={o} className={cn("rounded-xl px-3 py-3", outcomeStyle[o].className)}>
                <dt className="text-xs font-semibold">{outcomeStyle[o].label}</dt>
                <dd className="font-mono text-2xl font-semibold tabular-nums">{score[o]}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={onRetake}>
              <RotateCcw aria-hidden size={18} strokeWidth={1.75} />
              Retake quiz
            </Button>
            <ButtonLink to={`/lectures/${meta.slug}`} variant="secondary">
              <BookOpenText aria-hidden size={18} strokeWidth={1.75} />
              Back to review
            </ButtonLink>
          </div>
        </div>
      </section>

      <section aria-labelledby="answers-heading" className="mt-12">
        <h2 id="answers-heading" className="text-2xl font-semibold">
          Answers and explanations
        </h2>
        <div role="group" aria-label="Filter answers" className="mt-4 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "min-h-10 rounded-full border px-4 text-sm font-semibold transition-colors",
                filter === f.id ? "border-ink bg-ink text-bg" : "border-line text-ink-muted hover:text-ink",
              )}
            >
              {f.label} <span className="font-mono">{f.count}</span>
            </button>
          ))}
        </div>

        {rows.length === 0 ? (
          <p className="mt-6 rounded-2xl border border-dashed border-line-strong p-6 text-center text-ink-muted">
            No questions in this group.
          </p>
        ) : (
          <ol className="mt-6 grid grid-cols-1 gap-4">
            {rows.map(({ q, i, result }) => {
              const style = outcomeStyle[result.outcome];
              const selectedText = q.options.find((o) => o.id === result.selected)?.text;
              const correctText = q.options.find((o) => o.id === result.correct)?.text;
              return (
                <li key={q.id} className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm font-semibold text-ink-muted">Q{i + 1}</span>
                    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold", style.className)}>
                      <style.Icon aria-hidden size={12} strokeWidth={2.5} />
                      {style.label}
                    </span>
                  </div>
                  <p className="mt-3 font-semibold leading-snug">{q.question}</p>
                  <dl className="mt-4 grid grid-cols-1 gap-2 text-[0.95rem]">
                    <div className="grid gap-0.5 sm:grid-cols-[9rem_minmax(0,1fr)]">
                      <dt className="text-ink-muted">Your answer</dt>
                      <dd className={cn(result.outcome === "incorrect" && "text-danger", result.outcome === "correct" && "text-success")}>
                        {selectedText ?? <span className="italic text-ink-muted">Not answered</span>}
                      </dd>
                    </div>
                    <div className="grid gap-0.5 sm:grid-cols-[9rem_minmax(0,1fr)]">
                      <dt className="text-ink-muted">Correct answer</dt>
                      <dd className="font-medium">{correctText}</dd>
                    </div>
                  </dl>
                  <p className="mt-4 border-t border-line pt-4 leading-relaxed text-ink-muted">{q.explanation}</p>
                </li>
              );
            })}
          </ol>
        )}
      </section>
    </div>
  );
}
