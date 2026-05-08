"use client";

import { useState } from "react";
import Link from "next/link";
import { useTeachingSession } from "../../../../../../hooks/useTeachingSession";
import { textingAndMessagingSlides } from "../_slides/content";

const CLASS_SLUG = "texting-and-messaging";
const TOTAL_SLIDES = textingAndMessagingSlides.length;
const titleSlide = textingAndMessagingSlides[0];

export default function TextingAndMessagingSlidesLaunch() {
  const {
    session,
    loading,
    isActive,
    start,
    end,
    next,
    previous,
    goToSlide,
    setMode,
    ownerId,
  } = useTeachingSession();
  const [busy, setBusy] = useState(false);

  if (loading) {
    return (
      <Shell>
        <p style={{ color: "rgba(245,237,214,0.5)" }}>Loading session…</p>
      </Shell>
    );
  }

  if (!ownerId) {
    return (
      <Shell>
        <p style={{ color: "rgba(245,237,214,0.7)" }}>
          You must be signed in as a staff member to start a teaching session.
        </p>
      </Shell>
    );
  }

  if (!isActive) {
    return (
      <Shell>
        <h2
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "#f5edd6",
            margin: "0 0 8px 0",
          }}
        >
          Start Teaching Session
        </h2>
        <p
          style={{
            color: "rgba(245,237,214,0.6)",
            fontSize: 14,
            margin: "0 0 20px 0",
          }}
        >
          This will create a live session you can drive from any teaching page.
          Open the display URL on the projector or classroom computer to bind
          it to your session.
        </p>
        <button
          onClick={async () => {
            setBusy(true);
            try {
              await start({
                classSlug: CLASS_SLUG,
                totalSlides: TOTAL_SLIDES,
              });
            } finally {
              setBusy(false);
            }
          }}
          disabled={busy}
          style={primaryBtn(busy)}
        >
          {busy ? "Starting…" : "Start Session"}
        </button>
      </Shell>
    );
  }

  const displayUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/admin/teaching/${CLASS_SLUG}/slides/display?owner=${ownerId}`
      : "";

  return (
    <Shell>
      <h2
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: "#f5edd6",
          margin: "0 0 4px 0",
        }}
      >
        Session Active
      </h2>
      <p
        style={{
          color: "rgba(245,237,214,0.6)",
          fontSize: 13,
          margin: "0 0 20px 0",
        }}
      >
        Mode:{" "}
        <strong style={{ color: "#c9a84c" }}>
          {session?.mode === "slides" ? "Slides" : "Game"}
        </strong>
        {session?.mode === "slides" && (
          <>
            {" · "}
            Slide {(session?.currentSlide ?? 0) + 1} of {TOTAL_SLIDES}
          </>
        )}
        {" · "}
        Display:{" "}
        {session?.displayBindId ? (
          <span style={{ color: "#7aaead" }}>● connected</span>
        ) : (
          <span style={{ color: "rgba(245,237,214,0.4)" }}>○ not bound</span>
        )}
      </p>

      {/* Display URL */}
      <div
        style={{
          backgroundColor: "rgba(245,237,214,0.04)",
          border: "1px solid rgba(245,237,214,0.1)",
          borderRadius: 8,
          padding: 14,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: "rgba(245,237,214,0.5)",
            marginBottom: 6,
          }}
        >
          Open on the display computer
        </div>
        <div
          style={{
            fontFamily: "ui-monospace, monospace",
            fontSize: 12,
            color: "#f5edd6",
            wordBreak: "break-all",
            marginBottom: 10,
          }}
        >
          {displayUrl}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => navigator.clipboard.writeText(displayUrl)}
            style={secondaryBtn()}
          >
            Copy URL
          </button>
          <a
            href={displayUrl}
            target="_blank"
            rel="noreferrer"
            style={{ ...secondaryBtn(), textDecoration: "none" }}
          >
            Open Display
          </a>
        </div>
      </div>

      {/* Mode + slide controls */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button
          onClick={() => setMode("slides")}
          style={modeBtn(session?.mode === "slides")}
        >
          Slides Mode
        </button>
        <button
          onClick={() => setMode("game")}
          style={modeBtn(session?.mode === "game")}
        >
          Game Mode
        </button>
      </div>

      {session?.mode === "slides" && (
        <>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <button
              onClick={previous}
              disabled={(session?.currentSlide ?? 0) <= 0}
              style={navBtn((session?.currentSlide ?? 0) <= 0)}
            >
              ← Previous
            </button>
            <button
              onClick={next}
              disabled={(session?.currentSlide ?? 0) >= TOTAL_SLIDES - 1}
              style={navBtn((session?.currentSlide ?? 0) >= TOTAL_SLIDES - 1)}
            >
              Next →
            </button>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: 6,
              marginBottom: 20,
            }}
          >
            {Array.from({ length: TOTAL_SLIDES }, (_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                style={{
                  backgroundColor:
                    i === session?.currentSlide
                      ? "#c9a84c"
                      : "rgba(245,237,214,0.06)",
                  color: i === session?.currentSlide ? "#1a2329" : "#f5edd6",
                  border: "none",
                  borderRadius: 6,
                  padding: "10px 0",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Quick links */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 20,
        }}
      >
        <Link href={`/admin/teaching/${CLASS_SLUG}/script`} style={linkBtn()}>
          Open Teacher&apos;s Script
        </Link>
        <Link href={`/admin/teaching/${CLASS_SLUG}/answers`} style={linkBtn()}>
          Open Quiz Answers
        </Link>
        <Link href={`/admin/teaching/${CLASS_SLUG}/game`} style={linkBtn()}>
          Open Game
        </Link>
      </div>

      <button
        onClick={async () => {
          if (!confirm("End this teaching session?")) return;
          setBusy(true);
          try {
            await end();
          } finally {
            setBusy(false);
          }
        }}
        disabled={busy}
        style={dangerBtn(busy)}
      >
        End Session
      </button>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: 32,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#f5edd6",
            margin: "0 0 4px 0",
          }}
        >
          {titleSlide.title} &mdash; Slides
        </h1>
        <p
          style={{
            fontSize: 13,
            color: "rgba(245,237,214,0.4)",
            margin: "0 0 24px 0",
          }}
        >
          {titleSlide.classLabel}
        </p>
        {children}
      </div>
    </div>
  );
}

function primaryBtn(disabled: boolean): React.CSSProperties {
  return {
    backgroundColor: "#c9a84c",
    color: "#1a2329",
    border: "none",
    borderRadius: 8,
    padding: "12px 22px",
    fontSize: 14,
    fontWeight: 700,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
  };
}

function secondaryBtn(): React.CSSProperties {
  return {
    backgroundColor: "rgba(245,237,214,0.08)",
    color: "#f5edd6",
    border: "1px solid rgba(245,237,214,0.15)",
    borderRadius: 6,
    padding: "8px 14px",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
  };
}

function modeBtn(active: boolean | undefined): React.CSSProperties {
  return {
    flex: 1,
    backgroundColor: active ? "#c9a84c" : "rgba(245,237,214,0.06)",
    color: active ? "#1a2329" : "#f5edd6",
    border: "none",
    borderRadius: 8,
    padding: "10px 16px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  };
}

function navBtn(disabled: boolean): React.CSSProperties {
  return {
    flex: 1,
    backgroundColor: "rgba(245,237,214,0.08)",
    color: disabled ? "rgba(245,237,214,0.3)" : "#f5edd6",
    border: "none",
    borderRadius: 8,
    padding: "10px 16px",
    fontSize: 13,
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
  };
}

function linkBtn(): React.CSSProperties {
  return {
    backgroundColor: "transparent",
    color: "#c9a84c",
    border: "1px solid rgba(201,168,76,0.4)",
    borderRadius: 6,
    padding: "8px 14px",
    fontSize: 12,
    fontWeight: 600,
    textDecoration: "none",
  };
}

function dangerBtn(disabled: boolean): React.CSSProperties {
  return {
    backgroundColor: "transparent",
    color: "#ff6568",
    border: "1px solid rgba(228,0,20,0.4)",
    borderRadius: 8,
    padding: "10px 18px",
    fontSize: 13,
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
  };
}
