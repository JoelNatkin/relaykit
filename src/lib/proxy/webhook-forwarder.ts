// ---------------------------------------------------------------------------
// Webhook forwarder — delivers events to customer webhook endpoints
// ---------------------------------------------------------------------------
// Phase 1: single delivery attempt. Phase 2 adds retry with exponential
// backoff and dead letter queue.

import { createHmac, randomBytes } from "crypto";
import { createServiceClient } from "@/lib/supabase";

/**
 * Forward a webhook event to all matching endpoints for a user/customer.
 * Signs the payload with HMAC-SHA256 using the endpoint's secret.
 * Fire-and-forget — does not throw on failure.
 */
export async function forwardWebhookEvent(
  userId: string,
  customerId: string | null,
  eventType: string,
  data: Record<string, unknown>,
): Promise<void> {
  const supabase = createServiceClient();

  // Find active endpoints that subscribe to this event type
  let query = supabase
    .from("webhook_endpoints")
    .select("id, url, secret, events")
    .eq("is_active", true);

  if (customerId) {
    query = query.eq("customer_id", customerId);
  } else {
    query = query.eq("user_id", userId);
  }

  const { data: endpoints } = await query;
  if (!endpoints || endpoints.length === 0) return;

  const eventId = `evt_${randomBytes(12).toString("base64url")}`;
  const payload = {
    id: eventId,
    object: "event",
    type: eventType,
    data,
    livemode: !!customerId,
    created_at: new Date().toISOString(),
  };

  const bodyString = JSON.stringify(payload);

  for (const endpoint of endpoints) {
    // Check if this endpoint subscribes to this event type
    if (!endpoint.events.includes(eventType)) continue;

    // Sign with HMAC-SHA256
    const signature = createHmac("sha256", endpoint.secret)
      .update(bodyString)
      .digest("hex");

    // Deliver (fire-and-forget, Phase 1: no retry)
    fetch(endpoint.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RelayKit-Signature": `sha256=${signature}`,
        "X-RelayKit-Event": eventType,
      },
      body: bodyString,
    }).catch((err) => {
      console.error(
        `[WebhookForwarder] Delivery failed to ${endpoint.url}:`,
        err,
      );
    });
  }
}
