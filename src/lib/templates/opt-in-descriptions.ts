import type { UseCaseId } from "@/lib/intake/use-case-data";
import type { TemplateVariables } from "./types";

const TEMPLATES: Record<UseCaseId, (v: TemplateVariables) => string> = {
  appointments: (v) =>
    `Customers provide opt-in consent when booking an appointment through the ${v.business_name} website at ${v.website_url}. The booking form includes a phone number field and an unchecked consent checkbox with the following disclosure: "By providing your phone number, you agree to receive appointment reminders and scheduling messages from ${v.business_name}. Message frequency varies. Msg & data rates may apply. Reply HELP for help. Reply STOP to cancel." Customers who book in person provide verbal consent after staff reads the SMS disclosure. The privacy policy at ${v.website_url}/privacy contains additional details about data handling.`,

  orders: (v) =>
    `Customers provide opt-in consent during checkout on the ${v.business_name} website at ${v.website_url}. The checkout form includes a phone number field and an unchecked consent checkbox with the following disclosure: "By providing your phone number, you agree to receive order updates and delivery notifications from ${v.business_name}. Message frequency varies by order. Msg & data rates may apply. Reply HELP for help. Reply STOP to cancel." The privacy policy at ${v.website_url}/privacy contains additional details about data handling.`,

  verification: (v) =>
    `Users provide opt-in consent when they enter their phone number during account registration or when they request a verification code on the ${v.app_name} platform at ${v.website_url}. The phone number input includes a disclosure: "We'll send a verification code to this number. Msg & data rates may apply." Verification codes are sent only when explicitly requested by the user. The privacy policy at ${v.website_url}/privacy contains additional details about data handling.`,

  support: (v) =>
    `Customers provide opt-in consent when they initiate a support conversation by texting the ${v.business_name} support number or by submitting their phone number on the support page at ${v.website_url}. The support page includes a disclosure: "By providing your phone number, you agree to receive support-related messages from ${v.business_name}. Message frequency varies. Msg & data rates may apply. Reply HELP for help. Reply STOP to cancel." The privacy policy at ${v.website_url}/privacy contains additional details about data handling.`,

  marketing: (v) =>
    `Customers provide explicit opt-in consent by completing the SMS subscription form on the ${v.business_name} website at ${v.website_url}. The form includes a phone number field and an unchecked consent checkbox with the following disclosure: "By checking this box and providing your phone number, you consent to receive marketing and promotional messages from ${v.business_name}. Message frequency: ${v.message_frequency}. Msg & data rates may apply. Reply HELP for help. Reply STOP to cancel. View our Privacy Policy at ${v.website_url}/privacy and Terms at ${v.website_url}/terms." Consent is not a condition of purchase.`,

  internal: (v) =>
    `Team members provide opt-in consent during onboarding by acknowledging the ${v.business_name} internal messaging policy. The policy states: "By providing your phone number, you agree to receive operational notifications and schedule updates from ${v.business_name}. Message frequency varies. Msg & data rates may apply. Reply HELP for help. Reply STOP to cancel." The privacy policy at ${v.website_url}/privacy contains additional details about data handling.`,

  community: (v) =>
    `Members provide opt-in consent when joining ${v.community_name} by entering their phone number on the sign-up page at ${v.website_url}. The sign-up form includes an unchecked consent checkbox with the following disclosure: "By providing your phone number, you agree to receive community updates and event notifications from ${v.community_name}. Message frequency: ${v.message_frequency}. Msg & data rates may apply. Reply HELP for help. Reply STOP to cancel." The privacy policy at ${v.website_url}/privacy contains additional details about data handling.`,

  waitlist: (v) =>
    `Customers provide opt-in consent when joining the waitlist at ${v.business_name} through the website at ${v.website_url} or in person. The waitlist form includes a phone number field with the following disclosure: "By providing your phone number, you agree to receive waitlist updates and reservation notifications from ${v.business_name}. Message frequency varies. Msg & data rates may apply. Reply HELP for help. Reply STOP to cancel." Customers who join in person provide verbal consent after staff reads the SMS disclosure. The privacy policy at ${v.website_url}/privacy contains additional details about data handling.`,

  exploring: (v) =>
    `Users provide opt-in consent by entering their phone number on the ${v.business_name} website at ${v.website_url}. The form includes an unchecked consent checkbox with the following disclosure: "By providing your phone number, you agree to receive service notifications and updates from ${v.business_name}. Message frequency varies. Msg & data rates may apply. Reply HELP for help. Reply STOP to cancel." The privacy policy at ${v.website_url}/privacy contains additional details about data handling.`,
};

export function renderOptInDescription(
  useCase: UseCaseId,
  vars: TemplateVariables,
): string {
  return TEMPLATES[useCase](vars);
}
