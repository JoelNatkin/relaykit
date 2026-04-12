"use client";

import { useEffect } from "react";
import { Plus, Stars02, XClose } from "@untitledui/icons";

export interface AskClaudePanelProps {
  /** When present, the panel shows a "Focused on: X" line at the top of
   *  the scroll body — set by opening the panel from inside a message
   *  card's monitor expansion. */
  focusedMessageName?: string | null;
  onClose: () => void;
  /** Distance from viewport top to the first message card, measured by the
   *  parent via a ref so the desktop panel top-aligns with the card column. */
  topOffset?: number;
}

export function AskClaudePanel({ focusedMessageName, onClose, topOffset = 144 }: AskClaudePanelProps) {
  // Lock body scroll when the mobile overlay is active (<md). At md+ the
  // panel is inline and the page scrolls normally.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    if (mq.matches) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const content = (
    <>
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

      {/* Pinned bottom input — non-functional stub. Textarea + toolbar share
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
    </>
  );

  return (
    <>
      {/* Mobile (<md): fixed full-width overlay flush against the bottom
          of the top nav (h-14 = 56px = top-14). Covers everything below. */}
      <div className="md:hidden fixed inset-x-0 top-14 bottom-0 z-10 flex flex-col bg-bg-primary">
        {content}
      </div>

      {/* Desktop (md+): inline grid cell, sticky, with border */}
      <div
        className="hidden md:flex self-start sticky flex-col overflow-hidden rounded-xl border border-border-secondary bg-bg-primary shadow-sm"
        style={{
          top: `${topOffset}px`,
          height: `calc(100vh - ${topOffset}px - 2.5rem)`,
        }}
      >
        {content}
      </div>
    </>
  );
}
