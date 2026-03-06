// ---------------------------------------------------------------------------
// Proxy types — shared across all proxy and sandbox modules
// ---------------------------------------------------------------------------

/**
 * Resolved identity and context after API key authentication.
 *
 * Pre-registration sandbox users have `customerId: null` and `userId` only.
 * Post-registration users have both. The proxy branches on `environment`
 * to determine sandbox vs live behavior.
 */
export interface AuthenticatedContext {
  /** Null for pre-registration sandbox users (no customers row yet). */
  customerId: string | null;
  /** Supabase auth user ID — always present. */
  userId: string;
  /** Determined by API key prefix: rk_sandbox_ or rk_live_. */
  environment: "sandbox" | "live";
  /** Null for sandbox (no registration). */
  registrationId: string | null;
  /** Twilio subaccount SID — null for sandbox. */
  subaccountSid: string | null;
  /** Encrypted Twilio subaccount auth token — null for sandbox. */
  subaccountAuth: string | null;
  /** Twilio Messaging Service SID — null for sandbox. */
  messagingServiceSid: string | null;
  /** Campaign type from registration — null for sandbox. */
  effectiveCampaignType: string | null;
  /** Developer's verified phone — sandbox only. */
  verifiedPhone: string | null;
  /** Registration phone number — live only. */
  phoneNumber: string | null;
  /** Business name from customers table — null for sandbox. */
  businessName: string | null;
}

/** Validated inbound send request. */
export interface SendMessageRequest {
  to: string;
  body: string;
}

/** Result of running the compliance pipeline. */
export interface ComplianceResult {
  passed: boolean;
  checks: Record<string, boolean>;
  errorCode?: string;
  errorMessage?: string;
}

/** Successful send response (202 Accepted). PRD_09 Section 3. */
export interface ProxyResponse {
  id: string;
  object: "message";
  to: string;
  body: string;
  from: string;
  status: string;
  compliance: {
    checks_passed: boolean;
    warnings: string[];
  };
  livemode: boolean;
  created_at: string;
}

/** Structured error response. PRD_09 Section 3. */
export interface ProxyError {
  type: string;
  code: string;
  message: string;
  doc_url: string;
  request_id: string;
}

/** Helper to build a ProxyError with consistent doc_url format. */
export function makeProxyError(
  code: string,
  message: string,
  requestId: string,
): ProxyError {
  return {
    type: "compliance_error",
    code,
    message,
    doc_url: `https://docs.relaykit.dev/errors/${code.replace(/_/g, "-")}`,
    request_id: requestId,
  };
}
