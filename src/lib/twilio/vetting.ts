import { twilioFetch, getParentCredentials } from "@/lib/twilio/client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface BrandVettingResponse {
  sid: string;
  brand_sid: string;
  vetting_provider: string;
  vetting_status: string;
}

// ---------------------------------------------------------------------------
// requestSecondaryVetting
// ---------------------------------------------------------------------------

/**
 * Requests secondary vetting for a standard brand to increase its trust score.
 *
 * Called after brand approval for standard (EIN-based) registrations.
 * Uses the "campaign-verify" vetting provider (bundled in the $46 standard fee).
 *
 * @returns The vetting SID
 */
export async function requestSecondaryVetting(
  brandSid: string,
  registrationId: string
): Promise<string> {
  const { accountSid, authToken } = getParentCredentials();

  const response = await twilioFetch<BrandVettingResponse>({
    baseUrl: "messaging",
    path: `/v1/a2p/BrandRegistrations/${brandSid}/BrandVettings`,
    method: "POST",
    params: {
      VettingProvider: "campaign-verify",
    },
    accountSid,
    authToken,
    registrationId,
  });

  return response.sid;
}

// ---------------------------------------------------------------------------
// submitOtp
// ---------------------------------------------------------------------------

/**
 * Submits an OTP code for sole proprietor brand verification.
 *
 * After creating a sole proprietor brand, Twilio sends an OTP to the
 * customer's phone. The customer enters the code in the RelayKit dashboard,
 * and we submit it here for verification.
 *
 * @returns The vetting SID
 */
export async function submitOtp(
  brandSid: string,
  otpCode: string,
  registrationId: string
): Promise<string> {
  const { accountSid, authToken } = getParentCredentials();

  const response = await twilioFetch<BrandVettingResponse>({
    baseUrl: "messaging",
    path: `/v1/a2p/BrandRegistrations/${brandSid}/BrandVettings`,
    method: "POST",
    params: {
      VettingProvider: "campaign-verify",
      VettingId: otpCode,
    },
    accountSid,
    authToken,
    registrationId,
  });

  return response.sid;
}
