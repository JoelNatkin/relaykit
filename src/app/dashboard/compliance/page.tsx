"use client";

import { useDashboard } from "@/components/dashboard/dashboard-context";
import { ComplianceSandboxCard } from "@/components/dashboard/compliance-sandbox-card";
import { ComplianceStatusCard } from "@/components/dashboard/compliance-status-card";
import { MessageLibrary } from "@/components/dashboard/message-library";
import { Button } from "@/components/base/buttons/button";

export default function DashboardCompliancePage() {
  const { stage, canonMessageIds } = useDashboard();
  const isLive = stage === "live";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-primary">Compliance</h1>
        <p className="mt-1 text-sm text-tertiary">
          {isLive
            ? "Your registration status and message monitoring."
            : "How RelayKit protects your traffic after registration."}
        </p>
      </div>

      {!isLive && <ComplianceSandboxCard />}

      {isLive && (
        <>
          <ComplianceStatusCard />

          <div>
            <h2 className="text-sm font-semibold text-primary">
              Registered messages
            </h2>
            <p className="mt-1 text-sm text-tertiary">
              These are the messages carriers approved in your registration.
            </p>
          </div>

          <MessageLibrary canonMessageIds={canonMessageIds} />

          <Button href="#" color="link-color" size="sm">
            View your compliance site
          </Button>
        </>
      )}
    </div>
  );
}
