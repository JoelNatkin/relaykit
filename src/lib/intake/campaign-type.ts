import type { UseCaseId } from "./use-case-data";

export const DEFAULT_CAMPAIGN_TYPES: Record<UseCaseId, string> = {
  appointments: "CUSTOMER_CARE",
  orders: "DELIVERY_NOTIFICATIONS",
  verification: "TWO_FACTOR_AUTHENTICATION",
  support: "CUSTOMER_CARE",
  marketing: "MARKETING",
  internal: "LOW_VOLUME",
  community: "LOW_VOLUME",
  waitlist: "MIXED",
};

export function determineCampaignType(
  useCase: UseCaseId,
  expansions: string[],
): string {
  if (expansions.length === 0) {
    return DEFAULT_CAMPAIGN_TYPES[useCase];
  }

  const hasPromoExpansion = expansions.some(
    (e) =>
      e.includes("promotional") ||
      e.includes("offers") ||
      e.includes("reviews"),
  );

  if (hasPromoExpansion) {
    return "MIXED";
  }

  return "LOW_VOLUME_MIXED";
}

export function hasMarketingExpansion(expansions: string[]): boolean {
  return expansions.some(
    (e) =>
      e.includes("promotional") ||
      e.includes("offers") ||
      e.includes("reviews"),
  );
}
