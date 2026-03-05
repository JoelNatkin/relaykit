import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { generateBuildSpec } from "@/lib/deliverable/build-spec-generator";
import { generateGuidelines } from "@/lib/deliverable/guidelines-generator";
import type { MessagePlanEntry } from "@/lib/dashboard/message-plan-types";
import type { UseCaseId } from "@/lib/intake/use-case-data";

export async function POST() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = user.email!;
  const metaUseCase = user.user_metadata?.use_case as UseCaseId | undefined;

  // Resolve message plan and use case from customer record or user metadata
  let useCase: UseCaseId | null = null;
  let messages: MessagePlanEntry[] | null = null;
  let sandboxApiKey = "rk_sandbox_your_key_here";

  const { data: customer } = await supabase
    .from("customers")
    .select("id, use_case, business_name, business_description")
    .eq("email", email)
    .maybeSingle();

  if (customer) {
    useCase = customer.use_case as UseCaseId;

    const { data: plan } = await supabase
      .from("message_plans")
      .select("id, messages")
      .eq("customer_id", customer.id)
      .maybeSingle();

    if (plan) {
      messages = plan.messages as MessagePlanEntry[];

      // Update build_spec_generated_at
      await supabase
        .from("message_plans")
        .update({ build_spec_generated_at: new Date().toISOString() })
        .eq("id", plan.id);
    }
  } else {
    // Pre-registration: read from user metadata
    useCase = metaUseCase ?? null;
    const metaPlan = user.user_metadata?.message_plan;
    messages = metaPlan?.messages ?? null;

    // Record build_spec_generated_at in user metadata
    await supabase.auth.updateUser({
      data: {
        ...user.user_metadata,
        build_spec_generated_at: new Date().toISOString(),
      },
    });
  }

  if (!useCase || !messages || messages.length === 0) {
    return NextResponse.json(
      { error: "No message plan found. Select a use case and curate your messages first." },
      { status: 400 },
    );
  }

  const buildSpec = generateBuildSpec({
    useCase,
    sandboxApiKey,
    businessName: customer?.business_name,
    messages,
  });

  const guidelines = generateGuidelines(
    {
      use_case: useCase,
      business_name: customer?.business_name,
      business_description: customer?.business_description,
    },
    "sandbox",
  );

  return NextResponse.json({
    buildSpec,
    guidelines,
  });
}
