"use client";

import { useState } from "react";
import { useAdminData } from "../../../../hooks/useAdminData";
import { useClassTemplates } from "../../../../hooks/useClassTemplates";
import { useAuthContext } from "../../../../context/AuthContext";
import { createClass, updateClass, moveClassToArchived, unarchiveClass, deleteClass } from "../../../../lib/firebase/db";
import type { ClassWithId, Class } from "../../../../types/class";

type ClassStatus = "Upcoming" | "Full" | "Archived";

interface ClassItem {
  id: string;
  name: string;
  category: string;
  date: string;
  time: string;
  duration: string;
  price: number;
  seats: number;
  booked: number;
  location: string;
  description: string;
  sponsor: string;
  instructor: string;
  status: ClassStatus;
}

function fmtDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function fmtTime(ts: number) {
  return new Date(ts).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}
function fmtDuration(mins: number) {
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}
function classUIStatus(cls: ClassWithId): ClassStatus {
  if (cls.status === "archived") return "Archived";
  if (cls.seatsBooked >= cls.seatLimit) return "Full";
  return "Upcoming";
}

const EMPTY_FORM: Omit<ClassItem, "id" | "status"> = {
  name: "", category: "", date: "", time: "", duration: "", price: 0, seats: 0, booked: 0, location: "", description: "", sponsor: "", instructor: "",
};

type Filter = "All" | "Upcoming" | "Full" | "Archived";

