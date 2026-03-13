"use client";

import { useState } from "react";
import type { AppState } from "@/context/session-context";
import {
  BlueprintHeroCard,
  SandboxApiKeyCard,
  DualApiKeysCard,
  GoLiveCTA,
  CelebrationCard,
  UsageStatsCard,
  CanonMessagesCard,
  MessagesLink,
} from "./shared";

/**
 * Dashboard A — Progressive single page.
 * All content flows vertically in one scroll. Blueprint is the hero in sandbox.
 */
export function DashboardARevised({ appState }: { appState: AppState }) {
  const [celebrationDismissed, setCelebrationDismissed] = useState(false);

  if (appState === "sandbox") {
    return (
      <div className="space-y-5">
        <BlueprintHeroCard />
        <SandboxApiKeyCard />
        <MessagesLink />
        <GoLiveCTA />
      </div>
    );
  }

  // Live state
  return (
    <div className="space-y-5">
      {!celebrationDismissed && (
        <CelebrationCard onDismiss={() => setCelebrationDismissed(true)} />
      )}
      <UsageStatsCard />
      <DualApiKeysCard />
      <CanonMessagesCard />
      <MessagesLink />
    </div>
  );
}
