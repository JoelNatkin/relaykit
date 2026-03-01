import type { UseCaseId } from "@/lib/intake/use-case-data";
import type { TemplateVariables } from "./types";

const TEMPLATES: Record<UseCaseId, (v: TemplateVariables) => string> = {
  appointments: (v) =>
    `${v.business_name} sends SMS messages to customers who have opted in to receive appointment reminders, scheduling confirmations, and rescheduling notifications related to ${v.service_type} services. Customers provide consent by entering their phone number on the ${v.business_name} website at ${v.website_url} or by providing their phone number in person during booking. The consent form includes a clear disclosure about message types, frequency, and opt-out instructions. Message frequency is ${v.message_frequency} per recipient. Customers can opt out at any time by replying STOP. Standard message and data rates may apply.`,

  orders: (v) =>
    `${v.business_name} sends SMS messages to customers who have opted in to receive order confirmations, shipping updates, and delivery notifications for ${v.product_type} purchases. Customers provide consent by entering their phone number during checkout on the ${v.business_name} website at ${v.website_url}. The checkout form includes a clear disclosure about message types, frequency, and opt-out instructions. Message frequency is ${v.message_frequency} per recipient, varying based on order activity. Customers can opt out at any time by replying STOP. Standard message and data rates may apply.`,

  verification: (v) =>
    `${v.app_name} sends SMS messages containing one-time verification codes (OTP) to users who have provided their phone number during account registration or login. Messages are sent only when the user initiates a verification request. This is a transactional, security-related use case. Message frequency is as-needed, typically 1-3 messages per login attempt. Users can contact ${v.contact_email} for support. Standard message and data rates may apply.`,

  support: (v) =>
    `${v.business_name} sends and receives SMS messages with customers who have opted in to receive customer support communications. Customers initiate contact by texting the ${v.business_name} support number or by providing their phone number on the support page at ${v.website_url}. The support page includes a clear disclosure about message types and opt-out instructions. Message frequency varies based on support interactions. Customers can opt out at any time by replying STOP. Standard message and data rates may apply.`,

  marketing: (v) =>
    `${v.business_name} sends SMS messages to customers who have opted in to receive promotional offers, product announcements, and marketing communications. Customers provide explicit consent by completing the SMS opt-in form on the ${v.business_name} website at ${v.website_url}. The opt-in form includes a clear disclosure stating message types, expected frequency of ${v.message_frequency}, that message and data rates may apply, and instructions for opting out by replying STOP or requesting help by replying HELP. Customers can opt out at any time by replying STOP.`,

  internal: (v) =>
    `${v.business_name} sends SMS messages to team members and internal staff who have opted in to receive operational notifications, schedule updates, and internal alerts. Team members provide consent when onboarding by acknowledging the messaging policy. Message frequency is ${v.message_frequency}, varying based on operational needs. Recipients can opt out at any time by replying STOP. Standard message and data rates may apply.`,

  community: (v) =>
    `${v.community_name} sends SMS messages to community members who have opted in to receive group updates, event notifications, and community announcements. Members provide consent by joining the community and entering their phone number on the sign-up page at ${v.website_url}. The sign-up form includes a clear disclosure about message types, frequency, and opt-out instructions. Message frequency is ${v.message_frequency}. Members can opt out at any time by replying STOP. Standard message and data rates may apply.`,

  waitlist: (v) =>
    `${v.business_name} sends SMS messages to customers who have opted in to receive waitlist updates, reservation confirmations, and availability notifications related to ${v.venue_type} services. Customers provide consent by entering their phone number when joining the waitlist on the ${v.business_name} website at ${v.website_url} or in person. The form includes a clear disclosure about message types, frequency, and opt-out instructions. Message frequency is ${v.message_frequency} per recipient. Customers can opt out at any time by replying STOP. Standard message and data rates may apply.`,
};

export function renderCampaignDescription(
  useCase: UseCaseId,
  vars: TemplateVariables,
): string {
  return TEMPLATES[useCase](vars);
}
