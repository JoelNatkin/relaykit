"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { WizardStepShell } from "@/components/wizard-step-shell";
import { loadWizardData, saveWizardData } from "@/lib/wizard-storage";

export default function ContextPage() {
  const router = useRouter();
  const [context, setContext] = useState("");

  useEffect(() => {
    const data = loadWizardData();
    if (data.context) setContext(data.context);
  }, []);

  const trimmed = context.trim();

  function handleSkip() {
    saveWizardData({ context: "" });
    router.push("/apps/glowstudio/messages");
  }

  return (
    <WizardStepShell
      backHref="/start/website"
      continueHref="/apps/glowstudio/messages"
      canContinue={true}
      onBeforeContinue={() => saveWizardData({ context: trimmed })}
    >
      <h1 className="text-2xl font-bold text-text-primary">
        Anything else we should know?
      </h1>
      <p className="mt-2 text-sm text-text-tertiary">
        This helps us tailor your messages. You can always adjust later.
      </p>

      <div className="mt-8">
        <label htmlFor="context" className="mb-1.5 block text-sm font-medium text-text-secondary">
          Notes for us
        </label>
        <textarea
          id="context"
          autoFocus
          rows={4}
          value={context}
          onChange={(e) => setContext(e.target.value)}
          className="w-full rounded-lg border border-border-primary bg-bg-primary px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-placeholder shadow-xs focus:border-border-brand focus:outline-none focus:ring-2 focus:ring-border-brand/20 resize-none"
        />
        <button
          type="button"
          onClick={handleSkip}
          className="mt-3 text-sm text-text-tertiary hover:text-text-secondary hover:underline transition duration-100 ease-linear cursor-pointer"
        >
          Skip
        </button>
      </div>
    </WizardStepShell>
  );
}
