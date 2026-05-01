"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthContext } from "../../context/AuthContext";
import { signOut } from "../../lib/firebase/auth";
import AdminSidebar from "../layout/AdminSidebar";

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const { firebaseUser, user, loading } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname() ?? "";

  const isAuthorized = user?.role === "staff" || user?.role === "superAdmin";
  const isDisplayPage = pathname.endsWith("/slides/display");

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
              This account does not have admin access.
              Contact the existing Super Admin if this user should be granted a staff role.
            </p>
            <button
              onClick={() => signOut().then(() => router.replace("/admin/login"))}
              className="w-full bg-[var(--color-gold)] text-[var(--color-dark-bg)] font-sans font-semibold text-[14px] py-[11px] rounded-[6px] hover:brightness-110 transition"
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
      {!isDisplayPage && <AdminSidebar />}
      <main
        className={isDisplayPage ? "flex-1 min-h-screen overflow-y-auto" : "ml-[170px] flex-1 min-h-screen overflow-y-auto"}
      >
        {children}
      </main>
    </div>
  );
}
