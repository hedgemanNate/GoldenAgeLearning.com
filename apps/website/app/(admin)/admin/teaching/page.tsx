"use client";

import { useState } from "react";
import Link from "next/link";

// ─── Class manifest ────────────────────────────────────────────────────────────
// This is the source of truth for the Teaching page.
// Add a new entry here each time a new class is ready for teaching assets.
// Set each asset's href when its page is built; leave it null when not yet built.
interface ClassEntry {
  name: string;
  category: string;
  duration: string;
  assets: {
    slides: string | null;
    quiz: string | null;
    worksheet: string | null;
    script: string | null;
    answers: string | null;
  };
}

const CLASSES: ClassEntry[] = [
  {
    name: "Master the Keyboard",
    category: "Smartphone Basics",
    duration: "90m",
    assets: {
      slides: null,
      quiz: "/admin/teaching/master-the-keyboard/quiz",
      worksheet: "/admin/teaching/master-the-keyboard/worksheet",
      script: "/admin/teaching/master-the-keyboard/script",
      answers: "/admin/teaching/master-the-keyboard/answers",
    },
  },
];
// ──────────────────────────────────────────────────────────────────────────────

interface AssetButton {
  label: string;
  href: string | null;
  active: boolean;
  comingSoon?: boolean;
}

function makeButtons(entry: ClassEntry): AssetButton[] {
  return [
    { label: "Slides",           href: entry.assets.slides,     active: !!entry.assets.slides },
    { label: "Quiz",             href: entry.assets.quiz,        active: !!entry.assets.quiz },
    { label: "Quiz Answers",     href: entry.assets.answers,    active: !!entry.assets.answers },
    { label: "Worksheet",        href: entry.assets.worksheet,   active: !!entry.assets.worksheet },
    { label: "Teacher's Script", href: entry.assets.script,     active: !!entry.assets.script },
    { label: "Game",             href: null,                     active: false, comingSoon: true },
  ];
}

function ClassCard({ entry }: { entry: ClassEntry }) {
  const buttons = makeButtons(entry);

  return (
    <div className="bg-[var(--color-dark-surface)] rounded-[10px] border border-[rgba(245,237,214,0.07)] px-[24px] py-[20px]">
      <div className="mb-[18px]">
        <h2 className="font-display text-[17px] font-bold text-[var(--color-cream)] leading-snug">
          {entry.name}
        </h2>
        <p className="text-[12px] text-[rgba(245,237,214,0.4)] mt-[3px]">
          {entry.category}{entry.duration ? ` · ${entry.duration}` : ""}
        </p>
      </div>

      <div className="flex items-center gap-[10px] flex-wrap">
        {buttons.map((btn) =>
          btn.comingSoon ? (
            <span
              key={btn.label}
              title="Coming soon"
              className="inline-flex items-center gap-[6px] px-[14px] py-[7px] rounded-[6px] font-sans text-[12px] font-medium bg-[rgba(245,237,214,0.04)] text-[rgba(245,237,214,0.2)] border border-[rgba(245,237,214,0.06)] cursor-default select-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-[11px] h-[11px] flex-shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              {btn.label}
            </span>
          ) : btn.active && btn.href ? (
            <Link
              key={btn.label}
              href={btn.href}
              className="inline-flex items-center px-[14px] py-[7px] rounded-[6px] font-sans text-[12px] font-semibold bg-[var(--color-gold)] text-[var(--color-dark-bg)] hover:brightness-110 transition"
            >
              {btn.label}
            </Link>
          ) : (
            <span
              key={btn.label}
              title="Not yet available"
              className="inline-flex items-center px-[14px] py-[7px] rounded-[6px] font-sans text-[12px] font-medium bg-[rgba(245,237,214,0.04)] text-[rgba(245,237,214,0.2)] border border-[rgba(245,237,214,0.06)] cursor-not-allowed select-none"
            >
              {btn.label}
            </span>
          )
        )}
      </div>
    </div>
  );
}

export default function AdminTeaching() {
  const [search, setSearch] = useState("");

  const filtered = CLASSES.filter((c) =>
    !search.trim() || c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-[32px] font-sans">
      <div className="mb-[28px]">
        <h1 className="font-display text-[28px] font-bold text-[var(--color-cream)]">Teaching</h1>
        <p className="text-[13px] text-[rgba(245,237,214,0.45)] mt-[4px]">
          Slide decks, quizzes, worksheets, and games for each class.
        </p>
      </div>

      <div className="mb-[24px]">
        <input
          type="text"
          placeholder="Search classes…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-[var(--color-dark-surface)] border border-[rgba(245,237,214,0.1)] rounded-[6px] px-[12px] py-[7px] text-[13px] text-[var(--color-cream)] placeholder-[rgba(245,237,214,0.3)] focus:outline-none focus:border-[var(--color-gold)] w-[260px]"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-[13px] text-[rgba(245,237,214,0.3)] py-[32px] text-center">
          No classes match your search.
        </p>
      ) : (
        <div className="flex flex-col gap-[12px]">
          {filtered.map((entry) => (
            <ClassCard key={entry.name} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}
