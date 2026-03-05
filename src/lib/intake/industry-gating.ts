/**
 * Three-tier industry gating for intake wizard Screen 2.
 * See D-49 (DECISIONS.md) and D-18 (healthcare hard decline).
 *
 * Tier 1: Advisory — elevated carrier scrutiny but registrable (legal, financial, restaurants)
 * Tier 2: Hard decline + waitlist — healthcare (no HIPAA/BAA per D-18)
 * Tier 3: Hard decline, no waitlist — carrier ecosystem exclusions (cannabis, firearms)
 */

export type IndustryTier =
  | "advisory"
  | "hard_decline_waitlist"
  | "hard_decline_blocked";

export interface IndustryGateResult {
  tier: IndustryTier;
  industry: string;
  label: string;
  message: string;
}

interface IndustryPattern {
  industry: string;
  label: string;
  tier: IndustryTier;
  keywords: RegExp[];
  message: string;
}

/**
 * Industry patterns ordered by tier severity (most restrictive first).
 * Tier 3 and Tier 2 are checked before Tier 1 so a healthcare match
 * isn't accidentally shadowed by a less-restrictive vertical.
 */
const INDUSTRY_PATTERNS: IndustryPattern[] = [
  // --- Tier 3: Hard decline, no waitlist ---
  {
    industry: "cannabis",
    label: "Cannabis",
    tier: "hard_decline_blocked",
    keywords: [
      /\b(cannabis|marijuana|dispensary|cbd|thc|hemp)\b/i,
      /\b(weed|pot shop|edibles)\b/i,
      /\b(grow(ery|house))\b/i,
    ],
    message:
      "US carriers don't allow cannabis messaging through standard 10DLC registration. This is a carrier-level restriction across all providers.",
  },
  {
    industry: "firearms",
    label: "Firearms",
    tier: "hard_decline_blocked",
    keywords: [
      /\b(firearm|gun shop|gun store|ammunition|ammo)\b/i,
      /\b(weapons? (store|shop|dealer))\b/i,
      /\b(shooting range|armory|arms dealer)\b/i,
    ],
    message:
      "US carriers don't allow firearms messaging through standard 10DLC registration. This is a carrier-level restriction across all providers.",
  },

  // --- Tier 2: Hard decline + waitlist (healthcare per D-18) ---
  {
    industry: "healthcare",
    label: "Healthcare",
    tier: "hard_decline_waitlist",
    keywords: [
      /\b(dent(al|ist|istry))\b/i,
      /\b(orthodont|endodont|oral surgery)\b/i,
      /\b(doctor|physician|medical|clinic|primary care)\b/i,
      /\b(family medicine|internal medicine|urgent care)\b/i,
      /\b(therap(y|ist)|counsel(or|ing)|psychiatr|psycholog)\b/i,
      /\b(mental health|behavioral health|social work)\b/i,
      /\b(physical therapy|physiotherapy|pt clinic|rehab(ilitation)?)\b/i,
      /\b(chiropractic|chiropractor)\b/i,
      /\b(hospital|surgery center|health(care)?)\b/i,
      /\b(hipaa|patient|ehr|emr|telehealth|telemedicine)\b/i,
      /\b(pharmacy|pharmacist|rx|prescription)\b/i,
      /\b(optometr|ophthalmolog|dermatolog|pediatric|obstetr|gynecolog)\b/i,
    ],
    message:
      "Healthcare messaging involves patient data protections we can't support yet. Join our waitlist and we'll reach out when this changes.",
  },

  // --- Tier 1: Advisory (proceed allowed) ---
  {
    industry: "legal",
    label: "Legal",
    tier: "advisory",
    keywords: [
      /\b(law firm|attorney|lawyer|legal|paralegal|law office|counsel|litigation)\b/i,
    ],
    message:
      "Carriers scrutinize legal messaging closely. We'll structure your registration to address their review criteria — no extra steps on your part.",
  },
  {
    industry: "financial",
    label: "Financial Services",
    tier: "advisory",
    keywords: [
      /\b(financial advis|investment|wealth management|accounting|tax prep)\b/i,
      /\b(mortgage|lending|insurance agent|cpa|bookkeep)\b/i,
    ],
    message:
      "Financial services messaging gets extra carrier scrutiny. We'll structure your registration to address their review criteria — no extra steps on your part.",
  },
  {
    industry: "restaurant",
    label: "Restaurant",
    tier: "advisory",
    keywords: [
      /\b(restaurant|cafe|bistro|diner|eatery|bar |pub |grill|pizzeria|bakery|catering|food truck)\b/i,
    ],
    message:
      "Restaurant messaging sometimes triggers carrier review for promotional content. We'll structure your registration to cover both reservations and offers.",
  },
];

/**
 * Detect if the business description or service type triggers an industry gate.
 * Returns the first (most restrictive) match, or null if no gate applies.
 */
export function detectIndustryGate(
  businessDescription: string,
  serviceType?: string | null,
): IndustryGateResult | null {
  const desc = businessDescription.trim();
  const svc = serviceType?.trim() ?? "";

  if (!desc && !svc) return null;

  for (const pattern of INDUSTRY_PATTERNS) {
    for (const keyword of pattern.keywords) {
      if (keyword.test(desc) || (svc && keyword.test(svc))) {
        return {
          tier: pattern.tier,
          industry: pattern.industry,
          label: pattern.label,
          message: pattern.message,
        };
      }
    }
  }

  return null;
}
