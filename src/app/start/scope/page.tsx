"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { ArrowRight, ArrowLeft } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { ScopeCard } from "@/components/intake/scope-section";
import { USE_CASES, type UseCaseId } from "@/lib/intake/use-case-data";
import {
  determineCampaignType,
  hasMarketingExpansion,
  isPromoExpansion,
} from "@/lib/intake/campaign-type";
import {
  getIntakeSession,
  saveIntakeSession,
} from "@/lib/intake/session-storage";

function getDefaultExpansions(
  expansions: { id: string }[],
): string[] {
  return expansions
    .filter((e) => !isPromoExpansion(e.id))
    .map((e) => e.id);
}

function ScopeContent() {
  const searchParams = useSearchParams();
  const useCaseId = searchParams.get("use_case") as UseCaseId | null;
  const useCase = useCaseId ? USE_CASES[useCaseId] : null;

  const [selectedExpansions, setSelectedExpansions] = useState<string[]>(
    () => {
      // Restore from session if available for this use case
      const session = getIntakeSession();
      if (session.use_case === useCaseId && session.expansions) {
        return session.expansions;
      }
      return useCase ? getDefaultExpansions(useCase.expansions) : [];
    },
  );

  if (!useCase) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center bg-primary px-4">
        <p className="mb-4 text-lg text-tertiary">
          No use case selected. Please go back and pick one.
        </p>
        <Button href="/start" color="secondary" iconLeading={ArrowLeft}>
          Back to use cases
        </Button>
      </div>
    );
  }

  const effectiveCampaignType = determineCampaignType(
    useCase.id,
    selectedExpansions,
  );
  const showPromoNote = hasMarketingExpansion(selectedExpansions);

  function toggleExpansion(id: string) {
    setSelectedExpansions((prev) => {
      const next = prev.includes(id)
        ? prev.filter((e) => e !== id)
        : [...prev, id];
      saveIntakeSession({ expansions: next });
      return next;
    });
  }

  function buildContinueHref() {
    const params = new URLSearchParams();
    params.set("use_case", useCase!.id);
    if (selectedExpansions.length > 0) {
      params.set("expansions", selectedExpansions.join(","));
    }
    params.set("campaign_type", effectiveCampaignType);

    // Save to session on navigate forward
    saveIntakeSession({
      use_case: useCase!.id,
      expansions: selectedExpansions,
      campaign_type: effectiveCampaignType,
    });

    return `/start/details?${params.toString()}`;
  }

  return (
    <div className="flex min-h-svh flex-col bg-primary">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-12 sm:px-6 lg:py-16">
        {/* Use case context */}
        <div className="mb-6 flex items-center gap-3">
          <FeaturedIcon
            icon={useCase.icon}
            size="md"
            color="brand"
            theme="light"
          />
          <span className="text-md font-semibold text-primary">
            {useCase.label}
          </span>
        </div>

        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-display-sm font-semibold text-primary sm:text-display-md">
            Let&apos;s make sure this covers everything
          </h1>
          <p className="text-lg text-tertiary">
            Here&apos;s what your registration allows.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {/* Combined scope card */}
          <ScopeCard
            header="What your registration covers"
            includedItems={useCase.included}
            notIncludedItems={useCase.notIncluded}
            selectedExpansions={selectedExpansions}
          />

          {/* Expansion options */}
          {useCase.expansions.length > 0 && (
            <div className="rounded-xl border border-secondary p-5">
              <h3 className="mb-3 text-sm font-semibold text-primary">
                Will you also need any of these in the future?
              </h3>
              <div className="flex flex-col gap-3">
                {useCase.expansions.map((expansion) => (
                  <Checkbox
                    key={expansion.id}
                    isSelected={selectedExpansions.includes(expansion.id)}
                    onChange={() => toggleExpansion(expansion.id)}
                    label={expansion.label}
                  />
                ))}
              </div>

              {showPromoNote && (
                <p className="mt-4 rounded-lg bg-warning-primary p-3 text-sm text-tertiary">
                  Your app&apos;s opt-in form will include a checkbox for
                  marketing messages.
                </p>
              )}
            </div>
          )}

          {/* Marketing note (no expansions for marketing) */}
          {useCase.id === "marketing" && (
            <div className="rounded-xl border border-secondary p-5">
              <h3 className="mb-3 text-sm font-semibold text-primary">
                Will you also need any of these in the future?
              </h3>
              <p className="text-sm text-tertiary">
                No expansion needed — marketing is already the broadest
                registration category. You&apos;re covered for all promotional
                and transactional messaging.
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <Button
            href="/start"
            color="link-gray"
            iconLeading={ArrowLeft}
          >
            Back
          </Button>
          <Button
            size="lg"
            color="primary"
            iconTrailing={ArrowRight}
            href={buildContinueHref()}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ScopePage() {
  return (
    <Suspense>
      <ScopeContent />
    </Suspense>
  );
}
