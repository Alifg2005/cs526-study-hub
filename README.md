# CS526 Study Hub

An independent study website for **CS526: Mobile Application Development**, built by **Ali Feras Alghanim** for course revision.

> Independent student study resource for CS526. Course materials remain the property of their respective rights holders. This website provides original study notes and practice questions and is not an official university website.

## Features

- **Lecture reviews** for all eight lecture modules: overview, learning objectives, key terms, explanations, comparison tables, processes, key takeaways. Supplementary explanations are labeled "Good to know".
- **Essay and short-answer practice** with model answers, keywords, expected concepts and what each question assesses, per lecture and on a combined `/essays` page.
- **Interactive quizzes**: exactly 20 multiple-choice questions per lecture, one at a time, progress bar, previous/next, jump-to overview, answers kept while navigating, confirmation before submitting with unanswered questions, score out of 20 with percentage, per-question review with explanations, filters, and retake. Option order is shuffled on every attempt.
- **Progress** saved in the browser: best quiz scores and revision-checklist items.
- **Light and dark themes** following the system preference on first visit, with a persistent toggle and no flash on load.
- Responsive from 375px phones to desktop; keyboard accessible; reduced-motion aware.
- Honest "Coming soon" states for any lecture that has not been processed yet.

### Lectures

| # | Lecture | Status |
| --- | --- | --- |
| 1 | Mobile Application Trends | Available |
| 2 | Building User Interface | Available |
| 3 | Android Architecture Stack | Available |
| 4 | Creating Applications and Activities | Available |
| 5 | Intents | Available |
| 6 | Activity Lifecycle | Available |
| 7.1 | Fragments, Part 1 | Available |
| 7.2 | Fragments, Part 2 | Available |

## Technology stack

React 19, TypeScript (strict), Vite 8, Tailwind CSS v4, React Router, Lucide icons, self-hosted variable fonts, Vitest and React Testing Library. No backend, database, accounts, API keys or runtime AI services.

## Project structure

```text
AI_RULES.md            permanent rules for AI coding sessions
AGENTS.md              short entry point for agents
ADD_CHAPTER.md         workflow for adding or updating a lecture
index.html             app shell + pre-paint theme script
vercel.json            SPA rewrites for Vercel
scripts/
  validate-content.ts  content validator (npm run validate-content)
  check-build-safety.mjs  scans dist/ for PDFs and private material
src/
  content/registry.ts  lecture metadata and availability (single source of truth)
  content/lectures/    one original content module per lecture
  types/content.ts     content schema
  lib/                 scoring, quiz state, validation, theme, progress, ...
  components/          shared UI (layout, cards, review blocks, quiz)
  pages/               home, lecture review, quiz, essay prep, 404
  styles/index.css     design tokens for both themes
tests/                 Vitest suites
source-material/       LOCAL ONLY lecture PDFs (git-ignored, never deployed)
```

## Local development

Requires Node.js 22.22 or newer and npm.

```bash
npm install
npm run dev          # http://localhost:5173
```

## Tests and validation

```bash
npm run typecheck          # tsc --noEmit
npm run validate-content   # schema, 20 MCQs per lecture, answers, ids, references
npm test                   # Vitest: scoring, quiz flow, theme, routing, validator
```

## Production build

```bash
npm run build      # typecheck + validate-content + vite build + dist/ safety scan
npm run preview    # serve dist/ locally
```

`npm run build` fails if the content is invalid or if `dist/` contains any PDF, a copy of a local source PDF, or a reference to the private source folders.

## Copyright-aware source handling

The original lecture PDFs are used only locally to write **original** notes and questions. They:

- live in `source-material/lectures/`, which is ignored by Git (as are all `*.pdf`, `*.ocr.txt` and `*.extracted.txt` files),
- are never imported by the app, copied to `public/`, or included in `dist/`,
- are not needed to build or deploy the site.

The site does not reproduce slides or full lecture text, and does not present its notes as official course material.

## Public GitHub repository requirements

Before every commit, confirm no source material is tracked:

```bash
git status --short
git ls-files | grep -iE '\.pdf$|source-material'   # must print nothing
```

`.gitignore` does not untrack files already committed. If a PDF was ever committed, remove it from the index with `git rm --cached <path>` (the local file stays) and note that it remains in earlier public history until that history is rewritten.

## Adding a new lecture

Put the PDF in `source-material/lectures/`, then ask a coding agent:

> Read AI_RULES.md and ADD_CHAPTER.md. Process the newly added local lecture PDF, generate its original review content, essay preparation, and exactly 20 validated MCQs, register the lecture in the existing content system, preserve all existing content and UI, verify that the source PDF is ignored by Git and excluded from the production build, run the relevant tests and production build, fix regressions, and report the results. Do not ask me to approve intermediate steps.

The full manual procedure is in [`ADD_CHAPTER.md`](ADD_CHAPTER.md). Adding a lecture never requires changing pages or components.

## How the AI instruction files work

- **`AI_RULES.md`** is the permanent rulebook: stack, architecture, design tokens, accessibility, copyright handling, quiz and essay standards, validation, naming, regression prohibitions, Git protection, deployment and required checks.
- **`AGENTS.md`** is the short entry point many coding agents read automatically; it points to the two files above.
- **`ADD_CHAPTER.md`** is the repeatable step-by-step workflow (and copy-ready prompt) for adding or updating a lecture.

## Deploying to Vercel

1. Push this repository to GitHub (the PDFs stay local because they are ignored).
2. In Vercel, choose **Add New > Project** and import the repository.
3. Confirm the settings (they are also declared in `vercel.json`):

   | Setting | Value |
   | --- | --- |
   | Framework Preset | Vite |
   | Root Directory | repository root (`./`) |
   | Install Command | `npm install` |
   | Build Command | `npm run build` |
   | Output Directory | `dist` |
   | Environment Variables | none |
   | Node.js version | 22.x or newer (from `engines`) |

4. Deploy. Vercel builds without the source PDFs; the safety scan still runs on its output.
5. Open the generated URL and check a nested route such as `/lectures/05/quiz` with a browser refresh; `vercel.json` rewrites it to the app.

Each later push to the default branch redeploys automatically.
