"use client";

import { useEffect } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useSession } from "@/context/session-context";
import type { RegistrationState } from "@/context/session-context";
import { WizardLayout } from "@/components/wizard-layout";
import { DashboardLayout } from "@/components/dashboard-layout";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { appId } = useParams<{ appId: string }>();
  const pathname = usePathname();
  const router = useRouter();
  const { state, setRegistrationState, setLoggedIn } = useSession();

  const isWizard = state.registrationState === "default";
  const isOptIn = pathname.endsWith("/opt-in");
  const isOverview = pathname.endsWith("/overview");
  const isSettings = pathname.endsWith("/settings");
  const isRegisterFlow = pathname.includes("/register");

  // App pages are always logged-in
  useEffect(() => {
    if (!state.isLoggedIn) setLoggedIn(true);
  }, [state.isLoggedIn, setLoggedIn]);

  // Route redirects based on state
  useEffect(() => {
    if (isRegisterFlow) return; // Don't redirect register pages

    if (isWizard) {
      // Wizard mode: overview and settings don't exist — redirect to messages
      if (isOverview || isSettings) {
        router.replace(`/apps/${appId}/messages`);
      }
    } else {
      // Dashboard mode: opt-in doesn't exist — redirect to messages
      if (isOptIn) {
        router.replace(`/apps/${appId}/messages`);
      }
    }
  }, [isWizard, isOverview, isSettings, isOptIn, isRegisterFlow, appId, router]);

  // Handle state switcher changes — redirect if current page is invalid for new state
  function handleStateChange(newState: RegistrationState) {
    const wasWizard = state.registrationState === "default";
    const willBeWizard = newState === "default";
    setRegistrationState(newState);

    if (willBeWizard && !wasWizard) {
      // Switching TO wizard: redirect overview/settings to messages
      if (isOverview || isSettings) {
        router.replace(`/apps/${appId}/messages`);
      }
    } else if (!willBeWizard && wasWizard) {
      // Switching FROM wizard: redirect opt-in to messages
      if (isOptIn) {
        router.replace(`/apps/${appId}/messages`);
      }
    }
  }

  // Register flow pages render without either wrapper
  if (isRegisterFlow) {
    return (
      <div>
        <div className="mx-auto max-w-5xl px-6 pt-6 pb-16">
          {children}
        </div>
      </div>
    );
  }

  if (isWizard) {
    return <WizardLayout>{children}</WizardLayout>;
  }

  return (
    <DashboardLayout
      registrationState={state.registrationState}
      onRegistrationStateChange={handleStateChange}
    >
      {children}
    </DashboardLayout>
  );
}
