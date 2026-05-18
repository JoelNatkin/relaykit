import type { DiscreteCategory } from "./types";

export const ACCOUNT_EVENTS: DiscreteCategory = {
  id: "account-events",
  name: "Account events",
  description: "Login alerts, password changes, billing notices, plan changes.",
  tcrMapping: "ACCOUNT_NOTIFICATION",
  classification: "discrete",
  variables: [],
  compliance: { rules: [] },
  subs: [],
};
