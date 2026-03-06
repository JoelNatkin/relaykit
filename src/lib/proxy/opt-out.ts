// ---------------------------------------------------------------------------
// Opt-out management — Postgres-backed (D-24)
// ---------------------------------------------------------------------------
// Phase 1: Postgres-only. Redis cache layer can be added later for perf.

import { createServiceClient } from "@/lib/supabase";

/**
 * Check if a phone number is opted out for a given user.
 * Uses user_id as the primary key (works for both pre-reg and post-reg).
 */
export async function isOptedOut(
  userId: string,
  phoneNumber: string,
): Promise<boolean> {
  const supabase = createServiceClient();

  const { data } = await supabase
    .from("sms_opt_outs")
    .select("id")
    .eq("user_id", userId)
    .eq("phone_number", phoneNumber)
    .is("opted_back_in_at", null)
    .limit(1)
    .maybeSingle();

  return !!data;
}

/**
 * Record an opt-out for a phone number.
 * Inserts a new row — the partial unique index on (user_id, phone_number)
 * WHERE opted_back_in_at IS NULL prevents duplicates.
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
  const alreadyOptedOut = await isOptedOut(userId, phoneNumber);
  if (alreadyOptedOut) return;

  await supabase.from("sms_opt_outs").insert({
    user_id: userId,
    customer_id: customerId ?? null,
    phone_number: phoneNumber,
    source,
    raw_opt_out_text: rawText ?? null,
  });
}

/**
 * Remove an opt-out (opt back in). Sets opted_back_in_at on the active row.
 */
export async function removeOptOut(
  userId: string,
  phoneNumber: string,
): Promise<void> {
  const supabase = createServiceClient();

  await supabase
    .from("sms_opt_outs")
    .update({ opted_back_in_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq("phone_number", phoneNumber)
    .is("opted_back_in_at", null);
}
