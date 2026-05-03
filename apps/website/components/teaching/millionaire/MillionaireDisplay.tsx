"use client";

// Projector / big-screen view for the Millionaire game.
// Renders directly from `MillionaireGameState` — no internal phase logic.
// All transitions are driven by the instructor remote via the
// TeachingSession.gameState field (synced through Firebase).

import { useEffect, useState } from "react";
import type {
  MillionaireGameState,
  GameQuestion,
} from "../../../types/game";
import {
  LADDER,
  isSafeHaven,
  ladderValue,
} from "../../../lib/games/millionaire";
import { useMillionaireAudio } from "../../../lib/games/millionaireAudio";

const ANSWER_LETTERS = ["a", "b", "c", "d"] as const;
type AnswerLetter = (typeof ANSWER_LETTERS)[number];

interface Props {
  state: MillionaireGameState;
  gameName: string;
  audioEnabled: boolean;
}

export default function MillionaireDisplay({ state, gameName, audioEnabled }: Props) {
  useMillionaireAudio(state, audioEnabled);

  if (state.phase === "idle") {
    return <OpeningScreen gameName={gameName} />;
  }
  if (state.phase === "game-over") {
    return <GameOverScreen state={state} />;
  }

  const question: GameQuestion | undefined = state.questions[state.questionIndex];
  if (!question) return <OpeningScreen gameName={gameName} />;

  return <QuestionScreen state={state} question={question} />;
}

// ─── Opening Screen ──────────────────────────────────────────────────────────
function OpeningScreen({ gameName }: { gameName: string }) {
  return (
    <Shell>
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", textAlign: "center", gap: "2vw",
      }}>
        <h1 style={{
          fontFamily: "'Garamond', serif", fontSize: "5vw", fontWeight: "bold",
          color: "#FAF5C9", margin: 0, lineHeight: 1.1,
        }}>
          Who Wants to Be a Millionaire
        </h1>
        <p style={{
          fontFamily: "'Lato', sans-serif", fontSize: "2vw",
          color: "#EC8B24", margin: 0,
        }}>
          {gameName}
        </p>
        <p style={{
          fontFamily: "'Lato', sans-serif", fontSize: "1.4vw",
          color: "rgba(200,193,153,0.7)", margin: 0, marginTop: "2vw",
        }}>
          Waiting for instructor to start the game…
        </p>
      </div>
    </Shell>
  );
}

// ─── Question Screen (and all in-question phases) ────────────────────────────
function QuestionScreen({
  state,
  question,
}: {
  state: MillionaireGameState;
  question: GameQuestion;
}) {
  return (
    <Shell>
      <div style={{
        flex: 1, display: "grid",
        gridTemplateColumns: "1fr 22vw",
        gap: "2vw", alignItems: "stretch",
      }}>
        {/* Left: question + answers + status */}
        <div style={{
          display: "flex", flexDirection: "column", gap: "2vh",
          minWidth: 0,
        }}>
          <HeaderBar state={state} question={question} />
          <PhaseBanner state={state} />
          <QuestionBox question={question} />
          <AnswerGrid state={state} question={question} />
          <LifelineBar state={state} />
        </div>

        {/* Right: ladder */}
        <Ladder state={state} />
      </div>
    </Shell>
  );
}

function HeaderBar({ state, question }: { state: MillionaireGameState; question: GameQuestion }) {
  void question;
  const value = ladderValue(state.questionIndex);
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{
        fontFamily: "'Lato', sans-serif", fontSize: "1.4vw",
        color: "rgba(200,193,153,0.85)",
      }}>
        Question <strong style={{ color: "#FAF5C9" }}>{state.questionIndex + 1}</strong> of 15
        <span style={{ marginLeft: "1.5vw", color: "rgba(200,193,153,0.5)" }}>
          Worth <strong style={{ color: "#EC8B24" }}>{value.toLocaleString()}</strong> pts
        </span>
      </div>
      <Timer state={state} />
    </div>
  );
}

function PhaseBanner({ state }: { state: MillionaireGameState }) {
  const frozen = state.pointsFrozen;
  let text = "";
  let color = "#EC8B24";

  if (state.phase === "phone-a-friend") {
    text = "📞 Calling a Friend!";
  } else if (state.phase === "ask-instructor") {
    text = "💡 The Instructor has a hint!";
  } else if (state.phase === "safe-haven") {
    text = "✅ Points Locked In!";
    color = "#FAF5C9";
  } else if (state.phase === "walk-away") {
    text = "🚶 Walked Away";
  } else if (frozen && (state.phase === "question" || state.phase === "selected")) {
    text = "Playing for Learning Only";
    color = "rgba(250,245,201,0.8)";
  }

  if (!text) return <div style={{ height: "3.2vh" }} />; // reserve space

  return (
    <div style={{
      backgroundColor: color === "#FAF5C9" ? "#EC8B24" : "rgba(236,139,36,0.15)",
      border: `1px solid ${color === "#FAF5C9" ? "#FAF5C9" : "#EC8B24"}`,
      borderRadius: "0.5vw",
      padding: "0.8vh 1.5vw",
      fontFamily: "'Lato', sans-serif",
      fontSize: "1.5vw",
      fontWeight: "bold",
      color: color === "#FAF5C9" ? "#252D32" : color,
      textAlign: "center",
    }}>
      {text}
    </div>
  );
}

