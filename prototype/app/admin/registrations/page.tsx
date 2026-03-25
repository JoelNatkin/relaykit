"use client";

import { useState } from "react";

// ---------------------------------------------------------------------------
// Types & data
// ---------------------------------------------------------------------------

type RegStatus = "awaiting_review" | "in_review" | "approved" | "rejected" | "extended_review" | "declined" | "abandoned";
type AiSignal = "green" | "amber" | "red";

interface AiPreReview {
  signal: AiSignal;
  summary: string;
  suggestedFix?: string;
}

interface Registration {
  id: string;
  customer: string;
  app: string;
  useCase: string;
  status: RegStatus;
  attempt: number;
  submitted: string;
  timeInStatus: string;
  rejectionReason?: string;
  declineReason?: string;
  abandonReason?: string;
  refundStatus?: string;
  emailSent?: boolean;
  aiPreReview?: AiPreReview;
  business: {
    name: string;
    type: string;
    ein: string;
    address: string;
    phone: string;
    email: string;
    website: string;
  };
  campaign: {
    description: string;
    useCase: string;
    messageTypes: string[];
  };
  sampleMessages: { label: string; text: string }[];
  complianceSiteUrl: string;
}

const REGISTRATIONS: Registration[] = [
  {
    id: "reg-1",
    customer: "GlowStudio",
    app: "GlowStudio Booking",
    useCase: "Appointments",
    status: "awaiting_review",
    attempt: 1,
    submitted: "2 hours ago",
    timeInStatus: "Submitted 2 hours ago",
    aiPreReview: { signal: "green", summary: "Ready for submission" },
    business: { name: "GlowStudio LLC", type: "LLC", ein: "***-**-6789", address: "456 Oak Street, Portland, OR 97201", phone: "(503) 555-0142", email: "dev@glowstudio.com", website: "glowstudio.com" },
    campaign: { description: "GlowStudio is a hair salon appointment management platform. Sends booking confirmations, appointment reminders (24h before), pre-visit instructions, reschedule/cancellation notices, and no-show follow-ups to customers who book through the platform.", useCase: "Appointment reminders", messageTypes: ["Booking confirmation", "Appointment reminder", "Pre-visit instructions", "Reschedule notice", "No-show follow-up", "Cancellation notice"] },
    sampleMessages: [
      { label: "Booking confirmation", text: "GlowStudio: Your haircut appointment is confirmed for Mar 28, 2026 at 2:30 PM. Reply STOP to opt out." },
      { label: "Appointment reminder", text: "GlowStudio: Reminder — your haircut appointment is tomorrow at 2:30 PM. Reply STOP to opt out." },
      { label: "Pre-visit instructions", text: "GlowStudio: For your appointment tomorrow, please arrive 10 minutes early. Free parking available behind the building. Reply STOP to opt out." },
      { label: "Reschedule notice", text: "GlowStudio: Your haircut appointment on Mar 28 has been rescheduled to Mar 30 at 3:00 PM. Questions? Reply or call (503) 555-0142. Reply STOP to opt out." },
      { label: "No-show follow-up", text: "GlowStudio: We missed you today! Would you like to rebook your haircut? Visit glowstudio.com/book or call (503) 555-0142. Reply STOP to opt out." },
    ],
    complianceSiteUrl: "glowstudio.msgverified.com",
  },
  {
    id: "reg-2",
    customer: "TechRepair",
    app: "TechRepair Hub",
    useCase: "Support",
    status: "awaiting_review",
    attempt: 1,
    submitted: "yesterday",
    timeInStatus: "Submitted yesterday",
    aiPreReview: { signal: "amber", summary: "Website (techrepair.io) returns 404 — carrier may verify URL during review. Confirm site is live before submitting." },
    business: { name: "TechRepair Inc", type: "Corporation", ein: "***-**-4321", address: "789 Tech Blvd, Austin, TX 78701", phone: "(512) 555-0198", email: "ops@techrepair.io", website: "techrepair.io" },
    campaign: { description: "TechRepair is a device repair service. Sends support ticket acknowledgments, repair status updates, completion notifications, and customer satisfaction follow-ups via SMS.", useCase: "Customer support", messageTypes: ["Ticket acknowledgment", "Status update", "Repair complete", "Satisfaction follow-up", "Pickup reminder"] },
    sampleMessages: [
      { label: "Ticket acknowledgment", text: "TechRepair: We received your repair request #4821. A technician will review it within 2 hours. Reply STOP to opt out." },
      { label: "Status update", text: "TechRepair: Update on repair #4821 — your laptop screen replacement is in progress. Estimated completion: tomorrow by 3 PM. Reply STOP to opt out." },
      { label: "Repair complete", text: "TechRepair: Your repair #4821 is complete! Pick up at 789 Tech Blvd, Austin. Open until 7 PM today. Reply STOP to opt out." },
      { label: "Satisfaction follow-up", text: "TechRepair: How was your repair experience? Rate us at techrepair.io/feedback. Reply STOP to opt out." },
      { label: "Pickup reminder", text: "TechRepair: Reminder — your repaired device is ready for pickup at our Austin location. Reply STOP to opt out." },
    ],
    complianceSiteUrl: "techrepair.msgverified.com",
  },
  {
    id: "reg-3",
    customer: "FreshCuts",
    app: "FreshCuts App",
    useCase: "Appointments",
    status: "rejected",
    attempt: 2,
    submitted: "4 days ago",
    timeInStatus: "Rejected 6 hours ago (2nd attempt)",
    rejectionReason: "Campaign description references 'same-day availability alerts' which carrier classified as promotional content. Carrier requires all message types to be directly triggered by customer action.",
    aiPreReview: { signal: "red", summary: "Carrier flagged 'same-day availability alerts' as promotional. Remove from this campaign or reframe as waitlist-triggered.", suggestedFix: "FreshCuts is a barbershop booking platform. Sends booking confirmations when customers schedule appointments, appointment reminders 24 hours before visits, cancellation notices, waitlist notifications for customers who opted into availability updates, and reschedule confirmations when appointments are moved." },
    business: { name: "FreshCuts Barbershop", type: "Sole Proprietor", ein: "N/A (sole prop)", address: "321 Main St, Denver, CO 80202", phone: "(303) 555-0167", email: "mike@freshcuts.co", website: "freshcuts.co" },
    campaign: { description: "FreshCuts is a barbershop booking platform. Sends booking confirmations when customers schedule appointments, appointment reminders 24 hours before visits, cancellation notices, same-day availability alerts for open slots, and reschedule confirmations when appointments are moved.", useCase: "Appointment reminders", messageTypes: ["Booking confirmation", "Appointment reminder", "Cancellation notice", "Same-day availability", "Reschedule confirmation"] },
    sampleMessages: [
      { label: "Booking confirmation", text: "FreshCuts: Your haircut is booked for Saturday at 11 AM. Reply STOP to opt out." },
      { label: "Appointment reminder", text: "FreshCuts: Reminder — haircut tomorrow at 11 AM. Reply STOP to opt out." },
      { label: "Cancellation notice", text: "FreshCuts: Your appointment on Saturday has been cancelled. To rebook: freshcuts.co/book. Reply STOP to opt out." },
      { label: "Same-day availability", text: "FreshCuts: We have an opening today at 3 PM. Book now at freshcuts.co/book. Reply STOP to opt out." },
      { label: "Reschedule confirmation", text: "FreshCuts: Your appointment has been rescheduled to Sunday at 10 AM. Reply STOP to opt out." },
    ],
    complianceSiteUrl: "freshcuts.msgverified.com",
  },
  {
    id: "reg-4",
    customer: "PetPals",
    app: "PetPals Store",
    useCase: "Orders",
    status: "in_review",
    attempt: 1,
    submitted: "5 days ago",
    timeInStatus: "5 days in carrier review",
    business: { name: "PetPals LLC", type: "LLC", ein: "***-**-8901", address: "567 Pet Lane, Seattle, WA 98101", phone: "(206) 555-0134", email: "hello@petpals.com", website: "petpals.com" },
    campaign: { description: "PetPals is an online pet supply store. Sends order confirmations, shipping notifications, delivery updates, and return/exchange status messages to customers.", useCase: "Order & delivery updates", messageTypes: ["Order confirmation", "Shipping notification", "Delivery update", "Return status", "Delivery ETA"] },
    sampleMessages: [
      { label: "Order confirmation", text: "PetPals: Order #PP-2847 confirmed! 2 items shipping to Seattle, WA. Track at petpals.com/orders. Reply STOP to opt out." },
      { label: "Shipping notification", text: "PetPals: Your order #PP-2847 has shipped! Tracking: 1Z999AA10123456784. Reply STOP to opt out." },
      { label: "Delivery update", text: "PetPals: Your order #PP-2847 was delivered today. Enjoy! Reply STOP to opt out." },
      { label: "Return status", text: "PetPals: Return for order #PP-2847 received. Refund of $34.99 processing — allow 3-5 days. Reply STOP to opt out." },
      { label: "Delivery ETA", text: "PetPals: Your order #PP-2847 is out for delivery today. Expected by 6 PM. Reply STOP to opt out." },
    ],
    complianceSiteUrl: "petpals.msgverified.com",
  },
  {
    id: "reg-5",
    customer: "YogaFlow",
    app: "YogaFlow Studio",
    useCase: "Appointments",
    status: "extended_review",
    attempt: 1,
    submitted: "12 days ago",
    timeInStatus: "12 days — extended review",
    business: { name: "YogaFlow Wellness LLC", type: "LLC", ein: "***-**-5678", address: "234 Zen Ave, Boulder, CO 80301", phone: "(720) 555-0189", email: "admin@yogaflow.co", website: "yogaflow.co" },
    campaign: { description: "YogaFlow is a yoga studio management platform. Sends class booking confirmations, session reminders, schedule changes, and waitlist notifications to members.", useCase: "Appointment reminders", messageTypes: ["Booking confirmation", "Class reminder", "Schedule change", "Waitlist notification", "Pass expiration"] },
    sampleMessages: [
      { label: "Booking confirmation", text: "YogaFlow: You're booked for Hot Yoga on Mar 25 at 6 PM. Bring a towel and water. Reply STOP to opt out." },
      { label: "Class reminder", text: "YogaFlow: Reminder — Hot Yoga tomorrow at 6 PM. Studio B. Reply STOP to opt out." },
      { label: "Schedule change", text: "YogaFlow: Schedule change — your Hot Yoga class moved from 6 PM to 7 PM on Mar 25. Reply STOP to opt out." },
      { label: "Waitlist notification", text: "YogaFlow: A spot opened up! You're off the waitlist for Vinyasa Flow, Mar 27 at 8 AM. Reply STOP to opt out." },
      { label: "Pass expiration", text: "YogaFlow: Your class pass expires in 3 days. Renew at yogaflow.co/membership. Reply STOP to opt out." },
    ],
    complianceSiteUrl: "yogaflow.msgverified.com",
  },
  {
    id: "reg-6",
    customer: "BookWorm",
    app: "BookWorm Auth",
    useCase: "Verification",
    status: "in_review",
    attempt: 1,
    submitted: "2 days ago",
    timeInStatus: "2 days in carrier review",
    business: { name: "BookWorm Inc", type: "Corporation", ein: "***-**-3456", address: "890 Library Dr, Chicago, IL 60601", phone: "(312) 555-0145", email: "dev@bookworm.app", website: "bookworm.app" },
    campaign: { description: "BookWorm is a reading and book-sharing app. Sends one-time passwords for account login, phone number verification codes, and password reset codes.", useCase: "Verification codes", messageTypes: ["OTP login", "Phone verification", "Password reset", "Security code", "Device confirmation"] },
    sampleMessages: [
      { label: "OTP login", text: "BookWorm: Your login code is 847291. Expires in 10 minutes. Reply STOP to opt out." },
      { label: "Phone verification", text: "BookWorm: Verify your phone number. Code: 553018. Reply STOP to opt out." },
      { label: "Password reset", text: "BookWorm: Password reset code: 219847. If you didn't request this, ignore this message. Reply STOP to opt out." },
      { label: "Security code", text: "BookWorm: Your security code is 662193. Do not share this code. Reply STOP to opt out." },
      { label: "Device confirmation", text: "BookWorm: Confirm your new device. Code: 774502. Reply STOP to opt out." },
    ],
    complianceSiteUrl: "bookworm.msgverified.com",
  },
  {
    id: "reg-7",
    customer: "QuickFix Auto",
    app: "QuickFix Dispatch",
    useCase: "Support",
    status: "approved",
    attempt: 1,
    submitted: "4 weeks ago",
    timeInStatus: "Approved 3 weeks ago",
    business: { name: "QuickFix Auto Services LLC", type: "LLC", ein: "***-**-7890", address: "1200 Motor Way, Houston, TX 77001", phone: "(713) 555-0156", email: "dispatch@quickfixauto.com", website: "quickfixauto.com" },
    campaign: { description: "QuickFix Auto is a mobile mechanic service. Sends service request acknowledgments, technician dispatch notifications, arrival updates, and invoice/receipt messages.", useCase: "Customer support", messageTypes: ["Service acknowledgment", "Technician dispatch", "Arrival update", "Invoice sent", "Follow-up"] },
    sampleMessages: [
      { label: "Service acknowledgment", text: "QuickFix Auto: Service request received. A technician will be assigned within 30 minutes. Reply STOP to opt out." },
      { label: "Technician dispatch", text: "QuickFix Auto: Technician Mike is on the way. ETA: 25 minutes. Reply STOP to opt out." },
      { label: "Arrival update", text: "QuickFix Auto: Mike has arrived at your location. Reply STOP to opt out." },
      { label: "Invoice sent", text: "QuickFix Auto: Your service is complete. Invoice: $189.00. View at quickfixauto.com/invoice/4821. Reply STOP to opt out." },
      { label: "Follow-up", text: "QuickFix Auto: How was your service? Rate at quickfixauto.com/feedback. Reply STOP to opt out." },
    ],
    complianceSiteUrl: "quickfixauto.msgverified.com",
  },
  {
    id: "reg-8",
    customer: "MealPrep Pro",
    app: "MealPrep Delivery",
    useCase: "Orders",
    status: "approved",
    attempt: 1,
    submitted: "6 weeks ago",
    timeInStatus: "Approved 1 month ago",
    business: { name: "MealPrep Pro Inc", type: "Corporation", ein: "***-**-2345", address: "456 Kitchen St, San Francisco, CA 94102", phone: "(415) 555-0178", email: "ops@mealpreppro.com", website: "mealpreppro.com" },
    campaign: { description: "MealPrep Pro is a meal delivery service. Sends order confirmations, preparation status, delivery notifications, and weekly menu updates to subscribers.", useCase: "Order & delivery updates", messageTypes: ["Order confirmation", "Prep status", "Delivery notification", "Delivery complete", "Menu update"] },
    sampleMessages: [
      { label: "Order confirmation", text: "MealPrep Pro: Your weekly order is confirmed! 5 meals delivering Tuesday. Reply STOP to opt out." },
      { label: "Prep status", text: "MealPrep Pro: Your meals are being prepared. Chef Marco is on it today. Reply STOP to opt out." },
      { label: "Delivery notification", text: "MealPrep Pro: Your delivery is on the way! ETA: 30 minutes. Reply STOP to opt out." },
      { label: "Delivery complete", text: "MealPrep Pro: Delivery complete. Meals are at your door. Refrigerate within 2 hours. Reply STOP to opt out." },
      { label: "Menu update", text: "MealPrep Pro: This week's menu is live! 12 new meals. Browse at mealpreppro.com/menu. Reply STOP to opt out." },
    ],
    complianceSiteUrl: "mealpreppro.msgverified.com",
  },
  {
    id: "reg-9",
    customer: "CannaBliss",
    app: "CannaBliss Wellness",
    useCase: "Marketing",
    status: "declined",
    attempt: 1,
    submitted: "2 weeks ago",
    timeInStatus: "Declined 1 week ago",
    declineReason: "Industry gating: cannabis-adjacent business detected during website validation. Website promotes CBD products and references THC content. This falls under carrier-prohibited cannabis industry category.",
    refundStatus: "$49 refunded",
    emailSent: false,
    business: { name: "CannaBliss LLC", type: "LLC", ein: "***-**-9012", address: "420 Green St, Denver, CO 80204", phone: "(303) 555-0420", email: "hello@cannabliss.co", website: "cannabliss.co" },
    campaign: { description: "CannaBliss is a CBD wellness shop. Sends promotional offers, new product alerts, and order updates to customers.", useCase: "Marketing & promos", messageTypes: ["Promotional offer", "New product alert", "Order confirmation", "Delivery update"] },
    sampleMessages: [
      { label: "Promotional offer", text: "CannaBliss: 20% off all CBD tinctures this weekend! Shop at cannabliss.co. Reply STOP to opt out." },
      { label: "New product alert", text: "CannaBliss: New arrival — Full Spectrum CBD Gummies now available. cannabliss.co/new. Reply STOP to opt out." },
      { label: "Order confirmation", text: "CannaBliss: Your order #CB-1234 is confirmed. Shipping in 1-2 days. Reply STOP to opt out." },
      { label: "Delivery update", text: "CannaBliss: Your order #CB-1234 has shipped! Track at cannabliss.co/orders. Reply STOP to opt out." },
    ],
    complianceSiteUrl: "cannabliss.msgverified.com",
  },
  {
    id: "reg-10",
    customer: "SpamKing Marketing",
    app: "SpamKing Blaster",
    useCase: "Marketing",
    status: "abandoned",
    attempt: 3,
    submitted: "3 weeks ago",
    timeInStatus: "Abandoned 2 days ago (3rd attempt)",
    abandonReason: "Carrier rejected 3 times: campaign description inconsistent with website content. Business website promotes bulk SMS services and lead generation, which conflicts with the stated 'marketing notifications' use case. Carrier flagged as potential spam operation.",
    refundStatus: "$49 refunded",
    emailSent: false,
    business: { name: "SpamKing Marketing LLC", type: "LLC", ein: "***-**-6666", address: "999 Blast Ave, Las Vegas, NV 89101", phone: "(702) 555-0999", email: "king@spamking.biz", website: "spamking.biz" },
    campaign: { description: "SpamKing Marketing sends promotional notifications and special offers to opt-in subscribers.", useCase: "Marketing & promos", messageTypes: ["Promotional offer", "Flash sale", "New service alert", "Loyalty reward", "Re-engagement"] },
    sampleMessages: [
      { label: "Promotional offer", text: "SpamKing: HUGE DEALS this week! Up to 80% off everything. Shop now at spamking.biz. Reply STOP to opt out." },
      { label: "Flash sale", text: "SpamKing: FLASH SALE — 24 hours only! Don't miss out. spamking.biz/sale. Reply STOP to opt out." },
      { label: "New service alert", text: "SpamKing: We just launched SMS Blaster Pro — send 10,000 texts for $49. spamking.biz/blaster. Reply STOP to opt out." },
      { label: "Loyalty reward", text: "SpamKing: You earned a reward! Claim your free credit at spamking.biz/rewards. Reply STOP to opt out." },
      { label: "Re-engagement", text: "SpamKing: We miss you! Come back and get 50% off your next campaign. spamking.biz. Reply STOP to opt out." },
    ],
    complianceSiteUrl: "spamking.msgverified.com",
  },
];

