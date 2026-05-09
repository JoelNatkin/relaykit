"use client";

/**
 * Marketing-side edit card. Mirrors the dashboard's
 * `prototype/components/catalog/catalog-card.tsx` edit-mode block (lines
 * 591–884) except: no monitor mode, no AI input, no badge logic. The
 * compliance gate, tone-pill machinery, "+ Variable" popover and Fix
 * affordance are all replicated. Diverge only intentionally — re-sync
 * when the dashboard pattern changes.
 */

import { Plus } from "@untitledui/icons";
import type { Editor } from "@tiptap/react";
import { useEffect, useRef, useState } from "react";
import { MessageEditor } from "@/lib/editor/message-editor";
import { VARIABLE_TOKEN_CLASSES } from "@/lib/editor/variable-token";
import {
  checkCompliance,
  type ComplianceResult,
} from "@/lib/configurator/compliance";
import { getExampleValues } from "@/lib/configurator/example-values";
import { useSession } from "@/lib/configurator/session-context";
import type { PillId, ToneId, VerticalId } from "@/lib/configurator/types";

const TONE_PILL_LABELS: Record<ToneId, string> = {
  standard: "Standard",
  friendly: "Friendly",
  brief: "Brief",
};

const TONE_ORDER: ToneId[] = ["standard", "friendly", "brief"];

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M8 7V11" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <circle cx="8" cy="5.25" r="0.75" fill="currentColor" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  );
}

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className ?? ""}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export interface MessageEditCardSaveResult {
  template: string;
  pillId: PillId;
}

export interface MessageEditCardProps {
  name: string;
  tooltip?: string;
  verticalId: VerticalId;
  variables: string[];
  requiresStop: boolean;
  /** Tone variants. Omit (or empty object) for custom messages — tone pills hide. */
  variants?: Partial<Record<ToneId, string>>;
  /** Initial template the editor opens with. */
  initialTemplate: string;
  /** Initial active pill — what was last saved. */
  initialPillId: PillId;
  onSave: (result: MessageEditCardSaveResult) => void;
  onCancel: () => void;
}

