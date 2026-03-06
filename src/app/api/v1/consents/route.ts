// ---------------------------------------------------------------------------
// POST /v1/consents — Register marketing consent (D-14)
// ---------------------------------------------------------------------------

import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { z } from "zod";
import { authenticateApiKey } from "@/lib/proxy/auth";
import { createServiceClient } from "@/lib/supabase";
import { makeProxyError } from "@/lib/proxy/types";

const registerConsentSchema = z.object({
  phone_number: z
    .string()
    .regex(/^\+1\d{10}$/, "Phone must be E.164 US format (+1XXXXXXXXXX)"),
  consent_type: z.enum(["transactional", "marketing"]),
  source: z.enum(["web_form", "api", "keyword", "import"]),
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

  // Consents require a customer record (post-registration only)
  if (!ctx.customerId) {
    return NextResponse.json(
      {
        error: makeProxyError(
          "registration_not_complete",
          "Consent management is available after registration. Complete your registration to manage recipient consents.",
          requestId,
        ),
      },
      { status: 403 },
    );
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json(
      { error: makeProxyError("invalid_api_key", "Request body must be valid JSON.", requestId) },
      { status: 400 },
    );
  }

  const parsed = registerConsentSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      { error: makeProxyError("invalid_api_key", parsed.error.issues[0]?.message ?? "Invalid request.", requestId) },
      { status: 400 },
    );
  }

  const supabase = createServiceClient();
  const now = new Date().toISOString();

  // Upsert: if a revoked consent exists, create a new active one.
  // The partial unique index prevents duplicates for active consents.
  const { error } = await supabase.from("recipient_consents").insert({
    customer_id: ctx.customerId,
    phone_number: parsed.data.phone_number,
    consent_type: parsed.data.consent_type,
    source: parsed.data.source,
    consented_at: now,
  });

  if (error) {
    // Unique constraint violation means consent already exists and is active
    if (error.code === "23505") {
      return NextResponse.json(
        {
          phone_number: parsed.data.phone_number,
          consent_type: parsed.data.consent_type,
          consented_at: now,
        },
        { status: 200 },
      );
    }
    return NextResponse.json(
      { error: makeProxyError("invalid_api_key", "Failed to register consent.", requestId) },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      phone_number: parsed.data.phone_number,
      consent_type: parsed.data.consent_type,
      consented_at: now,
    },
    { status: 201 },
  );
}
