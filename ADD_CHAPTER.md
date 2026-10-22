# ADD_CHAPTER.md

How to add (or update) a lecture **without rebuilding the website**. The app is content-driven: a new lecture is one new data file plus two registrations.

> Uploading a PDF does not trigger anything by itself. A coding agent (or a person) must be asked to run this workflow.

## Copy-ready instruction for an AI agent

> Read AI_RULES.md and ADD_CHAPTER.md. Process the newly added local lecture PDF, generate its original review content, essay preparation, and exactly 20 validated MCQs, register the lecture in the existing content system, preserve all existing content and UI, verify that the source PDF is ignored by Git and excluded from the production build, run the relevant tests and production build, fix regressions, and report the results. Do not ask me to approve intermediate steps.

---

## Step by step

### 1. Read the rules

Read `AI_RULES.md`, especially sections 8 to 17.

### 2. Place the PDF locally

Copy the file into `source-material/lectures/`. Any file name works; keeping the lecturer's name is fine.

### 3. Confirm Git ignores it

```bash
git check-ignore -v "source-material/lectures/<file>.pdf"   # must print the matching .gitignore rule
git status --short                                         # the PDF must NOT appear
```

If it is not ignored, stop and fix `.gitignore` before doing anything else.

### 4. Identify the lecture

Find the lecture number and title from the PDF and the course's announced list. Decide the id, slug and prefix (see AI_RULES.md section 14), for example:

| | Value |
| --- | --- |
| id | `lecture-08` |
| slug | `08` |
| prefix | `l08` |
| order | next free integer after the last registry entry |

### 5. Extract and understand the content

Extract text to a location **outside the repository** (or to a git-ignored `*.extracted.txt` file inside `source-material/`):

```bash
pdftotext -layout "source-material/lectures/<file>.pdf" "/path/to/scratch/lecture-08.txt"
```

Read all of it. Note slides that are diagrams only.

### 6. Report extraction problems instead of guessing

If the PDF is scanned and OCR is unavailable or unreliable, stop. Add or keep the registry entry with `status: "coming-soon"` so the home page shows the title honestly, and report the problem. Do not write content from memory.

### 7. Write the original review content

Create `src/content/lectures/<id>.ts` following an existing module such as `lecture-05.ts`:

```ts
import type { LectureContent } from "../../types/content";
import { options } from "../helpers";

const lecture08: LectureContent = {
  lectureId: "lecture-08",
  overview: ["...", "..."],
  objectives: [{ id: "l08-o1", text: "..." }],
  keyTerms: [{ term: "...", definition: "..." }],
  sections: [{ id: "topic-slug", title: "...", blocks: [/* paragraph, list, steps, table, callout, code, terms */] }],
  takeaways: ["..."],
  essays: [/* see step 8 */],
  checklist: ["..."],
  quiz: [/* see step 9 */],
};

export default lecture08;
```

- Write in your own words. Do not paste slide text.
- Use `callout` with tone `"exam"` for exam tips and `"supplement"` for anything beyond the slides.
- Code samples are short, freshly written, and captioned "Illustrative example: ...".
- No em dashes or en dashes.

### 8. Write essay and short-answer questions

At least 3, ideally 5 or 6, mixing definition, explanation, comparison, process, architecture/lifecycle and application questions. Each needs `id`, `kind`, `objectiveId`, `question`, `shortAnswer`, optional `detailedAnswer`, `keywords`, `expectedConcepts` and `assesses`.

### 9. Write exactly 20 MCQs

```ts
{
  id: "l08-q01",
  objectiveId: "l08-o1",
  kind: "concept",
  question: "...?",
  options: options("...", "...", "...", "..."),
  correctOptionId: "b",
  explanation: "Why b is right, and why the tempting wrong answer is wrong.",
},
```

- Cover every objective; mix terminology, concept, distinction, comparison, application, scenario and code questions.
- Distractors must be plausible and of similar length to the correct answer.
- Never use "All of the above" or "None of the above" (options are shuffled each attempt).
- Do not guess answers. If the source does not support a definite answer, drop the question and write another.

### 10. Register the lecture

1. Add (or update) the entry in `src/content/registry.ts` with `status: "available"` and a source-grounded `description`.
2. Import the module in `src/content/lectures/index.ts` and add it to `lectureContentModules`.

### 11. Preserve existing lectures and UI

Do not edit other lecture files, components, styles or tests unless a genuine bug requires it, and say so if you do.

### 12. Keep the PDF out of Git and the build

Never import the PDF, never copy it to `public/`, never reference `source-material` from code.

### 13. Run every check

```bash
npm run validate-content
npm run typecheck
npm test
npm run build      # typecheck + validation + vite build + dist/ safety scan
git ls-files | grep -iE '\.pdf$|source-material'   # must print nothing
```

### 14. Fix regressions

Fix content, not the validator. If a test about lecture counts or ids needs updating because a lecture was legitimately added (for example the ordered id list in `tests/content.test.ts`), update only that expectation.

### 15. Report

List the files changed, the lecture processed, any extraction limitations, and the actual output of the checks above.

---

## Updating an existing lecture

Same workflow from step 5, editing only that lecture's module. Keep ids stable; give replacement questions new ids. Keep exactly 20 questions.

## Marking a lecture as coming soon

Add a registry entry with `status: "coming-soon"` and no content module. The home page shows the title with a "Coming soon" badge, and its routes show an honest placeholder.
