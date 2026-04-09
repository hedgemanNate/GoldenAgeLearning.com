import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="w-full">
      {/* Hero Section */}
      <section className="w-full bg-[var(--color-dark-bg)] px-[24px] py-[40px] min-h-[calc(100svh-80px)] flex flex-col items-center justify-center text-center">

        <h1 className="font-display font-bold text-[32px] md:text-[48px] text-[var(--color-cream)] leading-tight mb-[16px] max-w-3xl">
          You've come to the right place.
        </h1>

        <p className="font-sans text-[18px] md:text-[20px] text-[rgba(245,237,214,0.6)] mb-[40px] max-w-2xl">
          Technology classes taught with patience and care.
        </p>

        {/* Primary CTA — above the logo so it is always visible */}
        <Link
          href="/classes"
          className="bg-[var(--color-slate)] text-[var(--color-cream)] font-sans text-[18px] font-medium h-[60px] w-full max-w-[400px] px-[32px] rounded-[12px] border border-[rgba(201,168,76,0.75)] shadow-[0_8px_20px_rgba(0,0,0,0.2)] hover:bg-[rgba(74,96,112,1)] hover:-translate-y-[1px] active:translate-y-0 transition-all duration-200 ease-out flex items-center justify-center mb-[56px]"
        >
          Pick A Class
        </Link>

      </section>
    </main>
  );
}
