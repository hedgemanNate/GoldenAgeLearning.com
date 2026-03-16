import "./globals.css";
import { Playfair_Display, DM_Sans } from "next/font/google";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dmsans" });

export const metadata = {
  title: "Golden Age Learning",
  description: "Technology classes for senior citizens",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="font-sans antialiased text-base bg-[var(--color-dark-bg)] text-[var(--color-cream)]">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
