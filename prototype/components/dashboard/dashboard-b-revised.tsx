"use client";

import { useState } from "react";
import type { AppState } from "@/context/session-context";
import { SAMPLE } from "./sample-data";
import {
  BlueprintHeroCard,
  SandboxApiKeyCard,
  DualApiKeysCard,
  GoLiveCTA,
  CelebrationCard,
  UsageStatsCard,
  CanonMessagesCard,
  MessagesLink,
  Card,
  CardTitle,
} from "./shared";

/**
 * Dashboard B — Tabbed workspace (leading candidate).
 * The per-app layout already provides Messages/Compliance/Settings tabs.
 * B's messages view focuses on the message catalog with contextual info at top.
 */
export function DashboardBRevised({ appState }: { appState: AppState }) {
  const [celebrationDismissed, setCelebrationDismissed] = useState(false);

  if (appState === "sandbox") {
    return (
      <div className="space-y-5">
        <BlueprintHeroCard />

        {/* Quick stats strip */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="text-center">
            <p className="text-2xl font-bold text-text-brand-secondary">0</p>
            <p className="text-xs text-text-tertiary">Messages sent</p>
          </Card>
          <Card className="text-center">
            <p className="text-2xl font-bold text-text-primary">1</p>
            <p className="text-xs text-text-tertiary">Test number</p>
          </Card>
          <Card className="text-center">
            <p className="text-2xl font-bold text-text-success-primary">Live</p>
            <p className="text-xs text-text-tertiary">Sandbox status</p>
          </Card>
        </div>

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

      {/* Registration info strip */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Registration</CardTitle>
            <p className="mt-1 text-xs text-text-tertiary">
              Campaign {SAMPLE.campaignSid} · Approved {SAMPLE.approvalDate}
            </p>
          </div>
          <span className="inline-flex items-center rounded-full bg-bg-success-secondary px-2.5 py-1 text-xs font-medium text-text-success-primary">
            Live
          </span>
        </div>
      </Card>

      <DualApiKeysCard />
      <CanonMessagesCard />
      <MessagesLink />
    </div>
  );
}
