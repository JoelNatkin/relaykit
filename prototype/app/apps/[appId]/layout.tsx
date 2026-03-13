"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useSession } from "@/context/session-context";
import type { AppState } from "@/context/session-context";
import { SAMPLE } from "@/components/dashboard/sample-data";

const APP_STATES: { value: AppState; label: string }[] = [
  { value: "pre-download", label: "Pre-download" },
  { value: "sandbox", label: "Sandbox" },
  { value: "live", label: "Live" },
];

const TABS = [
  { id: "messages", label: "Messages", href: (appId: string) => `/apps/${appId}/messages` },
  { id: "compliance", label: "Compliance", href: (appId: string) => `/apps/${appId}/compliance` },
  { id: "settings", label: "Settings", href: (appId: string) => `/apps/${appId}/settings` },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { appId } = useParams<{ appId: string }>();
  const pathname = usePathname();
  const { state, setAppState } = useSession();
  const { appState, dashboardVersion } = state;

  const showTabs = appState !== "pre-download"; // D-97: tabs appear after Blueprint download

  return (
    <div className="mx-auto max-w-5xl px-6">
      {/* App header */}
      <div className="flex items-center justify-between pt-6 pb-4">
        <div>
          <p className="text-xs font-medium text-text-quaternary uppercase tracking-wide">
            {SAMPLE.useCase}
          </p>
          <h1 className="text-xl font-bold text-text-primary">{SAMPLE.businessName}</h1>
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

      {/* Tab bar — only after Blueprint download (D-97) */}
      {showTabs && (
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
      )}

      {/* Page content */}
      <div className="pb-16">
        {children}
      </div>
    </div>
  );
}
