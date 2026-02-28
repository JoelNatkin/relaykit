"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { ArrowLeft, CreditCard02 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { ReviewDetailsCard } from "@/components/intake/review-details-card";
import { ReviewPreviewCard } from "@/components/intake/review-preview-card";
import { USE_CASES, type UseCaseId } from "@/lib/intake/use-case-data";
import {
  generateTemplates,
  generateComplianceSlug,
} from "@/lib/intake/templates";

function ReviewContent() {
  const searchParams = useSearchParams();

  // Intake params from previous screens
  const useCaseId = searchParams.get("use_case") as UseCaseId | null;
  const expansions = searchParams.get("expansions") ?? "";

  // Business details from Screen 2
  const businessName = searchParams.get("business_name") ?? "";
  const businessDescription = searchParams.get("business_description") ?? "";
  const hasEin = searchParams.get("has_ein") ?? "";
  const businessType = searchParams.get("business_type") ?? "";
  const contactName = searchParams.get("contact_name") ?? "";
  const email = searchParams.get("email") ?? "";
  const phone = searchParams.get("phone") ?? "";
  const addressLine1 = searchParams.get("address_line1") ?? "";
  const addressCity = searchParams.get("address_city") ?? "";
  const addressState = searchParams.get("address_state") ?? "";
  const addressZip = searchParams.get("address_zip") ?? "";
  const serviceType = searchParams.get("service_type") ?? "";
  const productType = searchParams.get("product_type") ?? "";
  const appName = searchParams.get("app_name") ?? "";
  const communityName = searchParams.get("community_name") ?? "";
  const venueType = searchParams.get("venue_type") ?? "";

  const useCase = useCaseId ? USE_CASES[useCaseId] : null;

  // Generate templates
  const templates = useMemo(() => {
    if (!useCaseId) return null;
    return generateTemplates({
      use_case: useCaseId,
      business_name: businessName,
      business_description: businessDescription,
      service_type: serviceType || undefined,
      product_type: productType || undefined,
      app_name: appName || undefined,
      community_name: communityName || undefined,
      venue_type: venueType || undefined,
    });
  }, [
    useCaseId,
    businessName,
    businessDescription,
    serviceType,
    productType,
    appName,
    communityName,
    venueType,
  ]);

  const complianceSlug = useMemo(
    () => generateComplianceSlug(businessName),
    [businessName],
  );

  // Resolve expansion labels from URL param
  const expansionLabels = useMemo(() => {
    if (!expansions || !useCase) return [];
    const selectedIds = expansions.split(",").filter(Boolean);
    return selectedIds
      .map((id) => useCase.expansions.find((e) => e.id === id)?.label)
      .filter((label): label is string => !!label);
  }, [expansions, useCase]);

  if (!useCase || !templates) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center bg-primary px-4">
        <p className="mb-4 text-lg text-tertiary">
          Missing intake data. Please start from the beginning.
        </p>
        <Button href="/start" color="secondary" iconLeading={ArrowLeft}>
          Back to use cases
        </Button>
      </div>
    );
  }

  // Build the full address string
  const fullAddress = [addressLine1, addressCity, `${addressState} ${addressZip}`]
    .filter(Boolean)
    .join(", ");

  // Build edit href that sends them back to Screen 2 with all data preserved
  function buildEditHref() {
    const params = new URLSearchParams(searchParams.toString());
    return `/start/details?${params.toString()}`;
  }

  // Build back href
  function buildBackHref() {
    const params = new URLSearchParams(searchParams.toString());
    return `/start/details?${params.toString()}`;
  }

  return (
    <div className="flex min-h-svh flex-col bg-primary">
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-12 sm:px-6 lg:py-16">
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
            Here&apos;s what we&apos;ll register for you
          </h1>
          <p className="text-lg text-tertiary">
            Review your details and messaging profile.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid items-start gap-6 lg:grid-cols-2">
          {/* Left: Details */}
          <ReviewDetailsCard
            businessName={businessName}
            businessType={
              hasEin === "yes" && businessType
                ? businessType
                : "Sole Proprietor"
            }
            contactName={contactName}
            email={email}
            phone={phone}
            address={fullAddress}
            useCaseLabel={useCase.label}
            editHref={buildEditHref()}
          />

          {/* Right: Generated preview */}
          <ReviewPreviewCard
            campaignDescription={templates.campaign_description}
            sampleMessages={templates.sample_messages}
            sampleMessageLabels={templates.sample_message_labels}
            complianceSlug={complianceSlug}
            useCaseLabel={useCase.label}
            expansionLabels={expansionLabels}
            includedItems={useCase.included}
          />
        </div>

        {/* Navigation */}
        <div className="mt-8 flex flex-col items-end gap-5">
          <p className="text-sm text-tertiary">
            If we can&apos;t get you approved, you&apos;ll get a full refund.
          </p>
          <div className="flex w-full items-center justify-between">
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
              iconLeading={CreditCard02}
            >
              Proceed to payment — $199
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense>
      <ReviewContent />
    </Suspense>
  );
}
