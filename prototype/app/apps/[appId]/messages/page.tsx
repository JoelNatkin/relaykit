"use client";

import Link from "next/link";
import { useSession } from "@/context/session-context";
import { SAMPLE } from "@/components/dashboard/sample-data";
import { DashboardARevised } from "@/components/dashboard/dashboard-a-revised";
import { DashboardBRevised } from "@/components/dashboard/dashboard-b-revised";
import { DashboardCRevised } from "@/components/dashboard/dashboard-c-revised";
import { ArrowRight, FileCheck02 } from "@untitledui/icons";

export default function AppMessages() {
  const { state } = useSession();
  const { appState, dashboardVersion } = state;

  // Pre-download: Messages page only, no tabs, Blueprint CTA prominent (D-97)
  if (appState === "pre-download") {
    return (
      <div className="py-8">
        {/* Blueprint CTA — hero position */}
        <div className="rounded-xl border border-border-brand bg-bg-brand-primary p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-bg-brand-secondary">
            <FileCheck02 className="size-6 text-fg-brand-primary" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-text-primary">
            Get your {SAMPLE.businessName} SMS Blueprint
          </h2>
          <p className="mt-2 text-sm text-text-tertiary max-w-md mx-auto">
            A complete integration guide with every message in the {SAMPLE.useCase.toLowerCase()} library, your sandbox API key, and platform-specific setup instructions.
          </p>
          <Link
            href="/auth"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-bg-brand-solid px-6 py-3 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover"
          >
            Get your SMS Blueprint
            <ArrowRight className="size-4" />
          </Link>
          <p className="mt-3 text-[11px] text-text-quaternary">
            Includes sandbox API key and setup instructions for Claude Code, Cursor, and Windsurf.
          </p>
        </div>

        {/* Preview of what the Blueprint includes */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-text-secondary mb-3">
            Preview: messages in this Blueprint
          </h3>
          <div className="space-y-2">
            {SAMPLE.canonMessages.map((msg, i) => (
              <div key={i} className="rounded-lg border border-border-secondary bg-bg-primary p-3">
                <p className="text-xs font-medium text-text-primary">{msg.name}</p>
                <p className="mt-1 text-xs text-text-tertiary font-mono">{msg.template}</p>
              </div>
            ))}
            <p className="text-[11px] text-text-quaternary">
              + more messages in the full {SAMPLE.useCase.toLowerCase()} library
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Post-download: render the selected dashboard version
  const DashboardComponent = {
    a: DashboardARevised,
    b: DashboardBRevised,
    c: DashboardCRevised,
  }[dashboardVersion];

  return (
    <div className="py-4">
      <DashboardComponent appState={appState} />
    </div>
  );
}
