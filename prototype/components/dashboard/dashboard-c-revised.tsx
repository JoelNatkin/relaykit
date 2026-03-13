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
  CopyButton,
} from "./shared";

/**
 * Dashboard C — Card-based grid (mission control).
 * Content organized in responsive card grid. Each card is a distinct unit.
 */
export function DashboardCRevised({ appState }: { appState: AppState }) {
  const [celebrationDismissed, setCelebrationDismissed] = useState(false);

  if (appState === "sandbox") {
    return (
      <div className="space-y-5">
        {/* Blueprint hero — full width */}
        <BlueprintHeroCard />

        {/* Grid of cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Sandbox API key */}
          <Card>
            <CardTitle>Sandbox API key</CardTitle>
            <div className="mt-2 flex items-center gap-2">
              <code className="flex-1 truncate rounded-md bg-bg-secondary px-3 py-2 text-sm font-mono text-text-primary">
                {SAMPLE.sandboxApiKey}
              </code>
              <CopyButton text={SAMPLE.sandboxApiKey} />
            </div>
          </Card>

          {/* Test number */}
          <Card>
            <CardTitle>Test number</CardTitle>
            <p className="mt-2 text-sm text-text-primary">{SAMPLE.phone}</p>
            <p className="mt-1 text-xs text-text-tertiary">
              Sandbox messages go here so you can test as you build.
            </p>
          </Card>

          {/* Messages link */}
          <MessagesLink />

          {/* Go live */}
          <GoLiveCTA />
        </div>
      </div>
    );
  }

  // Live state
  return (
    <div className="space-y-5">
      {!celebrationDismissed && (
        <CelebrationCard onDismiss={() => setCelebrationDismissed(true)} />
      )}

      {/* Grid of cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Usage */}
        <div className="md:col-span-2">
          <UsageStatsCard />
        </div>

        {/* API keys */}
        <DualApiKeysCard />

        {/* Registration status */}
        <Card>
          <CardTitle>Registration</CardTitle>
          <div className="mt-2 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-tertiary">Campaign</span>
              <span className="text-xs font-mono text-text-primary">{SAMPLE.campaignSid}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-tertiary">Approved</span>
              <span className="text-xs text-text-primary">{SAMPLE.approvalDate}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-tertiary">Status</span>
              <span className="inline-flex items-center rounded-full bg-bg-success-secondary px-2 py-0.5 text-[11px] font-medium text-text-success-primary">
                Live
              </span>
            </div>
          </div>
        </Card>

        {/* Canon messages — full width */}
        <div className="md:col-span-2">
          <CanonMessagesCard />
        </div>

        {/* Messages link */}
        <MessagesLink />
      </div>
    </div>
  );
}
