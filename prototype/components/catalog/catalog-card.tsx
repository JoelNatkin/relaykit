"use client";

import { useState } from "react";
import type { Message } from "@/data/messages";
import type { SessionState } from "@/context/session-context";
import {
  interpolateTemplate,
  getMessageNature,
  formatCopyBlock,
  getTooltipText,
  getAiPrompts,
} from "@/lib/catalog-helpers";

/* ── Inline variable styling — bold brand-purple, display only ── */

const VAR_CLASSES = "font-normal text-text-brand-secondary";

/* ── Copy feedback hook ── */

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

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function SmallClipboardIcon({ className }: { className?: string }) {
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

function SmallCheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/* ── CatalogCard component ── */

interface CatalogCardProps {
  message: Message;
  categoryId: string;
  state: SessionState;
  /** Page-level view mode — card can override locally */
  globalViewMode: "preview" | "template";
  /** Override template text when a variant is selected */
  activeTemplate?: string;
  /** Whether this card's AI prompts expander is open */
  isPromptsOpen: boolean;
  /** Called when the AI prompts toggle is clicked */
  onTogglePrompts: () => void;
}

export function CatalogCard({
  message,
  categoryId,
  state,
  globalViewMode,
  activeTemplate,
  isPromptsOpen,
  onTogglePrompts,
}: CatalogCardProps) {
  const [localViewMode, setLocalViewMode] = useState<
    "preview" | "template" | null
  >(null);
  const [showTriggerTooltip, setShowTriggerTooltip] = useState(false);
  const [copiedPromptIdx, setCopiedPromptIdx] = useState<number | null>(null);
  const { copied, copy } = useCopyFeedback();

  const viewMode = localViewMode ?? globalViewMode;
  const nature = getMessageNature(message);
  const isMarketing = nature === "Marketing";
  const tooltipText = getTooltipText(message);
  const aiPrompts = getAiPrompts(message, categoryId);

  const displayTemplate = activeTemplate ?? message.template;

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

  /** Returns the interpolated plain text of the currently displayed message */
  function getInterpolatedText(): string {
    const segments = interpolateTemplate(displayTemplate, categoryId, state);
    return segments.map((s) => s.text).join("");
  }

  function handlePromptCopy(prompt: string, idx: number) {
    const msgText = getInterpolatedText();
    const combined = `"${msgText}"\n\n${prompt}`;
    navigator.clipboard.writeText(combined).catch(() => {});

    // Per-prompt checkmark
    setCopiedPromptIdx(idx);
    setTimeout(() => setCopiedPromptIdx(null), 1500);
  }

  /* ── Render message body ── */

  function renderPreview() {
    const segments = interpolateTemplate(displayTemplate, categoryId, state);
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
        {displayTemplate}
      </p>
    );
  }

  return (
    <div className="relative rounded-xl border border-border-secondary bg-bg-primary p-4 shadow-xs overflow-visible">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        {/* Left: name + badge */}
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-sm font-medium text-text-primary truncate">
            {message.name}
          </span>

          {/* Only show Marketing badge — no Transactional badge */}
          {isMarketing && (
            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium flex-shrink-0 bg-[#F9F5FF] border border-[#E9D7FE] text-[#7C3AED]">
              Marketing
            </span>
          )}
        </div>

        {/* Right: view toggle + info icon + copy button */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Per-card view toggle icon button */}
          <div className="relative group">
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
            <div className="absolute right-0 bottom-full mb-1 z-[100] hidden group-hover:block rounded-md bg-[#333333] px-2 py-1 text-[11px] text-white shadow-md whitespace-nowrap pointer-events-none">
              {viewMode === "preview" ? "Show template" : "Show preview"}
            </div>
          </div>

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

          {/* Copy single card — copies message only */}
          <div className="relative group">
            <button
              type="button"
              onClick={handleCopy}
              className="p-1 text-fg-quaternary hover:text-fg-secondary transition duration-100 ease-linear cursor-pointer"
              aria-label="Copy message"
            >
              {copied ? (
                <CheckIcon className="text-fg-success-secondary" />
              ) : (
                <ClipboardIcon />
              )}
            </button>
            <div className="absolute right-0 bottom-full mb-1 z-[100] hidden group-hover:block rounded-md bg-[#333333] px-2 py-1 text-[11px] text-white shadow-md whitespace-nowrap pointer-events-none">
              Copy message
            </div>
          </div>
        </div>
      </div>

      {/* Message body */}
      <div className="mt-2">
        {viewMode === "preview" ? renderPreview() : renderTemplate()}
      </div>

      {/* AI prompts expander */}
      <div className="mt-3">
        <button
          type="button"
          onClick={onTogglePrompts}
          className="flex items-center gap-1 text-sm font-semibold text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear cursor-pointer"
          aria-expanded={isPromptsOpen}
        >
          Modify with AI
          <ChevronRightIcon
            className={`transition-transform duration-150 ease-linear ${
              isPromptsOpen ? "rotate-90" : ""
            }`}
          />
        </button>

        {isPromptsOpen && (
          <div className="mt-2">
            {aiPrompts.map((prompt, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 py-0.5"
              >
                <span className="text-sm text-text-secondary italic leading-snug">
                  {prompt}
                </span>
                <div className="relative flex-shrink-0 group">
                  <button
                    type="button"
                    onClick={() => handlePromptCopy(prompt, i)}
                    className="p-1 text-fg-quaternary hover:text-fg-secondary transition duration-100 ease-linear cursor-pointer"
                    aria-label="Copy message + prompt"
                  >
                    {copiedPromptIdx === i ? (
                      <SmallCheckIcon className="text-fg-success-secondary" />
                    ) : (
                      <SmallClipboardIcon />
                    )}
                  </button>
                  <div className="absolute right-0 bottom-full mb-1 z-[100] hidden group-hover:block rounded-md bg-[#333333] px-2 py-1 text-[11px] text-white shadow-md whitespace-nowrap pointer-events-none">
                    Copies message + prompt for your AI tool
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
