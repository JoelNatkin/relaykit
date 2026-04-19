"use client";

import { useState, useRef, useEffect } from "react";
import { Activity, Check, Plus, Stars02 } from "@untitledui/icons";
import type { Editor } from "@tiptap/react";
import type { Message, VariantSet } from "@/data/messages";
import type { SessionState } from "@/context/session-context";
import {
  interpolateTemplate,
  getMessageNature,
  getTooltipText,
  extractVariables,
  getExampleValues,
} from "@/lib/catalog-helpers";
import { VARIABLE_TOKEN_CLASSES } from "@/lib/variable-token";
import { getVariableScope } from "@/lib/variable-scope";
import { MessageEditor } from "@/lib/editor/message-editor";

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

function Spinner({ className }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className ?? ""}`} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/* ── Monitor/activity types ── */

export type LastSentStatus = "delivered" | "failed" | "pending";

export interface LastSent {
  timestamp: string;
  status: LastSentStatus;
  recipientName?: string;
}

export interface ActivityEntry {
  id: string;
  recipientName: string;
  status: LastSentStatus;
  timestamp: string;
  errorDetail?: string;
}

const STATUS_DOT: Record<LastSentStatus, string> = {
  delivered: "bg-fg-success-primary",
  failed: "bg-fg-error-primary",
  pending: "bg-fg-warning-primary",
};

const STATUS_LABEL: Record<LastSentStatus, string> = {
  delivered: "Delivered",
  failed: "Failed",
  pending: "Pending",
};

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(ms) || ms < 0) return "just now";
  const sec = Math.floor(ms / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day === 1) return "yesterday";
  if (day < 7) return `${day}d ago`;
  const wk = Math.floor(day / 7);
  if (wk < 4) return `${wk}w ago`;
  const mo = Math.floor(day / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.floor(day / 365)}y ago`;
}

/* ── Pill types ── */

type PillId = "standard" | "action-first" | "context-first" | "custom";

/* ── Compliance check (stub) ──
   Prototype stub — production compliance is server-side with full TCPA/10DLC
   rule evaluation. These checks are intentionally loose. */

interface ComplianceResult {
  isCompliant: boolean;
  issues: string[];
}

/**
 * Format labels as a grammatical list:
 *   1 → "X"
 *   2 → "X and Y"
 *   3+ → "X, Y, and Z"
 */
function joinLabels(labels: string[]): string {
  if (labels.length === 0) return "";
  if (labels.length === 1) return labels[0];
  if (labels.length === 2) return `${labels[0]} and ${labels[1]}`;
  return `${labels.slice(0, -1).join(", ")}, and ${labels[labels.length - 1]}`;
}

function checkCompliance(
  text: string,
  message: Message,
  categoryId: string,
  state: SessionState
): ComplianceResult {
  const issues: string[] = [];

  // Opt-out language: must contain STOP AND one of opt out / opt-out / unsubscribe
  const hasStop = /stop/i.test(text);
  const hasExitWord = /opt[- ]?out|unsubscribe/i.test(text);
  if (message.requiresStop && !(hasStop && hasExitWord)) {
    issues.push("Needs opt-out language");
  }

  // Required interpolation variables — each original {var} must still appear
  // in the edited text (substring match against interpolated demo value).
  // The error labels come directly from the + Variable dropdown's label
  // source (getExampleValues) so the two can never drift: adding a new
  // variable in the future only requires registering it once in
  // catalog-helpers.
  const vars = extractVariables(message.template);
  const valueMap = getExampleValues(categoryId);
  const missingLabels: string[] = [];
  const seen = new Set<string>();
  const lowered = text.toLowerCase();
  for (const v of vars) {
    const example = valueMap.get(v);
    if (!example) continue;
    const value = example.preview(state);
    if (!value) continue;
    if (!lowered.includes(value.toLowerCase()) && !seen.has(example.label)) {
      seen.add(example.label);
      missingLabels.push(example.label);
    }
  }
  if (missingLabels.length > 0) {
    issues.push(`Needs ${joinLabels(missingLabels)}`);
  }

  return { isCompliant: issues.length === 0, issues };
}

/* ── CatalogCard component ── */

