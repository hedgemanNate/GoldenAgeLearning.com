"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithEmail, resetPassword } from "../../../../lib/firebase/auth";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotStatus, setForgotStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [forgotError, setForgotError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const redirectTo = searchParams.get("redirectTo");

    try {
      await signInWithEmail(email, password);
      router.push(redirectTo || "/account");
    } catch (err: any) {
      const msg = err.message || String(err);
      if (msg.includes("INVALID_LOGIN_CREDENTIALS")) {
        setError("Invalid email or password. Please try again.");
      } else if (msg.includes("user-not-found")) {
        setError("No account found with this email. Please sign up.");
      } else {
        setError("Sign-in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setForgotError("Enter your email address above, then click \"Forgot password\".");
      setForgotStatus("error");
      return;
    }
    setForgotStatus("loading");
    setForgotError("");
    try {
      await resetPassword(email.trim());
      setForgotStatus("sent");
    } catch (err: any) {
      setForgotError(err?.message || "Something went wrong. Please try again.");
      setForgotStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-dark-bg)] px-[24px]">
      <div className="w-full max-w-[420px]">
        <h1 className="font-display text-[32px] text-[var(--color-cream)] text-center mb-[8px]">
          Sign In
        </h1>
        <p className="text-center text-[rgba(245,237,214,0.6)] mb-[32px] font-sans text-[14px]">
          {searchParams.get("redirectTo")
            ? "Sign in and we will bring you right back to finish booking your class."
            : "Sign in to your Golden Age Learning account"}
        </p>

        {error && (
          <div className="bg-[#8B0000] mb-[24px] p-[16px] rounded-[4px] text-[var(--color-cream)] font-sans text-[14px]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-[20px]">
          <div className="space-y-[8px]">
            <label htmlFor="email" className="block font-sans text-[14px] text-[var(--color-cream)]">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full px-[16px] py-[12px] bg-[#1A2A32] border border-[#444] rounded-[4px] font-sans text-[16px] text-[var(--color-cream)] placeholder-[rgba(245,237,214,0.3)] focus:outline-none focus:border-[var(--color-gold)] disabled:opacity-50"
            />
          </div>

          <div className="space-y-[8px]">
            <label htmlFor="password" className="block font-sans text-[14px] text-[var(--color-cream)]">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full px-[16px] py-[12px] bg-[#1A2A32] border border-[#444] rounded-[4px] font-sans text-[16px] text-[var(--color-cream)] placeholder-[rgba(245,237,214,0.3)] focus:outline-none focus:border-[var(--color-gold)] disabled:opacity-50"
            />
            <div className="flex flex-col gap-[6px]">
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={forgotStatus === "loading" || forgotStatus === "sent"}
                className="self-start font-sans text-[13px] text-[rgba(201,168,76,0.75)] hover:text-[var(--color-gold)] disabled:opacity-50 transition-colors"
              >
                {forgotStatus === "loading" ? "Sending…" : forgotStatus === "sent" ? "Email sent!" : "Forgot password?"}
              </button>
              {forgotStatus === "sent" && (
                <p className="font-sans text-[13px] text-[rgba(245,237,214,0.55)]">
                  Check your inbox for a password reset link.
                </p>
              )}
              {forgotStatus === "error" && forgotError && (
                <p className="font-sans text-[13px] text-[rgba(226,75,74,0.9)]">{forgotError}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full py-[12px] bg-[var(--color-gold)] text-[var(--color-dark-bg)] font-sans font-bold text-[16px] rounded-[4px] hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
