"use client";

import { BadgeWithDot } from "@/components/base/badges/badges";

export interface ComplianceEvent {
  id: string;
  type: "clean" | "drift" | "blocked";
  description: string;
  timestamp: string;
}

const typeConfig = {
  clean: { label: "Clean", color: "success" as const },
  drift: { label: "Drift", color: "warning" as const },
  blocked: { label: "Blocked", color: "error" as const },
};

interface ComplianceActivityLogProps {
  events: ComplianceEvent[];
}

export function ComplianceActivityLog({ events }: ComplianceActivityLogProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-primary">Recent activity</h2>
      <div className="rounded-xl border border-secondary bg-primary">
        {events.map((event, i) => {
          const config = typeConfig[event.type];
          return (
            <div
              key={event.id}
              className={`flex items-center gap-3 px-4 py-3 ${
                i < events.length - 1 ? "border-b border-secondary" : ""
              }`}
            >
              <BadgeWithDot
                size="sm"
                color={config.color}
                type="pill-color"
              >
                {config.label}
              </BadgeWithDot>
              <span className="min-w-0 flex-1 text-sm text-tertiary">
                {event.description}
              </span>
              <span className="shrink-0 text-xs text-quaternary">
                {event.timestamp}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
