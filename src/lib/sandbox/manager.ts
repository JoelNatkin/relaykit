// ---------------------------------------------------------------------------
// Sandbox message manager — sends via shared Twilio number
// ---------------------------------------------------------------------------

import { randomBytes, createHash } from "crypto";
import { createServiceClient } from "@/lib/supabase";
import { twilioFetch, getParentCredentials } from "@/lib/twilio/client";
import { runCompliancePipeline } from "@/lib/proxy/compliance-pipeline";
import { checkAndIncrementDailyLimit } from "./limits";
import type {
  AuthenticatedContext,
  SendMessageRequest,
  ProxyResponse,
  ProxyError,
} from "@/lib/proxy/types";
import { makeProxyError } from "@/lib/proxy/types";

type SandboxResult =
  | { response: ProxyResponse }
  | { error: ProxyError; status: number };

/**
 * Send a message through the sandbox path.
 *
 * Enforces: verified phone, daily limit, compliance pipeline.
 * Prepends [SANDBOX] to the body and sends via the shared sandbox number.
 */
export async function sendSandboxMessage(
  ctx: AuthenticatedContext,
  request: SendMessageRequest,
  externalId: string,
  requestId: string,
): Promise<SandboxResult> {
  // 1. Verified phone check
  if (!ctx.verifiedPhone) {
    return {
      error: makeProxyError(
        "sandbox_unverified_recipient",
        "No verified phone number on file. Verify your phone number from the dashboard before sending sandbox messages.",
        requestId,
      ),
      status: 422,
    };
  }

  if (request.to !== ctx.verifiedPhone) {
    return {
      error: makeProxyError(
        "sandbox_unverified_recipient",
        `Sandbox messages can only be sent to your verified phone number (${ctx.verifiedPhone}). Change the "to" field or update your verified number from the dashboard.`,
        requestId,
      ),
      status: 422,
    };
  }

  // 2. Daily limit check
  const limitResult = await checkAndIncrementDailyLimit(ctx.userId);
  if (!limitResult.allowed) {
    return {
      error: makeProxyError(
        "daily_limit_exceeded",
        `Sandbox limit reached (${limitResult.limit} messages/day). Your limit resets at midnight UTC. Start your registration to unlock production sending.`,
        requestId,
      ),
      status: 429,
    };
  }

  // 3. Compliance pipeline
  const compliance = await runCompliancePipeline(ctx, request);
  if (!compliance.passed) {
    return {
      error: makeProxyError(
        compliance.errorCode!,
        compliance.errorMessage!,
        requestId,
      ),
      status: 422,
    };
  }

  // 4. Prepend [SANDBOX] prefix
  const sandboxBody = `[SANDBOX] ${request.body}`;

  // 5. Send via parent Twilio account using shared sandbox number
  const sandboxNumber = process.env.SANDBOX_TWILIO_NUMBER;
  if (!sandboxNumber) {
    throw new Error("SANDBOX_TWILIO_NUMBER env var is not set");
  }

  const { accountSid, authToken } = getParentCredentials();

  let twilioSid: string | null = null;
  try {
    const twilioResponse = await twilioFetch<{ sid: string; status: string }>({
      baseUrl: "api",
      path: `/2010-04-01/Accounts/${accountSid}/Messages.json`,
      method: "POST",
      params: {
        To: request.to,
        From: sandboxNumber,
        Body: sandboxBody,
      },
      accountSid,
      authToken,
    });

    twilioSid = twilioResponse.sid;
  } catch (err) {
    return {
      error: makeProxyError(
        "content_prohibited",
        "Message delivery failed. Please try again.",
        requestId,
      ),
      status: 422,
    };
  }

  // 6. Log message (fire-and-forget)
  const supabase = createServiceClient();
  const bodyHash = createHash("sha256").update(request.body).digest("hex");

  supabase
    .from("messages")
    .insert({
      customer_id: ctx.customerId,
      user_id: ctx.userId,
      external_id: externalId,
      twilio_sid: twilioSid,
      direction: "outbound",
      to_number: request.to,
      from_number: sandboxNumber,
      body_hash: bodyHash,
      status: "queued",
      compliance_result: compliance.checks,
      environment: "sandbox",
    })
    .then(({ error }) => {
      if (error) console.error("[SandboxManager] Failed to log message:", error);
    });

  // 7. Return success response
  return {
    response: {
      id: externalId,
      object: "message",
      to: request.to,
      body: request.body,
      from: sandboxNumber,
      status: "queued",
      compliance: {
        checks_passed: true,
        warnings: [],
      },
      livemode: false,
      created_at: new Date().toISOString(),
    },
  };
}
