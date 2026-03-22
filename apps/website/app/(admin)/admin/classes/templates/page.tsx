"use client";

import { useState } from "react";
import { useClassTemplates } from "../../../../../hooks/useClassTemplates";
import { useAuthContext } from "../../../../../context/AuthContext";
import {
  createClassTemplate,
  updateClassTemplate,
  deleteClassTemplate,
  addTaxonomyTag,
  deleteTaxonomyTag,
} from "../../../../../lib/firebase/db";
import type { ClassTemplateWithId, ClassTemplate } from "../../../../../types/classTemplate";
import PlacesAutocompleteInput from "../../../../../components/admin/PlacesAutocompleteInput";

type TemplateForm = {
  name: string;
  price: number;
  seatLimit: number;
  duration: number;
  defaultCategory: string;
  defaultLocation: string;
};

const EMPTY_FORM: TemplateForm = {
  name: "",
  price: 0,
  seatLimit: 0,
  duration: 60,
  defaultCategory: "",
  defaultLocation: "",
};

function fmtDuration(mins: number) {
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export default function AdminClassTemplates() {
  const { templates, categories, locations, loading } = useClassTemplates();
  const { user: currentUser } = useAuthContext();

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ClassTemplateWithId | null>(null);
  const [form, setForm] = useState<TemplateForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [newLocationInput, setNewLocationInput] = useState("");
  const [addingTag, setAddingTag] = useState<"category" | "location" | null>(null);

  function openAdd() {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setDeleteConfirm(false);
    setError("");
    setModalOpen(true);
  }

  function openEdit(t: ClassTemplateWithId) {
    setEditTarget(t);
    setForm({
      name: t.name,
      price: t.price,
      seatLimit: t.seatLimit,
      duration: t.duration,
      defaultCategory: t.defaultCategory,
      defaultLocation: t.defaultLocation,
    });
    setDeleteConfirm(false);
    setError("");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setDeleteConfirm(false);
    setError("");
  }

  async function handleSave() {
    setError("");
    if (!form.name.trim()) { setError("Template name is required"); return; }
    if (form.seatLimit <= 0) { setError("Seat limit must be greater than 0"); return; }
    if (form.duration <= 0) { setError("Duration must be greater than 0"); return; }
    setSubmitting(true);
    try {
      if (editTarget) {
        await updateClassTemplate(editTarget.id, {
          name: form.name,
          price: Number(form.price),
          seatLimit: Number(form.seatLimit),
          duration: Number(form.duration),
          defaultCategory: form.defaultCategory,
          defaultLocation: form.defaultLocation,
        });
      } else {
        const data: ClassTemplate = {
          name: form.name,
          price: Number(form.price),
          seatLimit: Number(form.seatLimit),
          duration: Number(form.duration),
          defaultCategory: form.defaultCategory,
          defaultLocation: form.defaultLocation,
          createdAt: Date.now(),
          createdBy: currentUser?.uid ?? "unknown",
        };
        await createClassTemplate(data);
      }
      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save template");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!editTarget) return;
    setSubmitting(true);
    try {
      await deleteClassTemplate(editTarget.id);
      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete template");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAddTag(type: "categories" | "locations", value: string) {
    const trimmed = value.trim();
    if (!trimmed) return;
    await addTaxonomyTag(type, trimmed);
    if (type === "categories") setNewCategoryInput("");
    else setNewLocationInput("");
    setAddingTag(null);
  }

  if (loading) {
    return (
      <div className="p-[32px] font-sans flex items-center justify-center min-h-[300px]">
        <div className="text-[rgba(245,237,214,0.3)] text-[14px]">Loading…</div>
      </div>
    );
  }

  return (
    <div className="p-[32px] font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-[24px]">
        <div>
          <h1 className="font-display text-[28px] font-bold text-[var(--color-cream)]">Class Templates</h1>
          <p className="text-[13px] text-[rgba(245,237,214,0.45)] mt-[4px]">Reusable presets and global tags for faster class creation.</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-[var(--color-gold)] text-[var(--color-dark-bg)] font-sans font-semibold text-[13px] px-[18px] py-[9px] rounded-[6px] hover:brightness-110 transition"
        >
          + Add Template
        </button>
      </div>

      {/* Templates table */}
      <div className="bg-[var(--color-dark-surface)] rounded-[8px] overflow-hidden mb-[32px]">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-[rgba(245,237,214,0.07)]">
              {["Template Name", "Price", "Seats", "Duration", "Category", "Location", ""].map((h) => (
                <th key={h} className="text-left px-[16px] py-[12px] text-[10px] uppercase tracking-wider text-[rgba(245,237,214,0.3)] font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {templates.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-[16px] py-[32px] text-center text-[rgba(245,237,214,0.3)] text-[13px]">
                  No templates yet. Create one to speed up class creation.
                </td>
              </tr>
            ) : templates.map((t, i) => (
              <tr key={t.id} className={i < templates.length - 1 ? "border-b border-[rgba(245,237,214,0.05)]" : ""}>
                <td className="px-[16px] py-[13px] text-[var(--color-cream)] font-medium">{t.name}</td>
                <td className="px-[16px] py-[13px] text-[rgba(245,237,214,0.6)]">${t.price}</td>
                <td className="px-[16px] py-[13px] text-[rgba(245,237,214,0.6)]">{t.seatLimit}</td>
                <td className="px-[16px] py-[13px] text-[rgba(245,237,214,0.6)]">{fmtDuration(t.duration)}</td>
                <td className="px-[16px] py-[13px] text-[rgba(245,237,214,0.6)]">
                  {t.defaultCategory || <span className="text-[rgba(245,237,214,0.2)] italic">—</span>}
                </td>
                <td className="px-[16px] py-[13px] text-[rgba(245,237,214,0.6)]">
                  {t.defaultLocation || <span className="text-[rgba(245,237,214,0.2)] italic">—</span>}
                </td>
                <td className="px-[16px] py-[13px]">
                  <button onClick={() => openEdit(t)} className="text-[var(--color-gold)] text-[12px] font-medium hover:underline">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tags section */}
      <div className="grid grid-cols-2 gap-[24px]">
        {/* Categories */}
        <div className="bg-[var(--color-dark-surface)] rounded-[8px] p-[20px]">
          <div className="flex items-center justify-between mb-[16px]">
            <h2 className="font-display text-[16px] font-bold text-[var(--color-cream)]">Categories</h2>
            <button
              onClick={() => setAddingTag(addingTag === "category" ? null : "category")}
              className="text-[11px] text-[var(--color-gold)] hover:underline"
            >
              + Add
            </button>
          </div>
          {addingTag === "category" && (
            <div className="flex gap-[8px] mb-[12px]">
              <input
                type="text"
                value={newCategoryInput}
                onChange={(e) => setNewCategoryInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleAddTag("categories", newCategoryInput); if (e.key === "Escape") setAddingTag(null); }}
                placeholder="Category name…"
                autoFocus
                className="flex-1 bg-[var(--color-dark-bg)] border border-[rgba(245,237,214,0.1)] rounded-[6px] px-[10px] py-[7px] text-[12px] text-[var(--color-cream)] placeholder-[rgba(245,237,214,0.3)] focus:outline-none focus:border-[var(--color-gold)]"
              />
              <button
                onClick={() => handleAddTag("categories", newCategoryInput)}
                className="bg-[var(--color-gold)] text-[var(--color-dark-bg)] font-semibold text-[12px] px-[12px] py-[7px] rounded-[6px] hover:brightness-110 transition"
              >
                Add
              </button>
            </div>
          )}
          <div className="flex flex-wrap gap-[8px]">
            {categories.length === 0 ? (
              <p className="text-[12px] text-[rgba(245,237,214,0.25)] italic">No categories yet.</p>
            ) : categories.map((tag) => (
              <span key={tag.id} className="flex items-center gap-[6px] px-[10px] py-[4px] rounded-full bg-[rgba(245,237,214,0.06)] border border-[rgba(245,237,214,0.1)] text-[12px] text-[rgba(245,237,214,0.7)]">
                {tag.value}
                <button
                  onClick={() => deleteTaxonomyTag("categories", tag.id)}
                  className="text-[rgba(245,237,214,0.3)] hover:text-[#F87171] transition leading-none"
                  aria-label={`Remove ${tag.value}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Locations */}
        <div className="bg-[var(--color-dark-surface)] rounded-[8px] p-[20px]">
          <div className="flex items-center justify-between mb-[16px]">
            <h2 className="font-display text-[16px] font-bold text-[var(--color-cream)]">Locations</h2>
            <button
              onClick={() => setAddingTag(addingTag === "location" ? null : "location")}
              className="text-[11px] text-[var(--color-gold)] hover:underline"
            >
              + Add
            </button>
          </div>
          {addingTag === "location" && (
            <div className="flex gap-[8px] mb-[12px]">
              <div className="flex-1">
                <PlacesAutocompleteInput
                  value={newLocationInput}
                  onChange={setNewLocationInput}
                  placeholder="Search for a location…"
                  className="w-full bg-[var(--color-dark-bg)] border border-[rgba(245,237,214,0.1)] rounded-[6px] px-[10px] py-[7px] text-[12px] text-[var(--color-cream)] placeholder-[rgba(245,237,214,0.3)] focus:outline-none focus:border-[var(--color-gold)]"
                />
              </div>
              <button
                onClick={() => handleAddTag("locations", newLocationInput)}
                className="bg-[var(--color-gold)] text-[var(--color-dark-bg)] font-semibold text-[12px] px-[12px] py-[7px] rounded-[6px] hover:brightness-110 transition"
              >
                Add
              </button>
            </div>
          )}
          <div className="flex flex-wrap gap-[8px]">
            {locations.length === 0 ? (
              <p className="text-[12px] text-[rgba(245,237,214,0.25)] italic">No locations yet.</p>
            ) : locations.map((tag) => (
              <span key={tag.id} className="flex items-center gap-[6px] px-[10px] py-[4px] rounded-full bg-[rgba(245,237,214,0.06)] border border-[rgba(245,237,214,0.1)] text-[12px] text-[rgba(245,237,214,0.7)]">
                {tag.value}
                <button
                  onClick={() => deleteTaxonomyTag("locations", tag.id)}
                  className="text-[rgba(245,237,214,0.3)] hover:text-[#F87171] transition leading-none"
                  aria-label={`Remove ${tag.value}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-[16px]"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="bg-[var(--color-dark-surface)] rounded-[12px] w-full max-w-[480px] max-h-[calc(90vh-110px)] overflow-y-auto">
            <div className="flex items-center justify-between px-[24px] py-[20px] border-b border-[rgba(245,237,214,0.08)]">
              <h2 className="font-display text-[20px] font-bold text-[var(--color-cream)]">
                {editTarget ? "Edit Template" : "Add Template"}
              </h2>
              <button onClick={closeModal} className="text-[rgba(245,237,214,0.4)] hover:text-[var(--color-cream)] text-[20px] leading-none">&times;</button>
            </div>
            <div className="px-[24px] py-[20px] flex flex-col gap-[14px]">
              {error && (
                <div className="px-[12px] py-[10px] rounded-[6px] bg-[rgba(220,38,38,0.1)] border border-[rgba(220,38,38,0.2)] text-[#F87171] text-[12px]">
                  {error}
                </div>
              )}
              <div>
                <label className="block font-sans text-[11px] uppercase tracking-wider text-[rgba(245,237,214,0.4)] mb-[6px]">NAME</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-[var(--color-dark-bg)] border border-[rgba(245,237,214,0.1)] rounded-[6px] px-[12px] py-[9px] text-[13px] text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-gold)]"
                />
              </div>
              <div className="grid grid-cols-2 gap-[12px]">
                <div>
                  <label className="block font-sans text-[11px] uppercase tracking-wider text-[rgba(245,237,214,0.4)] mb-[6px]">PRICE ($)</label>
                  <input
                    type="number"
                    min={0}
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full bg-[var(--color-dark-bg)] border border-[rgba(245,237,214,0.1)] rounded-[6px] px-[12px] py-[9px] text-[13px] text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-gold)]"
                  />
                </div>
                <div>
                  <label className="block font-sans text-[11px] uppercase tracking-wider text-[rgba(245,237,214,0.4)] mb-[6px]">SEATS</label>
                  <input
                    type="number"
                    min={1}
                    value={form.seatLimit}
                    onChange={(e) => setForm({ ...form, seatLimit: Number(e.target.value) })}
                    className="w-full bg-[var(--color-dark-bg)] border border-[rgba(245,237,214,0.1)] rounded-[6px] px-[12px] py-[9px] text-[13px] text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-gold)]"
                  />
                </div>
              </div>
              <div>
                <label className="block font-sans text-[11px] uppercase tracking-wider text-[rgba(245,237,214,0.4)] mb-[6px]">DURATION (minutes)</label>
                <input
                  type="number"
                  min={1}
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
                  className="w-full bg-[var(--color-dark-bg)] border border-[rgba(245,237,214,0.1)] rounded-[6px] px-[12px] py-[9px] text-[13px] text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-gold)]"
                />
              </div>
              <div>
                <label className="block font-sans text-[11px] uppercase tracking-wider text-[rgba(245,237,214,0.4)] mb-[6px]">DEFAULT CATEGORY</label>
                <select
                  value={form.defaultCategory}
                  onChange={(e) => setForm({ ...form, defaultCategory: e.target.value })}
                  className="w-full bg-[var(--color-dark-bg)] border border-[rgba(245,237,214,0.1)] rounded-[6px] px-[12px] py-[9px] text-[13px] text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-gold)]"
                >
                  <option value="">— None —</option>
                  {categories.map((tag) => (
                    <option key={tag.id} value={tag.value}>{tag.value}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-sans text-[11px] uppercase tracking-wider text-[rgba(245,237,214,0.4)] mb-[6px]">DEFAULT LOCATION</label>
                <PlacesAutocompleteInput
                  value={form.defaultLocation}
                  onChange={(val) => setForm({ ...form, defaultLocation: val })}
                  placeholder="Search for a location…"
                />
              </div>
            </div>
            <div className="px-[24px] pb-[24px] flex items-center justify-between gap-[10px]">
              {editTarget ? (
                <div className="flex items-center gap-[10px]">
                  {!deleteConfirm ? (
                    <button
                      onClick={() => setDeleteConfirm(true)}
                      disabled={submitting}
                      className="text-[12px] text-[#F87171] border border-[rgba(220,38,38,0.3)] px-[14px] py-[8px] rounded-[6px] hover:bg-[rgba(220,38,38,0.1)] transition disabled:opacity-50"
                    >
                      Delete
                    </button>
                  ) : (
                    <div className="flex items-center gap-[10px]">
                      <span className="text-[12px] text-[rgba(245,237,214,0.5)]">Sure?</span>
                      <button onClick={handleDelete} disabled={submitting} className="text-[12px] text-[#F87171] font-semibold hover:underline disabled:opacity-50">
                        {submitting ? "Deleting…" : "Yes, Delete"}
                      </button>
                      <button onClick={() => setDeleteConfirm(false)} disabled={submitting} className="text-[12px] text-[rgba(245,237,214,0.4)] hover:text-[var(--color-cream)] transition">
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              ) : <div />}
              <div className="flex gap-[10px]">
                <button onClick={closeModal} disabled={submitting} className="text-[13px] text-[rgba(245,237,214,0.5)] hover:text-[var(--color-cream)] px-[16px] py-[9px] transition disabled:opacity-50">
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={submitting}
                  className="bg-[var(--color-gold)] text-[var(--color-dark-bg)] font-semibold text-[13px] px-[20px] py-[9px] rounded-[6px] hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Saving…" : editTarget ? "Save Changes" : "Add Template"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
