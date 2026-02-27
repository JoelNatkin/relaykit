"use client";

import type { ScopeItem } from "@/lib/intake/use-case-data";

interface ScopeCardProps {
  header: string;
  includedItems: string[];
  notIncludedItems: ScopeItem[];
  selectedExpansions: string[];
}

export const ScopeCard = ({
  header,
  includedItems,
  notIncludedItems,
  selectedExpansions,
}: ScopeCardProps) => {
  return (
    <div className="rounded-xl border border-secondary p-5">
      <h3 className="mb-3 text-sm font-semibold text-primary">{header}</h3>
      <ul className="flex flex-col gap-2">
        {includedItems.map((item) => (
          <ScopeListItem key={item} text={item} isIncluded />
        ))}
        {notIncludedItems.map((item) => {
          const unlocked =
            item.unlockedBy !== undefined &&
            item.unlockedBy.some((id) => selectedExpansions.includes(id));
          return (
            <ScopeListItem
              key={item.text}
              text={item.text}
              isIncluded={unlocked}
            />
          );
        })}
      </ul>
    </div>
  );
};

function ScopeListItem({
  text,
  isIncluded,
}: {
  text: string;
  isIncluded: boolean;
}) {
  return (
    <li className="flex items-start gap-2 text-sm">
      {isIncluded ? (
        <span className="mt-0.5 text-fg-success-secondary">
          <CheckIcon />
        </span>
      ) : (
        <span className="mt-0.5 text-fg-warning-secondary">
          <XIcon />
        </span>
      )}
      <span className="text-tertiary">{text}</span>
    </li>
  );
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="size-4 shrink-0"
      aria-hidden="true"
    >
      <path
        d="M13.3334 4L6.00008 11.3333L2.66675 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="size-4 shrink-0"
      aria-hidden="true"
    >
      <path
        d="M12 4L4 12M4 4L12 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
