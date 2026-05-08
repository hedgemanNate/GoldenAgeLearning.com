"use client";

import { usePathname } from "next/navigation";
import { SessionControllerOverlay } from "../../../../../components/teaching/SessionControllerOverlay";

const CLASS_SLUG = "the-world-of-apps";
const OVERLAY_ROUTES = ["/script", "/answers", "/game"];

export default function TheWorldOfAppsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const showOverlay = OVERLAY_ROUTES.some((suffix) =>
    pathname.endsWith(suffix)
  );

  return (
    <>
      {children}
      {showOverlay && <SessionControllerOverlay classSlug={CLASS_SLUG} />}
    </>
  );
}
