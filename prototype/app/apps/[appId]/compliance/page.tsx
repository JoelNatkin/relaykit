"use client";

import { useState } from "react";
import { useSession } from "@/context/session-context";
import { SAMPLE } from "@/components/dashboard/sample-data";
import {
  Shield01,
  AlertCircle,
  CheckCircle,
  Lock01,
  Compass,
  ChevronDown,
  ChevronUp,
} from "@untitledui/icons";

/* ── Alert types and mock data ── */

type AlertType = "block" | "drift" | "escalation" | "consent";

interface Alert {
  id: string;
  type: AlertType;
  timestamp: string;
  whatHappened: string;
  whyItMatters: string;
  whatWeDid: string;
  whatToDo: string | null;
}

const MOCK_ALERTS: Record<string, Alert[]> = {
  clear: [],
  blocks: [
    {
      id: "a1",
      type: "block",
      timestamp: "3 hours ago",
      whatHappened: "A message contained a shortened URL (bit.ly) that matches our URL blocklist.",
      whyItMatters: "Carriers flag shortened URLs as potential phishing vectors. Continued use risks carrier filtering on your traffic.",
      whatWeDid: "RelayKit blocked this before it reached the carrier. No delivery, no carrier penalty.",
      whatToDo: "Replace the shortened URL with your full domain link.",
    },
  ],
  drift: [
    {
      id: "a2",
      type: "drift",
      timestamp: "Yesterday",
      whatHappened: "Recent messages are drifting from your registered appointment reminder use case toward general marketing language.",
      whyItMatters: "Carrier filtering risk increases as drift accumulates. Messages that don't match your registered use case can trigger campaign suspension.",
      whatWeDid: "This is a warning — no messages were blocked yet.",
      whatToDo: "Review your templates against the registered messages below. Tighten the language or register a marketing campaign.",
    },
  ],
  escalation: [
    {
      id: "a3",
      type: "escalation",
      timestamp: "2 days ago",
      whatHappened: "URL blocklist violations detected across 3 alert cycles without resolution.",
      whyItMatters: "If this pattern continues, we will pause this specific message type to protect your account standing.",
      whatWeDid: "We have flagged this pattern three times now.",
      whatToDo: "Replace shortened URLs with full domain links before March 20, 2026.",
    },
  ],
  consent: [
    {
      id: "a4",
      type: "consent",
      timestamp: "5 hours ago",
      whatHappened: "A marketing message was sent to a recipient without a recorded marketing opt-in.",
      whyItMatters: "TCPA requires explicit consent before marketing messages. Sending without consent exposes you to legal risk and carrier penalties.",
      whatWeDid: "We blocked it — the carrier never saw it.",
      whatToDo: "Check your opt-in data pipeline. Confirm POST /v1/consents is wired on all channels.",
    },
  ],
};

const ALERT_STYLES: Record<AlertType, { border: string; badge: string; badgeBg: string; icon: typeof Shield01; label: string }> = {
  block: { border: "border-border-error", badge: "text-text-error-primary", badgeBg: "bg-bg-error-secondary", icon: Shield01, label: "Content blocked" },
  drift: { border: "border-border-warning", badge: "text-text-warning-primary", badgeBg: "bg-bg-warning-secondary", icon: Compass, label: "Drift warning" },
  escalation: { border: "border-border-warning", badge: "text-text-warning-primary", badgeBg: "bg-bg-warning-secondary", icon: AlertCircle, label: "Escalation notice" },
  consent: { border: "border-border-error", badge: "text-text-error-primary", badgeBg: "bg-bg-error-secondary", icon: Lock01, label: "Consent gap" },
};

/* ── Alert card ── */

