"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AlertCircle, CheckCircle, Edit05, RefreshCcw01 } from "@untitledui/icons";
import { cx } from "@/utils/cx";

interface ReviewPreviewCardProps {
  campaignDescription: string;
  sampleMessages: [string, string, string];
  originalDescription: string;
  originalMessages: [string, string, string];
  businessName: string;
  complianceSlug: string;
  onDescriptionChange: (value: string) => void;
  onSampleMessageChange: (index: number, value: string) => void;
  onRevertDescription: () => void;
  onRevertMessages: () => void;
  onValidationChange: (hasErrors: boolean) => void;
}

function EditableText({
  value,
  onChange,
  multiline = false,
  isInvalid = false,
}: {
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  isInvalid?: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  if (isEditing) {
    return (
      <textarea
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          setIsEditing(false);
          onChange(draft);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setDraft(value);
            setIsEditing(false);
          }
          if (e.key === "Enter" && !multiline) {
            e.preventDefault();
            setIsEditing(false);
            onChange(draft);
          }
        }}
        rows={multiline ? 4 : 2}
        className={cx(
          "w-full rounded-lg border bg-primary px-3 py-2 text-sm text-primary outline-none",
          isInvalid ? "border-error" : "border-brand",
        )}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        setDraft(value);
        setIsEditing(true);
      }}
      className={cx(
        "w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm text-primary",
        "transition duration-100 ease-linear hover:bg-secondary",
        isInvalid && "ring-1 ring-error",
      )}
    >
      {value}
    </button>
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

export function ReviewPreviewCard({
  campaignDescription,
  sampleMessages,
  originalDescription,
  originalMessages,
  businessName,
  complianceSlug,
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

  const syncValidation = useCallback(
    (dErr: string | null, mErrs: (string | null)[]) => {
      onValidationChange(dErr !== null || mErrs.some((e) => e !== null));
    },
    [onValidationChange],
  );

  function handleDescriptionBlur(value: string) {
    const error = validateDescription(value);
    setDescError(error);
    syncValidation(error, msgErrors);
    onDescriptionChange(value);
  }

  function handleMessageBlur(index: number, value: string) {
    const { error, warning } = validateMessage(value, businessName);
    const nextErrors = [...msgErrors];
    nextErrors[index] = error;
    setMsgErrors(nextErrors);
    const nextWarnings = [...msgWarnings];
    nextWarnings[index] = warning;
    setMsgWarnings(nextWarnings);
    syncValidation(descError, nextErrors);
    onSampleMessageChange(index, value);
  }

  function handleRevertDescription() {
    setDescError(null);
    syncValidation(null, msgErrors);
    onRevertDescription();
  }

  function handleRevertMessages() {
    const cleared = [null, null, null] as (string | null)[];
    setMsgErrors(cleared);
    setMsgWarnings(cleared);
    syncValidation(descError, cleared);
    onRevertMessages();
  }

  return (
    <div className="rounded-xl border border-secondary bg-secondary">
      <div className="border-b border-secondary px-5 py-3">
        <h3 className="text-lg font-semibold text-primary">
          What we&apos;ll submit
        </h3>
      </div>

      <div className="flex flex-col gap-5 p-5">
        {/* Campaign description */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-tertiary">
              Campaign description
              <Edit05 className="size-3 text-fg-quaternary" />
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
          <EditableText
            value={campaignDescription}
            onChange={handleDescriptionBlur}
            multiline
            isInvalid={!!descError}
          />
          {descError && (
            <div className="flex items-center gap-1.5 px-3">
              <AlertCircle className="size-3.5 shrink-0 text-fg-error-secondary" />
              <span className="text-xs text-error-primary">{descError}</span>
            </div>
          )}
        </div>

        {/* Sample messages */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-tertiary">
              Sample messages
              <Edit05 className="size-3 text-fg-quaternary" />
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
                  <span className="mt-2 shrink-0 text-sm text-tertiary">
                    {i + 1}.
                  </span>
                  <EditableText
                    value={msg}
                    onChange={(val) => handleMessageBlur(i, val)}
                    isInvalid={!!msgErrors[i]}
                  />
                </div>
                {msgErrors[i] && (
                  <div className="flex items-center gap-1.5 pl-6">
                    <AlertCircle className="size-3.5 shrink-0 text-fg-error-secondary" />
                    <span className="text-xs text-error-primary">
                      {msgErrors[i]}
                    </span>
                  </div>
                )}
                {msgWarnings[i] && !msgErrors[i] && (
                  <div className="flex items-center gap-1.5 pl-6">
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

        {/* Compliance website */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-tertiary">
            Compliance website
          </span>
          <p className="px-3 text-sm text-tertiary">
            We&apos;ll create a page at{" "}
            <span className="font-medium text-primary">
              {complianceSlug}.relaykit.co
            </span>{" "}
            with:
          </p>
          <div className="flex flex-col gap-1 px-3">
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
          <ol className="flex flex-col gap-1 px-3">
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
