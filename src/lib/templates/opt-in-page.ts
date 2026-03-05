import type { UseCaseId } from "@/lib/intake/use-case-data";
import type { OptInPageContent, TemplateVariables } from "./types";

const SUBHEADS: Record<UseCaseId, (v: TemplateVariables) => string> = {
  appointments: () =>
    "Enter your phone number to receive appointment reminders and scheduling updates.",
  orders: () =>
    "Enter your phone number to receive order confirmations and delivery updates.",
  verification: () =>
    "Enter your phone number to receive verification codes.",
  support: () =>
    "Enter your phone number to receive customer support messages.",
  marketing: (v) =>
    `Sign up to receive exclusive offers and updates from ${v.business_name}.`,
  internal: () =>
    "Enter your phone number to receive team notifications and schedule updates.",
  community: (v) =>
    `Join ${v.community_name} to receive event updates and community announcements.`,
  waitlist: () =>
    "Enter your phone number to receive waitlist and reservation updates.",
  exploring: () =>
    "Enter your phone number to receive service notifications and updates.",
};

export function renderOptInPageContent(
  useCase: UseCaseId,
  vars: TemplateVariables,
): OptInPageContent {
  return {
    heading: `Get ${vars.use_case_label} from ${vars.business_name}`,
    subhead: SUBHEADS[useCase](vars),
    consent_checkbox_text: `By checking this box and submitting this form, I consent to receive ${vars.use_case_label} text messages from ${vars.business_name} at the phone number provided. Message frequency: ${vars.message_frequency}. Message and data rates may apply. Reply HELP for help. Reply STOP to cancel. View our Privacy Policy (${vars.website_url}/privacy) and Terms of Service (${vars.website_url}/terms).`,
    fine_print: `By opting in, you agree to receive automated text messages from ${vars.business_name}. Consent is not a condition of purchase. Message and data rates may apply. Message frequency: ${vars.message_frequency}. Text STOP to opt out at any time. Text HELP for help. View our Privacy Policy and Terms of Service.`,
  };
}
