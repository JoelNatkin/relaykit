// ---------------------------------------------------------------------------
// DELETE /v1/webhooks/{webhookId} — Delete a webhook endpoint
// ---------------------------------------------------------------------------

import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { authenticateApiKey } from "@/lib/proxy/auth";
import { createServiceClient } from "@/lib/supabase";
import { makeProxyError } from "@/lib/proxy/types";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ webhookId: string }> },
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
  const { webhookId } = await params;
  const supabase = createServiceClient();

  // Soft delete — set is_active to false
  let query = supabase
    .from("webhook_endpoints")
    .update({ is_active: false })
    .eq("id", webhookId);

  if (ctx.customerId) {
    query = query.eq("customer_id", ctx.customerId);
  } else {
    query = query.eq("user_id", ctx.userId);
  }

  const { error } = await query;

  if (error) {
    return NextResponse.json(
      { error: makeProxyError("invalid_api_key", "Failed to delete webhook.", requestId) },
      { status: 500 },
    );
  }

  return NextResponse.json({ id: webhookId, deleted: true });
}
