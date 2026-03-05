# CC_HANDOFF.md — PRD_05 Deliverable Generator Complete

## Status

**PRD_05 Deliverable Generator: COMPLETE (all 7 tasks).** The three-document lifecycle is fully built: SMS_BUILD_SPEC.md (sandbox), SMS_GUIDELINES.md (sandbox + production editions), MESSAGING_SETUP.md (post-registration), and the `/api/deliverable` route that serves them.

**Previous build (PRD_06 Dashboard): COMPLETE (all 13 tasks).**

## This Session's Commits (oldest → newest)

| Hash | Task | Description |
|------|------|-------------|
| `8be5d90` | 1 | Canon message renderer + use-case compliance tips |
| `2a57354` | 2 | Extract build spec template string, add use-case tip |
| `59d4885` | 3 | Sandbox guidelines template + unified guidelines generator |
| `cf5b9f7` | 4 | Production SMS_GUIDELINES.md template (14 sections) |
| `4867ea8` | 5 | MESSAGING_SETUP.md template + generator (PRD_05 Section 3.1 canonical) |
| `9df7628` | 6 | GET /api/deliverable route for production documents |
| `823fce3` | 7 | Deliverable module barrel exports + build passes |
| `393cd80` | — | D-50 decision: credential placeholders in MESSAGING_SETUP.md |

**All pushed to origin/main.**

## Final File Structure (PRD_05 Section 9)

```
src/lib/deliverable/
  build-spec-template.ts          # SMS_BUILD_SPEC.md template string
  build-spec-generator.ts         # generateBuildSpec() — sandbox
  guidelines-template-sandbox.ts  # Sandbox SMS_GUIDELINES.md template
  guidelines-template-prod.ts     # Production SMS_GUIDELINES.md template
  guidelines-generator.ts         # generateGuidelines(input, edition) — both editions
  canon-messages.ts               # CanonMessage type + renderCanonMessagesSection()
  use-case-tips.ts                # USE_CASE_TIPS per use case
  template-relaykit.ts            # MESSAGING_SETUP.md template (canonical, D-07)
  generator.ts                    # generateMessagingSetup() — post-registration
  index.ts                        # Barrel exports
```

## 3 Remaining Missing API Routes (from prior session)

The `/api/deliverable` route is now built. Three routes remain — they need PRD_09 (proxy/usage) infrastructure:

1. **`/api/live-key`** — Read from `api_keys` table (environment = 'live'). Called by `live-api-key-card.tsx`.
2. **`/api/usage`** — Read from `message_usage` table for current billing period. Called by `live-usage-card.tsx`.
3. **`/api/registration-details`** — Join `customers` + `registrations` for business info, compliance site URL, phone, trust score. Called by `registration-details-card.tsx`.

## Decisions This Session

- **D-50** — MESSAGING_SETUP.md uses credential placeholders (`"Your live API key (copy from dashboard)"`) because production keys are SHA-256 hashed and shown once at approval time. Consistent with D-45 sandbox/production key distinction.

## Gotchas for Next Session

1. **sendSMS() signature is load-bearing across two templates** — `build-spec-template.ts` lines 34-39 and `template-relaykit.ts` section 1 must stay identical (PRD_05 Trap #6). If you change one, change both.

2. **`sandbox-guidelines.ts` was deleted** — replaced by `guidelines-template-sandbox.ts` + `guidelines-generator.ts`. The `/api/build-spec` route was updated to use `generateGuidelines(input, "sandbox")` instead of `generateSandboxGuidelines()`. Property names changed to snake_case (`use_case`, `business_name`, `business_description`).

3. **Production guidelines template has `{rate_limit_tier}` in the "What RelayKit handles automatically" section** — this placeholder gets replaced by the guidelines generator. If the registrations table doesn't have a `rate_limit_tier` column yet, it falls back to empty string.

4. **`/api/deliverable` requires `registration.status === "complete"`** — returns 403 otherwise. The `registrations` table needs columns: `canon_messages` (JSONB), `phone_number`, `compliance_site_url`, `rate_limit_tier`, `approved_at`, `customer_id`, `status`. Verify these exist before testing end-to-end.

5. **Credential placeholders in downloaded MESSAGING_SETUP.md** — D-50 decision. The file says "Your live API key (copy from dashboard)" — not the actual key. Developer copies from the dashboard approval moment.

6. **Vertical modules inject into both sandbox and production guidelines** — via `detectVerticals()` + `assembleGuidelines()` from `src/lib/templates/verticals/`. Triggered when `business_description` is provided.

7. **Untracked file:** `docs/plans/2026-03-05-deliverable-generator.md` — the implementation plan. Not committed (plans are working documents).

## Carried Forward from Prior Session

These gotchas from the PRD_06 build are still outstanding:

- **`sandboxMessageCount` hardcoded to 0** in `layout.tsx`. Needs PRD_09.
- **Post-registration `phoneVerified` hardcoded to `false`** — only pre-registration branch reads metadata.
- **Compliance site link is `href="#"` placeholder** in `compliance/page.tsx`.
- **Compliance `hasAlerts` always false** — no drift detection until PRD_08.
- **Email templates not wired to sending** — `src/lib/emails/templates.ts` returns `{ subject, body }`. Need provider.
- **D-44 pattern is load-bearing** — pre-registration user metadata used by: use-case selector, message plan builder, build spec generator, sandbox API key, phone verification.
- **`TWILIO_VERIFY_SID` env var required** for phone verification.
- **Button uses `onClick` not `onPress`** — Untitled UI extends HTML button.
- **D-17 overrides PRD_06 Section 10.1** — code uses "2–3 weeks" per D-17.
- **D-49 industry gating not built yet** — needs PRD_01 Screen 2 before beta.
