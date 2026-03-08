"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Mail01 } from "@untitledui/icons";

const RESEND_COOLDOWN_SECONDS = 60;

export function EmailOtpForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
      setCode("");
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
            We sent a 6-digit code to{" "}
            <span className="font-medium text-primary">{email}</span>.
          </p>
        </div>

        <form onSubmit={handleVerifyCode} className="space-y-4">
          <Input
            label="Code"
            type="text"
            inputMode="numeric"
            placeholder="000000"
            value={code}
            onChange={(v) => setCode((v as string).replace(/\D/g, "").slice(0, 6))}
            autoComplete="one-time-code"
            isInvalid={!!error}
            hint={error ?? undefined}
            size="md"
          />
          <Button
            type="submit"
            color="primary"
            size="md"
            isLoading={isLoading}
            showTextWhileLoading
            isDisabled={code.length !== 6}
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
              setCode("");
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