function QuestionBox({ question }: { question: GameQuestion }) {
  return (
    <div style={{
      backgroundColor: "#1E272C",
      border: "2px solid #EC8B24",
      borderRadius: "0.8vw",
      padding: "2vh 2vw",
      fontFamily: "'Garamond', serif",
      fontSize: "2.4vw",
      color: "#FAF5C9",
      lineHeight: 1.3,
      textAlign: "center",
    }}>
      {question.question}
    </div>
  );
}

function AnswerGrid({ state, question }: { state: MillionaireGameState; question: GameQuestion }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "1.5vh 1.5vw",
    }}>
      {ANSWER_LETTERS.map((letter) => (
        <AnswerOption
          key={letter}
          letter={letter}
          text={question[`option_${letter}` as const]}
          state={state}
          correctAnswer={question.correct_answer}
        />
      ))}
    </div>
  );
}

function AnswerOption({
  letter, text, state, correctAnswer,
}: {
  letter: AnswerLetter;
  text: string;
  state: MillionaireGameState;
  correctAnswer: AnswerLetter;
}) {
  const hidden = (state.fiftyFiftyHidden ?? []).includes(letter);
  const isSelected = state.selectedAnswer === letter;
  const isLocked = state.lockedAnswer === letter;
  const isRevealedCorrect = state.phase === "revealed-correct" || state.phase === "safe-haven";
  const isRevealedWrong   = state.phase === "revealed-wrong";
  const showCorrect = (isRevealedCorrect || isRevealedWrong) && letter === correctAnswer;
  const showWrong   = isRevealedWrong && isLocked && letter !== correctAnswer;

  let bg = "#1E272C";
  let border = "rgba(236,139,36,0.4)";
  let textColor = "#FAF5C9";

  if (hidden) {
    bg = "rgba(255,255,255,0.02)";
    border = "rgba(255,255,255,0.05)";
    textColor = "rgba(255,255,255,0.1)";
  } else if (showCorrect) {
    bg = "#2E7D32"; border = "#FAF5C9"; textColor = "#FFFFFF";
  } else if (showWrong) {
    bg = "#8B1F1F"; border = "#FAF5C9"; textColor = "#FFFFFF";
  } else if (isLocked && state.phase === "locked") {
    bg = "#EC8B24"; border = "#FAF5C9"; textColor = "#252D32";
  } else if (isSelected) {
    bg = "rgba(236,139,36,0.35)"; border = "#EC8B24";
  }

  return (
    <div style={{
      backgroundColor: bg,
      border: `2px solid ${border}`,
      borderRadius: "0.6vw",
      padding: "1.6vh 1.5vw",
      display: "flex",
      alignItems: "center",
      gap: "1vw",
      fontFamily: "'Lato', sans-serif",
      fontSize: "1.6vw",
      color: textColor,
      transition: "all 0.2s ease",
      minHeight: "3.6vw",
    }}>
      <span style={{
        fontWeight: "bold",
        color: hidden ? "rgba(255,255,255,0.1)" : "#EC8B24",
        marginRight: "0.5vw",
      }}>
        {letter.toUpperCase()}:
      </span>
      <span>{hidden ? "" : text}</span>
    </div>
  );
}

