"use client";

import { useState } from "react";

type ViewMode = "normal" | "crisis";

const NORMAL_CARDS = {
  compliance: { rate: "99.1%", color: "text-text-success-primary", detail: "12,847 clean · 42 blocked · 18 warned", trend: "↑ 0.2% vs last week", trendColor: "text-text-success-primary" },
  customers: { big: "23", lines: ["18 approved and sending", "5 in sandbox", "3 new this week"] },
  registrations: { big: "4 in pipeline", lines: ["2 in review", "1 extended review", "1 submitted today"] },
  revenue: { big: "$2,847 MRR", lines: ["$1,634 subscriptions", "$1,213 overage"], trend: "↑ 12% vs last month", trendColor: "text-text-success-primary" },
};

const CRISIS_CARDS = {
  compliance: { rate: "94.2%", color: "text-text-warning-primary", detail: "11,203 clean · 387 blocked · 94 warned", trend: "↓ 4.9% vs last week", trendColor: "text-text-error-primary" },
  customers: { big: "23", lines: ["16 approved and sending", "5 in sandbox", "2 suspended"] },
  registrations: { big: "7 in pipeline", lines: ["3 in review", "2 extended review", "2 rejected today"] },
  revenue: { big: "$2,614 MRR", lines: ["$1,634 subscriptions", "$980 overage"], trend: "↓ 8% vs last month", trendColor: "text-text-error-primary" },
};

/** D-242 severity tiers — AI-classified, fully automated */
type ComplianceTier = "minor" | "escalated" | "suspended";

interface AttentionItem {
  id: string;
  severity: "red" | "orange" | "yellow";
  customer: string;
  issue: string;
  time: string;
  /** D-242 compliance tier — null for non-compliance items */
  tier: ComplianceTier | null;
  messageType?: string;
  flaggedMessage?: string;
  rewrittenMessage?: string;
  rewriteCount?: number;
  firstFlagged?: string;
  /** Escalated: day N of 30, suspension date */
  deadlineDay?: number;
  deadlineDate?: string;
  /** Suspended: blocked since date */
  blockedSince?: string;
  notifications?: { channel: string; date: string; status: string }[];
}

const NORMAL_QUEUE: AttentionItem[] = [
  {
    id: "n1",
    severity: "red",
    customer: "QuickFix Auto",
    issue: "Campaign suspended by carrier. Immediate review required.",
    time: "2 hours ago",
    tier: null,
  },
  {
    id: "n2",
    severity: "orange",
    customer: "FreshCuts",
    issue: "Registration rejected: vague campaign description.",
    time: "6 hours ago",
    tier: null,
  },
  {
    id: "n3",
    severity: "orange",
    customer: "PetPals",
    issue: "Escalated: promotional language in transactional messages. Day 12 of 30.",
    time: "1 day ago",
    tier: "escalated",
    messageType: "Appointment reminder",
    flaggedMessage: "PetPals: Your grooming appointment is tomorrow at 2 PM! Book your next visit now and get 15% off. Reply STOP to opt out.",
    rewrittenMessage: "PetPals: Your grooming appointment is tomorrow at 2 PM. Reply STOP to opt out.",
    rewriteCount: 34,
    firstFlagged: "Mar 13, 2026",
    deadlineDay: 12,
    deadlineDate: "Mar 30, 2026",
    notifications: [
      { channel: "SMS alert", date: "Mar 13", status: "Delivered" },
      { channel: "Email", date: "Mar 13", status: "Opened" },
      { channel: "Digest", date: "Mar 20", status: "Sent" },
    ],
  },
  {
    id: "n4",
    severity: "yellow",
    customer: "GlowStudio",
    issue: "Minor: missing opt-out language — proxy rewriting automatically.",
    time: "3 days ago",
    tier: "minor",
    messageType: "Follow-up",
    flaggedMessage: "Thanks for visiting GlowStudio! Your stylist Jessica loved working with you. See you next time!",
    rewrittenMessage: "Thanks for visiting GlowStudio! Your stylist Jessica loved working with you. See you next time! Reply STOP to opt out.",
    rewriteCount: 12,
    firstFlagged: "Mar 22, 2026",
  },
  {
    id: "n5",
    severity: "yellow",
    customer: "YogaFlow",
    issue: "Registration in extended review, 8 days.",
    time: "3 days ago",
    tier: null,
  },
  {
    id: "n6",
    severity: "yellow",
    customer: "BookWorm",
    issue: "Payment failed, still sending. $19/mo past due.",
    time: "5 days ago",
    tier: null,
  },
];

