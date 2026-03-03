import { twilioFetch, getSubaccountCredentials } from "@/lib/twilio/client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface MessagingServiceResponse {
  sid: string;
  friendly_name: string;
  inbound_request_url: string;
  status_callback: string;
}

// ---------------------------------------------------------------------------
// createMessagingService
// ---------------------------------------------------------------------------

/**
 * Creates a Twilio Messaging Service within the customer's subaccount.
 *
 * The messaging service is the container that links phone numbers, campaigns,
 * and webhook configuration. Webhook URLs point to RelayKit's proxy API so
 * all inbound messages and status callbacks route through RelayKit.
 *
 * Uses SUBACCOUNT credentials — the messaging service lives in the subaccount.
 *
 * @returns The messaging service SID
 */
export async function createMessagingService(
  registrationId: string,
  businessName: string,
  subaccountSid: string,
  subaccountAuth: string
): Promise<string> {
  const { accountSid, authToken } = getSubaccountCredentials(
    subaccountSid,
    subaccountAuth
  );

  const apiDomain =
    process.env.RELAYKIT_API_DOMAIN || "api.relaykit.dev";

  const inboundUrl = `https://${apiDomain}/api/webhooks/inbound/${registrationId}`;
  const statusUrl = `https://${apiDomain}/api/webhooks/status/${registrationId}`;

  const response = await twilioFetch<MessagingServiceResponse>({
    baseUrl: "messaging",
    path: "/v1/Services",
    method: "POST",
    params: {
      FriendlyName: `${businessName} - SMS`,
      InboundRequestUrl: inboundUrl,
      InboundMethod: "POST",
      StatusCallback: statusUrl,
      UseInboundWebhookOnNumber: "false",
    },
    accountSid,
    authToken,
    registrationId,
  });

  return response.sid;
}
