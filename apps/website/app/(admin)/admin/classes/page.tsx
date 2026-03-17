"use client";

import { useState } from "react";

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
  sponsor: string;
  status: ClassStatus;
}

const MOCK_CLASSES: ClassItem[] = [
  { id: "CLS-001", name: "Intro to Watercolour", category: "Arts & Crafts", date: "2025-06-29", time: "10:00 AM", duration: "2h", price: 35, seats: 8, booked: 6, location: "Room A", sponsor: "Sunrise Pharmacy", status: "Upcoming" },
  { id: "CLS-002", name: "Memoir Writing", category: "Writing", date: "2025-07-03", time: "2:00 PM", duration: "1.5h", price: 25, seats: 12, booked: 5, location: "Room B", sponsor: "", status: "Upcoming" },
  { id: "CLS-003", name: "Gentle Yoga & Mindfulness", category: "Wellness", date: "2025-07-05", time: "9:30 AM", duration: "1h", price: 20, seats: 10, booked: 10, location: "Studio", sponsor: "Valley Health Co-op", status: "Full" },
  { id: "CLS-004", name: "iPad Basics for Beginners", category: "Technology", date: "2025-07-08", time: "11:00 AM", duration: "2h", price: 30, seats: 8, booked: 2, location: "Computer Lab", sponsor: "", status: "Upcoming" },
  { id: "CLS-005", name: "Knitting Circle", category: "Arts & Crafts", date: "2025-05-10", time: "1:00 PM", duration: "2h", price: 15, seats: 10, booked: 8, location: "Room A", sponsor: "", status: "Archived" },
];

const EMPTY_FORM: Omit<ClassItem, "id" | "status"> = {
  name: "", category: "", date: "", time: "", duration: "", price: 0, seats: 0, booked: 0, location: "", sponsor: "",
};

type Filter = "All" | "Upcoming" | "Full" | "Archived";

export default function AdminClasses() {
  const [filter, setFilter] = useState<Filter>("All");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ClassItem | null>(null);
  const [form, setForm] = useState<Omit<ClassItem, "id" | "status">>(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const filtered = MOCK_CLASSES.filter((c) => {
    if (filter !== "All" && c.status !== filter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  function openAdd() {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setDeleteConfirm(false);
    setModalOpen(true);
  }

  function openEdit(cls: ClassItem) {
    setEditTarget(cls);
    const { id: _id, status: _status, ...rest } = cls;
    setForm(rest);
    setDeleteConfirm(false);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setDeleteConfirm(false);
  }

  const hasBookings = editTarget ? editTarget.booked > 0 : false;

  const FILTERS: Filter[] = ["All", "Upcoming", "Full", "Archived"];

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
              {(["name", "category", "date", "time", "duration", "location", "sponsor"] as const).map((field) => (
                <div key={field}>
                  <label className="block font-sans text-[11px] uppercase tracking-wider text-[rgba(245,237,214,0.4)] mb-[6px] capitalize">{field}</label>
                  <input
                    type={field === "date" ? "date" : "text"}
                    value={(form as Record<string, string | number>)[field] as string}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    className="w-full bg-[var(--color-dark-bg)] border border-[rgba(245,237,214,0.1)] rounded-[6px] px-[12px] py-[9px] text-[13px] text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-gold)]"
                  />
                </div>
              ))}
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
                    onClick={() => {}}
                    className="text-[12px] text-[rgba(245,237,214,0.4)] hover:text-[var(--color-cream)] border border-[rgba(245,237,214,0.12)] px-[14px] py-[8px] rounded-[6px] transition"
                  >
                    {editTarget.status === "Archived" ? "Unarchive" : "Archive"}
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(true)}
                    disabled={hasBookings}
                    className={`text-[12px] px-[14px] py-[8px] rounded-[6px] border transition ${
                      hasBookings
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
                <button onClick={closeModal} className="text-[13px] text-[rgba(245,237,214,0.5)] hover:text-[var(--color-cream)] px-[16px] py-[9px] transition">
                  Cancel
                </button>
                <button
                  onClick={closeModal}
                  className="bg-[var(--color-gold)] text-[var(--color-dark-bg)] font-semibold text-[13px] px-[20px] py-[9px] rounded-[6px] hover:brightness-110 transition"
                >
                  {editTarget ? "Save Changes" : "Add Class"}
                </button>
              </div>
            </div>

            {/* Delete confirmation inline */}
            {deleteConfirm && (
              <div className="mx-[24px] mb-[24px] p-[16px] rounded-[8px] bg-[rgba(220,38,38,0.08)] border border-[rgba(220,38,38,0.2)]">
                <p className="text-[13px] text-[var(--color-cream)] mb-[12px]">Permanently delete this class? This cannot be undone.</p>
                <div className="flex gap-[10px]">
                  <button onClick={() => setDeleteConfirm(false)} className="text-[12px] text-[rgba(245,237,214,0.5)] hover:text-[var(--color-cream)] transition">Cancel</button>
                  <button onClick={closeModal} className="text-[12px] text-[#F87171] font-semibold hover:underline">Yes, Delete</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

