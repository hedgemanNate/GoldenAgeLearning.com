"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { subscribeMaintenanceMode } from "../../lib/firebase/db";
import { useAuthContext } from "../../context/AuthContext";

export default function MaintenanceGate({ children }: { children: React.ReactNode }) {
  const [maintenanceMode, setMaintenanceModeState] = useState<boolean | null>(null);
  const router = useRouter();
  const { user, loading: authLoading } = useAuthContext();
  const isStaff = user?.role === "staff" || user?.role === "superAdmin";

  useEffect(() => {
    if (authLoading) return;
    const unsub = subscribeMaintenanceMode((enabled) => {
      setMaintenanceModeState(enabled);
      if (enabled && !isStaff) router.replace("/maintenance");
    });
    return () => unsub();
  }, [authLoading, isStaff, router]);

  // Wait for both auth and maintenance flag to resolve before rendering
  if (authLoading || maintenanceMode === null) return null;
  if (maintenanceMode && !isStaff) return null;
  return <>{children}</>;
}
