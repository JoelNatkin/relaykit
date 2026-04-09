"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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

/* ── Demo business identity (D-303) ── */
export const DEMO_IDENTITY = {
  legalName: "Vaulted Press LLC",
  address: "123 Main St, Charleston, SC 29401",
  entityType: "LLC",
  state: "South Carolina",
};

export interface BusinessIdentity {
  legalName: string;
  address: string;
  entityType: string;
  state: string;
}

type EinState = "idle" | "verifying" | "verified" | "confirmed" | "collapsing" | "failed";
type VerifyingPhase = "primary" | "sources";
type StubMode = "default" | "verified" | "failed";

const DEMO_EIN_VERIFIED = "45-6789012";
const DEMO_EIN_FAILED = "12-3456789";

const OWNERSHIP_TOOLTIP_COPY =
  "Misrepresenting business identity will result in account termination.";

interface EinInlineVerifyProps {
  /** Called when the user checks "This is my business" */
  onVerified: (ein: string, identity: BusinessIdentity) => void;
  /** Called when the user cancels / collapses the form */
  onCancel: () => void;
  /** Optional class for the wrapper */
  className?: string;
}

export function EinInlineVerify({ onVerified, onCancel, className }: EinInlineVerifyProps) {
  const einInputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [einInput, setEinInput] = useState("");
  const [einState, setEinState] = useState<EinState>("idle");
  const [verifyingPhase, setVerifyingPhase] = useState<VerifyingPhase>("primary");
  const [formatError, setFormatError] = useState(false);
  const [stubMode, setStubMode] = useState<StubMode>("default");
  const [showOwnershipTooltip, setShowOwnershipTooltip] = useState(false);
  const [confirmedOwnership, setConfirmedOwnership] = useState(false);

  // Collapse animation: confirmed → collapsing → onVerified
  const startCollapse = useCallback(() => {
    const el = wrapperRef.current;
    if (!el) { onVerified(formatEin(einInput), DEMO_IDENTITY); return; }
    // Pin to current height, then transition to 0
    el.style.height = `${el.scrollHeight}px`;
    el.style.overflow = "hidden";
    requestAnimationFrame(() => {
      el.style.transition = "height 300ms ease-out, opacity 300ms ease-out";
      el.style.height = "0px";
      el.style.opacity = "0";
    });
  }, [einInput, onVerified]);

  // When collapsing state is entered, start the collapse after a frame
  useEffect(() => {
    if (einState !== "collapsing") return;
    startCollapse();
    const timer = setTimeout(() => {
      onVerified(formatEin(einInput), DEMO_IDENTITY);
    }, 320);
    return () => clearTimeout(timer);
  }, [einState, startCollapse, einInput, onVerified]);

  const einDigits = einInput.replace(/\D/g, "");
  const formatted = formatEin(einInput);
  const canVerify = einDigits.length === 9 && (einState === "idle" || einState === "failed");

  function handleEinChange(raw: string) {
    setFormatError(false);
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
    setTimeout(() => {
      setVerifyingPhase("sources");
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
    requestAnimationFrame(() => einInputRef.current?.focus());
  }

  function handleOwnershipChange(checked: boolean) {
    setConfirmedOwnership(checked);
    if (checked) {
      // Confirmed state: show checkmark for 800ms, then collapse
      setEinState("confirmed");
      setTimeout(() => setEinState("collapsing"), 800);
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

  const verifyButtonText =
    einState === "verifying"
      ? verifyingPhase === "primary"
        ? "Verifying\u2026"
        : "Checking sources\u2026"
      : "Verify";

  return (
    <div ref={wrapperRef} className={className} style={{ animation: "wizardFadeIn 200ms ease-out" }}>
      {/* Label row with Cancel + prototype stub switcher */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <label htmlFor="ein-inline" className="text-sm font-medium text-text-secondary">
            Business tax ID (EIN)
          </label>
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-text-tertiary hover:text-text-secondary hover:underline transition duration-100 ease-linear cursor-pointer"
          >
            Cancel
          </button>
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

      {/* Input row — hidden when verified/confirmed/collapsing */}
      {einState !== "verified" && einState !== "confirmed" && einState !== "collapsing" && (
        <div className="flex items-start gap-2">
          <input
            ref={einInputRef}
            id="ein-inline"
            type="text"
            inputMode="numeric"
            autoFocus
            value={formatted}
            onChange={(e) => handleEinChange(e.target.value)}
            onBlur={handleEinBlur}
            placeholder="XX-XXXXXXX"
            disabled={einState === "verifying"}
            className="min-w-0 flex-1 rounded-lg border border-border-primary bg-bg-primary px-3 py-2.5 text-sm text-text-primary placeholder:text-text-placeholder shadow-xs focus:border-border-brand focus:outline-none focus:ring-2 focus:ring-border-brand/20 disabled:bg-bg-secondary disabled:text-text-tertiary"
          />
          <button
            type="button"
            onClick={handleVerify}
            disabled={!canVerify && einState !== "verifying"}
            className="rounded-lg bg-bg-brand-solid px-3 py-2.5 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover disabled:cursor-not-allowed disabled:bg-bg-disabled disabled:text-text-disabled cursor-pointer shrink-0"
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

      {/* Verified / Confirmed / Collapsing — business identity card */}
      {(einState === "verified" || einState === "confirmed" || einState === "collapsing") && (
        <div className="relative rounded-lg border border-border-secondary bg-bg-secondary px-4 py-3 pr-10">
          {einState === "verified" && (
            <button
              type="button"
              onClick={handleDismissVerified}
              aria-label="Dismiss — this is not my business"
              className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded text-text-tertiary hover:text-text-secondary hover:bg-bg-primary transition duration-100 ease-linear cursor-pointer"
            >
              <XIcon />
            </button>
          )}
          <p className="text-sm font-medium text-text-primary">{DEMO_IDENTITY.legalName}</p>
          <p className="mt-0.5 text-sm text-text-tertiary">{DEMO_IDENTITY.address}</p>
          <p className="mt-0.5 text-sm text-text-tertiary">
            {DEMO_IDENTITY.entityType} &middot; {DEMO_IDENTITY.state}
          </p>
          <div className="mt-3 border-t border-border-tertiary pt-3">
            {(einState === "confirmed" || einState === "collapsing") ? (
              <div className="flex items-center gap-2 text-sm text-text-success-primary">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M5.5 8L7.2 9.7L10.5 6.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Confirmed
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmedOwnership}
                    onChange={(e) => handleOwnershipChange(e.target.checked)}
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
                    <div className="absolute right-0 bottom-full mb-1 z-[100] rounded-lg bg-[#333333] px-3 py-2 text-xs text-white shadow-lg min-w-[200px] max-w-[240px] whitespace-normal leading-relaxed pointer-events-none">
                      {OWNERSHIP_TOOLTIP_COPY}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Failed */}
      {einState === "failed" && (
        <p className="mt-2 text-xs text-text-tertiary leading-relaxed">
          We couldn&apos;t verify this EIN. You can try again or cancel.
        </p>
      )}
    </div>
  );
}
