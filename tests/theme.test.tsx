import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ThemeProvider } from "../src/app/ThemeProvider";
import { ThemeToggle } from "../src/components/ThemeToggle";
import { THEME_STORAGE_KEY } from "../src/lib/theme";

const renderToggle = () =>
  render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>,
  );

describe("theme", () => {
  it("starts in light mode when there is no preference", () => {
    renderToggle();
    expect(document.documentElement).not.toHaveClass("dark");
    expect(screen.getByRole("button", { name: "Switch to dark theme" })).toBeInTheDocument();
  });

  it("toggles and persists the choice", async () => {
    const user = userEvent.setup();
    renderToggle();
    await user.click(screen.getByRole("button", { name: "Switch to dark theme" }));
    expect(document.documentElement).toHaveClass("dark");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");

    await user.click(screen.getByRole("button", { name: "Switch to light theme" }));
    expect(document.documentElement).not.toHaveClass("dark");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
  });

  it("restores a saved preference", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "dark");
    renderToggle();
    expect(document.documentElement).toHaveClass("dark");
  });

  it("follows the system preference on first visit", () => {
    const spy = vi.spyOn(window, "matchMedia").mockImplementation(
      (query: string) => ({ matches: query.includes("dark"), media: query }) as MediaQueryList,
    );
    renderToggle();
    expect(document.documentElement).toHaveClass("dark");
    spy.mockRestore();
  });
});
