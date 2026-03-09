"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="edit-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50"
          />

          {/* Modal container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <motion.div
              key="edit-modal"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="pointer-events-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
            >
              <h2 className="text-lg font-semibold text-gray-900">
                Edit message
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {message.name}
              </p>

              <textarea
                value={localText}
                onChange={(e) => setLocalText(e.target.value)}
                className="mt-4 w-full h-32 rounded-lg border border-gray-300 p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-500"
              />

              <div className="mt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="bg-brand-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-brand-700 transition duration-100 ease-linear cursor-pointer"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
