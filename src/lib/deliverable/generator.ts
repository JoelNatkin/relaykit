import type { UseCaseId } from "@/lib/intake/use-case-data";
import type { CanonMessage } from "./canon-messages";
import { renderCanonMessagesSection } from "./canon-messages";
import { USE_CASE_TIPS } from "./use-case-tips";
import { MESSAGING_SETUP_TEMPLATE } from "./template-relaykit";

export interface MessagingSetupInput {
  business_name: string;
  use_case: UseCaseId;
  registration_date: string;
  rk_live_key: string;
  webhook_secret: string;
  phone_number: string;
  compliance_site_url: string;
  canon_messages: CanonMessage[];
  rate_limit_tier: string;
}

/**
 * Generates the production MESSAGING_SETUP.md by replacing all placeholders
 * in the template with live values from the registration.
 */
export function generateMessagingSetup(input: MessagingSetupInput): string {
  const canonSection = renderCanonMessagesSection(input.canon_messages);
  const tip = USE_CASE_TIPS[input.use_case];

  return MESSAGING_SETUP_TEMPLATE.replace(
    /\{business_name\}/g,
    input.business_name
  )
    .replace(/\{registration_date\}/g, input.registration_date)
    .replace(/\{rk_live_key\}/g, input.rk_live_key)
    .replace(/\{webhook_secret\}/g, input.webhook_secret)
    .replace(/\{canon_messages_section\}/g, canonSection)
    .replace(/\{phone_number\}/g, input.phone_number)
    .replace(/\{compliance_site_url\}/g, input.compliance_site_url)
    .replace(/\{rate_limit_tier\}/g, input.rate_limit_tier)
    .replace(/\{use_case_tip\}/g, tip);
}
