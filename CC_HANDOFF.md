# CC_HANDOFF.md — PRD_06 Complete

## Status

**PRD_06 Customer Dashboard: COMPLETE (all 13 tasks).** Next build step is **Step 3: PRD_05 Deliverables** (SMS_BUILD_SPEC.md, SMS_GUIDELINES.md, MESSAGING_SETUP.md generation).

## All PRD_06 Commits (oldest → newest)

| Hash | Task | Description |
|------|------|-------------|
| `677ccf4` | 1b/2 | Supabase SSR auth + MessageTemplate library + migration |
| `c1c2581` | 3 | Dashboard shell, tab nav, lifecycle stage engine |
| `c285a3a` | 4 | Use case selector with persistence and progressive disclosure |
| `1b71e00` | 5 | Message plan builder with three-tier visual treatment |
| `b0393d2` | 6 | Build spec generator + dual-path Quick Start |
| `07b027e` | 7 | Sandbox infrastructure cards — API key, phone verification, usage |
| `e8fd5a7` | — | Docs: session handoff + D-45, D-46 decisions |
| `1b4b822` | 8 | Go Live CTA + dashboard-to-intake data contract |
| `8fbaae3` | 9 | Registration status stepper + action cards |
| `37a48d9` | 10 | Registered dashboard keys, usage, details, resources |
| `61bbb3c` | — | Docs: session handoff (Tasks 8–10) |
| `bc5a612` | 11 | Read-only MessageLibraryEntry component |
| `319ded3` | 11 | MessageLibrary component with three-tier display |
| `466af62` | 11 | Messages page + canonMessageIds in dashboard context |
| `24a9d83` | 11 | Fixes: isCanon on expansion entries, compliance tab minStage |
| `8948bcb` | 12 | Compliance tab — sandbox card, status card, lifecycle page |
| `31ac78d` | 12 | Docs: PROGRESS.MD update |
| `e4545b7` | 13 | Email templates 0–5 (sandbox through rejection) |
| `80a226f` | — | Docs: session handoff |

**~22 commits ahead of origin. Nothing pushed.**

## 4 Missing API Routes (from prior session, still outstanding)

These routes are called by Task 10 dashboard cards but do not exist yet. They need PRD_09 (proxy/usage) and PRD_05 (deliverables) infrastructure:

1. **`/api/live-key`** — Read from `api_keys` table (environment = 'live'). Called by `live-api-key-card.tsx`.
2. **`/api/usage`** — Read from `message_usage` table for current billing period. Called by `live-usage-card.tsx`.
3. **`/api/registration-details`** — Join `customers` + `registrations` for business info, compliance site URL, phone, trust score. Called by `registration-details-card.tsx`.
4. **`/api/deliverable`** — Serve MESSAGING_SETUP.md and SMS_GUIDELINES.md as downloadable files. Called by `approval-resources-card.tsx`.

## Decisions This Session

- **D-44** — Pre-registration use case in user metadata (not customers table)
- **D-45** — Sandbox API keys stored plaintext in user metadata
- **D-46** — Sandbox phone verification uses Twilio Verify, separate from TCR OTP
- **D-47** — Messages tab is read-only library; plan builder only on Overview
- **D-48** — Email templates are deterministic functions, no provider wired
- **D-49** — Intake wizard needs three-tier industry gating before beta

## Gotchas for Next Session

1. **`sandboxMessageCount` hardcoded to 0** — both paths in `layout.tsx`. Needs proxy (PRD_09) or usage tracking table.

2. **Post-registration `phoneVerified` hardcoded to `false`** — only pre-registration branch reads from user metadata.

3. **Compliance site link is `href="#"` placeholder** — in `compliance/page.tsx`. Needs registration details to populate URL.

4. **Compliance `hasAlerts` always false** — no drift detection until PRD_08.

5. **Email templates not wired to sending** — `src/lib/emails/templates.ts` returns `{ subject, body }`. Need provider (Resend recommended).

6. **D-44 pattern is load-bearing** — pre-registration storage in user metadata used by: use-case selector, message plan builder, build spec generator, sandbox API key, phone verification.

7. **`TWILIO_VERIFY_SID` env var required** — phone verification route expects this.

8. **Button uses `onClick` not `onPress`** — Untitled UI extends HTML button.

9. **D-17 overrides PRD_06 Section 10.1** — PRD says "1–2 weeks" but D-17 mandates "2–3 weeks." Code uses "2–3 weeks."

10. **D-49 industry gating not built yet** — needs to be added to PRD_01 Screen 2 before beta. Cannabis/firearms are hard declines.
