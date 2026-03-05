"use client";

import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { ShieldTick } from "@untitledui/icons";

export function ComplianceSandboxCard() {
  return (
    <div className="rounded-xl border border-secondary bg-primary p-6">
      <FeaturedIcon
        icon={ShieldTick}
        color="brand"
        theme="light"
        size="lg"
      />
      <h3 className="mt-4 text-sm font-semibold text-primary">
        Compliance monitoring activates when you go live
      </h3>
      <p className="mt-2 text-sm text-tertiary">
        In sandbox, the same checks run on every message — check your API
        responses for details on what passed and what didn&apos;t.
      </p>
      <p className="mt-2 text-sm text-tertiary">
        Once you register, this tab shows your registration status, registered
        messages, and any drift alerts.
      </p>
    </div>
  );
}
