"use client";

// Instructor Remote for the Family Feud game.
// The remote is the single source of truth for all state mutations.
// Every button tap writes through onWrite(), which calls updateTeachingSession().
// The display reads from the same Firebase subscription — no direct coupling.
//
// Design rule: Controls are never HIDDEN based on phase — only de-emphasized.
// Active controls are large & bold. Secondary controls are smaller & lower-contrast.

import { useState, useRef, useEffect, useCallback } from "react";
import type {
  GameInstanceWithId,
  FamilyFeudGameState,
  FamilyFeudMainQuestion,
  FamilyFeudFastMoneyQuestion,
  FamilyFeudScoreSelection,
} from "../../../types/game";
import {
  getAnswers,
  getPoints,
  getCurrentQuestion,
  beginGame,
  beginFaceOff,
  applyBuzzIn,
  applyFaceOffAnswer,
  applyFaceOffOpponentAnswer,
  beginPlaying,
  applyBoardAnswer,
  applyWrongAnswer,
  advanceFromAnswerRevealed,
  advanceFromStrike,
  advanceToRoundOver,
  advanceRound,
  advanceFromRoundTransition,
  startFastMoneyPlayer1,
  updateFastMoneyAnswer,
  endFastMoneyPlayer1,
  startFastMoneyPlayer2,
  endFastMoneyPlayer2,
  startFastMoneyReveal,
  setPlayer1Selection,
  setPlayer2Selection,
  setCurrentRevealQuestion,
  revealFastMoneyQuestion,
  finalizeFastMoney,
  endGame,
} from "../../../lib/games/familyFeud";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  game: GameInstanceWithId;
  mainQuestions: FamilyFeudMainQuestion[];
  fastMoneyQuestions: FamilyFeudFastMoneyQuestion[];
  state: FamilyFeudGameState;
  ownerId: string;
  busy: boolean;
  onWrite: (s: FamilyFeudGameState) => Promise<void>;
  onEndGame: () => Promise<void>;
  onAwardPoints: (gameState: FamilyFeudGameState) => Promise<void>;
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function FamilyFeudRemote({
  game,
  mainQuestions,
  fastMoneyQuestions,
  state,
  ownerId: _ownerId,
  busy,
  onWrite,
  onEndGame,
  onAwardPoints,
}: Props) {
  const phase = state.phase;

  // ─── helpers ──────────────────────────────────────────────────────────────
  const write = useCallback(
    (next: FamilyFeudGameState) => onWrite(next),
    [onWrite]
  );

  // ─── Idle ─────────────────────────────────────────────────────────────────
  if (phase === "idle") {
    return (
      <RemoteShell title={game.name} subtitle="Family Feud">
        <Section>
          <BigButton
            disabled={busy}
            onClick={() => write(beginGame(state))}
          >
            ▶ Start Game
          </BigButton>
          <HintText>Tap to begin the intro and Round 1.</HintText>
        </Section>
        <EndZone onEnd={onEndGame} busy={busy} />
      </RemoteShell>
    );
  }

  // ─── Starting ─────────────────────────────────────────────────────────────
  if (phase === "starting") {
    return (
      <RemoteShell title={game.name} subtitle="Family Feud">
        <Section>
          <StatusLabel>🎵 Intro playing on display…</StatusLabel>
          <DimButton onClick={() => write(beginFaceOff(state))} disabled={busy}>
            Skip Intro → Begin Round 1 Face-Off
          </DimButton>
        </Section>
        <EndZone onEnd={onEndGame} busy={busy} />
      </RemoteShell>
    );
  }

  // ─── Face-Off ─────────────────────────────────────────────────────────────
  if (phase === "face-off") {
    const q = getCurrentQuestion(state);
    return (
      <RemoteShell title={game.name} subtitle={`Round ${state.currentRound} — Face-Off`}>
        {q && <QuestionPreview question={q.question_text} />}
        <Section label="Who buzzed in?">
          <div style={{ display: "flex", gap: "10px" }}>
            <BigButton
              disabled={busy}
              onClick={() => write(applyBuzzIn(state, 1))}
              style={{ flex: 1, backgroundColor: "rgba(236,139,36,0.15)" }}
            >
              🔔 Student 1
            </BigButton>
            <BigButton
              disabled={busy}
              onClick={() => write(applyBuzzIn(state, 2))}
              style={{ flex: 1, backgroundColor: "rgba(236,139,36,0.15)" }}
            >
              🔔 Student 2
            </BigButton>
          </div>
        </Section>
        <EndZone onEnd={onEndGame} busy={busy} />
      </RemoteShell>
    );
  }

  // ─── Face-Off Buzz (first student answering) ──────────────────────────────
  if (phase === "face-off-buzz") {
    const q = getCurrentQuestion(state);
    const answers = q ? getAnswers(q) : [];
    const buzzed = state.faceOffBuzzedStudent ?? 1;
    return (
      <RemoteShell title={game.name} subtitle={`Round ${state.currentRound} — Student ${buzzed} Answering`}>
        {q && <QuestionPreview question={q.question_text} />}
        <Section label="What did the student say?">
          {answers.map((ans, i) => (
            <SmallButton
              key={i}
              disabled={busy}
              onClick={() => write(applyFaceOffAnswer(state, i))}
            >
              #{i + 1} — {ans}
            </SmallButton>
          ))}
          <WarningButton
            disabled={busy}
            onClick={() => write(applyFaceOffAnswer(state, "not-on-board"))}
          >
            ✗ Not on the Board
          </WarningButton>
        </Section>
        <EndZone onEnd={onEndGame} busy={busy} />
      </RemoteShell>
    );
  }

  // ─── Face-Off Correct ─────────────────────────────────────────────────────
  if (phase === "face-off-correct") {
    return (
      <RemoteShell title={game.name} subtitle={`Round ${state.currentRound} — Answer on Board!`}>
        <Section>
          <StatusLabel>✅ Answer revealed — transition to playing.</StatusLabel>
          <BigButton disabled={busy} onClick={() => write(beginPlaying(state))}>
            ▶ Begin Round
          </BigButton>
        </Section>
        <EndZone onEnd={onEndGame} busy={busy} />
      </RemoteShell>
    );
  }

  // ─── Face-Off Wrong (second student gets a chance) ────────────────────────
  if (phase === "face-off-wrong") {
    const q = getCurrentQuestion(state);
    const answers = q ? getAnswers(q) : [];
    const buzzed = state.faceOffBuzzedStudent ?? 1;
    const other = buzzed === 1 ? 2 : 1;
    return (
      <RemoteShell title={game.name} subtitle={`Round ${state.currentRound} — Student ${other} Gets a Chance`}>
        {q && <QuestionPreview question={q.question_text} />}
        <StatusLabel>✗ Student {buzzed} was wrong. What does Student {other} say?</StatusLabel>
        <Section label="Student's answer:">
          {answers.map((ans, i) => (
            <SmallButton
              key={i}
              disabled={busy}
              onClick={() => write(applyFaceOffOpponentAnswer(state, i))}
            >
              #{i + 1} — {ans}
            </SmallButton>
          ))}
          <WarningButton
            disabled={busy}
            onClick={() => write(applyFaceOffOpponentAnswer(state, "not-on-board"))}
          >
            ✗ Also Not on the Board — Start Playing
          </WarningButton>
        </Section>
        <EndZone onEnd={onEndGame} busy={busy} />
      </RemoteShell>
    );
  }

  // ─── Playing ──────────────────────────────────────────────────────────────
  if (phase === "playing" || phase === "answer-revealed") {
    const q = getCurrentQuestion(state);
    const answers = q ? getAnswers(q) : [];
    const revealed = new Set(state.revealedAnswerIndices ?? []);

    return (
      <RemoteShell title={game.name} subtitle={`Round ${state.currentRound} — Strikes: ${"✗".repeat(state.strikes)}${"○".repeat(3 - state.strikes)}`}>
        {q && <QuestionPreview question={q.question_text} />}
        <Section label="Tap the answer the class gave:">
          {answers.map((ans, i) => {
            const isRevealed = revealed.has(i);
            return (
              <SmallButton
                key={i}
                disabled={busy || isRevealed || phase === "answer-revealed"}
                onClick={() => write(applyBoardAnswer(state, i))}
                style={isRevealed ? { opacity: 0.35 } : undefined}
              >
                {isRevealed ? "✓ " : ""}{ans}
              </SmallButton>
            );
          })}
        </Section>

        {/* Continue after answer-revealed */}
        {phase === "answer-revealed" && (
          <Section>
            <BigButton disabled={busy} onClick={() => write(advanceFromAnswerRevealed(state))}>
              ▶ Continue
            </BigButton>
          </Section>
        )}

        {/* Wrong answer — visually isolated */}
        <div style={{
          marginTop: "12px",
          paddingTop: "12px",
          borderTop: "1px solid rgba(245,237,214,0.08)",
        }}>
          <WarningButton
            disabled={busy || phase === "answer-revealed"}
            onClick={() => write(applyWrongAnswer(state))}
          >
            ✗ Wrong Answer / Strike
          </WarningButton>
        </div>

        <EndZone onEnd={onEndGame} busy={busy} />
      </RemoteShell>
    );
  }

  // ─── Strike ───────────────────────────────────────────────────────────────
  if (phase === "strike") {
    return (
      <RemoteShell title={game.name} subtitle={`Round ${state.currentRound} — Strike ${state.strikes} of 3`}>
        <Section>
          <StatusLabel>✗ Strike {state.strikes} — display showing animation.</StatusLabel>
          <BigButton disabled={busy} onClick={() => write(advanceFromStrike(state))}>
            ▶ Continue Playing
          </BigButton>
        </Section>
        <EndZone onEnd={onEndGame} busy={busy} />
      </RemoteShell>
    );
  }

  // ─── Three Strikes ────────────────────────────────────────────────────────
  if (phase === "three-strikes") {
    return (
      <RemoteShell title={game.name} subtitle={`Round ${state.currentRound} — Three Strikes!`}>
        <Section>
          <StatusLabel>✗ ✗ ✗ Remaining answers are being revealed.</StatusLabel>
          <BigButton disabled={busy} onClick={() => write(advanceToRoundOver(state))}>
            ▶ End Round
          </BigButton>
        </Section>
        <EndZone onEnd={onEndGame} busy={busy} />
      </RemoteShell>
    );
  }

  // ─── Round Over ───────────────────────────────────────────────────────────
  if (phase === "round-over") {
    const isLastRound = state.currentRound === 3;
    const roundPts = state.roundTotals[state.currentRound - 1];
    return (
      <RemoteShell title={game.name} subtitle={`Round ${state.currentRound} Complete`}>
        <Section>
          <StatusLabel>Round {state.currentRound} — {roundPts} pts · Total: {state.gameTotal}</StatusLabel>
          <BigButton disabled={busy} onClick={() => write(advanceRound(state))}>
            {isLastRound ? "🎰 Start Fast Money" : `→ Round ${state.currentRound + 1}`}
          </BigButton>
        </Section>
        <EndZone onEnd={onEndGame} busy={busy} />
      </RemoteShell>
    );
  }

  // ─── Round Transition ─────────────────────────────────────────────────────
  if (phase === "round-transition") {
    return (
      <RemoteShell title={game.name} subtitle="Round Transition">
        <Section>
          <BigButton disabled={busy} onClick={() => write(advanceFromRoundTransition(state))}>
            ▶ Continue
          </BigButton>
        </Section>
        <EndZone onEnd={onEndGame} busy={busy} />
      </RemoteShell>
    );
  }

  // ─── Fast Money Intro ─────────────────────────────────────────────────────
  if (phase === "fast-money-intro") {
    return (
      <RemoteShell title={game.name} subtitle="Fast Money Intro">
        <Section>
          <StatusLabel>🎰 Fast Money intro playing on display…</StatusLabel>
          <DimButton disabled={busy} onClick={() => write(startFastMoneyPlayer1(state))}>
            Skip → Player 1 Round
          </DimButton>
        </Section>
        <EndZone onEnd={onEndGame} busy={busy} />
      </RemoteShell>
    );
  }

  // ─── Fast Money Player 1 ──────────────────────────────────────────────────
  if (phase === "fast-money-player1" || phase === "fast-money-player2") {
    return (
      <FastMoneyTypingPhase
        state={state}
        player={phase === "fast-money-player1" ? 1 : 2}
        busy={busy}
        onWrite={write}
        onEndGame={onEndGame}
      />
    );
  }

  // ─── Fast Money Player Done ───────────────────────────────────────────────
  if (phase === "fast-money-player1-done") {
    return (
      <RemoteShell title={game.name} subtitle="Player 1 Done">
        <Section>
          <StatusLabel>⏱ Player 1 time up. Player 1 answers are now hidden.</StatusLabel>
          <BigButton disabled={busy} onClick={() => write(startFastMoneyPlayer2(state))}>
            ▶ Start Player 2 Round
          </BigButton>
        </Section>
        <EndZone onEnd={onEndGame} busy={busy} />
      </RemoteShell>
    );
  }

  if (phase === "fast-money-player2-done") {
    return (
      <RemoteShell title={game.name} subtitle="Player 2 Done">
        <Section>
          <StatusLabel>⏱ Player 2 time up. Ready to reveal.</StatusLabel>
          <BigButton disabled={busy} onClick={() => write(startFastMoneyReveal(state))}>
            ▶ Start Reveal
          </BigButton>
        </Section>
        <EndZone onEnd={onEndGame} busy={busy} />
      </RemoteShell>
    );
  }

  // ─── Fast Money Reveal ────────────────────────────────────────────────────
  if (phase === "fast-money-reveal") {
    return (
      <FastMoneyRevealPhase
        state={state}
        busy={busy}
        onWrite={write}
        onEndGame={onEndGame}
      />
    );
  }

  // ─── Fast Money Score ─────────────────────────────────────────────────────
  if (phase === "fast-money-score") {
    return (
      <RemoteShell title={game.name} subtitle="Fast Money Score">
        <Section>
          <StatusLabel>
            Fast Money: {state.fastMoneyState?.fastMoneyTotal ?? 0} pts ·
            Game Total: {state.gameTotal}
          </StatusLabel>
          <BigButton disabled={busy} onClick={() => write(endGame(state))}>
            ▶ Game Over Screen
          </BigButton>
        </Section>
        <EndZone onEnd={onEndGame} busy={busy} />
      </RemoteShell>
    );
  }

  // ─── Game Over ────────────────────────────────────────────────────────────
  if (phase === "game-over") {
    return (
      <RemoteShell title={game.name} subtitle="Game Over">
        <Section>
          <StatusLabel>🏆 Final Score: {state.gameTotal} points</StatusLabel>
          <BigButton
            disabled={busy}
            onClick={() => onAwardPoints(state)}
          >
            🏆 Award Points &amp; End Game
          </BigButton>
        </Section>
        <div style={{ marginTop: "16px" }}>
          <DimButton disabled={busy} onClick={onEndGame}>
            End Without Awarding Points
          </DimButton>
        </div>
      </RemoteShell>
    );
  }

  // Fallback
  return (
    <RemoteShell title={game.name} subtitle="Family Feud">
      <StatusLabel>Phase: {phase}</StatusLabel>
    </RemoteShell>
  );
}

