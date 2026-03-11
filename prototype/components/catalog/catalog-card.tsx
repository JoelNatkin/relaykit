"use client";

import { useState } from "react";
import type { Message } from "@/data/messages";
import type { SessionState } from "@/context/session-context";
import {
  interpolateTemplate,
  getMessageNature,
  formatCopyBlock,
  getPromptNudge,
  getTooltipText,
} from "@/lib/catalog-helpers";

/* ── Inline variable styling — bold brand-purple, display only ── */

const VAR_CLASSES = "font-semibold text-text-primary";

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

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function CodeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function NudgeCopyIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="12"
      height="12"
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
  const nudgeCopy = useCopyFeedback();

  const viewMode = localViewMode ?? globalViewMode;
  const nature = getMessageNature(message);
  const isMarketing = nature === "Marketing";
  const promptNudge = getPromptNudge(message, categoryId);
  const tooltipText = getTooltipText(message);

  function handleCopy() {
    copy(formatCopyBlock(message, categoryId, state));
  }

  function toggleLocalView() {
    if (localViewMode === null) {
      setLocalViewMode(globalViewMode === "preview" ? "template" : "preview");
    } else {
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
        {/* Left: name + badge */}
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-base font-medium text-text-primary truncate">
            {message.name}
          </span>

          {/* Only show Marketing badge — no Transactional badge */}
          {isMarketing && (
            <span
              className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium flex-shrink-0 bg-[#F9F5FF] border border-[#E9D7FE] text-[#7C3AED]"
            >
              Marketing
            </span>
          )}
        </div>

        {/* Right: view toggle + info icon + copy button + checkbox */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Per-card view toggle icon button */}
          <button
            type="button"
            onClick={toggleLocalView}
            className={`p-1 rounded transition duration-100 ease-linear cursor-pointer ${
              localViewMode !== null
                ? "text-fg-brand-primary bg-bg-brand-primary_alt"
                : "text-fg-quaternary hover:text-fg-tertiary"
            }`}
            aria-label={viewMode === "preview" ? "Show template" : "Show preview"}
          >
            {viewMode === "preview" ? <CodeIcon /> : <EyeIcon />}
          </button>

          {/* Trigger tooltip */}
          <div className="relative">
            <button
              type="button"
              onMouseEnter={() => setShowTriggerTooltip(true)}
              onMouseLeave={() => setShowTriggerTooltip(false)}
              className="p-1 text-fg-quaternary hover:text-fg-tertiary transition duration-100 ease-linear cursor-default"
              aria-label={tooltipText}
            >
              <InfoIcon />
            </button>
            {showTriggerTooltip && (
              <div className="absolute right-0 bottom-full mb-1 z-[100] rounded-lg bg-[#333333] px-3 py-2 text-xs text-white shadow-lg min-w-[220px] max-w-[280px] whitespace-normal leading-relaxed pointer-events-none">
                {tooltipText}
              </div>
            )}
          </div>

          {/* Copy single card */}
          <button
            type="button"
            onClick={handleCopy}
            className="p-1 text-fg-quaternary hover:text-fg-secondary transition duration-100 ease-linear cursor-pointer"
            aria-label={copied ? "Copied" : "Copy message"}
          >
            {copied ? (
              <CheckIcon className="text-fg-success-secondary" />
            ) : (
              <ClipboardIcon />
            )}
          </button>

          {/* Checkbox — far right, separated from icons */}
          <label className="flex-shrink-0 relative cursor-pointer ml-2">
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
                  ? "bg-[#7C3AED] border-[#7C3AED]"
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
        </div>
      </div>

      {/* Message body */}
      <div className="mt-1">
        {viewMode === "preview" ? renderPreview() : renderTemplate()}
      </div>

      {/* Footer: prompt nudge with inline copy icon — subtle background strip */}
      <div className="mt-3 -mx-4 -mb-4 px-4 pt-2 pb-2.5 border-t border-border-secondary bg-bg-secondary rounded-b-xl">
        <span className="text-xs text-text-quaternary italic">
          &ldquo;{promptNudge}&rdquo;
        </span>
        <button
          type="button"
          onClick={() => nudgeCopy.copy(promptNudge)}
          className="inline-flex align-middle ml-1 text-fg-quaternary hover:text-fg-secondary transition duration-100 ease-linear cursor-pointer"
          aria-label={nudgeCopy.copied ? "Copied" : "Copy prompt"}
        >
          {nudgeCopy.copied ? (
            <CheckIcon className="text-fg-success-secondary w-3 h-3" />
          ) : (
            <NudgeCopyIcon />
          )}
        </button>
      </div>
    </div>
  );
}
