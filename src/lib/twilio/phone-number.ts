import {
  twilioFetch,
  getSubaccountCredentials,
  TwilioApiError,
} from "@/lib/twilio/client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PhoneNumberResult {
  phoneNumberSid: string;
  phoneNumber: string;
}

interface IncomingPhoneNumberResponse {
  sid: string;
  phone_number: string;
  friendly_name: string;
  sms_enabled: boolean;
}

interface PhoneNumberAssignmentResponse {
  sid: string;
  phone_number_sid: string;
}

// ---------------------------------------------------------------------------
// STATE_AREA_CODES — preferred area codes by US state abbreviation
// ---------------------------------------------------------------------------

export const STATE_AREA_CODES: Record<string, string> = {
  AL: "205",
  AZ: "480",
  CA: "415",
  CO: "303",
  CT: "203",
  DC: "202",
  FL: "305",
  GA: "404",
  HI: "808",
  ID: "208",
  IL: "312",
  IN: "317",
  KS: "913",
  KY: "502",
  LA: "504",
  MA: "617",
  MD: "301",
  MI: "313",
  MN: "612",
  MO: "314",
  NC: "704",
  NJ: "201",
  NM: "505",
  NV: "702",
  NY: "212",
  OH: "216",
  OK: "405",
  OR: "503",
  PA: "215",
  SC: "843",
  TN: "615",
  TX: "512",
  UT: "801",
  VA: "703",
  WA: "206",
  WI: "414",
};

// ---------------------------------------------------------------------------
// purchasePhoneNumber
// ---------------------------------------------------------------------------

/**
 * Purchases a US phone number within the customer's subaccount.
 *
 * Attempts to match the customer's state area code first for a local feel.
 * If the preferred area code is unavailable, falls back to any available
 * US number.
 *
 * Uses SUBACCOUNT credentials.
 */
export async function purchasePhoneNumber(
  registrationId: string,
  state: string | null,
  subaccountSid: string,
  subaccountAuth: string
): Promise<PhoneNumberResult> {
  const { accountSid, authToken } = getSubaccountCredentials(
    subaccountSid,
    subaccountAuth
  );

  const preferredAreaCode = state ? STATE_AREA_CODES[state.toUpperCase()] : undefined;

  // Try with preferred area code first
  if (preferredAreaCode) {
    try {
      const response = await twilioFetch<IncomingPhoneNumberResponse>({
        baseUrl: "api",
        path: `/2010-04-01/Accounts/${accountSid}/IncomingPhoneNumbers.json`,
        method: "POST",
        params: {
          SmsEnabled: "true",
          VoiceEnabled: "false",
          AreaCode: preferredAreaCode,
        },
        accountSid,
        authToken,
        registrationId,
      });

      return {
        phoneNumberSid: response.sid,
        phoneNumber: response.phone_number,
      };
    } catch (err) {
      // If area code fails (no numbers available), fall through to retry
      // without area code preference. Only swallow 404/400 (no numbers found).
      if (
        err instanceof TwilioApiError &&
        (err.status === 400 || err.status === 404)
      ) {
        console.warn(
          `[phone-number] No numbers available for area code ${preferredAreaCode}, retrying without preference`
        );
      } else {
        throw err;
      }
    }
  }

  // Fallback: purchase any available US number
  const response = await twilioFetch<IncomingPhoneNumberResponse>({
    baseUrl: "api",
    path: `/2010-04-01/Accounts/${accountSid}/IncomingPhoneNumbers.json`,
    method: "POST",
    params: {
      SmsEnabled: "true",
      VoiceEnabled: "false",
    },
    accountSid,
    authToken,
    registrationId,
  });

  return {
    phoneNumberSid: response.sid,
    phoneNumber: response.phone_number,
  };
}

// ---------------------------------------------------------------------------
// assignToMessagingService
// ---------------------------------------------------------------------------

/**
 * Assigns a phone number to a messaging service within the subaccount.
 *
 * This links the purchased number to the messaging service so outbound
 * messages use this number and inbound messages route through the service's
 * webhook configuration.
 *
 * Uses SUBACCOUNT credentials.
 */
export async function assignToMessagingService(
  registrationId: string,
  messagingServiceSid: string,
  phoneNumberSid: string,
  subaccountSid: string,
  subaccountAuth: string
): Promise<void> {
  const { accountSid, authToken } = getSubaccountCredentials(
    subaccountSid,
    subaccountAuth
  );

  await twilioFetch<PhoneNumberAssignmentResponse>({
    baseUrl: "messaging",
    path: `/v1/Services/${messagingServiceSid}/PhoneNumbers`,
    method: "POST",
    params: {
      PhoneNumberSid: phoneNumberSid,
    },
    accountSid,
    authToken,
    registrationId,
  });
}
