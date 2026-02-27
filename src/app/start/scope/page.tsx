"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { ArrowRight, ArrowLeft } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { ScopeSection } from "@/components/intake/scope-section";
import { USE_CASES, type UseCaseId } from "@/lib/intake/use-case-data";
import {
  determineCampaignType,
  hasMarketingExpansion,
} from "@/lib/intake/campaign-type";

function ScopeContent() {
  const searchParams = useSearchParams();
  const useCaseId = searchParams.get("use_case") as UseCaseId | null;
  const useCase = useCaseId ? USE_CASES[useCaseId] : null;

  const [selectedExpansions, setSelectedExpansions] = useState<string[]>([]);

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
  const showPromoNote =
    selectedExpansions.length > 0 && hasMarketingExpansion(selectedExpansions);
  const showBroadNote =
    selectedExpansions.length > 0 && !showPromoNote;

  function toggleExpansion(id: string) {
    setSelectedExpansions((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id],
    );
  }

  function buildContinueHref() {
    const params = new URLSearchParams();
    params.set("use_case", useCase!.id);
    if (selectedExpansions.length > 0) {
      params.set("expansions", selectedExpansions.join(","));
    }
    params.set("campaign_type", effectiveCampaignType);
    return `/start/details?${params.toString()}`;
  }

  return (
    <div className="flex min-h-svh flex-col bg-primary">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-12 sm:px-6 lg:py-16">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-display-sm font-semibold text-primary sm:text-display-md">
            Let&apos;s make sure your registration covers everything you need
          </h1>
          <p className="text-lg text-tertiary">
            Your use case determines what messages carriers will allow you to
            send. We want to get this right so you don&apos;t hit limitations
            later.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {/* Section 1: What's included */}
          <ScopeSection
            variant="included"
            header={`With a ${useCase.label.toLowerCase()} registration, you can send:`}
            items={useCase.included}
          />

          {/* Section 2: What's not included */}
          <ScopeSection
            variant="not-included"
            header="This registration does NOT cover:"
            items={useCase.notIncluded}
          />

          {/* Section 3: Expansion options */}
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

              {/* Advisory notes */}
              {showBroadNote && (
                <p className="mt-4 rounded-lg bg-secondary p-3 text-sm text-tertiary">
                  Got it — we&apos;ll register you for a broader messaging
                  category that covers both{" "}
                  {useCase.label.toLowerCase()} and your additional needs.
                  This may require slightly stricter consent language on your
                  opt-in form, which we&apos;ll handle automatically.
                </p>
              )}

              {showPromoNote && (
                <p className="mt-4 rounded-lg bg-warning-primary p-3 text-sm text-tertiary">
                  Adding promotional messaging means recipients must give
                  separate, explicit consent for marketing texts — not just
                  transactional consent. We&apos;ll add a specific marketing
                  opt-in to your compliance site. This is stricter than a
                  transactional-only registration, but it gives you the
                  flexibility to send both.
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
