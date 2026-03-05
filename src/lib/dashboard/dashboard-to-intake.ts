import type { MessagePlanEntry } from "./message-plan-types";
import { determineCampaignType } from "@/lib/intake/campaign-type";
import type { UseCaseId } from "@/lib/intake/use-case-data";

/**
 * Data contract for dashboard → intake wizard pre-population.
 * Serialized to sessionStorage under `relaykit_intake_data`.
 * See PRD_01_ADDENDUM_DASHBOARD_FLOW.md Section 2.
 */
export interface DashboardToIntakeData {
  use_case: string;
  expansions: string[];
  effective_campaign_type: "standard" | "mixed" | "marketing";
  selected_messages: {
    template_id: string;
    category: string;
    text: string;
    trigger: string;
    is_expansion: boolean;
    expansion_type?: string;
  }[];
  email: string;
  preferred_area_code?: string;
}

const STORAGE_KEY = "relaykit_intake_data";

/**
 * Build the DashboardToIntakeData payload from the current dashboard state.
 */
export function buildIntakeData(
  useCase: UseCaseId,
  entries: MessagePlanEntry[],
  email: string,
): DashboardToIntakeData {
  const enabledEntries = entries.filter((e) => e.enabled);

  // Collect expansion IDs for enabled expansion messages
  const expansions = enabledEntries
    .filter((e) => e.is_expansion)
    .map((e) => e.template_id);

  // Map campaign type from determineCampaignType — normalize to the three expected values
  const rawType = determineCampaignType(useCase, expansions);
  let effectiveCampaignType: "standard" | "mixed" | "marketing";
  if (rawType === "MARKETING") {
    effectiveCampaignType = "marketing";
  } else if (rawType === "MIXED" || rawType === "LOW_VOLUME_MIXED") {
    effectiveCampaignType = "mixed";
  } else {
    effectiveCampaignType = "standard";
  }

  const selectedMessages = enabledEntries.map((e) => ({
    template_id: e.template_id,
    category: e.category,
    text: e.edited_text ?? e.original_template,
    trigger: e.trigger,
    is_expansion: e.is_expansion,
    ...(e.expansion_type ? { expansion_type: e.expansion_type } : {}),
  }));

  return {
    use_case: useCase,
    expansions,
    effective_campaign_type: effectiveCampaignType,
    selected_messages: selectedMessages,
    email,
  };
}

/**
 * Serialize dashboard data to sessionStorage for the intake wizard.
 */
export function saveDashboardIntakeData(data: DashboardToIntakeData): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // sessionStorage unavailable — silently ignore
  }
}

/**
 * Read dashboard data from sessionStorage (used by the intake wizard).
 */
export function getDashboardIntakeData(): DashboardToIntakeData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.use_case ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Clear dashboard data from sessionStorage (after successful payment).
 */
export function clearDashboardIntakeData(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // silently ignore
  }
}
