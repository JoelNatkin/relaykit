// ---------------------------------------------------------------------------
// Message logger — fire-and-forget insert to messages table
// ---------------------------------------------------------------------------

import { createHash } from "crypto";
import { createServiceClient } from "@/lib/supabase";

export interface LogMessageParams {
  customerId: string | null;
  userId: string;
  externalId: string;
  twilioSid: string | null;
  direction: "outbound" | "inbound";
  to: string;
  from: string;
  body: string;
  status: string;
  complianceResult: Record<string, boolean> | null;
  environment: "sandbox" | "live";
}

/**
 * Log a message to the messages table. Fire-and-forget — does not throw.
 * Body is hashed with SHA-256 before storage (never stores plaintext).
 */
export function logMessage(params: LogMessageParams): void {
  const supabase = createServiceClient();
  const bodyHash = createHash("sha256").update(params.body).digest("hex");

  supabase
    .from("messages")
    .insert({
      customer_id: params.customerId,
      user_id: params.userId,
      external_id: params.externalId,
      twilio_sid: params.twilioSid,
      direction: params.direction,
      to_number: params.to,
      from_number: params.from,
      body_hash: bodyHash,
      status: params.status,
      compliance_result: params.complianceResult,
      environment: params.environment,
    })
    .then(({ error }) => {
      if (error) console.error("[MessageLogger] Failed to log message:", error);
    });
}
