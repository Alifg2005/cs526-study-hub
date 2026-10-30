import { useEffect } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "../lib/cn";

export const EDUCATIONAL_NOTICE =
  "Independent student study resource for CS526. Course materials remain the property of their respective rights holders. This website provides original study notes and practice questions and is not an official university website. AI-assisted content; verify with your course materials.";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
}

const navClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "inline-flex min-h-11 items-center rounded-full px-3.5 text-sm font-semibold transition-colors",
    isActive ? "bg-surface-2 text-ink" : "text-ink-muted hover:text-ink",
  );

export function Layout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <ScrollToTop />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-contrast"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur-md supports-[not(backdrop-filter:blur(1px))]:bg-bg">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link to="/" className="group flex items-center gap-2.5 rounded-full pr-2" aria-label="CS526 Study Hub home">
            <span className="grid grid-cols-1 size-9 place-items-center rounded-xl bg-accent font-mono text-xs font-bold text-accent-contrast">
              526
            </span>
            <span className="hidden font-display text-[1.05rem] font-semibold tracking-tight sm:inline">Study Hub</span>
          </Link>
          <nav aria-label="Main" className="flex items-center gap-1">
            <NavLink to="/" end className={navClass}>
              Lectures
            </NavLink>
            <NavLink to="/essays" className={navClass}>
              Essay prep
            </NavLink>
            <span className="ml-1">
              <ThemeToggle />
            </span>
          </nav>
        </div>
      </header>

      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <Outlet />
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto grid max-w-6xl gap-3 px-4 py-8 text-sm text-ink-muted sm:px-6 md:grid-cols-[1fr_auto] md:items-end">
          <p className="max-w-[70ch] leading-relaxed">{EDUCATIONAL_NOTICE}</p>
          <p className="font-medium text-ink">Ali Feras Alghanim, CS526</p>
        </div>
      </footer>
    </div>
  );
}
