"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import type { RegistrationState } from "@/context/session-context";
import { loadWizardData, saveWizardData } from "@/lib/wizard-storage";

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
  const appName = APP_NAMES[appId] || appId;

  // EIN prototype switcher — writes to wizard sessionStorage
  const [hasEin, setHasEin] = useState(true);
  useEffect(() => {
    const data = loadWizardData();
    setHasEin(!!data.ein);
  }, []);

  function handleEinChange(value: string) {
    const withEin = value === "with";
    setHasEin(withEin);
    saveWizardData({ ein: withEin ? "12-3456789" : "" });
    window.dispatchEvent(new Event("relaykit-ein-change"));
  }

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

          <select
            value={hasEin ? "with" : "without"}
            onChange={(e) => handleEinChange(e.target.value)}
            className="ml-3 text-xs text-text-quaternary bg-transparent border-none cursor-pointer focus:outline-none"
          >
            <option value="with">With EIN</option>
            <option value="without">No EIN</option>
          </select>

          <div className="ml-10">
            <StatusIndicator registrationState={registrationState} />
          </div>
        </div>
      </div>

      {/* Page content */}
      <div className="mx-auto max-w-5xl px-6 pt-6 pb-16">
        {children}
      </div>
    </div>
  );
}