function AlertCard({ alert }: { alert: Alert }) {
  const [expanded, setExpanded] = useState(false);
  const style = ALERT_STYLES[alert.type];
  const Icon = style.icon;

  return (
    <div className={`rounded-xl border ${style.border} bg-bg-primary p-4`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${style.badgeBg}`}>
            <Icon className={`size-4 ${style.badge}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold ${style.badge}`}>{style.label}</span>
              <span className="text-[11px] text-text-quaternary">{alert.timestamp}</span>
            </div>
            <p className="mt-1 text-sm text-text-primary">{alert.whatHappened}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="shrink-0 rounded-md p-1 text-fg-quaternary hover:text-fg-secondary transition duration-100 ease-linear"
        >
          {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 ml-11 space-y-3 border-t border-border-secondary pt-3">
          <div>
            <p className="text-[11px] font-semibold text-text-quaternary uppercase tracking-wide">Why it matters</p>
            <p className="mt-0.5 text-sm text-text-tertiary">{alert.whyItMatters}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-text-quaternary uppercase tracking-wide">What we did</p>
            <p className="mt-0.5 text-sm text-text-tertiary">{alert.whatWeDid}</p>
          </div>
          {alert.whatToDo && (
            <div>
              <p className="text-[11px] font-semibold text-text-quaternary uppercase tracking-wide">What to do</p>
              <p className="mt-0.5 text-sm text-text-primary font-medium">{alert.whatToDo}</p>
            </div>
          )}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              className="rounded-md border border-border-primary px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-bg-primary_hover transition duration-100 ease-linear"
            >
              Mark resolved
            </button>
            {alert.type === "drift" && (
              <button
                type="button"
                className="rounded-md px-3 py-1.5 text-xs font-medium text-text-quaternary hover:text-text-secondary transition duration-100 ease-linear"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Scenario toggle ── */

type Scenario = "clear" | "blocks" | "drift" | "escalation" | "consent";

const SCENARIOS: { value: Scenario; label: string }[] = [
  { value: "clear", label: "All clear" },
  { value: "blocks", label: "Blocks" },
  { value: "drift", label: "Drift" },
  { value: "escalation", label: "Escalation" },
  { value: "consent", label: "Consent" },
];

/* ── Page ── */

export default function AppCompliance() {
  const { state } = useSession();
  const [scenario, setScenario] = useState<Scenario>("clear");
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);

  /* ── Sandbox mode ── */
  if (state.appState === "sandbox") {
    return (
      <div className="py-4 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Compliance Monitoring</h2>
          <p className="mt-1 text-sm text-text-tertiary">
            Every sandbox message goes through the same checks as production — look at your API responses for enforcement details.
          </p>
        </div>

        <div className="rounded-xl border border-border-secondary bg-bg-secondary p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-bg-brand-secondary">
              <Shield01 className="size-5 text-fg-brand-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">
                Once you go live, this tab monitors every message
              </p>
              <p className="mt-1 text-sm text-text-tertiary">
                Drift detection, consent enforcement, and automatic blocking — RelayKit catches issues before they reach the carrier.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border-brand bg-bg-brand-primary p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-text-primary">Ready to go live?</p>
            <p className="text-xs text-text-tertiary mt-0.5">
              Register for carrier approval. Your sandbox stays active during the 2–3 week review.
            </p>
          </div>
          <button
            type="button"
            className="shrink-0 rounded-lg bg-bg-brand-solid px-4 py-2 text-sm font-medium text-text-white hover:bg-bg-brand-solid_hover transition duration-100 ease-linear"
          >
            Go live →
          </button>
        </div>
      </div>
    );
  }

  /* ── Live mode ── */
  const alerts = MOCK_ALERTS[scenario] || [];
  const isAllClear = scenario === "clear";
  const statusColor = isAllClear ? "text-text-success-primary" : scenario === "blocks" || scenario === "consent" ? "text-text-error-primary" : "text-text-warning-primary";
  const statusBg = isAllClear ? "bg-bg-success-secondary" : scenario === "blocks" || scenario === "consent" ? "bg-bg-error-secondary" : "bg-bg-warning-secondary";
  const statusLabel = isAllClear ? "All clear" : scenario === "escalation" ? "Action needed" : "Warnings";

  return (
    <div className="py-4 space-y-6">
      {/* Scenario toggle — prototype control */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-text-quaternary mr-1">Scenario:</span>
        <div className="flex items-center gap-0.5 rounded-lg border border-border-secondary p-0.5">
          {SCENARIOS.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setScenario(s.value)}
              className={`rounded-md px-2 py-1 text-[11px] font-medium transition duration-100 ease-linear ${
                scenario === s.value
                  ? "bg-bg-brand-solid text-text-white"
                  : "text-text-tertiary hover:text-text-secondary hover:bg-bg-primary_hover"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI dashboard */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-border-secondary bg-bg-primary p-4 text-center">
          <p className="text-2xl font-bold text-text-primary">{SAMPLE.messagesThisMonth.toLocaleString()}</p>
          <p className="text-xs text-text-tertiary mt-1">Messages This Period</p>
          <p className="text-[11px] text-text-quaternary mt-0.5">
            {isAllClear ? "all clean" : `${alerts.length} flagged`}
          </p>
        </div>
        <div className="rounded-xl border border-border-secondary bg-bg-primary p-4 text-center">
          <div className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${statusBg} ${statusColor}`}>
            {statusLabel}
          </div>
          <p className="text-xs text-text-tertiary mt-2">Status</p>
        </div>
        <div className="rounded-xl border border-border-secondary bg-bg-primary p-4 text-center">
          <p className="text-2xl font-bold text-text-primary">4 min ago</p>
          <p className="text-xs text-text-tertiary mt-1">Last Scanned</p>
          <p className="text-[11px] text-text-quaternary mt-0.5">Monitoring is active</p>
        </div>
      </div>

      {/* All-clear state */}
      {isAllClear && (
        <div className="rounded-xl border border-border-secondary bg-bg-success-primary p-5">
          <div className="flex items-center gap-3">
            <CheckCircle className="size-5 text-fg-success-primary" />
            <p className="text-sm text-text-primary">
              Everything looks good. Your messages are within your registered use case and no compliance issues were detected this period.
            </p>
          </div>
        </div>
      )}

      {/* Active alerts */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-text-primary">Active alerts</h3>
          {alerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      )}

      {/* Reassurance anchor */}
      {!isAllClear && (
        <div className="rounded-lg bg-bg-secondary px-4 py-3">
          <p className="text-xs text-text-tertiary italic">
            RelayKit&apos;s compliance layer runs on every message before it reaches Twilio. If we blocked something, the carrier never saw it.
          </p>
        </div>
      )}

      {/* Canon messages reference */}
      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-3">Registered messages</h3>
        <p className="text-xs text-text-tertiary mb-3">
          Carrier-approved templates — the ground truth for compliance monitoring. Compare against these when debugging drift.
        </p>
        <div className="space-y-2">
          {SAMPLE.canonMessages.map((msg, i) => (
            <div key={i} className="rounded-lg border border-border-secondary bg-bg-primary px-4 py-3">
              <p className="text-xs font-medium text-text-primary">{msg.name}</p>
              <p className="mt-1 text-xs text-text-tertiary font-mono">{msg.template}</p>
            </div>
          ))}
        </div>
      </div>

      {/* "How compliance works" expandable */}
      <div className="rounded-xl border border-border-secondary">
        <button
          type="button"
          onClick={() => setHowItWorksOpen(!howItWorksOpen)}
          className="flex w-full items-center justify-between px-5 py-4 text-left"
        >
          <span className="text-sm font-medium text-text-secondary">How compliance works</span>
          {howItWorksOpen ? <ChevronUp className="size-4 text-fg-quaternary" /> : <ChevronDown className="size-4 text-fg-quaternary" />}
        </button>
        {howItWorksOpen && (
          <div className="border-t border-border-secondary px-5 py-4 space-y-3">
            <div>
              <p className="text-xs font-semibold text-text-primary">Inline proxy enforcement</p>
              <p className="text-xs text-text-tertiary">Opt-out checks, keyword scanning, quiet hours, URL blocklist, marketing consent. Runs on every message before Twilio sees it.</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-text-primary">Async drift detection</p>
              <p className="text-xs text-text-tertiary">Semantic comparison against your registered messages. Catches gradual drift that rule-based scanning misses. Sampled traffic.</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-text-primary">Escalation automation</p>
              <p className="text-xs text-text-tertiary">Unresolved patterns across multiple cycles trigger a pause on the specific message type — not your full account.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
