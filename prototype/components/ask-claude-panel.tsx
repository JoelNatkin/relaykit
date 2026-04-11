"use client";

import { Plus, Stars02, XClose } from "@untitledui/icons";

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
      // Fixed position so the input stays visible at the bottom regardless
      // of page scroll. Right offset aligns with the right edge of the
      // max-w-5xl page content (matching the `mx-auto max-w-5xl px-6` wrapper
      // in DashboardLayout): 24px of inner padding, plus the centered gutter
      // on wide screens. The messages page reserves 500px of layout space
      // for this panel via an empty placeholder div.
      className="fixed z-30 w-[500px] flex flex-col overflow-hidden rounded-xl border border-border-secondary bg-bg-primary shadow-sm"
      style={{
        top: "5rem",
        bottom: "2.5rem",
        right: "max(1.5rem, calc((100vw - 64rem) / 2 + 1.5rem))",
      }}
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

      {/* Sticky bottom input — non-functional stub. Textarea + toolbar share
          one bordered container so they feel like a single chat composer. */}
      <div className="px-6 pt-4 pb-6 border-t border-border-secondary">
        <div className="rounded-lg border border-border-secondary bg-bg-primary shadow-xs transition duration-100 ease-linear focus-within:border-border-brand">
          <textarea
            rows={3}
            placeholder="Ask anything about your messages..."
            className="block w-full resize-none bg-transparent px-3 pt-2.5 pb-1 text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none"
          />
          <div className="flex items-center justify-between px-2 pb-2">
            <button
              type="button"
              onClick={(e) => e.preventDefault()}
              className="p-1 text-fg-tertiary hover:text-fg-secondary transition duration-100 ease-linear cursor-pointer"
              aria-label="Attach"
            >
              <Plus className="size-5" />
            </button>
            <button
              type="button"
              onClick={(e) => e.preventDefault()}
              className="p-1 text-text-brand-secondary hover:text-text-brand-secondary_hover transition duration-100 ease-linear cursor-pointer"
              aria-label="Send"
            >
              <Stars02 className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
