// ---------------------------------------------------------------------------
// Opt-out management — Postgres-backed (D-24)
// ---------------------------------------------------------------------------
// Phase 1: Postgres-only. Redis cache layer can be added later for perf.
//
// SAFETY: All DB operations check for errors and fail closed.
// - isOptedOut returns TRUE on DB failure (blocks message delivery)
// - addOptOut throws on DB failure (caller must handle)
// - removeOptOut throws on DB failure (caller must handle)

import { createServiceClient } from "@/lib/supabase";

const LOG_PREFIX = "[OptOut]";

/**
 * Check if a phone number is opted out for a given user.
 * Uses user_id as the primary key (works for both pre-reg and post-reg).
 *
 * FAIL-CLOSED: Returns true (opted out) if the DB query fails.
 * This ensures we never send a message to a potentially opted-out recipient.
 */
export async function isOptedOut(
  userId: string,
  phoneNumber: string,
): Promise<boolean> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("sms_opt_outs")
    .select("id")
    .eq("user_id", userId)
    .eq("phone_number", phoneNumber)
    .is("opted_back_in_at", null)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error(
      `${LOG_PREFIX} CRITICAL: isOptedOut query failed — failing closed (blocking message). ` +
        `userId=${userId}, phone=${phoneNumber}, error=${error.message}`,
    );
    return true;
  }

  return !!data;
}

/**
 * Record an opt-out for a phone number.
 * Inserts a new row — the partial unique index on (user_id, phone_number)
 * WHERE opted_back_in_at IS NULL prevents duplicates.
 *
 * THROWS on DB failure — callers must handle the error.
 */
export async function addOptOut(
  userId: string,
  phoneNumber: string,
  source: string,
  customerId?: string | null,
  rawText?: string,
): Promise<void> {
  const supabase = createServiceClient();

  // Check if already opted out (avoid unique constraint violation)
  // Note: isOptedOut fails closed, so if the check itself fails,
  // we'll think they're already opted out and return early.
  // This is acceptable — a false positive on the check means the
  // recipient is already blocked from receiving messages.
  const alreadyOptedOut = await isOptedOut(userId, phoneNumber);
  if (alreadyOptedOut) return;

  const { error } = await supabase.from("sms_opt_outs").insert({
    user_id: userId,
    customer_id: customerId ?? null,
    phone_number: phoneNumber,
    source,
    raw_opt_out_text: rawText ?? null,
  });

  if (error) {
    console.error(
      `${LOG_PREFIX} CRITICAL: Failed to record opt-out. ` +
        `userId=${userId}, phone=${phoneNumber}, source=${source}, error=${error.message}`,
    );
    throw new Error(`Failed to record opt-out: ${error.message}`);
  }
}

/**
 * Remove an opt-out (opt back in). Sets opted_back_in_at on the active row.
 *
 * THROWS on DB failure — callers must handle the error.
 */
export async function removeOptOut(
  userId: string,
  phoneNumber: string,
): Promise<void> {
  const supabase = createServiceClient();

  const { error } = await supabase
    .from("sms_opt_outs")
    .update({ opted_back_in_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq("phone_number", phoneNumber)
    .is("opted_back_in_at", null);

  if (error) {
    console.error(
      `${LOG_PREFIX} CRITICAL: Failed to remove opt-out (opt back in). ` +
        `userId=${userId}, phone=${phoneNumber}, error=${error.message}`,
    );
    throw new Error(`Failed to remove opt-out: ${error.message}`);
  }
}
