"use client";

// Manages all Jeopardy! game audio.
// Audio is owned by the DISPLAY page only — the instructor remote produces no sound.
// Files are served from `/audio/Jeopardy/*.mp3`.
//
// Architecture: single `track` ref — only one audio source plays at a time.
// Exception: the category reveal sequence fires 4 one-shots in sequence during
// `starting` using a setTimeout chain.
//
// If any file is missing, playback fails silently — game still works.

import { useEffect, useRef } from "react";
import type { JeopardyGameState } from "../../types/game";

// ─── File paths ───────────────────────────────────────────────────────────────

const DIR = "/audio/Jeopardy";

const F = {
  theme:                  `${DIR}/j6_2018_sound_intro.mp3`,
  categoryReveal:         `${DIR}/j6_2018_sound_categories_v1.mp3`,
  clueSelect:             `${DIR}/j6_2018_sound_ping.mp3`,
  dailyDouble:            `${DIR}/daily-double.mp3`,
  dailyDoubleWager:       `${DIR}/daily-double-wager-music.mp3`,
  correct:                `${DIR}/j6_2018_sound_ping.mp3`,
  wrong:                  `${DIR}/wrong.mp3`,
  timeExpired:            `${DIR}/j6_2018_sound_time.mp3`,
  boardComplete:          `${DIR}/board-complete.mp3`,
  finalJeopardyIntro:     `${DIR}/final-jeopardy-intro.mp3`,
  finalJeopardyCategory:  `${DIR}/final-jeopardy-category.mp3`,
  thinkMusic:             `${DIR}/j6_2018_sound_thinkmusic.mp3`,
  finalJeopardyCorrect:   `${DIR}/final-jeopardy-correct.mp3`,
  finalJeopardyWrong:     `${DIR}/final-jeopardy-wrong.mp3`,
  gameOver:               `${DIR}/j6_2018_sound_closing.mp3`,
} as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function make(src: string, loop = false): HTMLAudioElement {
  const a = new Audio(src);
  a.loop = loop;
  return a;
}

function safePlay(a: HTMLAudioElement): void {
  a.play().catch(() => { /* missing file or autoplay policy — fail silently */ });
}

