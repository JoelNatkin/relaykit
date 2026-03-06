import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createServiceClient } from "@/lib/supabase";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const serviceClient = createServiceClient();

  // Look up customer record for this user
  const { data: customer } = await serviceClient
    .from("customers")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!customer) {
    return NextResponse.json({ alerts: [], stats: null });
  }

  const thirtyDaysAgo = new Date(
    Date.now() - 30 * 24 * 60 * 60 * 1000,
  ).toISOString();

  // Fetch alerts: last 30 days, unacknowledged first, then newest first
  const { data: alerts, error: alertsError } = await serviceClient
    .from("compliance_alerts")
    .select("id, alert_type, rule_id, title, body, acknowledged, created_at")
    .eq("customer_id", customer.id)
    .gte("created_at", thirtyDaysAgo)
    .order("acknowledged", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(50);

  if (alertsError) {
    return NextResponse.json(
      { error: "Failed to fetch alerts" },
      { status: 500 },
    );
  }

  // Fetch scan stats using count queries (avoids fetching all rows)
  const { count: totalCount } = await serviceClient
    .from("message_scans")
    .select("id", { count: "exact", head: true })
    .eq("customer_id", customer.id)
    .gte("scanned_at", thirtyDaysAgo);

  const { count: warningCount } = await serviceClient
    .from("message_scans")
    .select("id", { count: "exact", head: true })
    .eq("customer_id", customer.id)
    .eq("overall_status", "warning")
    .gte("scanned_at", thirtyDaysAgo);

  const total = totalCount ?? 0;
  const warning = warningCount ?? 0;

  return NextResponse.json({
    alerts: alerts ?? [],
    stats: {
      total,
      clean: total - warning,
      warning,
    },
  });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { alert_id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  if (!body.alert_id) {
    return NextResponse.json(
      { error: "alert_id is required" },
      { status: 400 },
    );
  }

  const serviceClient = createServiceClient();

  const { error } = await serviceClient
    .from("compliance_alerts")
    .update({
      acknowledged: true,
      acknowledged_at: new Date().toISOString(),
    })
    .eq("id", body.alert_id);

  if (error) {
    return NextResponse.json(
      { error: "Failed to acknowledge alert" },
      { status: 500 },
    );
  }

  return NextResponse.json({ acknowledged: true });
}
