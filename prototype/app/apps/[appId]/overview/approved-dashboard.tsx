"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "@/context/session-context";

/* ── Clipboard copy button ── */

function ClipboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(text).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="absolute top-3 right-3 rounded-md p-1.5 text-fg-quaternary hover:text-fg-secondary hover:bg-bg-primary/60 transition duration-100 ease-linear cursor-pointer"
      aria-label="Copy"
    >
      {copied ? (
        <svg className="w-4 h-4 text-fg-success-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <ClipboardIcon className="w-4 h-4" />
      )}
    </button>
  );
}

/* ── Chart data ── */

const HOURLY_DATA = [5, 3, 2, 2, 3, 5, 12, 28, 52, 78, 85, 92, 88, 95, 110, 105, 90, 80, 65, 45, 25, 12, 8, 5];
const HOURLY_MAX = Math.max(...HOURLY_DATA);

const MESSAGE_TYPES = [
  { label: "Appointment reminder", count: 842 },
  { label: "Booking confirmation", count: 614 },
  { label: "Reschedule notice", count: 247 },
  { label: "Cancellation notice", count: 139 },
];
const MESSAGE_TYPE_MAX = Math.max(...MESSAGE_TYPES.map((t) => t.count));

/* ── Alert detail content ── */

const ALERT_DETAILS = [
  {
    title: "Content blocked",
    message: 'GlowStudio: Book your next appointment this week and get 15% off! Visit glowstudio.com. Reply STOP to opt out.',
    trigger: 'This message contains promotional language ("15% off") which requires a separate marketing campaign registration. Your current registration covers transactional appointment messages only.',
    fix: 'Remove promotional language from transactional messages, or register a marketing campaign to send promotional content.',
    prompt: 'My SMS compliance system flagged this message for containing promotional language in a transactional campaign: "GlowStudio: Book your next appointment this week and get 15% off! Visit glowstudio.com. Reply STOP to opt out." Rewrite it as a pure transactional appointment reminder with no promotional content, discounts, or calls to action beyond the appointment itself.',
  },
  {
    title: "Drift warning",
    message: "Hey, your appointment is coming up soon! Don\u2019t miss it \ud83d\ude0a",
    trigger: "This doesn\u2019t match your registered appointment reminder format. Registered messages include the specific service type, date, and time. Casual language and emoji increase the risk of carrier filtering.",
    fix: "Update your message template to include specific appointment details (service type, date, time) and remove casual language/emoji.",
    prompt: 'My SMS compliance system flagged this message for drifting from the registered format: "Hey, your appointment is coming up soon! Don\u2019t miss it \ud83d\ude0a" Rewrite it to match this registered format: "GlowStudio: Your [service] appointment is confirmed for [date] at [time]. Reply STOP to opt out." Keep it professional with specific details.',
  },
];

/* ── Main component ── */

