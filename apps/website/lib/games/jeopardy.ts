// Pure helpers for the Jeopardy! game engine.
// No React, no Firebase — just data transforms and rules.

import type {
  JeopardyClue,
  JeopardyFinalClue,
  JeopardyGameState,
  JeopardyGamePhase,
} from "../../types/game";

// ─── Validation ──────────────────────────────────────────────────────────────

export function canStartJeopardyGame(
  clues: JeopardyClue[],
  finalClue: JeopardyFinalClue | null,
): boolean {
  if (!finalClue) return false;
  if (clues.length !== 20) return false;
  const hasDD = clues.filter((c) => c.isDailyDouble).length === 1;
  if (!hasDD) return false;
  for (const cat of [1, 2, 3, 4] as const) {
    const catClues = clues.filter((c) => c.categoryNumber === cat);
    if (catClues.length !== 5) return false;
    const values = new Set(catClues.map((c) => c.pointValue));
    if (values.size !== 5) return false;
  }
  return true;
}

// ─── Category helpers ─────────────────────────────────────────────────────────

/** Returns the 4 category names in order (by category number 1–4). */
export function getCategories(clues: JeopardyClue[]): string[] {
  const names: string[] = [];
  for (const cat of [1, 2, 3, 4] as const) {
    const found = clues.find((c) => c.categoryNumber === cat);
    names.push(found?.categoryName ?? "");
  }
  return names;
}

/** Returns the clue for a given category number and point value. */
export function getClueByCoords(
  clues: JeopardyClue[],
  categoryNumber: 1 | 2 | 3 | 4,
  pointValue: 200 | 400 | 600 | 800 | 1000,
): JeopardyClue | null {
  return clues.find(
    (c) => c.categoryNumber === categoryNumber && c.pointValue === pointValue,
  ) ?? null;
}

/** Returns the 0-based index of a clue in the clues array. */
export function getClueIndex(clues: JeopardyClue[], clue: JeopardyClue): number {
  return clues.findIndex(
    (c) => c.categoryNumber === clue.categoryNumber && c.pointValue === clue.pointValue,
  );
}

// ─── Scoring helpers ──────────────────────────────────────────────────────────

/** Standard correct answer: full point value. */
export function scoreCorrect(score: number, pointValue: number): number {
  return score + pointValue;
}

/** Standard wrong answer: deduct HALF the clue value. Never below zero. */
export function scoreWrong(score: number, pointValue: number): number {
  return Math.max(0, score - Math.floor(pointValue / 2));
}

/** Daily Double correct: full wager added. */
export function scoreDDCorrect(score: number, wager: number): number {
  return score + wager;
}

/** Daily Double wrong: deduct HALF the wager. Never below zero. */
export function scoreDDWrong(score: number, wager: number): number {
  return Math.max(0, score - Math.floor(wager / 2));
}

/** Final Jeopardy correct: full wager added. */
export function scoreFJCorrect(score: number, wager: number): number {
  return score + wager;
}

/** Final Jeopardy wrong: deduct the FULL wager (intentionally different from main game). Never below zero. */
export function scoreFJWrong(score: number, wager: number): number {
  return Math.max(0, score - wager);
}

// ─── Wager validation ─────────────────────────────────────────────────────────

/** Daily Double: min 1, max = clue point value. */
export function validateDDWager(wager: number, cluePointValue: number): string | null {
  if (!Number.isInteger(wager) || wager < 1) return `Minimum wager is $1.`;
  if (wager > cluePointValue) return `Maximum wager is $${cluePointValue.toLocaleString()} (the clue's value).`;
  return null;
}

/** Final Jeopardy: min 0, max = current score. */
export function validateFJWager(wager: number, currentScore: number): string | null {
  if (!Number.isInteger(wager) || wager < 0) return `Minimum wager is $0.`;
  if (wager > currentScore) return `Maximum wager is $${currentScore.toLocaleString()} (your current score).`;
  return null;
}

// ─── Initial state ────────────────────────────────────────────────────────────

