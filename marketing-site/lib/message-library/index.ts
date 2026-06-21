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
import { DOCUMENTS } from "./documents";

export type {
  TCRMapping,
  VariantTone,
  VariableSource,
  Variable,
  MessageVariant,
  Message,
  CategoryCompliance,
  Category,
} from "./types";

export { SHARED_VARIABLES } from "./shared-variables";
export {
  interpolateBody,
  extractTokens,
  flattenBody,
  resolveVariableExample,
  isIdentityToken,
} from "./render";
export type { InterpolatedSegment, ResolveOptions } from "./render";

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
  DOCUMENTS,
};

/**
 * Every category in configurator display order. Authored categories (with
 * non-empty `messages`, `variables`, and `compliance.rules`) render live;
 * unauthored categories render in a disabled "Coming soon" state.
 */
export const CATEGORIES: Category[] = [
  VERIFICATION,
  APPOINTMENTS,
  ORDER_UPDATES,
  CUSTOMER_SUPPORT,
  TEAM_ALERTS,
  COMMUNITY,
  WAITLIST,
  ACCOUNT_EVENTS,
  DOCUMENTS,
  MARKETING,
];

/** True when a category has authored content — drives live vs. "Coming soon" rendering. */
export function isAuthored(category: Category): boolean {
  return (
    category.messages.length > 0 &&
    category.variables.length > 0 &&
    category.compliance.rules.length > 0
  );
}
