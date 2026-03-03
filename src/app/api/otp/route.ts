import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { submitOtp } from "@/lib/twilio/vetting";
import { updateStatus } from "@/lib/orchestrator/state-machine";

export async function POST(request: NextRequest) {
  let body: { registrationId?: string; otpCode?: string; email?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const { registrationId, otpCode, email } = body;

  if (!registrationId || !otpCode || !email) {
    return NextResponse.json(
      { error: "Missing required fields: registrationId, otpCode, and email" },
      { status: 400 },
    );
  }

  try {
    const supabase = createServiceClient();

    // Fetch registration with customer info for ownership verification
    const { data: reg, error: regError } = await supabase
      .from("registrations")
      .select("id, status, twilio_brand_sid, customer_id")
      .eq("id", registrationId)
      .single();

    if (regError || !reg) {
      return NextResponse.json(
        { error: "Registration not found" },
        { status: 404 },
      );
    }

    // Verify ownership: caller's email must match the customer's email
    const { data: customer, error: custError } = await supabase
      .from("customers")
      .select("email")
      .eq("id", reg.customer_id)
      .single();

    if (custError || !customer || customer.email !== email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    if (reg.status !== "awaiting_otp") {
      return NextResponse.json(
        { error: `Registration is not awaiting OTP (current status: ${reg.status})` },
        { status: 409 },
      );
    }

    if (!reg.twilio_brand_sid) {
      return NextResponse.json(
        { error: "Registration is missing twilio_brand_sid" },
        { status: 500 },
      );
    }

    // Submit OTP to Twilio
    await submitOtp(reg.twilio_brand_sid, otpCode, registrationId);

    // Advance state machine
    await updateStatus(registrationId, "awaiting_otp", "brand_pending");

    return NextResponse.json({ success: true, status: "brand_pending" });
  } catch (err) {
    console.error("[OTP] Submission failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    );
  }
}
