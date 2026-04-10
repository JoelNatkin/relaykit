"use client";

import { useState, useRef, useEffect } from "react";
import { Activity, Stars02 } from "@untitledui/icons";
import type { Message, VariantSet } from "@/data/messages";
import type { SessionState } from "@/context/session-context";
import {
  interpolateTemplate,
  getMessageNature,
  getTooltipText,
  extractVariables,
  getExampleValues,
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

// Group variable keys into human labels for the "Needs X" hint.
// Production compliance will be server-side; this is a client-side stub
// (substring match against interpolated demo values).
const VARIABLE_LABELS: Record<string, string> = {
  app_name: "business name",
  business_name: "business name",
  date: "appointment details",
  time: "appointment details",
  service_type: "appointment details",
  website_url: "website link",
  customer_name: "customer name",
  code: "verification code",
  order_id: "order details",
  tracking_url: "order details",
  ticket_id: "ticket details",
  eta: "delivery details",
  contact_phone: "contact info",
  address: "address",
  product_type: "order details",
  wait_time: "wait time",
  party_size: "party size",
  venue_type: "venue",
  location: "location",
  announcement_text: "announcement",
  sponsor_name: "sponsor",
  task_description: "task",
  alert_text: "alert",
  community_name: "community name",
};

function getVarLabel(key: string): string {
  return VARIABLE_LABELS[key] || key.replace(/_/g, " ");
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
  const vars = extractVariables(message.template);
  const valueMap = getExampleValues(categoryId);
  const missingLabels = new Set<string>();
  const lowered = text.toLowerCase();
  for (const v of vars) {
    const example = valueMap.get(v);
    if (!example) continue;
    const value = example.preview(state);
    if (!value) continue;
    if (!lowered.includes(value.toLowerCase())) {
      missingLabels.add(getVarLabel(v));
    }
  }
  for (const label of missingLabels) {
    issues.push(`Needs ${label}`);
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
  }, [isEditing, editText]);

  // Compliance: run check on every editText change. Update issues immediately
  // so already-visible hints reflect the latest text. When text becomes
  // compliant, hide the hint immediately (no debounce). When non-compliant,
  // debounce the initial reveal by 2s so the developer isn't nagged mid-type.
  useEffect(() => {
    if (!isEditing) return;
    const result = checkCompliance(editText, message, categoryId, state);
    setCompliance(result);

    if (complianceTimerRef.current) {
      clearTimeout(complianceTimerRef.current);
      complianceTimerRef.current = null;
    }

    if (result.isCompliant) {
      setShowComplianceHint(false);
    } else {
      complianceTimerRef.current = setTimeout(() => {
        setShowComplianceHint(true);
      }, 2000);
    }
  }, [editText, isEditing, message, categoryId, state]);

  useEffect(() => {
    return () => {
      if (complianceTimerRef.current) clearTimeout(complianceTimerRef.current);
      if (editTooltipTimerRef.current) clearTimeout(editTooltipTimerRef.current);
      if (monitorTooltipTimerRef.current) clearTimeout(monitorTooltipTimerRef.current);
    };
  }, []);

  function getInterpolatedText(template: string): string {
    return interpolateTemplate(template, categoryId, state).map(s => s.text).join("");
  }

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
      setEditText(getInterpolatedText(message.template));
      setActivePillId("standard");
      setCustomTextBuffer(null);
      setLastCannedPillId("standard");
    }
    setAiInput("");
    setIsAiLoading(false);
    setIsFixLoading(false);
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
    // Restore the last canned pill's clean, compliant version. Canned
    // variants are pre-validated so compliance passes immediately.
    const template = getPillTemplate(lastCannedPillId);
    if (!template) return;
    const restored = getInterpolatedText(template);
    setIsFixLoading(true);
    // Simulate async AI restore — real impl will call the AI backend
    setTimeout(() => {
      setEditText(restored);
      setActivePillId(lastCannedPillId);
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
      setIsAiLoading(false);
    }, 1500);
  }

  function handleCancel() {
    setCompliance({ isCompliant: true, issues: [] });
    setShowComplianceHint(false);
    exitEdit();
  }

  function handlePillClick(id: PillId) {
    if (id === "custom") {
      if (customTextBuffer !== null) {
        setEditText(customTextBuffer);
        setActivePillId("custom");
        setCompliance({ isCompliant: true, issues: [] });
        setShowComplianceHint(false);
      }
      return;
    }
    // Canned pill — if leaving custom, preserve the current text in buffer
    if (activePillId === "custom") {
      setCustomTextBuffer(editText);
    }
    const template = getPillTemplate(id);
    if (template) {
      setEditText(getInterpolatedText(template));
      setActivePillId(id);
      setLastCannedPillId(id);
      setCompliance({ isCompliant: true, issues: [] });
      setShowComplianceHint(false);
    }
  }

  function handleTextChange(newText: string) {
    setEditText(newText);
    setCustomTextBuffer(newText);
    if (activePillId !== "custom") {
      setActivePillId("custom");
    }
    // Compliance check runs via useEffect on editText change.
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

  const showFix = !compliance.isCompliant && showComplianceHint;
  const showCustomPill = customTextBuffer !== null;

  return (
    <div className="relative rounded-xl border border-border-secondary bg-bg-primary p-4 shadow-xs">
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
                <div className="absolute left-0 bottom-full mb-1 z-[100] rounded-lg bg-[#333333] px-3 py-2 text-xs text-white shadow-lg min-w-[220px] max-w-[280px] whitespace-normal leading-relaxed pointer-events-none">
                  {tooltipText}
                </div>
              )}
            </div>
            {isMarketing && !badge && (
              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium flex-shrink-0 bg-[#F9F5FF] border border-[#E9D7FE] text-[#7C3AED]">
                Marketing
              </span>
            )}
          </div>

          {/* Header action buttons — hidden while either expansion is open.
              Activity (monitor) on the left, pencil (edit) on the right. */}
          {!isEditing && !isMonitoring && (
            <div className="flex items-center gap-4 flex-shrink-0">
              {monitorMode && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={enterMonitor}
                    onMouseEnter={scheduleMonitorTooltip}
                    onMouseLeave={clearMonitorTooltip}
                    className="p-1 text-fg-quaternary hover:text-fg-secondary transition duration-100 ease-linear cursor-pointer"
                    aria-label="Test & debug"
                  >
                    <Activity className="size-[17px]" />
                  </button>
                  {showMonitorTooltip && (
                    <div className="absolute right-0 bottom-full mb-1 z-[100] rounded-lg bg-[#333333] px-3 py-2 text-xs text-white shadow-lg whitespace-nowrap leading-relaxed pointer-events-none">
                      Test & debug
                    </div>
                  )}
                </div>
              )}
              <div className="relative">
                <button
                  type="button"
                  onClick={enterEdit}
                  onMouseEnter={scheduleEditTooltip}
                  onMouseLeave={clearEditTooltip}
                  className="p-1 text-fg-quaternary hover:text-fg-secondary transition duration-100 ease-linear cursor-pointer"
                  aria-label="Edit message"
                >
                  <PencilIcon />
                </button>
                {showEditTooltip && (
                  <div className="absolute right-0 bottom-full mb-1 z-[100] rounded-lg bg-[#333333] px-3 py-2 text-xs text-white shadow-lg whitespace-nowrap leading-relaxed pointer-events-none">
                    Edit message
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Message body */}
        {isEditing ? (
          <div className="mt-4">
            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={editText}
              onChange={(e) => handleTextChange(e.target.value)}
              disabled={isAiLoading || isFixLoading}
              className="w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2.5 text-sm text-text-secondary leading-relaxed shadow-xs focus:border-border-brand focus:outline-none transition duration-100 ease-linear resize-none disabled:opacity-60 disabled:cursor-not-allowed"
              rows={3}
            />

            {/* Compliance hints + Restore — right-aligned, 16px gap */}
            {showFix && compliance.issues.length > 0 && (
              <div className="mt-1.5 flex items-start justify-end gap-4">
                <div className="flex flex-col items-end gap-0.5">
                  {compliance.issues.map((issue, i) => (
                    <p key={i} className="text-xs text-[#F97066]">
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
                  {isFixLoading ? "Restoring…" : "Restore"}
                </button>
              </div>
            )}

            {/* Edit controls — no divider, closer to textarea */}
            <div className="mt-3 space-y-3">
              {/* Style pills: Standard, Friendly, Brief, (Custom on far right).
                  Pill variants are pre-validated. If AI validation is added later,
                  pre-compute on edit open and cache so taps remain zero-latency. */}
              {variants && variants.length > 1 && (
                <div className="flex flex-wrap items-center gap-2">
                  {variants.map((v) => {
                    const pillId = v.id as PillId;
                    const isActive = activePillId === pillId;
                    return (
                      <button
                        key={v.id}
                        type="button"
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
                  {/* Custom pill — far right, visually separated */}
                  {showCustomPill && (
                    <button
                      type="button"
                      onClick={() => handlePillClick("custom")}
                      className={`ml-auto rounded-full px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition duration-100 ease-linear cursor-pointer ${
                        activePillId === "custom"
                          ? "bg-bg-brand-secondary text-text-brand-secondary"
                          : "border border-dashed border-border-secondary text-text-tertiary hover:text-text-secondary hover:border-border-primary"
                      }`}
                    >
                      Custom
                    </button>
                  )}
                </div>
              )}

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
                is open (monitor shows the text for reference, not for editing). */}
            <div
              className={isMonitoring ? "mt-2" : "mt-2 cursor-pointer"}
              onClick={isMonitoring ? undefined : enterEdit}
              role={isMonitoring ? undefined : "button"}
              tabIndex={isMonitoring ? undefined : 0}
              onKeyDown={
                isMonitoring
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
                section renders below, separated by a top divider. */}
            {isMonitoring && (
              <div className="mt-4 pt-4 border-t border-border-secondary">
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

                {/* Footer actions — mirrors edit mode's Save/Cancel position */}
                <div className="mt-4 flex items-center justify-end gap-5">
                  <button
                    type="button"
                    onClick={(e) => e.preventDefault()}
                    className="text-sm font-semibold text-text-brand-secondary hover:text-text-brand-secondary_hover transition duration-100 ease-linear cursor-pointer"
                  >
                    Ask Claude
                  </button>
                  <button
                    type="button"
                    onClick={exitMonitor}
                    className="rounded-lg bg-bg-secondary px-4 py-2 text-sm font-semibold text-text-secondary transition duration-100 ease-linear hover:bg-bg-secondary_hover cursor-pointer"
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
