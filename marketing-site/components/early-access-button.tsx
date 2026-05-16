"use client";

/**
 * Client-side "Get early access" button that opens the waitlist modal.
 *
 * Exists so server components (e.g. app/page.tsx) can render a modal-opening
 * CTA without becoming client components themselves. Top-nav and the
 * configurator are already client components and call `openModal` directly.
 */

import type { ReactNode } from "react";
import { type CtaSource, useWaitlist } from "@/context/waitlist-context";

export function EarlyAccessButton({
  source,
  className,
  children,
}: {
  source: CtaSource;
  className?: string;
  children: ReactNode;
}) {
  const { openModal } = useWaitlist();
  return (
    <button type="button" className={className} onClick={() => openModal(source)}>
      {children}
    </button>
  );
}
