"use client";

import { usePathname } from "next/navigation";
import { SessionControllerOverlay } from "../../../../../components/teaching/SessionControllerOverlay";

const CLASS_SLUG = "on-the-go-with-maps";

// Routes where the live session controller overlay is shown
const OVERLAY_ROUTES = ["/script", "/answers", "/game"];

export default function OnTheGoWithMapsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showOverlay = OVERLAY_ROUTES.some((r) => pathname.endsWith(r));

  return (
    <>
      {children}
      {showOverlay && <SessionControllerOverlay classSlug={CLASS_SLUG} />}
    </>
  );
}
