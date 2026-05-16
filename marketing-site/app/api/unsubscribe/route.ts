/**
 * GET /api/unsubscribe?token=<uuid> — early-access unsubscribe.
 *
 * Flips unsubscribed_at on the matching subscriber. Returns the SAME HTML
 * confirmation page whether the token matched, didn't match, was malformed,
 * or was absent — so the page is never a validity oracle for guessed tokens.
 */

import { getSupabaseServerClient } from "@/lib/supabase-server";

export const runtime = "nodejs";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const CONFIRMATION_HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>Unsubscribed — RelayKit</title>
</head>
<body style="margin:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1a1a1a;">
<div style="max-width:480px;margin:0 auto;padding:96px 24px;text-align:center;">
<h1 style="margin:0 0 12px;font-size:22px;font-weight:700;">You're unsubscribed</h1>
<p style="margin:0;font-size:15px;line-height:1.6;color:#5a5a5a;">You won't get any more early-access emails from RelayKit. Changed your mind? You can sign up again anytime at <a href="https://relaykit.ai" style="color:#5a5a5a;">relaykit.ai</a>.</p>
</div>
</body>
</html>`;

export async function GET(req: Request): Promise<Response> {
  const token = new URL(req.url).searchParams.get("token");

  if (token && UUID_RE.test(token)) {
    try {
      const supabase = getSupabaseServerClient();
      // .is(...null) makes a repeat click a no-op — first unsubscribe wins.
      const { error } = await supabase
        .from("early_access_subscribers")
        .update({ unsubscribed_at: new Date().toISOString() })
        .eq("unsubscribe_token", token)
        .is("unsubscribed_at", null);
      if (error) {
        console.error("[unsubscribe] update failed:", error);
      }
    } catch (err) {
      console.error("[unsubscribe] error:", err);
    }
  }

  // Same page for every case — no token-validity leak.
  return new Response(CONFIRMATION_HTML, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
