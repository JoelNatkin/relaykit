import type { UseCaseId } from "@/lib/intake/use-case-data";

// --- Input: what the template engine receives from intake ---

export interface IntakeData {
  use_case: UseCaseId;
  business_name: string;
  business_description: string;
  email: string;
  phone: string;
  contact_name: string;
  address_line1: string;
  address_city: string;
  address_state: string;
  address_zip: string;
  website_url: string | null;
  service_type: string | null;
  product_type: string | null;
  app_name: string | null;
  community_name: string | null;
  venue_type: string | null;
  has_ein: boolean;
  ein: string | null;
  business_type: string | null;
}

// --- Derived: variables available in all templates ---

export interface TemplateVariables {
  business_name: string;
  business_description: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  address_full: string;
  website_url: string;
  use_case_label: string;
  message_frequency: string;
  service_type: string;
  product_type: string;
  app_name: string;
  community_name: string;
  venue_type: string;
  compliance_site_url: string;
  current_date: string;
  current_year: string;
}

// --- Output: what the template engine produces ---

export interface OptInPageContent {
  heading: string;
  subhead: string;
  consent_checkbox_text: string;
  fine_print: string;
}

export interface GeneratedArtifacts {
  campaign_description: string;
  sample_messages: string[];
  opt_in_description: string;
  privacy_policy: string;
  terms_of_service: string;
  opt_in_page_content: OptInPageContent;
  tcr_use_case: string;
  tcr_flags: Record<string, boolean>;
  compliance_site_slug: string;
}

// --- Constants ---

export const USE_CASE_LABELS: Record<UseCaseId, string> = {
  appointments: "appointment reminders and scheduling updates",
  orders: "order confirmations and delivery notifications",
  verification: "verification codes",
  support: "customer support messages",
  marketing: "promotional offers and updates",
  internal: "team notifications and operational alerts",
  community: "community updates and event notifications",
  waitlist: "waitlist and reservation updates",
  exploring: "service notifications and updates",
};

export const USE_CASE_FREQUENCIES: Record<UseCaseId, string> = {
  appointments: "approximately 2-4 messages per week",
  orders: "approximately 3-5 messages per order",
  verification: "as needed, based on login/verification requests",
  support: "varies based on support interactions",
  marketing: "approximately 2-4 messages per month",
  internal: "varies based on operational needs",
  community: "approximately 2-4 messages per month",
  waitlist: "approximately 1-3 messages per booking",
  exploring: "varies based on usage",
};

export const TCR_USE_CASES: Record<UseCaseId, string> = {
  appointments: "CUSTOMER_CARE",
  orders: "DELIVERY_NOTIFICATIONS",
  verification: "TWO_FACTOR_AUTHENTICATION",
  support: "CUSTOMER_CARE",
  marketing: "MARKETING",
  internal: "LOW_VOLUME",
  community: "LOW_VOLUME",
  waitlist: "MIXED",
  exploring: "LOW_VOLUME",
};

export const TCR_DEFAULT_FLAGS: Record<string, boolean> = {
  hasEmbeddedLinks: true,
  hasEmbeddedPhone: false,
  hasAgeGated: false,
  hasDirectLending: false,
  subscriberOptin: true,
  subscriberOptout: true,
  subscriberHelp: true,
  numberPool: false,
  directLending: false,
  affiliateMarketing: false,
};
