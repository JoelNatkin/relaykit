"use client";

import { useState, useRef, useEffect } from "react";
import { CheckCircle, Edit05, RefreshCcw01 } from "@untitledui/icons";
import { cx } from "@/utils/cx";

interface ReviewPreviewCardProps {
  campaignDescription: string;
  sampleMessages: [string, string, string];
  originalDescription: string;
  originalMessages: [string, string, string];
  complianceSlug: string;
  onDescriptionChange: (value: string) => void;
  onSampleMessageChange: (index: number, value: string) => void;
  onRevertDescription: () => void;
  onRevertMessages: () => void;
}

function EditableText({
  value,
  onChange,
  multiline = false,
}: {
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
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
          if (draft !== value) {
            onChange(draft);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setDraft(value);
            setIsEditing(false);
          }
          if (e.key === "Enter" && !multiline) {
            e.preventDefault();
            setIsEditing(false);
            if (draft !== value) {
              onChange(draft);
            }
          }
        }}
        rows={multiline ? 4 : 2}
        className="w-full rounded-lg border border-brand bg-primary px-3 py-2 text-sm text-primary outline-none"
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
      )}
    >
      {value}
    </button>
  );
}

export function ReviewPreviewCard({
  campaignDescription,
  sampleMessages,
  originalDescription,
  originalMessages,
  complianceSlug,
  onDescriptionChange,
  onSampleMessageChange,
  onRevertDescription,
  onRevertMessages,
}: ReviewPreviewCardProps) {
  const descriptionEdited = campaignDescription !== originalDescription;
  const messagesEdited =
    sampleMessages[0] !== originalMessages[0] ||
    sampleMessages[1] !== originalMessages[1] ||
    sampleMessages[2] !== originalMessages[2];

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
                onClick={onRevertDescription}
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
            onChange={onDescriptionChange}
            multiline
          />
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
                onClick={onRevertMessages}
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
              <div key={i} className="flex gap-2">
                <span className="mt-2 shrink-0 text-sm text-tertiary">
                  {i + 1}.
                </span>
                <EditableText
                  value={msg}
                  onChange={(val) => onSampleMessageChange(i, val)}
                />
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
