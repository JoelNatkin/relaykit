import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { createServiceClient } from "@/lib/supabase";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { IntakeCleanup } from "@/components/dashboard/intake-cleanup";
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
    <DashboardShell stage={stage} useCase={dashboardState.useCase} sandboxMessageCount={dashboardState.sandboxMessageCount} phoneVerified={dashboardState.phoneVerified} verifiedPhone={dashboardState.verifiedPhone} email={user.email!} registrationStatus={dashboardState.registrationStatus} registrationId={dashboardState.registrationId} registrationPhone={dashboardState.registrationPhone} canonMessageIds={dashboardState.canonMessageIds}>
      <Suspense><IntakeCleanup /></Suspense>
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
    // Pre-registration: use case and phone verification in user metadata
    const metaUseCase = user.user_metadata?.use_case ?? null;

    // Query total sandbox messages sent (for lifecycle stage threshold of 20)
    const serviceClient = createServiceClient();
    const { count: sandboxCount } = await serviceClient
      .from("messages")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("environment", "sandbox")
      .eq("direction", "outbound");

    return {
      useCase: metaUseCase,
      hasPlan: !!user.user_metadata?.message_plan,
      buildSpecGeneratedAt: user.user_metadata?.build_spec_generated_at ?? null,
      sandboxMessageCount: sandboxCount ?? 0,
      phoneVerified: !!user.user_metadata?.verified_phone,
      verifiedPhone: (user.user_metadata?.verified_phone as string) ?? null,
      registrationStatus: null,
      registrationId: null,
      registrationPhone: null,
      canonMessageIds: [],
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
    .select("id, status, phone_number, canon_messages")
    .eq("customer_id", customer.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // Query sandbox message count (post-registration users can still send sandbox)
  const serviceClient = createServiceClient();
  const { count: sandboxCount } = await serviceClient
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("environment", "sandbox")
    .eq("direction", "outbound");

  // Phone verification: check user metadata (verification persists across reg)
  const postRegPhoneVerified = !!user.user_metadata?.verified_phone;
  const postRegVerifiedPhone =
    (user.user_metadata?.verified_phone as string) ?? null;

  return {
    useCase: customer.use_case ?? null,
    hasPlan: !!plan,
    buildSpecGeneratedAt: plan?.build_spec_generated_at ?? null,
    sandboxMessageCount: sandboxCount ?? 0,
    phoneVerified: postRegPhoneVerified,
    verifiedPhone: postRegVerifiedPhone,
    registrationStatus: registration?.status ?? null,
    registrationId: registration?.id ?? null,
    registrationPhone: registration?.phone_number ?? null,
    canonMessageIds: Array.isArray(registration?.canon_messages)
      ? (registration.canon_messages as Array<{ template_id: string }>).map((m) => m.template_id)
      : [],
  };
}
