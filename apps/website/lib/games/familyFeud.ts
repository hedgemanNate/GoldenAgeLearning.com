// Pure helpers for the Family Feud game engine.
// No React, no Firebase — just data transforms and rules.

import type {
  FamilyFeudGameState,
  FamilyFeudGamePhase,
  FamilyFeudMainQuestion,
  FamilyFeudFastMoneyQuestion,
  FamilyFeudFastMoneyState,
  FamilyFeudScoreSelection,
} from "../../types/game";

// ─── Validation ──────────────────────────────────────────────────────────────

export function canStartFamilyFeudGame(
  mainQs: FamilyFeudMainQuestion[],
  fastMoneyQs: FamilyFeudFastMoneyQuestion[],
): boolean {
  const hasRound1 = mainQs.some((q) => q.round === 1);
  const hasRound2 = mainQs.some((q) => q.round === 2);
  const hasRound3 = mainQs.some((q) => q.round === 3);
  const hasFiveFastMoney = fastMoneyQs.length === 5;
  return hasRound1 && hasRound2 && hasRound3 && hasFiveFastMoney;
}

// ─── Answer accessors ────────────────────────────────────────────────────────

// Get all valid answer texts for a question as an array (0-based index).
export function getAnswers(q: FamilyFeudMainQuestion | FamilyFeudFastMoneyQuestion): string[] {
  const all = [
    q.answer_1, q.answer_2, q.answer_3, q.answer_4, q.answer_5,
    q.answer_6, q.answer_7, q.answer_8,
  ];
  return all.slice(0, q.answer_count) as string[];
}

// Get all point values for a question as an array (0-based index).
export function getPoints(q: FamilyFeudMainQuestion | FamilyFeudFastMoneyQuestion): number[] {
  const all = [
    q.points_1, q.points_2, q.points_3, q.points_4, q.points_5,
    q.points_6, q.points_7, q.points_8,
  ];
  return all.slice(0, q.answer_count) as number[];
}

// Compute total points for all revealed answers on a board.
export function computeRevealedPoints(
  q: FamilyFeudMainQuestion,
  revealedIndices: number[],
): number {
  const pts = getPoints(q);
  return revealedIndices.reduce((sum, idx) => sum + (pts[idx] ?? 0), 0);
}

// ─── Initial state ───────────────────────────────────────────────────────────

export function initialGameState(
  mainQuestions: FamilyFeudMainQuestion[],
  fastMoneyQuestions: FamilyFeudFastMoneyQuestion[],
  fastMoneyTimerPlayer1: number,
  fastMoneyTimerPlayer2: number,
): FamilyFeudGameState {
  const now = Date.now();
  return {
    gameType: "familyFeud",
    mainQuestions,
    fastMoneyQuestions,
    phase: "idle",
    currentRound: 1,
    revealedAnswerIndices: [],
    strikes: 0,
    roundTotals: [0, 0, 0],
    gameTotal: 0,
    faceOffBuzzedStudent: null,
    fastMoneyState: null,
    fastMoneyTimerPlayer1,
    fastMoneyTimerPlayer2,
    startedAt: now,
    updatedAt: now,
  };
}

// ─── Current question helper ─────────────────────────────────────────────────

