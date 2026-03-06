// ---------------------------------------------------------------------------
// Email templates — PRD_06 Section 13
// ---------------------------------------------------------------------------
// Deterministic string interpolation (D-04). Copy is verbatim from the PRD.
// Review timing uses "2–3 weeks" per D-17.
// Approval copy uses D-33 mandatory language ("Most developers never get here. You did.").
// Rejection uses D-21 debrief format (never raw error codes).
//
// These return { subject, body } objects ready to pass to any email provider.
// No email provider is wired yet — plug into Resend/SendGrid when ready.

import type {
  EmailTemplate,
  RegistrationSubmittedVars,
  OtpRequiredVars,
  CampaignApprovedVars,
  RegistrationRejectedVars,
  ComplianceWarningDigestVars,
  MessagesBlockedVars,
} from "./types";

const DASHBOARD_URL = "https://relaykit.com/dashboard";

// ---------------------------------------------------------------------------
// Email 0: Sandbox welcome (first login / magic link)
// ---------------------------------------------------------------------------
export function sandboxWelcome(): EmailTemplate {
  return {
    subject: "You're in. Here's your sandbox key.",
    body: `Hi there,

Your RelayKit sandbox is live. Your API key is waiting on your dashboard.

Here's what to do next:
1. Pick your use case — we'll show you compliant message templates for it
2. Curate your message plan — design your SMS feature while we pre-fill your registration
3. Generate a build spec — drop it in your project and tell your AI to build it

When you're ready to go live, the registration is already set up from your message plan.
Same code, one key swap.

→ Your dashboard: ${DASHBOARD_URL}

— RelayKit`,
  };
}

// ---------------------------------------------------------------------------
// Email 1: Build spec generated (first time only)
// ---------------------------------------------------------------------------
export function buildSpecGenerated(): EmailTemplate {
  return {
    subject: "Your SMS build spec is ready — RelayKit",
    body: `Hi there,

You generated a build spec from your message plan.

Drop SMS_BUILD_SPEC.md and SMS_GUIDELINES.md in your project root,
then tell your AI coding tool: "Read SMS_BUILD_SPEC.md and build
my SMS feature."

When you're ready to send to real users, register from your dashboard.
Same code, one key swap.

→ Dashboard: ${DASHBOARD_URL}

— RelayKit`,
  };
}

// ---------------------------------------------------------------------------
// Email 2: Registration submitted (post-payment confirmation)
// ---------------------------------------------------------------------------
export function registrationSubmitted(
  vars: RegistrationSubmittedVars,
): EmailTemplate {
  return {
    subject: "Your registration is submitted — RelayKit",
    body: `Hi ${vars.first_name},

Your registration is in. Here's where things stand:

✓ Your business details are submitted to The Campaign Registry
✓ Your compliance site is live at ${vars.compliance_site_url}
✓ Your sandbox is active — keep building while you wait

What happens next: carriers will review your brand and campaign.
This typically takes 2–3 weeks. We'll email you when you're through.

Your sandbox keeps working the whole time. No waiting around.

→ Track your status: ${DASHBOARD_URL}

— RelayKit`,
  };
}

// ---------------------------------------------------------------------------
// Email 3: OTP required (sole proprietor only)
// ---------------------------------------------------------------------------
export function otpRequired(vars: OtpRequiredVars): EmailTemplate {
  return {
    subject: "Action needed: your verification code is waiting — RelayKit",
    body: `Hi ${vars.first_name},

One more step: we sent a 6-digit verification code to ${vars.formatted_phone}.

Enter it at your dashboard to confirm your identity with TCR.
The code expires in 10 minutes — if it expired, request a new one from your dashboard.

→ Enter your code: ${DASHBOARD_URL}

— RelayKit`,
  };
}

// ---------------------------------------------------------------------------
// Email 4: Approved — the moment (D-33 mandatory copy)
// ---------------------------------------------------------------------------
export function campaignApproved(vars: CampaignApprovedVars): EmailTemplate {
  return {
    subject: "You're live. Here's what you can build now.",
    body: `Hi ${vars.first_name},

Your campaign is approved.

You now have verified SMS infrastructure — a registered brand, an approved
campaign, and a compliance record on file with The Campaign Registry.
Most developers never get here. You did.

Your live API key is ready on your dashboard. Update RELAYKIT_API_KEY
in your .env file. That's it — same code, same API, your app sends
real texts.

Your production MESSAGING_SETUP.md and SMS_GUIDELINES.md are waiting
on your dashboard.

→ Go to your dashboard: ${DASHBOARD_URL}

— RelayKit`,
  };
}

// ---------------------------------------------------------------------------
// Email 5: Rejection — debrief (D-21 format)
// ---------------------------------------------------------------------------
export function registrationRejected(
  vars: RegistrationRejectedVars,
): EmailTemplate {
  return {
    subject: "Carriers flagged your registration — here's what to do",
    body: `Hi ${vars.first_name},

Carriers reviewed your registration and flagged something.
Here's exactly what happened and what we're doing about it:

${vars.rejection_explanation}

${vars.auto_fix_status}

Your sandbox stays live in the meantime.

→ See details: ${DASHBOARD_URL}

— RelayKit`,
  };
}

// ---------------------------------------------------------------------------
// Email 6: Compliance warning — daily digest (PRD_08 Section 7)
// ---------------------------------------------------------------------------
export function complianceWarningDigest(
  vars: ComplianceWarningDigestVars,
): EmailTemplate {
  return {
    subject: `SMS compliance summary — ${vars.business_name} — ${vars.date}`,
    body: `${vars.warning_count} compliance ${vars.warning_count === 1 ? "suggestion" : "suggestions"} for your messages today:

${vars.warning_list}

These are recommendations, not blocks. Following them improves your deliverability and reduces the risk of carrier filtering.

→ View details: ${DASHBOARD_URL}

— RelayKit`,
  };
}

// ---------------------------------------------------------------------------
// Email 7: Messages blocked notification (PRD_08 Section 7)
// ---------------------------------------------------------------------------
export function messagesBlocked(
  vars: MessagesBlockedVars,
): EmailTemplate {
  return {
    subject: `Messages blocked — ${vars.business_name}`,
    body: `${vars.blocked_count} ${vars.blocked_count === 1 ? "message was" : "messages were"} blocked by compliance enforcement today:

${vars.violation_summary}

These messages were prevented from reaching carriers, so no fines or penalties apply. But repeated blocks may indicate a code issue that needs attention.

→ View details: ${DASHBOARD_URL}

— RelayKit`,
  };
}
