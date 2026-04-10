"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { subscribeMaintenanceMode } from "../../lib/firebase/db";

export default function MaintenanceGate({ children }: { children: React.ReactNode }) {
  const [maintenanceMode, setMaintenanceModeState] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsub = subscribeMaintenanceMode((enabled) => {
      setMaintenanceModeState(enabled);
      if (enabled) router.replace("/maintenance");
      else router.replace("/");
    });
    return () => unsub();
  }, [router]);

  if (maintenanceMode === null) return null;
  if (maintenanceMode) return null;
  return <>{children}</>;
}
