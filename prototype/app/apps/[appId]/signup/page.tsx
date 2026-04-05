"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle } from "@untitledui/icons";
import { useSession } from "@/context/session-context";
import { WizardContinueContext } from "@/components/wizard-layout";

/* ── OTP input — 6 individual digit boxes (adapted from overview + verify) ── */

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

type SignupStep = "email" | "sending" | "code" | "done";

function isValidEmail(email: string): boolean {
  // Loose client-side shape check — real validation happens on OTP send
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function SignupPage() {
  const router = useRouter();
  const { appId } = useParams<{ appId: string }>();
  const { setRegistrationState } = useSession();
  const setContinueOverride = useContext(WizardContinueContext);

  const [step, setStep] = useState<SignupStep>("email");
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [productUpdates, setProductUpdates] = useState(false);

  const trimmedEmail = email.trim();
  const canSend = isValidEmail(trimmedEmail) && step === "email";
  const canContinue = step === "done";

  // Register Continue button handler with WizardLayout header
  useEffect(() => {
    setContinueOverride({
      onClick: () => {
        if (!canContinue) return;
        setRegistrationState("pending");
        router.push(`/apps/${appId}/overview`);
      },
      disabled: !canContinue,
    });
    return () => setContinueOverride(null);
  }, [canContinue, appId, router, setRegistrationState, setContinueOverride]);

  function handleSendCode() {
    if (!canSend) return;
    setStep("sending");
    setTimeout(() => setStep("code"), 1500);
  }

  function handleVerifyComplete() {
    setStep("done");
  }

  function handleUseDifferent() {
    setOtpCode("");
    setStep("email");
  }

  function handleChange() {
    setOtpCode("");
    setStep("email");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary">
        Create your account
      </h1>
      <p className="mt-2 text-sm text-text-tertiary">
        Free while you build. $49 + $19/mo when you&apos;re ready for real delivery.
      </p>

      <div className="mt-8">
        {(step === "email" || step === "sending") && (
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-text-secondary">
              Email
            </label>
            <input
              id="email"
              type="email"
              inputMode="email"
              autoFocus
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              disabled={step === "sending"}
              className="w-full rounded-lg border border-border-primary bg-bg-primary px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-placeholder shadow-xs focus:border-border-brand focus:outline-none focus:ring-2 focus:ring-border-brand/20 disabled:bg-bg-secondary disabled:text-text-tertiary"
            />
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={handleSendCode}
                disabled={!canSend}
                className="rounded-lg bg-bg-brand-solid px-4 py-2.5 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover disabled:cursor-not-allowed disabled:bg-bg-disabled disabled:text-text-disabled cursor-pointer"
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
              <span className="font-medium text-text-secondary">{trimmedEmail}</span>
            </p>
            <OtpInput value={otpCode} onChange={setOtpCode} onComplete={handleVerifyComplete} />
            <button
              type="button"
              onClick={handleUseDifferent}
              className="mt-4 text-sm text-text-tertiary hover:text-text-secondary hover:underline transition duration-100 ease-linear cursor-pointer"
            >
              Use a different email
            </button>
            <p className="mt-2 text-xs text-text-quaternary">
              (Prototype: any 6 digits will work)
            </p>
          </div>
        )}

        {step === "done" && (
          <div>
            <div className="flex items-center gap-3 rounded-lg border border-border-secondary bg-bg-secondary px-4 py-3">
              <CheckCircle className="size-5 text-fg-success-primary shrink-0" />
              <span className="flex-1 text-sm font-medium text-text-primary">
                Email verified · {trimmedEmail}
              </span>
              <button
                type="button"
                onClick={handleChange}
                className="text-sm text-text-tertiary hover:text-text-secondary hover:underline transition duration-100 ease-linear cursor-pointer"
              >
                Change
              </button>
            </div>

            <label className="mt-6 flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
              <input
                type="checkbox"
                checked={productUpdates}
                onChange={(e) => setProductUpdates(e.target.checked)}
                className="h-4 w-4 flex-shrink-0 cursor-pointer accent-[color:var(--color-brand-600)]"
              />
              <span>Send me product updates</span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
