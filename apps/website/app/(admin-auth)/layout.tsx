import { AuthProvider } from "../../context/AuthContext";

export default function AdminAuthLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
