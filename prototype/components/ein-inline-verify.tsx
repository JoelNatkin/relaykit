"use client";

import { useRef, useState } from "react";

/* ── Helpers ── */

function formatEin(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 9);
  if (d.length <= 2) return d;
  return `${d.slice(0, 2)}-${d.slice(2)}`;
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

type EinState = "idle" | "verifying" | "verified" | "failed";
type VerifyingPhase = "primary" | "sources";
type StubMode = "default" | "verified" | "failed";

interface EinInlineVerifyProps {
  /** Called when the user clicks Save after confirming ownership */
  onSave: (ein: string, identity: BusinessIdentity) => void;
  /** Called when the user clicks Cancel */
  onCancel: () => void;
  /** Optional class for the wrapper */
  className?: string;
}

export function EinInlineVerify({ onSave, onCancel, className }: EinInlineVerifyProps) {
  const einInputRef = useRef<HTMLInputElement>(null);

  const [einInput, setEinInput] = useState("");
  const [einState, setEinState] = useState<EinState>("idle");
  const [verifyingPhase, setVerifyingPhase] = useState<VerifyingPhase>("primary");
  const [formatError, setFormatError] = useState(false);
  const [confirmedOwnership, setConfirmedOwnership] = useState(false);
  const [stubMode, setStubMode] = useState<StubMode>("default");

  const einDigits = einInput.replace(/\D/g, "");
  const formatted = formatEin(einInput);
  const canVerify = einDigits.length === 9 && (einState === "idle" || einState === "failed");
  const canSave = einState === "verified" && confirmedOwnership;

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
        setEinState(stubMode === "failed" ? "failed" : "verified");
      }, 1500);
    }, 1000);
  }

  function handleSave() {
    if (canSave) {
      onSave(formatted, DEMO_IDENTITY);
    }
  }

  const verifyButtonText =
    einState === "verifying"
      ? verifyingPhase === "primary"
        ? "Verifying\u2026"
        : "Checking sources\u2026"
      : "Verify";

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold text-text-primary">Add your EIN</h3>
      <p className="mt-2 text-sm text-text-secondary leading-relaxed">
        Your Employer Identification Number (EIN) lets us verify your business for marketing messages.
      </p>

      {/* EIN input + Verify button — hidden once verified */}
      {einState !== "verified" && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="ein-inline" className="text-sm font-medium text-text-secondary">
              Business tax ID (EIN)
            </label>
            <select
              value={stubMode}
              onChange={(e) => setStubMode(e.target.value as StubMode)}
              className="text-xs text-text-quaternary bg-transparent border-none cursor-pointer focus:outline-none"
            >
              <option value="default">Default</option>
              <option value="verified">Verified</option>
              <option value="failed">Failed</option>
            </select>
          </div>
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
            className="rounded-lg border border-border-primary bg-bg-primary px-3 py-2.5 text-sm font-semibold text-text-secondary shadow-xs transition duration-100 ease-linear hover:bg-bg-secondary disabled:cursor-not-allowed disabled:bg-bg-disabled disabled:text-text-disabled cursor-pointer shrink-0"
          >
            {verifyButtonText}
          </button>
          </div>
        </div>
      )}

      {/* Format error */}
      {formatError && einState === "idle" && (
        <p className="mt-2 text-xs text-text-error-primary">
          EIN should be 9 digits (XX-XXXXXXX)
        </p>
      )}

      {/* Failed */}
      {einState === "failed" && (
        <div className="mt-2 rounded-lg bg-bg-error-secondary px-3 py-2">
          <p className="text-xs text-text-error-primary leading-relaxed">
            We couldn&apos;t verify this EIN. You can try again or continue without it.
          </p>
        </div>
      )}

      {/* Verified — business identity + checkbox */}
      {einState === "verified" && (
        <div className="mt-4">
          <div className="rounded-lg border border-border-secondary bg-bg-secondary px-4 py-3">
            <p className="text-sm font-medium text-text-primary">{DEMO_IDENTITY.legalName}</p>
            <p className="mt-0.5 text-sm text-text-tertiary">{DEMO_IDENTITY.address}</p>
            <p className="mt-0.5 text-sm text-text-tertiary">
              {DEMO_IDENTITY.entityType} &middot; {DEMO_IDENTITY.state}
            </p>
          </div>
          <label className="mt-3 flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
            <input
              type="checkbox"
              checked={confirmedOwnership}
              onChange={(e) => setConfirmedOwnership(e.target.checked)}
              className="h-4 w-4 flex-shrink-0 cursor-pointer accent-[color:var(--color-brand-600)]"
            />
            <span>This is my business</span>
          </label>
          <button
            type="button"
            onClick={() => { setEinState("idle"); setEinInput(""); setConfirmedOwnership(false); }}
            className="mt-2 text-sm text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear cursor-pointer"
          >
            Try a different EIN
          </button>
        </div>
      )}

      {/* Bottom row: Cancel + Save (right-aligned together) */}
      <div className="mt-5 flex items-center justify-end gap-5">
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!canSave}
          className="rounded-lg bg-bg-brand-solid px-4 py-2.5 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover disabled:cursor-not-allowed disabled:bg-[#D0D5DD] disabled:text-white/60 cursor-pointer"
        >
          Save
        </button>
      </div>
    </div>
  );
}
