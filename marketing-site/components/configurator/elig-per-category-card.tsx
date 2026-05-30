"use client";

/**
 * Per-category card surfaced under affected category headers when the elig
 * verdict is 🟡 (vertical-constraints §9.5). Pattern: "[Specifics] are a
 * [vertical-specific harm] risk. Link to your app instead. Examples [▾]".
 *
 * Wave 3 renders the line + a non-functional Examples chevron (expander
 * content deferred per §9.8). Examples writing is sniff-test gated and
 * authored when customer pull demands it.
 *
 * Verification is filtered upstream — this component is never rendered for
 * the Verification category regardless of vertical (§9.5 carve-out).
 */

import { ChevronDown } from "@untitledui/icons";

export interface EligPerCategoryCardProps {
  line: string;
}

export function EligPerCategoryCard({ line }: EligPerCategoryCardProps) {
  return (
    <div className="mb-3 rounded-lg border border-border-secondary bg-bg-secondary px-3 py-2.5">
      <div className="flex items-start justify-between gap-3">
        <p className="flex-1 text-sm leading-relaxed text-text-secondary">
          {line}
        </p>
        <span
          // Examples expander deferred (§9.8). Renders the affordance shape
          // so a future wave can wire it without restructuring; today the
          // chevron is visual-only — no onClick, no aria-expanded.
          className="inline-flex shrink-0 cursor-not-allowed items-center gap-1 text-xs font-medium text-text-tertiary opacity-60"
          aria-hidden
        >
          Examples
          <ChevronDown className="size-3.5" />
        </span>
      </div>
    </div>
  );
}