export function getCurrentQuestion(state: FamilyFeudGameState): FamilyFeudMainQuestion | null {
  return state.mainQuestions.find((q) => q.round === state.currentRound) ?? null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function patch(
  state: FamilyFeudGameState,
  changes: Partial<Omit<FamilyFeudGameState, "gameType" | "mainQuestions" | "fastMoneyQuestions" | "startedAt">>,
): FamilyFeudGameState {
  return { ...state, ...changes, updatedAt: Date.now() };
}

// ─── Phase transitions ───────────────────────────────────────────────────────

// idle → starting
export function beginGame(state: FamilyFeudGameState): FamilyFeudGameState {
  return patch(state, { phase: "starting" });
}

// starting → face-off (called when intro fanfare ends)
export function beginFaceOff(state: FamilyFeudGameState): FamilyFeudGameState {
  return patch(state, {
    phase: "face-off",
    revealedAnswerIndices: [],
    strikes: 0,
    faceOffBuzzedStudent: null,
  });
}

// face-off → face-off-buzz: instructor taps Buzz for a student
export function applyBuzzIn(
  state: FamilyFeudGameState,
  student: 1 | 2,
): FamilyFeudGameState {
  return patch(state, { phase: "face-off-buzz", faceOffBuzzedStudent: student });
}

// face-off-buzz: instructor taps a board answer or "Not on Board"
// Returns the new state after evaluating the first student's face-off answer.
// - answer on board → face-off-correct (reveal it, store its index)
// - not on board    → face-off-wrong (other student gets a chance)
export function applyFaceOffAnswer(
  state: FamilyFeudGameState,
  answerIndex: number | "not-on-board",
): FamilyFeudGameState {
  if (answerIndex === "not-on-board") {
    return patch(state, { phase: "face-off-wrong" });
  }
  return patch(state, {
    phase: "face-off-correct",
    revealedAnswerIndices: [answerIndex],
  });
}

// face-off-wrong: instructor taps a board answer or "Not on Board" for the second student
// - answer on board → face-off-correct (reveal it)
// - not on board    → playing (both wrong; class plays with no pre-reveals)
export function applyFaceOffOpponentAnswer(
  state: FamilyFeudGameState,
  answerIndex: number | "not-on-board",
): FamilyFeudGameState {
  if (answerIndex === "not-on-board") {
    // Both students were wrong — class plays the board with nothing pre-revealed
    return patch(state, { phase: "playing", revealedAnswerIndices: [] });
  }
  return patch(state, {
    phase: "face-off-correct",
    revealedAnswerIndices: [answerIndex],
  });
}

// face-off-correct → playing (called after the brief display moment)
export function beginPlaying(state: FamilyFeudGameState): FamilyFeudGameState {
  return patch(state, { phase: "playing" });
}

// playing: instructor taps a board answer that the class gave (correct answer)
export function applyBoardAnswer(
  state: FamilyFeudGameState,
  answerIndex: number,
): FamilyFeudGameState {
  const newRevealed = [...state.revealedAnswerIndices, answerIndex];
  const q = getCurrentQuestion(state);
  const allRevealed = q ? newRevealed.length === q.answer_count : false;

  if (allRevealed) {
    // All answers revealed — round ends
    const roundPoints = q ? computeRevealedPoints(q, newRevealed) : 0;
    const newRoundTotals = [...state.roundTotals] as [number, number, number];
    newRoundTotals[state.currentRound - 1] = roundPoints;
    const newGameTotal = newRoundTotals.reduce((a, b) => a + b, 0);
    return patch(state, {
      phase: "round-over",
      revealedAnswerIndices: newRevealed,
      roundTotals: newRoundTotals,
      gameTotal: newGameTotal,
    });
  }

  // Not all revealed yet — show brief answer-revealed phase
  return patch(state, {
    phase: "answer-revealed",
    revealedAnswerIndices: newRevealed,
  });
}

// answer-revealed → playing (called after brief display delay; or round-over if auto-detected)
export function advanceFromAnswerRevealed(state: FamilyFeudGameState): FamilyFeudGameState {
  const q = getCurrentQuestion(state);
  const allRevealed = q ? state.revealedAnswerIndices.length === q.answer_count : false;

  if (allRevealed) {
    const roundPoints = q ? computeRevealedPoints(q, state.revealedAnswerIndices) : 0;
    const newRoundTotals = [...state.roundTotals] as [number, number, number];
    newRoundTotals[state.currentRound - 1] = roundPoints;
    const newGameTotal = newRoundTotals.reduce((a, b) => a + b, 0);
    return patch(state, { phase: "round-over", roundTotals: newRoundTotals, gameTotal: newGameTotal });
  }

  return patch(state, { phase: "playing" });
}

// playing: instructor taps "Wrong Answer" (class gave an answer not on the board)
// Returns new state: strike → playing, or three-strikes → three-strikes (round over)
export function applyWrongAnswer(state: FamilyFeudGameState): FamilyFeudGameState {
  const newStrikes = state.strikes + 1;

  if (newStrikes >= 3) {
    // Third strike — reveal all remaining answers and end round
    const q = getCurrentQuestion(state);
    const allIndices = q
      ? Array.from({ length: q.answer_count }, (_, i) => i)
      : [];
    const roundPoints = q ? computeRevealedPoints(q, state.revealedAnswerIndices) : 0;
    const newRoundTotals = [...state.roundTotals] as [number, number, number];
    newRoundTotals[state.currentRound - 1] = roundPoints;
    const newGameTotal = newRoundTotals.reduce((a, b) => a + b, 0);
    return patch(state, {
      phase: "three-strikes",
      strikes: newStrikes,
      revealedAnswerIndices: allIndices,
      roundTotals: newRoundTotals,
      gameTotal: newGameTotal,
    });
  }

  return patch(state, { phase: "strike", strikes: newStrikes });
}

// strike → playing (called after the strike display animation completes)
export function advanceFromStrike(state: FamilyFeudGameState): FamilyFeudGameState {
  return patch(state, { phase: "playing" });
}

// three-strikes or round-over → round-over (after remote taps "Continue")
export function advanceToRoundOver(state: FamilyFeudGameState): FamilyFeudGameState {
  const q = getCurrentQuestion(state);
  const roundPoints = q ? computeRevealedPoints(q, state.revealedAnswerIndices) : 0;
  const newRoundTotals = [...state.roundTotals] as [number, number, number];
  newRoundTotals[state.currentRound - 1] = roundPoints;
  const newGameTotal = newRoundTotals.reduce((a, b) => a + b, 0);
  return patch(state, {
    phase: "round-over",
    roundTotals: newRoundTotals,
    gameTotal: newGameTotal,
  });
}

// round-over → round-transition → face-off (next round) or fast-money-intro (after round 3)
export function advanceRound(state: FamilyFeudGameState): FamilyFeudGameState {
  return patch(state, { phase: "round-transition" });
}

export function advanceFromRoundTransition(state: FamilyFeudGameState): FamilyFeudGameState {
  if (state.currentRound === 3) {
    return patch(state, { phase: "fast-money-intro" });
  }
  const nextRound = (state.currentRound + 1) as 1 | 2 | 3;
  return patch(state, {
    phase: "face-off",
    currentRound: nextRound,
    revealedAnswerIndices: [],
    strikes: 0,
    faceOffBuzzedStudent: null,
  });
}

// ─── Fast Money ──────────────────────────────────────────────────────────────

// fast-money-intro → fast-money-player1
export function startFastMoneyPlayer1(state: FamilyFeudGameState): FamilyFeudGameState {
  const now = Date.now();
  const fm: FamilyFeudFastMoneyState = {
    player1Answers: ["", "", "", "", ""],
    player2Answers: ["", "", "", "", ""],
    timerEndsAt: now + state.fastMoneyTimerPlayer1 * 1000,
    player1Selections: [null, null, null, null, null],
    player2Selections: [null, null, null, null, null],
    revealedQuestions: [false, false, false, false, false],
    currentRevealQuestion: 0,
    fastMoneyTotal: 0,
  };
  return patch(state, { phase: "fast-money-player1", fastMoneyState: fm });
}

// Update a single typed answer during the timed round.
// Used with debounce from the remote. Does NOT change phase.
export function updateFastMoneyAnswer(
  state: FamilyFeudGameState,
  player: 1 | 2,
  questionIndex: number,  // 0–4
  text: string,
): FamilyFeudGameState {
  if (!state.fastMoneyState) return state;
  const fm = { ...state.fastMoneyState };
  if (player === 1) {
    const arr = [...fm.player1Answers];
    arr[questionIndex] = text;
    fm.player1Answers = arr;
  } else {
    const arr = [...fm.player2Answers];
    arr[questionIndex] = text;
    fm.player2Answers = arr;
  }
  return patch(state, { fastMoneyState: fm });
}

// fast-money-player1 → fast-money-player1-done (timer expired or instructor ends)
export function endFastMoneyPlayer1(state: FamilyFeudGameState): FamilyFeudGameState {
  if (!state.fastMoneyState) return state;
  const fm = { ...state.fastMoneyState, timerEndsAt: null };
  return patch(state, { phase: "fast-money-player1-done", fastMoneyState: fm });
}

// fast-money-player1-done → fast-money-player2
export function startFastMoneyPlayer2(state: FamilyFeudGameState): FamilyFeudGameState {
  if (!state.fastMoneyState) return state;
  const now = Date.now();
  const fm = {
    ...state.fastMoneyState,
    timerEndsAt: now + state.fastMoneyTimerPlayer2 * 1000,
  };
  return patch(state, { phase: "fast-money-player2", fastMoneyState: fm });
}

// fast-money-player2 → fast-money-player2-done
export function endFastMoneyPlayer2(state: FamilyFeudGameState): FamilyFeudGameState {
  if (!state.fastMoneyState) return state;
  const fm = { ...state.fastMoneyState, timerEndsAt: null };
  return patch(state, { phase: "fast-money-player2-done", fastMoneyState: fm });
}

// fast-money-player2-done → fast-money-reveal
export function startFastMoneyReveal(state: FamilyFeudGameState): FamilyFeudGameState {
  if (!state.fastMoneyState) return state;
  const fm = { ...state.fastMoneyState, currentRevealQuestion: 0 };
  return patch(state, { phase: "fast-money-reveal", fastMoneyState: fm });
}

// Set the scoring selection for Player 1 on a given question. Can be called
// at any time during fast-money-reveal to change a previous selection.
export function setPlayer1Selection(
  state: FamilyFeudGameState,
  questionIndex: number,
  selection: number | "not-on-board",
): FamilyFeudGameState {
  if (!state.fastMoneyState) return state;
  const selections = [...state.fastMoneyState.player1Selections];
  selections[questionIndex] = selection;
  const fm = { ...state.fastMoneyState, player1Selections: selections };
  return patch(state, { fastMoneyState: fm });
}

// Set the scoring selection for Player 2 on a given question.
export function setPlayer2Selection(
  state: FamilyFeudGameState,
  questionIndex: number,
  selection: FamilyFeudScoreSelection,
): FamilyFeudGameState {
  if (!state.fastMoneyState) return state;
  const selections = [...state.fastMoneyState.player2Selections];
  selections[questionIndex] = selection;
  const fm = { ...state.fastMoneyState, player2Selections: selections };
  return patch(state, { fastMoneyState: fm });
}

// Navigate the assistant to a different question in the reveal phase.
export function setCurrentRevealQuestion(
  state: FamilyFeudGameState,
  questionIndex: number,
): FamilyFeudGameState {
  if (!state.fastMoneyState) return state;
  const fm = { ...state.fastMoneyState, currentRevealQuestion: questionIndex };
  return patch(state, { fastMoneyState: fm });
}

// Confirm current question's selections and trigger the answer flip on the display.
// Computes points from both players' selections and updates fastMoneyTotal.
export function revealFastMoneyQuestion(
  state: FamilyFeudGameState,
  questionIndex: number,
): FamilyFeudGameState {
  if (!state.fastMoneyState) return state;
  const fm = { ...state.fastMoneyState };
  const revealedQs = [...fm.revealedQuestions];
  revealedQs[questionIndex] = true;
  fm.revealedQuestions = revealedQs;

  // Compute running total from all revealed questions
  let total = 0;
  const q = state.fastMoneyQuestions[questionIndex];
  const pts = q ? getPoints(q) : [];

  // Recompute total from all revealed questions to ensure accuracy
  for (let i = 0; i < 5; i++) {
    if (!revealedQs[i]) continue;
    const fmq = state.fastMoneyQuestions[i];
    if (!fmq) continue;
    const qPts = getPoints(fmq);

    const p1sel = fm.player1Selections[i];
    if (typeof p1sel === "number") total += qPts[p1sel] ?? 0;

    const p2sel = fm.player2Selections[i];
    if (typeof p2sel === "number") total += qPts[p2sel] ?? 0;
  }

  fm.fastMoneyTotal = total;

  // Advance to the next un-revealed question (if any)
  let next = questionIndex + 1;
  while (next < 5 && revealedQs[next]) next++;
  if (next >= 5) next = questionIndex; // already on last
  fm.currentRevealQuestion = next;

  return patch(state, {
    fastMoneyState: fm,
    gameTotal: state.roundTotals.reduce((a, b) => a + b, 0) + total,
  });
}

// fast-money-reveal → fast-money-score
export function finalizeFastMoney(state: FamilyFeudGameState): FamilyFeudGameState {
  return patch(state, { phase: "fast-money-score" });
}

// fast-money-score → game-over
export function endGame(state: FamilyFeudGameState): FamilyFeudGameState {
  return patch(state, { phase: "game-over" });
}
