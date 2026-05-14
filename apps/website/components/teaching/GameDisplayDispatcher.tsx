"use client";

// Dispatches to the correct game display component based on the gameType
// discriminator in the session's gameState. This eliminates the need to
// modify all 16 display pages to add Family Feud awareness — they each
// import this one component instead.

import { useCallback, useState } from "react";
import type { TeachingSession } from "../../types/teachingSession";
import type { MillionaireGameState, FamilyFeudGameState, JeopardyGameState, JeopardyClue } from "../../types/game";
import { beginFirstQuestion } from "../../lib/games/millionaire";
import { beginFaceOff, startFastMoneyPlayer1 } from "../../lib/games/familyFeud";
import { beginBoard, beginFJJudging } from "../../lib/games/jeopardy";
import { updateTeachingSession } from "../../lib/firebase/db";
import MillionaireDisplay from "./millionaire/MillionaireDisplay";
import FamilyFeudDisplay from "./familyFeud/FamilyFeudDisplay";
import JeopardyDisplay from "./jeopardy/JeopardyDisplay";

interface Props {
  session: TeachingSession;
  ownerId: string | null;
  gameName: string;
}

const AUDIO_UNLOCK_PROBE = "/audio/Family Feud/music.mp3";

// Firebase stores JS arrays as objects with integer string keys when they're
// embedded inside a larger document (e.g., gameState.clues, gameState.claimedIndices).
// Normalize all array fields back to real arrays.
function normalizeJeopardyState(raw: JeopardyGameState): JeopardyGameState {
  const clues: JeopardyClue[] = Array.isArray(raw.clues)
    ? raw.clues
    : Object.values(raw.clues as unknown as Record<string, JeopardyClue>);
  const rawClaimed = raw.claimedIndices as unknown;
  const claimedIndices: number[] = Array.isArray(rawClaimed)
    ? (rawClaimed as number[])
    : rawClaimed != null
      ? Object.values(rawClaimed as Record<string, number>)
      : [];
  return { ...raw, clues, claimedIndices };
}

async function unlockDisplayAudio(): Promise<boolean> {
  try {
    const probe = new Audio(AUDIO_UNLOCK_PROBE);
    probe.preload = "auto";
    const playPromise = probe.play();
    if (playPromise !== undefined) {
      await playPromise;
    }
    probe.pause();
    probe.currentTime = 0;
    return true;
  } catch {
    return false;
  }
}

export default function GameDisplayDispatcher({ session, ownerId, gameName }: Props) {
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const gs = session.gameState;
  if (!gs) return null;

  const handleUnlockAudio = useCallback(async () => {
    const unlocked = await unlockDisplayAudio();
    if (unlocked) {
      setAudioUnlocked(true);
      setUnlockError(null);
      return;
    }
    setUnlockError("Browser blocked audio. Allow autoplay for this page and tap again.");
  }, []);

  let content: React.ReactNode;

  // Discriminate on gameType. Family Feud states embed gameType: "familyFeud".
  // Legacy Millionaire states do not have a gameType field (backward-compatible).
  if (gs.gameType === "familyFeud") {
    const state = gs as unknown as FamilyFeudGameState;
    content = (
      <FamilyFeudDisplay
        state={state}
        gameName={gameName}
        audioEnabled={audioUnlocked}
        onStartingComplete={ownerId ? async () => {
          const latest = session.gameState as unknown as FamilyFeudGameState;
          await updateTeachingSession(ownerId, {
            gameState: beginFaceOff(latest) as unknown as Record<string, unknown>,
          });
        } : undefined}
        onFastMoneyIntroComplete={ownerId ? async () => {
          const latest = session.gameState as unknown as FamilyFeudGameState;
          await updateTeachingSession(ownerId, {
            gameState: startFastMoneyPlayer1(latest) as unknown as Record<string, unknown>,
          });
        } : undefined}
      />
    );
  } else if (gs.gameType === "jeopardy") {
    const state = normalizeJeopardyState(gs as unknown as JeopardyGameState);
    content = (
      <JeopardyDisplay
        state={state}
        gameName={gameName}
        audioEnabled={audioUnlocked}
        onStartingComplete={ownerId ? async () => {
          const latest = normalizeJeopardyState(session.gameState as unknown as JeopardyGameState);
          await updateTeachingSession(ownerId, {
            gameState: beginBoard(latest) as unknown as Record<string, unknown>,
          });
        } : undefined}
        onFinalJeopardyThinkComplete={ownerId ? async () => {
          const latest = normalizeJeopardyState(session.gameState as unknown as JeopardyGameState);
          await updateTeachingSession(ownerId, {
            gameState: beginFJJudging(latest) as unknown as Record<string, unknown>,
          });
        } : undefined}
      />
    );
  } else {
    // Default: Millionaire. Works for all existing sessions stored before the
    // familyFeud discriminator was added (gameType absent = millionaire).
    const state = gs as unknown as MillionaireGameState;
    content = (
      <MillionaireDisplay
        state={state}
        gameName={gameName}
        audioEnabled={audioUnlocked}
        onStartingComplete={ownerId ? async () => {
          const latest = session.gameState as unknown as MillionaireGameState;
          await updateTeachingSession(ownerId, {
            gameState: beginFirstQuestion(latest, latest.timerSeconds) as unknown as Record<string, unknown>,
          });
        } : undefined}
      />
    );
  }

  return (
    <>
      {content}
      {!audioUnlocked ? (
        <div style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0, 0, 0, 0.72)",
          padding: "24px",
        }}>
          <div style={{
            width: "min(520px, 100%)",
            borderRadius: "16px",
            border: "1px solid rgba(250,245,201,0.18)",
            backgroundColor: "#1E272C",
            boxShadow: "0 24px 60px rgba(0, 0, 0, 0.35)",
            padding: "28px",
            textAlign: "center",
            color: "#FAF5C9",
            fontFamily: "'Lato', sans-serif",
          }}>
            <h2 style={{
              margin: 0,
              color: "#EC8B24",
              fontSize: "28px",
              fontWeight: 700,
            }}>
              Enable Display Audio
            </h2>
            <p style={{
              margin: "12px 0 0",
              color: "#C8C199",
              fontSize: "16px",
              lineHeight: 1.5,
            }}>
              This screen needs one click before the browser will allow game audio to play.
            </p>
            {unlockError ? (
              <p style={{
                margin: "12px 0 0",
                color: "#FAF5C9",
                fontSize: "14px",
                lineHeight: 1.5,
              }}>
                {unlockError}
              </p>
            ) : null}
            <button
              onClick={handleUnlockAudio}
              style={{
                marginTop: "20px",
                minWidth: "220px",
                borderRadius: "999px",
                border: "none",
                backgroundColor: "#EC8B24",
                color: "#252D32",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: 700,
                padding: "14px 24px",
              }}
            >
              Enable Audio
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
