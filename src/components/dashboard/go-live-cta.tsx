"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/base/buttons/button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { Rocket01 } from "@untitledui/icons";
import { useDashboard } from "./dashboard-context";
import {
  buildIntakeData,
  saveDashboardIntakeData,
} from "@/lib/dashboard/dashboard-to-intake";
import type { MessagePlanEntry } from "@/lib/dashboard/message-plan-types";
import type { UseCaseId } from "@/lib/intake/use-case-data";

interface GoLiveCtaProps {
  variant: "default" | "nudge";
}

export function GoLiveCta({ variant }: GoLiveCtaProps) {
  const { useCase, email } = useDashboard();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  async function handleRegister() {
    if (!useCase) return;
    setIsNavigating(true);

    try {
      // Fetch current message plan to serialize for the wizard
      const res = await fetch("/api/message-plan");
      let entries: MessagePlanEntry[] = [];
      if (res.ok) {
        const data = await res.json();
        if (data.messages) {
          entries = data.messages;
        }
      }

      // Build and save the data contract to sessionStorage
      const intakeData = buildIntakeData(
        useCase as UseCaseId,
        entries,
        email,
      );
      saveDashboardIntakeData(intakeData);

      // Navigate to intake wizard — Path 2 skips Screen 1
      router.push("/start/scope");
    } catch {
      setIsNavigating(false);
    }
  }

  if (variant === "nudge") {
    return (
      <div className="rounded-xl border border-brand bg-brand-section_subtle p-5">
        <div className="flex items-start gap-4">
          <FeaturedIcon
            icon={Rocket01}
            size="md"
            color="brand"
            theme="light"
          />
          <div className="flex-1">
            <p className="text-sm font-semibold text-primary">
              {"You've been building — nice work."}
            </p>
            <p className="mt-1 text-sm text-tertiary">
              Your integration looks ready for real users. Register to get your
              live API key. Same code, one key swap.
            </p>
            <Button
              size="sm"
              color="primary"
              onClick={handleRegister}
              isLoading={isNavigating}
              showTextWhileLoading
              className="mt-3"
            >
              {"Register now \u2014 $199 + $19/month"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Default variant — subtle card at bottom
  return (
    <div className="rounded-xl border border-secondary bg-primary p-5">
      <p className="text-sm font-semibold text-primary">
        Ready to send to real users?
      </p>
      <p className="mt-1 text-sm text-tertiary">
        Register for carrier approval. Same API, same code — just swap your key.
      </p>
      <Button
        size="sm"
        color="secondary"
        onClick={handleRegister}
        isLoading={isNavigating}
        showTextWhileLoading
        className="mt-3"
      >
        {"Register now \u2014 $199 + $19/month"}
      </Button>
    </div>
  );
}
