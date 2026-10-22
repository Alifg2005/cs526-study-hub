import { Moon, Sun } from "lucide-react";
import { useTheme } from "../app/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className="inline-flex size-11 items-center justify-center rounded-full border border-line bg-surface text-ink transition-colors hover:border-accent hover:text-accent-text"
    >
      {theme === "dark" ? <Sun aria-hidden size={18} strokeWidth={1.75} /> : <Moon aria-hidden size={18} strokeWidth={1.75} />}
    </button>
  );
}
