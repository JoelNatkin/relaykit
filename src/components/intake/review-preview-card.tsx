"use client";

import { useState, useRef, useEffect } from "react";
import {
  AlertCircle,
  Check,
  CheckCircle,
  ChevronDown,
  Edit05,
  RefreshCcw01,
} from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";

interface ReviewPreviewCardProps {
  campaignDescription: string;
  sampleMessages: [string, string, string];
  originalDescription: string;
  originalMessages: [string, string, string];
  businessName: string;
  complianceSlug: string;
  useCaseLabel: string;
  expansionLabels: string[];
  onDescriptionChange: (value: string) => void;
  onSampleMessageChange: (index: number, value: string) => void;
  onRevertDescription: () => void;
  onRevertMessages: () => void;
  onValidationChange: (hasErrors: boolean) => void;
}

/** Textarea that auto-grows to fit content. */
function AutoTextarea({
  value,
  onChange,
  onBlur,
  minRows,
  isInvalid = false,
}: {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  minRows: number;
  isInvalid?: boolean;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      rows={minRows}
      className={cx(
        "w-full resize-none rounded-lg border bg-primary px-3 py-2 text-sm text-primary outline-none transition duration-100 ease-linear focus:border-brand",
        isInvalid ? "border-error" : "border-primary",
      )}
    />
  );
}

function validateDescription(value: string): string | null {
  if (!value.trim()) return "This field is required";
  if (value.length < 40) return "Minimum 40 characters";
  if (value.length > 4096) return "Maximum 4,096 characters";
  return null;
}

function validateMessage(
  value: string,
  businessName: string,
): { error: string | null; warning: string | null } {
  if (!value.trim()) return { error: "This field is required", warning: null };
  const hasName = value.toLowerCase().includes(businessName.toLowerCase());
  const hasStop = /\bstop\b/i.test(value);
  if (!hasName || !hasStop) {
    return {
      error: null,
      warning:
        "Sample messages should include your business name and a STOP opt-out option",
    };
  }
  return { error: null, warning: null };
}

