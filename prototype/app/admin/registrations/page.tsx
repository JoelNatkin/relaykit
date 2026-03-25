"use client";

import { useState } from "react";

// ---------------------------------------------------------------------------
// Types & data
// ---------------------------------------------------------------------------

type RegStatus = "awaiting_review" | "in_review" | "approved" | "rejected" | "extended_review";

interface Registration {
  id: string;
  customer: string;
  app: string;
  useCase: string;
  status: RegStatus;
  submitted: string;
  timeInStatus: string;
  rejectionReason?: string;
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
  sampleMessages: string[];
  complianceSiteUrl: string;
}

const REGISTRATIONS: Registration[] = [
  {
    id: "reg-1",
    customer: "GlowStudio",
    app: "GlowStudio Booking",
    useCase: "Appointments",
    status: "awaiting_review",
    submitted: "2 hours ago",
    timeInStatus: "Submitted 2 hours ago",
    business: {
      name: "GlowStudio LLC",
      type: "LLC",
      ein: "***-**-6789",
      address: "456 Oak Street, Portland, OR 97201",
      phone: "(503) 555-0142",
      email: "dev@glowstudio.com",
      website: "glowstudio.com",
    },
    campaign: {
      description: "GlowStudio is a hair salon appointment management platform. Sends booking confirmations, appointment reminders (24h before), pre-visit instructions, reschedule/cancellation notices, and no-show follow-ups to customers who book through the platform.",
      useCase: "Appointment reminders",
      messageTypes: ["Booking confirmation", "Appointment reminder", "Pre-visit instructions", "Reschedule notice", "No-show follow-up", "Cancellation notice"],
    },
    sampleMessages: [
      "GlowStudio: Your haircut appointment is confirmed for Mar 28, 2026 at 2:30 PM. Reply STOP to opt out.",
      "GlowStudio: Reminder — your haircut appointment is tomorrow at 2:30 PM. Reply STOP to opt out.",
      "GlowStudio: For your appointment tomorrow, please arrive 10 minutes early. Free parking available behind the building. Reply STOP to opt out.",
      "GlowStudio: Your haircut appointment on Mar 28 has been rescheduled to Mar 30 at 3:00 PM. Questions? Reply or call (503) 555-0142. Reply STOP to opt out.",
      "GlowStudio: We missed you today! Would you like to rebook your haircut? Visit glowstudio.com/book or call (503) 555-0142. Reply STOP to opt out.",
    ],
    complianceSiteUrl: "glowstudio.msgverified.com",
  },
  {
    id: "reg-2",
    customer: "TechRepair",
    app: "TechRepair Hub",
    useCase: "Support",
    status: "awaiting_review",
    submitted: "yesterday",
    timeInStatus: "Submitted yesterday",
    business: {
      name: "TechRepair Inc",
      type: "Corporation",
      ein: "***-**-4321",
      address: "789 Tech Blvd, Austin, TX 78701",
      phone: "(512) 555-0198",
      email: "ops@techrepair.io",
      website: "techrepair.io",
    },
    campaign: {
      description: "TechRepair is a device repair service. Sends support ticket acknowledgments, repair status updates, completion notifications, and customer satisfaction follow-ups via SMS.",
      useCase: "Customer support",
      messageTypes: ["Ticket acknowledgment", "Status update", "Repair complete", "Satisfaction follow-up"],
    },
    sampleMessages: [
      "TechRepair: We received your repair request #4821. A technician will review it within 2 hours. Reply STOP to opt out.",
      "TechRepair: Update on repair #4821 — your laptop screen replacement is in progress. Estimated completion: tomorrow by 3 PM. Reply STOP to opt out.",
      "TechRepair: Your repair #4821 is complete! Pick up at 789 Tech Blvd, Austin. Open until 7 PM today. Reply STOP to opt out.",
      "TechRepair: How was your repair experience? Rate us at techrepair.io/feedback. Reply STOP to opt out.",
      "TechRepair: Reminder — your repaired device is ready for pickup at our Austin location. Reply STOP to opt out.",
    ],
    complianceSiteUrl: "techrepair.msgverified.com",
  },
  {
    id: "reg-3",
    customer: "FreshCuts",
    app: "FreshCuts App",
    useCase: "Appointments",
    status: "rejected",
    submitted: "4 days ago",
    timeInStatus: "Rejected 6 hours ago",
    rejectionReason: "Campaign description is too vague. Carrier requires specific description of message types and when they are triggered. Current description says 'sends texts to customers' without specifying appointment-related use case.",
    business: {
      name: "FreshCuts Barbershop",
      type: "Sole Proprietor",
      ein: "N/A (sole prop)",
      address: "321 Main St, Denver, CO 80202",
      phone: "(303) 555-0167",
      email: "mike@freshcuts.co",
      website: "freshcuts.co",
    },
    campaign: {
      description: "FreshCuts is a barbershop that sends texts to customers about their appointments.",
      useCase: "Appointment reminders",
      messageTypes: ["Booking confirmation", "Appointment reminder", "Cancellation notice"],
    },
    sampleMessages: [
      "FreshCuts: Your haircut is booked for Saturday at 11 AM. Reply STOP to opt out.",
      "FreshCuts: Reminder — haircut tomorrow at 11 AM. Reply STOP to opt out.",
      "FreshCuts: Your appointment on Saturday has been cancelled. To rebook: freshcuts.co/book. Reply STOP to opt out.",
      "FreshCuts: We have an opening today at 3 PM. Book now at freshcuts.co/book. Reply STOP to opt out.",
      "FreshCuts: Thanks for visiting FreshCuts! Your next cut is due in ~4 weeks. Book at freshcuts.co/book. Reply STOP to opt out.",
    ],
    complianceSiteUrl: "freshcuts.msgverified.com",
  },
  {
    id: "reg-4",
    customer: "PetPals",
    app: "PetPals Store",
    useCase: "Orders",
    status: "in_review",
    submitted: "5 days ago",
    timeInStatus: "5 days in carrier review",
    business: {
      name: "PetPals LLC",
      type: "LLC",
      ein: "***-**-8901",
      address: "567 Pet Lane, Seattle, WA 98101",
      phone: "(206) 555-0134",
      email: "hello@petpals.com",
      website: "petpals.com",
    },
    campaign: {
      description: "PetPals is an online pet supply store. Sends order confirmations, shipping notifications, delivery updates, and return/exchange status messages to customers.",
      useCase: "Order & delivery updates",
      messageTypes: ["Order confirmation", "Shipping notification", "Delivery update", "Return status"],
    },
    sampleMessages: [
      "PetPals: Order #PP-2847 confirmed! 2 items shipping to Seattle, WA. Track at petpals.com/orders. Reply STOP to opt out.",
      "PetPals: Your order #PP-2847 has shipped! Tracking: 1Z999AA10123456784. Reply STOP to opt out.",
      "PetPals: Your order #PP-2847 was delivered today. Enjoy! Reply STOP to opt out.",
      "PetPals: Return for order #PP-2847 received. Refund of $34.99 processing — allow 3-5 days. Reply STOP to opt out.",
      "PetPals: Your order #PP-2847 is out for delivery today. Expected by 6 PM. Reply STOP to opt out.",
    ],
    complianceSiteUrl: "petpals.msgverified.com",
  },
  {
    id: "reg-5",
    customer: "YogaFlow",
    app: "YogaFlow Studio",
    useCase: "Appointments",
    status: "extended_review",
    submitted: "12 days ago",
    timeInStatus: "12 days — extended review",
    business: {
      name: "YogaFlow Wellness LLC",
      type: "LLC",
      ein: "***-**-5678",
      address: "234 Zen Ave, Boulder, CO 80301",
      phone: "(720) 555-0189",
      email: "admin@yogaflow.co",
      website: "yogaflow.co",
    },
    campaign: {
      description: "YogaFlow is a yoga studio management platform. Sends class booking confirmations, session reminders, schedule changes, and waitlist notifications to members.",
      useCase: "Appointment reminders",
      messageTypes: ["Booking confirmation", "Class reminder", "Schedule change", "Waitlist notification"],
    },
    sampleMessages: [
      "YogaFlow: You're booked for Hot Yoga on Mar 25 at 6 PM. Bring a towel and water. Reply STOP to opt out.",
      "YogaFlow: Reminder — Hot Yoga tomorrow at 6 PM. Studio B. Reply STOP to opt out.",
      "YogaFlow: Schedule change — your Hot Yoga class moved from 6 PM to 7 PM on Mar 25. Reply STOP to opt out.",
      "YogaFlow: A spot opened up! You're off the waitlist for Vinyasa Flow, Mar 27 at 8 AM. Reply STOP to opt out.",
      "YogaFlow: Your class pass expires in 3 days. Renew at yogaflow.co/membership. Reply STOP to opt out.",
    ],
    complianceSiteUrl: "yogaflow.msgverified.com",
  },
  {
    id: "reg-6",
    customer: "BookWorm",
    app: "BookWorm Auth",
    useCase: "Verification",
    status: "in_review",
    submitted: "2 days ago",
    timeInStatus: "2 days in carrier review",
    business: {
      name: "BookWorm Inc",
      type: "Corporation",
      ein: "***-**-3456",
      address: "890 Library Dr, Chicago, IL 60601",
      phone: "(312) 555-0145",
      email: "dev@bookworm.app",
      website: "bookworm.app",
    },
    campaign: {
      description: "BookWorm is a reading and book-sharing app. Sends one-time passwords for account login, phone number verification codes, and password reset codes.",
      useCase: "Verification codes",
      messageTypes: ["OTP login", "Phone verification", "Password reset"],
    },
    sampleMessages: [
      "BookWorm: Your login code is 847291. Expires in 10 minutes. Reply STOP to opt out.",
      "BookWorm: Verify your phone number. Code: 553018. Reply STOP to opt out.",
      "BookWorm: Password reset code: 219847. If you didn't request this, ignore this message. Reply STOP to opt out.",
      "BookWorm: Your security code is 662193. Do not share this code. Reply STOP to opt out.",
      "BookWorm: Confirm your new device. Code: 774502. Reply STOP to opt out.",
    ],
    complianceSiteUrl: "bookworm.msgverified.com",
  },
  {
    id: "reg-7",
    customer: "QuickFix Auto",
    app: "QuickFix Dispatch",
    useCase: "Support",
    status: "approved",
    submitted: "4 weeks ago",
    timeInStatus: "Approved 3 weeks ago",
    business: {
      name: "QuickFix Auto Services LLC",
      type: "LLC",
      ein: "***-**-7890",
      address: "1200 Motor Way, Houston, TX 77001",
      phone: "(713) 555-0156",
      email: "dispatch@quickfixauto.com",
      website: "quickfixauto.com",
    },
    campaign: {
      description: "QuickFix Auto is a mobile mechanic service. Sends service request acknowledgments, technician dispatch notifications, arrival updates, and invoice/receipt messages.",
      useCase: "Customer support",
      messageTypes: ["Service acknowledgment", "Technician dispatch", "Arrival update", "Invoice sent"],
    },
    sampleMessages: [
      "QuickFix Auto: Service request received. A technician will be assigned within 30 minutes. Reply STOP to opt out.",
      "QuickFix Auto: Technician Mike is on the way. ETA: 25 minutes. Reply STOP to opt out.",
      "QuickFix Auto: Mike has arrived at your location. Reply STOP to opt out.",
      "QuickFix Auto: Your service is complete. Invoice: $189.00. View at quickfixauto.com/invoice/4821. Reply STOP to opt out.",
      "QuickFix Auto: How was your service? Rate at quickfixauto.com/feedback. Reply STOP to opt out.",
    ],
    complianceSiteUrl: "quickfixauto.msgverified.com",
  },
  {
    id: "reg-8",
    customer: "MealPrep Pro",
    app: "MealPrep Delivery",
    useCase: "Orders",
    status: "approved",
    submitted: "6 weeks ago",
    timeInStatus: "Approved 1 month ago",
    business: {
      name: "MealPrep Pro Inc",
      type: "Corporation",
      ein: "***-**-2345",
      address: "456 Kitchen St, San Francisco, CA 94102",
      phone: "(415) 555-0178",
      email: "ops@mealpreppro.com",
      website: "mealpreppro.com",
    },
    campaign: {
      description: "MealPrep Pro is a meal delivery service. Sends order confirmations, preparation status, delivery notifications, and weekly menu updates to subscribers.",
      useCase: "Order & delivery updates",
      messageTypes: ["Order confirmation", "Prep status", "Delivery notification", "Menu update"],
    },
    sampleMessages: [
      "MealPrep Pro: Your weekly order is confirmed! 5 meals delivering Tuesday. Reply STOP to opt out.",
      "MealPrep Pro: Your meals are being prepared. Chef Marco is on it today. Reply STOP to opt out.",
      "MealPrep Pro: Your delivery is on the way! ETA: 30 minutes. Reply STOP to opt out.",
      "MealPrep Pro: Delivery complete. Meals are at your door. Refrigerate within 2 hours. Reply STOP to opt out.",
      "MealPrep Pro: This week's menu is live! 12 new meals. Browse at mealpreppro.com/menu. Reply STOP to opt out.",
    ],
    complianceSiteUrl: "mealpreppro.msgverified.com",
  },
];

