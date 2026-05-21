import type { Category } from "./types";

export const TEAM_ALERTS: Category = {
  id: "team-alerts",
  name: "Team alerts",
  description:
    "Incident pings, on-call rotation, deploy notifications, threshold breaches.",
  tcrMapping: "ACCOUNT_NOTIFICATION",
  variables: [],
  compliance: { rules: [] },
  messages: [],
};
