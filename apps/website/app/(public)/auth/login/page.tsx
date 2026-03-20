"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmail } from "../../../../lib/firebase/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmail(email, password);
      router.push("/account");
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-dark-bg)] px-[24px]">
      <div className="w-full max-w-[420px]">
        <h1 className="font-display text-[32px] text-[var(--color-cream)] text-center mb-[8px]">
          Sign In
        </h1>
        <p className="text-center text-[rgba(245,237,214,0.6)] mb-[32px] font-sans text-[14px]">
          Sign in to your Golden Age Learning account
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