export function initialGameState(
  clues: JeopardyClue[],
  finalClue: JeopardyFinalClue,
  answerTimerSeconds: number,
): JeopardyGameState {
  const now = Date.now();
  return {
    gameType: "jeopardy",
    clues,
    finalClue,
    phase: "idle",
    claimedIndices: [],
    activeClueIndex: null,
    currentScore: 0,
    currentWager: 0,
    timerEndsAt: null,
    answerTimerSeconds,
    startedAt: now,
    updatedAt: now,
  };
}

// ─── Patch helper ─────────────────────────────────────────────────────────────

function patch(
  state: JeopardyGameState,
  changes: Partial<Omit<JeopardyGameState, "gameType" | "clues" | "finalClue" | "startedAt">>,
): JeopardyGameState {
  return { ...state, ...changes, updatedAt: Date.now() };
}

// ─── Phase transitions ────────────────────────────────────────────────────────

/** idle → starting */
export function beginStarting(state: JeopardyGameState): JeopardyGameState {
  return patch(state, { phase: "starting" });
}

/** starting → board */
export function beginBoard(state: JeopardyGameState): JeopardyGameState {
  return patch(state, { phase: "board", activeClueIndex: null, timerEndsAt: null });
}

/**
 * board → clue or board → daily-double-reveal.
 * Marks the clue as the active clue; does NOT yet add it to claimedIndices
 * (it is claimed when the result is determined).
 */
export function selectClue(
  state: JeopardyGameState,
  clueIndex: number,
): JeopardyGameState {
  const clue = state.clues[clueIndex];
  if (!clue) return state;
  const newPhase: JeopardyGamePhase = clue.isDailyDouble ? "daily-double-reveal" : "clue";
  const timerEndsAt =
    newPhase === "clue"
      ? Date.now() + state.answerTimerSeconds * 1000
      : null;
  return patch(state, {
    phase: newPhase,
    activeClueIndex: clueIndex,
    currentWager: 0,
    timerEndsAt,
  });
}

/** clue → correct */
export function markCorrect(state: JeopardyGameState): JeopardyGameState {
  const clue = state.activeClueIndex !== null ? state.clues[state.activeClueIndex] : null;
  if (!clue) return state;
  const newScore = scoreCorrect(state.currentScore, clue.pointValue);
  const newClaimed = [...state.claimedIndices, state.activeClueIndex!];
  return patch(state, {
    phase: "correct",
    currentScore: newScore,
    claimedIndices: newClaimed,
    timerEndsAt: null,
  });
}

/** clue → wrong */
export function markWrong(state: JeopardyGameState): JeopardyGameState {
  const clue = state.activeClueIndex !== null ? state.clues[state.activeClueIndex] : null;
  if (!clue) return state;
  const newScore = scoreWrong(state.currentScore, clue.pointValue);
  const newClaimed = [...state.claimedIndices, state.activeClueIndex!];
  return patch(state, {
    phase: "wrong",
    currentScore: newScore,
    claimedIndices: newClaimed,
    timerEndsAt: null,
  });
}

/** clue → time-expired */
export function markTimeExpired(state: JeopardyGameState): JeopardyGameState {
  const newClaimed = state.activeClueIndex !== null
    ? [...state.claimedIndices, state.activeClueIndex]
    : state.claimedIndices;
  return patch(state, {
    phase: "time-expired",
    claimedIndices: newClaimed,
    timerEndsAt: null,
  });
}

/**
 * correct / wrong / time-expired → board  OR  board-complete.
 * Checks whether all 20 clues are now claimed.
 */
export function returnToBoard(state: JeopardyGameState): JeopardyGameState {
  const allClaimed = state.claimedIndices.length >= 20;
  return patch(state, {
    phase: allClaimed ? "board-complete" : "board",
    activeClueIndex: null,
  });
}

// ─── Daily Double ─────────────────────────────────────────────────────────────

/** daily-double-reveal → daily-double-wager (called after stinger completes) */
export function beginDDWager(state: JeopardyGameState): JeopardyGameState {
  return patch(state, { phase: "daily-double-wager" });
}

