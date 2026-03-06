// ---------------------------------------------------------------------------
// Marketing consent check — MIXED tier only (D-14)
// ---------------------------------------------------------------------------
// Classifies messages as marketing vs transactional using keyword heuristics.
// If marketing, verifies explicit consent exists in recipient_consents table.

import { createServiceClient } from "@/lib/supabase";

/** Promotional keywords that signal marketing content. */
const MARKETING_SIGNALS = [
  /\b(?:\d+%?\s*off)\b/i,
  /\bdiscount\b/i,
  /\bsale\b/i,
  /\bpromo(?:tion|tional)?\b/i,
  /\bcoupon\b/i,
  /\bdeal\b/i,
  /\blimited\s+time\b/i,
  /\bspecial\s+offer\b/i,
  /\bflash\s+sale\b/i,
  /\bfree\s+(?:shipping|delivery|trial)\b/i,
  /\bbuy\s+one\s+get\b/i,
  /\bexclusive\s+(?:offer|deal|access)\b/i,
  /\bsave\s+\$?\d+/i,
  /\bearlybird\b/i,
  /\bearly\s+bird\b/i,
  /\bnewsletter\b/i,
  /\bsubscri(?:be|ption)\b/i,
];

/**
 * Classify a message body as marketing or transactional.
 * Uses simple keyword heuristics — not ML.
 */
export function classifyMessageType(
  body: string,
): "transactional" | "marketing" {
  for (const pattern of MARKETING_SIGNALS) {
    if (pattern.test(body)) {
      return "marketing";
    }
  }
  return "transactional";
}

/**
 * Check whether a recipient has active marketing consent for a customer.
 * Returns true if consent exists and has not been revoked.
 */
export async function checkMarketingConsent(
  customerId: string,
  phoneNumber: string,
): Promise<boolean> {
  const supabase = createServiceClient();

  const { data } = await supabase
    .from("recipient_consents")
    .select("id")
    .eq("customer_id", customerId)
    .eq("phone_number", phoneNumber)
    .eq("consent_type", "marketing")
    .is("revoked_at", null)
    .limit(1)
    .maybeSingle();

  return !!data;
}
