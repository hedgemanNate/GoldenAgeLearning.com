"use client";

// Shared game remote component — renders the correct full-screen instructor
// remote based on the game's type (Family Feud or Millionaire).
//
// Used by:
//   - app/(admin)/admin/teaching/games/play/[gameId]/page.tsx  (by gameId)
//   - app/(admin)/admin/teaching/[templateId]/game/page.tsx      (via GameRemoteForClass)
//   - class-specific game/page.tsx files                         (via GameRemoteForClass)

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useAuthContext } from "../../context/AuthContext";
import {
  getGame,
  getGameQuestions,
  getFamilyFeudMainQuestions,
  getFamilyFeudFastMoneyQuestions,
  getJeopardyClues,
  getJeopardyFinalClue,
  getGamesByClassId,
  getBookingsByClass,
  updateTeachingSession,
  startTeachingSession,
  setTeachingSessionMode,
  endTeachingSession,
  awardGamePoints,
} from "../../lib/firebase/db";
import { useTeachingSession } from "../../hooks/useTeachingSession";
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
} from "../../lib/games/millionaire";
import {
  initialGameState as ffInitialState,
  canStartFamilyFeudGame,
} from "../../lib/games/familyFeud";
import {
  initialGameState as jeopardyInitialState,
  canStartJeopardyGame,
  endGame as jeopardyEndGame,
} from "../../lib/games/jeopardy";
import FamilyFeudRemote from "./familyFeud/FamilyFeudRemote";
import JeopardyRemote from "./jeopardy/JeopardyRemote";
import type {
  GameInstanceWithId,
  GameQuestion,
  MillionaireGameState,
  FamilyFeudMainQuestion,
  FamilyFeudFastMoneyQuestion,
  FamilyFeudGameState,
  JeopardyClue,
  JeopardyFinalClue,
  JeopardyGameState,
} from "../../types/game";

type AnswerLetter = "a" | "b" | "c" | "d";

// ─── Public API ──────────────────────────────────────────────────────────────

/** Renders the game remote for a known gameId. */
export function GameRemoteInner({ gameId }: { gameId: string }) {
  return <GameRemoteCore gameId={gameId} />;
}

/** Looks up the game for a class slug, then renders the game remote inline. */
export function GameRemoteForClass({ classSlug }: { classSlug: string }) {
  const [gameId, setGameId] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getGamesByClassId(classSlug).then((games) => {
      if (cancelled) return;
      if (games.length === 0) {
        setNotFound(true);
      } else {
        setGameId(games[0].id);
      }
    });
    return () => { cancelled = true; };
  }, [classSlug]);

  if (notFound) {
    return (
      <Centered text="">
        <p style={{ color: "rgba(245,237,214,0.6)", fontSize: 14, textAlign: "center" }}>
          No game is configured for this class yet.
          <br />
          <a href="/admin/teaching/games" style={{ color: "#c9a84c" }}>
            Create one on the Games page ↗
          </a>
        </p>
      </Centered>
    );
  }

  if (!gameId) {
    return <Centered text="Loading game…" />;
  }

  return <GameRemoteCore gameId={gameId} />;
}

// ─── Core (shared between both entry points) ─────────────────────────────────

