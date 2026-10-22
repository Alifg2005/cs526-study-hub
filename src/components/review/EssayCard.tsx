import { ChevronDown } from "lucide-react";
import type { EssayKind, EssayQuestion } from "../../types/content";
import { Badge } from "../ui/Badge";

const kindLabel: Record<EssayKind, string> = {
  definition: "Definition",
  explanation: "Explain",
  comparison: "Compare",
  process: "Process",
  architecture: "Architecture",
  lifecycle: "Lifecycle",
  application: "Apply",
};

export function EssayCard({ essay, number }: { essay: EssayQuestion; number: number }) {
  return (
    <article className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-sm font-semibold text-ink-muted">Q{number}</span>
        <Badge tone="accent">{kindLabel[essay.kind]}</Badge>
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-snug">{essay.question}</h3>
      <p className="mt-2 text-sm text-ink-muted">
        <span className="font-semibold text-ink">Assesses:</span> {essay.assesses}
      </p>

      <details className="group mt-4 rounded-xl border border-line bg-surface-2/60 open:bg-surface-2">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-4 font-semibold [&::-webkit-details-marker]:hidden">
          Model answer
          <ChevronDown aria-hidden size={18} strokeWidth={1.75} className="transition-transform group-open:rotate-180" />
        </summary>
        <div className="grid grid-cols-1 gap-4 px-4 pb-4">
          <p className="leading-relaxed">{essay.shortAnswer}</p>
          {essay.detailedAnswer && (
            <div>
              <p className="text-sm font-semibold">Going further</p>
              <p className="mt-1 leading-relaxed text-ink-muted">{essay.detailedAnswer}</p>
            </div>
          )}
          <div>
            <p className="text-sm font-semibold">A strong answer covers</p>
            <ul className="mt-1.5 list-disc pl-5 text-ink-muted marker:text-accent-text">
              {essay.expectedConcepts.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold">Keywords</p>
            <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Keywords">
              {essay.keywords.map((k) => (
                <li key={k} className="rounded-full border border-line bg-surface px-2.5 py-0.5 font-mono text-xs">
                  {k}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </details>
    </article>
  );
}
