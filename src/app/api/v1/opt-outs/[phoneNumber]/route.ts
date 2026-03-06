// ---------------------------------------------------------------------------
// GET /v1/opt-outs/{phoneNumber} — Check opt-out status
// ---------------------------------------------------------------------------

import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { authenticateApiKey } from "@/lib/proxy/auth";
import { isOptedOut } from "@/lib/proxy/opt-out";

export async function GET(
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

  const { phoneNumber } = await params;
  const decoded = decodeURIComponent(phoneNumber);
  const optedOut = await isOptedOut(authResult.context.userId, decoded);

  return NextResponse.json({
    phone_number: decoded,
    opted_out: optedOut,
  });
}
