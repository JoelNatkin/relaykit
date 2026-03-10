"use client";

import { useState } from "react";
import type { Message } from "@/data/messages";

/* ── Copy feedback hook ── */

function useCopyFeedback() {
  const [copied, setCopied] = useState(false);

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable
    }
  }

  return { copied, copy };
}

/* ── Helper: natural language list ── */

function naturalList(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

/* ── Inline icons ── */

function ClipboardIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/* ── CatalogOptIn component ── */

interface CatalogOptInProps {
  appName: string;
  website: string;
  /** All messages in the category */
  allMessages: Message[];
  /** IDs of currently selected (checked) messages */
  selectedIds: Set<string>;
}

export function CatalogOptIn({
  appName,
  website,
  allMessages,
  selectedIds,
}: CatalogOptInProps) {
  const { copied, copy } = useCopyFeedback();
  const nudgeCopy = useCopyFeedback();

  const displayName = appName || "Your App";
  const displayUrl = website || "yourapp.com";

  // Build consent labels from selected messages (or use generic when none selected)
  const selectedMessages = allMessages.filter((m) => selectedIds.has(m.id));
  const hasSelection = selectedMessages.length > 0;

  const transactionalLabels = selectedMessages
    .filter((m) => !m.expansionType)
    .map((m) => m.consentLabel);
  const marketingLabels = selectedMessages
    .filter((m) => m.expansionType === "marketing" || m.expansionType === "mixed")
    .map((m) => m.consentLabel);

  const hasMarketing = marketingLabels.length > 0;

  // Checkbox label — specific when messages selected, generic when not
  const checkboxLabel = hasSelection
    ? `I agree to receive ${naturalList([...transactionalLabels, ...marketingLabels])} text messages from ${displayName}.`
    : `I agree to receive text messages from ${displayName}.`;

  // Marketing consent checkbox — separate per CTIA
  const marketingCheckboxLabel = hasMarketing
    ? `I also agree to receive marketing messages from ${displayName}. You can opt out at any time.`
    : null;

  // Fine print — the single disclosure block with all CTIA-required elements
  const finePrint = `By opting in, you agree to receive automated text messages from ${displayName}. Consent is not a condition of purchase. Message and data rates may apply. Message frequency varies. Text STOP to opt out at any time. Text HELP for help. Privacy Policy: ${displayUrl}/privacy. Terms of Service: ${displayUrl}/terms.`;

  // Build full copyable block
  function buildCopyText(): string {
    const lines: string[] = [
      `--- Opt-in consent form for ${displayName} ---`,
      "",
      "Consent checkbox:",
      checkboxLabel,
    ];
    if (marketingCheckboxLabel) {
      lines.push("", "Marketing consent checkbox:", marketingCheckboxLabel);
    }
    lines.push("", "Disclosure / fine print:", finePrint);
    lines.push(
      "",
      `Privacy Policy: ${displayUrl}/privacy`,
      `Terms of Service: ${displayUrl}/terms`
    );
    return lines.join("\n");
  }

  const nudgeText = "Build my opt-in form using this consent language.";

  return (
    <div className="rounded-2xl border border-border-secondary bg-bg-secondary shadow-sm overflow-hidden">
      {/* Copy button bar */}
      <div className="flex items-center justify-end px-5 py-2.5 border-b border-border-secondary bg-bg-primary">
        <button
          type="button"
          onClick={() => copy(buildCopyText())}
          className="text-fg-quaternary hover:text-fg-secondary transition duration-100 ease-linear cursor-pointer"
          aria-label={copied ? "Copied" : "Copy consent block"}
        >
          {copied ? (
            <CheckIcon className="text-fg-success-secondary" />
          ) : (
            <ClipboardIcon />
          )}
        </button>
      </div>

      {/* Form preview */}
      <div className="bg-bg-primary px-7 py-6">
        {/* Fake form fields */}
        <div className="space-y-3 mb-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">
              Name
            </label>
            <div className="w-full rounded-lg border border-border-primary bg-bg-primary px-3.5 py-2.5 text-sm text-text-placeholder shadow-xs">
              Jane Doe
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">
              Phone number
            </label>
            <div className="w-full rounded-lg border border-border-primary bg-bg-primary px-3.5 py-2.5 text-sm text-text-placeholder shadow-xs">
              (555) 123-4567
            </div>
          </div>
        </div>

        {/* Consent checkbox — same small font as fine print */}
        <label className="flex items-start gap-2.5 text-xs text-text-secondary cursor-pointer">
          <div className="mt-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border border-border-primary bg-bg-primary">
            {/* Unchecked by default — compliance requirement */}
          </div>
          <span className="leading-relaxed">{checkboxLabel}</span>
        </label>

        {/* Marketing consent checkbox — separate per CTIA */}
        {marketingCheckboxLabel && (
          <label className="mt-3 flex items-start gap-2.5 text-xs text-text-secondary cursor-pointer">
            <div className="mt-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border border-border-primary bg-bg-primary">
              {/* Unchecked by default */}
            </div>
            <span className="leading-relaxed">{marketingCheckboxLabel}</span>
          </label>
        )}

        {/* Fine print */}
        <p className="mt-4 text-xs text-text-tertiary leading-relaxed">
          {finePrint}
        </p>

        {/* Legal links */}
        <p className="mt-3 space-x-3">
          <a href="#" className="text-xs text-text-brand-secondary underline">
            Privacy Policy
          </a>
          <a href="#" className="text-xs text-text-brand-secondary underline">
            Terms of Service
          </a>
        </p>

        {/* CTA button */}
        <button
          type="button"
          className="mt-5 w-full rounded-lg bg-[#61656C] py-2.5 text-sm font-semibold text-white shadow-xs transition duration-100 ease-linear hover:bg-[#4E5258]"
        >
          Sign up for messages
        </button>
      </div>

      {/* Prompt nudge — quoted with inline copy icon */}
      <div className="px-5 py-3 border-t border-border-secondary">
        <span className="text-xs text-text-quaternary italic">
          &ldquo;{nudgeText}&rdquo;
        </span>
        <button
          type="button"
          onClick={() => nudgeCopy.copy(nudgeText)}
          className="inline-flex align-middle ml-1 text-fg-quaternary hover:text-fg-secondary transition duration-100 ease-linear cursor-pointer"
          aria-label={nudgeCopy.copied ? "Copied" : "Copy prompt"}
        >
          {nudgeCopy.copied ? (
            <CheckIcon className="text-fg-success-secondary" />
          ) : (
            <ClipboardIcon />
          )}
        </button>
      </div>
    </div>
  );
}
