"use client";

import { useState, useEffect } from "react";
import { XClose } from "@untitledui/icons";
import { useSession } from "@/context/session-context";
import type { Message } from "@/data/messages";

interface MessageEditModalProps {
  message: Message;
  isOpen: boolean;
  onClose: () => void;
}

export function MessageEditModal({
  message,
  isOpen,
  onClose,
}: MessageEditModalProps) {
  const { state, editMessage } = useSession();
  const [localText, setLocalText] = useState("");

  // Sync local text when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalText(
        state.messageEdits[message.id] || message.template
      );
    }
  }, [isOpen, message.id, message.template, state.messageEdits]);

  function handleSave() {
    editMessage(message.id, localText);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/50"
      />

      {/* Modal container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto relative w-full max-w-lg rounded-2xl bg-bg-primary p-6 shadow-xl">
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-fg-quaternary transition duration-100 ease-linear hover:text-fg-secondary hover:bg-bg-secondary"
            aria-label="Close"
          >
            <XClose className="size-5" />
          </button>

          <h2 className="text-lg font-semibold text-text-primary">
            Edit message
          </h2>
          <p className="text-sm text-text-tertiary mt-1">
            {message.name}
          </p>

          <textarea
            value={localText}
            onChange={(e) => setLocalText(e.target.value)}
            className="mt-4 w-full h-32 rounded-lg border border-border-primary p-3 text-sm text-text-primary resize-none shadow-xs focus:outline-none focus:ring-1 focus:ring-focus-ring focus:border-border-brand"
          />

          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border-secondary px-4 py-2 text-sm font-medium text-text-secondary shadow-xs hover:bg-bg-secondary transition duration-100 ease-linear cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="bg-bg-brand-solid text-text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-bg-brand-solid_hover shadow-xs transition duration-100 ease-linear cursor-pointer"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
