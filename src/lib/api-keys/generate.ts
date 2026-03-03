import { randomBytes, createHash } from "crypto";
import { createServiceClient } from "@/lib/supabase";

// ---------------------------------------------------------------------------
// generateApiKey
// ---------------------------------------------------------------------------

/**
 * Generates a new API key for a customer.
 *
 * The key is shown exactly once to the customer and cannot be retrieved
 * again. Only the SHA-256 hash is stored in the database, along with a
 * short prefix for display on the dashboard (e.g. "rk_live_A3b9...").
 *
 * Key format: `rk_{environment}_{32-char base64url random}`
 *
 * @returns The full plaintext API key (shown once, never stored)
 */
export async function generateApiKey(
  customerId: string,
  environment: "sandbox" | "live"
): Promise<string> {
  // 1. Generate the key
  const prefix = environment === "live" ? "rk_live_" : "rk_sandbox_";
  const random = randomBytes(24).toString("base64url"); // 32 chars
  const fullKey = `${prefix}${random}`;

  // 2. Hash with SHA-256 for storage
  const keyHash = createHash("sha256").update(fullKey).digest("hex");

  // 3. Store prefix for dashboard display (first 12 chars)
  const keyPrefix = fullKey.slice(0, 12);

  // 4. Insert into api_keys table
  const supabase = createServiceClient();
  const { error } = await supabase.from("api_keys").insert({
    customer_id: customerId,
    key_hash: keyHash,
    key_prefix: keyPrefix,
    environment,
    is_active: true,
  });

  if (error) {
    throw new Error(`Failed to store API key: ${error.message}`);
  }

  // 5. Return the full key (shown once, never retrievable again)
  return fullKey;
}
