"use client";

/**
 * "Recommended combinations" dropdown. A custom button + popover (a native
 * <select> can't render disabled-but-visible styled options, nor a reflective
 * closed-state label that isn't itself a selectable option).
 *
 * The closed-state label reflects the current category selection — it is not a
 * separate state machine. "Custom" and a blank label are reflective only and
 * never appear as options in the list.
 */

import { ChevronDown } from "@untitledui/icons";
import { useEffect, useRef, useState } from "react";

export interface Preset {
  id: string;
  label: string;
  /** Disabled presets render greyed and unclickable ("Coming soon" verticals). */
  disabled: boolean;
}

interface PresetDropdownProps {
  presets: Preset[];
  /** Reflective closed-state label — a preset name, "Custom", or "" (blank). */
  value: string;
  onSelect: (presetId: string) => void;
  className?: string;
}

export function PresetDropdown({ presets, value, onSelect, className }: PresetDropdownProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleDown);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleDown);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div className={`relative ${className ?? ""}`} ref={wrapRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-border-primary bg-bg-primary px-3 py-2.5 text-sm shadow-xs transition duration-100 ease-linear hover:border-border-secondary_hover focus:border-border-brand focus:outline-none"
      >
        <span className={value ? "text-text-primary" : "text-text-placeholder"}>
          {value}
        </span>
        <ChevronDown
          className={`size-4 flex-shrink-0 text-fg-quaternary transition-transform duration-100 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open ? (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-full z-30 mt-1 overflow-hidden rounded-lg border border-border-secondary bg-bg-primary py-1 shadow-lg"
        >
          {presets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              role="option"
              aria-selected={preset.label === value}
              aria-disabled={preset.disabled}
              onClick={() => {
                if (preset.disabled) return;
                onSelect(preset.id);
                setOpen(false);
              }}
              className={`flex w-full items-center px-3 py-2 text-left text-sm transition duration-100 ease-linear ${
                preset.disabled
                  ? "cursor-not-allowed text-text-disabled"
                  : "cursor-pointer text-text-secondary hover:bg-bg-primary_hover"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
