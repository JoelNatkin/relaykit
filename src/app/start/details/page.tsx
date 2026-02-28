"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense, useCallback, useMemo } from "react";
import { ArrowRight, ArrowLeft } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { BusinessDetailsForm } from "@/components/intake/business-details-form";
import { USE_CASES, type UseCaseId } from "@/lib/intake/use-case-data";
import type { BusinessDetailsData } from "@/lib/intake/validation";

function DetailsContent() {
  const searchParams = useSearchParams();
  const useCaseId = searchParams.get("use_case") as UseCaseId | null;
  const expansions = searchParams.get("expansions") ?? "";
  const campaignType = searchParams.get("campaign_type") ?? "";
  const useCase = useCaseId ? USE_CASES[useCaseId] : null;

  // Extract form field initial values from URL params (for edit round-trip)
  const formFields = [
    "business_name", "business_description", "has_ein", "ein", "business_type",
    "contact_name", "email", "phone", "address_line1", "address_city",
    "address_state", "address_zip", "website_url", "service_type",
    "product_type", "app_name", "community_name", "venue_type",
  ];
  const initialValues = useMemo(() => {
    const vals: Record<string, string> = {};
    for (const field of formFields) {
      const v = searchParams.get(field);
      if (v) vals[field] = v;
    }
    return Object.keys(vals).length > 0 ? vals : undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const [validData, setValidData] = useState<BusinessDetailsData | null>(null);

  const handleValid = useCallback((data: BusinessDetailsData) => {
    setValidData(data);
  }, []);

  const handleInvalid = useCallback(() => {
    setValidData(null);
  }, []);

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

  function buildBackHref() {
    const params = new URLSearchParams();
    params.set("use_case", useCase!.id);
    return `/start/scope?${params.toString()}`;
  }

  function buildContinueHref() {
    if (!validData) return "#";

    const params = new URLSearchParams();
    params.set("use_case", useCase!.id);
    if (expansions) params.set("expansions", expansions);
    if (campaignType) params.set("campaign_type", campaignType);

    // Serialize form data
    for (const [key, value] of Object.entries(validData)) {
      if (value !== null && value !== undefined && value !== "") {
        params.set(key, String(value));
      }
    }

    // Normalize phone to digits only
    if (validData.phone) {
      params.set("phone", validData.phone.replace(/\D/g, ""));
    }

    return `/start/review?${params.toString()}`;
  }

  return (
    <div className="flex min-h-svh flex-col bg-primary">
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-12 sm:px-6 lg:py-16">
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
            Tell us about your business
          </h1>
          <p className="text-lg text-tertiary">
            We use this to register your messaging with US carriers.
          </p>
        </div>

        {/* Form */}
        <BusinessDetailsForm
          useCase={useCase.id}
          initialValues={initialValues}
          onValid={handleValid}
          onInvalid={handleInvalid}
        />

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <Button
            href={buildBackHref()}
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
            isDisabled={!validData}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function DetailsPage() {
  return (
    <Suspense>
      <DetailsContent />
    </Suspense>
  );
}
