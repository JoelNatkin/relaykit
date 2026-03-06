"use client";

import { useCallback, useEffect, useState } from "react";
import { useDashboard } from "@/components/dashboard/dashboard-context";
import { ComplianceSandboxCard } from "@/components/dashboard/compliance-sandbox-card";
import { ComplianceStatusCard } from "@/components/dashboard/compliance-status-card";
import { DriftAlertCard } from "@/components/dashboard/drift-alert-card";
import { MessageLibrary } from "@/components/dashboard/message-library";
import { Button } from "@/components/base/buttons/button";

interface ComplianceAlert {
  id: string;
  alert_type: string;
  rule_id: string;
  title: string;
  body: string;
  acknowledged: boolean;
  created_at: string;
}

interface ComplianceStats {
  total: number;
  clean: number;
  warning: number;
}

export default function DashboardCompliancePage() {
  const { stage, canonMessageIds } = useDashboard();
  const isLive = stage === "live";

  const [alerts, setAlerts] = useState<ComplianceAlert[]>([]);
  const [stats, setStats] = useState<ComplianceStats | null>(null);

  useEffect(() => {
    if (!isLive) return;
    fetch("/api/compliance/alerts")
      .then((res) => res.json())
      .then((data) => {
        setAlerts(data.alerts ?? []);
        setStats(data.stats ?? null);
      });
  }, [isLive]);

  const handleAcknowledge = useCallback((alertId: string) => {
    fetch("/api/compliance/alerts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alert_id: alertId }),
    }).then((res) => {
      if (res.ok) {
        setAlerts((prev) =>
          prev.map((a) =>
            a.id === alertId ? { ...a, acknowledged: true } : a,
          ),
        );
      }
    });
  }, []);

  const unacknowledgedAlerts = alerts.filter((a) => !a.acknowledged);

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
          <ComplianceStatusCard
            alertCount={unacknowledgedAlerts.length}
            stats={stats}
          />

          <DriftAlertCard
            alerts={unacknowledgedAlerts}
            onAcknowledge={handleAcknowledge}
          />

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
