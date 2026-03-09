"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSession } from "@/context/session-context";
import type { Message } from "@/data/messages";
import type { SessionState, CustomMessage } from "@/context/session-context";

/* ── Variable definitions per category ── */

interface Variable {
  key: string;
  label: string;
  preview: (state: SessionState) => string;
}

const CATEGORY_VARIABLES: Record<string, Variable[]> = {
  verification: [
    { key: "app_name", label: "Business name", preview: (s) => s.appName || "Your App" },
    { key: "code", label: "Code", preview: () => "283947" },
    { key: "website_url", label: "Website", preview: (s) => s.website || "yourapp.com" },
    { key: "customer_name", label: "Customer name", preview: () => "Alex" },
  ],
  appointments: [
    { key: "app_name", label: "Business name", preview: (s) => s.appName || "Your App" },
    { key: "date", label: "Date", preview: () => "Mar 15, 2026" },
    { key: "time", label: "Time", preview: () => "2:30 PM" },
    { key: "service_type", label: "Service type", preview: (s) => s.serviceType || "appointment" },
    { key: "customer_name", label: "Customer name", preview: () => "Alex" },
    { key: "website_url", label: "Website", preview: (s) => s.website || "yourapp.com" },
  ],
};

function getVariables(categoryId: string): Variable[] {
  return CATEGORY_VARIABLES[categoryId] || CATEGORY_VARIABLES.verification;
}

function getVariableMap(categoryId: string): Map<string, Variable> {
  return new Map(getVariables(categoryId).map((v) => [v.key, v]));
}

/* ── STOP suffix handling ── */

const STOP_SUFFIX = " Reply STOP to opt out.";
const STOP_SUFFIXES = [
  " Reply STOP to opt out.",
  " Reply STOP to unsubscribe.",
];

function stripStopSuffix(template: string): string {
  for (const s of STOP_SUFFIXES) {
    if (template.endsWith(s)) {
      return template.slice(0, -s.length);
    }
  }
  return template;
}

/* ── Pill styling ── */

const PILL_CLASSES =
  "inline-flex items-center bg-bg-secondary text-text-secondary px-1.5 py-0.5 rounded text-xs font-medium whitespace-nowrap select-none";

/* ── DOM ↔ Template conversion ── */

function buildEditableContent(
  template: string,
  state: SessionState,
  categoryId: string
): DocumentFragment {
  const fragment = document.createDocumentFragment();
  const varMap = getVariableMap(categoryId);

  const parts = template.split(/(\{[^}]+\})/g);
  for (const part of parts) {
    const match = part.match(/^\{(\w+)\}$/);
    if (match) {
      const key = match[1];
      const v = varMap.get(key);
      if (v) {
        const pill = document.createElement("span");
        pill.contentEditable = "false";
        pill.setAttribute("data-var", key);
        pill.className = PILL_CLASSES;
        pill.textContent = v.preview(state);
        fragment.appendChild(pill);
      } else {
        // Unknown variable — render as plain text
        fragment.appendChild(document.createTextNode(part));
      }
    } else if (part) {
      fragment.appendChild(document.createTextNode(part));
    }
  }

  return fragment;
}

function domToTemplate(el: HTMLElement): string {
  let result = "";
  for (const node of Array.from(el.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE) {
      result += node.textContent || "";
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      if (element.hasAttribute("data-var")) {
        result += `{${element.getAttribute("data-var")}}`;
      } else if (element.tagName === "BR") {
        result += " ";
      } else {
        // Recurse into divs/spans browser may create
        result += domToTemplate(element);
      }
    }
  }
  return result;
}

/* ── Trigger line formatting ── */

function formatTrigger(trigger: string): string {
  const first = trigger.charAt(0);
  if (first >= "A" && first <= "Z") {
    return "Triggers " + first.toLowerCase() + trigger.slice(1);
  }
  return "Triggers " + trigger;
}

/* ── Tier badges ── */

const TIER_BADGES: Record<
  string,
  { label: string; tooltip: string; className: string } | null
> = {
  core: {
    label: "Core",
    tooltip: "On by default \u2014 most apps need these",
    className: "bg-[#F9F5FF] border border-[#E9D7FE] text-[#6941C6]",
  },
  also_covered: {
    label: "Available",
    tooltip: "Your registration includes these \u2014 turn on what you need",
    className: "bg-[#ECFDF3] border border-[#ABEFC6] text-[#067647]",
  },
  expansion: {
    label: "Add-on",
    tooltip: "Requires a separate campaign registration",
    className: "bg-[#EEF4FF] border border-[#C7D7FE] text-[#3538CD]",
  },
  custom: {
    label: "Custom",
    tooltip: "Custom message you created",
    className: "bg-[#F2F4F7] border border-[#D0D5DD] text-[#344054]",
  },
};

/* ── MessageCard component ── */

