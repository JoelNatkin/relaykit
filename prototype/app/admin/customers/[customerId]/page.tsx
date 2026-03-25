"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CustomerStatus = "sandbox" | "pending" | "active" | "churned";
type DeliveryStatus = "delivered" | "failed" | "pending";
type ComplianceFlag = "clean" | "warned" | "blocked";
type AttentionSeverity = "red" | "orange" | "yellow";

interface Registration {
  businessName: string;
  ein: string;
  businessType: string;
  website: string;
  phone: string;
  email: string;
  status: string;
  statusDate: string;
  campaignDescription: string;
  messageTypes: string[];
}

interface ComplianceInfo {
  rate: number;
  flaggedCount: number;
  flaggedSeverity?: string;
}

interface MessageVolume {
  sent: number;
  delivered: number;
  failed: number;
  blocked: number;
  dailyAvg: number;
}

interface RecentMessage {
  timestamp: string;
  recipient: string;
  type: string;
  preview: string;
  delivery: DeliveryStatus;
  compliance: ComplianceFlag;
}

interface Billing {
  plan: "Free" | "Go Live";
  registrationFee: string;
  goLiveFee: string;
  monthlyRate: string;
  periodStart: string;
  periodEnd: string;
  messagesThisPeriod: number;
  overage: string;
  paymentStatus: "current" | "past_due" | "na";
}

interface AttentionItem {
  severity: AttentionSeverity;
  issue: string;
  time: string;
  action: string;
}

interface CustomerDetail {
  id: string;
  name: string;
  app: string;
  status: CustomerStatus;
  useCase: string;
  registration: Registration;
  compliance: ComplianceInfo;
  volume: MessageVolume;
  recentMessages: RecentMessage[];
  billing: Billing;
  attentionItems: AttentionItem[];
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

function generateMessages(types: string[], count: number, includeIssues: { warned?: number; blocked?: number; failed?: number } = {}): RecentMessage[] {
  const msgs: RecentMessage[] = [];
  const baseTime = new Date("2026-03-25T14:30:00");
  const lastFour = ["4523", "8891", "2107", "6634", "3378", "9012", "5547", "1289", "7764", "4401", "8832", "2256", "6690", "3311", "9945", "5578", "1102", "7736", "4469", "8803"];

  for (let i = 0; i < count; i++) {
    const time = new Date(baseTime.getTime() - i * 47 * 60 * 1000); // ~47 min apart
    const typeIdx = i % types.length;
    const recipientLast = lastFour[i % lastFour.length];

    let delivery: DeliveryStatus = "delivered";
    let compliance: ComplianceFlag = "clean";

    if (includeIssues.failed && i < (includeIssues.warned ?? 0) + (includeIssues.blocked ?? 0) + includeIssues.failed && i >= (includeIssues.warned ?? 0) + (includeIssues.blocked ?? 0)) {
      delivery = "failed";
    }
    if (includeIssues.blocked && i < (includeIssues.warned ?? 0) + includeIssues.blocked && i >= (includeIssues.warned ?? 0)) {
      compliance = "blocked";
      delivery = "failed";
    }
    if (includeIssues.warned && i < includeIssues.warned) {
      compliance = "warned";
    }

    const previews: Record<string, string[]> = {
      "Booking confirmation": [
        "Your haircut appointment is confirmed for Mar 28 at 2:30 PM...",
        "Appointment confirmed: facial treatment Mar 27 at 11 AM...",
        "You're booked! Color treatment scheduled for Mar 29...",
      ],
      "Appointment reminder": [
        "Reminder — your haircut appointment is tomorrow at 2:30 PM...",
        "Don't forget: facial treatment tomorrow at 11 AM...",
        "Heads up — your color appointment is in 2 hours...",
      ],
      "Cancellation notice": [
        "Your appointment on Mar 28 has been cancelled. To rebook...",
        "We've cancelled your Saturday appointment as requested...",
      ],
      "Reschedule notice": [
        "Your appointment has been rescheduled to Mar 30 at 3 PM...",
        "Schedule change: your visit moved to Apr 1 at 10 AM...",
      ],
      "No-show follow-up": [
        "We missed you today! Would you like to rebook your haircut?",
        "Sorry we missed you. Book your next visit at glowstudio.com...",
      ],
      "Pre-visit instructions": [
        "For your appointment tomorrow, please arrive 10 minutes early...",
        "Reminder: avoid caffeine before your facial tomorrow...",
      ],
      "Ticket acknowledgment": [
        "We received your repair request #4821. A technician will...",
        "Support ticket #5102 created. We'll respond within 2 hours...",
      ],
      "Status update": [
        "Update on repair #4821 — your laptop screen replacement is...",
        "Repair #5102 in progress. Estimated completion: tomorrow...",
      ],
      "Repair complete": [
        "Your repair #4821 is complete! Pick up at 789 Tech Blvd...",
        "Good news — repair #5102 is done. Ready for pickup...",
      ],
      "Satisfaction follow-up": [
        "How was your repair experience? Rate us at techrepair.io...",
        "We'd love your feedback on repair #4821. Rate us...",
      ],
      "Pickup reminder": [
        "Reminder — your repaired device is ready for pickup...",
        "Your device has been waiting 3 days. Pick up at our Austin...",
      ],
    };

    const typeName = types[typeIdx];
    const typePreviewList = previews[typeName] ?? [`${typeName}: Message content for recipient ending in ${recipientLast}...`];
    const preview = typePreviewList[i % typePreviewList.length];

    msgs.push({
      timestamp: time.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true }),
      recipient: `•••-••-${recipientLast}`,
      type: typeName,
      preview,
      delivery,
      compliance,
    });
  }
  return msgs;
}

