"use client";

import { useState, useRef, useEffect } from "react";
import { DotsVertical, Plus, Stars02 } from "@untitledui/icons";
import type { Editor } from "@tiptap/react";
import type { CustomMessage, SessionState } from "@/context/session-context";
import {
  interpolateTemplate,
  getExampleValues,
} from "@/lib/catalog-helpers";
import { VARIABLE_TOKEN_CLASSES } from "@/lib/variable-token";
import { getVariableScope } from "@/lib/variable-scope";
import { MessageEditor } from "@/lib/editor/message-editor";

function Spinner({ className }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className ?? ""}`} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
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

/** Minimal compliance check for custom messages.
 *  Opt-out language only — custom templates don't have a canonical variable
 *  set to require against (the user inserts what they want). Matches the
 *  rule CatalogCard uses for built-ins (requiresStop branch) but skips the
 *  required-variable check that only makes sense when a template was
 *  pre-authored. */
function checkCustomCompliance(text: string): { isCompliant: boolean; issues: string[] } {
  const issues: string[] = [];
  const hasStop = /stop/i.test(text);
  const hasExitWord = /opt[- ]?out|unsubscribe/i.test(text);
  if (!(hasStop && hasExitWord)) {
    issues.push("Needs opt-out language");
  }
  return { isCompliant: issues.length === 0, issues };
}

export interface CustomMessageCardProps {
  message: CustomMessage;
  categoryId: string;
  state: SessionState;
  isEditing: boolean;
  onEditRequest: (messageId: string | null) => void;
  /** True the first time this message enters edit state after being added —
   *  drives name-input auto-focus for the authoring flow. Parent tracks this
   *  because it owns the edit-state lifecycle. */
  isFreshlyAdded?: boolean;
  /** Muted styling for archived rows. */
  muted?: boolean;
  /** Save commits the edits and assigns a slug on first save (D-351). */
  onSave: (messageId: string, updates: { name: string; template: string }) => void;
  /** Invoked when the kebab "Archive" item is chosen. Parent owns the modal
   *  and the session action wiring — we just surface the intent. */
  onArchiveRequest?: (message: CustomMessage) => void;
  /** Archived-row menu items. When either is present, the kebab renders
   *  with Restore / Delete permanently instead of Archive. Mutually
   *  exclusive with onArchiveRequest in practice — parent passes one or
   *  the other based on whether the row sits in the active stack or the
   *  archived disclosure. */
  onRestoreRequest?: (message: CustomMessage) => void;
  onDeleteRequest?: (message: CustomMessage) => void;
}

export function CustomMessageCard({
  message,
  categoryId,
  state,
  isEditing,
  onEditRequest,
  isFreshlyAdded = false,
  muted = false,
  onSave,
  onArchiveRequest,
  onRestoreRequest,
  onDeleteRequest,
}: CustomMessageCardProps) {
  const [editName, setEditName] = useState(message.name);
  const [editTemplate, setEditTemplate] = useState(message.template);
  const [aiInput, setAiInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [compliance, setCompliance] = useState<{ isCompliant: boolean; issues: string[] }>({
    isCompliant: true,
    issues: [],
  });
  const [showComplianceHint, setShowComplianceHint] = useState(false);
  const [isInsertOpen, setIsInsertOpen] = useState(false);
  const [isKebabOpen, setIsKebabOpen] = useState(false);
  const complianceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const editorRef = useRef<Editor | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const insertWrapperRef = useRef<HTMLDivElement>(null);
  const kebabWrapperRef = useRef<HTMLDivElement>(null);
  const prevIsEditingRef = useRef(false);

  function clearComplianceTimer() {
    if (complianceTimerRef.current) {
      clearTimeout(complianceTimerRef.current);
      complianceTimerRef.current = null;
    }
  }

  function runComplianceCheck(text: string) {
    const resolved = interpolateTemplate(text, categoryId, state)
      .map((s) => s.text)
      .join("");
    const result = checkCustomCompliance(resolved);
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

  // Initialize edit session when isEditing flips false → true. Mirrors the
  // CatalogCard lifecycle (see catalog-card.tsx:395) — compliance state is
  // set directly, never via a reactive effect on editText, to preserve the
  // Session 35 "explicit-call only" invariant.
  useEffect(() => {
    if (isEditing && !prevIsEditingRef.current) {
      setEditName(message.name);
      setEditTemplate(message.template);
      setAiInput("");
      setIsAiLoading(false);
      clearComplianceTimer();
      setCompliance({ isCompliant: true, issues: [] });
      setShowComplianceHint(false);
    }
    prevIsEditingRef.current = isEditing;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing]);

  // Auto-focus the name input on first edit after add. Run once when
  // entering edit state on a freshly-added message.
  useEffect(() => {
    if (isEditing && isFreshlyAdded) {
      nameInputRef.current?.focus();
    }
  }, [isEditing, isFreshlyAdded]);

  useEffect(() => {
    return () => {
      if (complianceTimerRef.current) clearTimeout(complianceTimerRef.current);
    };
  }, []);

  // Close the + Variable popover on outside click / Escape.
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

  // Close the kebab menu on outside click / Escape. Same pattern as the
  // + Variable popover; kept separate so opening one doesn't toggle the
  // other through a shared handler.
  useEffect(() => {
    if (!isKebabOpen) return;
    function handleMouseDown(e: MouseEvent) {
      if (kebabWrapperRef.current && !kebabWrapperRef.current.contains(e.target as Node)) {
        setIsKebabOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsKebabOpen(false);
    }
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isKebabOpen]);

  function handleTextChange(next: string) {
    setEditTemplate(next);
    runComplianceCheck(next);
  }

  function handleAiSubmit() {
    if (!aiInput.trim() || isAiLoading) return;
    setIsAiLoading(true);
    // Stubbed (matches catalog-card.tsx:478). Real backend wiring is out of
    // scope for this task — kept stubbed per the task brief.
    setTimeout(() => {
      const rewritten = `${editTemplate} (rewritten: ${aiInput.trim()})`;
      setEditTemplate(rewritten);
      setAiInput("");
      runComplianceCheck(rewritten);
      setIsAiLoading(false);
    }, 1500);
  }

  function handleSave() {
    if (!compliance.isCompliant) return;
    if (!editName.trim()) return;
    onSave(message.id, { name: editName.trim(), template: editTemplate });
    onEditRequest(null);
  }

  function handleCancel() {
    clearComplianceTimer();
    setCompliance({ isCompliant: true, issues: [] });
    setShowComplianceHint(false);
    onEditRequest(null);
  }

  function insertVariable(key: string) {
    editorRef.current?.chain().focus().insertVariable(key).run();
    setIsInsertOpen(false);
  }

  function enterEdit() {
    onEditRequest(message.id);
  }

  function renderPreview(template: string) {
    const segments = interpolateTemplate(template, categoryId, state);
    return (
      <p className={`text-sm leading-relaxed ${muted ? "text-text-tertiary" : "text-text-secondary"}`}>
        {segments.map((seg, i) =>
          seg.isVariable ? (
            <span key={i} className={VARIABLE_TOKEN_CLASSES}>{seg.text}</span>
          ) : (
            <span key={i}>{seg.text}</span>
          )
        )}
      </p>
    );
  }

  // Customs fall through to the namespace-intersection branch in
  // getVariableScope because CustomMessage has no `variables` field — the
  // helper's `"variables" in message` guard routes it to the intersection
  // across all built-in methods in the category (D-353 + revised D-351).
  const variableScope = getVariableScope(message, categoryId);

  const showFix = !compliance.isCompliant && showComplianceHint;
  const nameIsEmpty = !editName.trim();
  const displayName = message.name || "Untitled message";

  return (
    <div
      className={`relative rounded-xl border border-border-secondary bg-bg-primary p-4 shadow-xs ${muted ? "opacity-70" : ""}`}
    >
      {isEditing ? (
        <div>
          {/* Editable name row */}
          <div className="flex items-center gap-3">
            <input
              ref={nameInputRef}
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="New message"
              className="flex-1 min-w-0 bg-transparent text-sm font-semibold text-text-primary placeholder:text-text-placeholder focus:outline-none"
              aria-label="Message name"
            />
            <span className="flex items-center gap-1.5 p-1 text-fg-quaternary flex-shrink-0">
              <PencilIcon />
              <span className="text-sm">Edit</span>
            </span>
          </div>

          {/* Editor body */}
          <div className="mt-4">
            <div
              className={`w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2.5 shadow-xs focus-within:border-border-brand transition duration-100 ease-linear ${
                isAiLoading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              <MessageEditor
                template={editTemplate}
                categoryId={categoryId}
                disabled={isAiLoading}
                /* min-h-[4.5rem] = 72px ≈ 3 lines at text-sm + leading-relaxed.
                   Built-in editor sizes to its canonical template so it's
                   never visibly short; a blank custom has no template, so
                   we set a floor that reads as a message composer rather
                   than a single-line input. */
                className="text-sm text-text-secondary leading-relaxed outline-none min-h-[4.5rem]"
                onChange={handleTextChange}
                onReady={(editor) => {
                  editorRef.current = editor;
                }}
              />
            </div>

            {showFix && compliance.issues.length > 0 && (
              <div className="mt-1.5 flex items-start justify-end gap-4">
                <div className="flex flex-col items-end gap-0.5">
                  {compliance.issues.map((issue, i) => (
                    <p key={i} className="text-xs text-text-error-primary">
                      {issue}
                    </p>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-3 space-y-3">
              {/* + Variable affordance (no tone pills on customs — dropped by design) */}
              <div className="flex items-center">
                <div className="ml-auto relative" ref={insertWrapperRef}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setIsInsertOpen((v) => !v)}
                    aria-haspopup="menu"
                    aria-expanded={isInsertOpen}
                    className="inline-flex items-center gap-1 py-1.5 text-xs font-semibold whitespace-nowrap text-text-brand-secondary hover:text-text-brand-secondary_hover transition-colors duration-100 cursor-pointer"
                  >
                    <Plus className="size-3.5" />
                    Variable
                  </button>
                  {isInsertOpen && (() => {
                    const valueMap = getExampleValues(categoryId);
                    const rows = variableScope
                      .map((key) => ({ key, value: valueMap.get(key) }))
                      .filter((r): r is { key: string; value: NonNullable<typeof r.value> } => !!r.value);
                    return (
                      <div
                        role="menu"
                        className="absolute right-0 top-full mt-1 z-20 rounded-lg border border-border-secondary bg-bg-primary shadow-lg py-1"
                      >
                        {rows.length === 0 ? (
                          <p className="px-3 py-2 text-sm text-text-tertiary whitespace-nowrap">
                            No variables for this namespace.
                          </p>
                        ) : (
                          rows.map(({ key, value }) => (
                            <button
                              key={key}
                              type="button"
                              role="menuitem"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => insertVariable(key)}
                              className="flex w-full items-center justify-between gap-6 whitespace-nowrap px-3 py-2 text-sm hover:bg-bg-primary_hover transition duration-100 ease-linear cursor-pointer"
                            >
                              <span className="text-text-secondary">{value.label}</span>
                              <span className={VARIABLE_TOKEN_CLASSES}>{value.preview(state)}</span>
                            </button>
                          ))
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Ask AI input — blank-custom placeholder (D-351 revised) */}
              <div className="relative">
                {isAiLoading ? (
                  <Spinner className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-fg-brand-primary" />
                ) : (
                  <Stars02 className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-fg-brand-primary" />
                )}
                <input
                  type="text"
                  value={isAiLoading ? "" : aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAiSubmit();
                    }
                  }}
                  disabled={isAiLoading}
                  placeholder={
                    isAiLoading
                      ? "Rewriting…"
                      : editTemplate.trim() === ""
                        ? "Ask AI: write me a message"
                        : "Ask AI: polish my edit"
                  }
                  className="w-full rounded-lg border border-border-primary bg-bg-primary pl-9 pr-3 py-2 text-sm text-text-primary placeholder:text-text-placeholder shadow-xs focus:border-border-brand focus:outline-none transition duration-100 ease-linear disabled:bg-bg-secondary disabled:cursor-not-allowed"
                />
              </div>

              {/* Save / Cancel */}
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
                  disabled={!compliance.isCompliant || isAiLoading || nameIsEmpty}
                  className="rounded-lg bg-bg-brand-solid px-4 py-2 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Collapsed header — name + slug (muted), edit pencil only for now.
              Activity icon + kebab land in subsequent commits (d, e). No info
              icon, ever, for customs. */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <span className={`text-sm font-semibold truncate ${muted ? "text-text-tertiary" : "text-text-primary"}`}>
                {displayName}
              </span>
              {message.slug && (
                <span className="text-xs text-text-quaternary ml-2 flex-shrink-0 font-mono">
                  {message.slug}
                </span>
              )}
            </div>
            <div className="flex items-center flex-shrink-0 gap-1">
              {/* Pencil hidden on archived rows — they are read-only until
                  restored. Kebab still renders (Restore / Delete). */}
              {!muted && (
                <button
                  type="button"
                  onClick={enterEdit}
                  className="p-1 text-fg-quaternary hover:text-fg-secondary transition duration-100 ease-linear cursor-pointer"
                  aria-label="Edit message"
                >
                  <PencilIcon />
                </button>
              )}
              {/* Kebab menu. The parent chooses the action set by passing
                  either onArchiveRequest (active rows → "Archive") or the
                  pair onRestoreRequest + onDeleteRequest (archived rows →
                  "Restore" / "Delete permanently"). Only renders after slug
                  assignment — nothing to act on before first save. */}
              {message.slug && (onArchiveRequest || onRestoreRequest || onDeleteRequest) && (
                <div className="relative" ref={kebabWrapperRef}>
                  <button
                    type="button"
                    onClick={() => setIsKebabOpen((v) => !v)}
                    aria-haspopup="menu"
                    aria-expanded={isKebabOpen}
                    aria-label="More options"
                    className="p-1 text-fg-quaternary hover:text-fg-secondary transition duration-100 ease-linear cursor-pointer"
                  >
                    <DotsVertical className="size-[17px]" />
                  </button>
                  {isKebabOpen && (
                    <div
                      role="menu"
                      className="absolute right-0 top-full mt-1 z-20 rounded-lg border border-border-secondary bg-bg-primary shadow-lg py-1 min-w-[180px]"
                    >
                      {onArchiveRequest && (
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            setIsKebabOpen(false);
                            onArchiveRequest(message);
                          }}
                          className="flex w-full items-center px-3 py-2 text-sm text-text-secondary hover:bg-bg-primary_hover transition duration-100 ease-linear cursor-pointer"
                        >
                          Archive
                        </button>
                      )}
                      {onRestoreRequest && (
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            setIsKebabOpen(false);
                            onRestoreRequest(message);
                          }}
                          className="flex w-full items-center px-3 py-2 text-sm text-text-secondary hover:bg-bg-primary_hover transition duration-100 ease-linear cursor-pointer"
                        >
                          Restore
                        </button>
                      )}
                      {onDeleteRequest && (
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            setIsKebabOpen(false);
                            onDeleteRequest(message);
                          }}
                          className="flex w-full items-center px-3 py-2 text-sm text-text-error-primary hover:bg-bg-primary_hover transition duration-100 ease-linear cursor-pointer"
                        >
                          Delete permanently
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div
            className={muted ? "mt-2" : "mt-2 cursor-pointer"}
            onClick={muted ? undefined : enterEdit}
            role={muted ? undefined : "button"}
            tabIndex={muted ? undefined : 0}
            onKeyDown={muted ? undefined : (e) => { if (e.key === "Enter") enterEdit(); }}
          >
            {message.template ? renderPreview(message.template) : (
              <p className="text-sm italic text-text-quaternary">No message yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