interface MessageCardProps {
  message: Message | CustomMessage;
  categoryId: string;
  isCustom?: boolean;
  onDelete?: () => void;
}

export function MessageCard({
  message,
  categoryId,
  isCustom = false,
  onDelete,
}: MessageCardProps) {
  const { state, toggleMessage, editMessage, updateCustomMessage } = useSession();
  const editableRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const originalContentRef = useRef<string>("");
  const isInitializedRef = useRef(false);

  const isEnabled = !!state.enabledMessages[message.id];
  const tier = isCustom ? "custom" : (message as Message).tier;
  const badge = TIER_BADGES[tier];
  const trigger = isCustom ? (message as CustomMessage).trigger : (message as Message).trigger;

  // Get the current full template
  const fullTemplate = state.messageEdits[message.id] || message.template;
  const editableContent = stripStopSuffix(fullTemplate);

  // Initialize contentEditable on mount
  useEffect(() => {
    if (!editableRef.current) return;
    editableRef.current.textContent = "";
    editableRef.current.appendChild(
      buildEditableContent(editableContent, state, categoryId)
    );
    originalContentRef.current = editableContent;
    isInitializedRef.current = true;
    setIsDirty(false);
    setValidationError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message.id]);

  // Sync pill preview text when personalization fields change (without disrupting DOM)
  useEffect(() => {
    if (!editableRef.current || !isInitializedRef.current) return;
    const varMap = getVariableMap(categoryId);
    const pills = editableRef.current.querySelectorAll("[data-var]");
    pills.forEach((pill) => {
      const key = pill.getAttribute("data-var");
      if (key) {
        const v = varMap.get(key);
        if (v) pill.textContent = v.preview(state);
      }
    });
  }, [state.appName, state.serviceType, state.website, categoryId]);

  // Handle external template changes (e.g., reset to defaults)
  useEffect(() => {
    if (!editableRef.current || !isInitializedRef.current) return;
    if (editableContent !== originalContentRef.current && !isDirty) {
      editableRef.current.textContent = "";
      editableRef.current.appendChild(
        buildEditableContent(editableContent, state, categoryId)
      );
      originalContentRef.current = editableContent;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editableContent]);

  const checkDirty = useCallback(() => {
    if (!editableRef.current) return;
    const current = domToTemplate(editableRef.current);
    const dirty = current !== originalContentRef.current;
    setIsDirty(dirty);
    // Clear validation error if app_name is back
    if (validationError && current.includes("{app_name}")) {
      setValidationError(null);
    }
  }, [validationError]);

  function handleInput() {
    checkDirty();
  }

  function handleSave() {
    if (!editableRef.current) return;
    const content = domToTemplate(editableRef.current);
    if (!content.includes("{app_name}")) {
      setValidationError("Your business name must appear in every message.");
      return;
    }
    const newTemplate = content + STOP_SUFFIX;
    if (isCustom) {
      updateCustomMessage(message.id, { template: newTemplate });
    } else {
      editMessage(message.id, newTemplate);
    }
    originalContentRef.current = content;
    setIsDirty(false);
    setValidationError(null);
  }

  function handleCancel() {
    if (!editableRef.current) return;
    editableRef.current.textContent = "";
    editableRef.current.appendChild(
      buildEditableContent(originalContentRef.current, state, categoryId)
    );
    setIsDirty(false);
    setValidationError(null);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(text));
      range.collapse(false);
      checkDirty();
    }
  }

  function insertVariable(varKey: string) {
    const el = editableRef.current;
    if (!el) return;

    const varMap = getVariableMap(categoryId);
    const v = varMap.get(varKey);
    if (!v) return;

    const pill = document.createElement("span");
    pill.contentEditable = "false";
    pill.setAttribute("data-var", varKey);
    pill.className = PILL_CLASSES;
    pill.textContent = v.preview(state);

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      // Only insert if cursor is inside our editable div
      if (el.contains(range.startContainer)) {
        range.deleteContents();
        range.insertNode(pill);
        range.setStartAfter(pill);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        // Place at end
        el.appendChild(pill);
      }
    } else {
      el.appendChild(pill);
    }

    el.focus();
    checkDirty();
  }

  function insertAppNameAtStart() {
    const el = editableRef.current;
    if (!el) return;

    const varMap = getVariableMap(categoryId);
    const v = varMap.get("app_name");
    if (!v) return;

    const pill = document.createElement("span");
    pill.contentEditable = "false";
    pill.setAttribute("data-var", "app_name");
    pill.className = PILL_CLASSES;
    pill.textContent = v.preview(state);

    const colonSpace = document.createTextNode(": ");

    el.insertBefore(colonSpace, el.firstChild);
    el.insertBefore(pill, el.firstChild);
    checkDirty();
  }

  const variables = getVariables(categoryId);

  return (
    <div
      className={`rounded-xl border bg-bg-primary p-4 shadow-xs transition duration-100 ease-linear ${
        validationError
          ? "border-border-error"
          : "border-border-secondary"
      }`}
    >
      {/* Top row — toggle + name + badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => toggleMessage(message.id)}
            className={`relative w-10 h-6 rounded-full transition duration-100 ease-linear flex-shrink-0 ${
              isEnabled ? "bg-bg-brand-solid" : "bg-bg-quaternary"
            }`}
            aria-pressed={isEnabled}
            aria-label={`Toggle ${message.name}`}
          >
            <div
              className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-[left] duration-100 ease-linear"
              style={{ left: isEnabled ? "calc(100% - 1.25rem)" : "0.25rem" }}
            />
          </button>

          {isCustom ? (
            <input
              type="text"
              value={message.name}
              onChange={(e) =>
                updateCustomMessage(message.id, { name: e.target.value })
              }
              className="text-sm font-medium text-text-primary bg-transparent outline-none border-b border-transparent focus:border-border-brand min-w-0 flex-1"
              placeholder="Message name"
            />
          ) : (
            <span className="text-sm font-medium text-text-primary truncate">
              {message.name}
            </span>
          )}

          {badge && (
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium flex-shrink-0 ${badge.className}`}
              title={badge.tooltip}
            >
              {badge.label}
            </span>
          )}
        </div>

        {/* Delete button for custom messages */}
        {isCustom && onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="text-xs text-text-quaternary hover:text-fg-error-primary cursor-pointer font-medium ml-2"
          >
            Delete
          </button>
        )}
      </div>

      {/* Content — fades when disabled */}
      <div className={isEnabled ? "" : "opacity-40"}>
        {/* Message body — always editable */}
        <div className="mt-3">
          {/* Single bordered container — reads as one continuous SMS */}
          <div
            className={`rounded-lg border bg-bg-primary p-3 text-sm text-text-tertiary leading-relaxed transition duration-100 ease-linear ${
              isFocused
                ? "border-border-brand ring-1 ring-focus-ring shadow-xs"
                : "border-border-secondary"
            }`}
          >
            {/* Editable message content with variable pills */}
            <div
              ref={editableRef}
              contentEditable
              suppressContentEditableWarning
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="outline-none min-h-[1.5em] text-text-tertiary"
              role="textbox"
              aria-label="Message text"
            />

            {/* Locked suffix — same text style, not editable */}
            <span className="select-none pointer-events-none text-text-tertiary">
              {" "}Reply <strong>STOP</strong> to opt out.
            </span>
          </div>

          {/* Variable palette — visible when editable area has focus */}
          {isFocused && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {variables.map((v) => (
                <button
                  key={v.key}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault(); // Prevents blur on contentEditable
                    insertVariable(v.key);
                  }}
                  className="inline-flex items-center bg-bg-secondary text-text-secondary px-2 py-1 rounded text-xs font-medium hover:bg-bg-secondary_hover transition duration-100 ease-linear cursor-pointer"
                >
                  {v.label}
                </button>
              ))}
            </div>
          )}

          {/* Validation error */}
          {validationError && (
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="text-text-error-primary">{validationError}</span>
              <button
                type="button"
                onClick={insertAppNameAtStart}
                className="text-text-brand-secondary hover:text-text-brand-secondary_hover font-medium cursor-pointer underline"
              >
                Insert business name
              </button>
            </div>
          )}

          {/* Trigger line */}
          <div className="mt-2 text-xs text-text-quaternary">
            {isCustom ? (
              <span className="inline-flex items-center gap-1">
                <span className="text-text-quaternary">Triggers</span>
                <input
                  type="text"
                  value={trigger}
                  onChange={(e) =>
                    updateCustomMessage(message.id, { trigger: e.target.value })
                  }
                  className="text-xs text-text-quaternary bg-transparent outline-none border-b border-transparent focus:border-border-brand"
                  placeholder="when something happens"
                />
              </span>
            ) : (
              formatTrigger(trigger)
            )}
          </div>

          {/* Save / Cancel — only when dirty */}
          {isDirty && (
            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-lg border border-border-secondary px-3 py-1.5 text-xs font-medium text-text-secondary shadow-xs hover:bg-bg-secondary transition duration-100 ease-linear cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!!validationError}
                className="bg-bg-brand-solid text-text-white rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-bg-brand-solid_hover shadow-xs transition duration-100 ease-linear cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Add message card ── */

interface AddMessageCardProps {
  categoryId: string;
}

export function AddMessageCard({ categoryId }: AddMessageCardProps) {
  const { addCustomMessage } = useSession();

  return (
    <button
      type="button"
      onClick={() => addCustomMessage(categoryId)}
      className="w-full rounded-xl border border-dashed border-border-secondary bg-bg-primary p-4 text-sm font-medium text-text-tertiary hover:bg-bg-secondary hover:text-text-secondary hover:border-border-primary transition duration-100 ease-linear cursor-pointer text-center"
    >
      + Add message
    </button>
  );
}
