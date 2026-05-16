/**
 * Thin Resend wrapper for the early-access welcome email.
 *
 * Deliberately never throws: a send failure must not fail the signup request
 * (the subscriber row is already written by the time this runs). Callers get
 * `{ ok: false }` and decide — the route logs it and still returns success.
 *
 * The Resend client is constructed lazily so a missing RESEND_API_KEY is a
 * call-time soft failure, not a module-load crash.
 */

import { Resend } from "resend";
import type { WelcomeEmail } from "./welcome";

/** Sender address. relaykit.ai must be a verified domain in Resend. */
const FROM = "joel@relaykit.ai";

export async function sendWelcomeEmail(
  to: string,
  email: WelcomeEmail,
): Promise<{ ok: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error(
      "[early-access] RESEND_API_KEY not set — welcome email skipped",
    );
    return { ok: false };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM,
      to,
      subject: email.subject,
      text: email.text,
      html: email.html,
    });
    if (error) {
      console.error("[early-access] Resend send failed:", error);
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    console.error("[early-access] Resend threw:", err);
    return { ok: false };
  }
}
