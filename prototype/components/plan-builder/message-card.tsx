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

export function MessageCard({ message }: { message: Message }) {
  const { state, toggleMessage } = useSession();
  const [editOpen, setEditOpen] = useState(false);

  const isEnabled = !!state.enabledMessages[message.id];
  const template =
    state.messageEdits[message.id] || message.template;

  return (
    <>
      <div className="rounded-xl border border-border-secondary bg-bg-primary p-4 shadow-xs">
        <div className={isEnabled ? "" : "opacity-50"}>
          {/* Top row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Toggle — always full opacity */}
              <button
                type="button"
                onClick={() => toggleMessage(message.id)}
                className={`relative w-10 h-6 rounded-full transition duration-100 ease-linear ${
                  isEnabled ? "bg-bg-brand-solid" : "bg-bg-quaternary"
                }`}
                style={{ opacity: 1 }}
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
            </div>
            <button
              type="button"
              onClick={() => setEditOpen(true)}
              className="text-xs text-text-brand-tertiary hover:text-text-brand-secondary cursor-pointer font-medium"
            >
              Edit
            </button>
          </div>

          {/* Message preview */}
          <div className="mt-3 text-sm text-text-tertiary leading-relaxed">
            {renderMessagePreview(template, state)}
          </div>

          {/* Trigger line */}
          <div className="mt-2 text-xs text-text-quaternary">
            {message.trigger}
          </div>

          {/* Expansion note */}
          {message.tier === "expansion" && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-text-warning-primary bg-bg-warning-primary rounded-lg px-2 py-1">
              ⭐ We register a separate campaign alongside yours
            </div>
          )}
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
