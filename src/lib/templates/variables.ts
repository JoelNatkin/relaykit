import { formatPhone } from "@/lib/intake/validation";
import type { IntakeData, TemplateVariables } from "./types";
import { USE_CASE_LABELS, USE_CASE_FREQUENCIES } from "./types";

const COMPLIANCE_SITE_DOMAIN = process.env.COMPLIANCE_SITE_DOMAIN ?? "msgverified.com";

export function generateComplianceSlug(businessName: string): string {
  return businessName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 30)
    .replace(/-$/, "");
}

export function deriveVariables(intake: IntakeData): TemplateVariables {
  const slug = generateComplianceSlug(intake.business_name);
  const complianceSiteUrl = `https://${slug}.${COMPLIANCE_SITE_DOMAIN}`;
  const websiteUrl = intake.website_url || complianceSiteUrl;

  return {
    business_name: intake.business_name,
    business_description: intake.business_description,
    contact_name: intake.contact_name,
    contact_email: intake.email,
    contact_phone: formatPhone(intake.phone),
    address_full: `${intake.address_line1}, ${intake.address_city}, ${intake.address_state} ${intake.address_zip}`,
    website_url: websiteUrl,
    use_case_label: USE_CASE_LABELS[intake.use_case],
    message_frequency: USE_CASE_FREQUENCIES[intake.use_case],
    service_type: intake.service_type || "",
    product_type: intake.product_type || "",
    app_name: intake.app_name || intake.business_name,
    community_name: intake.community_name || intake.business_name,
    venue_type: intake.venue_type || "",
    compliance_site_url: complianceSiteUrl,
    current_date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    current_year: new Date().getFullYear().toString(),
  };
}
