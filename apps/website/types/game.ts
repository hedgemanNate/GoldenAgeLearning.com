export type GameType = "millionaire" | "familyFeud";

// Phase machine for one full game session.
// Transitions are driven exclusively by the instructor remote.
export type MillionaireGamePhase =
  | "idle"              // game configured but not started — Opening Screen on display
  | "starting"          // lets play.mp3 playing — display shows transition, timer not started
  | "question"          // question on screen, timer running, no answer selected
  | "selected"          // an answer is highlighted, not yet locked
  | "locked"            // final answer locked, awaiting Reveal — final answer.mp3
  | "revealed-correct"  // correct answer revealed
  | "revealed-wrong"    // wrong answer revealed (correct shown), points frozen
  | "safe-haven"        // celebratory state shown after Q5/Q10 correct
  | "walk-away"         // walked away — points banked, frozen
  | "phone-a-friend"    // lifeline active, timer paused
  | "ask-instructor"    // lifeline active, timer running
  | "game-over";        // post-Q15 or end-of-deck after frozen state

export interface GameLifelines {
  fiftyFifty: boolean;      // true = has been used
  phoneAFriend: boolean;
  askInstructor: boolean;   // renamed per spec — was askTheAudience
}

export interface GameQuestion {
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: "a" | "b" | "c" | "d";
  difficulty: number;           // 1–15 (position on the money ladder)
  fifty_fifty_remove: string;   // comma-separated wrong options to hide, e.g. "b,c"
}

export interface GameInstance {
  name: string;
  classId: string;
  className: string;  // denormalized copy for display
  gameType: GameType;
  timerSeconds?: number;          // Millionaire: 5–120. Absent for Family Feud.
  questionCount: number;
  fastMoneyTimerPlayer1?: number; // Family Feud only. Default 20.
  fastMoneyTimerPlayer2?: number; // Family Feud only. Default 25.
  createdAt: number;
  createdBy: string;  // uid of staff member who created it
}

export interface GameInstanceWithId extends GameInstance {
  id: string;
}

export interface MillionaireGameState {
  // The 15 questions for this run, already arranged in ladder order Q1..Q15.
  // We store the full question objects so the display does not need a
  // separate lookup — keeps Firebase reads to a single subscription.
  questions: GameQuestion[];

  // 0-based index into `questions`. 0 = Q1, 14 = Q15.
  questionIndex: number;

  phase: MillionaireGamePhase;

  // Currently highlighted answer (single-tap). Cleared at lock or new question.
  selectedAnswer: "a" | "b" | "c" | "d" | null;

  // Locked-in answer (second-tap). Set at "locked" phase, kept through reveal.
  lockedAnswer: "a" | "b" | "c" | "d" | null;

  // Lifelines — true = USED (no longer available).
  lifelines: GameLifelines;

  // Letters of options hidden by 50/50 (e.g. ["a","c"]). Empty when inactive.
  fiftyFiftyHidden: ("a" | "b" | "c" | "d")[];

  // Banked points: highest safe haven reached so far. 0 until Q5 cleared.
  bankedPoints: number;

  // Once true, no further points may be earned. Set on wrong answer or walk-away.
  pointsFrozen: boolean;

  // Final point total to award at game over.
  finalPoints: number;

  // Timer — represented as an absolute end timestamp so display + remote
  // compute the same countdown without polling each other.
  // null when no timer should run (between questions, paused).
  timerEndsAt: number | null;
  // Remaining ms when paused (Phone a Friend). null when not paused.
  timerPausedMs: number | null;

  startedAt: number;
  updatedAt: number;
  // Timer config stored in state so the display can call beginFirstQuestion
  // without needing the GameInstance (which is only on the instructor's device).
  timerSeconds: number;
}

// ─── Family Feud Types ───────────────────────────────────────────────────────

