# CC_HANDOFF.md — Session 2026-03-05 (updated)

## Commits This Session

| Hash | Description |
|------|-------------|
| `37a48d9` | feat: registered dashboard keys, usage, details, resources (PRD_06 Task 10) |
| `8fbaae3` | feat: registration status stepper + action cards (PRD_06 Task 9) |
| `1b4b822` | feat: Go Live CTA + dashboard-to-intake data contract (PRD_06 Task 8) |
| `e8fd5a7` | docs: session handoff + D-45, D-46 decisions |
| `07b027e` | feat: sandbox infrastructure cards — API key, phone verification, usage (PRD_06 Task 7) |

Prior session commits (same branch, not yet pushed):
- `b0393d2` — Task 6: build spec generator + dual-path Quick Start
- `1b71e00` — Task 5: message plan builder with three-tier visual treatment
- `c285a3a` — Task 4: use case selector with persistence and progressive disclosure
- `c1c2581` — Task 3: dashboard shell, tab nav, lifecycle stage engine
- `677ccf4` — Task 1b/2: Supabase SSR auth + MessageTemplate library + migration

## What Was Completed This Session

**Task 8 — Go Live CTA + pre-population data contract:**
- `src/lib/dashboard/dashboard-to-intake.ts` — `DashboardToIntakeData` type, `buildIntakeData()`, sessionStorage save/get/clear under `relaykit_intake_data`
- `src/components/dashboard/go-live-cta.tsx` — two variants: "nudge" (Stage 4, branded) and "default" (bottom, subtle)
- Dashboard context expanded with `email`

**Task 9 — Registration status stepper + action cards:**
- `src/components/dashboard/registration-status-card.tsx` — 4-step stepper (Submitted → Brand review → Campaign review → Ready!) with exact PRD_06 Section 10.1 narrative copy. Campaign review uses "2–3 weeks" per D-17 override.
- `src/components/dashboard/registration-action-cards.tsx` — OtpActionCard (amber, 6-digit input, D-22 TCR lifetime advisory), BrandAuthCard (amber, email notice, D-25), RejectionCard (red, structured debrief per Section 10.7)
- Dashboard context expanded with `registrationStatus`, `registrationId`, `registrationPhone`
- `lifecycle.ts` — fixed terminal status from `"approved"` to `"complete"` to match state machine
- `layout.tsx` — registration query expanded to select `id, status, phone_number`

**Task 10 — Registered dashboard keys, usage, details, resources:**
- `src/components/dashboard/approval-resources-card.tsx` — exact D-33 copy ("Most developers never get here. You did."), download buttons for MESSAGING_SETUP.md and SMS_GUIDELINES.md
- `src/components/dashboard/live-api-key-card.tsx` — live + sandbox keys side by side with reveal/copy
- `src/components/dashboard/live-usage-card.tsx` — billing period usage (messages sent, blocks billed)
- `src/components/dashboard/registration-details-card.tsx` — collapsible card with business details, compliance site link, trust score
- `overview-content.tsx` — Stage 6 renders approval + live cards; sandbox UI hidden when live
- `use-case-badge.tsx` — `onChangeClick` now optional; "Change" button hidden when live

## What's Next (from 13-task build plan)

| Task | Description | Status |
|------|-------------|--------|
| 11 | Messages tab + message library | Not started |
| 12 | Compliance tab | Not started |
| 13 | Email templates (4 lifecycle emails) | Not started |

## Gotchas for Next Session

1. **`TWILIO_VERIFY_SID` env var required** — phone verification route expects this. Needs a Twilio Verify Service created in the Twilio console and SID added to `.env`.

2. **`sandboxMessageCount` is hardcoded to 0** — both pre-reg and post-reg paths in `layout.tsx` return `sandboxMessageCount: 0` with TODO comments. Needs the proxy (PRD_09) or a usage tracking table to wire up.

3. **Post-registration `phoneVerified` is hardcoded to `false`** — the post-registration branch in `layout.tsx` doesn't read phone verification state. Only the pre-registration branch reads from user metadata.

4. **`detectVerticals()` requires 2 args** — `detectVerticals(serviceType, businessDescription)` not `detectVerticals(businessDescription)`. First arg can be `null`.

5. **Button uses `onClick` not `onPress`** — Untitled UI Button extends HTML button, not React Aria press events.

6. **Heredoc commit messages break on single quotes** — use `<<'EOF'` (quoted) to prevent shell expansion, and avoid apostrophes in commit message text.

7. **D-44 pattern is load-bearing** — pre-registration storage in user metadata is used by: use-case selector, message plan builder, build spec generator, sandbox API key, phone verification. All read/write to `user.user_metadata` via `supabase.auth.updateUser()`.

8. **15 commits ahead of origin** — nothing has been pushed yet.

9. **Live API key card calls `/api/live-key`** — this route does not exist yet. It needs to be created to read from the `api_keys` table (environment = 'live'). The sandbox key route (`/api/sandbox-key`) exists.

10. **Live usage card calls `/api/usage`** — this route does not exist yet. It needs to read from the `message_usage` table for the current billing period.

11. **Registration details card calls `/api/registration-details`** — this route does not exist yet. It needs to join `customers` + `registrations` to return business info, compliance site URL, phone number, trust score.

12. **Approval resources card calls `/api/deliverable`** — this route does not exist yet. It needs to serve MESSAGING_SETUP.md and SMS_GUIDELINES.md as downloadable files from the deliverable generator.

13. **D-17 overrides PRD_06 Section 10.1** — PRD says "1–2 weeks" for campaign review but D-17 mandates "2–3 weeks." The code uses "2–3 weeks." If the PRD is updated, the code already matches D-17.
