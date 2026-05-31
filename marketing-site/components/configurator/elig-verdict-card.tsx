"use client";

/**
 * Verdict card under the elig dropdowns. Renders a quiet "i" rules card for any
 * sub-vertical that carries customer-facing rule bullets:
 *
 *   🟢 clear              — nothing (the message stream below is the confirmation).
 *   🟡 conditional        — rules card listing the customer-facing bullets.
 *   ⚫ / 🟠 not-yet        — same rules card (the category is still offered as a
 *                           free draft; the "Request it" line sits below the stream).
 *   🔴 not-our-lane       — nothing (those sub-verticals are unselectable).
 *
 * In every case the card is suppressed when the sub-vertical carries no bullets.
 * Bullets come from the constraint data layer (SubVertical.cardRuleBullets,
 * authored in the Airtable Constraints base "Card rule bullets" column, landed
 * via connector regeneration). Until that data lands, the card is suppressed.
 *
 * Brand-system note: §9.3 calls for a "blue" info card, but the post-D-405
 * monochrome warm-neutral palette has no chromatic accent — the card uses a
 * neutral surface lift + a quiet quaternary "i" icon.
 */

import { InfoCircle } from "@untitledui/icons";
import { getRuleSummaries } from "../../../lib/constraints";
import type { EligState } from "@/lib/configurator/use-elig-state";
import { CONDITIONAL_NOTE_LINE } from "@/lib/configurator/elig-copy";

export interface EligVerdictCardProps {
  state: EligState;
}

export function EligVerdictCard({ state }: EligVerdictCardProps) {
  const tier = state.verdict.tier;
  // The rules card surfaces wherever a sub-vertical carries customer-facing
  // bullets: 🟡 Conditional and both Not-yet buckets (🟠/⚫). 🟢 Clear and 🔴
  // Not-our-lane never carry bullets, so they fall through the empty check below.
  if (
    (tier !== "conditional" &&
      tier !== "not-yet" &&
      tier !== "not-yet-maybe-not") ||
    !state.subVerticalSlug
  ) {
    return null;
  }

  const bullets = getRuleSummaries(state.subVerticalSlug);
  // Suppress the card entirely where no customer-facing bullets exist — no
  // heading-only tease. (Empty everywhere until the Airtable "Card rule bullets"
  // column lands via connector regeneration.)
  if (bullets.length === 0) return null;

  return <RulesCard heading={CONDITIONAL_NOTE_LINE} bullets={bullets} />;
}

// ─── 🟡 Conditional rules card ──────────────────────────────────────────────
// Quiet "i" info note + flat, always-visible customer-facing rule bullets.

interface RulesCardProps {
  heading: string;
  bullets: readonly string[];
}

function RulesCard({ heading, bullets }: RulesCardProps) {
  return (
    <div className="rounded-xl border border-border-secondary bg-bg-primary p-4 shadow-xs dark:bg-bg-secondary">
      <div className="flex items-start gap-2">
        <InfoCircle className="mt-0.5 size-4 shrink-0 text-fg-quaternary" />
        <div className="flex-1">
          <p className="text-sm text-text-secondary">{heading}</p>
          <ul className="mt-2 space-y-1">
            {bullets.map((b, i) => (
              <li
                key={i}
                className="flex gap-2 text-sm leading-relaxed text-text-tertiary"
              >
                <span aria-hidden className="text-text-quaternary">
                  •
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
