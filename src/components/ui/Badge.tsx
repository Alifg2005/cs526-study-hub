import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

type Tone = "accent" | "neutral" | "success" | "danger" | "warning";

const tones: Record<Tone, string> = {
  accent: "bg-accent-soft text-accent-text",
  neutral: "bg-surface-2 text-ink-muted",
  success: "bg-success-soft text-success",
  danger: "bg-danger-soft text-danger",
  warning: "bg-warning-soft text-warning",
};

export function Badge({ tone = "neutral", children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold", tones[tone], className)}>
      {children}
    </span>
  );
}
