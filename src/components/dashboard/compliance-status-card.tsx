"use client";

import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { CheckCircle, AlertTriangle } from "@untitledui/icons";

interface ComplianceStats {
  total: number;
  clean: number;
  warning: number;
}

interface ComplianceStatusCardProps {
  alertCount: number;
  stats: ComplianceStats | null;
}

export function ComplianceStatusCard({
  alertCount,
  stats,
}: ComplianceStatusCardProps) {
  const hasAlerts = alertCount > 0;

  return (
    <div className="rounded-xl border border-secondary bg-primary p-6">
      <FeaturedIcon
        icon={hasAlerts ? AlertTriangle : CheckCircle}
        color={hasAlerts ? "warning" : "success"}
        theme="light"
        size="lg"
      />
      <h3 className="mt-4 text-sm font-semibold text-primary">
        {hasAlerts ? "Needs attention" : "All clear"}
      </h3>
      <p className="mt-2 text-sm text-tertiary">
        {hasAlerts
          ? `${alertCount} compliance ${alertCount === 1 ? "suggestion" : "suggestions"} for your messages. Review them below.`
          : "Your messages are within your registration. We check every message against your registered content."}
      </p>

      {stats && stats.total > 0 && (
        <div className="mt-4 flex gap-4 border-t border-secondary pt-4 text-xs text-tertiary">
          <span>{stats.total} scanned</span>
          <span className="text-fg-success-secondary">{stats.clean} clean</span>
          {stats.warning > 0 && (
            <span className="text-fg-warning-secondary">
              {stats.warning} warnings
            </span>
          )}
        </div>
      )}
    </div>
  );
}