function GameRemoteCore({ gameId }: { gameId: string }) {
  const { user } = useAuthContext();
  const { session, ownerId } = useTeachingSession();

  const [game, setGame] = useState<GameInstanceWithId | null>(null);
  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [ffMainQuestions, setFfMainQuestions] = useState<FamilyFeudMainQuestion[]>([]);
  const [ffFastMoneyQuestions, setFfFastMoneyQuestions] = useState<FamilyFeudFastMoneyQuestion[]>([]);
  const [jeopardyClues, setJeopardyClues] = useState<JeopardyClue[]>([]);
  const [jeopardyFinalClue, setJeopardyFinalClue] = useState<JeopardyFinalClue | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // ─── Load game + questions ─────────────────────────────────────────────
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
          if (g.gameType === "familyFeud") {
            const [mainQs, fastMoneyQs] = await Promise.all([
              getFamilyFeudMainQuestions(gameId),
              getFamilyFeudFastMoneyQuestions(gameId),
            ]);
            if (!cancelled) {
              setFfMainQuestions(mainQs);
              setFfFastMoneyQuestions(fastMoneyQs);
            }
          }
          if (g.gameType === "jeopardy") {
            const [clues, finalClue] = await Promise.all([
              getJeopardyClues(gameId),
              getJeopardyFinalClue(gameId),
            ]);
            if (!cancelled) {
              setJeopardyClues(clues);
              setJeopardyFinalClue(finalClue);
            }
          }
        }
      } catch {
        if (!cancelled) setLoadError("Failed to load game.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [gameId]);

  // ─── Derived: live Millionaire game state from session ─────────────────
  const gameState: MillionaireGameState | null = useMemo(() => {
    if (!session || session.status !== "active" || session.mode !== "game" || !session.gameState) return null;
    if ((session.gameState as Record<string, unknown>).gameType === "familyFeud") return null;
    return session.gameState as unknown as MillionaireGameState;
  }, [session]);

  // ─── Derived: live Family Feud game state from session ─────────────────
  const ffGameState: FamilyFeudGameState | null = useMemo(() => {
    if (!session || session.status !== "active" || session.mode !== "game" || !session.gameState) return null;
    if ((session.gameState as Record<string, unknown>).gameType !== "familyFeud") return null;
    return session.gameState as unknown as FamilyFeudGameState;
  }, [session]);

  // ─── Derived: live Jeopardy game state from session ────────────────────
  const jeopardyGameState: JeopardyGameState | null = useMemo(() => {
    if (!session || session.status !== "active" || session.mode !== "game" || !session.gameState) return null;
    if ((session.gameState as Record<string, unknown>).gameType !== "jeopardy") return null;
    return session.gameState as unknown as JeopardyGameState;
  }, [session]);

  // ─── State write helpers ───────────────────────────────────────────────
  const writeState = useCallback(
    async (patch: MillionaireGameState) => {
      if (!ownerId) return;
      await updateTeachingSession(ownerId, {
        gameState: patch as unknown as Record<string, unknown>,
      });
    },
    [ownerId]
  );

  const writeFFState = useCallback(async (s: FamilyFeudGameState) => {
    if (!ownerId) return;
    await updateTeachingSession(ownerId, {
      gameState: s as unknown as Record<string, unknown>,
    });
  }, [ownerId]);

  const writeJeopardyState = useCallback(async (s: JeopardyGameState) => {
    if (!ownerId) return;
    await updateTeachingSession(ownerId, {
      gameState: s as unknown as Record<string, unknown>,
    });
  }, [ownerId]);

  const writeStateFor = async (uid: string, s: unknown) => {
    await updateTeachingSession(uid, {
      gameState: s as Record<string, unknown>,
    });
  };

  // ─── START GAME (Millionaire) ──────────────────────────────────────────
  const handleStartGame = async () => {
    if (!user || !game) return;
    if (!canStartGame(questions)) return;
    setBusy(true);
    try {
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

  // ─── START GAME (Family Feud) ──────────────────────────────────────────
  const handleFFStartGame = async () => {
    if (!user || !game) return;
    if (!canStartFamilyFeudGame(ffMainQuestions, ffFastMoneyQuestions)) {
      alert("Upload 3 main questions and 5 fast money questions before starting.");
      return;
    }
    setBusy(true);
    try {
      await startTeachingSession({
        ownerId: user.uid,
        ownerName: user.name,
        classSlug: game.classId,
        totalSlides: 0,
      });
      await setTeachingSessionMode(user.uid, "game");
      const initialState = ffInitialState(
        ffMainQuestions,
        ffFastMoneyQuestions,
        game.fastMoneyTimerPlayer1 ?? 20,
        game.fastMoneyTimerPlayer2 ?? 25,
      );
      await writeStateFor(user.uid, initialState);
    } finally {
      setBusy(false);
    }
  };

  // ─── FF AWARD POINTS ───────────────────────────────────────────────────
  const handleFFAwardPoints = async (ffState: FamilyFeudGameState) => {
    if (!game || !ownerId) return;
    if (!confirm(`Award ${ffState.gameTotal} points to all enrolled students?`)) return;
    setBusy(true);
    try {
      const bookings = await getBookingsByClass(game.classId);
      const pointsMap: Record<string, number> = {};
      for (const b of bookings) {
        pointsMap[b.customerId] = ffState.gameTotal;
      }
      const result = await awardGamePoints(pointsMap, game.classId);
      alert(`Points awarded to ${result.awarded} students.`);
      await endTeachingSession(ownerId);
    } catch (e) {
      alert(`Failed to award points: ${e instanceof Error ? e.message : "unknown error"}`);
    } finally {
      setBusy(false);
    }
  };

  // ─── START GAME (Jeopardy) ─────────────────────────────────────────────
  const handleJeopardyStartGame = async () => {
    if (!user || !game) return;
    if (!canStartJeopardyGame(jeopardyClues, jeopardyFinalClue)) {
      alert("Upload 20 clues (4 categories × 5 values, exactly 1 Daily Double) and a Final Jeopardy clue before starting.");
      return;
    }
    setBusy(true);
    try {
      await startTeachingSession({
        ownerId: user.uid,
        ownerName: user.name,
        classSlug: game.classId,
        totalSlides: 0,
      });
      await setTeachingSessionMode(user.uid, "game");
      const initialState = jeopardyInitialState(
        jeopardyClues,
        jeopardyFinalClue!,
        game.answerTimerSeconds ?? 30,
      );
      await writeStateFor(user.uid, initialState);
    } finally {
      setBusy(false);
    }
  };

  // ─── JEOPARDY AWARD POINTS ─────────────────────────────────────────────
  const handleJeopardyAwardPoints = async (jState: JeopardyGameState) => {
    if (!game || !ownerId) return;
    if (!confirm(`Award ${jState.currentScore} points to all enrolled students?`)) return;
    setBusy(true);
    try {
      const bookings = await getBookingsByClass(game.classId);
      const pointsMap: Record<string, number> = {};
      for (const b of bookings) {
        pointsMap[b.customerId] = jState.currentScore;
      }
      const result = await awardGamePoints(pointsMap, game.classId);
      alert(`Points awarded to ${result.awarded} students.`);
      await endTeachingSession(ownerId);
    } catch (e) {
      alert(`Failed to award points: ${e instanceof Error ? e.message : "unknown error"}`);
    } finally {
      setBusy(false);
    }
  };

  // ─── BEGIN Q1 (Millionaire) ────────────────────────────────────────────
  const handleBeginFirst = async () => {
    if (!gameState) return;
    await writeState({
      ...gameState,
      phase: "starting",
      updatedAt: Date.now(),
    });
  };

  // ─── ANSWER TAP ────────────────────────────────────────────────────────
  const handleAnswerTap = async (letter: AnswerLetter) => {
    if (!gameState) return;
    if (!(gameState.phase === "question" || gameState.phase === "selected" || gameState.phase === "ask-instructor")) return;
    if ((gameState.fiftyFiftyHidden ?? []).includes(letter)) return;

    if (gameState.selectedAnswer === letter) {
      await writeState({
        ...gameState,
        phase: "locked",
        lockedAnswer: letter,
        timerEndsAt: null,
        updatedAt: Date.now(),
      });
    } else {
      await writeState({
        ...gameState,
        phase: "selected",
        selectedAnswer: letter,
        updatedAt: Date.now(),
      });
    }
  };

  // ─── REVEAL ────────────────────────────────────────────────────────────
  const handleReveal = async () => {
    if (!gameState || gameState.phase !== "locked" || !gameState.lockedAnswer) return;
    const q = gameState.questions[gameState.questionIndex];
    if (!q) return;
    const correct = gameState.lockedAnswer === q.correct_answer;
    await writeState(correct ? applyCorrectAnswer(gameState) : applyWrongAnswer(gameState));
  };

  // ─── NEXT QUESTION ─────────────────────────────────────────────────────
  const handleNext = async () => {
    if (!gameState || !game) return;
    const isLast = gameState.questionIndex >= 14;
    if (isLast) {
      await writeState({ ...gameState, phase: "game-over", updatedAt: Date.now() });
      return;
    }
    await writeState(nextQuestionState(gameState, game.timerSeconds));
  };

  // ─── WALK AWAY ─────────────────────────────────────────────────────────
  const handleWalkAway = async () => {
    if (!gameState) return;
    if (gameState.pointsFrozen) return;
    if (!confirm("Walk away and bank current points? The game will continue for learning.")) return;
    await writeState(applyWalkAway(gameState));
  };

  // ─── LIFELINES ─────────────────────────────────────────────────────────
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

  // ─── CLEAR STALE STATE ───────────────────────────────────────────────
  const handleClearState = async () => {
    if (!ownerId) return;
    if (!confirm("Clear the stale game state from the display? The projector will go back to idle.")) return;
    setBusy(true);
    try {
      await updateTeachingSession(ownerId, { gameState: null });
    } finally {
      setBusy(false);
    }
  };

  // ─── END GAME ──────────────────────────────────────────────────────────
  const handleEndGame = async () => {
    if (!ownerId) return;
    if (!confirm("End and reset this game session? The next time you press Play, it will start fresh.")) return;
    setBusy(true);
    try {
      await endTeachingSession(ownerId);
    } finally {
      setBusy(false);
    }
  };

  const handleEmergencyEnd = async () => {
    if (!gameState || !ownerId) return;
    const lockedInPoints = getLockedInPoints(gameState);
    if (!confirm(
      `End the game now? This will lock in ${lockedInPoints.toLocaleString()} points, end the display, and leave the remote.`
    )) {
      return;
    }
    setBusy(true);
    try {
      await writeState({
        ...gameState,
        phase: "game-over",
        pointsFrozen: true,
        finalPoints: lockedInPoints,
        selectedAnswer: null,
        lockedAnswer: null,
        timerEndsAt: null,
        timerPausedMs: null,
        updatedAt: Date.now(),
      });
      await endTeachingSession(ownerId);
    } finally {
      setBusy(false);
    }
  };

  // ─── AWARD POINTS (Millionaire) ────────────────────────────────────────
  const handleAwardPoints = async () => {
    if (!gameState || !game) return;
    if (!confirm(`Award ${gameState.finalPoints.toLocaleString()} points to enrolled students?`)) return;
    setBusy(true);
    try {
      const result = await awardGamePoints({}, game.classId);
      alert(`Points awarded to ${result.awarded} students.`);
    } catch (e) {
      alert(`Failed to award points: ${e instanceof Error ? e.message : "unknown error"}`);
    } finally {
      setBusy(false);
    }
  };

  // ─── RENDER ────────────────────────────────────────────────────────────
  if (loading) return <Centered text="Loading game…" />;
  if (loadError) return <Centered text={loadError} />;
  if (!game) return <Centered text="Game not found." />;

  // ─── Jeopardy dispatch ─────────────────────────────────────────────────
  if (game.gameType === "jeopardy") {
    if (!jeopardyGameState) {
      return (
        <JeopardyPreGameScreen
          game={game}
          clues={jeopardyClues}
          finalClue={jeopardyFinalClue}
          busy={busy}
          ownerId={ownerId}
          onStart={handleJeopardyStartGame}
          onClearState={session ? handleClearState : undefined}
        />
      );
    }
    return (
      <JeopardyRemote
        game={game}
        state={jeopardyGameState}
        busy={busy}
        onWrite={async (s) => {
          setBusy(true);
          try {
            await writeJeopardyState(s);
            // When game-over phase is written, auto-award points and end session
            if (s.phase === "game-over") {
              await handleJeopardyAwardPoints(s);
            }
          } finally {
            setBusy(false);
          }
        }}
      />
    );
  }

  // ─── Family Feud dispatch ──────────────────────────────────────────────
  if (game.gameType === "familyFeud") {    if (!ffGameState) {
      return (
        <FFPreGameScreen
          game={game}
          mainQs={ffMainQuestions}
          fastMoneyQs={ffFastMoneyQuestions}
          busy={busy}
          ownerId={ownerId}
          onStart={handleFFStartGame}
          onClearState={session ? handleClearState : undefined}
        />
      );
    }
    return (
      <FamilyFeudRemote
        game={game}
        mainQuestions={ffMainQuestions}
        fastMoneyQuestions={ffFastMoneyQuestions}
        state={ffGameState}
        ownerId={ownerId ?? ""}
        busy={busy}
        onWrite={writeFFState}
        onEndGame={handleEndGame}
        onAwardPoints={handleFFAwardPoints}
      />
    );
  }

  // ─── Millionaire dispatch ──────────────────────────────────────────────
  const tiers = tierAvailability(questions);
  const ready = canStartGame(questions);
  const lockedInPoints = gameState ? getLockedInPoints(gameState) : 0;

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
        onClearState={session ? handleClearState : undefined}
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
        <div className="flex items-center gap-[12px]">
          <Link
            href={`/admin/teaching/${game.classId}/slides/display?owner=${ownerId ?? ""}`}
            target="_blank"
            className="text-[11px] text-[var(--color-teal)] underline"
          >
            Open Display ↗
          </Link>
          <button
            onClick={handleEndGame}
            disabled={busy}
            className="text-[11px] text-red-300 underline disabled:opacity-40 disabled:cursor-not-allowed"
          >
            End & Reset
          </button>
        </div>
      </div>

      {/* Status strip */}
      <StatusStrip state={gameState} />

      <div className="px-[16px] pt-[16px] flex flex-col gap-[16px]">

        {gameState.phase === "idle" && (
          <BigButton onClick={handleBeginFirst} disabled={busy} color="gold">
            ▶ Start Q1
          </BigButton>
        )}

        {(gameState.phase === "question"
          || gameState.phase === "selected"
          || gameState.phase === "locked"
          || gameState.phase === "ask-instructor"
          || gameState.phase === "revealed-correct"
          || gameState.phase === "revealed-wrong"
          || gameState.phase === "safe-haven"
          || gameState.phase === "walk-away"
          || gameState.phase === "game-over") && (
          <AnswerButtons state={gameState} onTap={handleAnswerTap} />
        )}

        {gameState.phase === "locked" && (
          <BigButton onClick={handleReveal} color="gold">
            👁 Reveal Answer
          </BigButton>
        )}

        {(gameState.phase === "revealed-correct"
          || gameState.phase === "revealed-wrong"
          || gameState.phase === "safe-haven"
          || gameState.phase === "walk-away") && (
          gameState.questionIndex >= 14
            ? <BigButton onClick={handleNext} color="gold">🏁 Finish Game</BigButton>
            : <BigButton onClick={handleNext} color="gold">→ Next Question</BigButton>
        )}

        {gameState.phase === "phone-a-friend" && (
          <BigButton onClick={handleResumeTimer} color="gold">
            ⏵ Resume Timer
          </BigButton>
        )}

        {gameState.phase === "ask-instructor" && (
          <p className="text-[12px] text-[rgba(245,237,214,0.5)] text-center">
            Give your hint, then tap an answer to continue.
          </p>
        )}

        {(gameState.phase === "question" || gameState.phase === "selected" || gameState.phase === "ask-instructor") && (
          <Lifelines
            state={gameState}
            onFifty={handleFiftyFifty}
            onAsk={handleAskInstructor}
            onPhone={handlePhoneFriend}
          />
        )}

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

        {gameState.phase !== "game-over" && (
          <div className="mt-[4px] pt-[12px] border-t border-[rgba(245,237,214,0.08)]">
            <button
              onClick={handleEmergencyEnd}
              disabled={busy}
              className="w-full py-[14px] rounded-[10px] bg-transparent border-2 border-red-500/70 text-red-300 text-[14px] font-semibold hover:bg-red-500/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ⏹ End Game Now
            </button>
            <p className="mt-[8px] text-[11px] text-center text-[rgba(245,237,214,0.45)]">
              Locks in {lockedInPoints.toLocaleString()} points, ends the display, and exits this remote.
            </p>
          </div>
        )}

        {gameState.phase === "game-over" && (
          <div className="flex flex-col gap-[10px] mt-[12px]">
            <BigButton onClick={handleAwardPoints} color="gold" disabled={busy}>
              🏆 Award {gameState.finalPoints.toLocaleString()} Points
            </BigButton>
            <Link
              href="/admin"
              className="w-full py-[12px] rounded-[10px] bg-[var(--color-dark-surface)] border border-[rgba(245,237,214,0.15)] text-[var(--color-cream)] text-[13px] font-medium text-center"
            >
              ← Back to Admin Panel
            </Link>
            <button
              onClick={handleEndGame}
              disabled={busy}
              className="w-full py-[12px] rounded-[10px] bg-transparent border border-red-500/50 text-red-300 text-[13px] font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            >
              End & Reset Game Session
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PreGameScreen({
  game, questionCount, tiers, ready, busy, ownerId, onStart, onClearState,
}: {
  game: GameInstanceWithId;
  questionCount: number;
  tiers: { easy: number; medium: number; hard: number };
  ready: boolean;
  busy: boolean;
  ownerId: string | null;
  onStart: () => void;
  onClearState?: () => Promise<void>;
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

      {onClearState && (
        <button
          onClick={onClearState}
          disabled={busy}
          className="w-full py-[10px] rounded-[8px] bg-transparent border border-[rgba(245,237,214,0.1)] text-[rgba(245,237,214,0.4)] text-[12px] hover:text-[rgba(245,237,214,0.65)] hover:border-[rgba(245,237,214,0.2)] transition-colors disabled:opacity-30"
        >
          Clear Stale Display State
        </button>
      )}
    </div>
  );
}

function FFPreGameScreen({
  game, mainQs, fastMoneyQs, busy, ownerId, onStart, onClearState,
}: {
  game: GameInstanceWithId;
  mainQs: FamilyFeudMainQuestion[];
  fastMoneyQs: FamilyFeudFastMoneyQuestion[];
  busy: boolean;
  ownerId: string | null;
  onStart: () => void;
  onClearState?: () => Promise<void>;
}) {
  const hasMain = mainQs.length === 3;
  const hasMini = fastMoneyQs.length === 5;
  const ready = hasMain && hasMini;
  return (
    <div className="min-h-screen bg-[var(--color-dark-bg)] text-[var(--color-cream)] font-sans p-[20px] flex flex-col gap-[20px]">
      <div>
        <p className="text-[11px] uppercase tracking-wider text-[rgba(245,237,214,0.4)]">Family Feud</p>
        <h1 className="text-[22px] font-bold mt-[2px]">{game.name}</h1>
        <p className="text-[12px] text-[rgba(245,237,214,0.5)] mt-[4px]">{game.className}</p>
      </div>

      <div className="bg-[var(--color-dark-surface)] rounded-[10px] p-[16px] border border-[rgba(245,237,214,0.07)]">
        <p className="text-[11px] uppercase tracking-wider text-[rgba(245,237,214,0.4)] mb-[8px]">Question Status</p>
        <div className="flex flex-col gap-[6px] text-[13px]">
          <Row label="Main Questions (3 rounds)" value={`${mainQs.length} / 3`} ok={hasMain} />
          <Row label="Fast Money Questions (5)" value={`${fastMoneyQs.length} / 5`} ok={hasMini} />
          <Row label="Player 1 Timer" value={`${game.fastMoneyTimerPlayer1 ?? 20}s`} />
          <Row label="Player 2 Timer" value={`${game.fastMoneyTimerPlayer2 ?? 25}s`} />
        </div>
      </div>

      {!ready && (
        <p className="text-[12px] text-red-400 leading-relaxed">
          Upload 3 main round questions and 5 fast money questions on the Games page before starting.
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
        {busy ? "Starting…" : "▶ Start Family Feud"}
      </BigButton>

      {onClearState && (
        <button
          onClick={onClearState}
          disabled={busy}
          className="w-full py-[10px] rounded-[8px] bg-transparent border border-[rgba(245,237,214,0.1)] text-[rgba(245,237,214,0.4)] text-[12px] hover:text-[rgba(245,237,214,0.65)] hover:border-[rgba(245,237,214,0.2)] transition-colors disabled:opacity-30"
        >
          Clear Stale Display State
        </button>
      )}
    </div>
  );
}

function JeopardyPreGameScreen({
  game, clues, finalClue, busy, ownerId, onStart, onClearState,
}: {
  game: GameInstanceWithId;
  clues: JeopardyClue[];
  finalClue: JeopardyFinalClue | null;
  busy: boolean;
  ownerId: string | null;
  onStart: () => void;
  onClearState?: () => Promise<void>;
}) {
  const hasClues = clues.length === 20;
  const hasFinal = !!finalClue;
  const ready = hasClues && hasFinal;
  return (
    <div className="min-h-screen bg-[var(--color-dark-bg)] text-[var(--color-cream)] font-sans p-[20px] flex flex-col gap-[20px]">
      <div>
        <p className="text-[11px] uppercase tracking-wider text-[rgba(245,237,214,0.4)]">Jeopardy!</p>
        <h1 className="text-[22px] font-bold mt-[2px]">{game.name}</h1>
        <p className="text-[12px] text-[rgba(245,237,214,0.5)] mt-[4px]">{game.className}</p>
      </div>

      <div className="bg-[var(--color-dark-surface)] rounded-[10px] p-[16px] border border-[rgba(245,237,214,0.07)]">
        <p className="text-[11px] uppercase tracking-wider text-[rgba(245,237,214,0.4)] mb-[8px]">Content Status</p>
        <div className="flex flex-col gap-[6px] text-[13px]">
          <Row label="Board Clues (4 cats × 5)" value={`${clues.length} / 20`} ok={hasClues} />
          <Row label="Final Jeopardy Clue" value={hasFinal ? "✓ Ready" : "Missing"} ok={hasFinal} />
          <Row label="Answer Timer" value={`${game.answerTimerSeconds ?? 30}s`} />
        </div>
      </div>

      {!ready && (
        <p className="text-[12px] text-red-400 leading-relaxed">
          Upload 20 board clues and a Final Jeopardy clue on the Games page before starting.
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
        {busy ? "Starting…" : "▶ Start Jeopardy!"}
      </BigButton>

      {onClearState && (
        <button
          onClick={onClearState}
          disabled={busy}
          className="w-full py-[10px] rounded-[8px] bg-transparent border border-[rgba(245,237,214,0.1)] text-[rgba(245,237,214,0.4)] text-[12px] hover:text-[rgba(245,237,214,0.65)] hover:border-[rgba(245,237,214,0.2)] transition-colors disabled:opacity-30"
        >
          Clear Stale Display State
        </button>
      )}
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
  const isResolved = state.phase === "revealed-correct"
    || state.phase === "revealed-wrong"
    || state.phase === "safe-haven"
    || state.phase === "walk-away"
    || state.phase === "game-over";
  return (
    <div className="grid grid-cols-2 gap-[10px]">
      {letters.map((letter) => {
        const hidden = (state.fiftyFiftyHidden ?? []).includes(letter);
        const isSelected = state.selectedAnswer === letter;
        const isLocked = state.lockedAnswer === letter;
        const isCorrect = q ? letter === q.correct_answer : false;
        const isWrongLocked = isLocked && !isCorrect;
        const disabled = hidden || state.phase === "locked" || isResolved;

        let classes =
          "py-[28px] rounded-[14px] text-[26px] font-bold transition-colors border-2 ";
        if (hidden) {
          classes += "bg-[rgba(255,255,255,0.02)] text-[rgba(255,255,255,0.15)] border-[rgba(255,255,255,0.05)] cursor-not-allowed";
        } else if (isResolved && isCorrect) {
          classes += "bg-[rgba(34,197,94,0.3)] text-[#4ade80] border-[#4ade80]";
        } else if (isResolved && isWrongLocked) {
          classes += "bg-[rgba(239,68,68,0.3)] text-[#f87171] border-[#f87171]";
        } else if (isResolved) {
          classes += "bg-[rgba(255,255,255,0.02)] text-[rgba(255,255,255,0.25)] border-[rgba(255,255,255,0.06)] cursor-not-allowed";
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
            className={classes + " relative"}
            title={q ? q[`option_${letter}` as const] : ""}
          >
            {letter.toUpperCase()}
            {isCorrect && !hidden && (
              <span
                className="absolute top-[6px] right-[8px] w-[8px] h-[8px] rounded-full bg-[#4ade80]"
                aria-label="correct answer"
              />
            )}
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

function Centered({ text, children }: { text: string; children?: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-dark-bg)] text-[rgba(245,237,214,0.5)] font-sans flex items-center justify-center text-[14px] px-[20px]">
      {children ?? text}
    </div>
  );
}

function getLockedInPoints(state: MillionaireGameState): number {
  return state.pointsFrozen ? state.finalPoints : state.bankedPoints;
}
