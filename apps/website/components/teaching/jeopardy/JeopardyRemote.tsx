"use client";

// Instructor remote control for the Jeopardy! game.
// All writes go through the `onWrite` prop — no direct Firebase calls here.
//
// Design rule (matches Family Feud Remote): controls that are inapplicable to
// the current phase are rendered at reduced opacity + non-interactive, not hidden.
// This gives the instructor a mental model of what just happened and what comes next.

import { useCallback, useEffect, useRef, useState } from "react";
import type { GameInstanceWithId } from "../../../types/game";
import type { JeopardyClue, JeopardyGameState } from "../../../types/game";
import {
  beginStarting,
  beginBoard,
  selectClue,
  markCorrect,
  markWrong,
  markTimeExpired,
  returnToBoard,
  beginDDWager,
  confirmDDWager,
  markDDCorrect,
  markDDWrong,
  markDDTimeExpired,
  beginFinalJeopardyIntro,
  beginFJCategory,
  beginFJWager,
  confirmFJWager,
  beginFJJudging,
  markFJCorrect,
  markFJWrong,
  endGame,
  getCategories,
  validateDDWager,
  validateFJWager,
} from "../../../lib/games/jeopardy";

// ─── Brand palette ────────────────────────────────────────────────────────────

const BG = "#252D32";
const CARD = "#1E272C";
const GOLD = "#EC8B24";
const CREAM = "#FAF5C9";
const MUTED = "#C8C199";
const JBLUE = "#060CE8";
const JDARK = "#0A0A9A";
const USED = "#1a1a2e";

const POINT_VALUES = [200, 400, 600, 800, 1000] as const;

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  game: GameInstanceWithId;
  state: JeopardyGameState;
  onWrite: (s: JeopardyGameState) => Promise<void>;
  busy: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function JeopardyRemote({ game, state, onWrite, busy }: Props) {
  const write = useCallback(async (s: JeopardyGameState) => {
    if (busy) return;
    await onWrite(s);
  }, [busy, onWrite]);

  const phase = state.phase;
  const categories = getCategories(state.clues);

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: BG,
      color: CREAM,
      fontFamily: "system-ui, sans-serif",
      padding: "24px 16px",
      boxSizing: "border-box",
    }}>
      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ fontSize: "20px", fontWeight: 700, color: GOLD }}>{game.name}</div>
        <div style={{ fontSize: "13px", color: MUTED, marginTop: "2px" }}>Jeopardy! Remote</div>
        <div style={{
          display: "inline-block",
          marginTop: "8px",
          padding: "3px 10px",
          backgroundColor: "rgba(236,139,36,0.12)",
          border: `1px solid rgba(236,139,36,0.3)`,
          borderRadius: "12px",
          fontSize: "12px",
          color: GOLD,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}>
          {phase}
        </div>
      </div>

      {/* Score strip */}
      <ScoreStrip score={state.currentScore} />

      {/* Phase-specific controls */}
      {phase === "idle" && (
        <IdleControls state={state} write={write} busy={busy} />
      )}
      {phase === "starting" && (
        <StartingControls state={state} write={write} busy={busy} />
      )}
      {phase === "board" && (
        <BoardControls state={state} write={write} busy={busy} categories={categories} />
      )}
      {(phase === "clue") && (
        <ClueControls state={state} write={write} busy={busy} />
      )}
      {(phase === "correct" || phase === "wrong" || phase === "time-expired") && (
        <ResultControls state={state} write={write} busy={busy} />
      )}
      {phase === "daily-double-reveal" && (
        <DDRevealControls state={state} write={write} busy={busy} />
      )}
      {phase === "daily-double-wager" && (
        <DDWagerControls state={state} write={write} busy={busy} />
      )}
      {phase === "daily-double-clue" && (
        <DDClueControls state={state} write={write} busy={busy} />
      )}
      {(phase === "daily-double-correct" || phase === "daily-double-wrong" || phase === "daily-double-time-expired") && (
        <DDResultControls state={state} write={write} busy={busy} />
      )}
      {phase === "board-complete" && (
        <BoardCompleteControls state={state} write={write} busy={busy} />
      )}
      {phase === "final-jeopardy-intro" && (
        <FJIntroControls state={state} write={write} busy={busy} />
      )}
      {phase === "final-jeopardy-category" && (
        <FJCategoryControls state={state} write={write} busy={busy} />
      )}
      {phase === "final-jeopardy-wager" && (
        <FJWagerControls state={state} write={write} busy={busy} />
      )}
      {phase === "final-jeopardy-clue" && (
        <FJClueWaitControls />
      )}
      {phase === "final-jeopardy-judging" && (
        <FJJudgingControls state={state} write={write} busy={busy} />
      )}
      {(phase === "final-jeopardy-correct" || phase === "final-jeopardy-wrong") && (
        <FJResultControls state={state} write={write} busy={busy} />
      )}
      {phase === "game-over" && (
        <GameOverDisplay state={state} />
      )}

      {/* Always-present skip to Final Jeopardy */}
      {(phase === "board" || phase === "correct" || phase === "wrong" || phase === "time-expired" ||
        phase === "daily-double-correct" || phase === "daily-double-wrong" || phase === "daily-double-time-expired") && (
        <SkipToFinalJeopardy state={state} write={write} busy={busy} />
      )}
    </div>
  );
}

