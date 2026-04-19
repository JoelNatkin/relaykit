"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Settings01 } from "@untitledui/icons";
import type { RegistrationState } from "@/context/session-context";
import { loadWizardData, saveWizardData } from "@/lib/wizard-storage";
import { useSetupToggle } from "@/components/setup-instructions";
import { SetupToggleProvider } from "@/context/setup-toggle-context";
import { EditBusinessDetailsModal } from "@/components/edit-business-details-modal";

const APP_NAMES: Record<string, string> = {
  glowstudio: "GlowStudio",
};

interface DashboardLayoutProps {
  children: React.ReactNode;
  registrationState: RegistrationState;
  onRegistrationStateChange: (state: RegistrationState) => void;
}

function StatusIndicator({ registrationState }: { registrationState: RegistrationState }) {
  if (registrationState === "onboarding") return null;
  const isLive = registrationState === "registered";
  return (
    <span className="flex items-center gap-1.5 text-sm text-text-secondary">
      <span
        className={`inline-block h-2 w-2 rounded-full ${isLive ? "bg-green-500" : "bg-yellow-500"}`}
      />
      {isLive ? "Live" : "Test messages only"}
    </span>
  );
}

export function DashboardLayout({
  children,
  registrationState,
  onRegistrationStateChange,
}: DashboardLayoutProps) {
  const { appId } = useParams<{ appId: string }>();
  const pathname = usePathname();
  // Messages is the workspace route at /apps/[appId] (no /messages segment).
  // Match the appId root exactly — not any deeper subroute like /settings.
  const isMessagesPage = pathname === `/apps/${appId}`;
  const appName = APP_NAMES[appId] || appId;

  // Setup instructions toggle — lives in the app identity bar on the
  // messages page, shared with the messages page via context so the
  // SetupInstructions panel it reveals can read the same visibility flag.
  const { visible: setupVisible, toggle: setupToggle } = useSetupToggle(registrationState);

  // Edit business details modal — dev affordance for swapping business
  // name / service type values mid-session without re-running onboarding.
  // Opened via a sentinel option appended to the state switcher below.
  const [editDetailsOpen, setEditDetailsOpen] = useState(false);

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
    <SetupToggleProvider value={{ visible: setupVisible, toggle: setupToggle }}>
      <div>
        {/* App identity bar */}
        <div className="mx-auto max-w-5xl px-6 pt-6 pb-4 flex items-center gap-3">
          <h1 className="text-xl font-semibold text-text-primary">{appName}</h1>
          <span className="inline-flex items-center rounded-full bg-bg-brand-secondary px-2.5 py-1 text-xs font-medium text-text-brand-secondary">
            Appointments
          </span>

          {/* Right: state switchers → setup toggle → settings → status */}
          <div className="ml-auto flex items-center">
            <select
              value={registrationState}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "__edit_details__") {
                  // Sentinel — opens the dev modal. The select is
                  // controlled by registrationState, so React overwrites
                  // this sentinel on the next render; no explicit reset
                  // needed.
                  setEditDetailsOpen(true);
                  return;
                }
                onRegistrationStateChange(v as RegistrationState);
              }}
              className="text-xs text-text-quaternary bg-transparent border-none cursor-pointer focus:outline-none"
            >
              <option value="onboarding">Onboarding</option>
              <option value="building">Building</option>
              <option value="pending">Pending</option>
              <option value="changes_requested">Extended Review</option>
              <option value="registered">Registered</option>
              <option value="rejected">Rejected</option>
              {/* Edit business details — dev affordance. Hidden in
                  Onboarding because the wizard sets these values; the
                  workspace affordance would compete with the flow.
                  Disabled em-dash row separates the action from the
                  state list (native <select> doesn't support a portable
                  real divider). */}
              {registrationState !== "onboarding" && (
                <>
                  <option disabled>──────────</option>
                  <option value="__edit_details__">Edit business details</option>
                </>
              )}
            </select>

            <select
              value={hasEin ? "with" : "without"}
              onChange={(e) => handleEinChange(e.target.value)}
              className="ml-3 text-xs text-text-quaternary bg-transparent border-none cursor-pointer focus:outline-none"
            >
              <option value="with">With EIN</option>
              <option value="without">No EIN</option>
            </select>

            {/* Status indicator sits between the prototype switchers and the
                Setup/Settings cluster so Settings stays flush against the
                right edge of the page content. The wrapper is conditional so
                the onboarding state (which returns null) doesn't leave an
                empty margin pushing Settings inward. */}
            {registrationState !== "onboarding" && (
              <div className="ml-10">
                <StatusIndicator registrationState={registrationState} />
              </div>
            )}

            {isMessagesPage && (
              <Link
                href={`/apps/${appId}/settings`}
                aria-label="App settings"
                className="ml-6 flex items-center text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear"
              >
                <Settings01 className="size-4" />
              </Link>
            )}
          </div>
        </div>

        {isMessagesPage && (
          <div className="mx-auto max-w-5xl px-6 pt-4">
            <p className="text-sm text-gray-500 -mb-1">Your SMS workspace. Build and test your feature, go live when you&apos;re ready</p>
          </div>
        )}

        {/* Page content */}
        <div className="mx-auto max-w-5xl px-6 pt-6 pb-16">
          {children}
        </div>
      </div>

      <EditBusinessDetailsModal
        isOpen={editDetailsOpen}
        onClose={() => setEditDetailsOpen(false)}
      />
    </SetupToggleProvider>
  );
}
