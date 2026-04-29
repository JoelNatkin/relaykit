"use server";

import { cookies } from "next/headers";
import { getSupabaseServerClient, isUniqueViolation } from "@/lib/supabase-server";

export type GetStartedFormState = { status: "idle" | "ok" };

const PHONE_COOKIE = "relaykit_phone_signup_id";

export async function submitBetaSignup(
  _prev: GetStartedFormState,
  formData: FormData,
): Promise<GetStartedFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();

  if (!email) {
    return { status: "ok" };
  }

  try {
    const sb = getSupabaseServerClient();

    let phone: string | null = null;
    const cookieStore = await cookies();
    const phoneSignupId = cookieStore.get(PHONE_COOKIE)?.value;
    if (phoneSignupId) {
      const lookup = await sb
        .from("phone_signups")
        .select("phone")
        .eq("id", phoneSignupId)
        .single();
      if (lookup.data?.phone) {
        phone = lookup.data.phone;
      }
    }

    const insert = await sb.from("beta_signups").insert({
      email,
      name: name || null,
      phone,
    });

    if (insert.error && !isUniqueViolation(insert.error)) {
      console.error("beta_signups insert error:", insert.error);
    }
  } catch (err) {
    console.error("beta_signups unexpected error:", err);
  }

  return { status: "ok" };
}
