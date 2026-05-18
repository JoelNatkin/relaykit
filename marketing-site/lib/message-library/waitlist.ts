import type { WorkflowCategory } from "./types";

export const WAITLIST: WorkflowCategory = {
  id: "waitlist",
  name: "Waitlist",
  description:
    "Position updates, availability openings, off-list invitations.",
  tcrMapping: "ACCOUNT_NOTIFICATION",
  classification: "workflow",
  variables: [],
  compliance: { rules: [] },
  stages: [],
};
