"use client";

import type { Message } from "@/data/messages";

/* ── Category → consent word ──
   The checkbox names the category, not every individual message type.
   Fine print covers the TCPA disclosure details. Matches PRD_02 opt-in
   language pattern. */
const CATEGORY_CONSENT_WORD: Record<string, string> = {
  appointments: "appointment",
  verification: "verification",
  orders: "order",
  support: "support",
  marketing: "marketing",
  community: "community",
  waitlist: "waitlist",
  internal: "team alert",
  exploring: "exploring",
};

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

  const categoryId = allMessages[0]?.categoryId || "appointments";
  const categoryWord = CATEGORY_CONSENT_WORD[categoryId] || categoryId;
  const hasMarketing = allMessages.some(
    (m) => m.expansionType === "marketing" || m.expansionType === "mixed"
  );

  // Checkbox label — names the category and the business, not each message type
  const checkboxLabel = `I agree to receive ${categoryWord} text messages from ${displayName}.`;

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
          <span className="leading-snug">{checkboxLabel}</span>
        </label>

        {/* Marketing consent checkbox — separate per CTIA */}
        {marketingCheckboxLabel && (
          <label className="mt-3 flex items-start gap-2.5 text-xs text-text-secondary cursor-pointer">
            <div className="mt-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border border-border-primary bg-bg-primary">
              {/* Unchecked by default */}
            </div>
            <span className="leading-snug">{marketingCheckboxLabel}</span>
          </label>
        )}

        {/* Fine print */}
        <p className="mt-4 text-xs text-text-tertiary leading-snug">
          {finePrint}{" "}
          <span className="text-text-brand-secondary underline cursor-default">Privacy</span>
          {" · "}
          <span className="text-text-brand-secondary underline cursor-default">Terms</span>
        </p>

        {/* CTA button */}
        <button
          type="button"
          className="mt-5 w-full rounded-lg bg-[#98A2B3] py-2.5 text-sm font-semibold text-white shadow-xs transition duration-100 ease-linear hover:bg-[#7A808A]"
        >
          Sign up for messages
        </button>
      </div>
    </div>
  );
}
