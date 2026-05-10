"use client";

import React from "react";
import { GameRemoteForClass } from "../../../../../components/teaching/GameRemoteInner";

interface PageProps {
  params: Promise<{ templateId: string }>;
}

export default function GameLaunchPage({ params }: PageProps) {
  const { templateId } = React.use(params);
  return <GameRemoteForClass classSlug={templateId} />;
}
