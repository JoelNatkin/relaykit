"use server";

import { cookies } from "next/headers";
import { getSupabaseServerClient, isUniqueViolation } from "@/lib/supabase-server";

export type VerifyFormState = { status: "idle" | "ok" };

const PHONE_COOKIE = "relaykit_phone_signup_id";
const PHONE_COOKIE_MAX_AGE = 60 * 60 * 24; // 24h

export async function submitPhoneSignup(
  _prev: VerifyFormState,
  formData: FormData,
): Promise<VerifyFormState> {
  const phone = String(formData.get("phone") ?? "").trim();
  if (!phone) {
    return { status: "ok" };
  }

  let id: string | null = null;

  try {
    const sb = getSupabaseServerClient();
    const insert = await sb
      .from("phone_signups")
      .insert({ phone })
      .select("id")
      .single();

    if (insert.error) {
      if (isUniqueViolation(insert.error)) {
        const lookup = await sb
          .from("phone_signups")
          .select("id")
          .eq("phone", phone)
          .single();
        id = lookup.data?.id ?? null;
      } else {
        console.error("phone_signups insert error:", insert.error);
      }
    } else {
      id = insert.data.id;
    }
  } catch (err) {
    console.error("phone_signups unexpected error:", err);
  }

  if (id) {
    const cookieStore = await cookies();
    cookieStore.set(PHONE_COOKIE, id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: PHONE_COOKIE_MAX_AGE,
      path: "/",
    });
  }

  return { status: "ok" };
}
