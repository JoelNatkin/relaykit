# CC_HANDOFF.md — Session Handoff
**Date:** 2026-03-06
**Branch:** main (all work committed and pushed)

---

## Commits This Session

```
52f46ef  docs: add D-56 compliance site domain decision
6d2a95d  docs: fix campaign review timing in Experience Principles to match D-17
8473df1  feat: configure compliance site domain as msgverified.com (D-56)
5d04f09  feat: add Resend email sender module
db90364  feat: wire Resend email sends at all production callsites
```

---

## What We Completed

### D-56 — Compliance site domain
- Added D-56 to `DECISIONS.md`: customer compliance sites deploy to `{slug}.msgverified.com`
- `src/lib/templates/variables.ts` — `COMPLIANCE_SITE_DOMAIN` now reads from `process.env.COMPLIANCE_SITE_DOMAIN ?? "msgverified.com"` (was hardcoded `smsverified.com`)
- `src/lib/orchestrator/processor.ts` — fixed a second hardcoded `smsverified.com` drift point to use the same env var
- `.env.example` — `COMPLIANCE_SITE_DOMAIN=msgverified.com` added

### Experience Principles timing fix
- `docs/V4_-_RELAYKIT_EXPERIENCE_PRINCIPLES.md` line 88 — changed "5–7 business days" → "2–3 weeks (10–15 business days)" to match D-17

### Resend email integration
- `npm install resend` done
- `src/lib/emails/sender.ts` created — `sendEmail({ to, subject, body })`, wraps Resend, catches and logs failures, never throws
- FROM address: `process.env.EMAIL_FROM_ADDRESS ?? "RelayKit <notifications@msgverified.com>"`
- `.env.example` — `RESEND_API_KEY=` and `EMAIL_FROM_ADDRESS=RelayKit <notifications@msgverified.com>` added

### Email callsites wired (production flows only)
All four callsites use `void sendEmail(...)` — non-blocking, inside existing try/catch blocks:

| Email | Template | File | Trigger |
|-------|----------|------|---------|
| 2 | `registrationSubmitted` | `src/app/api/webhooks/stripe/route.ts` | After customer+registration rows created, alongside `processRegistration` fire-and-forget |
| 3 | `otpRequired` | `src/lib/orchestrator/processor.ts` | Sole prop branch, after `awaiting_otp` status update |
| 4 | `campaignApproved` | `src/lib/orchestrator/processor.ts` | After `complete` status update in `generating_api_key` case |
| 5 | `registrationRejected` | `src/lib/orchestrator/poller.ts` | All three rejection branches: brand FAILED, vetting FAILED, campaign FAILED |

Poller changes for Email 5:
- Brand query: added `customer_id` to select
- Vetting query: added `customer_id` to select
- Campaign customer query: added `email, contact_name` to select (was only fetching subaccount credentials)
- Brand and vetting rejections do a small follow-up customer lookup for email + contact_name

---

## Not Done / Intentionally Skipped

- **Email 0** (`sandboxWelcome`) and **Email 1** (`buildSpecGenerated`) — sandbox paths, deliberately not wired
- **Email 6** (`complianceWarningDigest`) and **Email 7** (`messagesBlocked`) — PRD_08 Phase 2, infrastructure not built yet
- **Payment failed / subscription deleted emails** — TODO comments exist in `src/app/api/webhooks/stripe/route.ts` lines ~162 and ~182, but no email templates are defined yet. Out of scope this session.
- **Compliance site deployment** — `processor.ts` `deploying_site` case is still a stub (TODO: deploy to Cloudflare Pages). PRD_03 not yet built.

---

## Uncommitted / Untracked Files

- `docs/plans/2026-03-05-landing-page.md` — untracked, was present before this session started. Not part of this session's work.

---

## Gotchas for Next Session

1. **`RESEND_API_KEY` not yet in `.env`** — needs to be added manually before emails will send. The `.env.example` has the placeholder. Without it, Resend will silently fail (sender.ts catches the error and logs it).

2. **`COMPLIANCE_SITE_DOMAIN` not yet in `.env`** — falls back to `"msgverified.com"` as default so nothing breaks, but should be set explicitly.

3. **Email 2 compliance_site_url is computed, not read from DB** — in the Stripe webhook, the compliance site URL is computed from business_name at email-send time (before the pipeline runs). The pipeline later saves the canonical URL to `registrations.compliance_site_url` during `generating_artifacts`. Both use `generateComplianceSlug()` so they will always match, but they're derived separately.

4. **`auto_fix_status` in rejection emails is a placeholder** — the three rejection email sends in poller.ts use `"We're reviewing the details and will reach out with next steps."` as `auto_fix_status`. D-21 specifies a richer debrief format with specific auto-fix context per rejection type. Replace when rejection handling logic is built out.

5. **`rejection_explanation` passes through Twilio's raw failure reason** — `failureReason` comes directly from Twilio's API response and may be a terse technical string. D-21 says rejection emails should use plain-language explanations. Consider a lookup table mapping Twilio failure codes to user-friendly copy before beta.

---

## Active Build Context

Active PRDs per CLAUDE.md: PRD_06 (dashboard), PRD_01 (intake), PRD_03 (compliance site), PRD_05 (deliverable). Phase 2 PRDs (PRD_07 landing page, PRD_08, PRD_09, PRD_10, PRD_11) are not yet in scope.

DECISIONS.md has 56 decisions loaded. D-56 was added this session.
