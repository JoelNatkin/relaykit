"use client";

import { useState, useRef, useEffect } from "react";
import { Activity, Check, DotsVertical, Plus, Stars02 } from "@untitledui/icons";
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
  /** Invoked when Cancel is clicked on a never-saved row (slug === "").
   *  The row has no deliverable identity yet and no edits worth keeping,
   *  so the parent should delete it outright to avoid a zombie "Untitled
   *  message" in the stack. Saved rows Cancel via onEditRequest(null)
   *  instead, which preserves the last saved state. */
  onDiscard?: (message: CustomMessage) => void;
  /** Archived-row menu items. When either is present, the kebab renders
   *  with Restore / Delete permanently instead of Archive. Mutually
   *  exclusive with onArchiveRequest in practice — parent passes one or
   *  the other based on whether the row sits in the active stack or the
   *  archived disclosure. */
  onRestoreRequest?: (message: CustomMessage) => void;
  onDeleteRequest?: (message: CustomMessage) => void;
  /** Controlled monitor state — same shape as CatalogCard's isMonitoring /
   *  onMonitorRequest pair. Parent ensures mutual exclusivity with edit. */
  isMonitoring?: boolean;
  onMonitorRequest?: (messageId: string | null) => void;
  /** Names shown in the monitor expansion's Send test dropdown. Synced
   *  with the right-rail Testers card on the parent page. */
  testRecipients?: string[];
  /** Click handler for the Ask Claude button in the monitor footer. */
  onAskClaude?: (messageName: string) => void;
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
  onDiscard,
  onRestoreRequest,
  onDeleteRequest,
  isMonitoring = false,
  onMonitorRequest,
  testRecipients,
  onAskClaude,
}: CustomMessageCardProps) {
  const [editName, setEditName] = useState(message.name);
  const [editTemplate, setEditTemplate] = useState(message.template);
  const [aiInput, setAiInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isFixLoading, setIsFixLoading] = useState(false);
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

  // Send-test state (monitor expansion). Matches CatalogCard's pattern —
  // stubbed, no real delivery. Recipient list falls back to a static trio
  // when the parent doesn't provide testRecipients (keeps the select
  // populated in standalone/test scenarios).
  const FALLBACK_RECIPIENTS = ["Joel", "Sarah", "Mike"];
  const recipients =
    testRecipients && testRecipients.length > 0 ? testRecipients : FALLBACK_RECIPIENTS;
  const [selectedRecipient, setSelectedRecipient] = useState<string>(
    () => recipients[0] ?? ""
  );
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [sentTestTo, setSentTestTo] = useState<string | null>(null);
  const sendTestTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sentTestClearRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep the select in sync when the upstream Testers list changes
  // (matches catalog-card.tsx:284 behavior).
  useEffect(() => {
    if (!recipients.includes(selectedRecipient)) {
      setSelectedRecipient(recipients[0] ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testRecipients, selectedRecipient]);

  function handleSendTest() {
    if (isSendingTest) return;
    const target = selectedRecipient;
    setIsSendingTest(true);
    setSentTestTo(null);
    if (sentTestClearRef.current) {
      clearTimeout(sentTestClearRef.current);
      sentTestClearRef.current = null;
    }
    if (sendTestTimerRef.current) clearTimeout(sendTestTimerRef.current);
    sendTestTimerRef.current = setTimeout(() => {
      setIsSendingTest(false);
      setSentTestTo(target);
      sentTestClearRef.current = setTimeout(() => setSentTestTo(null), 3000);
    }, 1500);
  }

  function enterMonitor() {
    // Only saved rows can enter monitor — there's nothing to test before
    // first Save. The caller's UI gating enforces this too; the guard
    // here is defensive.
    if (!message.slug) return;
    onMonitorRequest?.(message.id);
  }

  function exitMonitor() {
    onMonitorRequest?.(null);
  }

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
      setIsFixLoading(false);
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
      if (sendTestTimerRef.current) clearTimeout(sendTestTimerRef.current);
      if (sentTestClearRef.current) clearTimeout(sentTestClearRef.current);
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

  function handleFixOptOut() {
    if (isFixLoading) return;
    setIsFixLoading(true);
    // Matches built-in Fix's 1.5s simulated async (catalog-card.tsx:473)
    // so the affordance feels consistent across built-in and custom. Post-
    // Fix state is definitionally compliant by UX contract — set clean
    // directly instead of re-running the check, same as the built-in path.
    setTimeout(() => {
      const trimmed = editTemplate.trimEnd();
      let next: string;
      if (trimmed.length === 0) {
        next = "Reply STOP to opt out.";
      } else {
        const endsWithPunct = /[.!?]$/.test(trimmed);
        next = trimmed + (endsWithPunct ? " " : ". ") + "Reply STOP to opt out.";
      }
      setEditTemplate(next);
      clearComplianceTimer();
      setCompliance({ isCompliant: true, issues: [] });
      setShowComplianceHint(false);
      setIsFixLoading(false);
    }, 1500);
  }

  function handleSave() {
    if (!compliance.isCompliant) return;
    if (!editName.trim()) return;
    if (isAiLoading || isFixLoading) return;
    onSave(message.id, { name: editName.trim(), template: editTemplate });
    onEditRequest(null);
  }

  function handleCancel() {
    clearComplianceTimer();
    setCompliance({ isCompliant: true, issues: [] });
    setShowComplianceHint(false);
    // Never-saved rows have no deliverable identity (empty slug) and nothing
    // to roll back to — discard outright so they don't persist as zombies.
    // Saved rows just exit edit state; their last saved content stays.
    if (!message.slug && onDiscard) {
      onDiscard(message);
    } else {
      onEditRequest(null);
    }
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
      className={`relative rounded-xl border border-border-secondary bg-bg-primary p-4 shadow-xs min-[860px]:max-w-[540px] ${muted ? "opacity-70" : ""}`}
    >
      {isEditing ? (
        <div>
          {/* Edit-mode status indicator. Saved customs keep the pencil +
              "Edit" label pattern that built-ins use (mode indicator in
              the top-right). Never-saved customs skip it — the labeled
              Name field below is self-evidently create/edit mode and a
              redundant indicator adds noise. (PM bug 6) */}
          {message.slug && (
            <div className="flex items-center justify-end">
              <span className="flex items-center gap-1.5 p-1 text-fg-quaternary">
                <PencilIcon />
                <span className="text-sm">Edit</span>
              </span>
            </div>
          )}

          {/* Name form field. Explicit labeled input at the top of the
              card (PM bug 1). Previously the name input sat in the header
              row with transparent styling that users read as a static
              heading — "Enter a name" reasons from disable feedback didn't
              land because users didn't see the field at all. */}
          <div>
            <label
              htmlFor={`custom-name-${message.id}`}
              className="mb-1.5 block text-sm font-medium text-text-secondary"
            >
              Name
            </label>
            <input
              id={`custom-name-${message.id}`}
              ref={nameInputRef}
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="e.g. Holiday hours"
              className="w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2.5 text-sm text-text-primary placeholder:text-text-placeholder shadow-xs focus:border-border-brand focus:outline-none transition duration-100 ease-linear"
            />
          </div>

          {/* Editor body */}
          <div className="mt-4">
            <label
              htmlFor={`custom-body-${message.id}`}
              className="mb-1.5 block text-sm font-medium text-text-secondary"
            >
              Message
            </label>
            <div
              id={`custom-body-${message.id}`}
              className={`w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2.5 shadow-xs focus-within:border-border-brand transition duration-100 ease-linear ${
                isAiLoading || isFixLoading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              <MessageEditor
                template={editTemplate}
                categoryId={categoryId}
                disabled={isAiLoading || isFixLoading}
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
                <button
                  type="button"
                  onClick={handleFixOptOut}
                  disabled={isFixLoading}
                  className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-md border border-border-primary px-2.5 py-1 text-xs font-medium text-text-secondary transition duration-100 ease-linear hover:bg-bg-secondary cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isFixLoading && <Spinner className="size-3" />}
                  {isFixLoading ? "Fixing…" : "Fix"}
                </button>
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

              {/* Save / Cancel — no compliance/validation text in this row.
                  Compliance errors surface ONLY inline below the editor (red
                  issue + adjacent Fix button). Duplicating hints next to Save
                  muddies where the user should look for problems. The
                  explicit Name label at the top of the card + the disabled
                  Save button are the only Save-gating surfaces. */}
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
                  disabled={!compliance.isCompliant || isAiLoading || isFixLoading || nameIsEmpty}
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
          {/* Collapsed header — name + slug on the left; action icons on
              the right. Icon order when no mode is active: [kebab]
              [activity] [edit] — matches built-in alignment (PM follow-up).
              In monitor mode, the icons collapse to a single Activity +
              "Test & debug" label the same way built-ins do. No info icon,
              ever, for customs. */}
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
              {isMonitoring ? (
                <span className="flex items-center gap-1.5 p-1 text-fg-quaternary">
                  <Activity className="size-[17px]" />
                  <span className="text-sm">Test &amp; debug</span>
                </span>
              ) : (
                <>
                  {/* Kebab first (leftmost) — parent-controlled menu set.
                      onArchiveRequest → "Archive" (active rows)
                      onRestoreRequest + onDeleteRequest → "Restore" /
                      "Delete permanently" (archived rows). */}
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
                  {/* Activity icon — only on saved, non-archived rows.
                      Archived rows are read-only; never-saved rows have
                      nothing to test yet. */}
                  {!muted && message.slug && onMonitorRequest && (
                    <button
                      type="button"
                      onClick={enterMonitor}
                      className="p-1 text-fg-quaternary hover:text-fg-secondary transition duration-100 ease-linear cursor-pointer"
                      aria-label="Test & debug"
                    >
                      <Activity className="size-[17px]" />
                    </button>
                  )}
                  {/* Pencil — hidden on archived rows (read-only until
                      restored). */}
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
                </>
              )}
            </div>
          </div>

          <div
            className={muted || isMonitoring ? "mt-2" : "mt-2 cursor-pointer"}
            onClick={muted || isMonitoring ? undefined : enterEdit}
            role={muted || isMonitoring ? undefined : "button"}
            tabIndex={muted || isMonitoring ? undefined : 0}
            onKeyDown={
              muted || isMonitoring
                ? undefined
                : (e) => { if (e.key === "Enter") enterEdit(); }
            }
          >
            {message.template ? renderPreview(message.template) : (
              <p className="text-sm italic text-text-quaternary">No message yet.</p>
            )}
          </div>

          {/* Monitor expansion — mirrors CatalogCard's monitor view
              (catalog-card.tsx:896). Recent activity is always empty for
              customs in the prototype (no send history is tracked); Quick
              Send is stubbed the same way built-ins stub it. Layout and
              classes match the built-in deliberately so the two rendering
              paths stay visually interchangeable. */}
          {isMonitoring && (
            <div className="mt-6">
              <p className="text-xs font-medium text-text-tertiary uppercase tracking-wide">
                Recent activity
              </p>
              <div className="mt-3">
                <p className="text-sm text-text-tertiary text-center py-4">
                  No activity yet. This message hasn{"\u2019"}t been sent by your app.
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onAskClaude?.(message.name)}
                    className="text-sm font-semibold text-text-brand-secondary hover:text-text-brand-secondary_hover transition duration-100 ease-linear cursor-pointer"
                  >
                    Ask Claude
                  </button>
                  <button
                    type="button"
                    onClick={handleSendTest}
                    disabled={isSendingTest}
                    className="ml-2 text-sm font-semibold text-text-brand-secondary hover:text-text-brand-secondary_hover transition duration-100 ease-linear cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSendingTest ? "Sending…" : "Quick send"}
                  </button>
                  <select
                    value={selectedRecipient}
                    onChange={(e) => setSelectedRecipient(e.target.value)}
                    disabled={isSendingTest}
                    className="bg-transparent border-0 p-0 text-sm font-normal text-text-primary transition duration-100 ease-linear cursor-pointer focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                    aria-label="Test recipient"
                  >
                    {recipients.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                  {sentTestTo && (
                    <span
                      key={sentTestTo}
                      className="inline-flex items-center gap-1 text-xs font-medium text-text-success-primary whitespace-nowrap"
                      style={{ animation: "testSentFade 3s ease-out forwards" }}
                    >
                      <Check className="size-3.5" />
                      Sent to {sentTestTo}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={exitMonitor}
                  className="rounded-lg bg-bg-brand-solid px-4 py-2 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
