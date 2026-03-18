import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#111820] border-t border-[rgba(245,237,214,0.07)] px-[40px] py-[48px]">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-start md:justify-between gap-[40px]">

        {/* Brand */}
        <div className="flex flex-col gap-[8px] max-w-[260px]">
          <span className="font-display font-bold text-[18px] text-[var(--color-cream)]">
            Golden Age Learning
          </span>
          <p className="font-sans text-[13px] text-[rgba(245,237,214,0.45)] leading-[1.6]">
            Technology classes taught with patience and care, for adults who want to stay connected.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-[12px]">
          <span className="font-sans text-[11px] uppercase tracking-wider text-[rgba(245,237,214,0.3)] font-semibold">
            Quick links
          </span>
          <Link href="/classes" className="font-sans text-[14px] text-[rgba(245,237,214,0.6)] hover:text-[var(--color-cream)] transition-colors">
            Classes
          </Link>
          <Link href="/account" className="font-sans text-[14px] text-[rgba(245,237,214,0.6)] hover:text-[var(--color-cream)] transition-colors">
            My Account
          </Link>
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-[12px]">
          <span className="font-sans text-[11px] uppercase tracking-wider text-[rgba(245,237,214,0.3)] font-semibold">
            Contact
          </span>
          <a href="tel:+15551234567" className="font-sans text-[14px] text-[rgba(245,237,214,0.6)] hover:text-[var(--color-cream)] transition-colors">
            (555) 123-4567
          </a>
          <a href="mailto:hello@goldenagelearning.com" className="font-sans text-[14px] text-[rgba(245,237,214,0.6)] hover:text-[var(--color-cream)] transition-colors">
            hello@goldenagelearning.com
          </a>
          <p className="font-sans text-[14px] text-[rgba(245,237,214,0.45)]">
            123 Community Drive<br />Anytown, USA 12345
          </p>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="max-w-5xl mx-auto mt-[40px] pt-[20px] border-t border-[rgba(245,237,214,0.07)] flex flex-col sm:flex-row items-center justify-between gap-[8px]">
        <p className="font-sans text-[12px] text-[rgba(245,237,214,0.25)]">
          &copy; {year} Golden Age Learning. All rights reserved.
        </p>
        <Link
          href="/admin"
          className="font-sans text-[12px] text-[rgba(245,237,214,0.25)] hover:text-[rgba(245,237,214,0.45)] transition-colors"
        >
          Administration
        </Link>
      </div>
    </footer>
  );
}
