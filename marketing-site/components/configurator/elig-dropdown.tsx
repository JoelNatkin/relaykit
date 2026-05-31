"use client";

/**
 * Label-less dropdown used by the elig section. Placeholder text does the
 * labeling work (vertical-constraints §9.2 "No field labels"). A reset × sits
 * inside the field at the right edge when a value is selected — clears back
 * to placeholder state without opening the dropdown.
 *
 * Hand-rolled, mirroring KebabMenu's outside-click + ESC idioms. The
 * marketing site explicitly does not import Untitled UI base components
 * (CLAUDE.md design system rules) — only semantic tokens and icons.
 */

import { ChevronDown, XClose } from "@untitledui/icons";
import { Fragment, useEffect, useRef, useState } from "react";

export interface EligDropdownOption {
  value: string;
  label: string;
  /** When true, the option renders greyed + non-clickable. */
  disabled?: boolean;
}

export interface EligDropdownProps {
  placeholder: string;
  value: string | null;
  options: EligDropdownOption[];
  onChange: (value: string | null) => void;
  /** Accessible name — the placeholder doubles as the user-visible label, but screen readers need this. */
  ariaLabel: string;
  /** Optional — when true, the field renders disabled (greyed, no toggle). */
  disabled?: boolean;
  /**
   * When true (default), a reset × replaces the chevron once a value is
   * selected. When false, the chevron always shows and there's no inline
   * clear affordance (used by the sub-vertical dropdown).
   */
  clearable?: boolean;
  /**
   * When set, options flagged `disabled` are grouped at the bottom under a
   * divider + this header label (e.g. "Not supported"). Disabled options
   * are greyed and non-clickable.
   */
  disabledGroupLabel?: string;
}

export function EligDropdown({
  placeholder,
  value,
  options,
  onChange,
  ariaLabel,
  disabled = false,
  clearable = true,
  disabledGroupLabel,
}: EligDropdownProps) {
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

  const selectedOption = value
    ? (options.find((o) => o.value === value) ?? null)
    : null;
  const isPlaceholder = !selectedOption;

  // Enabled options first, disabled ("Not supported") grouped last. V8's sort
  // is stable, so original relative order is preserved within each group.
  const orderedOptions = [...options].sort(
    (a, b) => Number(a.disabled ?? false) - Number(b.disabled ?? false),
  );

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => {
          if (disabled) return;
          setIsOpen((v) => !v);
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        disabled={disabled}
        className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-border-primary bg-bg-primary px-3 py-2.5 text-base transition duration-100 ease-linear hover:border-border-brand focus:border-border-brand focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
          isPlaceholder ? "text-text-placeholder" : "text-text-primary"
        }`}
      >
        <span className="truncate text-left">
          {selectedOption?.label ?? placeholder}
        </span>
        {selectedOption && clearable ? (
          <span
            role="button"
            tabIndex={0}
            aria-label="Clear selection"
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
              setIsOpen(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                onChange(null);
                setIsOpen(false);
              }
            }}
            className="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md p-0.5 text-text-tertiary transition duration-100 ease-linear hover:bg-bg-primary_hover hover:text-text-secondary"
          >
            <XClose className="size-4" />
          </span>
        ) : (
          <ChevronDown className="size-4 shrink-0 text-text-tertiary" />
        )}
      </button>
      {isOpen ? (
        <div
          role="listbox"
          aria-label={ariaLabel}
          className="absolute top-full right-0 left-0 z-20 mt-1 max-h-72 overflow-y-auto rounded-lg border border-border-secondary bg-bg-primary py-1 shadow-lg"
        >
          {orderedOptions.map((option, idx) => {
            const isSelected = option.value === value;
            // Inject the divider + group header before the first disabled item.
            const startsDisabledGroup =
              !!option.disabled &&
              (idx === 0 || !orderedOptions[idx - 1].disabled);
            return (
              <Fragment key={option.value}>
                {startsDisabledGroup && disabledGroupLabel ? (
                  <div role="presentation">
                    <div className="my-1 border-t border-border-secondary" />
                    <p className="px-3 py-1 text-xs font-medium text-text-quaternary">
                      {disabledGroupLabel}
                    </p>
                  </div>
                ) : null}
                {option.disabled ? (
                  <div
                    role="option"
                    aria-selected={false}
                    aria-disabled
                    className="flex w-full cursor-not-allowed items-center px-3 py-2 text-left text-sm text-disabled"
                  >
                    {option.label}
                  </div>
                ) : (
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      setIsOpen(false);
                      onChange(option.value);
                    }}
                    className={`flex w-full cursor-pointer items-center px-3 py-2 text-left text-sm transition duration-100 ease-linear hover:bg-bg-primary_hover ${
                      isSelected
                        ? "bg-bg-primary_hover text-text-primary"
                        : "text-text-secondary"
                    }`}
                  >
                    {option.label}
                  </button>
                )}
              </Fragment>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