function FaqAccordion({
  useCaseLabel,
  expansionLabels,
}: {
  useCaseLabel: string;
  expansionLabels: string[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function buildCoverageAnswer() {
    if (expansionLabels.length === 0) {
      return `Your registration covers ${useCaseLabel}. If you need to add more messaging types later, you can update your registration.`;
    }
    const joined =
      expansionLabels.length === 1
        ? expansionLabels[0]
        : expansionLabels.slice(0, -1).join(", ") +
          " and " +
          expansionLabels[expansionLabels.length - 1];
    return `Your registration covers ${useCaseLabel}, plus ${joined}.`;
  }

  const items = [
    {
      question: "Do I have to use these exact messages?",
      answer:
        "No. Carriers review your campaign description and sample messages to understand the type of texts you'll send, but they don't enforce exact wording. Your actual messages can differ as long as they match the described purpose.",
    },
    {
      question: "Can I change my messages later?",
      answer:
        "Yes. Once registered, you can update your campaign description and sample messages at any time through your dashboard. Changes are typically reviewed within 24 hours.",
    },
    {
      question: "What does this registration cover?",
      answer: buildCoverageAnswer(),
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
            <span className="text-sm text-tertiary">
              {item.question}
            </span>
            <ChevronDown
              className={cx(
                "size-4 shrink-0 text-fg-quaternary transition duration-100 ease-linear",
                openIndex === i && "rotate-180",
              )}
            />
          </button>
          {openIndex === i && (
            <p className="pb-3 text-sm text-tertiary">{item.answer}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export function ReviewPreviewCard({
  campaignDescription,
  sampleMessages,
  originalDescription,
  originalMessages,
  businessName,
  complianceSlug,
  useCaseLabel,
  expansionLabels,
  onDescriptionChange,
  onSampleMessageChange,
  onRevertDescription,
  onRevertMessages,
  onValidationChange,
}: ReviewPreviewCardProps) {
  const descriptionEdited = campaignDescription !== originalDescription;
  const messagesEdited =
    sampleMessages[0] !== originalMessages[0] ||
    sampleMessages[1] !== originalMessages[1] ||
    sampleMessages[2] !== originalMessages[2];

  // Card-level edit mode
  const [isEditing, setIsEditing] = useState(false);

  // Draft state (used while editing)
  const [descDraft, setDescDraft] = useState(campaignDescription);
  const [msgDrafts, setMsgDrafts] = useState<[string, string, string]>([
    ...sampleMessages,
  ]);

  // Validation state
  const [descError, setDescError] = useState<string | null>(null);
  const [msgErrors, setMsgErrors] = useState<(string | null)[]>([
    null,
    null,
    null,
  ]);
  const [msgWarnings, setMsgWarnings] = useState<(string | null)[]>([
    null,
    null,
    null,
  ]);

  // Sync validation state to parent
  useEffect(() => {
    onValidationChange(
      descError !== null || msgErrors.some((e) => e !== null),
    );
  }, [descError, msgErrors, onValidationChange]);

  // Sync drafts from props when not editing (handles undo)
  useEffect(() => {
    if (!isEditing) {
      setDescDraft(campaignDescription);
      setMsgDrafts([...sampleMessages]);
    }
  }, [campaignDescription, sampleMessages, isEditing]);

  function handleEdit() {
    setDescDraft(campaignDescription);
    setMsgDrafts([...sampleMessages]);
    setIsEditing(true);
  }

  function handleDone() {
    setIsEditing(false);
  }

  function handleDescBlur() {
    const error = validateDescription(descDraft);
    setDescError(error);
    if (descDraft !== campaignDescription) {
      onDescriptionChange(descDraft);
    }
  }

  function handleMsgBlur(index: number) {
    const value = msgDrafts[index];
    const { error, warning } = validateMessage(value, businessName);
    setMsgErrors((prev) => {
      const next = [...prev];
      next[index] = error;
      return next;
    });
    setMsgWarnings((prev) => {
      const next = [...prev];
      next[index] = warning;
      return next;
    });
    if (value !== sampleMessages[index]) {
      onSampleMessageChange(index, value);
    }
  }

  function updateMsgDraft(index: number, value: string) {
    setMsgDrafts((prev) => {
      const next = [...prev] as [string, string, string];
      next[index] = value;
      return next;
    });
  }

  function handleRevertDescription() {
    setDescError(null);
    setDescDraft(originalDescription);
    onRevertDescription();
  }

  function handleRevertMessages() {
    setMsgErrors([null, null, null]);
    setMsgWarnings([null, null, null]);
    setMsgDrafts([...originalMessages]);
    onRevertMessages();
  }

  return (
    <div className="rounded-xl border border-secondary bg-secondary">
      <div className="flex items-center justify-between border-b border-secondary px-5 py-3">
        <h3 className="text-lg font-semibold text-primary">
          What we&apos;ll submit
        </h3>
        {isEditing ? (
          <Button
            color="link-gray"
            size="sm"
            iconLeading={Check}
            onClick={handleDone}
          >
            Done
          </Button>
        ) : (
          <Button
            color="link-gray"
            size="sm"
            iconLeading={Edit05}
            onClick={handleEdit}
          >
            Edit
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-5 p-5">
        {/* Campaign description */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-tertiary">
              Campaign description
            </span>
            {descriptionEdited && (
              <button
                type="button"
                onClick={handleRevertDescription}
                title="Restore original"
                className="flex items-center gap-1 text-xs text-tertiary transition duration-100 ease-linear hover:text-secondary"
              >
                <RefreshCcw01 className="size-3" />
                Undo
              </button>
            )}
          </div>
          {isEditing ? (
            <AutoTextarea
              value={descDraft}
              onChange={setDescDraft}
              onBlur={handleDescBlur}
              minRows={4}
              isInvalid={!!descError}
            />
          ) : (
            <p className="text-sm text-primary">
              {campaignDescription}
            </p>
          )}
          {descError && (
            <div className="flex items-center gap-1.5">
              <AlertCircle className="size-3.5 shrink-0 text-fg-error-secondary" />
              <span className="text-xs text-error-primary">{descError}</span>
            </div>
          )}
        </div>

        {/* Sample messages */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-tertiary">
              Sample messages
            </span>
            {messagesEdited && (
              <button
                type="button"
                onClick={handleRevertMessages}
                title="Restore original"
                className="flex items-center gap-1 text-xs text-tertiary transition duration-100 ease-linear hover:text-secondary"
              >
                <RefreshCcw01 className="size-3" />
                Undo
              </button>
            )}
          </div>
          <div className="flex flex-col gap-2">
            {sampleMessages.map((msg, i) => (
              <div key={i} className="flex flex-col gap-1">
                <div className="flex gap-2">
                  <span
                    className={cx(
                      "shrink-0 text-sm text-tertiary",
                      isEditing ? "mt-2" : "mt-0.5",
                    )}
                  >
                    {i + 1}.
                  </span>
                  {isEditing ? (
                    <AutoTextarea
                      value={msgDrafts[i]}
                      onChange={(val) => updateMsgDraft(i, val)}
                      onBlur={() => handleMsgBlur(i)}
                      minRows={3}
                      isInvalid={!!msgErrors[i]}
                    />
                  ) : (
                    <p className="text-sm text-primary">{msg}</p>
                  )}
                </div>
                {msgErrors[i] && (
                  <div className="flex items-center gap-1.5">
                    <AlertCircle className="size-3.5 shrink-0 text-fg-error-secondary" />
                    <span className="text-xs text-error-primary">
                      {msgErrors[i]}
                    </span>
                  </div>
                )}
                {msgWarnings[i] && !msgErrors[i] && (
                  <div className="flex items-center gap-1.5">
                    <AlertCircle className="size-3.5 shrink-0 text-fg-warning-secondary" />
                    <span className="text-xs text-warning-primary">
                      {msgWarnings[i]}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* FAQ accordion */}
        <FaqAccordion
          useCaseLabel={useCaseLabel}
          expansionLabels={expansionLabels}
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
          <div className="flex flex-col gap-1">
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
