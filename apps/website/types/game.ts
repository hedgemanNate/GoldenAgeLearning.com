export type GameType = "millionaire";

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
  timerSeconds: number;
  questionCount: number;
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
