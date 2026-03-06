"use client";

import { AlertTriangle, Check } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";

interface ComplianceAlert {
  id: string;
  alert_type: string;
  rule_id: string;
  title: string;
  body: string;
  acknowledged: boolean;
  created_at: string;
}

interface DriftAlertCardProps {
  alerts: ComplianceAlert[];
  onAcknowledge: (alertId: string) => void;
}

export function DriftAlertCard({ alerts, onAcknowledge }: DriftAlertCardProps) {
  if (alerts.length === 0) return null;

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-primary">
        Compliance suggestions
      </h2>
      <p className="text-sm text-tertiary">
        These are recommendations to keep your messages aligned with carrier
        expectations.
      </p>

      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="rounded-xl border border-secondary bg-primary p-4"
        >
          <div className="flex items-start gap-3">
            <FeaturedIcon
              icon={AlertTriangle}
              color="warning"
              theme="light"
              size="sm"
            />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-primary">
                {alert.title}
              </h3>
              <p className="mt-1 text-sm text-tertiary">{alert.body}</p>
              <div className="mt-3 flex items-center gap-3">
                <span className="text-xs text-quaternary">
                  {new Date(alert.created_at).toLocaleDateString()}
                </span>
                {!alert.acknowledged && (
                  <Button
                    size="sm"
                    color="link-gray"
                    iconLeading={Check}
                    onClick={() => onAcknowledge(alert.id)}
                  >
                    Got it
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
