import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
import type { UseCaseId } from "@/lib/intake/use-case-data";

const VALID_USE_CASES: UseCaseId[] = [
  "appointments",
  "orders",
  "verification",
  "support",
  "marketing",
  "internal",
  "community",
  "waitlist",
  "exploring",
];

const useCaseSchema = z.object({
  use_case: z.enum(VALID_USE_CASES as [string, ...string[]]),
});

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = useCaseSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid use case", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { use_case } = parsed.data;

  // Store use case in user metadata (pre-registration sandbox state).
  // Post-payment, the customer record carries the use case.
  const { error } = await supabase.auth.updateUser({
    data: { use_case },
  });

  if (error) {
    return NextResponse.json(
      { error: "Failed to save use case" },
      { status: 500 },
    );
  }

  return NextResponse.json({ use_case });
}
