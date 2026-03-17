"use client";

import { useState } from "react";

type StaffRole = "super_admin" | "staff";

const MOCK_CURRENT_USER_ID = "STF-001"; // The owner/current session

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  lastLogin: string;
  isOwner?: boolean;
}

const MOCK_STAFF: StaffMember[] = [
  { id: "STF-001", name: "Helen Rosewood", email: "helen@goldenagelearning.com", role: "super_admin", lastLogin: "Today, 9:14 AM", isOwner: true },
  { id: "STF-002", name: "Marcus Lin", email: "marcus@goldenagelearning.com", role: "super_admin", lastLogin: "Yesterday, 4:30 PM" },
  { id: "STF-003", name: "Claire Ford", email: "claire@goldenagelearning.com", role: "staff", lastLogin: "3 days ago" },
  { id: "STF-004", name: "Ray Johansson", email: "ray@goldenagelearning.com", role: "staff", lastLogin: "1 week ago" },
];

export default function AdminStaff() {
  const [staff, setStaff] = useState<StaffMember[]>(MOCK_STAFF);
  const [addEmail, setAddEmail] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<StaffMember | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);

  function changeRole(id: string, newRole: StaffRole) {
    setStaff((prev) => prev.map((s) => s.id === id ? { ...s, role: newRole } : s));
  }

  function confirmDelete(member: StaffMember) {
    setDeleteTarget(member);
    setDeleteModal(true);
  }

  return (
    <div className="p-[32px] font-sans">
      {/* Header */}
      <div className="mb-[32px]">
        <h1 className="font-display text-[28px] font-bold text-[var(--color-cream)]">Staff</h1>
        <p className="text-[13px] text-[rgba(245,237,214,0.45)] mt-[4px]">Manage admin access. Only Super Admins can see this page.</p>
      </div>

      {/* Staff list */}
      <div className="bg-[var(--color-dark-surface)] rounded-[8px] overflow-hidden mb-[32px]">
        {staff.map((member, i) => (
          <div key={member.id} className={`flex items-center gap-[14px] px-[20px] py-[16px] ${i < staff.length - 1 ? "border-b border-[rgba(245,237,214,0.05)]" : ""}`}>
            {/* Avatar */}
            <div className="w-[40px] h-[40px] rounded-full bg-[rgba(201,168,76,0.12)] flex items-center justify-center flex-shrink-0">
              <span className="text-[var(--color-gold)] font-bold text-[13px]">
                {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </span>
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-[8px]">
                <p className="text-[14px] font-semibold text-[var(--color-cream)]">{member.name}</p>
                {member.role === "super_admin" ? (
                  <span className="px-[7px] py-[2px] rounded-full bg-[rgba(201,168,76,0.12)] text-[var(--color-gold)] text-[10px] font-semibold">Super Admin</span>
                ) : (
                  <span className="px-[7px] py-[2px] rounded-full bg-[rgba(122,174,173,0.12)] text-[var(--color-teal)] text-[10px] font-semibold">Staff</span>
                )}
                {member.isOwner && (
                  <span className="text-[10px] text-[rgba(245,237,214,0.25)]">· Owner</span>
                )}
              </div>
              <p className="text-[12px] text-[rgba(245,237,214,0.4)] mt-[2px]">{member.email}</p>
              <p className="text-[11px] text-[rgba(245,237,214,0.25)] mt-[1px]">Last login: {member.lastLogin}</p>
            </div>
            {/* Actions (no actions for owner row) */}
            {!member.isOwner && (
              <div className="flex items-center gap-[10px] flex-shrink-0">
                {member.role === "staff" ? (
                  <button
                    onClick={() => changeRole(member.id, "super_admin")}
                    className="text-[12px] text-[rgba(245,237,214,0.45)] hover:text-[var(--color-cream)] border border-[rgba(245,237,214,0.1)] px-[12px] py-[6px] rounded-[6px] transition"
                  >
                    Make Super Admin
                  </button>
                ) : (
                  <button
                    onClick={() => changeRole(member.id, "staff")}
                    className="text-[12px] text-[rgba(245,237,214,0.45)] hover:text-[var(--color-cream)] border border-[rgba(245,237,214,0.1)] px-[12px] py-[6px] rounded-[6px] transition"
                  >
                    Make Staff
                  </button>
                )}
                <button
                  onClick={() => confirmDelete(member)}
                  className="text-[12px] text-[rgba(245,237,214,0.3)] hover:text-[#F87171] transition"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Staff */}
      <div>
        <h2 className="font-sans text-[11px] uppercase tracking-widest text-[rgba(245,237,214,0.4)] mb-[12px]">Add Staff Member</h2>
        <div className="flex gap-[10px] items-center">
          <input
            type="email"
            value={addEmail}
            onChange={(e) => setAddEmail(e.target.value)}
            placeholder="staff@goldenagelearning.com"
            className="bg-[var(--color-dark-surface)] border border-[rgba(245,237,214,0.1)] rounded-[6px] px-[14px] py-[10px] text-[13px] text-[var(--color-cream)] placeholder-[rgba(245,237,214,0.3)] focus:outline-none focus:border-[var(--color-gold)] w-[320px]"
          />
          <button
            onClick={() => setAddEmail("")}
            className="bg-[var(--color-gold)] text-[var(--color-dark-bg)] font-semibold text-[13px] px-[18px] py-[10px] rounded-[6px] hover:brightness-110 transition"
          >
            Send Invite
          </button>
        </div>
        <p className="text-[11px] text-[rgba(245,237,214,0.3)] mt-[8px]">Staff members will receive an invitation email to set up their account.</p>
      </div>

      {/* Delete confirmation modal */}
      {deleteModal && deleteTarget && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-[16px]" onClick={(e) => { if (e.target === e.currentTarget) setDeleteModal(false); }}>
          <div className="bg-[var(--color-dark-surface)] rounded-[12px] w-full max-w-[400px] px-[28px] py-[28px]">
            <h2 className="font-display text-[20px] font-bold text-[var(--color-cream)] mb-[10px]">Remove Staff Member</h2>
            <p className="text-[13px] text-[rgba(245,237,214,0.65)] leading-relaxed mb-[4px]">
              This will disable <strong className="text-[var(--color-cream)]">{deleteTarget.name}&apos;s</strong> login access. Their booking history will be preserved.
            </p>
            <p className="text-[12px] text-[rgba(245,237,214,0.35)] mb-[24px]">This does not permanently delete their Firebase account.</p>
            <div className="flex justify-end gap-[10px]">
              <button onClick={() => setDeleteModal(false)} className="text-[13px] text-[rgba(245,237,214,0.5)] hover:text-[var(--color-cream)] px-[16px] py-[9px] transition">Cancel</button>
              <button
                onClick={() => {
                  setStaff((prev) => prev.filter((s) => s.id !== deleteTarget.id));
                  setDeleteModal(false);
                }}
                className="bg-[rgba(220,38,38,0.15)] border border-[rgba(220,38,38,0.3)] text-[#F87171] font-semibold text-[13px] px-[20px] py-[9px] rounded-[6px] hover:bg-[rgba(220,38,38,0.25)] transition"
              >
                Remove Access
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

