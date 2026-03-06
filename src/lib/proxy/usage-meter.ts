// ---------------------------------------------------------------------------
// Usage metering — increment message_usage for billing period
// ---------------------------------------------------------------------------

import { createServiceClient } from "@/lib/supabase";

/**
 * Increment the message count for the current billing period.
 * Fire-and-forget — does not throw.
 *
 * Upserts into the existing `message_usage` table. If no row exists
 * for the current billing period, creates one with a 30-day window.
 */
export function incrementUsage(customerId: string): void {
  const supabase = createServiceClient();
  const now = new Date();

  // Billing period: 30-day rolling from the 1st of the current month
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split("T")[0];
  const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toISOString()
    .split("T")[0];

  // Try to increment existing row first
  supabase
    .from("message_usage")
    .select("id, message_count")
    .eq("customer_id", customerId)
    .gte("billing_period_start", periodStart)
    .lte("billing_period_end", periodEnd)
    .maybeSingle()
    .then(async ({ data }) => {
      if (data) {
        // Increment existing
        const { error } = await supabase
          .from("message_usage")
          .update({ message_count: data.message_count + 1 })
          .eq("id", data.id);
        if (error) console.error("[UsageMeter] Failed to increment usage:", error);
      } else {
        // Create new billing period row
        const { error } = await supabase.from("message_usage").insert({
          customer_id: customerId,
          billing_period_start: periodStart,
          billing_period_end: periodEnd,
          message_count: 1,
          blocks_billed: 0,
        });
        if (error) console.error("[UsageMeter] Failed to create usage row:", error);
      }
    });
}
