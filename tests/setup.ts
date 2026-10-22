import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";
import { progressStore } from "../src/lib/progress";

// jsdom has no matchMedia or scrollTo; provide quiet stand-ins.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;

beforeEach(() => {
  window.localStorage.clear();
  progressStore.reset();
  document.documentElement.classList.remove("dark");
});

afterEach(() => {
  cleanup();
});
