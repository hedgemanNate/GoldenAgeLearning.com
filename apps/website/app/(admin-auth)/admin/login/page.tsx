"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmail } from "../../../../lib/firebase/auth";
import { useAuthContext } from "../../../../context/AuthContext";

export default function AdminLogin() {
  const router = useRouter();
  const { firebaseUser, loading } = useAuthContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // If already signed in, skip the form
  useEffect(() => {
    if (!loading && firebaseUser) {
      router.replace("/admin");
    }
  }, [firebaseUser, loading, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signInWithEmail(email, password);
      router.replace("/admin");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      if (
        msg.includes("invalid-credential") ||
        msg.includes("wrong-password") ||
        msg.includes("user-not-found") ||
        msg.includes("INVALID_LOGIN_CREDENTIALS")
      ) {
        setError("Incorrect email or password.");
      } else if (msg.includes("too-many-requests")) {
        setError("Too many attempts. Please try again later.");
      } else {
        setError("Sign-in failed. Please try again.");
      }
      setSubmitting(false);
    }
  }

  // While auth is resolving show nothing (avoids flash of the form)
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-dark-bg)] flex items-center justify-center">
        <div className="w-[20px] h-[20px] rounded-full border-2 border-[var(--color-gold)] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-dark-bg)] flex items-center justify-center p-[16px]">
      <div className="w-full max-w-[380px]">

        {/* Logo / wordmark */}
        <div className="text-center mb-[36px]">
          <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[var(--color-gold)] mb-[10px]">
            Golden Age Learning
          </p>
          <h1 className="font-display text-[26px] font-bold text-[var(--color-cream)]">
            Administration
          </h1>
          <p className="mt-[6px] text-[13px] text-[rgba(245,237,214,0.45)]">
            Sign in to access the admin panel.
          </p>
        </div>

        {/* Card */}
        <div className="bg-[var(--color-dark-surface)] rounded-[12px] p-[28px]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-[16px]">

            <div className="flex flex-col gap-[6px]">
              <label className="font-sans text-[11px] uppercase tracking-wider text-[rgba(245,237,214,0.45)]">
                Email
              </label>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="bg-[var(--color-dark-bg)] border border-[rgba(245,237,214,0.12)] rounded-[6px] px-[14px] py-[10px] text-[14px] text-[var(--color-cream)] placeholder-[rgba(245,237,214,0.25)] focus:outline-none focus:border-[var(--color-gold)] transition"
              />
            </div>

            <div className="flex flex-col gap-[6px]">
              <label className="font-sans text-[11px] uppercase tracking-wider text-[rgba(245,237,214,0.45)]">
                Password
              </label>
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-[var(--color-dark-bg)] border border-[rgba(245,237,214,0.12)] rounded-[6px] px-[14px] py-[10px] text-[14px] text-[var(--color-cream)] placeholder-[rgba(245,237,214,0.25)] focus:outline-none focus:border-[var(--color-gold)] transition"
              />
            </div>

            {error && (
              <p className="text-[#F87171] text-[13px] bg-[rgba(220,38,38,0.1)] border border-[rgba(220,38,38,0.2)] rounded-[6px] px-[12px] py-[8px]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-[4px] bg-[var(--color-gold)] text-[var(--color-dark-bg)] font-sans font-semibold text-[14px] py-[11px] rounded-[6px] hover:brightness-110 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Signing in…" : "Sign In"}
            </button>

          </form>
        </div>

        <p className="text-center mt-[20px] text-[12px] text-[rgba(245,237,214,0.25)]">
          Staff and administrators only.
        </p>
      </div>
    </div>
  );
}
