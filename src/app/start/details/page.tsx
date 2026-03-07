// CRITICAL: This component uses sessionStorage for cross-screen persistence.
// Key: "relaykit_intake" — do NOT remove sessionStorage read/write logic.
"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense, useCallback } from "react";
import { ArrowRight, ArrowLeft } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { BusinessDetailsForm } from "@/components/intake/business-details-form";
import { USE_CASES, type UseCaseId } from "@/lib/intake/use-case-data";
import type { BusinessDetailsData } from "@/lib/intake/validation";
import {
  getIntakeSession,
  saveIntakeSession,
} from "@/lib/intake/session-storage";
import { getDashboardIntakeData } from "@/lib/dashboard/dashboard-to-intake";

function DetailsContent() {
  const searchParams = useSearchParams();
  const useCaseId = searchParams.get("use_case") as UseCaseId | null;
  const expansions = searchParams.get("expansions") ?? "";
  const campaignType = searchParams.get("campaign_type") ?? "";
  const isDashboardPath = searchParams.get("path") === "dashboard";
  const useCase = useCaseId ? USE_CASES[useCaseId] : null;

  const [initialValues, setInitialValues] = useState<
    Partial<Record<string, string>> | undefined
  >(undefined);

  // Hydrate from sessionStorage after mount
  useEffect(() => {
    const session = getIntakeSession();
    if (session.business_details && Object.keys(session.business_details).length > 0) {
      setInitialValues(session.business_details);
      return;
    }
    // Path 2: pre-fill email from dashboard data
    if (isDashboardPath) {
      const dashData = getDashboardIntakeData();
      if (dashData?.email) {
        setInitialValues({ email: dashData.email });
      }
    }
  }, [isDashboardPath]);

  const [validData, setValidData] = useState<BusinessDetailsData | null>(null);

  const handleValid = useCallback((data: BusinessDetailsData) => {
    setValidData(data);
    // Save business details to session on every valid change
    const details: Record<string, string> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== null && value !== undefined && value !== "") {
        details[key] = String(value);
      }
    }
    saveIntakeSession({ business_details: details });
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
    if (isDashboardPath) params.set("path", "dashboard");
    return `/start/scope?${params.toString()}`;
  }

  function buildContinueHref() {
    if (!validData) return "#";

    const params = new URLSearchParams();
    params.set("use_case", useCase!.id);
    if (expansions) params.set("expansions", expansions);
    if (campaignType) params.set("campaign_type", campaignType);
    if (isDashboardPath) params.set("path", "dashboard");

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
