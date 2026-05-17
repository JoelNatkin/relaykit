import type { WorkflowCategory } from "./types";

export const WAITLIST: WorkflowCategory = {
  id: "waitlist",
  name: "Waitlist",
  tcrMapping: "ACCOUNT_NOTIFICATION",
  classification: "workflow",
  variables: [],
  compliance: { rules: [] },
  stages: [],
};
