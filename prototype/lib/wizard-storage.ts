/* ── Wizard sessionStorage helpers ──
   Keeps Step 1–5 answers in a single sessionStorage object so every
   wizard page reads and writes to the same place. */

export const WIZARD_STORAGE_KEY = "relaykit_wizard";

/* ── Vertical id → display label (for the nav pill) ── */
export const VERTICAL_LABELS: Record<string, string> = {
  appointments: "Appointments",
  verification: "Verification codes",
  orders: "Order updates",
  support: "Customer support",
  marketing: "Marketing",
  internal: "Team alerts",
  community: "Community",
  waitlist: "Waitlist",
};

export interface WizardData {
  vertical: string;
  businessName: string;
  industry: string;
  serviceType: string;
  website: string;
  context: string;
  verifiedPhone: string;
}

const DEFAULT_DATA: WizardData = {
  vertical: "",
  businessName: "",
  industry: "",
  serviceType: "",
  website: "",
  context: "",
  verifiedPhone: "",
};

export function loadWizardData(): WizardData {
  if (typeof window === "undefined") return { ...DEFAULT_DATA };
  try {
    const raw = sessionStorage.getItem(WIZARD_STORAGE_KEY);
    if (raw) return { ...DEFAULT_DATA, ...JSON.parse(raw) };
  } catch {
    // sessionStorage unavailable
  }
  return { ...DEFAULT_DATA };
}

export function saveWizardData(patch: Partial<WizardData>) {
  if (typeof window === "undefined") return;
  try {
    const current = loadWizardData();
    const next = { ...current, ...patch };
    sessionStorage.setItem(WIZARD_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // sessionStorage unavailable
  }
}
