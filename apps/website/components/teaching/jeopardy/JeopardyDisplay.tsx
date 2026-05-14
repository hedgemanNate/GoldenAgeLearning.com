"use client";

// Projector / big-screen view for the Jeopardy! game.
// Renders directly from JeopardyGameState — no internal phase logic.
// All transitions are driven by the instructor remote via Firebase.
//
// Brand palette (GAL chrome):
//   Background:       #252D32
//   Gold:             #EC8B24
//   Cream:            #FAF5C9
//   Muted cream:      #C8C199
//   Card BG:          #1E272C
//
// Board tile palette (Jeopardy exception — classic show aesthetic):
//   Tile BG:          #060CE8 (Jeopardy blue)
//   Tile text:        #FFFFFF
//   Tile used:        #1A1A2E (dark, clearly spent)
//   Category header:  #0A0A9A

import { useEffect, useState } from "react";
import type { JeopardyClue, JeopardyGameState } from "../../../types/game";
import { useJeopardyAudio } from "../../../lib/games/jeopardyAudio";
import { getCategories } from "../../../lib/games/jeopardy";

const POINT_VALUES = [200, 400, 600, 800, 1000] as const;
const JEOPARDY_BLUE = "#060CE8";
const JEOPARDY_DARK = "#0A0A9A";
const TILE_USED = "#1a1a2e";
const TILE_TEXT = "#FFFFFF";
const TILE_GOLD = "#EC8B24";
const GAL_BG = "#252D32";
const GAL_CREAM = "#FAF5C9";
const GAL_MUTED = "#C8C199";
const GAL_CARD = "#1E272C";

interface Props {
  state: JeopardyGameState;
  gameName: string;
  audioEnabled: boolean;
  onStartingComplete?: () => void;
  onFinalJeopardyThinkComplete?: () => void;
}

export default function JeopardyDisplay({
  state,
  gameName,
  audioEnabled,
  onStartingComplete,
  onFinalJeopardyThinkComplete,
}: Props) {
  useJeopardyAudio(state, audioEnabled, onStartingComplete, onFinalJeopardyThinkComplete);

  const { phase } = state;

  if (phase === "idle") return <IdleScreen gameName={gameName} />;
  if (phase === "starting") return <StartingScreen state={state} />;
  if (phase === "board") return <BoardScreen state={state} />;
  if (phase === "clue") return <ClueScreen state={state} />;
  if (phase === "correct") return <ResultScreen state={state} result="correct" />;
  if (phase === "wrong") return <ResultScreen state={state} result="wrong" />;
  if (phase === "time-expired") return <ResultScreen state={state} result="time-expired" />;
  if (phase === "daily-double-reveal") return <DailyDoubleRevealScreen state={state} />;
  if (phase === "daily-double-wager") return <DailyDoubleWagerScreen state={state} />;
  if (phase === "daily-double-clue") return <DailyDoubleClueScreen state={state} />;
  if (phase === "daily-double-correct") return <DailyDoubleResultScreen state={state} result="correct" />;
  if (phase === "daily-double-wrong") return <DailyDoubleResultScreen state={state} result="wrong" />;
  if (phase === "daily-double-time-expired") return <DailyDoubleResultScreen state={state} result="time-expired" />;
  if (phase === "board-complete") return <BoardCompleteScreen state={state} />;
  if (phase === "final-jeopardy-intro") return <FJIntroScreen />;
  if (phase === "final-jeopardy-category") return <FJCategoryScreen state={state} />;
  if (phase === "final-jeopardy-wager") return <FJWagerScreen state={state} />;
  if (phase === "final-jeopardy-clue") return <FJClueScreen state={state} />;
  if (phase === "final-jeopardy-judging") return <FJJudgingScreen state={state} />;
  if (phase === "final-jeopardy-correct") return <FJResultScreen state={state} result="correct" />;
  if (phase === "final-jeopardy-wrong") return <FJResultScreen state={state} result="wrong" />;
  if (phase === "game-over") return <GameOverScreen state={state} gameName={gameName} />;

  return <IdleScreen gameName={gameName} />;
}

