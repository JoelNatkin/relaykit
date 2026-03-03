import { NextRequest, NextResponse } from "next/server";
import { pollPendingRegistrations } from "@/lib/orchestrator/poller";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await pollPendingRegistrations();
    return NextResponse.json({ success: true, result });
  } catch (err) {
    console.error("[Cron] Poll failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    );
  }
}
