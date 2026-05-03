// Pure helpers for the Who Wants to Be a Millionaire game engine.
// No React, no Firebase — just data transforms and rules.

import type { GameQuestion, MillionaireGameState } from "../../types/game";

// ─── Ladder ───────────────────────────────────────────────────────────────────
// Index 0 = Q1, index 14 = Q15.
export const LADDER: number[] = [
  100, 200, 300, 500, 1000,
  2000, 4000, 8000, 16000, 32000,
  64000, 125000, 250000, 500000, 1000000,
];

// Q5 (index 4) and Q10 (index 9) are safe havens.
export const SAFE_HAVEN_INDICES = [4, 9] as const;
export const SAFE_HAVEN_VALUES = [LADDER[4], LADDER[9]] as const; // [1000, 32000]

export function isSafeHaven(questionIndex: number): boolean {
  return SAFE_HAVEN_INDICES.includes(questionIndex as 4 | 9);
}

// Highest safe-haven value the class has *passed*. After answering Q5 correctly
// they have 1000 banked. After Q10 correctly: 32000. Otherwise 0.
export function safeHavenAfter(passedQuestionIndex: number): number {
  if (passedQuestionIndex >= 9) return SAFE_HAVEN_VALUES[1];
  if (passedQuestionIndex >= 4) return SAFE_HAVEN_VALUES[0];
  return 0;
}

// Value of the question at a ladder position. Pass questionIndex (0..14).
export function ladderValue(questionIndex: number): number {
  return LADDER[questionIndex] ?? 0;
}

// Last correctly answered question's value. If we are *on* questionIndex N,
// the last correct value is LADDER[N-1] (or 0 at Q1).
export function lastCorrectValue(currentQuestionIndex: number): number {
  if (currentQuestionIndex <= 0) return 0;
  return LADDER[currentQuestionIndex - 1];
}

// ─── Question selection ───────────────────────────────────────────────────────

const TIER_RANGES: Array<[number, number]> = [
  [1, 5],   // easy → Q1..Q5
  [6, 10],  // medium → Q6..Q10
  [11, 15], // hard → Q11..Q15
];

export interface TierAvailability {
  easy: number;
  medium: number;
  hard: number;
}

export function tierAvailability(pool: GameQuestion[]): TierAvailability {
  return {
    easy:   pool.filter((q) => q.difficulty >= 1  && q.difficulty <= 5 ).length,
    medium: pool.filter((q) => q.difficulty >= 6  && q.difficulty <= 10).length,
    hard:   pool.filter((q) => q.difficulty >= 11 && q.difficulty <= 15).length,
  };
}

export function canStartGame(pool: GameQuestion[]): boolean {
  const a = tierAvailability(pool);
  return a.easy >= 5 && a.medium >= 5 && a.hard >= 5;
}

// Fisher-Yates shuffle, returns a new array.
function shuffle<T>(arr: readonly T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Select 5 random questions per tier and arrange them as Q1..Q15.
// Throws if any tier has fewer than 5 questions.
export function selectQuestions(pool: GameQuestion[]): GameQuestion[] {
  if (!canStartGame(pool)) {
    throw new Error(
      "Each difficulty tier (1–5, 6–10, 11–15) must have at least 5 questions."
    );
  }
  const out: GameQuestion[] = [];
  for (const [lo, hi] of TIER_RANGES) {
    const tier = pool.filter((q) => q.difficulty >= lo && q.difficulty <= hi);
    out.push(...shuffle(tier).slice(0, 5));
  }
  return out;
}

// ─── Initial state ────────────────────────────────────────────────────────────

export function initialGameState(questions: GameQuestion[], timerSeconds: number): MillionaireGameState {
  const now = Date.now();
  return {
    questions,
    questionIndex: 0,
    phase: "idle",
    selectedAnswer: null,
    lockedAnswer: null,
    lifelines: { fiftyFifty: false, phoneAFriend: false, askInstructor: false },
    fiftyFiftyHidden: [],
    bankedPoints: 0,
    pointsFrozen: false,
    finalPoints: 0,
    timerEndsAt: null,
    timerPausedMs: null,
    timerSeconds,
    startedAt: now,
    updatedAt: now,
  };
}

// Reset per-question fields when advancing to a new question.
// `timerSeconds` comes from the game instance config.
export function nextQuestionState(
  state: MillionaireGameState,
  timerSeconds: number
): MillionaireGameState {
  const now = Date.now();
  const nextIndex = state.questionIndex + 1;
  return {
    ...state,
    questionIndex: nextIndex,
    phase: "question",
    selectedAnswer: null,
    lockedAnswer: null,
    fiftyFiftyHidden: [],
    timerEndsAt: state.pointsFrozen ? null : now + timerSeconds * 1000,
    timerPausedMs: null,
    updatedAt: now,
  };
}

// Begin the game from "idle" → first question. Awards no points.
export function beginFirstQuestion(
  state: MillionaireGameState,
  timerSeconds: number
): MillionaireGameState {
  const now = Date.now();
  return {
    ...state,
    questionIndex: 0,
    phase: "question",
    selectedAnswer: null,
    lockedAnswer: null,
    fiftyFiftyHidden: [],
    timerEndsAt: now + timerSeconds * 1000,
    timerPausedMs: null,
    updatedAt: now,
  };
}

// Compute updated state after revealing a locked answer as correct.
// - If Q15: phase → game-over with full payout.
// - If safe haven (Q5/Q10): phase → safe-haven (instructor advances to next).
// - Otherwise: phase → revealed-correct.
// Banked points and finalPoints are updated when applicable.
export function applyCorrectAnswer(
  state: MillionaireGameState
): MillionaireGameState {
  const idx = state.questionIndex;
  const value = ladderValue(idx);
  const isFinal = idx === 14;
  const newBanked = isSafeHaven(idx) ? value : state.bankedPoints;
  const finalPoints = state.pointsFrozen ? state.finalPoints : value;

  return {
    ...state,
    phase: isFinal ? "game-over" : isSafeHaven(idx) ? "safe-haven" : "revealed-correct",
    bankedPoints: newBanked,
    finalPoints,
    timerEndsAt: null,
    updatedAt: Date.now(),
  };
}

// Compute updated state after revealing a locked answer as wrong (or timer expiry).
// Points freeze at the last safe haven and never change again.
export function applyWrongAnswer(
  state: MillionaireGameState
): MillionaireGameState {
  // If already frozen, finalPoints does not change (spec 4.5).
  const finalPoints = state.pointsFrozen ? state.finalPoints : state.bankedPoints;
  return {
    ...state,
    phase: "revealed-wrong",
    pointsFrozen: true,
    finalPoints,
    timerEndsAt: null,
    updatedAt: Date.now(),
  };
}

// Walk away — bank the value of the LAST correctly answered question
// (not the current question, not the safe haven). Spec 4.6.
export function applyWalkAway(
  state: MillionaireGameState
): MillionaireGameState {
  const finalPoints = state.pointsFrozen
    ? state.finalPoints
    : lastCorrectValue(state.questionIndex);
  return {
    ...state,
    phase: "walk-away",
    pointsFrozen: true,
    finalPoints,
    selectedAnswer: null,
    lockedAnswer: null,
    timerEndsAt: null,
    updatedAt: Date.now(),
  };
}
