"use client";

import React from "react";

export default function TeachingGame({ params }: { params: Promise<{ templateId: string }> }) {
  const { templateId } = React.use(params);
  return (
    <div className="p-[32px] font-sans">
      <h1 className="font-display text-[28px] font-bold text-[var(--color-cream)]">Game</h1>
      <p className="text-[13px] text-[rgba(245,237,214,0.45)] mt-[4px]">
        Template: {templateId}
      </p>
      <p className="text-[13px] text-[rgba(245,237,214,0.3)] mt-[24px]">
        Game not yet built for this class.
      </p>
    </div>
  );
}
