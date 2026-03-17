"use client";

import { useState } from "react";
import { useDiscounts } from "../../../../hooks/useDiscounts";
import { useAdminData } from "../../../../hooks/useAdminData";
import type { DiscountWithId } from "../../../../types/discount";

type DiscountStatus = "Active" | "Archived";

interface Discount {
  id: string;
  title: string;
  description: string;
  sponsor: string;
  estimatedValue: string;
  expiry: string;
  classes: string[] | "all";
  status: DiscountStatus;
}

function fmtExpiry(ts: number) {
  return new Date(ts).toISOString().slice(0, 10);
}
function fmtValue(cents: number) {
  return `$${Math.round(cents / 100)}`;
}
function mapDiscount(d: DiscountWithId, sponsorName: string, classNames: Map<string, string>): Discount {
  return {
    id: d.id,
    title: d.title,
    description: d.description,
    sponsor: sponsorName,
    estimatedValue: fmtValue(d.estimatedValue),
    expiry: fmtExpiry(d.expiresAt),
    classes: d.appliesToAll ? "all" : d.appliesToClasses.map((cid) => classNames.get(cid) ?? cid),
    status: d.status === "active" ? "Active" : "Archived",
  };
}

type Filter = "Active" | "Archived";

const EMPTY_FORM: Omit<Discount, "id" | "status"> = {
  title: "", description: "", sponsor: "", estimatedValue: "", expiry: "", classes: "all",
};

