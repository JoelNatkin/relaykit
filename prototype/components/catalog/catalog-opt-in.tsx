"use client";

import type { Message } from "@/data/messages";

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
}

export function CatalogOptIn({
  appName,
  website,
  allMessages,
}: CatalogOptInProps) {
  const displayName = appName || "Your App";
  const displayUrl = website || "yourapp.com";

  // Build consent labels from ALL messages in the category
  const transactionalLabels = allMessages
    .filter((m) => !m.expansionType)
    .map((m) => m.consentLabel);
  const marketingLabels = allMessages
    .filter((m) => m.expansionType === "marketing" || m.expansionType === "mixed")
    .map((m) => m.consentLabel);

  const hasMarketing = marketingLabels.length > 0;

  // Checkbox label — always lists all message types
  const checkboxLabel = `I agree to receive ${naturalList([...transactionalLabels, ...marketingLabels])} text messages from ${displayName}.`;

  // Marketing consent checkbox — separate per CTIA
  const marketingCheckboxLabel = hasMarketing
    ? `I also agree to receive marketing messages from ${displayName}. You can opt out at any time.`
    : null;

  // Fine print — tightened per D-172
  const finePrint = `By opting in, you agree to receive automated texts from ${displayName}. Consent is not a condition of purchase. Msg frequency varies. Msg & data rates may apply. Text STOP to opt out, HELP for help.`;

  return (
    <div className="rounded-2xl border border-border-secondary bg-bg-secondary shadow-sm overflow-hidden">
      {/* Form preview — visual only */}
      <div className="bg-bg-primary px-7 py-6">
        {/* Fake form fields */}
        <div className="space-y-3 mb-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">
              Name
            </label>
            <div className="w-full rounded-lg border border-border-primary bg-bg-primary px-3.5 py-2.5 text-sm text-text-placeholder shadow-xs">
              Enter name
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">
              Phone number
            </label>
            <div className="w-full rounded-lg border border-border-primary bg-bg-primary px-3.5 py-2.5 text-sm text-text-placeholder shadow-xs">
              Enter phone
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
          {finePrint}{" "}
          <span className="text-text-brand-secondary underline cursor-default">Privacy</span>
          {" · "}
          <span className="text-text-brand-secondary underline cursor-default">Terms</span>
        </p>

        {/* CTA button */}
        <button
          type="button"
          className="mt-5 w-full rounded-lg bg-[#61656C] py-2.5 text-sm font-semibold text-white shadow-xs transition duration-100 ease-linear hover:bg-[#4E5258]"
        >
          Sign up for messages
        </button>
      </div>
    </div>
  );
}
