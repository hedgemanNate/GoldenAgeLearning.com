"use client";

// Dispatches to the correct game display component based on the gameType
// discriminator in the session's gameState. This eliminates the need to
// modify all 16 display pages to add Family Feud awareness — they each
// import this one component instead.

import type { TeachingSession } from "../../types/teachingSession";
import type { MillionaireGameState, FamilyFeudGameState } from "../../types/game";
import { beginFirstQuestion } from "../../lib/games/millionaire";
import { updateTeachingSession } from "../../lib/firebase/db";
import MillionaireDisplay from "./millionaire/MillionaireDisplay";
import FamilyFeudDisplay from "./familyFeud/FamilyFeudDisplay";

interface Props {
  session: TeachingSession;
  ownerId: string | null;
  gameName: string;
}

export default function GameDisplayDispatcher({ session, ownerId, gameName }: Props) {
  const gs = session.gameState;
  if (!gs) return null;

  // Discriminate on gameType. Family Feud states embed gameType: "familyFeud".
  // Legacy Millionaire states do not have a gameType field (backward-compatible).
  if (gs.gameType === "familyFeud") {
    const state = gs as unknown as FamilyFeudGameState;
    return (
      <FamilyFeudDisplay
        state={state}
        gameName={gameName}
        audioEnabled={true}
      />
    );
  }

  // Default: Millionaire. Works for all existing sessions stored before the
  // familyFeud discriminator was added (gameType absent = millionaire).
  const state = gs as unknown as MillionaireGameState;
  return (
    <MillionaireDisplay
      state={state}
      gameName={gameName}
      audioEnabled={true}
      onStartingComplete={ownerId ? async () => {
        const latest = session.gameState as unknown as MillionaireGameState;
        await updateTeachingSession(ownerId, {
          gameState: beginFirstQuestion(latest, latest.timerSeconds) as unknown as Record<string, unknown>,
        });
      } : undefined}
    />
  );
}
