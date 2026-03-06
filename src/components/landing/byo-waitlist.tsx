"use client";

import { useState } from "react";
import { Button } from "@/components/base/buttons/button";

export function BYOWaitlist() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    const res = await fetch("/api/byo-waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setStatus(res.ok ? "success" : "error");
  }

  if (status === "success") {
    return (
      <section id="byo-waitlist" className="bg-secondary px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
        <div className="mx-auto mt-12 max-w-xl rounded-xl border border-secondary bg-primary p-6 text-center">
          <p className="text-sm font-medium text-success-primary">
            We'll email you when it's ready.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="byo-waitlist" className="bg-secondary px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
      <div className="mx-auto mt-12 max-w-xl rounded-xl border border-secondary bg-primary p-6 text-center">
        <p className="text-sm font-medium text-primary">
          Already have a Twilio account?
        </p>
        <p className="mt-1 text-sm text-tertiary">
          We're building a $199 one-time registration-only option for developers
          with existing Twilio accounts.
        </p>
        <form
          onSubmit={handleSubmit}
          className="mt-4 flex justify-center gap-2"
        >
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading"}
            className="w-64 rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary shadow-xs placeholder:text-placeholder focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand disabled:bg-disabled_subtle disabled:text-disabled"
          />
          <Button
            type="submit"
            color="secondary"
            size="sm"
            isLoading={status === "loading"}
          >
            Get notified
          </Button>
        </form>
        {status === "error" && (
          <p className="mt-2 text-sm text-error-primary">
            Something went wrong. Try again.
          </p>
        )}
      </div>
    </section>
  );
}
