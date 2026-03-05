// ---------------------------------------------------------------------------
// RegistrationContext — Phase 2 multi-project guardrail
// ---------------------------------------------------------------------------
//
// Minimal context object threaded through the registration pipeline.
// V1: customerId + registrationId only. Phase 2 adds projectId to support
// multi-project registrations under a single customer.

/**
 * Context object passed through the registration pipeline.
 *
 * Phase 2: projectId will become required when multi-project support ships
 * (PRD_11). All pipeline functions that accept RegistrationContext will
 * automatically gain project-scoping without signature changes.
 */
export interface RegistrationContext {
  customerId: string;
  registrationId: string;
  /** Phase 2: multi-project. Will become required after migration. */
  projectId?: string;
}

/**
 * Builds a RegistrationContext from IDs.
 *
 * V1: pass-through. Phase 2: will resolve projectId from the registration
 * record or default project lookup.
 */
export function buildRegistrationContext(
  customerId: string,
  registrationId: string
): RegistrationContext {
  return { customerId, registrationId };
}
