import { ArrowLeft, Clock } from "lucide-react";
import type { LectureMeta } from "../types/content";
import { lectureLabel } from "../lib/lectures";
import { ButtonLink } from "./ui/Button";

/** Honest placeholder for lectures whose source material has not been processed yet. */
export function LectureUnavailable({ meta }: { meta: LectureMeta }) {
  return (
    <section className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
      <span className="mx-auto grid grid-cols-1 size-14 place-items-center rounded-2xl bg-warning-soft text-warning">
        <Clock aria-hidden size={26} strokeWidth={1.75} />
      </span>
      <p className="mt-6 text-sm font-semibold text-ink-muted">{lectureLabel(meta)}</p>
      <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">{meta.title}</h1>
      <p className="mx-auto mt-4 max-w-[46ch] leading-relaxed text-ink-muted">
        Coming soon. The review notes and quiz for this lecture will be published once they are
        ready.
      </p>
      <div className="mt-8">
        <ButtonLink to="/" variant="secondary">
          <ArrowLeft aria-hidden size={18} strokeWidth={1.75} />
          All lectures
        </ButtonLink>
      </div>
    </section>
  );
}
