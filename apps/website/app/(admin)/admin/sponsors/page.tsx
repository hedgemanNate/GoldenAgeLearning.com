"use client";

import { useState } from "react";

interface Sponsor {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  stars: number;
  dateJoined: string;
  notes: string;
  redemptions: number;
  discounts: string[];
}

const MOCK_SPONSORS: Sponsor[] = [
  { id: "SP-001", name: "Sunrise Pharmacy", contact: "Tom Bradley", phone: "555-0210", email: "tom@sunrisepharmacy.com", address: "45 Elm Street", stars: 5, dateJoined: "Jan 2024", notes: "Our longest-running sponsor. Always happy to co-promote.", redemptions: 84, discounts: ["10% off first prescription fill", "Free blood pressure screening"] },
  { id: "SP-002", name: "Valley Health Co-op", contact: "Sandra Wells", phone: "555-0336", email: "swells@valleyhealth.ca", address: "120 Oak Ave", stars: 4, dateJoined: "Mar 2024", notes: "Focus on wellness classes.", redemptions: 47, discounts: ["Free wellness consultation"] },
  { id: "SP-003", name: "Maple Hearing Clinic", contact: "Dr. Patel", phone: "555-0449", email: "clinic@maplehearing.ca", address: "9 Cedar Blvd", stars: 3, dateJoined: "Jun 2024", notes: "", redemptions: 21, discounts: ["Free hearing test"] },
];

const EMPTY_FORM: Omit<Sponsor, "id" | "redemptions" | "discounts"> = {
  name: "", contact: "", phone: "", email: "", address: "", stars: 3, dateJoined: "", notes: "",
};

type ProfileTab = "details" | "metrics" | "discounts";

