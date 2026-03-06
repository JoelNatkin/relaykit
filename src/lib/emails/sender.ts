import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM =
  process.env.EMAIL_FROM_ADDRESS ?? "RelayKit <notifications@msgverified.com>";

/**
 * Sends a plain-text email via Resend.
 *
 * Failures are logged but never thrown — email errors must not crash the
 * calling pipeline (registration state transitions, webhook handlers).
 */
export async function sendEmail({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}): Promise<void> {
  try {
    await resend.emails.send({ from: FROM, to, subject, text: body });
  } catch (err) {
    console.error(
      "[email/sender] Failed to send to",
      to,
      "—",
      err instanceof Error ? err.message : String(err)
    );
  }
}
