"use client";

import { useEffect, useState } from "react";
import { subscribeMaintenanceMode, setMaintenanceMode } from "../../../../lib/firebase/db";

export default function AdminSettings() {
  const [maintenanceMode, setMaintenanceModeState] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsub = subscribeMaintenanceMode((enabled) => setMaintenanceModeState(enabled));
    return () => unsub();
  }, []);

  async function handleToggle() {
    setSaving(true);
    try {
      await setMaintenanceMode(!maintenanceMode);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-[32px] font-sans">
      <div className="mb-[32px]">
        <h1 className="font-display text-[28px] font-bold text-[var(--color-cream)]">Settings</h1>
        <p className="text-[13px] text-[rgba(245,237,214,0.45)] mt-[4px]">Application settings and configuration.</p>
      </div>

      <div className="bg-[var(--color-dark-surface)] rounded-[8px] overflow-hidden">
        <div className="px-[20px] py-[18px] flex items-center justify-between gap-[16px]">
          <div>
            <p className="text-[14px] font-semibold text-[var(--color-cream)]">Maintenance Mode</p>
            <p className="text-[12px] text-[rgba(245,237,214,0.4)] mt-[2px]">
              When enabled, all public pages will display the maintenance page.
            </p>
          </div>
          <button
            role="switch"
            aria-checked={maintenanceMode ?? false}
            onClick={handleToggle}
            disabled={saving}
            className={`relative inline-flex h-[24px] w-[44px] flex-shrink-0 items-center rounded-full transition-colors disabled:opacity-50 ${
              maintenanceMode ? "bg-[var(--color-gold)]" : "bg-[rgba(245,237,214,0.12)]"
            }`}
          >
            <span
              className={`inline-block h-[18px] w-[18px] rounded-full bg-white transition-transform ${
                maintenanceMode ? "translate-x-[23px]" : "translate-x-[3px]"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