/** daily-double-wager → daily-double-clue */
export function confirmDDWager(state: JeopardyGameState, wager: number): JeopardyGameState {
  return patch(state, {
    phase: "daily-double-clue",
    currentWager: wager,
    timerEndsAt: Date.now() + state.answerTimerSeconds * 1000,
  });
}

/** daily-double-clue → daily-double-correct */
export function markDDCorrect(state: JeopardyGameState): JeopardyGameState {
  const newScore = scoreDDCorrect(state.currentScore, state.currentWager);
  const newClaimed = state.activeClueIndex !== null
    ? [...state.claimedIndices, state.activeClueIndex]
    : state.claimedIndices;
  return patch(state, {
    phase: "daily-double-correct",
    currentScore: newScore,
    claimedIndices: newClaimed,
    timerEndsAt: null,
  });
}

/** daily-double-clue → daily-double-wrong */
export function markDDWrong(state: JeopardyGameState): JeopardyGameState {
  const newScore = scoreDDWrong(state.currentScore, state.currentWager);
  const newClaimed = state.activeClueIndex !== null
    ? [...state.claimedIndices, state.activeClueIndex]
    : state.claimedIndices;
  return patch(state, {
    phase: "daily-double-wrong",
    currentScore: newScore,
    claimedIndices: newClaimed,
    timerEndsAt: null,
  });
}

/** daily-double-clue → daily-double-time-expired */
export function markDDTimeExpired(state: JeopardyGameState): JeopardyGameState {
  const newClaimed = state.activeClueIndex !== null
    ? [...state.claimedIndices, state.activeClueIndex]
    : state.claimedIndices;
  return patch(state, {
    phase: "daily-double-time-expired",
    claimedIndices: newClaimed,
    timerEndsAt: null,
  });
}

// ─── Board complete & Final Jeopardy ─────────────────────────────────────────

/** board-complete → final-jeopardy-intro  OR  board → final-jeopardy-intro (manual skip) */
export function beginFinalJeopardyIntro(state: JeopardyGameState): JeopardyGameState {
  return patch(state, { phase: "final-jeopardy-intro", activeClueIndex: null, timerEndsAt: null });
}

/** final-jeopardy-intro → final-jeopardy-category */
export function beginFJCategory(state: JeopardyGameState): JeopardyGameState {
  return patch(state, { phase: "final-jeopardy-category" });
}

/** final-jeopardy-category → final-jeopardy-wager */
export function beginFJWager(state: JeopardyGameState): JeopardyGameState {
  return patch(state, { phase: "final-jeopardy-wager" });
}

/** final-jeopardy-wager → final-jeopardy-clue */
export function confirmFJWager(state: JeopardyGameState, wager: number): JeopardyGameState {
  return patch(state, {
    phase: "final-jeopardy-clue",
    currentWager: wager,
    // Think! music is always exactly 30 seconds — not driven by answerTimerSeconds
    timerEndsAt: Date.now() + 30_000,
  });
}

/** final-jeopardy-clue → final-jeopardy-judging (called when Think! music ends) */
export function beginFJJudging(state: JeopardyGameState): JeopardyGameState {
  return patch(state, { phase: "final-jeopardy-judging", timerEndsAt: null });
}

/** final-jeopardy-judging → final-jeopardy-correct */
export function markFJCorrect(state: JeopardyGameState): JeopardyGameState {
  const newScore = scoreFJCorrect(state.currentScore, state.currentWager);
  return patch(state, { phase: "final-jeopardy-correct", currentScore: newScore });
}

/** final-jeopardy-judging → final-jeopardy-wrong */
export function markFJWrong(state: JeopardyGameState): JeopardyGameState {
  const newScore = scoreFJWrong(state.currentScore, state.currentWager);
  return patch(state, { phase: "final-jeopardy-wrong", currentScore: newScore });
}

/** final-jeopardy-correct / final-jeopardy-wrong → game-over */
export function endGame(state: JeopardyGameState): JeopardyGameState {
  return patch(state, { phase: "game-over" });
}
