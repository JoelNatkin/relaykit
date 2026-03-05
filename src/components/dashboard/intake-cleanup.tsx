"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { clearDashboardIntakeData } from "@/lib/dashboard/dashboard-to-intake";
import { clearIntakeSession } from "@/lib/intake/session-storage";

/**
 * Clears intake sessionStorage keys after successful Stripe payment redirect.
 * Renders nothing — purely a side-effect component.
 */
export function IntakeCleanup() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("session_id")) {
      clearDashboardIntakeData();
      clearIntakeSession();
    }
  }, [searchParams]);

  return null;
}
