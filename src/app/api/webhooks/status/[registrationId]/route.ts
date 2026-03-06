// ---------------------------------------------------------------------------
// POST /api/webhooks/status/{registrationId} — Twilio status callback
// ---------------------------------------------------------------------------
// Receives delivery status updates from Twilio, updates the messages table,
// and handles retroactive opt-out on error 21610.

import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { addOptOut } from "@/lib/proxy/opt-out";
import { forwardWebhookEvent } from "@/lib/proxy/webhook-forwarder";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ registrationId: string }> },
) {
  const { registrationId } = await params;

  // Parse Twilio form-encoded status callback
  const formData = await request.formData();
  const messageSid = formData.get("MessageSid") as string;
  const messageStatus = formData.get("MessageStatus") as string;
  const errorCode = formData.get("ErrorCode") as string | null;
  const to = formData.get("To") as string | null;

  if (!messageSid || !messageStatus) {
    return NextResponse.json({ received: true });
  }

  const supabase = createServiceClient();

  // Update message status in the messages table
  const { data: message } = await supabase
    .from("messages")
    .update({ status: messageStatus })
    .eq("twilio_sid", messageSid)
    .select("customer_id, user_id")
    .maybeSingle();

  // Defense-in-depth: retroactive opt-out on Twilio error 21610
  if (errorCode === "21610" && to && message?.user_id) {
    addOptOut(
      message.user_id,
      to,
      "twilio_error",
      message.customer_id,
    ).catch(() => {});
  }

  // Forward status event to customer webhook
  if (message?.user_id) {
    forwardWebhookEvent(
      message.user_id,
      message.customer_id,
      "message.status",
      {
        twilio_sid: messageSid,
        status: messageStatus,
        error_code: errorCode,
      },
    );
  }

  return NextResponse.json({ received: true });
}
