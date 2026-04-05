"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle } from "@untitledui/icons";
import { WizardStepShell } from "@/components/wizard-step-shell";
import { loadWizardData, saveWizardData } from "@/lib/wizard-storage";

/* ── Helpers ── */

function formatPhone(digits: string): string {
  const d = digits.replace(/\D/g, "").slice(0, 10);
  if (d.length === 0) return "";
  if (d.length <= 3) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

/* ── OTP input — 6 individual digit boxes (adapted from overview page) ── */

function OtpInput({
  value,
  onChange,
  onComplete,
}: {
  value: string;
  onChange: (v: string) => void;
  onComplete: () => void;
}) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(6, "").slice(0, 6).split("");

  useEffect(() => {
    // Autofocus the first box on mount
    inputRefs.current[0]?.focus();
  }, []);

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
          className="w-11 h-12 rounded-xl border border-border-primary bg-bg-primary text-center text-lg font-medium text-text-primary shadow-xs transition duration-100 ease-linear focus:border-border-brand focus:ring-2 focus:ring-border-brand/20 focus:outline-none"
          aria-label={`Digit ${i + 1} of 6`}
        />
      ))}
    </div>
  );
}

/* ── Page ── */

type PhoneStep = "input" | "sending" | "code" | "done";

export default function VerifyPage() {
  const [step, setStep] = useState<PhoneStep>("input");
  const [phoneDigits, setPhoneDigits] = useState("");
  const [otpCode, setOtpCode] = useState("");

  // Hydrate from sessionStorage — if a phone was previously verified, start in done state
  useEffect(() => {
    const data = loadWizardData();
    if (data.verifiedPhone) {
      setPhoneDigits(data.verifiedPhone);
      setStep("done");
    }
  }, []);

  const formatted = formatPhone(phoneDigits);
  const canContinue = step === "done";

  function handleSendCode() {
    const d = phoneDigits.replace(/\D/g, "");
    if (d.length !== 10) return;
    setStep("sending");
    setTimeout(() => setStep("code"), 1500);
  }

  function handleVerifyComplete() {
    setStep("done");
    saveWizardData({ verifiedPhone: phoneDigits });
  }

  function handleUseDifferent() {
    setOtpCode("");
    setStep("input");
  }

  function handleChange() {
    setOtpCode("");
    setStep("input");
    saveWizardData({ verifiedPhone: "" });
  }

  const digitsOnly = phoneDigits.replace(/\D/g, "");
  const canSend = digitsOnly.length === 10 && step === "input";

  return (
    <WizardStepShell
      backHref="/start/context"
      continueHref="/apps/glowstudio/messages"
      canContinue={canContinue}
    >
      <h1 className="text-2xl font-bold text-text-primary">
        Verify your phone number
      </h1>
      <p className="mt-2 text-sm text-text-tertiary">
        Your phone is your test device for messages.
      </p>

      <div className="mt-8">
        {(step === "input" || step === "sending") && (
          <div>
            <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-text-secondary">
              Phone number
            </label>
            <div className="flex items-start gap-2">
              <div className="flex flex-1 items-center rounded-lg border border-border-primary bg-bg-primary shadow-xs focus-within:border-border-brand focus-within:ring-2 focus-within:ring-border-brand/20 overflow-hidden">
                <span className="px-3 py-2.5 text-sm text-text-tertiary bg-bg-secondary border-r border-border-primary">
                  +1
                </span>
                <input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  autoFocus
                  value={formatted}
                  onChange={(e) => setPhoneDigits(e.target.value)}
                  placeholder="(555) 123-4567"
                  disabled={step === "sending"}
                  className="flex-1 px-3 py-2.5 text-sm text-text-primary placeholder:text-text-placeholder bg-bg-primary focus:outline-none disabled:bg-bg-secondary disabled:text-text-tertiary"
                />
              </div>
              <button
                type="button"
                onClick={handleSendCode}
                disabled={!canSend}
                className="rounded-lg bg-bg-brand-solid px-4 py-2.5 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover disabled:cursor-not-allowed disabled:bg-bg-disabled disabled:text-text-disabled cursor-pointer shrink-0"
              >
                {step === "sending" ? "Sending…" : "Send code"}
              </button>
            </div>
          </div>
        )}

        {step === "code" && (
          <div>
            <p className="text-sm text-text-tertiary mb-4">
              We sent a code to{" "}
              <span className="font-medium text-text-secondary">+1 {formatted}</span>
            </p>
            <OtpInput value={otpCode} onChange={setOtpCode} onComplete={handleVerifyComplete} />
            <button
              type="button"
              onClick={handleUseDifferent}
              className="mt-4 text-sm text-text-tertiary hover:text-text-secondary hover:underline transition duration-100 ease-linear cursor-pointer"
            >
              Use a different number
            </button>
            <p className="mt-2 text-xs text-text-quaternary">
              (Prototype: any 6 digits will work)
            </p>
          </div>
        )}

        {step === "done" && (
          <div className="flex items-center gap-3 rounded-lg border border-border-secondary bg-bg-secondary px-4 py-3">
            <CheckCircle className="size-5 text-fg-success-primary shrink-0" />
            <span className="flex-1 text-sm font-medium text-text-primary">
              Verified · +1 {formatted}
            </span>
            <button
              type="button"
              onClick={handleChange}
              className="text-sm text-text-tertiary hover:text-text-secondary hover:underline transition duration-100 ease-linear cursor-pointer"
            >
              Change
            </button>
          </div>
        )}
      </div>
    </WizardStepShell>
  );
}