function LifelineBar({ state }: { state: MillionaireGameState }) {
  const items: Array<{ key: keyof typeof state.lifelines; label: string; icon: string }> = [
    { key: "fiftyFifty",     label: "50/50",            icon: "½" },
    { key: "askInstructor",  label: "Ask Instructor",   icon: "💡" },
    { key: "phoneAFriend",   label: "Phone a Friend",   icon: "📞" },
  ];
  return (
    <div style={{ display: "flex", gap: "1vw", justifyContent: "center" }}>
      {items.map((item) => {
        const used = state.lifelines[item.key];
        return (
          <div key={item.key} style={{
            display: "flex", alignItems: "center", gap: "0.6vw",
            padding: "0.7vh 1.4vw",
            border: `1.5px solid ${used ? "rgba(255,255,255,0.15)" : "#EC8B24"}`,
            borderRadius: "2vw",
            backgroundColor: used ? "rgba(255,255,255,0.03)" : "rgba(236,139,36,0.08)",
            color: used ? "rgba(255,255,255,0.25)" : "#FAF5C9",
            fontFamily: "'Lato', sans-serif",
            fontSize: "1.2vw",
            textDecoration: used ? "line-through" : "none",
          }}>
            <span style={{ fontSize: "1.4vw" }}>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// Ladder rendered top (Q15) → bottom (Q1).
function Ladder({ state }: { state: MillionaireGameState }) {
  return (
    <div style={{
      backgroundColor: "#1E272C",
      border: "1px solid rgba(236,139,36,0.3)",
      borderRadius: "0.6vw",
      padding: "1vh 0.8vw",
      display: "flex",
      flexDirection: "column-reverse",
      gap: "0.3vh",
      fontFamily: "'Lato', sans-serif",
      fontSize: "1.05vw",
    }}>
      {LADDER.map((value, i) => {
        const isCurrent = i === state.questionIndex;
        const isPassed  = i < state.questionIndex;
        const isHaven   = isSafeHaven(i);
        return (
          <div key={i} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "0.5vh 0.8vw",
            borderRadius: "0.3vw",
            backgroundColor: isCurrent
              ? "#EC8B24"
              : isHaven
                ? "rgba(250,245,201,0.08)"
                : "transparent",
            color: isCurrent
              ? "#252D32"
              : isPassed
                ? "rgba(200,193,153,0.5)"
                : isHaven
                  ? "#FAF5C9"
                  : "rgba(255,255,255,0.7)",
            fontWeight: isCurrent || isHaven ? "bold" : "normal",
          }}>
            <span>{i + 1}</span>
            <span>{value.toLocaleString()}</span>
          </div>
        );
      })}
    </div>
  );
}

// Timer countdown — purely visual, computes from timerEndsAt.
function Timer({ state }: { state: MillionaireGameState }) {
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    if (state.timerEndsAt === null) return;
    const id = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(id);
  }, [state.timerEndsAt]);

  const isPaused = state.timerPausedMs !== null;
  let remaining: number;
  if (isPaused) {
    remaining = Math.max(0, Math.ceil((state.timerPausedMs ?? 0) / 1000));
  } else if (state.timerEndsAt === null) {
    return <div style={{ width: "8vw" }} />;
  } else {
    remaining = Math.max(0, Math.ceil((state.timerEndsAt - now) / 1000));
  }

  const danger = remaining <= 10 && !isPaused;

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "0.6vw",
      backgroundColor: danger ? "#8B1F1F" : "rgba(236,139,36,0.15)",
      border: `2px solid ${danger ? "#FAF5C9" : "#EC8B24"}`,
      borderRadius: "0.5vw",
      padding: "0.6vh 1.2vw",
      fontFamily: "'Lato', sans-serif",
      fontSize: "1.6vw",
      fontWeight: "bold",
      color: danger ? "#FAF5C9" : "#FAF5C9",
      minWidth: "5vw",
      justifyContent: "center",
    }}>
      {isPaused ? "⏸" : "⏱"} {remaining}
    </div>
  );
}

// ─── Game Over Screen ────────────────────────────────────────────────────────
function GameOverScreen({ state }: { state: MillionaireGameState }) {
  const isWin = state.questionIndex === 14 && !state.pointsFrozen && state.finalPoints === 1_000_000;
  return (
    <Shell>
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", textAlign: "center", gap: "2vh",
      }}>
        {isWin && (
          <p style={{
            fontFamily: "'Lato', sans-serif", fontSize: "2vw",
            color: "#EC8B24", margin: 0,
          }}>
            🏆 MILLIONAIRES! 🏆
          </p>
        )}
        <h1 style={{
          fontFamily: "'Garamond', serif", fontSize: "4vw", fontWeight: "bold",
          color: "#FAF5C9", margin: 0,
        }}>
          {isWin ? "You Did It!" : "Final Score"}
        </h1>
        <p style={{
          fontFamily: "'Lato', sans-serif", fontSize: "6vw", fontWeight: "bold",
          color: "#EC8B24", margin: "1vh 0", lineHeight: 1,
        }}>
          {state.finalPoints.toLocaleString()}
        </p>
        <p style={{
          fontFamily: "'Lato', sans-serif", fontSize: "1.6vw",
          color: "rgba(200,193,153,0.85)", margin: 0,
        }}>
          Points have been added to your accounts!
        </p>
      </div>
    </Shell>
  );
}

// ─── Shell ───────────────────────────────────────────────────────────────────
// Matches the slide-deck Shell visually so the projector experience is seamless
// when toggling between slides and game.
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      width: "100vw",
      aspectRatio: "16 / 9",
      maxHeight: "100vh",
      backgroundColor: "#252D32",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: "1.2vh", backgroundColor: "#EC8B24",
      }} />
      <div style={{
        position: "absolute",
        inset: 0,
        paddingTop: "calc(1.2vh + 3vh)",
        paddingLeft: "3vw",
        paddingRight: "3vw",
        paddingBottom: "5vh",
        display: "flex",
        flexDirection: "column",
      }}>
        {children}
      </div>
    </div>
  );
}
