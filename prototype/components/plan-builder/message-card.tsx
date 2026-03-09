"use client";

import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
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
          <span key={i} className="font-semibold text-gray-900">
            {state.appName || "Your App"}
          </span>
        );
      case "{code}":
        return (
          <span
            key={i}
            className="bg-amber-50 text-amber-700 px-1 rounded font-mono text-xs"
          >
            283947
          </span>
        );
      case "{date}":
        return (
          <span
            key={i}
            className="bg-blue-50 text-blue-700 px-1 rounded text-xs"
          >
            Mar 15, 2026
          </span>
        );
      case "{time}":
        return (
          <span
            key={i}
            className="bg-blue-50 text-blue-700 px-1 rounded text-xs"
          >
            2:30 PM
          </span>
        );
      case "{website_url}":
        return (
          <span key={i} className="text-brand-600">
            {state.website || "yourapp.com"}
          </span>
        );
      case "{service_type}":
        return (
          <span key={i}>{state.serviceType || "appointment"}</span>
        );
      case "STOP":
        return (
          <span key={i} className="text-rose-600 font-semibold">
            STOP
          </span>
        );
      default:
        return <span key={i}>{part}</span>;
    }
  });
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export function MessageCard({ message }: { message: Message }) {
  const { state, toggleMessage } = useSession();
  const [editOpen, setEditOpen] = useState(false);

  const isEnabled = !!state.enabledMessages[message.id];
  const template =
    state.messageEdits[message.id] || message.template;

  return (
    <>
      <motion.div
        layout
        variants={itemVariants}
        className="rounded-xl border border-secondary bg-white p-4 shadow-sm"
      >
        <div className={isEnabled ? "" : "opacity-50"}>
          {/* Top row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Toggle — always full opacity */}
              <button
                type="button"
                onClick={() => toggleMessage(message.id)}
                className={`relative w-10 h-6 rounded-full transition duration-100 ease-linear ${
                  isEnabled ? "bg-brand-600" : "bg-gray-200"
                }`}
                style={{ opacity: 1 }}
                aria-pressed={isEnabled}
                aria-label={`Toggle ${message.name}`}
              >
                <motion.div
                  layout
                  className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                  style={{ left: isEnabled ? "calc(100% - 1.25rem)" : "0.25rem" }}
                />
              </button>
              <span className="text-sm font-medium text-gray-900">
                {message.name}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setEditOpen(true)}
              className="text-xs text-brand-600 hover:text-brand-700 cursor-pointer font-medium"
            >
              Edit
            </button>
          </div>

          {/* Message preview */}
          <div className="mt-3 text-sm text-gray-600 leading-relaxed">
            {renderMessagePreview(template, state)}
          </div>

          {/* Trigger line */}
          <div className="mt-2 text-xs text-gray-400">
            {message.trigger}
          </div>

          {/* Expansion note */}
          {message.tier === "expansion" && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 rounded-lg px-2 py-1">
              ⭐ We register a separate campaign alongside yours
            </div>
          )}
        </div>
      </motion.div>

      <MessageEditModal
        message={message}
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
      />
    </>
  );
}
