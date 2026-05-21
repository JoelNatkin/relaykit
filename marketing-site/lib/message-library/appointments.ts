import type { Category } from "./types";

export const APPOINTMENTS: Category = {
  id: "appointments",
  name: "Appointments",
  description:
    "Confirmations, reminders, reschedules, cancellations, no-show follow-ups.",
  tcrMapping: "ACCOUNT_NOTIFICATION",
  variables: [],
  compliance: { rules: [] },
  messages: [],
};
