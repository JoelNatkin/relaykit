import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import {
  computeLifecycleStage,
  type DashboardState,
} from "@/lib/dashboard/lifecycle";
import type { User } from "@supabase/supabase-js";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch dashboard state for lifecycle computation
  const dashboardState = await fetchDashboardState(supabase, user);
  const stage = computeLifecycleStage(dashboardState);

  return (
    <DashboardShell stage={stage} useCase={dashboardState.useCase} email={user.email!}>
      {children}
    </DashboardShell>
  );
}

async function fetchDashboardState(
  supabase: Awaited<ReturnType<typeof createClient>>,
  user: User,
): Promise<DashboardState> {
  const email = user.email!;

  // Try to find customer record for this email
  const { data: customer } = await supabase
    .from("customers")
    .select("id, use_case")
    .eq("email", email)
    .maybeSingle();

  if (!customer) {
    // Pre-registration: use case may be stored in user metadata
    const metaUseCase = user.user_metadata?.use_case ?? null;
    return {
      useCase: metaUseCase,
      hasPlan: !!user.user_metadata?.message_plan,
      buildSpecGeneratedAt: null,
      sandboxMessageCount: 0,
      phoneVerified: false,
      registrationStatus: null,
    };
  }

  // Fetch message plan
  const { data: plan } = await supabase
    .from("message_plans")
    .select("id, build_spec_generated_at")
    .eq("customer_id", customer.id)
    .maybeSingle();

  // Fetch latest registration
  const { data: registration } = await supabase
    .from("registrations")
    .select("status")
    .eq("customer_id", customer.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return {
    useCase: customer.use_case ?? null,
    hasPlan: !!plan,
    buildSpecGeneratedAt: plan?.build_spec_generated_at ?? null,
    sandboxMessageCount: 0, // TODO: wire to usage tracking
    phoneVerified: false, // TODO: wire to phone verification state
    registrationStatus: registration?.status ?? null,
  };
}
