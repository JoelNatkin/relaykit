"use client";

import { useSession } from "@/context/session-context";
import { MESSAGES } from "@/data/messages";

interface ConsentPreviewProps {
  categoryId: string;
  formHeading: string;
}

function naturalList(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

export function ConsentPreview({ categoryId, formHeading }: ConsentPreviewProps) {
  const { state } = useSession();

  const appName = state.appName || "Your App";
  const messages = MESSAGES[categoryId] ?? [];

  const enabledBase = messages.filter(
    (m) => m.tier !== "expansion" && state.enabledMessages[m.id]
  );

  const enabledExpansion = messages.filter(
    (m) => m.tier === "expansion" && state.enabledMessages[m.id]
  );

  const hasMarketingCheckbox = enabledExpansion.length > 0;
  const baseLabels = enabledBase.map((m) => m.consentLabel);

  return (
    <div className="overflow-hidden rounded-2xl border border-border-secondary bg-bg-secondary shadow-sm">
      <div className="bg-bg-primary px-7 py-8">
        {/* Category-specific heading */}
        <h3 className="text-2xl md:text-3xl font-normal text-text-secondary mb-6">
          {formHeading}
        </h3>

        {/* Fake form fields */}
        <div className="space-y-3 mb-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">Name</label>
            <div className="w-full rounded-lg border border-border-primary bg-bg-primary px-3.5 py-2.5 text-sm text-text-placeholder shadow-xs">
              Jane Doe
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">Phone number</label>
            <div className="w-full rounded-lg border border-border-primary bg-bg-primary px-3.5 py-2.5 text-sm text-text-placeholder shadow-xs">
              (555) 123-4567
            </div>
          </div>
        </div>

        {/* Consent paragraph — single merged block */}
        {baseLabels.length > 0 ? (
          <p className="text-sm text-text-secondary mb-4">
            By checking the box below, you agree to receive{" "}
            {naturalList(baseLabels)} from{" "}
            <strong>{appName}</strong> via text message. Reply STOP to opt out.{" "}
            <span className="text-text-tertiary">
              Message frequency varies. Msg &amp; data rates may apply.
            </span>
          </p>
        ) : (
          <p className="text-sm text-text-secondary mb-4">
            Toggle on at least one message type to see consent language.
          </p>
        )}

        {/* Transactional consent checkbox */}
        <label className="flex items-start gap-2 text-sm text-text-secondary cursor-pointer">
          <div className="mt-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border border-border-primary bg-bg-primary">
            <span className="text-xs text-text-brand-secondary">&#10003;</span>
          </div>
          <span>
            I agree to receive text messages from <strong>{appName}</strong>
          </span>
        </label>

        {/* Marketing consent checkbox — visible when any add-on is toggled on */}
        {hasMarketingCheckbox && (
          <label className="mt-3 flex items-start gap-2 text-sm text-text-secondary cursor-pointer">
            <div className="mt-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border border-border-primary bg-bg-primary">
              <span className="text-xs text-text-brand-secondary">&#10003;</span>
            </div>
            <span>
              I also agree to receive marketing messages from{" "}
              <strong>{appName}</strong>. You can opt out at any time.
            </span>
          </label>
        )}

        {/* Legal links */}
        <p className="mt-4 space-x-3">
          <a href="#" className="text-sm text-text-brand-secondary underline">
            Privacy Policy
          </a>
          <a href="#" className="text-sm text-text-brand-secondary underline">
            Terms of Service
          </a>
        </p>

        {/* CTA button — near-black */}
        <button
          type="button"
          className="mt-6 w-full rounded-lg bg-[#61656C] py-2.5 text-sm font-semibold text-white shadow-xs transition duration-100 ease-linear hover:bg-[#4E5258]"
        >
          Sign up for messages
        </button>
      </div>
    </div>
  );
}
