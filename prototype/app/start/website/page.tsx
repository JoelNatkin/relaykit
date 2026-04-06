"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { WizardStepShell } from "@/components/wizard-step-shell";
import { loadWizardData, saveWizardData } from "@/lib/wizard-storage";

export default function WebsitePage() {
  const router = useRouter();
  const [website, setWebsite] = useState("");

  useEffect(() => {
    const data = loadWizardData();
    if (data.website) setWebsite(data.website);
  }, []);

  const trimmed = website.trim();

  function handleSkip() {
    saveWizardData({ website: "" });
    router.push("/start/context");
  }

  return (
    <WizardStepShell
      backHref="/start/details"
      continueHref="/start/context"
      canContinue={true}
      onBeforeContinue={() => saveWizardData({ website: trimmed })}
      afterContinue={
        <button
          type="button"
          onClick={handleSkip}
          className="mt-3 block w-full text-center text-sm text-text-tertiary hover:text-text-secondary hover:underline transition duration-100 ease-linear cursor-pointer"
        >
          Skip
        </button>
      }
    >
      <h1 className="text-2xl font-bold text-text-primary">
        Do you have a website?
      </h1>
      <p className="mt-2 text-sm text-text-tertiary">
        We&apos;ll link to it in your messages so customers can find you online.
      </p>

      <div className="mt-8">
        <label htmlFor="website" className="mb-1.5 block text-sm font-medium text-text-secondary">
          Website URL
        </label>
        <input
          id="website"
          type="url"
          autoFocus
          inputMode="url"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="glowstudio.com"
          className="w-full rounded-lg border border-border-primary bg-bg-primary px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-placeholder shadow-xs focus:border-border-brand focus:outline-none focus:ring-2 focus:ring-border-brand/20"
        />
      </div>
    </WizardStepShell>
  );
}
