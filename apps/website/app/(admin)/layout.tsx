import { AuthProvider } from "../../context/AuthContext";
import AdminAuthGuard from "../../components/admin/AdminAuthGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminAuthGuard>{children}</AdminAuthGuard>
    </AuthProvider>
  );
}
