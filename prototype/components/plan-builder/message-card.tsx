"use client";

import { useState, type ReactNode } from "react";
import { useSession } from "@/context/session-context";
import type { Message } from "@/data/messages";
import type { SessionState } from "@/context/session-context";
import { MessageEditModal } from "./message-edit-modal";

function renderMessagePreview(
  template: string,
  state: SessionState
): ReactNode[] {
  // Split on variables {…} and the STOP keyword
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
            className="bg-brand-50 text-brand-700 px-1 rounded text-xs"
          >
            Mar 15, 2026
          </span>
        );
      case "{time}":
        return (
          <span
            key={i}
            className="bg-brand-50 text-brand-700 px-1 rounded text-xs"
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
          <span key={i} className="text-text-error-primary font-semibold">
            STOP
          </span>
        );
      default:
        return <span key={i}>{part}</span>;
    }
  });
}

const TIER_BADGES: Record<string, { label: string; tooltip: string } | null> = {
  core: { label: "Core", tooltip: "On by default — most apps need these" },
  also_covered: { label: "Included", tooltip: "Your registration includes these — turn on what you need" },
  expansion: { label: "Add-on", tooltip: "Requires a separate campaign registration" },
};

export function MessageCard({ message }: { message: Message }) {
  const { state, toggleMessage } = useSession();
  const [editOpen, setEditOpen] = useState(false);

  const isEnabled = !!state.enabledMessages[message.id];
  const template =
    state.messageEdits[message.id] || message.template;
  const badge = TIER_BADGES[message.tier];

  return (
    <>
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
                className="inline-flex items-center rounded-full bg-bg-secondary px-2 py-0.5 text-[11px] font-medium text-text-quaternary"
                title={badge.tooltip}
              >
                {badge.label}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setEditOpen(true)}
            className="text-xs text-text-brand-tertiary hover:text-text-brand-secondary cursor-pointer font-medium"
          >
            Edit
          </button>
        </div>

        {/* Content below — fades when disabled */}
        <div className={isEnabled ? "" : "opacity-40"}>
          {/* Message preview */}
          <div className="mt-3 text-sm text-text-tertiary leading-relaxed">
            {renderMessagePreview(template, state)}
          </div>

          {/* Trigger line */}
          <div className="mt-2 text-xs text-text-quaternary">
            {message.trigger}
          </div>


        </div>
      </div>

      <MessageEditModal
        message={message}
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
      />
    </>
  );
}
