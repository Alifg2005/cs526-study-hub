import { BookOpenText, Clock, ListChecks } from "lucide-react";
import type { Lecture } from "../types/content";
import type { LectureProgress } from "../lib/progress";
import { isReady, lectureFullTitle } from "../lib/lectures";
import { REQUIRED_MCQ_COUNT } from "../lib/constants";
import { Badge } from "./ui/Badge";
import { ButtonLink } from "./ui/Button";

interface LectureCardProps {
  lecture: Lecture;
  progress?: LectureProgress;
}

export function LectureCard({ lecture, progress }: LectureCardProps) {
  const { meta } = lecture;
  const ready = isReady(lecture);
  const headingId = `lecture-${meta.slug}-title`;

  return (
    <article
      aria-labelledby={headingId}
      className={
        ready
          ? "group relative flex flex-col rounded-2xl border border-line bg-surface p-5 shadow-card transition-colors hover:border-line-strong sm:p-6"
          : "flex flex-col rounded-2xl border border-dashed border-line-strong bg-transparent p-5 sm:p-6"
      }
    >
      <div className="flex items-start justify-between gap-4">
        <span className="font-mono text-3xl font-semibold leading-none tracking-tight text-accent-text tabular-nums">
          {meta.number.padStart(2, "0")}
        </span>
        {ready ? (
          progress?.bestScore !== undefined ? (
            <Badge tone="accent">
              Best {progress.bestScore}/{REQUIRED_MCQ_COUNT}
            </Badge>
          ) : (
            <Badge tone="neutral">Ready</Badge>
          )
        ) : (
          <Badge tone="warning">
            <Clock aria-hidden size={12} strokeWidth={2} />
            Coming soon
          </Badge>
        )}
      </div>

      <h3 id={headingId} className="mt-4 text-xl font-semibold leading-snug">
        {meta.title}
        {meta.part && <span className="ml-2 align-middle text-sm font-medium text-ink-muted">{meta.part}</span>}
      </h3>
      <p className="mt-2 flex-1 text-[0.95rem] leading-relaxed text-ink-muted">
        {ready ? meta.description : "This lecture's review and quiz will appear here once they are ready."}
      </p>

      {ready && (
        <div className="mt-5 flex flex-wrap gap-2">
          <ButtonLink to={`/lectures/${meta.slug}`} size="sm" aria-label={`Review ${lectureFullTitle(meta)}`}>
            <BookOpenText aria-hidden size={16} strokeWidth={1.75} />
            Review
          </ButtonLink>
          <ButtonLink
            to={`/lectures/${meta.slug}/quiz`}
            size="sm"
            variant="secondary"
            aria-label={`Quiz on ${lectureFullTitle(meta)}`}
          >
            <ListChecks aria-hidden size={16} strokeWidth={1.75} />
            Quiz
          </ButtonLink>
        </div>
      )}
    </article>
  );
}
