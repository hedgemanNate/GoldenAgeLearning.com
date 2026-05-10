"use client";

// Manages all Millionaire game audio. Audio is owned by the DISPLAY page only —
// the instructor remote does not produce sound. Files are served from
// `/audio/Millionaire/*.mp3` (drop them into `apps/website/public/audio/Millionaire/`).
//
// If a file is missing, playback fails silently — the game still works.
//
// GUARANTEE: No two audio tracks ever play simultaneously.
// A single `track` ref holds the active Audio element. Every new sound stops
// the previous one before starting. onended callbacks are nulled on stop so
// they never fire after being superseded.

import { useEffect, useRef } from "react";
import type { MillionaireGameState } from "../../types/game";

// ─── File paths ──────────────────────────────────────────────────────────────

// Map ladder index (0..14) → background music tier file.
function tierMusicFor(questionIndex: number): string {
  if (questionIndex <= 4)   return "/audio/Millionaire/100 1000 music.mp3";
  if (questionIndex <= 9)   return "/audio/Millionaire/2000 32000.mp3";
  if (questionIndex === 10) return "/audio/Millionaire/64000 music.mp3";
  if (questionIndex <= 12)  return "/audio/Millionaire/125000 250000 music.mp3";
  if (questionIndex === 13) return "/audio/Millionaire/500000 music.mp3";
  return "/audio/Millionaire/1000000 music.mp3";
}

// One-shot SFX paths.
const SFX = {
  mainTheme:   "/audio/Millionaire/main theme.mp3",
  letsPlay:    "/audio/Millionaire/lets play.mp3",
  finalAnswer: "/audio/Millionaire/final answer.mp3",
  correct:     "/audio/Millionaire/correctanswer.mp3",
  wrong:       "/audio/Millionaire/wrong answer.mp3",
  phoneFriend: "/audio/Millionaire/phone a friend.mp3",
  walkAway:    "/audio/Millionaire/commerical break.mp3",
  milWin:      "/audio/Millionaire/1000000 Win.mp3",
} as const;

// ─── Audio helpers ────────────────────────────────────────────────────────────

function makeAudio(src: string, loop = false): HTMLAudioElement {
  const a = new Audio(src);
  a.loop = loop;
  return a;
}

function safePlay(a: HTMLAudioElement): void {
  a.play().catch(() => {
    // Missing file or browser autoplay policy — fail silently.
  });
}

