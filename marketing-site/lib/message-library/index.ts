/**
 * Message-library barrel — re-exports the type system and every per-category
 * data const. Import from `@/lib/message-library` rather than reaching into
 * individual files.
 */

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

export { VERIFICATION } from "./verification";
export { APPOINTMENTS } from "./appointments";
export { ORDER_UPDATES } from "./order-updates";
export { CUSTOMER_SUPPORT } from "./customer-support";
export { MARKETING } from "./marketing";
export { TEAM_ALERTS } from "./team-alerts";
export { COMMUNITY } from "./community";
export { WAITLIST } from "./waitlist";
export { ACCOUNT_EVENTS } from "./account-events";
