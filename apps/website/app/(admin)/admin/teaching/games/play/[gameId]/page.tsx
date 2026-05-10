"use client";

import { use } from "react";
import { GameRemoteInner } from "../../../../../../../components/teaching/GameRemoteInner";

interface PageProps {
  params: Promise<{ gameId: string }>;
}

export default function GamePlayPage({ params }: PageProps) {
  const { gameId } = use(params);
  return <GameRemoteInner gameId={gameId} />;
}
