"use client";

import { useEffect } from "react";
import { XClose } from "@untitledui/icons";

export type ActionTone = "default" | "destructive";

export interface MessageActionModalProps {
  isOpen: boolean;
  title: string;
  /** Body text rendered as a single paragraph above the code block. */
  body: string;
  /** Monospace code block rendered below the body. Slug + namespace are
   *  already interpolated by the caller so this component stays generic. */
  codeBlock: string;
  confirmLabel: string;
  confirmTone?: ActionTone;
  onConfirm: () => void;
  onClose: () => void;
}

/**
 * Shared confirmation modal for custom-message lifecycle actions (Archive
 * from active rows; Restore + Delete permanently from archived rows). The
 * only variation between call sites is copy — title, body, code example,
 * button label, button tone — so those are all props and the shell is
 * identical. Copy comes from Task 2 spec.
 */
export function MessageActionModal({
  isOpen,
  title,
  body,
  codeBlock,
  confirmLabel,
  confirmTone = "default",
  onConfirm,
  onClose,
}: MessageActionModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const confirmClass =
    confirmTone === "destructive"
      ? "rounded-lg bg-bg-error-solid px-4 py-2.5 text-sm font-semibold text-text-white shadow-xs transition duration-100 ease-linear hover:bg-bg-error-solid_hover cursor-pointer"
      : "rounded-lg bg-bg-brand-solid px-4 py-2.5 text-sm font-semibold text-text-white shadow-xs transition duration-100 ease-linear hover:bg-bg-brand-solid_hover cursor-pointer";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50" />

      <div
        className="relative w-full max-w-md rounded-xl bg-bg-primary shadow-xl p-6 sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 p-1 text-fg-quaternary hover:text-fg-secondary transition duration-100 ease-linear cursor-pointer"
          aria-label="Close"
        >
          <XClose className="size-5" />
        </button>

        <h3 className="text-lg font-semibold text-text-primary pr-6">{title}</h3>
        <p className="mt-3 text-sm text-text-secondary leading-relaxed">{body}</p>

        <pre className="mt-4 rounded-md bg-bg-secondary px-3 py-2 text-xs font-mono text-text-secondary overflow-x-auto whitespace-pre-wrap break-words">
          {codeBlock}
        </pre>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2.5 text-sm font-medium text-text-tertiary transition duration-100 ease-linear hover:text-text-secondary cursor-pointer"
          >
            Cancel
          </button>
          <button type="button" onClick={onConfirm} className={confirmClass}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
