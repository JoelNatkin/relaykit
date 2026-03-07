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

function getTwilioCredentials() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const verifySid = process.env.TWILIO_VERIFY_SID;

  if (!accountSid || !authToken || !verifySid) {
    return null;
  }

  return {
    accountSid,
    authToken,
    verifySid,
    authHeader: Buffer.from(`${accountSid}:${authToken}`).toString("base64"),
  };
}

// POST — send verification code
export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const creds = getTwilioCredentials();
  if (!creds) {
    return NextResponse.json(
      { error: "Phone verification is not configured" },
      { status: 503 },
    );
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
  const twilioUrl = `https://verify.twilio.com/v2/Services/${creds.verifySid}/Verifications`;

  const res = await fetch(twilioUrl, {
    method: "POST",
    headers: {
      Authorization: `Basic ${creds.authHeader}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ To: phone, Channel: "sms" }),
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to send verification code" },
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

  const creds = getTwilioCredentials();
  if (!creds) {
    return NextResponse.json(
      { error: "Phone verification is not configured" },
      { status: 503 },
    );
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
  const twilioUrl = `https://verify.twilio.com/v2/Services/${creds.verifySid}/VerificationCheck`;

  const res = await fetch(twilioUrl, {
    method: "POST",
    headers: {
      Authorization: `Basic ${creds.authHeader}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ To: phone, Code: code }),
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Verification failed" },
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
