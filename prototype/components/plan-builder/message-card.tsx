"use client";

import { useState, useRef, useEffect, useCallback, type ReactNode } from "react";
import { useSession } from "@/context/session-context";
import type { Message } from "@/data/messages";
import type { SessionState } from "@/context/session-context";

/* ── Template parsing helpers ── */

const STOP_SUFFIXES = [
  " Reply STOP to opt out.",
  " Reply STOP to unsubscribe.",
];

/** Split a template into { prefix, middle, suffix } for inline editing.
 *  prefix  = "{app_name}: " (always locked)
 *  suffix  = " Reply STOP to opt out." or similar (locked when present)
 *  middle  = the editable portion
 */
function parseTemplate(template: string): {
  prefix: string;
  middle: string;
  suffix: string;
} {
  let remaining = template;

  // Strip prefix — handle "{app_name}: " or "{app_name} "
  let prefix = "{app_name}: ";
  if (remaining.startsWith("{app_name}: ")) {
    remaining = remaining.slice("{app_name}: ".length);
  } else if (remaining.startsWith("{app_name} ")) {
    remaining = remaining.slice("{app_name} ".length);
  } else {
    prefix = "";
  }

  // Strip STOP suffix
  let suffix = "";
  for (const s of STOP_SUFFIXES) {
    if (remaining.endsWith(s)) {
      suffix = s;
      remaining = remaining.slice(0, -s.length);
      break;
    }
  }

  return { prefix, middle: remaining, suffix };
}

/** Reconstruct full template from parts */
function reconstructTemplate(prefix: string, middle: string, suffix: string): string {
  return prefix + middle + suffix;
}

/* ── Preview rendering ── */

function renderMessagePreview(
  template: string,
  state: SessionState
): ReactNode[] {
  const parts = template.split(/(\{[^}]+\}|STOP)/g);
  return parts.map((part, i) => {
    switch (part) {
      case "{app_name}":
        return (
          <span key={i} className="font-semibold text-text-primary">
            {state.appName || "Your App"}
          </span>
        );
      case "{code}":
        return (
          <span
            key={i}
            className="bg-warning-50 text-warning-700 px-1 rounded font-mono text-xs"
          >
            283947
          </span>
        );
      case "{date}":
        return (
          <span
            key={i}
            className="bg-bg-secondary text-text-secondary px-1 rounded text-xs"
          >
            Mar 15, 2026
          </span>
        );
      case "{time}":
        return (
          <span
            key={i}
            className="bg-bg-secondary text-text-secondary px-1 rounded text-xs"
          >
            2:30 PM
          </span>
        );
      case "{website_url}":
        return (
          <span key={i} className="text-text-brand-tertiary">
            {state.website || "yourapp.com"}
          </span>
        );
      case "{service_type}":
        return (
          <span key={i}>{state.serviceType || "appointment"}</span>
        );
      case "STOP":
        return (
          <span key={i} className="font-semibold">
            STOP
          </span>
        );
      default:
        return <span key={i}>{part}</span>;
    }
  });
}

/* ── Trigger line formatting ── */

function formatTrigger(trigger: string): string {
  // "When appointment booked" → "Triggers when appointment booked"
  // "24h before appointment" → "Triggers 24h before appointment"
  // "Manually sent" → "Triggers manually sent"
  const first = trigger.charAt(0);
  if (first >= "A" && first <= "Z") {
    return "Triggers " + first.toLowerCase() + trigger.slice(1);
  }
  return "Triggers " + trigger;
}

/* ── Tier badges ── */

const TIER_BADGES: Record<string, { label: string; tooltip: string; className: string } | null> = {
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
};

/* ── Auto-sizing textarea hook ── */

function useAutoResize(value: string) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const resize = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }, []);

  useEffect(() => {
    resize();
  }, [value, resize]);

  return { ref, resize };
}

/* ── Component ── */

export function MessageCard({ message }: { message: Message }) {
  const { state, toggleMessage, editMessage } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const { ref: textareaRef, resize } = useAutoResize(editText);

  const isEnabled = !!state.enabledMessages[message.id];
  const fullTemplate = state.messageEdits[message.id] || message.template;
  const badge = TIER_BADGES[message.tier];
  const parsed = parseTemplate(fullTemplate);

  function handleEdit() {
    setEditText(parsed.middle);
    setIsEditing(true);
  }

  function handleSave() {
    const newTemplate = reconstructTemplate(parsed.prefix, editText, parsed.suffix);
    editMessage(message.id, newTemplate);
    setIsEditing(false);
  }

  function handleCancel() {
    setIsEditing(false);
  }

  return (
    <div className="rounded-xl border border-border-secondary bg-bg-primary p-4 shadow-xs">
      {/* Top row — toggle + name always full opacity */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
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
          <span className="text-sm font-medium text-text-primary">
            {message.name}
          </span>
          {badge && (
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${badge.className}`}
              title={badge.tooltip}
            >
              {badge.label}
            </span>
          )}
        </div>
        {!isEditing && (
          <button
            type="button"
            onClick={handleEdit}
            className="text-xs text-text-brand-tertiary hover:text-text-brand-secondary cursor-pointer font-medium"
          >
            Edit
          </button>
        )}
      </div>

      {/* Content below — fades when disabled */}
      <div className={isEnabled ? "" : "opacity-40"}>
        {isEditing ? (
          /* ── Edit mode ── */
          <div className="mt-3">
            <div className="text-sm leading-relaxed">
              {/* Locked prefix */}
              {parsed.prefix && (
                <span className="text-text-quaternary select-none">
                  {(state.appName || "Your App") + ": "}
                </span>
              )}

              {/* Auto-sizing textarea */}
              <textarea
                ref={textareaRef}
                value={editText}
                onChange={(e) => {
                  setEditText(e.target.value);
                  resize();
                }}
                className="w-full mt-1 rounded-lg border border-border-primary p-3 text-sm text-text-primary resize-none shadow-xs focus:outline-none focus:ring-1 focus:ring-focus-ring focus:border-border-brand leading-relaxed"
                rows={2}
              />

              {/* Locked suffix */}
              {parsed.suffix && (
                <span className="text-text-quaternary select-none text-sm">
                  {parsed.suffix.trim()}
                </span>
              )}
            </div>

            {/* Save / Cancel buttons */}
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
                className="bg-bg-brand-solid text-text-white rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-bg-brand-solid_hover shadow-xs transition duration-100 ease-linear cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          /* ── Preview mode ── */
          <>
            <div className="mt-3 text-sm text-text-tertiary leading-relaxed">
              {renderMessagePreview(fullTemplate, state)}
            </div>

            <div className="mt-2 text-xs text-text-quaternary">
              {formatTrigger(message.trigger)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
