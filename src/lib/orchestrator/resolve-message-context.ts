// ---------------------------------------------------------------------------
// resolveMessageContext — Phase 2 multi-project guardrail (D-08)
// ---------------------------------------------------------------------------
//
// V1: pass-through. Returns the same RegistrationContext it receives.
// Phase 2: this function becomes the seam where project-scoped or
// tenant-scoped context is resolved. The proxy pipeline (PRD_09) and
// drift analyzer (PRD_08) will call this to get registration details,
// subaccount credentials, canon messages, and compliance rules scoped
// to the correct project/tenant.

import type { RegistrationContext } from "./registration-context";

/**
 * Resolves message-sending context from a RegistrationContext.
 *
 * V1: identity function — single-project, no resolution needed.
 * Phase 2: will query the registrations table using projectId (or
 * tenantId for platform tier) to return the correct registration's
 * subaccount credentials, canon messages, and compliance rules.
 */
export function resolveMessageContext(
  ctx: RegistrationContext
): RegistrationContext {
  // V1: pass-through. The caller already has the registrationId
  // and customerId needed to query registration data directly.
  return ctx;
}
