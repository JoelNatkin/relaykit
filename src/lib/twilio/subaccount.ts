import { twilioFetch, getParentCredentials, encryptSecret } from "@/lib/twilio/client";
import { createServiceClient } from "@/lib/supabase";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SubaccountResult {
  subaccountSid: string;
  encryptedAuth: string;
}

interface TwilioAccountResponse {
  sid: string;
  auth_token: string;
  friendly_name: string;
  status: string;
}

// ---------------------------------------------------------------------------
// createSubaccount
// ---------------------------------------------------------------------------

/**
 * Creates a Twilio subaccount for a customer and stores encrypted credentials.
 *
 * - Uses parent account credentials to create the subaccount.
 * - Encrypts the subaccount auth token before storing in the database.
 * - Updates both the `customers` and `registrations` tables with the new SID.
 */
export async function createSubaccount(
  customerId: string,
  businessName: string,
  registrationId: string
): Promise<SubaccountResult> {
  const { accountSid, authToken } = getParentCredentials();

  // Create the subaccount under the parent account
  const response = await twilioFetch<TwilioAccountResponse>({
    baseUrl: "api",
    path: "/2010-04-01/Accounts.json",
    method: "POST",
    params: {
      FriendlyName: `RelayKit — ${businessName} (${customerId})`,
    },
    accountSid,
    authToken,
    registrationId,
  });

  const subaccountSid = response.sid;
  const encryptedAuth = encryptSecret(response.auth_token);

  // Persist credentials to the database
  const supabase = createServiceClient();

  const { error: customerError } = await supabase
    .from("customers")
    .update({
      twilio_subaccount_sid: subaccountSid,
      twilio_subaccount_auth: encryptedAuth,
    })
    .eq("id", customerId);

  if (customerError) {
    throw new Error(
      `Failed to store subaccount credentials on customer: ${customerError.message}`
    );
  }

  const { error: registrationError } = await supabase
    .from("registrations")
    .update({
      twilio_subaccount_sid: subaccountSid,
    })
    .eq("id", registrationId);

  if (registrationError) {
    throw new Error(
      `Failed to store subaccount SID on registration: ${registrationError.message}`
    );
  }

  return { subaccountSid, encryptedAuth };
}
