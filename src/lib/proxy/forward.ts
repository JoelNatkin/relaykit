// ---------------------------------------------------------------------------
// Live message forwarding — Twilio subaccount (D-02, D-06)
// ---------------------------------------------------------------------------

import { twilioFetch, getSubaccountCredentials } from "@/lib/twilio/client";
import { addOptOut } from "./opt-out";
import type { AuthenticatedContext, SendMessageRequest, ProxyError } from "./types";
import { makeProxyError } from "./types";

type ForwardResult =
  | { twilioSid: string; fromNumber: string }
  | { error: ProxyError; status: number };

/**
 * Forward a validated message to the customer's Twilio subaccount.
 *
 * Uses fetch() directly against the Twilio REST API (D-02, no SDK).
 * If Twilio returns error 21610 (message to opted-out number), retroactively
 * adds the number to RelayKit's opt-out list (defense-in-depth, PRD_09 §4).
 */
export async function forwardToTwilio(
  ctx: AuthenticatedContext,
  request: SendMessageRequest,
  requestId: string,
): Promise<ForwardResult> {
  if (!ctx.subaccountSid || !ctx.subaccountAuth || !ctx.messagingServiceSid) {
    return {
      error: makeProxyError(
        "registration_not_complete",
        "Twilio subaccount not configured. Registration may still be in progress.",
        requestId,
      ),
      status: 403,
    };
  }

  const { accountSid, authToken } = getSubaccountCredentials(
    ctx.subaccountSid,
    ctx.subaccountAuth,
  );

  const apiDomain = process.env.RELAYKIT_API_DOMAIN ?? "api.relaykit.dev";
  const statusCallback = `https://${apiDomain}/api/webhooks/status/${ctx.registrationId}`;

  try {
    const twilioResponse = await twilioFetch<{
      sid: string;
      from: string;
      status: string;
      error_code?: number;
      error_message?: string;
    }>({
      baseUrl: "api",
      path: `/2010-04-01/Accounts/${accountSid}/Messages.json`,
      method: "POST",
      params: {
        To: request.to,
        MessagingServiceSid: ctx.messagingServiceSid,
        Body: request.body,
        StatusCallback: statusCallback,
      },
      accountSid,
      authToken,
      registrationId: ctx.registrationId ?? undefined,
    });

    // Defense-in-depth: catch Twilio's opt-out error and retroactively record
    if (twilioResponse.error_code === 21610) {
      addOptOut(
        ctx.userId,
        request.to,
        "twilio_error",
        ctx.customerId,
      ).catch(() => {});

      return {
        error: makeProxyError(
          "recipient_opted_out",
          "Recipient has opted out of messages. Sending to opted-out recipients violates carrier rules and TCPA regulations.",
          requestId,
        ),
        status: 422,
      };
    }

    return {
      twilioSid: twilioResponse.sid,
      fromNumber: twilioResponse.from ?? ctx.phoneNumber ?? "",
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Twilio delivery failed";
    return {
      error: makeProxyError(
        "content_prohibited",
        `Message delivery failed: ${message}`,
        requestId,
      ),
      status: 422,
    };
  }
}
