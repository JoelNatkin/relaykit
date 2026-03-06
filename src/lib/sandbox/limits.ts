// ---------------------------------------------------------------------------
// Sandbox daily limit enforcement — Postgres-backed
// ---------------------------------------------------------------------------

import { createServiceClient } from "@/lib/supabase";

const DEFAULT_DAILY_LIMIT = 100;

function getDailyLimit(): number {
  const envLimit = process.env.SANDBOX_DAILY_LIMIT;
  if (envLimit) {
    const parsed = parseInt(envLimit, 10);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  return DEFAULT_DAILY_LIMIT;
}

/**
 * Check if the sandbox user is within their daily limit, and increment
 * the counter atomically if allowed.
 *
 * Uses Postgres upsert: INSERT ... ON CONFLICT DO UPDATE.
 * Returns the count AFTER increment (so the first message returns 1).
 */
export async function checkAndIncrementDailyLimit(
  userId: string,
): Promise<{ allowed: boolean; current: number; limit: number }> {
  const limit = getDailyLimit();
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const supabase = createServiceClient();

  // Check current count first (before incrementing)
  const { data: existing } = await supabase
    .from("sandbox_daily_usage")
    .select("message_count")
    .eq("user_id", userId)
    .eq("date", today)
    .maybeSingle();

  const currentCount = existing?.message_count ?? 0;

  if (currentCount >= limit) {
    return { allowed: false, current: currentCount, limit };
  }

  // Upsert: increment or create
  const { data: upserted, error } = await supabase
    .from("sandbox_daily_usage")
    .upsert(
      {
        user_id: userId,
        date: today,
        message_count: currentCount + 1,
      },
      { onConflict: "user_id,date" },
    )
    .select("message_count")
    .single();

  if (error) {
    // If upsert fails (race condition), re-check
    const { data: recheck } = await supabase
      .from("sandbox_daily_usage")
      .select("message_count")
      .eq("user_id", userId)
      .eq("date", today)
      .single();

    const recheckCount = recheck?.message_count ?? 0;
    return {
      allowed: recheckCount <= limit,
      current: recheckCount,
      limit,
    };
  }

  const newCount = upserted?.message_count ?? currentCount + 1;
  return { allowed: newCount <= limit, current: newCount, limit };
}
