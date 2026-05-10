"use client";

// Manages all Family Feud game audio. Audio is owned by the DISPLAY page only —
// the instructor remote does not produce sound. Files are served from
// `/audio/Family Feud/*.mp3`.
//
// GUARANTEE: No two audio tracks ever play simultaneously.
// A single `track` ref holds the active Audio element. Every new sound stops
// the previous one before starting. onended callbacks are nulled on stop so
// they never fire after being superseded.
//
// Audio file map (9 files → 16 spec triggers):
//   ff-main-theme         → family-feud-theme.mp3         (loop, idle)
//   ff-intro-fanfare      → drumroll.mp3                  (once, starting)
//   ff-face-off-music     → family-feud-theme.mp3         (loop, face-off)
//   ff-buzz-in            → family-feud-sound-fx.mp3      (once, face-off-buzz)
//   ff-correct-ding       → family-feud-good-answer.mp3   (once, face-off-correct / answer-revealed)
//   ff-wrong-buzz         → family-feud-strike-sfx.mp3    (once, face-off-wrong / strike)
//   ff-three-strikes      → family-feud-strike-sfx.mp3    (once, three-strikes — same file, distinct moment)
//   ff-main-game-music    → family-feud-theme.mp3         (loop, playing — pauses on strike/revealed, resumes)
//   ff-round-over         → family-feud-win-sound-effect.mp3 (once, round-over)
//   ff-round-transition   → drumroll.mp3                  (once, round-transition)
//   ff-fast-money-intro   → family-feud-theme-after-1st-fast-money.mp3 (once, fast-money-intro)
//   ff-fast-money-countdown → family-feud-theme-after-1st-fast-money.mp3 (loop, fast-money-player1/player2)
//   ff-timer-expired      → family-feud-sound-fx.mp3      (once, player1-done / player2-done)
//   ff-fast-money-reveal  → fast-money-answer-reveal.mp3  (once per flip, fast-money-reveal)
//   ff-score-reveal       → family-feud-fast-money-ding.mp3 (once, fast-money-score)
//   ff-game-over          → family-feud-win-sound-effect.mp3 (once, game-over)

import { useEffect, useRef } from "react";
import type { FamilyFeudGameState } from "../../types/game";

// ─── File paths ──────────────────────────────────────────────────────────────

const AUDIO_DIR = "/audio/Family Feud";

