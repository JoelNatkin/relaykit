"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Mail01 } from "@untitledui/icons";

interface MagicLinkFormProps {
  mode: "login" | "signup";
}

export function MagicLinkForm({ mode }: MagicLinkFormProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (otpError) {
        setError(otpError.message);
        return;
      }

      setSent(true);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-success-secondary">
          <Mail01 className="size-6 text-fg-success-primary" />
        </div>
        <h2 className="text-lg font-semibold text-primary">Check your email</h2>
        <p className="mt-2 text-sm text-tertiary">
          We sent a magic link to <span className="font-medium text-primary">{email}</span>.
          Click the link to {mode === "signup" ? "get started" : "sign in"}.
        </p>
        <button
          type="button"
          onClick={() => {
            setSent(false);
            setEmail("");
          }}
          className="mt-4 text-sm font-medium text-brand-secondary transition duration-100 ease-linear hover:text-brand-secondary_hover"
        >
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        icon={Mail01}
        value={email}
        onChange={(v) => setEmail(v as string)}
        isRequired
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
        className="w-full"
      >
        {mode === "signup" ? "Get started" : "Sign in"}
      </Button>
    </form>
  );
}
