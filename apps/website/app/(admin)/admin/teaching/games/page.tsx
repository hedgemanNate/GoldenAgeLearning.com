"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "../../../../../hooks/useAuth";
import {
  subscribeToGames,
  createGame,
  deleteGame,
  replaceGameQuestions,
} from "../../../../../lib/firebase/db";
import type { GameInstanceWithId, GameQuestion } from "../../../../../types/game";

// ─── Game Types ────────────────────────────────────────────────────────────────
const GAME_TYPES = [
  { id: "millionaire" as const, name: "Who Wants to Be a Millionaire" },
];

// ─── Teaching Classes — mirrors the CLASSES manifest in teaching/page.tsx ─────
// Add a new entry here whenever a class card is added to /teaching.
const TEACHING_CLASSES = [
  { slug: "meet-your-smartphone",  name: "Class 1: Meet Your Smartphone" },
  { slug: "master-the-keyboard",   name: "Class 2: Master the Keyboard" },
];

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-[64px] gap-[12px]">
      <div className="w-[48px] h-[48px] rounded-full bg-[rgba(201,168,76,0.08)] flex items-center justify-center mb-[4px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-[22px] h-[22px] text-[rgba(201,168,76,0.5)]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <p className="text-[14px] font-medium text-[rgba(245,237,214,0.55)]">No games yet</p>
      <p className="text-[12px] text-[rgba(245,237,214,0.3)] text-center max-w-[320px]">
        Create your first game to get started. Each game is linked to a class and uses questions you upload via CSV.
      </p>
    </div>
  );
}

// ─── Create Game Modal ─────────────────────────────────────────────────────────
interface CreateGameModalProps {
  onClose: () => void;
  onCreated: () => void;
  createdBy: string;
}

