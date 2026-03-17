import AdminSidebar from "../../components/layout/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-dark-bg)] flex">
      <AdminSidebar />
      <main className="ml-[170px] flex-1 min-h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
