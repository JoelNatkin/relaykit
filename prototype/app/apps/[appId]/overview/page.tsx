"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSession } from "@/context/session-context";
import ApprovedDashboard from "./approved-dashboard";

/* ── Sandbox compliance attention mock data (D-243) ── */

type SandboxSeverity = "minor" | "moderate" | "severe";

interface SandboxComplianceItem {
  id: string;
  messageType: string | null;
  severity: SandboxSeverity;
  originalMessage: string;
  adjustedMessage: string | null;
  explanation: string;
}

function sbComplianceItemLabel(item: SandboxComplianceItem): string {
  if (item.messageType) return item.messageType;
  const truncated = item.originalMessage.length > 40
    ? item.originalMessage.slice(0, 40) + "..."
    : item.originalMessage;
  return `Custom: ${truncated}`;
}

function SbCheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

const SANDBOX_COMPLIANCE_ITEMS: SandboxComplianceItem[] = [
  {
    id: "sb-severe-1",
    messageType: null,
    severity: "severe",
    originalMessage: "GlowStudio Flash Sale! 50% off all services this weekend only! Book now at glowstudio.com before spots fill up! Reply STOP to opt out.",
    adjustedMessage: null,
    explanation: "This content type isn't in your registered campaign. You'd need a marketing campaign to send this live.",
  },
  {
    id: "sb-moderate-1",
    messageType: "Booking confirmation",
    severity: "moderate",
    originalMessage: "GlowStudio: You're booked! Appointment confirmed for March 22 at 11 AM. Book a friend and you both get 20% off your next visit! Reply STOP to opt out.",
    adjustedMessage: "GlowStudio: You're booked! Appointment confirmed for March 22 at 11 AM. Reply STOP to opt out.",
    explanation: "This message includes promotional content. Transactional campaigns can't include promotions.",
  },
  {
    id: "sb-minor-1",
    messageType: "Appointment reminder",
    severity: "minor",
    originalMessage: "GlowStudio: Your Salon appointment is tomorrow at 2:30 PM. See you then!",
    adjustedMessage: "GlowStudio: Your Salon appointment is tomorrow at 2:30 PM. See you then! Reply STOP to opt out.",
    explanation: "We added opt-out language to this message. Your code should include it too.",
  },
];

const SANDBOX_SEVERITY_CONFIG: Record<SandboxSeverity, { label: string; bg: string; text: string }> = {
  minor: { label: "Minor", bg: "bg-gray-100", text: "text-gray-600" },
  moderate: { label: "Moderate", bg: "bg-amber-100", text: "text-amber-700" },
  severe: { label: "Severe", bg: "bg-red-100", text: "text-red-700" },
};

/* ── Clipboard icon ── */

function ClipboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

function BlockCopyButton({ text }: { text: string }) {
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

/* ── OTP input ── */

function OtpInput({ value, onChange, onComplete }: { value: string; onChange: (v: string) => void; onComplete: () => void }) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(6, "").slice(0, 6).split("");

  function handleInput(index: number, char: string) {
    if (!/^\d$/.test(char)) return;
    const next = digits.slice();
    next[index] = char;
    const joined = next.join("").replace(/[^\d]/g, "");
    onChange(joined);
    if (index < 5) inputRefs.current[index + 1]?.focus();
    if (joined.length === 6) onComplete();
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (digits[index] && digits[index] !== " ") {
        const next = digits.slice();
        next[index] = " ";
        onChange(next.join("").trimEnd());
      } else if (index > 0) {
        const next = digits.slice();
        next[index - 1] = " ";
        onChange(next.join("").trimEnd());
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted) {
      onChange(pasted);
      inputRefs.current[Math.min(pasted.length, 5)]?.focus();
      if (pasted.length === 6) onComplete();
    }
  }

  return (
    <div className="flex gap-2">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i]?.trim() || ""}
          onChange={() => {}}
          onInput={(e) => handleInput(i, (e.target as HTMLInputElement).value.slice(-1))}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className="w-11 h-12 rounded-xl border bg-bg-primary text-center text-lg font-medium text-text-brand-tertiary shadow-xs transition duration-100 ease-linear focus:ring-2 focus:ring-brand-600 focus:border-brand-600 focus:outline-none border-border-primary"
          aria-label={`Digit ${i + 1} of 6`}
        />
      ))}
    </div>
  );
}

/* ── Step number circle ── */

function StepCircle({ num, state }: { num: number; state: "locked" | "active" | "completed" }) {
  if (state === "completed") {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-bg-success-secondary shrink-0">
        <svg className="size-4 text-fg-success-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
    );
  }
  if (state === "active") {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-bg-brand-solid text-text-white text-sm font-semibold shrink-0">
        {num}
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-bg-tertiary text-text-quaternary text-sm font-semibold shrink-0">
      {num}
    </div>
  );
}

/* ── Connector line between steps ── */

function StepConnector({ state }: { state: "completed" | "pending" }) {
  return (
    <div className={`w-px flex-1 ${state === "completed" ? "bg-fg-success-secondary" : "bg-border-secondary"}`} />
  );
}

/* ── Tool selector (compact) ── */

const TOOL_LOGO_MAP: Record<string, string> = {
  "claude-code": "/logos/claude-logo.svg",
  cursor: "/logos/cursor-logo.svg",
  windsurf: "/logos/windsurf-logo.svg",
  copilot: "/logos/github-copilot-logo.svg",
  cline: "/logos/cline-logo.svg",
};

