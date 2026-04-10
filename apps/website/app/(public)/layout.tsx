import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { AuthProvider } from "../../context/AuthContext";
import MaintenanceGate from "../../components/layout/MaintenanceGate";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <MaintenanceGate>{children}</MaintenanceGate>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
