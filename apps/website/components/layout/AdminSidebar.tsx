"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Role = "super_admin" | "staff";

const MOCK_ROLE: Role = "super_admin"; // swap to "staff" to preview staff view

interface NavItem {
  label: string;
  href: string;
  badge?: number;
  children?: NavItem[];
}

const NAV_GROUPS: { group: string; items: NavItem[]; adminOnly?: boolean }[] = [
  {
    group: "Main",
    items: [
      { label: "Dashboard", href: "/admin" },
    ],
  },
  {
    group: "Business",
    items: [
      { label: "Classes", href: "/admin/classes", children: [
        { label: "Templates", href: "/admin/classes/templates" },
      ] },
      { label: "Bookings", href: "/admin/bookings", badge: 3 },
      { label: "Customers", href: "/admin/customers" },
      { label: "Messages", href: "/admin/messages" },
      { label: "Sponsors", href: "/admin/sponsors" },
      { label: "Discounts", href: "/admin/discounts" },
    ],
  },
  {
    group: "Admin",
    adminOnly: true,
    items: [
      { label: "Staff", href: "/admin/staff" },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const role: Role = MOCK_ROLE;

  return (
    <aside className="fixed top-0 left-0 h-screen w-[170px] bg-[#111820] border-r border-[rgba(245,237,214,0.07)] flex flex-col z-40 overflow-y-auto">

      {/* Brand + role */}
      <div className="px-[14px] pt-[24px] pb-[20px] border-b border-[rgba(245,237,214,0.07)]">
        <p className="font-display font-bold text-[14px] text-[var(--color-cream)] leading-tight mb-[36px]">
          Golden Age Learning
        </p>
        {role === "super_admin" ? (
          <span className="inline-flex px-[8px] py-[2px] rounded-full bg-[rgba(201,168,76,0.12)] text-[var(--color-gold)] font-sans text-[10px] font-semibold">
            Super Admin
          </span>
        ) : (
          <span className="inline-flex px-[8px] py-[2px] rounded-full bg-[rgba(122,174,173,0.12)] text-[var(--color-teal)] font-sans text-[10px] font-semibold">
            Staff
          </span>
        )}
      </div>

      {/* Nav groups */}
      <nav className="flex-1 px-[4px] py-[16px] flex flex-col gap-[24px]">
        {NAV_GROUPS.map(({ group, items, adminOnly }) => {
          if (adminOnly && role !== "super_admin") return null;
          return (
            <div key={group}>
              <p className="font-sans text-[8px] uppercase tracking-wider text-[rgba(245,237,214,0.25)] px-[10px] mb-[4px]">
                {group}
              </p>
              {items.map((item) => {
                const isExact = pathname === item.href;
                const isSection = !isExact && item.href !== "/admin" && pathname.startsWith(item.href);
                const isActive = isExact || isSection;
                return (
                  <div key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center justify-between gap-[8px] px-[14px] py-[7px] rounded-[4px] font-sans text-[11px] transition-colors ${
                        isExact
                          ? "text-[var(--color-gold)] bg-[rgba(201,168,76,0.08)] border-l-[2px] border-[var(--color-gold)] pl-[12px]"
                          : isSection
                          ? "text-[rgba(245,237,214,0.75)] bg-[rgba(245,237,214,0.04)] pl-[14px]"
                          : "text-[rgba(245,237,214,0.5)] hover:text-[rgba(245,237,214,0.8)]"
                      }`}
                    >
                      <span className="flex items-center gap-[8px]">
                        <span className={`w-[5px] h-[5px] rounded-full flex-shrink-0 ${isActive ? "bg-[var(--color-gold)]" : "bg-[rgba(245,237,214,0.2)]"}`} />
                        {item.label}
                      </span>
                      {item.badge && !isActive ? (
                        <span className="bg-[var(--color-gold)] text-[var(--color-dark-bg)] font-bold text-[9px] px-[5px] py-[1px] rounded-full leading-none">
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                    {item.children && (
                      <div className="ml-[24px] mt-[1px] mb-[2px]">
                        {item.children.map((child) => {
                          const isChildActive = pathname === child.href || pathname.startsWith(child.href + "/");
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={`flex items-center gap-[8px] px-[10px] py-[5px] rounded-[4px] font-sans text-[10px] transition-colors ${
                                isChildActive
                                  ? "text-[var(--color-gold)] bg-[rgba(201,168,76,0.08)]"
                                  : "text-[rgba(245,237,214,0.38)] hover:text-[rgba(245,237,214,0.65)]"
                              }`}
                            >
                              <span className={`w-[3px] h-[3px] rounded-full flex-shrink-0 ${isChildActive ? "bg-[var(--color-gold)]" : "bg-[rgba(245,237,214,0.15)]"}`} />
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="px-[14px] py-[16px] border-t border-[rgba(245,237,214,0.07)]">
        <Link href="/" className="font-sans text-[11px] text-[rgba(245,237,214,0.3)] hover:text-[rgba(245,237,214,0.5)] transition-colors">
          ← Back to site
        </Link>
      </div>
    </aside>
  );
}
