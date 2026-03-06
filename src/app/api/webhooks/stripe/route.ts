import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase";
import { sendEmail } from "@/lib/emails/sender";
import { registrationSubmitted } from "@/lib/emails/templates";
import { generateComplianceSlug } from "@/lib/templates/variables";

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("Missing STRIPE_WEBHOOK_SECRET");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createServiceClient();

  switch (event.type) {
    case "checkout.session.completed": {
      await handleCheckoutCompleted(supabase, event.data.object as Stripe.Checkout.Session);
      break;
    }
    case "invoice.payment_failed": {
      await handlePaymentFailed(supabase, event.data.object as Stripe.Invoice);
      break;
    }
    case "customer.subscription.deleted": {
      await handleSubscriptionDeleted(supabase, event.data.object as Stripe.Subscription);
      break;
    }
    default:
      // Unhandled event type — acknowledge receipt
      break;
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(
  supabase: ReturnType<typeof createServiceClient>,
  session: Stripe.Checkout.Session,
) {
  const intakeSessionId = session.metadata?.intake_session_id;
  if (!intakeSessionId) {
    console.error("checkout.session.completed: missing intake_session_id in metadata");
    return;
  }

  // Fetch intake data
  const { data: intake, error: intakeError } = await supabase
    .from("intake_sessions")
    .select("data")
    .eq("id", intakeSessionId)
    .single();

  if (intakeError || !intake) {
    console.error("checkout.session.completed: intake session not found:", intakeSessionId);
    return;
  }

  const d = intake.data as Record<string, unknown>;

  // Create customer record
  const { data: customer, error: customerError } = await supabase
    .from("customers")
    .insert({
      business_name: d.business_name,
      business_description: d.business_description,
      has_ein: d.has_ein === "yes",
      ein: d.has_ein === "yes" ? d.ein : null,
      business_type: d.has_ein === "yes" ? d.business_type : null,
      contact_name: `${d.first_name} ${d.last_name}`.trim(),
      email: d.email,
      phone: String(d.phone).replace(/\D/g, ""),
      address_line1: d.address_line1,
      address_city: d.address_city,
      address_state: d.address_state,
      address_zip: d.address_zip,
      use_case: d.use_case,
      expansions: (d.expansions as string[]) ?? [],
      effective_campaign_type: d.campaign_type,
      website_url: d.website_url || null,
      service_type: d.service_type || null,
      product_type: d.product_type || null,
      app_name: d.app_name || null,
      community_name: d.community_name || null,
      venue_type: d.venue_type || null,
      campaign_description_override: d.campaign_description_override || null,
      sample_messages_override: (d.sample_messages_override as string[]) ?? null,
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: session.subscription as string,
      subscription_status: "active",
    })
    .select("id")
    .single();

  if (customerError || !customer) {
    console.error("checkout.session.completed: failed to create customer:", customerError);
    return;
  }

  // Create registration record
  const { data: registration, error: regError } = await supabase
    .from("registrations")
    .insert({
      customer_id: customer.id,
      status: "creating_subaccount",
    })
    .select("id")
    .single();

  if (regError || !registration) {
    console.error("checkout.session.completed: failed to create registration:", regError);
    return;
  }

  // Clean up intake session
  await supabase
    .from("intake_sessions")
    .delete()
    .eq("id", intakeSessionId);

  // Trigger the registration pipeline (fire-and-forget — don't block webhook response)
  if (registration) {
    import("@/lib/orchestrator/processor").then(({ processRegistration }) => {
      processRegistration(registration.id).catch((err) => {
        console.error("[Stripe] Pipeline start failed for registration:", registration.id, err);
      });
    });

    // Email 2: registration submitted — fire-and-forget alongside pipeline
    const slug = generateComplianceSlug(String(d.business_name ?? ""));
    const complianceSiteUrl = `https://${slug}.${process.env.COMPLIANCE_SITE_DOMAIN ?? "msgverified.com"}`;
    const tpl = registrationSubmitted({
      first_name: String(d.first_name ?? ""),
      compliance_site_url: complianceSiteUrl,
    });
    void sendEmail({ to: String(d.email), subject: tpl.subject, body: tpl.body });
  }
}

async function handlePaymentFailed(
  supabase: ReturnType<typeof createServiceClient>,
  invoice: Stripe.Invoice,
) {
  const customerId = invoice.customer as string;
  if (!customerId) return;

  const { error } = await supabase
    .from("customers")
    .update({ subscription_status: "past_due" })
    .eq("stripe_customer_id", customerId);

  if (error) {
    console.error("invoice.payment_failed: failed to update customer:", error);
  }

  // TODO: Send "payment failed" email — 7-day grace period before suspension
}

async function handleSubscriptionDeleted(
  supabase: ReturnType<typeof createServiceClient>,
  subscription: Stripe.Subscription,
) {
  const customerId = subscription.customer as string;
  if (!customerId) return;

  const { error } = await supabase
    .from("customers")
    .update({ subscription_status: "churned" })
    .eq("stripe_customer_id", customerId);

  if (error) {
    console.error("customer.subscription.deleted: failed to update customer:", error);
  }

  // TODO: Pause Messaging Service via Twilio API
  // TODO: Send reactivation email
  // Note: Compliance site stays live for 30 days (carrier audit protection)
}
