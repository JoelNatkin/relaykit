/**
 * Message-library barrel — re-exports the type system, every per-category data
 * const, and the ordered `CATEGORIES` list. Import from `@/lib/message-library`
 * rather than reaching into individual files.
 */

import type { Category } from "./types";
import { VERIFICATION } from "./verification";
import { APPOINTMENTS } from "./appointments";
import { ORDER_UPDATES } from "./order-updates";
import { CUSTOMER_SUPPORT } from "./customer-support";
import { MARKETING } from "./marketing";
import { TEAM_ALERTS } from "./team-alerts";
import { COMMUNITY } from "./community";
import { WAITLIST } from "./waitlist";
import { ACCOUNT_EVENTS } from "./account-events";

export type {
  Classification,
  TCRMapping,
  VariantTone,
  VariableSource,
  Variable,
  MessageVariant,
  Message,
  CategoryCompliance,
  Sub,
  Stage,
  DiscreteCategory,
  WorkflowCategory,
  HybridCategory,
  Category,
} from "./types";

export { SHARED_VARIABLES } from "./shared-variables";
export {
  interpolateBody,
  extractTokens,
  flattenBody,
  resolveVariableExample,
} from "./render";
export type { InterpolatedSegment } from "./render";

export {
  VERIFICATION,
  APPOINTMENTS,
  ORDER_UPDATES,
  CUSTOMER_SUPPORT,
  MARKETING,
  TEAM_ALERTS,
  COMMUNITY,
  WAITLIST,
  ACCOUNT_EVENTS,
};

/**
 * Every category in configurator display order — Verification (the only
 * authored category at launch) leads, the eight "Coming soon" categories
 * follow.
 */
export const CATEGORIES: Category[] = [
  VERIFICATION,
  MARKETING,
  APPOINTMENTS,
  ORDER_UPDATES,
  CUSTOMER_SUPPORT,
  TEAM_ALERTS,
  COMMUNITY,
  WAITLIST,
  ACCOUNT_EVENTS,
];

/** Subs of a category, regardless of classification (workflow categories have none). */
export function categorySubs(category: Category) {
  return "subs" in category ? category.subs : [];
}

/** True when a category has authored content — drives live vs. "Coming soon" rendering. */
export function isAuthored(category: Category): boolean {
  const hasGroups =
    ("subs" in category && category.subs.length > 0) ||
    ("stages" in category && category.stages.length > 0);
  return (
    hasGroups &&
    category.variables.length > 0 &&
    category.compliance.rules.length > 0
  );
}
