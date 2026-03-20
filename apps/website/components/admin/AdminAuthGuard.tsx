"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../../context/AuthContext";
import { signOut } from "../../lib/firebase/auth";
import { createUser } from "../../lib/firebase/db";
import AdminSidebar from "../layout/AdminSidebar";

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const { firebaseUser, user, loading } = useAuthContext();
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const isAuthorized = user?.role === "staff" || user?.role === "superAdmin";

  useEffect(() => {
    if (loading) return;
    if (!firebaseUser) {
      router.replace("/admin/login");
    }
  }, [firebaseUser, loading, router]);

  // Spinner while resolving auth
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-dark-bg)] flex items-center justify-center">
        <div className="w-[20px] h-[20px] rounded-full border-2 border-[var(--color-gold)] border-t-transparent animate-spin" />
      </div>
    );
  }

  // Not signed in at all — redirect in progress
  if (!firebaseUser) return null;

  // Signed into Firebase Auth but no RTDB profile with the right role
  if (!user || !isAuthorized) {
    async function handleSetupAdmin() {
      if (!firebaseUser) return;
      setCreating(true);
      setCreateError("");
      try {
        await createUser(firebaseUser.uid, {
          name: firebaseUser.displayName ?? firebaseUser.email?.split("@")[0] ?? "Admin",
          email: firebaseUser.email ?? "",
          phone: null,
          address: null,
          role: "superAdmin",
          notes: null,
          contact: [],
          discounts: [],
          bookedClasses: [],
          starRating: null,
          profilePicture: null,
          totalRedemptions: 0,
          squareCustomerId: null,
          squareCardId: null,
          createdAt: Date.now(),
          lastLoginAt: Date.now(),
        });
        // Reload to pick up the new profile
        window.location.href = "/admin";
      } catch {
        setCreateError("Failed to create account. Check Firebase console and try again.");
        setCreating(false);
      }
    }

    return (
      <div className="min-h-screen bg-[var(--color-dark-bg)] flex items-center justify-center p-[16px]">
        <div className="w-full max-w-[400px]">
          <div className="bg-[var(--color-dark-surface)] rounded-[12px] p-[28px] text-center">
            <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[var(--color-gold)] mb-[10px]">
              Golden Age Learning
            </p>
            <h2 className="font-display text-[22px] font-bold text-[var(--color-cream)] mb-[8px]">
              Account Not Linked
            </h2>
            <p className="text-[13px] text-[rgba(245,237,214,0.5)] mb-[6px]">
              Signed in as <span className="text-[var(--color-cream)]">{firebaseUser.email}</span>
            </p>
            <p className="text-[13px] text-[rgba(245,237,214,0.5)] mb-[24px]">
              No admin profile was found for this account.
              Click below to register yourself as the Super Admin.
            </p>
            {createError && (
              <p className="text-[#F87171] text-[13px] bg-[rgba(220,38,38,0.1)] border border-[rgba(220,38,38,0.2)] rounded-[6px] px-[12px] py-[8px] mb-[16px]">
                {createError}
              </p>
            )}
            <button
              onClick={handleSetupAdmin}
              disabled={creating}
              className="w-full bg-[var(--color-gold)] text-[var(--color-dark-bg)] font-sans font-semibold text-[14px] py-[11px] rounded-[6px] hover:brightness-110 transition disabled:opacity-60 disabled:cursor-not-allowed mb-[12px]"
            >
              {creating ? "Setting up…" : "Register as Super Admin"}
            </button>
            <button
              onClick={() => signOut().then(() => router.replace("/admin/login"))}
              className="w-full text-[rgba(245,237,214,0.4)] text-[13px] hover:text-[rgba(245,237,214,0.7)] transition"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-dark-bg)] flex">
      <AdminSidebar />
      <main className="ml-[170px] flex-1 min-h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
