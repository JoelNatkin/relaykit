"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "@/context/session-context";
import { ShieldTick } from "@untitledui/icons";

/* ── Compliance attention section types & mock data (D-243) ── */

type ComplianceSeverity = "minor" | "escalated" | "suspended";

interface ComplianceItem {
  id: string;
  messageType: string | null;
  severity: ComplianceSeverity;
  originalMessage: string;
  adjustedMessage: string | null;
  explanation: string;
  /** For escalated: deadline date string */
  deadline?: string;
  /** For escalated: day N of 30 */
  deadlineDay?: number;
}

function complianceItemLabel(item: ComplianceItem): string {
  if (item.messageType) return item.messageType;
  const truncated = item.originalMessage.length > 40
    ? item.originalMessage.slice(0, 40) + "..."
    : item.originalMessage;
  return `Custom: ${truncated}`;
}

/* ── Inline icon components ── */

function PencilIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

const COMPLIANCE_ITEMS: ComplianceItem[] = [
  {
    id: "suspended-1",
    messageType: null,
    severity: "suspended",
    originalMessage: "GlowStudio Flash Sale! 50% off all services this weekend only! Book now at glowstudio.com before spots fill up! Reply STOP to opt out.",
    adjustedMessage: null,
    explanation: "This content type isn't covered by your registered campaign.",
  },
  {
    id: "escalated-1",
    messageType: "Booking confirmation",
    severity: "escalated",
    originalMessage: "GlowStudio: You're booked! Appointment confirmed for March 22 at 11 AM. Book a friend and you both get 20% off your next visit! Reply STOP to opt out.",
    adjustedMessage: "GlowStudio: You're booked! Appointment confirmed for March 22 at 11 AM. Reply STOP to opt out.",
    explanation: "Promotional content isn't permitted in transactional campaigns.",
    deadline: "April 18, 2026",
    deadlineDay: 8,
  },
  {
    id: "minor-1",
    messageType: "Appointment reminder",
    severity: "minor",
    originalMessage: "GlowStudio: Your Salon appointment is tomorrow at 2:30 PM. See you then!",
    adjustedMessage: "GlowStudio: Your Salon appointment is tomorrow at 2:30 PM. See you then! Reply STOP to opt out.",
    explanation: "Carriers require opt-out language in every message.",
  },
];

