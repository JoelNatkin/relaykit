/**
 * POST /api/early-access — early-access waitlist signup.
 *
 * Validates the email, inserts a row into early_access_subscribers, and sends
 * the Resend welcome email for genuinely new signups. Repeat submissions of an
 * email already on the list are idempotent: the unique-constraint violation is
 * caught, the first signup's data is left untouched, and no second email goes
 * out — but the response is still success, so the modal never leaks "you
 * already signed up".
 *
 * Server-only: SUPABASE_SERVICE_ROLE_KEY and RESEND_API_KEY are read here and
 * never reach the client (route handlers are never bundled to the browser).
 */

import { buildWelcomeEmail } from "@/lib/email/welcome";
import { sendWelcomeEmail } from "@/lib/email/send";
import { getSupabaseServerClient, isUniqueViolation } from "@/lib/supabase-server";

// Node runtime: the Supabase and Resend SDKs expect Node, not Edge.
export const runtime = "nodejs";

// Lightweight check — deliberately not RFC-exhaustive (V1, no rate limiting).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }
  if (typeof body !== "object" || body === null) {
    return Response.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }
  const raw = body as Record<string, unknown>;

  const email =
    typeof raw.email === "string" ? raw.email.trim().toLowerCase() : "";
  if (!EMAIL_RE.test(email)) {
    return Response.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  // categories accepted as-is from the configurator — no server-side enum.
  const categories = Array.isArray(raw.categories)
    ? raw.categories.filter((c): c is string => typeof c === "string")
    : [];
  const tone = typeof raw.tone === "string" ? raw.tone : null;
  const businessName =
    typeof raw.businessName === "string" && raw.businessName.trim() !== ""
      ? raw.businessName.trim()
      : null;
  const configuratorTouched = raw.configuratorTouched === true;
  const ctaSource = typeof raw.ctaSource === "string" ? raw.ctaSource : null;

  let supabase: ReturnType<typeof getSupabaseServerClient>;
  try {
    supabase = getSupabaseServerClient();
  } catch (err) {
    console.error("[early-access] Supabase client unavailable:", err);
    return Response.json({ ok: false, error: "server_error" }, { status: 500 });
  }

  // Insert-first, catch-unique-violation: atomic, no select-then-insert race.
  const insert = await supabase
    .from("early_access_subscribers")
    .insert({
      email,
      categories,
      tone,
      business_name: businessName,
      configurator_touched: configuratorTouched,
      cta_source: ctaSource,
    })
    .select("unsubscribe_token")
    .single();

  if (insert.error) {
    if (isUniqueViolation(insert.error)) {
      // Already on the list — preserve the first signup's data, no email.
      return Response.json({ ok: true });
    }
    console.error("[early-access] insert failed:", insert.error);
    return Response.json({ ok: false, error: "server_error" }, { status: 500 });
  }

  const token = (insert.data as { unsubscribe_token?: string } | null)
    ?.unsubscribe_token;
  if (typeof token !== "string") {
    console.error("[early-access] insert returned no unsubscribe_token");
    return Response.json({ ok: false, error: "server_error" }, { status: 500 });
  }

  // New subscriber: send the welcome email. A send failure must NOT fail the
  // request — the row is written, so the user is on the list. Log and move on.
  const origin = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://relaykit.ai").replace(
    /\/$/,
    "",
  );
  const unsubscribeUrl = `${origin}/api/unsubscribe?token=${token}`;
  const welcome = buildWelcomeEmail({ categories, unsubscribeUrl });
  const sent = await sendWelcomeEmail(email, welcome);
  if (!sent.ok) {
    console.error("[early-access] welcome email not delivered for", email);
  }

  return Response.json({ ok: true, emailDelivered: sent.ok });
}
