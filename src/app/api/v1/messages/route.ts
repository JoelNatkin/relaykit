// ---------------------------------------------------------------------------
// POST /v1/messages — Send a message (PRD_09 Section 3)
// ---------------------------------------------------------------------------
// The main developer-facing endpoint. Authenticates via API key, runs
// compliance checks, and routes to sandbox or live path.

import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authenticateApiKey } from "@/lib/proxy/auth";
import { runCompliancePipeline } from "@/lib/proxy/compliance-pipeline";
import { forwardToTwilio } from "@/lib/proxy/forward";
import { logMessage } from "@/lib/proxy/message-logger";
import { incrementUsage } from "@/lib/proxy/usage-meter";
import { sendSandboxMessage } from "@/lib/sandbox/manager";
import { makeProxyError } from "@/lib/proxy/types";
import { runAsyncChecks } from "@/lib/compliance/scanner";
import { persistScanAndAlert } from "@/lib/compliance/alert-generator";
import { createServiceClient } from "@/lib/supabase";

const sendMessageSchema = z.object({
  to: z
    .string()
    .regex(/^\+1\d{10}$/, "Phone must be E.164 US format (+1XXXXXXXXXX)"),
  body: z.string().min(1, "Message body is required").max(1600),
});

export async function POST(request: NextRequest) {
  const requestId = `req_${randomBytes(12).toString("base64url")}`;
  const externalId = `msg_${randomBytes(12).toString("base64url")}`;

  // 1. Authenticate API key
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

  // 2. Parse and validate request body
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: makeProxyError(
          "invalid_api_key",
          "Request body must be valid JSON.",
          requestId,
        ),
      },
      { status: 400 },
    );
  }

  const parsed = sendMessageSchema.safeParse(rawBody);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return NextResponse.json(
      {
        error: makeProxyError(
          "invalid_api_key",
          firstError?.message ?? "Invalid request body.",
          requestId,
        ),
      },
      { status: 400 },
    );
  }

  const messageRequest = parsed.data;

  // 3. Branch by environment
  if (ctx.environment === "sandbox") {
    const result = await sendSandboxMessage(
      ctx,
      messageRequest,
      externalId,
      requestId,
    );

    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }

    return NextResponse.json(result.response, { status: 202 });
  }

  // --- Live path ---

  // 4. Run compliance pipeline
  const compliance = await runCompliancePipeline(ctx, messageRequest);
  if (!compliance.passed) {
    return NextResponse.json(
      {
        error: makeProxyError(
          compliance.errorCode!,
          compliance.errorMessage!,
          requestId,
        ),
      },
      { status: 422 },
    );
  }

  // 5. Forward to Twilio subaccount
  const forwardResult = await forwardToTwilio(ctx, messageRequest, requestId);
  if ("error" in forwardResult) {
    return NextResponse.json(
      { error: forwardResult.error },
      { status: forwardResult.status },
    );
  }

  // 6. Async: log message + increment usage (fire-and-forget)
  logMessage({
    customerId: ctx.customerId,
    userId: ctx.userId,
    externalId,
    twilioSid: forwardResult.twilioSid,
    direction: "outbound",
    to: messageRequest.to,
    from: forwardResult.fromNumber,
    body: messageRequest.body,
    status: "queued",
    complianceResult: compliance.checks,
    environment: "live",
  });

  if (ctx.customerId) {
    incrementUsage(ctx.customerId);
  }

  // 8. Async: compliance monitoring (fire-and-forget, PRD_08 BM-01/02/06)
  if (ctx.registrationId && ctx.customerId) {
    runAsyncChecks({
      messageBody: messageRequest.body,
      to: messageRequest.to,
      customerId: ctx.customerId,
      registrationId: ctx.registrationId,
      businessName: ctx.businessName ?? '',
      effectiveCampaignType: ctx.effectiveCampaignType,
    }).then((scanResult) => {
      const supabase = createServiceClient();
      supabase
        .from('messages')
        .select('id')
        .eq('external_id', externalId)
        .single()
        .then(({ data }) => {
          if (data) {
            persistScanAndAlert({
              registrationId: ctx.registrationId!,
              customerId: ctx.customerId!,
              messageId: data.id,
              messageSid: forwardResult.twilioSid,
              recipientPhone: messageRequest.to,
              scanResult,
            });
          }
        });
    });
  }

  // 7. Return 202 Accepted
  return NextResponse.json(
    {
      id: externalId,
      object: "message",
      to: messageRequest.to,
      body: messageRequest.body,
      from: forwardResult.fromNumber,
      status: "queued",
      compliance: {
        checks_passed: true,
        warnings: [],
      },
      livemode: true,
      created_at: new Date().toISOString(),
    },
    { status: 202 },
  );
}