const TOOLS = [
  { id: "claude-code", label: "Claude Code" },
  { id: "cursor", label: "Cursor" },
  { id: "windsurf", label: "Windsurf" },
  { id: "copilot", label: "GitHub Copilot" },
  { id: "cline", label: "Cline" },
  { id: "other", label: "Other" },
];

const TOOL_INSTRUCTIONS: Record<string, { before: string; prompt: string }> = {
  "claude-code": {
    before: "Drop both files in your project root. Then run:",
    prompt: 'claude "Build my SMS integration using SMS_BUILD_SPEC.md and SMS_GUIDELINES.md"',
  },
  cursor: {
    before: "Drop both files in your project root. Open Composer:",
    prompt: "Build my SMS integration using SMS_BUILD_SPEC.md and SMS_GUIDELINES.md",
  },
  windsurf: {
    before: "Drop both files in your project root. Open Cascade:",
    prompt: "Build my SMS integration using SMS_BUILD_SPEC.md and SMS_GUIDELINES.md",
  },
  copilot: {
    before: "Drop both files in your project root. Open Copilot Chat:",
    prompt: "Build my SMS integration using SMS_BUILD_SPEC.md and SMS_GUIDELINES.md",
  },
  cline: {
    before: "Drop both files in your project root. Open Cline:",
    prompt: "Build my SMS integration using SMS_BUILD_SPEC.md and SMS_GUIDELINES.md",
  },
  other: {
    before: "Drop both files in your project root. Tell your AI coding tool:",
    prompt: "Build my SMS integration using SMS_BUILD_SPEC.md and SMS_GUIDELINES.md",
  },
};

/* ── Constants ── */

const API_KEY = "rk_sandbox_x7kM9pQ2vR4nT8wB";

const TEST_MESSAGES = [
  { id: "booking", name: "Booking confirmation", body: "GlowStudio: Your Salon appointment is confirmed for March 16, 2026 at 2:30 PM. Reply STOP to opt out." },
  { id: "reminder", name: "Appointment reminder", body: "GlowStudio: Reminder — your Salon appointment is tomorrow at 2:30 PM. Reply STOP to opt out." },
  { id: "reschedule", name: "Reschedule notice", body: "GlowStudio: Your Salon appointment has been rescheduled to March 18, 2026 at 10:00 AM. Reply STOP to opt out." },
  { id: "cancellation", name: "Cancellation notice", body: "GlowStudio: Your Salon appointment on March 16, 2026 has been cancelled. Visit glowstudio.com to rebook. Reply STOP to opt out." },
];

function buildCodeSnippet(phoneNumber: string, messageBody: string) {
  return `const response = await fetch("https://api.relaykit.dev/v1/messages", {
  method: "POST",
  headers: {
    "Authorization": "Bearer ${API_KEY}",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    to: "${phoneNumber}",
    body: "${messageBody}"
  })
});
const data = await response.json();
console.log(data.status);`;
}

function getSnippetPreview() {
  return `const response = await fetch("https://api.relaykit.dev/v1/messages", {
  method: "POST",
  headers: {
    "Authorization": "Bearer ${API_KEY}",
    "Content-Type": "application/json"
  },`;
}

/* ── Section heading row ── */

function SectionHeading({ title, expanded, onToggle, badge }: { title: string; checked?: boolean; expanded: boolean; onToggle: () => void; onCheckboxToggle?: () => void; badge?: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center gap-3 py-3 cursor-pointer group"
    >
      <span className="text-base font-semibold text-text-primary">{title}</span>
      {badge}
      <svg
        className={`ml-auto size-4 text-text-tertiary transition duration-150 ease-linear group-hover:text-text-secondary ${expanded ? "rotate-180" : ""}`}
        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  );
}

/* ── Status badges ── */

function BrandBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-bg-brand-secondary px-2.5 py-1 text-xs font-medium text-text-brand-secondary">
      <span className="w-1.5 h-1.5 rounded-full bg-fg-brand-primary" />
      {children}
    </span>
  );
}

function SuccessBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-bg-success-secondary px-2.5 py-1 text-xs font-medium text-text-success-primary">
      <span className="w-1.5 h-1.5 rounded-full bg-fg-success-primary" />
      {children}
    </span>
  );
}

function ErrorBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-bg-error-secondary px-2.5 py-1 text-xs font-medium text-text-error-primary">
      <span className="w-1.5 h-1.5 rounded-full bg-fg-error-primary" />
      {children}
    </span>
  );
}

/* ── Registration stepper (right column) ── */

interface StepperStep {
  label: string;
  detail: string | null;
  detailClass?: string;
  link?: { text: string; href: string };
  status: "completed" | "active" | "upcoming" | "error";
}

const PENDING_STEPS: StepperStep[] = [
  { label: "Registration submitted", detail: "Mar 17", status: "completed" },
  { label: "Registration fee paid", detail: "$49", status: "completed" },
  { label: "Compliance site published", detail: null, link: { text: "View site \u2192", href: "#" }, status: "completed" },
  { label: "Carrier review", detail: "Carriers verify your business and message content. We respond to any questions on your behalf.", status: "active" },
  { label: "Phone number assigned", detail: null, status: "upcoming" },
  { label: "Live", detail: null, status: "upcoming" },
];

