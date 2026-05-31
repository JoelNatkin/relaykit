"use client";

/**
 * "Request category" modal for the elig Not-yet buckets (⚫ / 🟠). Opened from
 * the message-area treatment in EligEmptyState.
 *
 * Mirrors the WaitlistModal shell/pattern (backdrop, centered dialog, ESC +
 * backdrop close, body-scroll lock, email field, submit, success state).
 * Controlled by props rather than the global waitlist context so it doesn't
 * disturb the site-wide "Join the list" modal.
 */

import { XClose } from "@untitledui/icons";
import { useEffect, useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

function Spinner() {
  return (
    <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="3"
      />
      <path
        d="M22 12a10 10 0 0 1-10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export interface EligRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** interest_tag passed to /api/early-access (e.g. "capacity:{slug}"). */
  interestTag: string | null;
}

export function EligRequestModal({
  isOpen,
  onClose,
  interestTag,
}: EligRequestModalProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [email, setEmail] = useState("");

  // Reset to a clean form each time the modal opens.
  useEffect(() => {
    if (isOpen) {
      setStatus("idle");
      setEmail("");
    }
  }, [isOpen]);

  // Lock body scroll while open.
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Escape closes — except mid-request.
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape" && status !== "loading") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, status, onClose]);

  function requestClose() {
    if (status !== "loading") onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading" || email.trim() === "") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          ctaSource: "elig-request",
          interestTag,
        }),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean }
        | null;
      setStatus(data?.ok === true ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/50 transition-opacity duration-200"
        onClick={requestClose}
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-[101] flex items-center justify-center sm:px-6"
        onClick={requestClose}
      >
        <div
          className="relative h-full w-full overflow-y-auto rounded-none bg-bg-primary p-8 shadow-xl sm:h-auto sm:max-w-[400px] sm:overflow-visible sm:rounded-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={requestClose}
            className="absolute top-2 right-2 inline-flex size-11 cursor-pointer items-center justify-center text-text-quaternary transition duration-100 ease-linear hover:text-text-secondary"
            aria-label="Close"
          >
            <XClose className="size-5" />
          </button>

          {status === "success" ? (
            <div>
              <h2 className="text-2xl font-bold text-text-primary">
                You&apos;re on the list.
              </h2>
              <p className="mt-3 text-base leading-relaxed text-text-secondary">
                We&apos;ll email you if it becomes available.
              </p>
              <button
                type="button"
                onClick={requestClose}
                className="mt-10 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-bg-brand-cta px-4 py-2.5 text-sm font-semibold text-text-on-brand transition duration-100 ease-linear hover:bg-bg-brand-cta_hover"
              >
                Close
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-4"
            >
              <div>
                <h2 className="text-2xl font-bold text-text-primary">
                  Request category
                </h2>
                <p className="mt-2 text-base leading-relaxed text-text-tertiary">
                  Sign up and we&apos;ll email you if this category becomes
                  available.
                </p>
              </div>

              <div className="mt-4">
                <label
                  htmlFor="elig-request-email"
                  className="mb-1.5 block text-sm font-medium text-text-secondary"
                >
                  Email
                </label>
                <input
                  id="elig-request-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@yourapp.com"
                  className="w-full rounded-lg border border-border-primary bg-bg-primary px-3.5 py-2.5 text-text-primary placeholder:text-text-placeholder focus:border-border-brand focus:ring-1 focus:ring-border-brand focus:outline-none"
                />
              </div>

              {status === "error" ? (
                <p className="text-sm text-text-error-primary">
                  Something&apos;s not working on our end. Try again, or email
                  joel@relaykit.ai and I&apos;ll add you manually.
                </p>
              ) : null}

              <button
                type="submit"
                disabled={status === "loading" || email.trim() === ""}
                className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-text-on-brand transition duration-100 ease-linear ${
                  status === "loading" || email.trim() === ""
                    ? "cursor-not-allowed bg-bg-brand-cta/70"
                    : "cursor-pointer bg-bg-brand-cta hover:bg-bg-brand-cta_hover"
                }`}
              >
                {status === "loading" ? <Spinner /> : null}
                {status === "loading" ? "Requesting…" : "Request category"}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
