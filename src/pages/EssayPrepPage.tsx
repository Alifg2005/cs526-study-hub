import { useState } from "react";
import { Link } from "react-router";
import { EssayCard } from "../components/review/EssayCard";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { cn } from "../lib/cn";
import { isReady, lectureFullTitle, lectureLabel, lectures } from "../lib/lectures";

export function EssayPrepPage() {
  useDocumentTitle("Essay preparation");
  const ready = lectures.filter(isReady);
  const [selected, setSelected] = useState<string>("all");
  const shown = selected === "all" ? ready : ready.filter((l) => l.meta.id === selected);
  const total = ready.reduce((sum, l) => sum + l.content.essays.length, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
      <header className="max-w-[68ch] pb-8 pt-10 md:pt-14">
        <h1 className="text-4xl font-semibold leading-[1.08] sm:text-5xl">Essay and short-answer practice</h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-muted">
          {total} practice questions written from the lectures, each with a model answer, keywords and what a strong
          answer covers. They are for preparation only and are not guaranteed exam questions.
        </p>
      </header>

      <div role="group" aria-label="Filter by lecture" className="flex flex-wrap gap-2">
        {[{ id: "all", label: "All lectures" }, ...ready.map((l) => ({ id: l.meta.id, label: lectureLabel(l.meta) }))].map(
          (f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={selected === f.id}
              onClick={() => setSelected(f.id)}
              className={cn(
                "min-h-10 rounded-full border px-4 text-sm font-semibold transition-colors",
                selected === f.id ? "border-ink bg-ink text-bg" : "border-line text-ink-muted hover:text-ink",
              )}
            >
              {f.label}
            </button>
          ),
        )}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-14">
        {shown.map((l) => (
          <section key={l.meta.id} aria-labelledby={`essays-${l.meta.slug}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-3">
              <h2 id={`essays-${l.meta.slug}`} className="text-2xl font-semibold">
                <span className="mr-2 font-mono text-lg text-accent-text">{l.meta.number}</span>
                {lectureFullTitle(l.meta)}
              </h2>
              <Link to={`/lectures/${l.meta.slug}`} className="text-sm font-semibold text-accent-text hover:underline">
                Open review
              </Link>
            </div>
            <div className="mt-5 grid grid-cols-1 max-w-[78ch] gap-4">
              {l.content.essays.map((essay, i) => (
                <EssayCard key={essay.id} essay={essay} number={i + 1} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