// ─── Fast Money Typing Phase ──────────────────────────────────────────────────

function FastMoneyTypingPhase({
  state, player, busy, onWrite, onEndGame,
}: {
  state: FamilyFeudGameState;
  player: 1 | 2;
  busy: boolean;
  onWrite: (s: FamilyFeudGameState) => Promise<void>;
  onEndGame: () => Promise<void>;
}) {
  const fm = state.fastMoneyState;
  const questions = state.fastMoneyQuestions;
  const answers = player === 1 ? fm?.player1Answers ?? [] : fm?.player2Answers ?? [];
  const timerLimit = player === 1 ? state.fastMoneyTimerPlayer1 : state.fastMoneyTimerPlayer2;

  // Local typed state — updates immediately; Firebase gets debounced writes
  const [localAnswers, setLocalAnswers] = useState<string[]>(
    () => [...(answers.length === 5 ? answers : ["", "", "", "", ""])]
  );

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(
    fm?.timerEndsAt ? Math.max(0, Math.ceil((fm.timerEndsAt - Date.now()) / 1000)) : timerLimit
  );
  const [timerExpired, setTimerExpired] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (!fm?.timerEndsAt) return;
    const interval = setInterval(() => {
      const secs = Math.max(0, Math.ceil((fm.timerEndsAt! - Date.now()) / 1000));
      setTimeLeft(secs);
      if (secs <= 0) {
        setTimerExpired(true);
        clearInterval(interval);
      }
    }, 200);
    return () => clearInterval(interval);
  }, [fm?.timerEndsAt]);

  const handleChange = (idx: number, text: string) => {
    if (timerExpired) return;
    const updated = [...localAnswers];
    updated[idx] = text;
    setLocalAnswers(updated);

    // Debounce Firebase write by 150ms
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      let next = state;
      for (let i = 0; i < 5; i++) {
        next = updateFastMoneyAnswer(next, player, i, updated[i] ?? "");
      }
      await onWrite(next);
    }, 150);
  };

  const handleEndTurn = async () => {
    // Flush any pending debounced write immediately
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    let next = state;
    for (let i = 0; i < 5; i++) {
      next = updateFastMoneyAnswer(next, player, i, localAnswers[i] ?? "");
    }
    if (player === 1) {
      next = endFastMoneyPlayer1(next);
    } else {
      next = endFastMoneyPlayer2(next);
    }
    await onWrite(next);
  };

  // Cleanup debounce on unmount
  useEffect(() => () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, []);

  const timerColor = timeLeft <= 5 ? "#EC8B24" : "#FAF5C9";

  return (
    <RemoteShell
      title={`Player ${player} — Fast Money`}
      subtitle={`${timerLimit}s round`}
    >
      {/* Large timer */}
      <div style={{ textAlign: "center", marginBottom: "12px" }}>
        <div style={{
          fontSize: "48px", fontWeight: "bold",
          color: timerExpired ? "#EC8B24" : timerColor,
          lineHeight: 1,
        }}>
          {timerExpired ? "DONE" : timeLeft}
        </div>
        <div style={{ fontSize: "11px", color: "rgba(245,237,214,0.4)", marginTop: "2px" }}>
          seconds remaining
        </div>
      </div>

      {/* Answer text fields */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {questions.map((q, i) => (
          <div key={i} style={{
            backgroundColor: "var(--color-dark-surface)",
            borderRadius: "10px",
            padding: "10px 12px",
            border: "1px solid rgba(245,237,214,0.08)",
          }}>
            <div style={{
              fontSize: "11px", color: "rgba(245,237,214,0.45)",
              marginBottom: "4px",
            }}>
              {i + 1}. {q.question_text}
            </div>
            <input
              type="text"
              value={localAnswers[i] ?? ""}
              onChange={(e) => handleChange(i, e.target.value)}
              disabled={timerExpired}
              placeholder="Type answer…"
              autoCapitalize="words"
              style={{
                width: "100%",
                backgroundColor: "transparent",
                border: "none",
                borderBottom: "1px solid rgba(236,139,36,0.4)",
                color: "var(--color-cream)",
                fontSize: "16px",
                padding: "4px 0",
                outline: "none",
                opacity: timerExpired ? 0.5 : 1,
              }}
            />
          </div>
        ))}
      </div>

      {/* End turn button */}
      <div style={{ marginTop: "16px" }}>
        <BigButton disabled={busy} onClick={handleEndTurn}>
          {timerExpired
            ? `⏱ Time's Up — Lock In Player ${player}`
            : `⏱ End Player ${player}'s Turn`}
        </BigButton>
      </div>

      <div style={{ marginTop: "12px" }}>
        <EndZone onEnd={onEndGame} busy={busy} />
      </div>
    </RemoteShell>
  );
}