export interface CatalogCardProps {
  message: Message;
  categoryId: string;
  state: SessionState;
  variants?: VariantSet[];
  /** Controlled edit state. When provided, parent manages which card is editing. */
  isEditing?: boolean;
  onEditRequest?: (messageId: string | null) => void;
  /** Optional badge rendered next to the message name */
  badge?: React.ReactNode;
  /** Enable the Activity icon, status line, and monitor expansion. Off by default so onboarding + public marketing cards stay clean. */
  monitorMode?: boolean;
  /** Last send outcome shown as a small colored dot + relative timestamp below the message body. */
  lastSent?: LastSent | null;
  /** Controlled monitor state. Mutually exclusive with isEditing. */
  isMonitoring?: boolean;
  onMonitorRequest?: (messageId: string | null) => void;
  /** Recent activity entries rendered inside the monitor expansion. */
  activity?: ActivityEntry[];
  /** Names shown in the monitor expansion's Send test dropdown. Kept in sync
   *  with the Test phones card in the right rail so both read from the same
   *  list. Falls back to the built-in list when not provided. */
  testRecipients?: string[];
  /** Invoked when the monitor expansion's "Ask Claude" button is clicked.
   *  Receives the current message name so the parent can focus the panel. */
  onAskClaude?: (messageName: string) => void;
  /** When true, all edit/monitor-entry affordances on this card are
   *  disabled — pencil, activity, preview click-to-edit — and hovering
   *  the icon buttons surfaces the lockedTooltip text. Used to lock
   *  every other card while a never-saved custom is open in edit; the
   *  authoring card itself is not locked. */
  locked?: boolean;
  /** Tooltip text shown on hover of the disabled pencil/activity icons
   *  when locked=true. Defaults to the standard icon tooltips otherwise. */
  lockedTooltip?: string;
}

