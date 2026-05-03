"use client";

// Instructor Remote for the Millionaire game.
// This is the only place that mutates `TeachingSession.gameState` — every
// button on this page writes a state patch through `updateTeachingSession`,
// which the display picks up via its existing subscription.

import { useEffect, useState, useCallback, useMemo, use } from "react";
import Link from "next/link";
import { useAuthContext } from "../../../../../../../context/AuthContext";
import {
  getGame,
  getGameQuestions,
  updateTeachingSession,
  startTeachingSession,
  setTeachingSessionMode,
  endTeachingSession,
  awardGamePoints,
} from "../../../../../../../lib/firebase/db";
import { useTeachingSession } from "../../../../../../../hooks/useTeachingSession";
import {
  selectQuestions,
  initialGameState,
  nextQuestionState,
  applyCorrectAnswer,
  applyWrongAnswer,
  applyWalkAway,
  ladderValue,
  tierAvailability,
  canStartGame,
} from "../../../../../../../lib/games/millionaire";
import type {
  GameInstanceWithId,
  GameQuestion,
  MillionaireGameState,
} from "../../../../../../../types/game";

type AnswerLetter = "a" | "b" | "c" | "d";

interface PageProps {
  params: Promise<{ gameId: string }>;
}

export default function MillionairePlayPage({ params }: PageProps) {
  const { gameId } = use(params);
  const { user } = useAuthContext();
  const { session, ownerId } = useTeachingSession();

  const [game, setGame] = useState<GameInstanceWithId | null>(null);
  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // ─── Load game + questions ─────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [g, qs] = await Promise.all([getGame(gameId), getGameQuestions(gameId)]);
        if (cancelled) return;
        if (!g) {
          setLoadError("Game not found.");
        } else {
          setGame(g);
          setQuestions(qs);
        }
      } catch {
        if (!cancelled) setLoadError("Failed to load game.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [gameId]);

  // ─── Derived: live game state from session ─────────────────────────────────
  const gameState: MillionaireGameState | null = useMemo(() => {
    if (!session || session.mode !== "game" || !session.gameState) return null;
    return session.gameState as unknown as MillionaireGameState;
  }, [session]);

  // ─── State write helper ────────────────────────────────────────────────────
  const writeState = useCallback(
    async (patch: MillionaireGameState) => {
      if (!ownerId) return;
      await updateTeachingSession(ownerId, {
        gameState: patch as unknown as Record<string, unknown>,
      });
    },
    [ownerId]
  );

  // ─── START GAME ────────────────────────────────────────────────────────────
  const handleStartGame = async () => {
    if (!user || !game) return;
    if (!canStartGame(questions)) return;
    setBusy(true);
    try {
      // Create (or recreate) a fresh active teaching session.
      // We always overwrite here so a stale "ended" session doesn\'t block the display.
      await startTeachingSession({
        ownerId: user.uid,
        ownerName: user.name,
        classSlug: game.classId,
        totalSlides: 0,
      });
      await setTeachingSessionMode(user.uid, "game");
      const selected = selectQuestions(questions);
      await writeStateFor(user.uid, initialGameState(selected, game.timerSeconds));
    } finally {
      setBusy(false);
    }
  };

  // helper that writes state for a specific owner (used during start)
  const writeStateFor = async (uid: string, s: MillionaireGameState) => {
    await updateTeachingSession(uid, {
      gameState: s as unknown as Record<string, unknown>,
    });
  };

  // ─── BEGIN Q1 ──────────────────────────────────────────────────────────────
  // Write phase "starting" — lets play.mp3 begins on the display.
  // When the audio ends, the display's onStartingComplete callback writes
  // the "question" phase + starts the timer via beginFirstQuestion.
  const handleBeginFirst = async () => {
    if (!gameState) return;
    await writeState({
      ...gameState,
      phase: "starting",
      updatedAt: Date.now(),
    });
  };

  // ─── ANSWER TAP (single → highlight, second → lock) ────────────────────────
  const handleAnswerTap = async (letter: AnswerLetter) => {
    if (!gameState) return;
    if (!(gameState.phase === "question" || gameState.phase === "selected" || gameState.phase === "ask-instructor")) return;
    if ((gameState.fiftyFiftyHidden ?? []).includes(letter)) return;

    if (gameState.selectedAnswer === letter) {
      // Second tap → lock in
      await writeState({
        ...gameState,
        phase: "locked",
        lockedAnswer: letter,
        timerEndsAt: null, // freeze timer at lock-in
        updatedAt: Date.now(),
      });
    } else {
      // Single tap → highlight (or change selection)
      await writeState({
        ...gameState,
        phase: "selected",
        selectedAnswer: letter,
        updatedAt: Date.now(),
      });
    }
  };

  // ─── REVEAL ────────────────────────────────────────────────────────────────
  const handleReveal = async () => {
    if (!gameState || gameState.phase !== "locked" || !gameState.lockedAnswer) return;
    const q = gameState.questions[gameState.questionIndex];
    if (!q) return;
    const correct = gameState.lockedAnswer === q.correct_answer;
    await writeState(correct ? applyCorrectAnswer(gameState) : applyWrongAnswer(gameState));
  };

  // ─── NEXT QUESTION ─────────────────────────────────────────────────────────
  const handleNext = async () => {
    if (!gameState || !game) return;
    const isLast = gameState.questionIndex >= 14;
    if (isLast) {
      await writeState({ ...gameState, phase: "game-over", updatedAt: Date.now() });
      return;
    }
    await writeState(nextQuestionState(gameState, game.timerSeconds));
  };

  // ─── WALK AWAY ─────────────────────────────────────────────────────────────
  const handleWalkAway = async () => {
    if (!gameState) return;
    if (gameState.pointsFrozen) return;
    if (!confirm("Walk away and bank current points? The game will continue for learning.")) return;
    await writeState(applyWalkAway(gameState));
  };

  // ─── LIFELINES ─────────────────────────────────────────────────────────────
  const handleFiftyFifty = async () => {
    if (!gameState) return;
    if (gameState.lifelines.fiftyFifty) return;
    const q = gameState.questions[gameState.questionIndex];
    if (!q) return;
    const remove = q.fifty_fifty_remove
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter((s): s is AnswerLetter => ["a", "b", "c", "d"].includes(s));
    await writeState({
      ...gameState,
      lifelines: { ...gameState.lifelines, fiftyFifty: true },
      fiftyFiftyHidden: remove,
      updatedAt: Date.now(),
    });
  };

  const handleAskInstructor = async () => {
    if (!gameState) return;
    if (gameState.lifelines.askInstructor) return;
    await writeState({
      ...gameState,
      phase: "ask-instructor",
      lifelines: { ...gameState.lifelines, askInstructor: true },
      updatedAt: Date.now(),
    });
  };

  const handlePhoneFriend = async () => {
    if (!gameState) return;
    if (gameState.lifelines.phoneAFriend) return;
    // Pause timer: capture remaining ms
    const remainingMs =
      gameState.timerEndsAt !== null
        ? Math.max(0, gameState.timerEndsAt - Date.now())
        : null;
    await writeState({
      ...gameState,
      phase: "phone-a-friend",
      lifelines: { ...gameState.lifelines, phoneAFriend: true },
      timerEndsAt: null,
      timerPausedMs: remainingMs,
      updatedAt: Date.now(),
    });
  };

  const handleResumeTimer = async () => {
    if (!gameState || gameState.timerPausedMs === null) return;
    const newEnd = Date.now() + gameState.timerPausedMs;
    await writeState({
      ...gameState,
      phase: gameState.selectedAnswer ? "selected" : "question",
      timerEndsAt: newEnd,
      timerPausedMs: null,
      updatedAt: Date.now(),
    });
  };

  // ─── END GAME ──────────────────────────────────────────────────────────────
  const handleEndGame = async () => {
    if (!confirm("End this game session?")) return;
    if (ownerId) await endTeachingSession(ownerId);
  };

  // ─── AWARD POINTS (placeholder — needs enrollment lookup) ──────────────────
  const handleAwardPoints = async () => {
    if (!gameState || !game) return;
    if (!confirm(`Award ${gameState.finalPoints.toLocaleString()} points to enrolled students?`)) return;
    setBusy(true);
    try {
      // TODO: Replace with real enrollment lookup for game.classId.
      // For now, calls the cloud function with an empty map so the wiring is
      // exercised end-to-end. Backend will return { awarded: 0 }.
      const result = await awardGamePoints({}, game.classId);
      alert(`Points awarded to ${result.awarded} students.`);
    } catch (e) {
      alert(`Failed to award points: ${e instanceof Error ? e.message : "unknown error"}`);
    } finally {
      setBusy(false);
    }
  };

  // ─── RENDER ────────────────────────────────────────────────────────────────
  if (loading) return <Centered text="Loading game…" />;
  if (loadError) return <Centered text={loadError} />;
  if (!game) return <Centered text="Game not found." />;

  const tiers = tierAvailability(questions);
  const ready = canStartGame(questions);

  // No active game state → show pre-game screen
  if (!gameState) {
    return (
      <PreGameScreen
        game={game}
        questionCount={questions.length}
        tiers={tiers}
        ready={ready}
        busy={busy}
        ownerId={ownerId}
        onStart={handleStartGame}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-dark-bg)] text-[var(--color-cream)] font-sans pb-[40px]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--color-dark-bg)] border-b border-[rgba(245,237,214,0.07)] px-[16px] py-[12px] flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-[rgba(245,237,214,0.4)]">Game</p>
          <p className="text-[14px] font-semibold">{game.name}</p>
        </div>
        <Link
          href={`/admin/teaching/${game.classId}/slides/display?owner=${ownerId ?? ""}`}
          target="_blank"
          className="text-[11px] text-[var(--color-teal)] underline"
        >
          Open Display ↗
        </Link>
      </div>

      {/* Status strip */}
      <StatusStrip state={gameState} />

      <div className="px-[16px] pt-[16px] flex flex-col gap-[16px]">

        {/* Idle: show "Begin Q1" */}
        {gameState.phase === "idle" && (
          <BigButton onClick={handleBeginFirst} disabled={busy} color="gold">
            ▶ Start Q1
          </BigButton>
        )}

        {/* Answer buttons */}
        {(gameState.phase === "question"
          || gameState.phase === "selected"
          || gameState.phase === "locked"
          || gameState.phase === "ask-instructor") && (
          <AnswerButtons state={gameState} onTap={handleAnswerTap} />
        )}

        {/* Reveal button (after lock) */}
        {gameState.phase === "locked" && (
          <BigButton onClick={handleReveal} color="gold">
            👁 Reveal Answer
          </BigButton>
        )}

        {/* Next Question (after reveal or safe-haven or non-game-over walk/wrong) */}
        {(gameState.phase === "revealed-correct"
          || gameState.phase === "revealed-wrong"
          || gameState.phase === "safe-haven"
          || gameState.phase === "walk-away") && (
          gameState.questionIndex >= 14
            ? <BigButton onClick={handleNext} color="gold">🏁 Finish Game</BigButton>
            : <BigButton onClick={handleNext} color="gold">→ Next Question</BigButton>
        )}

        {/* Phone a Friend — Resume Timer */}
        {gameState.phase === "phone-a-friend" && (
          <BigButton onClick={handleResumeTimer} color="gold">
            ⏵ Resume Timer
          </BigButton>
        )}

        {/* Ask the Instructor — return to question */}
        {gameState.phase === "ask-instructor" && (
          <p className="text-[12px] text-[rgba(245,237,214,0.5)] text-center">
            Give your hint, then tap an answer to continue.
          </p>
        )}

        {/* Lifelines (always shown during in-question phases) */}
        {(gameState.phase === "question" || gameState.phase === "selected" || gameState.phase === "ask-instructor") && (
          <Lifelines
            state={gameState}
            onFifty={handleFiftyFifty}
            onAsk={handleAskInstructor}
            onPhone={handlePhoneFriend}
          />
        )}

        {/* Walk Away — separated, only when game still has live points */}
        {!gameState.pointsFrozen
          && gameState.phase !== "game-over"
          && gameState.phase !== "idle"
          && gameState.phase !== "phone-a-friend" && (
          <div className="mt-[12px] pt-[12px] border-t border-[rgba(245,237,214,0.08)]">
            <button
              onClick={handleWalkAway}
              className="w-full py-[14px] rounded-[10px] bg-transparent border-2 border-red-500/40 text-red-400 text-[14px] font-semibold hover:bg-red-500/10 transition-colors"
            >
              🚶 Walk Away
            </button>
          </div>
        )}

        {/* Game over actions */}
        {gameState.phase === "game-over" && (
          <div className="flex flex-col gap-[10px] mt-[12px]">
            <BigButton onClick={handleAwardPoints} color="gold" disabled={busy}>
              🏆 Award {gameState.finalPoints.toLocaleString()} Points
            </BigButton>
            <button
              onClick={handleEndGame}
              className="w-full py-[12px] rounded-[10px] bg-transparent border border-[rgba(245,237,214,0.15)] text-[rgba(245,237,214,0.6)] text-[13px] font-medium"
            >
              End Game Session
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function PreGameScreen({
  game, questionCount, tiers, ready, busy, ownerId, onStart,
}: {
  game: GameInstanceWithId;
  questionCount: number;
  tiers: { easy: number; medium: number; hard: number };
  ready: boolean;
  busy: boolean;
  ownerId: string | null;
  onStart: () => void;
}) {
  return (
    <div className="min-h-screen bg-[var(--color-dark-bg)] text-[var(--color-cream)] font-sans p-[20px] flex flex-col gap-[20px]">
      <div>
        <p className="text-[11px] uppercase tracking-wider text-[rgba(245,237,214,0.4)]">Millionaire</p>
        <h1 className="text-[22px] font-bold mt-[2px]">{game.name}</h1>
        <p className="text-[12px] text-[rgba(245,237,214,0.5)] mt-[4px]">{game.className}</p>
      </div>

      <div className="bg-[var(--color-dark-surface)] rounded-[10px] p-[16px] border border-[rgba(245,237,214,0.07)]">
        <p className="text-[11px] uppercase tracking-wider text-[rgba(245,237,214,0.4)] mb-[8px]">Question Pool</p>
        <div className="flex flex-col gap-[6px] text-[13px]">
          <Row label="Total questions" value={`${questionCount}`} />
          <Row label="Easy (1–5)"      value={`${tiers.easy} / 5+`}   ok={tiers.easy >= 5} />
          <Row label="Medium (6–10)"   value={`${tiers.medium} / 5+`} ok={tiers.medium >= 5} />
          <Row label="Hard (11–15)"    value={`${tiers.hard} / 5+`}   ok={tiers.hard >= 5} />
          <Row label="Timer per Q"     value={`${game.timerSeconds}s`} />
        </div>
      </div>

      {!ready && (
        <p className="text-[12px] text-red-400 leading-relaxed">
          You need at least 5 questions in each difficulty tier (1–5, 6–10, 11–15) before you can start.
          Upload more questions on the Games page.
        </p>
      )}

      <div className="bg-[var(--color-dark-surface)] rounded-[10px] p-[14px] border border-[rgba(245,237,214,0.07)] text-[12px] text-[rgba(245,237,214,0.55)] leading-relaxed">
        Open the display URL on your projector first, then start the game.
        {ownerId && (
          <Link
            href={`/admin/teaching/${game.classId}/slides/display?owner=${ownerId}`}
            target="_blank"
            className="block mt-[8px] text-[var(--color-teal)] underline"
          >
            Open Display ↗
          </Link>
        )}
      </div>

      <BigButton onClick={onStart} color="gold" disabled={!ready || busy}>
        {busy ? "Starting…" : "▶ Start Game"}
      </BigButton>
    </div>
  );
}

function Row({ label, value, ok }: { label: string; value: string; ok?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[rgba(245,237,214,0.6)]">{label}</span>
      <span className={ok === false ? "text-red-400 font-semibold" : "text-[var(--color-cream)] font-medium"}>
        {value}
      </span>
    </div>
  );
}

function StatusStrip({ state }: { state: MillionaireGameState }) {
  const value = ladderValue(state.questionIndex);
  return (
    <div className="bg-[var(--color-dark-surface)] px-[16px] py-[10px] flex items-center justify-between text-[12px]">
      <div>
        <span className="text-[rgba(245,237,214,0.4)]">Q</span>
        <span className="text-[var(--color-cream)] font-bold ml-[2px]">{state.questionIndex + 1}</span>
        <span className="text-[rgba(245,237,214,0.4)]">/15</span>
        <span className="text-[rgba(245,237,214,0.3)] mx-[8px]">·</span>
        <span className="text-[var(--color-gold)] font-semibold">{value.toLocaleString()}</span>
      </div>
      <div>
        <span className="text-[rgba(245,237,214,0.4)]">Banked </span>
        <span className="text-[var(--color-cream)] font-semibold">
          {(state.pointsFrozen ? state.finalPoints : state.bankedPoints).toLocaleString()}
        </span>
        {state.pointsFrozen && (
          <span className="ml-[8px] text-[10px] uppercase tracking-wider text-red-400">Frozen</span>
        )}
      </div>
    </div>
  );
}

function AnswerButtons({
  state, onTap,
}: {
  state: MillionaireGameState;
  onTap: (letter: AnswerLetter) => void;
}) {
  const q = state.questions[state.questionIndex];
  const letters: AnswerLetter[] = ["a", "b", "c", "d"];
  return (
    <div className="grid grid-cols-2 gap-[10px]">
      {letters.map((letter) => {
        const hidden = (state.fiftyFiftyHidden ?? []).includes(letter);
        const isSelected = state.selectedAnswer === letter;
        const isLocked = state.lockedAnswer === letter;
        const disabled = hidden || state.phase === "locked";

        let classes =
          "py-[28px] rounded-[14px] text-[26px] font-bold transition-colors border-2 ";
        if (hidden) {
          classes += "bg-[rgba(255,255,255,0.02)] text-[rgba(255,255,255,0.15)] border-[rgba(255,255,255,0.05)] cursor-not-allowed";
        } else if (isLocked) {
          classes += "bg-[var(--color-gold)] text-[var(--color-dark-bg)] border-[var(--color-cream)]";
        } else if (isSelected) {
          classes += "bg-[rgba(236,139,36,0.25)] text-[var(--color-cream)] border-[var(--color-gold)]";
        } else {
          classes += "bg-[var(--color-dark-surface)] text-[var(--color-cream)] border-[rgba(245,237,214,0.1)] active:bg-[rgba(236,139,36,0.15)]";
        }

        return (
          <button
            key={letter}
            onClick={() => onTap(letter)}
            disabled={disabled}
            className={classes}
            title={q ? q[`option_${letter}` as const] : ""}
          >
            {letter.toUpperCase()}
          </button>
        );
      })}
      {state.phase === "selected" && (
        <p className="col-span-2 text-[11px] text-center text-[rgba(245,237,214,0.5)] mt-[2px]">
          Tap the same answer again to lock it in.
        </p>
      )}
    </div>
  );
}

function Lifelines({
  state, onFifty, onAsk, onPhone,
}: {
  state: MillionaireGameState;
  onFifty: () => void;
  onAsk: () => void;
  onPhone: () => void;
}) {
  const items = [
    { key: "fiftyFifty"     as const, label: "50/50",          icon: "½", onClick: onFifty },
    { key: "askInstructor"  as const, label: "Ask Instructor", icon: "💡", onClick: onAsk },
    { key: "phoneAFriend"   as const, label: "Phone Friend",   icon: "📞", onClick: onPhone },
  ];
  return (
    <div className="grid grid-cols-3 gap-[8px]">
      {items.map((item) => {
        const used = state.lifelines[item.key];
        return (
          <button
            key={item.key}
            onClick={item.onClick}
            disabled={used}
            className={
              "py-[14px] rounded-[10px] text-[12px] font-semibold flex flex-col items-center gap-[4px] border-2 transition-colors " +
              (used
                ? "bg-transparent border-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.2)] line-through cursor-not-allowed"
                : "bg-[rgba(236,139,36,0.08)] border-[var(--color-gold)] text-[var(--color-cream)] active:bg-[rgba(236,139,36,0.2)]")
            }
          >
            <span className="text-[20px]">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function BigButton({
  onClick, disabled, color, children,
}: {
  onClick: () => void;
  disabled?: boolean;
  color: "gold";
  children: React.ReactNode;
}) {
  void color;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full py-[18px] rounded-[12px] bg-[var(--color-gold)] text-[var(--color-dark-bg)] text-[16px] font-bold disabled:opacity-40 disabled:cursor-not-allowed active:opacity-90"
    >
      {children}
    </button>
  );
}

function Centered({ text }: { text: string }) {
  return (
    <div className="min-h-screen bg-[var(--color-dark-bg)] text-[rgba(245,237,214,0.5)] font-sans flex items-center justify-center text-[14px]">
      {text}
    </div>
  );
}
