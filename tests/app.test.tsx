import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { App } from "../src/App";
import { ThemeProvider } from "../src/app/ThemeProvider";
import { LectureCard } from "../src/components/LectureCard";
import { EDUCATIONAL_NOTICE } from "../src/components/Layout";
import { makeMeta } from "./fixtures";

function renderAt(path: string) {
  return render(
    <ThemeProvider>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </ThemeProvider>,
  );
}

describe("routes", () => {
  it("renders the home page with owner, course, exam details and every lecture", () => {
    renderAt("/");
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getAllByText(/Ali Feras Alghanim/).length).toBeGreaterThan(0);
    expect(screen.getByText("CS526: Mobile Application Development")).toBeInTheDocument();
    expect(screen.getByText("Monday, October 26, 2026")).toBeInTheDocument();
    expect(screen.getByText("12:00 PM")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /^Review / })).toHaveLength(8);
    expect(screen.getAllByRole("link", { name: /^Quiz on / })).toHaveLength(8);
    expect(screen.getByText(EDUCATIONAL_NOTICE)).toBeInTheDocument();
  });

  it("renders a nested lecture review route", () => {
    renderAt("/lectures/05");
    expect(screen.getByRole("heading", { level: 1, name: "Intents" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Essay and short answer" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Revision checklist" })).toBeInTheDocument();
  });

  it("renders a quiz route", () => {
    renderAt("/lectures/07-part-2/quiz");
    expect(screen.getByText("Question 1")).toBeInTheDocument();
    expect(screen.getByText("of 20")).toBeInTheDocument();
  });

  it("renders the essay preparation page", () => {
    renderAt("/essays");
    expect(screen.getByRole("heading", { level: 1, name: /Essay and short-answer practice/ })).toBeInTheDocument();
  });

  it("shows a not-found page for unknown routes and lectures", () => {
    renderAt("/lectures/99");
    expect(screen.getByRole("heading", { name: "This page does not exist" })).toBeInTheDocument();
  });
});

describe("unavailable lectures", () => {
  it("shows a coming-soon card without review or quiz actions", () => {
    render(
      <MemoryRouter>
        <LectureCard lecture={{ meta: makeMeta({ status: "coming-soon", title: "Broadcast Receivers" }), content: null }} />
      </MemoryRouter>,
    );
    expect(screen.getByText("Coming soon")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Broadcast Receivers" })).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