const CUSTOMERS: Record<string, CustomerDetail> = {
  "cust-1": {
    id: "cust-1",
    name: "GlowStudio",
    app: "GlowStudio Booking",
    status: "active",
    useCase: "Appointments",
    registration: {
      businessName: "GlowStudio LLC",
      ein: "XX-XXX6789",
      businessType: "LLC",
      website: "glowstudio.com",
      phone: "(503) 555-0142",
      email: "dev@glowstudio.com",
      status: "Approved",
      statusDate: "Jan 15, 2026",
      campaignDescription: "GlowStudio is a hair salon appointment management platform. Sends booking confirmations, appointment reminders (24h before), pre-visit instructions, reschedule/cancellation notices, and no-show follow-ups to customers who book through the platform.",
      messageTypes: ["Booking confirmation", "Appointment reminder", "Pre-visit instructions", "Reschedule notice", "Cancellation notice", "No-show follow-up"],
    },
    compliance: { rate: 99.1, flaggedCount: 2, flaggedSeverity: "warned" },
    volume: { sent: 2847, delivered: 2831, failed: 14, blocked: 2, dailyAvg: 95 },
    recentMessages: generateMessages(
      ["Booking confirmation", "Appointment reminder", "Pre-visit instructions", "Reschedule notice", "Cancellation notice", "No-show follow-up"],
      20,
      { warned: 2, failed: 1 }
    ),
    billing: {
      plan: "Go Live",
      registrationFee: "$49 paid Jan 10, 2026",
      goLiveFee: "$150 paid Jan 18, 2026",
      monthlyRate: "$19/mo",
      periodStart: "Mar 1, 2026",
      periodEnd: "Mar 31, 2026",
      messagesThisPeriod: 2847,
      overage: "None",
      paymentStatus: "current",
    },
    attentionItems: [],
  },
  "cust-2": {
    id: "cust-2",
    name: "TechRepair Pro",
    app: "TechRepair Hub",
    status: "active",
    useCase: "Support",
    registration: {
      businessName: "TechRepair Inc",
      ein: "XX-XXX4321",
      businessType: "Corporation",
      website: "techrepair.io",
      phone: "(512) 555-0198",
      email: "ops@techrepair.io",
      status: "Approved",
      statusDate: "Jan 28, 2026",
      campaignDescription: "TechRepair is a device repair service. Sends support ticket acknowledgments, repair status updates, completion notifications, and customer satisfaction follow-ups via SMS.",
      messageTypes: ["Ticket acknowledgment", "Status update", "Repair complete", "Satisfaction follow-up", "Pickup reminder"],
    },
    compliance: { rate: 97.8, flaggedCount: 1, flaggedSeverity: "blocked" },
    volume: { sent: 1203, delivered: 1190, failed: 8, blocked: 5, dailyAvg: 40 },
    recentMessages: generateMessages(
      ["Ticket acknowledgment", "Status update", "Repair complete", "Satisfaction follow-up", "Pickup reminder"],
      20,
      { blocked: 1, failed: 2 }
    ),
    billing: {
      plan: "Go Live",
      registrationFee: "$49 paid Jan 22, 2026",
      goLiveFee: "$150 paid Jan 30, 2026",
      monthlyRate: "$19/mo",
      periodStart: "Mar 1, 2026",
      periodEnd: "Mar 31, 2026",
      messagesThisPeriod: 1203,
      overage: "None",
      paymentStatus: "current",
    },
    attentionItems: [
      { severity: "orange", issue: "1 message blocked by compliance filter — promotional language detected in support ticket response.", time: "2 days ago", action: "Review message →" },
    ],
  },
  "cust-3": {
    id: "cust-3",
    name: "FreshCuts Barbershop",
    app: "FreshCuts App",
    status: "pending",
    useCase: "Appointments",
    registration: {
      businessName: "FreshCuts Barbershop",
      ein: "N/A (sole prop)",
      businessType: "Sole Proprietor",
      website: "freshcuts.co",
      phone: "(303) 555-0167",
      email: "mike@freshcuts.co",
      status: "In carrier review",
      statusDate: "Mar 12, 2026",
      campaignDescription: "FreshCuts is a barbershop booking platform. Sends booking confirmations when customers schedule appointments, appointment reminders 24 hours before visits, cancellation notices, waitlist notifications for customers who opted into availability updates, and reschedule confirmations when appointments are moved.",
      messageTypes: ["Booking confirmation", "Appointment reminder", "Cancellation notice", "Waitlist notification", "Reschedule confirmation"],
    },
    compliance: { rate: 0, flaggedCount: 0 },
    volume: { sent: 0, delivered: 0, failed: 0, blocked: 0, dailyAvg: 0 },
    recentMessages: [],
    billing: {
      plan: "Go Live",
      registrationFee: "$49 paid Mar 10, 2026",
      goLiveFee: "$150 due on approval",
      monthlyRate: "$19/mo (starts after approval)",
      periodStart: "—",
      periodEnd: "—",
      messagesThisPeriod: 0,
      overage: "N/A",
      paymentStatus: "na",
    },
    attentionItems: [],
  },
  "cust-5": {
    id: "cust-5",
    name: "QuickFix Plumbing",
    app: "QuickFix Dispatch",
    status: "sandbox",
    useCase: "Support",
    registration: {
      businessName: "QuickFix Plumbing LLC",
      ein: "—",
      businessType: "LLC",
      website: "quickfixplumbing.com",
      phone: "(512) 555-0177",
      email: "dev@quickfixplumbing.com",
      status: "Not started",
      statusDate: "—",
      campaignDescription: "—",
      messageTypes: [],
    },
    compliance: { rate: 0, flaggedCount: 0 },
    volume: { sent: 0, delivered: 0, failed: 0, blocked: 0, dailyAvg: 0 },
    recentMessages: [],
    billing: {
      plan: "Free",
      registrationFee: "N/A",
      goLiveFee: "N/A",
      monthlyRate: "$0",
      periodStart: "—",
      periodEnd: "—",
      messagesThisPeriod: 0,
      overage: "N/A",
      paymentStatus: "na",
    },
    attentionItems: [],
  },
};