// Exactly 20 phases as specified.
export type FamilyFeudGamePhase =
  | "idle"               // game loaded, opening screen, waiting to start
  | "starting"           // intro fanfare plays, transition before Round 1
  | "face-off"           // face-off question shown, waiting for buzz-in
  | "face-off-buzz"      // a student has buzzed in, waiting for answer input
  | "face-off-correct"   // buzz-in answer is on board — answer reveals, face-off ends
  | "face-off-wrong"     // buzz-in answer is NOT on board — other student gets a chance
  | "playing"            // class playing the board — answers being revealed
  | "answer-revealed"    // an answer just flipped — brief display moment before returning to playing
  | "strike"             // wrong answer — strike displayed, then returns to playing
  | "three-strikes"      // third strike — remaining answers revealed, round ends
  | "round-over"         // round summary shown, points tallied
  | "round-transition"   // transition between rounds
  | "fast-money-intro"   // Fast Money announced — intro fanfare
  | "fast-money-player1"      // Player 1 answering — timer running
  | "fast-money-player1-done" // Player 1 time up — answers hidden, Player 2 prepares
  | "fast-money-player2"      // Player 2 answering — timer running
  | "fast-money-player2-done" // Player 2 time up
  | "fast-money-reveal"  // both players' answers revealed question by question
  | "fast-money-score"   // final Fast Money score shown
  | "game-over";         // final score shown, points awarded to students

// A single main-game survey question with 5–8 ranked answers.
export interface FamilyFeudMainQuestion {
  round: 1 | 2 | 3;
  question_text: string;
  answer_1: string;
  answer_2: string;
  answer_3: string;
  answer_4: string;
  answer_5: string;
  answer_6: string | null;
  answer_7: string | null;
  answer_8: string | null;
  points_1: number;
  points_2: number;
  points_3: number;
  points_4: number;
  points_5: number;
  points_6: number | null;
  points_7: number | null;
  points_8: number | null;
  answer_count: number;  // 5–8
}

// One of the 5 Fast Money questions.
export interface FamilyFeudFastMoneyQuestion {
  question_text: string;
  answer_1: string;
  answer_2: string;
  answer_3: string;
  answer_4: string;
  answer_5: string;
  answer_6: string | null;
  answer_7: string | null;
  answer_8: string | null;
  points_1: number;
  points_2: number;
  points_3: number;
  points_4: number;
  points_5: number;
  points_6: number | null;
  points_7: number | null;
  points_8: number | null;
  answer_count: number;  // 5–8
}

// A scoring selection made by the assistant during the reveal phase.
// number  = 0-based index into the question's answers (the matched board answer)
// "not-on-board" = no match; scores zero
// "duplicate"    = matches Player 1's selection (Player 2 only); scores zero
// null           = not yet scored
export type FamilyFeudScoreSelection =
  | number
  | "not-on-board"
  | "duplicate"
  | null;

export interface FamilyFeudFastMoneyState {
  // Raw typed text from the timed rounds — 5 entries each (empty string = blank)
  player1Answers: string[];
  player2Answers: string[];

  // Absolute end timestamp while a timed round is running; null otherwise
  timerEndsAt: number | null;

  // Reveal-phase selections — 5 entries each (null = not yet scored by assistant)
  player1Selections: Array<number | "not-on-board" | null>;
  player2Selections: FamilyFeudScoreSelection[];

  // Which of the 5 questions have already been "flipped" on the display
  revealedQuestions: boolean[];

  // Which question the assistant is currently scoring in the reveal phase (0–4)
  currentRevealQuestion: number;

  // Running total as reveal-phase answers are confirmed
  fastMoneyTotal: number;
}

export interface FamilyFeudGameState {
  // Discriminator — lets display pages dispatch without checking GameInstance.gameType
  gameType: "familyFeud";

  // Questions loaded at game start; stored in state so display needs no extra DB read
  mainQuestions: FamilyFeudMainQuestion[];      // exactly 3 (one per round)
  fastMoneyQuestions: FamilyFeudFastMoneyQuestion[];  // exactly 5

  phase: FamilyFeudGamePhase;

  // 1-indexed current round (1–3)
  currentRound: 1 | 2 | 3;

  // 0-based indices of answers that have been revealed on the current board
  revealedAnswerIndices: number[];

  // Current strike count (0–3; reaching 3 ends the round)
  strikes: number;

  // Points earned per round — index 0 = round 1
  roundTotals: [number, number, number];

  // Running game total (roundTotals sum + fastMoneyState.fastMoneyTotal)
  gameTotal: number;

  // Which student buzzed in during face-off-buzz (1 or 2); null outside face-off
  faceOffBuzzedStudent: 1 | 2 | null;

  // Fast Money — null until fast-money-intro phase begins
  fastMoneyState: FamilyFeudFastMoneyState | null;

  // Config stored in state so display can read timers without the GameInstance
  fastMoneyTimerPlayer1: number;  // seconds (default 20)
  fastMoneyTimerPlayer2: number;  // seconds (default 25)

  startedAt: number;
  updatedAt: number;
}
