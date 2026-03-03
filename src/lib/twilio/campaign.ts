import { twilioFetch, getSubaccountCredentials } from "@/lib/twilio/client";
import type { GeneratedArtifacts } from "@/lib/templates/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CampaignResponse {
  sid: string;
  campaign_status: string;
  brand_registration_sid: string;
}

// ---------------------------------------------------------------------------
// Default keyword / message constants
// ---------------------------------------------------------------------------

const OPT_IN_KEYWORDS = "START,SUBSCRIBE,YES";
const OPT_OUT_KEYWORDS = "STOP,UNSUBSCRIBE,CANCEL,END,QUIT";
const HELP_KEYWORDS = "HELP,INFO";

function buildOptInMessage(businessName: string): string {
  return `You are now subscribed to ${businessName} updates. Reply HELP for help. Reply STOP to unsubscribe.`;
}

function buildOptOutMessage(businessName: string): string {
  return `You have been unsubscribed from ${businessName} messages. You will no longer receive texts. Reply START to re-subscribe.`;
}

function buildHelpMessage(businessName: string, email: string): string {
  return `${businessName}: For help, contact ${email}. Reply STOP to unsubscribe.`;
}

// ---------------------------------------------------------------------------
// createCampaign
// ---------------------------------------------------------------------------

/**
 * Creates a US A2P campaign under the customer's messaging service.
 *
 * Uses SUBACCOUNT credentials — the campaign lives in the subaccount.
 * The campaign ties together the brand registration, use case, and
 * messaging content (description, samples, opt-in flow).
 *
 * @returns The campaign SID
 */
export async function createCampaign(
  registrationId: string,
  messagingServiceSid: string,
  brandSid: string,
  businessName: string,
  email: string,
  artifacts: GeneratedArtifacts,
  subaccountSid: string,
  subaccountAuth: string
): Promise<string> {
  const { accountSid, authToken } = getSubaccountCredentials(
    subaccountSid,
    subaccountAuth
  );

  const response = await twilioFetch<CampaignResponse>({
    baseUrl: "messaging",
    path: `/v1/Services/${messagingServiceSid}/Compliance/Usa2p`,
    method: "POST",
    params: {
      BrandRegistrationSid: brandSid,
      Description: artifacts.campaign_description,
      MessageFlow: artifacts.opt_in_description,
      MessageSamples: JSON.stringify(artifacts.sample_messages),
      UsAppToPersonUsecase: artifacts.tcr_use_case,
      HasEmbeddedLinks: String(artifacts.tcr_flags.hasEmbeddedLinks ?? true),
      HasEmbeddedPhone: String(artifacts.tcr_flags.hasEmbeddedPhone ?? false),
      SubscriberOptIn: String(artifacts.tcr_flags.subscriberOptin ?? true),
      SubscriberOptOut: String(artifacts.tcr_flags.subscriberOptout ?? true),
      SubscriberHelp: String(artifacts.tcr_flags.subscriberHelp ?? true),
      OptInMessage: buildOptInMessage(businessName),
      OptOutMessage: buildOptOutMessage(businessName),
      HelpMessage: buildHelpMessage(businessName, email),
      OptInKeywords: OPT_IN_KEYWORDS,
      OptOutKeywords: OPT_OUT_KEYWORDS,
      HelpKeywords: HELP_KEYWORDS,
    },
    accountSid,
    authToken,
    registrationId,
  });

  return response.sid;
}
