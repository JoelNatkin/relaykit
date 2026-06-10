"use client";

/**
 * Mobile-only collapsed summary row that replaces the desktop categories
 * panel below the md: breakpoint. The whole row is a button; tapping it
 * opens the full-page mobile categories modal. State display only —
 * the modal owns the selection UX.
 *
 * Summary text rules (PM-specified):
 *   0 selected → "Select categories" (text-tertiary, placeholder color)
 *   1 selected → category name
 *   2 selected → "Name1, Name2"
 *   3+ selected → "Name1, Name2 +N more"  (N = total - 2)
 *
 * `truncate` on the summary text is a defensive guard — no real category
 * names overflow at 375px today (longest "Customer support" + comma
 * formatting fits), but the class ensures a future longer category cannot
 * break the row.
 */

import { Edit01 } from "@untitledui/icons";
import type { Category } from "@/lib/message-library";

export interface MobileCategoriesSummaryProps {
  selected: readonly Category[];
  onOpen: () => void;
}

function summaryText(selected: readonly Category[]): string {
  if (selected.length === 0) return "Select categories";
  if (selected.length === 1) return selected[0].name;
  if (selected.length === 2) return `${selected[0].name}, ${selected[1].name}`;
  return `${selected[0].name}, ${selected[1].name} +${selected.length - 2} more`;
}

export function MobileCategoriesSummary({
  selected,
  onOpen,
}: MobileCategoriesSummaryProps) {
  const isEmpty = selected.length === 0;
  return (
    <div className="rounded-xl border border-border-secondary bg-surface-inset p-4">
      <span className="mb-1.5 block text-sm font-medium text-text-secondary">Categories</span>
      <button
        type="button"
        onClick={onOpen}
        className="flex w-full items-center justify-between gap-3 rounded-lg border border-border-primary bg-surface-card px-3 py-2.5 text-left"
        aria-label="Edit categories"
      >
        <span
          className={`min-w-0 flex-1 truncate text-base ${
            isEmpty ? "text-text-placeholder" : "text-text-primary"
          }`}
        >
          {summaryText(selected)}
        </span>
        <Edit01 className="size-[17px] shrink-0 text-fg-quaternary" aria-hidden />
      </button>
    </div>
  );
}
