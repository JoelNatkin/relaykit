"use client";

import { useMemo, useState } from "react";
import {
  USE_CASES,
  type UseCaseId,
  type ScopeItem,
} from "../../lib/intake/use-case-data";
import {
  generateTemplates,
  generateComplianceSlug,
} from "../../lib/intake/templates";
import { formatPhone } from "../../lib/intake/validation";

// --- Inline SVG icons (no Untitled UI in prototype) ---

function CheckIcon() {
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

function XIcon() {
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

function CheckCircleIcon() {
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
        d="M5 8L7 10L11 6M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={className ?? "size-4 shrink-0"}
      aria-hidden="true"
    >
      <path
        d="M4 6L8 10L12 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ModalCheckIcon() {
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

// --- Scope list item ---

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
        <span className="mt-0.5 text-green-600">
          <CheckIcon />
        </span>
      ) : (
        <span className="mt-0.5 text-amber-500">
          <XIcon />
        </span>
      )}
      <span className="text-text-tertiary">{text}</span>
    </li>
  );
}

// --- FAQ accordion ---

function FaqAccordion({
  useCaseLabel,
  includedItems,
  notIncludedItems,
  selectedExpansions,
}: {
  useCaseLabel: string;
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
        <p className="pb-3 text-sm text-text-tertiary">
          These are typical messages for your category. Your actual messages can
          be different — carriers just want to understand the general type of
          texts you&apos;ll send, not the exact wording.
        </p>
      ),
    },
    {
      question: "Can I change my messages later?",
      content: (
        <p className="pb-3 text-sm text-text-tertiary">
          Yes. You have flexibility to adjust your messaging anytime after
          approval, as long as it fits the use case you registered for.
        </p>
      ),
    },
    {
      question: "What does this registration cover?",
      content: (
        <div className="flex flex-col gap-2 pb-3 text-sm text-text-tertiary">
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
    <div className="flex flex-col divide-y divide-border-secondary">
      {items.map((item, i) => (
        <div key={i}>
          <button
            type="button"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="flex w-full items-center justify-between py-2.5 text-left"
          >
            <span className="text-sm text-text-tertiary">{item.question}</span>
            <ChevronDownIcon
              className={`size-4 shrink-0 text-text-quaternary transition duration-100 ease-linear ${
                openIndex === i ? "rotate-180" : ""
              }`}
            />
          </button>
          {openIndex === i && item.content}
        </div>
      ))}
    </div>
  );
}

// --- Detail row ---

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <span className="text-sm text-text-tertiary">{label}</span>
      <span className="text-sm font-medium text-text-primary text-right">
        {value}
      </span>
    </div>
  );
}

// --- Main component ---

export interface ReviewConfirmProps {
  businessDetails: Record<string, string>;
  useCaseId: UseCaseId;
  selectedExpansions: string[];
  onEditDetails: () => void;
}

