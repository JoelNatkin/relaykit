// ---------------------------------------------------------------------------
// GET /v1/account — Account info, registration state, usage (PRD_09 §3)
// ---------------------------------------------------------------------------

import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { authenticateApiKey } from "@/lib/proxy/auth";
import { createServiceClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const requestId = `req_${randomBytes(12).toString("base64url")}`;
  const authResult = await authenticateApiKey(
    request.headers.get("authorization"),
    requestId,
  );

  if ("error" in authResult) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status },
    );
  }

  const ctx = authResult.context;
  const supabase = createServiceClient();

  // Build response based on registration state
  const account: Record<string, unknown> = {
    environment: ctx.environment,
    livemode: ctx.environment === "live",
  };

  if (ctx.customerId) {
    // Post-registration: include registration status and usage
    if (ctx.registrationId) {
      const { data: reg } = await supabase
        .from("registrations")
        .select("status, twilio_phone_number, created_at")
        .eq("id", ctx.registrationId)
        .single();

      if (reg) {
        account.registration = {
          id: ctx.registrationId,
          status: reg.status,
          phone_number: reg.twilio_phone_number,
          created_at: reg.created_at,
        };
      }
    }

    // Current billing period usage
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split("T")[0];

    const { data: usage } = await supabase
      .from("message_usage")
      .select("message_count, blocks_billed")
      .eq("customer_id", ctx.customerId)
      .gte("billing_period_start", periodStart)
      .maybeSingle();

    account.usage = {
      messages_sent: usage?.message_count ?? 0,
      blocks_billed: usage?.blocks_billed ?? 0,
      billing_period_start: periodStart,
    };
  } else {
    // Pre-registration sandbox
    const today = new Date().toISOString().split("T")[0];
    const { data: dailyUsage } = await supabase
      .from("sandbox_daily_usage")
      .select("message_count")
      .eq("user_id", ctx.userId)
      .eq("date", today)
      .maybeSingle();

    account.sandbox = {
      messages_today: dailyUsage?.message_count ?? 0,
      daily_limit: parseInt(process.env.SANDBOX_DAILY_LIMIT ?? "100", 10),
      verified_phone: ctx.verifiedPhone,
    };
  }

  return NextResponse.json(account);
}