// ─── Full-screen wrapper ──────────────────────────────────────────────────────

function Screen({ children, bg = GAL_BG }: { children: React.ReactNode; bg?: string }) {
  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      backgroundColor: bg,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      fontFamily: "'Lato', sans-serif",
      color: GAL_CREAM,
    }}>
      {children}
    </div>
  );
}

// ─── Score badge ──────────────────────────────────────────────────────────────

function ScoreBadge({ score }: { score: number }) {
  return (
    <div style={{
      position: "absolute",
      top: "2vh",
      right: "2vw",
      backgroundColor: GAL_CARD,
      border: `2px solid ${TILE_GOLD}`,
      borderRadius: "12px",
      padding: "8px 20px",
      textAlign: "center",
    }}>
      <div style={{ fontSize: "0.8vw", color: GAL_MUTED, textTransform: "uppercase", letterSpacing: "0.1em" }}>Score</div>
      <div style={{ fontSize: "2vw", fontWeight: 700, color: TILE_GOLD, fontFamily: "'Garamond', serif" }}>
        ${score.toLocaleString()}
      </div>
    </div>
  );
}

// ─── Timer bar ────────────────────────────────────────────────────────────────

function TimerBar({ timerEndsAt, totalSeconds }: { timerEndsAt: number | null; totalSeconds: number }) {
  const [remaining, setRemaining] = useState<number>(totalSeconds);

  useEffect(() => {
    if (!timerEndsAt) { setRemaining(totalSeconds); return; }
    const tick = () => {
      const ms = Math.max(0, timerEndsAt - Date.now());
      setRemaining(Math.ceil(ms / 1000));
    };
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [timerEndsAt, totalSeconds]);

  const pct = Math.max(0, Math.min(1, remaining / totalSeconds));
  const urgent = remaining <= 5;
  const barColor = urgent ? "#EF4444" : TILE_GOLD;

  return (
    <div style={{ width: "80%", marginTop: "2vh" }}>
      <div style={{
        height: "12px",
        backgroundColor: "rgba(255,255,255,0.12)",
        borderRadius: "6px",
        overflow: "hidden",
      }}>
        <div style={{
          height: "100%",
          width: `${pct * 100}%`,
          backgroundColor: barColor,
          borderRadius: "6px",
          transition: "width 0.25s linear, background-color 0.3s",
        }} />
      </div>
      <div style={{
        textAlign: "center",
        marginTop: "8px",
        fontSize: "2.5vw",
        fontWeight: 700,
        color: urgent ? "#EF4444" : GAL_CREAM,
        fontFamily: "'Garamond', serif",
      }}>
        {remaining}
      </div>
    </div>
  );
}

// ─── Board grid (shared between starting + board phases) ─────────────────────

function BoardGrid({ state, revealedCategories }: { state: JeopardyGameState; revealedCategories: number }) {
  const categories = getCategories(state.clues);

  return (
    <div style={{
      width: "96vw",
      height: "90vh",
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gridTemplateRows: "auto repeat(5, 1fr)",
      gap: "6px",
    }}>
      {/* Category headers */}
      {categories.map((name, i) => (
        <div
          key={i}
          style={{
            backgroundColor: JEOPARDY_DARK,
            border: "2px solid rgba(255,255,255,0.15)",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px 4px",
            opacity: i < revealedCategories ? 1 : 0,
            transition: `opacity 0.4s ease ${i * 0.15}s`,
          }}
        >
          <span style={{
            color: TILE_TEXT,
            fontFamily: "'Garamond', serif",
            fontWeight: 700,
            fontSize: "1.4vw",
            textAlign: "center",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            lineHeight: 1.2,
          }}>
            {name}
          </span>
        </div>
      ))}

      {/* Clue tiles — 5 rows × 4 columns */}
      {POINT_VALUES.map((value) =>
        [1, 2, 3, 4].map((cat) => {
          const clue = state.clues.find(
            (c) => c.categoryNumber === cat && c.pointValue === value,
          );
          const index = clue ? state.clues.indexOf(clue) : -1;
          const claimed = index >= 0 && state.claimedIndices.includes(index);
          const isActive = index >= 0 && state.activeClueIndex === index;

          return (
            <div
              key={`${cat}-${value}`}
              style={{
                backgroundColor: claimed ? TILE_USED : (isActive ? "rgba(6,12,232,0.5)" : JEOPARDY_BLUE),
                border: isActive
                  ? `3px solid ${TILE_GOLD}`
                  : `2px solid rgba(255,255,255,${claimed ? 0.04 : 0.15})`,
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background-color 0.3s",
              }}
            >
              {!claimed && (
                <span style={{
                  color: TILE_GOLD,
                  fontFamily: "'Garamond', serif",
                  fontWeight: 700,
                  fontSize: "2.8vw",
                }}>
                  ${value.toLocaleString()}
                </span>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

// ─── Idle Screen ──────────────────────────────────────────────────────────────

function IdleScreen({ gameName }: { gameName: string }) {
  return (
    <Screen>
      <div style={{
        fontSize: "4vw",
        fontFamily: "'Garamond', serif",
        fontWeight: 700,
        color: TILE_GOLD,
        textAlign: "center",
        marginBottom: "1vh",
      }}>
        Jeopardy!
      </div>
      <div style={{
        fontSize: "2vw",
        color: GAL_MUTED,
        textAlign: "center",
        marginBottom: "4vh",
      }}>
        {gameName}
      </div>
      <div style={{
        width: "80px",
        height: "2px",
        background: `linear-gradient(to right, #FAF5C9, #EC8B24)`,
        marginBottom: "4vh",
      }} />
      <div style={{ fontSize: "1.2vw", color: "rgba(200,193,153,0.5)" }}>
        Waiting for instructor to start…
      </div>
    </Screen>
  );
}

// ─── Starting Screen ──────────────────────────────────────────────────────────

function StartingScreen({ state }: { state: JeopardyGameState }) {
  const [revealedCategories, setRevealedCategories] = useState(0);

  useEffect(() => {
    // Reveal each category header every 600ms to match the audio timing
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 0; i < 4; i++) {
      timers.push(setTimeout(() => setRevealedCategories(i + 1), (i + 1) * 600));
    }
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <Screen>
      <BoardGrid state={state} revealedCategories={revealedCategories} />
    </Screen>
  );
}

// ─── Board Screen ─────────────────────────────────────────────────────────────

function BoardScreen({ state }: { state: JeopardyGameState }) {
  return (
    <Screen>
      <ScoreBadge score={state.currentScore} />
      <BoardGrid state={state} revealedCategories={4} />
    </Screen>
  );
}

// ─── Clue Screen ─────────────────────────────────────────────────────────────

function ClueScreen({ state }: { state: JeopardyGameState }) {
  const clue = state.activeClueIndex !== null ? state.clues[state.activeClueIndex] : null;
  if (!clue) return <BoardScreen state={state} />;

  return (
    <Screen>
      <ScoreBadge score={state.currentScore} />
      <div style={{
        fontSize: "1.2vw",
        color: GAL_MUTED,
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        marginBottom: "1vh",
      }}>
        {clue.categoryName} — ${clue.pointValue.toLocaleString()}
      </div>
      <div style={{
        maxWidth: "80vw",
        fontSize: "3.2vw",
        fontFamily: "'Garamond', serif",
        fontWeight: 700,
        color: TILE_TEXT,
        textAlign: "center",
        lineHeight: 1.3,
        padding: "4vh 4vw",
        backgroundColor: JEOPARDY_BLUE,
        borderRadius: "16px",
        border: `3px solid rgba(255,255,255,0.2)`,
        marginBottom: "3vh",
      }}>
        {clue.clueText}
      </div>
      <TimerBar timerEndsAt={state.timerEndsAt} totalSeconds={state.answerTimerSeconds} />
    </Screen>
  );
}

// ─── Result Screen (correct / wrong / time-expired) ──────────────────────────

function ResultScreen({ state, result }: { state: JeopardyGameState; result: "correct" | "wrong" | "time-expired" }) {
  const clue = state.activeClueIndex !== null ? state.clues[state.activeClueIndex] : null;

  const label = result === "correct" ? "Correct!" : result === "wrong" ? "Incorrect" : "Time's Up!";
  const labelColor = result === "correct" ? "#22C55E" : result === "wrong" ? "#EF4444" : "#F59E0B";

  return (
    <Screen>
      <ScoreBadge score={state.currentScore} />
      <div style={{ fontSize: "3vw", fontFamily: "'Garamond', serif", fontWeight: 700, color: labelColor, marginBottom: "2vh" }}>
        {label}
      </div>
      {clue && (
        <>
          <div style={{ fontSize: "1vw", color: GAL_MUTED, marginBottom: "1vh", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            {clue.categoryName} — ${clue.pointValue.toLocaleString()}
          </div>
          <div style={{
            maxWidth: "76vw",
            fontSize: "2vw",
            color: "rgba(200,193,153,0.7)",
            textAlign: "center",
            marginBottom: "2vh",
            fontStyle: "italic",
          }}>
            {clue.clueText}
          </div>
          <div style={{
            maxWidth: "70vw",
            fontSize: "2.4vw",
            fontFamily: "'Garamond', serif",
            fontWeight: 700,
            color: GAL_CREAM,
            textAlign: "center",
            padding: "2vh 3vw",
            backgroundColor: GAL_CARD,
            borderRadius: "12px",
            border: `2px solid ${TILE_GOLD}`,
          }}>
            {clue.correctResponse}
          </div>
        </>
      )}
    </Screen>
  );
}

// ─── Daily Double Reveal ──────────────────────────────────────────────────────

function DailyDoubleRevealScreen({ state }: { state: JeopardyGameState }) {
  const clue = state.activeClueIndex !== null ? state.clues[state.activeClueIndex] : null;
  return (
    <Screen bg="#0A0030">
      <div style={{
        fontSize: "8vw",
        fontFamily: "'Garamond', serif",
        fontWeight: 700,
        background: `linear-gradient(135deg, #FAF5C9, #EC8B24)`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        textAlign: "center",
        lineHeight: 1,
        marginBottom: "2vh",
      }}>
        Daily Double!
      </div>
      {clue && (
        <div style={{ fontSize: "2vw", color: GAL_MUTED, textTransform: "uppercase", letterSpacing: "0.12em" }}>
          {clue.categoryName}
        </div>
      )}
    </Screen>
  );
}

// ─── Daily Double Wager ───────────────────────────────────────────────────────

function DailyDoubleWagerScreen({ state }: { state: JeopardyGameState }) {
  const clue = state.activeClueIndex !== null ? state.clues[state.activeClueIndex] : null;
  return (
    <Screen bg="#0A0030">
      <ScoreBadge score={state.currentScore} />
      <div style={{ fontSize: "3.5vw", fontFamily: "'Garamond', serif", fontWeight: 700, color: TILE_GOLD, marginBottom: "1.5vh" }}>
        Daily Double!
      </div>
      {clue && (
        <div style={{ fontSize: "1.8vw", color: GAL_MUTED, marginBottom: "2vh", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          {clue.categoryName}
        </div>
      )}
      <div style={{
        fontSize: "2vw",
        color: GAL_CREAM,
        padding: "2vh 3vw",
        backgroundColor: GAL_CARD,
        borderRadius: "12px",
        border: `2px solid rgba(255,255,255,0.1)`,
        textAlign: "center",
      }}>
        Decide your wager…
      </div>
      <div style={{ marginTop: "2vh", fontSize: "1.4vw", color: GAL_MUTED }}>
        Current score: <span style={{ color: TILE_GOLD, fontWeight: 700 }}>${state.currentScore.toLocaleString()}</span>
        {clue && (
          <span> · Max wager: <span style={{ color: TILE_GOLD, fontWeight: 700 }}>${clue.pointValue.toLocaleString()}</span></span>
        )}
      </div>
    </Screen>
  );
}

// ─── Daily Double Clue ────────────────────────────────────────────────────────

function DailyDoubleClueScreen({ state }: { state: JeopardyGameState }) {
  const clue = state.activeClueIndex !== null ? state.clues[state.activeClueIndex] : null;
  if (!clue) return <BoardScreen state={state} />;

  return (
    <Screen>
      <ScoreBadge score={state.currentScore} />
      <div style={{ fontSize: "1.2vw", color: GAL_MUTED, marginBottom: "0.5vh", textTransform: "uppercase", letterSpacing: "0.1em" }}>
        Daily Double — {clue.categoryName}
      </div>
      <div style={{ fontSize: "1.4vw", color: TILE_GOLD, marginBottom: "2vh", fontWeight: 700 }}>
        Wager: ${state.currentWager.toLocaleString()}
      </div>
      <div style={{
        maxWidth: "80vw",
        fontSize: "3.2vw",
        fontFamily: "'Garamond', serif",
        fontWeight: 700,
        color: TILE_TEXT,
        textAlign: "center",
        lineHeight: 1.3,
        padding: "4vh 4vw",
        backgroundColor: JEOPARDY_BLUE,
        borderRadius: "16px",
        border: `3px solid rgba(255,255,255,0.2)`,
        marginBottom: "3vh",
      }}>
        {clue.clueText}
      </div>
      <TimerBar timerEndsAt={state.timerEndsAt} totalSeconds={state.answerTimerSeconds} />
    </Screen>
  );
}

// ─── Daily Double Result ──────────────────────────────────────────────────────

function DailyDoubleResultScreen({ state, result }: { state: JeopardyGameState; result: "correct" | "wrong" | "time-expired" }) {
  const clue = state.activeClueIndex !== null ? state.clues[state.activeClueIndex] : null;
  const label = result === "correct" ? "Correct!" : result === "wrong" ? "Incorrect" : "Time's Up!";
  const labelColor = result === "correct" ? "#22C55E" : result === "wrong" ? "#EF4444" : "#F59E0B";

  return (
    <Screen>
      <ScoreBadge score={state.currentScore} />
      <div style={{ fontSize: "1.2vw", color: GAL_MUTED, marginBottom: "1vh", textTransform: "uppercase", letterSpacing: "0.1em" }}>
        Daily Double
      </div>
      <div style={{ fontSize: "3vw", fontFamily: "'Garamond', serif", fontWeight: 700, color: labelColor, marginBottom: "2vh" }}>
        {label}
      </div>
      <div style={{ fontSize: "1.6vw", color: TILE_GOLD, fontWeight: 700, marginBottom: "2vh" }}>
        Wager: ${state.currentWager.toLocaleString()}
      </div>
      {clue && (
        <div style={{
          maxWidth: "70vw",
          fontSize: "2.4vw",
          fontFamily: "'Garamond', serif",
          fontWeight: 700,
          color: GAL_CREAM,
          textAlign: "center",
          padding: "2vh 3vw",
          backgroundColor: GAL_CARD,
          borderRadius: "12px",
          border: `2px solid ${TILE_GOLD}`,
        }}>
          {clue.correctResponse}
        </div>
      )}
    </Screen>
  );
}

// ─── Board Complete ───────────────────────────────────────────────────────────

function BoardCompleteScreen({ state }: { state: JeopardyGameState }) {
  return (
    <Screen>
      <ScoreBadge score={state.currentScore} />
      <div style={{ fontSize: "5vw", fontFamily: "'Garamond', serif", fontWeight: 700, color: TILE_GOLD, textAlign: "center", marginBottom: "2vh" }}>
        Board Complete!
      </div>
      <div style={{ fontSize: "2vw", color: GAL_MUTED, textAlign: "center" }}>
        Get ready for Final Jeopardy…
      </div>
    </Screen>
  );
}

// ─── Final Jeopardy Intro ─────────────────────────────────────────────────────

function FJIntroScreen() {
  return (
    <Screen bg="#0A0030">
      <div style={{
        fontSize: "7vw",
        fontFamily: "'Garamond', serif",
        fontWeight: 700,
        background: `linear-gradient(135deg, #FAF5C9, #EC8B24)`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        textAlign: "center",
        lineHeight: 1.1,
      }}>
        Final<br />Jeopardy!
      </div>
    </Screen>
  );
}

// ─── Final Jeopardy Category ──────────────────────────────────────────────────

function FJCategoryScreen({ state }: { state: JeopardyGameState }) {
  return (
    <Screen bg="#0A0030">
      <div style={{ fontSize: "1.4vw", color: GAL_MUTED, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "2vh" }}>
        Final Jeopardy — Category
      </div>
      <div style={{
        fontSize: "4.5vw",
        fontFamily: "'Garamond', serif",
        fontWeight: 700,
        color: TILE_GOLD,
        textAlign: "center",
        padding: "3vh 4vw",
        backgroundColor: "rgba(0,0,0,0.4)",
        borderRadius: "16px",
        border: `2px solid ${TILE_GOLD}`,
        marginBottom: "3vh",
      }}>
        {state.finalClue.categoryName}
      </div>
      <div style={{ fontSize: "1.4vw", color: "rgba(200,193,153,0.6)" }}>
        Think about your wager…
      </div>
    </Screen>
  );
}

// ─── Final Jeopardy Wager ─────────────────────────────────────────────────────

function FJWagerScreen({ state }: { state: JeopardyGameState }) {
  return (
    <Screen bg="#0A0030">
      <div style={{ fontSize: "2.5vw", fontFamily: "'Garamond', serif", fontWeight: 700, color: TILE_GOLD, marginBottom: "1vh" }}>
        Final Jeopardy!
      </div>
      <div style={{ fontSize: "1.8vw", color: GAL_MUTED, marginBottom: "2vh" }}>
        {state.finalClue.categoryName}
      </div>
      <div style={{
        fontSize: "2vw",
        color: GAL_CREAM,
        padding: "2vh 3vw",
        backgroundColor: GAL_CARD,
        borderRadius: "12px",
        border: `2px solid rgba(255,255,255,0.1)`,
        textAlign: "center",
        marginBottom: "2vh",
      }}>
        Decide your wager…
      </div>
      <div style={{ fontSize: "1.4vw", color: GAL_MUTED }}>
        Current score: <span style={{ color: TILE_GOLD, fontWeight: 700 }}>${state.currentScore.toLocaleString()}</span>
        <span style={{ color: "rgba(200,193,153,0.5)" }}> · Max wager: ${state.currentScore.toLocaleString()}</span>
      </div>
    </Screen>
  );
}

// ─── Final Jeopardy Clue ──────────────────────────────────────────────────────

function FJClueScreen({ state }: { state: JeopardyGameState }) {
  const [remaining, setRemaining] = useState(30);

  useEffect(() => {
    if (!state.timerEndsAt) return;
    const tick = () => setRemaining(Math.max(0, Math.ceil((state.timerEndsAt! - Date.now()) / 1000)));
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [state.timerEndsAt]);

  const urgent = remaining <= 5;

  return (
    <Screen bg="#0A0030">
      <div style={{ fontSize: "1.2vw", color: GAL_MUTED, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "2vh" }}>
        Final Jeopardy — {state.finalClue.categoryName}
      </div>
      <div style={{
        maxWidth: "80vw",
        fontSize: "3.5vw",
        fontFamily: "'Garamond', serif",
        fontWeight: 700,
        color: TILE_TEXT,
        textAlign: "center",
        lineHeight: 1.3,
        padding: "4vh 5vw",
        backgroundColor: JEOPARDY_BLUE,
        borderRadius: "16px",
        border: `3px solid rgba(255,255,255,0.2)`,
        marginBottom: "4vh",
      }}>
        {state.finalClue.clueText}
      </div>
      {/* Think! music countdown — prominent */}
      <div style={{
        fontSize: "6vw",
        fontFamily: "'Garamond', serif",
        fontWeight: 700,
        color: urgent ? "#EF4444" : TILE_GOLD,
        transition: "color 0.3s",
      }}>
        {remaining}
      </div>
      <div style={{ fontSize: "1vw", color: "rgba(200,193,153,0.5)", marginTop: "0.5vh" }}>seconds</div>
    </Screen>
  );
}

// ─── Final Jeopardy Judging ───────────────────────────────────────────────────

function FJJudgingScreen({ state }: { state: JeopardyGameState }) {
  return (
    <Screen bg="#0A0030">
      <div style={{ fontSize: "1.2vw", color: GAL_MUTED, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "2vh" }}>
        Final Jeopardy — {state.finalClue.categoryName}
      </div>
      <div style={{
        maxWidth: "80vw",
        fontSize: "3vw",
        fontFamily: "'Garamond', serif",
        fontWeight: 700,
        color: TILE_TEXT,
        textAlign: "center",
        lineHeight: 1.3,
        padding: "4vh 5vw",
        backgroundColor: JEOPARDY_BLUE,
        borderRadius: "16px",
        border: `3px solid rgba(255,255,255,0.2)`,
        marginBottom: "3vh",
      }}>
        {state.finalClue.clueText}
      </div>
      <div style={{ fontSize: "2vw", color: GAL_MUTED, fontStyle: "italic" }}>
        Your response?
      </div>
    </Screen>
  );
}

// ─── Final Jeopardy Result ────────────────────────────────────────────────────

function FJResultScreen({ state, result }: { state: JeopardyGameState; result: "correct" | "wrong" }) {
  const label = result === "correct" ? "Correct!" : "Incorrect";
  const labelColor = result === "correct" ? "#22C55E" : "#EF4444";

  return (
    <Screen bg="#0A0030">
      <div style={{ fontSize: "3vw", fontFamily: "'Garamond', serif", fontWeight: 700, color: labelColor, marginBottom: "2vh" }}>
        {label}
      </div>
      <div style={{ fontSize: "1.4vw", color: GAL_MUTED, marginBottom: "1vh" }}>
        Final Jeopardy — {state.finalClue.categoryName}
      </div>
      <div style={{
        maxWidth: "70vw",
        fontSize: "2.4vw",
        fontFamily: "'Garamond', serif",
        fontWeight: 700,
        color: GAL_CREAM,
        textAlign: "center",
        padding: "2vh 3vw",
        backgroundColor: GAL_CARD,
        borderRadius: "12px",
        border: `2px solid ${TILE_GOLD}`,
        marginBottom: "3vh",
      }}>
        {state.finalClue.correctResponse}
      </div>
      <div style={{ fontSize: "1.6vw", color: GAL_MUTED }}>
        Wager: <span style={{ color: TILE_GOLD, fontWeight: 700 }}>${state.currentWager.toLocaleString()}</span>
      </div>
      <div style={{
        marginTop: "2vh",
        fontSize: "3vw",
        fontFamily: "'Garamond', serif",
        fontWeight: 700,
        color: TILE_GOLD,
      }}>
        Final Score: ${state.currentScore.toLocaleString()}
      </div>
    </Screen>
  );
}

// ─── Game Over ────────────────────────────────────────────────────────────────

function GameOverScreen({ state, gameName }: { state: JeopardyGameState; gameName: string }) {
  return (
    <Screen>
      <div style={{ fontSize: "4vw", fontFamily: "'Garamond', serif", fontWeight: 700, color: TILE_GOLD, marginBottom: "1vh" }}>
        Game Over!
      </div>
      <div style={{ fontSize: "1.6vw", color: GAL_MUTED, marginBottom: "3vh" }}>{gameName}</div>
      <div style={{
        fontSize: "6vw",
        fontFamily: "'Garamond', serif",
        fontWeight: 700,
        color: GAL_CREAM,
        marginBottom: "2vh",
      }}>
        ${state.currentScore.toLocaleString()}
      </div>
      <div style={{
        fontSize: "1.4vw",
        color: TILE_GOLD,
        padding: "1.5vh 2.5vw",
        backgroundColor: "rgba(236,139,36,0.12)",
        borderRadius: "8px",
        border: `1px solid rgba(236,139,36,0.3)`,
      }}>
        Points have been added to your accounts!
      </div>
    </Screen>
  );
}
