// ---------------------------------------------------------------------------
// GET /v1/opt-outs — List opt-outs
// POST /v1/opt-outs — Register external opt-out (D-24)
// ---------------------------------------------------------------------------

import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { z } from "zod";
import { authenticateApiKey } from "@/lib/proxy/auth";
import { addOptOut } from "@/lib/proxy/opt-out";
import { createServiceClient } from "@/lib/supabase";
import { makeProxyError } from "@/lib/proxy/types";

const registerOptOutSchema = z.object({
  phone_number: z
    .string()
    .regex(/^\+1\d{10}$/, "Phone must be E.164 US format (+1XXXXXXXXXX)"),
  source: z.enum([
    "web_form",
    "email",
    "phone_call",
    "api",
    "natural_language",
  ]),
  raw_text: z.string().optional(),
});

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

  const url = new URL(request.url);
  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "50"), 100);
  const after = url.searchParams.get("after");

  let query = supabase
    .from("sms_opt_outs")
    .select("phone_number, source, opted_out_at, opted_back_in_at")
    .eq("user_id", ctx.userId)
    .is("opted_back_in_at", null)
    .order("opted_out_at", { ascending: false })
    .limit(limit);

  if (after) {
    query = query.lt("opted_out_at", after);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json(
      { error: makeProxyError("invalid_api_key", "Failed to fetch opt-outs.", requestId) },
      { status: 500 },
    );
  }

  return NextResponse.json({
    object: "list",
    data: data ?? [],
    has_more: (data?.length ?? 0) === limit,
  });
}

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

  const parsed = registerOptOutSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      { error: makeProxyError("invalid_api_key", parsed.error.issues[0]?.message ?? "Invalid request.", requestId) },
      { status: 400 },
    );
  }

  await addOptOut(
    ctx.userId,
    parsed.data.phone_number,
    parsed.data.source,
    ctx.customerId,
    parsed.data.raw_text,
  );

  return NextResponse.json(
    {
      phone_number: parsed.data.phone_number,
      source: parsed.data.source,
      opted_out_at: new Date().toISOString(),
    },
    { status: 201 },
  );
}
