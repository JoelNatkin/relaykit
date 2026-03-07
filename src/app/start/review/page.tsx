// CRITICAL: This component uses sessionStorage for cross-screen persistence.
// Key: "relaykit_intake" — do NOT remove sessionStorage read/write logic.
"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, CreditCard02 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import {
  DialogTrigger,
  ModalOverlay,
  Modal,
  Dialog,
} from "@/components/application/modals/modal";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { ReviewDetailsCard } from "@/components/intake/review-details-card";
import { ReviewPreviewCard } from "@/components/intake/review-preview-card";
import { USE_CASES, type UseCaseId } from "@/lib/intake/use-case-data";
import {
  generateTemplates,
  generateComplianceSlug,
} from "@/lib/intake/templates";
import { getIntakeSession } from "@/lib/intake/session-storage";
import {
  getDashboardIntakeData,
  type DashboardToIntakeData,
} from "@/lib/dashboard/dashboard-to-intake";

function ReviewContent() {
  const searchParams = useSearchParams();
  const isDashboardPath = searchParams.get("path") === "dashboard";

  // Restore from sessionStorage after hydration (avoids SSR mismatch)
  const [session, setSession] = useState<ReturnType<typeof getIntakeSession>>({});
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const [dashData, setDashData] = useState<DashboardToIntakeData | null>(null);

  useEffect(() => {
    setSession(getIntakeSession());
    if (isDashboardPath) {
      setDashData(getDashboardIntakeData());
    }
    setSessionLoaded(true);
  }, [isDashboardPath]);

  // Intake params from previous screens (URL params for routing, session for data)
  const useCaseId = (searchParams.get("use_case") ?? session.use_case ?? null) as UseCaseId | null;
  const expansions = searchParams.get("expansions") ?? (session.expansions?.join(",") ?? "");

  // Business details from sessionStorage only — never in URL
  const bd = session.business_details ?? {};
  const businessName = bd.business_name ?? "";
  const businessDescription = bd.business_description ?? "";
  const hasEin = bd.has_ein ?? "";
  const businessType = bd.business_type ?? "";
  const firstName = bd.first_name ?? "";
  const lastName = bd.last_name ?? "";
  const email = bd.email ?? "";
  const phone = bd.phone ?? "";
  const addressLine1 = bd.address_line1 ?? "";
  const addressCity = bd.address_city ?? "";
  const addressState = bd.address_state ?? "";
  const addressZip = bd.address_zip ?? "";
  const serviceType = bd.service_type ?? "";
  const productType = bd.product_type ?? "";
  const appName = bd.app_name ?? "";
  const communityName = bd.community_name ?? "";
  const venueType = bd.venue_type ?? "";

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

  // Wait for sessionStorage hydration before deciding data is missing
  if (!useCase || !templates) {
    if (!sessionLoaded) {
      return <div className="min-h-svh bg-primary" />;
    }
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

  // Build href back to Screen 2 — routing params only, form data is in sessionStorage
  function buildDetailsHref() {
    const params = new URLSearchParams();
    if (useCaseId) params.set("use_case", useCaseId);
    if (expansions) params.set("expansions", expansions);
    const ct = searchParams.get("campaign_type") ?? session.campaign_type ?? "";
    if (ct) params.set("campaign_type", ct);
    if (isDashboardPath) params.set("path", "dashboard");
    return `/start/details?${params.toString()}`;
  }

  const [monitoringConsent, setMonitoringConsent] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleCheckout = useCallback(async () => {
    setIsCheckingOut(true);
    setCheckoutError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          use_case: useCaseId,
          expansions: selectedExpansions,
          campaign_type: searchParams.get("campaign_type") ?? session.campaign_type ?? "",
          business_name: businessName,
          business_description: businessDescription,
          has_ein: hasEin,
          ein: bd.ein ?? null,
          business_type: businessType || null,
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          address_line1: addressLine1,
          address_city: addressCity,
          address_state: addressState,
          address_zip: addressZip,
          website_url: bd.website_url || null,
          service_type: serviceType || null,
          product_type: productType || null,
          app_name: appName || null,
          community_name: communityName || null,
          venue_type: venueType || null,
          campaign_description_override: null,
          sample_messages_override: null,
          monitoring_consent: monitoringConsent,
          // Path 2: include source and dashboard-curated messages
          ...(isDashboardPath && dashData ? {
            source: "dashboard" as const,
            selected_messages: dashData.selected_messages,
            preferred_area_code: dashData.preferred_area_code ?? null,
          } : {
            source: "cold" as const,
          }),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setCheckoutError(data.error ?? "Something went wrong. Please try again.");
        setIsCheckingOut(false);
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = data.checkout_url;
    } catch {
      setCheckoutError("Network error. Please check your connection and try again.");
      setIsCheckingOut(false);
    }
  }, [
    useCaseId, selectedExpansions, searchParams, session, bd, isDashboardPath, dashData,
    businessName, businessDescription, hasEin, businessType,
    firstName, lastName, email, phone,
    addressLine1, addressCity, addressState, addressZip,
    serviceType, productType, appName, communityName, venueType,
    monitoringConsent,
  ]);

  const isEinRegistration = hasEin === "yes";

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
          <div className="hidden shrink-0 lg:flex">
            <Button
              size="lg"
              color="primary"
              iconLeading={CreditCard02}
              isDisabled={!monitoringConsent}
              onClick={() => setIsModalOpen(true)}
            >
              Start my registration
            </Button>
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
            contactName={`${firstName} ${lastName}`.trim()}
            email={email}
            phone={phone}
            address={fullAddress}
            useCaseLabel={useCase.label}
            editHref={buildDetailsHref()}
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
            dashboardMessages={dashData?.selected_messages}
          />
        </div>

        {/* Pricing breakdown */}
        <div className="mt-8 rounded-xl border border-secondary p-5">
          <div className="flex flex-col gap-3">
            <h3 className="text-md font-semibold text-primary">
              Pricing breakdown
            </h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-tertiary">One-time setup fee</span>
                <span className="font-semibold text-primary">$199</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-tertiary">Monthly subscription</span>
                <span className="font-semibold text-primary">$19/mo</span>
              </div>
              <div className="border-t border-secondary pt-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-primary">Due today</span>
                  <span className="font-semibold text-primary">$218</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-tertiary">
              500 messages included monthly. Additional messages $15 per 1,000, auto-scales with no interruption. Money back if not approved.
            </p>
          </div>

          {/* Monitoring consent */}
          <div className="mt-4 border-t border-secondary pt-4">
            <Checkbox
              isSelected={monitoringConsent}
              onChange={setMonitoringConsent}
              label="I understand that RelayKit monitors outbound messages"
              hint="RelayKit enforces compliance on outbound messages to protect your phone number from carrier suspension and maintain platform integrity for all users."
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-5 flex w-full items-center justify-between">
          <Button
            href={buildDetailsHref()}
            color="link-gray"
            iconLeading={ArrowLeft}
          >
            Back
          </Button>
          <Button
            size="lg"
            color="primary"
            iconLeading={CreditCard02}
            isDisabled={!monitoringConsent}
            onClick={() => setIsModalOpen(true)}
          >
            Start my registration — $218
          </Button>
        </div>
      </div>

      {/* Confirmation modal */}
      <DialogTrigger isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalOverlay isDismissable={false}>
          <Modal className="max-w-lg">
            <Dialog>
              <div className="w-full rounded-xl bg-primary p-6 shadow-xl">
                <h2 className="text-lg font-semibold text-primary">
                  Before you pay, double-check your details
                </h2>
                <p className="mt-2 text-sm text-tertiary">
                  If anything doesn&apos;t match your official records, your
                  registration could be delayed or rejected.
                </p>

                <ul className="mt-5 flex flex-col gap-2.5 text-sm text-secondary">
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-fg-secondary" aria-hidden="true" />
                    Business name matches your legal name exactly
                  </li>
                  {isEinRegistration && (
                    <li className="flex items-start gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-fg-secondary" aria-hidden="true" />
                      EIN matches your IRS records
                    </li>
                  )}
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-fg-secondary" aria-hidden="true" />
                    {isEinRegistration
                      ? "Address matches your business registration"
                      : "Address is current and accurate"}
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-fg-secondary" aria-hidden="true" />
                    Email and phone number are ones you actively monitor
                  </li>
                </ul>

                {checkoutError && (
                  <p className="mt-4 rounded-lg bg-error-primary p-3 text-sm text-error-primary">
                    {checkoutError}
                  </p>
                )}

                <div className="mt-6 flex gap-3">
                  <Button
                    className="flex-1"
                    size="lg"
                    color="secondary"
                    isDisabled={isCheckingOut}
                    onClick={() => setIsModalOpen(false)}
                  >
                    Go back and check
                  </Button>
                  <Button
                    className="flex-1"
                    size="lg"
                    color="primary"
                    iconLeading={CreditCard02}
                    isLoading={isCheckingOut}
                    showTextWhileLoading
                    onClick={handleCheckout}
                  >
                    Everything looks good
                  </Button>
                </div>
              </div>
            </Dialog>
          </Modal>
        </ModalOverlay>
      </DialogTrigger>
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
