// ---------------------------------------------------------------------------
// DELETE /v1/consents/{phoneNumber}?consent_type=marketing — Revoke consent
// ---------------------------------------------------------------------------

import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { authenticateApiKey } from "@/lib/proxy/auth";
import { createServiceClient } from "@/lib/supabase";
import { makeProxyError } from "@/lib/proxy/types";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ phoneNumber: string }> },
) {
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

  if (!ctx.customerId) {
    return NextResponse.json(
      {
        error: makeProxyError(
          "registration_not_complete",
          "Consent management is available after registration.",
          requestId,
        ),
      },
      { status: 403 },
    );
  }

  const { phoneNumber } = await params;
  const decoded = decodeURIComponent(phoneNumber);

  const url = new URL(request.url);
  const consentType = url.searchParams.get("consent_type") ?? "marketing";

  const supabase = createServiceClient();

  const { error } = await supabase
    .from("recipient_consents")
    .update({ revoked_at: new Date().toISOString() })
    .eq("customer_id", ctx.customerId)
    .eq("phone_number", decoded)
    .eq("consent_type", consentType)
    .is("revoked_at", null);

  if (error) {
    return NextResponse.json(
      { error: makeProxyError("invalid_api_key", "Failed to revoke consent.", requestId) },
      { status: 500 },
    );
  }

  return NextResponse.json({
    phone_number: decoded,
    consent_type: consentType,
    revoked: true,
  });
}
