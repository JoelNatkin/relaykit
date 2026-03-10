"use client";

import { useState } from "react";
import type { Message } from "@/data/messages";
import type { SessionState } from "@/context/session-context";
import {
  interpolateTemplate,
  getMessageNature,
  formatTrigger,
  formatCopyBlock,
  getPromptNudge,
} from "@/lib/catalog-helpers";

/* ── Nature badges (Transactional / Marketing) ── */

const NATURE_STYLES: Record<string, { className: string }> = {
  Transactional: {
    className: "bg-[#ECFDF3] border border-[#ABEFC6] text-[#067647]",
  },
  Marketing: {
    className: "bg-[#FEF6EE] border border-[#F9DBAF] text-[#B93815]",
  },
};

/* ── Inline variable styling — bold brand-purple, display only ── */

const VAR_CLASSES = "font-semibold text-[#7C3AED]";

/* ── Copy feedback ── */

function useCopyFeedback() {
  const [copied, setCopied] = useState(false);

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable
    }
  }

  return { copied, copy };
}

/* ── Icons (inline SVGs to avoid external deps) ── */

function ClipboardIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M8 7V11"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <circle cx="8" cy="5.25" r="0.75" fill="currentColor" />
    </svg>
  );
}

/* ── CatalogCard component ── */

interface CatalogCardProps {
  message: Message;
  categoryId: string;
  state: SessionState;
  isSelected: boolean;
  onToggleSelect: (messageId: string) => void;
  /** Page-level view mode — card can override locally */
  globalViewMode: "preview" | "template";
}

export function CatalogCard({
  message,
  categoryId,
  state,
  isSelected,
  onToggleSelect,
  globalViewMode,
}: CatalogCardProps) {
  const [localViewMode, setLocalViewMode] = useState<
    "preview" | "template" | null
  >(null);
  const [showTriggerTooltip, setShowTriggerTooltip] = useState(false);
  const { copied, copy } = useCopyFeedback();

  const viewMode = localViewMode ?? globalViewMode;
  const nature = getMessageNature(message);
  const natureStyle = NATURE_STYLES[nature];
  const promptNudge = getPromptNudge(message, categoryId);

  function handleCopy() {
    copy(formatCopyBlock(message, categoryId, state));
  }

  function toggleLocalView() {
    if (localViewMode === null) {
      // First click: override to the opposite of global
      setLocalViewMode(globalViewMode === "preview" ? "template" : "preview");
    } else {
      // Toggle back: clear local override (follow global)
      setLocalViewMode(null);
    }
  }

  /* ── Render message body ── */

  function renderPreview() {
    const segments = interpolateTemplate(message.template, categoryId, state);
    return (
      <p className="text-sm text-text-tertiary leading-relaxed">
        {segments.map((seg, i) =>
          seg.isVariable ? (
            <span key={i} className={VAR_CLASSES}>
              {seg.text}
            </span>
          ) : (
            <span key={i}>{seg.text}</span>
          )
        )}
      </p>
    );
  }

  function renderTemplate() {
    return (
      <p className="text-sm text-text-tertiary leading-relaxed font-mono">
        {message.template}
      </p>
    );
  }

  return (
    <div
      className={`rounded-xl border bg-bg-primary p-4 shadow-xs transition duration-100 ease-linear overflow-visible ${
        isSelected ? "border-border-brand" : "border-border-secondary"
      }`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        {/* Left: checkbox + name + badge */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Subtle checkbox */}
          <label className="flex-shrink-0 relative cursor-pointer">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelect(message.id)}
              className="peer sr-only"
              aria-label={`Select ${message.name}`}
            />
            <div
              className={`w-4 h-4 rounded border transition duration-100 ease-linear flex items-center justify-center ${
                isSelected
                  ? "bg-bg-brand-primary border-border-brand"
                  : "border-border-primary bg-bg-primary peer-hover:border-border-brand"
              }`}
            >
              {isSelected && (
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="2 5 4 7 8 3" />
                </svg>
              )}
            </div>
          </label>

          <span className="text-sm font-medium text-text-primary truncate">
            {message.name}
          </span>

          {natureStyle && (
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium flex-shrink-0 ${natureStyle.className}`}
            >
              {nature}
            </span>
          )}
        </div>

        {/* Right: info icon + copy button */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Trigger tooltip */}
          <div className="relative">
            <button
              type="button"
              onMouseEnter={() => setShowTriggerTooltip(true)}
              onMouseLeave={() => setShowTriggerTooltip(false)}
              className="text-fg-quaternary hover:text-fg-tertiary transition duration-100 ease-linear cursor-default"
              aria-label={formatTrigger(message.trigger)}
            >
              <InfoIcon />
            </button>
            {showTriggerTooltip && (
              <div className="absolute right-0 bottom-full mb-1 z-50 rounded-lg bg-bg-primary-solid px-3 py-1.5 text-xs text-text-white shadow-lg whitespace-nowrap pointer-events-none">
                {formatTrigger(message.trigger)}
              </div>
            )}
          </div>

          {/* Copy single card */}
          <button
            type="button"
            onClick={handleCopy}
            className="text-fg-quaternary hover:text-fg-secondary transition duration-100 ease-linear cursor-pointer"
            aria-label={copied ? "Copied" : "Copy message"}
          >
            {copied ? (
              <CheckIcon className="text-fg-success-secondary" />
            ) : (
              <ClipboardIcon />
            )}
          </button>
        </div>
      </div>

      {/* Message body */}
      <div className="mt-3 rounded-lg border border-border-secondary bg-bg-primary p-3">
        {viewMode === "preview" ? renderPreview() : renderTemplate()}
      </div>

      {/* Footer row: view toggle + prompt nudge */}
      <div className="mt-2.5 flex items-center justify-between">
        {/* Prompt nudge */}
        <p className="text-xs text-text-quaternary italic flex-1 mr-3">
          {promptNudge}
        </p>

        {/* Per-card view toggle */}
        <button
          type="button"
          onClick={toggleLocalView}
          className={`text-xs font-medium transition duration-100 ease-linear cursor-pointer flex-shrink-0 ${
            localViewMode !== null
              ? "text-text-brand-secondary hover:text-text-brand-secondary_hover"
              : "text-text-quaternary hover:text-text-tertiary"
          }`}
        >
          {viewMode === "preview" ? "Show template" : "Show preview"}
        </button>
      </div>
    </div>
  );
}
