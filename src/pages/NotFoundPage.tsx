import { ArrowLeft } from "lucide-react";
import { ButtonLink } from "../components/ui/Button";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export function NotFoundPage() {
  useDocumentTitle("Page not found");
  return (
    <section className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <p className="font-mono text-sm font-semibold text-accent-text">404</p>
      <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">This page does not exist</h1>
      <p className="mt-4 text-ink-muted">The link may be out of date. Every lecture is listed on the home page.</p>
      <div className="mt-8">
        <ButtonLink to="/" variant="secondary">
          <ArrowLeft aria-hidden size={18} strokeWidth={1.75} />
          All lectures
        </ButtonLink>
      </div>
    </section>
  );
}
