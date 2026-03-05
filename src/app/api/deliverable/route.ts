import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { generateMessagingSetup } from "@/lib/deliverable/generator";
import { generateGuidelines } from "@/lib/deliverable/guidelines-generator";
import type { CanonMessage } from "@/lib/deliverable/canon-messages";
import type { UseCaseId } from "@/lib/intake/use-case-data";

const VALID_DOCS = ["messaging_setup", "sms_guidelines"] as const;
type DocParam = (typeof VALID_DOCS)[number];

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Parse and validate query params
  const registrationId = request.nextUrl.searchParams.get("registration_id");
  const doc = request.nextUrl.searchParams.get("doc");

  if (!registrationId || !doc || !VALID_DOCS.includes(doc as DocParam)) {
    return new Response(
      JSON.stringify({
        error:
          'Missing or invalid query params. Required: registration_id, doc ("messaging_setup" or "sms_guidelines")',
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  // Load customer by user email
  const { data: customer } = await supabase
    .from("customers")
    .select("id, business_name, business_description, use_case, email")
    .eq("email", user.email!)
    .single();

  if (!customer) {
    return new Response(JSON.stringify({ error: "Customer not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Load registration and verify ownership
  const { data: registration } = await supabase
    .from("registrations")
    .select(
      "id, status, canon_messages, phone_number, compliance_site_url, rate_limit_tier, approved_at, customer_id",
    )
    .eq("id", registrationId)
    .single();

  if (!registration) {
    return new Response(JSON.stringify({ error: "Registration not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (registration.customer_id !== customer.id) {
    return new Response(
      JSON.stringify({ error: "Registration does not belong to this account" }),
      { status: 403, headers: { "Content-Type": "application/json" } },
    );
  }

  // Only serve production docs for approved registrations
  if (registration.status !== "complete") {
    return new Response(
      JSON.stringify({
        error:
          "Production documents are available once your campaign is approved.",
      }),
      { status: 403, headers: { "Content-Type": "application/json" } },
    );
  }

  // Format registration date
  const registrationDate = registration.approved_at
    ? new Date(registration.approved_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  let content: string;

  if (doc === "messaging_setup") {
    content = generateMessagingSetup({
      business_name: customer.business_name,
      use_case: customer.use_case as UseCaseId,
      registration_date: registrationDate,
      rk_live_key: "Your live API key (copy from dashboard)",
      webhook_secret: "Your webhook secret (copy from dashboard)",
      phone_number: registration.phone_number,
      compliance_site_url: registration.compliance_site_url,
      canon_messages: registration.canon_messages as CanonMessage[],
      rate_limit_tier: registration.rate_limit_tier || "standard",
    });
  } else {
    content = generateGuidelines(
      {
        use_case: customer.use_case as UseCaseId,
        business_name: customer.business_name,
        business_description: customer.business_description,
        phone_number: registration.phone_number,
        registration_date: registrationDate,
        canon_messages: registration.canon_messages as CanonMessage[],
        compliance_site_url: registration.compliance_site_url,
        rate_limit_tier: registration.rate_limit_tier || "standard",
      },
      "production",
    );
  }

  const filename =
    doc === "messaging_setup" ? "MESSAGING_SETUP.md" : "SMS_GUIDELINES.md";

  return new Response(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
