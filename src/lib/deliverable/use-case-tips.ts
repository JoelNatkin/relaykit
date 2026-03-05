import type { UseCaseId } from "@/lib/intake/use-case-data";

export const USE_CASE_TIPS: Record<UseCaseId, string> = {
  appointments:
    "RelayKit enforces quiet hours automatically \u2014 schedule sends any time and the API will block if outside 9am\u20139pm for the recipient.",
  orders:
    "Delivery update frequency can spike during shipping \u2014 RelayKit\u2019s rate limiter accounts for transactional message patterns.",
  verification:
    "OTP messages don\u2019t require opt-out language per CTIA guidelines. RelayKit won\u2019t flag these.",
  support:
    "Two-way support conversations don\u2019t require opt-out language in every reply. First message in a new conversation should include it.",
  marketing:
    "Marketing messages are subject to quiet hours (enforced automatically by RelayKit). Every marketing message must include opt-out language.",
  internal:
    "Team messages follow the same compliance rules. Recipients must opt in, even if they\u2019re employees.",
  community:
    "Group messages to large lists should be staggered. RelayKit handles queuing automatically.",
  waitlist:
    "Waitlist confirmations are time-sensitive \u2014 RelayKit prioritizes these over non-urgent messages in the queue.",
  exploring:
    "Start with a focused use case. RelayKit\u2019s sandbox lets you test each message type before committing to a registration.",
};
