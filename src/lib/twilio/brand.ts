import { twilioFetch, getParentCredentials } from "@/lib/twilio/client";
import { createServiceClient } from "@/lib/supabase";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CustomerData {
  business_name: string;
  business_description: string;
  contact_name: string;
  email: string;
  phone: string;
  address_line1: string;
  address_city: string;
  address_state: string;
  address_zip: string;
  has_ein: boolean;
  ein: string | null;
  business_type: string | null;
  website_url: string | null;
}

export interface BrandResult {
  trustProductSid: string;
  endUserSid: string;
  brandSid: string;
  addressSid?: string;
}

interface CustomerProfileResponse {
  sid: string;
  status: string;
  friendly_name: string;
}

interface EndUserResponse {
  sid: string;
  friendly_name: string;
  type: string;
}

interface EntityAssignmentResponse {
  sid: string;
  object_sid: string;
}

interface BrandRegistrationResponse {
  sid: string;
  status: string;
  brand_type: string;
}

interface AddressResponse {
  sid: string;
  friendly_name: string;
}

// ---------------------------------------------------------------------------
// Policy SIDs
// ---------------------------------------------------------------------------

/** Sole Proprietor Customer Profile policy */
const SOLE_PROP_POLICY_SID = "RNb0d4771c2c98518d916a3d4cd70a8f8b";

/** Standard (A2P Messaging Profile) Customer Profile policy */
const STANDARD_POLICY_SID = "RNdfbf3772c08f4ceeacab73d96f09d85f";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/);
  const firstName = parts[0] || "";
  const lastName = parts.slice(1).join(" ") || "";
  return { firstName, lastName };
}

function formatPhone(phone: string): string {
  // Ensure +1 prefix for US numbers
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("1") && digits.length === 11) {
    return `+${digits}`;
  }
  return `+1${digits}`;
}

/**
 * Persists a SID column on the registrations table.
 */
async function persistRegistrationField(
  registrationId: string,
  field: string,
  value: string
): Promise<void> {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("registrations")
    .update({ [field]: value })
    .eq("id", registrationId);

  if (error) {
    throw new Error(
      `Failed to persist ${field} on registration: ${error.message}`
    );
  }
}

// ---------------------------------------------------------------------------
// submitSoleProprietorBrand
// ---------------------------------------------------------------------------

/**
 * Submits a sole proprietor brand registration through Twilio Trust Hub.
 *
 * Steps:
 * 1. Create Customer Profile (Trust Hub)
 * 2. Create End User (sole_proprietor type)
 * 3. Attach End User to Customer Profile
 * 4. Submit Customer Profile for review
 * 5. Create Brand Registration (messaging API)
 */
export async function submitSoleProprietorBrand(
  registrationId: string,
  customer: CustomerData
): Promise<BrandResult> {
  const { accountSid, authToken } = getParentCredentials();
  const { firstName, lastName } = splitName(customer.contact_name);

  // 1. Create Customer Profile
  const profile = await twilioFetch<CustomerProfileResponse>({
    baseUrl: "trusthub",
    path: "/v1/CustomerProfiles",
    method: "POST",
    params: {
      FriendlyName: `${customer.business_name} - RelayKit`,
      Email: customer.email,
      PolicySid: SOLE_PROP_POLICY_SID,
    },
    accountSid,
    authToken,
    registrationId,
  });

  const trustProductSid = profile.sid;

  // 2. Persist trust_product_sid immediately
  await persistRegistrationField(
    registrationId,
    "twilio_trust_product_sid",
    trustProductSid
  );

  // 3. Create End User
  const endUser = await twilioFetch<EndUserResponse>({
    baseUrl: "trusthub",
    path: "/v1/EndUsers",
    method: "POST",
    params: {
      FriendlyName: customer.contact_name,
      Type: "sole_proprietor",
      Attributes: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        phone_number: formatPhone(customer.phone),
        email: customer.email,
        address: {
          street: customer.address_line1,
          city: customer.address_city,
          region: customer.address_state,
          postal_code: customer.address_zip,
          iso_country: "US",
        },
      }),
    },
    accountSid,
    authToken,
    registrationId,
  });

  const endUserSid = endUser.sid;

  // 4. Persist end_user_sid
  await persistRegistrationField(
    registrationId,
    "twilio_end_user_sid",
    endUserSid
  );

  // 5. Attach End User to Customer Profile
  await twilioFetch<EntityAssignmentResponse>({
    baseUrl: "trusthub",
    path: `/v1/CustomerProfiles/${trustProductSid}/EntityAssignments`,
    method: "POST",
    params: {
      ObjectSid: endUserSid,
    },
    accountSid,
    authToken,
    registrationId,
  });

  // 6. Submit Customer Profile for review
  await twilioFetch<CustomerProfileResponse>({
    baseUrl: "trusthub",
    path: `/v1/CustomerProfiles/${trustProductSid}`,
    method: "POST",
    params: {
      Status: "pending-review",
    },
    accountSid,
    authToken,
    registrationId,
  });

  // 7. Create Brand Registration
  const brand = await twilioFetch<BrandRegistrationResponse>({
    baseUrl: "messaging",
    path: "/v1/a2p/BrandRegistrations",
    method: "POST",
    params: {
      CustomerProfileBundleSid: trustProductSid,
      A2PProfileBundleSid: trustProductSid,
      BrandType: "SOLE_PROPRIETOR",
    },
    accountSid,
    authToken,
    registrationId,
  });

  return {
    trustProductSid,
    endUserSid,
    brandSid: brand.sid,
  };
}

