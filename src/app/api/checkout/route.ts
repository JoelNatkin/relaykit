import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getStripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase";

const checkoutSchema = z.object({
  use_case: z.string().min(1),
  expansions: z.array(z.string()).default([]),
  campaign_type: z.string().min(1),
  business_name: z.string().min(2),
  business_description: z.string().min(20),
  has_ein: z.enum(["yes", "no"]),
  ein: z.string().nullable().optional(),
  business_type: z.string().nullable().optional(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(10),
  address_line1: z.string().min(1),
  address_city: z.string().min(1),
  address_state: z.string().length(2),
  address_zip: z.string().length(5),
  website_url: z.string().nullable().optional(),
  service_type: z.string().nullable().optional(),
  product_type: z.string().nullable().optional(),
  app_name: z.string().nullable().optional(),
  community_name: z.string().nullable().optional(),
  venue_type: z.string().nullable().optional(),
  campaign_description_override: z.string().nullable().optional(),
  sample_messages_override: z.array(z.string()).nullable().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const supabase = createServiceClient();
    const stripe = getStripe();

    // Check for existing customer with this email
    const { data: existing } = await supabase
      .from("customers")
      .select("id, subscription_status")
      .eq("email", data.email)
      .maybeSingle();

    if (existing) {
      if (existing.subscription_status === "active") {
        return NextResponse.json(
          { error: "You already have an active registration. Check your email for your dashboard link or contact support." },
          { status: 409 },
        );
      }
      // Allow re-registration for cancelled/churned customers
    }

    // Store intake data in ephemeral session
    const { data: session, error: sessionError } = await supabase
      .from("intake_sessions")
      .insert({ data })
      .select("id")
      .single();

    if (sessionError || !session) {
      console.error("Failed to create intake session:", sessionError);
      return NextResponse.json(
        { error: "Failed to start checkout. Please try again." },
        { status: 500 },
      );
    }

    const setupPriceId = process.env.STRIPE_SETUP_PRICE_ID;
    const monthlyPriceId = process.env.STRIPE_MONTHLY_PRICE_ID;

    if (!setupPriceId || !monthlyPriceId) {
      console.error("Missing STRIPE_SETUP_PRICE_ID or STRIPE_MONTHLY_PRICE_ID");
      return NextResponse.json(
        { error: "Payment configuration error. Please contact support." },
        { status: 500 },
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    // Create Stripe Checkout Session in subscription mode
    // Line item 1: $199 one-time setup fee
    // Line item 2: $19/month recurring subscription
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_collection: "always",
      customer_email: data.email,
      line_items: [
        {
          price: setupPriceId,
          quantity: 1,
        },
        {
          price: monthlyPriceId,
          quantity: 1,
        },
      ],
      metadata: {
        intake_session_id: session.id,
      },
      subscription_data: {
        metadata: {
          intake_session_id: session.id,
        },
      },
      success_url: `${appUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/start/review`,
    });

    // Store Stripe session ID on the intake session for lookup
    await supabase
      .from("intake_sessions")
      .update({ stripe_session_id: checkoutSession.id })
      .eq("id", session.id);

    return NextResponse.json({ checkout_url: checkoutSession.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 },
    );
  }
}
