"use client";

import { useSession } from "@/context/session-context";
import { MESSAGES } from "@/data/messages";

interface ConsentPreviewProps {
  categoryId: string;
}

export function ConsentPreview({ categoryId }: ConsentPreviewProps) {
  const { state } = useSession();

  const appName = state.appName || "Your App";
  const messages = MESSAGES[categoryId] ?? [];

  const enabledBase = messages.filter(
    (m) => m.tier !== "expansion" && state.enabledMessages[m.id]
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-border-secondary bg-bg-secondary shadow-sm">
      {/* Form content */}
      <div className="bg-bg-primary p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Sign up for messages</h3>

        {/* Fake form fields */}
        <div className="space-y-3 mb-5">
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

        <p className="text-sm text-text-secondary mb-3">
          By checking the box below, you agree to receive the following text
          messages from <strong>{appName}</strong>:
        </p>

        {/* Base message bullets */}
        <ul className="mb-4 space-y-1.5">
          {enabledBase.map((msg) => (
            <li
              key={msg.id}
              className="flex items-center text-sm text-text-secondary"
            >
              <span className="mr-2 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-bg-success-solid" />
              {msg.name}
            </li>
          ))}
        </ul>

        {/* Opt-out language */}
        <p className="text-sm text-text-secondary mb-2">
          Reply <span className="font-semibold text-text-error-primary">STOP</span> to
          any message to opt out.
        </p>

        {/* Frequency disclaimer */}
        <p className="text-xs text-text-placeholder mb-3">
          Message frequency varies. Message and data rates may apply.
        </p>

        {/* Links */}
        <p className="mb-4 space-x-3">
          <a href="#" className="text-xs text-text-brand-secondary underline">
            Privacy Policy
          </a>
          <a href="#" className="text-xs text-text-brand-secondary underline">
            Terms of Service
          </a>
        </p>

        {/* Checkbox */}
        <label className="flex items-start gap-2 text-sm text-text-secondary cursor-pointer">
          <div className="mt-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border border-border-primary bg-bg-primary">
            <span className="text-xs text-text-brand-secondary">&#10003;</span>
          </div>
          <span>
            I agree to receive text messages from <strong>{appName}</strong>
          </span>
        </label>

        {/* CTA button */}
        <button
          type="button"
          className="mt-5 w-full rounded-lg bg-bg-brand-solid py-2.5 text-sm font-semibold text-text-white shadow-xs transition duration-100 ease-linear hover:bg-bg-brand-solid_hover"
        >
          Sign up for messages
        </button>
      </div>
    </div>
  );
}
