import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ registrationId: string }> },
) {
  const { registrationId } = await params;
  const body = await request.text();
  console.log(`[Webhook/Status] registrationId=${registrationId}`, body);
  return NextResponse.json({ received: true });
}
