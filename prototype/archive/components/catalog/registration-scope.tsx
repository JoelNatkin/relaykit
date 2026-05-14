"use client";

import { useState } from "react";
import {
  USE_CASES,
  type UseCaseId,
  type ScopeItem,
} from "../../lib/intake/use-case-data";
import { isPromoExpansion } from "../../lib/intake/campaign-type";

// --- Inline SVG icons (same as production ScopeCard) ---

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

// --- Main component ---

interface RegistrationScopeProps {
  useCaseId?: string;
  selectedExpansions?: string[];
  onExpansionsChange?: (expansions: string[]) => void;
}

export function RegistrationScope({
  useCaseId = "appointments",
  selectedExpansions: controlledExpansions,
  onExpansionsChange,
}: RegistrationScopeProps) {
  const useCase = USE_CASES[useCaseId as UseCaseId];
  const [internalExpansions, setInternalExpansions] = useState<string[]>([]);
  const selectedExpansions = controlledExpansions ?? internalExpansions;
  const setSelectedExpansions = onExpansionsChange ?? setInternalExpansions;

  if (!useCase) {
    return (
      <p className="text-sm text-text-tertiary">
        Unknown use case: {useCaseId}
      </p>
    );
  }

  function toggleExpansion(id: string) {
    const next = selectedExpansions.includes(id)
      ? selectedExpansions.filter((e) => e !== id)
      : [...selectedExpansions, id];
    setSelectedExpansions(next);
  }

  const showPromoNote = selectedExpansions.some(isPromoExpansion);

  return (
    <div className="flex flex-col gap-5">
      {/* What your registration covers */}
      <div className="rounded-xl border border-border-secondary bg-bg-primary p-5">
        <h3 className="mb-3 text-sm font-semibold text-text-primary">
          What your registration covers
        </h3>
        <ul className="flex flex-col gap-2">
          {useCase.included.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm">
              <span className="mt-0.5 text-green-600">
                <CheckIcon />
              </span>
              <span className="text-text-secondary">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* What's not included */}
      {useCase.notIncluded.length > 0 && (
        <div className="rounded-xl border border-border-secondary bg-bg-primary p-5">
          <h3 className="mb-3 text-sm font-semibold text-text-primary">
            What&apos;s not included
          </h3>
          <ul className="flex flex-col gap-2">
            {useCase.notIncluded.map((item: ScopeItem) => {
              const unlocked =
                item.unlockedBy !== undefined &&
                item.unlockedBy.some((id) => selectedExpansions.includes(id));
              return (
                <li
                  key={item.text}
                  className="flex items-start gap-2 text-sm"
                >
                  {unlocked ? (
                    <span className="mt-0.5 text-green-600">
                      <CheckIcon />
                    </span>
                  ) : (
                    <span className="mt-0.5 text-amber-500">
                      <XIcon />
                    </span>
                  )}
                  <span className="text-text-secondary">{item.text}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Expansion options */}
      {useCase.expansions.length > 0 && (
        <div className="rounded-xl border border-border-secondary bg-bg-primary p-5">
          <h3 className="mb-3 text-sm font-semibold text-text-primary">
            Will you also need any of these?
          </h3>
          <div className="flex flex-col gap-3">
            {useCase.expansions.map((expansion) => (
              <label
                key={expansion.id}
                className="flex items-start gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedExpansions.includes(expansion.id)}
                  onChange={() => toggleExpansion(expansion.id)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-text-secondary">
                  {expansion.label}
                </span>
              </label>
            ))}
          </div>

          {showPromoNote && (
            <p className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-text-secondary">
              Your app&apos;s opt-in form will include a checkbox for marketing
              messages.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
