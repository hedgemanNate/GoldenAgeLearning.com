"use client";

import { useState, useEffect } from "react";
import TablePagination from "../../../../components/admin/TablePagination";
import { useAdminData } from "../../../../hooks/useAdminData";

type BookingStatus = "Paid" | "Reserved";

interface Booking {
  id: string;
  customer: string;
  bookedOnValue: number;
  email: string;
  phone: string;
  classname: string;
  classDate: string;
  bookedOn: string;
  status: BookingStatus;
  amount: number;
}

function fmtDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function fmtDateTime(ts: number) {
  const d = new Date(ts);
  return `${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}, ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
}

type Filter = "All" | "Paid" | "Reserved";
type SortKey = "customer" | "date";
type SortDirection = "asc" | "desc";

export default function AdminBookings() {
  const { classes, bookings: rawBookings, users, loading } = useAdminData();
  const [filter, setFilter] = useState<Filter>("All");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 25;
  useEffect(() => { setPage(1); }, [filter, search, sortDirection, sortKey]);

  // Manage modal
  const [manageOpen, setManageOpen] = useState(false);
  const [selected, setSelected] = useState<Booking | null>(null);
  const [transferClass, setTransferClass] = useState("");
  const [transferCustomer, setTransferCustomer] = useState("");

  // Add booking modal
  const [addOpen, setAddOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState("");
  const [newClass, setNewClass] = useState("");
  const [newStatus, setNewStatus] = useState<BookingStatus>("Reserved");

  const usersById = Object.fromEntries(users.map((u) => [u.uid, u]));
  const classesById = Object.fromEntries(classes.map((c) => [c.id, c]));

  const liveBookings: Booking[] = rawBookings.map((b) => {
      const cust = usersById[b.customerId];
      const cls = classesById[b.classId];
      return {
        id: b.id,
        customer: cust?.name ?? "Unknown",
        bookedOnValue: b.createdAt,
        email: cust?.email ?? "",
        phone: cust?.phone ?? "",
        classname: cls?.name ?? "Unknown Class",
        classDate: cls ? fmtDateTime(cls.date) : "",
        bookedOn: fmtDate(b.createdAt),
        status: b.status === "paid" ? "Paid" : "Reserved",
        amount: Math.round(b.amount / 100),
      };
    });

  const classOptions = classes.filter((c) => c.status === "upcoming").map((c) => ({ value: c.name, label: `${c.name} · ${fmtDate(c.date)}` }));
  const customerOptions = users.filter((u) => u.role === "customer").map((u) => u.name);

  const filtered = liveBookings.filter((b) => {
    if (filter !== "All" && b.status !== filter) return false;
    if (search && !b.customer.toLowerCase().includes(search.toLowerCase()) && !b.classname.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    if (sortKey === "customer") {
      const result = a.customer.localeCompare(b.customer, undefined, { sensitivity: "base" });
      return sortDirection === "asc" ? result : -result;
    }

    const result = a.bookedOnValue - b.bookedOnValue;
    return sortDirection === "asc" ? result : -result;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function openManage(b: Booking) {
    setSelected(b);
    setTransferClass(b.classname);
    setTransferCustomer(b.customer);
    setManageOpen(true);
  }

  function toggleSort(nextSortKey: SortKey) {
    if (sortKey === nextSortKey) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(nextSortKey);
    setSortDirection(nextSortKey === "customer" ? "asc" : "desc");
  }

  function sortLabel(nextSortKey: SortKey) {
    if (sortKey !== nextSortKey) return "";
    return sortDirection === "asc" ? " ▲" : " ▼";
  }

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
      <div className="flex items-center justify-between mb-[24px]">
        <div>
          <h1 className="font-display text-[28px] font-bold text-[var(--color-cream)]">Bookings</h1>
          <p className="text-[13px] text-[rgba(245,237,214,0.45)] mt-[4px]">View and manage all bookings.</p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="bg-[var(--color-gold)] text-[var(--color-dark-bg)] font-sans font-semibold text-[13px] px-[18px] py-[9px] rounded-[6px] hover:brightness-110 transition"
        >
          + Add Booking
        </button>
      </div>

      {/* Filters + Search */}
      <div className="flex items-center gap-[10px] mb-[20px] flex-wrap">
        <input
          type="text"
          placeholder="Search customer or class…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-[var(--color-dark-surface)] border border-[rgba(245,237,214,0.1)] rounded-[6px] px-[12px] py-[7px] text-[13px] text-[var(--color-cream)] placeholder-[rgba(245,237,214,0.3)] focus:outline-none focus:border-[var(--color-gold)] w-[240px]"
        />
        <div className="ml-auto flex items-center gap-[10px] flex-wrap">
          {(["All", "Paid", "Reserved"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-[14px] py-[6px] rounded-full font-sans text-[12px] font-medium transition ${
                filter === f
                  ? "bg-[var(--color-gold)] text-[var(--color-dark-bg)]"
                  : "bg-[var(--color-dark-surface)] text-[rgba(245,237,214,0.5)] hover:text-[rgba(245,237,214,0.8)]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Pagination Top */}
      <TablePagination
        currentPage={currentPage}
        totalItems={filtered.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />

      {/* Table */}
      <div className="bg-[var(--color-dark-surface)] rounded-[8px] overflow-hidden">
        <table className="w-full table-fixed text-[13px]">
          <colgroup>
            <col className="w-[10ch]" />
            <col />
            <col />
            <col />
            <col className="w-[15ch]" />
            <col className="w-[10ch]" />
            <col className="w-[10ch]" />
            <col className="w-[8ch]" />
          </colgroup>
          <thead>
            <tr className="border-b border-[rgba(245,237,214,0.07)]">
              <th className="text-left px-[8px] py-[12px] text-[10px] uppercase tracking-wider text-[rgba(245,237,214,0.3)] font-medium">ID</th>
              <th className="text-left px-[16px] py-[12px] text-[10px] uppercase tracking-wider text-[rgba(245,237,214,0.3)] font-medium">
                <button
                  type="button"
                  onClick={() => toggleSort("customer")}
                  className="transition hover:text-[rgba(245,237,214,0.72)]"
                >
                  {`Customer${sortLabel("customer")}`}
                </button>
              </th>
              <th className="text-left px-[16px] py-[12px] text-[10px] uppercase tracking-wider text-[rgba(245,237,214,0.3)] font-medium">Class</th>
              <th className="text-left px-[16px] py-[12px] text-[10px] uppercase tracking-wider text-[rgba(245,237,214,0.3)] font-medium">Class Date</th>
              <th className="w-[15ch] text-left px-[8px] py-[12px] text-[10px] uppercase tracking-wider text-[rgba(245,237,214,0.3)] font-medium">
                <button
                  type="button"
                  onClick={() => toggleSort("date")}
                  className="transition hover:text-[rgba(245,237,214,0.72)]"
                >
                  {`Booked On${sortLabel("date")}`}
                </button>
              </th>
              <th className="w-[10ch] text-left px-[8px] py-[12px] text-[10px] uppercase tracking-wider text-[rgba(245,237,214,0.3)] font-medium">Amount</th>
              <th className="w-[10ch] text-left px-[8px] py-[12px] text-[10px] uppercase tracking-wider text-[rgba(245,237,214,0.3)] font-medium">Status</th>
              <th className="w-[8ch] text-left px-[8px] py-[12px] text-[10px] uppercase tracking-wider text-[rgba(245,237,214,0.3)] font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} className="px-[16px] py-[32px] text-center text-[rgba(245,237,214,0.3)] text-[13px]">No bookings found.</td></tr>
            ) : paginated.map((b, i) => (
              <tr key={b.id} className={i < paginated.length - 1 ? "border-b border-[rgba(245,237,214,0.05)]" : ""}>
                <td className="px-[8px] py-[13px] text-[var(--color-gold)] font-mono text-[11px]">
                  <span className="block w-[10ch] overflow-hidden text-ellipsis whitespace-nowrap">{b.id}</span>
                </td>
                <td className="px-[16px] py-[13px]">
                  <p className="text-[var(--color-cream)] font-medium">{b.customer}</p>
                  <p className="text-[11px] text-[rgba(245,237,214,0.35)]">{b.email}</p>
                </td>
                <td className="px-[16px] py-[13px] text-[rgba(245,237,214,0.7)]">{b.classname}</td>
                <td className="px-[16px] py-[13px] text-[rgba(245,237,214,0.6)]">{b.classDate}</td>
                <td className="w-[15ch] px-[8px] py-[13px] text-[rgba(245,237,214,0.6)]">
                  <span className="block w-[15ch] overflow-hidden text-ellipsis whitespace-nowrap">{b.bookedOn}</span>
                </td>
                <td className="w-[10ch] px-[8px] py-[13px] text-[rgba(245,237,214,0.7)]">
                  <span className="block w-[10ch] overflow-hidden text-ellipsis whitespace-nowrap">${b.amount}</span>
                </td>
                <td className="w-[10ch] px-[8px] py-[13px]">
                  {b.status === "Paid" ? (
                    <span className="block w-[10ch] overflow-hidden text-ellipsis whitespace-nowrap px-[7px] py-[2px] rounded-full bg-[rgba(122,174,173,0.15)] text-[var(--color-teal)] text-[10px] font-semibold text-center">Paid</span>
                  ) : (
                    <span className="block w-[10ch] overflow-hidden text-ellipsis whitespace-nowrap px-[7px] py-[2px] rounded-full bg-[rgba(245,237,214,0.08)] text-[rgba(245,237,214,0.5)] text-[10px] font-semibold text-center">Reserved</span>
                  )}
                </td>
                <td className="w-[8ch] px-[8px] py-[13px]">
                  <button onClick={() => openManage(b)} className="block w-[8ch] overflow-hidden text-ellipsis whitespace-nowrap text-left text-[var(--color-gold)] text-[12px] font-medium hover:underline">Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Bottom */}
      <TablePagination
        currentPage={currentPage}
        totalItems={filtered.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />

      {/* Manage Modal */}
      {manageOpen && selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-[16px]" onClick={(e) => { if (e.target === e.currentTarget) setManageOpen(false); }}>
          <div className="bg-[var(--color-dark-surface)] rounded-[12px] w-full max-w-[440px]">
            <div className="flex items-center justify-between px-[24px] py-[20px] border-b border-[rgba(245,237,214,0.08)]">
              <h2 className="font-display text-[20px] font-bold text-[var(--color-cream)]">Manage Booking</h2>
              <button onClick={() => setManageOpen(false)} className="text-[rgba(245,237,214,0.4)] hover:text-[var(--color-cream)] text-[20px] leading-none">&times;</button>
            </div>
            <div className="px-[24px] py-[20px] space-y-[16px]">
              {/* Summary */}
              <div className="bg-[var(--color-dark-bg)] rounded-[8px] px-[14px] py-[12px]">
                <p className="text-[13px] font-semibold text-[var(--color-cream)]">{selected.customer}</p>
                <p className="text-[12px] text-[rgba(245,237,214,0.5)] mt-[2px]">{selected.classname} · {selected.classDate}</p>
                <p className="text-[11px] text-[rgba(245,237,214,0.35)] mt-[2px]">{selected.id}</p>
              </div>
              {/* Transfer date */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[rgba(245,237,214,0.4)] mb-[6px]">Transfer to Class</label>
                <select
                  value={transferClass}
                  onChange={(e) => setTransferClass(e.target.value)}
                  className="w-full bg-[var(--color-dark-bg)] border border-[rgba(245,237,214,0.1)] rounded-[6px] px-[12px] py-[9px] text-[13px] text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-gold)]"
                >
                  {classOptions.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              {/* Transfer customer */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[rgba(245,237,214,0.4)] mb-[6px]">Transfer to Customer</label>
                <select
                  value={transferCustomer}
                  onChange={(e) => setTransferCustomer(e.target.value)}
                  className="w-full bg-[var(--color-dark-bg)] border border-[rgba(245,237,214,0.1)] rounded-[6px] px-[12px] py-[9px] text-[13px] text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-gold)]"
                >
                  {customerOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {/* Mark as paid */}
              {selected.status === "Reserved" && (
                <button
                  onClick={() => setManageOpen(false)}
                  className="w-full text-[13px] font-semibold text-[var(--color-teal)] border border-[rgba(122,174,173,0.3)] rounded-[6px] py-[9px] hover:bg-[rgba(122,174,173,0.08)] transition"
                >
                  Mark as Paid
                </button>
              )}
            </div>
            <div className="px-[24px] pb-[24px] flex justify-end gap-[10px]">
              <button onClick={() => setManageOpen(false)} className="text-[13px] text-[rgba(245,237,214,0.5)] hover:text-[var(--color-cream)] px-[16px] py-[9px] transition">Cancel</button>
              <button onClick={() => setManageOpen(false)} className="bg-[var(--color-gold)] text-[var(--color-dark-bg)] font-semibold text-[13px] px-[20px] py-[9px] rounded-[6px] hover:brightness-110 transition">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Booking Modal */}
      {addOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-[16px]" onClick={(e) => { if (e.target === e.currentTarget) setAddOpen(false); }}>
          <div className="bg-[var(--color-dark-surface)] rounded-[12px] w-full max-w-[420px]">
            <div className="flex items-center justify-between px-[24px] py-[20px] border-b border-[rgba(245,237,214,0.08)]">
              <h2 className="font-display text-[20px] font-bold text-[var(--color-cream)]">Add Booking</h2>
              <button onClick={() => setAddOpen(false)} className="text-[rgba(245,237,214,0.4)] hover:text-[var(--color-cream)] text-[20px] leading-none">&times;</button>
            </div>
            <div className="px-[24px] py-[20px] space-y-[14px]">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[rgba(245,237,214,0.4)] mb-[6px]">Customer</label>
                <select
                  value={newCustomer}
                  onChange={(e) => setNewCustomer(e.target.value)}
                  className="w-full bg-[var(--color-dark-bg)] border border-[rgba(245,237,214,0.1)] rounded-[6px] px-[12px] py-[9px] text-[13px] text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-gold)]"
                >
                  <option value="">Select customer…</option>
                  {customerOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[rgba(245,237,214,0.4)] mb-[6px]">Class</label>
                <select
                  value={newClass}
                  onChange={(e) => setNewClass(e.target.value)}
                  className="w-full bg-[var(--color-dark-bg)] border border-[rgba(245,237,214,0.1)] rounded-[6px] px-[12px] py-[9px] text-[13px] text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-gold)]"
                >
                  <option value="">Select class…</option>
                  {classOptions.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[rgba(245,237,214,0.4)] mb-[6px]">Payment Status</label>
                <div className="flex rounded-[6px] overflow-hidden border border-[rgba(245,237,214,0.1)]">
                  {(["Reserved", "Paid"] as BookingStatus[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setNewStatus(s)}
                      className={`flex-1 py-[8px] text-[12px] font-semibold transition ${newStatus === s ? "bg-[var(--color-gold)] text-[var(--color-dark-bg)]" : "bg-[var(--color-dark-bg)] text-[rgba(245,237,214,0.5)]"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-[24px] pb-[24px] flex justify-end gap-[10px]">
              <button onClick={() => setAddOpen(false)} className="text-[13px] text-[rgba(245,237,214,0.5)] hover:text-[var(--color-cream)] px-[16px] py-[9px] transition">Cancel</button>
              <button onClick={() => setAddOpen(false)} className="bg-[var(--color-gold)] text-[var(--color-dark-bg)] font-semibold text-[13px] px-[20px] py-[9px] rounded-[6px] hover:brightness-110 transition">Create Booking</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

