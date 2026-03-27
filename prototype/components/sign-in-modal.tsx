"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/session-context";
import { Mail01 } from "@untitledui/icons";

type Step = "email" | "otp";

export function SignInModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { setLoggedIn } = useSession();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep("email");
      setEmail("");
      setOtp(["", "", "", "", "", ""]);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const handleComplete = useCallback(() => {
    setLoggedIn(true);
    onClose();
    router.push("/apps");
  }, [setLoggedIn, onClose, router]);

  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStep("otp");
    // Focus first OTP input after render
    setTimeout(() => otpRefs.current[0]?.focus(), 50);
  }

  function handleOtpChange(index: number, value: string) {
    // Only allow digits
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);

    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto-complete when all 6 filled
    if (digit && next.every((d) => d !== "")) {
      setTimeout(() => handleComplete(), 200);
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      next[i] = pasted[i];
    }
    setOtp(next);
    if (next.every((d) => d !== "")) {
      setTimeout(() => handleComplete(), 200);
    } else {
      otpRefs.current[pasted.length]?.focus();
    }
  }

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-bg-overlay transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center px-6">
        <div
          className="w-full max-w-md rounded-2xl bg-bg-primary p-8 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {step === "email" && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-bg-brand-secondary">
                <Mail01 className="size-6 text-fg-brand-primary" />
              </div>
              <h2 className="text-2xl font-bold text-text-primary">Sign in to RelayKit</h2>
              <p className="text-sm text-text-tertiary">
                Enter your email and we&rsquo;ll send you a code.
              </p>
              <div>
                <label htmlFor="signin-email" className="block text-sm font-medium text-text-secondary mb-1.5">
                  Email
                </label>
                <input
                  id="signin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@yourapp.com"
                  autoFocus
                  className="w-full rounded-lg border border-border-primary bg-bg-primary px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-placeholder focus:border-border-brand focus:outline-none focus:ring-1 focus:ring-border-brand"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-bg-brand-solid px-4 py-2.5 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover cursor-pointer"
              >
                Send code
              </button>
            </form>
          )}

          {step === "otp" && (
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-bg-success-secondary">
                <Mail01 className="size-6 text-fg-success-primary" />
              </div>
              <h2 className="text-2xl font-bold text-text-primary">Check your email</h2>
              <p className="text-sm text-text-tertiary">
                We sent a 6-digit code to <span className="font-medium text-text-primary">{email}</span>.
              </p>
              <div className="flex items-center justify-between gap-2" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="h-12 w-12 rounded-lg border border-border-primary bg-bg-primary text-center text-lg font-semibold text-text-primary focus:border-border-brand focus:outline-none focus:ring-1 focus:ring-border-brand"
                  />
                ))}
              </div>
              <p className="text-center text-[11px] text-text-quaternary">
                (Prototype: any 6 digits will work)
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
