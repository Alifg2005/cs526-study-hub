# AGENTS.md

Instructions for any AI agent working in this repository.

1. **Read [`AI_RULES.md`](AI_RULES.md) before changing anything.** It is the binding rulebook.
2. **Adding or updating a lecture?** Also read and follow [`ADD_CHAPTER.md`](ADD_CHAPTER.md).
3. **Preserve the architecture and design system.** Content lives in `src/content`; pages and quizzes are shared and data-driven. Do not create lecture-specific components or redesign the UI during content work.
4. **Keep original PDFs local and untracked.** They live in `source-material/lectures/`, which is git-ignored. Never import, copy, publish or commit them.
5. **Run the checks** and fix what fails:
   ```bash
   npm run typecheck
   npm run validate-content
   npm test
   npm run build
   ```
6. **Verify deployment safety.** `npm run build` ends with `check-build-safety.mjs`, which must report no PDFs or private material in `dist/`. Confirm `git ls-files` lists no PDFs before any commit.
7. **Report honestly.** State which commands ran and their actual results. Never claim tests, builds, pushes or deployments succeeded unless they did.

Do not push, force-push, rewrite history, or change repository or Vercel settings without explicit permission from the owner.