// ─── Score strip ──────────────────────────────────────────────────────────────

function ScoreStrip({ score }: { score: number }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "12px 16px",
      backgroundColor: CARD,
      borderRadius: "10px",
      marginBottom: "20px",
      border: `1px solid rgba(236,139,36,0.25)`,
    }}>
      <div style={{ fontSize: "13px", color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em" }}>Score</div>
      <div style={{ fontSize: "24px", fontWeight: 700, color: GOLD }}>${score.toLocaleString()}</div>
    </div>
  );
}

// ─── Big action button ────────────────────────────────────────────────────────

function Btn({
  label,
  onClick,
  disabled = false,
  variant = "primary",
  fullWidth = true,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "success" | "danger" | "warning" | "ghost";
  fullWidth?: boolean;
}) {
  const colors: Record<string, { bg: string; border: string; text: string }> = {
    primary: { bg: "rgba(236,139,36,0.15)", border: GOLD, text: GOLD },
    success: { bg: "rgba(34,197,94,0.12)", border: "#22C55E", text: "#22C55E" },
    danger:  { bg: "rgba(239,68,68,0.12)", border: "#EF4444", text: "#EF4444" },
    warning: { bg: "rgba(245,158,11,0.12)", border: "#F59E0B", text: "#F59E0B" },
    ghost:   { bg: "transparent", border: "rgba(200,193,153,0.2)", text: MUTED },
  };
  const c = colors[variant];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: fullWidth ? "100%" : undefined,
        padding: "14px 20px",
        backgroundColor: disabled ? "rgba(255,255,255,0.04)" : c.bg,
        border: `1px solid ${disabled ? "rgba(255,255,255,0.1)" : c.border}`,
        borderRadius: "10px",
        color: disabled ? "rgba(200,193,153,0.3)" : c.text,
        fontSize: "15px",
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "system-ui, sans-serif",
        transition: "opacity 0.2s",
        opacity: disabled ? 0.5 : 1,
        boxSizing: "border-box",
      }}
    >
      {label}
    </button>
  );
}

// ─── Timer display (read-only, mirrors display page) ─────────────────────────

