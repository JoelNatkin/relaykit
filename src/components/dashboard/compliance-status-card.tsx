"use client";

import { BadgeWithDot } from "@/components/base/badges/badges";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { CheckCircle, AlertTriangle } from "@untitledui/icons";

interface ComplianceStats {
  total: number;
  clean: number;
  blocked: number;
  warnings: number;
}

interface ComplianceStatusCardProps {
  status: "good" | "attention";
  stats: ComplianceStats;
  driftMessage?: string;
}

export function ComplianceStatusCard({
  status,
  stats,
  driftMessage,
}: ComplianceStatusCardProps) {
  const isGood = status === "good";

  return (
    <div className="rounded-xl border border-secondary bg-primary p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <FeaturedIcon
            icon={isGood ? CheckCircle : AlertTriangle}
            color={isGood ? "success" : "warning"}
            theme="light"
            size="lg"
          />
          <div>
            <h3 className="text-sm font-semibold text-primary">
              Compliance status
            </h3>
            <p className="mt-0.5 text-sm text-tertiary">
              How your messages are tracking against your registration.
            </p>
          </div>
        </div>
        <BadgeWithDot
          size="md"
          color={isGood ? "success" : "warning"}
          type="pill-color"
        >
          {isGood ? "Good" : "Needs attention"}
        </BadgeWithDot>
      </div>

      <div className="mt-5 flex flex-wrap gap-6 border-t border-secondary pt-4 text-sm">
        <div>
          <span className="text-tertiary">Messages this period</span>
          <span className="ml-2 font-semibold text-primary">{stats.total}</span>
        </div>
        <div className="flex gap-4 text-sm">
          <span className="text-fg-success-secondary">
            {stats.clean} clean
          </span>
          <span className="text-fg-error-secondary">
            {stats.blocked} blocked
          </span>
          <span className="text-fg-warning-secondary">
            {stats.warnings} warnings
          </span>
        </div>
      </div>

      {driftMessage && (
        <div className="mt-4 rounded-lg border border-warning bg-warning-secondary px-4 py-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-fg-warning-secondary" />
            <p className="text-sm text-primary">{driftMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
