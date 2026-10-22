import { Check } from "lucide-react";
import { useProgress } from "../../hooks/useProgress";
import { progressStore } from "../../lib/progress";

export function Checklist({ lectureId, items }: { lectureId: string; items: string[] }) {
  const progress = useProgress();
  const checked = new Set(progress[lectureId]?.checked ?? []);

  return (
    <div>
      <p className="text-sm text-ink-muted" aria-live="polite">
        {checked.size} of {items.length} done
      </p>
      <ul className="mt-3 grid grid-cols-1 gap-2">
        {items.map((item, i) => {
          const id = `${lectureId}-check-${i}`;
          const isChecked = checked.has(i);
          return (
            <li key={item}>
              <label
                htmlFor={id}
                className="flex min-h-11 cursor-pointer items-start gap-3 rounded-xl border border-line bg-surface px-4 py-3 transition-colors hover:border-line-strong has-[:checked]:border-accent/50 has-[:checked]:bg-accent-soft/40"
              >
                <input
                  id={id}
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => progressStore.toggleChecklistItem(lectureId, i)}
                  className="peer sr-only"
                />
                <span
                  aria-hidden
                  className="mt-0.5 grid grid-cols-1 size-5 shrink-0 place-items-center rounded-md border border-line-strong bg-surface text-accent-contrast peer-checked:border-accent peer-checked:bg-accent peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent"
                >
                  {isChecked && <Check size={14} strokeWidth={3} />}
                </span>
                <span className={isChecked ? "text-ink-muted line-through decoration-line-strong" : ""}>{item}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
