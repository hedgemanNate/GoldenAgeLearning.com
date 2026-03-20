"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../../context/AuthContext";

export function CustomerAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { firebaseUser, loading } = useAuthContext();

  useEffect(() => {
    if (!loading && !firebaseUser) {
      router.replace("/auth/login");
    }
  }, [firebaseUser, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-dark-bg)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-[48px] w-[48px] border-b-2 border-[var(--color-gold)] mx-auto mb-[16px]"></div>
          <p className="font-sans text-[16px] text-[rgba(245,237,214,0.6)]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!firebaseUser) {
    return null;
  }

  return <>{children}</>;
}
