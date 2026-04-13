"use client";

import { useEffect, useRef, useState } from "react";
import { ref, get, set } from "firebase/database";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { db, auth } from "../../../../lib/firebase/client";
import { subscribeMaintenanceMode, setMaintenanceMode, deleteAllData } from "../../../../lib/firebase/db";
import { useAuthContext } from "../../../../context/AuthContext";

// Paths where a superAdmin can read the full collection (parent-level .read rule exists)
const EXPORTABLE_PATHS = [
  "users",
  "classes",
  "bookings",
  "discounts",
  "messages",
  "classTemplates",
  "classTaxonomy",
  "settings",
];

// transferLog, activityLog, and payments have no parent-level read rule — cannot be bulk-exported
const WRITABLE_PATHS = [
  "users",
  "classes",
  "bookings",
  "discounts",
  "messages",
  "classTemplates",
  "classTaxonomy",
  "settings",
];

export default function AdminSettings() {
  const { firebaseUser } = useAuthContext();
  const isOwner = firebaseUser?.email === "nathanhedgeman@gmail.com";

  const [maintenanceMode, setMaintenanceModeState] = useState(false);
  const [saving, setSaving] = useState(false);

  const [exporting, setExporting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deletePasswordError, setDeletePasswordError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteResult, setDeleteResult] = useState<{ type: "success" | "error"; message: string } | null>(null);

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

  async function handleExport() {
    setExporting(true);
    try {
      const entries = await Promise.all(
        EXPORTABLE_PATHS.map(async (path) => {
          const snap = await get(ref(db, path));
          return [path, snap.val()] as const;
        })
      );
      const data = Object.fromEntries(entries.filter(([, v]) => v !== null));
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const date = new Date().toISOString().split("T")[0];
      a.download = `gal-database-${date}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setImportFile(file);
    setImportResult(null);
  }

  async function handleImport() {
    if (!importFile) return;
    setImporting(true);
    setImportResult(null);
    try {
      const text = await importFile.text();
      const data = JSON.parse(text);
      await Promise.all(
        WRITABLE_PATHS.map(async (path) => {
          if (data[path] !== undefined) {
            await set(ref(db, path), data[path]);
          }
        })
      );
      setImportResult({
        type: "success",
        message: "Database imported successfully. Read-only paths (activityLog, transferLog, payments) were skipped.",
      });
      setImportFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setImportResult({
        type: "error",
        message: err instanceof Error ? err.message : "Import failed.",
      });
    } finally {
      setImporting(false);
      setShowConfirm(false);
    }
  }

  async function handleDeleteAll() {
    setDeletePasswordError("");
    setDeleting(true);
    try {
      const user = auth.currentUser;
      if (!user || !user.email) throw new Error("No user logged in.");
      const credential = EmailAuthProvider.credential(user.email, deletePassword);
      await reauthenticateWithCredential(user, credential);
    } catch {
      setDeletePasswordError("Incorrect password. Please try again.");
      setDeleting(false);
      return;
    }
    try {
      await deleteAllData();
      setDeleteResult({ type: "success", message: "All data has been deleted." });
      setShowDeleteConfirm(false);
      setDeletePassword("");
    } catch (err) {
      setDeleteResult({
        type: "error",
        message: err instanceof Error ? err.message : "Delete failed.",
      });
      setShowDeleteConfirm(false);
      setDeletePassword("");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="p-[32px] font-sans">
      <div className="mb-[32px]">
        <h1 className="font-display text-[28px] font-bold text-[var(--color-cream)]">Settings</h1>
        <p className="text-[13px] text-[rgba(245,237,214,0.45)] mt-[4px]">Application settings and configuration.</p>
      </div>

      <div className="flex flex-col gap-[16px]">
        {/* Maintenance Mode */}
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

        {/* Export Database */}
        <div className="bg-[var(--color-dark-surface)] rounded-[8px] overflow-hidden">
          <div className="px-[20px] py-[18px] flex items-center justify-between gap-[16px]">
            <div>
              <p className="text-[14px] font-semibold text-[var(--color-cream)]">Export Database</p>
              <p className="text-[12px] text-[rgba(245,237,214,0.4)] mt-[2px]">
                Download a full JSON backup of all database data. Read-only server paths (activityLog, transferLog, payments) are excluded.
              </p>
            </div>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="px-[16px] py-[8px] text-[12px] font-semibold rounded-[6px] bg-[rgba(201,168,76,0.12)] text-[var(--color-gold)] border border-[rgba(201,168,76,0.25)] hover:bg-[rgba(201,168,76,0.2)] transition-colors disabled:opacity-50"
            >
              {exporting ? "Exporting…" : "Export JSON"}
            </button>
          </div>
        </div>

        {/* Delete All Data — owner only */}
        {isOwner && <div className="bg-[var(--color-dark-surface)] rounded-[8px] overflow-hidden border border-[rgba(220,38,38,0.2)]">
          <div className="px-[20px] py-[18px] flex items-center justify-between gap-[16px]">
            <div>
              <p className="text-[14px] font-semibold text-[#F87171]">Delete All Data</p>
              <p className="text-[12px] text-[rgba(245,237,214,0.4)] mt-[2px]">
                Permanently deletes all data from the database including read-only server paths. This cannot be undone.
              </p>
              {deleteResult && (
                <p className={`mt-[8px] text-[12px] ${deleteResult.type === "success" ? "text-[var(--color-teal)]" : "text-[#F87171]"}`}>
                  {deleteResult.message}
                </p>
              )}
            </div>
            <button
              onClick={() => { setShowDeleteConfirm(true); setDeleteResult(null); }}
              disabled={deleting}
              className="flex-shrink-0 px-[16px] py-[8px] text-[12px] font-semibold rounded-[6px] bg-[rgba(220,38,38,0.12)] text-[#F87171] border border-[rgba(220,38,38,0.3)] hover:bg-[rgba(220,38,38,0.22)] transition-colors disabled:opacity-50"
            >
              Delete All Data
            </button>
          </div>
        </div>}

        {/* Import Database */}
        <div className="bg-[var(--color-dark-surface)] rounded-[8px] overflow-hidden">
          <div className="px-[20px] py-[18px]">
            <div className="mb-[14px]">
              <p className="text-[14px] font-semibold text-[var(--color-cream)]">Import Database</p>
              <p className="text-[12px] text-[rgba(245,237,214,0.4)] mt-[2px]">
                Restore from a JSON backup. Overwrites existing data.{" "}
                <span className="text-[rgba(248,113,113,0.7)]">Read-only paths are skipped.</span>
              </p>
            </div>
            <div className="flex items-center gap-[10px]">
              <label className="px-[14px] py-[7px] text-[12px] font-semibold rounded-[6px] bg-[rgba(245,237,214,0.07)] text-[rgba(245,237,214,0.6)] border border-[rgba(245,237,214,0.1)] hover:bg-[rgba(245,237,214,0.1)] transition-colors cursor-pointer">
                Choose File
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </label>
              <span className="text-[12px] text-[rgba(245,237,214,0.4)] truncate max-w-[200px]">
                {importFile ? importFile.name : "No file selected"}
              </span>
              {importFile && (
                <button
                  onClick={() => setShowConfirm(true)}
                  disabled={importing}
                  className="ml-auto px-[16px] py-[7px] text-[12px] font-semibold rounded-[6px] bg-[rgba(220,38,38,0.12)] text-[#F87171] border border-[rgba(220,38,38,0.25)] hover:bg-[rgba(220,38,38,0.2)] transition-colors disabled:opacity-50"
                >
                  Import
                </button>
              )}
            </div>
            {importResult && (
              <p className={`mt-[10px] text-[12px] ${importResult.type === "success" ? "text-[var(--color-teal)]" : "text-[#F87171]"}`}>
                {importResult.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Confirm Delete All Modal — owner only */}
      {isOwner && showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[var(--color-dark-surface)] rounded-[12px] w-full max-w-[420px] p-[28px] mx-[16px]">
            <h2 className="text-[16px] font-bold text-[#F87171] mb-[10px]">Delete All Data?</h2>
            <p className="text-[13px] text-[rgba(245,237,214,0.55)] mb-[18px]">
              This will permanently erase everything in the database — users, bookings, classes, payments, and all other data. This cannot be undone.
            </p>
            <p className="text-[12px] text-[rgba(245,237,214,0.5)] mb-[8px]">
              Enter your password to confirm.
            </p>
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => { setDeletePassword(e.target.value); setDeletePasswordError(""); }}
              placeholder="Password"
              autoComplete="current-password"
              className="w-full px-[12px] py-[8px] mb-[4px] text-[13px] rounded-[6px] bg-[rgba(245,237,214,0.06)] border border-[rgba(245,237,214,0.1)] text-[var(--color-cream)] placeholder:text-[rgba(245,237,214,0.2)] outline-none focus:border-[rgba(220,38,38,0.5)]"
            />
            {deletePasswordError && (
              <p className="text-[11px] text-[#F87171] mb-[14px]">{deletePasswordError}</p>
            )}
            {!deletePasswordError && <div className="mb-[20px]" />}
            <div className="flex gap-[10px] justify-end">
              <button
                onClick={() => { setShowDeleteConfirm(false); setDeletePassword(""); setDeletePasswordError(""); }}
                className="px-[16px] py-[8px] text-[12px] font-semibold rounded-[6px] bg-[rgba(245,237,214,0.07)] text-[rgba(245,237,214,0.6)] hover:bg-[rgba(245,237,214,0.12)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAll}
                disabled={deleting || !deletePassword}
                className="px-[16px] py-[8px] text-[12px] font-semibold rounded-[6px] bg-[rgba(220,38,38,0.15)] text-[#F87171] border border-[rgba(220,38,38,0.3)] hover:bg-[rgba(220,38,38,0.25)] transition-colors disabled:opacity-40"
              >
                {deleting ? "Deleting…" : "Yes, Delete Everything"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Import Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[var(--color-dark-surface)] rounded-[12px] w-full max-w-[400px] p-[28px] mx-[16px]">
            <h2 className="text-[16px] font-bold text-[var(--color-cream)] mb-[10px]">Overwrite Database?</h2>
            <p className="text-[13px] text-[rgba(245,237,214,0.55)] mb-[24px]">
              This will overwrite all writable database paths with the contents of{" "}
              <span className="text-[var(--color-cream)] font-semibold">{importFile?.name}</span>. This action cannot be undone.
            </p>
            <div className="flex gap-[10px] justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-[16px] py-[8px] text-[12px] font-semibold rounded-[6px] bg-[rgba(245,237,214,0.07)] text-[rgba(245,237,214,0.6)] hover:bg-[rgba(245,237,214,0.12)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={importing}
                className="px-[16px] py-[8px] text-[12px] font-semibold rounded-[6px] bg-[rgba(220,38,38,0.15)] text-[#F87171] border border-[rgba(220,38,38,0.3)] hover:bg-[rgba(220,38,38,0.25)] transition-colors disabled:opacity-50"
              >
                {importing ? "Importing…" : "Yes, Overwrite"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
