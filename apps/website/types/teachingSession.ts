// Teaching session — live state shared between a presenter (controller)
// and a single bound display device. Stored at /teachingSessions/{ownerUid}.
//
// Design notes:
// - One active session per staff user. The session id IS the owner's uid,
//   which makes "who owns this" trivially provable in security rules and
//   guarantees a single-display-per-staff invariant.
// - The display "binds" by writing displayBoundAt + displayBindId. Any
//   second display attempting to bind sees its bindId get overwritten and
//   knows it has been replaced.

export type TeachingSessionMode = "slides" | "game";
export type TeachingSessionStatus = "active" | "ended";

export interface TeachingSession {
  ownerId: string;            // staff user uid (also the session id)
  ownerName: string;
  classSlug: string;          // e.g. "master-the-keyboard"
  status: TeachingSessionStatus;
  mode: TeachingSessionMode;
  currentSlide: number;       // zero-indexed
  totalSlides: number;        // helps the controller cap navigation
  gameState: Record<string, unknown> | null;
  displayBindId: string | null;   // random id written by the latest display
  displayBoundAt: number | null;  // ms timestamp
  createdAt: number;
  updatedAt: number;
  endedAt: number | null;
}
