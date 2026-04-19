"use client";

import { useEffect, useState } from "react";
import { XClose } from "@untitledui/icons";
import { useSession } from "@/context/session-context";

/**
 * Prototype-only dev utility. Lets a tester change the business-name and
 * service-type values that drive variable interpolation across the
 * workspace, without reloading or re-running the onboarding wizard. Not
 * for production — the "(prototype only)" note in the title makes that
 * explicit so a reviewer doesn't mistake it for a product feature.
 *
 * Service-type field behavior:
 * - When the current vertical has a predefined list (below), render as a
 *   select. If state.serviceType holds a free-text value that isn't in
 *   the list (e.g., carried over from the wizard's free-text input), the
 *   current value is prepended to the options so the select can round-
 *   trip it without silently dropping the value.
 * - For verticals without a predefined list, fall back to a text input.
 */
const SERVICE_TYPES_BY_VERTICAL: Record<string, readonly string[]> = {
  appointments: [
    "Beauty & wellness appointments",
    "Salon & beauty",
    "Dental",
    "Medical",
    "Fitness & wellness",
    "Tutoring & education",
    "Consulting",
    "Auto service",
    "Home services",
    "Pet care",
    "Photography",
    "Other",
  ],
};

export interface EditBusinessDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EditBusinessDetailsModal({ isOpen, onClose }: EditBusinessDetailsModalProps) {
  const { state, setField } = useSession();
  const vertical = state.selectedCategory || "appointments";
  const presetServiceTypes = SERVICE_TYPES_BY_VERTICAL[vertical];

  const [name, setName] = useState(state.appName);
  const [serviceType, setServiceType] = useState(state.serviceType);

  // Reset local state when the modal opens so each open picks up the
  // current session values (user may have updated them via another path).
  useEffect(() => {
    if (isOpen) {
      setName(state.appName);
      setServiceType(state.serviceType);
    }
  }, [isOpen, state.appName, state.serviceType]);

  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function handleSave() {
    setField("appName", name);
    setField("serviceType", serviceType);
    onClose();
  }

  // If the current serviceType is free text not in the preset list, prepend
  // it as the first option so the select can represent it.
  const selectOptions = presetServiceTypes
    ? serviceType && !presetServiceTypes.includes(serviceType)
      ? [serviceType, ...presetServiceTypes]
      : presetServiceTypes
    : null;

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

        <h3 className="text-base font-semibold text-text-primary pr-6">
          Edit business details
          <span className="ml-2 text-xs font-normal text-text-quaternary">(prototype only)</span>
        </h3>
        <p className="mt-1 text-xs text-text-tertiary">
          Dev shortcut. Changes the values that drive message previews and
          variable tokens across the workspace.
        </p>

        <div className="mt-5 space-y-4">
          <div>
            <label htmlFor="dev-business-name" className="mb-1.5 block text-sm font-medium text-text-secondary">
              Business name
            </label>
            <input
              id="dev-business-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2.5 text-sm text-text-primary placeholder:text-text-placeholder shadow-xs focus:border-border-brand focus:outline-none transition duration-100 ease-linear"
            />
          </div>

          <div>
            <label htmlFor="dev-service-type" className="mb-1.5 block text-sm font-medium text-text-secondary">
              Service type
            </label>
            {selectOptions ? (
              <select
                id="dev-service-type"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2.5 text-sm text-text-primary shadow-xs focus:border-border-brand focus:outline-none transition duration-100 ease-linear"
              >
                {!serviceType && (
                  <option value="" disabled>
                    Select a type
                  </option>
                )}
                {selectOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id="dev-service-type"
                type="text"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2.5 text-sm text-text-primary placeholder:text-text-placeholder shadow-xs focus:border-border-brand focus:outline-none transition duration-100 ease-linear"
              />
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 text-sm font-medium text-text-tertiary transition duration-100 ease-linear hover:text-text-secondary cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-bg-brand-solid px-4 py-2 text-sm font-semibold text-text-white shadow-xs transition duration-100 ease-linear hover:bg-bg-brand-solid_hover cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
