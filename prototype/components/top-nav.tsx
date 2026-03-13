"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/choose", label: "Categories" },
  { href: "/c/appointments/messages", label: "Messages" },
  { href: "/dashboard-a", label: "Dashboard A" },
  { href: "/dashboard-b", label: "Dashboard B" },
  { href: "/dashboard-c", label: "Dashboard C" },
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-border-secondary bg-bg-primary px-6">
      {/* Left: wordmark */}
      <div className="flex items-center gap-2">
        <Link href="/" className="text-lg font-bold text-text-primary">
          RelayKit
        </Link>
      </div>

      {/* Center: nav links */}
      <div className="flex items-center gap-1">
        {NAV_LINKS.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== "/" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition duration-100 ease-linear ${
                isActive
                  ? "bg-bg-brand-primary text-text-brand-secondary"
                  : "text-text-tertiary hover:text-text-secondary hover:bg-bg-primary_hover"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* Right: Register button */}
      <button
        type="button"
        onClick={() => alert("Registration flow coming soon.")}
        className="rounded-lg bg-bg-brand-solid px-4 py-2 text-sm font-medium text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover"
      >
        Register &rarr;
      </button>
    </nav>
  );
}
