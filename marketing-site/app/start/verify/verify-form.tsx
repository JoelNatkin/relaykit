"use client";

import Link from "next/link";
import { useActionState } from "react";
import { submitPhoneSignup, type VerifyFormState } from "./actions";

const INITIAL: VerifyFormState = { status: "idle" };

export function VerifyForm() {
  const [state, formAction, pending] = useActionState(submitPhoneSignup, INITIAL);

  if (state.status === "ok") {
    return (
      <div>
        <h2 className="text-xl font-bold text-text-primary">You&apos;re on the list.</h2>
        <p className="mt-2 text-base text-text-tertiary">
          We&apos;ll text you when we go live.
        </p>
        <Link
          href="/start/get-started"
          className="mt-6 inline-flex items-center text-sm font-semibold text-text-brand-secondary hover:text-text-brand-primary"
        >
          Get early access &rarr;
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-text-secondary">
          Mobile number
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          placeholder="(555) 123-4567"
          className="mt-1.5 block w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2.5 text-base text-text-primary placeholder:text-text-placeholder focus:border-border-brand focus:outline-none"
        />
      </div>

      <p className="text-xs leading-relaxed text-text-tertiary">
        By submitting your number, you agree to receive a text from RelayKit once
        we&apos;re cleared to send. Standard message and data rates apply. Reply
        STOP to remove yourself from the list, HELP for help.
      </p>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-bg-brand-solid px-5 py-2.5 text-sm font-semibold text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover disabled:opacity-60"
      >
        {pending ? "Submitting…" : "Get on the list"}
      </button>
    </form>
  );
}