export function MessageEditCard({
  name,
  tooltip,
  verticalId,
  variables,
  requiresStop,
  variants,
  initialTemplate,
  initialPillId,
  onSave,
  onCancel,
}: MessageEditCardProps) {
  const { state } = useSession();
  const editorRef = useRef<Editor | null>(null);
  const insertWrapperRef = useRef<HTMLDivElement>(null);
  const complianceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [editText, setEditText] = useState(initialTemplate);
  const [activePillId, setActivePillId] = useState<PillId>(initialPillId);
  const [lastCannedPillId, setLastCannedPillId] = useState<ToneId>(
    initialPillId === "custom" ? "standard" : initialPillId,
  );
  const [customTextBuffer, setCustomTextBuffer] = useState<string | null>(
    initialPillId === "custom" ? initialTemplate : null,
  );
  const [compliance, setCompliance] = useState<ComplianceResult>({
    isCompliant: true,
    issues: [],
  });
  const [showComplianceHint, setShowComplianceHint] = useState(false);
  const [isFixLoading, setIsFixLoading] = useState(false);
  const [isInsertOpen, setIsInsertOpen] = useState(false);
  const [showInfoTooltip, setShowInfoTooltip] = useState(false);

  const hasVariants = !!variants && Object.keys(variants).length > 0;
  const showCustomPill = customTextBuffer !== null || activePillId === "custom";

  function clearComplianceTimer() {
    if (complianceTimerRef.current) {
      clearTimeout(complianceTimerRef.current);
      complianceTimerRef.current = null;
    }
  }

  function runComplianceCheck(text: string) {
    const result = checkCompliance({
      template: text,
      verticalId,
      variables,
      requiresStop,
      state,
    });
    setCompliance(result);
    clearComplianceTimer();
    if (result.isCompliant) {
      setShowComplianceHint(false);
    } else {
      complianceTimerRef.current = setTimeout(() => {
        setShowComplianceHint(true);
      }, 2000);
    }
  }

  useEffect(() => {
    return () => {
      if (complianceTimerRef.current) clearTimeout(complianceTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isInsertOpen) return;
    function handleMouseDown(e: MouseEvent) {
      if (insertWrapperRef.current && !insertWrapperRef.current.contains(e.target as Node)) {
        setIsInsertOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsInsertOpen(false);
    }
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isInsertOpen]);

  function getPillTemplate(id: ToneId): string | null {
    return variants?.[id] ?? null;
  }

  function handlePillClick(id: PillId) {
    if (id === "custom") {
      if (customTextBuffer !== null) {
        setEditText(customTextBuffer);
        setActivePillId("custom");
        runComplianceCheck(customTextBuffer);
      }
      return;
    }
    if (activePillId === "custom") {
      setCustomTextBuffer(editText);
    }
    const template = getPillTemplate(id);
    if (template !== null) {
      setEditText(template);
      setActivePillId(id);
      setLastCannedPillId(id);
      clearComplianceTimer();
      setCompliance({ isCompliant: true, issues: [] });
      setShowComplianceHint(false);
    }
  }

  function handleTextChange(newText: string) {
    setEditText(newText);
    setCustomTextBuffer(newText);
    if (activePillId !== "custom" && hasVariants) {
      setActivePillId("custom");
    }
    runComplianceCheck(newText);
  }

  function insertVariable(key: string) {
    editorRef.current?.chain().focus().insertVariable(key).run();
    setIsInsertOpen(false);
  }

  function handleRestore() {
    if (isFixLoading) return;
    const template = getPillTemplate(lastCannedPillId);
    if (template === null) return;
    setIsFixLoading(true);
    setTimeout(() => {
      setEditText(template);
      setActivePillId(lastCannedPillId);
      clearComplianceTimer();
      setCompliance({ isCompliant: true, issues: [] });
      setShowComplianceHint(false);
      setIsFixLoading(false);
    }, 1500);
  }

  function handleSave() {
    if (!compliance.isCompliant) return;
    onSave({ template: editText, pillId: activePillId });
  }

  function handleCancel() {
    clearComplianceTimer();
    onCancel();
  }

  const showFix = !compliance.isCompliant && showComplianceHint;
  const insertableRows = (() => {
    const valueMap = getExampleValues(verticalId);
    return variables
      .map((key) => ({ key, value: valueMap.get(key) }))
      .filter((r): r is { key: string; value: NonNullable<typeof r.value> } => !!r.value);
  })();

  return (
    <div className="rounded-xl border border-border-secondary bg-bg-primary p-4 shadow-xs">
      {/* Header row: name + info + edit label */}
      <div className="flex items-center gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <span className="truncate text-sm font-semibold text-text-primary">{name}</span>
          {tooltip ? (
            <div className="relative flex-shrink-0">
              <button
                type="button"
                onMouseEnter={() => setShowInfoTooltip(true)}
                onMouseLeave={() => setShowInfoTooltip(false)}
                onFocus={() => setShowInfoTooltip(true)}
                onBlur={() => setShowInfoTooltip(false)}
                className="cursor-default text-fg-quaternary transition duration-100 ease-linear hover:text-fg-tertiary"
                aria-label={tooltip}
              >
                <InfoIcon />
              </button>
              {showInfoTooltip ? (
                <div className="pointer-events-none absolute bottom-full left-0 z-[100] mb-1 max-w-[280px] min-w-[220px] rounded-lg bg-bg-primary-solid px-3 py-2 text-xs leading-relaxed whitespace-normal text-text-white shadow-lg">
                  {tooltip}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
        <span className="flex flex-shrink-0 items-center gap-1.5 p-1 text-fg-quaternary">
          <PencilIcon />
          <span className="text-sm">Edit</span>
        </span>
      </div>

      {/* Editor */}
      <div className="mt-4">
        <div
          className={`w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2.5 shadow-xs transition duration-100 ease-linear focus-within:border-border-brand ${
            isFixLoading ? "cursor-not-allowed opacity-60" : ""
          }`}
        >
          <MessageEditor
            template={editText}
            verticalId={verticalId}
            disabled={isFixLoading}
            className="text-sm leading-relaxed text-text-secondary outline-none"
            onChange={handleTextChange}
            onReady={(editor) => {
              editorRef.current = editor;
            }}
          />
        </div>

        {/* Compliance + Fix */}
        {showFix && compliance.issues.length > 0 ? (
          <div className="mt-1.5 flex items-start justify-end gap-4">
            <div className="flex flex-col items-end gap-0.5">
              {compliance.issues.map((issue, i) => (
                <p key={i} className="text-xs text-text-error-primary">
                  {issue}
                </p>
              ))}
            </div>
            <button
              type="button"
              onClick={handleRestore}
              disabled={isFixLoading}
              className="inline-flex flex-shrink-0 cursor-pointer items-center gap-1.5 rounded-md border border-border-primary px-2.5 py-1 text-xs font-medium text-text-secondary transition duration-100 ease-linear hover:bg-bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isFixLoading ? <Spinner className="size-3" /> : null}
              {isFixLoading ? "Fixing…" : "Fix"}
            </button>
          </div>
        ) : null}

        {/* Pill row + Variable popover */}
        <div className="mt-1.5 space-y-3">
          <div className="flex flex-wrap items-start gap-2">
            {hasVariants
              ? TONE_ORDER.filter((id) => variants?.[id] !== undefined).map((id) => {
                  const isActive = activePillId === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handlePillClick(id)}
                      className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition duration-100 ease-linear ${
                        isActive
                          ? "bg-bg-brand-secondary text-text-brand-secondary"
                          : "border border-border-secondary text-text-tertiary hover:border-border-primary hover:text-text-secondary"
                      }`}
                    >
                      {TONE_PILL_LABELS[id]}
                    </button>
                  );
                })
              : null}

            {hasVariants && showCustomPill ? (
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handlePillClick("custom")}
                className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition duration-100 ease-linear ${
                  activePillId === "custom"
                    ? "bg-bg-brand-secondary text-text-brand-secondary"
                    : "border border-dashed border-border-secondary text-text-tertiary hover:border-border-primary hover:text-text-secondary"
                }`}
              >
                Custom
              </button>
            ) : null}

            <div className="relative ml-auto" ref={insertWrapperRef}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setIsInsertOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={isInsertOpen}
                className="inline-flex cursor-pointer items-center gap-1 py-1.5 text-xs font-semibold whitespace-nowrap text-text-brand-secondary transition-colors duration-100 hover:text-text-brand-secondary_hover"
              >
                <Plus className="size-3.5" />
                Variable
              </button>
              {isInsertOpen ? (
                <div
                  role="menu"
                  className="absolute top-full right-0 z-20 mt-1 rounded-lg border border-border-secondary bg-bg-primary py-1 shadow-lg"
                >
                  {insertableRows.length === 0 ? (
                    <p className="px-3 py-2 text-sm whitespace-nowrap text-text-tertiary">
                      No variables for this message.
                    </p>
                  ) : (
                    insertableRows.map(({ key, value }) => (
                      <button
                        key={key}
                        type="button"
                        role="menuitem"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => insertVariable(key)}
                        className="flex w-full cursor-pointer items-center justify-between gap-6 px-3 py-2 text-sm whitespace-nowrap transition duration-100 ease-linear hover:bg-bg-primary_hover"
                      >
                        <span className="text-text-secondary">{value.label}</span>
                        <span className={VARIABLE_TOKEN_CLASSES}>{value.preview(state)}</span>
                      </button>
                    ))
                  )}
                </div>
              ) : null}
            </div>
          </div>

          {/* Save / Cancel */}
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="cursor-pointer px-3 py-1.5 text-sm font-medium text-text-tertiary transition duration-100 ease-linear hover:text-text-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!compliance.isCompliant || isFixLoading}
              className="cursor-pointer rounded-lg bg-bg-brand-solid px-4 py-2 text-sm font-semibold text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
