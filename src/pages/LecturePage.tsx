import { ArrowLeft, ArrowRight, ListChecks } from "lucide-react";
import { Link, useParams } from "react-router";
import { LectureUnavailable } from "../components/LectureUnavailable";
import { Checklist } from "../components/review/Checklist";
import { ContentBlockView } from "../components/review/ContentBlockView";
import { EssayCard } from "../components/review/EssayCard";
import { ButtonLink } from "../components/ui/Button";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useProgress } from "../hooks/useProgress";
import { REQUIRED_MCQ_COUNT } from "../lib/constants";
import { getLectureBySlug, isReady, lectureFullTitle, lectureLabel, lectures } from "../lib/lectures";
import { NotFoundPage } from "./NotFoundPage";

function SectionHeading({ id, children }: { id: string; children: string }) {
  return (
    <h2 id={id} className="scroll-mt-24 text-2xl font-semibold sm:text-[1.65rem]">
      {children}
    </h2>
  );
}

export function LecturePage() {
  const { slug } = useParams();
  const lecture = getLectureBySlug(slug);
  useDocumentTitle(lecture ? lectureFullTitle(lecture.meta) : "Not found");
  const progress = useProgress();

  if (!lecture) return <NotFoundPage />;
  if (!isReady(lecture)) return <LectureUnavailable meta={lecture.meta} />;

  const { meta, content } = lecture;
  const position = lectures.findIndex((l) => l.meta.id === meta.id);
  const previous = lectures.slice(0, position).reverse().find(isReady);
  const next = lectures.slice(position + 1).find(isReady);
  const best = progress[meta.id]?.bestScore;

  const toc = [
    { id: "key-terms", title: "Key terms" },
    ...content.sections.map((s) => ({ id: s.id, title: s.title })),
    { id: "takeaways", title: "Exam takeaways" },
    { id: "essay-prep", title: "Essay and short answer" },
    { id: "checklist", title: "Revision checklist" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <header className="border-b border-line pb-10 pt-10 md:pt-14">
        <Link to="/" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-ink-muted hover:text-ink">
          <ArrowLeft aria-hidden size={16} strokeWidth={1.75} />
          All lectures
        </Link>
        <p className="mt-4 font-mono text-sm font-semibold text-accent-text">{lectureLabel(meta)}</p>
        <h1 className="mt-2 text-4xl font-semibold leading-[1.08] sm:text-5xl">{meta.title}</h1>
        <div className="mt-5 grid grid-cols-1 max-w-[68ch] gap-3 text-lg leading-relaxed text-ink-muted">
          {content.overview.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <ButtonLink to={`/lectures/${meta.slug}/quiz`}>
            <ListChecks aria-hidden size={18} strokeWidth={1.75} />
            Take the quiz
          </ButtonLink>
          <span className="text-sm text-ink-muted">
            {REQUIRED_MCQ_COUNT} questions
            {best !== undefined && `, your best is ${best}/${REQUIRED_MCQ_COUNT}`}
          </span>
        </div>
      </header>

      <div className="grid gap-10 py-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14">
        <nav aria-label="On this page" className="hidden lg:block">
          <div className="sticky top-24">
            <p className="text-sm font-semibold">On this page</p>
            <ol className="mt-3 grid grid-cols-1 gap-0.5 border-l border-line text-sm">
              {toc.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="-ml-px block border-l border-transparent py-1.5 pl-4 text-ink-muted hover:border-accent hover:text-ink"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>

        <article className="min-w-0 max-w-[72ch]">
          <section aria-labelledby="objectives" className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
            <h2 id="objectives" className="text-lg font-semibold">
              Learning objectives
            </h2>
            <ul className="mt-3 grid grid-cols-1 gap-2 pl-5 leading-relaxed marker:text-accent-text">
              {content.objectives.map((o) => (
                <li key={o.id} className="list-disc pl-1">
                  {o.text}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="key-terms" className="mt-12">
            <SectionHeading id="key-terms">Key terms</SectionHeading>
            <dl className="mt-5 grid gap-3 sm:grid-cols-2">
              {content.keyTerms.map((t) => (
                <div key={t.term} className="rounded-2xl border border-line bg-surface p-4">
                  <dt className="font-semibold">{t.term}</dt>
                  <dd className="mt-1 text-[0.95rem] leading-relaxed text-ink-muted">{t.definition}</dd>
                </div>
              ))}
            </dl>
          </section>

          {content.sections.map((section) => (
            <section key={section.id} aria-labelledby={section.id} className="mt-14">
              <SectionHeading id={section.id}>{section.title}</SectionHeading>
              <div className="mt-5 grid grid-cols-1 gap-5">
                {section.blocks.map((block, i) => (
                  <ContentBlockView key={i} block={block} />
                ))}
              </div>
            </section>
          ))}

          <section aria-labelledby="takeaways" className="mt-14 rounded-2xl bg-accent-soft/50 p-5 sm:p-7">
            <SectionHeading id="takeaways">Exam takeaways</SectionHeading>
            <ol className="mt-5 grid grid-cols-1 gap-3">
              {content.takeaways.map((t, i) => (
                <li key={t} className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-2 leading-relaxed">
                  <span aria-hidden className="font-mono text-sm font-semibold leading-7 text-accent-text">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="essay-prep" className="mt-14">
            <SectionHeading id="essay-prep">Essay and short answer</SectionHeading>
            <p className="mt-2 text-ink-muted">
              Practice questions written from the lecture. They are for preparation and are not guaranteed exam
              questions. Try answering before opening the model answer.
            </p>
            <div className="mt-5 grid grid-cols-1 gap-4">
              {content.essays.map((essay, i) => (
                <EssayCard key={essay.id} essay={essay} number={i + 1} />
              ))}
            </div>
          </section>

          <section aria-labelledby="checklist" className="mt-14">
            <SectionHeading id="checklist">Revision checklist</SectionHeading>
            <div className="mt-4">
              <Checklist lectureId={meta.id} items={content.checklist} />
            </div>
          </section>

          <section className="mt-14 flex flex-col items-start gap-4 rounded-2xl border border-line bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Ready to test yourself?</h2>
              <p className="mt-1 text-ink-muted">Twenty questions, one at a time, with explanations at the end.</p>
            </div>
            <ButtonLink to={`/lectures/${meta.slug}/quiz`}>Take the quiz</ButtonLink>
          </section>

          <nav aria-label="Lecture navigation" className="mt-10 grid gap-3 sm:grid-cols-2">
            {previous ? (
              <Link
                to={`/lectures/${previous.meta.slug}`}
                className="rounded-2xl border border-line p-4 hover:border-line-strong"
              >
                <span className="flex items-center gap-1 text-sm text-ink-muted">
                  <ArrowLeft aria-hidden size={14} strokeWidth={1.75} /> Previous
                </span>
                <span className="mt-1 block font-semibold">{lectureFullTitle(previous.meta)}</span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link
                to={`/lectures/${next.meta.slug}`}
                className="rounded-2xl border border-line p-4 text-right hover:border-line-strong"
              >
                <span className="flex items-center justify-end gap-1 text-sm text-ink-muted">
                  Next <ArrowRight aria-hidden size={14} strokeWidth={1.75} />
                </span>
                <span className="mt-1 block font-semibold">{lectureFullTitle(next.meta)}</span>
              </Link>
            )}
          </nav>
        </article>
      </div>
    </div>
  );
}