// ---------------------------------------------------------------------------
// Status rendering helpers
// ---------------------------------------------------------------------------

const STATUS_CONFIG: Record<RegStatus, { label: string; bg: string; text: string; action: string }> = {
  awaiting_review: { label: "Awaiting review", bg: "bg-blue-100", text: "text-blue-700", action: "Review →" },
  in_review: { label: "In carrier review", bg: "bg-gray-100", text: "text-gray-600", action: "View →" },
  approved: { label: "Approved", bg: "bg-green-100", text: "text-green-700", action: "Details →" },
  rejected: { label: "Rejected", bg: "bg-red-100", text: "text-red-700", action: "Resubmit →" },
  extended_review: { label: "Extended review", bg: "bg-amber-100", text: "text-amber-700", action: "Follow up →" },
};

type FilterTab = "all" | RegStatus;

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "awaiting_review", label: "Awaiting Review" },
  { id: "in_review", label: "In Carrier Review" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
  { id: "extended_review", label: "Extended Review" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function RegistrationPipelinePage() {
  const [filter, setFilter] = useState<FilterTab>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editableDescriptions, setEditableDescriptions] = useState<Record<string, string>>({});
  const [editableMessages, setEditableMessages] = useState<Record<string, string[]>>({});

  const filtered = filter === "all"
    ? REGISTRATIONS
    : REGISTRATIONS.filter((r) => r.status === filter);

  const counts: Record<FilterTab, number> = {
    all: REGISTRATIONS.length,
    awaiting_review: REGISTRATIONS.filter((r) => r.status === "awaiting_review").length,
    in_review: REGISTRATIONS.filter((r) => r.status === "in_review").length,
    approved: REGISTRATIONS.filter((r) => r.status === "approved").length,
    rejected: REGISTRATIONS.filter((r) => r.status === "rejected").length,
    extended_review: REGISTRATIONS.filter((r) => r.status === "extended_review").length,
  };

  function toggleRow(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  function getDescription(reg: Registration) {
    return editableDescriptions[reg.id] ?? reg.campaign.description;
  }

  function setDescription(id: string, value: string) {
    setEditableDescriptions((prev) => ({ ...prev, [id]: value }));
  }

  function getMessages(reg: Registration) {
    return editableMessages[reg.id] ?? reg.sampleMessages;
  }

  function setMessage(id: string, index: number, value: string) {
    setEditableMessages((prev) => {
      const current = prev[id] ?? [...REGISTRATIONS.find((r) => r.id === id)!.sampleMessages];
      const next = [...current];
      next[index] = value;
      return { ...prev, [id]: next };
    });
  }

  const isEditable = (status: RegStatus) => status === "awaiting_review" || status === "rejected";

  return (
    <div>
      {/* Header */}
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
              filter === tab.id
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-text-secondary hover:bg-gray-200"
            }`}
          >
            {tab.label}
            <span className={`text-xs ${filter === tab.id ? "text-gray-400" : "text-text-tertiary"}`}>
              {counts[tab.id]}
            </span>
          </button>
        ))}
      </div>

      {/* Registration list */}
      <div className="mt-6 rounded-xl border border-border-secondary bg-bg-primary divide-y divide-border-secondary">
        {filtered.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-text-tertiary">
            No registrations in this status.
          </div>
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
                  <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-bg-brand-secondary text-text-brand-secondary shrink-0">
                    {reg.useCase}
                  </span>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium shrink-0 ${cfg.bg} ${cfg.text}`}>
                    {cfg.label}
                  </span>
                  <span className="text-sm font-medium text-text-brand-secondary shrink-0 w-24 text-right">
                    {cfg.action}
                  </span>
                  <svg
                    className={`size-4 text-text-tertiary shrink-0 transition duration-150 ease-linear ${isExpanded ? "rotate-180" : ""}`}
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="border-t border-border-secondary bg-bg-secondary px-5 py-6">
                    <div className="grid gap-6 lg:grid-cols-2">
                      {/* Business details */}
                      <div>
                        <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wide">Business Details</h4>
                        <dl className="mt-3 space-y-2">
                          {[
                            ["Business", reg.business.name],
                            ["Type", reg.business.type],
                            ["EIN", reg.business.ein],
                            ["Address", reg.business.address],
                            ["Phone", reg.business.phone],
                            ["Email", reg.business.email],
                            ["Website", reg.business.website],
                          ].map(([label, value]) => (
                            <div key={label} className="flex gap-3 text-sm">
                              <dt className="w-20 shrink-0 text-text-tertiary">{label}</dt>
                              <dd className="text-text-primary">{value}</dd>
                            </div>
                          ))}
                        </dl>
                      </div>

                      {/* Campaign details */}
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
                              <textarea
                                className="w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2 text-sm text-text-primary shadow-xs focus:outline-none focus:ring-1 focus:border-purple-500 focus:ring-purple-500"
                                rows={4}
                                value={getDescription(reg)}
                                onChange={(e) => setDescription(reg.id, e.target.value)}
                              />
                            ) : (
                              <p className="text-sm text-text-primary">{reg.campaign.description}</p>
                            )}
                          </div>
                          <div>
                            <p className="text-xs text-text-tertiary mb-1">Compliance site</p>
                            <a href="#" className="text-sm font-medium text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear">
                              {reg.complianceSiteUrl}
                            </a>
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

                    {/* Sample messages */}
                    <div className="mt-6">
                      <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wide">Sample Messages ({getMessages(reg).length})</h4>
                      <div className="mt-3 space-y-3">
                        {getMessages(reg).map((msg, i) => (
                          <div key={i}>
                            <p className="text-xs text-text-tertiary mb-1">Message {i + 1}</p>
                            {isEditable(reg.status) ? (
                              <textarea
                                className="w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2 text-sm text-text-primary shadow-xs focus:outline-none focus:ring-1 focus:border-purple-500 focus:ring-purple-500"
                                rows={2}
                                value={msg}
                                onChange={(e) => setMessage(reg.id, i, e.target.value)}
                              />
                            ) : (
                              <div className="rounded-lg bg-bg-primary border border-border-secondary p-3">
                                <p className="text-sm text-text-secondary">{msg}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action buttons */}
                    {reg.status === "awaiting_review" && (
                      <div className="mt-6 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => console.log("Submit to carrier:", reg.id)}
                          className="rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 transition duration-100 ease-linear cursor-pointer"
                        >
                          Submit to carrier
                        </button>
                        <button
                          type="button"
                          onClick={() => console.log("Request changes:", reg.id)}
                          className="rounded-lg border border-border-primary bg-bg-primary px-4 py-2.5 text-sm font-semibold text-text-secondary hover:bg-bg-secondary transition duration-100 ease-linear cursor-pointer"
                        >
                          Request changes from customer
                        </button>
                      </div>
                    )}

                    {reg.status === "rejected" && (
                      <div className="mt-6 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => console.log("Resubmit to carrier:", reg.id)}
                          className="rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 transition duration-100 ease-linear cursor-pointer"
                        >
                          Resubmit to carrier
                        </button>
                        <button
                          type="button"
                          onClick={() => console.log("Contact customer:", reg.id)}
                          className="rounded-lg border border-border-primary bg-bg-primary px-4 py-2.5 text-sm font-semibold text-text-secondary hover:bg-bg-secondary transition duration-100 ease-linear cursor-pointer"
                        >
                          Contact customer
                        </button>
                      </div>
                    )}

                    {reg.status === "extended_review" && (
                      <div className="mt-6 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => console.log("Contact carrier:", reg.id)}
                          className="rounded-lg border border-border-primary bg-bg-primary px-4 py-2.5 text-sm font-semibold text-text-secondary hover:bg-bg-secondary transition duration-100 ease-linear cursor-pointer"
                        >
                          Contact carrier
                        </button>
                        <button
                          type="button"
                          onClick={() => console.log("Contact customer:", reg.id)}
                          className="rounded-lg border border-border-primary bg-bg-primary px-4 py-2.5 text-sm font-semibold text-text-secondary hover:bg-bg-secondary transition duration-100 ease-linear cursor-pointer"
                        >
                          Contact customer
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