const CRISIS_QUEUE: AttentionItem[] = [
  {
    id: "c1",
    severity: "red",
    customer: "QuickFix Auto",
    issue: "Campaign suspended by carrier. Immediate review required.",
    time: "2 hours ago",
    tier: null,
  },
  {
    id: "c2",
    severity: "red",
    customer: "UrbanBites",
    issue: "Suspended: promotional coupon codes in order confirmations. Blocked immediately.",
    time: "45 min ago",
    tier: "suspended",
    messageType: "Order confirmation",
    flaggedMessage: "UrbanBites: Your order #4821 is confirmed! Use code HUNGRY20 for 20% off your next order. Track: urbanbi.tes/t/4821. Reply STOP to opt out.",
    rewrittenMessage: null as unknown as string,
    rewriteCount: 0,
    firstFlagged: "Mar 25, 2026",
    blockedSince: "Mar 25, 2026",
    notifications: [
      { channel: "SMS alert", date: "Mar 25", status: "Delivered" },
      { channel: "Email", date: "Mar 25", status: "Sent" },
    ],
  },
  {
    id: "c3",
    severity: "orange",
    customer: "FreshCuts",
    issue: "Registration rejected: vague campaign description.",
    time: "6 hours ago",
    tier: null,
  },
  {
    id: "c4",
    severity: "orange",
    customer: "PetPals",
    issue: "Escalated: promotional language in transactional messages. Day 12 of 30.",
    time: "1 day ago",
    tier: "escalated",
    messageType: "Appointment reminder",
    flaggedMessage: "PetPals: Your grooming appointment is tomorrow at 2 PM! Book your next visit now and get 15% off. Reply STOP to opt out.",
    rewrittenMessage: "PetPals: Your grooming appointment is tomorrow at 2 PM. Reply STOP to opt out.",
    rewriteCount: 34,
    firstFlagged: "Mar 13, 2026",
    deadlineDay: 12,
    deadlineDate: "Mar 30, 2026",
    notifications: [
      { channel: "SMS alert", date: "Mar 13", status: "Delivered" },
      { channel: "Email", date: "Mar 13", status: "Opened" },
      { channel: "Digest", date: "Mar 20", status: "Sent" },
    ],
  },
  {
    id: "c5",
    severity: "orange",
    customer: "GlowStudio",
    issue: "Escalated: missing opt-out language in custom message. Day 5 of 30.",
    time: "3 hours ago",
    tier: "escalated",
    messageType: "Follow-up",
    flaggedMessage: "Thanks for visiting GlowStudio! Your stylist Jessica loved working with you. See you next time!",
    rewrittenMessage: "Thanks for visiting GlowStudio! Your stylist Jessica loved working with you. See you next time! Reply STOP to opt out.",
    rewriteCount: 12,
    firstFlagged: "Mar 20, 2026",
    deadlineDay: 5,
    deadlineDate: "Apr 19, 2026",
    notifications: [
      { channel: "SMS alert", date: "Mar 20", status: "Delivered" },
      { channel: "Email", date: "Mar 20", status: "Opened" },
    ],
  },
  {
    id: "c6",
    severity: "yellow",
    customer: "YogaFlow",
    issue: "Registration in extended review, 8 days.",
    time: "3 days ago",
    tier: null,
  },
  {
    id: "c7",
    severity: "yellow",
    customer: "BookWorm",
    issue: "Payment failed, still sending. $19/mo past due.",
    time: "5 days ago",
    tier: null,
  },
];

