"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { useTeachingSession } from "../../hooks/useTeachingSession";

const headingStyle: CSSProperties = {
  fontSize: "19px",
  fontWeight: "bold",
  color: "#000000",
  margin: "0 0 6px 0",
};

const buttonStyle = (interactive: boolean): CSSProperties => ({
  display: "block",
  width: "100%",
  padding: 0,
  border: "none",
  background: "transparent",
  font: "inherit",
  color: "inherit",
  textAlign: "left",
  cursor: interactive ? "pointer" : "default",
});

interface ScriptSlideTitleProps {
  classSlug: string;
  slideNumber: number;
  children: ReactNode;
}

export function ScriptSlideTitle({
  classSlug,
  slideNumber,
  children,
}: ScriptSlideTitleProps) {
  const { session, isActive, goToSlide, setMode } = useTeachingSession();
  const [pending, setPending] = useState(false);

  const interactive =
    !pending && !!session && isActive && session.classSlug === classSlug;

  const handleClick = async () => {
    if (!interactive) return;

    setPending(true);

    try {
      if (session.mode !== "slides") {
        await setMode("slides");
      }

      await goToSlide(slideNumber - 1);
    } finally {
      setPending(false);
    }
  };

  return (
    <h2 style={headingStyle}>
      <button
        type="button"
        onClick={handleClick}
        disabled={!interactive}
        style={buttonStyle(interactive)}
        title={interactive ? `Go to slide ${slideNumber}` : undefined}
      >
        {children}
      </button>
    </h2>
  );
}