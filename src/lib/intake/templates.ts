import type { UseCaseId } from "./use-case-data";

interface TemplateInput {
  use_case: UseCaseId;
  business_name: string;
  business_description: string;
  service_type?: string;
  product_type?: string;
  app_name?: string;
  community_name?: string;
  venue_type?: string;
}

interface TemplateOutput {
  campaign_description: string;
  sample_messages: [string, string, string];
}

const CAMPAIGN_DESCRIPTIONS: Record<UseCaseId, (i: TemplateInput) => string> = {
  appointments: (i) =>
    `${i.business_name} sends appointment confirmations, reminders, and rescheduling notices to customers who have booked ${i.service_type ?? "services"} through our platform. Customers can reply to confirm, reschedule, or cancel their appointments.`,
  orders: (i) =>
    `${i.business_name} sends order confirmations, shipping updates, and delivery notifications to customers who have purchased ${i.product_type ?? "products"} through our platform. Customers can reply with questions about their orders.`,
  verification: (i) =>
    `${i.app_name ?? i.business_name} sends one-time passwords, two-factor authentication codes, and phone verification messages to users who are logging in or verifying their identity on our platform.`,
  support: (i) =>
    `${i.business_name} sends support ticket acknowledgments, status updates, and resolution notifications to customers who have contacted our support team. Customers can reply to continue support conversations.`,
  marketing: (i) =>
    `${i.business_name} sends promotional offers, product announcements, sale notifications, and loyalty updates to customers who have explicitly opted in to receive marketing messages.`,
  internal: (i) =>
    `${i.business_name} sends shift notifications, schedule updates, meeting reminders, and operational alerts to team members and staff who have opted in to receive internal communications.`,
  community: (i) =>
    `${i.community_name ?? i.business_name} sends event announcements, community updates, membership notifications, and group activity alerts to members who have opted in to receive messages.`,
  waitlist: (i) =>
    `${i.business_name} sends waitlist position updates, availability alerts, and reservation confirmations to customers who have joined our waitlist at our ${i.venue_type ?? "venue"}. Customers can reply to accept or decline.`,
};

const SAMPLE_MESSAGES: Record<UseCaseId, (i: TemplateInput) => [string, string, string]> = {
  appointments: (i) => [
    `Hi {{name}}, your appointment with ${i.business_name} is confirmed for {{date}} at {{time}}. Reply YES to confirm or RESCHEDULE to change. Reply STOP to opt out.`,
    `Reminder: You have an appointment tomorrow at {{time}} with ${i.business_name}. Reply CANCEL if you need to cancel. Reply STOP to opt out.`,
    `Thanks for visiting ${i.business_name}! We hope everything went well. Reply STOP to opt out.`,
  ],
  orders: (i) => [
    `Your order #{{order_id}} from ${i.business_name} has been confirmed! We'll notify you when it ships. Reply STOP to opt out.`,
    `Great news! Your order from ${i.business_name} has shipped. Track it here: {{tracking_url}}. Reply STOP to opt out.`,
    `Your ${i.business_name} order has been delivered. Reply STOP to opt out.`,
  ],
  verification: (i) => [
    `Your ${i.app_name ?? i.business_name} verification code is {{code}}. It expires in 10 minutes. Do not share this code. Reply STOP to opt out.`,
    `{{code}} is your ${i.app_name ?? i.business_name} login code. If you didn't request this, ignore this message. Reply STOP to opt out.`,
    `Your phone number has been verified for ${i.app_name ?? i.business_name}. You can now log in. Reply STOP to opt out.`,
  ],
  support: (i) => [
    `${i.business_name} Support: We've received your request (#{{ticket_id}}). A team member will respond shortly. Reply STOP to opt out.`,
    `Update on your support ticket #{{ticket_id}}: {{status_update}}. Reply to this message for more help. Reply STOP to opt out.`,
    `Your support ticket #{{ticket_id}} has been resolved. Thanks for contacting ${i.business_name}! Reply STOP to opt out.`,
  ],
  marketing: (i) => [
    `${i.business_name}: {{promo_message}}! Use code {{code}} for {{discount}}% off. Reply STOP to opt out.`,
    `New from ${i.business_name}: {{product_name}} is now available! Check it out: {{link}}. Reply STOP to opt out.`,
    `${i.business_name} Sale Alert: {{sale_details}}. Shop now: {{link}}. Reply STOP to opt out.`,
  ],
  internal: (i) => [
    `${i.business_name} Team: Your shift on {{date}} has been updated. New time: {{time}}. Reply OK to confirm. Reply STOP to opt out.`,
    `Reminder: Team meeting today at {{time}}. Agenda: {{topic}}. — ${i.business_name}. Reply STOP to opt out.`,
    `${i.business_name} Alert: {{alert_message}}. Contact your manager if you have questions. Reply STOP to opt out.`,
  ],
  community: (i) => [
    `${i.community_name ?? i.business_name}: {{event_name}} is happening on {{date}}! Reply YES to RSVP. Reply STOP to opt out.`,
    `Update from ${i.community_name ?? i.business_name}: {{update_message}}. Reply STOP to opt out.`,
    `${i.community_name ?? i.business_name}: Welcome, {{name}}! You're now a member. Reply STOP to opt out.`,
  ],
  waitlist: (i) => [
    `${i.business_name}: Great news! Your spot is ready. Please arrive within {{minutes}} minutes. Reply YES to confirm. Reply STOP to opt out.`,
    `You're #{{position}} on the waitlist at ${i.business_name}. Estimated wait: {{time}}. Reply STOP to opt out.`,
    `Your reservation at ${i.business_name} for {{date}} at {{time}} is confirmed. Reply CHANGE to modify. Reply STOP to opt out.`,
  ],
};

export function generateTemplates(input: TemplateInput): TemplateOutput {
  return {
    campaign_description: CAMPAIGN_DESCRIPTIONS[input.use_case](input),
    sample_messages: SAMPLE_MESSAGES[input.use_case](input),
  };
}

export function generateComplianceSlug(businessName: string): string {
  return businessName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
