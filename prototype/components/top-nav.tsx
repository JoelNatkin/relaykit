"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/context/session-context";
import type { DashboardVersion } from "@/context/session-context";

const PUBLIC_LINKS = [
  { href: "/", label: "Home" },
  { href: "/sms/appointments", label: "Appointments" },
  { href: "/sms/appointments/messages", label: "Messages" },
];

const LOGGED_IN_LINKS = [
  { href: "/apps", label: "Your Apps" },
  { href: "/apps/radarlove/messages", label: "Messages" },
  { href: "/apps/radarlove/compliance", label: "Compliance" },
  { href: "/apps/radarlove/settings", label: "Settings" },
];

const DASHBOARD_VERSIONS: { value: DashboardVersion; label: string }[] = [
  { value: "a", label: "A" },
  { value: "b", label: "B" },
  { value: "c", label: "C" },
];

export function TopNav() {
  const pathname = usePathname();
  const { state, setLoggedIn, setDashboardVersion } = useSession();
  const { isLoggedIn, dashboardVersion } = state;

  const links = isLoggedIn ? LOGGED_IN_LINKS : PUBLIC_LINKS;
  const isInApp = pathname.startsWith("/apps/");

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

      {/* Center: nav links + dashboard version switcher */}
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

        {/* Dashboard A/B/C switcher — visible when in per-app view */}
        {isLoggedIn && isInApp && (
          <>
            <span className="mx-2 h-4 w-px bg-border-secondary" />
            <div className="flex items-center gap-0.5 rounded-md border border-border-secondary p-0.5">
              {DASHBOARD_VERSIONS.map((v) => (
                <button
                  key={v.value}
                  type="button"
                  onClick={() => setDashboardVersion(v.value)}
                  className={`rounded px-2 py-1 text-[11px] font-medium transition duration-100 ease-linear ${
                    dashboardVersion === v.value
                      ? "bg-bg-brand-solid text-text-white"
                      : "text-text-tertiary hover:text-text-secondary hover:bg-bg-primary_hover"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Legacy links for direct dashboard access */}
        {!isLoggedIn && (
          <>
            <span className="mx-2 h-4 w-px bg-border-secondary" />
            {[
              { href: "/dashboard-a", label: "Dash A" },
              { href: "/dashboard-b", label: "Dash B" },
              { href: "/dashboard-c", label: "Dash C" },
            ].map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-md px-2 py-1.5 text-[11px] font-medium transition duration-100 ease-linear ${
                    isActive
                      ? "bg-bg-brand-primary text-text-brand-secondary"
                      : "text-text-quaternary hover:text-text-tertiary hover:bg-bg-primary_hover"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </>
        )}
      </div>

      {/* Right: auth toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setLoggedIn(!isLoggedIn)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition duration-100 ease-linear ${
            isLoggedIn
              ? "border border-border-primary bg-bg-primary text-text-secondary hover:bg-bg-primary_hover"
              : "bg-bg-brand-solid text-text-white hover:bg-bg-brand-solid_hover"
          }`}
        >
          {isLoggedIn ? "Sign out" : "Sign in"}
        </button>
      </div>
    </nav>
  );
}