// ---------------------------------------------------------------------------
// Status config
// ---------------------------------------------------------------------------

const STATUS_CONFIG: Record<RegStatus, { label: string; bg: string; text: string; action: string }> = {
  awaiting_review: { label: "Awaiting review", bg: "bg-blue-100", text: "text-blue-700", action: "Review →" },
  in_review: { label: "In carrier review", bg: "bg-gray-100", text: "text-gray-600", action: "View →" },
  approved: { label: "Approved", bg: "bg-green-100", text: "text-green-700", action: "Details →" },
  rejected: { label: "Rejected", bg: "bg-red-100", text: "text-red-700", action: "Resubmit →" },
  extended_review: { label: "Extended review", bg: "bg-amber-100", text: "text-amber-700", action: "Follow up →" },
  declined: { label: "Declined", bg: "bg-gray-200", text: "text-gray-700", action: "Details →" },
  abandoned: { label: "Abandoned", bg: "bg-gray-200", text: "text-gray-700", action: "Details →" },
};

const CLOSED_STATUSES: RegStatus[] = ["declined", "abandoned"];
const TERMINAL_STATUSES: RegStatus[] = ["approved", ...CLOSED_STATUSES];

type FilterTab = "active" | "awaiting_review" | "in_review" | "extended_review" | "rejected" | "closed" | "all" | "approved";

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: "active", label: "Active" },
  { id: "awaiting_review", label: "Awaiting Review" },
  { id: "in_review", label: "In Carrier Review" },
  { id: "extended_review", label: "Extended Review" },
  { id: "rejected", label: "Rejected" },
  { id: "closed", label: "Closed" },
  { id: "all", label: "All" },
  { id: "approved", label: "Approved" },
];

