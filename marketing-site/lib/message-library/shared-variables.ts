/**
 * Cross-corpus variable catalog.
 *
 * Every category's own `variables` catalog is a selection of these entries plus
 * any category-specific variables. Categories pick entries by key — e.g.
 * `SHARED_VARIABLES.business_name` — rather than redefining them.
 */

import type { Variable } from "./types";

export const SHARED_VARIABLES = {
  business_name: {
    name: "business_name",
    description: "Developer's business name as it appears to end-users.",
    budgetChars: 25,
    source: "workspace settings",
    example: "Acme",
  },
  workspace_name: {
    name: "workspace_name",
    description:
      "Per D-398, appears by default in every Account events / Customer support / Team alerts template.",
    budgetChars: 30,
    source: "workspace settings",
    example: "Acme Engineering",
  },
  customer_name: {
    name: "customer_name",
    description: "End-user's full name as the developer knows it.",
    budgetChars: 30,
    source: "SDK call payload",
    example: "Olivia Rhye",
  },
  first_name: {
    name: "first_name",
    description: "End-user's first name.",
    budgetChars: 15,
    source: "SDK call payload",
    example: "Olivia",
  },
} satisfies Record<string, Variable>;
