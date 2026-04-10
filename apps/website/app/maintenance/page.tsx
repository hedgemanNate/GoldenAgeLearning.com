"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signInWithEmail, signOut } from "../../lib/firebase/auth";
import { getUser, subscribeMaintenanceMode } from "../../lib/firebase/db";

export default function MaintenancePage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsub = subscribeMaintenanceMode((enabled) => {
      if (!enabled) router.replace("/");
    });
    return () => unsub();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const credential = await signInWithEmail(email, password);
      const user = await getUser(credential.user.uid);
      if (!user || (user.role !== "staff" && user.role !== "superAdmin")) {
        await signOut();
        setError("This login is for staff only.");
        return;
      }
      router.push("/admin");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (
        msg.includes("INVALID_LOGIN_CREDENTIALS") ||
        msg.includes("wrong-password") ||
        msg.includes("user-not-found")
      ) {
        setError("Invalid email or password. Please try again.");
      } else {
        setError("Sign-in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-dark-bg)] flex flex-col items-center justify-center px-[24px] py-[48px]">

      {/* Logo + Message */}
      <div className="flex flex-col md:flex-row items-center gap-[32px] md:gap-[48px] mb-[56px]">
        <Image
          src="/assests/GALTextLogoTrans.png"
          alt="Golden Age Learning"
          width={500}
          height={500}
          className="h-[140px] w-auto object-contain flex-shrink-0"
          priority
        />

        <div className="hidden md:block w-[1px] self-stretch bg-[rgba(245,237,214,0.12)]" />

        <div className="text-center md:text-left max-w-[460px]">
          <h1 className="font-display font-bold text-[30px] md:text-[36px] text-[var(--color-cream)] leading-tight mb-[14px]">
            We'll be right back.
          </h1>
          <p className="font-sans text-[18px] md:text-[20px] text-[rgba(245,237,214,0.65)] leading-relaxed">
            We're working on this website to make it better than ever.
            Please check back soon!
          </p>
        </div>
      </div>

      {/* Staff Login Card */}
      <div className="w-full max-w-[420px] bg-[var(--color-dark-surface)] rounded-[12px] border border-[rgba(245,237,214,0.07)] px-[32px] py-[32px]">
        <h2 className="font-display text-[24px] text-[var(--color-cream)] text-center mb-[24px]">
          Staff Sign In
        </h2>

        {error && (
          <div className="mb-[20px] px-[16px] py-[12px] rounded-[6px] bg-[rgba(139,0,0,0.25)] border border-[rgba(220,38,38,0.3)] font-sans text-[15px] text-[var(--color-cream)]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-[20px]">
          <div>
            <label htmlFor="email" className="block font-sans text-[15px] text-[var(--color-cream)] mb-[8px]">
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
              className="w-full px-[16px] py-[13px] bg-[var(--color-dark-bg)] border border-[rgba(245,237,214,0.15)] rounded-[6px] font-sans text-[17px] text-[var(--color-cream)] placeholder-[rgba(245,237,214,0.3)] focus:outline-none focus:border-[var(--color-gold)] disabled:opacity-50 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="password" className="block font-sans text-[15px] text-[var(--color-cream)] mb-[8px]">
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
              className="w-full px-[16px] py-[13px] bg-[var(--color-dark-bg)] border border-[rgba(245,237,214,0.15)] rounded-[6px] font-sans text-[17px] text-[var(--color-cream)] placeholder-[rgba(245,237,214,0.3)] focus:outline-none focus:border-[var(--color-gold)] disabled:opacity-50 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full py-[14px] bg-[var(--color-gold)] text-[var(--color-dark-bg)] font-sans font-bold text-[17px] rounded-[6px] hover:brightness-110 disabled:opacity-50 transition-all"
          >
            {loading ? "Signing In…" : "Sign In"}
          </button>
        </form>
      </div>

    </div>
  );
}
