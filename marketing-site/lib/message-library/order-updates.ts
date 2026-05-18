import type { WorkflowCategory } from "./types";

export const ORDER_UPDATES: WorkflowCategory = {
  id: "order-updates",
  name: "Order updates",
  description:
    "Shipping confirmations, delivery alerts, return status, refund notices.",
  tcrMapping: "DELIVERY_NOTIFICATION",
  classification: "workflow",
  variables: [],
  compliance: { rules: [] },
  stages: [],
};
