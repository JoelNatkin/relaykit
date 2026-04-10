"use client";

import { useState } from "react";
import { X } from "@untitledui/icons";

export interface TestPhone {
  id: string;
  name: string;
  phoneLast4: string;
  status: "verified" | "invited";
  /** Developer's own phone — can't be removed from the list. */
  isSelf?: boolean;
}

export const INITIAL_TEST_PHONES: TestPhone[] = [
  { id: "self-joel", name: "Joel", phoneLast4: "8842", status: "verified", isSelf: true },
  { id: "sarah", name: "Sarah", phoneLast4: "5519", status: "verified" },
  { id: "mike", name: "Mike", phoneLast4: "3301", status: "invited" },
];

export const MAX_TEST_PHONES = 5;

const STATUS_DOT: Record<TestPhone["status"], string> = {
  verified: "bg-fg-success-primary",
  invited: "bg-fg-quaternary",
};

const STATUS_LABEL: Record<TestPhone["status"], string> = {
  verified: "Verified",
  invited: "Invited",
};

export interface TestPhonesCardProps {
  phones: TestPhone[];
  onRemove: (id: string) => void;
  onInvite: (name: string, phone: string) => void;
}

export function TestPhonesCard({ phones, onRemove, onInvite }: TestPhonesCardProps) {
  const [isInviting, setIsInviting] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const canAddMore = phones.length < MAX_TEST_PHONES;
  const canSubmit = nameInput.trim().length > 0 && phoneInput.trim().length > 0 && !isSending;

  function handleSendInvite() {
    if (!canSubmit) return;
    setIsSending(true);
    // Stubbed 1.5s send. Production would dispatch an OTP via Twilio Verify.
    setTimeout(() => {
      onInvite(nameInput.trim(), phoneInput.trim());
      setIsSending(false);
      setIsInviting(false);
      setNameInput("");
      setPhoneInput("");
    }, 1500);
  }

  function handleCancelInvite() {
    if (isSending) return;
    setIsInviting(false);
    setNameInput("");
    setPhoneInput("");
  }

  return (
    <div className="rounded-xl bg-gray-50 p-6">
      <h3 className="text-base font-semibold text-text-primary">Test phones</h3>
      <p className="mt-1 text-sm text-text-tertiary">
        Send test messages to up to 5 people. Each person verifies their own number.
      </p>

      <ul className="mt-4 divide-y divide-border-secondary">
        {phones.map((phone) => (
          <li key={phone.id} className="group py-3 first:pt-0 last:pb-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-text-primary truncate">
                  {phone.name}
                </div>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <span
                    className={`inline-block size-1.5 rounded-full ${STATUS_DOT[phone.status]}`}
                  />
                  <span className="text-xs text-text-tertiary">
                    {STATUS_LABEL[phone.status]}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-sm text-text-tertiary whitespace-nowrap">
                  &middot;&middot;&middot;{phone.phoneLast4}
                </span>
                {/* Reserve 16px so phone positions stay consistent across rows
                    whether or not the row has a remove button. */}
                <div className="w-4 flex items-center justify-center">
                  {!phone.isSelf && (
                    <button
                      type="button"
                      onClick={() => onRemove(phone.id)}
                      className="opacity-0 group-hover:opacity-100 text-fg-quaternary hover:text-fg-secondary transition duration-100 ease-linear cursor-pointer"
                      aria-label={`Remove ${phone.name}`}
                    >
                      <X className="size-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {canAddMore && (
        isInviting ? (
          <div className="mt-4 space-y-2">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              disabled={isSending}
              placeholder="Name"
              className="w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-placeholder shadow-xs focus:border-border-brand focus:outline-none transition duration-100 ease-linear disabled:bg-bg-secondary disabled:cursor-not-allowed"
            />
            <input
              type="tel"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              disabled={isSending}
              placeholder="Phone"
              className="w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-placeholder shadow-xs focus:border-border-brand focus:outline-none transition duration-100 ease-linear disabled:bg-bg-secondary disabled:cursor-not-allowed"
            />
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleSendInvite}
                disabled={!canSubmit}
                className="rounded-lg border border-border-primary bg-bg-primary px-3 py-1.5 text-sm font-semibold text-text-secondary shadow-xs transition duration-100 ease-linear hover:bg-bg-secondary cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSending ? "Sending\u2026" : "Send invite"}
              </button>
              <button
                type="button"
                onClick={handleCancelInvite}
                disabled={isSending}
                className="text-sm text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsInviting(true)}
            className="mt-3 text-sm font-semibold text-text-brand-secondary hover:text-text-brand-secondary_hover transition duration-100 ease-linear cursor-pointer"
          >
            + Invite someone
          </button>
        )
      )}
    </div>
  );
}
