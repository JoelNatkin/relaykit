// ---------------------------------------------------------------------------
// Dashboard lifecycle stages — PRD_06 Section 2
// ---------------------------------------------------------------------------
// Computed from customer state, not stored separately (per PRD_06 Section 16).

import type { UseCaseId } from "@/lib/intake/use-case-data";

export type LifecycleStage =
  | "new"                // Stage 1: first visit, no use case selected
  | "use_case_selected"  // Stage 2: use case picked, plan builder visible
  | "building"           // Stage 3: actively building (sent messages or generated spec)
  | "ready"              // Stage 4: engagement signals met, Go Live CTA prominent
  | "registering"        // Stage 5: registration in progress
  | "live";              // Stage 6: approved and live

export interface DashboardState {
  useCase: UseCaseId | null;
  hasPlan: boolean;
  buildSpecGeneratedAt: string | null;
  sandboxMessageCount: number;
  phoneVerified: boolean;
  verifiedPhone: string | null;
  registrationStatus: string | null;
  registrationId: string | null;
  registrationPhone: string | null;
  canonMessageIds: string[];
}

export function computeLifecycleStage(state: DashboardState): LifecycleStage {
  // Stage 6: Live — registration complete
  if (state.registrationStatus === "complete") {
    return "live";
  }

  // Stage 5: Registering — any active registration status
  if (
    state.registrationStatus &&
    state.registrationStatus !== "complete" &&
    state.registrationStatus !== "rejected"
  ) {
    return "registering";
  }

  // Stage 4: Ready — engagement signals met
  if (state.useCase && state.sandboxMessageCount >= 20) {
    return "ready";
  }

  // Stage 3: Building — has sent messages or generated build spec
  if (
    state.useCase &&
    (state.sandboxMessageCount > 0 || state.buildSpecGeneratedAt)
  ) {
    return "building";
  }

  // Stage 2: Use case selected
  if (state.useCase) {
    return "use_case_selected";
  }

  // Stage 1: Brand new
  return "new";
}
