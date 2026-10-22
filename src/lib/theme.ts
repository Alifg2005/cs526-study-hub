import { readString, writeString } from "./storage";

export type Theme = "light" | "dark";

/** Must match the inline script in index.html that applies the theme before first paint. */
export const THEME_STORAGE_KEY = "cs526:theme";

export function getStoredTheme(): Theme | null {
  const value = readString(THEME_STORAGE_KEY);
  return value === "light" || value === "dark" ? value : null;
}

export function getSystemTheme(): Theme {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function getInitialTheme(): Theme {
  return getStoredTheme() ?? getSystemTheme();
}

export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

export function persistTheme(theme: Theme): void {
  writeString(THEME_STORAGE_KEY, theme);
}
