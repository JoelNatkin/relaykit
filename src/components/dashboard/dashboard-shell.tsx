"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { TabNav } from "./tab-nav";
import { DashboardProvider } from "./dashboard-context";
import { createClient } from "@/utils/supabase/client";
import type { LifecycleStage } from "@/lib/dashboard/lifecycle";
import type { UseCaseId } from "@/lib/intake/use-case-data";

interface DashboardShellProps {
  children: ReactNode;
  stage: LifecycleStage;
  useCase: UseCaseId | null;
  sandboxMessageCount: number;
  phoneVerified: boolean;
  verifiedPhone: string | null;
  email: string;
  registrationStatus: string | null;
  registrationId: string | null;
  registrationPhone: string | null;
  canonMessageIds: string[];
}

export function DashboardShell({ children, stage, useCase, sandboxMessageCount, phoneVerified, verifiedPhone, email, registrationStatus, registrationId, registrationPhone, canonMessageIds }: DashboardShellProps) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <DashboardProvider stage={stage} useCase={useCase} sandboxMessageCount={sandboxMessageCount} phoneVerified={phoneVerified} verifiedPhone={verifiedPhone} email={email} registrationStatus={registrationStatus} registrationId={registrationId} registrationPhone={registrationPhone} canonMessageIds={canonMessageIds}>
      <div className="min-h-screen bg-primary">
        <header className="border-b border-secondary bg-primary">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold text-primary">
                  RelayKit
                </span>
              </div>
              <span className="text-sm text-tertiary">
                {email}
                {" · "}
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="text-tertiary transition duration-100 ease-linear hover:text-secondary"
                >
                  Sign out
                </button>
              </span>
            </div>
            <TabNav stage={stage} />
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </DashboardProvider>
  );
}