function TimerDisplay({ timerEndsAt, totalSeconds }: { timerEndsAt: number | null; totalSeconds: number }) {
  const [remaining, setRemaining] = useState(totalSeconds);

  useEffect(() => {
    if (!timerEndsAt) { setRemaining(totalSeconds); return; }
    const tick = () => setRemaining(Math.max(0, Math.ceil((timerEndsAt - Date.now()) / 1000)));
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [timerEndsAt, totalSeconds]);

  const urgent = remaining <= 5;
  return (
    <div style={{
      textAlign: "center",
      padding: "16px",
      backgroundColor: CARD,
      borderRadius: "10px",
      border: `1px solid ${urgent ? "#EF4444" : "rgba(255,255,255,0.1)"}`,
      marginBottom: "16px",
    }}>
      <div style={{ fontSize: "11px", color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>Time Remaining</div>
      <div style={{ fontSize: "36px", fontWeight: 700, color: urgent ? "#EF4444" : CREAM }}>{remaining}s</div>
    </div>
  );
}

// ─── Auto-advance hook for timer expiry ───────────────────────────────────────

/**
 * When the timer reaches 0, calls `onExpired` once.
 * Used in clue phases so time-expired fires automatically.
 */
function useAutoTimeExpired(
  timerEndsAt: number | null,
  onExpired: () => void,
  enabled: boolean,
) {
  const fired = useRef(false);

  useEffect(() => {
    if (!enabled || !timerEndsAt) { fired.current = false; return; }
    fired.current = false;
    const delay = Math.max(0, timerEndsAt - Date.now());
    const t = setTimeout(() => {
      if (!fired.current) {
        fired.current = true;
        onExpired();
      }
    }, delay);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerEndsAt, enabled]);
}

// ─── Phase control panels ─────────────────────────────────────────────────────

function IdleControls({ state, write, busy }: { state: JeopardyGameState; write: (s: JeopardyGameState) => Promise<void>; busy: boolean }) {
  return (
    <div>
      <Btn label="Start Game" onClick={() => write(beginStarting(state))} disabled={busy} variant="primary" />
    </div>
  );
}

function StartingControls({ state, write, busy }: { state: JeopardyGameState; write: (s: JeopardyGameState) => Promise<void>; busy: boolean }) {
  return (
    <div>
      <p style={{ fontSize: "13px", color: MUTED, marginBottom: "12px" }}>
        Category reveal is playing… Click when ready to show the board.
      </p>
      <Btn label="Begin Board" onClick={() => write(beginBoard(state))} disabled={busy} variant="primary" />
    </div>
  );
}

function BoardControls({
  state, write, busy, categories,
}: {
  state: JeopardyGameState;
  write: (s: JeopardyGameState) => Promise<void>;
  busy: boolean;
  categories: string[];
}) {
  return (
    <div>
      <div style={{ fontSize: "13px", color: MUTED, marginBottom: "12px" }}>Select a clue:</div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gridTemplateRows: "auto repeat(5, 1fr)",
        gap: "4px",
        marginBottom: "16px",
      }}>
        {/* Category headers */}
        {categories.map((name, i) => (
          <div key={i} style={{
            backgroundColor: JDARK,
            borderRadius: "4px",
            padding: "6px 4px",
            textAlign: "center",
            fontSize: "10px",
            fontWeight: 700,
            color: "#FFFFFF",
            textTransform: "uppercase",
            lineHeight: 1.2,
            letterSpacing: "0.04em",
          }}>
            {name}
          </div>
        ))}

        {/* Clue tiles */}
        {POINT_VALUES.map((value) =>
          [1, 2, 3, 4].map((cat) => {
            const clue = state.clues.find(
              (c) => c.categoryNumber === cat && c.pointValue === value,
            );
            const index = clue ? state.clues.indexOf(clue) : -1;
            const claimed = index >= 0 && state.claimedIndices.includes(index);

            return (
              <button
                key={`${cat}-${value}`}
                onClick={() => !claimed && !busy && index >= 0 && write(selectClue(state, index))}
                disabled={claimed || busy || index < 0}
                style={{
                  backgroundColor: claimed ? USED : JBLUE,
                  border: `1px solid rgba(255,255,255,${claimed ? 0.05 : 0.2})`,
                  borderRadius: "4px",
                  padding: "10px 0",
                  cursor: claimed || busy ? "not-allowed" : "pointer",
                  color: claimed ? "transparent" : GOLD,
                  fontWeight: 700,
                  fontSize: "13px",
                  transition: "opacity 0.15s",
                  opacity: claimed ? 0.4 : 1,
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                {claimed ? "" : `$${value}`}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

function ClueControls({ state, write, busy }: { state: JeopardyGameState; write: (s: JeopardyGameState) => Promise<void>; busy: boolean }) {
  const clue = state.activeClueIndex !== null ? state.clues[state.activeClueIndex] : null;

  // Auto-fire time expired when timer runs out
  useAutoTimeExpired(state.timerEndsAt, () => write(markTimeExpired(state)), !busy && state.phase === "clue");

  return (
    <div>
      {clue && (
        <div style={{ padding: "12px", backgroundColor: CARD, borderRadius: "8px", marginBottom: "16px", border: `1px solid rgba(255,255,255,0.08)` }}>
          <div style={{ fontSize: "11px", color: MUTED, marginBottom: "4px" }}>{clue.categoryName} · ${clue.pointValue.toLocaleString()}</div>
          <div style={{ fontSize: "14px", color: CREAM, lineHeight: 1.4 }}>{clue.clueText}</div>
          <div style={{ marginTop: "8px", fontSize: "12px", color: GOLD }}>Answer: {clue.correctResponse}</div>
        </div>
      )}
      <TimerDisplay timerEndsAt={state.timerEndsAt} totalSeconds={state.answerTimerSeconds} />
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <Btn label="✓  Correct" onClick={() => write(markCorrect(state))} disabled={busy} variant="success" />
        <Btn label="✗  Wrong" onClick={() => write(markWrong(state))} disabled={busy} variant="danger" />
        <Btn label="⏱  Time Expired" onClick={() => write(markTimeExpired(state))} disabled={busy} variant="warning" />
      </div>
    </div>
  );
}

function ResultControls({ state, write, busy }: { state: JeopardyGameState; write: (s: JeopardyGameState) => Promise<void>; busy: boolean }) {
  return (
    <div>
      <Btn label="Return to Board" onClick={() => write(returnToBoard(state))} disabled={busy} variant="primary" />
    </div>
  );
}

function DDRevealControls({ state, write, busy }: { state: JeopardyGameState; write: (s: JeopardyGameState) => Promise<void>; busy: boolean }) {
  // Auto-advance to wager after ~3.5 s (the DD stinger duration)
  const advanced = useRef(false);
  useEffect(() => {
    advanced.current = false;
    const t = setTimeout(() => {
      if (!advanced.current && !busy) {
        advanced.current = true;
        write(beginDDWager(state));
      }
    }, 3500);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <p style={{ fontSize: "13px", color: MUTED, marginBottom: "12px" }}>
        Daily Double stinger playing… advancing to wager automatically.
      </p>
      <Btn label="Skip to Wager" onClick={() => write(beginDDWager(state))} disabled={busy} variant="ghost" />
    </div>
  );
}

function DDWagerControls({ state, write, busy }: { state: JeopardyGameState; write: (s: JeopardyGameState) => Promise<void>; busy: boolean }) {
  const clue = state.activeClueIndex !== null ? state.clues[state.activeClueIndex] : null;
  const [wagerInput, setWagerInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const maxWager = clue?.pointValue ?? 1000;

  const handleConfirm = () => {
    const val = parseInt(wagerInput, 10);
    const err = validateDDWager(val, maxWager);
    if (err) { setError(err); return; }
    setError(null);
    write(confirmDDWager(state, val));
  };

  return (
    <div>
      {clue && (
        <div style={{ fontSize: "13px", color: MUTED, marginBottom: "12px" }}>
          Max wager: <span style={{ color: GOLD, fontWeight: 700 }}>${maxWager.toLocaleString()}</span>
        </div>
      )}
      <div style={{ marginBottom: "12px" }}>
        <input
          type="number"
          min={1}
          max={maxWager}
          value={wagerInput}
          onChange={(e) => { setWagerInput(e.target.value); setError(null); }}
          onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
          placeholder={`1 – ${maxWager}`}
          style={{
            width: "100%",
            padding: "12px 14px",
            backgroundColor: CARD,
            border: `1px solid ${error ? "#EF4444" : "rgba(255,255,255,0.15)"}`,
            borderRadius: "8px",
            color: CREAM,
            fontSize: "18px",
            fontWeight: 700,
            fontFamily: "system-ui, sans-serif",
            boxSizing: "border-box",
          }}
        />
        {error && <div style={{ marginTop: "6px", fontSize: "12px", color: "#EF4444" }}>{error}</div>}
      </div>
      <Btn label="Confirm Wager" onClick={handleConfirm} disabled={busy || !wagerInput} variant="primary" />
    </div>
  );
}

function DDClueControls({ state, write, busy }: { state: JeopardyGameState; write: (s: JeopardyGameState) => Promise<void>; busy: boolean }) {
  const clue = state.activeClueIndex !== null ? state.clues[state.activeClueIndex] : null;

  useAutoTimeExpired(state.timerEndsAt, () => write(markDDTimeExpired(state)), !busy && state.phase === "daily-double-clue");

  return (
    <div>
      {clue && (
        <div style={{ padding: "12px", backgroundColor: CARD, borderRadius: "8px", marginBottom: "16px", border: `1px solid rgba(255,255,255,0.08)` }}>
          <div style={{ fontSize: "11px", color: MUTED, marginBottom: "4px" }}>Daily Double · {clue.categoryName}</div>
          <div style={{ fontSize: "14px", color: CREAM, lineHeight: 1.4 }}>{clue.clueText}</div>
          <div style={{ marginTop: "8px", fontSize: "12px", color: GOLD }}>Answer: {clue.correctResponse}</div>
        </div>
      )}
      <div style={{ fontSize: "13px", color: MUTED, marginBottom: "12px" }}>
        Wager: <span style={{ color: GOLD, fontWeight: 700 }}>${state.currentWager.toLocaleString()}</span>
      </div>
      <TimerDisplay timerEndsAt={state.timerEndsAt} totalSeconds={state.answerTimerSeconds} />
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <Btn label="✓  Correct" onClick={() => write(markDDCorrect(state))} disabled={busy} variant="success" />
        <Btn label="✗  Wrong" onClick={() => write(markDDWrong(state))} disabled={busy} variant="danger" />
        <Btn label="⏱  Time Expired" onClick={() => write(markDDTimeExpired(state))} disabled={busy} variant="warning" />
      </div>
    </div>
  );
}

function DDResultControls({ state, write, busy }: { state: JeopardyGameState; write: (s: JeopardyGameState) => Promise<void>; busy: boolean }) {
  return (
    <div>
      <Btn label="Return to Board" onClick={() => write(returnToBoard(state))} disabled={busy} variant="primary" />
    </div>
  );
}

function BoardCompleteControls({ state, write, busy }: { state: JeopardyGameState; write: (s: JeopardyGameState) => Promise<void>; busy: boolean }) {
  return (
    <div>
      <p style={{ fontSize: "13px", color: MUTED, marginBottom: "12px" }}>All 20 clues have been answered. Ready for Final Jeopardy.</p>
      <Btn label="Begin Final Jeopardy" onClick={() => write(beginFinalJeopardyIntro(state))} disabled={busy} variant="primary" />
    </div>
  );
}

function FJIntroControls({ state, write, busy }: { state: JeopardyGameState; write: (s: JeopardyGameState) => Promise<void>; busy: boolean }) {
  return (
    <div>
      <Btn label="Show Category" onClick={() => write(beginFJCategory(state))} disabled={busy} variant="primary" />
    </div>
  );
}

function FJCategoryControls({ state, write, busy }: { state: JeopardyGameState; write: (s: JeopardyGameState) => Promise<void>; busy: boolean }) {
  return (
    <div>
      <div style={{ padding: "12px", backgroundColor: CARD, borderRadius: "8px", marginBottom: "16px" }}>
        <div style={{ fontSize: "11px", color: MUTED, marginBottom: "4px" }}>Final Jeopardy Category</div>
        <div style={{ fontSize: "16px", color: GOLD, fontWeight: 700 }}>{state.finalClue.categoryName}</div>
      </div>
      <Btn label="Show Wager Screen" onClick={() => write(beginFJWager(state))} disabled={busy} variant="primary" />
    </div>
  );
}

function FJWagerControls({ state, write, busy }: { state: JeopardyGameState; write: (s: JeopardyGameState) => Promise<void>; busy: boolean }) {
  const [wagerInput, setWagerInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = () => {
    const val = parseInt(wagerInput, 10);
    const err = validateFJWager(val, state.currentScore);
    if (err) { setError(err); return; }
    setError(null);
    write(confirmFJWager(state, val));
  };

  return (
    <div>
      <div style={{ fontSize: "13px", color: MUTED, marginBottom: "12px" }}>
        Max wager: <span style={{ color: GOLD, fontWeight: 700 }}>${state.currentScore.toLocaleString()}</span>
        <span style={{ color: "rgba(200,193,153,0.5)" }}> · Min: $0</span>
      </div>
      <div style={{ marginBottom: "12px" }}>
        <input
          type="number"
          min={0}
          max={state.currentScore}
          value={wagerInput}
          onChange={(e) => { setWagerInput(e.target.value); setError(null); }}
          onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
          placeholder={`0 – ${state.currentScore}`}
          style={{
            width: "100%",
            padding: "12px 14px",
            backgroundColor: CARD,
            border: `1px solid ${error ? "#EF4444" : "rgba(255,255,255,0.15)"}`,
            borderRadius: "8px",
            color: CREAM,
            fontSize: "18px",
            fontWeight: 700,
            fontFamily: "system-ui, sans-serif",
            boxSizing: "border-box",
          }}
        />
        {error && <div style={{ marginTop: "6px", fontSize: "12px", color: "#EF4444" }}>{error}</div>}
      </div>
      <p style={{ fontSize: "12px", color: MUTED, marginBottom: "12px" }}>
        Confirming wager starts the 30-second Final Jeopardy timer.
      </p>
      <Btn label="Confirm Wager &amp; Start Timer" onClick={handleConfirm} disabled={busy || wagerInput === ""} variant="primary" />
    </div>
  );
}

function FJClueWaitControls() {
  return (
    <div style={{
      padding: "20px",
      backgroundColor: CARD,
      borderRadius: "10px",
      textAlign: "center",
      border: `1px solid rgba(255,255,255,0.08)`,
    }}>
      <div style={{ fontSize: "15px", color: MUTED }}>Think music is playing…</div>
      <div style={{ fontSize: "13px", color: "rgba(200,193,153,0.5)", marginTop: "8px" }}>
        Timer will advance automatically when the music ends.
      </div>
    </div>
  );
}

function FJJudgingControls({ state, write, busy }: { state: JeopardyGameState; write: (s: JeopardyGameState) => Promise<void>; busy: boolean }) {
  return (
    <div>
      <div style={{ padding: "12px", backgroundColor: CARD, borderRadius: "8px", marginBottom: "16px", border: `1px solid rgba(255,255,255,0.08)` }}>
        <div style={{ fontSize: "11px", color: MUTED, marginBottom: "4px" }}>Final Jeopardy Clue</div>
        <div style={{ fontSize: "14px", color: CREAM, lineHeight: 1.4, marginBottom: "8px" }}>{state.finalClue.clueText}</div>
        <div style={{ fontSize: "12px", color: GOLD }}>Answer: {state.finalClue.correctResponse}</div>
      </div>
      <div style={{ fontSize: "13px", color: MUTED, marginBottom: "16px" }}>
        Wager: <span style={{ color: GOLD, fontWeight: 700 }}>${state.currentWager.toLocaleString()}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <Btn label="✓  Correct" onClick={() => write(markFJCorrect(state))} disabled={busy} variant="success" />
        <Btn label="✗  Wrong" onClick={() => write(markFJWrong(state))} disabled={busy} variant="danger" />
      </div>
    </div>
  );
}

function FJResultControls({ state, write, busy }: { state: JeopardyGameState; write: (s: JeopardyGameState) => Promise<void>; busy: boolean }) {
  return (
    <div>
      <div style={{
        padding: "16px",
        backgroundColor: CARD,
        borderRadius: "10px",
        marginBottom: "16px",
        textAlign: "center",
        border: `1px solid rgba(236,139,36,0.3)`,
      }}>
        <div style={{ fontSize: "13px", color: MUTED, marginBottom: "4px" }}>Final Score</div>
        <div style={{ fontSize: "32px", fontWeight: 700, color: GOLD }}>${state.currentScore.toLocaleString()}</div>
      </div>
      <Btn label="End Game &amp; Award Points" onClick={() => write(endGame(state))} disabled={busy} variant="primary" />
    </div>
  );
}

function GameOverDisplay({ state }: { state: JeopardyGameState }) {
  return (
    <div style={{
      padding: "20px",
      backgroundColor: CARD,
      borderRadius: "10px",
      textAlign: "center",
      border: `1px solid rgba(236,139,36,0.3)`,
    }}>
      <div style={{ fontSize: "15px", color: GOLD, fontWeight: 700, marginBottom: "8px" }}>Game Complete</div>
      <div style={{ fontSize: "32px", fontWeight: 700, color: CREAM }}>${state.currentScore.toLocaleString()}</div>
      <div style={{ fontSize: "12px", color: MUTED, marginTop: "8px" }}>Points awarded to all enrolled students.</div>
    </div>
  );
}

// ─── Skip to Final Jeopardy (de-emphasized) ───────────────────────────────────

function SkipToFinalJeopardy({ state, write, busy }: { state: JeopardyGameState; write: (s: JeopardyGameState) => Promise<void>; busy: boolean }) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div style={{ marginTop: "24px", padding: "12px", backgroundColor: CARD, borderRadius: "8px", border: `1px solid rgba(239,68,68,0.3)` }}>
        <div style={{ fontSize: "13px", color: MUTED, marginBottom: "10px" }}>
          Skip remaining clues and go straight to Final Jeopardy?
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => { write(beginFinalJeopardyIntro(state)); setConfirming(false); }}
            disabled={busy}
            style={{
              flex: 1,
              padding: "10px",
              backgroundColor: "rgba(239,68,68,0.12)",
              border: "1px solid #EF4444",
              borderRadius: "8px",
              color: "#EF4444",
              fontSize: "13px",
              fontWeight: 600,
              cursor: busy ? "not-allowed" : "pointer",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Yes, skip
          </button>
          <button
            onClick={() => setConfirming(false)}
            style={{
              flex: 1,
              padding: "10px",
              backgroundColor: "transparent",
              border: "1px solid rgba(200,193,153,0.2)",
              borderRadius: "8px",
              color: MUTED,
              fontSize: "13px",
              cursor: "pointer",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: "24px", opacity: 0.4 }}>
      <Btn label="Skip to Final Jeopardy…" onClick={() => setConfirming(true)} disabled={busy} variant="ghost" />
    </div>
  );
}
