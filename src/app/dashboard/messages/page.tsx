"use client";

import { useDashboard } from "@/components/dashboard/dashboard-context";
import { MessageLibrary } from "@/components/dashboard/message-library";
import { GoLiveCta } from "@/components/dashboard/go-live-cta";
import { Button } from "@/components/base/buttons/button";
import { ArrowLeft } from "@untitledui/icons";

export default function DashboardMessagesPage() {
  const { stage, canonMessageIds } = useDashboard();

  const isRegistered = stage === "live" || stage === "registering";

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-lg font-semibold text-primary">Messages</h1>
        <p className="text-sm text-tertiary">
          {isRegistered
            ? "Your message library — registered messages are marked with a star."
            : "Your message library — a read-only view of your plan. Edit messages on the Overview tab."}
        </p>
      </div>

      {!isRegistered && (
        <Button
          href="/dashboard"
          color="link-color"
          size="sm"
          iconLeading={ArrowLeft}
        >
          Edit your message plan
        </Button>
      )}

      <MessageLibrary canonMessageIds={canonMessageIds} />

      {stage === "ready" && <GoLiveCta variant="default" />}
    </div>
  );
}