// Fallback — use GlowStudio for any ID not explicitly mapped
const DEFAULT_CUSTOMER_ID = "cust-1";

// ---------------------------------------------------------------------------
// Status config
// ---------------------------------------------------------------------------

const STATUS_CONFIG: Record<CustomerStatus, { label: string; bg: string; text: string }> = {
  sandbox: { label: "Sandbox", bg: "bg-gray-100", text: "text-gray-600" },
  pending: { label: "Pending", bg: "bg-amber-100", text: "text-amber-700" },
  active: { label: "Active", bg: "bg-green-100", text: "text-green-700" },
  churned: { label: "Churned", bg: "bg-red-100", text: "text-red-700" },
};

const DELIVERY_DOT: Record<DeliveryStatus, string> = {
  delivered: "bg-green-500",
  failed: "bg-red-500",
  pending: "bg-yellow-400",
};

const SEVERITY_DOT: Record<AttentionSeverity, string> = {
  red: "bg-red-500",
  orange: "bg-orange-400",
  yellow: "bg-yellow-400",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function complianceColor(rate: number): string {
  if (rate === 0) return "text-gray-400";
  if (rate >= 95) return "text-text-success-primary";
  if (rate >= 80) return "text-amber-600";
  return "text-text-error-primary";
}

function paymentStatusDisplay(status: "current" | "past_due" | "na"): { label: string; color: string } {
  switch (status) {
    case "current": return { label: "Current", color: "text-text-success-primary" };
    case "past_due": return { label: "Past due", color: "text-text-error-primary" };
    case "na": return { label: "N/A", color: "text-text-tertiary" };
  }
}

// ---------------------------------------------------------------------------
// Section Components
// ---------------------------------------------------------------------------

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-gray-200 p-6">
      <h2 className="text-base font-semibold text-text-primary mb-4">{title}</h2>
      {children}
    </div>
  );
}

