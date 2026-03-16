"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/context/session-context";

const PUBLIC_LINKS = [
  { href: "/", label: "Home" },
  { href: "/sms/appointments", label: "Appointments" },
  { href: "/sms/appointments/messages", label: "Messages" },
];

const LOGGED_IN_LINKS = [
  { href: "/apps", label: "Your Apps" },
];

export function TopNav() {
  const pathname = usePathname();
  const { state, setLoggedIn } = useSession();
  const { isLoggedIn } = state;

  const links = isLoggedIn ? LOGGED_IN_LINKS : PUBLIC_LINKS;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-border-secondary bg-bg-primary px-6">
      {/* Left: wordmark */}
      <div className="flex items-center gap-3">
        <Link href={isLoggedIn ? "/apps" : "/"} className="text-lg font-bold text-text-primary">
          RelayKit
        </Link>
        <span className="rounded bg-bg-warning-secondary px-1.5 py-0.5 text-[10px] font-medium text-text-warning-primary">
          Prototype
        </span>
      </div>

      {/* Center: nav links */}
      <div className="flex items-center gap-1">
        {links.map((link) => {
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

      {/* Right: auth toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setLoggedIn(!isLoggedIn)}
          className={`text-sm font-medium transition duration-100 ease-linear ${
            isLoggedIn
              ? "text-text-secondary hover:text-text-primary"
              : "text-text-tertiary hover:text-text-secondary"
          }`}
        >
          {isLoggedIn ? "Sign out" : "Sign in"}
        </button>
      </div>
    </nav>
  );
}
