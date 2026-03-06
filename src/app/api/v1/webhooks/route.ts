// ---------------------------------------------------------------------------
// POST /v1/webhooks — Create webhook endpoint
// GET /v1/webhooks — List webhook endpoints
// ---------------------------------------------------------------------------

import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { z } from "zod";
import { authenticateApiKey } from "@/lib/proxy/auth";
import { createServiceClient } from "@/lib/supabase";
import { makeProxyError } from "@/lib/proxy/types";

const VALID_EVENTS = [
  "message.received",
  "message.status",
  "opt_out.created",
  "opt_out.removed",
] as const;

const createWebhookSchema = z.object({
  url: z.string().url("Webhook URL must be a valid HTTPS URL"),
  events: z
    .array(z.enum(VALID_EVENTS))
    .min(1, "At least one event type is required")
    .default(["message.received"]),
});

export async function POST(request: NextRequest) {
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

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json(
      { error: makeProxyError("invalid_api_key", "Request body must be valid JSON.", requestId) },
      { status: 400 },
    );
  }

  const parsed = createWebhookSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      { error: makeProxyError("invalid_api_key", parsed.error.issues[0]?.message ?? "Invalid request.", requestId) },
      { status: 400 },
    );
  }

  // Generate HMAC signing secret
  const secret = randomBytes(32).toString("hex");
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("webhook_endpoints")
    .insert({
      customer_id: ctx.customerId,
      user_id: ctx.userId,
      url: parsed.data.url,
      events: parsed.data.events,
      secret,
    })
    .select("id, url, events, is_active, created_at")
    .single();

  if (error) {
    return NextResponse.json(
      { error: makeProxyError("invalid_api_key", "Failed to create webhook.", requestId) },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      ...data,
      secret, // Shown once, never retrievable again
    },
    { status: 201 },
  );
}

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

  // Query by customer_id or user_id depending on registration state
  let query = supabase
    .from("webhook_endpoints")
    .select("id, url, events, is_active, created_at")
    .eq("is_active", true);

  if (ctx.customerId) {
    query = query.eq("customer_id", ctx.customerId);
  } else {
    query = query.eq("user_id", ctx.userId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json(
      { error: makeProxyError("invalid_api_key", "Failed to list webhooks.", requestId) },
      { status: 500 },
    );
  }

  return NextResponse.json({
    object: "list",
    data: data ?? [],
  });
}
