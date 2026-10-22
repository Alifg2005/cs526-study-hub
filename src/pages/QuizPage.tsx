import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router";
import { LectureUnavailable } from "../components/LectureUnavailable";
import { QuizRunner } from "../components/quiz/QuizRunner";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { getLectureBySlug, isReady, lectureFullTitle, lectureLabel } from "../lib/lectures";
import { NotFoundPage } from "./NotFoundPage";

export function QuizPage() {
  const { slug } = useParams();
  const lecture = getLectureBySlug(slug);
  useDocumentTitle(lecture ? `Quiz: ${lectureFullTitle(lecture.meta)}` : "Not found");

  if (!lecture) return <NotFoundPage />;
  if (!isReady(lecture)) return <LectureUnavailable meta={lecture.meta} />;

  const { meta, content } = lecture;
  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
      <header className="pb-8 pt-10">
        <Link
          to={`/lectures/${meta.slug}`}
          className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-ink-muted hover:text-ink"
        >
          <ArrowLeft aria-hidden size={16} strokeWidth={1.75} />
          Back to review
        </Link>
        <p className="mt-3 font-mono text-sm font-semibold text-accent-text">{lectureLabel(meta)} quiz</p>
        <h1 className="mt-1 text-3xl font-semibold sm:text-4xl">{lectureFullTitle(meta)}</h1>
        <p className="mt-2 text-ink-muted">Self-study practice. Answers are revealed after you submit.</p>
      </header>
      {/* Keyed by lecture so moving between quizzes starts a fresh session. */}
      <QuizRunner key={meta.id} meta={meta} questions={content.quiz} />
    </div>
  );
}
