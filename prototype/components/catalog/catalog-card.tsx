"use client";

import { useState, useRef, useEffect } from "react";
import type { Message, VariantSet } from "@/data/messages";
import type { SessionState } from "@/context/session-context";
import {
  interpolateTemplate,
  getMessageNature,
  getTooltipText,
} from "@/lib/catalog-helpers";

/* ── Inline variable styling ── */

const VAR_CLASSES = "font-normal text-text-brand-secondary";

/* ── Icons ── */

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M8 7V11" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <circle cx="8" cy="5.25" r="0.75" fill="currentColor" />
    </svg>
  );
}

function EditIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

/* ── CatalogCard component ── */

export interface CatalogCardProps {
  message: Message;
  categoryId: string;
  state: SessionState;
  /** Style variants available for this category */
  variants?: VariantSet[];
  /** Called when send button is clicked */
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const nature = getMessageNature(message);
  const isMarketing = nature === "Marketing";
  const tooltipText = getTooltipText(message);

  // The working template — saved edits take precedence
  const currentTemplate = savedText ?? message.template;

  // Auto-resize textarea
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [isEditing, editText]);

  function enterEdit() {
    setEditText(currentTemplate);
    setActiveVariantId(null);
    setSuggestionText(null);
    setAiInput("");
    setIsEditing(true);
  }

  function handleSave() {
    const textToSave = suggestionText ?? editText;
    setSavedText(textToSave);
    setSuggestionText(null);
    setActiveVariantId(null);
    setIsEditing(false);
  }

  function handleCancel() {
    setSuggestionText(null);
    setActiveVariantId(null);
    setIsEditing(false);
  }

  function handlePillClick(variantId: string) {
    if (variantId === "current") {
      // "Current" pill — restore saved/original text as suggestion
      setSuggestionText(currentTemplate);
      setActiveVariantId("current");
      return;
    }
    const variantTemplate = message.variants?.[variantId];
    if (variantTemplate) {
      setSuggestionText(variantTemplate);
      setActiveVariantId(variantId);
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

  /* ── Render interpolated preview ── */

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

  // The text shown in the textarea — suggestion takes precedence for display
  const displayText = suggestionText ?? editText;
  const hasSuggestion = suggestionText !== null && suggestionText !== editText;

  return (
    <div className="relative flex items-start gap-3">
      {/* Card */}
      <div className="flex-1 rounded-xl border border-border-secondary bg-bg-primary p-4 shadow-xs">
        {/* Header row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-semibold text-text-primary truncate">
              {message.name}
            </span>
            {isMarketing && (
              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium flex-shrink-0 bg-[#F9F5FF] border border-[#E9D7FE] text-[#7C3AED]">
                Marketing
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Info tooltip */}
            <div className="relative">
              <button
                type="button"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="p-1 text-fg-quaternary hover:text-fg-tertiary transition duration-100 ease-linear cursor-default"
                aria-label={tooltipText}
              >
                <InfoIcon />
              </button>
              {showTooltip && (
                <div className="absolute right-0 bottom-full mb-1 z-[100] rounded-lg bg-[#333333] px-3 py-2 text-xs text-white shadow-lg min-w-[220px] max-w-[280px] whitespace-normal leading-relaxed pointer-events-none">
                  {tooltipText}
                </div>
              )}
            </div>

            {/* Edit button — hidden during edit */}
            {!isEditing && (
              <button
                type="button"
                onClick={enterEdit}
                className="p-1 text-fg-quaternary hover:text-fg-secondary transition duration-100 ease-linear cursor-pointer"
                aria-label="Edit message"
              >
                <EditIcon />
              </button>
            )}
          </div>
        </div>

        {/* Message body */}
        {isEditing ? (
          <div className="mt-2">
            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={displayText}
              onChange={(e) => {
                if (suggestionText !== null) {
                  // If typing while a suggestion is shown, accept it and continue editing
                  setSuggestionText(null);
                  setActiveVariantId(null);
                }
                setEditText(e.target.value);
              }}
              className="w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2.5 text-sm text-text-secondary leading-relaxed font-mono shadow-xs focus:border-border-brand focus:outline-none transition duration-100 ease-linear resize-none"
              rows={3}
            />

            {/* Accept / Revert for suggestions */}
            {hasSuggestion && (
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={acceptSuggestion}
                  className="rounded-lg bg-bg-brand-solid px-3 py-1.5 text-xs font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover cursor-pointer"
                >
                  Accept
                </button>
                <button
                  type="button"
                  onClick={revertSuggestion}
                  className="rounded-lg border border-border-primary px-3 py-1.5 text-xs font-medium text-text-secondary transition duration-100 ease-linear hover:bg-bg-secondary cursor-pointer"
                >
                  Revert
                </button>
              </div>
            )}

            {/* Edit controls panel */}
            <div className="mt-4 space-y-4 border-t border-border-secondary pt-4">
              {/* Style pills */}
              {variants && variants.length > 1 && (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handlePillClick("current")}
                    className={`rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap transition duration-100 ease-linear cursor-pointer ${
                      activeVariantId === "current"
                        ? "bg-bg-brand-secondary text-text-brand-secondary"
                        : "bg-bg-secondary text-text-secondary hover:bg-bg-secondary_hover"
                    }`}
                  >
                    Current
                  </button>
                  {variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => handlePillClick(v.id)}
                      className={`rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap transition duration-100 ease-linear cursor-pointer ${
                        activeVariantId === v.id
                          ? "bg-bg-brand-secondary text-text-brand-secondary"
                          : "bg-bg-secondary text-text-secondary hover:bg-bg-secondary_hover"
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              )}

              {/* AI help input */}
              <div>
                <input
                  type="text"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder="How should we change this?"
                  className="w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-placeholder shadow-xs focus:border-border-brand focus:outline-none transition duration-100 ease-linear"
                />
              </div>

              {/* Contextual AI suggestions — stubbed */}
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {getContextualSuggestions(message).map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    className="text-xs text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear cursor-pointer"
                    onClick={() => {/* stubbed — future AI rewrite */}}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              {/* Save / Cancel */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded-lg bg-bg-brand-solid px-4 py-2 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover cursor-pointer"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-lg border border-border-primary px-4 py-2 text-sm font-medium text-text-secondary transition duration-100 ease-linear hover:bg-bg-secondary cursor-pointer"
                >
                  Cancel
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

      {/* Send button — floats outside the card on the right */}
      <button
        type="button"
        onClick={handleSend}
        className="mt-4 flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-bg-brand-solid text-white shadow-sm transition duration-100 ease-linear hover:bg-bg-brand-solid_hover cursor-pointer"
        aria-label="Send to my phone"
      >
        <SendIcon />
      </button>
    </div>
  );
}

/* ── Contextual AI suggestions per message type ── */

function getContextualSuggestions(message: Message): string[] {
  const id = message.id;
  if (id.includes("booking") || id.includes("confirmation")) {
    return ["Add a reschedule link", "Include preparation instructions"];
  }
  if (id.includes("reminder")) {
    return ["Add directions or parking info", "Include cancellation policy"];
  }
  if (id.includes("reschedule")) {
    return ["Add a rebooking link"];
  }
  if (id.includes("cancel")) {
    return ["Add a rebooking prompt"];
  }
  if (id.includes("no_show") || id.includes("noshow")) {
    return ["Soften the tone", "Add a rebooking link"];
  }
  return ["Make it shorter", "Make it more casual"];
}
