import { twilioFetch, getParentCredentials, getSubaccountCredentials } from "@/lib/twilio/client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface BrandRegistrationResponse {
  sid: string;
  status: string;
  failure_reason?: string;
}

interface BrandVettingResponse {
  sid: string;
  vetting_status: string;
  vetting_score?: number;
}

interface Usa2pComplianceItem {
  sid: string;
  campaign_status: string;
  failure_reason?: string;
}

interface Usa2pComplianceListResponse {
  compliance: Usa2pComplianceItem[];
}

// ---------------------------------------------------------------------------
// fetchBrandStatus
// ---------------------------------------------------------------------------

/**
 * Polls the current status of a brand registration.
 *
 * Used to check whether a brand has been approved, rejected, or is still
 * pending review. The status drives the registration state machine.
 */
export async function fetchBrandStatus(
  brandSid: string,
  registrationId: string
): Promise<{ status: string; failureReason?: string }> {
  const { accountSid, authToken } = getParentCredentials();

  const response = await twilioFetch<BrandRegistrationResponse>({
    baseUrl: "messaging",
    path: `/v1/a2p/BrandRegistrations/${brandSid}`,
    method: "GET",
    accountSid,
    authToken,
    registrationId,
  });

  return {
    status: response.status,
    failureReason: response.failure_reason,
  };
}

// ---------------------------------------------------------------------------
// fetchVettingStatus
// ---------------------------------------------------------------------------

/**
 * Polls the current status of a brand vetting request.
 *
 * After requesting secondary vetting or submitting a sole-prop OTP, this
 * function checks whether the vetting has completed and what score was
 * assigned. The trust score determines messaging throughput limits.
 */
export async function fetchVettingStatus(
  brandSid: string,
  vettingSid: string,
  registrationId: string
): Promise<{ status: string; score?: number }> {
  const { accountSid, authToken } = getParentCredentials();

  const response = await twilioFetch<BrandVettingResponse>({
    baseUrl: "messaging",
    path: `/v1/a2p/BrandRegistrations/${brandSid}/BrandVettings/${vettingSid}`,
    method: "GET",
    accountSid,
    authToken,
    registrationId,
  });

  return {
    status: response.vetting_status,
    score: response.vetting_score,
  };
}

// ---------------------------------------------------------------------------
// fetchCampaignStatus
// ---------------------------------------------------------------------------

/**
 * Polls the current status of a US A2P campaign.
 *
 * Campaigns live in the customer's subaccount, so this function uses
 * subaccount credentials. The endpoint returns a list — we take the first
 * item's campaign_status and failure_reason.
 */
export async function fetchCampaignStatus(
  messagingServiceSid: string,
  registrationId: string,
  subaccountSid: string,
  subaccountAuth: string
): Promise<{ status: string; failureReason?: string }> {
  const { accountSid, authToken } = getSubaccountCredentials(
    subaccountSid,
    subaccountAuth
  );

  const response = await twilioFetch<Usa2pComplianceListResponse>({
    baseUrl: "messaging",
    path: `/v1/Services/${messagingServiceSid}/Compliance/Usa2p`,
    method: "GET",
    accountSid,
    authToken,
    registrationId,
  });

  const first = response.compliance[0];

  if (!first) {
    return { status: "unknown", failureReason: "No campaign found" };
  }

  return {
    status: first.campaign_status,
    failureReason: first.failure_reason,
  };
}
