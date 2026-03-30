import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#111820] border-t border-[rgba(245,237,214,0.07)] px-[24px] md:px-[40px] py-[48px]">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-start md:justify-between gap-[40px]">

        {/* Brand */}
        <div className="flex flex-col gap-[16px] max-w-[280px]">
          <Link href="/" className="inline-block opacity-75 hover:opacity-100 transition-opacity">
            <Image
              src="/assests/GALTextLogoTrans.png"
              alt="Golden Age Learning"
              width={200}
              height={67}
              className="h-auto w-[180px]"
            />
          </Link>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-[12px]">
          <span className="font-sans text-[11px] uppercase tracking-[0.1em] text-[var(--color-gold)] font-semibold mb-[4px]">
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
          <span className="font-sans text-[11px] uppercase tracking-[0.1em] text-[var(--color-gold)] font-semibold mb-[4px]">
            Contact
          </span>
          <a href="tel:+19418402375" className="font-sans text-[14px] text-[rgba(245,237,214,0.6)] hover:text-[var(--color-cream)] transition-colors">
            (941) 840-2375
          </a>
          <a href="mailto:info@goldenagelearning.com" className="font-sans text-[14px] text-[rgba(245,237,214,0.6)] hover:text-[var(--color-cream)] transition-colors">
            info@goldenagelearning.com
          </a>
          <p className="font-sans text-[14px] text-[rgba(245,237,214,0.35)] leading-[1.6]">
            Ellenton, FL USA 34222
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
          className="font-sans text-[12px] text-[rgba(245,237,214,0.2)] hover:text-[rgba(245,237,214,0.45)] transition-colors"
        >
          Administration
        </Link>
      </div>
    </footer>
  );
}