export default function AdminClasses() {
  const { classes: rawClasses, users, loading } = useAdminData();
  const { templates, categories, locations } = useClassTemplates();
  const { user: currentUser } = useAuthContext();
  const [filter, setFilter] = useState<Filter>("All");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ClassItem | null>(null);
  const [form, setForm] = useState<Omit<ClassItem, "id" | "status">>(EMPTY_FORM);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const usersById = Object.fromEntries(users.map((u) => [u.uid, u]));
  const liveClasses: ClassItem[] = rawClasses
    .filter((c) => c.status !== "deleted")
    .map((c) => ({
      id: c.id,
      name: c.name,
      category: c.category,
      date: fmtDate(c.date),
      time: fmtTime(c.date),
      duration: fmtDuration(c.duration),
      price: c.price,
      seats: c.seatLimit,
      booked: c.seatsBooked,
      location: c.location,
      description: c.description,
      sponsor: c.sponsorId ? (usersById[c.sponsorId]?.name ?? "") : "",
      instructor: c.instructorId ? (usersById[c.instructorId]?.name ?? "") : "",
      status: classUIStatus(c),
    }))
    .sort((a, b) => {
      if (a.status === "Archived" && b.status !== "Archived") return 1;
      if (a.status !== "Archived" && b.status === "Archived") return -1;
      return 0;
    });

  const filtered = liveClasses.filter((c) => {
    if (filter !== "All" && c.status !== filter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  function applyTemplate(templateId: string) {
    const tpl = templates.find((t) => t.id === templateId);
    if (!tpl) return;
    setForm((prev) => ({
      ...prev,
      name: tpl.name,
      price: tpl.price,
      seats: tpl.seatLimit,
      duration: String(tpl.duration),
      ...(tpl.defaultCategory && { category: tpl.defaultCategory }),
      ...(tpl.defaultLocation && { location: tpl.defaultLocation }),
      ...(tpl.description && { description: tpl.description }),
    }));
  }

  function openAdd() {
    setEditTarget(null);
    setSelectedTemplateId("");
    setDeleteConfirm(false);
    setError("");
    setModalOpen(true);
  }

  function openEdit(cls: ClassItem) {
    setEditTarget(cls);
    const { id: _id, status: _status, ...rest } = cls;
    setForm(rest);
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
    
    // Validate required fields
    if (!form.name.trim()) {
      setError("Class name is required");
      return;
    }
    if (form.price < 0) {
      setError("Price cannot be negative");
      return;
    }
    if (form.seats <= 0) {
      setError("Seat limit must be greater than 0");
      return;
    }
    if (!form.date) {
      setError("Date is required");
      return;
    }
    
    setSubmitting(true);
    try {
      // Convert date + time strings to timestamp
      let dateTs = new Date(form.date).getTime();
      if (form.time) {
        const [hours, mins] = form.time.split(":").map(Number);
        const d = new Date(dateTs);
        d.setHours(hours, mins, 0, 0);
        dateTs = d.getTime();
      }
      
      if (editTarget) {
        // Update existing class
        const updatedSponsors = users.find((u) => u.name === form.sponsor);
        const instructor = users.find((u) => u.name === form.instructor);
        await updateClass(editTarget.id, {
          name: form.name,
          category: form.category,
          date: dateTs,
          duration: Number(form.duration),
          price: Number(form.price),
          seatLimit: Number(form.seats),
          location: form.location,
          description: form.description,
          sponsorId: updatedSponsors?.uid ?? null,
          instructorId: instructor?.uid ?? null,
        });
      } else {
        // Create new class
        const sponsor = users.find((u) => u.name === form.sponsor);
        const instructor = users.find((u) => u.name === form.instructor);
        const classData: Class = {
          name: form.name,
          category: form.category,
          date: dateTs,
          duration: Number(form.duration),
          price: Number(form.price),
          seatLimit: Number(form.seats),
          seatsBooked: 0,
          location: form.location,
          description: form.description,
          sponsorId: sponsor?.uid ?? null,
          instructorId: instructor?.uid ?? null,
          status: "upcoming",
          archivedAt: null,
          createdAt: Date.now(),
          createdBy: currentUser?.uid ?? "unknown",
        };
        await createClass(classData);
        setForm(EMPTY_FORM);
      }
      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save class");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleArchiveToggle() {
    if (!editTarget) return;
    
    setError("");
    setSubmitting(true);
    try {
      if (editTarget.status === "Archived") {
        await unarchiveClass(editTarget.id);
      } else {
        await moveClassToArchived(editTarget.id);
      }
      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update class status");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!editTarget) return;
    
    setError("");
    setSubmitting(true);
    try {
      await deleteClass(editTarget.id);
      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete class");
    } finally {
      setSubmitting(false);
    }
  }

  const hasBookings = editTarget ? editTarget.booked > 0 : false;

  const FILTERS: Filter[] = ["All", "Upcoming", "Full", "Archived"];

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
          <h1 className="font-display text-[28px] font-bold text-[var(--color-cream)]">Classes</h1>
          <p className="text-[13px] text-[rgba(245,237,214,0.45)] mt-[4px]">Manage your class schedule.</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-[var(--color-gold)] text-[var(--color-dark-bg)] font-sans font-semibold text-[13px] px-[18px] py-[9px] rounded-[6px] hover:brightness-110 transition"
        >
          + Add Class
        </button>
      </div>

      {/* Filters + Search */}
      <div className="flex items-center gap-[10px] mb-[20px] flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-[14px] py-[6px] rounded-full font-sans text-[12px] font-medium transition ${
              filter === f
                ? "bg-[var(--color-gold)] text-[var(--color-dark-bg)]"
                : "bg-[var(--color-dark-surface)] text-[rgba(245,237,214,0.5)] hover:text-[rgba(245,237,214,0.8)]"
            }`}
          >
            {f}
          </button>
        ))}
        <input
          type="text"
          placeholder="Search classes…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ml-auto bg-[var(--color-dark-surface)] border border-[rgba(245,237,214,0.1)] rounded-[6px] px-[12px] py-[7px] text-[13px] text-[var(--color-cream)] placeholder-[rgba(245,237,214,0.3)] focus:outline-none focus:border-[var(--color-gold)] w-[220px]"
        />
      </div>

      {/* Table */}
      <div className="bg-[var(--color-dark-surface)] rounded-[8px] overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-[rgba(245,237,214,0.07)]">
              {["Class", "Category", "Date & Time", "Seats", "Price", "Status", ""].map((h) => (
                <th key={h} className="text-left px-[16px] py-[12px] text-[10px] uppercase tracking-wider text-[rgba(245,237,214,0.3)] font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-[16px] py-[32px] text-center text-[rgba(245,237,214,0.3)] text-[13px]">No classes found.</td>
              </tr>
            ) : filtered.map((cls, i) => (
              <tr key={cls.id} className={`${i < filtered.length - 1 ? "border-b border-[rgba(245,237,214,0.05)]" : ""} ${cls.status === "Archived" ? "opacity-50" : ""}`}>
                <td className="px-[16px] py-[13px]">
                  <p className="text-[var(--color-cream)] font-medium">{cls.name}</p>
                  <p className="text-[11px] text-[rgba(245,237,214,0.35)] mt-[2px]">{cls.location}{cls.sponsor ? ` · ${cls.sponsor}` : ""}</p>
                </td>
                <td className="px-[16px] py-[13px] text-[rgba(245,237,214,0.6)]">{cls.category}</td>
                <td className="px-[16px] py-[13px] text-[rgba(245,237,214,0.6)]">{cls.date} · {cls.time}</td>
                <td className="px-[16px] py-[13px] text-[rgba(245,237,214,0.6)]">{cls.booked}/{cls.seats}</td>
                <td className="px-[16px] py-[13px] text-[rgba(245,237,214,0.6)]">${cls.price}</td>
                <td className="px-[16px] py-[13px]">
                  {cls.status === "Upcoming" && <span className="px-[7px] py-[2px] rounded-full bg-[rgba(122,174,173,0.15)] text-[var(--color-teal)] text-[10px] font-semibold">Upcoming</span>}
                  {cls.status === "Full" && <span className="px-[7px] py-[2px] rounded-full bg-[rgba(220,38,38,0.15)] text-[#F87171] text-[10px] font-semibold">Full</span>}
                  {cls.status === "Archived" && <span className="px-[7px] py-[2px] rounded-full bg-[rgba(245,237,214,0.08)] text-[rgba(245,237,214,0.4)] text-[10px] font-semibold">Archived</span>}
                </td>
                <td className="px-[16px] py-[13px]">
                  <button onClick={() => openEdit(cls)} className="text-[var(--color-gold)] text-[12px] font-medium hover:underline">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-[16px]" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="bg-[var(--color-dark-surface)] rounded-[12px] w-full max-w-[520px] max-h-[calc(90vh-110px)] overflow-y-auto">
            <div className="flex items-center justify-between px-[24px] py-[20px] border-b border-[rgba(245,237,214,0.08)]">
              <h2 className="font-display text-[20px] font-bold text-[var(--color-cream)]">{editTarget ? "Edit Class" : "Add Class"}</h2>
              <button onClick={closeModal} className="text-[rgba(245,237,214,0.4)] hover:text-[var(--color-cream)] text-[20px] leading-none">&times;</button>
            </div>
            <div className="px-[24px] py-[20px] flex flex-col gap-[14px]">
              {error && (
                <div className="px-[12px] py-[10px] rounded-[6px] bg-[rgba(220,38,38,0.1)] border border-[rgba(220,38,38,0.2)] text-[#F87171] text-[12px]">
                  {error}
                </div>
              )}
              {!editTarget && templates.length > 0 && (
                <div className="pb-[4px] border-b border-[rgba(245,237,214,0.07)]">
                  <label className="block font-sans text-[11px] uppercase tracking-wider text-[rgba(245,237,214,0.4)] mb-[6px]">USE A TEMPLATE</label>
                  <select
                    value={selectedTemplateId}
                    onChange={(e) => {
                      setSelectedTemplateId(e.target.value);
                      if (e.target.value) applyTemplate(e.target.value);
                    }}
                    className="w-full bg-[var(--color-dark-bg)] border border-[rgba(245,237,214,0.1)] rounded-[6px] px-[12px] py-[9px] text-[13px] text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-gold)]"
                  >
                    <option value="">— Select a template —</option>
                    {templates.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                  {selectedTemplateId && (
                    <p className="text-[11px] text-[rgba(245,237,214,0.3)] mt-[5px]">Fields pre-filled — edit as needed.</p>
                  )}
                </div>
              )}
              {(["name", "category", "date", "time", "duration", "description"] as const).map((field) => (
                <div key={field}>
                  <label className="block font-sans text-[11px] uppercase tracking-wider text-[rgba(245,237,214,0.4)] mb-[6px] capitalize">{field}</label>
                  {field === "description" ? (
                    <textarea
                      value={(form as Record<string, string | number>)[field] as string}
                      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      className="w-full bg-[var(--color-dark-bg)] border border-[rgba(245,237,214,0.1)] rounded-[6px] px-[12px] py-[9px] text-[13px] text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-gold)] min-h-[80px]"
                    />
                  ) : (
                    <>
                      <input
                        type={field === "date" ? "date" : field === "time" ? "time" : field === "duration" ? "number" : "text"}
                        value={(form as Record<string, string | number>)[field] as string}
                        onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                        list={field === "category" ? "cls-cat-list" : undefined}
                        className="w-full bg-[var(--color-dark-bg)] border border-[rgba(245,237,214,0.1)] rounded-[6px] px-[12px] py-[9px] text-[13px] text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-gold)]"
                      />
                      {field === "category" && (
                        <datalist id="cls-cat-list">
                          {categories.map((tag) => <option key={tag.id} value={tag.value} />)}
                        </datalist>
                      )}
                    </>
                  )}
                </div>
              ))}
              <div>
                <label className="block font-sans text-[11px] uppercase tracking-wider text-[rgba(245,237,214,0.4)] mb-[6px] capitalize">location</label>
                <select
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full bg-[var(--color-dark-bg)] border border-[rgba(245,237,214,0.1)] rounded-[6px] px-[12px] py-[9px] text-[13px] text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-gold)]"
                >
                  <option value="">— Select a location —</option>
                  {locations.map((tag) => (
                    <option key={tag.id} value={tag.value}>{tag.value}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-sans text-[11px] uppercase tracking-wider text-[rgba(245,237,214,0.4)] mb-[6px]">SPONSOR</label>
                <select
                  value={form.sponsor}
                  onChange={(e) => setForm({ ...form, sponsor: e.target.value })}
                  className="w-full bg-[var(--color-dark-bg)] border border-[rgba(245,237,214,0.1)] rounded-[6px] px-[12px] py-[9px] text-[13px] text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-gold)]"
                >
                  <option value="">— None —</option>
                  {users.filter((u) => u.role === "sponsor").map((u) => (
                    <option key={u.uid} value={u.name}>{u.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-sans text-[11px] uppercase tracking-wider text-[rgba(245,237,214,0.4)] mb-[6px]">INSTRUCTOR</label>
                <select
                  value={form.instructor}
                  onChange={(e) => setForm({ ...form, instructor: e.target.value })}
                  className="w-full bg-[var(--color-dark-bg)] border border-[rgba(245,237,214,0.1)] rounded-[6px] px-[12px] py-[9px] text-[13px] text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-gold)]"
                >
                  <option value="">— None —</option>
                  {users.filter((u) => u.role === "staff").map((u) => (
                    <option key={u.uid} value={u.name}>{u.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-[12px]">
                {(["price", "seats"] as const).map((field) => (
                  <div key={field}>
                    <label className="block font-sans text-[11px] uppercase tracking-wider text-[rgba(245,237,214,0.4)] mb-[6px] capitalize">{field}</label>
                    <input
                      type="number"
                      value={form[field]}
                      onChange={(e) => setForm({ ...form, [field]: Number(e.target.value) })}
                      className="w-full bg-[var(--color-dark-bg)] border border-[rgba(245,237,214,0.1)] rounded-[6px] px-[12px] py-[9px] text-[13px] text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-gold)]"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="px-[24px] pb-[24px] flex items-center justify-between gap-[10px]">
              {editTarget && (
                <div className="flex gap-[10px]">
                  <button
                    onClick={handleArchiveToggle}
                    disabled={submitting}
                    className="text-[12px] text-[rgba(245,237,214,0.4)] hover:text-[var(--color-cream)] border border-[rgba(245,237,214,0.12)] px-[14px] py-[8px] rounded-[6px] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {editTarget.status === "Archived" ? "Unarchive" : "Archive"}
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(true)}
                    disabled={hasBookings || submitting}
                    className={`text-[12px] px-[14px] py-[8px] rounded-[6px] border transition ${
                      hasBookings || submitting
                        ? "text-[rgba(245,237,214,0.2)] border-[rgba(245,237,214,0.05)] cursor-not-allowed"
                        : "text-[#F87171] border-[rgba(220,38,38,0.3)] hover:bg-[rgba(220,38,38,0.1)]"
                    }`}
                    title={hasBookings ? "Cannot delete a class with existing bookings" : "Delete class"}
                  >
                    Delete
                  </button>
                </div>
              )}
              {!editTarget && <div />}
              <div className="flex gap-[10px]">
                <button onClick={closeModal} disabled={submitting} className="text-[13px] text-[rgba(245,237,214,0.5)] hover:text-[var(--color-cream)] px-[16px] py-[9px] transition disabled:opacity-50">
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={submitting}
                  className="bg-[var(--color-gold)] text-[var(--color-dark-bg)] font-semibold text-[13px] px-[20px] py-[9px] rounded-[6px] hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Saving…" : editTarget ? "Save Changes" : "Add Class"}
                </button>
              </div>
            </div>

            {/* Delete confirmation inline */}
            {deleteConfirm && (
              <div className="mx-[24px] mb-[24px] p-[16px] rounded-[8px] bg-[rgba(220,38,38,0.08)] border border-[rgba(220,38,38,0.2)]">
                <p className="text-[13px] text-[var(--color-cream)] mb-[12px]">Permanently delete this class? This cannot be undone.</p>
                <div className="flex gap-[10px]">
                  <button onClick={() => setDeleteConfirm(false)} disabled={submitting} className="text-[12px] text-[rgba(245,237,214,0.5)] hover:text-[var(--color-cream)] transition disabled:opacity-50">Cancel</button>
                  <button onClick={handleDelete} disabled={submitting} className="text-[12px] text-[#F87171] font-semibold hover:underline disabled:opacity-50">
                    {submitting ? "Deleting…" : "Yes, Delete"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