function DetailRow({ label, value, className }: { label: string; value: React.ReactNode; className?: string }) {
  return (
    <div className={`flex justify-between py-1.5 ${className ?? ""}`}>
      <span className="text-sm text-text-tertiary">{label}</span>
      <span className="text-sm text-text-primary text-right">{value}</span>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-lg border border-gray-200 p-4 flex-1 min-w-[120px]">
      <p className="text-xs text-text-tertiary uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-semibold text-text-primary mt-1">{typeof value === "number" ? value.toLocaleString() : value}</p>
      {sub && <p className="text-xs text-text-tertiary mt-0.5">{sub}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function CustomerDetailPage() {
  const params = useParams();
  const customerId = params.customerId as string;
  const customer = CUSTOMERS[customerId] ?? CUSTOMERS[DEFAULT_CUSTOMER_ID];
  const statusCfg = STATUS_CONFIG[customer.status];
  const paymentDisplay = paymentStatusDisplay(customer.billing.paymentStatus);
  const showPipelineLink = customer.status === "pending" || customer.registration.status === "In carrier review" || customer.registration.status === "Rejected";

  return (
    <div className="max-w-[900px]">
      {/* Back link */}
      <Link
        href="/admin/customers"
        className="inline-flex items-center gap-1 text-sm text-text-tertiary hover:text-text-primary transition duration-100 ease-linear mb-6"
      >
        <span>←</span> Back to Customers
      </Link>

      {/* Page header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">{customer.name}</h1>
          <p className="text-sm text-text-tertiary mt-0.5">{customer.app}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-text-secondary">
            {customer.useCase}
          </span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusCfg.bg} ${statusCfg.text}`}>
            {statusCfg.label}
          </span>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {/* 1. Registration Summary */}
        <SectionCard title="Registration Summary">
          <div className="grid grid-cols-2 gap-x-8 gap-y-1">
            <DetailRow label="Business name" value={customer.registration.businessName} />
            <DetailRow label="EIN" value={customer.registration.ein} />
            <DetailRow label="Business type" value={customer.registration.businessType} />
            <DetailRow label="Website" value={customer.registration.website} />
            <DetailRow label="Phone" value={customer.registration.phone} />
            <DetailRow label="Email" value={customer.registration.email} />
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-tertiary">Registration:</span>
                <span className="text-sm font-medium text-text-primary">
                  {customer.registration.status} — {customer.registration.statusDate}
                </span>
              </div>
              {showPipelineLink && (
                <Link
                  href="/admin/registrations"
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium transition duration-100 ease-linear"
                >
                  View in Registration Pipeline →
                </Link>
              )}
            </div>
          </div>

          {customer.registration.campaignDescription !== "—" && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-text-tertiary mb-1.5">Campaign description</p>
              <p className="text-sm text-text-secondary leading-relaxed">{customer.registration.campaignDescription}</p>
            </div>
          )}

          {customer.registration.messageTypes.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-text-tertiary mb-2">Registered message types</p>
              <div className="flex flex-wrap gap-2">
                {customer.registration.messageTypes.map((type) => (
                  <span key={type} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-text-secondary">
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}
        </SectionCard>

        {/* 2. Message Volume */}
        <SectionCard title="Message Volume — Last 30 Days">
          {customer.volume.sent > 0 ? (
            <div className="flex gap-4 flex-wrap">
              <StatCard label="Sent" value={customer.volume.sent} sub={`${customer.volume.dailyAvg}/day avg`} />
              <StatCard label="Delivered" value={customer.volume.delivered} />
              <StatCard label="Failed" value={customer.volume.failed} />
              <StatCard label="Blocked" value={customer.volume.blocked} sub="compliance" />
            </div>
          ) : (
            <p className="text-sm text-text-tertiary">No messages sent yet.</p>
          )}
        </SectionCard>

        {/* 3. Compliance */}
        <SectionCard title="Compliance">
          {customer.compliance.rate > 0 ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`text-3xl font-semibold ${complianceColor(customer.compliance.rate)}`}>
                  {customer.compliance.rate}%
                </span>
                <span className="text-sm text-text-tertiary">compliance rate</span>
              </div>
              {customer.compliance.flaggedCount > 0 ? (
                <span className="text-sm text-amber-600">
                  {customer.compliance.flaggedCount} message{customer.compliance.flaggedCount !== 1 ? "s" : ""} {customer.compliance.flaggedSeverity} this month
                </span>
              ) : (
                <span className="text-sm text-text-success-primary">No compliance issues</span>
              )}
            </div>
          ) : (
            <p className="text-sm text-text-tertiary">No messages sent yet — compliance tracking will begin after approval.</p>
          )}
        </SectionCard>

        {/* 4. Attention Items */}
        <SectionCard title="Attention Items">
          {customer.attentionItems.length > 0 ? (
            <div className="space-y-3">
              {customer.attentionItems.map((item, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
                  <span className={`mt-0.5 size-2.5 shrink-0 rounded-full ${SEVERITY_DOT[item.severity]}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary">{item.issue}</p>
                    <p className="text-xs text-text-tertiary mt-0.5">{item.time}</p>
                  </div>
                  <span className="text-sm font-medium text-purple-600 shrink-0">{item.action}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-success-primary">No attention items — this customer is in good standing.</p>
          )}
        </SectionCard>

        {/* 5. Billing */}
        <SectionCard title="Billing">
          <div className="grid grid-cols-2 gap-x-8 gap-y-1">
            <DetailRow label="Plan" value={customer.billing.plan} />
            <DetailRow label="Registration fee" value={customer.billing.registrationFee} />
            <DetailRow label="Go-live fee" value={customer.billing.goLiveFee} />
            <DetailRow label="Monthly rate" value={customer.billing.monthlyRate} />
            <DetailRow
              label="Payment status"
              value={<span className={paymentDisplay.color}>{paymentDisplay.label}</span>}
            />
            <DetailRow label="Current period" value={`${customer.billing.periodStart} – ${customer.billing.periodEnd}`} />
            <DetailRow label="Messages this period" value={customer.billing.messagesThisPeriod > 0 ? customer.billing.messagesThisPeriod.toLocaleString() : "—"} />
            <DetailRow label="Overage" value={customer.billing.overage} />
          </div>
        </SectionCard>

        {/* 6. Recent Messages */}
        <SectionCard title="Recent Messages">
          {customer.recentMessages.length > 0 ? (
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left text-xs font-medium text-text-tertiary uppercase tracking-wider pb-2 pr-3">Time</th>
                    <th className="text-left text-xs font-medium text-text-tertiary uppercase tracking-wider pb-2 pr-3">Recipient</th>
                    <th className="text-left text-xs font-medium text-text-tertiary uppercase tracking-wider pb-2 pr-3">Type</th>
                    <th className="text-left text-xs font-medium text-text-tertiary uppercase tracking-wider pb-2 pr-3">Preview</th>
                    <th className="text-left text-xs font-medium text-text-tertiary uppercase tracking-wider pb-2 pr-3">Status</th>
                    <th className="text-left text-xs font-medium text-text-tertiary uppercase tracking-wider pb-2">Flag</th>
                  </tr>
                </thead>
                <tbody>
                  {customer.recentMessages.map((msg, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      <td className="py-2 pr-3 text-xs text-text-tertiary whitespace-nowrap">{msg.timestamp}</td>
                      <td className="py-2 pr-3 text-xs text-text-secondary font-mono">{msg.recipient}</td>
                      <td className="py-2 pr-3 text-xs text-text-secondary whitespace-nowrap">{msg.type}</td>
                      <td className="py-2 pr-3 text-xs text-text-secondary max-w-[240px] truncate">{msg.preview}</td>
                      <td className="py-2 pr-3">
                        <span className="inline-flex items-center gap-1.5 text-xs text-text-secondary">
                          <span className={`size-2 rounded-full ${DELIVERY_DOT[msg.delivery]}`} />
                          {msg.delivery}
                        </span>
                      </td>
                      <td className="py-2">
                        {msg.compliance !== "clean" && (
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                            msg.compliance === "blocked"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                          }`}>
                            {msg.compliance}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-text-tertiary">No messages sent yet.</p>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
