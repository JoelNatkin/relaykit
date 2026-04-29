"use client";

import { useActionState } from "react";
import { submitBetaSignup, type GetStartedFormState } from "./actions";

const INITIAL: GetStartedFormState = { status: "idle" };

export function GetStartedForm() {
  const [state, formAction, pending] = useActionState(submitBetaSignup, INITIAL);

  if (state.status === "ok") {
    return (
      <div>
        <h2 className="text-xl font-bold text-text-primary">You&apos;re in.</h2>
        <p className="mt-2 text-base text-text-tertiary">
          Watch your inbox. We&apos;ll be in touch when we open access.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text-secondary">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="mt-1.5 block w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2.5 text-base text-text-primary placeholder:text-text-placeholder focus:border-border-brand focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-text-secondary">
          Your name <span className="font-normal text-text-tertiary">(optional)</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          className="mt-1.5 block w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2.5 text-base text-text-primary placeholder:text-text-placeholder focus:border-border-brand focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-bg-brand-solid px-5 py-2.5 text-sm font-semibold text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover disabled:opacity-60"
      >
        {pending ? "Submitting…" : "Request access"}
      </button>

      <p className="text-xs text-text-tertiary">
        No marketing emails. We&apos;ll only write to you about beta access.
      </p>
    </form>
  );
}
