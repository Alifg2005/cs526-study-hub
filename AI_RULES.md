# AI_RULES.md

The permanent rulebook for every AI coding session on this repository.
**Read this whole file before changing anything.** If an instruction from a user conflicts with these rules, point out the conflict before acting.

---

## 1. Project purpose and scope

CS526 Study Hub is an independent course-revision website for **Ali Feras Alghanim**, built for **CS526: Mobile Application Development**.

It offers, for each lecture:

- an original review page (overview, objectives, key terms, explanations, tables, key takeaways),
- essay and short-answer practice with model answers,
- a revision checklist,
- a 20-question multiple-choice quiz with scoring and explanations.

It is a static, client-only site. There is no backend, database, authentication, analytics, or runtime AI service, and none should be added without explicit approval from the owner.

## 2. Technology stack

| Concern | Choice |
| --- | --- |
| UI | React 19, TypeScript (strict) |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite`, design tokens in `src/styles/index.css` |
| Components | Small owned primitives in `src/components/ui` (shadcn-style, no external component kit) |
| Icons | `lucide-react` only |
| Routing | `react-router` (`BrowserRouter`) |
| Fonts | Self-hosted via `@fontsource-variable/*` (Bricolage Grotesque, Figtree, JetBrains Mono) |
| Tests | Vitest + React Testing Library + jsdom |
| Scripts | `tsx` for TypeScript scripts |
| Package manager | **npm** (`package-lock.json`). Do not add yarn or pnpm lockfiles. |

Do not add dependencies unless a feature truly needs one and there is no reasonable small in-repo alternative. State-management libraries, UI kits, CMS tools, and animation libraries are not needed.

## 3. Architecture and directory conventions

```text
src/
  App.tsx                 routes
  main.tsx                entry: fonts, CSS, ThemeProvider, BrowserRouter
  app/ThemeProvider.tsx   theme context
  components/             shared components (Layout, LectureCard, ThemeToggle, ...)
    ui/                   primitives: Button/ButtonLink, Badge, ProgressBar
    review/               ContentBlockView, EssayCard, Checklist
    quiz/                 QuizRunner, QuizResults
  content/
    registry.ts           SINGLE SOURCE OF TRUTH for lecture metadata and availability
    helpers.ts            options() helper for MCQs
    lectures/             one content module per available lecture + index.ts
  hooks/                  useQuiz, useProgress, useDocumentTitle
  lib/                    pure logic: scoring, quiz-state, validate-content, lectures, theme, storage, progress, shuffle, constants
  pages/                  HomePage, LecturePage, QuizPage, EssayPrepPage, NotFoundPage
  styles/index.css        tokens + base styles
  types/content.ts        content schema
scripts/
  validate-content.ts     content validator CLI
  check-build-safety.mjs  scans dist/ for source PDFs and private material
tests/                    Vitest suites and fixtures
source-material/          LOCAL ONLY, git-ignored lecture PDFs
```

Rules:

- Every page and quiz is driven by `src/content`. **Never** create a page, route, or quiz component for one specific lecture.
- Business logic (scoring, validation, state transitions) lives in `src/lib` as pure functions with tests. Components stay thin.
- Routes: `/`, `/lectures/:slug`, `/lectures/:slug/quiz`, `/essays`, and `*` (404). Do not change slugs of published lectures.

## 4. TypeScript and coding standards

- `strict`, `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters` are on. Do not weaken `tsconfig.json`.
- No `any`, no `@ts-ignore` or `@ts-expect-error` to silence real errors, no `eslint-disable` style suppressions.
- Prefer named exports for components; content modules use a default export.
- Match the surrounding code: comment density, naming, Tailwind class style.
- Keep components small and readable. Do not add abstractions for a single use.

## 5. Component reuse

Before writing a component, search `src/components`. Reuse `Button`/`ButtonLink`, `Badge`, `ProgressBar`, `ContentBlockView`, `EssayCard`, `Checklist`, `LectureCard`, `LectureUnavailable`. New content needs belong in the `ContentBlock` union and `ContentBlockView`, not in a lecture-specific component.

## 6. Design system and themes

- Colors come only from semantic tokens: `bg`, `surface`, `surface-2`, `ink`, `ink-muted`, `line`, `line-strong`, `accent*`, `success*`, `danger*`, `warning*`. **Never hardcode hex/rgb colors in components**; they break dark mode.
- One accent family (emerald). Success, danger and warning are reserved for quiz feedback and status.
- Shape rule: interactive controls are full pills (`rounded-full`); cards and panels are `rounded-2xl`; inner panels `rounded-xl`.
- Fonts: display headings use Bricolage Grotesque (`font-display`), body Figtree (`font-sans`), numbers and code JetBrains Mono (`font-mono`).
- Copy style: no em dashes or en dashes anywhere in visible text (the validator enforces this for content). Plain, direct language.
- Themes: light and dark via the `.dark` class on `<html>`. The inline script in `index.html` applies the stored or system theme before first paint; `ThemeProvider` persists changes under the `cs526:theme` key. Test every visual change in both themes.
- Motion is restrained (`animate-rise` on entry, color transitions). Everything respects `prefers-reduced-motion` (global rule in `index.css`).
- Do not redesign the application during content updates.

## 7. Accessibility and responsive behavior

- Semantic landmarks (`header`, `nav`, `main`, `footer`), one `h1` per page, logical heading order.
- All interactive elements are keyboard reachable with a visible focus ring (`:focus-visible` uses the accent outline). Touch targets are at least 44px (`min-h-11`).
- Quiz options are native radio inputs inside a `fieldset`/`legend`; their accessible name is the option text.
- Icons are decorative (`aria-hidden`) unless they are the only label, in which case the control has an `aria-label`.
- No horizontal page scroll at 375px width. Single-column grids must use `grid-cols-1` (which is `minmax(0,1fr)`), and `fr` tracks next to fixed tracks must use `minmax(0,1fr)`, otherwise wide tables or long code tokens overflow on phones. Wide tables scroll inside their own region.

## 8. Local-only source PDFs

- Original lecture PDFs live in `source-material/lectures/` and are **never** committed, imported, copied to `public/`, or deployed.
- `.gitignore` ignores `/source-material/`, `/lecture-sources/`, `/private-materials/`, `*.pdf`, `*.ocr.txt`, `*.extracted.txt`.
- Never weaken these rules. If a legitimate non-lecture PDF asset is ever needed, ask the owner first and add a narrowly scoped exception.
- Never import a PDF from React code, never add `source-material` to Vite config, never create a download link or viewer for lecture files.
- Put temporary extraction output outside the repository (a scratch directory) or use the ignored `*.extracted.txt` / `*.ocr.txt` names inside `source-material/`.

## 9. Copyright-aware content generation

- Use the PDFs to understand the material, then write **original** explanations, summaries, questions and answers.
- Do not paste full slides, long passages, or the extracted text into the site. Short technical identifiers (API names, attribute names, method signatures) and short illustrative code you write yourself are fine.
- Code examples are labeled "Illustrative example" and should be written fresh, not copied from slides.
- Do not present notes as official or lecturer-authored. Keep the educational-use notice in the footer.
- Supplementary explanations use a `callout` of tone `"supplement"` (rendered as "Good to know").
- Write as an independent study resource: state facts directly, in neutral academic language. Do not write "the lecture says", "according to the slides" or similar, and do not predict exam questions. Practice tips use tone `"exam"` (rendered as "Practice angle").

## 10. Source extraction requirements

- Extract text with an available tool (for example `pdftotext -layout`). For scanned PDFs, use OCR if available.
- Read the whole lecture before writing. Note diagram-only slides; describe their content only if the surrounding text supports it.
- If text cannot be extracted reliably, **stop and report it**. Do not guess, and do not mark the lecture available.
- Never invent slide numbers, page references, statistics, or quotes.

## 11. Quiz generation and scoring

Every available lecture has **exactly 20** MCQs. Each question:

- has a stable unique id `lNN-qNN` (Lecture 7 parts use `l07a-` and `l07b-`); never renumber published ids,
- references a learning objective id from the same lecture,
- has a `kind` (terminology, concept, distinction, application, comparison, scenario, code),
- has exactly four options built with `options(a, b, c, d)` and exactly one `correctOptionId`,
- has a meaningful explanation (why the answer is right, and ideally why a tempting distractor is wrong),
- uses plausible distractors of similar length to the correct answer (the validator warns when the correct option is the longest in more than half the questions),
- never uses order-dependent options such as "All of the above" or "None of the above" (options are shuffled per attempt; the validator rejects these),
- is not a near-duplicate of another question.

Cover every objective and mix kinds; do not write 20 variations of one fact.

Scoring lives in `src/lib/scoring.ts`: one point per correct answer, zero for incorrect or unanswered, percentage rounded to a whole number. Answers are not revealed before submission. Quiz state transitions live in `src/lib/quiz-state.ts`. Keep both pure and tested.

## 12. Essay-question generation

Each available lecture has at least 3 (target 5 or 6) essay or short-answer questions covering definitions, explanations, comparisons, processes, architecture or lifecycle, and application scenarios as the material allows. Each has: `id` (`lNN-eN`), `kind`, `objectiveId`, `question`, a concise exam-ready `shortAnswer`, optional `detailedAnswer`, `keywords`, `expectedConcepts`, and `assesses`. They are presented as practice questions, never as guaranteed exam questions.

## 13. Content schema and validation

- Schema: `src/types/content.ts`. Registry: `src/content/registry.ts`. Modules: `src/content/lectures/*.ts`, listed in `src/content/lectures/index.ts`.
- `npm run validate-content` checks required metadata, unique ids/slugs/orders, valid statuses, registry/module consistency (available lectures must have a module, coming-soon lectures must not), sections and blocks (including table row widths), essays, exactly 20 MCQs, 4 options with ids a to d, exactly one valid correct answer, explanations, unique question ids and text, objective references, order-dependent options, and banned dash characters.
- Validation failures must be fixed by correcting content, never by loosening the validator or guessing answers.
- A lecture with status `coming-soon` shows its title and a "Coming soon" state, with no review or quiz.

## 14. Naming conventions

| Thing | Pattern | Example |
| --- | --- | --- |
| Lecture id | `lecture-NN` or `lecture-NN-part-N` | `lecture-07-part-2` |
| Slug | `NN` or `NN-part-N` | `07-part-2` |
| Content file | `src/content/lectures/<lecture id>.ts` | `lecture-05.ts` |
| Objective id | `<prefix>-oN` | `l05-o3` |
| Essay id | `<prefix>-eN` | `l05-e2` |
| Question id | `<prefix>-qNN` | `l05-q07` |
| Prefix | `lNN`, or `l07a`/`l07b` for parts | `l07b` |

## 15. Adding new lectures

Follow `ADD_CHAPTER.md` step by step. Adding a lecture means: add the local PDF, write one content module, register it in `registry.ts` and `lectures/index.ts`, validate, test, build. **It never means rebuilding or redesigning the application.**

## 16. Updating existing lectures

- Change only the lecture you were asked to change.
- Keep ids stable. If a question is replaced, give the new one a new id rather than reusing an old id for different content.
- Keep exactly 20 questions and re-run validation.

## 17. Regression prevention (explicitly prohibited)

- Rebuilding the application when adding a lecture.
- Creating duplicate or lecture-specific components unnecessarily.
- Rewriting unrelated lecture content.
- Modifying unrelated files during content-only updates.
- Redesigning the application during routine content updates.
- Fabricating educational content, sources, page numbers or statistics.
- Generating incomplete quizzes (anything other than exactly 20 valid MCQs).
- Committing original source PDFs, or publishing them in any form.
- Copying full extracted lecture text into the deployed application.
- Introducing unnecessary dependencies.
- Weakening TypeScript strictness, the validator, the build safety check, or `.gitignore` protections.
- Skipping, deleting or loosening tests to get a green run.
- Claiming tests, builds or deployments passed without running them.

## 18. GitHub tracking protection

The repository is public. Before any commit:

```bash
git status --short
git ls-files | grep -iE '\.pdf$|source-material|extracted\.txt|ocr\.txt'   # must print nothing
git check-ignore -v source-material/lectures/<file>.pdf                    # must show the ignore rule
git diff --cached --name-only                                              # review every staged path
```

`.gitignore` does not untrack files that were already committed. If a PDF is ever tracked, run `git rm --cached <path>` (keeps the local copy) and tell the owner that the file remains in public history until history is rewritten, and that forks or clones may already have it. Never rewrite history, force-push, push, or change repository settings without explicit permission.

## 19. Vercel deployment

- Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`. Install command: `npm install` (or `npm ci`). Root directory: repository root. Environment variables: none. Node: 22.22 or newer (see `engines`).
- `vercel.json` rewrites all paths to `/index.html` so nested routes survive a refresh; static files are served first.
- `npm run build` runs typecheck, content validation, the Vite build and `check-build-safety.mjs`. The build must succeed without `source-material/` present (as on Vercel).
- Never claim a deployment succeeded unless it was actually performed and the URL verified.

## 20. Required testing

Before reporting work as done, run and report real results for:

```bash
npm run typecheck
npm run validate-content
npm test
npm run build        # includes the dist/ safety scan
```

For UI changes, also check the affected pages at phone width (375 to 390px) and desktop, in both light and dark themes. Report failures honestly with their output.