/** Stop an audio element and null its onended so stale callbacks never fire. */
function stopAudio(a: HTMLAudioElement | null): void {
  if (!a) return;
  a.onended = null;
  a.pause();
  a.currentTime = 0;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Drives all Millionaire game audio from the live game state.
 *
 * `onStartingComplete` is called when `lets play.mp3` finishes. The display
 * page uses it to write the `question` phase + timer into Firebase, advancing
 * from `starting` to `question` without any instructor tap.
 */
export function useMillionaireAudio(
  state: MillionaireGameState | null,
  enabled: boolean,
  onStartingComplete?: () => void,
) {
  // The single active track. Replacing it always stops the previous one.
  const track = useRef<HTMLAudioElement | null>(null);

  const lastPhase = useRef<string>("");
  const lastTierUrl = useRef<string>("");

  // Tracks which timerEndsAt value we've already fired the expiry sound for,
  // so we never double-fire for the same countdown.
  const timerExpiredFiredFor = useRef<number | null>(null);

  // Stable ref so the onended closure always calls the latest callback.
  const onStartingCompleteRef = useRef(onStartingComplete);
  useEffect(() => { onStartingCompleteRef.current = onStartingComplete; }, [onStartingComplete]);

  // Stop everything on unmount.
  useEffect(() => {
    return () => {
      stopAudio(track.current);
      track.current = null;
    };
  }, []);

  // ── Timer expiry: play wrong answer sound the moment the countdown hits zero.
  // The main phase effect only fires on state changes — it won't notice the
  // timer expiring mid-question. This effect watches timerEndsAt directly.
  useEffect(() => {
    if (!enabled || !state) return;

    const timerEndsAt = state.timerEndsAt;
    // Only fire when there's a live (non-paused) timer on an active question phase.
    if (timerEndsAt == null) return;
    if (state.timerPausedMs != null) return;
    const activePhase =
      state.phase === "question" ||
      state.phase === "selected" ||
      state.phase === "ask-instructor";
    if (!activePhase || state.pointsFrozen) return;
    // Don't re-fire for a timerEndsAt we've already handled.
    if (timerExpiredFiredFor.current === timerEndsAt) return;

    function fireExpiry() {
      if (timerExpiredFiredFor.current === timerEndsAt) return;
      timerExpiredFiredFor.current = timerEndsAt;
      stopAudio(track.current);
      lastTierUrl.current = "";
      const a = makeAudio(SFX.wrong, false);
      track.current = a;
      safePlay(a);
    }

    const remaining = timerEndsAt - Date.now();
    if (remaining <= 0) {
      fireExpiry();
      return;
    }

    const id = window.setTimeout(fireExpiry, remaining);
    return () => window.clearTimeout(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, state?.timerEndsAt, state?.timerPausedMs, state?.phase, state?.pointsFrozen]);

  useEffect(() => {
    if (!enabled || !state) {
      stopAudio(track.current);
      track.current = null;
      lastPhase.current = "";
      lastTierUrl.current = "";
      return;
    }

    const phase = state.phase;
    const idx = state.questionIndex;
    const phaseChanged = phase !== lastPhase.current;

    // ── Play a one-shot (non-looping) sound. Stops whatever is playing. ───────
    function playOneShot(src: string, onEnded?: () => void): void {
      stopAudio(track.current);
      lastTierUrl.current = "";
      const a = makeAudio(src, false);
      a.onended = onEnded ?? null;
      track.current = a;
      safePlay(a);
    }

    // ── Start a looping background track. No-op if the same URL is active. ───
    function playLoop(src: string): void {
      if (lastTierUrl.current === src) return;
      stopAudio(track.current);
      const a = makeAudio(src, true);
      track.current = a;
      lastTierUrl.current = src;
      safePlay(a);
    }

    // ── Silence everything. ───────────────────────────────────────────────────
    function silence(): void {
      stopAudio(track.current);
      track.current = null;
      lastTierUrl.current = "";
    }

    // ── idle ──────────────────────────────────────────────────────────────────
    if (phase === "idle") {
      if (phaseChanged) playLoop(SFX.mainTheme);
      lastPhase.current = phase;
      return;
    }

    // ── starting ──────────────────────────────────────────────────────────────
    // Main theme stops. lets play.mp3 plays once.
    // When it ends, onStartingComplete writes question phase + timer to Firebase.
    if (phase === "starting") {
      if (phaseChanged) {
        playOneShot(SFX.letsPlay, () => {
          onStartingCompleteRef.current?.();
        });
      }
      lastPhase.current = phase;
      return;
    }

    // ── game-over ─────────────────────────────────────────────────────────────
    // If the class answered Q15 correctly (1,000,000 pts, not frozen), play
    // the million-win fanfare. Otherwise silence.
    if (phase === "game-over") {
      if (phaseChanged) {
        const isMillionWin =
          state.questionIndex === 14 &&
          !state.pointsFrozen &&
          state.finalPoints === 1_000_000;
        if (isMillionWin) {
          playOneShot(SFX.milWin);
        } else {
          silence();
        }
      }
      lastPhase.current = phase;
      return;
    }

    // ── question / selected / ask-instructor ──────────────────────────────────
    // Tier music loops. Silent when pointsFrozen (points already zeroed/banked).
    // Also stay silent if the timer has already expired — the timer-expiry effect
    // owns audio from that point on and we must not restart the thinking music.
    if (phase === "question" || phase === "selected" || phase === "ask-instructor") {
      const timerExpired =
        state.timerEndsAt != null &&
        state.timerPausedMs == null &&
        state.timerEndsAt <= Date.now();
      if (state.pointsFrozen || timerExpired) {
        if (phaseChanged) silence();
      } else {
        playLoop(tierMusicFor(idx)); // no-op if same loop already running
      }
      lastPhase.current = phase;
      return;
    }

    // ── locked ────────────────────────────────────────────────────────────────
    // Tier music stops immediately. final answer.mp3 plays once.
    if (phase === "locked") {
      if (phaseChanged) playOneShot(SFX.finalAnswer);
      lastPhase.current = phase;
      return;
    }

    // ── revealed-correct ──────────────────────────────────────────────────────
    // correctanswer.mp3 plays once. When it ends, tier music resumes —
    // unless this was Q15, a safe-haven question (instructor will handle next),
    // or the game is frozen.
    if (phase === "revealed-correct") {
      if (phaseChanged) {
        const isQ15        = idx === 14;
        const isSafeHaven  = idx === 4 || idx === 9; // Q5 / Q10 (0-based)
        const shouldResume = !isQ15 && !isSafeHaven && !state.pointsFrozen;
        const tierUrl      = tierMusicFor(idx);
        playOneShot(SFX.correct, shouldResume ? () => {
          playLoop(tierUrl);
        } : undefined);
      }
      lastPhase.current = phase;
      return;
    }

    // ── revealed-wrong ────────────────────────────────────────────────────────
    // wrong answer.mp3 plays once. Tier music never resumes.
    if (phase === "revealed-wrong") {
      if (phaseChanged) playOneShot(SFX.wrong);
      lastPhase.current = phase;
      return;
    }

    // ── safe-haven ────────────────────────────────────────────────────────────
    // Milestone correct answer (Q5/Q10). Play the correct answer sound once —
    // the phase jumps here directly (skipping revealed-correct) so we own it.
    if (phase === "safe-haven") {
      if (phaseChanged) playOneShot(SFX.correct);
      lastPhase.current = phase;
      return;
    }

    // ── walk-away ─────────────────────────────────────────────────────────────
    // Tier music stops. commerical break.mp3 plays once. Does not resume.
    if (phase === "walk-away") {
      if (phaseChanged) playOneShot(SFX.walkAway);
      lastPhase.current = phase;
      return;
    }

    // ── phone-a-friend ────────────────────────────────────────────────────────
    // Tier music stops immediately. phone a friend.mp3 plays once.
    // On Resume Timer the instructor restores phase (question/selected) which
    // causes this hook's question/selected branch to restart tier music.
    if (phase === "phone-a-friend") {
      if (phaseChanged) playOneShot(SFX.phoneFriend);
      lastPhase.current = phase;
      return;
    }

    lastPhase.current = phase;
  }, [state, enabled]);
}
