"use client";

import { AlertCircle, AlertTriangle, InfoCircle } from "@untitledui/icons";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { Button } from "@/components/base/buttons/button";
import type { IndustryGateResult } from "@/lib/intake/industry-gating";

interface IndustryGateAlertProps {
  gate: IndustryGateResult;
}

export function IndustryGateAlert({ gate }: IndustryGateAlertProps) {
  if (gate.tier === "advisory") {
    return (
      <div className="flex gap-3 rounded-xl border border-brand bg-brand-section_subtle p-4">
        <FeaturedIcon
          icon={InfoCircle}
          size="sm"
          color="brand"
          theme="light"
        />
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-primary">
            {gate.label} industry detected
          </p>
          <p className="text-sm text-tertiary">{gate.message}</p>
        </div>
      </div>
    );
  }

  if (gate.tier === "hard_decline_waitlist") {
    return (
      <div className="flex gap-3 rounded-xl border border-error bg-error-primary p-4">
        <FeaturedIcon
          icon={AlertCircle}
          size="sm"
          color="error"
          theme="light"
        />
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-primary">
            {gate.label} messaging isn&apos;t available yet
          </p>
          <p className="text-sm text-tertiary">{gate.message}</p>
          <div className="mt-2">
            <Button
              size="sm"
              color="secondary"
              href="mailto:hello@relaykit.com?subject=Healthcare%20waitlist&body=I%27d%20like%20to%20join%20the%20waitlist%20for%20healthcare%20messaging%20support."
            >
              Join the waitlist
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // hard_decline_blocked
  return (
    <div className="flex gap-3 rounded-xl border border-error bg-error-primary p-4">
      <FeaturedIcon
        icon={AlertTriangle}
        size="sm"
        color="error"
        theme="light"
      />
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-primary">
          {gate.label} messaging can&apos;t be registered
        </p>
        <p className="text-sm text-tertiary">{gate.message}</p>
      </div>
    </div>
  );
}
