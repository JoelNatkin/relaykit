// ---------------------------------------------------------------------------
// SHAFT-C content scanner — inline regex-based keyword detection
// ---------------------------------------------------------------------------
// Categories: Sex, Hate, Alcohol, Firearms, Tobacco, Cannabis
// Phase 1: simple keyword matching. Phase 2 adds per-customer allowlists
// based on vertical detection (e.g. restaurants get "wine" allowlisted).

export interface ScanResult {
  passed: boolean;
  detectedCategories: string[];
  matchedTerms: string[];
}

// Each category has word-boundary-aware patterns to reduce false positives.
// \b ensures we match whole words, not substrings (e.g. "grass" won't match
// in "grasshopper" but will match standalone).
const SHAFT_C_PATTERNS: Record<string, RegExp[]> = {
  sex: [
    /\bsex\s*(?:ual|ting|y)\b/i,
    /\bporn(?:ography|ographic)?\b/i,
    /\berotic\b/i,
    /\badult\s+content\b/i,
    /\bescort\s+service/i,
    /\bstrip\s*club/i,
    /\bxxx\b/i,
  ],
  hate: [
    /\bhate\s+(?:group|speech|crime)\b/i,
    /\bwhite\s+(?:supremac|power|nationalist)/i,
    /\bneo[\s-]?nazi/i,
    /\bethnic\s+cleansing\b/i,
  ],
  alcohol: [
    /\bbuy\s+(?:alcohol|liquor|beer|wine|vodka|whiskey|bourbon|rum|tequila)\b/i,
    /\balcohol\s+(?:delivery|sale|promo)/i,
    /\bhappy\s+hour\s+(?:special|deal|promo)/i,
    /\bdrink\s+(?:special|deal|promo)/i,
    /\b(?:beer|wine|liquor)\s+(?:sale|special|discount|promo)/i,
  ],
  firearms: [
    /\bbuy\s+(?:gun|firearm|rifle|pistol|ammo|ammunition)\b/i,
    /\bgun\s+(?:sale|deal|show|shop)\b/i,
    /\bfirearms?\s+(?:sale|deal|shop|store)\b/i,
    /\bammunition\s+(?:sale|deal)\b/i,
  ],
  tobacco: [
    /\bbuy\s+(?:cigarette|cigar|tobacco|vape|e-?cig)\b/i,
    /\btobacco\s+(?:sale|shop|store|product)\b/i,
    /\bvape\s+(?:sale|shop|juice|liquid|deal)\b/i,
    /\be-?cigarette/i,
    /\bnicotine\s+(?:product|delivery)\b/i,
  ],
  cannabis: [
    /\bcannabis\b/i,
    /\bmarijuana\b/i,
    /\b(?:cbd|thc)\s+(?:product|oil|gumm|edible)/i,
    /\bdispensary\b/i,
    /\bweed\s+(?:delivery|sale|deal)\b/i,
  ],
};

/**
 * Scan message body for SHAFT-C prohibited content.
 * Returns pass/fail with details on detected categories and terms.
 */
export function scanForShaftC(body: string): ScanResult {
  const detectedCategories: string[] = [];
  const matchedTerms: string[] = [];

  for (const [category, patterns] of Object.entries(SHAFT_C_PATTERNS)) {
    for (const pattern of patterns) {
      const match = body.match(pattern);
      if (match) {
        if (!detectedCategories.includes(category)) {
          detectedCategories.push(category);
        }
        matchedTerms.push(match[0]);
      }
    }
  }

  return {
    passed: detectedCategories.length === 0,
    detectedCategories,
    matchedTerms,
  };
}
