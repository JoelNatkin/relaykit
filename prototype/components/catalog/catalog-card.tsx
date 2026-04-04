"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { Message, VariantSet } from "@/data/messages";
import type { SessionState } from "@/context/session-context";
import {
  interpolateTemplate,
  getMessageNature,
  getTooltipText,
} from "@/lib/catalog-helpers";

/* ── Inline variable styling ── */

const VAR_CLASSES = "text-text-brand-secondary";

/* ── Icons ── */

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M8 7V11" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <circle cx="8" cy="5.25" r="0.75" fill="currentColor" />
    </svg>
  );
}

function PencilIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

/* ── Compliance check (stub) ── */

interface ComplianceResult {
  isCompliant: boolean;
  issue: string | null;
  fixedText: string | null;
}

function checkCompliance(text: string, message: Message): ComplianceResult {
  const hasOptOut = /stop|opt.?out|unsubscribe/i.test(text);
  if (message.requiresStop && !hasOptOut) {
    const fixed = text.trimEnd().replace(/\.?$/, ". Reply STOP to opt out.");
    return { isCompliant: false, issue: "Missing opt-out language", fixedText: fixed };
  }
  const hasBusinessName = /\{app_name\}|GlowStudio|glowstudio/i.test(text);
  if (!hasBusinessName && text.length > 20) {
    const fixed = `GlowStudio: ${text}`;
    return { isCompliant: false, issue: "Missing business name", fixedText: fixed };
  }
  return { isCompliant: true, issue: null, fixedText: null };
}

/* ── CatalogCard component ── */

export interface CatalogCardProps {
  message: Message;
  categoryId: string;
  state: SessionState;
  variants?: VariantSet[];
  onSend?: (messageId: string) => void;
}

