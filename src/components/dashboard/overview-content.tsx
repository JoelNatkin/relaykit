"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDashboard } from "./dashboard-context";
import { UseCaseSelector } from "./use-case-selector";
import { UseCaseBadge } from "./use-case-badge";
import { MessagePlanBuilder } from "./message-plan-builder";
import { BuildSpecSection } from "./build-spec-section";
import type { UseCaseId } from "@/lib/intake/use-case-data";

export function OverviewContent() {
  const { stage, useCase } = useDashboard();
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
          <MessagePlanBuilder useCase={useCase} />
          <BuildSpecSection useCase={useCase} />
        </>
      ) : null}
    </div>
  );
}
