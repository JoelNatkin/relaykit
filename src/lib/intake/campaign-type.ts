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

  if (expansions.some(isPromoExpansion)) {
    return "MIXED";
  }

  return "LOW_VOLUME_MIXED";
}

/** Expansion IDs that involve marketing, promotional, or sponsored content */
const PROMO_EXPANSION_IDS = new Set([
  // appointments
  "promotional_offers_past_clients",
  "reviews_feedback",
  // orders
  "promotional_offers_past_customers",
  "announce_new_products",
  "reviews_after_delivery",
  // support
  "promotional_offers_support_contacts",
  // community
  "sponsored_partner_content",
  // waitlist
  "promotional_offers_past_guests",
  "reviews_after_visits",
]);

export function isPromoExpansion(id: string): boolean {
  return PROMO_EXPANSION_IDS.has(id);
}

export function hasMarketingExpansion(expansions: string[]): boolean {
  return expansions.some(isPromoExpansion);
}
