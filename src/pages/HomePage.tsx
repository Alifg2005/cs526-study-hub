import { useMemo } from "react";
import { ArrowRight, PenLine } from "lucide-react";
import { LectureCard } from "../components/LectureCard";
import { ButtonLink } from "../components/ui/Button";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useProgress } from "../hooks/useProgress";
import { isReady, lectures } from "../lib/lectures";
import { REQUIRED_MCQ_COUNT } from "../lib/constants";

export function HomePage() {
  useDocumentTitle();
  const progress = useProgress();
  const ready = lectures.filter(isReady);
  const firstReady = ready[0];

  const stats = useMemo(() => {
    const attempted = ready.filter((l) => progress[l.meta.id]?.bestScore !== undefined);
    const bestTotal = attempted.reduce((sum, l) => sum + (progress[l.meta.id]?.bestScore ?? 0), 0);
    const checklistTotal = ready.reduce((sum, l) => sum + l.content.checklist.length, 0);
    const checklistDone = ready.reduce(
      (sum, l) => sum + Math.min(progress[l.meta.id]?.checked?.length ?? 0, l.content.checklist.length),
      0,
    );
    return {
      attempted: attempted.length,
      average: attempted.length ? Math.round((bestTotal / (attempted.length * REQUIRED_MCQ_COUNT)) * 100) : null,
      checklistDone,
      checklistTotal,
    };
  }, [progress, ready]);

  return (
    <>
      <section className="mx-auto grid max-w-6xl gap-10 px-4 pb-14 pt-12 sm:px-6 md:pt-16">
        <div className="animate-rise">
          <p className="text-sm font-semibold text-accent-text">CS526: Mobile Application Development</p>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-6xl">
            Course revision, one lecture at a time.
          </h1>
          <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-ink-muted">
            Ali Feras Alghanim's review notes, essay practice and 20-question quizzes for every lecture.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {firstReady && (
              <ButtonLink to={`/lectures/${firstReady.meta.slug}`}>
                Start revising
                <ArrowRight aria-hidden size={18} strokeWidth={1.75} />
              </ButtonLink>
            )}
            <ButtonLink to="/essays" variant="secondary">
              <PenLine aria-hidden size={18} strokeWidth={1.75} />
              Essay prep
            </ButtonLink>
          </div>
        </div>
      </section>

      <section aria-labelledby="progress-heading" className="border-y border-line bg-surface-2/60">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <h2 id="progress-heading" className="sr-only">
            Your progress
          </h2>
          <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
            <div className="flex items-baseline gap-2">
              <dt className="text-ink-muted">quizzes attempted</dt>
              <dd className="order-first font-mono text-2xl font-semibold tabular-nums">
                {stats.attempted}/{ready.length}
              </dd>
            </div>
            <div className="flex items-baseline gap-2">
              <dt className="text-ink-muted">average best score</dt>
              <dd className="order-first font-mono text-2xl font-semibold tabular-nums">
                {stats.average === null ? <span className="font-sans text-lg text-ink-muted">None yet</span> : `${stats.average}%`}
              </dd>
            </div>
            <div className="flex items-baseline gap-2">
              <dt className="text-ink-muted">checklist items done</dt>
              <dd className="order-first font-mono text-2xl font-semibold tabular-nums">
                {stats.checklistDone}/{stats.checklistTotal}
              </dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-ink-muted">Progress is saved in this browser only.</p>
        </div>
      </section>

      <section aria-labelledby="lectures-heading" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 id="lectures-heading" className="text-2xl font-semibold sm:text-3xl">
          Lectures
        </h2>
        <p className="mt-2 max-w-[60ch] text-ink-muted">
          Read the review first, then test yourself. Each quiz has 20 questions and explains every answer.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {lectures.map((lecture) => (
            <LectureCard key={lecture.meta.id} lecture={lecture} progress={progress[lecture.meta.id]} />
          ))}
        </div>
      </section>
    </>
  );
}
