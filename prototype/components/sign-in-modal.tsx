"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/session-context";
import { Mail01, XClose } from "@untitledui/icons";

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
  const [sending, setSending] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep("email");
      setEmail("");
      setOtp(["", "", "", "", "", ""]);
      setSending(false);
      setResendTimer(30);
    }
  }, [isOpen]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
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

  // Resend countdown timer
  useEffect(() => {
    if (step !== "otp" || resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  const handleComplete = useCallback(() => {
    setLoggedIn(true);
    onClose();
    router.push("/apps");
  }, [setLoggedIn, onClose, router]);

  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || sending) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setStep("otp");
      setResendTimer(30);
      setTimeout(() => otpRefs.current[0]?.focus(), 50);
    }, 500);
  }

  function handleResend() {
    if (resendTimer > 0) return;
    setResendTimer(30);
    setOtp(["", "", "", "", "", ""]);
    setTimeout(() => otpRefs.current[0]?.focus(), 50);
  }

  function handleBackToEmail() {
    setStep("email");
    setOtp(["", "", "", "", "", ""]);
    setSending(false);
  }

  function handleOtpChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);

    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

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
        className="fixed inset-0 z-[100] bg-black/50 transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center px-6" onClick={onClose}>
        <div
          className="relative w-full max-w-[400px] rounded-2xl bg-bg-primary p-8 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1 text-text-quaternary hover:text-text-secondary transition duration-100 ease-linear cursor-pointer"
            aria-label="Close"
          >
            <XClose className="size-5" />
          </button>

          {step === "email" && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-bg-brand-secondary">
                <Mail01 className="size-6 text-fg-brand-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-text-primary">Sign in to RelayKit</h2>
                <p className="mt-1 text-sm text-text-tertiary">
                  Enter your email and we&rsquo;ll send you a code.
                </p>
              </div>
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
                disabled={sending}
                className={`w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-text-white transition duration-100 ease-linear cursor-pointer ${
                  sending
                    ? "bg-bg-brand-solid/70 cursor-not-allowed"
                    : "bg-bg-brand-solid hover:bg-bg-brand-solid_hover"
                }`}
              >
                {sending ? "Sending..." : "Send code"}
              </button>
            </form>
          )}

          {step === "otp" && (
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-bg-success-secondary">
                <Mail01 className="size-6 text-fg-success-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-text-primary">Check your email</h2>
                <p className="mt-1 text-sm text-text-tertiary">
                  We sent a 6-digit code to <span className="font-medium text-text-primary">{email}</span>.
                </p>
              </div>
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
              <div className="flex flex-col items-center gap-1.5">
                {resendTimer > 0 ? (
                  <p className="text-sm text-text-quaternary">
                    Resend code in 0:{resendTimer.toString().padStart(2, "0")}
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-sm font-medium text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear cursor-pointer"
                  >
                    Resend code
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleBackToEmail}
                  className="text-sm text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear cursor-pointer"
                >
                  Use a different email
                </button>
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
