"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Mail01 } from "@untitledui/icons";

const RESEND_COOLDOWN_SECONDS = 60;
const CODE_LENGTH = 8;
const GROUP_SIZE = 4;

function OtpDigitInput({
  digits,
  onChange,
  isInvalid,
  error,
}: {
  digits: string[];
  onChange: (digits: string[]) => void;
  isInvalid: boolean;
  error: string | null;
}) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  function focusInput(index: number) {
    inputRefs.current[index]?.focus();
  }

  function handleInput(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    onChange(next);

    if (digit && index < CODE_LENGTH - 1) {
      focusInput(index + 1);
    }
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (digits[index]) {
        const next = [...digits];
        next[index] = "";
        onChange(next);
      } else if (index > 0) {
        const next = [...digits];
        next[index - 1] = "";
        onChange(next);
        focusInput(index - 1);
      }
      e.preventDefault();
    } else if (e.key === "ArrowLeft" && index > 0) {
      focusInput(index - 1);
      e.preventDefault();
    } else if (e.key === "ArrowRight" && index < CODE_LENGTH - 1) {
      focusInput(index + 1);
      e.preventDefault();
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
    if (!pasted) return;

    const next = [...digits];
    for (let i = 0; i < CODE_LENGTH; i++) {
      next[i] = pasted[i] || "";
    }
    onChange(next);

    const focusIdx = Math.min(pasted.length, CODE_LENGTH - 1);
    focusInput(focusIdx);
  }

  const boxes = Array.from({ length: CODE_LENGTH }, (_, i) => i);
  const inputClass = `h-12 w-10 rounded-lg border text-center font-mono text-lg font-semibold outline-none transition duration-100 ease-linear sm:h-14 sm:w-12 sm:text-xl ${
    isInvalid
      ? "border-error bg-primary text-error-primary focus:border-error focus:ring-1 focus:ring-error"
      : "border-primary bg-primary text-primary focus:border-brand focus:ring-1 focus:ring-brand"
  }`;

  return (
    <div>
      <div className="flex items-center justify-center gap-1.5 sm:gap-2">
        {boxes.map((i) => (
          <span key={i} className="contents">
            {i === GROUP_SIZE && (
              <span className="mx-1 text-lg font-medium text-quaternary sm:mx-1.5">
                –
              </span>
            )}
            <input
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              autoComplete={i === 0 ? "one-time-code" : "off"}
              maxLength={1}
              value={digits[i]}
              onChange={(e) => handleInput(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={i === 0 ? handlePaste : undefined}
              onFocus={(e) => e.target.select()}
              className={inputClass}
              aria-label={`Digit ${i + 1}`}
            />
          </span>
        ))}
      </div>
      {error && (
        <p className="mt-2 text-center text-sm text-error-primary">{error}</p>
      )}
    </div>
  );
}

export function EmailOtpForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [digits, setDigits] = useState<string[]>(
    Array.from({ length: CODE_LENGTH }, () => ""),
  );
  const [step, setStep] = useState<"email" | "code">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const code = digits.join("");

  const startCooldown = useCallback(() => {
    setCooldown(RESEND_COOLDOWN_SECONDS);
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (cooldownRef.current) clearInterval(cooldownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  async function handleSendCode(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
      });

      if (otpError) {
        setError(otpError.message);
        return;
      }

      setStep("code");
      setDigits(Array.from({ length: CODE_LENGTH }, () => ""));
      startCooldown();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: "email",
      });

      if (verifyError) {
        if (
          verifyError.message.toLowerCase().includes("expired") ||
          verifyError.code === "otp_expired"
        ) {
          setError("That code has expired. Request a new one.");
        } else {
          setError(
            "That code didn\u2019t match. Check your email and try again.",
          );
        }
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResend() {
    if (cooldown > 0) return;
    setError(null);
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
      });

      if (otpError) {
        setError(otpError.message);
        return;
      }

      setDigits(Array.from({ length: CODE_LENGTH }, () => ""));
      startCooldown();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if (step === "code") {
    return (
      <div>
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-success-secondary">
            <Mail01 className="size-6 text-fg-success-primary" />
          </div>
          <h2 className="text-lg font-semibold text-primary">
            Check your email
          </h2>
          <p className="mt-2 text-sm text-tertiary">
            We sent an 8-digit code to{" "}
            <span className="font-medium text-primary">{email}</span>.
          </p>
        </div>

        <form onSubmit={handleVerifyCode} className="space-y-4">
          <OtpDigitInput
            digits={digits}
            onChange={(d) => {
              setDigits(d);
              setError(null);
            }}
            isInvalid={!!error}
            error={error}
          />
          <Button
            type="submit"
            color="primary"
            size="md"
            isLoading={isLoading}
            showTextWhileLoading
            isDisabled={code.length !== CODE_LENGTH}
            className="w-full"
          >
            Verify
          </Button>
        </form>

        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              setStep("email");
              setDigits(Array.from({ length: CODE_LENGTH }, () => ""));
              setError(null);
            }}
            className="text-sm font-medium text-brand-secondary transition duration-100 ease-linear hover:text-brand-secondary_hover"
          >
            Use a different email
          </button>
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0}
            className={`text-sm font-medium transition duration-100 ease-linear ${
              cooldown > 0
                ? "cursor-default text-disabled"
                : "text-brand-secondary hover:text-brand-secondary_hover"
            }`}
          >
            {cooldown > 0 ? `Resend code (${cooldown}s)` : "Resend code"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold text-primary">
          Enter your email to continue
        </h1>
        <p className="mt-2 text-sm text-tertiary">
          We&apos;ll send you a code — no password needed.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-error bg-error-primary px-4 py-3 text-sm text-error-primary">
          {error}
        </div>
      )}

      <form onSubmit={handleSendCode} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          icon={Mail01}
          value={email}
          onChange={(v) => setEmail(v as string)}
          isRequired
          size="md"
        />
        <Button
          type="submit"
          color="primary"
          size="md"
          isLoading={isLoading}
          showTextWhileLoading
          className="w-full"
        >
          Continue
        </Button>
      </form>
    </>
  );
}
