"use client";

const MOCK_ROLE: "super_admin" | "staff" = "super_admin";

const MOCK_METRICS = [
  { label: "Today's Bookings", value: "4", sub: "+2 from yesterday" },
  { label: "Month Bookings", value: "61", sub: "June 2025" },
  { label: "Year Bookings", value: "284", sub: "2025 YTD" },
  { label: "Today's Revenue", value: "$320", sub: "4 paid bookings" },
  { label: "Month Revenue", value: "$4,880", sub: "June 2025" },
  { label: "Active Customers", value: "47", sub: "Last 45 days" },
];

const MOCK_UPCOMING_CLASSES = [
  { name: "Intro to Watercolour", date: "Jun 29", time: "10:00 AM", seats: 8, booked: 6 },
  { name: "Memoir Writing", date: "Jul 3", time: "2:00 PM", seats: 12, booked: 5 },
  { name: "Gentle Yoga & Mindfulness", date: "Jul 5", time: "9:30 AM", seats: 10, booked: 10 },
  { name: "iPad Basics for Beginners", date: "Jul 8", time: "11:00 AM", seats: 8, booked: 2 },
];

const MOCK_RECENT_BOOKINGS = [
  { id: "BK-091", customer: "Margaret P.", classname: "Intro to Watercolour", date: "Jun 27", status: "Paid" },
  { id: "BK-090", customer: "Harold S.", classname: "Memoir Writing", date: "Jun 27", status: "Reserved" },
  { id: "BK-089", customer: "Evelyn T.", classname: "Gentle Yoga & Mindfulness", date: "Jun 26", status: "Paid" },
  { id: "BK-088", customer: "Bernard K.", classname: "iPad Basics for Beginners", date: "Jun 26", status: "Paid" },
  { id: "BK-087", customer: "Rosemary H.", classname: "Intro to Watercolour", date: "Jun 25", status: "Paid" },
];

export default function AdminDashboard() {
  const role = MOCK_ROLE;

  return (
    <div className="p-[32px] font-sans">
      {/* Header */}
      <div className="mb-[32px]">
        <h1 className="font-display text-[28px] font-bold text-[var(--color-cream)]">Dashboard</h1>
        <p className="text-[13px] text-[rgba(245,237,214,0.45)] mt-[4px]">Welcome back — here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Metric cards — Super Admin only */}
      {role === "super_admin" && (
        <div className="grid grid-cols-3 gap-[16px] mb-[32px]">
          {MOCK_METRICS.map((m) => (
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
            {MOCK_UPCOMING_CLASSES.map((cls) => {
              const pct = Math.round((cls.booked / cls.seats) * 100);
              const isFull = cls.booked >= cls.seats;
              return (
                <div key={cls.name} className="bg-[var(--color-dark-surface)] rounded-[8px] px-[18px] py-[14px]">
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
                {MOCK_RECENT_BOOKINGS.map((b, i) => (
                  <tr key={b.id} className={i < MOCK_RECENT_BOOKINGS.length - 1 ? "border-b border-[rgba(245,237,214,0.05)]" : ""}>
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