// ---------------------------------------------------------------------------
// submitStandardBrand
// ---------------------------------------------------------------------------

/**
 * Submits a standard brand registration (EIN-based) through Twilio Trust Hub.
 *
 * Steps:
 * 1. Create Customer Profile with standard policy
 * 2. Create Business End User
 * 3. Create Authorized Representative End User
 * 4. Create Address
 * 5. Attach all three to Customer Profile
 * 6. Submit Customer Profile for review
 * 7. Create Brand Registration
 */
export async function submitStandardBrand(
  registrationId: string,
  customer: CustomerData,
  complianceSiteUrl: string
): Promise<BrandResult> {
  const { accountSid, authToken } = getParentCredentials();
  const { firstName, lastName } = splitName(customer.contact_name);

  // 1. Create Customer Profile
  const profile = await twilioFetch<CustomerProfileResponse>({
    baseUrl: "trusthub",
    path: "/v1/CustomerProfiles",
    method: "POST",
    params: {
      FriendlyName: `${customer.business_name} - RelayKit`,
      Email: customer.email,
      PolicySid: STANDARD_POLICY_SID,
    },
    accountSid,
    authToken,
    registrationId,
  });

  const trustProductSid = profile.sid;

  // 2. Persist trust_product_sid immediately
  await persistRegistrationField(
    registrationId,
    "twilio_trust_product_sid",
    trustProductSid
  );

  // 3. Create Business End User
  const endUser = await twilioFetch<EndUserResponse>({
    baseUrl: "trusthub",
    path: "/v1/EndUsers",
    method: "POST",
    params: {
      FriendlyName: customer.business_name,
      Type: "customer_profile_business_information",
      Attributes: JSON.stringify({
        business_name: customer.business_name,
        business_type: customer.business_type ?? "Partnership",
        business_registration_identifier: customer.ein ?? "",
        business_identity: "direct_customer",
        business_industry: "TECHNOLOGY",
        business_regions_of_operation: "USA",
        website_url: complianceSiteUrl,
        social_media_profile_urls: "",
      }),
    },
    accountSid,
    authToken,
    registrationId,
  });

  const endUserSid = endUser.sid;

  // 4. Persist end_user_sid
  await persistRegistrationField(
    registrationId,
    "twilio_end_user_sid",
    endUserSid
  );

  // 5. Create Authorized Representative
  const authRep = await twilioFetch<EndUserResponse>({
    baseUrl: "trusthub",
    path: "/v1/EndUsers",
    method: "POST",
    params: {
      FriendlyName: customer.contact_name,
      Type: "authorized_representative_1",
      Attributes: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        phone_number: formatPhone(customer.phone),
        email: customer.email,
        title: "Owner",
      }),
    },
    accountSid,
    authToken,
    registrationId,
  });

  // 6. Create Address
  const address = await twilioFetch<AddressResponse>({
    baseUrl: "api",
    path: `/2010-04-01/Accounts/${accountSid}/Addresses.json`,
    method: "POST",
    params: {
      FriendlyName: `${customer.business_name} Address`,
      CustomerName: customer.business_name,
      Street: customer.address_line1,
      City: customer.address_city,
      Region: customer.address_state,
      PostalCode: customer.address_zip,
      IsoCountry: "US",
    },
    accountSid,
    authToken,
    registrationId,
  });

  const addressSid = address.sid;

  // 7. Persist address_sid
  await persistRegistrationField(
    registrationId,
    "twilio_address_sid",
    addressSid
  );

  // 8. Attach End User, Authorized Representative, and Address to Customer Profile
  for (const objectSid of [endUserSid, authRep.sid, addressSid]) {
    await twilioFetch<EntityAssignmentResponse>({
      baseUrl: "trusthub",
      path: `/v1/CustomerProfiles/${trustProductSid}/EntityAssignments`,
      method: "POST",
      params: {
        ObjectSid: objectSid,
      },
      accountSid,
      authToken,
      registrationId,
    });
  }

  // 9. Submit Customer Profile for review
  await twilioFetch<CustomerProfileResponse>({
    baseUrl: "trusthub",
    path: `/v1/CustomerProfiles/${trustProductSid}`,
    method: "POST",
    params: {
      Status: "pending-review",
    },
    accountSid,
    authToken,
    registrationId,
  });

  // 10. Create Brand Registration
  const brand = await twilioFetch<BrandRegistrationResponse>({
    baseUrl: "messaging",
    path: "/v1/a2p/BrandRegistrations",
    method: "POST",
    params: {
      CustomerProfileBundleSid: trustProductSid,
      A2PProfileBundleSid: trustProductSid,
    },
    accountSid,
    authToken,
    registrationId,
  });

  return {
    trustProductSid,
    endUserSid,
    brandSid: brand.sid,
    addressSid,
  };
}
