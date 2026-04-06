"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "@untitledui/icons";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

const SIGNUP_EMAIL_KEY = "relaykit_signup_email";

export default function SignupPage() {
  const router = useRouter();
  const { appId } = useParams<{ appId: string }>();

  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const trimmedEmail = email.trim();
  const canSend = isValidEmail(trimmedEmail) && !sending;

  function handleSendCode() {
    if (!canSend) return;
    setSending(true);
    sessionStorage.setItem(SIGNUP_EMAIL_KEY, trimmedEmail);
    setTimeout(() => {
      router.push(`/apps/${appId}/signup/verify`);
    }, 1500);
  }

  return (
    <div className="mx-auto max-w-[400px]">
      {/* Back link — inline, same pattern as /start/* pages */}
      <div className="mb-10 h-5">
        <Link
          href={`/apps/${appId}/ready`}
          className="inline-flex items-center gap-1.5 text-sm text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear"
        >
          <ArrowLeft className="size-4" />
          Back
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-text-primary">
        Create your account
      </h1>
      <p className="mt-2 text-sm text-text-tertiary">
        We&apos;ll send you a code to verify your email and sign in.
      </p>

      <div className="mt-8">
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
          disabled={sending}
          className="w-full rounded-lg border border-border-primary bg-bg-primary px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-placeholder shadow-xs focus:border-border-brand focus:outline-none focus:ring-2 focus:ring-border-brand/20 disabled:bg-bg-secondary disabled:text-text-tertiary"
        />
      </div>

      {/* Full-width Send code button — same styling as Continue buttons */}
      <button
        type="button"
        onClick={handleSendCode}
        disabled={!canSend}
        className="mt-10 w-full rounded-lg bg-bg-brand-solid px-5 py-2.5 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover disabled:cursor-not-allowed disabled:bg-bg-disabled disabled:text-text-disabled cursor-pointer"
      >
        {sending ? "Sending\u2026" : "Send code"}
      </button>
    </div>
  );
}
