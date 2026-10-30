import { Info, Lightbulb, Target } from "lucide-react";
import type { CalloutTone, ContentBlock } from "../../types/content";
import { cn } from "../../lib/cn";

const calloutStyle: Record<CalloutTone, { label: string; className: string; Icon: typeof Info }> = {
  exam: { label: "Practice angle", className: "border-accent/40 bg-accent-soft/60", Icon: Target },
  note: { label: "Note", className: "border-line-strong bg-surface-2", Icon: Info },
  supplement: { label: "Good to know", className: "border-warning/40 bg-warning-soft/50", Icon: Lightbulb },
};

export function ContentBlockView({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "paragraph":
      return <p className="leading-relaxed">{block.text}</p>;

    case "list": {
      const List = block.ordered ? "ol" : "ul";
      return (
        <List className={cn("grid gap-2 pl-5 leading-relaxed marker:text-accent-text", block.ordered ? "list-decimal" : "list-disc")}>
          {block.items.map((item) => (
            <li key={item} className="pl-1">
              {item}
            </li>
          ))}
        </List>
      );
    }

    case "steps":
      return (
        <ol className="grid grid-cols-1 gap-3">
          {block.items.map((step, i) => (
            <li key={step.title} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3">
              <span
                aria-hidden
                className="grid grid-cols-1 size-8 place-items-center rounded-full border border-accent/40 font-mono text-sm font-semibold text-accent-text"
              >
                {i + 1}
              </span>
              <div className="pt-1">
                <p className="font-semibold">{step.title}</p>
                <p className="mt-0.5 leading-relaxed text-ink-muted">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      );

    case "table":
      return (
        <figure className="-mx-4 sm:mx-0">
          <div className="overflow-x-auto px-4 sm:px-0" tabIndex={0} role="region" aria-label={block.caption ?? "Table"}>
            <table className="w-full min-w-[32rem] border-separate border-spacing-0 overflow-hidden rounded-2xl border border-line text-left text-[0.92rem]">
              {block.caption && <caption className="pb-2 text-left text-sm font-semibold text-ink-muted">{block.caption}</caption>}
              <thead className="bg-surface-2">
                <tr>
                  {block.columns.map((col, i) => (
                    <th key={i} scope="col" className="border-b border-line px-4 py-2.5 font-semibold">
                      {col || <span className="sr-only">Aspect</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, r) => (
                  <tr key={r} className="align-top">
                    {row.map((cell, c) =>
                      c === 0 ? (
                        <th key={c} scope="row" className={cn("px-4 py-3 font-medium", r > 0 && "border-t border-line")}>
                          {cell}
                        </th>
                      ) : (
                        <td key={c} className={cn("px-4 py-3 leading-relaxed text-ink-muted", r > 0 && "border-t border-line")}>
                          {cell}
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </figure>
      );

    case "callout": {
      const style = calloutStyle[block.tone];
      return (
        <aside className={cn("rounded-2xl border p-4 sm:p-5", style.className)}>
          <p className="flex items-center gap-2 text-sm font-semibold">
            <style.Icon aria-hidden size={16} strokeWidth={1.75} />
            {block.title ?? style.label}
          </p>
          <p className="mt-1.5 leading-relaxed">{block.text}</p>
        </aside>
      );
    }

    case "code":
      return (
        <figure>
          {block.caption && <figcaption className="mb-2 text-sm font-medium text-ink-muted">{block.caption}</figcaption>}
          <pre className="overflow-x-auto rounded-2xl border border-line bg-surface-2 p-4 font-mono text-[0.84rem] leading-relaxed" tabIndex={0}>
            <code>{block.code}</code>
          </pre>
        </figure>
      );

    case "terms":
      return (
        <dl className="grid grid-cols-1 gap-3">
          {block.items.map((t) => (
            <div key={t.term} className="rounded-2xl border border-line bg-surface p-4">
              <dt className="font-semibold">{t.term}</dt>
              <dd className="mt-1 leading-relaxed text-ink-muted">{t.definition}</dd>
            </div>
          ))}
        </dl>
      );
  }
}
