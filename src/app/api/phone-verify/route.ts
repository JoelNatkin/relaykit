import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

/**
 * Phone verification for sandbox.
 *
 * POST — send verification code to phone number
 * PUT  — verify the code and mark phone as verified
 *
 * Pre-registration: stores verified phone in user metadata.
 * Uses Twilio Verify API via fetch() (D-02: no SDK).
 */

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID!;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN!;
const TWILIO_VERIFY_SID = process.env.TWILIO_VERIFY_SID!;

const sendSchema = z.object({
  phone: z
    .string()
    .regex(/^\+1\d{10}$/, "Phone must be in +1XXXXXXXXXX format"),
});

const verifySchema = z.object({
  phone: z
    .string()
    .regex(/^\+1\d{10}$/, "Phone must be in +1XXXXXXXXXX format"),
  code: z.string().length(6, "Code must be 6 digits"),
});

// POST — send verification code
export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = sendSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  const { phone } = parsed.data;

  // Send verification code via Twilio Verify API
  const twilioUrl = `https://verify.twilio.com/v2/Services/${TWILIO_VERIFY_SID}/Verifications`;
  const authHeader = Buffer.from(
    `${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`,
  ).toString("base64");

  const res = await fetch(twilioUrl, {
    method: "POST",
    headers: {
      Authorization: `Basic ${authHeader}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ To: phone, Channel: "sms" }),
  });

  if (!res.ok) {
    const err = await res.json();
    return NextResponse.json(
      { error: err.message || "Failed to send verification code" },
      { status: 422 },
    );
  }

  return NextResponse.json({ sent: true });
}

// PUT — verify code
export async function PUT(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = verifySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  const { phone, code } = parsed.data;

  // Check verification via Twilio Verify API
  const twilioUrl = `https://verify.twilio.com/v2/Services/${TWILIO_VERIFY_SID}/VerificationCheck`;
  const authHeader = Buffer.from(
    `${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`,
  ).toString("base64");

  const res = await fetch(twilioUrl, {
    method: "POST",
    headers: {
      Authorization: `Basic ${authHeader}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ To: phone, Code: code }),
  });

  if (!res.ok) {
    const err = await res.json();
    return NextResponse.json(
      { error: err.message || "Verification failed" },
      { status: 422 },
    );
  }

  const result = await res.json();

  if (result.status !== "approved") {
    return NextResponse.json(
      { error: "Invalid code. Check the code and try again." },
      { status: 422 },
    );
  }

  // Store verified phone in user metadata
  const { error } = await supabase.auth.updateUser({
    data: {
      ...user.user_metadata,
      verified_phone: phone,
      phone_verified_at: new Date().toISOString(),
    },
  });

  if (error) {
    return NextResponse.json(
      { error: "Failed to save verification" },
      { status: 500 },
    );
  }

  return NextResponse.json({ verified: true, phone });
}
