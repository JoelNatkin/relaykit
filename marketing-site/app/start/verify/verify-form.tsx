"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitPhoneSignup, type VerifyFormState } from "./actions";

const INITIAL: VerifyFormState = { status: "idle" };

export function VerifyForm() {
  const [state, formAction, pending] = useActionState(submitPhoneSignup, INITIAL);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "ok" && !pending) {
      formRef.current?.reset();
    }
  }, [state, pending]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-5">
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
        We&apos;ll text you a verification code. By verifying, you agree to
        receive test messages at this number when you trigger them. Standard
        rates apply. Reply STOP anytime, HELP for help.
      </p>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-bg-brand-solid px-5 py-2.5 text-sm font-semibold text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover disabled:opacity-60"
      >
        {pending ? "Submitting…" : "Send verification code"}
      </button>

      <p className="text-sm text-text-error-primary">
        Pending carrier approval. Verification SMS will be sent once approved.
      </p>
    </form>
  );
}
