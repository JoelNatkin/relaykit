"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { ArrowLeft } from "@untitledui/icons";

const WIZARD_BACK_TARGETS: Record<string, (appId: string) => string | null> = {
  messages: () => null, // No previous step yet
  "opt-in": (appId) => `/apps/${appId}/messages`,
};

export function WizardLayout({ children }: { children: React.ReactNode }) {
  const { appId } = useParams<{ appId: string }>();
  const pathname = usePathname();

  const currentPage = pathname.endsWith("/opt-in")
    ? "opt-in"
    : "messages";

  const backHref = WIZARD_BACK_TARGETS[currentPage]?.(appId) ?? null;

  return (
    <div>
      {/* Centered content column with back button above */}
      <div className="mx-auto max-w-[540px] px-6 pt-6 pb-16">
        {/* Back button row */}
        <div className="mb-6">
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
        </div>

        {children}
      </div>
    </div>
  );
}
