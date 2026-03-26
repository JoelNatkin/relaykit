"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSession } from "@/context/session-context";
import ApprovedDashboard from "./approved-dashboard";

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
  const { state: sessionState, setRegistrationState, setComplianceView } = useSession();
  const registrationState = sessionState.registrationState;
  const complianceView = sessionState.complianceView;
  const hasAlerts = complianceView === "has_alerts";

  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
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
  const [sandboxAlertDetail, setSandboxAlertDetail] = useState<number | null>(null);
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
      <div className="grid grid-cols-1 gap-6 md:gap-10 md:grid-cols-[1fr_320px]">
        {/* LEFT — Sections */}
        <div className="min-w-0 max-w-[560px]">

          {/* ════════════════════════════════════════════ */}
          {/* Sandbox compliance card (D-233)              */}
          {/* ════════════════════════════════════════════ */}
          {!isApproved && (
            <div className="mb-6 rounded-xl border border-border-secondary bg-bg-primary p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-text-tertiary uppercase tracking-wide">Compliance</p>
                {/* Toggle for prototype: all clear vs has issues */}
                <select
                  value={hasAlerts ? "issues" : "clear"}
                  onChange={(e) => {
                    const view = e.target.value === "issues" ? "has_alerts" : "all_clear";
                    // Uses the session context complianceView
                    setComplianceView(view as "all_clear" | "has_alerts");
                  }}
                  className="text-xs text-text-tertiary bg-transparent border-none cursor-pointer focus:outline-none"
                >
                  <option value="clear">All clear</option>
                  <option value="issues">Has issues</option>
                </select>
              </div>

              <div className="mt-3">
                {hasAlerts ? (
                  <>
                    <span className="text-3xl font-semibold text-text-warning-primary">97.2%</span>
                    <p className="mt-1 text-sm text-text-secondary">compliance rate</p>
                    <div className="mt-4 space-y-2.5">
                      <div className="flex items-start gap-2 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-fg-error-primary shrink-0 mt-1.5" />
                        <span className="text-text-secondary flex-1">Content blocked — promotional language in transactional message</span>
                        <button type="button" onClick={() => setSandboxAlertDetail(0)} className="text-text-brand-secondary font-medium shrink-0 cursor-pointer hover:text-text-brand-primary transition duration-100 ease-linear">Fix &rarr;</button>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-fg-warning-primary shrink-0 mt-1.5" />
                        <span className="text-text-secondary flex-1">Drift — appointment reminders missing specific details</span>
                        <button type="button" onClick={() => setSandboxAlertDetail(1)} className="text-text-brand-secondary font-medium shrink-0 cursor-pointer hover:text-text-brand-primary transition duration-100 ease-linear">Fix &rarr;</button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-3xl font-semibold text-text-success-primary">100%</span>
                    <p className="mt-1 text-sm text-text-secondary">compliance rate</p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-fg-success-primary" />
                      <span className="text-sm font-semibold text-text-success-primary">All clear</span>
                    </div>
                  </>
                )}
              </div>

              <p className="mt-4 text-xs text-text-tertiary">36 messages sent in sandbox</p>
            </div>
          )}

          {/* Sandbox compliance alert detail modal */}
          {sandboxAlertDetail !== null && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="w-full max-w-lg rounded-xl bg-bg-primary border border-border-secondary shadow-xl p-6">
                {sandboxAlertDetail === 0 ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center rounded-full bg-bg-error-secondary px-2.5 py-1 text-xs font-medium text-text-error-primary">Content blocked</span>
                      <button type="button" onClick={() => setSandboxAlertDetail(null)} className="text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear cursor-pointer">
                        <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                      </button>
                    </div>
                    <div className="mt-4 space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-text-primary">Your message:</p>
                        <div className="mt-1.5 rounded-lg bg-bg-secondary p-3">
                          <p className="text-sm font-mono text-text-secondary">GlowStudio: Book your next appointment this week and get 15% off! Visit glowstudio.com. Reply STOP to opt out.</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-primary">What triggered it:</p>
                        <p className="mt-1 text-sm text-text-secondary leading-relaxed">This message contains promotional language (&quot;15% off&quot;) which is outside your registered transactional use case. Promotional messages need a separate marketing campaign registration.</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-primary">What to do:</p>
                        <p className="mt-1 text-sm text-text-secondary leading-relaxed">
                          Remove promotional language from transactional messages, or register a marketing campaign to send promotional content.{" "}
                          <Link href={`/apps/${appId}/messages`} className="font-medium text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear">
                            View your messages &rarr;
                          </Link>
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center rounded-full bg-bg-warning-secondary px-2.5 py-1 text-xs font-medium text-text-warning-primary">Drift warning</span>
                      <button type="button" onClick={() => setSandboxAlertDetail(null)} className="text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear cursor-pointer">
                        <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                      </button>
                    </div>
                    <div className="mt-4 space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-text-primary">Your message:</p>
                        <div className="mt-1.5 rounded-lg bg-bg-secondary p-3">
                          <p className="text-sm font-mono text-text-secondary">Hey, your appointment is coming up soon! Don&#39;t miss it &#128522;</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-primary">What triggered it:</p>
                        <p className="mt-1 text-sm text-text-secondary leading-relaxed">This doesn&#39;t match your registered appointment reminder format. Registered messages include the specific service type, date, and time. Casual language and emoji increase the risk of carrier filtering.</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-primary">What to do:</p>
                        <p className="mt-1 text-sm text-text-secondary leading-relaxed">
                          Update your message template to include specific appointment details.{" "}
                          <Link href={`/apps/${appId}/messages`} className="font-medium text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear">
                            View your messages &rarr;
                          </Link>
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
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
        <div id="registration-card" className="order-first md:order-last">
          <div className="rounded-xl bg-bg-tertiary p-6 md:sticky md:top-20">
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
