"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { ArrowLeft } from "@untitledui/icons";
import { createContext, useState } from "react";

interface WizardPageConfig {
  backHref: string | null;
  continueHref: string | null;
  dualContinue: boolean; // If true, render Continue at top AND bottom (D-318)
}

export interface WizardContinueOverride {
  onClick: () => void;
  disabled: boolean;
}

/* ── Context so pages can override the header Continue button ──
   Used by signup (and future steps) that need custom onClick +
   disabled handling in the header Continue slot. */
export const WizardContinueContext = createContext<
  (override: WizardContinueOverride | null) => void
>(() => {});

function getPageConfig(pathname: string, appId: string): WizardPageConfig {
  if (pathname.endsWith("/signup")) {
    // Signup: Back to messages, single header Continue (no dual). The
    // page registers its Continue handler via WizardContinueContext.
    return {
      backHref: `/apps/${appId}/messages`,
      continueHref: null,
      dualContinue: false,
    };
  }
  // Messages: Back to the final /start intake step, dual Continue (D-318).
  // Continue advances to the signup wizard step.
  return {
    backHref: "/start/context",
    continueHref: `/apps/${appId}/signup`,
    dualContinue: true,
  };
}

export function WizardLayout({ children }: { children: React.ReactNode }) {
  const { appId } = useParams<{ appId: string }>();
  const pathname = usePathname();
  const { backHref, continueHref, dualContinue } = getPageConfig(pathname, appId);
  const [continueOverride, setContinueOverride] = useState<WizardContinueOverride | null>(null);

  // Header Continue: override (page-controlled) takes precedence over static Link
  const continueButton = continueOverride ? (
    <button
      type="button"
      onClick={continueOverride.onClick}
      disabled={continueOverride.disabled}
      className="rounded-lg bg-bg-brand-solid px-4 py-2 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover disabled:cursor-not-allowed disabled:bg-bg-disabled disabled:text-text-disabled cursor-pointer"
    >
      Continue
    </button>
  ) : continueHref ? (
    <Link
      href={continueHref}
      className="rounded-lg bg-bg-brand-solid px-4 py-2 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover"
    >
      Continue
    </Link>
  ) : null;

  // Full-width bottom Continue — matches the /start wizard step button style
  const bottomContinueButton = continueHref ? (
    <Link
      href={continueHref}
      className="block w-full rounded-lg bg-bg-brand-solid px-5 py-2.5 text-center text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover"
    >
      Continue
    </Link>
  ) : null;

  return (
    <WizardContinueContext.Provider value={setContinueOverride}>
      <div>
        {/* Full-width Back / Continue row — aligned with nav bar edges */}
        <div className="px-6 pt-6 flex items-center justify-between">
          {backHref ? (
            <Link
              href={backHref}
              className="inline-flex items-center gap-1.5 text-sm text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear"
            >
              <ArrowLeft className="size-4" />
              Back
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex items-center gap-1.5 text-sm text-text-quaternary cursor-not-allowed"
            >
              <ArrowLeft className="size-4" />
              Back
            </button>
          )}

          {continueButton}
        </div>

        {/* Centered content column */}
        <div className="mx-auto max-w-[540px] px-6 pt-6">
          {children}
        </div>

        {/* Full-width bottom Continue — spans the 540px content column (D-318) */}
        {dualContinue && bottomContinueButton && (
          <div className="mx-auto max-w-[540px] px-6 pt-10 pb-16">
            {bottomContinueButton}
          </div>
        )}

        {/* Bottom padding when no dual continue */}
        {!dualContinue && <div className="pb-16" />}
      </div>
    </WizardContinueContext.Provider>
  );
}
