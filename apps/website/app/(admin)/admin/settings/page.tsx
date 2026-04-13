"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ref, set } from "firebase/database";
import { ref as storageRef, listAll, getDownloadURL, getMetadata } from "firebase/storage";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { db, auth, storage } from "../../../../lib/firebase/client";
import { subscribeMaintenanceMode, setMaintenanceMode, deleteAllData, backupDatabase } from "../../../../lib/firebase/db";
import { useAuthContext } from "../../../../context/AuthContext";

const PAGE_SIZE = 5;

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
  const router = useRouter();
  const { firebaseUser } = useAuthContext();
  const isOwner = firebaseUser?.email === "nathanhedgeman@gmail.com";

  useEffect(() => {
    if (firebaseUser !== null && !isOwner) {
      router.replace("/admin");
    }
  }, [firebaseUser, isOwner, router]);

  const [maintenanceMode, setMaintenanceModeState] = useState(false);
  const [saving, setSaving] = useState(false);

  const [backing, setBacking] = useState(false);
  const [backupMsg, setBackupMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  type BackupEntry = { name: string; url: string; createdAt: Date };
  const [backups, setBackups] = useState<BackupEntry[]>([]);
  const [backupsLoading, setBackupsLoading] = useState(true);
  const [selectedBackup, setSelectedBackup] = useState<BackupEntry | null>(null);
  const [backupPage, setBackupPage] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function fetchBackups() {
      setBackupsLoading(true);
      try {
        const listResult = await listAll(storageRef(storage, "backups"));
        const entries = await Promise.all(
          listResult.items.map(async (item) => {
            const [url, meta] = await Promise.all([getDownloadURL(item), getMetadata(item)]);
            return {
              name: item.name,
              url,
              createdAt: new Date(meta.timeCreated),
            };
          })
        );
        entries.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        if (!cancelled) setBackups(entries);
      } catch {
        if (!cancelled) setBackups([]);
      } finally {
        if (!cancelled) setBackupsLoading(false);
      }
    }
    fetchBackups();
    return () => { cancelled = true; };
  }, []);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const [cloudImportEntry, setCloudImportEntry] = useState<BackupEntry | null>(null);

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

  async function handleBackup() {
    setBacking(true);
    setBackupMsg(null);
    try {
      const { backupFile } = await backupDatabase();
      setBackupMsg({ type: "success", text: `Saved: ${backupFile}` });
      // Refresh backup list
      const listResult = await listAll(storageRef(storage, "backups"));
      const entries = await Promise.all(
        listResult.items.map(async (item) => {
          const [url, meta] = await Promise.all([getDownloadURL(item), getMetadata(item)]);
          return { name: item.name, url, createdAt: new Date(meta.timeCreated) };
        })
      );
      entries.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setBackups(entries);
      setBackupPage(0);
      setSelectedBackup(null);
    } catch (err) {
      setBackupMsg({ type: "error", text: err instanceof Error ? err.message : "Backup failed." });
    } finally {
      setBacking(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setImportFile(file);
    setImportResult(null);
  }

  async function handleImport() {
    if (!importFile && !cloudImportEntry) return;
    setImporting(true);
    setImportResult(null);
    try {
      let text: string;
      if (cloudImportEntry) {
        const res = await fetch(cloudImportEntry.url);
        text = await res.text();
      } else {
        text = await importFile!.text();
      }
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
      setCloudImportEntry(null);
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
      setDeleteResult({ type: "success", message: "All data has been deleted. A backup was saved to Firebase Storage." });
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

  const totalPages = Math.ceil(backups.length / PAGE_SIZE);
  const pagedBackups = backups.slice(backupPage * PAGE_SIZE, (backupPage + 1) * PAGE_SIZE);

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

        {/* Backup Database */}
        <div className="bg-[var(--color-dark-surface)] rounded-[8px] overflow-hidden">
          <div className="px-[20px] py-[18px] flex items-center justify-between gap-[16px]">
            <div>
              <p className="text-[14px] font-semibold text-[var(--color-cream)]">Backup Database</p>
              <p className="text-[12px] text-[rgba(245,237,214,0.4)] mt-[2px]">
                Save a full backup of all database data to Firebase Storage, including read-only server paths.
              </p>
              {backupMsg && (
                <p className={`mt-[6px] text-[11px] ${backupMsg.type === "success" ? "text-[var(--color-teal)]" : "text-[#F87171]"}`}>
                  {backupMsg.text}
                </p>
              )}
            </div>
            <button
              onClick={handleBackup}
              disabled={backing}
              className="flex-shrink-0 px-[16px] py-[8px] text-[12px] font-semibold rounded-[6px] bg-[rgba(122,174,173,0.1)] text-[var(--color-teal)] border border-[rgba(122,174,173,0.25)] hover:bg-[rgba(122,174,173,0.18)] transition-colors disabled:opacity-50"
            >
              {backing ? "Backing up…" : "Backup Database"}
            </button>
          </div>
        </div>

        {/* Cloud Backups — unified selectable list */}
        <div className="bg-[var(--color-dark-surface)] rounded-[8px] overflow-hidden">
          <div className="px-[20px] py-[16px] flex items-center justify-between gap-[16px] border-b border-[rgba(245,237,214,0.06)]">
            <div>
              <p className="text-[14px] font-semibold text-[var(--color-cream)]">Cloud Backups</p>
              <p className="text-[12px] text-[rgba(245,237,214,0.4)] mt-[2px]">
                Select a backup to export locally or restore the database.
              </p>
            </div>
            <div className="flex gap-[8px] flex-shrink-0">
              <button
                disabled={!selectedBackup}
                onClick={async () => {
                  if (!selectedBackup) return;
                  const res = await fetch(selectedBackup.url);
                  const blob = await res.blob();
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = selectedBackup.name;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="px-[14px] py-[7px] text-[12px] font-semibold rounded-[6px] bg-[rgba(201,168,76,0.08)] text-[var(--color-gold)] border border-[rgba(201,168,76,0.2)] hover:bg-[rgba(201,168,76,0.16)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Export Local
              </button>
              <button
                disabled={!selectedBackup}
                onClick={() => {
                  if (!selectedBackup) return;
                  setCloudImportEntry(selectedBackup);
                  setImportResult(null);
                  setShowConfirm(true);
                }}
                className="px-[14px] py-[7px] text-[12px] font-semibold rounded-[6px] bg-[rgba(122,174,173,0.1)] text-[var(--color-teal)] border border-[rgba(122,174,173,0.25)] hover:bg-[rgba(122,174,173,0.18)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Import
              </button>
            </div>
          </div>
          <div className="px-[20px] py-[14px]">
            {backupsLoading ? (
              <p className="text-[12px] text-[rgba(245,237,214,0.3)]">Loading…</p>
            ) : backups.length === 0 ? (
              <p className="text-[12px] text-[rgba(245,237,214,0.3)]">No backups found.</p>
            ) : (
              <>
                <div className="flex flex-col gap-[2px]">
                  {pagedBackups.map((b) => {
                    const isSelected = selectedBackup?.name === b.name;
                    return (
                      <button
                        key={b.name}
                        onClick={() => setSelectedBackup(isSelected ? null : b)}
                        className={`w-full text-left px-[12px] py-[10px] rounded-[6px] border-l-[3px] transition-colors ${
                          isSelected
                            ? "bg-[rgba(245,237,214,0.07)] border-l-[var(--color-cream)]"
                            : "bg-transparent border-l-transparent hover:bg-[rgba(245,237,214,0.04)]"
                        }`}
                      >
                        <p className="text-[12px] text-[var(--color-cream)]">{b.name}</p>
                        <p className="text-[10px] text-[rgba(245,237,214,0.35)] mt-[2px]">{b.createdAt.toLocaleString()}</p>
                      </button>
                    );
                  })}
                </div>
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-[10px] pt-[10px] border-t border-[rgba(245,237,214,0.06)]">
                    <button
                      onClick={() => setBackupPage((p) => Math.max(0, p - 1))}
                      disabled={backupPage === 0}
                      className="px-[12px] py-[5px] text-[11px] font-semibold rounded-[6px] bg-[rgba(245,237,214,0.06)] text-[rgba(245,237,214,0.5)] hover:bg-[rgba(245,237,214,0.1)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      ← Prev
                    </button>
                    <p className="text-[11px] text-[rgba(245,237,214,0.3)]">{backupPage + 1} / {totalPages}</p>
                    <button
                      onClick={() => setBackupPage((p) => Math.min(totalPages - 1, p + 1))}
                      disabled={backupPage === totalPages - 1}
                      className="px-[12px] py-[5px] text-[11px] font-semibold rounded-[6px] bg-[rgba(245,237,214,0.06)] text-[rgba(245,237,214,0.5)] hover:bg-[rgba(245,237,214,0.1)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Import Database — local file */}
        <div className="bg-[var(--color-dark-surface)] rounded-[8px] overflow-hidden">
          <div className="px-[20px] py-[18px]">
            <div className="mb-[14px]">
              <p className="text-[14px] font-semibold text-[var(--color-cream)]">Import Database</p>
              <p className="text-[12px] text-[rgba(245,237,214,0.4)] mt-[2px]">
                Restore from a local JSON file. Overwrites existing data.{" "}
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
              <span className="text-[var(--color-cream)] font-semibold">{cloudImportEntry?.name ?? importFile?.name}</span>. This action cannot be undone.
            </p>
            <div className="flex gap-[10px] justify-end">
              <button
                onClick={() => { setShowConfirm(false); setCloudImportEntry(null); }}
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
