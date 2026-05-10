"use client";

import { GameRemoteForClass } from "../../../../../../components/teaching/GameRemoteInner";

const CLASS_SLUG = "master-the-keyboard";

export default function GamePage() {
  return <GameRemoteForClass classSlug={CLASS_SLUG} />;
}