function stop(a: HTMLAudioElement | null): void {
  if (!a) return;
  a.onended = null;
  a.pause();
  a.currentTime = 0;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Drives all Jeopardy audio from the live game state.
 *
 * `onStartingComplete` — called after all 4 category-reveal sounds fire during
 *   `starting`. The display/dispatcher uses this to write `beginBoard()` to Firebase.
 *
 * `onFinalJeopardyThinkComplete` — called when think-music ends naturally (30 s).
 *   The dispatcher uses this to write `beginFJJudging()` to Firebase.
 */
export function useJeopardyAudio(
  state: JeopardyGameState | null,
  enabled: boolean,
  onStartingComplete?: () => void,
  onFinalJeopardyThinkComplete?: () => void,
) {
  const track = useRef<HTMLAudioElement | null>(null);
  const loopTrack = useRef<HTMLAudioElement | null>(null);
  const loopSrc = useRef<string>("");
  const lastPhase = useRef<string>("");

  // Keep callbacks stable in refs so closures don't go stale
  const onStartingCompleteRef = useRef(onStartingComplete);
  const onThinkCompleteRef = useRef(onFinalJeopardyThinkComplete);
  useEffect(() => { onStartingCompleteRef.current = onStartingComplete; }, [onStartingComplete]);
  useEffect(() => { onThinkCompleteRef.current = onFinalJeopardyThinkComplete; }, [onFinalJeopardyThinkComplete]);

  // Category reveal timeout chain — stored so we can cancel on cleanup
  const categoryTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Cleanup everything on unmount
  useEffect(() => {
    return () => {
      stop(track.current);
      stop(loopTrack.current);
      track.current = null;
      loopTrack.current = null;
      loopSrc.current = "";
      categoryTimers.current.forEach(clearTimeout);
      categoryTimers.current = [];
    };
  }, []);

  useEffect(() => {
    if (!enabled || !state) {
      stop(track.current);
      stop(loopTrack.current);
      track.current = null;
      loopTrack.current = null;
      loopSrc.current = "";
      lastPhase.current = "";
      categoryTimers.current.forEach(clearTimeout);
      categoryTimers.current = [];
      return;
    }

    const phase = state.phase;
    const phaseChanged = phase !== lastPhase.current;
    if (!phaseChanged) return;
    lastPhase.current = phase;

    // ── Helpers ──────────────────────────────────────────────────────────────

    function playOneShot(src: string, onEnded?: () => void): void {
      stop(track.current);
      stopLoop();
      const a = make(src, false);
      a.onended = onEnded ?? null;
      track.current = a;
      safePlay(a);
    }

    function playLoop(src: string): void {
      if (loopSrc.current === src) return;
      stop(loopTrack.current);
      stop(track.current);
      track.current = null;
      const a = make(src, true);
      loopTrack.current = a;
      loopSrc.current = src;
      safePlay(a);
    }

    function stopLoop(): void {
      stop(loopTrack.current);
      loopTrack.current = null;
      loopSrc.current = "";
    }

    function silence(): void {
      stop(track.current);
      stopLoop();
      track.current = null;
    }

    // Clear any pending category reveal timers when phase changes away from starting
    function clearCategoryTimers(): void {
      categoryTimers.current.forEach(clearTimeout);
      categoryTimers.current = [];
    }

    // ── Phase audio ──────────────────────────────────────────────────────────

    if (phase === "idle") {
      playLoop(F.theme);
      return;
    }

    if (phase === "starting") {
      // Keep the theme loop playing during board reveal.
      // Fire category-reveal sound 4 times in sequence, one per category title.
      // After all 4, call onStartingComplete.
      clearCategoryTimers();
      // Stagger each reveal ~600 ms apart — gives the animation time to breathe
      const STAGGER_MS = 600;
      for (let i = 0; i < 4; i++) {
        const t = setTimeout(() => {
          // Play one-shot (sfx on top of theme loop)
          const sfx = make(F.categoryReveal, false);
          safePlay(sfx);
          track.current = sfx; // track last sfx for cleanup
        }, (i + 1) * STAGGER_MS);
        categoryTimers.current.push(t);
      }
      const finalT = setTimeout(() => {
        onStartingCompleteRef.current?.();
      }, 5 * STAGGER_MS); // fire after all 4 have played
      categoryTimers.current.push(finalT);
      return;
    }

    if (phase === "board") {
      clearCategoryTimers();
      silence();
      return;
    }

    if (phase === "clue") {
      playOneShot(F.clueSelect);
      return;
    }

    if (phase === "correct") {
      playOneShot(F.correct);
      return;
    }

    if (phase === "wrong") {
      playOneShot(F.wrong);
      return;
    }

    if (phase === "time-expired") {
      playOneShot(F.timeExpired);
      return;
    }

    if (phase === "daily-double-reveal") {
      playOneShot(F.dailyDouble);
      return;
    }

    if (phase === "daily-double-wager") {
      playLoop(F.dailyDoubleWager);
      return;
    }

    if (phase === "daily-double-clue") {
      stopLoop(); // stop wager music
      playOneShot(F.clueSelect);
      return;
    }

    if (phase === "daily-double-correct") {
      playOneShot(F.correct);
      return;
    }

    if (phase === "daily-double-wrong") {
      playOneShot(F.wrong);
      return;
    }

    if (phase === "daily-double-time-expired") {
      playOneShot(F.timeExpired);
      return;
    }

    if (phase === "board-complete") {
      playOneShot(F.boardComplete);
      return;
    }

    if (phase === "final-jeopardy-intro") {
      playOneShot(F.finalJeopardyIntro);
      return;
    }

    if (phase === "final-jeopardy-category") {
      playOneShot(F.finalJeopardyCategory);
      return;
    }

    if (phase === "final-jeopardy-wager") {
      playLoop(F.dailyDoubleWager); // same wager loop as Daily Double
      return;
    }

    if (phase === "final-jeopardy-clue") {
      // Think! music: plays once, exactly 30 seconds, not looped.
      // When it ends naturally, fire onFinalJeopardyThinkComplete.
      stopLoop();
      stop(track.current);
      const a = make(F.thinkMusic, false);
      a.onended = () => {
        onThinkCompleteRef.current?.();
      };
      track.current = a;
      safePlay(a);
      return;
    }

    if (phase === "final-jeopardy-judging") {
      silence();
      return;
    }

    if (phase === "final-jeopardy-correct") {
      playOneShot(F.finalJeopardyCorrect);
      return;
    }

    if (phase === "final-jeopardy-wrong") {
      playOneShot(F.finalJeopardyWrong);
      return;
    }

    if (phase === "game-over") {
      playOneShot(F.gameOver);
      return;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, state?.phase]);
}
