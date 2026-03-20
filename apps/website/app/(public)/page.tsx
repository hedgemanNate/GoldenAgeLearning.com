import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="w-full">
      {/* Hero Section */}
      <section className="w-full bg-[var(--color-dark-bg)] px-[24px] py-[80px] flex flex-col items-center text-center">
        <p className="font-sans text-[13px] text-[var(--color-teal)] tracking-[0.1em] mb-[8px]">
          Welcome to Golden Age Learning
        </p>
        <Image
          src="/assests/GoldenAgeLearningLogo2.png"
          alt="Golden Age Learning Logo"
          width={300}
          height={300}
          className="mb-[24px]"
        />
        <h1 className="font-display font-bold text-[48px] text-[var(--color-cream)] leading-tight mb-[12px] max-w-3xl">
          You've come to the right place.
        </h1>
        <p className="font-sans text-[20px] text-[rgba(245,237,214,0.6)] mb-[32px] max-w-2xl">
          Technology classes taught with patience and care.
        </p>
        
        {/* Primary CTA */}
        <Link 
          href="/classes"
          className="bg-[var(--color-slate)] text-[var(--color-cream)] font-sans text-[18px] h-[60px] px-[32px] rounded-[12px] hover:bg-opacity-90 transition-opacity flex items-center justify-center"
        >
          Pick A Class
        </Link>
      </section>
    </main>
  );
}