export default function ApprovedDashboard() {
  const { state: sessionState } = useSession();
  const hasAlerts = sessionState.complianceView === "has_alerts";

  const [alertDetail, setAlertDetail] = useState<number | null>(null);
  const [upsellDismissed, setUpsellDismissed] = useState(false);

  return (
    <>
      {/* ── Alert detail modal ── */}
      {alertDetail !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-overlay">
          <div className="w-full max-w-lg rounded-xl bg-bg-primary border border-border-secondary shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-text-primary">{ALERT_DETAILS[alertDetail].title}</h2>
              <button
                type="button"
                onClick={() => setAlertDetail(null)}
                className="text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear cursor-pointer"
              >
                <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-text-primary">Your message:</p>
                <div className="mt-1.5 rounded-lg bg-bg-secondary p-3">
                  <p className="text-sm font-mono text-text-secondary">{ALERT_DETAILS[alertDetail].message}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">What triggered it:</p>
                <p className="mt-1 text-sm text-text-secondary leading-relaxed">{ALERT_DETAILS[alertDetail].trigger}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">What to do:</p>
                <p className="mt-1 text-sm text-text-secondary leading-relaxed">{ALERT_DETAILS[alertDetail].fix}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">Fix it with AI:</p>
                <div className="mt-1.5 relative rounded-lg bg-bg-secondary p-3 pr-10">
                  <p className="text-sm font-mono text-text-secondary leading-relaxed">{ALERT_DETAILS[alertDetail].prompt}</p>
                  <CopyButton text={ALERT_DETAILS[alertDetail].prompt} />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setAlertDetail(null)}
                className="rounded-lg bg-bg-brand-solid px-5 py-2.5 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Full-width dashboard layout ── */}
      <div>

        {/* Row 1 — 3 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* Card 1 — Delivery (row 1, left) */}
          <div className="rounded-xl border border-border-secondary bg-bg-primary p-5">
            <p className="text-sm font-semibold text-text-tertiary uppercase tracking-wide">Delivery</p>
            <div className="mt-3">
              <span className="text-3xl font-semibold text-text-success-primary">98.4%</span>
            </div>
            <p className="mt-1 text-sm text-text-secondary">delivery rate</p>
            <p className="mt-3 text-sm text-text-secondary">1,812 delivered &middot; 22 failed &middot; 8 pending</p>
            <p className="mt-1 text-sm text-text-success-primary">&uarr; 0.3% vs last period</p>
          </div>

          {/* Card 2 — Recipients (row 1, center) */}
          <div className="rounded-xl border border-border-secondary bg-bg-primary p-5">
            <p className="text-sm font-semibold text-text-tertiary uppercase tracking-wide">Recipients</p>
            <div className="mt-3">
              <span className="text-3xl font-semibold text-text-primary">284</span>
            </div>
            <p className="mt-1 text-sm text-text-secondary">unique recipients this period</p>
            <p className="mt-3 text-sm text-text-secondary">12 opt-outs (4.2%) &middot; 38 inbound replies</p>
            <p className="mt-1 text-sm text-text-success-primary">&uarr; 1.2% vs last period</p>
          </div>

          {/* Card 3 — Compliance (row 1, right) */}
          <div className="rounded-xl border border-border-secondary bg-bg-primary p-5">
            <p className="text-sm font-semibold text-text-tertiary uppercase tracking-wide">Compliance</p>
            <div className="mt-3">
              {hasAlerts ? (
                <>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-semibold text-text-warning-primary">99.4%</span>
                  </div>
                  <p className="mt-1 text-sm text-text-secondary">compliance rate</p>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-start gap-2 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-fg-error-primary shrink-0 mt-1.5" />
                      <span className="text-text-secondary flex-1">Content blocked — promotional language in transactional message</span>
                      <button type="button" onClick={() => setAlertDetail(0)} className="text-text-brand-secondary font-medium shrink-0 cursor-pointer hover:text-text-brand-primary transition duration-100 ease-linear">Fix &rarr;</button>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-fg-warning-primary shrink-0 mt-1.5" />
                      <span className="text-text-secondary flex-1">Drift — appointment reminders missing specific details</span>
                      <button type="button" onClick={() => setAlertDetail(1)} className="text-text-brand-secondary font-medium shrink-0 cursor-pointer hover:text-text-brand-primary transition duration-100 ease-linear">View &rarr;</button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-semibold text-text-success-primary">99.4%</span>
                  </div>
                  <p className="mt-1 text-sm text-text-secondary">compliance rate</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-fg-success-primary" />
                    <span className="text-sm font-semibold text-text-success-primary">All clear</span>
                  </div>
                  <p className="mt-1 text-xs text-text-tertiary">1,831 clean &middot; 8 blocked &middot; 3 warned</p>
                </>
              )}
            </div>
          </div>

        </div>

        {/* ── Marketing registration upsell (between rows) ── */}
        {hasAlerts && !upsellDismissed && (
          <div className="mt-4 flex items-start gap-3 rounded-lg border border-border-secondary bg-bg-secondary p-4">
            <svg className="size-5 text-fg-brand-primary shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text-primary">Want to send promotional messages?</p>
              <p className="mt-0.5 text-sm text-text-secondary">Register a marketing campaign — same process, takes a few minutes.</p>
              <Link
                href="#"
                className="mt-2 inline-block text-sm font-medium text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear"
              >
                Start marketing registration &rarr;
              </Link>
            </div>
            <button
              type="button"
              onClick={() => setUpsellDismissed(true)}
              className="text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear cursor-pointer shrink-0"
            >
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}

        {/* Row 2 — 3 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">

          {/* Card 4 — Usage & Billing (row 2, left) */}
          <div className="rounded-xl border border-border-secondary bg-bg-primary p-5">
            <p className="text-sm font-semibold text-text-tertiary uppercase tracking-wide">Usage &amp; billing</p>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-3xl font-semibold text-text-primary">347</span>
              <span className="text-lg text-text-tertiary">/ 500</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-bg-secondary">
              <div className="h-2 rounded-full bg-bg-brand-solid" style={{ width: "69.4%" }} />
            </div>
            <p className="mt-2 text-sm text-text-secondary">153 messages remaining this period</p>
            <p className="mt-2 text-xs text-text-tertiary">Plan: $19/mo &middot; 500 included</p>
          </div>

          {/* Card 5 — Message Types (row 2, center) */}
          <div className="rounded-xl border border-border-secondary bg-bg-primary p-5">
            <p className="text-sm font-semibold text-text-tertiary uppercase tracking-wide">Message types</p>
            <div className="mt-3 space-y-3">
              {MESSAGE_TYPES.map((type) => (
                <div key={type.label}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-text-secondary">{type.label}</span>
                    <span className="text-text-primary font-medium tabular-nums">{type.count.toLocaleString()}</span>
                  </div>
                  <div className="h-2 rounded-full bg-bg-secondary">
                    <div
                      className="h-2 rounded-full bg-bg-brand-solid"
                      style={{ width: `${(type.count / MESSAGE_TYPE_MAX) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 6 — Sending Patterns (row 2, right) */}
          <div className="rounded-xl border border-border-secondary bg-bg-primary p-5">
            <p className="text-sm font-semibold text-text-tertiary uppercase tracking-wide">Sending patterns</p>
            <div className="mt-3 flex items-end justify-between h-24">
              {HOURLY_DATA.map((value, i) => {
                const isQuietHour = i >= 21 || i <= 8;
                const heightPct = (value / HOURLY_MAX) * 100;
                return (
                  <div
                    key={i}
                    className={`w-2 rounded-t ${isQuietHour ? "bg-fg-warning-primary" : "bg-bg-brand-solid"}`}
                    style={{ height: `${Math.max(heightPct, 2)}%` }}
                    title={`${i === 0 ? "12" : i > 12 ? i - 12 : i}${i < 12 ? "AM" : "PM"}: ${value} messages`}
                  />
                );
              })}
            </div>
            <div className="mt-1 flex justify-between text-xs text-text-tertiary px-0">
              <span>12a</span>
              <span>6a</span>
              <span>12p</span>
              <span>6p</span>
            </div>
            <p className="mt-2 text-xs text-text-tertiary">Peak: 2–4 PM &middot; Quiet: 9 PM–9 AM</p>
          </div>

        </div>
      </div>
    </>
  );
}