const APPROVED_STEPS: StepperStep[] = [
  { label: "Registration submitted", detail: "Mar 17", status: "completed" },
  { label: "Registration fee paid", detail: "$49", status: "completed" },
  { label: "Compliance site published", detail: null, link: { text: "View site \u2192", href: "#" }, status: "completed" },
  { label: "Carrier review", detail: "Approved Mar 31", status: "completed" },
  { label: "Phone number assigned", detail: "+1 (555) 867-5309", status: "completed" },
  { label: "Live", detail: "Mar 31", status: "completed" },
];

const CHANGES_REQUESTED_STEPS: StepperStep[] = [
  { label: "Registration submitted", detail: "Mar 17", status: "completed" },
  { label: "Registration fee paid", detail: "$49", status: "completed" },
  { label: "Compliance site published", detail: null, link: { text: "View site \u2192", href: "#" }, status: "completed" },
  { label: "Carrier review", detail: "Changes requested Mar 22", status: "completed" },
  { label: "Resubmission under review", detail: "Updated and resubmitted Mar 24. Carriers re-reviewing.", status: "active" },
  { label: "Phone number assigned", detail: null, status: "upcoming" },
  { label: "Live", detail: null, status: "upcoming" },
];

const REJECTED_STEPS: StepperStep[] = [
  { label: "Registration submitted", detail: "Mar 17", status: "completed" },
  { label: "Registration fee refunded", detail: "$49 refunded", detailClass: "text-text-success-primary", status: "completed" },
  { label: "Compliance site published", detail: null, link: { text: "View site \u2192", href: "#" }, status: "completed" },
  { label: "Carrier review", detail: "Not approved Mar 28", status: "error" },
];

