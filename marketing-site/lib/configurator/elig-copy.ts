/**
 * Authored copy + helpers for the elig section.
 *
 * After the configurator rework this module holds:
 *   - CONDITIONAL_NOTE_LINE — heading for the rules card. The bullets under it
 *     come from the constraint data layer (SubVertical.cardRuleBullets,
 *     authored in the Airtable Constraints base), not from this file.
 *   - NOT_OFFERED_LEAD_LINE — the ⚫/🟠 "Request it" lead sentence.
 *   - the §9.5 per-category card copy + affected-category logic.
 *   - eligInterestTag — the interest_tag for the Request-category waitlist POST.
 *   - NOT_YET_MULTI_TENANT_LINE — dormant (see note); retained for a future
 *     multi-tenant return.
 *
 * Copy lives in this module rather than the data layer because it's marketing
 * surface; per-vertical rule bullets are the exception (authored in Airtable).
 */

import { findSubVertical } from "../../../lib/constraints";
import type { EligState } from "./use-elig-state";

// ─── 🟡 Conditional ─────────────────────────────────────────────────────────

/** Heading above the customer-facing rule bullets in the rules card. */
export const CONDITIONAL_NOTE_LINE = "Your industry has a few rules.";

// ─── ⚫ Not yet + 🟠 Not yet, maybe not ever ────────────────────────────────

/**
 * Lead sentence for the 🟠/⚫ Not-yet "Request it" line shown below the message
 * stream. The configurator renders the "Request it" action alongside it.
 */
export const NOT_OFFERED_LEAD_LINE = "RelayKit doesn't offer this category.";

/**
 * DORMANT — retained for a future multi-tenant return. Multi-tenant routing was
 * removed from the elig UI in this promotion (the D1 dropdown is gone), so this
 * tailored ⚫ line is currently unused. Kept alongside the multi-tenant state
 * machinery in use-elig-state.ts so the path can be re-lit without re-authoring.
 */
export const NOT_YET_MULTI_TENANT_LINE =
  "Multi-tenant SMS — sending on behalf of customers — isn't part of launch. Get notified when support lands.";

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
 * Derive the `interest_tag` field for the elig Not-yet Request-category POST.
 * Format:
 *   - 🟠 vetting interest: `vetting:{subVerticalSlug}`
 *   - ⚫ capacity-deferred: `capacity:{subVerticalSlug}`
 *   - ⚫ multi-tenant:      `multi-tenant` (dormant — the multi-tenant entry
 *     point is removed from the UI this promotion; branch retained for a
 *     future return).
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
