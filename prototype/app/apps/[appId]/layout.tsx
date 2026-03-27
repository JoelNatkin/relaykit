"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useSession } from "@/context/session-context";
import type { RegistrationState, ComplianceView } from "@/context/session-context";

const TABS = [
  { id: "overview", label: "Overview", href: (appId: string) => `/apps/${appId}/overview` },
  { id: "messages", label: "Messages", href: (appId: string) => `/apps/${appId}/messages` },
  { id: "settings", label: "Settings", href: (appId: string) => `/apps/${appId}/settings` },
];

const APP_NAMES: Record<string, string> = {
  glowstudio: "GlowStudio",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { appId } = useParams<{ appId: string }>();
  const pathname = usePathname();
  const { state, setRegistrationState, setComplianceView, setAlertsEnabled, setLoggedIn } = useSession();

  // App pages are always logged-in
  useEffect(() => {
    if (!state.isLoggedIn) setLoggedIn(true);
  }, [state.isLoggedIn, setLoggedIn]);

  const appName = APP_NAMES[appId] || appId;
  const isApproved = state.registrationState === "approved";
  const isOverview = pathname.endsWith("/overview");
  const isRegisterFlow = pathname.includes("/register");
  const [period, setPeriod] = useState("this_month");

  return (
    <div>
      {/* App identity */}
      <div className="mx-auto max-w-5xl px-6 pt-6 pb-4 flex items-center gap-3">
        <h1 className="text-xl font-semibold text-text-primary">{appName}</h1>
        <span className="inline-flex items-center rounded-full bg-bg-brand-secondary px-2.5 py-1 text-xs font-medium text-text-brand-secondary">
          Appointments
        </span>

        {/* Dev state switchers + contextual status — right-aligned */}
        <div className="ml-auto flex items-center">
          {/* Dev state switchers (prototype only) */}
          <div className="flex items-center">
            <select
              value={state.registrationState}
              onChange={(e) => setRegistrationState(e.target.value as RegistrationState)}
              className="text-xs text-text-quaternary bg-transparent border-none cursor-pointer focus:outline-none"
            >
              <option value="default">Default</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="changes_requested">Extended Review</option>
              <option value="rejected">Rejected</option>
            </select>
            {state.registrationState === "approved" && (
              <select
                value={state.complianceView}
                onChange={(e) => setComplianceView(e.target.value as ComplianceView)}
                className="text-xs text-text-quaternary bg-transparent border-none cursor-pointer focus:outline-none"
              >
                <option value="all_clear">All clear</option>
                <option value="has_alerts">Has alerts</option>
              </select>
            )}
            {isOverview && (
              <select
                value={state.alertsEnabled ? "on" : "off"}
                onChange={(e) => setAlertsEnabled(e.target.value === "on")}
                className="text-xs text-text-quaternary bg-transparent border-none cursor-pointer focus:outline-none"
              >
                <option value="on">Alerts on</option>
                <option value="off">Alerts off</option>
              </select>
            )}
          </div>

          {/* Status indicator */}
          <div className="ml-10">
            {state.registrationState === "approved" && (
              <span className="flex items-center gap-1.5 text-sm text-text-secondary">
                <span className="inline-block h-2 w-2 rounded-full bg-[#12B76A]" />
                Your app is live
              </span>
            )}
            {state.registrationState === "pending" && (
              <span className="flex items-center gap-1.5 text-sm text-text-secondary">
                <span className="inline-block h-2 w-2 rounded-full bg-[#F79009]" />
                Registration in review
              </span>
            )}
            {state.registrationState === "changes_requested" && (
              <span className="flex items-center gap-1.5 text-sm text-text-secondary">
                <span className="inline-block h-2 w-2 rounded-full bg-[#F79009]" />
                Extended review
              </span>
            )}
            {state.registrationState === "rejected" && (
              <span className="flex items-center gap-1.5 text-sm text-text-secondary">
                <span className="inline-block h-2 w-2 rounded-full bg-[#F04438]" />
                Registration rejected
              </span>
            )}
            {state.registrationState === "default" && (
              <span className="flex items-center gap-1.5 text-sm text-text-secondary">
                <span className="inline-block h-2 w-2 rounded-full bg-[#98A2B3]" />
                Sandbox
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tab bar — hidden on registration flow */}
      {!isRegisterFlow && (
        <div className="border-b border-border-secondary">
        <div className="mx-auto max-w-5xl px-6 flex items-center gap-1">
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
          {isApproved && isOverview && (
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
