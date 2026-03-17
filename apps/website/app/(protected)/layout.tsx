import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { AuthProvider } from "../../context/AuthContext";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