// ─── Fast Money Reveal Phase ──────────────────────────────────────────────────

function FastMoneyRevealPhase({
  state, busy, onWrite, onEndGame,
}: {
  state: FamilyFeudGameState;
  busy: boolean;
  onWrite: (s: FamilyFeudGameState) => Promise<void>;
  onEndGame: () => Promise<void>;
}) {
  const fm = state.fastMoneyState;
  const questions = state.fastMoneyQuestions;
  if (!fm) return null;

  const current = fm.currentRevealQuestion;
  const q = questions[current];
  if (!q) return null;

  const answers = getAnswers(q);
  const pts = getPoints(q);

  const player1Selections = fm.player1Selections ?? Array(5).fill(null);
  const player2Selections = fm.player2Selections ?? Array(5).fill(null);
  const revealedQuestions = fm.revealedQuestions ?? Array(5).fill(false);

  const p1sel = player1Selections[current];
  const p2sel = player2Selections[current];
  const isRevealed = revealedQuestions[current];

  const allScoredAndRevealed = revealedQuestions.every(Boolean);

  return (
    <RemoteShell title="Fast Money Reveal" subtitle={`Fast Money Total: ${fm.fastMoneyTotal}`}>

      {/* Question navigator — 5 tabs */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
        {questions.map((_, i) => (
          <button
            key={i}
            onClick={() => onWrite(setCurrentRevealQuestion(state, i))}
            style={{
              flex: 1, padding: "8px 0",
              borderRadius: "8px",
              border: `2px solid ${i === current ? "#EC8B24" : "rgba(245,237,214,0.1)"}`,
              backgroundColor: i === current ? "rgba(236,139,36,0.15)" : "transparent",
              color: revealedQuestions[i] ? "#EC8B24" : "rgba(245,237,214,0.6)",
              fontSize: "13px", fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {revealedQuestions[i] ? "✓" : `Q${i + 1}`}
          </button>
        ))}
      </div>

      {/* Current question */}
      <div style={{
        backgroundColor: "var(--color-dark-surface)",
        borderRadius: "10px", padding: "12px",
        marginBottom: "10px",
        border: "1px solid rgba(245,237,214,0.08)",
      }}>
        <p style={{ fontSize: "12px", color: "rgba(245,237,214,0.45)", margin: "0 0 4px" }}>
          Q{current + 1}
        </p>
        <p style={{ fontSize: "14px", color: "var(--color-cream)", margin: 0 }}>
          {q.question_text}
        </p>
      </div>

      {/* Player 1 typed answer + scoring */}
      <ScoringRow
        label={`Player 1: "${(fm.player1Answers ?? [])[current] || "(no answer)"}"`}
        answers={answers}
        pts={pts}
        selection={p1sel}
        isDuplicate={false}
        onSelect={(sel) => onWrite(setPlayer1Selection(state, current, sel as number | "not-on-board"))}
        disabled={busy}
      />

      {/* Player 2 typed answer + scoring */}
      <ScoringRow
        label={`Player 2: "${(fm.player2Answers ?? [])[current] || "(no answer)"}"`}
        answers={answers}
        pts={pts}
        selection={p2sel}
        isDuplicate={true}
        onSelect={(sel) => onWrite(setPlayer2Selection(state, current, sel))}
        disabled={busy}
      />

      {/* Reveal / Confirmed badge */}
      <div style={{ marginTop: "12px" }}>
        {isRevealed ? (
          <div style={{ textAlign: "center", color: "#EC8B24", fontSize: "13px" }}>
            ✓ Question {current + 1} revealed
          </div>
        ) : (
          <BigButton
            disabled={busy || (p1sel === null && p2sel === null)}
            onClick={() => onWrite(revealFastMoneyQuestion(state, current))}
          >
            🔓 Reveal Q{current + 1} on Display
          </BigButton>
        )}
      </div>

      {/* Finalize when all done */}
      {allScoredAndRevealed && (
        <div style={{ marginTop: "12px" }}>
          <BigButton disabled={busy} onClick={() => onWrite(finalizeFastMoney(state))}>
            ✅ All Revealed — Show Score
          </BigButton>
        </div>
      )}

      <div style={{ marginTop: "12px" }}>
        <EndZone onEnd={onEndGame} busy={busy} />
      </div>
    </RemoteShell>
  );
}

// ─── Scoring Row sub-component ────────────────────────────────────────────────

function ScoringRow({
  label, answers, pts, selection, isDuplicate, onSelect, disabled,
}: {
  label: string;
  answers: string[];
  pts: number[];
  selection: FamilyFeudScoreSelection;
  isDuplicate: boolean;
  onSelect: (sel: FamilyFeudScoreSelection) => void;
  disabled: boolean;
}) {
  return (
    <div style={{
      backgroundColor: "var(--color-dark-surface)",
      borderRadius: "10px", padding: "10px 12px",
      marginBottom: "8px",
      border: "1px solid rgba(245,237,214,0.08)",
    }}>
      <p style={{ fontSize: "11px", color: "rgba(245,237,214,0.45)", margin: "0 0 6px" }}>
        {label}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {answers.map((ans, i) => (
          <button
            key={i}
            onClick={() => onSelect(i)}
            disabled={disabled}
            style={{
              padding: "7px 10px",
              borderRadius: "8px",
              border: `1px solid ${selection === i ? "#EC8B24" : "rgba(245,237,214,0.1)"}`,
              backgroundColor: selection === i ? "rgba(236,139,36,0.2)" : "transparent",
              color: "var(--color-cream)",
              fontSize: "13px", textAlign: "left",
              cursor: "pointer",
              display: "flex", justifyContent: "space-between",
            }}
          >
            <span>{ans}</span>
            <span style={{ color: "#EC8B24", fontWeight: "bold" }}>{pts[i]}</span>
          </button>
        ))}
        <button
          onClick={() => onSelect("not-on-board")}
          disabled={disabled}
          style={{
            padding: "7px 10px",
            borderRadius: "8px",
            border: `1px solid ${selection === "not-on-board" ? "#f87171" : "rgba(245,237,214,0.1)"}`,
            backgroundColor: selection === "not-on-board" ? "rgba(239,68,68,0.15)" : "transparent",
            color: selection === "not-on-board" ? "#f87171" : "rgba(245,237,214,0.4)",
            fontSize: "13px", textAlign: "left",
            cursor: "pointer",
          }}
        >
          ✗ Not on Board (0 pts)
        </button>
        {isDuplicate && (
          <button
            onClick={() => onSelect("duplicate")}
            disabled={disabled}
            style={{
              padding: "7px 10px",
              borderRadius: "8px",
              border: `1px solid ${selection === "duplicate" ? "#facc15" : "rgba(245,237,214,0.1)"}`,
              backgroundColor: selection === "duplicate" ? "rgba(250,204,21,0.1)" : "transparent",
              color: selection === "duplicate" ? "#facc15" : "rgba(245,237,214,0.4)",
              fontSize: "13px", textAlign: "left",
              cursor: "pointer",
            }}
          >
            ⚠ Duplicate of P1 (0 pts)
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Shell + utilities ────────────────────────────────────────────────────────

function RemoteShell({
  title, subtitle, children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--color-dark-bg)] text-[var(--color-cream)] font-sans pb-[40px]">
      <div className="sticky top-0 z-10 bg-[var(--color-dark-bg)] border-b border-[rgba(245,237,214,0.07)] px-[16px] py-[12px]">
        <p className="text-[10px] uppercase tracking-wider text-[rgba(245,237,214,0.4)]">{subtitle}</p>
        <p className="text-[14px] font-semibold">{title}</p>
      </div>
      <div className="px-[16px] pt-[16px] flex flex-col gap-[12px]">
        {children}
      </div>
    </div>
  );
}

function Section({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[8px]">
      {label && (
        <p className="text-[11px] uppercase tracking-wider text-[rgba(245,237,214,0.45)]">{label}</p>
      )}
      {children}
    </div>
  );
}

function BigButton({
  onClick, disabled, children, style,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full py-[18px] rounded-[12px] bg-[var(--color-gold)] text-[var(--color-dark-bg)] text-[16px] font-bold disabled:opacity-40 disabled:cursor-not-allowed active:opacity-90"
      style={style}
    >
      {children}
    </button>
  );
}

function SmallButton({
  onClick, disabled, children, style,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full py-[14px] px-[14px] rounded-[10px] bg-[var(--color-dark-surface)] border border-[rgba(245,237,214,0.1)] text-[var(--color-cream)] text-[14px] text-left font-medium disabled:opacity-30 disabled:cursor-not-allowed active:bg-[rgba(236,139,36,0.15)]"
      style={style}
    >
      {children}
    </button>
  );
}

function WarningButton({
  onClick, disabled, children,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full py-[14px] px-[14px] rounded-[10px] bg-transparent border-2 border-red-500/50 text-red-300 text-[14px] font-semibold disabled:opacity-40 disabled:cursor-not-allowed active:bg-red-500/10"
    >
      {children}
    </button>
  );
}

function DimButton({
  onClick, disabled, children,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full py-[12px] rounded-[10px] bg-transparent border border-[rgba(245,237,214,0.12)] text-[rgba(245,237,214,0.45)] text-[13px] disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}

function StatusLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[13px] text-[rgba(245,237,214,0.6)] text-center leading-relaxed">
      {children}
    </p>
  );
}

function HintText({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] text-[rgba(245,237,214,0.4)] text-center">
      {children}
    </p>
  );
}

function QuestionPreview({ question }: { question: string }) {
  return (
    <div style={{
      backgroundColor: "var(--color-dark-surface)",
      borderRadius: "10px", padding: "12px 14px",
      border: "1px solid rgba(245,237,214,0.08)",
      marginBottom: "4px",
    }}>
      <p style={{
        fontSize: "13px", fontWeight: "bold", color: "var(--color-cream)",
        margin: 0, lineHeight: 1.4,
      }}>
        {question}
      </p>
    </div>
  );
}

function EndZone({ onEnd, busy }: { onEnd: () => Promise<void>; busy: boolean }) {
  return (
    <div style={{
      marginTop: "12px",
      paddingTop: "12px",
      borderTop: "1px solid rgba(245,237,214,0.06)",
    }}>
      <DimButton onClick={onEnd} disabled={busy}>
        ⏹ End & Reset Game
      </DimButton>
    </div>
  );
}
