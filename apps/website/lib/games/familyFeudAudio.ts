"use client";

// Manages all Family Feud game audio.
// Audio is owned by the DISPLAY page only — the instructor remote produces no sound.
// Files are served from `/audio/Family Feud/*.mp3`.
//
// Architecture:
//   loopRef  — the active looping background track.
//   sfxRef   — the active one-shot sound effect.
//
//   In every phase, at most ONE of {loopRef, sfxRef} is playing.
//   The ONLY exception is fast-money-reveal, where loopRef holds
//   fast_money_reveal.mp3 and sfxRef plays per-answer sounds on top.
//
// Loop files: music.mp3, thinking.mp3, fast_money_round_music.mp3, fast_money_reveal.mp3
// All other files play once.

import { useEffect, useRef } from "react";
import type { FamilyFeudGameState } from "../../types/game";
import { getPoints } from "./familyFeud";

// ─── File paths ───────────────────────────────────────────────────────────────

const DIR = "/audio/Family Feud";

const F = {
  theme:               `${DIR}/family-feud-theme.mp3`,
  music:               `${DIR}/music.mp3`,
  introduce:           `${DIR}/introduce.mp3`,
  thinking:            `${DIR}/thinking.mp3`,
  correctAnswer:       `${DIR}/correct_answer.mp3`,
  reveal1stCheering:   `${DIR}/reveal_1st_answer_cheering.mp3`,
  wrongAnswer:         `${DIR}/wrong_answer.mp3`,
  revealUsual1:        `${DIR}/reveal_usual_1.mp3`,
  revealUsual2:        `${DIR}/reveal_usual_2.mp3`,
  revealUsual3:        `${DIR}/reveal_usual_3_applause.mp3`,
  lastWrongOoh:        `${DIR}/last_wrong_answer_ooh.mp3`,
  revealAllRemaining:  `${DIR}/reveal_all_remaining_answers_applause.mp3`,
  roundEndWin:         `${DIR}/round_end_win.mp3`,
  roundEndLose:        `${DIR}/round_end_lose.mp3`,
  roundEndResult:      `${DIR}/round_end_result.mp3`,
  round23Flyout:       `${DIR}/round_2_3_flyout.mp3`,
  fastMoneyRoundMusic: `${DIR}/fast_money_round_music.mp3`,
  fastMoneyNoPoints:   `${DIR}/fast_money_no_points.mp3`,
  fastMoneyRevealBg:   `${DIR}/fast_money_reveal.mp3`,
  ohh1:                `${DIR}/reveal_1st_answer_fast_money_ohhing.mp3`,
  ohh2:                `${DIR}/reveal_1st_answer_fast_money_ohhing_2.mp3`,
  fastMoneyPoints:     `${DIR}/fast_money_points.mp3`,
  repeatedAnswer:      `${DIR}/repeated_answer.mp3`,
  fastMoneyApplause:   `${DIR}/fast_money_end_applause.mp3`,
  gameEnd:             `${DIR}/game_end.mp3`,
} as const;

// ─── Audio helpers ────────────────────────────────────────────────────────────

function make(src: string, loop = false): HTMLAudioElement {
  const a = new Audio(src);
  a.loop = loop;
  return a;
}

function safePlay(a: HTMLAudioElement): void {
  a.play().catch(() => { /* autoplay policy / missing file — fail silently */ });
}

