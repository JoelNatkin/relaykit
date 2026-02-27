"use client";

import type { ReactNode } from "react";
import { cx } from "@/utils/cx";

interface ScopeSectionProps {
  variant: "included" | "not-included";
  header: string;
  items: string[];
}

export const ScopeSection = ({ variant, header, items }: ScopeSectionProps) => {
  const isIncluded = variant === "included";

  return (
    <div
      className={cx(
        "rounded-xl border border-secondary p-5",
        isIncluded ? "border-l-4 border-l-success-solid" : "border-l-4 border-l-warning-solid",
      )}
    >
      <h3 className="mb-3 text-sm font-semibold text-primary">{header}</h3>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm">
            {isIncluded ? (
              <span className="mt-0.5 text-fg-success-secondary">
                <CheckIcon />
              </span>
            ) : (
              <span className="mt-0.5 text-fg-warning-secondary">
                <XIcon />
              </span>
            )}
            <span className="text-tertiary">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

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
