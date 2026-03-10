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

  const displayName = appName || "Your App";
  const displayUrl = website || "yourapp.com";

  // Build consent labels from selected messages
  const selectedMessages = allMessages.filter((m) => selectedIds.has(m.id));
  const transactionalLabels = selectedMessages
    .filter((m) => !m.expansionType)
    .map((m) => m.consentLabel);
  const marketingLabels = selectedMessages
    .filter((m) => m.expansionType === "marketing" || m.expansionType === "mixed")
    .map((m) => m.consentLabel);

  const hasMarketing = marketingLabels.length > 0;

  // Checkbox labels — short, no duplicate disclosure
  const allLabels = [...transactionalLabels, ...marketingLabels];
  const checkboxLabel = `I agree to receive ${naturalList(allLabels)} text messages from ${displayName}.`;

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

  return (
    <div className="rounded-2xl border border-border-secondary bg-bg-secondary shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border-secondary bg-bg-primary">
        <h3 className="text-sm font-semibold text-text-primary">
          Opt-in consent preview
        </h3>
        <button
          type="button"
          onClick={() => copy(buildCopyText())}
          className="text-xs font-medium text-text-quaternary hover:text-text-brand-secondary transition duration-100 ease-linear cursor-pointer"
        >
          {copied ? "Copied ✓" : "Copy consent block"}
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

        {/* Consent checkbox — short label */}
        <label className="flex items-start gap-2.5 text-sm text-text-secondary cursor-pointer">
          <div className="mt-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border border-border-primary bg-bg-primary">
            {/* Unchecked by default — compliance requirement */}
          </div>
          <span className="leading-relaxed">{checkboxLabel}</span>
        </label>

        {/* Marketing consent checkbox — separate per CTIA */}
        {marketingCheckboxLabel && (
          <label className="mt-3 flex items-start gap-2.5 text-sm text-text-secondary cursor-pointer">
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

      {/* Prompt nudge */}
      <div className="px-5 py-3 border-t border-border-secondary">
        <p className="text-xs text-text-quaternary italic">
          Ask your AI: Build my opt-in form using this consent language.
        </p>
      </div>
    </div>
  );
}