function filterRegistrations(regs: Registration[], tab: FilterTab): Registration[] {
  if (tab === "all") return regs;
  if (tab === "active") return regs.filter((r) => !TERMINAL_STATUSES.includes(r.status));
  if (tab === "closed") return regs.filter((r) => CLOSED_STATUSES.includes(r.status));
  return regs.filter((r) => r.status === tab);
}

// ---------------------------------------------------------------------------
// Email templates
// ---------------------------------------------------------------------------

function declineEmailPreview(reg: Registration) {
  return {
    subject: "Your RelayKit registration",
    body: `We reviewed your registration for ${reg.app} and unfortunately we're not able to proceed.\n\n${reg.declineReason?.split(". ").slice(0, 1).join(". ")}.\n\nWe've refunded your $49 registration fee. If your situation changes, you're welcome to try again.\n\nBest,\nRelayKit Team`,
  };
}

function abandonEmailPreview(reg: Registration) {
  const reasonSummary = reg.abandonReason?.split(": ").slice(1).join(": ") ?? "multiple carrier rejections";
  return {
    subject: `Update on your ${reg.app} registration`,
    body: `We submitted your registration to carriers ${reg.attempt} times but weren't able to get approval.\n\nThe carrier's feedback was: ${reasonSummary}\n\nWe've refunded your $49 registration fee. If you'd like to discuss options, reply to this email.\n\nBest,\nRelayKit Team`,
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function RegistrationPipelinePage() {
  const [filter, setFilter] = useState<FilterTab>("active");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editableDescriptions, setEditableDescriptions] = useState<Record<string, string>>({});
  const [editableMessages, setEditableMessages] = useState<Record<string, string[]>>({});
  const [editableBusiness, setEditableBusiness] = useState<Record<string, Record<string, string>>>({});
  const [showEmailPreview, setShowEmailPreview] = useState<string | null>(null);

  const filtered = filterRegistrations(REGISTRATIONS, filter);

  const counts: Record<FilterTab, number> = {
    active: REGISTRATIONS.filter((r) => !TERMINAL_STATUSES.includes(r.status)).length,
    all: REGISTRATIONS.length,
    awaiting_review: REGISTRATIONS.filter((r) => r.status === "awaiting_review").length,
    in_review: REGISTRATIONS.filter((r) => r.status === "in_review").length,
    approved: REGISTRATIONS.filter((r) => r.status === "approved").length,
    rejected: REGISTRATIONS.filter((r) => r.status === "rejected").length,
    extended_review: REGISTRATIONS.filter((r) => r.status === "extended_review").length,
    closed: REGISTRATIONS.filter((r) => CLOSED_STATUSES.includes(r.status)).length,
  };

  function toggleRow(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
    setShowEmailPreview(null);
  }

  function getDescription(reg: Registration) {
    return editableDescriptions[reg.id] ?? reg.campaign.description;
  }

  function setDescription(id: string, value: string) {
    setEditableDescriptions((prev) => ({ ...prev, [id]: value }));
  }

  function getMessages(reg: Registration) {
    const overrides = editableMessages[reg.id];
    if (overrides) return reg.sampleMessages.map((m, i) => ({ ...m, text: overrides[i] ?? m.text }));
    return reg.sampleMessages;
  }

  function setMessage(id: string, index: number, value: string) {
    setEditableMessages((prev) => {
      const source = REGISTRATIONS.find((r) => r.id === id)!;
      const current = prev[id] ?? source.sampleMessages.map((m) => m.text);
      const next = [...current];
      next[index] = value;
      return { ...prev, [id]: next };
    });
  }

  function getBusinessField(reg: Registration, field: string) {
    return editableBusiness[reg.id]?.[field] ?? (reg.business as Record<string, string>)[field] ?? "";
  }

  function setBusinessField(id: string, field: string, value: string) {
    setEditableBusiness((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  }

  function isBusinessEdited(reg: Registration, field: string) {
    const override = editableBusiness[reg.id]?.[field];
    return override !== undefined && override !== (reg.business as Record<string, string>)[field];
  }

  const isEditable = (status: RegStatus) => status === "awaiting_review" || status === "rejected";

  function statusLabel(reg: Registration) {
    const base = STATUS_CONFIG[reg.status].label;
    if (reg.attempt > 1) return `${base} (${reg.attempt}${reg.attempt === 2 ? "nd" : reg.attempt === 3 ? "rd" : "th"} attempt)`;
    return base;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Registration Pipeline</h1>
          <p className="mt-1 text-sm text-text-tertiary">Review, submit, and track carrier registrations</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition duration-100 ease-linear cursor-pointer ${
              filter === tab.id ? "bg-gray-900 text-white" : "bg-gray-100 text-text-secondary hover:bg-gray-200"
            }`}
          >
            {tab.label}
            <span className={`text-xs ${filter === tab.id ? "text-gray-400" : "text-text-tertiary"}`}>{counts[tab.id]}</span>
          </button>
        ))}
      </div>

      {/* List */}
      <div className="mt-6 rounded-xl border border-border-secondary bg-bg-primary divide-y divide-border-secondary">
        {filtered.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-text-tertiary">No registrations in this status.</div>
        ) : (
          filtered.map((reg) => {
            const cfg = STATUS_CONFIG[reg.status];
            const isExpanded = expandedId === reg.id;

            return (
              <div key={reg.id}>
                {/* Row */}
                <button
                  type="button"
                  onClick={() => toggleRow(reg.id)}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left cursor-pointer hover:bg-bg-secondary transition duration-100 ease-linear"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-text-primary">{reg.customer}</span>
                      <span className="text-sm text-text-tertiary">{reg.app}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-text-tertiary">{reg.timeInStatus}</p>
                  </div>
                  <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-bg-brand-secondary text-text-brand-secondary shrink-0">{reg.useCase}</span>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium shrink-0 ${cfg.bg} ${cfg.text}`}>{statusLabel(reg)}</span>
                  <span className="text-sm font-medium text-text-brand-secondary shrink-0 w-24 text-right">{cfg.action}</span>
                  <svg className={`size-4 text-text-tertiary shrink-0 transition duration-150 ease-linear ${isExpanded ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                </button>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="border-t border-border-secondary bg-bg-secondary px-5 py-6">
                    {/* Business + Campaign grid */}
                    <div className="grid gap-6 lg:grid-cols-2">
                      <div>
                        <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wide">Business Details</h4>
                        <dl className="mt-3 space-y-2">
                          {([
                            { label: "Business", field: "name", editable: true },
                            { label: "Type", field: "type", editable: false },
                            { label: "EIN", field: "ein", editable: false },
                            { label: "Address", field: "address", editable: true },
                            { label: "Phone", field: "phone", editable: true },
                            { label: "Email", field: "email", editable: true },
                            { label: "Website", field: "website", editable: true },
                          ]).map((row) => (
                            <div key={row.label} className="flex gap-3 text-sm items-baseline">
                              <dt className="w-20 shrink-0 text-text-tertiary">{row.label}</dt>
                              <dd className="flex-1 flex items-baseline gap-1.5">
                                {isEditable(reg.status) && row.editable ? (
                                  <>
                                    <input
                                      type="text"
                                      className="flex-1 bg-transparent border-b border-transparent text-text-primary focus:border-purple-400 focus:outline-none transition duration-100 ease-linear py-0.5"
                                      value={getBusinessField(reg, row.field)}
                                      onChange={(e) => setBusinessField(reg.id, row.field, e.target.value)}
                                    />
                                    {isBusinessEdited(reg, row.field) && (
                                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" title="Edited" />
                                    )}
                                  </>
                                ) : (
                                  <span className="text-text-primary">{(reg.business as Record<string, string>)[row.field]}</span>
                                )}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wide">Campaign</h4>
                        <div className="mt-3 space-y-3">
                          <div>
                            <p className="text-xs text-text-tertiary mb-1">Use case</p>
                            <p className="text-sm text-text-primary">{reg.campaign.useCase}</p>
                          </div>
                          <div>
                            <p className="text-xs text-text-tertiary mb-1">Message types</p>
                            <div className="flex flex-wrap gap-1.5">
                              {reg.campaign.messageTypes.map((t) => (
                                <span key={t} className="inline-flex rounded-full bg-bg-primary border border-border-secondary px-2 py-0.5 text-xs text-text-secondary">{t}</span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-text-tertiary mb-1">Campaign description</p>
                            {isEditable(reg.status) ? (
                              <textarea className="w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2 text-sm text-text-primary shadow-xs focus:outline-none focus:ring-1 focus:border-purple-500 focus:ring-purple-500" rows={4} value={getDescription(reg)} onChange={(e) => setDescription(reg.id, e.target.value)} />
                            ) : (
                              <p className="text-sm text-text-primary">{reg.campaign.description}</p>
                            )}
                          </div>
                          <div>
                            <p className="text-xs text-text-tertiary mb-1">Compliance site</p>
                            <a href="#" className="text-sm font-medium text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear">{reg.complianceSiteUrl}</a>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Rejection reason */}
                    {reg.status === "rejected" && reg.rejectionReason && (
                      <div className="mt-6 rounded-lg bg-red-50 border border-red-200 p-4">
                        <p className="text-sm font-semibold text-red-700">Carrier rejection reason</p>
                        <p className="mt-1 text-sm text-red-600">{reg.rejectionReason}</p>
                      </div>
                    )}

                    {/* AI pre-review — traffic light */}
                    {isEditable(reg.status) && reg.aiPreReview && (
                      <div className="mt-6">
                        {reg.aiPreReview.signal === "green" && (
                          <div className="flex items-center gap-2">
                            <svg className="size-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                            <span className="text-sm font-semibold text-green-600">{reg.aiPreReview.summary}</span>
                          </div>
                        )}
                        {reg.aiPreReview.signal === "amber" && (
                          <div className="rounded-lg border-l-4 border-l-amber-400 bg-amber-50 p-4">
                            <div className="flex items-start gap-2">
                              <svg className="size-5 text-amber-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                              <p className="text-sm font-semibold text-amber-800">{reg.aiPreReview.summary}</p>
                            </div>
                            <div className="mt-3 flex items-center justify-end">
                              <button type="button" className="inline-flex items-center gap-1.5 rounded-lg border border-border-primary bg-bg-primary px-3 py-1.5 text-sm font-medium text-text-secondary hover:bg-bg-secondary transition duration-100 ease-linear cursor-pointer">
                                <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                                Email customer
                              </button>
                            </div>
                          </div>
                        )}
                        {reg.aiPreReview.signal === "red" && (
                          <div className="rounded-lg border-l-4 border-l-red-400 bg-red-50 p-4">
                            <div className="flex items-start gap-2">
                              <svg className="size-5 text-red-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                              <p className="text-sm font-semibold text-red-700">{reg.aiPreReview.summary}</p>
                            </div>
                            {reg.aiPreReview.suggestedFix && (
                              <div className="mt-3 ml-7 rounded-lg bg-gray-100 p-3">
                                <p className="text-sm text-text-secondary italic">{reg.aiPreReview.suggestedFix}</p>
                              </div>
                            )}
                            <div className="mt-3 flex items-center justify-end gap-3">
                              <button type="button" className="inline-flex items-center gap-1.5 rounded-lg border border-border-primary bg-bg-primary px-3 py-1.5 text-sm font-medium text-text-secondary hover:bg-bg-secondary transition duration-100 ease-linear cursor-pointer">
                                <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                                Email customer
                              </button>
                              <button type="button" onClick={() => setDescription(reg.id, reg.aiPreReview!.suggestedFix ?? "")} className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-purple-700 transition duration-100 ease-linear cursor-pointer">
                                <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                                Apply fix
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Decline / Abandon resolution section */}
                    {(reg.status === "declined" || reg.status === "abandoned") && (
                      <div className="mt-6 space-y-4">
                        <div className="rounded-lg bg-gray-100 border border-gray-200 p-4">
                          <h4 className="text-sm font-semibold text-text-primary">Resolution</h4>
                          <p className="mt-2 text-sm text-text-secondary">{reg.declineReason ?? reg.abandonReason}</p>
                          {reg.refundStatus && (
                            <div className="mt-3 flex items-center gap-3">
                              <span className="text-sm text-text-success-primary font-medium">{reg.refundStatus}</span>
                              {reg.refundStatus === "Refund pending" && (
                                <button type="button" className="rounded-lg bg-purple-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-purple-700 transition duration-100 ease-linear cursor-pointer">Process refund &rarr;</button>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Email action */}
                        <div className="rounded-lg border border-border-secondary bg-bg-primary p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-semibold text-text-primary">{reg.status === "declined" ? "Decline notification" : "Closure notification"}</p>
                              <p className="text-xs text-text-tertiary mt-0.5">{reg.emailSent ? "Email sent" : "Not yet sent"}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setShowEmailPreview(showEmailPreview === reg.id ? null : reg.id)}
                              className="text-sm font-medium text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear cursor-pointer"
                            >
                              {reg.status === "declined" ? "Send decline email →" : "Send closure email →"}
                            </button>
                          </div>

                          {showEmailPreview === reg.id && (() => {
                            const email = reg.status === "declined" ? declineEmailPreview(reg) : abandonEmailPreview(reg);
                            return (
                              <div className="mt-4 rounded-lg bg-bg-secondary border border-border-secondary p-4">
                                <div className="text-sm">
                                  <p className="text-text-tertiary">Subject: <span className="text-text-primary font-medium">{email.subject}</span></p>
                                  <div className="mt-3 whitespace-pre-line text-text-secondary leading-relaxed">{email.body}</div>
                                </div>
                                <div className="mt-4 flex items-center gap-3">
                                  <button type="button" onClick={() => console.log("Send email:", reg.id)} className="rounded-lg bg-purple-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-purple-700 transition duration-100 ease-linear cursor-pointer">Send email</button>
                                  <button type="button" onClick={() => setShowEmailPreview(null)} className="text-sm font-medium text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear cursor-pointer">Cancel</button>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    )}

                    {/* Sample messages */}
                    <div className="mt-6">
                      <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wide">Sample Messages ({getMessages(reg).length})</h4>
                      <div className="mt-3 space-y-3">
                        {getMessages(reg).map((msg, i) => (
                          <div key={i}>
                            <p className="text-xs font-medium text-text-tertiary mb-1">{i + 1}. {msg.label}</p>
                            {isEditable(reg.status) ? (
                              <textarea className="w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2 text-sm text-text-primary shadow-xs focus:outline-none focus:ring-1 focus:border-purple-500 focus:ring-purple-500" rows={2} value={msg.text} onChange={(e) => setMessage(reg.id, i, e.target.value)} />
                            ) : (
                              <div className="rounded-lg bg-bg-primary border border-border-secondary p-3">
                                <p className="text-sm text-text-secondary">{msg.text}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action buttons for active statuses */}
                    {reg.status === "awaiting_review" && (
                      <div className="mt-6 flex items-center justify-end">
                        <button type="button" onClick={() => console.log("Submit to carrier:", reg.id)} className="rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 transition duration-100 ease-linear cursor-pointer">Submit to carrier</button>
                      </div>
                    )}
                    {reg.status === "rejected" && (
                      <div className="mt-6 flex items-center justify-end">
                        <button type="button" onClick={() => console.log("Resubmit:", reg.id)} className="rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 transition duration-100 ease-linear cursor-pointer">Resubmit to carrier</button>
                      </div>
                    )}
                    {reg.status === "extended_review" && (
                      <div className="mt-6 flex items-center justify-end gap-3">
                        <button type="button" onClick={() => console.log("Email customer:", reg.id)} className="inline-flex items-center gap-1.5 rounded-lg border border-border-primary bg-bg-primary px-4 py-2.5 text-sm font-semibold text-text-secondary hover:bg-bg-secondary transition duration-100 ease-linear cursor-pointer">
                          <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                          Email customer
                        </button>
                        <button type="button" onClick={() => console.log("Email carrier:", reg.id)} className="inline-flex items-center gap-1.5 rounded-lg border border-border-primary bg-bg-primary px-4 py-2.5 text-sm font-semibold text-text-secondary hover:bg-bg-secondary transition duration-100 ease-linear cursor-pointer">
                          <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                          Email carrier
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
