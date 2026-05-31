"use client";

/**
 * Inline email capture for the home page's bottom "Join the list" section.
 * On-page email field → POST /api/early-access (ctaSource "bottom"); no modal.
 */

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export function BottomEmailCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading" || email.trim() === "") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), ctaSource: "bottom" }),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean }
        | null;
      setStatus(data?.ok === true ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="mt-8 text-base text-text-success-primary">
        You&apos;re on the list — I&apos;ll email you when it&apos;s live.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mt-8 flex w-full max-w-md flex-col gap-2 sm:flex-row"
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@yourapp.com"
        aria-label="Email"
        disabled={status === "loading"}
        className="flex-1 rounded-lg border border-border-primary bg-bg-primary px-3.5 py-2.5 text-base text-text-primary placeholder:text-text-placeholder focus:border-border-brand focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={status === "loading" || email.trim() === ""}
        className="cursor-pointer rounded-lg bg-bg-brand-cta px-4 py-2.5 text-sm font-semibold text-text-on-brand transition duration-100 ease-linear hover:bg-bg-brand-cta_hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "loading" ? "Joining…" : "Join the list"}
      </button>
      {status === "error" ? (
        <p className="basis-full text-xs text-text-error-primary">
          Something went wrong. Try again, or email joel@relaykit.ai.
        </p>
      ) : null}
    </form>
  );
}