export function CatalogCard({
  message,
  categoryId,
  state,
  variants,
  isEditing: controlledIsEditing,
  onEditRequest,
  badge,
  monitorMode = false,
  lastSent = null,
  isMonitoring: controlledIsMonitoring,
  onMonitorRequest,
  activity,
  testRecipients,
  onAskClaude,
  locked = false,
  lockedTooltip,
}: CatalogCardProps) {
  const isControlled = controlledIsEditing !== undefined;
  const isMonitoringControlled = controlledIsMonitoring !== undefined;
  const [showTooltip, setShowTooltip] = useState(false);
  const [showEditTooltip, setShowEditTooltip] = useState(false);
  const [showMonitorTooltip, setShowMonitorTooltip] = useState(false);
  const [localIsEditing, setLocalIsEditing] = useState(false);
  const [localIsMonitoring, setLocalIsMonitoring] = useState(false);
  const isEditing = isControlled ? controlledIsEditing : localIsEditing;
  const isMonitoring =
    monitorMode && (isMonitoringControlled ? controlledIsMonitoring : localIsMonitoring);
  const prevIsEditingRef = useRef(false);
  const [editText, setEditText] = useState("");
  const [savedText, setSavedText] = useState<string | null>(null);
  const [savedPillId, setSavedPillId] = useState<PillId>("standard");
  const [activePillId, setActivePillId] = useState<PillId>("standard");
  /** Most recent canned pill before switching to custom — used by Restore. */
  const [lastCannedPillId, setLastCannedPillId] = useState<PillId>("standard");
  const [customTextBuffer, setCustomTextBuffer] = useState<string | null>(null);
  const [aiInput, setAiInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isFixLoading, setIsFixLoading] = useState(false);
  const [compliance, setCompliance] = useState<ComplianceResult>({ isCompliant: true, issues: [] });
  const [showComplianceHint, setShowComplianceHint] = useState(false);
  const complianceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const editorRef = useRef<Editor | null>(null);
  const [isInsertOpen, setIsInsertOpen] = useState(false);
  const insertWrapperRef = useRef<HTMLDivElement>(null);

  // Header icon tooltips: short hover delay, and always clear on unmount-while-
  // hovered. The icons are unmounted when an expansion opens, so mouseLeave
  // never fires — without an explicit reset, the tooltip would come back
  // "stuck open" the next time the icons remount.
  const editTooltipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const monitorTooltipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function scheduleEditTooltip() {
    if (editTooltipTimerRef.current) clearTimeout(editTooltipTimerRef.current);
    editTooltipTimerRef.current = setTimeout(() => setShowEditTooltip(true), 300);
  }
  function clearEditTooltip() {
    if (editTooltipTimerRef.current) {
      clearTimeout(editTooltipTimerRef.current);
      editTooltipTimerRef.current = null;
    }
    setShowEditTooltip(false);
  }
  function scheduleMonitorTooltip() {
    if (monitorTooltipTimerRef.current) clearTimeout(monitorTooltipTimerRef.current);
    monitorTooltipTimerRef.current = setTimeout(() => setShowMonitorTooltip(true), 300);
  }
  function clearMonitorTooltip() {
    if (monitorTooltipTimerRef.current) {
      clearTimeout(monitorTooltipTimerRef.current);
      monitorTooltipTimerRef.current = null;
    }
    setShowMonitorTooltip(false);
  }

  // Send-test flow (prototype stub). Not wired to a backend; the confirmation
  // intentionally does not push a row into the activity list — only real
  // app-triggered sends appear there.
  const FALLBACK_RECIPIENTS = ["Joel", "Sarah", "Mike"];
  const recipients =
    testRecipients && testRecipients.length > 0 ? testRecipients : FALLBACK_RECIPIENTS;
  const [selectedRecipient, setSelectedRecipient] = useState<string>(() => recipients[0] ?? "");
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [sentTestTo, setSentTestTo] = useState<string | null>(null);
  const sendTestTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sentTestClearRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // If the selected recipient is removed from the list upstream, fall back
  // to the first remaining name so the <select> never holds a stale value.
  useEffect(() => {
    if (!recipients.includes(selectedRecipient)) {
      setSelectedRecipient(recipients[0] ?? "");
    }
    // Depend on the prop (stable across renders when identity is preserved)
    // and on the current selection.
  }, [testRecipients, selectedRecipient]); // eslint-disable-line react-hooks/exhaustive-deps

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
      // Unmount the confirmation after the 3s fade animation completes.
      sentTestClearRef.current = setTimeout(() => {
        setSentTestTo(null);
      }, 3000);
    }, 1500);
  }

  const nature = getMessageNature(message);
  const isMarketing = nature === "Marketing";
  const tooltipText = getTooltipText(message);

  const currentTemplate = savedText ?? message.template;

  // Compliance is invoked explicitly from the handlers that produce a new
  // editText (handleTextChange, handleAiSubmit, handlePillClick's custom
  // branch). It was previously a useEffect keyed on [editText, isEditing,
  // hasUserEdited, …] — that coupling made the check fire as a reactive
  // side effect during edit-mode transitions, producing false-positive
  // errors on first open and requiring a second Fix click because the
  // effect re-ran with stale state after Fix's batched reset. Explicit
  // invocation removes the ambiguity: compliance state only changes when
  // a user action says it should.
  function clearComplianceTimer() {
    if (complianceTimerRef.current) {
      clearTimeout(complianceTimerRef.current);
      complianceTimerRef.current = null;
    }
  }

  function runComplianceCheck(text: string) {
    // editText is a `{var_key}` template; compliance rules match
    // interpolated values, so resolve before checking.
    const resolved = interpolateTemplate(text, categoryId, state)
      .map((s) => s.text)
      .join("");
    const result = checkCompliance(resolved, message, categoryId, state);
    setCompliance(result);
    clearComplianceTimer();
    if (result.isCompliant) {
      setShowComplianceHint(false);
    } else {
      // Debounce the hint reveal by 2s so the developer isn't nagged
      // mid-type. Compliant states hide the hint immediately.
      complianceTimerRef.current = setTimeout(() => {
        setShowComplianceHint(true);
      }, 2000);
    }
  }

  useEffect(() => {
    return () => {
      if (complianceTimerRef.current) clearTimeout(complianceTimerRef.current);
      if (editTooltipTimerRef.current) clearTimeout(editTooltipTimerRef.current);
      if (monitorTooltipTimerRef.current) clearTimeout(monitorTooltipTimerRef.current);
      if (sendTestTimerRef.current) clearTimeout(sendTestTimerRef.current);
      if (sentTestClearRef.current) clearTimeout(sentTestClearRef.current);
    };
  }, []);

  function getPillTemplate(id: PillId): string | null {
    if (id === "standard") return message.template;
    if (id === "custom") return null;
    return message.variants?.[id] ?? null;
  }

  // Initialize edit-session state (editText, active pill, buffers, loading).
  // Called when isEditing transitions false→true, whether controlled or local.
  function initEditSession() {
    if (savedText !== null) {
      setEditText(savedText);
      setActivePillId(savedPillId);
      setCustomTextBuffer(savedPillId === "custom" ? savedText : customTextBuffer);
      // If saved as custom, fall back to standard as the canned baseline for Restore
      setLastCannedPillId(savedPillId === "custom" ? "standard" : savedPillId);
    } else {
      setEditText(message.template);
      setActivePillId("standard");
      setCustomTextBuffer(null);
      setLastCannedPillId("standard");
    }
    setAiInput("");
    setIsAiLoading(false);
    setIsFixLoading(false);
    clearComplianceTimer();
    setCompliance({ isCompliant: true, issues: [] });
    setShowComplianceHint(false);
  }

  // Watch for edit-state transitions and initialize when entering edit.
  // Unsaved edits are implicitly discarded when isEditing flips to false.
  useEffect(() => {
    if (isEditing && !prevIsEditingRef.current) {
      initEditSession();
    }
    prevIsEditingRef.current = isEditing;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing]);

  function enterEdit() {
    // Defensive guard: even if a disabled button is bypassed (dev tools,
    // keyboard activation on aria-disabled), don't transition state while
    // another unsaved custom is being authored.
    if (locked) return;
    clearEditTooltip();
    clearMonitorTooltip();
    // Opening edit closes any open monitor view.
    if (isMonitoring) exitMonitor();
    if (isControlled) {
      onEditRequest?.(message.id);
    } else {
      initEditSession();
      setLocalIsEditing(true);
    }
  }

  function exitEdit() {
    if (isControlled) {
      onEditRequest?.(null);
    } else {
      setLocalIsEditing(false);
    }
  }

  function enterMonitor() {
    if (!monitorMode) return;
    if (locked) return;
    clearEditTooltip();
    clearMonitorTooltip();
    // Opening monitor closes any open edit (unsaved changes discarded, same as edit→edit).
    if (isEditing) exitEdit();
    if (isMonitoringControlled) {
      onMonitorRequest?.(message.id);
    } else {
      setLocalIsMonitoring(true);
    }
  }

  function exitMonitor() {
    if (isMonitoringControlled) {
      onMonitorRequest?.(null);
    } else {
      setLocalIsMonitoring(false);
    }
  }

  function handleSave() {
    if (!compliance.isCompliant) return;
    setSavedText(editText);
    setSavedPillId(activePillId);
    if (activePillId === "custom") {
      setCustomTextBuffer(editText);
    }
    exitEdit();
  }

  function handleRestore() {
    if (isFixLoading) return;
    // Fix restores the last canned pill's clean, compliant version. Canned
    // variants are pre-validated so compliance passes immediately.
    const template = getPillTemplate(lastCannedPillId);
    if (!template) return;
    setIsFixLoading(true);
    // Simulate async AI fix — real impl will call the AI backend.
    // Post-Fix state is definitionally clean by UX contract, so we set
    // compliance directly rather than re-running the check.
    setTimeout(() => {
      setEditText(template);
      setActivePillId(lastCannedPillId);
      clearComplianceTimer();
      setCompliance({ isCompliant: true, issues: [] });
      setShowComplianceHint(false);
      setIsFixLoading(false);
    }, 1500);
  }

  function handleAiSubmit() {
    if (!aiInput.trim() || isAiLoading) return;
    setIsAiLoading(true);
    // Stubbed AI call — real impl will send aiInput + editText to the backend
    setTimeout(() => {
      // Placeholder rewrite: prepend a note so the developer sees something happened
      const rewritten = `${editText} (rewritten: ${aiInput.trim()})`;
      setEditText(rewritten);
      setCustomTextBuffer(rewritten);
      setActivePillId("custom");
      setAiInput("");
      runComplianceCheck(rewritten);
      setIsAiLoading(false);
    }, 1500);
  }

  function handleCancel() {
    clearComplianceTimer();
    setCompliance({ isCompliant: true, issues: [] });
    setShowComplianceHint(false);
    exitEdit();
  }

  function handlePillClick(id: PillId) {
    if (id === "custom") {
      if (customTextBuffer !== null) {
        setEditText(customTextBuffer);
        setActivePillId("custom");
        // Custom buffer is user-authored — re-check, it may be non-compliant.
        runComplianceCheck(customTextBuffer);
      }
      return;
    }
    // Canned pill — if leaving custom, preserve the current text in buffer
    if (activePillId === "custom") {
      setCustomTextBuffer(editText);
    }
    const template = getPillTemplate(id);
    if (template) {
      setEditText(template);
      setActivePillId(id);
      setLastCannedPillId(id);
      // Canned variants are pre-validated — clean by construction.
      clearComplianceTimer();
      setCompliance({ isCompliant: true, issues: [] });
      setShowComplianceHint(false);
    }
  }

  function insertVariable(key: string) {
    editorRef.current?.chain().focus().insertVariable(key).run();
    setIsInsertOpen(false);
  }

  // Close the insert popover on outside click / Escape.
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

  function handleTextChange(newText: string) {
    setEditText(newText);
    setCustomTextBuffer(newText);
    if (activePillId !== "custom") {
      setActivePillId("custom");
    }
    runComplianceCheck(newText);
  }

  function renderPreview(template: string) {
    const segments = interpolateTemplate(template, categoryId, state);
    return (
      <p className="text-sm text-text-secondary leading-relaxed">
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

  const showFix = !compliance.isCompliant && showComplianceHint;
  const showCustomPill = customTextBuffer !== null;

  return (
    <div
      className={`relative rounded-xl border border-border-secondary bg-bg-primary p-4 shadow-xs ${monitorMode ? "min-[860px]:max-w-[540px]" : ""}`}
    >
      {/* Header row */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <span className="text-sm font-semibold text-text-primary truncate">
              {message.name}
            </span>
            {badge}
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
                <div className="absolute left-0 bottom-full mb-1 z-[100] rounded-lg bg-bg-primary-solid px-3 py-2 text-xs text-text-white shadow-lg min-w-[220px] max-w-[280px] whitespace-normal leading-relaxed pointer-events-none">
                  {tooltipText}
                </div>
              )}
            </div>
            {isMarketing && !badge && (
              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium flex-shrink-0 bg-bg-brand-secondary text-text-brand-secondary">
                Marketing
              </span>
            )}
          </div>

          {/* Header action icons — when a card is expanded, show only
              the active mode's icon + a text label; when collapsed, show
              both icons (no labels). */}
          <div className="flex items-center flex-shrink-0">
            {isMonitoring ? (
              /* Monitor active: Activity icon + label (visual indicator) */
              <span className="flex items-center gap-1.5 p-1 text-fg-quaternary">
                <Activity className="size-[17px]" />
                <span className="text-sm">Test & debug</span>
              </span>
            ) : isEditing ? (
              /* Edit active: Pencil icon + label (visual indicator) */
              <span className="flex items-center gap-1.5 p-1 text-fg-quaternary">
                <PencilIcon />
                <span className="text-sm">Edit</span>
              </span>
            ) : (
              /* Default collapsed: both icons, no labels, gap-1 + p-1 = 12px
                 visible icon-to-icon spacing. */
              <div className="flex items-center gap-1">
                {monitorMode && (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => { if (locked) { e.preventDefault(); return; } enterMonitor(); }}
                      onMouseEnter={scheduleMonitorTooltip}
                      onMouseLeave={clearMonitorTooltip}
                      aria-disabled={locked}
                      className={`p-1 text-fg-quaternary transition duration-100 ease-linear ${locked ? "cursor-not-allowed opacity-60" : "hover:text-fg-secondary cursor-pointer"}`}
                      aria-label={locked ? "Locked" : "Test & debug"}
                    >
                      <Activity className="size-[17px]" />
                    </button>
                    {showMonitorTooltip && (
                      <div className="absolute right-0 bottom-full mb-1 z-[100] rounded-lg bg-bg-primary-solid px-3 py-2 text-xs text-text-white shadow-lg whitespace-nowrap leading-relaxed pointer-events-none">
                        {locked ? (lockedTooltip ?? "Locked") : "Test & debug"}
                      </div>
                    )}
                  </div>
                )}
                <div className="relative">
                  <button
                    type="button"
                    onClick={(e) => { if (locked) { e.preventDefault(); return; } enterEdit(); }}
                    onMouseEnter={scheduleEditTooltip}
                    onMouseLeave={clearEditTooltip}
                    aria-disabled={locked}
                    className={`p-1 text-fg-quaternary transition duration-100 ease-linear ${locked ? "cursor-not-allowed opacity-60" : "hover:text-fg-secondary cursor-pointer"}`}
                    aria-label={locked ? "Locked" : "Edit message"}
                  >
                    <PencilIcon />
                  </button>
                  {showEditTooltip && (
                    <div className="absolute right-0 bottom-full mb-1 z-[100] rounded-lg bg-bg-primary-solid px-3 py-2 text-xs text-text-white shadow-lg whitespace-nowrap leading-relaxed pointer-events-none">
                      {locked ? (lockedTooltip ?? "Locked") : "Edit message"}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Message body */}
        {isEditing ? (
          <div className="mt-4">
            {/* Editor — Tiptap with VariableNode atoms (D-350). editText holds
                the `{var_key}` template; the editor renders variables as
                atomic, color-only tokens that can't be partially edited. */}
            <div
              className={`w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2.5 shadow-xs focus-within:border-border-brand transition duration-100 ease-linear ${
                isAiLoading || isFixLoading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              <MessageEditor
                template={editText}
                categoryId={categoryId}
                disabled={isAiLoading || isFixLoading}
                className="text-sm text-text-secondary leading-relaxed outline-none"
                onChange={handleTextChange}
                onReady={(editor) => {
                  editorRef.current = editor;
                }}
              />
            </div>

            {/* Compliance hints + Fix — right-aligned, 16px gap */}
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
                  onClick={handleRestore}
                  disabled={isFixLoading}
                  className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-md border border-border-primary px-2.5 py-1 text-xs font-medium text-text-secondary transition duration-100 ease-linear hover:bg-bg-secondary cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isFixLoading && <Spinner className="size-3" />}
                  {isFixLoading ? "Fixing…" : "Fix"}
                </button>
              </div>
            )}

            {/* Edit controls — tightened to the editor (PM layout fix).
                mt-1.5 sits the pills/+ Variable row closer to the message it
                acts on. items-start inside the row top-aligns + Variable with
                the tone pills so the top edges match. */}
            <div className="mt-1.5 space-y-3">
              {/* Style pills + insert affordance (D-353).
                  Left cluster: tone pills (Standard / Friendly / Brief) + Custom.
                  Custom is a tone state (just user-authored), so it groups with
                  the canned variants rather than with the insert control.
                  Right cluster (flex-pushed): `+ Variable` tertiary button.
                  Every button in this row uses onMouseDown preventDefault so the
                  click doesn't blur the editor — keeping ProseMirror's selection
                  machinery live across tone swaps, which otherwise broke
                  click-to-select on tokens after any pill interaction. */}
              <div className="flex flex-wrap items-start gap-2">
                {variants && variants.length > 1 && variants.map((v) => {
                  const pillId = v.id as PillId;
                  const isActive = activePillId === pillId;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handlePillClick(pillId)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition duration-100 ease-linear cursor-pointer ${
                        isActive
                          ? "bg-bg-brand-secondary text-text-brand-secondary"
                          : "border border-border-secondary text-text-tertiary hover:text-text-secondary hover:border-border-primary"
                      }`}
                    >
                      {v.label}
                    </button>
                  );
                })}

                {showCustomPill && (
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handlePillClick("custom")}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition duration-100 ease-linear cursor-pointer ${
                      activePillId === "custom"
                        ? "bg-bg-brand-secondary text-text-brand-secondary"
                        : "border border-dashed border-border-secondary text-text-tertiary hover:text-text-secondary hover:border-border-primary"
                    }`}
                  >
                    Custom
                  </button>
                )}

                {/* + Variable — tertiary purple text button at far right.
                    Matches the Ask Claude pattern elsewhere in the file:
                    no background on hover, just a color shift via the
                    text-brand-secondary_hover token. */}
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
                    const scope = getVariableScope(message, categoryId);
                    const valueMap = getExampleValues(categoryId);
                    const rows = scope
                      .map((key) => ({ key, value: valueMap.get(key) }))
                      .filter((r): r is { key: string; value: NonNullable<typeof r.value> } => !!r.value);
                    return (
                      <div
                        role="menu"
                        className="absolute right-0 top-full mt-1 z-20 rounded-lg border border-border-secondary bg-bg-primary shadow-lg py-1"
                      >
                        {rows.length === 0 ? (
                          <p className="px-3 py-2 text-sm text-text-tertiary whitespace-nowrap">
                            No variables for this message.
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

              {/* AI help input */}
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
                      : activePillId === "custom"
                        ? "Ask AI: polish my edit"
                        : "Ask AI: make it more casual"
                  }
                  className="w-full rounded-lg border border-border-primary bg-bg-primary pl-9 pr-3 py-2 text-sm text-text-primary placeholder:text-text-placeholder shadow-xs focus:border-border-brand focus:outline-none transition duration-100 ease-linear disabled:bg-bg-secondary disabled:cursor-not-allowed"
                />
              </div>

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
                  disabled={!compliance.isCompliant || isFixLoading || isAiLoading}
                  className="rounded-lg bg-bg-brand-solid px-4 py-2 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Read-only message text. Clickable to enter edit unless monitor
                is open or the card is locked (another unsaved custom is open). */}
            <div
              className={isMonitoring || locked ? "mt-2" : "mt-2 cursor-pointer"}
              onClick={isMonitoring || locked ? undefined : enterEdit}
              role={isMonitoring || locked ? undefined : "button"}
              tabIndex={isMonitoring || locked ? undefined : 0}
              onKeyDown={
                isMonitoring || locked
                  ? undefined
                  : (e) => { if (e.key === "Enter") enterEdit(); }
              }
            >
              {renderPreview(currentTemplate)}
            </div>
            {monitorMode && lastSent && (
              <div className="mt-2 flex items-center gap-1.5">
                <span
                  className={`inline-block size-1.5 rounded-full ${STATUS_DOT[lastSent.status]}`}
                />
                <span className="text-xs text-text-tertiary">
                  {lastSent.status === "pending"
                    ? STATUS_LABEL[lastSent.status]
                    : `${STATUS_LABEL[lastSent.status]} ${timeAgo(lastSent.timestamp)}`}
                </span>
              </div>
            )}

            {/* Monitor expansion — message text stays above; Recent Activity
                section renders below with 24px of breathing room. */}
            {isMonitoring && (
              <div className="mt-6">
                <p className="text-xs font-medium text-text-tertiary uppercase tracking-wide">
                  Recent activity
                </p>

                {/* Activity list */}
                <div className="mt-3">
                  {activity && activity.length > 0 ? (
                    <ul className="divide-y divide-border-secondary">
                      {activity.map((entry) => (
                        <li key={entry.id} className="py-2.5 first:pt-0 last:pb-0">
                          <div className="flex items-center justify-between gap-3 text-sm">
                            <span className="text-text-secondary truncate">
                              {entry.recipientName}
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-text-tertiary flex-shrink-0">
                              <span
                                className={`inline-block size-1.5 rounded-full ${STATUS_DOT[entry.status]}`}
                              />
                              <span>
                                {STATUS_LABEL[entry.status]} {timeAgo(entry.timestamp)}
                              </span>
                            </span>
                          </div>
                          {entry.errorDetail && (
                            <p className="mt-0.5 pl-3 text-xs text-text-tertiary">
                              {entry.errorDetail}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-text-tertiary text-center py-4">
                      No activity yet. This message hasn{"\u2019"}t been sent by your app.
                    </p>
                  )}
                </div>

                {/* Footer actions — mirrors edit mode's Save/Cancel row.
                    Left: tertiary Ask Claude + recipient select + Send test
                    (all plain text, no borders) with an inline send-test
                    confirmation that fades on success. Right: primary Close. */}
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