export function CatalogCard({
  message,
  categoryId,
  state,
  variants,
  onSend,
}: CatalogCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const [savedText, setSavedText] = useState<string | null>(null);
  const [activeVariantId, setActiveVariantId] = useState<string | null>(null);
  const [suggestionText, setSuggestionText] = useState<string | null>(null);
  const [aiInput, setAiInput] = useState("");
  const [compliance, setCompliance] = useState<ComplianceResult>({ isCompliant: true, issue: null, fixedText: null });
  const [showComplianceHint, setShowComplianceHint] = useState(false);
  const complianceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const nature = getMessageNature(message);
  const isMarketing = nature === "Marketing";
  const tooltipText = getTooltipText(message);

  const currentTemplate = savedText ?? message.template;

  // Auto-resize textarea
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [isEditing, editText, suggestionText]);

  // Compliance check with 2-second debounce on manual edits
  const checkComplianceDebounced = useCallback((text: string) => {
    if (complianceTimerRef.current) clearTimeout(complianceTimerRef.current);
    complianceTimerRef.current = setTimeout(() => {
      const result = checkCompliance(text, message);
      setCompliance(result);
      setShowComplianceHint(!result.isCompliant);
    }, 2000);
  }, [message]);

  useEffect(() => {
    return () => {
      if (complianceTimerRef.current) clearTimeout(complianceTimerRef.current);
    };
  }, []);

  function getInterpolatedText(template: string): string {
    return interpolateTemplate(template, categoryId, state).map(s => s.text).join("");
  }

  function enterEdit() {
    const interpolated = getInterpolatedText(currentTemplate);
    setEditText(interpolated);
    setActiveVariantId(null);
    setSuggestionText(null);
    setAiInput("");
    setCompliance({ isCompliant: true, issue: null, fixedText: null });
    setShowComplianceHint(false);
    setIsEditing(true);
  }

  function handleSave() {
    if (!compliance.isCompliant) return;
    setSavedText(editText);
    setSuggestionText(null);
    setActiveVariantId(null);
    setIsEditing(false);
  }

  function handleFix() {
    if (compliance.fixedText) {
      setEditText(compliance.fixedText);
      setCompliance({ isCompliant: true, issue: null, fixedText: null });
      setShowComplianceHint(false);
    }
  }

  function handleCancel() {
    setSuggestionText(null);
    setActiveVariantId(null);
    setCompliance({ isCompliant: true, issue: null, fixedText: null });
    setShowComplianceHint(false);
    setIsEditing(false);
  }

  function handlePillClick(variantId: string) {
    const template = variantId === "current"
      ? currentTemplate
      : message.variants?.[variantId];
    if (template) {
      const interpolated = getInterpolatedText(template);
      setSuggestionText(interpolated);
      setActiveVariantId(variantId);
      setCompliance({ isCompliant: true, issue: null, fixedText: null });
      setShowComplianceHint(false);
    }
  }

  function acceptSuggestion() {
    if (suggestionText) {
      setEditText(suggestionText);
      setSuggestionText(null);
      setActiveVariantId(null);
    }
  }

  function revertSuggestion() {
    setSuggestionText(null);
    setActiveVariantId(null);
  }

  function handleSend() {
    onSend?.(message.id);
  }

  function handleTextChange(newText: string) {
    if (suggestionText !== null) {
      setSuggestionText(null);
      setActiveVariantId(null);
    }
    setEditText(newText);
    checkComplianceDebounced(newText);
  }

  function renderPreview(template: string) {
    const segments = interpolateTemplate(template, categoryId, state);
    return (
      <p className="text-sm text-text-secondary leading-relaxed">
        {segments.map((seg, i) =>
          seg.isVariable ? (
            <span key={i} className={VAR_CLASSES}>{seg.text}</span>
          ) : (
            <span key={i}>{seg.text}</span>
          )
        )}
      </p>
    );
  }

  const displayText = suggestionText ?? editText;
  const hasSuggestion = suggestionText !== null && suggestionText !== editText;
  const showFix = !compliance.isCompliant && showComplianceHint;

  return (
    <div className="relative flex items-stretch gap-3">
      {/* Card */}
      <div className="flex-1 rounded-xl border border-border-secondary bg-bg-primary p-4 shadow-xs">
        {/* Header row */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <span className="text-sm font-semibold text-text-primary truncate">
              {message.name}
            </span>
            {/* Info tooltip — inline with title */}
            <div className="relative flex-shrink-0">
              <button
                type="button"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="text-fg-quaternary hover:text-fg-tertiary transition duration-100 ease-linear cursor-default"
                aria-label={tooltipText}
              >
                <InfoIcon />
              </button>
              {showTooltip && (
                <div className="absolute left-0 bottom-full mb-1 z-[100] rounded-lg bg-[#333333] px-3 py-2 text-xs text-white shadow-lg min-w-[220px] max-w-[280px] whitespace-normal leading-relaxed pointer-events-none">
                  {tooltipText}
                </div>
              )}
            </div>
            {isMarketing && (
              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium flex-shrink-0 bg-[#F9F5FF] border border-[#E9D7FE] text-[#7C3AED]">
                Marketing
              </span>
            )}
          </div>

          {/* Edit button — right side of header, hidden during edit */}
          {!isEditing && (
            <button
              type="button"
              onClick={enterEdit}
              className="flex-shrink-0 p-1 text-fg-quaternary hover:text-fg-secondary transition duration-100 ease-linear cursor-pointer"
              aria-label="Edit message"
            >
              <PencilIcon />
            </button>
          )}
        </div>

        {/* Message body */}
        {isEditing ? (
          <div className="mt-4">
            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={displayText}
              onChange={(e) => handleTextChange(e.target.value)}
              className="w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2.5 text-sm text-text-secondary leading-relaxed shadow-xs focus:border-border-brand focus:outline-none transition duration-100 ease-linear resize-none"
              rows={3}
            />

            {/* Compliance hint + Fix — below textarea, above pills */}
            {showFix && compliance.issue && (
              <div className="mt-1.5 flex items-center justify-between gap-3">
                <p className="text-xs text-[#F97066]">
                  {compliance.issue}
                </p>
                <button
                  type="button"
                  onClick={handleFix}
                  className="flex-shrink-0 rounded-md border border-border-primary px-2.5 py-1 text-xs font-medium text-text-secondary transition duration-100 ease-linear hover:bg-bg-secondary cursor-pointer"
                >
                  Fix
                </button>
              </div>
            )}

            {/* Accept / Revert for suggestions */}
            {hasSuggestion && (
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={acceptSuggestion}
                  className="rounded-full bg-bg-brand-secondary px-3.5 py-1.5 text-xs font-medium text-text-brand-secondary transition duration-100 ease-linear hover:bg-bg-brand-primary_alt cursor-pointer"
                >
                  Accept
                </button>
                <button
                  type="button"
                  onClick={revertSuggestion}
                  className="rounded-full border border-border-primary px-3.5 py-1.5 text-xs font-medium text-text-secondary transition duration-100 ease-linear hover:bg-bg-secondary cursor-pointer"
                >
                  Revert
                </button>
              </div>
            )}

            {/* Edit controls — no divider, closer to textarea */}
            <div className="mt-3 space-y-3">
              {/* Style pills */}
              {variants && variants.length > 1 && (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handlePillClick("current")}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition duration-100 ease-linear cursor-pointer ${
                      activeVariantId === "current"
                        ? "bg-bg-brand-secondary text-text-brand-secondary"
                        : "border border-border-secondary text-text-tertiary hover:text-text-secondary hover:border-border-primary"
                    }`}
                  >
                    Current
                  </button>
                  {variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => handlePillClick(v.id)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition duration-100 ease-linear cursor-pointer ${
                        activeVariantId === v.id
                          ? "bg-bg-brand-secondary text-text-brand-secondary"
                          : "border border-border-secondary text-text-tertiary hover:text-text-secondary hover:border-border-primary"
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              )}

              {/* AI help input */}
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="How should we change this?"
                className="w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-placeholder shadow-xs focus:border-border-brand focus:outline-none transition duration-100 ease-linear"
              />

              {/* Save / Cancel — right-aligned */}
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-3 py-1.5 text-sm font-medium text-text-tertiary transition duration-100 ease-linear hover:text-text-secondary cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!compliance.isCompliant}
                  className="rounded-lg bg-bg-brand-solid px-4 py-2 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="mt-2 cursor-pointer"
            onClick={enterEdit}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter") enterEdit(); }}
          >
            {renderPreview(currentTemplate)}
          </div>
        )}
      </div>

      {/* Send button — centered vertically, tertiary styling */}
      <div className="flex items-center flex-shrink-0">
        <button
          type="button"
          onClick={handleSend}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-bg-secondary text-fg-secondary shadow-xs transition duration-100 ease-linear hover:bg-bg-secondary_hover cursor-pointer"
          aria-label="Send to my phone"
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
}
