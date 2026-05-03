"use client";

// Manages all Millionaire game audio. Audio is owned by the DISPLAY page only —
// the instructor remote does not produce sound. Files are served from
// `/audio/*.mp3` (drop them into `apps/website/public/audio/`).
//
// If a file is missing, playback fails silently — the game still works.

import { useEffect, useRef } from "react";
import type {
  MillionaireGameState,
  MillionaireGamePhase,
} from "../../types/game";

// Map ladder index (0..14) → background music tier file.
function tierMusicFor(questionIndex: number): string {
  if (questionIndex <= 4)  return "/audio/100 1000 music.mp3";
  if (questionIndex <= 9)  return "/audio/2000 32000.mp3";
  if (questionIndex === 10) return "/audio/64000 music.mp3";
  if (questionIndex <= 12) return "/audio/125000 250000 music.mp3";
  if (questionIndex === 13) return "/audio/500000 music.mp3";
  return "/audio/1000000 music.mp3";
}

// One-shot SFX paths.
const SFX = {
  mainTheme:    "/audio/main theme.mp3",
  letsPlay:     "/audio/lets play.mp3",
  finalAnswer:  "/audio/final answer.mp3",
  correct:      "/audio/correctanswer.mp3",
  wrong:        "/audio/wrong answer.mp3",
  phoneFriend:  "/audio/phone a friend.mp3",
  walkAway:     "/audio/commerical break.mp3",
} as const;

interface AudioRefs {
  background: HTMLAudioElement | null;
  oneshot: HTMLAudioElement | null;
}

function safePlay(audio: HTMLAudioElement | null) {
  if (!audio) return;
  audio.play().catch(() => {
    // Browser autoplay policy or missing file — fail silently.
  });
}

function stop(audio: HTMLAudioElement | null) {
  if (!audio) return;
  audio.pause();
  audio.currentTime = 0;
}

/**
 * Drives all game audio from the live game state.
 * - Background music loops per tier.
 * - One-shot SFX play on phase transitions.
 * - All audio stops on unmount or when the game ends.
 */
export function useMillionaireAudio(
  state: MillionaireGameState | null,
  enabled: boolean
) {
  const refs = useRef<AudioRefs>({ background: null, oneshot: null });
  const lastPhase = useRef<MillionaireGamePhase | null>(null);
  const lastQuestionIndex = useRef<number>(-1);
  const lastTierUrl = useRef<string>("");

  // Cleanup on unmount.
  useEffect(() => {
    return () => {
      stop(refs.current.background);
      stop(refs.current.oneshot);
      refs.current.background = null;
      refs.current.oneshot = null;
    };
  }, []);

  useEffect(() => {
    if (!enabled || !state) {
      stop(refs.current.background);
      stop(refs.current.oneshot);
      return;
    }

    const phase = state.phase;
    const idx = state.questionIndex;
    const phaseChanged = phase !== lastPhase.current;
    const questionChanged = idx !== lastQuestionIndex.current;

    // ─── Idle: main theme loops ──────────────────────────────────────────────
    if (phase === "idle") {
      if (lastTierUrl.current !== SFX.mainTheme) {
        stop(refs.current.background);
        const a = new Audio(SFX.mainTheme);
        a.loop = true;
        refs.current.background = a;
        safePlay(a);
        lastTierUrl.current = SFX.mainTheme;
      }
      lastPhase.current = phase;
      lastQuestionIndex.current = idx;
      return;
    }

    // ─── Game over: silence everything ───────────────────────────────────────
    if (phase === "game-over") {
      stop(refs.current.background);
      stop(refs.current.oneshot);
      lastTierUrl.current = "";
      lastPhase.current = phase;
      return;
    }

    // ─── Tier music management ───────────────────────────────────────────────
    // Background tier music plays during "question", "selected", and after
    // reveal-correct / safe-haven (so it resumes between questions).
    // It does NOT play during "locked", "phone-a-friend", "walk-away",
    // or after the game has been frozen.
    const wantTierMusic =
      !state.pointsFrozen &&
      (phase === "question" || phase === "selected" || phase === "revealed-correct" || phase === "safe-haven" || phase === "ask-instructor");

    if (wantTierMusic) {
      const url = tierMusicFor(idx);
      if (url !== lastTierUrl.current) {
        stop(refs.current.background);
        const a = new Audio(url);
        a.loop = true;
        refs.current.background = a;
        safePlay(a);
        lastTierUrl.current = url;
      }
    } else {
      // Cut tier music for dramatic phases.
      if (lastTierUrl.current !== "") {
        stop(refs.current.background);
        lastTierUrl.current = "";
      }
    }

    // ─── One-shot SFX on phase transitions ───────────────────────────────────
    if (phaseChanged || questionChanged) {
      let oneShotUrl: string | null = null;

      if (phaseChanged && phase === "question" && lastPhase.current === "idle") {
        oneShotUrl = SFX.letsPlay;
      } else if (phaseChanged && phase === "locked") {
        oneShotUrl = SFX.finalAnswer;
      } else if (phaseChanged && (phase === "revealed-correct" || phase === "safe-haven")) {
        oneShotUrl = SFX.correct;
      } else if (phaseChanged && phase === "revealed-wrong") {
        oneShotUrl = SFX.wrong;
      } else if (phaseChanged && phase === "walk-away") {
        oneShotUrl = SFX.walkAway;
      } else if (phaseChanged && phase === "phone-a-friend") {
        oneShotUrl = SFX.phoneFriend;
      }

      if (oneShotUrl) {
        stop(refs.current.oneshot);
        const a = new Audio(oneShotUrl);
        refs.current.oneshot = a;
        safePlay(a);
      }
    }

    lastPhase.current = phase;
    lastQuestionIndex.current = idx;
  }, [state, enabled]);
}
