import type { HybridCategory } from "./types";

export const TEAM_ALERTS: HybridCategory = {
  id: "team-alerts",
  name: "Team alerts",
  description:
    "Incident pings, on-call rotation, deploy notifications, threshold breaches.",
  tcrMapping: "ACCOUNT_NOTIFICATION",
  classification: "hybrid",
  variables: [],
  compliance: { rules: [] },
  stages: [],
  subs: [],
};
