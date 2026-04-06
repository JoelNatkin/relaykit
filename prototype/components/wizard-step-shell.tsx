"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { ArrowLeft } from "@untitledui/icons";

interface WizardStepShellProps {
  /** Previous wizard step path. Hidden if omitted. */
  backHref?: string;
  /** Next wizard step path. */
  continueHref: string;
  /** Whether Continue is enabled. */
  canContinue: boolean;
  /** Called just before navigation — persist to sessionStorage here. */
  onBeforeContinue?: () => void;
  /** Optional content rendered below the Continue button (e.g. Skip link). */
  afterContinue?: ReactNode;
  /** Override the default 540px max width. */
  maxWidth?: string;
  children: ReactNode;
}

export function WizardStepShell({
  backHref,
  continueHref,
  canContinue,
  onBeforeContinue,
  afterContinue,
  maxWidth,
  children,
}: WizardStepShellProps) {
  const router = useRouter();

  function handleContinue() {
    if (!canContinue) return;
    onBeforeContinue?.();
    router.push(continueHref);
  }

  return (
    <div className={`mx-auto w-full px-6 py-12 ${maxWidth ? "" : "max-w-[540px]"}`} style={maxWidth ? { maxWidth } : undefined}>
      {/* Back row */}
      <div className="mb-10 h-5">
        {backHref && (
          <button
            type="button"
            onClick={() => router.push(backHref)}
            className="inline-flex items-center gap-1.5 text-sm text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            Back
          </button>
        )}
      </div>

      {/* Body */}
      {children}

      {/* Continue */}
      <button
        type="button"
        onClick={handleContinue}
        disabled={!canContinue}
        className="mt-10 w-full rounded-lg bg-bg-brand-solid px-5 py-2.5 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover disabled:cursor-not-allowed disabled:bg-bg-disabled disabled:text-text-disabled cursor-pointer"
      >
        Continue
      </button>

      {afterContinue}
    </div>
  );
}