export function ReviewConfirm({
  businessDetails,
  useCaseId,
  selectedExpansions,
  onEditDetails,
}: ReviewConfirmProps) {
  const [monitoringConsent, setMonitoringConsent] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const bd = businessDetails;
  const useCase = USE_CASES[useCaseId];

  // Generate templates
  const templates = useMemo(() => {
    return generateTemplates({
      use_case: useCaseId,
      business_name: bd.business_name ?? "",
      business_description: bd.business_description ?? "",
      service_type: bd.service_type || undefined,
      product_type: bd.product_type || undefined,
      app_name: bd.app_name || undefined,
      community_name: bd.community_name || undefined,
      venue_type: bd.venue_type || undefined,
    });
  }, [useCaseId, bd]);

  const complianceSlug = useMemo(
    () => generateComplianceSlug(bd.business_name ?? ""),
    [bd.business_name],
  );

  const isEinRegistration = bd.has_ein === "yes";

  // Build display values
  const businessType =
    isEinRegistration && bd.business_type ? bd.business_type : "Sole Proprietor";
  const contactName = `${bd.first_name ?? ""} ${bd.last_name ?? ""}`.trim();
  const formattedPhone = bd.phone ? formatPhone(bd.phone) : "";
  const fullAddress = [
    bd.address_line1,
    bd.address_city,
    `${bd.address_state ?? ""} ${bd.address_zip ?? ""}`.trim(),
  ]
    .filter(Boolean)
    .join(", ");

  function handleStartRegistration() {
    setIsModalOpen(true);
  }

  function handleConfirmCheckout() {
    console.log("Checkout triggered", {
      businessDetails,
      useCaseId,
      selectedExpansions,
      monitoringConsent,
    });
    setIsModalOpen(false);
  }

  if (!useCase) {
    return (
      <p className="text-sm text-text-tertiary">
        Unknown use case: {useCaseId}
      </p>
    );
  }

  const detailRows = [
    { label: "Business", value: bd.business_name ?? "" },
    { label: "Type", value: businessType },
    { label: "Contact", value: contactName },
    { label: "Email", value: bd.email ?? "" },
    { label: "Phone", value: formattedPhone },
    { label: "Address", value: fullAddress },
    { label: "Use case", value: useCase.label },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* LEFT COLUMN — Your details */}
        <div className="rounded-xl border border-border-secondary bg-bg-primary">
          <div className="flex items-center justify-between border-b border-border-secondary px-5 py-3">
            <h3 className="text-lg font-semibold text-text-primary">
              Your details
            </h3>
            <button
              type="button"
              onClick={onEditDetails}
              className="text-sm font-semibold text-text-brand-secondary transition duration-100 ease-linear hover:text-text-brand-primary"
            >
              Edit
            </button>
          </div>
          <div className="flex flex-col divide-y divide-border-secondary px-5">
            {detailRows.map((row) => (
              <DetailRow key={row.label} label={row.label} value={row.value} />
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN — What happens next */}
        <div className="rounded-xl border border-border-secondary bg-bg-secondary p-5">
          <h3 className="text-lg font-semibold text-text-primary">
            What happens next
          </h3>
          <ol className="mt-4 flex flex-col gap-3">
            <li className="flex gap-2.5 text-sm text-text-secondary">
              <span className="shrink-0 font-semibold text-text-primary">1.</span>
              We submit your registration to carriers — typically approved in a few days.
            </li>
            <li className="flex gap-2.5 text-sm text-text-secondary">
              <span className="shrink-0 font-semibold text-text-primary">2.</span>
              You&apos;ll get a live API key and a dedicated phone number.
            </li>
            <li className="flex gap-2.5 text-sm text-text-secondary">
              <span className="shrink-0 font-semibold text-text-primary">3.</span>
              Swap your sandbox key for your live key — same code, same endpoint.
            </li>
          </ol>
        </div>
      </div>

      {/* Pricing breakdown card */}
      <div className="rounded-xl border border-border-secondary bg-bg-primary p-5">
        <div className="flex flex-col gap-3">
          <h3 className="text-md font-semibold text-text-primary">
            Pricing breakdown
          </h3>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-tertiary">Registration submission</span>
              <span className="font-semibold text-text-primary">$49</span>
            </div>
            <div className="border-t border-border-secondary pt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-text-primary">
                  Due today
                </span>
                <span className="font-semibold text-text-primary">$49</span>
              </div>
            </div>
          </div>
          <p className="mt-1 text-xs text-text-tertiary leading-relaxed">
            After approval, pay $150 + $19/mo to activate your live API key and dedicated phone number. 500 messages included monthly. Additional messages $15 per 1,000. Not approved? Full refund.
          </p>
        </div>
      </div>

      {/* Monitoring consent checkbox */}
      <div className="rounded-xl border border-border-secondary bg-bg-primary p-5">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={monitoringConsent}
            onChange={(e) => setMonitoringConsent(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
          />
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-text-primary">
              I understand that RelayKit monitors outbound messages
            </span>
            <span className="text-sm text-text-tertiary">
              RelayKit enforces compliance on outbound messages to protect your
              phone number from carrier suspension and maintain platform
              integrity for all users.
            </span>
          </div>
        </label>
      </div>

      {/* Start registration button */}
      <div className="flex justify-end">
        <button
          type="button"
          disabled={!monitoringConsent}
          onClick={handleStartRegistration}
          className={`rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition duration-100 ease-linear ${
            monitoringConsent
              ? "bg-purple-600 hover:bg-purple-700"
              : "bg-purple-300 cursor-not-allowed"
          }`}
        >
          Start my registration — $49
        </button>
      </div>

      {/* Confirmation modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-text-primary">
              Before you pay, double-check your details
            </h2>
            <p className="mt-2 text-sm text-text-tertiary">
              If anything doesn&apos;t match your official records, your
              registration could be delayed or rejected.
            </p>

            <ul className="mt-5 flex flex-col gap-2.5 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-text-tertiary">
                  <ModalCheckIcon />
                </span>
                Business name matches your legal name exactly
              </li>
              {isEinRegistration && (
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-text-tertiary">
                    <ModalCheckIcon />
                  </span>
                  EIN matches your IRS records
                </li>
              )}
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-text-tertiary">
                  <ModalCheckIcon />
                </span>
                {isEinRegistration
                  ? "Address matches your business registration"
                  : "Address is current and accurate"}
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-text-tertiary">
                  <ModalCheckIcon />
                </span>
                Email and phone number are ones you actively monitor
              </li>
            </ul>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 rounded-lg border border-border-secondary bg-bg-primary px-4 py-2.5 text-sm font-semibold text-text-primary transition duration-100 ease-linear hover:bg-bg-secondary"
              >
                Go back and check
              </button>
              <button
                type="button"
                onClick={handleConfirmCheckout}
                className="flex-1 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition duration-100 ease-linear hover:bg-purple-700"
              >
                Everything looks good
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
