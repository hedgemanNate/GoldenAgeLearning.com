export type GameType = "millionaire";

export type MillionaireGamePhase =
  | "idle"
  | "question"
  | "answer-reveal"
  | "walk-away"
  | "game-over";

export interface GameLifelines {
  fiftyFifty: boolean;      // true = has been used
  phoneAFriend: boolean;
  askTheAudience: boolean;
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
  questionIndex: number;
  phase: MillionaireGamePhase;
  selectedAnswer: string | null;
  lifelines: GameLifelines;
  currentPoints: number;
  lockedPoints: number;
  startedAt: number;
  updatedAt: number;
}
