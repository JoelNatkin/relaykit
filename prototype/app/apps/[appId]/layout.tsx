"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useSession } from "@/context/session-context";
import type { AppState } from "@/context/session-context";

const APP_STATES: { value: AppState; label: string }[] = [
  { value: "pre-download", label: "Pre-download" },
  { value: "sandbox", label: "Sandbox" },
  { value: "live", label: "Live" },
];

const TABS = [
  { id: "overview", label: "Overview", href: (appId: string) => `/apps/${appId}/overview` },
  { id: "messages", label: "Messages", href: (appId: string) => `/apps/${appId}/messages` },
  { id: "registration", label: "Registration", href: (appId: string) => `/apps/${appId}/registration` },
  { id: "settings", label: "Settings", href: (appId: string) => `/apps/${appId}/settings` },
];

const APP_NAMES: Record<string, string> = {
  glowstudio: "GlowStudio",
  radarlove: "RadarLove",
  shipfast: "ShipFast",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { appId } = useParams<{ appId: string }>();
  const pathname = usePathname();
  const { state, setAppState } = useSession();
  const { appState, dashboardVersion } = state;

  const appName = APP_NAMES[appId] || appId;

  return (
    <div className="mx-auto max-w-5xl px-6">
      {/* Breadcrumb + state toggle */}
      <div className="flex items-center justify-between pt-6 pb-4">
        <div>
          <nav className="flex items-center gap-1.5 text-sm">
            <Link href="/apps" className="text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear">
              Your Apps
            </Link>
            <span className="text-text-quaternary">/</span>
            <span className="font-medium text-text-primary">{appName}</span>
          </nav>
        </div>

        {/* State toggle — prototype control */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-text-quaternary mr-1">State:</span>
          <div className="flex items-center gap-0.5 rounded-lg border border-border-secondary p-0.5">
            {APP_STATES.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setAppState(s.value)}
                className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition duration-100 ease-linear ${
                  appState === s.value
                    ? "bg-bg-brand-solid text-text-white"
                    : "text-text-tertiary hover:text-text-secondary hover:bg-bg-primary_hover"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <span className="ml-2 text-[11px] text-text-quaternary">
            Version {dashboardVersion.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 border-b border-border-secondary mb-6">
        {TABS.map((tab) => {
          const href = tab.href(appId);
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={tab.id}
              href={href}
              className={`px-3 py-2.5 text-sm font-medium transition duration-100 ease-linear border-b-2 -mb-px ${
                isActive
                  ? "border-border-brand text-text-brand-secondary"
                  : "border-transparent text-text-tertiary hover:text-text-secondary hover:border-border-primary"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Page content */}
      <div className="pb-16">
        {children}
      </div>
    </div>
  );
}