function CreateGameModal({ onClose, onCreated, createdBy }: CreateGameModalProps) {
  const [slug, setSlug] = useState(TEACHING_CLASSES[0]?.slug ?? "");
  const [gameType, setGameType] = useState<"millionaire">("millionaire");
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const selectedClass = TEACHING_CLASSES.find((c) => c.slug === slug);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!slug || !selectedClass) { setError("Please select a class."); return; }
    if (timerSeconds < 5 || timerSeconds > 120) {
      setError("Timer must be between 5 and 120 seconds.");
      return;
    }

    setSaving(true);
    try {
      await createGame({
        name: selectedClass.name,
        classId: slug,
        className: selectedClass.name,
        gameType,
        timerSeconds,
        questionCount: 0,
        createdBy,
      });
      onCreated();
      onClose();
    } catch {
      setError("Failed to create game. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  // Close on overlay click
  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) onClose();
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
    >
      <div className="bg-[var(--color-dark-surface)] rounded-[12px] border border-[rgba(245,237,214,0.1)] w-full max-w-[460px] mx-[16px] p-[28px]">
        <div className="flex items-center justify-between mb-[20px]">
          <h2 className="font-display text-[18px] font-bold text-[var(--color-cream)]">
            Create Game
          </h2>
          <button
            onClick={onClose}
            className="text-[rgba(245,237,214,0.4)] hover:text-[var(--color-cream)] transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-[16px]">
          {/* Class — name is derived from this selection */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[12px] font-medium text-[rgba(245,237,214,0.6)] uppercase tracking-wider">
              Class
            </label>
            <select
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="bg-[rgba(245,237,214,0.05)] border border-[rgba(245,237,214,0.12)] rounded-[6px] px-[12px] py-[9px] text-[14px] text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-gold)]"
            >
              {TEACHING_CLASSES.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Game Type */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[12px] font-medium text-[rgba(245,237,214,0.6)] uppercase tracking-wider">
              Game Type
            </label>
            <select
              value={gameType}
              onChange={(e) => setGameType(e.target.value as "millionaire")}
              className="bg-[rgba(245,237,214,0.05)] border border-[rgba(245,237,214,0.12)] rounded-[6px] px-[12px] py-[9px] text-[14px] text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-gold)]"
            >
              {GAME_TYPES.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          {/* Timer */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[12px] font-medium text-[rgba(245,237,214,0.6)] uppercase tracking-wider">
              Timer Per Question (seconds)
            </label>
            <input
              type="number"
              min={5}
              max={120}
              value={timerSeconds}
              onChange={(e) => setTimerSeconds(Number(e.target.value))}
              className="bg-[rgba(245,237,214,0.05)] border border-[rgba(245,237,214,0.12)] rounded-[6px] px-[12px] py-[9px] text-[14px] text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-gold)] w-[120px]"
            />
          </div>

          {error && (
            <p className="text-[13px] text-red-400">{error}</p>
          )}

          <div className="flex items-center justify-end gap-[10px] mt-[4px]">
            <button
              type="button"
              onClick={onClose}
              className="px-[16px] py-[8px] rounded-[6px] text-[13px] font-medium text-[rgba(245,237,214,0.6)] hover:text-[var(--color-cream)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-[var(--color-gold)] text-[var(--color-dark-bg)] font-semibold text-[13px] px-[18px] py-[8px] rounded-[6px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Creating…" : "Create Game"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── CSV helpers ──────────────────────────────────────────────────────────────

const REQUIRED_COLUMNS = [
  "question", "option_a", "option_b", "option_c", "option_d",
  "correct_answer", "difficulty", "fifty_fifty_remove",
] as const;

type ParseResult =
  | { ok: true; questions: GameQuestion[] }
  | { ok: false; errors: string[] };

function parseCSV(text: string): ParseResult {
  const lines = text.split(/\r?\n/).filter((l) => l.trim() !== "");
  if (lines.length < 2) return { ok: false, errors: ["CSV must have a header row and at least one question."] };

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const missing = REQUIRED_COLUMNS.filter((c) => !headers.includes(c));
  if (missing.length > 0) {
    return { ok: false, errors: [`Missing required columns: ${missing.join(", ")}`] };
  }

  const idx = (col: string) => headers.indexOf(col);
  const errors: string[] = [];
  const questions: GameQuestion[] = [];

  for (let i = 1; i < lines.length; i++) {
    // Simple CSV split — handles unquoted fields; sufficient for question data
    const cells = lines[i].split(",").map((c) => c.trim());
    const row = i + 1; // 1-based for user-facing messages

    const get = (col: string) => cells[idx(col)] ?? "";

    const question   = get("question");
    const option_a   = get("option_a");
    const option_b   = get("option_b");
    const option_c   = get("option_c");
    const option_d   = get("option_d");
    const correct    = get("correct_answer").toLowerCase();
    const diffRaw    = get("difficulty");
    const fiftyFifty = get("fifty_fifty_remove");

    if (!question)  errors.push(`Row ${row}: "question" is empty.`);
    if (!option_a)  errors.push(`Row ${row}: "option_a" is empty.`);
    if (!option_b)  errors.push(`Row ${row}: "option_b" is empty.`);
    if (!option_c)  errors.push(`Row ${row}: "option_c" is empty.`);
    if (!option_d)  errors.push(`Row ${row}: "option_d" is empty.`);
    if (!["a", "b", "c", "d"].includes(correct))
      errors.push(`Row ${row}: "correct_answer" must be a, b, c, or d — got "${correct}".`);

    const difficulty = parseInt(diffRaw, 10);
    if (isNaN(difficulty) || difficulty < 1 || difficulty > 15)
      errors.push(`Row ${row}: "difficulty" must be 1–15 — got "${diffRaw}".`);

    // fifty_fifty_remove must be exactly two letters, comma-separated,
    // both wrong (i.e. neither is the correct answer).
    const removeLetters = fiftyFifty
      .toLowerCase()
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "");
    const validLetter = (s: string): s is "a" | "b" | "c" | "d" =>
      ["a", "b", "c", "d"].includes(s);

    if (removeLetters.length !== 2) {
      errors.push(
        `Row ${row}: "fifty_fifty_remove" must be exactly two comma-separated letters — got "${fiftyFifty}".`
      );
    } else if (!removeLetters.every(validLetter)) {
      errors.push(`Row ${row}: "fifty_fifty_remove" letters must be a, b, c, or d — got "${fiftyFifty}".`);
    } else if (removeLetters[0] === removeLetters[1]) {
      errors.push(`Row ${row}: "fifty_fifty_remove" letters must be different — got "${fiftyFifty}".`);
    } else if (validLetter(correct) && removeLetters.includes(correct)) {
      errors.push(
        `Row ${row}: "fifty_fifty_remove" must not include the correct answer "${correct}".`
      );
    }

    if (errors.length === 0) {
      questions.push({
        question, option_a, option_b, option_c, option_d,
        correct_answer: correct as "a" | "b" | "c" | "d",
        difficulty,
        fifty_fifty_remove: removeLetters.join(","),
      });
    }
  }

  if (errors.length > 0) return { ok: false, errors };
  return { ok: true, questions };
}

// ─── Upload Questions Modal ────────────────────────────────────────────────────

interface UploadQuestionsModalProps {
  game: GameInstanceWithId;
  onClose: () => void;
}

function UploadQuestionsModal({ game, onClose }: UploadQuestionsModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [parsed, setParsed] = useState<GameQuestion[] | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [fileName, setFileName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleFile(file: File) {
    if (!file.name.endsWith(".csv")) {
      setErrors(["Only .csv files are accepted."]);
      setParsed(null);
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const result = parseCSV(text);
      if (result.ok) {
        setParsed(result.questions);
        setErrors([]);
      } else {
        setParsed(null);
        setErrors(result.ok === false ? result.errors : []);
      }
    };
    reader.readAsText(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  async function handleSave() {
    if (!parsed) return;
    setSaving(true);
    try {
      await replaceGameQuestions(game.id, parsed);
      setSaved(true);
    } catch {
      setErrors(["Failed to save questions. Please try again."]);
    } finally {
      setSaving(false);
    }
  }

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) onClose();
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
    >
      <div className="bg-[var(--color-dark-surface)] rounded-[12px] border border-[rgba(245,237,214,0.1)] w-full max-w-[560px] mx-[16px] p-[28px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-[6px]">
          <h2 className="font-display text-[18px] font-bold text-[var(--color-cream)]">
            Upload Questions
          </h2>
          <button
            onClick={onClose}
            className="text-[rgba(245,237,214,0.4)] hover:text-[var(--color-cream)] transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <p className="text-[12px] text-[rgba(245,237,214,0.4)] mb-[20px]">{game.name}</p>

        {saved ? (
          // ── Success state ──
          <div className="flex flex-col items-center gap-[12px] py-[24px]">
            <div className="w-[48px] h-[48px] rounded-full bg-[rgba(201,168,76,0.12)] flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-[22px] h-[22px] text-[var(--color-gold)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-[14px] font-semibold text-[var(--color-cream)]">
              {parsed?.length} question{parsed?.length !== 1 ? "s" : ""} saved
            </p>
            <p className="text-[12px] text-[rgba(245,237,214,0.4)] text-center">
              Questions are live. Previous questions have been replaced.
            </p>
            <button
              onClick={onClose}
              className="mt-[8px] bg-[var(--color-gold)] text-[var(--color-dark-bg)] font-semibold text-[13px] px-[20px] py-[9px] rounded-[6px]"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            {/* Required columns hint */}
            <div className="bg-[rgba(245,237,214,0.04)] border border-[rgba(245,237,214,0.07)] rounded-[8px] px-[14px] py-[10px] mb-[16px]">
              <p className="text-[11px] text-[rgba(245,237,214,0.5)] leading-relaxed">
                <span className="text-[rgba(245,237,214,0.7)] font-medium">Required columns: </span>
                question, option_a, option_b, option_c, option_d, correct_answer, difficulty (1–15), fifty_fifty_remove
              </p>
            </div>

            {/* Drop zone */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[rgba(245,237,214,0.15)] hover:border-[var(--color-gold)] rounded-[8px] flex flex-col items-center justify-center gap-[8px] py-[32px] cursor-pointer transition-colors mb-[16px]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-[24px] h-[24px] text-[rgba(245,237,214,0.3)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              {fileName ? (
                <p className="text-[13px] text-[var(--color-gold)]">{fileName}</p>
              ) : (
                <>
                  <p className="text-[13px] text-[rgba(245,237,214,0.5)]">Drop a CSV file here or click to browse</p>
                  <p className="text-[11px] text-[rgba(245,237,214,0.25)]">.csv files only</p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleInputChange}
              />
            </div>

            {/* Validation errors */}
            {errors.length > 0 && (
              <div className="bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] rounded-[8px] px-[14px] py-[10px] mb-[16px] max-h-[120px] overflow-y-auto">
                {errors.map((err, i) => (
                  <p key={i} className="text-[12px] text-red-400 leading-relaxed">{err}</p>
                ))}
              </div>
            )}

            {/* Preview */}
            {parsed && parsed.length > 0 && (
              <div className="mb-[16px]">
                <p className="text-[12px] text-[rgba(245,237,214,0.5)] mb-[8px]">
                  {parsed.length} question{parsed.length !== 1 ? "s" : ""} parsed — preview:
                </p>
                <div className="bg-[rgba(245,237,214,0.03)] rounded-[6px] border border-[rgba(245,237,214,0.07)] max-h-[140px] overflow-y-auto">
                  {parsed.slice(0, 5).map((q, i) => (
                    <div key={i} className="px-[12px] py-[8px] border-b border-[rgba(245,237,214,0.05)] last:border-0">
                      <p className="text-[12px] text-[var(--color-cream)] leading-snug">
                        <span className="text-[rgba(245,237,214,0.35)] mr-[6px]">Q{i + 1}</span>
                        {q.question}
                      </p>
                      <p className="text-[11px] text-[rgba(245,237,214,0.35)] mt-[2px]">
                        ✓ {q[`option_${q.correct_answer}` as keyof GameQuestion] as string}
                      </p>
                    </div>
                  ))}
                  {parsed.length > 5 && (
                    <p className="px-[12px] py-[8px] text-[11px] text-[rgba(245,237,214,0.3)]">
                      …and {parsed.length - 5} more
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-[10px]">
              <button
                type="button"
                onClick={onClose}
                className="px-[16px] py-[8px] rounded-[6px] text-[13px] font-medium text-[rgba(245,237,214,0.6)] hover:text-[var(--color-cream)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!parsed || saving}
                className="bg-[var(--color-gold)] text-[var(--color-dark-bg)] font-semibold text-[13px] px-[18px] py-[8px] rounded-[6px] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {saving ? "Saving…" : `Save ${parsed ? parsed.length + " " : ""}Question${parsed?.length !== 1 ? "s" : ""}`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminTeachingGames() {
  const { firebaseUser } = useAuth();
  const [games, setGames] = useState<GameInstanceWithId[]>([]);
  const [loadingGames, setLoadingGames] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [uploadGame, setUploadGame] = useState<GameInstanceWithId | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Subscribe to games in real time
  useEffect(() => {
    const unsub = subscribeToGames((g) => {
      setGames(g);
      setLoadingGames(false);
    });
    return unsub;
  }, []);

  async function handleDelete(gameId: string) {
    if (!confirm("Delete this game? This will also remove all uploaded questions.")) return;
    setDeletingId(gameId);
    try {
      await deleteGame(gameId);
    } finally {
      setDeletingId(null);
    }
  }

  const gameTypeLabel = (type: string) =>
    GAME_TYPES.find((t) => t.id === type)?.name ?? type;

  return (
    <div className="p-[32px] font-sans">

      {/* Header */}
      <div className="flex items-center justify-between mb-[28px]">
        <div>
          <h1 className="font-display text-[28px] font-bold text-[var(--color-cream)]">Games</h1>
          <p className="text-[13px] text-[rgba(245,237,214,0.45)] mt-[4px]">
            Manage trivia games for your classes. Upload questions and run live games on the projector.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-[var(--color-gold)] text-[var(--color-dark-bg)] font-sans font-semibold text-[13px] px-[18px] py-[9px] rounded-[6px] hover:opacity-90 transition-opacity"
        >
          + Create Game
        </button>
      </div>

      {/* Game instances table */}
      <div className="bg-[var(--color-dark-surface)] rounded-[8px] overflow-hidden mb-[24px]">
        {loadingGames ? (
          <div className="flex items-center justify-center py-[48px]">
            <p className="text-[13px] text-[rgba(245,237,214,0.3)]">Loading…</p>
          </div>
        ) : games.length === 0 ? (
          <EmptyState />
        ) : (
          <table className="w-full table-fixed text-[13px]">
            <thead>
              <tr className="border-b border-[rgba(245,237,214,0.07)]">
                <th className="text-left px-[16px] py-[12px] text-[10px] uppercase tracking-wider text-[rgba(245,237,214,0.3)] font-medium">Game Name</th>
                <th className="text-left px-[16px] py-[12px] text-[10px] uppercase tracking-wider text-[rgba(245,237,214,0.3)] font-medium">Class</th>
                <th className="text-left px-[16px] py-[12px] text-[10px] uppercase tracking-wider text-[rgba(245,237,214,0.3)] font-medium">Game Type</th>
                <th className="w-[10ch] text-left px-[8px] py-[12px] text-[10px] uppercase tracking-wider text-[rgba(245,237,214,0.3)] font-medium">Timer</th>
                <th className="w-[12ch] text-left px-[8px] py-[12px] text-[10px] uppercase tracking-wider text-[rgba(245,237,214,0.3)] font-medium">Questions</th>
                <th className="w-[26ch] text-left px-[8px] py-[12px] text-[10px] uppercase tracking-wider text-[rgba(245,237,214,0.3)] font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {games.map((game, i) => (
                <tr key={game.id} className={i < games.length - 1 ? "border-b border-[rgba(245,237,214,0.05)]" : ""}>
                  <td className="px-[16px] py-[13px] text-[var(--color-cream)] font-medium">{game.name}</td>
                  <td className="px-[16px] py-[13px] text-[rgba(245,237,214,0.7)]">{game.className}</td>
                  <td className="px-[16px] py-[13px] text-[rgba(245,237,214,0.6)]">{gameTypeLabel(game.gameType)}</td>
                  <td className="w-[10ch] px-[8px] py-[13px] text-[rgba(245,237,214,0.6)]">{game.timerSeconds}s</td>
                  <td className="w-[12ch] px-[8px] py-[13px] text-[rgba(245,237,214,0.6)]">{game.questionCount}</td>
                  <td className="w-[26ch] px-[8px] py-[13px]">
                    <div className="flex items-center gap-[12px]">
                      <Link
                        href={`/admin/teaching/games/play/${game.id}`}
                        className="text-[var(--color-gold)] text-[12px] font-semibold hover:opacity-75 transition-opacity"
                      >
                        Play
                      </Link>
                      <button
                        onClick={() => setUploadGame(game)}
                        className="text-[var(--color-teal)] text-[12px] font-medium hover:opacity-75 transition-opacity"
                      >
                        Upload Questions
                      </button>
                      <button
                        onClick={() => handleDelete(game.id)}
                        disabled={deletingId === game.id}
                        className="text-red-400 text-[12px] font-medium hover:text-red-300 transition-colors disabled:opacity-40"
                      >
                        {deletingId === game.id ? "Deleting…" : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Info card */}
      <div className="bg-[var(--color-dark-surface)] rounded-[10px] border border-[rgba(245,237,214,0.07)] px-[24px] py-[20px]">
        <h2 className="font-display text-[16px] font-bold text-[var(--color-cream)] mb-[12px]">About the Games Platform</h2>
        <div className="flex flex-col gap-[10px]">
          <InfoRow
            title="Who Wants to Be a Millionaire"
            description="A 15-question trivia game with a points ladder, lifelines, and live class participation. Questions are loaded via CSV and played on the projector with the instructor controlling from their phone."
          />
          <InfoRow
            title="How questions are loaded"
            description="Upload a CSV file to any game instance. The CSV must include: question, option_a, option_b, option_c, option_d, correct_answer, difficulty, and fifty_fifty_remove columns. The system validates every row before saving."
          />
          <InfoRow
            title="How scores are awarded"
            description="Points are added to enrolled students' accounts at the end of each game. Scores accumulate across games — correct answers, safe havens, and walk-away values all count toward class totals."
          />
          <InfoRow
            title="Game types available"
            description={`Currently available: ${GAME_TYPES.map((t) => t.name).join(", ")}. More game formats will be added to the platform in future updates.`}
          />
        </div>
      </div>

      {/* Create Game Modal */}
      {showCreateModal && firebaseUser && (
        <CreateGameModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => setShowCreateModal(false)}
          createdBy={firebaseUser.uid}
        />
      )}

      {/* Upload Questions Modal */}
      {uploadGame && (
        <UploadQuestionsModal
          game={uploadGame}
          onClose={() => setUploadGame(null)}
        />
      )}

    </div>
  );
}

function InfoRow({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex gap-[12px] py-[10px] border-b border-[rgba(245,237,214,0.05)] last:border-0 last:pb-0 first:pt-0">
      <div className="w-[6px] h-[6px] rounded-full bg-[var(--color-gold)] flex-shrink-0 mt-[6px]" />
      <div>
        <p className="text-[13px] font-semibold text-[var(--color-cream)] mb-[2px]">{title}</p>
        <p className="text-[12px] text-[rgba(245,237,214,0.5)] leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
