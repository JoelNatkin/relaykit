"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { ArrowLeft } from "@untitledui/icons";

interface WizardPageConfig {
  backHref: string | null;
  continueHref: string | null;
  dualContinue: boolean; // If true, render Continue at top AND bottom (D-318)
}

function getPageConfig(pathname: string, appId: string): WizardPageConfig {
  if (pathname.endsWith("/opt-in")) {
    // Opt-in: Back to messages, top Continue only (no dual). Signup is
    // the next step once it exists; for now Continue loops back to /messages.
    return {
      backHref: `/apps/${appId}/messages`,
      continueHref: `/apps/${appId}/messages`,
      dualContinue: false,
    };
  }
  // Messages is the first wizard step — dual Continue (D-318)
  return {
    backHref: null,
    continueHref: `/apps/${appId}/opt-in`,
    dualContinue: true,
  };
}

export function WizardLayout({ children }: { children: React.ReactNode }) {
  const { appId } = useParams<{ appId: string }>();
  const pathname = usePathname();
  const { backHref, continueHref, dualContinue } = getPageConfig(pathname, appId);

  const continueButton = continueHref ? (
    <Link
      href={continueHref}
      className="rounded-lg bg-bg-brand-solid px-4 py-2 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover"
    >
      Continue
    </Link>
  ) : null;

  return (
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

      {/* Full-width bottom Continue — aligned with nav bar right edge (D-318) */}
      {dualContinue && continueButton && (
        <div className="px-6 pt-8 pb-16 flex justify-end">
          {continueButton}
        </div>
      )}

      {/* Bottom padding when no dual continue */}
      {!dualContinue && <div className="pb-16" />}
    </div>
  );
}
