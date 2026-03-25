"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin", label: "Control Room", exact: true },
  { href: "/admin/registrations", label: "Registrations", exact: false },
  { href: "/admin/customers", label: "Customers", exact: false },
  { href: "/admin/revenue", label: "Revenue", exact: false },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-gray-900 text-white flex flex-col">
        {/* Header */}
        <div className="px-5 py-5 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <svg className="size-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span className="text-sm font-semibold tracking-wide">RelayKit Admin</span>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition duration-100 ease-linear ${
                  isActive
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-700">
          <Link
            href="/apps"
            className="text-xs text-gray-500 hover:text-gray-300 transition duration-100 ease-linear"
          >
            View as customer &rarr;
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-bg-primary overflow-y-auto">
        <div className="mx-auto max-w-6xl px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
