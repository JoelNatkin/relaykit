/**
 * Authored copy for the elig section verdict cards. Source: vertical-constraints
 * §9.3 (verdict shape per bucket), §9.4 (3 anchored 🟡 conditional cards),
 * §9.6 (5 🔴 anchored lines + surveillance two-tier carve-out).
 *
 * Generic fallbacks cover:
 *   - 🟡 sub-verticals without an anchored card (22 of 25 Conditional rows).
 *   - 🔴 sub-verticals beyond the 6 anchored (debt-collection-collections-tooling
 *     is the 7th 🔴 in the data — Wave 2 covers it via the generic line).
 *
 * Copy lives in this module instead of the data layer because it's marketing
 * surface (CC + Joel's voice). Future-PM tweaks of a vertical's bucket via the
 * Airtable Constraints base do not require copy re-author; future-PM authoring
 * of a new anchored card adds an entry here.
 */

import { findSubVertical } from "../../../lib/constraints";
import type { EligState } from "./use-elig-state";

/** Slug used by the surveillance carve-out's two-tier shape (§9.6). */
export const SURVEILLANCE_SLUG =
  "surveillance-employee-monitoring-spyware-adjacent";

// ─── 🟢 Clear ───────────────────────────────────────────────────────────────

export const CLEAR_LINE = "You're set — pick your messages below.";

// ─── 🟡 Conditional ─────────────────────────────────────────────────────────

export const CONDITIONAL_COLLAPSED_LINE =
  "You're set — we'll flag the rules where they apply.";

export interface ConditionalExpanded {
  /** Rendered as one <p> per entry, separated by vertical space. */
  paragraphs: readonly string[];
}

/**
 * The three §9.4 anchored cards. Pattern: channel reality → vivid trio →
 * consequence (whose harm, whose authority) → what we keep out → what we do
 * by default. Verbatim — these are voice-locked.
 */
export const ANCHORED_CONDITIONAL: Readonly<Record<string, ConditionalExpanded>> = {
  "legal-practice-tools": {
    paragraphs: [
      "SMS is open infrastructure — unencrypted and shared across screens.",
      '"Arrest." "Custody." "Bankruptcy." If the wrong eyes see these in a message, that\'s a privilege breach to a court, and can risk your registration with carriers. So specifics stay out of the message body. Case details, names, and status words move into your app, behind a link.',
      "We shape your messages this way by default, and also help you author new ones safely.",
    ],
  },
  "banking-budgeting-apps": {
    paragraphs: [
      "SMS is open infrastructure — unencrypted and shared across screens.",
      '"$4,212." "Charged at Liquor Barn." "Payment overdue." If the wrong eyes see these in a message, that\'s a privacy breach to your customer, and can risk your registration with carriers. So specifics stay out of the message body. Balances, transactions, and merchant names move into your app, behind a link.',
      "We shape your messages this way by default, and also help you author new ones safely.",
    ],
  },
  "healthcare-administrative": {
    paragraphs: [
      "SMS is open infrastructure — unencrypted and shared across screens.",
      '"Chemotherapy." "Dr. Chen, Psychiatry." "Bright Path Recovery." If the wrong eyes see these in a message, that\'s a HIPAA exposure for your practice, and can risk your registration with carriers. So specifics stay out of the message body. Conditions, providers, and facility names move into your app, behind a link.',
      "We shape your messages this way by default, and also help you author new ones safely.",
    ],
  },
};

/**
 * Generic fallback for the 22 non-anchored 🟡 sub-verticals. Mirrors the §9.4
 * anchored opener for voice consistency, then collapses the missing vivid
 * trio + per-vertical consequence into one generic line. Omits the "we
 * shape your messages by default" closer since that promise only holds where
 * we've actually shaped them.
 */
export const GENERIC_CONDITIONAL: ConditionalExpanded = {
  paragraphs: [
    "SMS is open infrastructure — unencrypted and shared across screens.",
    "Your industry has content rules that apply to certain message types. We flag them where they bite, so your messages stay compliant and your registration stays safe.",
  ],
};

export function getConditionalExpanded(
  subVerticalSlug: string,
): ConditionalExpanded {
  return ANCHORED_CONDITIONAL[subVerticalSlug] ?? GENERIC_CONDITIONAL;
}

// ─── 🟠 Not yet, maybe not ever ─────────────────────────────────────────────

export const NOT_YET_MAYBE_LINE =
  "This one's harder than we're set up for today. Get notified if it becomes available.";

// ─── ⚫ Not yet ─────────────────────────────────────────────────────────────

export const NOT_YET_LINE =
  "Coming soon. Get notified when it becomes available.";

/**
 * Multi-tenant ⚫ specific copy. Per §9.3 multi-tenant routes to the same UX
 * shape as ⚫, but a tailored line lands the "RelayKit at launch serves
 * single-tenant businesses" framing more clearly than the generic ⚫ copy.
 */
export const NOT_YET_MULTI_TENANT_LINE =
  "Multi-tenant SMS — sending on behalf of customers — isn't part of launch. Get notified when support lands.";

// ─── 🔴 Not our lane ───────────────────────────────────────────────────────

/**
 * Five of the six §9.6 anchored lines. Surveillance is the sixth, handled by
 * the two-tier carve-out constants below.
 */
