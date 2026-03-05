import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

const messagePlanEntrySchema = z.object({
  template_id: z.string(),
  category: z.string(),
  original_template: z.string(),
  edited_text: z.string().nullable(),
  trigger: z.string(),
  variables: z.array(z.string()),
  is_expansion: z.boolean(),
  expansion_type: z.string().nullable(),
  enabled: z.boolean(),
});

const patchSchema = z.object({
  use_case: z.string().min(1),
  messages: z.array(messagePlanEntrySchema),
});

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = user.email!;

  // Check for customer record (post-payment)
  const { data: customer } = await supabase
    .from("customers")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (customer) {
    const { data: plan } = await supabase
      .from("message_plans")
      .select("use_case, messages")
      .eq("customer_id", customer.id)
      .maybeSingle();

    return NextResponse.json({
      messages: plan?.messages ?? null,
      use_case: plan?.use_case ?? null,
    });
  }

  // Pre-registration: read from user metadata
  const metaPlan = user.user_metadata?.message_plan ?? null;

  return NextResponse.json({
    messages: metaPlan?.messages ?? null,
    use_case: metaPlan?.use_case ?? null,
  });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = patchSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { use_case, messages } = parsed.data;
  const email = user.email!;

  // Check for customer record (post-payment)
  const { data: customer } = await supabase
    .from("customers")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (customer) {
    // Upsert into message_plans table
    const { error } = await supabase.from("message_plans").upsert(
      {
        customer_id: customer.id,
        use_case,
        messages,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "customer_id" },
    );

    if (error) {
      return NextResponse.json(
        { error: "Failed to save message plan" },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  }

  // Pre-registration: store in user metadata
  const { error } = await supabase.auth.updateUser({
    data: { message_plan: { use_case, messages } },
  });

  if (error) {
    return NextResponse.json(
      { error: "Failed to save message plan" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
