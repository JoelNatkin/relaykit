"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowRight, MessageXCircle, ClipboardCheck, ShieldTick, BellRinging03, MessageCheckCircle, SlashCircle01, SearchRefraction, AlertTriangle } from "@untitledui/icons";

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

/* ── Section checkbox ── */

function SectionCheckbox({ checked }: { checked: boolean }) {
  if (checked) {
    return (
      <div className="flex items-center justify-center w-5 h-5 rounded border-2 border-fg-success-primary bg-bg-success-secondary shrink-0">
        <svg className="size-3 text-fg-success-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
    );
  }
  return (
    <div className="w-5 h-5 rounded border-2 border-border-primary shrink-0" />
  );
}

/* ── Section heading row ── */

function SectionHeading({ title, checked, expanded, onToggle, onCheckboxToggle }: { title: string; checked: boolean; expanded: boolean; onToggle: () => void; onCheckboxToggle?: () => void }) {
  return (
    <div className="flex items-center gap-3 py-3">
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onCheckboxToggle?.(); }}
        className="cursor-pointer"
      >
        <SectionCheckbox checked={checked} />
      </button>
      <button
        type="button"
        onClick={onToggle}
        className="flex-1 flex items-center gap-3 cursor-pointer group"
      >
        <span className={`text-base font-semibold ${checked ? "text-text-secondary" : "text-text-primary"}`}>{title}</span>
        <svg
          className={`ml-auto size-4 text-text-tertiary transition duration-150 ease-linear group-hover:text-text-secondary ${expanded ? "rotate-180" : ""}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    </div>
  );
}

/* ── Page ── */

export default function OverviewPage() {
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
  // Track the phone number at the time each step was completed
  const [phoneAtStep2, setPhoneAtStep2] = useState("");
  const [phoneAtStep3, setPhoneAtStep3] = useState("");

  const section1Complete = allDone || sectionOverrides.has(1);
  const section2Complete = sectionOverrides.has(2);
  const section3Complete = sectionOverrides.has(3);

  function toggleSectionComplete(s: number) {
    setSectionOverrides((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  }

  // Auto-expand: first incomplete section, or section 1 if all complete
  const defaultExpanded = !section1Complete ? 1 : !section2Complete ? 2 : !section3Complete ? 3 : 1;
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([defaultExpanded]));

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
      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* LEFT — Sections */}
        <div className="lg:col-span-3">

          {/* ════════════════════════════════════════════ */}
          {/* SECTION 1: Build your SMS feature           */}
          {/* ════════════════════════════════════════════ */}
          <div className="border-b border-border-secondary">
            <SectionHeading title="Build your SMS feature" checked={section1Complete} expanded={expandedSections.has(1)} onToggle={() => toggleSection(1)} onCheckboxToggle={() => toggleSectionComplete(1)} />
            {expandedSections.has(1) && (
              <div className="pb-6 pl-8">
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

          {/* ════════════════════════════════════════════ */}
          {/* SECTION 2: Register your app                */}
          {/* ════════════════════════════════════════════ */}
          <div className="border-b border-border-secondary">
            <SectionHeading title="Register your app" checked={section2Complete} expanded={expandedSections.has(2)} onToggle={() => toggleSection(2)} onCheckboxToggle={() => toggleSectionComplete(2)} />
            {expandedSections.has(2) && (
              <div className="pb-6 pl-8">
                {/* Section intro */}
                <h3 className="text-lg font-bold text-text-primary">Real SMS requires registration. We make it painless.</h3>
                <p className="mt-3 text-sm text-text-secondary leading-relaxed">
                  Carriers require every app that sends text messages to be registered before they&#39;ll deliver them. It&#39;s a process most developers have never heard of — and the reason most apps don&#39;t have SMS. RelayKit handles the entire registration so you can focus on building.
                </p>

                {/* 2x2 card grid */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Card 1 */}
                  <div className="rounded-lg border border-border-secondary bg-bg-primary p-4">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-bg-brand-secondary mb-3">
                      <MessageXCircle className="size-5 text-fg-brand-primary" />
                    </div>
                    <h4 className="text-sm font-semibold text-text-primary">Without it, messages don&#39;t arrive</h4>
                    <p className="mt-1.5 text-sm text-text-tertiary leading-relaxed">Carriers filter unregistered SMS traffic automatically. Your sandbox works fine, but production messages get throttled, blocked, or silently dropped.</p>
                  </div>

                  {/* Card 2 */}
                  <div className="rounded-lg border border-border-secondary bg-bg-primary p-4">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-bg-brand-secondary mb-3">
                      <ClipboardCheck className="size-5 text-fg-brand-primary" />
                    </div>
                    <h4 className="text-sm font-semibold text-text-primary">The process is a hassle</h4>
                    <p className="mt-1.5 text-sm text-text-tertiary leading-relaxed">Carrier portals, campaign vetting forms, compliance documentation, and a 2–3 week review cycle. It&#39;s not hard — it&#39;s just tedious enough that most people don&#39;t bother.</p>
                  </div>

                  {/* Card 3 */}
                  <div className="rounded-lg border border-border-secondary bg-bg-primary p-4">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-bg-brand-secondary mb-3">
                      <ShieldTick className="size-5 text-fg-brand-primary" />
                    </div>
                    <h4 className="text-sm font-semibold text-text-primary">We handle the whole thing</h4>
                    <p className="mt-1.5 text-sm text-text-tertiary leading-relaxed">Brand verification, campaign submission, compliance site, carrier follow-up. You answer a few questions, we take care of the rest — and you keep building while carriers review.</p>
                  </div>

                  {/* Card 4 */}
                  <div className="rounded-lg border border-border-secondary bg-bg-primary p-4">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-bg-brand-secondary mb-3">
                      <BellRinging03 className="size-5 text-fg-brand-primary" />
                    </div>
                    <h4 className="text-sm font-semibold text-text-primary">You stay protected after approval</h4>
                    <p className="mt-1.5 text-sm text-text-tertiary leading-relaxed">Once you&#39;re live, we monitor your messages for compliance drift and handle opt-outs automatically. If something needs attention, you hear about it before carriers do.</p>
                  </div>
                </div>

                {/* No-pressure note */}
                <p className="mt-6 text-sm text-text-tertiary leading-relaxed">
                  Not ready? No worries. Your sandbox works indefinitely — same API, same code, no expiration.
                </p>
              </div>
            )}
          </div>

          {/* ════════════════════════════════════════════ */}
          {/* SECTION 3: Monitor your compliance          */}
          {/* ════════════════════════════════════════════ */}
          <div>
            <SectionHeading title="Monitor your compliance" checked={section3Complete} expanded={expandedSections.has(3)} onToggle={() => toggleSection(3)} onCheckboxToggle={() => toggleSectionComplete(3)} />
            {expandedSections.has(3) && (
              <div className="pb-6 pl-8">
                {/* Section intro */}
                <h3 className="text-lg font-bold text-text-primary">Your messages keep delivering. We make sure of it.</h3>
                <p className="mt-3 text-sm text-text-secondary leading-relaxed">
                  RelayKit checks every message before it reaches the carrier, watches for problems after delivery, and alerts you when something needs attention — before carriers do. Every compliance feature is included. No paid tiers. No add-ons.
                </p>

                {/* 2x2 card grid */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Card 1 */}
                  <div className="rounded-lg border border-border-secondary bg-bg-primary p-4">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-bg-brand-secondary mb-3">
                      <MessageCheckCircle className="size-5 text-fg-brand-primary" />
                    </div>
                    <h4 className="text-sm font-semibold text-text-primary">Every message checked before sending</h4>
                    <p className="mt-1.5 text-sm text-text-tertiary leading-relaxed">We scan outbound messages against carrier rules automatically. If something would cause a problem, we catch it before it reaches your users — not after.</p>
                  </div>

                  {/* Card 2 */}
                  <div className="rounded-lg border border-border-secondary bg-bg-primary p-4">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-bg-brand-secondary mb-3">
                      <SlashCircle01 className="size-5 text-fg-brand-primary" />
                    </div>
                    <h4 className="text-sm font-semibold text-text-primary">Opt-outs handled for you</h4>
                    <p className="mt-1.5 text-sm text-text-tertiary leading-relaxed">When someone replies STOP, their number is blocked immediately — no code on your end. If you accidentally try to text them again, we block it and tell you why.</p>
                  </div>

                  {/* Card 3 */}
                  <div className="rounded-lg border border-border-secondary bg-bg-primary p-4">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-bg-brand-secondary mb-3">
                      <SearchRefraction className="size-5 text-fg-brand-primary" />
                    </div>
                    <h4 className="text-sm font-semibold text-text-primary">We notice when things drift</h4>
                    <p className="mt-1.5 text-sm text-text-tertiary leading-relaxed">As your app evolves, the messages it sends can gradually shift from what was originally approved. We spot this early and tell you what to fix — before carriers flag your number.</p>
                  </div>

                  {/* Card 4 */}
                  <div className="rounded-lg border border-border-secondary bg-bg-primary p-4">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-bg-brand-secondary mb-3">
                      <AlertTriangle className="size-5 text-fg-brand-primary" />
                    </div>
                    <h4 className="text-sm font-semibold text-text-primary">You&#39;ll know when something needs attention</h4>
                    <p className="mt-1.5 text-sm text-text-tertiary leading-relaxed">If we block a message or detect a problem, you hear about it — dashboard alerts, email, or text. No issues sitting quietly on a dashboard waiting for you to notice.</p>
                  </div>
                </div>

                {/* Footer note */}
                <p className="mt-6 text-sm text-text-tertiary leading-relaxed">
                  Compliance monitoring activates after carrier registration.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — Registration card */}
        <div className="lg:col-span-2 order-first lg:order-last">
          <div className="rounded-lg bg-bg-brand-section_subtle border border-border-secondary p-6 lg:sticky lg:top-20">
            {/* Heading */}
            <h3 className="text-base font-semibold text-text-primary">Register your app</h3>

            {/* Intro text */}
            <p className="mt-3 text-sm text-text-secondary leading-relaxed">
              Carriers require SMS registration. It&#39;s a bureaucratic headache. We handle all of it. <span className="font-semibold">Review takes 2–3 weeks.</span>
            </p>

            {/* CTA row */}
            <div className="mt-4 flex items-center gap-5">
              <Link
                href="#"
                className="inline-flex items-center gap-1 text-sm font-medium text-text-brand-secondary transition duration-100 ease-linear hover:text-text-brand-primary"
              >
                Learn more
                <ArrowRight className="size-3.5" />
              </Link>
              <Link
                href="/apps/glowstudio/registration"
                className="inline-flex items-center rounded-lg bg-bg-brand-solid px-5 py-2.5 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover"
              >
                Start registration
              </Link>
            </div>

            <div className="my-5 border-t border-border-secondary" />

            {/* Pricing */}
            <p className="text-lg font-bold text-text-primary">$199 one-time setup</p>
            <p className="mt-1 text-sm text-text-secondary">then $19/mo, includes 500 messages/month. $15 for every additional 1,000, auto scaled</p>
            <p className="mt-2 text-sm text-text-tertiary">Not approved? Full refund.</p>

            <div className="my-5 border-t border-border-secondary" />

            {/* We handle everything */}
            <h4 className="text-sm font-semibold text-text-primary mb-3">We handle everything</h4>
            <ul className="space-y-2.5">
              {[
                "Carrier registration paperwork",
                "Campaign vetting and submission",
                "Your own dedicated phone number",
                "Compliance monitoring after approval",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-text-secondary">
                  <svg className="mt-0.5 size-4 shrink-0 text-fg-brand-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>

            <div className="my-5 border-t border-border-secondary" />

            {/* Takes just a few minutes */}
            <h4 className="text-sm font-semibold text-text-primary mb-3">Takes just a few minutes</h4>
            <ul className="space-y-2.5">
              {[
                "Your business name",
                "EIN (or phone verification if you\u2019re a sole prop)",
                "A short description of what your app does",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-text-secondary">
                  <svg className="mt-0.5 size-4 shrink-0 text-fg-brand-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
