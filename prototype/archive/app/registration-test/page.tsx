"use client";

import { useState, useCallback } from "react";
import { RegistrationScope } from "@/components/catalog/registration-scope";
import { BusinessDetailsForm } from "@/components/registration/business-details-form";
import { ReviewConfirm } from "@/components/registration/review-confirm";
import type { UseCaseId } from "@/lib/intake/use-case-data";
import type { BusinessDetailsData } from "@/lib/intake/validation";

type Step = "form" | "review";

const USE_CASE_OPTIONS: { id: UseCaseId; label: string }[] = [
  { id: "appointments", label: "Appointments" },
  { id: "orders", label: "Orders" },
  { id: "verification", label: "Verification" },
  { id: "support", label: "Support" },
  { id: "marketing", label: "Marketing" },
  { id: "internal", label: "Internal" },
  { id: "community", label: "Community" },
  { id: "waitlist", label: "Waitlist" },
  { id: "exploring", label: "Exploring" },
];

export default function RegistrationTestPage() {
  const [useCaseId, setUseCaseId] = useState<UseCaseId>("appointments");
  const [step, setStep] = useState<Step>("form");
  const [businessDetails, setBusinessDetails] = useState<Record<string, string>>({});
  const [selectedExpansions, setSelectedExpansions] = useState<string[]>([]);
  const [isFormValid, setIsFormValid] = useState(false);

  const handleValid = useCallback((data: BusinessDetailsData) => {
    const details: Record<string, string> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== null && value !== undefined && value !== "") {
        details[key] = String(value);
      }
    }
    setBusinessDetails(details);
    setIsFormValid(true);
  }, []);

  const handleInvalid = useCallback(() => {
    setIsFormValid(false);
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Dev toolbar */}
      <div className="sticky top-0 z-40 border-b border-border-secondary bg-white px-6 py-3">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-sm font-semibold text-text-primary">
              Registration Import Test
            </h1>
            <select
              value={useCaseId}
              onChange={(e) => setUseCaseId(e.target.value as UseCaseId)}
              className="rounded-lg border border-border-primary bg-bg-primary px-3 py-1.5 text-sm text-text-primary"
            >
              {USE_CASE_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setStep("form")}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                step === "form"
                  ? "bg-purple-100 text-purple-700"
                  : "text-text-tertiary hover:text-text-secondary"
              }`}
            >
              Form
            </button>
            <button
              type="button"
              onClick={() => setStep("review")}
              disabled={!isFormValid}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                step === "review"
                  ? "bg-purple-100 text-purple-700"
                  : isFormValid
                    ? "text-text-tertiary hover:text-text-secondary"
                    : "text-text-quaternary cursor-not-allowed"
              }`}
            >
              Review
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-8">
        {/* IMPORT 1 — RegistrationScope */}
        <div className="mb-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-quaternary">
            Import 1 — Registration Scope
          </p>
          <RegistrationScope
            useCaseId={useCaseId}
            selectedExpansions={selectedExpansions}
            onExpansionsChange={setSelectedExpansions}
          />
        </div>

        <hr className="mb-8 border-border-secondary" />

        {step === "form" && (
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-quaternary">
              Import 2 — Business Details Form
            </p>
            <div className="max-w-2xl">
              <BusinessDetailsForm
                useCase={useCaseId}
                onValid={handleValid}
                onInvalid={handleInvalid}
              />
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  disabled={!isFormValid}
                  onClick={() => setStep("review")}
                  className={`rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition ${
                    isFormValid
                      ? "bg-purple-600 hover:bg-purple-700 cursor-pointer"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  Continue to Review
                </button>
              </div>
            </div>
          </div>
        )}

        {step === "review" && (
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-quaternary">
              Import 3 — Review & Confirm
            </p>
            <ReviewConfirm
              businessDetails={businessDetails}
              useCaseId={useCaseId}
              selectedExpansions={selectedExpansions}
              onEditDetails={() => setStep("form")}
            />
          </div>
        )}
      </div>
    </div>
  );
}
