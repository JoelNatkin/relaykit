"use client";

import { useState } from "react";
import { CheckCircle, ChevronDown } from "@untitledui/icons";
import { cx } from "@/utils/cx";
import type { ScopeItem } from "@/lib/intake/use-case-data";

interface ReviewPreviewCardProps {
  campaignDescription: string;
  sampleMessages: [string, string, string];
  sampleMessageLabels: [string, string, string];
  complianceSlug: string;
  useCaseLabel: string;
  expansionLabels: string[];
  includedItems: string[];
  notIncludedItems: ScopeItem[];
  selectedExpansions: string[];
}

function ScopeCheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="size-4 shrink-0"
      aria-hidden="true"
    >
      <path
        d="M13.3334 4L6.00008 11.3333L2.66675 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ScopeXIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="size-4 shrink-0"
      aria-hidden="true"
    >
      <path
        d="M12 4L4 12M4 4L12 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ScopeListItem({
  text,
  isIncluded,
}: {
  text: string;
  isIncluded: boolean;
}) {
  return (
    <li className="flex items-start gap-2 text-sm">
      {isIncluded ? (
        <span className="mt-0.5 text-fg-success-secondary">
          <ScopeCheckIcon />
        </span>
      ) : (
        <span className="mt-0.5 text-fg-warning-secondary">
          <ScopeXIcon />
        </span>
      )}
      <span className="text-tertiary">{text}</span>
    </li>
  );
}

function FaqAccordion({
  useCaseLabel,
  expansionLabels,
  includedItems,
  notIncludedItems,
  selectedExpansions,
}: {
  useCaseLabel: string;
  expansionLabels: string[];
  includedItems: string[];
  notIncludedItems: ScopeItem[];
  selectedExpansions: string[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const label = useCaseLabel.toLowerCase();

  const items: { question: string; content: React.ReactNode }[] = [
    {
      question: "What if my messages look different from these?",
      content: (
        <p className="pb-3 text-sm text-tertiary">
          These are typical messages for your category. Your actual messages can
          be different — carriers just want to understand the general type of
          texts you&apos;ll send, not the exact wording.
        </p>
      ),
    },
    {
      question: "Can I change my messages later?",
      content: (
        <p className="pb-3 text-sm text-tertiary">
          Yes. You have flexibility to adjust your messaging anytime after
          approval, as long as it fits the use case you registered for.
        </p>
      ),
    },
    {
      question: "What does this registration cover?",
      content: (
        <div className="flex flex-col gap-2 pb-3 text-sm text-tertiary">
          <p>
            Your registration covers {label}. That means you can send:
          </p>
          <ul className="flex flex-col gap-2">
            {includedItems.map((item) => (
              <ScopeListItem key={item} text={item} isIncluded />
            ))}
            {notIncludedItems.map((item) => {
              const unlocked =
                item.unlockedBy !== undefined &&
                item.unlockedBy.some((id) => selectedExpansions.includes(id));
              return (
                <ScopeListItem
                  key={item.text}
                  text={item.text}
                  isIncluded={unlocked}
                />
              );
            })}
          </ul>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col divide-y divide-secondary">
      {items.map((item, i) => (
        <div key={i}>
          <button
            type="button"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="flex w-full items-center justify-between py-2.5 text-left"
          >
            <span className="text-sm text-tertiary">{item.question}</span>
            <ChevronDown
              className={cx(
                "size-4 shrink-0 text-fg-quaternary transition duration-100 ease-linear",
                openIndex === i && "rotate-180",
              )}
            />
          </button>
          {openIndex === i && item.content}
        </div>
      ))}
    </div>
  );
}

export function ReviewPreviewCard({
  campaignDescription,
  sampleMessages,
  sampleMessageLabels,
  complianceSlug,
  useCaseLabel,
  expansionLabels,
  includedItems,
  notIncludedItems,
  selectedExpansions,
}: ReviewPreviewCardProps) {
  return (
    <div className="rounded-xl border border-secondary bg-secondary">
      <div className="border-b border-secondary px-5 py-3">
        <h3 className="text-lg font-semibold text-primary">
          What we&apos;ll submit
        </h3>
      </div>

      <div className="flex flex-col gap-5 p-5">
        {/* Campaign description */}
        <div className="flex flex-col gap-2.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-tertiary">
            Campaign description
          </span>
          <p className="text-sm text-primary">{campaignDescription}</p>
        </div>

        {/* Sample messages */}
        <div className="flex flex-col gap-2.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-tertiary">
            Sample messages
          </span>
          <div className="flex flex-col gap-3">
            {sampleMessages.map((msg, i) => (
              <div key={i} className="flex flex-col gap-1">
                <span className="text-sm text-tertiary">
                  {sampleMessageLabels[i]}
                </span>
                <p className="text-sm text-primary">{msg}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ accordion */}
        <FaqAccordion
          useCaseLabel={useCaseLabel}
          expansionLabels={expansionLabels}
          includedItems={includedItems}
          notIncludedItems={notIncludedItems}
          selectedExpansions={selectedExpansions}
        />

        {/* Compliance website */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-tertiary">
            Compliance website
          </span>
          <p className="text-sm text-tertiary">
            We&apos;ll create a page at{" "}
            <span className="font-medium text-primary">
              {complianceSlug}.relaykit.co
            </span>{" "}
            with:
          </p>
          <div className="flex flex-col gap-2">
            {[
              "Privacy policy (with required mobile data language)",
              "Terms of service (with messaging disclosures)",
              "SMS opt-in form (with all carrier-required elements)",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 size-4 shrink-0 text-fg-success-secondary" />
                <span className="text-sm text-tertiary">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* What happens next */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-tertiary">
            What happens next
          </span>
          <ol className="flex flex-col gap-1">
            {[
              "You pay $199",
              "We submit your registration to US carriers (usually 2\u20137 days)",
              "You get an integration kit to add SMS to your app",
            ].map((step, i) => (
              <li key={i} className="flex gap-2 text-sm text-tertiary">
                <span className="shrink-0 font-medium text-primary">
                  {i + 1}.
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