const SEVERITY_CONFIG: Record<ComplianceSeverity, { label: string; bg: string; text: string }> = {
  minor: { label: "Minor", bg: "bg-gray-100", text: "text-gray-600" },
  escalated: { label: "Escalated", bg: "bg-amber-100", text: "text-amber-700" },
  suspended: { label: "Suspended", bg: "bg-red-100", text: "text-red-700" },
};

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
  const { state: sessionState, setAlertsEnabled } = useSession();
  const hasAlerts = sessionState.complianceView === "has_alerts";
  const alertsEnabled = sessionState.alertsEnabled;

  const [alertDetail, setAlertDetail] = useState<number | null>(null);
  const [upsellDismissed, setUpsellDismissed] = useState(false);
  const [dismissedItems, setDismissedItems] = useState<Set<string>>(new Set());

  const visibleItems = COMPLIANCE_ITEMS.filter((item) => !dismissedItems.has(item.id));

  function handleFixedInCode(id: string) {
    setDismissedItems((prev) => new Set(prev).add(id));
  }

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

          {/* Card 3 — Usage & Billing (row 1, right) */}
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

        </div>

        {/* ── Marketing registration upsell ── */}
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

        {/* ── Compliance attention section (D-243) ── */}
        {hasAlerts && visibleItems.length > 0 ? (
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-text-primary">Message compliance</h2>
              {/* D-239: Alerts status indicator */}
              {alertsEnabled ? (
                <span className="flex items-center gap-1.5 text-sm text-text-tertiary">
                  <span className="w-2 h-2 rounded-full bg-fg-success-primary shrink-0" />
                  SMS alerts: On
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setAlertsEnabled(true)}
                  className="flex items-center gap-1.5 text-sm text-text-warning-primary hover:text-text-warning-secondary transition duration-100 ease-linear cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-fg-warning-primary shrink-0" />
                  SMS alerts: Off
                </button>
              )}
            </div>
            <p className="mt-1 text-sm text-text-tertiary">We scan messages and patch ones that carriers would flag</p>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {visibleItems.map((item) => {
                const sev = SEVERITY_CONFIG[item.severity];
                const label = complianceItemLabel(item);
                return (
                  <div key={item.id} className="relative rounded-xl border border-border-secondary bg-bg-primary px-5 pb-5 pt-8 flex flex-col">
                    {/* Badge — pinned top-right */}
                    <span className={`absolute top-4 right-4 ml-4 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${sev.bg} ${sev.text}`}>
                      {sev.label}
                    </span>

                    {/* Title */}
                    <span className="text-sm font-semibold text-text-primary pr-24">{label}</span>

                    {/* Reason + escalated countdown */}
                    <p className="mt-2 text-sm text-text-tertiary">{item.explanation}</p>
                    {item.severity === "escalated" && item.deadline && (
                      <p className="mt-1 text-sm font-medium text-text-warning-primary">
                        Please update by {item.deadline} or this message will stop sending.
                      </p>
                    )}

                    {/* Suspended: blocked status before message content */}
                    {item.severity === "suspended" && (
                      <p className="mt-3 text-sm font-medium text-text-error-primary">Blocked &mdash; not sending</p>
                    )}

                    {/* Original message block */}
                    <div className="mt-4 mb-3 rounded-lg bg-bg-error-primary p-3">
                      <p className="text-xs font-medium text-text-error-primary uppercase tracking-wide mb-2">Original</p>
                      <p className="text-sm text-text-secondary leading-relaxed">{item.originalMessage}</p>
                    </div>

                    {/* Adjusted block (minor/escalated only) */}
                    {item.severity !== "suspended" && item.adjustedMessage && (
                      <div className="mb-3 rounded-lg bg-bg-success-primary p-3">
                        <p className="text-xs font-medium text-text-success-primary uppercase tracking-wide mb-2">Adjusted &mdash; Currently sending</p>
                        <p className="text-sm text-text-secondary leading-relaxed">{item.adjustedMessage}</p>
                      </div>
                    )}

                    {/* Action buttons — right-aligned, always at bottom */}
                    <div className="mt-auto flex items-center justify-end gap-2 pt-3">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border-primary bg-bg-primary px-3 py-1.5 text-sm font-medium text-text-secondary hover:bg-bg-secondary transition duration-100 ease-linear cursor-pointer"
                      >
                        <PencilIcon className="text-fg-tertiary" />
                        Edit message
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFixedInCode(item.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border-primary bg-bg-primary px-3 py-1.5 text-sm font-medium text-text-secondary hover:bg-bg-secondary transition duration-100 ease-linear cursor-pointer"
                      >
                        <CheckIcon className="text-fg-tertiary" />
                        Fixed in code
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mt-10 flex flex-col items-center text-center py-6">
            {/* Shield-chat illustration */}
            <svg width="85" height="88" viewBox="0 0 85 88" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-20 w-auto" aria-hidden="true">
              <path d="M84.6255 83.0202L82.1802 75.6764C81.7896 74.5084 81.8481 73.1881 82.3442 71.9655C83.7583 68.4616 84.2934 64.7507 83.938 60.9385C83.1958 52.8487 78.2778 45.7505 70.997 42.1145C71.5166 39.72 71.7978 37.2629 71.7978 34.7786C71.7978 25.1145 67.9306 16.1376 60.9108 9.49758C53.9069 2.87258 44.7348 -0.482923 35.0668 0.0561766C17.8478 1.0093 3.80481 14.6812 2.39881 31.8572C1.99256 36.7986 2.60584 41.6267 4.21911 46.2092C4.74645 47.7092 4.81286 49.299 4.40661 50.799L0.109714 66.713C-0.179346 67.7911 0.109714 68.9083 0.894874 69.7052C1.48862 70.3106 2.27767 70.6349 3.09407 70.6349C3.34798 70.6349 3.60579 70.6036 3.85969 70.5372L19.2777 66.6739C20.8558 66.2755 22.5394 66.4083 24.141 67.0567C28.223 68.7012 32.559 69.5372 37.039 69.5372C37.3046 69.5372 37.5507 69.5177 37.8124 69.5138C40.4257 78.7794 48.6484 85.7438 58.2614 86.6348C62.0114 86.9668 65.8005 86.4199 69.2304 85.045C70.496 84.5411 71.8007 84.4825 72.9921 84.877L80.3202 87.3184C80.6757 87.4356 81.0429 87.4942 81.4022 87.4942C82.285 87.4942 83.1483 87.1465 83.7967 86.4981C84.7147 85.5801 85.0272 84.2481 84.617 83.0215L84.6255 83.0202ZM37.0435 66.4112C32.9693 66.4112 29.024 65.6534 25.3165 64.1573C23.0977 63.2627 20.7462 63.0831 18.5235 63.6377L3.12847 67.5284V67.5244L7.42537 51.6104C7.99568 49.4971 7.90584 47.2706 7.16756 45.169C5.69876 41.0049 5.14416 36.6104 5.51526 32.107C6.79646 16.482 19.5743 4.04104 35.2383 3.16904C35.8476 3.13388 36.4571 3.11826 37.0625 3.11826C45.1836 3.11826 52.8285 6.14946 58.7615 11.7628C65.1521 17.8058 68.6677 25.9778 68.6677 34.7748C68.6677 37.435 68.3356 40.0639 67.6794 42.6029C64.2927 56.0049 52.7344 65.5479 38.8944 66.3529C38.2811 66.3958 37.6685 66.4112 37.0435 66.4112ZM81.5945 84.2862C81.4734 84.4034 81.3523 84.3643 81.3132 84.3526L73.9812 81.9073C72.1023 81.2862 70.0007 81.3682 68.071 82.1417C65.0944 83.3331 61.8015 83.8097 58.5476 83.5206C50.4304 82.7706 43.4456 77.0167 40.9926 69.2866C54.6956 67.7436 66.0746 58.3486 70.1646 45.2046C76.1646 48.439 80.1956 54.4273 80.8206 61.2246C81.1292 64.541 80.6644 67.7598 79.4378 70.7949C78.6644 72.709 78.5824 74.7949 79.2074 76.666L81.6527 84.0098C81.6644 84.0488 81.7073 84.1699 81.5863 84.2871L81.5945 84.2862Z" fill="#7C5CFC"/>
              <path d="M72.5705 65.0202C72.5705 67.1022 69.4455 67.1022 69.4455 65.0202C69.4455 62.9343 72.5705 62.9343 72.5705 65.0202Z" fill="#7C5CFC"/>
              <path d="M63.6605 65.0202C63.6605 67.1022 60.5355 67.1022 60.5355 65.0202C60.5355 62.9343 63.6605 62.9343 63.6605 65.0202Z" fill="#7C5CFC"/>
              <path d="M53.9375 17.4502C50.9219 17.4345 47.9922 16.8369 45.2227 15.6729C42.7344 14.626 40.4688 13.1573 38.4805 11.3018C37.4141 10.3057 35.8008 10.2979 34.7266 11.2783C33.0469 12.8174 31.168 14.0947 29.1407 15.083C26.1641 16.5283 22.9532 17.3174 19.5977 17.4228C18.0743 17.4697 16.8789 18.704 16.8789 20.2275V32.3525C16.8789 34.9345 17.207 37.3955 17.8476 39.6572C18.8164 43.0674 20.9257 47.9775 25.4531 52.0052C28.3164 54.5482 31.8281 56.4388 35.6131 57.47C35.9452 57.5599 36.2889 57.6068 36.6365 57.6068C36.9451 57.6068 37.2537 57.5716 37.5545 57.4974C40.7615 56.7318 46.8318 54.5599 51.4805 48.5912C53.1953 46.3881 54.5196 43.9154 55.418 41.2357C56.2774 38.681 56.711 35.849 56.711 32.8295V20.2745C56.711 18.7276 55.4649 17.462 53.9298 17.4542L53.9375 17.4502ZM53.5935 32.829C53.5935 35.5126 53.2146 38.0087 52.4646 40.2431C51.6755 42.5869 50.5193 44.7509 49.0232 46.6728C44.9607 51.8876 39.6443 53.79 36.8352 54.458C36.6985 54.4892 36.5656 54.4892 36.4406 54.4541C33.1164 53.5478 30.0383 51.8955 27.5344 49.6689C23.5696 46.1416 21.7141 41.8134 20.8586 38.8019C20.2922 36.8136 20.0071 34.6457 20.0071 32.3488V20.5288C23.6946 20.3725 27.2259 19.4858 30.5071 17.8882C32.7063 16.8179 34.7493 15.4468 36.5891 13.8023C38.7844 15.8062 41.2805 17.4 44.011 18.5484C47.0579 19.8296 50.2805 20.5093 53.593 20.5679L53.5935 32.829Z" fill="#7C5CFC"/>
              <path d="M48.7655 33.0402C47.8983 32.9933 47.1561 33.6261 47.0936 34.4894C47.0076 35.7042 46.785 36.8527 46.4334 37.9035C45.9412 39.3644 45.2186 40.7121 44.2889 41.9113C41.7616 45.1613 38.4451 46.3449 36.7108 46.7668C34.6053 46.1925 32.7381 45.1887 31.1561 43.7824C30.5116 43.2081 29.5233 43.2667 28.9491 43.9113C28.3749 44.5558 28.4335 45.5441 29.078 46.1183C30.996 47.8253 33.3514 49.091 35.8866 49.7824C36.1483 49.8527 36.4218 49.8878 36.6913 49.8878C36.9335 49.8878 37.1757 49.8605 37.4179 49.8019C39.5663 49.2902 43.6406 47.8331 46.7538 43.8292C47.9022 42.3526 48.7929 40.6925 49.3983 38.8956C49.8358 37.5948 50.1092 36.1886 50.2147 34.712C50.2772 33.8526 49.6287 33.1027 48.7655 33.0402Z" fill="#7C5CFC"/>
              <path d="M38.2655 18.9032C37.3631 18.0633 35.996 18.0516 35.0858 18.8837C34.035 19.8446 32.8631 20.6454 31.5936 21.2626C29.7342 22.1649 27.7264 22.6571 25.6288 22.7235C24.3397 22.7625 23.3319 23.8016 23.3319 25.0907V32.954C23.3319 34.6806 23.5506 36.3251 23.9842 37.8446C24.1717 38.5008 24.3905 39.1454 24.6444 39.7626C24.8905 40.3719 25.4764 40.7391 26.0936 40.7391C26.2889 40.7391 26.4881 40.7001 26.6795 40.6258C27.4803 40.3016 27.867 39.3914 27.5428 38.5906C27.3162 38.0281 27.1365 37.489 26.992 36.989C26.6405 35.7507 26.4608 34.3913 26.4608 32.9538V25.8093C28.7381 25.6453 30.9256 25.0632 32.9608 24.071C34.2889 23.4265 35.5311 22.6179 36.66 21.6608C38.0428 22.8522 39.5858 23.8092 41.2655 24.5163C43.1405 25.3054 45.1132 25.7507 47.1444 25.8483V26.8835C47.1444 27.7468 47.8436 28.446 48.7069 28.446C49.5701 28.446 50.2694 27.7468 50.2694 26.8835V25.1218C50.2694 23.8171 49.2147 22.7507 47.9217 22.7429C46.0389 22.7312 44.2069 22.3601 42.4803 21.6335C40.9295 20.9812 39.5115 20.0632 38.2694 18.903L38.2655 18.9032Z" fill="#7C5CFC"/>
              <path d="M35.1605 38.9192C35.555 38.9192 35.9534 38.7707 36.2543 38.47L42.9301 31.9075C43.5434 31.302 43.5551 30.3137 42.9496 29.6966C42.3441 29.0794 41.3558 29.0716 40.7387 29.677L35.1567 35.1653L32.8559 32.9036C32.2387 32.2982 31.2504 32.306 30.645 32.9232C30.0395 33.5364 30.0473 34.5287 30.6645 35.1341L34.059 38.47C34.3637 38.7668 34.7583 38.9192 35.1528 38.9192H35.1605Z" fill="#7C5CFC"/>
            </svg>

            {alertsEnabled ? (
              <p className="mt-4 text-sm text-text-tertiary">Delivery is healthy. We&rsquo;ll text you if anything changes.</p>
            ) : (
              <>
                <p className="mt-4 text-sm text-text-tertiary">Delivery is healthy.</p>
                <p className="mt-2 text-sm text-text-tertiary">
                  Want a text when we catch something?{" "}
                  <button
                    type="button"
                    onClick={() => setAlertsEnabled(true)}
                    className="font-medium text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear cursor-pointer"
                  >
                    Enable alerts
                  </button>
                </p>
              </>
            )}
          </div>
        )}

      </div>
    </>
  );
}
