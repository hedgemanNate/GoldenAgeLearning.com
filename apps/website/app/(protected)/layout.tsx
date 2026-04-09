import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { AuthProvider } from "../../context/AuthContext";
import { CustomerAuthGuard } from "../../components/customer/CustomerAuthGuard";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CustomerAuthGuard>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </CustomerAuthGuard>
    </AuthProvider>
  );
}