export const NOT_OUR_LANE_LINES: Readonly<Record<string, string>> = {
  "cannabis-retail-dispensaries":
    "We're not able to send cannabis messages. Try searching for a specialized provider for state-regulated programs.",
  "firearms-ammunition-retail":
    "We're not able to send firearms messages. Try searching for a specialized FFL provider.",
  "vape-tobacco-nicotine-retail":
    "We're not able to send tobacco or vape messages. Try searching for an age-gated provider.",
  "adult-content-age-gated-retail":
    "We're not able to send adult-content messages. Try searching for an age-gated provider.",
  "adult-dating-hookup-apps":
    "We're not able to send messages for adult dating apps. Try searching for an age-gated provider.",
};

/** §9.6 surveillance two-tier shape — primary line in verdict card, secondary in empty state. */
export const SURVEILLANCE_PRIMARY_LINE =
  "We're not able to send messages for surveillance or covert monitoring tools.";
export const SURVEILLANCE_EMPTY_STATE_LINE = "Try searching for another provider.";

/**
 * Generic 🔴 fallback for non-anchored sub-verticals (currently:
 * debt-collection-collections-tooling). Pattern matches §9.6 — "not able"
 * framing + a non-specific redirect. PM may author a tailored line later;
 * generic stays as the safe default until then.
 */
export function genericNotOurLaneLine(subVerticalName: string): string {
  return `We're not able to send messages for ${subVerticalName.toLowerCase()}. Try searching for a specialized provider.`;
}

/**
 * Resolve the 🔴 primary line for a given sub-vertical. Surveillance returns
 * its primary; other anchored slugs return their line; everything else falls
 * back to the generic.
 */
export function getNotOurLaneLine(
  subVerticalSlug: string,
  subVerticalName: string,
): string {
  if (subVerticalSlug === SURVEILLANCE_SLUG) return SURVEILLANCE_PRIMARY_LINE;
  return (
    NOT_OUR_LANE_LINES[subVerticalSlug] ?? genericNotOurLaneLine(subVerticalName)
  );
}

// ─── 🟡 per-category cards (§9.5) ───────────────────────────────────────────

/**
 * Verification category id — content-neutral by nature (4–8 digit codes),
 * never receives a per-category card on any vertical (§9.5 carve-out).
 */
export const VERIFICATION_CATEGORY_ID = "verification";

export interface PerCategoryCardCopy {
  line: string;
}

/**
 * Three §9.5 anchored per-category card lines, keyed by sub-vertical slug.
 * Pattern: "[Specifics] are a [vertical-specific harm] risk. Link to your
 * app instead." Examples expander is deferred (Wave 3 renders the chevron
 * but does nothing on click).
 */
export const ANCHORED_PER_CATEGORY: Readonly<Record<string, PerCategoryCardCopy>> = {
  "legal-practice-tools": {
    line: "Case details, names, and status words are a privilege risk. Link to your app instead.",
  },
  "banking-budgeting-apps": {
    line: "Balances, transactions, and merchant names are a privacy risk. Link to your app instead.",
  },
  "healthcare-administrative": {
    line: "Conditions, providers, and facility names are a HIPAA risk. Link to your app instead.",
  },
};

/**
 * Generic fallback used when a 🟡 sub-vertical has rules but no anchored
 * per-category copy. Wave 3 currently has no production trigger for this
 * branch (the 22 non-anchored 🟡 sub-verticals carry zero contentRules) —
 * the fallback reserves the shape for when data evolves.
 */
export const GENERIC_PER_CATEGORY: PerCategoryCardCopy = {
  line: "Some content rules apply to your industry. Link to your app instead.",
};

export function getPerCategoryCopy(subVerticalSlug: string): PerCategoryCardCopy {
  return ANCHORED_PER_CATEGORY[subVerticalSlug] ?? GENERIC_PER_CATEGORY;
}

/**
 * For a given 🟡 sub-vertical, decide whether `categoryId` should receive a
 * per-category card. Logic:
 *   - Verification is always excluded (§9.5 content-neutral carve-out).
 *   - Else: walk the sub-vertical's contentRules; if any rule's
 *     categoriesAffected is absent (= applies to all eligible categories)
 *     OR includes the category slug, the category is affected.
 *   - Zero rules ⇒ not affected. This is the production-current behavior
 *     for the 22 unanchored 🟡 sub-verticals (no rules → no cards).
 */
export function isCategoryAffected(
  subVerticalSlug: string,
  categoryId: string,
): boolean {
  if (categoryId === VERIFICATION_CATEGORY_ID) return false;
  const sub = findSubVertical(subVerticalSlug);
  if (!sub) return false;
  for (const rule of sub.contentRules) {
    if (!rule.categoriesAffected) return true;
    if (rule.categoriesAffected.includes(categoryId)) return true;
  }
  return false;
}

// ─── interest_tag (§9.7) ────────────────────────────────────────────────────

/**
 * Derive the `interest_tag` field for the elig 🟠/⚫ inline waitlist POST.
 * Format:
 *   - 🟠 vetting interest: `vetting:{subVerticalSlug}`
 *   - ⚫ capacity-deferred: `capacity:{subVerticalSlug}`
 *   - ⚫ multi-tenant:      `multi-tenant`
 * Returns null for 🟢, 🟡, 🔴 verdicts (no waitlist there).
 */
export function eligInterestTag(state: EligState): string | null {
  if (state.multiTenant === "multi") return "multi-tenant";
  if (state.verdict.tier === "not-yet-maybe-not" && state.subVerticalSlug) {
    return `vetting:${state.subVerticalSlug}`;
  }
  if (state.verdict.tier === "not-yet" && state.subVerticalSlug) {
    return `capacity:${state.subVerticalSlug}`;
  }
  return null;
}
