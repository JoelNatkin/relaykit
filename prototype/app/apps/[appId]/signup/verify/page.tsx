"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "@untitledui/icons";
import { useSession } from "@/context/session-context";

const SIGNUP_EMAIL_KEY = "relaykit_signup_email";

/* ── OTP input — 6 digit boxes that fill available width ── */

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
    <div className="flex gap-4">
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
          className="min-w-0 flex-1 h-14 rounded-xl border border-border-primary bg-bg-primary text-center text-lg font-medium text-text-primary shadow-xs transition duration-100 ease-linear focus:border-border-brand focus:ring-2 focus:ring-border-brand/20 focus:outline-none"
          aria-label={`Digit ${i + 1} of 6`}
        />
      ))}
    </div>
  );
}

/* ── Page ── */

export default function SignupVerifyPage() {
  const router = useRouter();
  const { appId } = useParams<{ appId: string }>();
  const { state } = useSession();

  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [resendCooldown, setResendCooldown] = useState(60);

  // Redirect to overview if not in wizard state
  useEffect(() => {
    if (state.registrationState !== "onboarding") {
      router.replace(`/apps/${appId}/overview`);
    }
  }, [state.registrationState, appId, router]);

  // Read email from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem(SIGNUP_EMAIL_KEY);
    if (stored) setEmail(stored);
  }, []);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  function handleVerifyComplete() {
    router.push(`/apps/${appId}/get-started`);
  }

  function handleConfirm() {
    if (otpCode.replace(/\D/g, "").length === 6) {
      handleVerifyComplete();
    }
  }

  function handleResend() {
    setOtpCode("");
    setResendCooldown(60);
  }

  return (
    <div className="mx-auto max-w-[400px]">
      {/* Back link — inline, same pattern as /start/* pages */}
      <div className="mb-10 h-5">
        <Link
          href={`/apps/${appId}/signup`}
          className="inline-flex items-center gap-1.5 text-sm text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear"
        >
          <ArrowLeft className="size-4" />
          Back
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-text-primary">
        Check your email
      </h1>
      <p className="mt-2 text-sm text-text-tertiary">
        We sent a code to{" "}
        <span className="font-medium text-text-secondary">{email}</span>
      </p>

      <div className="mt-8">
        <OtpInput
          value={otpCode}
          onChange={setOtpCode}
          onComplete={handleVerifyComplete}
        />
      </div>

      {/* Full-width Confirm button */}
      <button
        type="button"
        onClick={handleConfirm}
        className="mt-10 w-full rounded-lg bg-bg-brand-solid px-5 py-2.5 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover cursor-pointer"
      >
        Confirm
      </button>

      {/* Resend code link */}
      <div className="mt-4 text-center">
        {resendCooldown > 0 ? (
          <span className="text-sm text-text-quaternary">
            Resend code in {resendCooldown}s
          </span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            className="text-sm text-text-tertiary hover:text-text-secondary hover:underline transition duration-100 ease-linear cursor-pointer"
          >
            Resend code
          </button>
        )}
      </div>
    </div>
  );
}
