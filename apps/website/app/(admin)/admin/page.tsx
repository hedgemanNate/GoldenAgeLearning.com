"use client";

import { useAdminData } from "../../../hooks/useAdminData";
import { useAuthContext } from "../../../context/AuthContext";

function fmtDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function fmtTime(ts: number) {
  return new Date(ts).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}
function isActiveCustomer(lastLoginAt: number | null) {
  return lastLoginAt ? (Date.now() - lastLoginAt) < 45 * 24 * 60 * 60 * 1000 : false;
}

export default function AdminDashboard() {
  const { user: currentUser } = useAuthContext();
  const { classes, bookings, users, loading } = useAdminData();

  const role = currentUser?.role ?? "staff";

  const todayStart = (() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime(); })();
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime();
  const yearStart = new Date(new Date().getFullYear(), 0, 1).getTime();

  const todayBk = bookings.filter((b) => b.createdAt >= todayStart);
  const monthBk = bookings.filter((b) => b.createdAt >= monthStart);
  const yearBk = bookings.filter((b) => b.createdAt >= yearStart);
  const todayRev = todayBk.filter((b) => b.status === "paid").reduce((s, b) => s + b.amount, 0) / 100;
  const monthRev = monthBk.filter((b) => b.status === "paid").reduce((s, b) => s + b.amount, 0) / 100;
  const monthName = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const year = new Date().getFullYear();
  const activeCount = users.filter((u) => u.role === "customer" && isActiveCustomer(u.lastLoginAt)).length;

  const metrics = [
    { label: "Today's Bookings", value: String(todayBk.length), sub: "" },
    { label: "Month Bookings", value: String(monthBk.length), sub: monthName },
    { label: "Year Bookings", value: String(yearBk.length), sub: `${year} YTD` },
    { label: "Today's Revenue", value: `$${Math.round(todayRev)}`, sub: `${todayBk.filter((b) => b.status === "paid").length} paid bookings` },
    { label: "Month Revenue", value: `$${Math.round(monthRev).toLocaleString()}`, sub: monthName },
    { label: "Active Customers", value: String(activeCount), sub: "Last 45 days" },
  ];

  const upcomingDisplay = [...classes]
    .filter((c) => c.status === "upcoming")
    .sort((a, b) => a.date - b.date)
    .slice(0, 4)
    .map((c) => ({
      id: c.id,
      name: c.name,
      date: fmtDate(c.date),
      time: fmtTime(c.date),
      seats: c.seatLimit,
      booked: c.seatsBooked,
      revenue: c.price * c.seatsBooked,
    }));

  const usersById = Object.fromEntries(users.map((u) => [u.uid, u]));
  const classesById = Object.fromEntries(classes.map((c) => [c.id, c]));
  const recentBookingsDisplay = [...bookings]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5)
    .map((b) => {
      const cust = usersById[b.customerId];
      const cls = classesById[b.classId];
      const parts = cust?.name.split(" ") ?? [];
      const custDisplay = parts.length >= 2 ? `${parts[0]} ${parts[parts.length - 1][0]}.` : (cust?.name ?? "Unknown");
      return {
        id: b.id.slice(-6).toUpperCase(),
        customer: custDisplay,
        classname: cls?.name ?? "Unknown",
        date: fmtDate(b.createdAt),
        status: b.status === "paid" ? "Paid" : "Reserved",
      };
    });

  if (loading) {
    return (
      <div className="p-[32px] font-sans flex items-center justify-center min-h-[300px]">
        <div className="text-[rgba(245,237,214,0.3)] text-[14px]">Loading…</div>
      </div>
    );
  }

  return (
    <div className="p-[32px] font-sans">
      {/* Header */}
      <div className="mb-[32px]">
        <h1 className="font-display text-[28px] font-bold text-[var(--color-cream)]">Dashboard</h1>
        <p className="text-[13px] text-[rgba(245,237,214,0.45)] mt-[4px]">Welcome back — here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Metric cards — Super Admin only */}
      {role === "superAdmin" && (
        <div className="grid grid-cols-3 gap-[16px] mb-[32px]">
          {metrics.map((m) => (
            <div key={m.label} className="bg-[var(--color-dark-surface)] rounded-[8px] px-[20px] py-[18px]">
              <p className="font-sans text-[9px] uppercase tracking-widest text-[rgba(245,237,214,0.4)] mb-[8px]">{m.label}</p>
              <p className="font-display text-[22px] font-bold text-[var(--color-cream)]">{m.value}</p>
              <p className="font-sans text-[11px] text-[rgba(245,237,214,0.35)] mt-[4px]">{m.sub}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-[24px]">
        {/* Upcoming Classes */}
        <div>
          <h2 className="font-sans text-[11px] uppercase tracking-widest text-[rgba(245,237,214,0.4)] mb-[14px]">Upcoming Classes</h2>
          <div className="flex flex-col gap-[10px]">
            {upcomingDisplay.map((cls) => {
              const pct = cls.seats > 0 ? Math.round((cls.booked / cls.seats) * 100) : 0;
              const isFull = cls.booked >= cls.seats;
              return (
                <div key={cls.id} className="bg-[var(--color-dark-surface)] rounded-[8px] px-[18px] py-[14px]">
                  <div className="flex justify-between items-start mb-[8px]">
                    <div>
                      <p className="text-[13px] font-semibold text-[var(--color-cream)]">{cls.name}</p>
                      <p className="text-[11px] text-[rgba(245,237,214,0.4)] mt-[2px]">{cls.date} · {cls.time}</p>
                    </div>
                    {isFull ? (
                      <span className="text-[10px] font-semibold px-[8px] py-[2px] rounded-full bg-[rgba(220,38,38,0.15)] text-[#F87171]">Full</span>
                    ) : (
                      <span className="text-[10px] text-[rgba(245,237,214,0.35)]">{cls.booked}/{cls.seats}</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center mb-[8px]">
                    <span className="text-[12px] font-semibold text-[var(--color-gold)]">${cls.revenue.toLocaleString()}</span>
                    <span className="text-[10px] text-[rgba(245,237,214,0.3)]">revenue</span>
                  </div>
                  <div className="h-[4px] rounded-full bg-[rgba(245,237,214,0.08)] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: isFull ? "#F87171" : "var(--color-gold)",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Bookings */}
        <div>
          <h2 className="font-sans text-[11px] uppercase tracking-widest text-[rgba(245,237,214,0.4)] mb-[14px]">Recent Bookings</h2>
          <div className="bg-[var(--color-dark-surface)] rounded-[8px] overflow-hidden">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="border-b border-[rgba(245,237,214,0.07)]">
                  <th className="text-left px-[16px] py-[10px] text-[rgba(245,237,214,0.3)] font-medium text-[10px] uppercase tracking-wider">ID</th>
                  <th className="text-left px-[16px] py-[10px] text-[rgba(245,237,214,0.3)] font-medium text-[10px] uppercase tracking-wider">Customer</th>
                  <th className="text-left px-[16px] py-[10px] text-[rgba(245,237,214,0.3)] font-medium text-[10px] uppercase tracking-wider">Class</th>
                  <th className="text-left px-[16px] py-[10px] text-[rgba(245,237,214,0.3)] font-medium text-[10px] uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookingsDisplay.map((b, i) => (
                  <tr key={b.id} className={i < recentBookingsDisplay.length - 1 ? "border-b border-[rgba(245,237,214,0.05)]" : ""}>
                    <td className="px-[16px] py-[11px] text-[var(--color-gold)] font-mono text-[11px]">{b.id}</td>
                    <td className="px-[16px] py-[11px] text-[var(--color-cream)]">{b.customer}</td>
                    <td className="px-[16px] py-[11px] text-[rgba(245,237,214,0.6)]">{b.classname}</td>
                    <td className="px-[16px] py-[11px]">
                      {b.status === "Paid" ? (
                        <span className="px-[7px] py-[2px] rounded-full bg-[rgba(122,174,173,0.15)] text-[var(--color-teal)] text-[10px] font-semibold">Paid</span>
                      ) : (
                        <span className="px-[7px] py-[2px] rounded-full bg-[rgba(245,237,214,0.08)] text-[rgba(245,237,214,0.5)] text-[10px] font-semibold">Reserved</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
