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

interface AttentionItem {
  severity: "red" | "orange" | "yellow";
  customer: string;
  issue: string;
  time: string;
  action: string;
}

const NORMAL_QUEUE: AttentionItem[] = [
  { severity: "red", customer: "QuickFix Auto", issue: "Campaign suspended by carrier. Immediate review required.", time: "2 hours ago", action: "Review →" },
  { severity: "orange", customer: "FreshCuts", issue: "Registration rejected: vague campaign description.", time: "6 hours ago", action: "Resubmit →" },
  { severity: "orange", customer: "PetPals", issue: "Drift escalation stage 2: promotional language in transactional messages.", time: "1 day ago", action: "Review →" },
  { severity: "yellow", customer: "YogaFlow", issue: "Registration in extended review, 8 days.", time: "3 days ago", action: "Follow up →" },
  { severity: "yellow", customer: "BookWorm", issue: "Payment failed, still sending. $19/mo past due.", time: "5 days ago", action: "Contact →" },
];

const CRISIS_QUEUE: AttentionItem[] = [
  { severity: "red", customer: "QuickFix Auto", issue: "Campaign suspended by carrier. Immediate review required.", time: "2 hours ago", action: "Review →" },
  { severity: "red", customer: "UrbanBites", issue: "Carrier flagged account for spam. 1,200+ messages blocked in 4 hours.", time: "45 min ago", action: "Investigate →" },
  { severity: "orange", customer: "FreshCuts", issue: "Registration rejected: vague campaign description.", time: "6 hours ago", action: "Resubmit →" },
  { severity: "orange", customer: "PetPals", issue: "Drift escalation stage 2: promotional language in transactional messages.", time: "1 day ago", action: "Review →" },
  { severity: "orange", customer: "GlowStudio", issue: "Compliance rate dropped below 95%. Auto-warning sent.", time: "3 hours ago", action: "Review →" },
  { severity: "yellow", customer: "YogaFlow", issue: "Registration in extended review, 8 days.", time: "3 days ago", action: "Follow up →" },
  { severity: "yellow", customer: "BookWorm", issue: "Payment failed, still sending. $19/mo past due.", time: "5 days ago", action: "Contact →" },
];

const DOT_COLORS: Record<string, string> = {
  red: "bg-red-500",
  orange: "bg-orange-400",
  yellow: "bg-yellow-400",
};

export default function AdminControlRoom() {
  const [mode, setMode] = useState<ViewMode>("normal");
  const [manualReview, setManualReview] = useState(true);
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
            onChange={(e) => setMode(e.target.value as ViewMode)}
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
            {queue.map((item, i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-4">
                <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${DOT_COLORS[item.severity]}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary">
                    <span className="font-semibold">{item.customer}</span>
                    {" — "}
                    {item.issue}
                  </p>
                  <p className="mt-0.5 text-xs text-text-tertiary">{item.time}</p>
                </div>
                <button
                  type="button"
                  className="shrink-0 text-sm font-medium text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear cursor-pointer"
                >
                  {item.action}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
