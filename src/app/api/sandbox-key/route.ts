import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * Sandbox API key management.
 *
 * Pre-registration: key is stored in full in user metadata (sandbox keys
 * are low-security — limited to 100 msgs/day to verified phone only).
 * Post-registration: key is in the api_keys table (hashed, shown once).
 * This route handles the pre-registration path only.
 */

function generateSandboxKey(): string {
  const random = randomBytes(24).toString("base64url");
  return `rk_sandbox_${random}`;
}

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = user.email!;

  // Check for customer record first (post-registration path)
  const { data: customer } = await supabase
    .from("customers")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (customer) {
    // Post-registration: return prefix from api_keys table
    const { data: apiKey } = await supabase
      .from("api_keys")
      .select("key_prefix, is_active")
      .eq("customer_id", customer.id)
      .eq("environment", "sandbox")
      .eq("is_active", true)
      .maybeSingle();

    if (apiKey) {
      return NextResponse.json({ keyPrefix: apiKey.key_prefix, hasKey: true });
    }
    return NextResponse.json({ hasKey: false });
  }

  // Pre-registration: key stored in user metadata
  const existingKey = user.user_metadata?.sandbox_api_key;
  if (existingKey) {
    return NextResponse.json({ key: existingKey, hasKey: true });
  }

  return NextResponse.json({ hasKey: false });
}

export async function POST() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Pre-registration only: generate and store in metadata
  const newKey = generateSandboxKey();

  const { error } = await supabase.auth.updateUser({
    data: {
      ...user.user_metadata,
      sandbox_api_key: newKey,
    },
  });

  if (error) {
    return NextResponse.json(
      { error: "Failed to generate key" },
      { status: 500 },
    );
  }

  return NextResponse.json({ key: newKey, hasKey: true });
}
