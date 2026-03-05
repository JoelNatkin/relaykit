"use client";

import { createContext, useContext } from "react";
import type { LifecycleStage } from "@/lib/dashboard/lifecycle";
import type { UseCaseId } from "@/lib/intake/use-case-data";

interface DashboardContextValue {
  stage: LifecycleStage;
  useCase: UseCaseId | null;
  sandboxMessageCount: number;
  phoneVerified: boolean;
  verifiedPhone: string | null;
  email: string;
  registrationStatus: string | null;
  registrationId: string | null;
  registrationPhone: string | null;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({
  stage,
  useCase,
  sandboxMessageCount,
  phoneVerified,
  verifiedPhone,
  email,
  registrationStatus,
  registrationId,
  registrationPhone,
  children,
}: DashboardContextValue & { children: React.ReactNode }) {
  return (
    <DashboardContext.Provider value={{ stage, useCase, sandboxMessageCount, phoneVerified, verifiedPhone, email, registrationStatus, registrationId, registrationPhone }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard(): DashboardContextValue {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }
  return ctx;
}
