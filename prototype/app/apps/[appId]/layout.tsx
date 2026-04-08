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

  const isWizard = state.registrationState === "onboarding";
  const isOptIn = pathname.endsWith("/opt-in");
  const isSignup = pathname.includes("/signup");
  const isReady = pathname.endsWith("/ready");
  const isOverview = pathname.endsWith("/overview");
  const isSettings = pathname.endsWith("/settings");
  const isRegisterFlow = pathname.includes("/register");
  const isGetStarted = pathname.endsWith("/get-started");

  // App pages are always logged-in
  useEffect(() => {
    if (!state.isLoggedIn) setLoggedIn(true);
  }, [state.isLoggedIn, setLoggedIn]);

  // Route redirects based on state
  useEffect(() => {
    if (isRegisterFlow || isGetStarted) return; // Don't redirect register or get-started pages

    // Opt-in was removed from the wizard flow — always redirect to messages
    if (isOptIn) {
      router.replace(`/apps/${appId}/messages`);
      return;
    }

    // Overview always redirects to messages (no tab bar, messages is the workspace)
    if (isOverview) {
      router.replace(`/apps/${appId}/messages`);
      return;
    }

    if (isWizard) {
      // Wizard mode: settings doesn't exist — redirect to messages
      if (isSettings) {
        router.replace(`/apps/${appId}/messages`);
      }
    } else {
      // Non-wizard (post-signup): wizard-only pages redirect to messages
      if (isSignup || isReady) {
        router.replace(`/apps/${appId}/messages`);
      }
    }
  }, [isWizard, isOverview, isSettings, isOptIn, isSignup, isReady, isGetStarted, isRegisterFlow, appId, router]);

  // Handle state switcher changes — redirect if current page is invalid for new state
  function handleStateChange(newState: RegistrationState) {
    const wasWizard = state.registrationState === "onboarding";
    const willBeWizard = newState === "onboarding";
    setRegistrationState(newState);

    if (willBeWizard && !wasWizard) {
      // Switching TO wizard: redirect settings to messages
      if (isSettings) {
        router.replace(`/apps/${appId}/messages`);
      }
    }
    // Overview always redirects to messages regardless of state
    if (isOverview) {
      router.replace(`/apps/${appId}/messages`);
    }
  }

  // Standalone pages render without either wrapper
  if (isGetStarted) {
    return <>{children}</>;
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
