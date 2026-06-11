"use client";

/**
 * Full-page mobile modal containing the categories panel. Opens from the
 * collapsed summary row; closes via X button, ESC, or backdrop click
 * (backdrop is functionally dead on a full-screen mobile modal — the
 * modal panel covers the entire viewport so there's no "outside" to tap,
 * but the handler is preserved for code symmetry with the waitlist modal).
 *
 * Instant-apply: toggling a category or message inside the modal calls
 * the same setters the desktop panel uses. The modal stays open so the
 * visitor can adjust multiple selections in one open/close cycle.
 *
 * Sticky-header layout pattern: this modal deliberately diverges from the
 * waitlist modal's `overflow-y-auto` on the outer panel. For
 * `position: sticky` to keep the header pinned while the body scrolls,
 * the *body* must be the scrolling element — not the outer shell. So the
 * shell is `flex flex-col` with no overflow, the header is a non-growing
 * flex child, and the body is `flex-1 overflow-y-auto`. This is the
 * correct pattern when you need a sticky header inside a full-screen
 * modal; the waitlist modal pattern is correct when there is no header.
 *
 * Wrapping `md:hidden` is applied here defensively in addition to the
 * parent's `md:hidden` — covers the edge case of a viewport resize from
 * mobile to desktop while the modal is open.
 */

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { XClose } from "@untitledui/icons";
import {
  CategoryList,
  type CategoryListProps,
} from "@/components/configurator/category-list";

export interface MobileCategoriesModalProps extends CategoryListProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileCategoriesModal({
  isOpen,
  onClose,
  state,
  onCategoryToggle,
  onMessageToggle,
}: MobileCategoriesModalProps) {
  // Lock body scroll while open — same pattern as the waitlist modal.
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // ESC closes — same pattern as the waitlist modal.
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === "undefined") return null;

  // Portaled to <body> so the fixed modal escapes any clipped/offset ancestor
  // (e.g. the home configurator peek's overflow-hidden window) and positions
  // against the true viewport. Harmless on /messages where there is no clip.
  return createPortal(
    <>
      {/* Backdrop — dead on full-screen mobile but kept for symmetry with
          the waitlist modal. */}
      <div
        className="fixed inset-0 z-[100] bg-black/50 transition-opacity duration-200 md:hidden"
        onClick={onClose}
      />

      {/* Modal shell — flex column with NO overflow so the sticky header
          inside can pin. The body is the scrolling element. surface-inset
          matches the desktop Categories column panel. */}
      <div className="fixed inset-0 z-[101] flex flex-col bg-surface-inset md:hidden">
        {/* Sticky header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border-secondary bg-surface-inset px-4 py-3">
          <h2 className="text-base font-semibold text-text-primary">
            Categories
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex size-11 cursor-pointer items-center justify-center text-text-quaternary transition duration-100 ease-linear hover:text-text-secondary"
          >
            <XClose className="size-5" />
          </button>
        </div>

        {/* Scrollable body — owns the overflow so the header can stick. */}
        <div className="flex-1 overflow-y-auto">
          <CategoryList
            state={state}
            onCategoryToggle={onCategoryToggle}
            onMessageToggle={onMessageToggle}
            showHeading={false}
          />
        </div>
      </div>
    </>,
    document.body,
  );
}
