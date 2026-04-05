"use client";

import { useEffect, useState } from "react";
import { WizardStepShell } from "@/components/wizard-step-shell";
import { loadWizardData, saveWizardData } from "@/lib/wizard-storage";

export default function BusinessNamePage() {
  const [businessName, setBusinessName] = useState("");

  // Hydrate from sessionStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    const data = loadWizardData();
    if (data.businessName) setBusinessName(data.businessName);
  }, []);

  const trimmed = businessName.trim();
  const canContinue = trimmed.length > 0;

  return (
    <WizardStepShell
      backHref="/start"
      continueHref="/start/details"
      canContinue={canContinue}
      onBeforeContinue={() => saveWizardData({ businessName: trimmed })}
    >
      <h1 className="text-2xl font-bold text-text-primary">
        What&apos;s your business called?
      </h1>
      <p className="mt-2 text-sm text-text-tertiary">
        This is how your name appears in every text message.
      </p>

      <div className="mt-8">
        <label htmlFor="business-name" className="mb-1.5 block text-sm font-medium text-text-secondary">
          Business name
        </label>
        <input
          id="business-name"
          type="text"
          autoFocus
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder="GlowStudio"
          className="w-full rounded-lg border border-border-primary bg-bg-primary px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-placeholder shadow-xs focus:border-border-brand focus:outline-none focus:ring-2 focus:ring-border-brand/20"
        />
      </div>
    </WizardStepShell>
  );
}
