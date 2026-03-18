"use client";

import { useState } from "react";
import { useAdminData } from "../../../../hooks/useAdminData";
import { updateUser } from "../../../../lib/firebase/db";

interface Customer {
  uid: string;
  name: string;
  email: string;
  phone: string;
  joined: string;
  lastActive: string;
  totalBookings: number;
  totalSpent: number;
  notes: string;
  isActive: boolean;
}

interface CustomerBooking {
  id: string;
  classname: string;
  date: string;
  status: string;
  amount: number;
}

function fmtMonthYear(ts: number) {
  return new Date(ts).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}
function fmtDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function isActive(lastLoginAt: number | null) {
  return lastLoginAt ? (Date.now() - lastLoginAt) < 45 * 24 * 60 * 60 * 1000 : false;
}

type ProfileTab = "details" | "bookings" | "payments" | "notes";

export default function AdminCustomers() {
  const { classes, bookings, users, loading } = useAdminData();
  const [showActive, setShowActive] = useState(false);
  const [search, setSearch] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [profileTab, setProfileTab] = useState<ProfileTab>("details");
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [editNotes, setEditNotes] = useState("");
  const [editingNotes, setEditingNotes] = useState(false);

  const classesById = Object.fromEntries(classes.map((c) => [c.id, c]));

  const liveCustomers: Customer[] = users
    .filter((u) => u.role === "customer")
    .map((u) => {
      const custBookings = bookings.filter((b) => b.customerId === u.uid);
      const totalSpent = custBookings.filter((b) => b.status === "paid").reduce((s, b) => s + b.amount, 0) / 100;
      return {
        uid: u.uid,
        name: u.name,
        email: u.email ?? "",
        phone: u.phone ?? "",
        joined: fmtMonthYear(u.createdAt),
        lastActive: u.lastLoginAt ? fmtDate(u.lastLoginAt) : "Never",
        totalBookings: custBookings.length,
        totalSpent: Math.round(totalSpent),
        notes: u.notes ?? "",
        isActive: isActive(u.lastLoginAt),
      };
    });

  const selectedBookings: CustomerBooking[] = selected
    ? bookings
        .filter((b) => b.customerId === selected.uid)
        .sort((a, b) => b.createdAt - a.createdAt)
        .map((b) => {
          const cls = classesById[b.classId];
          return {
            id: b.id,
            classname: cls?.name ?? "Unknown Class",
            date: new Date(b.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            status: b.status === "paid" ? "Paid" : "Reserved",
            amount: Math.round(b.amount / 100),
          };
        })
    : [];

  const filtered = liveCustomers.filter((c) => {
    if (showActive && !c.isActive) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  function openProfile(c: Customer) {
    setSelected(c);
    setProfileTab("details");
    setDeleteConfirm(false);
    setEditingNotes(false);
    setEditNotes(c.notes);
    setProfileOpen(true);
  }

  const hasPaidBookings = selected ? selectedBookings.some((b) => b.status === "Paid") : false;

  async function saveNotes() {
    if (!selected) return;
    await updateUser(selected.uid, { notes: editNotes });
    setEditingNotes(false);
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
          <h1 className="font-display text-[28px] font-bold text-[var(--color-cream)]">Customers</h1>
          <p className="text-[13px] text-[rgba(245,237,214,0.45)] mt-[4px]">{liveCustomers.length} registered customers.</p>
        </div>
      </div>

      {/* Filters + Search */}
      <div className="flex items-center gap-[10px] mb-[20px] flex-wrap">
        <button
          onClick={() => setShowActive(false)}
          className={`px-[14px] py-[6px] rounded-full font-sans text-[12px] font-medium transition ${!showActive ? "bg-[var(--color-gold)] text-[var(--color-dark-bg)]" : "bg-[var(--color-dark-surface)] text-[rgba(245,237,214,0.5)] hover:text-[rgba(245,237,214,0.8)]"}`}
        >
          All
        </button>
        <button
          onClick={() => setShowActive(true)}
          className={`px-[14px] py-[6px] rounded-full font-sans text-[12px] font-medium transition ${showActive ? "bg-[var(--color-gold)] text-[var(--color-dark-bg)]" : "bg-[var(--color-dark-surface)] text-[rgba(245,237,214,0.5)] hover:text-[rgba(245,237,214,0.8)]"}`}
        >
          Active (last 45 days)
        </button>
        <input
          type="text"
          placeholder="Search name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ml-auto bg-[var(--color-dark-surface)] border border-[rgba(245,237,214,0.1)] rounded-[6px] px-[12px] py-[7px] text-[13px] text-[var(--color-cream)] placeholder-[rgba(245,237,214,0.3)] focus:outline-none focus:border-[var(--color-gold)] w-[240px]"
        />
      </div>

      {/* Table */}
      <div className="bg-[var(--color-dark-surface)] rounded-[8px] overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-[rgba(245,237,214,0.07)]">
              {["Customer", "Contact", "Joined", "Last Active", "Bookings", "Spent", ""].map((h) => (
                <th key={h} className="text-left px-[16px] py-[12px] text-[10px] uppercase tracking-wider text-[rgba(245,237,214,0.3)] font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="px-[16px] py-[32px] text-center text-[rgba(245,237,214,0.3)] text-[13px]">No customers found.</td></tr>
            ) : filtered.map((c, i) => (
              <tr key={c.uid} className={`${i < filtered.length - 1 ? "border-b border-[rgba(245,237,214,0.05)]" : ""} ${!c.isActive ? "opacity-60" : ""}`}>
                <td className="px-[16px] py-[13px]">
                  <div className="flex items-center gap-[10px]">
                    <div className="w-[32px] h-[32px] rounded-full bg-[rgba(201,168,76,0.15)] flex items-center justify-center flex-shrink-0">
                      <span className="text-[var(--color-gold)] font-semibold text-[12px]">{c.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</span>
                    </div>
                    <div>
                      <p className="text-[var(--color-cream)] font-medium">{c.name}</p>
                      <p className="text-[11px] text-[rgba(245,237,214,0.35)]">{c.uid.slice(-8).toUpperCase()}</p>
                    </div>
                  </div>
                </td>
                <td className="px-[16px] py-[13px]">
                  <p className="text-[rgba(245,237,214,0.7)] text-[12px]">{c.email}</p>
                  <p className="text-[rgba(245,237,214,0.4)] text-[11px]">{c.phone}</p>
                </td>
                <td className="px-[16px] py-[13px] text-[rgba(245,237,214,0.6)]">{c.joined}</td>
                <td className="px-[16px] py-[13px] text-[rgba(245,237,214,0.6)]">{c.lastActive}</td>
                <td className="px-[16px] py-[13px] text-[rgba(245,237,214,0.6)]">{c.totalBookings}</td>
                <td className="px-[16px] py-[13px] text-[rgba(245,237,214,0.6)]">${c.totalSpent}</td>
                <td className="px-[16px] py-[13px]">
                  <button onClick={() => openProfile(c)} className="text-[var(--color-gold)] text-[12px] font-medium hover:underline">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Profile Modal */}
      {profileOpen && selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-[16px]" onClick={(e) => { if (e.target === e.currentTarget) setProfileOpen(false); }}>
          <div className="bg-[var(--color-dark-surface)] rounded-[12px] w-full max-w-[520px] max-h-[calc(90vh-110px)] overflow-y-auto">
            {/* Header */}
            <div className="px-[24px] py-[20px] border-b border-[rgba(245,237,214,0.08)] flex items-center justify-between">
              <div className="flex items-center gap-[14px]">
                <div className="w-[44px] h-[44px] rounded-full bg-[rgba(201,168,76,0.15)] flex items-center justify-center">
                  <span className="text-[var(--color-gold)] font-bold text-[16px]">{selected.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</span>
                </div>
                <div>
                  <p className="text-[16px] font-bold text-[var(--color-cream)]">{selected.name}</p>
                  <p className="text-[12px] text-[rgba(245,237,214,0.4)]">{selected.uid.slice(-8).toUpperCase()} · Joined {selected.joined}</p>
                </div>
              </div>
              <button onClick={() => setProfileOpen(false)} className="text-[rgba(245,237,214,0.4)] hover:text-[var(--color-cream)] text-[20px] leading-none">&times;</button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[rgba(245,237,214,0.08)]">
              {(["details", "bookings", "payments", "notes"] as ProfileTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setProfileTab(tab)}
                  className={`flex-1 py-[11px] text-[12px] font-semibold capitalize transition ${profileTab === tab ? "text-[var(--color-gold)] border-b-[2px] border-[var(--color-gold)]" : "text-[rgba(245,237,214,0.4)] hover:text-[rgba(245,237,214,0.7)]"}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="px-[24px] py-[20px]">
              {profileTab === "details" && (
                <div className="space-y-[12px]">
                  {[["Name", selected.name], ["Email", selected.email], ["Phone", selected.phone], ["Last Active", selected.lastActive]].map(([label, val]) => (
                    <div key={label} className="flex justify-between items-center py-[10px] border-b border-[rgba(245,237,214,0.06)]">
                      <span className="text-[11px] uppercase tracking-wider text-[rgba(245,237,214,0.35)]">{label}</span>
                      <span className="text-[13px] text-[var(--color-cream)]">{val}</span>
                    </div>
                  ))}
                </div>
              )}
              {profileTab === "bookings" && (
                <div className="space-y-[8px]">
                  {selectedBookings.map((b) => (
                    <div key={b.id} className="bg-[var(--color-dark-bg)] rounded-[8px] px-[14px] py-[11px] flex justify-between items-center">
                      <div>
                        <p className="text-[13px] text-[var(--color-cream)]">{b.classname}</p>
                        <p className="text-[11px] text-[rgba(245,237,214,0.4)] mt-[2px]">{b.date} · {b.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[13px] text-[rgba(245,237,214,0.7)]">${b.amount}</p>
                        <span className="text-[10px] font-semibold px-[6px] py-[1px] rounded-full bg-[rgba(122,174,173,0.15)] text-[var(--color-teal)]">{b.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {profileTab === "payments" && (
                <div className="space-y-[8px]">
                  <div className="flex justify-between items-center py-[10px] border-b border-[rgba(245,237,214,0.06)]">
                    <span className="text-[11px] uppercase tracking-wider text-[rgba(245,237,214,0.35)]">Total Spent</span>
                    <span className="text-[15px] font-bold text-[var(--color-cream)]">${selected.totalSpent}</span>
                  </div>
                  <div className="flex justify-between items-center py-[10px] border-b border-[rgba(245,237,214,0.06)]">
                    <span className="text-[11px] uppercase tracking-wider text-[rgba(245,237,214,0.35)]">Total Bookings</span>
                    <span className="text-[13px] text-[var(--color-cream)]">{selected.totalBookings}</span>
                  </div>
                </div>
              )}
              {profileTab === "notes" && (
                <div>
                  {!editingNotes ? (
                    <div>
                      <p className="text-[13px] text-[rgba(245,237,214,0.7)] leading-relaxed min-h-[60px]">{editNotes || <span className="text-[rgba(245,237,214,0.3)]">No notes yet.</span>}</p>
                      <button onClick={() => setEditingNotes(true)} className="mt-[12px] text-[12px] text-[var(--color-gold)] hover:underline">Edit notes</button>
                    </div>
                  ) : (
                    <div>
                      <textarea
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        rows={5}
                        className="w-full bg-[var(--color-dark-bg)] border border-[rgba(245,237,214,0.1)] rounded-[6px] px-[12px] py-[10px] text-[13px] text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-gold)] resize-none"
                      />
                      <div className="flex gap-[10px] mt-[8px]">
                        <button onClick={() => setEditingNotes(false)} className="text-[12px] text-[rgba(245,237,214,0.4)] hover:text-[var(--color-cream)] transition">Cancel</button>
                        <button onClick={saveNotes} className="text-[12px] text-[var(--color-gold)] font-semibold hover:underline">Save</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer actions */}
            <div className="px-[24px] pb-[24px] flex items-center justify-between">
              {!deleteConfirm ? (
                <button
                  onClick={() => setDeleteConfirm(true)}
                  disabled={hasPaidBookings}
                  className={`text-[12px] px-[14px] py-[8px] rounded-[6px] border transition ${hasPaidBookings ? "text-[rgba(245,237,214,0.2)] border-[rgba(245,237,214,0.05)] cursor-not-allowed" : "text-[#F87171] border-[rgba(220,38,38,0.3)] hover:bg-[rgba(220,38,38,0.1)]"}`}
                  title={hasPaidBookings ? "Cannot delete a customer with paid bookings" : "Delete customer"}
                >
                  Delete Account
                </button>
              ) : (
                <div className="flex gap-[10px] items-center">
                  <span className="text-[12px] text-[rgba(245,237,214,0.6)]">Are you sure?</span>
                  <button onClick={() => setDeleteConfirm(false)} className="text-[12px] text-[rgba(245,237,214,0.4)]">Cancel</button>
                  <button onClick={() => setProfileOpen(false)} className="text-[12px] text-[#F87171] font-semibold hover:underline">Yes, Delete</button>
                </div>
              )}
              <button onClick={() => setProfileOpen(false)} className="bg-[var(--color-gold)] text-[var(--color-dark-bg)] font-semibold text-[13px] px-[20px] py-[9px] rounded-[6px] hover:brightness-110 transition">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