export default function AdminDiscounts() {
  const { discounts: rawDiscounts } = useDiscounts();
  const { classes, users, loading } = useAdminData();
  const [filter, setFilter] = useState<Filter>("Active");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Discount | null>(null);
  const [form, setForm] = useState<Omit<Discount, "id" | "status">>(EMPTY_FORM);
  const [classMode, setClassMode] = useState<"all" | "specific">("all");
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<Discount | null>(null);

  const sponsorUsers = users.filter((u) => u.role === "sponsor");
  const sponsorNames = sponsorUsers.map((u) => u.name);
  const sponsorByName = Object.fromEntries(sponsorUsers.map((u) => [u.name, u]));
  const sponsorById = Object.fromEntries(sponsorUsers.map((u) => [u.uid, u]));
  const classNameMap = new Map(classes.map((c) => [c.id, c.name]));
  const classNames = classes.filter((c) => c.status !== "deleted").map((c) => c.name);

  const liveDiscounts: Discount[] = rawDiscounts.map((d) => {
    const sponsor = sponsorById[d.sponsorId];
    return mapDiscount(d, sponsor?.name ?? d.sponsorId, classNameMap);
  });

  const filtered = liveDiscounts.filter((d) => d.status === filter);

  function openAdd() {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setClassMode("all");
    setSelectedClasses([]);
    setModalOpen(true);
  }

  function openEdit(d: Discount) {
    setEditTarget(d);
    const { id: _id, status: _s, ...rest } = d;
    setForm(rest);
    setClassMode(d.classes === "all" ? "all" : "specific");
    setSelectedClasses(d.classes === "all" ? [] : d.classes);
    setModalOpen(true);
  }

  function toggleClass(cls: string) {
    setSelectedClasses((prev) =>
      prev.includes(cls) ? prev.filter((c) => c !== cls) : [...prev, cls]
    );
  }

  function handleDelete(d: Discount) {
    setModalOpen(false);
    setDeleteConfirm(d);
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
          <h1 className="font-display text-[28px] font-bold text-[var(--color-cream)]">Discounts</h1>
          <p className="text-[13px] text-[rgba(245,237,214,0.45)] mt-[4px]">Sponsor-linked discount offers for students.</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-[var(--color-gold)] text-[var(--color-dark-bg)] font-sans font-semibold text-[13px] px-[18px] py-[9px] rounded-[6px] hover:brightness-110 transition"
        >
          + Add Discount
        </button>
      </div>

      {/* Filter chips */}
      <div className="flex items-center gap-[10px] mb-[20px]">
        {(["Active", "Archived"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-[14px] py-[6px] rounded-full font-sans text-[12px] font-medium transition ${filter === f ? "bg-[var(--color-gold)] text-[var(--color-dark-bg)]" : "bg-[var(--color-dark-surface)] text-[rgba(245,237,214,0.5)] hover:text-[rgba(245,237,214,0.8)]"}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Discount list */}
      <div className="flex flex-col gap-[10px]">
        {filtered.length === 0 ? (
          <p className="text-[13px] text-[rgba(245,237,214,0.3)] py-[32px] text-center">No {filter.toLowerCase()} discounts.</p>
        ) : filtered.map((d) => (
          <div
            key={d.id}
            className={`rounded-[8px] px-[20px] py-[16px] flex items-center gap-[16px] ${
              d.status === "Active"
                ? "bg-[var(--color-dark-surface)] border-l-[3px] border-[var(--color-gold)]"
                : "bg-[var(--color-dark-surface)] border-l-[3px] border-[rgba(245,237,214,0.1)] opacity-60"
            }`}
          >
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-[var(--color-cream)]">{d.title}</p>
              <p className="text-[12px] text-[rgba(245,237,214,0.45)] mt-[2px]">{d.sponsor} · Est. value: {d.estimatedValue} · Expires: {d.expiry}</p>
              <p className="text-[11px] text-[rgba(245,237,214,0.35)] mt-[2px]">
                {d.classes === "all" ? "All classes" : `${(d.classes as string[]).join(", ")}`}
              </p>
            </div>
            <button onClick={() => openEdit(d)} className="text-[12px] text-[var(--color-gold)] font-medium hover:underline flex-shrink-0">Edit</button>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-[16px]" onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}>
          <div className="bg-[var(--color-dark-surface)] rounded-[12px] w-full max-w-[500px] max-h-[calc(90vh-110px)] overflow-y-auto">
            <div className="flex items-center justify-between px-[24px] py-[20px] border-b border-[rgba(245,237,214,0.08)]">
              <h2 className="font-display text-[20px] font-bold text-[var(--color-cream)]">{editTarget ? "Edit Discount" : "Add Discount"}</h2>
              <button onClick={() => setModalOpen(false)} className="text-[rgba(245,237,214,0.4)] hover:text-[var(--color-cream)] text-[20px] leading-none">&times;</button>
            </div>
            <div className="px-[24px] py-[20px] space-y-[14px]">
              {/* Title */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[rgba(245,237,214,0.4)] mb-[6px]">Title</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-[var(--color-dark-bg)] border border-[rgba(245,237,214,0.1)] rounded-[6px] px-[12px] py-[9px] text-[13px] text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-gold)]" />
              </div>
              {/* Description */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[rgba(245,237,214,0.4)] mb-[6px]">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full bg-[var(--color-dark-bg)] border border-[rgba(245,237,214,0.1)] rounded-[6px] px-[12px] py-[9px] text-[13px] text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-gold)] resize-none" />
              </div>
              {/* Sponsor */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[rgba(245,237,214,0.4)] mb-[6px]">Linked Sponsor</label>
                <select value={form.sponsor} onChange={(e) => setForm({ ...form, sponsor: e.target.value })} className="w-full bg-[var(--color-dark-bg)] border border-[rgba(245,237,214,0.1)] rounded-[6px] px-[12px] py-[9px] text-[13px] text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-gold)]">
                  <option value="">Select sponsor…</option>
                  {sponsorNames.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              {/* Value + Expiry */}
              <div className="grid grid-cols-2 gap-[12px]">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[rgba(245,237,214,0.4)] mb-[6px]">Estimated Value</label>
                  <input type="text" value={form.estimatedValue} onChange={(e) => setForm({ ...form, estimatedValue: e.target.value })} placeholder="e.g. $30" className="w-full bg-[var(--color-dark-bg)] border border-[rgba(245,237,214,0.1)] rounded-[6px] px-[12px] py-[9px] text-[13px] text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-gold)]" />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[rgba(245,237,214,0.4)] mb-[6px]">Expiry Date</label>
                  <input type="date" value={form.expiry} onChange={(e) => setForm({ ...form, expiry: e.target.value })} className="w-full bg-[var(--color-dark-bg)] border border-[rgba(245,237,214,0.1)] rounded-[6px] px-[12px] py-[9px] text-[13px] text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-gold)]" />
                </div>
              </div>
              {/* Class assignment */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[rgba(245,237,214,0.4)] mb-[8px]">Available For</label>
                <div className="flex gap-[8px] mb-[10px]">
                  <button
                    onClick={() => { setClassMode("all"); setSelectedClasses([]); }}
                    className={`px-[12px] py-[6px] rounded-full text-[12px] font-medium transition ${classMode === "all" ? "bg-[var(--color-gold)] text-[var(--color-dark-bg)]" : "bg-[var(--color-dark-bg)] text-[rgba(245,237,214,0.5)]"}`}
                  >
                    All Classes
                  </button>
                  <button
                    onClick={() => setClassMode("specific")}
                    className={`px-[12px] py-[6px] rounded-full text-[12px] font-medium transition ${classMode === "specific" ? "bg-[var(--color-gold)] text-[var(--color-dark-bg)]" : "bg-[var(--color-dark-bg)] text-[rgba(245,237,214,0.5)]"}`}
                  >
                    Specific Classes
                  </button>
                </div>
                {classMode === "specific" && (
                  <div className="flex flex-wrap gap-[6px]">
                    {classNames.map((cls) => (
                      <button
                        key={cls}
                        onClick={() => toggleClass(cls)}
                        className={`px-[10px] py-[5px] rounded-full text-[11px] font-medium border transition ${selectedClasses.includes(cls) ? "bg-[rgba(201,168,76,0.15)] border-[var(--color-gold)] text-[var(--color-gold)]" : "bg-transparent border-[rgba(245,237,214,0.12)] text-[rgba(245,237,214,0.5)]"}`}
                      >
                        {cls}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="px-[24px] pb-[24px] flex items-center justify-between">
              <div>
                {editTarget && (
                  <button onClick={() => handleDelete(editTarget)} className="text-[12px] text-red-400 hover:text-red-300 transition">Delete</button>
                )}
              </div>
              <div className="flex gap-[10px]">
                <button onClick={() => setModalOpen(false)} className="text-[13px] text-[rgba(245,237,214,0.5)] hover:text-[var(--color-cream)] px-[16px] py-[9px] transition">Cancel</button>
                <button onClick={() => setModalOpen(false)} className="bg-[var(--color-gold)] text-[var(--color-dark-bg)] font-semibold text-[13px] px-[20px] py-[9px] rounded-[6px] hover:brightness-110 transition">
                  {editTarget ? "Save Changes" : "Add Discount"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-[16px]">
          <div className="bg-[var(--color-dark-surface)] rounded-[12px] w-full max-w-[420px] p-[28px]">
            <h2 className="font-display text-[20px] font-bold text-[var(--color-cream)] mb-[10px]">Delete Discount?</h2>
            <p className="text-[13px] text-[rgba(245,237,214,0.55)] mb-[6px]">&ldquo;{deleteConfirm.title}&rdquo;</p>
            <p className="text-[12px] text-[rgba(245,237,214,0.35)] mb-[24px]">This will permanently remove the discount. This action cannot be undone.</p>
            <div className="flex justify-end gap-[10px]">
              <button onClick={() => setDeleteConfirm(null)} className="text-[13px] text-[rgba(245,237,214,0.5)] hover:text-[var(--color-cream)] px-[16px] py-[9px] transition">Cancel</button>
              <button onClick={() => setDeleteConfirm(null)} className="bg-red-600 hover:bg-red-500 text-white font-semibold text-[13px] px-[20px] py-[9px] rounded-[6px] transition">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

