import { createServiceClient } from "@/lib/supabase";

// ---------------------------------------------------------------------------
// Registration status types
// ---------------------------------------------------------------------------

export type RegistrationStatus =
  | "pending_payment"
  | "creating_subaccount"
  | "generating_artifacts"
  | "deploying_site"
  | "submitting_brand"
  | "awaiting_otp"
  | "brand_pending"
  | "brand_approved"
  | "vetting_in_progress"
  | "creating_service"
  | "submitting_campaign"
  | "campaign_pending"
  | "provisioning_number"
  | "generating_api_key"
  | "complete"
  | "rejected"
  | "needs_attention";

// ---------------------------------------------------------------------------
// Valid state transitions
// ---------------------------------------------------------------------------

export const VALID_TRANSITIONS: Record<
  RegistrationStatus,
  readonly RegistrationStatus[]
> = {
  pending_payment: ["creating_subaccount"],
  creating_subaccount: ["generating_artifacts", "needs_attention"],
  generating_artifacts: ["deploying_site", "needs_attention"],
  deploying_site: ["submitting_brand", "needs_attention"],
  submitting_brand: ["awaiting_otp", "brand_pending", "needs_attention"],
  awaiting_otp: ["brand_pending", "needs_attention"],
  brand_pending: ["brand_approved", "rejected", "needs_attention"],
  brand_approved: [
    "vetting_in_progress",
    "creating_service",
    "needs_attention",
  ],
  vetting_in_progress: ["creating_service", "rejected", "needs_attention"],
  creating_service: ["submitting_campaign", "needs_attention"],
  submitting_campaign: ["campaign_pending", "needs_attention"],
  campaign_pending: ["provisioning_number", "rejected", "needs_attention"],
  provisioning_number: ["generating_api_key", "needs_attention"],
  generating_api_key: ["complete", "needs_attention"],
  complete: [],
  rejected: ["submitting_brand", "submitting_campaign", "needs_attention"],
  needs_attention: [
    "creating_subaccount",
    "generating_artifacts",
    "deploying_site",
    "submitting_brand",
    "awaiting_otp",
    "brand_pending",
    "brand_approved",
    "vetting_in_progress",
    "creating_service",
    "submitting_campaign",
    "campaign_pending",
    "provisioning_number",
    "generating_api_key",
  ],
} as const;

// ---------------------------------------------------------------------------
// State transition errors
// ---------------------------------------------------------------------------

export class InvalidTransitionError extends Error {
  fromStatus: RegistrationStatus;
  toStatus: RegistrationStatus;

  constructor(fromStatus: RegistrationStatus, toStatus: RegistrationStatus) {
    super(
      `Invalid state transition: "${fromStatus}" → "${toStatus}". ` +
        `Valid targets from "${fromStatus}": [${VALID_TRANSITIONS[fromStatus].join(", ")}]`
    );
    this.name = "InvalidTransitionError";
    this.fromStatus = fromStatus;
    this.toStatus = toStatus;
  }
}

export class StaleStatusError extends Error {
  registrationId: string;
  expectedStatus: RegistrationStatus;

  constructor(registrationId: string, expectedStatus: RegistrationStatus) {
    super(
      `Optimistic lock failed for registration "${registrationId}". ` +
        `Expected status "${expectedStatus}" but row was not found or status has changed.`
    );
    this.name = "StaleStatusError";
    this.registrationId = registrationId;
    this.expectedStatus = expectedStatus;
  }
}

// ---------------------------------------------------------------------------
// updateStatus — validates transition, updates row, and logs event
// ---------------------------------------------------------------------------

/**
 * Transitions a registration from one status to another.
 *
 * 1. Validates the transition against `VALID_TRANSITIONS`.
 * 2. Updates `registrations.status` using an optimistic lock
 *    (`WHERE id = registrationId AND status = fromStatus`).
 * 3. Inserts a row into `registration_events` for the audit trail.
 *
 * @throws {InvalidTransitionError} if the transition is not allowed.
 * @throws {StaleStatusError} if the row's current status doesn't match `fromStatus`.
 * @throws {Error} on unexpected database errors.
 */
export async function updateStatus(
  registrationId: string,
  fromStatus: RegistrationStatus,
  toStatus: RegistrationStatus,
  metadata?: Record<string, unknown>
): Promise<void> {
  // 1. Validate transition
  const allowed = VALID_TRANSITIONS[fromStatus];
  if (!allowed.includes(toStatus)) {
    throw new InvalidTransitionError(fromStatus, toStatus);
  }

  const supabase = createServiceClient();

  // 2. Optimistic lock update
  const { data, error: updateError } = await supabase
    .from("registrations")
    .update({ status: toStatus })
    .eq("id", registrationId)
    .eq("status", fromStatus)
    .select("id")
    .single();

  if (updateError) {
    if (updateError.code === "PGRST116") {
      // PostgREST "no rows returned" — optimistic lock failed
      throw new StaleStatusError(registrationId, fromStatus);
    }
    throw new Error(
      `Failed to update registration status: ${updateError.message}`
    );
  }

  if (!data) {
    throw new StaleStatusError(registrationId, fromStatus);
  }

  // 3. Insert audit event
  const { error: eventError } = await supabase
    .from("registration_events")
    .insert({
      registration_id: registrationId,
      from_status: fromStatus,
      to_status: toStatus,
      metadata: metadata ?? null,
    });

  if (eventError) {
    // Log but don't throw — the status transition already succeeded.
    // An orphaned event is less harmful than rolling back a valid transition.
    console.error(
      `[state-machine] Failed to insert registration_event for ${registrationId}:`,
      eventError.message
    );
  }
}
