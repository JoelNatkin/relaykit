"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import type { RegistrationState } from "@/context/session-context";

const ALL_TABS = [
  { id: "overview", label: "Overview", href: (appId: string) => `/apps/${appId}/overview` },
  { id: "messages", label: "Messages", href: (appId: string) => `/apps/${appId}/messages` },
  { id: "settings", label: "Settings", href: (appId: string) => `/apps/${appId}/settings` },
];

const APP_NAMES: Record<string, string> = {
  glowstudio: "GlowStudio",
};

interface DashboardLayoutProps {
  children: React.ReactNode;
  registrationState: RegistrationState;
  onRegistrationStateChange: (state: RegistrationState) => void;
}

function StatusIndicator({ registrationState }: { registrationState: RegistrationState }) {
  switch (registrationState) {
    case "registered":
      return (
        <span className="flex items-center gap-1.5 text-sm text-text-secondary">
          <span className="inline-block h-2 w-2 rounded-full bg-[#12B76A]" />
          Your app is live
        </span>
      );
    case "pending":
      return (
        <span className="flex items-center gap-1.5 text-sm text-text-secondary">
          <span className="inline-block h-2 w-2 rounded-full bg-[#F79009]" />
          Registration in review
        </span>
      );
    case "changes_requested":
      return (
        <span className="flex items-center gap-1.5 text-sm text-text-secondary">
          <span className="inline-block h-2 w-2 rounded-full bg-[#F79009]" />
          Extended review
        </span>
      );
    case "rejected":
      return (
        <span className="flex items-center gap-1.5 text-sm text-text-secondary">
          <span className="inline-block h-2 w-2 rounded-full bg-[#F04438]" />
          Registration rejected
        </span>
      );
    default:
      return null;
  }
}

export function DashboardLayout({
  children,
  registrationState,
  onRegistrationStateChange,
}: DashboardLayoutProps) {
  const { appId } = useParams<{ appId: string }>();
  const pathname = usePathname();
  const isRegistered = registrationState === "registered";
  const isOverview = pathname.endsWith("/overview");
  const isRegisterFlow = pathname.includes("/register");
  const [period, setPeriod] = useState("this_month");

  const appName = APP_NAMES[appId] || appId;

  return (
    <div>
      {/* App identity bar */}
      <div className="mx-auto max-w-5xl px-6 pt-6 pb-4 flex items-center gap-3">
        <h1 className="text-xl font-semibold text-text-primary">{appName}</h1>
        <span className="inline-flex items-center rounded-full bg-bg-brand-secondary px-2.5 py-1 text-xs font-medium text-text-brand-secondary">
          Appointments
        </span>

        {/* Right: state switcher + status indicator */}
        <div className="ml-auto flex items-center">
          <select
            value={registrationState}
            onChange={(e) => onRegistrationStateChange(e.target.value as RegistrationState)}
            className="text-xs text-text-quaternary bg-transparent border-none cursor-pointer focus:outline-none"
          >
            <option value="onboarding">Onboarding</option>
            <option value="building">Building</option>
            <option value="pending">Pending</option>
            <option value="changes_requested">Extended Review</option>
            <option value="registered">Registered</option>
            <option value="rejected">Rejected</option>
          </select>

          <div className="ml-10">
            <StatusIndicator registrationState={registrationState} />
          </div>
        </div>
      </div>

      {/* Tab bar — hidden during registration flow */}
      {!isRegisterFlow && (
        <div className="border-b border-border-secondary">
          <div className="mx-auto max-w-5xl px-6 flex items-center gap-1">
            {ALL_TABS.map((tab) => {
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
            {isRegistered && isOverview && (
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="ml-auto text-sm text-text-tertiary bg-transparent border-none cursor-pointer focus:outline-none"
              >
                <option value="this_week">This week</option>
                <option value="last_7">Last 7 days</option>
                <option value="this_month">This month</option>
                <option value="last_30">Last 30 days</option>
              </select>
            )}
          </div>
        </div>
      )}

      {/* Page content */}
      <div className="mx-auto max-w-5xl px-6 pt-6 pb-16">
        {children}
      </div>
    </div>
  );
}
