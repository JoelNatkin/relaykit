"use client";

/**
 * Early-access waitlist modal. Rendered once at the layout level; opened by
 * any of the three "Get early access" buttons via the waitlist context.
 *
 * Reads the configurator summary from context to show the visitor what
 * they're signing up around, and posts it (plus their email and the
 * cta_source of the button that opened the modal) to /api/early-access.
 */

import { XClose } from "@untitledui/icons";
import { useEffect, useState } from "react";
import { useWaitlist } from "@/context/waitlist-context";

type Status = "idle" | "loading" | "success" | "error";

function Spinner() {
  return (
    <svg
      className="size-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
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

function CategoryPills({ titles }: { titles: string[] }) {
  return (
    <div>
      <p className="mb-2 text-base text-text-tertiary">Live at launch:</p>
      <div className="flex flex-wrap gap-1.5">
        {titles.map((title) => (
          <span
            key={title}
            className="inline-flex items-center rounded-full border border-bg-brand-secondary bg-bg-brand-secondary px-3 py-1.5 text-sm font-medium text-text-brand-secondary"
          >
            {title}
          </span>
        ))}
      </div>
    </div>
  );
}

function FounderSignoff() {
  return (
    <p className="mt-2 text-base text-text-tertiary">— Joel, solo founder</p>
  );
}

export function WaitlistModal() {
  const { isOpen, closeModal, ctaSource, summary } = useWaitlist();
  const [status, setStatus] = useState<Status>("idle");
  const [email, setEmail] = useState("");

  const categoryTitles =
    summary.categoryTitles.length > 0
      ? summary.categoryTitles
      : ["Verification"];

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

  // Escape closes — except mid-request, where the modal stays open.
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape" && status !== "loading") closeModal();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, status, closeModal]);

  // Backdrop / X close — gated off during a request.
  function requestClose() {
    if (status !== "loading") closeModal();
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
          categories: summary.categoryTitles,
          tone: summary.tone,
          businessName: summary.businessName,
          configuratorTouched: summary.configuratorTouched,
          ctaSource,
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
        className="fixed inset-0 z-[101] flex items-center justify-center px-6"
        onClick={requestClose}
      >
        <div
          className="relative w-full max-w-[400px] rounded-2xl bg-bg-primary p-8 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={requestClose}
            className="absolute top-4 right-4 cursor-pointer p-1 text-text-quaternary transition duration-100 ease-linear hover:text-text-secondary"
            aria-label="Close"
          >
            <XClose className="size-5" />
          </button>

          {status === "success" ? (
            <div>
              <h2 className="text-2xl font-bold text-text-primary">
                You&apos;re in.
              </h2>
              <p className="mt-3 text-base leading-relaxed text-text-secondary">
                I&apos;ll send you an email when it ships.
              </p>
              <button
                type="button"
                onClick={requestClose}
                className="mt-10 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-bg-brand-solid px-4 py-2.5 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover"
              >
                Close
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex min-h-[320px] flex-col gap-4"
            >
              <div>
                <h2 className="text-2xl font-bold text-text-primary">
                  Get on the list
                </h2>
                <p className="mt-2 text-base leading-relaxed text-text-tertiary">
                  Summer 2026 is the target. I&apos;ll send one email when
                  it&apos;s live — no drip, no marketing churn.
                </p>
                <FounderSignoff />
              </div>

              <CategoryPills titles={categoryTitles} />

              <div className="mt-4">
                <label
                  htmlFor="waitlist-email"
                  className="mb-1.5 block text-sm font-medium text-text-secondary"
                >
                  Email
                </label>
                <input
                  id="waitlist-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@yourapp.com"
                  autoFocus
                  className="w-full rounded-lg border border-border-primary bg-bg-primary px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-placeholder focus:border-border-brand focus:ring-1 focus:ring-border-brand focus:outline-none"
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
                className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-text-white transition duration-100 ease-linear ${
                  status === "loading" || email.trim() === ""
                    ? "cursor-not-allowed bg-bg-brand-solid/70"
                    : "cursor-pointer bg-bg-brand-solid hover:bg-bg-brand-solid_hover"
                }`}
              >
                {status === "loading" ? <Spinner /> : null}
                {status === "loading" ? "Joining…" : "Join the list"}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
