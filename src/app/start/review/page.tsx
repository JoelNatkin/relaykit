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
import { getIntakeSession } from "@/lib/intake/session-storage";

function ReviewContent() {
  const searchParams = useSearchParams();

  // Restore from sessionStorage as fallback for back-navigation
  const session = useMemo(() => getIntakeSession(), []);

  // Intake params from previous screens (URL params first, session fallback)
  const useCaseId = (searchParams.get("use_case") ?? session.use_case ?? null) as UseCaseId | null;
  const expansions = searchParams.get("expansions") ?? (session.expansions?.join(",") ?? "");

  // Business details: URL params first, then sessionStorage fallback
  const bd = session.business_details ?? {};
  const businessName = searchParams.get("business_name") ?? bd.business_name ?? "";
  const businessDescription = searchParams.get("business_description") ?? bd.business_description ?? "";
  const hasEin = searchParams.get("has_ein") ?? bd.has_ein ?? "";
  const businessType = searchParams.get("business_type") ?? bd.business_type ?? "";
  const contactName = searchParams.get("contact_name") ?? bd.contact_name ?? "";
  const email = searchParams.get("email") ?? bd.email ?? "";
  const phone = searchParams.get("phone") ?? bd.phone ?? "";
  const addressLine1 = searchParams.get("address_line1") ?? bd.address_line1 ?? "";
  const addressCity = searchParams.get("address_city") ?? bd.address_city ?? "";
  const addressState = searchParams.get("address_state") ?? bd.address_state ?? "";
  const addressZip = searchParams.get("address_zip") ?? bd.address_zip ?? "";
  const serviceType = searchParams.get("service_type") ?? bd.service_type ?? "";
  const productType = searchParams.get("product_type") ?? bd.product_type ?? "";
  const appName = searchParams.get("app_name") ?? bd.app_name ?? "";
  const communityName = searchParams.get("community_name") ?? bd.community_name ?? "";
  const venueType = searchParams.get("venue_type") ?? bd.venue_type ?? "";

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
  // Parse selected expansion IDs from URL param
  const selectedExpansions = useMemo(
    () => (expansions ? expansions.split(",").filter(Boolean) : []),
    [expansions],
  );

  const expansionLabels = useMemo(() => {
    if (selectedExpansions.length === 0 || !useCase) return [];
    return selectedExpansions
      .map((id) => useCase.expansions.find((e) => e.id === id)?.label)
      .filter((label): label is string => !!label);
  }, [selectedExpansions, useCase]);

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

        <div className="mb-8 flex items-start justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-display-sm font-semibold text-primary sm:text-display-md">
              Here&apos;s what we&apos;ll register for you
            </h1>
            <p className="text-lg text-tertiary">
              Review your details and messaging profile.
            </p>
          </div>
          <div className="hidden shrink-0 flex-col items-end gap-2 lg:flex">
            <Button
              size="lg"
              color="primary"
              iconLeading={CreditCard02}
            >
              Proceed to payment — $199
            </Button>
            <p className="text-sm text-tertiary">
              Money back if not approved
            </p>
          </div>
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
            notIncludedItems={useCase.notIncluded}
            selectedExpansions={selectedExpansions}
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
