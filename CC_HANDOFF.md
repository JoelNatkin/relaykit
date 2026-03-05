# CC_HANDOFF.md — Session 2026-03-05

## Commits This Session

| Hash | Description |
|------|-------------|
| `07b027e` | feat: sandbox infrastructure cards — API key, phone verification, usage (PRD_06 Task 7) |
| `b0393d2` | feat: build spec generator + dual-path Quick Start (PRD_06 Task 6) |

Prior session commits (same branch, not yet pushed):
- `1b71e00` — Task 5: message plan builder with three-tier visual treatment
- `c285a3a` — Task 4: use case selector with persistence and progressive disclosure
- `c1c2581` — Task 3: dashboard shell, tab nav, lifecycle stage engine
- `677ccf4` — Task 1b/2: Supabase SSR auth + MessageTemplate library + migration

## What Was Completed

**Task 6 — Build spec generator + dual-path Quick Start:**
- `src/lib/deliverable/build-spec-generator.ts` — deterministic string interpolation (D-04)
- `src/lib/deliverable/sandbox-guidelines.ts` — use-case-specific compliance rules with vertical detection
- `src/app/api/build-spec/route.ts` — POST route, reads plan from customer record or user metadata
- `src/components/dashboard/build-spec-section.tsx` — "Ready to build?" dual-path cards + preview modal with tab switcher, download, copy

**Task 7 — Sandbox infrastructure cards:**
- `src/app/api/sandbox-key/route.ts` — GET/POST for sandbox key management (pre-reg: plaintext in user metadata per D-45)
- `src/app/api/phone-verify/route.ts` — POST sends OTP via Twilio Verify API, PUT verifies code (D-46: separate from TCR brand OTP)
- `src/components/dashboard/sandbox-api-key-card.tsx` — masked key, reveal toggle, copy, regenerate
- `src/components/dashboard/phone-verification-card.tsx` — phone input → OTP code → collapsed verified state
- `src/components/dashboard/sandbox-usage-card.tsx` — progress bar showing messages/100 daily limit
- Dashboard context expanded with `sandboxMessageCount`, `phoneVerified`, `verifiedPhone`
- Layout reads `verified_phone` and `build_spec_generated_at` from user metadata for pre-reg users

## Files Modified But Not Yet Committed

- `DECISIONS.md` — added D-45 (sandbox key plaintext storage) and D-46 (sandbox phone verify vs TCR OTP)

## What's Next (from 13-task build plan)

| Task | Description | Status |
|------|-------------|--------|
| 8 | Go Live CTA + pre-population data contract | Not started |
| 9 | Registered dashboard — status card + action cards | Not started |
| 10 | Registered dashboard — keys, usage, details, resources | Not started |
| 11 | Messages tab + message library | Not started |
| 12 | Compliance tab | Not started |
| 13 | Email templates (4 lifecycle emails) | Not started |

## Gotchas for Next Session

1. **`TWILIO_VERIFY_SID` env var required** — phone verification route expects this. Needs a Twilio Verify Service created in the Twilio console and SID added to `.env`.

2. **`sandboxMessageCount` is hardcoded to 0** — both pre-reg and post-reg paths in `layout.tsx` return `sandboxMessageCount: 0` with TODO comments. This needs the proxy (PRD_09) or a usage tracking table to wire up.

3. **Post-registration `phoneVerified` is hardcoded to `false`** — the post-registration branch in `layout.tsx` doesn't read phone verification state from anywhere yet. Only the pre-registration branch reads from user metadata.

4. **`detectVerticals()` requires 2 args** — `detectVerticals(serviceType, businessDescription)` not `detectVerticals(businessDescription)`. First arg can be `null`.

5. **Button uses `onClick` not `onPress`** — Untitled UI Button extends HTML button, not React Aria's press events.

6. **Heredoc commit messages break on single quotes** — use `<<'EOF'` (quoted) to prevent shell expansion, and avoid apostrophes in the commit message text.

7. **D-44 pattern is load-bearing** — pre-registration storage in user metadata is used by: use-case selector, message plan builder, build spec generator, sandbox API key, phone verification. All read/write to `user.user_metadata` via `supabase.auth.updateUser()`. Post-payment migration to proper tables is a future concern.

8. **11 commits ahead of origin** — nothing has been pushed yet.