function stop(a: HTMLAudioElement | null): void {
  if (!a) return;
  a.onended = null;
  a.pause();
  a.currentTime = 0;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useFamilyFeudAudio(
  state: FamilyFeudGameState | null,
  enabled: boolean,
  onStartingComplete?: () => void,
  onFastMoneyIntroComplete?: () => void,
) {
  const loopRef = useRef<HTMLAudioElement | null>(null);
  const loopSrc = useRef<string>("");
  const sfxRef  = useRef<HTMLAudioElement | null>(null);

  const lastPhase = useRef<string>("");
  const prevPhase = useRef<string>(""); // set on phase change; used by round-over

  // answer-revealed: rotate between reveal_usual_1 and reveal_usual_2
  const revealRot = useRef<0 | 1>(0);

  // fast-money-reveal per-answer tracking
  const fmLastRevealed = useRef<boolean[]>([false, false, false, false, false]);
  const fmIsFirst      = useRef<boolean>(true);  // true until first question revealed
  const fmUseOhh2      = useRef<boolean>(false); // alternates the two first-answer variants

  // Keep callbacks fresh in refs so onended closures don't go stale
  const onStartingCompleteRef = useRef(onStartingComplete);
  const onFastMoneyIntroRef   = useRef(onFastMoneyIntroComplete);
  useEffect(() => { onStartingCompleteRef.current = onStartingComplete; }, [onStartingComplete]);
  useEffect(() => { onFastMoneyIntroRef.current = onFastMoneyIntroComplete; }, [onFastMoneyIntroComplete]);

  // Cleanup on unmount — no orphaned audio after navigation
  useEffect(() => {
    return () => {
      stop(loopRef.current);
      stop(sfxRef.current);
      loopRef.current = null;
      sfxRef.current  = null;
    };
  }, []);

  // ─── Main effect (runs after every render) ─────────────────────────────────
  useEffect(() => {
    if (!enabled || !state) {
      stop(loopRef.current); loopRef.current = null; loopSrc.current = "";
      stop(sfxRef.current);  sfxRef.current  = null;
      lastPhase.current = "";
      return;
    }

    const phase   = state.phase;
    const changed = phase !== lastPhase.current;

    if (changed) prevPhase.current = lastPhase.current;

    // ── Scoped helpers ──────────────────────────────────────────────────────

    /** Start a looping track. No-op if already playing this src. Stops sfxRef. */
    function startLoop(src: string): void {
      if (loopSrc.current === src) return;
      stop(loopRef.current);
      stop(sfxRef.current); sfxRef.current = null;
      const a = make(src, true);
      loopRef.current = a;
      loopSrc.current = src;
      safePlay(a);
    }

    /**
     * Start the fast-money-reveal background loop.
     * Does NOT stop sfxRef — allows simultaneous per-answer sounds.
     */
    function startBgLoop(src: string): void {
      if (loopSrc.current === src) return;
      stop(loopRef.current);
      const a = make(src, true);
      loopRef.current = a;
      loopSrc.current = src;
      safePlay(a);
    }

    /** Pause the loop without resetting currentTime (for answer-revealed / strike). */
    function pauseLoop(): void {
      loopRef.current?.pause();
    }

    /** Resume a paused loop. */
    function resumeLoop(): void {
      if (loopRef.current && loopRef.current.paused) {
        safePlay(loopRef.current);
      }
    }

    /** Stop and dispose the loop. */
    function stopLoop(): void {
      stop(loopRef.current);
      loopRef.current = null;
      loopSrc.current = "";
    }

    /** Play a one-shot SFX, replacing any previous SFX. Does not affect the loop. */
    function playSfx(src: string, onEnded?: () => void): void {
      stop(sfxRef.current);
      const a = make(src, false);
      a.onended = onEnded ?? null;
      sfxRef.current = a;
      safePlay(a);
    }

    /** Stop and dispose the current SFX. */
    function stopSfx(): void {
      stop(sfxRef.current);
      sfxRef.current = null;
    }

    /** Stop all audio. */
    function silence(): void {
      stopLoop();
      stopSfx();
    }

    // ── Phase handlers ──────────────────────────────────────────────────────

    // idle — family-feud-theme.mp3 loops
    if (phase === "idle") {
      if (changed) startLoop(F.theme);
      lastPhase.current = phase;
      return;
    }

    // starting — introduce.mp3 once; callback fires to auto-advance to face-off
    if (phase === "starting") {
      if (changed) {
        stopLoop();
        playSfx(F.introduce, () => onStartingCompleteRef.current?.());
      }
      lastPhase.current = phase;
      return;
    }

    // face-off — thinking.mp3 loops while host reads the question
    if (phase === "face-off") {
      if (changed) {
        stopSfx();
        startLoop(F.thinking);
      }
      lastPhase.current = phase;
      return;
    }

    // face-off-buzz — physical podium buttons handle sound; game system is silent
    if (phase === "face-off-buzz") {
      if (changed) stopLoop(); // stop thinking.mp3
      lastPhase.current = phase;
      return;
    }

    // face-off-correct — correct_answer.mp3 → reveal_1st_answer_cheering.mp3
    if (phase === "face-off-correct") {
      if (changed) {
        stopLoop(); // stop thinking.mp3
        playSfx(F.correctAnswer, () => {
          playSfx(F.reveal1stCheering);
        });
      }
      lastPhase.current = phase;
      return;
    }

    // face-off-wrong — wrong_answer.mp3 once
    if (phase === "face-off-wrong") {
      if (changed) {
        stopLoop(); // stop thinking.mp3
        playSfx(F.wrongAnswer);
      }
      lastPhase.current = phase;
      return;
    }

    // playing — no background music during the board; dry between SFX
    if (phase === "playing") {
      if (changed) {
        stopLoop();
        stopSfx();
      }
      lastPhase.current = phase;
      return;
    }

    // answer-revealed — play reveal sound; board is dry so no loop to pause/resume
    if (phase === "answer-revealed") {
      if (changed) {
        const q = state.mainQuestions[state.currentRound - 1];
        const isBoardCleared = q
          ? (state.revealedAnswerIndices?.length ?? 0) >= q.answer_count
          : false;
        let src: string;
        if (isBoardCleared) {
          src = F.revealUsual3;
        } else {
          src = revealRot.current === 0 ? F.revealUsual1 : F.revealUsual2;
          revealRot.current = revealRot.current === 0 ? 1 : 0;
        }
        playSfx(src);
      }
      lastPhase.current = phase;
      return;
    }

    // strike — wrong_answer.mp3 once; no loop to pause/resume
    if (phase === "strike") {
      if (changed) {
        playSfx(F.wrongAnswer);
      }
      lastPhase.current = phase;
      return;
    }

    // three-strikes — last_wrong_answer_ooh.mp3 → reveal_all_remaining_answers_applause.mp3
    if (phase === "three-strikes") {
      if (changed) {
        stopLoop();
        playSfx(F.lastWrongOoh, () => {
          playSfx(F.revealAllRemaining);
        });
      }
      lastPhase.current = phase;
      return;
    }

    // round-over — win/lose/result based on how the round ended
    if (phase === "round-over") {
      if (changed) {
        silence();
        const src =
          prevPhase.current === "three-strikes"   ? F.roundEndLose  :
          prevPhase.current === "answer-revealed" ? F.roundEndWin   :
          F.roundEndResult;
        playSfx(src);
      }
      lastPhase.current = phase;
      return;
    }

    // round-transition — round_2_3_flyout.mp3 once
    if (phase === "round-transition") {
      if (changed) {
        silence();
        playSfx(F.round23Flyout);
      }
      lastPhase.current = phase;
      return;
    }

    // fast-money-intro — introduce.mp3 once; callback fires to auto-advance to player1
    if (phase === "fast-money-intro") {
      if (changed) {
        silence();
        playSfx(F.introduce, () => onFastMoneyIntroRef.current?.());
      }
      lastPhase.current = phase;
      return;
    }

    // fast-money-player1 / fast-money-player2 — fast_money_round_music.mp3 plays ONCE (no loop)
    // On the real show the music plays for the answering window then stops; it does not repeat.
    if (phase === "fast-money-player1" || phase === "fast-money-player2") {
      if (changed) {
        stopLoop();
        playSfx(F.fastMoneyRoundMusic); // one-shot; playSfx stops any previous SFX
      }
      lastPhase.current = phase;
      return;
    }

    // fast-money-player1-done / fast-money-player2-done — cut music, play done sound
    if (phase === "fast-money-player1-done" || phase === "fast-money-player2-done") {
      if (changed) {
        stopLoop();
        playSfx(F.fastMoneyNoPoints); // playSfx stops round music if still playing
      }
      lastPhase.current = phase;
      return;
    }

    // fast-money-reveal — per-answer: reveal sting → reaction sound
    // fast_money_reveal.mp3 plays once each time an answer is flipped,
    // then chains into the audience reaction (ohh / points / no-points).
    if (phase === "fast-money-reveal") {
      if (changed) {
        stopLoop();
        stopSfx();
        fmLastRevealed.current = [false, false, false, false, false];
        fmIsFirst.current = true;
        fmUseOhh2.current = false;
      }

      const fm = state.fastMoneyState;
      const revealedNow = fm?.revealedQuestions ?? [false, false, false, false, false];

      for (let i = 0; i < 5; i++) {
        if (revealedNow[i] && !fmLastRevealed.current[i]) {
          let reactionSrc: string;

          if (fmIsFirst.current) {
            // Very first answer flip — one of the two ohhing variants
            reactionSrc = fmUseOhh2.current ? F.ohh2 : F.ohh1;
            fmUseOhh2.current = !fmUseOhh2.current;
            fmIsFirst.current = false;
          } else if (fm) {
            const p2sel = (fm.player2Selections ?? [])[i];
            if (p2sel === "duplicate") {
              reactionSrc = F.repeatedAnswer;
            } else {
              const fmq = state.fastMoneyQuestions[i];
              const ptsArr = fmq ? getPoints(fmq) : [];
              const p1sel = (fm.player1Selections ?? [])[i];
              const p1pts = typeof p1sel === "number" ? (ptsArr[p1sel] ?? 0) : 0;
              const p2pts = typeof p2sel === "number" ? (ptsArr[p2sel] ?? 0) : 0;
              reactionSrc = (p1pts > 0 || p2pts > 0) ? F.fastMoneyPoints : F.fastMoneyNoPoints;
            }
          } else {
            reactionSrc = F.fastMoneyNoPoints;
          }

          fmLastRevealed.current = [...revealedNow];
          // Play reveal sting, then chain into audience reaction
          playSfx(F.fastMoneyRevealBg, () => playSfx(reactionSrc));
          break; // one sound per render cycle
        }
      }

      lastPhase.current = phase;
      return;
    }

    // fast-money-score — fast_money_end_applause.mp3 once
    if (phase === "fast-money-score") {
      if (changed) {
        silence();
        playSfx(F.fastMoneyApplause);
      }
      lastPhase.current = phase;
      return;
    }

    // game-over — game_end.mp3 once
    if (phase === "game-over") {
      if (changed) {
        silence();
        playSfx(F.gameEnd);
      }
      lastPhase.current = phase;
      return;
    }

    // Unknown phase — silence everything
    silence();
    lastPhase.current = phase;
  });
}
