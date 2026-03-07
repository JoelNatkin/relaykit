// ---------------------------------------------------------------------------
// POST /api/webhooks/inbound/{registrationId} — Twilio inbound webhook
// ---------------------------------------------------------------------------
// Receives inbound SMS from Twilio, processes STOP/START keywords,
// logs the message, and forwards to the customer's webhook endpoint.

import { randomBytes, createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { addOptOut, removeOptOut } from "@/lib/proxy/opt-out";
import { logMessage } from "@/lib/proxy/message-logger";
import { forwardWebhookEvent } from "@/lib/proxy/webhook-forwarder";

const STOP_KEYWORDS = ["stop", "stopall", "unsubscribe", "cancel", "end", "quit"];
const START_KEYWORDS = ["start", "yes", "unstop"];
const HELP_KEYWORDS = ["help", "info"];

const TWIML_EMPTY = "<Response></Response>";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ registrationId: string }> },
) {
  const { registrationId } = await params;

  // Parse Twilio form-encoded body
  const formData = await request.formData();
  const from = formData.get("From") as string;
  const to = formData.get("To") as string;
  const body = (formData.get("Body") as string) ?? "";
  const messageSid = formData.get("MessageSid") as string;

  if (!from || !to) {
    return new NextResponse(TWIML_EMPTY, {
      status: 200,
      headers: { "Content-Type": "text/xml" },
    });
  }

  const supabase = createServiceClient();
  const externalId = `msg_${randomBytes(12).toString("base64url")}`;

  // Resolve context: sandbox vs live
  let userId: string | null = null;
  let customerId: string | null = null;

  if (registrationId === "sandbox") {
    // Sandbox inbound: match From against verified_phone in user metadata
    const { data: userData } = await supabase.auth.admin.listUsers();
    const matchingUser = userData?.users?.find(
      (u) => u.user_metadata?.verified_phone === from,
    );

    if (matchingUser) {
      userId = matchingUser.id;
    } else {
      // Unknown sender on sandbox number — ignore
      return new NextResponse(TWIML_EMPTY, {
        status: 200,
        headers: { "Content-Type": "text/xml" },
      });
    }
  } else {
    // Live: look up registration to get customer context
    const { data: reg } = await supabase
      .from("registrations")
      .select("customer_id")
      .eq("id", registrationId)
      .single();

    if (!reg) {
      console.error(`[Webhook/Inbound] Registration not found: ${registrationId}`);
      return new NextResponse(TWIML_EMPTY, {
        status: 200,
        headers: { "Content-Type": "text/xml" },
      });
    }

    customerId = reg.customer_id;

    // Get user_id from customer email
    const { data: customer } = await supabase
      .from("customers")
      .select("email")
      .eq("id", customerId)
      .single();

    if (customer) {
      const { data: userData } = await supabase.auth.admin.listUsers();
      const user = userData?.users?.find((u) => u.email === customer.email);
      userId = user?.id ?? null;
    }
  }

  if (!userId) {
    return new NextResponse(TWIML_EMPTY, {
      status: 200,
      headers: { "Content-Type": "text/xml" },
    });
  }

  const environment = registrationId === "sandbox" ? "sandbox" : "live";

  // Process keywords
  const normalizedBody = body.trim().toLowerCase();

  if (STOP_KEYWORDS.includes(normalizedBody)) {
    try {
      await addOptOut(userId, from, "sms_keyword", customerId);
      forwardWebhookEvent(userId, customerId, "opt_out.created", {
        phone_number: from,
        source: "sms_keyword",
      });
    } catch (err) {
      // CRITICAL: Opt-out was NOT recorded but we must still return 200 to Twilio.
      // This recipient will continue receiving messages until the opt-out is resolved.
      // The error is already logged by addOptOut — log the context here.
      console.error(
        `[Webhook/Inbound] CRITICAL: STOP keyword received but opt-out failed to persist. ` +
          `userId=${userId}, from=${from}, registrationId=${registrationId}, ` +
          `error=${err instanceof Error ? err.message : String(err)}. ` +
          `MANUAL RESOLUTION REQUIRED — this recipient may receive messages in violation of TCPA.`,
      );
    }
  } else if (START_KEYWORDS.includes(normalizedBody)) {
    try {
      await removeOptOut(userId, from);
      forwardWebhookEvent(userId, customerId, "opt_out.removed", {
        phone_number: from,
      });
    } catch (err) {
      console.error(
        `[Webhook/Inbound] ERROR: START keyword received but opt-in removal failed. ` +
          `userId=${userId}, from=${from}, registrationId=${registrationId}, ` +
          `error=${err instanceof Error ? err.message : String(err)}. ` +
          `Recipient will remain blocked (fail-closed — safe but inconvenient).`,
      );
    }
  }

  // Log inbound message
  logMessage({
    customerId,
    userId,
    externalId,
    twilioSid: messageSid,
    direction: "inbound",
    to,
    from,
    body,
    status: "received",
    complianceResult: null,
    environment,
  });

  // Forward to customer webhook (all inbound, including keywords)
  forwardWebhookEvent(userId, customerId, "message.received", {
    id: externalId,
    from,
    to,
    body,
    received_at: new Date().toISOString(),
  });

  return new NextResponse(TWIML_EMPTY, {
    status: 200,
    headers: { "Content-Type": "text/xml" },
  });
}
