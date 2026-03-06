// ---------------------------------------------------------------------------
// API key authentication — dual-path (pre-reg metadata + post-reg api_keys)
// ---------------------------------------------------------------------------

import { createHash } from "crypto";
import { createServiceClient } from "@/lib/supabase";
import { decryptSecret } from "@/lib/twilio/client";
import type { AuthenticatedContext, ProxyError } from "./types";
import { makeProxyError } from "./types";

type AuthResult =
  | { context: AuthenticatedContext }
  | { error: ProxyError; status: number };

/**
 * Authenticates an API key from the Authorization header.
 *
 * Path 1 (post-registration): SHA-256 hash the key → look up in `api_keys`.
 * Path 2 (pre-registration sandbox): plaintext match against user metadata (D-45).
 *
 * For live keys, additionally verifies:
 * - `customers.live_active === true`
 * - Registration status is `complete`
 */
export async function authenticateApiKey(
  authHeader: string | null,
  requestId: string,
): Promise<AuthResult> {
  // 1. Extract bearer token
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      error: makeProxyError(
        "invalid_api_key",
        "Missing or malformed Authorization header. Expected: Bearer rk_...",
        requestId,
      ),
      status: 401,
    };
  }

  const apiKey = authHeader.slice(7).trim();

  // 2. Validate prefix
  const isSandbox = apiKey.startsWith("rk_sandbox_");
  const isLive = apiKey.startsWith("rk_live_");

  if (!isSandbox && !isLive) {
    return {
      error: makeProxyError(
        "invalid_api_key",
        "API key must start with rk_sandbox_ or rk_live_.",
        requestId,
      ),
      status: 401,
    };
  }

  const environment = isSandbox ? "sandbox" : "live";
  const supabase = createServiceClient();

  // 3. Hash and look up in api_keys table (post-registration path)
  const keyHash = createHash("sha256").update(apiKey).digest("hex");

  const { data: apiKeyRow } = await supabase
    .from("api_keys")
    .select("customer_id, environment, is_active")
    .eq("key_hash", keyHash)
    .maybeSingle();

  if (apiKeyRow) {
    if (!apiKeyRow.is_active) {
      return {
        error: makeProxyError(
          "invalid_api_key",
          "This API key has been revoked.",
          requestId,
        ),
        status: 401,
      };
    }

    return resolvePostRegistrationContext(
      supabase,
      apiKeyRow.customer_id,
      apiKeyRow.environment as "sandbox" | "live",
      requestId,
    );
  }

  // 4. Pre-registration sandbox fallback (D-45: plaintext in user metadata)
  if (isSandbox) {
    return resolvePreRegistrationContext(supabase, apiKey, requestId);
  }

  // Live key not found in api_keys → invalid
  return {
    error: makeProxyError(
      "invalid_api_key",
      "API key not recognized.",
      requestId,
    ),
    status: 401,
  };
}

// ---------------------------------------------------------------------------
// Post-registration context resolution
// ---------------------------------------------------------------------------

async function resolvePostRegistrationContext(
  supabase: ReturnType<typeof createServiceClient>,
  customerId: string,
  environment: "sandbox" | "live",
  requestId: string,
): Promise<AuthResult> {
  // Fetch customer + latest registration in one go
  const { data: customer } = await supabase
    .from("customers")
    .select("id, email, effective_campaign_type, twilio_subaccount_sid, twilio_subaccount_auth, live_active, business_name")
    .eq("id", customerId)
    .single();

  if (!customer) {
    return {
      error: makeProxyError("invalid_api_key", "Customer not found.", requestId),
      status: 401,
    };
  }

  // Look up the user_id from auth.users by email
  const { data: userData } = await supabase.auth.admin.listUsers();
  const user = userData?.users?.find((u) => u.email === customer.email);
  const userId = user?.id ?? "";

  // Fetch latest registration
  const { data: registration } = await supabase
    .from("registrations")
    .select("id, status, twilio_messaging_service_sid, twilio_phone_number")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // For live keys: verify registration is complete
  if (environment === "live") {
    if (!customer.live_active) {
      return {
        error: makeProxyError(
          "registration_not_complete",
          "Your registration is still in progress. Use your sandbox key to continue building while carriers review your campaign.",
          requestId,
        ),
        status: 403,
      };
    }

    if (!registration || registration.status !== "complete") {
      return {
        error: makeProxyError(
          "registration_not_complete",
          "Your registration is still in progress. Use your sandbox key to continue building while carriers review your campaign.",
          requestId,
        ),
        status: 403,
      };
    }
  }

  // Resolve verified phone from user metadata (for sandbox use post-reg)
  const verifiedPhone = user?.user_metadata?.verified_phone ?? null;

  return {
    context: {
      customerId: customer.id,
      userId,
      environment,
      registrationId: registration?.id ?? null,
      subaccountSid: customer.twilio_subaccount_sid ?? null,
      subaccountAuth: customer.twilio_subaccount_auth ?? null,
      messagingServiceSid: registration?.twilio_messaging_service_sid ?? null,
      effectiveCampaignType: customer.effective_campaign_type ?? null,
      verifiedPhone,
      phoneNumber: registration?.twilio_phone_number ?? null,
      businessName: customer.business_name ?? null,
    },
  };
}

// ---------------------------------------------------------------------------
// Pre-registration sandbox context resolution (D-45)
// ---------------------------------------------------------------------------

async function resolvePreRegistrationContext(
  supabase: ReturnType<typeof createServiceClient>,
  apiKey: string,
  requestId: string,
): Promise<AuthResult> {
  // Service-role query: find user with matching sandbox_api_key in metadata.
  // D-45: pre-registration sandbox keys are stored as plaintext in user_metadata.
  const { data: userData } = await supabase.auth.admin.listUsers();
  const user = userData?.users?.find(
    (u) => u.user_metadata?.sandbox_api_key === apiKey,
  );

  if (!user) {
    return {
      error: makeProxyError(
        "invalid_api_key",
        "API key not recognized.",
        requestId,
      ),
      status: 401,
    };
  }

  return {
    context: {
      customerId: null,
      userId: user.id,
      environment: "sandbox",
      registrationId: null,
      subaccountSid: null,
      subaccountAuth: null,
      messagingServiceSid: null,
      effectiveCampaignType: null,
      verifiedPhone: user.user_metadata?.verified_phone ?? null,
      phoneNumber: null,
      businessName: null,
    },
  };
}
