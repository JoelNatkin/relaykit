"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "@untitledui/icons";
import { WizardStepShell } from "@/components/wizard-step-shell";
import { loadWizardData, saveWizardData } from "@/lib/wizard-storage";

/* ── Helpers ── */

function formatEin(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 9);
  if (d.length <= 2) return d;
  return `${d.slice(0, 2)}-${d.slice(2)}`;
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M8 7V11" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <circle cx="8" cy="5.25" r="0.75" fill="currentColor" />
    </svg>
  );
}

const TOOLTIP_COPY =
  "A 9-digit tax ID for your business. Entering one unlocks marketing messages and additional use cases.";

/* ── Demo business identity for verified state (D-303) ── */
const DEMO_IDENTITY = {
  legalName: "Vaulted Press LLC",
  address: "123 Main St, Charleston, SC 29401",
  entityType: "LLC",
  state: "South Carolina",
};

type EinState = "idle" | "verifying" | "verified" | "failed";
type StubMode = "default" | "verified" | "failed";

const DEMO_EIN_VERIFIED = "45-6789012";
const DEMO_EIN_FAILED = "12-3456789";

export default function BusinessNamePage() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState("");
  const [einInput, setEinInput] = useState("");
  const [einState, setEinState] = useState<EinState>("idle");
  const [formatError, setFormatError] = useState(false);
  const [stubMode, setStubMode] = useState<StubMode>("default");
  const [showTooltip, setShowTooltip] = useState(false);
  const [vertical, setVertical] = useState("");
  const [einExpanded, setEinExpanded] = useState(false);

  useEffect(() => {
    const data = loadWizardData();
    if (data.businessName) setBusinessName(data.businessName);
    setVertical(data.vertical);
  }, []);

  const isMarketingPrimary = vertical === "marketing";
  // Marketing vertical: section is always expanded and cannot be collapsed
  const showEinForm = einExpanded || isMarketingPrimary;

  const trimmedName = businessName.trim();
  const einDigits = einInput.replace(/\D/g, "");
  const formatted = formatEin(einInput);
  const canVerify = einDigits.length === 9 && einState === "idle";

  // Continue gating
  let canContinue = trimmedName.length > 0 && einState !== "verifying";
  if (isMarketingPrimary) {
    canContinue = canContinue && einState === "verified";
  }

  function handleEinChange(raw: string) {
    setFormatError(false);
    setEinInput(formatEin(raw));
  }

  function handleEinBlur() {
    if (einDigits.length === 0) {
      setFormatError(false);
      return;
    }
    if (einDigits.length !== 9) setFormatError(true);
  }

  function handleVerify() {
    if (einDigits.length !== 9) {
      setFormatError(true);
      return;
    }
    setFormatError(false);
    setEinState("verifying");
    setTimeout(() => {
      const outcome: EinState = stubMode === "failed" ? "failed" : "verified";
      setEinState(outcome);
    }, 1500);
  }

  function handleNotRight() {
    setEinState("idle");
    setEinInput("");
  }

  function handleTryAgain() {
    setEinState("idle");
    setEinInput("");
  }

  function handleChooseDifferentVertical() {
    router.push("/start");
  }

  function handleExpandEin() {
    setEinExpanded(true);
  }

  function handleCollapseEin() {
    // Clear all EIN state when collapsing
    setEinExpanded(false);
    setEinInput("");
    setEinState("idle");
    setFormatError(false);
    setStubMode("default");
  }

  function handleStubModeChange(mode: StubMode) {
    setStubMode(mode);
    if (mode === "verified") {
      setEinInput(DEMO_EIN_VERIFIED);
      setEinState("verified");
      setFormatError(false);
    } else if (mode === "failed") {
      setEinInput(DEMO_EIN_FAILED);
      setEinState("failed");
      setFormatError(false);
    } else {
      setEinInput("");
      setEinState("idle");
      setFormatError(false);
    }
  }

  function handleBeforeContinue() {
    const patch: { businessName: string; ein?: string; businessIdentity?: typeof DEMO_IDENTITY } = {
      businessName: trimmedName,
    };
    if (einState === "verified") {
      patch.ein = formatted;
      patch.businessIdentity = DEMO_IDENTITY;
    }
    // Unverified / failed EINs are NOT saved (we don't submit unverified)
    saveWizardData(patch);
  }

  return (
    <WizardStepShell
      backHref="/start"
      continueHref="/start/details"
      canContinue={canContinue}
      onBeforeContinue={handleBeforeContinue}
    >
      <h1 className="text-2xl font-bold text-text-primary">
        What&apos;s your business called?
      </h1>
      <p className="mt-2 text-sm text-text-tertiary">
        You can change any of this later.
      </p>

      {/* Business name */}
      <div className="mt-8">
        <label htmlFor="business-name" className="mb-1.5 block text-sm font-medium text-text-secondary">
          Business name
        </label>
        <input
          id="business-name"
          type="text"
          autoFocus
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder="Your business name"
          className="w-full rounded-lg border border-border-primary bg-bg-primary px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-placeholder shadow-xs focus:border-border-brand focus:outline-none focus:ring-2 focus:ring-border-brand/20"
        />
      </div>

      {/* EIN section */}
      <div className="mt-6">
        {!showEinForm && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleExpandEin}
              className="text-sm text-text-brand-secondary hover:text-text-brand-secondary_hover transition duration-100 ease-linear cursor-pointer"
            >
              I have a business tax ID (EIN)
            </button>
            <div className="relative flex items-center">
              <button
                type="button"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="text-fg-quaternary hover:text-fg-tertiary transition duration-100 ease-linear cursor-default"
                aria-label={TOOLTIP_COPY}
              >
                <InfoIcon />
              </button>
              {showTooltip && (
                <div className="absolute left-4 bottom-full mb-1 z-[100] rounded-lg bg-[#333333] px-3 py-2 text-xs text-white shadow-lg min-w-[240px] max-w-[300px] whitespace-normal leading-relaxed pointer-events-none">
                  {TOOLTIP_COPY}
                </div>
              )}
            </div>
          </div>
        )}

        {showEinForm && (
          <div style={{ animation: "wizardFadeIn 200ms ease-out" }}>
            {/* Marketing-primary note */}
            {isMarketingPrimary && (
              <p className="mb-3 text-xs text-text-tertiary">
                Marketing messages require a verified business identity.
              </p>
            )}

            {/* Collapse control — transactional only */}
            {!isMarketingPrimary && (
              <div className="mb-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleCollapseEin}
                  className="text-xs text-text-tertiary hover:text-text-secondary hover:underline transition duration-100 ease-linear cursor-pointer"
                >
                  Never mind
                </button>
              </div>
            )}

            {/* Label row with tooltip + prototype state switcher */}
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <label htmlFor="ein" className="text-sm font-medium text-text-secondary">
                  Business tax ID (EIN)
                </label>
                <div className="relative flex items-center">
                  <button
                    type="button"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    className="text-fg-quaternary hover:text-fg-tertiary transition duration-100 ease-linear cursor-default"
                    aria-label={TOOLTIP_COPY}
                  >
                    <InfoIcon />
                  </button>
                  {showTooltip && (
                    <div className="absolute left-4 bottom-full mb-1 z-[100] rounded-lg bg-[#333333] px-3 py-2 text-xs text-white shadow-lg min-w-[240px] max-w-[300px] whitespace-normal leading-relaxed pointer-events-none">
                      {TOOLTIP_COPY}
                    </div>
                  )}
                </div>
              </div>
              <select
                value={stubMode}
                onChange={(e) => handleStubModeChange(e.target.value as StubMode)}
                className="text-xs text-text-quaternary bg-transparent border-none cursor-pointer focus:outline-none"
              >
                <option value="default">Default</option>
                <option value="verified">Verified</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            {/* Input row */}
            <div className="flex items-start gap-2">
              <input
                id="ein"
                type="text"
                inputMode="numeric"
                value={formatted}
                onChange={(e) => handleEinChange(e.target.value)}
                onBlur={handleEinBlur}
                placeholder="XX-XXXXXXX"
                disabled={einState === "verifying" || einState === "verified"}
                className="flex-1 rounded-lg border border-border-primary bg-bg-primary px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-placeholder shadow-xs focus:border-border-brand focus:outline-none focus:ring-2 focus:ring-border-brand/20 disabled:bg-bg-secondary disabled:text-text-tertiary"
              />
              {einState === "verified" ? (
                <div className="flex items-center justify-center rounded-lg px-3 py-2.5 shrink-0">
                  <CheckCircle className="size-5 text-fg-success-primary" />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleVerify}
                  disabled={!canVerify && einState !== "failed"}
                  className="rounded-lg bg-bg-brand-solid px-4 py-2.5 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover disabled:cursor-not-allowed disabled:bg-bg-disabled disabled:text-text-disabled cursor-pointer shrink-0"
                >
                  {einState === "verifying" ? "Verifying…" : "Verify"}
                </button>
              )}
            </div>

            {/* Format error */}
            {formatError && einState === "idle" && (
              <p className="mt-2 text-xs text-text-error-primary">
                EIN should be 9 digits (XX-XXXXXXX)
              </p>
            )}

            {/* Verified — business identity block */}
            {einState === "verified" && (
              <div className="mt-3 rounded-lg border border-border-secondary bg-bg-secondary px-4 py-3">
                <p className="text-sm font-medium text-text-primary">{DEMO_IDENTITY.legalName}</p>
                <p className="mt-0.5 text-sm text-text-tertiary">{DEMO_IDENTITY.address}</p>
                <p className="mt-0.5 text-sm text-text-tertiary">
                  {DEMO_IDENTITY.entityType} · {DEMO_IDENTITY.state}
                </p>
                <button
                  type="button"
                  onClick={handleNotRight}
                  className="mt-2 text-xs text-text-tertiary hover:text-text-secondary hover:underline transition duration-100 ease-linear cursor-pointer"
                >
                  Not right?
                </button>
              </div>
            )}

            {/* Failed — transactional primary */}
            {einState === "failed" && !isMarketingPrimary && (
              <div className="mt-3">
                <p className="text-sm text-text-tertiary leading-relaxed">
                  We couldn&apos;t verify this EIN automatically. Your messages are fully functional with one campaign. To unlock marketing and additional use cases, you&apos;ll need a verified EIN — you can try again anytime from Settings.
                </p>
                <button
                  type="button"
                  onClick={handleTryAgain}
                  className="mt-2 text-sm text-text-tertiary hover:text-text-secondary hover:underline transition duration-100 ease-linear cursor-pointer"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Failed — marketing primary */}
            {einState === "failed" && isMarketingPrimary && (
              <div className="mt-3">
                <p className="text-sm text-text-tertiary leading-relaxed">
                  We couldn&apos;t verify this EIN. Marketing messages require a verified business identity. You can switch to a different use case to get started, or try a different EIN.
                </p>
                <div className="mt-2 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={handleTryAgain}
                    className="text-sm text-text-tertiary hover:text-text-secondary hover:underline transition duration-100 ease-linear cursor-pointer"
                  >
                    Try a different EIN
                  </button>
                  <button
                    type="button"
                    onClick={handleChooseDifferentVertical}
                    className="text-sm text-text-tertiary hover:text-text-secondary hover:underline transition duration-100 ease-linear cursor-pointer"
                  >
                    Choose a different use case
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </WizardStepShell>
  );
}