export default function AdminSponsors() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [selected, setSelected] = useState<Sponsor | null>(null);
  const [profileTab, setProfileTab] = useState<ProfileTab>("details");

  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Sponsor | null>(null);
  const [form, setForm] = useState<Omit<Sponsor, "id" | "redemptions" | "discounts">>(EMPTY_FORM);

  function openProfile(s: Sponsor) {
    setSelected(s);
    setProfileTab("details");
    setProfileOpen(true);
  }

  function openAdd() {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setEditOpen(true);
  }

  function openEdit(s: Sponsor) {
    setEditTarget(s);
    const { id: _id, redemptions: _r, discounts: _d, ...rest } = s;
    setForm(rest);
    setEditOpen(true);
  }

  const sorted = [...MOCK_SPONSORS].sort((a, b) => b.redemptions - a.redemptions);

  return (
    <div className="p-[32px] font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-[24px]">
        <div>
          <h1 className="font-display text-[28px] font-bold text-[var(--color-cream)]">Sponsors</h1>
          <p className="text-[13px] text-[rgba(245,237,214,0.45)] mt-[4px]">Manage sponsor partners and their discounts.</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-[var(--color-gold)] text-[var(--color-dark-bg)] font-sans font-semibold text-[13px] px-[18px] py-[9px] rounded-[6px] hover:brightness-110 transition"
        >
          + Add Sponsor
        </button>
      </div>

      {/* Sponsor cards */}
      <div className="flex flex-col gap-[10px]">
        {sorted.map((s) => (
          <div key={s.id} className="bg-[var(--color-dark-surface)] rounded-[8px] px-[20px] py-[16px] flex items-center gap-[16px]">
            {/* Logo placeholder */}
            <div className="w-[48px] h-[48px] rounded-[6px] bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.15)] flex items-center justify-center flex-shrink-0">
              <span className="text-[var(--color-gold)] font-bold text-[14px]">{s.name.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-[var(--color-cream)]">{s.name}</p>
              <p className="text-[12px] text-[rgba(245,237,214,0.45)] mt-[2px]">{s.contact} · {s.phone}</p>
            </div>
            {/* Stars */}
            <div className="flex gap-[2px] flex-shrink-0">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={`text-[14px] ${i < s.stars ? "text-[var(--color-gold)]" : "text-[rgba(245,237,214,0.15)]"}`}>★</span>
              ))}
            </div>
            <p className="text-[12px] text-[rgba(245,237,214,0.4)] flex-shrink-0 w-[90px] text-right">{s.redemptions} redemptions</p>
            <div className="flex gap-[8px] flex-shrink-0">
              <button onClick={() => openProfile(s)} className="text-[12px] text-[var(--color-gold)] font-medium hover:underline">View</button>
              <button onClick={() => openEdit(s)} className="text-[12px] text-[rgba(245,237,214,0.4)] font-medium hover:underline">Edit</button>
            </div>
          </div>
        ))}
      </div>

      {/* Profile Modal */}
      {profileOpen && selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-[16px]" onClick={(e) => { if (e.target === e.currentTarget) setProfileOpen(false); }}>
          <div className="bg-[var(--color-dark-surface)] rounded-[12px] w-full max-w-[480px] max-h-[calc(90vh-110px)] overflow-y-auto">
            <div className="px-[24px] py-[20px] border-b border-[rgba(245,237,214,0.08)] flex items-center justify-between">
              <div>
                <p className="text-[18px] font-bold text-[var(--color-cream)]">{selected.name}</p>
                <div className="flex gap-[2px] mt-[4px]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={`text-[14px] ${i < selected.stars ? "text-[var(--color-gold)]" : "text-[rgba(245,237,214,0.15)]"}`}>★</span>
                  ))}
                </div>
              </div>
              <button onClick={() => setProfileOpen(false)} className="text-[rgba(245,237,214,0.4)] hover:text-[var(--color-cream)] text-[20px] leading-none">&times;</button>
            </div>
            {/* Tabs */}
            <div className="flex border-b border-[rgba(245,237,214,0.08)]">
              {(["details", "metrics", "discounts"] as ProfileTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setProfileTab(tab)}
                  className={`flex-1 py-[11px] text-[12px] font-semibold capitalize transition ${profileTab === tab ? "text-[var(--color-gold)] border-b-[2px] border-[var(--color-gold)]" : "text-[rgba(245,237,214,0.4)] hover:text-[rgba(245,237,214,0.7)]"}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="px-[24px] py-[20px]">
              {profileTab === "details" && (
                <div className="space-y-[10px]">
                  {[["Contact", selected.contact], ["Phone", selected.phone], ["Email", selected.email], ["Address", selected.address], ["Date Joined", selected.dateJoined], ["Notes", selected.notes || "—"]].map(([label, val]) => (
                    <div key={label} className="flex justify-between py-[9px] border-b border-[rgba(245,237,214,0.06)]">
                      <span className="text-[11px] uppercase tracking-wider text-[rgba(245,237,214,0.35)]">{label}</span>
                      <span className="text-[13px] text-[var(--color-cream)] text-right max-w-[60%]">{val}</span>
                    </div>
                  ))}
                </div>
              )}
              {profileTab === "metrics" && (
                <div className="space-y-[10px]">
                  {[["Total Redemptions", selected.redemptions.toString()], ["Discounts Active", selected.discounts.length.toString()]].map(([label, val]) => (
                    <div key={label} className="flex justify-between py-[9px] border-b border-[rgba(245,237,214,0.06)]">
                      <span className="text-[11px] uppercase tracking-wider text-[rgba(245,237,214,0.35)]">{label}</span>
                      <span className="text-[15px] font-bold text-[var(--color-cream)]">{val}</span>
                    </div>
                  ))}
                </div>
              )}
              {profileTab === "discounts" && (
                <div className="space-y-[8px]">
                  {selected.discounts.length === 0 ? (
                    <p className="text-[13px] text-[rgba(245,237,214,0.3)]">No discounts yet.</p>
                  ) : selected.discounts.map((d, i) => (
                    <div key={i} className="bg-[var(--color-dark-bg)] rounded-[8px] px-[14px] py-[11px]">
                      <p className="text-[13px] text-[var(--color-cream)]">{d}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="px-[24px] pb-[24px] flex justify-end">
              <button onClick={() => setProfileOpen(false)} className="bg-[var(--color-gold)] text-[var(--color-dark-bg)] font-semibold text-[13px] px-[20px] py-[9px] rounded-[6px] hover:brightness-110 transition">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {editOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-[16px]" onClick={(e) => { if (e.target === e.currentTarget) setEditOpen(false); }}>
          <div className="bg-[var(--color-dark-surface)] rounded-[12px] w-full max-w-[480px] max-h-[calc(90vh-110px)] overflow-y-auto">
            <div className="flex items-center justify-between px-[24px] py-[20px] border-b border-[rgba(245,237,214,0.08)]">
              <h2 className="font-display text-[20px] font-bold text-[var(--color-cream)]">{editTarget ? "Edit Sponsor" : "Add Sponsor"}</h2>
              <button onClick={() => setEditOpen(false)} className="text-[rgba(245,237,214,0.4)] hover:text-[var(--color-cream)] text-[20px] leading-none">&times;</button>
            </div>
            <div className="px-[24px] py-[20px] space-y-[14px]">
              {(["name", "contact", "phone", "email", "address", "dateJoined"] as const).map((field) => (
                <div key={field}>
                  <label className="block text-[11px] uppercase tracking-wider text-[rgba(245,237,214,0.4)] mb-[6px] capitalize">{field === "dateJoined" ? "Date Joined" : field}</label>
                  <input
                    type="text"
                    value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    className="w-full bg-[var(--color-dark-bg)] border border-[rgba(245,237,214,0.1)] rounded-[6px] px-[12px] py-[9px] text-[13px] text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-gold)]"
                  />
                </div>
              ))}
              {/* Stars */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[rgba(245,237,214,0.4)] mb-[6px]">Rating (Stars)</label>
                <div className="flex gap-[6px]">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} onClick={() => setForm({ ...form, stars: n })} className={`text-[22px] ${n <= form.stars ? "text-[var(--color-gold)]" : "text-[rgba(245,237,214,0.15)]"}`}>★</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[rgba(245,237,214,0.4)] mb-[6px]">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={3}
                  className="w-full bg-[var(--color-dark-bg)] border border-[rgba(245,237,214,0.1)] rounded-[6px] px-[12px] py-[9px] text-[13px] text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-gold)] resize-none"
                />
              </div>
            </div>
            <div className="px-[24px] pb-[24px] flex justify-end gap-[10px]">
              <button onClick={() => setEditOpen(false)} className="text-[13px] text-[rgba(245,237,214,0.5)] hover:text-[var(--color-cream)] px-[16px] py-[9px] transition">Cancel</button>
              <button onClick={() => setEditOpen(false)} className="bg-[var(--color-gold)] text-[var(--color-dark-bg)] font-semibold text-[13px] px-[20px] py-[9px] rounded-[6px] hover:brightness-110 transition">
                {editTarget ? "Save Changes" : "Add Sponsor"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

