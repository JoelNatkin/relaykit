"use client";

import { Stars02, XClose } from "@untitledui/icons";

export interface AskClaudePanelProps {
  /** When present, the panel shows a "Focused on: X" line at the top of
   *  the scroll body — set by opening the panel from inside a message
   *  card's monitor expansion. */
  focusedMessageName?: string | null;
  onClose: () => void;
}

export function AskClaudePanel({ focusedMessageName, onClose }: AskClaudePanelProps) {
  return (
    <div
      className="w-[500px] shrink-0 self-start sticky top-20 flex flex-col overflow-hidden rounded-xl border border-border-secondary bg-bg-primary"
      style={{ maxHeight: "calc(100vh - 5rem)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <h2 className="text-lg font-semibold text-text-primary">Ask Claude</h2>
        <button
          type="button"
          onClick={onClose}
          className="p-1 -mr-1 text-fg-quaternary hover:text-fg-secondary transition duration-100 ease-linear cursor-pointer"
          aria-label="Close"
        >
          <XClose className="size-5" />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-6">
        {focusedMessageName && (
          <p className="mt-4 text-sm font-medium text-text-secondary">
            Focused on: {focusedMessageName}
          </p>
        )}

        <p className="mt-4 mb-6 text-sm text-text-secondary leading-relaxed">
          I know your messages and your business. Ask me about delivery issues,
          errors, or getting your integration working.
        </p>
      </div>

      {/* Sticky bottom input — non-functional stub */}
      <div className="px-6 pt-4 pb-6 border-t border-border-secondary">
        <div className="relative">
          <Stars02 className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-fg-brand-primary" />
          <input
            type="text"
            placeholder="Ask anything about your messages..."
            className="w-full rounded-lg border border-border-primary bg-bg-primary pl-9 pr-3 py-2 text-sm text-text-primary placeholder:text-text-placeholder shadow-xs focus:border-border-brand focus:outline-none transition duration-100 ease-linear"
          />
        </div>
      </div>
    </div>
  );
}
