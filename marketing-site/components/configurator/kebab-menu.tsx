"use client";

/**
 * Reusable kebab (overflow) menu. Same dropdown idioms as the Insert
 * variable picker in the message edit card — toggle on click, close on
 * outside click + ESC. Items render as small text rows; pass
 * `destructive: true` for actions that wipe state (Clear / Clear all) so
 * they read in `text-error-primary`.
 *
 * Used by:
 *   - the configurator's global "Clear all" (next to Copy)
 *   - each category's "Clear" (next to the Variables trigger)
 */

import { DotsVertical } from "@untitledui/icons";
import { useEffect, useRef, useState } from "react";

export interface KebabMenuItem {
  label: string;
  onClick: () => void;
  /** Renders in error color — appropriate for clear/delete actions. */
  destructive?: boolean;
}

export interface KebabMenuProps {
  ariaLabel: string;
  items: KebabMenuItem[];
}

export function KebabMenu({ ariaLabel, items }: KebabMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleDown(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("mousedown", handleDown);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleDown);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        className="inline-flex size-7 cursor-pointer items-center justify-center rounded-md text-text-tertiary transition duration-100 ease-linear hover:bg-bg-primary_hover hover:text-text-secondary"
      >
        <DotsVertical className="size-4" />
      </button>
      {isOpen ? (
        <div
          role="menu"
          className="absolute top-full right-0 z-20 mt-1 min-w-[140px] rounded-lg border border-border-secondary bg-bg-primary py-1 shadow-lg"
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              onClick={() => {
                setIsOpen(false);
                item.onClick();
              }}
              className={`flex w-full cursor-pointer items-center px-3 py-2 text-sm whitespace-nowrap transition duration-100 ease-linear hover:bg-bg-primary_hover ${
                item.destructive
                  ? "text-text-error-primary"
                  : "text-text-secondary"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