const DOT_COLORS: Record<string, string> = {
  red: "bg-red-500",
  orange: "bg-orange-400",
  yellow: "bg-yellow-400",
};

const TIER_LABELS: Record<ComplianceTier, { label: string; color: string }> = {
  minor: { label: "Minor", color: "text-text-tertiary" },
  escalated: { label: "Escalated", color: "text-text-warning-primary" },
  suspended: { label: "Suspended", color: "text-text-error-primary" },
};

function ExpandedDetail({ item }: { item: AttentionItem }) {
  const tierInfo = item.tier ? TIER_LABELS[item.tier] : null;

  return (
    <div className="px-5 pb-5 pt-1 ml-5 border-t border-border-secondary">
      {/* Tier badge */}
      {tierInfo && (
        <p className={`text-xs font-semibold uppercase tracking-wide mt-3 ${tierInfo.color}`}>
          {tierInfo.label}
        </p>
      )}

      {/* Context — no Customer field (redundant with row header) */}
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {item.messageType && (
          <div>
            <p className="text-xs font-medium text-text-tertiary uppercase tracking-wide">Message type</p>
            <p className="mt-1 text-sm text-text-primary">{item.messageType}</p>
          </div>
        )}
        {item.firstFlagged && item.rewriteCount != null && item.rewriteCount > 0 && (
          <div>
            <p className="text-xs font-medium text-text-tertiary uppercase tracking-wide">Rewriting since</p>
            <p className="mt-1 text-sm text-text-primary">{item.firstFlagged} ({item.rewriteCount} messages)</p>
          </div>
        )}
        {item.tier === "suspended" && item.blockedSince && (
          <div>
            <p className="text-xs font-medium text-text-tertiary uppercase tracking-wide">Status</p>
            <p className="mt-1 text-sm text-text-error-primary font-medium">Blocked since {item.blockedSince} — awaiting customer fix</p>
          </div>
        )}
      </div>

      {/* Escalated: deadline countdown */}
      {item.tier === "escalated" && item.deadlineDay != null && item.deadlineDate && (
        <p className="mt-3 text-sm font-semibold text-text-warning-primary">
          Day {item.deadlineDay} of 30 — message suspends {item.deadlineDate}
        </p>
      )}

      {/* Original vs rewritten (Minor + Escalated only — Suspended has no rewrite) */}
      {(item.tier === "minor" || item.tier === "escalated") && item.flaggedMessage && item.rewrittenMessage && (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-bg-error-primary p-3">
            <p className="text-xs font-medium text-text-error-primary uppercase tracking-wide mb-2">Original</p>
            <p className="text-sm text-text-secondary leading-relaxed">{item.flaggedMessage}</p>
          </div>
          <div className="rounded-lg bg-bg-success-primary p-3">
            <p className="text-xs font-medium text-text-success-primary uppercase tracking-wide mb-2">Rewritten by proxy</p>
            <p className="text-sm text-text-secondary leading-relaxed">{item.rewrittenMessage}</p>
          </div>
        </div>
      )}

      {/* Suspended: show blocked message only */}
      {item.tier === "suspended" && item.flaggedMessage && (
        <div className="mt-4">
          <div className="rounded-lg bg-bg-error-primary p-3">
            <p className="text-xs font-medium text-text-error-primary uppercase tracking-wide mb-2">Blocked message</p>
            <p className="text-sm text-text-secondary leading-relaxed">{item.flaggedMessage}</p>
          </div>
        </div>
      )}

      {/* Notification history (Escalated + Suspended) */}
      {(item.tier === "escalated" || item.tier === "suspended") && item.notifications && (
        <div className="mt-4">
          <p className="text-xs font-medium text-text-tertiary uppercase tracking-wide">Notification history</p>
          <div className="mt-2 space-y-1.5">
            {item.notifications.map((n, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <span className="text-text-tertiary w-20 shrink-0">{n.date}</span>
                <span className="text-text-secondary">{n.channel}</span>
                <span className="text-text-tertiary">·</span>
                <span className="text-text-secondary">{n.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Non-compliance items: no expanded detail beyond context */}
      {item.tier === null && (
        <div className="mt-3">
          <p className="text-sm text-text-secondary">{item.issue}</p>
        </div>
      )}

      {/* Operator action buttons */}
      {item.tier != null && (
        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            type="button"
            className="rounded-lg border border-border-primary px-3 py-1.5 text-sm font-medium text-text-secondary hover:bg-bg-primary_hover transition duration-100 ease-linear cursor-pointer"
          >
            Dismiss
          </button>
          <div className="relative">
            <select
              className="appearance-none rounded-lg border border-border-primary px-3 py-1.5 pr-7 text-sm font-medium text-text-secondary bg-transparent hover:bg-bg-primary_hover transition duration-100 ease-linear cursor-pointer focus:outline-none"
              defaultValue={item.tier}
            >
              <option value="minor">Minor</option>
              <option value="escalated">Escalated</option>
              <option value="suspended">Suspended</option>
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-text-tertiary">▼</span>
          </div>
          {item.tier === "suspended" && (
            <button
              type="button"
              className="rounded-lg border border-border-primary px-3 py-1.5 text-sm font-medium text-text-brand-secondary hover:bg-bg-primary_hover transition duration-100 ease-linear cursor-pointer"
            >
              Unsuspend
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminControlRoom() {
  const [mode, setMode] = useState<ViewMode>("normal");
  const [manualReview, setManualReview] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const cards = mode === "crisis" ? CRISIS_CARDS : NORMAL_CARDS;
  const queue = mode === "crisis" ? CRISIS_QUEUE : NORMAL_QUEUE;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Control Room</h1>
          <p className="mt-1 text-sm text-text-tertiary">Platform health and operator actions</p>
        </div>
        <div className="flex items-end gap-6">
          {/* Manual review toggle */}
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-secondary">Registration review:</span>
              <button
                type="button"
                onClick={() => setManualReview(!manualReview)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition duration-150 ease-linear cursor-pointer ${
                  manualReview ? "bg-purple-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition duration-150 ease-linear ${
                    manualReview ? "translate-x-[18px]" : "translate-x-[3px]"
                  }`}
                />
              </button>
              <span className="text-sm font-medium text-text-primary">{manualReview ? "Manual" : "Auto"}</span>
            </div>
            {manualReview && (
              <span className="text-xs text-text-tertiary">(reviewing before submission)</span>
            )}
          </div>

          {/* State switcher */}
          <select
            value={mode}
            onChange={(e) => { setMode(e.target.value as ViewMode); setExpandedId(null); }}
            className="text-sm text-text-tertiary bg-transparent border-none cursor-pointer focus:outline-none"
          >
            <option value="normal">Normal</option>
            <option value="crisis">Crisis</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Platform Compliance */}
        <div className="rounded-xl border border-border-secondary bg-bg-primary p-5">
          <p className="text-sm font-semibold text-text-tertiary uppercase tracking-wide">Platform Compliance</p>
          <div className="mt-3">
            <span className={`text-3xl font-semibold ${cards.compliance.color}`}>{cards.compliance.rate}</span>
          </div>
          <p className="mt-2 text-sm text-text-secondary">{cards.compliance.detail}</p>
          <p className={`mt-1 text-sm ${cards.compliance.trendColor}`}>{cards.compliance.trend}</p>
        </div>

        {/* Active Customers */}
        <div className="rounded-xl border border-border-secondary bg-bg-primary p-5">
          <p className="text-sm font-semibold text-text-tertiary uppercase tracking-wide">Active Customers</p>
          <div className="mt-3">
            <span className="text-3xl font-semibold text-text-primary">{cards.customers.big}</span>
          </div>
          <div className="mt-2 space-y-0.5">
            {cards.customers.lines.map((line) => (
              <p key={line} className="text-sm text-text-secondary">{line}</p>
            ))}
          </div>
        </div>

        {/* Registrations */}
        <div className="rounded-xl border border-border-secondary bg-bg-primary p-5">
          <p className="text-sm font-semibold text-text-tertiary uppercase tracking-wide">Registrations</p>
          <div className="mt-3">
            <span className="text-3xl font-semibold text-text-primary">
              {manualReview
                ? (mode === "crisis" ? "9 in pipeline" : "5 in pipeline")
                : cards.registrations.big}
            </span>
          </div>
          <div className="mt-2 space-y-0.5">
            {manualReview ? (
              mode === "crisis" ? (
                <>
                  <p className="text-sm font-medium text-text-brand-secondary">4 awaiting your review</p>
                  <p className="text-sm text-text-secondary">3 in carrier review</p>
                  <p className="text-sm text-text-secondary">2 rejected today</p>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-text-brand-secondary">2 awaiting your review</p>
                  <p className="text-sm text-text-secondary">2 in carrier review</p>
                  <p className="text-sm text-text-secondary">1 submitted today</p>
                </>
              )
            ) : (
              cards.registrations.lines.map((line) => (
                <p key={line} className="text-sm text-text-secondary">{line}</p>
              ))
            )}
          </div>
        </div>

        {/* Revenue */}
        <div className="rounded-xl border border-border-secondary bg-bg-primary p-5">
          <p className="text-sm font-semibold text-text-tertiary uppercase tracking-wide">Revenue</p>
          <div className="mt-3">
            <span className="text-3xl font-semibold text-text-primary">{cards.revenue.big}</span>
          </div>
          <div className="mt-2 space-y-0.5">
            {cards.revenue.lines.map((line) => (
              <p key={line} className="text-sm text-text-secondary">{line}</p>
            ))}
          </div>
          <p className={`mt-1 text-sm ${cards.revenue.trendColor}`}>{cards.revenue.trend}</p>
        </div>
      </div>

      {/* Attention Queue */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-text-primary">Attention queue</h2>
        <p className="mt-1 text-sm text-text-tertiary">Items that need operator action</p>

        {queue.length === 0 ? (
          <div className="mt-4 rounded-xl border border-border-secondary bg-bg-primary p-6 text-center">
            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-fg-success-primary" />
              <span className="text-sm font-semibold text-text-success-primary">All clear — no items need attention</span>
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-border-secondary bg-bg-primary divide-y divide-border-secondary">
            {queue.map((item) => {
              const isExpanded = expandedId === item.id;
              const isExpandable = item.tier != null;
              return (
                <div key={item.id}>
                  <div
                    className={`flex items-start gap-3 px-5 py-4 ${isExpandable ? "cursor-pointer hover:bg-bg-secondary transition duration-100 ease-linear" : ""}`}
                    onClick={() => {
                      if (!isExpandable) return;
                      setExpandedId(isExpanded ? null : item.id);
                    }}
                  >
                    <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${DOT_COLORS[item.severity]}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-primary">
                        <span className="font-semibold">{item.customer}</span>
                        {" — "}
                        {item.issue}
                      </p>
                      <div className="mt-0.5 flex items-center gap-2">
                        <span className="text-xs text-text-tertiary">{item.time}</span>
                        {item.tier != null && (
                          <span className={`text-xs font-medium ${TIER_LABELS[item.tier].color}`}>
                            {TIER_LABELS[item.tier].label}
                          </span>
                        )}
                      </div>
                    </div>
                    {isExpandable && (
                      <span className="shrink-0 text-sm text-text-tertiary mt-0.5">
                        {isExpanded ? "▲" : "▼"}
                      </span>
                    )}
                  </div>
                  {isExpanded && <ExpandedDetail item={item} />}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
