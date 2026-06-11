"use client";

/**
 * Verdict card under the elig dropdowns. Renders a quiet "i" rules card for any
 * sub-vertical that carries customer-facing rule bullets:
 *
 *   🟢 clear              — nothing (the message stream below is the confirmation).
 *   🟡 conditional        — rules card listing the customer-facing bullets.
 *   ⚫ / 🟠 not-yet        — same rules card, plus a "Request it" footer below the
 *                           bullets (the category is still offered as a free draft).
 *   🔴 not-our-lane       — nothing (those sub-verticals are unselectable).
 *
 * In every case the card is suppressed when the sub-vertical carries no bullets.
 * Bullets come from the constraint data layer (SubVertical.cardRuleBullets,
 * authored in the Airtable Constraints base "Card rule bullets" column, landed
 * via connector regeneration). Until that data lands, the card is suppressed.
 *
 * The Not-yet footer is only a trigger — its "Request it" link calls onRequest,
 * which opens the EligRequestModal owned by configurator-section (modal markup +
 * open/close state stay there).
 *
 * Brand-system note: §9.3 calls for a "blue" info card, but the post-D-405
 * monochrome warm-neutral palette has no chromatic accent — the card uses a
 * neutral surface lift + a quiet quaternary "i" icon.
 */

import { AlertTriangle, InfoCircle, XClose } from "@untitledui/icons";
import { getRuleSummaries } from "../../../lib/constraints";
import type { EligState } from "@/lib/configurator/use-elig-state";
import {
  CONDITIONAL_NOTE_LINE,
  NOT_OFFERED_LEAD_LINE,
} from "@/lib/configurator/elig-copy";

export type AdvisorySeverity = "info" | "warning";

/**
 * Presentation-only derivation of whether the advisory rules card has anything
 * to show for the current verdict, and at what severity. Pure read of the
 * already-derived verdict.tier + the existing cardRuleBullets data — no
 * eligibility logic here. Shared by EligVerdictCard (what to render) and the
 * configurator setup summary row (the severity-matched reopen icon), so the two
 * never disagree on whether an advisory exists.
 *
 *   🟡 conditional        → "info"    (rules bullets only)
 *   🟠/⚫ not-yet tiers     → "warning" (rules bullets + "Request it" footer)
 *   🟢 clear / 🔴 not-our-lane / no sub / no bullets → null (nothing to show)
 */
export function getAdvisory(
  state: EligState,
): { severity: AdvisorySeverity } | null {
  const tier = state.verdict.tier;
  // 🟡 Conditional and both Not-yet buckets (🟠/⚫) can carry bullets. 🟢 Clear
  // and 🔴 Not-our-lane never do, so they fall through the empty check below.
  if (
    (tier !== "conditional" &&
      tier !== "not-yet" &&
      tier !== "not-yet-maybe-not") ||
    !state.subVerticalSlug
  ) {
    return null;
  }
  // Suppress entirely where no customer-facing bullets exist — no heading-only
  // tease. (Empty everywhere until the Airtable "Card rule bullets" column
  // lands via connector regeneration.)
  if (getRuleSummaries(state.subVerticalSlug).length === 0) return null;
  return { severity: tier === "conditional" ? "info" : "warning" };
}

export interface EligVerdictCardProps {
  state: EligState;
  /** Opens the EligRequestModal (owned by configurator-section) from the Not-yet footer. */
  onRequest: () => void;
  /** Dismisses the card (presentation-only flag owned by configurator-section). */
  onDismiss: () => void;
}

export function EligVerdictCard({
  state,
  onRequest,
  onDismiss,
}: EligVerdictCardProps) {
  const advisory = getAdvisory(state);
  // The `!state.subVerticalSlug` re-check is redundant after getAdvisory but
  // narrows the type for getRuleSummaries without a non-null assertion.
  if (!advisory || !state.subVerticalSlug) return null;

  const bullets = getRuleSummaries(state.subVerticalSlug);
  // The "Request it" footer renders only for the Not-yet tiers (severity
  // "warning") — 🟡 Conditional shows bullets only.
  const showRequestFooter = advisory.severity === "warning";

  return (
    <RulesCard
      heading={CONDITIONAL_NOTE_LINE}
      bullets={bullets}
      showRequestFooter={showRequestFooter}
      onRequest={onRequest}
      onDismiss={onDismiss}
    />
  );
}

// ─── Rules card ─────────────────────────────────────────────────────────────
// Quiet "i" info note + flat customer-facing rule bullets. On Not-yet tiers, a
// divider + ⚠ "Request it" footer follows the bullets.

interface RulesCardProps {
  heading: string;
  bullets: readonly string[];
  showRequestFooter: boolean;
  onRequest: () => void;
  onDismiss: () => void;
}

function RulesCard({
  heading,
  bullets,
  showRequestFooter,
  onRequest,
  onDismiss,
}: RulesCardProps) {
  return (
    <div className="rounded-xl border border-border-secondary bg-surface-card p-4 shadow-xs">
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
          {showRequestFooter ? (
            <div className="mt-3 border-t border-border-secondary pt-3">
              <p className="flex items-start gap-2 text-sm leading-relaxed text-text-tertiary">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-text-tertiary" />
                <span>
                  {NOT_OFFERED_LEAD_LINE}{" "}
                  <button
                    type="button"
                    onClick={onRequest}
                    className="cursor-pointer font-medium text-text-tertiary underline transition duration-100 ease-linear hover:text-text-secondary"
                  >
                    Request it.
                  </button>
                </span>
              </p>
            </div>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="-m-1 shrink-0 cursor-pointer p-1 text-fg-quaternary transition duration-100 ease-linear hover:text-fg-secondary"
        >
          <XClose className="size-4" />
        </button>
      </div>
    </div>
  );
}
