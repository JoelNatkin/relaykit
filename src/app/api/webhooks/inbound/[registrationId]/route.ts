import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ registrationId: string }> },
) {
  const { registrationId } = await params;
  const body = await request.text();
  console.log(`[Webhook/Inbound] registrationId=${registrationId}`, body);
  return new NextResponse("<Response></Response>", {
    status: 200,
    headers: { "Content-Type": "text/xml" },
  });
}
