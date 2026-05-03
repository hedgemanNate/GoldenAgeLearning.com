"use client";

import { useTeachingSession } from "../../hooks/useTeachingSession";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

// Floating teaching session controller. Mounts on script / answers / game
// pages once an active session exists, and drives the bound display.
export function SessionControllerOverlay({ classSlug }: { classSlug: string }) {
  const { session, isActive, next, previous, goToSlide, setMode, end } =
    useTeachingSession();
  const [open, setOpen] = useState(true);
  const [showJump, setShowJump] = useState(false);
  const pathname = usePathname();

  if (!isActive || !session) return null;
  if (session.classSlug !== classSlug) return null;

  const onScript = pathname?.endsWith("/script");
  const onAnswers = pathname?.endsWith("/answers");
  const onGame = pathname?.endsWith("/game");

  return (
    <div
      style={{
        position: "fixed",
        bottom: 16,
        right: 16,
        zIndex: 9999,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {open ? (
        <div
          style={{
            backgroundColor: "#1a2329",
            color: "#f5edd6",
            border: "1px solid rgba(245,237,214,0.15)",
            borderRadius: 12,
            padding: 14,
            minWidth: 280,
            boxShadow: "0 8px 24px rgba(0,0,0,0.45)",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <div>
              <div style={{ fontSize: 11, color: "rgba(245,237,214,0.5)" }}>
                Teaching Session
              </div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>
                {session.mode === "slides"
                  ? `Slide ${session.currentSlide + 1} of ${session.totalSlides}`
                  : "Game Mode"}
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Hide controller"
              style={{
                background: "transparent",
                border: "none",
                color: "rgba(245,237,214,0.5)",
                cursor: "pointer",
                fontSize: 18,
                padding: 4,
              }}
            >
              ▾
            </button>
          </div>

          {/* Mode toggle */}
          <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
            <button
              onClick={() => setMode("slides")}
              style={modeBtn(session.mode === "slides")}
            >
              Slides
            </button>
            <button
              onClick={() => setMode("game")}
              style={modeBtn(session.mode === "game")}
            >
              Game
            </button>
          </div>

          {/* Slide nav (only relevant in slides mode) */}
          {session.mode === "slides" && (
            <>
              <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                <button
                  onClick={previous}
                  disabled={session.currentSlide <= 0}
                  style={navBtn(session.currentSlide <= 0)}
                >
                  ← Prev
                </button>
                <button
                  onClick={next}
                  disabled={session.currentSlide >= session.totalSlides - 1}
                  style={navBtn(session.currentSlide >= session.totalSlides - 1)}
                >
                  Next →
                </button>
                <button
                  onClick={() => setShowJump((v) => !v)}
                  style={navBtn(false)}
                >
                  Jump
                </button>
              </div>
              {showJump && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(6, 1fr)",
                    gap: 4,
                    marginBottom: 10,
                  }}
                >
                  {Array.from({ length: session.totalSlides }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => goToSlide(i)}
                      style={{
                        backgroundColor:
                          i === session.currentSlide
                            ? "#c9a84c"
                            : "rgba(245,237,214,0.08)",
                        color:
                          i === session.currentSlide ? "#1a2329" : "#f5edd6",
                        border: "none",
                        borderRadius: 4,
                        padding: "6px 0",
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Quick page links */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              marginBottom: 10,
            }}
          >
            <PageLink
              href={`/admin/teaching/${classSlug}/script`}
              active={!!onScript}
              label="Script"
            />
            <PageLink
              href={`/admin/teaching/${classSlug}/answers`}
              active={!!onAnswers}
              label="Quiz Answers"
            />
            <PageLink
              href={`/admin/teaching/${classSlug}/game`}
              active={!!onGame}
              label="Game"
            />
          </div>

          {/* Display status + end */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: 11,
              color: "rgba(245,237,214,0.5)",
            }}
          >
            <span>
              Display:{" "}
              {session.displayBindId ? (
                <span style={{ color: "#7aaead" }}>● connected</span>
              ) : (
                <span style={{ color: "rgba(245,237,214,0.4)" }}>
                  ○ not bound
                </span>
              )}
            </span>
            <button
              onClick={() => {
                if (confirm("End this teaching session?")) end();
              }}
              style={{
                background: "transparent",
                border: "1px solid rgba(228,0,20,0.4)",
                color: "#ff6568",
                borderRadius: 4,
                padding: "3px 8px",
                fontSize: 11,
                cursor: "pointer",
              }}
            >
              End
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          style={{
            backgroundColor: "#c9a84c",
            color: "#1a2329",
            border: "none",
            borderRadius: 999,
            padding: "10px 16px",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          }}
        >
          🎛 Controller
        </button>
      )}
    </div>
  );
}

function modeBtn(active: boolean): React.CSSProperties {
  return {
    flex: 1,
    backgroundColor: active ? "#c9a84c" : "rgba(245,237,214,0.06)",
    color: active ? "#1a2329" : "#f5edd6",
    border: "none",
    borderRadius: 6,
    padding: "6px 10px",
    fontSize: 12,
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
    borderRadius: 6,
    padding: "8px 10px",
    fontSize: 12,
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
  };
}

function PageLink({
  href,
  active,
  label,
}: {
  href: string;
  active: boolean;
  label: string;
}) {
  return (
    <Link
      href={href}
      style={{
        backgroundColor: active ? "rgba(201,168,76,0.18)" : "transparent",
        color: active ? "#c9a84c" : "rgba(245,237,214,0.7)",
        border: "1px solid rgba(245,237,214,0.15)",
        borderRadius: 4,
        padding: "4px 8px",
        fontSize: 11,
        fontWeight: 600,
        textDecoration: "none",
      }}
    >
      {label}
    </Link>
  );
}
