"use client";

import { AlertTriangle, Check, ArrowRight } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Badge } from "@/components/base/badges/badges";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";

export interface DriftAlert {
  id: string;
  flaggedMessage: string;
  closestCanon: {
    category: string;
    text: string;
  };
  reason: string;
  suggestedRewrite: string;
  consequence: string;
  acknowledged: boolean;
  createdAt: string;
}

interface DriftAlertCardProps {
  alerts: DriftAlert[];
  onAcknowledge: (alertId: string) => void;
}

function DriftAlertDetail({
  alert,
  onAcknowledge,
}: {
  alert: DriftAlert;
  onAcknowledge: (alertId: string) => void;
}) {
  return (
    <div className="rounded-xl border border-secondary bg-primary p-5">
      <div className="flex items-start gap-3">
        <FeaturedIcon
          icon={AlertTriangle}
          color="warning"
          theme="light"
          size="md"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-primary">
              Message drifted from your registration
            </h3>
            <Badge size="sm" color="warning" type="pill-color">
              Drift
            </Badge>
          </div>
          <p className="mt-1 text-xs text-quaternary">
            {new Date(alert.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      {/* Side-by-side comparison */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-warning bg-warning-secondary p-3">
          <p className="mb-1.5 text-xs font-medium text-fg-warning-secondary">
            Flagged message
          </p>
          <p className="font-mono text-sm text-primary">
            &ldquo;{alert.flaggedMessage}&rdquo;
          </p>
        </div>
        <div className="rounded-lg border border-secondary bg-secondary p-3">
          <p className="mb-1.5 text-xs font-medium text-tertiary">
            Closest registered message
          </p>
          <p className="text-xs text-quaternary">{alert.closestCanon.category}</p>
          <p className="mt-0.5 font-mono text-sm text-primary">
            &ldquo;{alert.closestCanon.text}&rdquo;
          </p>
        </div>
      </div>

      {/* Why it was flagged */}
      <div className="mt-4 space-y-3">
        <div>
          <p className="text-xs font-medium text-secondary">
            Why this was flagged
          </p>
          <p className="mt-0.5 text-sm text-tertiary">{alert.reason}</p>
        </div>

        {/* Suggested rewrite */}
        <div>
          <p className="text-xs font-medium text-secondary">
            Suggested compliant version
          </p>
          <div className="mt-1 flex items-start gap-2 rounded-lg border border-secondary bg-success-secondary p-3">
            <ArrowRight className="mt-0.5 size-3.5 shrink-0 text-fg-success-secondary" />
            <p className="font-mono text-sm text-primary">
              &ldquo;{alert.suggestedRewrite}&rdquo;
            </p>
          </div>
        </div>

        {/* Consequence — factual, not scary */}
        <div>
          <p className="text-xs font-medium text-secondary">
            What happens if this continues
          </p>
          <p className="mt-0.5 text-sm text-tertiary">{alert.consequence}</p>
        </div>
      </div>

      {/* Action */}
      {!alert.acknowledged && (
        <div className="mt-4 border-t border-secondary pt-4">
          <Button
            size="sm"
            color="secondary"
            iconLeading={Check}
            onClick={() => onAcknowledge(alert.id)}
          >
            Acknowledge — I&apos;ll update my messages
          </Button>
        </div>
      )}
    </div>
  );
}

export function DriftAlertCard({ alerts, onAcknowledge }: DriftAlertCardProps) {
  if (alerts.length === 0) return null;

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-primary">Drift alerts</h2>
      <p className="text-sm text-tertiary">
        These messages were flagged because they don&apos;t match your
        registered use case.
      </p>
      {alerts.map((alert) => (
        <DriftAlertDetail
          key={alert.id}
          alert={alert}
          onAcknowledge={onAcknowledge}
        />
      ))}
    </div>
  );
}