const SFX = {
  theme:          `${AUDIO_DIR}/family-feud-theme.mp3`,
  drumroll:       `${AUDIO_DIR}/drumroll.mp3`,
  soundFx:        `${AUDIO_DIR}/family-feud-sound-fx.mp3`,
  goodAnswer:     `${AUDIO_DIR}/family-feud-good-answer.mp3`,
  strike:         `${AUDIO_DIR}/family-feud-strike-sfx_kN6Z99k.mp3`,
  winSound:       `${AUDIO_DIR}/family-feud-win-sound-effect.mp3`,
  fastMoneyTheme: `${AUDIO_DIR}/family-feud-theme-after-1st-fast-money.mp3`,
  answerReveal:   `${AUDIO_DIR}/fast-money-answer-reveal.mp3`,
  fastMoneyDing:  `${AUDIO_DIR}/family-feud-fast-money-ding.mp3`,
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

function stopAudio(a: HTMLAudioElement | null): void {
  if (!a) return;
  a.onended = null;
  a.pause();
  a.currentTime = 0;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useFamilyFeudAudio(
  state: FamilyFeudGameState | null,
  enabled: boolean,
  onIntroComplete?: () => void,       // called when ff-intro-fanfare ends (starting → face-off)
  onFastMoneyIntroComplete?: () => void, // called when ff-fast-money-intro ends
  onAnswerRevealSound?: () => void,    // called to play a one-shot reveal during fast-money-reveal
) {
  const track = useRef<HTMLAudioElement | null>(null);
  const lastPhase = useRef<string>("");
  const lastLoopSrc = useRef<string>("");

  // Keep latest callbacks in refs so closures don't go stale
  const onIntroCompleteRef = useRef(onIntroComplete);
  const onFastMoneyIntroCompleteRef = useRef(onFastMoneyIntroComplete);
  useEffect(() => { onIntroCompleteRef.current = onIntroComplete; }, [onIntroComplete]);
  useEffect(() => { onFastMoneyIntroCompleteRef.current = onFastMoneyIntroComplete; }, [onFastMoneyIntroComplete]);

  // Track the last reveal question index so we can detect new flips
  const lastRevealedCount = useRef<number>(0);

  // Stop everything on unmount
  useEffect(() => {
    return () => {
      stopAudio(track.current);
      track.current = null;
    };
  }, []);

  useEffect(() => {
    if (!enabled || !state) {
      stopAudio(track.current);
      track.current = null;
      lastPhase.current = "";
      lastLoopSrc.current = "";
      return;
    }

    const phase = state.phase;
    const phaseChanged = phase !== lastPhase.current;

    function playOneShot(src: string, onEnded?: () => void): void {
      stopAudio(track.current);
      lastLoopSrc.current = "";
      const a = makeAudio(src, false);
      a.onended = onEnded ?? null;
      track.current = a;
      safePlay(a);
    }

    function playLoop(src: string): void {
      if (lastLoopSrc.current === src) return; // already playing this loop
      stopAudio(track.current);
      const a = makeAudio(src, true);
      track.current = a;
      lastLoopSrc.current = src;
      safePlay(a);
    }

    function silence(): void {
      stopAudio(track.current);
      track.current = null;
      lastLoopSrc.current = "";
    }

    // ── idle ─────────────────────────────────────────────────────────────────
    // ff-main-theme loops
    if (phase === "idle") {
      if (phaseChanged) playLoop(SFX.theme);
      lastPhase.current = phase;
      return;
    }

    // ── starting ─────────────────────────────────────────────────────────────
    // ff-intro-fanfare plays once; when it ends, callback advances to face-off
    if (phase === "starting") {
      if (phaseChanged) {
        playOneShot(SFX.drumroll, () => {
          onIntroCompleteRef.current?.();
        });
      }
      lastPhase.current = phase;
      return;
    }

    // ── face-off ─────────────────────────────────────────────────────────────
    // ff-face-off-music loops
    if (phase === "face-off") {
      if (phaseChanged) playLoop(SFX.theme);
      lastPhase.current = phase;
      return;
    }

    // ── face-off-buzz ────────────────────────────────────────────────────────
    // ff-buzz-in plays once
    if (phase === "face-off-buzz") {
      if (phaseChanged) playOneShot(SFX.soundFx);
      lastPhase.current = phase;
      return;
    }

    // ── face-off-correct ─────────────────────────────────────────────────────
    // ff-correct-ding plays once
    if (phase === "face-off-correct") {
      if (phaseChanged) playOneShot(SFX.goodAnswer);
      lastPhase.current = phase;
      return;
    }

    // ── face-off-wrong ───────────────────────────────────────────────────────
    // ff-wrong-buzz plays once
    if (phase === "face-off-wrong") {
      if (phaseChanged) playOneShot(SFX.strike);
      lastPhase.current = phase;
      return;
    }

    // ── playing ──────────────────────────────────────────────────────────────
    // ff-main-game-music loops. Resumes (same loop, no restart) when returning
    // from strike or answer-revealed — handled by the same "already playing" check.
    if (phase === "playing") {
      playLoop(SFX.theme);
      lastPhase.current = phase;
      return;
    }

    // ── answer-revealed ──────────────────────────────────────────────────────
    // ff-correct-ding plays once; main-game-music pauses
    if (phase === "answer-revealed") {
      if (phaseChanged) {
        // Pause the loop during the brief reveal moment
        if (track.current && !track.current.paused) {
          track.current.pause();
          lastLoopSrc.current = ""; // allow resume on next playing entry
        }
        playOneShot(SFX.goodAnswer);
      }
      lastPhase.current = phase;
      return;
    }

    // ── strike ───────────────────────────────────────────────────────────────
    // ff-wrong-buzz plays once; main-game-music pauses
    if (phase === "strike") {
      if (phaseChanged) {
        stopAudio(track.current);
        lastLoopSrc.current = "";
        playOneShot(SFX.strike);
      }
      lastPhase.current = phase;
      return;
    }

    // ── three-strikes ────────────────────────────────────────────────────────
    // ff-three-strikes plays once (same strike SFX, distinct trigger)
    if (phase === "three-strikes") {
      if (phaseChanged) playOneShot(SFX.strike);
      lastPhase.current = phase;
      return;
    }

    // ── round-over ───────────────────────────────────────────────────────────
    if (phase === "round-over") {
      if (phaseChanged) playOneShot(SFX.winSound);
      lastPhase.current = phase;
      return;
    }

    // ── round-transition ─────────────────────────────────────────────────────
    if (phase === "round-transition") {
      if (phaseChanged) playOneShot(SFX.drumroll);
      lastPhase.current = phase;
      return;
    }

    // ── fast-money-intro ─────────────────────────────────────────────────────
    // ff-fast-money-intro plays once; callback advances to fast-money-player1
    if (phase === "fast-money-intro") {
      if (phaseChanged) {
        playOneShot(SFX.fastMoneyTheme, () => {
          onFastMoneyIntroCompleteRef.current?.();
        });
      }
      lastPhase.current = phase;
      return;
    }

    // ── fast-money-player1 / fast-money-player2 ───────────────────────────────
    // ff-fast-money-countdown loops; stops immediately when timer expires
    if (phase === "fast-money-player1" || phase === "fast-money-player2") {
      if (phaseChanged) playLoop(SFX.fastMoneyTheme);
      lastPhase.current = phase;
      return;
    }

    // ── fast-money-player1-done / fast-money-player2-done ────────────────────
    // ff-timer-expired plays once; countdown loop stops
    if (phase === "fast-money-player1-done" || phase === "fast-money-player2-done") {
      if (phaseChanged) playOneShot(SFX.soundFx);
      lastPhase.current = phase;
      return;
    }

    // ── fast-money-reveal ────────────────────────────────────────────────────
    // ff-fast-money-reveal plays once PER ANSWER FLIP — triggered by revealedQuestions changes
    if (phase === "fast-money-reveal") {
      if (phaseChanged) {
        silence();
        lastRevealedCount.current = 0;
      }
      const revealedCount = state.fastMoneyState?.revealedQuestions.filter(Boolean).length ?? 0;
      if (revealedCount > lastRevealedCount.current) {
        lastRevealedCount.current = revealedCount;
        playOneShot(SFX.answerReveal);
      }
      lastPhase.current = phase;
      return;
    }

    // ── fast-money-score ─────────────────────────────────────────────────────
    if (phase === "fast-money-score") {
      if (phaseChanged) playOneShot(SFX.fastMoneyDing);
      lastPhase.current = phase;
      return;
    }

    // ── game-over ────────────────────────────────────────────────────────────
    if (phase === "game-over") {
      if (phaseChanged) playOneShot(SFX.winSound);
      lastPhase.current = phase;
      return;
    }

    // Fallback: silence any leftover audio
    silence();
    lastPhase.current = phase;
  });
}