function RegistrationStepper({ steps }: { steps: StepperStep[] }) {

  return (
    <div className="space-y-0">
      {steps.map((step, i) => (
        <div key={step.label} className="flex gap-3">
          {/* Icon column */}
          <div className="flex flex-col items-center">
            {step.status === "completed" ? (
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-bg-success-secondary shrink-0">
                <svg className="size-3.5 text-fg-success-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            ) : step.status === "error" ? (
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-bg-error-secondary shrink-0">
                <svg className="size-3.5 text-fg-error-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </div>
            ) : step.status === "active" ? (
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-bg-brand-secondary shrink-0">
                <div className="w-2 h-2 rounded-full bg-fg-brand-primary" />
              </div>
            ) : (
              <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-border-secondary shrink-0" />
            )}
            {i < steps.length - 1 && (
              <div className={`w-px flex-1 min-h-[16px] ${step.status === "completed" || step.status === "error" ? "bg-fg-success-secondary" : "bg-border-secondary"}`} />
            )}
          </div>
          {/* Content */}
          <div className="pb-4">
            <span className={`text-sm font-medium leading-6 ${
              step.status === "error" ? "text-text-error-primary" :
              step.status === "completed" ? "text-text-tertiary" :
              step.status === "active" ? "text-text-primary" :
              "text-text-quaternary"
            }`}>
              {step.label}
            </span>
            {step.detail && (
              <p className={`mt-0.5 text-sm leading-relaxed ${step.detailClass ? step.detailClass : step.status === "active" ? "text-text-secondary" : "text-text-tertiary"}`}>
                {step.detail}
              </p>
            )}
            {step.link && (
              <Link href={step.link.href} className="ml-2 inline-block text-sm font-medium text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear">
                {step.link.text}
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Page ── */

export default function OverviewPage() {
  const { appId } = useParams<{ appId: string }>();
  const { state: sessionState, setRegistrationState, setComplianceView, setAlertsEnabled } = useSession();
  const registrationState = sessionState.registrationState;
  const complianceView = sessionState.complianceView;
  const alertsEnabled = sessionState.alertsEnabled;
  const hasAlerts = complianceView === "has_alerts";

  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  // D-239: Wizard inline alerts card — shown once per session after step 1 completes
  const [alertsCardDismissed, setAlertsCardDismissed] = useState(false);
  const [alertsJustEnabled, setAlertsJustEnabled] = useState(false);
  const [redoingSteps, setRedoingSteps] = useState<Set<number>>(new Set());
  const [sectionOverrides, setSectionOverrides] = useState<Set<number>>(new Set());
  const [phone, setPhone] = useState("");
  const [phoneStep, setPhoneStep] = useState<"input" | "code" | "done">("input");
  const [otpCode, setOtpCode] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(TEST_MESSAGES[0].id);
  const [sendingTest, setSendingTest] = useState(false);
  const [testDelivered, setTestDelivered] = useState(false);
  const [selectedTool, setSelectedTool] = useState("claude-code");
  const [allDone, setAllDone] = useState(false);
  const [scriptExpanded, setScriptExpanded] = useState(false);
  const [troubleshootOpen, setTroubleshootOpen] = useState(false);
  const [sbDismissedItems, setSbDismissedItems] = useState<Set<string>>(new Set());
  const sbVisibleItems = SANDBOX_COMPLIANCE_ITEMS.filter((item) => !sbDismissedItems.has(item.id));
  // Track the phone number at the time each step was completed
  const [phoneAtStep2, setPhoneAtStep2] = useState("");
  const [phoneAtStep3, setPhoneAtStep3] = useState("");

  const isPending = registrationState === "pending";
  const isApproved = registrationState === "approved";
  const section1Complete = allDone || sectionOverrides.has(1);
  const isChangesRequested = registrationState === "changes_requested";
  const isRejected = registrationState === "rejected";
  const isInReview = isPending || isChangesRequested;

  function toggleSectionComplete(s: number) {
    setSectionOverrides((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  }

  // Auto-expand logic — only Section 1 remains
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([1]));

  // Keep Section 1 expanded by default
  useEffect(() => {
    setExpandedSections(new Set([1]));
  }, [registrationState]);

  function toggleSection(s: number) {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  }

  const displayPhone = phone || "(555) 123-4567";

  function getStepState(step: number): "locked" | "active" | "completed" {
    if (redoingSteps.has(step)) return "active";
    if (completedSteps.has(step)) return "completed";
    if (step === 1) return "active";
    if (completedSteps.has(step - 1)) return "active";
    return "locked";
  }

  function completeStep(step: number) {
    setCompletedSteps((prev) => new Set(prev).add(step));
    setRedoingSteps((prev) => { const n = new Set(prev); n.delete(step); return n; });
  }

  function redoStep(step: number) {
    setRedoingSteps((prev) => new Set(prev).add(step));
    // Reset transient UI state for the step
    if (step === 1) setPhoneStep("input");
    if (step === 2) { setTestDelivered(false); setSendingTest(false); }
    if (step === 3) { setScriptExpanded(false); setTroubleshootOpen(false); }
  }

  function handleVerifyPhone() {
    completeStep(1);
    setPhoneStep("done");
  }

  function handleSendTest() {
    setSendingTest(true);
    setTimeout(() => {
      setSendingTest(false);
      setTestDelivered(true);
      setTimeout(() => {
        completeStep(2);
        setPhoneAtStep2(phone);
      }, 800);
    }, 1200);
  }

  function handleCodeComplete() {
    completeStep(3);
    setPhoneAtStep3(phone);
  }

  // D-239: Enable alerts from wizard inline card
  function handleEnableAlerts() {
    setAlertsEnabled(true);
    setAlertsJustEnabled(true);
    setTimeout(() => {
      setAlertsCardDismissed(true);
      setAlertsJustEnabled(false);
    }, 3000);
  }

  function handleBuildComplete() {
    completeStep(4);
    setAllDone(true);
    // Auto-expand section 2 when section 1 completes
    setExpandedSections((prev) => {
      const next = new Set(prev);
      next.delete(1);
      next.add(2);
      return next;
    });
  }

  // Phone change warnings
  const step2PhoneChanged = completedSteps.has(2) && !redoingSteps.has(2) && phoneAtStep2 !== "" && phoneAtStep2 !== phone;
  const step3PhoneChanged = completedSteps.has(3) && !redoingSteps.has(3) && phoneAtStep3 !== "" && phoneAtStep3 !== phone;

  const selectedMsg = TEST_MESSAGES.find((m) => m.id === selectedMessage) || TEST_MESSAGES[0];

  return (
    <div>

      {/* Approved state: full dashboard replacement */}
      {isApproved ? (
        <ApprovedDashboard />
      ) : (
      <div className="flex flex-col md:flex-row gap-6 md:gap-16">
        {/* LEFT — Sections */}
        <div className="min-w-0 flex-1">

          {/* ════════════════════════════════════════════ */}
          {/* Sandbox compliance attention section (D-243)  */}
          {/* Only visible if developer has sent messages (mock: assume they have) */}
          {/* ════════════════════════════════════════════ */}
          {!isApproved && (
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-text-primary">Message compliance</h2>
                <div className="flex items-center gap-4">
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
                  {/* Toggle for prototype: all clear vs has issues */}
                  <select
                    value={hasAlerts ? "issues" : "clear"}
                    onChange={(e) => {
                      const view = e.target.value === "issues" ? "has_alerts" : "all_clear";
                      setComplianceView(view as "all_clear" | "has_alerts");
                    }}
                    className="text-xs text-text-tertiary bg-transparent border-none cursor-pointer focus:outline-none"
                  >
                    <option value="clear">All clear</option>
                    <option value="issues">Has issues</option>
                  </select>
                </div>
              </div>

              {hasAlerts && sbVisibleItems.length > 0 ? (
                <>
                  <p className="mt-1 text-sm text-text-tertiary">We scan for messages that carriers would flag. Fix these before you go live.</p>
                  <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {sbVisibleItems.map((item) => {
                      const sev = SANDBOX_SEVERITY_CONFIG[item.severity];
                      const label = sbComplianceItemLabel(item);
                      return (
                        <div key={item.id} className="relative rounded-xl border border-border-secondary bg-bg-primary px-5 pb-5 pt-8 flex flex-col">
                          {/* Badge — pinned top-right */}
                          <span className={`absolute top-4 right-4 ml-4 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${sev.bg} ${sev.text}`}>
                            {sev.label}
                          </span>

                          {/* Title */}
                          <span className="text-sm font-semibold text-text-primary pr-24">{label}</span>

                          {/* Reason */}
                          <p className="mt-2 text-sm text-text-tertiary">{item.explanation}</p>

                          {/* Severe: blocked status before message content */}
                          {item.severity === "severe" && (
                            <p className="mt-3 text-sm font-medium text-text-error-primary">Blocked &mdash; won&rsquo;t send live</p>
                          )}

                          {/* Original message block */}
                          <div className="mt-4 mb-3 rounded-lg bg-bg-error-primary p-3">
                            <p className="text-xs font-medium text-text-error-primary uppercase tracking-wide mb-2">Original</p>
                            <p className="text-sm text-text-secondary leading-relaxed">{item.originalMessage}</p>
                          </div>

                          {/* Adjusted block (minor/moderate only) */}
                          {item.severity !== "severe" && item.adjustedMessage && (
                            <div className="mb-3 rounded-lg bg-bg-success-primary p-3">
                              <p className="text-xs font-medium text-text-success-primary uppercase tracking-wide mb-2">Suggested</p>
                              <p className="text-sm text-text-secondary leading-relaxed">{item.adjustedMessage}</p>
                            </div>
                          )}

                          {/* Single CTA — right-aligned at bottom */}
                          <div className="mt-auto flex justify-end pt-3">
                            <button
                              type="button"
                              onClick={() => setSbDismissedItems((prev) => new Set(prev).add(item.id))}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-border-primary bg-bg-primary px-3 py-1.5 text-sm font-medium text-text-secondary hover:bg-bg-secondary transition duration-100 ease-linear cursor-pointer"
                            >
                              <SbCheckIcon className="text-fg-tertiary" />
                              Fixed in code
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <>
                  <p className="mt-1 text-sm text-text-tertiary">We scan messages and patch ones that carriers would flag.</p>
                  <div className="mt-6 flex flex-col items-center text-center py-6">
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
                    <h3 className="mt-4 text-xl font-semibold text-text-primary">Messages look good</h3>
                    {alertsEnabled ? (
                      <p className="mt-1 text-sm text-text-tertiary">No compliance issues. We&rsquo;ll text you if anything changes.</p>
                    ) : (
                      <>
                        <p className="mt-1 text-sm text-text-tertiary">No compliance issues.</p>
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
                </>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════ */}
          {/* SECTION 1: Build your SMS feature           */}
          {/* ════════════════════════════════════════════ */}
          <div className="border-b border-border-secondary">
            <SectionHeading title="Build your SMS feature" checked={section1Complete} expanded={expandedSections.has(1)} onToggle={() => toggleSection(1)} onCheckboxToggle={() => toggleSectionComplete(1)} />
            {expandedSections.has(1) && (
              <div className="pb-6 pl-4 pt-3">
                {/* ── STEP 1: Verify phone ── */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <StepCircle num={1} state={getStepState(1)} />
                    <StepConnector state={completedSteps.has(1) ? "completed" : "pending"} />
                  </div>
                  <div className="flex-1 pb-8">
                    {getStepState(1) === "completed" ? (
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-sm font-medium text-text-primary">Verified: +1 {displayPhone}</span>
                        <button type="button" onClick={() => redoStep(1)} className="text-sm text-text-tertiary hover:underline cursor-pointer">Redo</button>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-base font-semibold text-text-primary">Where should test messages go?</h3>
                        <p className="mt-1 text-sm text-text-tertiary">Your sandbox delivers to one phone number. Verify yours to start.</p>
                        {phoneStep === "input" && (
                          <div className="mt-4 flex items-center gap-2">
                            <div className="flex items-center rounded-lg border border-border-primary shadow-xs overflow-hidden">
                              <span className="px-3 py-2.5 text-sm text-text-tertiary bg-bg-secondary border-r border-border-primary">+1</span>
                              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 123-4567" className="px-3 py-2.5 text-sm text-text-primary placeholder:text-text-placeholder bg-bg-primary focus:outline-none w-44" />
                            </div>
                            <button type="button" onClick={() => { if (!phone.trim()) return; setPhoneStep("code"); }} className="rounded-lg bg-bg-brand-solid px-4 py-2.5 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover cursor-pointer shrink-0">Verify</button>
                          </div>
                        )}
                        {phoneStep === "code" && (
                          <div className="mt-4">
                            <p className="text-sm text-text-tertiary mb-3">We sent a code to <span className="font-medium text-text-secondary">+1 {displayPhone}</span></p>
                            <div className="flex items-end gap-3">
                              <OtpInput value={otpCode} onChange={setOtpCode} onComplete={handleVerifyPhone} />
                              <button type="button" onClick={handleVerifyPhone} className="rounded-lg bg-bg-brand-solid px-4 py-2.5 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover cursor-pointer shrink-0">Verify</button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* ── D-239: Wizard inline alerts card (between steps 1 & 2, sandbox default only) ── */}
                {!isInReview && !isApproved && !isRejected && completedSteps.has(1) && !alertsCardDismissed && !alertsEnabled && (
                  <div className="flex gap-4 -mt-3">
                    <div className="flex flex-col items-center w-8 shrink-0">
                      <div className="w-px flex-1 bg-fg-success-secondary" />
                    </div>
                    <div className="flex-1 pb-5">
                      <div className="rounded-xl bg-bg-brand-secondary px-4 py-3.5 flex items-center gap-3">
                        <svg className="size-5 text-fg-brand-primary shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                          <path d="M13.73 21a2 2 0 01-3.46 0" />
                        </svg>
                        <span className="flex-1 text-sm text-text-brand-secondary">We&rsquo;ll text you if a message would get flagged by carriers — before it causes problems</span>
                        <button
                          type="button"
                          onClick={handleEnableAlerts}
                          className="rounded-lg bg-bg-brand-solid px-3 py-1.5 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover cursor-pointer shrink-0"
                        >
                          Enable
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {/* D-239: Brief confirmation after enabling from wizard card */}
                {!isInReview && !isApproved && !isRejected && alertsJustEnabled && (
                  <div className="flex gap-4 -mt-3">
                    <div className="flex flex-col items-center w-8 shrink-0">
                      <div className="w-px flex-1 bg-fg-success-secondary" />
                    </div>
                    <div className="flex-1 pb-5">
                      <div className="rounded-xl bg-bg-success-secondary px-4 py-3.5 flex items-center gap-2">
                        <svg className="size-4 text-fg-success-primary shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span className="text-sm text-text-success-primary">Alerts on — we&rsquo;ll text {displayPhone}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── STEP 2: Send test message ── */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <StepCircle num={2} state={getStepState(2)} />
                    <StepConnector state={completedSteps.has(2) ? "completed" : "pending"} />
                  </div>
                  <div className="flex-1 pb-8">
                    {getStepState(2) === "completed" ? (
                      <div className="pt-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-text-primary">Test message sent</span>
                          <button type="button" onClick={() => redoStep(2)} className="text-sm text-text-tertiary hover:underline cursor-pointer">Redo</button>
                        </div>
                        {step2PhoneChanged && (
                          <div className="mt-2 rounded-md bg-bg-warning-secondary px-3 py-2 text-sm text-text-warning-primary">
                            Your verified number changed. Redo to send a test to +1 {displayPhone}.
                          </div>
                        )}
                      </div>
                    ) : getStepState(2) === "locked" ? (
                      <div className="pt-1">
                        <h3 className="text-base font-medium text-text-quaternary">Send a test message</h3>
                        <p className="mt-0.5 text-sm text-text-quaternary">Complete step 1 to unlock</p>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-base font-semibold text-text-primary">Send a test message</h3>
                        <p className="mt-1 text-sm text-text-tertiary">Pick one of your messages. We&#39;ll send it to your phone right now.</p>
                        <select
                          value={selectedMessage}
                          onChange={(e) => { setSelectedMessage(e.target.value); setTestDelivered(false); }}
                          className="mt-3 w-full rounded-lg border border-border-primary bg-bg-primary px-3 pr-8 py-2.5 text-sm text-text-primary shadow-xs focus:border-border-brand focus:outline-none cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23667085%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_0.75rem_center] bg-no-repeat"
                        >
                          {TEST_MESSAGES.map((m) => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                          ))}
                        </select>
                        <div className="mt-3 rounded-lg bg-bg-secondary p-3">
                          <p className="text-sm text-text-secondary leading-relaxed">
                            {selectedMsg.body.split(/(GlowStudio|Salon|March \d+, \d{4}|\d{1,2}:\d{2}\s*[AP]M|tomorrow|glowstudio\.com)/g).map((part, i) =>
                              /^(GlowStudio|Salon|March \d+, \d{4}|\d{1,2}:\d{2}\s*[AP]M|tomorrow|glowstudio\.com)$/.test(part)
                                ? <span key={i} className="font-semibold text-text-primary">{part}</span>
                                : part
                            )}
                          </p>
                        </div>
                        {testDelivered ? (
                          <div className="mt-3 flex items-center gap-2 text-sm font-medium text-fg-success-primary">
                            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                            Delivered
                          </div>
                        ) : (
                          <button type="button" onClick={handleSendTest} disabled={sendingTest} className="mt-3 rounded-lg bg-bg-brand-solid px-4 py-2.5 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover cursor-pointer disabled:opacity-50">
                            {sendingTest ? "Sending..." : "Send test"}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* ── STEP 3: Send from code ── */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <StepCircle num={3} state={getStepState(3)} />
                    <StepConnector state={completedSteps.has(3) ? "completed" : "pending"} />
                  </div>
                  <div className="flex-1 pb-8">
                    {getStepState(3) === "completed" ? (
                      <div className="pt-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-text-primary">Message sent from code</span>
                          <button type="button" onClick={() => redoStep(3)} className="text-sm text-text-tertiary hover:underline cursor-pointer">Redo</button>
                        </div>
                        {step3PhoneChanged && (
                          <div className="mt-2 rounded-md bg-bg-warning-secondary px-3 py-2 text-sm text-text-warning-primary">
                            Your verified number changed. Redo to update the script with +1 {displayPhone}.
                          </div>
                        )}
                      </div>
                    ) : getStepState(3) === "locked" ? (
                      <div className="pt-1">
                        <h3 className="text-base font-medium text-text-quaternary">Send a message from your code</h3>
                        <p className="mt-0.5 text-sm text-text-quaternary">Complete step 2 to unlock</p>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-base font-semibold text-text-primary">Now you send one</h3>
                        <p className="mt-1 text-sm text-text-tertiary">Copy this script, run it from your terminal, and your phone should buzz.</p>
                        {(() => {
                          const toNumber = phone ? `+1${phone.replace(/\D/g, "")}` : "+15551234567";
                          const msgBody = selectedMsg.body;
                          const fullScript = buildCodeSnippet(toNumber, msgBody);
                          const preview = getSnippetPreview();
                          const troubleshootPrompt = `I'm trying to run a Node.js script that sends an HTTP POST request but it's not working. Here's the script: [paste script]. Help me get it running.`;
                          return (
                            <>
                              <div className="mt-3 relative rounded-lg bg-bg-secondary p-4 pr-10">
                                <pre className="text-sm font-mono text-text-secondary whitespace-pre-wrap break-all leading-relaxed">{scriptExpanded ? fullScript : preview}</pre>
                                <BlockCopyButton text={fullScript} />
                                {!scriptExpanded && (
                                  <button
                                    type="button"
                                    onClick={() => setScriptExpanded(true)}
                                    className="mt-2 text-sm font-medium text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear cursor-pointer"
                                  >
                                    Show full script
                                  </button>
                                )}
                                {scriptExpanded && (
                                  <button
                                    type="button"
                                    onClick={() => setScriptExpanded(false)}
                                    className="mt-2 text-sm font-medium text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear cursor-pointer"
                                  >
                                    Show less
                                  </button>
                                )}
                              </div>
                              <div className="mt-3">
                                <button
                                  type="button"
                                  onClick={() => setTroubleshootOpen(!troubleshootOpen)}
                                  className="text-sm text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear cursor-pointer"
                                >
                                  Having trouble?
                                </button>
                                {troubleshootOpen && (
                                  <div className="mt-2">
                                    <p className="text-sm text-text-tertiary">Copy this into your AI coding tool:</p>
                                    <div className="mt-1.5 relative rounded-lg bg-bg-secondary p-3 pr-10">
                                      <p className="text-sm font-mono text-text-secondary leading-relaxed">{troubleshootPrompt}</p>
                                      <BlockCopyButton text={troubleshootPrompt} />
                                    </div>
                                  </div>
                                )}
                              </div>
                            </>
                          );
                        })()}
                        <button type="button" onClick={handleCodeComplete} className="mt-4 rounded-lg bg-bg-brand-solid px-4 py-2.5 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover cursor-pointer">
                          I got the message ✓
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── STEP 4: Build SMS feature ── */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <StepCircle num={4} state={getStepState(4)} />
                  </div>
                  <div className="flex-1 pb-4">
                    {(getStepState(4) === "completed" || section1Complete) && !redoingSteps.has(4) ? (
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-sm font-medium text-text-primary">SMS feature built</span>
                        <button type="button" onClick={() => redoStep(4)} className="text-sm text-text-tertiary hover:underline cursor-pointer">Redo</button>
                      </div>
                    ) : getStepState(4) === "locked" ? (
                      <div className="pt-1">
                        <h3 className="text-base font-medium text-text-quaternary">Build your full SMS feature</h3>
                        <p className="mt-0.5 text-sm text-text-quaternary">Complete step 3 to unlock</p>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-base font-semibold text-text-primary">Build your SMS feature</h3>
                        <p className="mt-1 text-sm text-text-tertiary">Hand two files to your AI coding tool. It handles the rest.</p>

                        {/* Tool selector row */}
                        <div className="mt-4 flex items-center gap-4 overflow-x-auto">
                          {TOOLS.map((tool) => {
                            const logoSrc = TOOL_LOGO_MAP[tool.id];
                            return (
                              <button
                                key={tool.id}
                                type="button"
                                onClick={() => setSelectedTool(tool.id)}
                                className={`flex flex-col items-center gap-1.5 min-w-[60px] cursor-pointer transition duration-100 ease-linear ${
                                  selectedTool === tool.id ? "opacity-100" : "opacity-60 hover:opacity-80"
                                }`}
                              >
                                <div className={`flex items-center justify-center w-11 h-11 rounded-full transition duration-100 ease-linear ${
                                  selectedTool === tool.id ? "border-2 border-brand-600" : "border border-[#999999]"
                                }`}>
                                  {logoSrc ? (
                                    <img src={logoSrc} alt={tool.id} className={`${tool.id === "windsurf" ? "w-[28px] h-[28px]" : "w-6 h-6"} object-contain`} draggable={false} />
                                  ) : (
                                    <svg className="w-5 h-5 text-text-quaternary" viewBox="0 0 24 24" fill="none"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                  )}
                                </div>
                                <span className={`text-[10px] font-medium whitespace-nowrap ${selectedTool === tool.id ? "text-text-primary" : "text-text-tertiary"}`}>{tool.label}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Per-tool instruction */}
                        <div className="mt-4">
                          <p className="text-sm font-semibold text-text-tertiary">{TOOL_INSTRUCTIONS[selectedTool].before}</p>
                          <div className="mt-2 relative rounded-lg bg-bg-secondary p-3 pr-10">
                            <code className="text-sm font-mono text-text-secondary">{TOOL_INSTRUCTIONS[selectedTool].prompt}</code>
                            <BlockCopyButton text={TOOL_INSTRUCTIONS[selectedTool].prompt} />
                          </div>
                        </div>

                        <p className="mt-3 text-sm text-text-tertiary">Your AI will ask you a few questions before it starts building. That&#39;s by design — the build spec includes a requirements conversation so it builds the right thing.</p>

                        <button type="button" onClick={handleBuildComplete} className="mt-4 rounded-lg bg-bg-brand-solid px-4 py-2.5 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover cursor-pointer">
                          I built it ✓
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT — Registration card */}
        <div id="registration-card" className="order-first md:order-last md:w-[280px] md:shrink-0">
          <div className="rounded-xl bg-gray-50 p-6 md:sticky md:top-20">
            {isApproved ? (
              <>
                {/* ── Approved state: completed status tracker ── */}
                <h3 className="text-base font-semibold text-text-primary">Registration status</h3>

                <div className="mt-3">
                  <SuccessBadge>Approved</SuccessBadge>
                </div>

                <div className="my-5 border-t border-border-secondary" />

                <RegistrationStepper steps={APPROVED_STEPS} />

                <p className="text-sm text-text-tertiary leading-relaxed">
                  Your messages are now delivered through carriers. Compliance monitoring is active — check the Monitor tab for message status.
                </p>

                <div className="my-5 border-t border-border-secondary" />

                <p className="text-sm font-semibold text-text-primary">Monthly plan</p>
                <p className="mt-1 text-sm text-text-secondary">$19/mo · 500 messages included</p>
                <p className="mt-0.5 text-sm text-text-tertiary">$15 per additional 1,000, auto-scaled</p>
              </>
            ) : isChangesRequested ? (
              <>
                {/* ── Changes Requested state: status tracker ── */}
                <h3 className="text-base font-semibold text-text-primary">Registration status</h3>

                <div className="mt-3">
                  <BrandBadge>Changes requested</BrandBadge>
                </div>

                <div className="mt-4 space-y-1">
                  <p className="text-sm font-semibold text-text-secondary">Submitted March 17, 2026 · Updated March 24, 2026</p>
                  <p className="text-sm text-text-tertiary">Resubmission typically reviewed within a few business days</p>
                </div>

                <div className="my-5 border-t border-border-secondary" />

                <RegistrationStepper steps={CHANGES_REQUESTED_STEPS} />

                <p className="text-sm text-text-tertiary leading-relaxed">
                  Questions? Reach out anytime — we can check status with carriers directly.
                </p>
                <a href="mailto:hello@relaykit.ai" className="mt-1 inline-block text-sm font-medium text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear">
                  hello@relaykit.ai
                </a>
              </>
            ) : isRejected ? (
              <>
                {/* ── Rejected state: status tracker ── */}
                <h3 className="text-base font-semibold text-text-primary">Registration status</h3>

                <div className="mt-3">
                  <ErrorBadge>Not approved</ErrorBadge>
                </div>

                <p className="mt-4 text-sm font-semibold text-text-success-primary">$49 refund issued March 28, 2026</p>

                <div className="my-5 border-t border-border-secondary" />

                <RegistrationStepper steps={REJECTED_STEPS} />

                <div className="mt-2">
                  <p className="text-sm font-medium text-text-primary">Ready to try again?</p>
                  <button
                    type="button"
                    onClick={() => setRegistrationState("default")}
                    className="mt-3 rounded-lg bg-bg-brand-solid px-5 py-2.5 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover cursor-pointer"
                  >
                    Start new registration
                  </button>
                </div>

                <div className="my-5 border-t border-border-secondary" />

                <p className="text-sm text-text-tertiary leading-relaxed">
                  Questions? We can review the carrier feedback with you.
                </p>
                <a href="mailto:hello@relaykit.ai" className="mt-1 inline-block text-sm font-medium text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear">
                  hello@relaykit.ai
                </a>
              </>
            ) : isPending ? (
              <>
                {/* ── Pending state: status tracker ── */}
                <h3 className="text-base font-semibold text-text-primary">Registration status</h3>

                <div className="mt-3">
                  <BrandBadge>Under carrier review</BrandBadge>
                </div>

                <div className="mt-4 space-y-1">
                  <p className="text-sm font-semibold text-text-secondary">Submitted March 17, 2026</p>
                  <p className="text-sm text-text-tertiary">Typically approved in a few days. We&#39;ll email you at <a href="mailto:jen@glowstudio.com" className="font-medium text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear">jen@glowstudio.com</a>.</p>
                </div>

                <div className="my-5 border-t border-border-secondary" />

                <RegistrationStepper steps={PENDING_STEPS} />

                <p className="text-sm text-text-tertiary leading-relaxed">
                  Questions? Reach out anytime — we can check status with carriers directly.
                </p>
                <a href="mailto:hello@relaykit.ai" className="mt-1 inline-block text-sm font-medium text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear">
                  hello@relaykit.ai
                </a>
              </>
            ) : (
              <>
                {/* ── Default state: calm registration reminder ── */}
                <h3 className="text-lg font-semibold text-text-primary">Ready to go live?</h3>

                <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                  Carrier registration takes a few days. Start now so you&apos;re live when your app is ready.
                </p>

                <p className="mt-4 text-sm font-semibold text-text-primary">$49 to submit, $150 + $19/mo after approval</p>
                <p className="mt-1 text-sm text-text-tertiary">Not approved? Full refund.</p>

                <Link
                  href={`/apps/${appId}/register`}
                  className="mt-5 inline-flex items-center rounded-lg bg-bg-brand-solid px-4 py-2.5 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover"
                >
                  Start registration &rarr;
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
