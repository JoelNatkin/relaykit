"use client";

import { Button } from "@/components/base/buttons/button";
import type { UseCaseId } from "@/lib/intake/use-case-data";

const USE_CASE_LABELS: Record<UseCaseId, string> = {
  appointments: "Appointment reminders",
  orders: "Order & delivery updates",
  verification: "Verification codes",
  support: "Customer support",
  marketing: "Marketing & promos",
  internal: "Team & internal alerts",
  community: "Community & groups",
  waitlist: "Waitlist & reservations",
  exploring: "Just exploring",
};

interface UseCaseBadgeProps {
  useCase: UseCaseId;
  onChangeClick?: () => void;
}

export function UseCaseBadge({ useCase, onChangeClick }: UseCaseBadgeProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-secondary bg-secondary px-4 py-2.5">
      <span className="text-sm text-secondary">
        Building:{" "}
        <span className="font-medium text-primary">
          {USE_CASE_LABELS[useCase]}
        </span>
      </span>
      {onChangeClick && (
        <Button size="sm" color="link-color" onClick={onChangeClick}>
          Change
        </Button>
      )}
    </div>
  );
}
