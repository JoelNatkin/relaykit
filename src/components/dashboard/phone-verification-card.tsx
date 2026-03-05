"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/base/buttons/button";
import { CheckCircle } from "@untitledui/icons";
import { useDashboard } from "./dashboard-context";

type Step = "input" | "code" | "verified";

export function PhoneVerificationCard() {
  const { phoneVerified, verifiedPhone: initialPhone } = useDashboard();

  const [step, setStep] = useState<Step>(phoneVerified ? "verified" : "input");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [verifiedPhone, setVerifiedPhone] = useState<string | null>(
    initialPhone,
  );
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  // Cooldown timer for resend
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  function formatPhoneInput(value: string): string {
    const digits = value.replace(/\D/g, "");
    const cleaned = digits.startsWith("1") ? digits.slice(1) : digits;
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6)
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  }

  function toE164(formatted: string): string {
    const digits = formatted.replace(/\D/g, "");
    const cleaned = digits.startsWith("1") ? digits.slice(1) : digits;
    return `+1${cleaned}`;
  }

  function formatVerifiedPhone(e164: string): string {
    const digits = e164.replace(/\D/g, "");
    const local = digits.startsWith("1") ? digits.slice(1) : digits;
    return `(${local.slice(0, 3)}) ${local.slice(3, 6)}-${local.slice(6)}`;
  }

  async function handleSendCode() {
    setError(null);
    setIsSending(true);
    try {
      const e164 = toE164(phone);
      const res = await fetch("/api/phone-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: e164 }),
      });

      if (res.ok) {
        setStep("code");
        setCooldown(60);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to send code");
      }
    } finally {
      setIsSending(false);
    }
  }

  async function handleVerify() {
    setError(null);
    setIsVerifying(true);
    try {
      const e164 = toE164(phone);
      const res = await fetch("/api/phone-verify", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: e164, code }),
      });

      if (res.ok) {
        const data = await res.json();
        setVerifiedPhone(data.phone);
        setStep("verified");
      } else {
        const data = await res.json();
        setError(data.error || "Verification failed");
      }
    } finally {
      setIsVerifying(false);
    }
  }

  async function handleResend() {
    if (cooldown > 0) return;
    await handleSendCode();
  }

  const phoneDigits = phone.replace(/\D/g, "");
  const isPhoneValid =
    phoneDigits.length === 10 ||
    (phoneDigits.length === 11 && phoneDigits.startsWith("1"));

  // Verified state — collapsed one-liner
  if (step === "verified" && verifiedPhone) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-secondary bg-primary px-5 py-3">
        <CheckCircle className="size-5 text-fg-success-primary" />
        <p className="text-sm font-medium text-primary">
          Verified: {formatVerifiedPhone(verifiedPhone)}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-secondary bg-primary p-5">
      <h3 className="text-sm font-semibold text-primary">
        Verify your phone number
      </h3>
      <p className="mt-1 text-sm text-tertiary">
        Your sandbox sends to one phone number. Verify yours to start testing.
      </p>

      {error && <p className="mt-2 text-sm text-error-primary">{error}</p>}

      {step === "input" && (
        <div className="mt-3 flex items-end gap-2">
          <div className="flex-1">
            <label className="mb-1.5 block text-sm font-medium text-secondary">
              Phone
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-tertiary">+1</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
                placeholder="(555) 123-4567"
                className="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary shadow-xs ring-1 ring-primary ring-inset placeholder:text-placeholder focus:ring-2 focus:ring-brand focus:outline-none"
              />
            </div>
          </div>
          <Button
            size="sm"
            color="primary"
            onClick={handleSendCode}
            isLoading={isSending}
            showTextWhileLoading
            isDisabled={!isPhoneValid}
          >
            Send code
          </Button>
        </div>
      )}

      {step === "code" && (
        <div className="mt-3 space-y-3">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="mb-1.5 block text-sm font-medium text-secondary">
                Code
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="000000"
                maxLength={6}
                className="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary shadow-xs ring-1 ring-primary ring-inset placeholder:text-placeholder focus:ring-2 focus:ring-brand focus:outline-none"
              />
            </div>
            <Button
              size="sm"
              color="primary"
              onClick={handleVerify}
              isLoading={isVerifying}
              showTextWhileLoading
              isDisabled={code.length !== 6}
            >
              Verify
            </Button>
          </div>
          <p className="text-sm text-tertiary">
            {"Didn't receive it? "}
            {cooldown > 0 ? (
              <span className="text-quaternary">Resend in {cooldown}s</span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="text-brand-secondary transition duration-100 ease-linear hover:text-brand-secondary_hover"
              >
                Resend
              </button>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
