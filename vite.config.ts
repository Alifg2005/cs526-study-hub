/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// The public/ directory is the only static-copy source. Lecture PDFs live in
// /source-material (git-ignored) and are never imported or copied.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "dist",
    sourcemap: false,
    // All lecture content ships in the main bundle on purpose (static, works
    // offline once loaded). About 150 kB gzipped, so the default 500 kB warning
    // is raised rather than splitting into many small chunks.
    chunkSizeWarningLimit: 700,
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
    css: false,
  },
});
