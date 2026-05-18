import type { WorkflowCategory } from "./types";

export const APPOINTMENTS: WorkflowCategory = {
  id: "appointments",
  name: "Appointments",
  description:
    "Confirmations, reminders, reschedules, cancellations, no-show follow-ups.",
  tcrMapping: "ACCOUNT_NOTIFICATION",
  classification: "workflow",
  variables: [],
  compliance: { rules: [] },
  stages: [],
};
