/**
 * Shared tone helpers — extracted from configurator-section.tsx so the
 * home configurator peek (`components/configurator-peek.tsx`) and the full
 * configurator render the SAME tone pills and resolve the SAME effective
 * body per tone (D-379/D-381 — one source, no drift).
 */

import type { Message, VariantTone } from "@/lib/message-library";

export const PAGE_TONES: VariantTone[] = ["Standard", "Friendly", "Brief"];

export function tonePillClasses(active: boolean): string {
  const base =
    "rounded-full px-3 py-1.5 text-sm font-medium transition duration-100 ease-linear";
  return active
    ? `${base} bg-bg-brand-solid text-text-on-brand border border-bg-brand-solid`
    : `${base} bg-bg-primary text-text-secondary border border-border-secondary hover:bg-bg-primary_hover`;
}

/**
 * Effective body for a corpus message: hand-edited body wins, otherwise the
 * pinned tone, otherwise the page tone (D-414 / configurator-authoring §1).
 */
export function effectiveBody(
  message: Message,
  customBody: string | undefined,
  pinnedTone: VariantTone | undefined,
  pageTone: VariantTone,
): string {
  if (customBody !== undefined) return customBody;
  const tone = pinnedTone ?? pageTone;
  const v = message.variants.find((x) => x.tone === tone) ?? message.variants[0];
  return v?.body ?? "";
}
