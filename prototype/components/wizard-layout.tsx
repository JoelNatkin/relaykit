"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { ArrowLeft } from "@untitledui/icons";
import type { RegistrationState } from "@/context/session-context";

interface WizardLayoutProps {
  children: React.ReactNode;
  registrationState: RegistrationState;
  onRegistrationStateChange: (state: RegistrationState) => void;
  onSignOut: () => void;
}

const WIZARD_BACK_TARGETS: Record<string, (appId: string) => string | null> = {
  messages: () => null, // No previous step yet
  "opt-in": (appId) => `/apps/${appId}/messages`,
};

export function WizardLayout({
  children,
  registrationState,
  onRegistrationStateChange,
  onSignOut,
}: WizardLayoutProps) {
  const { appId } = useParams<{ appId: string }>();
  const pathname = usePathname();

  // Determine which wizard page we're on
  const currentPage = pathname.endsWith("/opt-in")
    ? "opt-in"
    : pathname.endsWith("/messages")
      ? "messages"
      : "messages";

  const backHref = WIZARD_BACK_TARGETS[currentPage]?.(appId) ?? null;

  return (
    <div>
      {/* Wizard app bar */}
      <div className="mx-auto max-w-5xl px-6 pt-6 pb-4 flex items-center gap-3">
        {/* Left: category label */}
        <span className="text-sm font-medium text-text-secondary">Appointments</span>

        {/* Right: state switcher + sign out */}
        <div className="ml-auto flex items-center gap-4">
          <select
            value={registrationState}
            onChange={(e) => onRegistrationStateChange(e.target.value as RegistrationState)}
            className="text-xs text-text-quaternary bg-transparent border-none cursor-pointer focus:outline-none"
          >
            <option value="default">Default</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="changes_requested">Extended Review</option>
            <option value="rejected">Rejected</option>
          </select>

          <button
            type="button"
            onClick={onSignOut}
            className="text-sm text-text-secondary hover:text-text-primary transition duration-100 ease-linear cursor-pointer"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Back button row */}
      <div className="mx-auto max-w-5xl px-6">
        {backHref ? (
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-sm text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear"
          >
            <ArrowLeft className="size-4" />
            Back
          </Link>
        ) : (
          <button
            type="button"
            disabled
            className="inline-flex items-center gap-1.5 text-sm text-text-quaternary cursor-not-allowed"
          >
            <ArrowLeft className="size-4" />
            Back
          </button>
        )}
      </div>

      {/* Page content — centered container */}
      <div className="mx-auto max-w-[540px] px-6 pt-6 pb-16">
        {children}
      </div>
    </div>
  );
}
