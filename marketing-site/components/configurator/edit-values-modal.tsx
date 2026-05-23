"use client";

/**
 * Full-page mobile modal containing the per-category Edit-values form.
 * Mirrors the MobileCategoriesModal pattern at
 * `marketing-site/components/configurator/mobile-categories-modal.tsx` —
 * sticky header (X close, ESC), scrollable body, body-scroll lock — so the
 * two surfaces feel like the same modal at different times.
 *
 * Instant-apply: every keystroke inside the form calls the same
 * `setCategoryVariable` action the desktop expander uses; the modal stays
 * open across edits.
 *
 * Header title is the category name so the visitor knows which category's
 * values they're editing. `md:hidden` is applied here defensively in
 * addition to the parent's `md:hidden`, covering the edge case of a
 * viewport resize from mobile to desktop while the modal is open.
 */

import { useEffect, useState } from "react";
import { XClose } from "@untitledui/icons";
import type { Category } from "@/lib/message-library";
import {
  EditValuesForm,
  type EditValuesFormProps,
} from "@/components/configurator/edit-values-form";

export interface EditValuesModalProps {
  category: Category | null;
  values: EditValuesFormProps["values"];
  onChange: EditValuesFormProps["onChange"];
  onClose: () => void;
}

export function EditValuesModal({
  category,
  values,
  onChange,
  onClose,
}: EditValuesModalProps) {
  // Viewport gating — the modal is mobile-only (md:hidden in CSS), but
  // `display: none` does NOT prevent React effects from firing. Without
  // a JS-level viewport check, the scroll-lock effect below would also
  // fire when the desktop inline expander opens (same
  // `editValuesCategoryId` state drives both surfaces), silently
  // locking page scroll behind a CSS-hidden modal. matchMedia keeps
  // the breakpoint in sync with Tailwind's md: (768px). Initial state
  // is `false` so SSR matches first-paint client render (modal absent).
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767.98px)");
    setIsMobileViewport(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobileViewport(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const isOpen = isMobileViewport && category !== null;

  // Lock body scroll while open — same pattern as MobileCategoriesModal.
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

  // ESC closes — same pattern as MobileCategoriesModal.
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen || !category) return null;

  return (
    <>
      {/* Backdrop — dead on full-screen mobile but kept for symmetry with
          MobileCategoriesModal / the waitlist modal. */}
      <div
        className="fixed inset-0 z-[100] bg-black/50 transition-opacity duration-200 md:hidden"
        onClick={onClose}
      />

      {/* Modal shell — flex column with NO overflow so the sticky header
          inside can pin. The body is the scrolling element. */}
      <div className="fixed inset-0 z-[101] flex flex-col bg-bg-primary md:hidden">
        {/* Sticky header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border-secondary bg-bg-primary px-4 py-3">
          <h2 className="text-base font-semibold text-text-primary">
            {category.name}
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
        <div className="flex-1 overflow-y-auto px-4 py-5">
          <EditValuesForm
            category={category}
            values={values}
            onChange={onChange}
          />
        </div>
      </div>
    </>
  );
}
