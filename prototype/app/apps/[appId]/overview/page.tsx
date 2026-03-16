"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "@untitledui/icons";

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
    <div className={`w-px h-6 ml-[15px] ${state === "completed" ? "bg-fg-success-secondary" : "bg-border-secondary"}`} />
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
    before: "Download RelayKit, drop both files in your project root. Then run:",
    prompt: 'claude "Build my SMS integration using SMS_BUILD_SPEC.md and SMS_GUIDELINES.md"',
  },
  cursor: {
    before: "Download RelayKit, drop both files in your project root. Open Composer:",
    prompt: "Build my SMS integration using SMS_BUILD_SPEC.md and SMS_GUIDELINES.md",
  },
  windsurf: {
    before: "Download RelayKit, drop both files in your project root. Open Cascade:",
    prompt: "Build my SMS integration using SMS_BUILD_SPEC.md and SMS_GUIDELINES.md",
  },
  copilot: {
    before: "Download RelayKit, drop both files in your project root. Open Copilot Chat:",
    prompt: "Build my SMS integration using SMS_BUILD_SPEC.md and SMS_GUIDELINES.md",
  },
  cline: {
    before: "Download RelayKit, drop both files in your project root. Open Cline:",
    prompt: "Build my SMS integration using SMS_BUILD_SPEC.md and SMS_GUIDELINES.md",
  },
  other: {
    before: "Download RelayKit, drop both files in your project root. Tell your AI coding tool:",
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

const CODE_SNIPPET = `const response = await fetch("https://api.relaykit.dev/v1/messages", {
  method: "POST",
  headers: {
    "Authorization": "Bearer ${API_KEY}",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    to: "+15551234567",
    body: "GlowStudio: Reminder — your Salon appointment is tomorrow at 2:30 PM. Reply STOP to opt out."
  })
});
const data = await response.json();
console.log(data.status);`;

/* ── Page ── */

export default function OverviewPage() {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [phone, setPhone] = useState("");
  const [phoneStep, setPhoneStep] = useState<"input" | "code" | "done">("input");
  const [otpCode, setOtpCode] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(TEST_MESSAGES[0].id);
  const [sendingTest, setSendingTest] = useState(false);
  const [testDelivered, setTestDelivered] = useState(false);
  const [selectedTool, setSelectedTool] = useState("claude-code");
  const [allDone, setAllDone] = useState(false);

  const displayPhone = phone || "(555) 123-4567";

  function getStepState(step: number): "locked" | "active" | "completed" {
    if (completedSteps.has(step)) return "completed";
    if (step === 1) return "active";
    if (completedSteps.has(step - 1)) return "active";
    return "locked";
  }

  function completeStep(step: number) {
    setCompletedSteps((prev) => new Set(prev).add(step));
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
      setTimeout(() => completeStep(2), 800);
    }, 1200);
  }

  function handleCodeComplete() {
    completeStep(3);
  }

  function handleBuildComplete() {
    completeStep(4);
    setAllDone(true);
  }

  const stepsCompleted = completedSteps.size;
  const selectedMsg = TEST_MESSAGES.find((m) => m.id === selectedMessage) || TEST_MESSAGES[0];

  return (
    <div>
      {/* Project header */}
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-xl font-semibold text-text-primary">GlowStudio</h1>
        <span className="inline-flex items-center rounded-full bg-bg-secondary px-2.5 py-0.5 text-xs font-medium text-text-tertiary">
          Appointments
        </span>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* LEFT — Steps */}
        <div className="lg:col-span-3">
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
                  <button type="button" onClick={() => { setCompletedSteps((p) => { const n = new Set(p); n.delete(1); n.delete(2); n.delete(3); n.delete(4); return n; }); setPhoneStep("input"); setTestDelivered(false); setAllDone(false); }} className="text-sm text-text-tertiary hover:underline cursor-pointer">Change</button>
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
                <p className="text-sm font-medium text-text-primary pt-1">Test message sent</p>
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
                    className="mt-3 w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2.5 text-sm text-text-primary shadow-xs focus:border-border-brand focus:outline-none cursor-pointer"
                  >
                    {TEST_MESSAGES.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                  <div className="mt-3 rounded-lg bg-bg-secondary p-3">
                    <p className="text-sm text-text-secondary leading-relaxed">{selectedMsg.body}</p>
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
                <p className="text-sm font-medium text-text-primary pt-1">Message sent from code</p>
              ) : getStepState(3) === "locked" ? (
                <div className="pt-1">
                  <h3 className="text-base font-medium text-text-quaternary">Send a message from your code</h3>
                  <p className="mt-0.5 text-sm text-text-quaternary">Complete step 2 to unlock</p>
                </div>
              ) : (
                <div>
                  <h3 className="text-base font-semibold text-text-primary">Now you send one</h3>
                  <p className="mt-1 text-sm text-text-tertiary">Copy this script, save it as test-sms.js, and run <code className="font-mono text-text-secondary">node test-sms.js</code> in your terminal.</p>
                  <div className="mt-3 relative rounded-lg bg-bg-secondary p-4 pr-10">
                    <pre className="text-sm font-mono text-text-secondary whitespace-pre-wrap break-all leading-relaxed">{CODE_SNIPPET}</pre>
                    <BlockCopyButton text={CODE_SNIPPET} />
                  </div>
                  <p className="mt-2 text-sm text-text-tertiary">When your terminal prints &#39;queued&#39; and your phone buzzes, you&#39;re ready for the next step.</p>
                  <button type="button" onClick={handleCodeComplete} className="mt-3 rounded-lg border border-border-primary bg-bg-primary px-4 py-2 text-sm font-medium text-text-secondary transition duration-100 ease-linear hover:bg-bg-primary_hover cursor-pointer">
                    I sent it ✓
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
              {getStepState(4) === "completed" ? (
                <div>
                  <p className="text-sm font-medium text-text-primary pt-1">SMS feature built</p>
                  {allDone && (
                    <div className="mt-6 py-6 text-center">
                      <p className="text-lg font-semibold text-text-primary">You built it. It works. Now let&#39;s make it real.</p>
                      <p className="mt-2 text-sm text-text-tertiary">Start carrier registration so your messages reach real users.</p>
                      <Link href="/apps/glowstudio/registration" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-bg-brand-solid px-5 py-2.5 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover">
                        Start registration
                        <ArrowRight className="size-4" />
                      </Link>
                    </div>
                  )}
                </div>
              ) : getStepState(4) === "locked" ? (
                <div className="pt-1">
                  <h3 className="text-base font-medium text-text-quaternary">Build your full SMS feature</h3>
                  <p className="mt-0.5 text-sm text-text-quaternary">Complete step 3 to unlock</p>
                </div>
              ) : (
                <div>
                  <h3 className="text-base font-semibold text-text-primary">Build your SMS feature</h3>
                  <p className="mt-1 text-sm text-text-tertiary">Your downloaded files guide your AI coding tool through the entire build — what to ask you, what to build, what compliance rules to follow.</p>

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

                  <button type="button" onClick={handleBuildComplete} className="mt-4 rounded-lg border border-border-primary bg-bg-primary px-4 py-2 text-sm font-medium text-text-secondary transition duration-100 ease-linear hover:bg-bg-primary_hover cursor-pointer">
                    I built it ✓
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT — Registration card */}
        <div className="lg:col-span-2 order-first lg:order-last">
          <div className="rounded-lg bg-bg-brand-section_subtle border border-border-brand_alt p-6 lg:sticky lg:top-20">
            <h3 className="text-lg font-semibold text-text-primary">Go live with real users</h3>
            <p className="mt-1.5 text-sm text-text-tertiary">Carrier registration takes 2–3 weeks. Start now so you&#39;re live when your app is ready.</p>

            <div className="my-5 border-t border-border-brand_alt" />

            <ul className="space-y-2.5">
              {[
                "Dedicated phone number for your app",
                "Carrier-approved 10DLC registration",
                "Compliance monitoring and drift detection",
                "500 messages included per month",
                "Auto-scaling: $15 per 1,000 additional messages",
                "Same API, same code — just swap your key",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                  <svg className="mt-0.5 size-4 shrink-0 text-fg-brand-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>

            <div className="my-5 border-t border-border-brand_alt" />

            <div>
              <p className="text-base font-semibold text-text-primary">$199 one-time setup</p>
              <p className="text-sm text-text-tertiary">then $19/mo</p>
              <p className="mt-2 text-sm text-text-tertiary">Not approved? Full refund.</p>
            </div>

            <Link
              href="/apps/glowstudio/registration"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-bg-brand-solid px-4 py-2.5 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover"
            >
              Start registration
              <ArrowRight className="size-4" />
            </Link>

            <div className="my-5 border-t border-border-brand_alt" />

            {/* Progress indicator */}
            <div>
              <p className="text-xs font-medium text-text-tertiary mb-2">Setup progress: {stepsCompleted} of 4 complete</p>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map((s) => (
                  <div key={s} className={`h-1.5 flex-1 rounded-full transition duration-200 ease-linear ${completedSteps.has(s) ? "bg-fg-success-primary" : "bg-border-secondary"}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
