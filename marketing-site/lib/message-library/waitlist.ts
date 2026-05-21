import type { Category } from "./types";

export const WAITLIST: Category = {
  id: "waitlist",
  name: "Waitlist",
  description:
    "Position updates, availability openings, off-list invitations.",
  tcrMapping: "ACCOUNT_NOTIFICATION",
  variables: [],
  compliance: { rules: [] },
  messages: [],
};
