import type { UseCaseId } from "./use-case-data";

const STORAGE_KEY = "relaykit_intake";

export interface IntakeSession {
  use_case?: UseCaseId;
  expansions?: string[];
  campaign_type?: string;
  business_details?: Record<string, string>;
}

export function getIntakeSession(): IntakeSession {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveIntakeSession(updates: Partial<IntakeSession>): void {
  if (typeof window === "undefined") return;
  try {
    const current = getIntakeSession();
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...current, ...updates }),
    );
  } catch {
    // sessionStorage unavailable — silently ignore
  }
}

export function clearIntakeSession(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // silently ignore
  }
}
