import type { UseCaseId } from "@/lib/intake/use-case-data";
import type { TemplateVariables } from "./types";

const TEMPLATES: Record<UseCaseId, (v: TemplateVariables) => string[]> = {
  appointments: (v) => [
    `${v.business_name}: Reminder — your ${v.service_type} appointment is scheduled for tomorrow at 2:00 PM. Reply C to confirm or R to reschedule. Reply STOP to opt out.`,
    `${v.business_name}: Your appointment has been confirmed for March 5 at 10:30 AM. We look forward to seeing you! Reply STOP to unsubscribe.`,
    `${v.business_name}: We have a cancellation! An opening is available on March 8 at 3:00 PM. Reply YES to book. Reply STOP to opt out.`,
  ],

  orders: (v) => [
    `${v.business_name}: Your order #1234 has been confirmed! We'll notify you when it ships. Reply STOP to opt out of notifications.`,
    `${v.business_name}: Great news — your order has shipped! Track it here: https://example.com/track/1234. Reply STOP to unsubscribe.`,
    `${v.business_name}: Your package was delivered today at 2:15 PM. We hope you love it! Reply STOP to opt out.`,
  ],

  verification: (v) => [
    `Your ${v.app_name} verification code is 847293. This code expires in 10 minutes. If you didn't request this, ignore this message.`,
    `${v.app_name}: Your login code is 551628. Do not share this code with anyone.`,
    `${v.app_name}: Use code 392047 to verify your phone number. This code expires in 5 minutes.`,
  ],

  support: (v) => [
    `${v.business_name}: Thanks for reaching out! A support agent will respond shortly. Reply STOP to opt out of messages.`,
    `${v.business_name} Support: Your issue (#4521) has been resolved. Let us know if you need anything else. Reply STOP to unsubscribe.`,
    `${v.business_name}: We received your message and are looking into it. Expected response time: 2 hours. Reply STOP to opt out.`,
  ],

  marketing: (v) => [
    `${v.business_name}: This week only — 20% off your next order with code SAVE20. Shop now at ${v.website_url}. Reply STOP to unsubscribe.`,
    `${v.business_name}: New arrivals just dropped! Check out what's new: ${v.website_url}/new. Msg & data rates may apply. Reply STOP to opt out.`,
    `${v.business_name}: Thanks for being a loyal customer! Enjoy free shipping on your next order. Use code FREESHIP. Reply STOP to unsubscribe.`,
  ],

  internal: (v) => [
    `${v.business_name} Team: Reminder — staff meeting tomorrow at 9:00 AM in the main conference room. Reply STOP to opt out.`,
    `${v.business_name} Alert: Schedule change — your shift on Friday has been moved to 2:00 PM. Please confirm. Reply STOP to unsubscribe.`,
    `${v.business_name} Ops: System maintenance scheduled for tonight 11 PM - 2 AM. Please save your work. Reply STOP to opt out.`,
  ],

  community: (v) => [
    `${v.community_name}: Meetup this Saturday at 10 AM at Central Park! RSVP by replying YES. Reply STOP to opt out of updates.`,
    `${v.community_name}: Welcome to the group! Events and updates will be sent to this number. Reply HELP for info or STOP to leave.`,
    `${v.community_name}: Reminder — dues are due by March 15. Details at ${v.website_url}. Reply STOP to unsubscribe.`,
  ],

  waitlist: (v) => [
    `${v.business_name}: You're on the waitlist! Estimated wait: 25 minutes. We'll text when your table is ready. Reply STOP to opt out.`,
    `${v.business_name}: Your table is ready! Please check in at the host stand within 10 minutes. Reply STOP to unsubscribe.`,
    `${v.business_name}: A reservation has opened up for tonight at 7:30 PM. Reply YES to book or NO to pass. Reply STOP to opt out.`,
  ],

  exploring: (v) => [
    `${v.business_name}: Your request has been confirmed! We'll follow up with details. Reply STOP to opt out.`,
    `${v.business_name}: Reminder — you have an upcoming event tomorrow at 2:00 PM. Reply STOP to unsubscribe.`,
    `${v.business_name}: Update on your request — it's being processed. We'll notify you when it's ready. Reply STOP to opt out.`,
  ],
};

export function renderSampleMessages(
  useCase: UseCaseId,
  vars: TemplateVariables,
): string[] {
  return TEMPLATES[useCase](vars);
}
