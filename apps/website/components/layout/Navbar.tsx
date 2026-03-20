"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { signOut } from "../../lib/firebase/auth";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { firebaseUser, user } = useAuthContext();
  const [signingOut, setSigningOut] = useState(false);

  const isLoggedIn = !!firebaseUser;

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      router.push("/");
    } catch (err) {
      console.error("Sign out error:", err);
    } finally {
      setSigningOut(false);
    }
  };

  const links = [
    { name: "Home", path: "/" },
    { name: "Classes", path: "/classes" },
  ];

  if (isLoggedIn) {
    links.push({ name: "My Account", path: "/account" });
  }

  return (
    <nav className="sticky top-0 z-[100] h-[70px] w-full bg-[var(--color-dark-bg)] border-b-2 border-[var(--color-gold)] flex items-center px-[24px]">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-display font-bold text-[18px] text-[var(--color-cream)]">
          Golden Age Learning
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-[32px]">
          {links.map((link) => {
            // Simplified matching: true if pathname equals path OR pathname starts with path + '/' (in case of subroutes like /classes/123)
            const isActive = link.path === "/" 
              ? pathname === "/" 
              : pathname === link.path || pathname.startsWith(link.path + "/");
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`font-sans text-[16px] transition-colors h-[70px] flex items-center ${
                  isActive
                    ? "text-[var(--color-gold)] border-b-[3px] border-[var(--color-gold)]"
                    : "text-[rgba(245,237,214,0.45)] hover:text-[rgba(245,237,214,0.8)] border-b-[3px] border-transparent"
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          {!isLoggedIn ? (
            <Link
              href="/auth/login"
              className="font-sans text-[16px] text-[var(--color-gold)] border-[1.5px] border-[var(--color-gold)] px-[16px] py-[8px] rounded-btn min-h-[44px] flex items-center justify-center"
            >
              Sign In
            </Link>
          ) : (
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="font-sans text-[16px] text-[var(--color-gold)] border-[1.5px] border-[var(--color-gold)] px-[16px] py-[8px] rounded-btn min-h-[44px] flex items-center justify-center hover:bg-[rgba(202,174,98,0.1)] disabled:opacity-50 transition-colors"
            >
              {signingOut ? "Signing Out..." : "Sign Out"}
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden flex items-center gap-[8px] text-[var(--color-cream)] min-h-[44px] min-w-[44px]"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu size={24} />
          <span className="font-sans text-[16px] pt-1">Menu</span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="absolute top-[72px] left-0 w-full h-[calc(100vh-70px)] bg-[var(--color-dark-bg)] flex flex-col p-[24px]">
          {links.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`font-sans text-[20px] h-[56px] flex items-center border-b border-[#222E36] ${
                  isActive ? "text-[var(--color-gold)]" : "text-[var(--color-cream)]"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            );
          })}
          {!isLoggedIn && (
            <Link
              href="/auth/login"
              className="mt-[24px] font-sans text-[20px] text-[var(--color-gold)] border-[1.5px] border-[var(--color-gold)] h-[60px] flex items-center justify-center rounded-btn"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign In
            </Link>
          )}
          {isLoggedIn && (
            <button
              onClick={() => {
                handleSignOut();
                setIsMobileMenuOpen(false);
              }}
              disabled={signingOut}
              className="mt-[24px] font-sans text-[20px] text-[var(--color-gold)] border-[1.5px] border-[var(--color-gold)] h-[60px] flex items-center justify-center rounded-btn hover:bg-[rgba(202,174,98,0.1)] disabled:opacity-50 transition-colors w-full"
            >
              {signingOut ? "Signing Out..." : "Sign Out"}
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
