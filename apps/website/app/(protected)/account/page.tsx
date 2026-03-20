"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../../../context/AuthContext";
import { changePassword } from "../../../lib/firebase/auth";
import { updateUser } from "../../../lib/firebase/db";

const MOCK_UPCOMING = [
  {
    id: "b1",
    title: "Navigating Your Smartphone",
    date: "Tuesday, April 8",
    time: "10:00–11:00 AM",
    location: "Main Community Hall",
    payment: "paid" as const,
    amount: "$35.00",
  },
];

const MOCK_PAST = [
  {
    id: "b2",
    title: "Intro to Video Calling",
    date: "Thursday, March 27",
    time: "2:00–3:30 PM",
    location: "Tech Lab",
    payment: "completed" as const,
  },
];

const MOCK_CARD = { network: "VISA", last4: "4242", expiry: "08 / 2028" };

type Tab = "bookings" | "details" | "card";

export default function AccountPage() {
  const router = useRouter();
  const { user, firebaseUser } = useAuthContext();
  const [activeTab, setActiveTab] = useState<Tab>("bookings");

  // Modals
  const [cancelModalId, setCancelModalId] = useState<string | null>(null);
  const [showRemoveCardModal, setShowRemoveCardModal] = useState(false);
  const [cardSaved, setCardSaved] = useState(true);

  // Inline edit
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editError, setEditError] = useState("");
  const [flashField, setFlashField] = useState<string | null>(null);

  // Password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  
  // Password field focus tracking
  const [focusedPasswordField, setFocusedPasswordField] = useState<number | null>(null);

  if (!firebaseUser) {
    return null;
  }

  const displayName = user?.name || firebaseUser.email || "Account";
  const displayEmail = user?.email || firebaseUser.email || "";
  const displayPhone = user?.phone || "";

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const startEdit = (field: string, value: string) => {
    setEditingField(field);
    setEditValue(value);
    setEditError("");
    setPasswordError("");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditValue("");
    setEditError("");
    setPasswordError("");
  };

  const saveField = async (field: string) => {
    setEditError("");
    if (!editValue.trim()) {
      setEditError("This field cannot be empty.");
      return;
    }
    if (field === "email" && !editValue.includes("@")) {
      setEditError("That doesn't look like a valid email address.");
      return;
    }
    
    try {
      // Save to database
      await updateUser(firebaseUser!.uid, {
        [field]: editValue,
      });
      
      setEditingField(null);
      setFlashField(field);
      setTimeout(() => setFlashField(null), 1500);
    } catch (err: any) {
      setEditError(err.message || "Failed to save changes");
    }
  };

  const savePassword = async () => {
    setPasswordError("");
    if (!newPassword || newPassword.length < 8) {
      setPasswordError("Your password needs to be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError("Those passwords do not match — please try again.");
      return;
    }
    
    try {
      await changePassword(newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setPasswordSuccess(true);
      setTimeout(() => {
        setPasswordSuccess(false);
        cancelEdit();
      }, 10000);
    } catch (err: any) {
      setPasswordError(err.message || "Failed to change password");
    }
  };



  const TABS: { id: Tab; label: string }[] = [
    { id: "bookings", label: "My Bookings" },
    { id: "details", label: "Account Details" },
    { id: "card", label: "Payment Card" },
  ];

  return (
    <main className="w-full min-h-screen bg-[var(--color-dark-bg)]">

      {/* ── Account Header ── */}
      <div className="px-[40px] pt-[32px] border-b border-[rgba(245,237,214,0.08)]">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-[16px] mb-[20px]">
          <div className="flex items-center gap-[16px]">
            <div className="w-[52px] h-[52px] rounded-full bg-[rgba(201,168,76,0.15)] text-[var(--color-gold)] flex items-center justify-center font-bold font-sans text-[18px] flex-shrink-0">
              {initials}
            </div>
            <div className="flex flex-col">
              <span className="font-sans font-medium text-[20px] text-[var(--color-cream)]">
                {displayName}
              </span>
              <span className="font-sans text-[13px] text-[rgba(245,237,214,0.45)]">
                {displayEmail}{displayPhone ? ` · ${displayPhone}` : ""}
              </span>
            </div>
          </div>
        </div>

        {/* ── Tab Bar ── */}
        <div className="max-w-3xl mx-auto flex border-b border-[rgba(245,237,214,0.08)]">
          {TABS.map(({ id, label }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`font-sans text-[14px] font-medium px-[20px] py-[10px] min-h-[44px] border-b-[3px] transition-colors ${
                  isActive
                    ? "text-[var(--color-gold)] border-[var(--color-gold)] -mb-[2px]"
                    : "text-[rgba(245,237,214,0.4)] border-transparent hover:text-[rgba(245,237,214,0.6)]"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div className="max-w-3xl mx-auto px-[40px] py-[32px]">

        {/* Tab 1 — My Bookings */}
        {activeTab === "bookings" && (
          <div className="flex flex-col">
            <p className="font-sans text-[12px] uppercase tracking-wider text-[rgba(245,237,214,0.4)] mb-[10px]">
              Upcoming
            </p>

            {MOCK_UPCOMING.map((b) => (
              <div
                key={b.id}
                className="bg-[var(--color-dark-surface)] border-l-[5px] border-[var(--color-gold)] rounded-[8px] px-[18px] py-[16px] flex items-start justify-between gap-[12px] mb-[10px]"
              >
                <div className="flex flex-col gap-[4px]">
                  <span className="font-sans font-medium text-[15px] text-[var(--color-cream)]">
                    {b.title}
                  </span>
                  <span className="font-sans text-[13px] text-[rgba(245,237,214,0.45)]">
                    {b.date} · {b.time}
                  </span>
                  <div className="mt-[8px]">
                    {b.payment === "paid" ? (
                      <span className="inline-flex px-[10px] py-[3px] rounded-full bg-[rgba(122,174,173,0.12)] text-[#7AAEAD] font-sans text-[12px]">
                        Paid · {b.amount}
                      </span>
                    ) : (
                      <span className="inline-flex px-[10px] py-[3px] rounded-full bg-[rgba(201,168,76,0.12)] text-[var(--color-gold)] font-sans text-[12px]">
                        Reserved · Pay on arrival
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setCancelModalId(b.id)}
                  className="font-sans text-[12px] text-[rgba(245,237,214,0.3)] underline hover:text-[rgba(245,237,214,0.5)] flex-shrink-0 mt-[2px] transition-colors"
                >
                  Need to cancel?
                </button>
              </div>
            ))}

            <p className="font-sans text-[12px] uppercase tracking-wider text-[rgba(245,237,214,0.4)] mt-[20px] mb-[10px]">
              Past classes
            </p>

            {MOCK_PAST.map((b) => (
              <div
                key={b.id}
                className="opacity-70 bg-[var(--color-dark-surface)] border-l-[5px] border-[rgba(136,135,128,0.4)] rounded-[8px] px-[18px] py-[16px] mb-[10px]"
              >
                <span className="font-sans font-medium text-[15px] text-[var(--color-cream)]">
                  {b.title}
                </span>
                <p className="font-sans text-[13px] text-[rgba(245,237,214,0.45)] mt-[4px]">
                  {b.date} · {b.time}
                </p>
                <div className="mt-[8px]">
                  <span className="inline-flex px-[10px] py-[3px] rounded-full bg-[rgba(136,135,128,0.12)] text-[#888780] font-sans text-[12px]">
                    Completed
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2 — Account Details */}
        {activeTab === "details" && (
          <div className="flex flex-col gap-[6px]">
            <p className="font-sans text-[12px] uppercase tracking-wider text-[rgba(245,237,214,0.4)] mb-[10px]">
              Personal info
            </p>

            <SettingsRow
              label="Full name"
              value={user?.name || "—"}
              editLabel="Edit"
              isEditing={editingField === "name"}
              isFlashing={flashField === "name"}
              onEdit={() => startEdit("name", user?.name || "")}
              editContent={
                <InlineEdit
                  type="text"
                  value={editValue}
                  onChange={setEditValue}
                  error={editError}
                  onSave={() => saveField("name")}
                  onCancel={cancelEdit}
                />
              }
            />

            <SettingsRow
              label="Email address"
              value={user?.email || "—"}
              editLabel="Edit"
              isEditing={editingField === "email"}
              isFlashing={flashField === "email"}
              onEdit={() => startEdit("email", user?.email || "")}
              editContent={
                <InlineEdit
                  type="email"
                  value={editValue}
                  onChange={setEditValue}
                  error={editError}
                  onSave={() => saveField("email")}
                  onCancel={cancelEdit}
                />
              }
            />

            <SettingsRow
              label="Phone number"
              value={user?.phone || "—"}
              editLabel="Edit"
              isEditing={editingField === "phone"}
              isFlashing={flashField === "phone"}
              onEdit={() => startEdit("phone", user?.phone || "")}
              editContent={
                <InlineEdit
                  type="tel"
                  value={editValue}
                  onChange={setEditValue}
                  error={editError}
                  onSave={() => saveField("phone")}
                  onCancel={cancelEdit}
                />
              }
            />

            <p className="font-sans text-[12px] uppercase tracking-wider text-[rgba(245,237,214,0.4)] mt-[24px] mb-[10px]">
              Password
            </p>

            <SettingsRow
              label="Password"
              value="••••••••••"
              editLabel="Change"
              isEditing={editingField === "password"}
              isFlashing={false}
              onEdit={() => startEdit("password", "")}
              editContent={
                <div className="flex flex-col gap-[8px] mt-[12px]">
                  <p className="font-sans text-[13px] text-[rgba(245,237,214,0.5)]">
                    Enter a new password for your account.
                  </p>
                  {(["New password", "Confirm new password"] as const).map((ph, i) => {
                    const vals = [newPassword, confirmNewPassword];
                    const setters = [setNewPassword, setConfirmNewPassword];
                    return (
                      <input
                        key={ph}
                        type={focusedPasswordField === i ? "text" : "password"}
                        placeholder={ph}
                        value={vals[i]}
                        onChange={(e) => setters[i](e.target.value)}
                        onFocus={() => setFocusedPasswordField(i)}
                        onBlur={() => setFocusedPasswordField(null)}
                        className="bg-[#222E36] border border-[rgba(245,237,214,0.15)] focus:border-[var(--color-gold)] rounded-[8px] h-[52px] px-[16px] text-[var(--color-cream)] font-sans text-[16px] outline-none w-full transition-colors"
                      />
                    );
                  })}
                  {passwordError && (
                    <p className="font-sans text-[13px] text-[#EB5757]">{passwordError}</p>
                  )}
                  {passwordSuccess && (
                    <p className="font-sans text-[13px] text-[var(--color-teal)] animate-pulse">✓ Password changed successfully</p>
                  )}
                  <button
                    onClick={savePassword}
                    className="w-full h-[48px] rounded-[8px] bg-[var(--color-gold)] text-[var(--color-dark-bg)] font-sans text-[16px] font-medium hover:bg-[#F2D680] transition-all"
                  >
                    Save changes
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="font-sans text-[13px] text-[var(--color-teal)] hover:underline text-center"
                  >
                    Cancel
                  </button>
                </div>
              }
            />
          </div>
        )}

        {/* Tab 3 — Payment Card */}
        {activeTab === "card" && (
          <div className="flex flex-col gap-[6px]">
            <p className="font-sans text-[12px] uppercase tracking-wider text-[rgba(245,237,214,0.4)] mb-[10px]">
              Saved card
            </p>

            {cardSaved ? (
              <div className="bg-[var(--color-dark-surface)] rounded-[8px] px-[18px] py-[14px] flex items-center justify-between gap-[16px]">
                <div className="flex items-center gap-[14px]">
                  <div className="w-[36px] h-[24px] rounded-[4px] bg-[rgba(245,237,214,0.1)] flex items-center justify-center font-sans text-[8px] font-bold text-[var(--color-cream)] tracking-wide flex-shrink-0">
                    {MOCK_CARD.network}
                  </div>
                  <div className="flex flex-col gap-[2px]">
                    <span className="font-sans font-medium text-[15px] text-[var(--color-cream)]">
                      Visa ending in {MOCK_CARD.last4}
                    </span>
                    <span className="font-sans text-[12px] text-[rgba(245,237,214,0.4)]">
                      Expires {MOCK_CARD.expiry}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-[16px] flex-shrink-0">
                  <button className="font-sans text-[13px] text-[var(--color-gold)] underline hover:opacity-80 transition-opacity">
                    Update
                  </button>
                  <button
                    onClick={() => setShowRemoveCardModal(true)}
                    className="font-sans text-[13px] text-[rgba(226,75,74,0.7)] underline hover:text-[rgba(226,75,74,1)] transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="font-sans text-[12px] uppercase tracking-wider text-[rgba(245,237,214,0.4)] mb-[10px]">
                  No card saved yet
                </p>
                <button className="w-full h-[52px] rounded-[8px] border-[1.5px] border-dashed border-[rgba(201,168,76,0.5)] text-[var(--color-gold)] font-sans text-[14px] hover:bg-[rgba(201,168,76,0.05)] transition-all">
                  + Add a payment card
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* ── Cancel Booking Modal ── */}
      {cancelModalId && (
        <div
          className="fixed inset-0 bg-[rgba(0,0,0,0.6)] flex items-center justify-center z-50 px-[20px]"
          onClick={() => setCancelModalId(null)}
        >
          <div
            className="bg-[var(--color-dark-bg)] border border-[rgba(245,237,214,0.1)] rounded-[12px] p-[24px] w-full max-w-[380px] flex flex-col gap-[16px]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-sans font-medium text-[18px] text-[var(--color-cream)]">
              Need to cancel your booking?
            </h2>
            <p className="font-sans text-[14px] text-[rgba(245,237,214,0.55)] leading-[1.6]">
              To cancel a class, please give us a call and we&apos;ll take care of it for you right away.
            </p>
            <div className="bg-[rgba(122,174,173,0.08)] rounded-[8px] px-[14px] py-[14px] flex items-center justify-center">
              <a
                href="tel:+15551234567"
                className="font-sans font-medium text-[18px] text-[var(--color-teal)]"
              >
                (555) 123-4567
              </a>
            </div>
            <button
              onClick={() => setCancelModalId(null)}
              className="font-sans text-[14px] text-[rgba(245,237,214,0.4)] hover:text-[rgba(245,237,214,0.6)] text-center transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ── Remove Card Modal ── */}
      {showRemoveCardModal && (
        <div
          className="fixed inset-0 bg-[rgba(0,0,0,0.6)] flex items-center justify-center z-50 px-[20px]"
          onClick={() => setShowRemoveCardModal(false)}
        >
          <div
            className="bg-[var(--color-dark-bg)] border border-[rgba(245,237,214,0.1)] rounded-[12px] p-[24px] w-full max-w-[380px] flex flex-col gap-[16px]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-sans font-medium text-[18px] text-[var(--color-cream)]">
              Remove your saved card?
            </h2>
            <p className="font-sans text-[14px] text-[rgba(245,237,214,0.55)] leading-[1.6]">
              Your card details will be deleted. You can always add a new card later.
            </p>
            <button
              onClick={() => { setCardSaved(false); setShowRemoveCardModal(false); }}
              className="w-full h-[52px] rounded-[8px] bg-[rgba(226,75,74,0.85)] text-[var(--color-cream)] font-sans text-[16px] font-medium hover:bg-[rgba(226,75,74,1)] transition-all"
            >
              Yes, remove my card
            </button>
            <button
              onClick={() => setShowRemoveCardModal(false)}
              className="w-full h-[52px] rounded-[8px] border border-[rgba(245,237,214,0.2)] text-[var(--color-cream)] font-sans text-[16px] font-medium hover:bg-[rgba(245,237,214,0.05)] transition-all"
            >
              Keep my card
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

// ── Sub-components ──

function SettingsRow({
  label,
  value,
  editLabel,
  isEditing,
  isFlashing,
  onEdit,
  editContent,
}: {
  label: string;
  value: string;
  editLabel: string;
  isEditing: boolean;
  isFlashing: boolean;
  onEdit: () => void;
  editContent: ReactNode;
}) {
  return (
    <div
      className={`bg-[var(--color-dark-surface)] rounded-[8px] px-[18px] py-[14px] mb-[6px] transition-all ${
        isFlashing ? "ring-1 ring-[var(--color-gold)]" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-[2px]">
          <span className="font-sans text-[13px] text-[rgba(245,237,214,0.5)]">{label}</span>
          <span className="font-sans font-medium text-[15px] text-[var(--color-cream)]">{value}</span>
        </div>
        {!isEditing && (
          <button
            onClick={onEdit}
            className="font-sans text-[13px] text-[var(--color-gold)] underline hover:opacity-80 flex-shrink-0"
          >
            {editLabel}
          </button>
        )}
      </div>
      {isEditing && editContent}
    </div>
  );
}

function InlineEdit({
  type,
  value,
  onChange,
  error,
  onSave,
  onCancel,
}: {
  type: string;
  value: string;
  onChange: (v: string) => void;
  error: string;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex flex-col gap-[8px] mt-[12px]">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSave()}
        className="bg-[#222E36] border border-[var(--color-gold)] rounded-[8px] h-[52px] px-[16px] text-[var(--color-cream)] font-sans text-[16px] outline-none w-full"
        autoFocus
      />
      {error && <p className="font-sans text-[13px] text-[#EB5757]">{error}</p>}
      <button
        onClick={onSave}
        className="w-full h-[48px] rounded-[8px] bg-[var(--color-gold)] text-[var(--color-dark-bg)] font-sans text-[16px] font-medium hover:bg-[#F2D680] transition-all"
      >
        Save changes
      </button>
      <button
        onClick={onCancel}
        className="font-sans text-[13px] text-[var(--color-teal)] hover:underline text-center"
      >
        Cancel
      </button>
    </div>
  );
}
