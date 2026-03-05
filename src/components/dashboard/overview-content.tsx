"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDashboard } from "./dashboard-context";
import { UseCaseSelector } from "./use-case-selector";
import { UseCaseBadge } from "./use-case-badge";
import { MessagePlanBuilder } from "./message-plan-builder";
import { BuildSpecSection } from "./build-spec-section";
import { SandboxApiKeyCard } from "./sandbox-api-key-card";
import { PhoneVerificationCard } from "./phone-verification-card";
import { SandboxUsageCard } from "./sandbox-usage-card";
import { GoLiveCta } from "./go-live-cta";
import { RegistrationStatusCard } from "./registration-status-card";
import { OtpActionCard, BrandAuthCard, RejectionCard } from "./registration-action-cards";
import type { UseCaseId } from "@/lib/intake/use-case-data";

export function OverviewContent() {
  const { stage, useCase, sandboxMessageCount, registrationStatus, registrationId, registrationPhone, email } = useDashboard();
  const router = useRouter();
  const [isChanging, setIsChanging] = useState(false);

  const showSelector = stage === "new" || isChanging;

  async function handleSelect(selectedUseCase: UseCaseId) {
    const res = await fetch("/api/use-case", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ use_case: selectedUseCase }),
    });

    if (res.ok) {
      setIsChanging(false);
      router.refresh();
    }
  }

  return (
    <div className="space-y-6">
      {showSelector ? (
        <UseCaseSelector onSelect={handleSelect} />
      ) : useCase ? (
        <>
          <UseCaseBadge
            useCase={useCase}
            onChangeClick={() => setIsChanging(true)}
          />

          {/* Registration progress — Stage 5 (registering) */}
          {registrationStatus && (
            <>
              <RegistrationStatusCard status={registrationStatus} />
              {registrationStatus === "awaiting_otp" && registrationPhone && registrationId && (
                <OtpActionCard phone={registrationPhone} registrationId={registrationId} />
              )}
              {registrationStatus === "awaiting_brand_auth" && (
                <BrandAuthCard email={email} />
              )}
              {registrationStatus === "rejected" && (
                <RejectionCard detail={null} />
              )}
            </>
          )}

          {/* Engagement nudge — Stage 4 (ready), top of page */}
          {stage === "ready" && <GoLiveCta variant="nudge" />}

          {/* Sandbox infrastructure cards — persist across all sandbox stages */}
          <SandboxApiKeyCard />
          <PhoneVerificationCard />
          {sandboxMessageCount > 0 && (
            <SandboxUsageCard messageCount={sandboxMessageCount} />
          )}

          <MessagePlanBuilder useCase={useCase} />
          <BuildSpecSection useCase={useCase} />

          {/* Default Go Live CTA — always visible at bottom */}
          <GoLiveCta variant="default" />
        </>
      ) : null}
    </div>
  );
}
