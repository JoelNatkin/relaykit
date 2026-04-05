"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

const TOOLTIP_COPY =
  "A 9-digit tax ID for your business. Entering one unlocks marketing messages and additional use cases.";
const OWNERSHIP_TOOLTIP_COPY =
  "Misrepresenting business identity will result in account termination.";

/* ── Demo business identity for verified state (D-303) ── */
const DEMO_IDENTITY = {
  legalName: "Vaulted Press LLC",
  address: "123 Main St, Charleston, SC 29401",
  entityType: "LLC",
  state: "South Carolina",
};

type EinState = "idle" | "verifying" | "verified" | "failed";
type VerifyingPhase = "primary" | "sources";
type StubMode = "default" | "verified" | "failed";

const DEMO_EIN_VERIFIED = "45-6789012";
const DEMO_EIN_FAILED = "12-3456789";

export default function BusinessNamePage() {
  const router = useRouter();
  const einInputRef = useRef<HTMLInputElement>(null);

  const [businessName, setBusinessName] = useState("");
  const [einInput, setEinInput] = useState("");
  const [einState, setEinState] = useState<EinState>("idle");
  const [verifyingPhase, setVerifyingPhase] = useState<VerifyingPhase>("primary");
  const [formatError, setFormatError] = useState(false);
  const [stubMode, setStubMode] = useState<StubMode>("default");
  const [showTooltip, setShowTooltip] = useState(false);
  const [showOwnershipTooltip, setShowOwnershipTooltip] = useState(false);
  const [vertical, setVertical] = useState("");
  const [einExpanded, setEinExpanded] = useState(false);
  const [confirmedOwnership, setConfirmedOwnership] = useState(false);

  useEffect(() => {
    const data = loadWizardData();
    if (data.businessName) setBusinessName(data.businessName);
    setVertical(data.vertical);
  }, []);

  const isMarketingPrimary = vertical === "marketing";
  // Marketing: section is always expanded and cannot be collapsed
  const showEinForm = einExpanded || isMarketingPrimary;

  const trimmedName = businessName.trim();
  const einDigits = einInput.replace(/\D/g, "");
  const formatted = formatEin(einInput);
  const canVerify = einDigits.length === 9 && (einState === "idle" || einState === "failed");

  // Continue gating
  let canContinue = trimmedName.length > 0 && einState !== "verifying";
  if (einState === "verified") canContinue = canContinue && confirmedOwnership;
  if (isMarketingPrimary) canContinue = canContinue && einState === "verified";

  function handleEinChange(raw: string) {
    setFormatError(false);
    // Typing a new EIN after a failure should return us to idle
    if (einState === "failed") setEinState("idle");
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
    setVerifyingPhase("primary");
    // Phase 1: 0-1s "Verifying…" (primary lookup)
    setTimeout(() => {
      setVerifyingPhase("sources");
      // Phase 2: 1-2.5s "Checking sources…" (AI deep dive fallback)
      setTimeout(() => {
        const outcome: EinState = stubMode === "failed" ? "failed" : "verified";
        setEinState(outcome);
      }, 1500);
    }, 1000);
  }

  function handleDismissVerified() {
    setEinState("idle");
    setEinInput("");
    setConfirmedOwnership(false);
    // Refocus the input for re-entry, stay in expanded section
    requestAnimationFrame(() => einInputRef.current?.focus());
  }

  function handleChooseDifferentVertical() {
    router.push("/start");
  }

  function handleToggleEinExpanded() {
    if (einExpanded) {
      // Collapse: clear everything
      setEinExpanded(false);
      setEinInput("");
      setEinState("idle");
      setFormatError(false);
      setStubMode("default");
      setConfirmedOwnership(false);
    } else {
      setEinExpanded(true);
    }
  }

  function handleStubModeChange(mode: StubMode) {
    setStubMode(mode);
    setConfirmedOwnership(false);
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
    if (einState === "verified" && confirmedOwnership) {
      patch.ein = formatted;
      patch.businessIdentity = DEMO_IDENTITY;
    }
    saveWizardData(patch);
  }

  const verifyButtonText =
    einState === "verifying"
      ? (verifyingPhase === "primary" ? "Verifying…" : "Checking sources…")
      : "Verify";

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
        {/* Collapsed trigger — not shown for marketing-primary (always expanded)
            or when already expanded (label row shows Cancel instead) */}
        {!isMarketingPrimary && !einExpanded && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleToggleEinExpanded}
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
          <div
            className={!isMarketingPrimary ? "mt-3" : ""}
            style={{ animation: "wizardFadeIn 200ms ease-out" }}
          >
            {/* Marketing-primary note */}
            {isMarketingPrimary && (
              <p className="mb-3 text-xs text-text-tertiary">
                Marketing messages require a verified business identity.
              </p>
            )}

            {/* Label row with tooltip + Cancel + prototype state switcher */}
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <label htmlFor="ein" className="text-sm font-medium text-text-secondary">
                  Business tax ID (EIN)
                </label>
                {isMarketingPrimary && (
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
                )}
                {!isMarketingPrimary && (
                  <button
                    type="button"
                    onClick={handleToggleEinExpanded}
                    className="text-sm text-text-tertiary hover:text-text-secondary hover:underline transition duration-100 ease-linear cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
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

            {/* Input row — hidden when verified (the details card replaces it) */}
            {einState !== "verified" && (
              <div className="flex items-start gap-2">
                <input
                  ref={einInputRef}
                  id="ein"
                  type="text"
                  inputMode="numeric"
                  value={formatted}
                  onChange={(e) => handleEinChange(e.target.value)}
                  onBlur={handleEinBlur}
                  placeholder="XX-XXXXXXX"
                  disabled={einState === "verifying"}
                  className="flex-1 rounded-lg border border-border-primary bg-bg-primary px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-placeholder shadow-xs focus:border-border-brand focus:outline-none focus:ring-2 focus:ring-border-brand/20 disabled:bg-bg-secondary disabled:text-text-tertiary"
                />
                <button
                  type="button"
                  onClick={handleVerify}
                  disabled={!canVerify && einState !== "verifying"}
                  className="rounded-lg bg-bg-brand-solid px-4 py-2.5 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover disabled:cursor-not-allowed disabled:bg-bg-disabled disabled:text-text-disabled cursor-pointer shrink-0"
                >
                  {verifyButtonText}
                </button>
              </div>
            )}

            {/* Format error */}
            {formatError && einState === "idle" && (
              <p className="mt-2 text-xs text-text-error-primary">
                EIN should be 9 digits (XX-XXXXXXX)
              </p>
            )}

            {/* Verified — business identity card with ✕ dismiss + inline confirmation checkbox */}
            {einState === "verified" && (
              <div className="relative rounded-lg border border-border-secondary bg-bg-secondary px-4 py-3 pr-10">
                <button
                  type="button"
                  onClick={handleDismissVerified}
                  aria-label="Dismiss — this is not my business"
                  className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded text-text-tertiary hover:text-text-secondary hover:bg-bg-primary transition duration-100 ease-linear cursor-pointer"
                >
                  <XIcon />
                </button>
                <p className="text-sm font-medium text-text-primary">{DEMO_IDENTITY.legalName}</p>
                <p className="mt-0.5 text-sm text-text-tertiary">{DEMO_IDENTITY.address}</p>
                <p className="mt-0.5 text-sm text-text-tertiary">
                  {DEMO_IDENTITY.entityType} · {DEMO_IDENTITY.state}
                </p>
                <div className="mt-3 border-t border-border-tertiary pt-3">
                  <div className="flex items-center gap-1.5">
                    <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                      <input
                        type="checkbox"
                        checked={confirmedOwnership}
                        onChange={(e) => setConfirmedOwnership(e.target.checked)}
                        className="h-4 w-4 flex-shrink-0 cursor-pointer accent-[color:var(--color-brand-600)]"
                      />
                      <span>This is my business</span>
                    </label>
                    <div className="relative flex items-center">
                      <button
                        type="button"
                        onMouseEnter={() => setShowOwnershipTooltip(true)}
                        onMouseLeave={() => setShowOwnershipTooltip(false)}
                        className="text-fg-quaternary hover:text-fg-tertiary transition duration-100 ease-linear cursor-default"
                        aria-label={OWNERSHIP_TOOLTIP_COPY}
                      >
                        <InfoIcon />
                      </button>
                      {showOwnershipTooltip && (
                        <div className="absolute left-4 bottom-full mb-1 z-[100] rounded-lg bg-[#333333] px-3 py-2 text-xs text-white shadow-lg min-w-[240px] max-w-[300px] whitespace-normal leading-relaxed pointer-events-none">
                          {OWNERSHIP_TOOLTIP_COPY}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Failed — transactional primary */}
            {einState === "failed" && !isMarketingPrimary && (
              <p className="mt-2 text-xs text-text-tertiary leading-relaxed">
                We couldn&apos;t verify this EIN. You can try again or continue without it.
              </p>
            )}

            {/* Failed — marketing primary */}
            {einState === "failed" && isMarketingPrimary && (
              <div className="mt-3">
                <p className="text-sm text-text-tertiary leading-relaxed">
                  We couldn&apos;t verify this EIN. Marketing messages require a verified business identity. You can switch to a different use case to get started, or try a different EIN.
                </p>
                <button
                  type="button"
                  onClick={handleChooseDifferentVertical}
                  className="mt-2 text-sm text-text-tertiary hover:text-text-secondary hover:underline transition duration-100 ease-linear cursor-pointer"
                >
                  Choose a different use case
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </WizardStepShell>
  );
}
