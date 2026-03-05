"use client";

import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { CheckCircle, AlertTriangle } from "@untitledui/icons";

interface ComplianceStatusCardProps {
  /** Whether drift alerts exist. Defaults to false (all clear). */
  hasAlerts?: boolean;
}

export function ComplianceStatusCard({
  hasAlerts = false,
}: ComplianceStatusCardProps) {
  if (hasAlerts) {
    return (
      <div className="rounded-xl border border-secondary bg-primary p-6">
        <FeaturedIcon
          icon={AlertTriangle}
          color="warning"
          theme="light"
          size="lg"
        />
        <h3 className="mt-4 text-sm font-semibold text-primary">
          Drift detected
        </h3>
        <p className="mt-2 text-sm text-tertiary">
          Some messages have drifted from your registered content. Review the
          alerts below.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-secondary bg-primary p-6">
      <FeaturedIcon
        icon={CheckCircle}
        color="success"
        theme="light"
        size="lg"
      />
      <h3 className="mt-4 text-sm font-semibold text-primary">All clear</h3>
      <p className="mt-2 text-sm text-tertiary">
        Your messages are within your registration. We check every message
        against your registered content.
      </p>
    </div>
  );
}
