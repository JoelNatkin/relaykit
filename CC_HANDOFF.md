# CC_HANDOFF.md — Session Handoff
**Date:** 2026-03-07
**Branch:** main (all work committed and pushed)

---

## Commits This Session

```
24df67c  fix: BUG-3 prevent HTTP 431 by copying auth cookies to redirect responses
b038564  fix: BUG-9 compliance site domain shows relaykit.co instead of msgverified.com
ba959b0  fix: BUG-10 no use case selected flash when clicking Register now
57978e9  fix: BUG-5 strip country code from phone autofill values
2f101a5  fix: BUG-2 phone verification auth error from missing Twilio credentials
cb2bbda  fix: BUG-6/7/8 add maxLength and character counters to intake fields
5b7ff1c  fix: BUG-4 remove broken About link from footer
8a5b2e9  fix: BUG-10 move form data back to sessionStorage, keep only use_case in query params
e9209a2  feat: add sign-out link to dashboard header
```

---

## What We Completed

### Smoke test bug fixes (7 of 7 bugs from SMOKE_TEST_BUGS.md)

**BUG-3 — HTTP 431 oversized cookies**
- `src/utils/supabase/middleware.ts` — added `copySupabaseCookies()` to copy auth cookies to redirect responses (they were being dropped)
- `package.json` — added `NODE_OPTIONS='--max-http-header-size=32768'` to dev/start scripts as safety net

**BUG-9 — Compliance site domain showed relaykit.co**
- `src/components/intake/review-preview-card.tsx` — changed hardcoded `relaykit.co` to `process.env.NEXT_PUBLIC_COMPLIANCE_SITE_DOMAIN ?? "msgverified.com"`
- `src/components/intake/industry-gate-alert.tsx` — fixed `relaykit.co` → `relaykit.com` in waitlist email href

**BUG-10 — "No use case selected" flash + security fix**
- `src/components/dashboard/go-live-cta.tsx` — added `use_case` and `path=dashboard` query params to router.push
- `src/app/start/details/page.tsx` — removed all form field serialization from URL; hydrates exclusively from sessionStorage
- `src/app/start/review/page.tsx` — removed all `searchParams.get()` reads for business details; reads only from sessionStorage `bd` object

**BUG-5 — Phone autofill wrong area code**
- `src/lib/intake/validation.ts` — `formatPhone()` now strips leading `1` from 11-digit inputs before slicing to 10

**BUG-2 — Phone verification auth error**
- `src/app/api/phone-verify/route.ts` — moved Twilio env var reads from module level into `getTwilioCredentials()` with validation; returns 503 if not configured; stopped surfacing raw Twilio errors to users

**BUG-6/7/8 — Missing max lengths on intake fields**
- `src/components/intake/business-details-form.tsx` — added `maxLength={100}` to business name, `maxLength={500}` to description textarea, character counters below each
- `src/lib/intake/validation.ts` — added `maxLength` property to `USE_CASE_FIELDS` type and all field definitions (100 for all use-case-specific fields)

**BUG-4 — Broken About link in footer**
- `src/components/landing/footer.tsx` — removed `{ label: "About", href: "#" }` from Company links

### Dashboard sign-out link
- `src/components/dashboard/dashboard-shell.tsx` — added "Sign out" button next to email in header; calls `supabase.auth.signOut()` + redirects to `/login`

---

## Decisions Made This Session

- **D-57 — Intake wizard form data must never appear in URL query params** — Business details (EIN, phone, address, etc.) are PII and must only persist in sessionStorage. URLs between wizard screens carry only routing params: `use_case`, `expansions`, `campaign_type`, `path`.

---

## Not Done / Deferred

- **BUG-1** (from SMOKE_TEST_BUGS.md) — was already fixed before this session
- **SMOKE_TEST_BUGS.md** — untracked file in repo root; not committed (reference doc, not deployable)
- **D-51 checkout checkbox** — ToS/AUP acceptance checkbox in intake wizard still not wired (beta blocker per D-51)
- **Landing page plan** — `docs/plans/2026-03-05-landing-page.md` remains untracked from prior session

---

## Uncommitted / Untracked Files

- `SMOKE_TEST_BUGS.md` — smoke test bug list (reference only)
- `docs/plans/2026-03-05-landing-page.md` — landing page plan from prior session

---

## Gotchas for Next Session

1. **`NEXT_PUBLIC_COMPLIANCE_SITE_DOMAIN` env var** — review-preview-card.tsx reads this at build time for the compliance site URL. Falls back to `msgverified.com`. Must be set in Vercel/deployment env if the domain changes.

2. **Phone verification requires three env vars** — `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_VERIFY_SID` must all be present or the endpoint returns 503. Previously it crashed with a cryptic "No password provided" error.

3. **Cookie fix is two-part** — middleware cookie copy fixes the auth loop, but `--max-http-header-size=32768` is a safety net in package.json scripts. Both are needed.

4. **sessionStorage is the single source of truth for intake form data** — per D-57. The review page no longer reads any business details from URL params. If a new wizard screen is added, follow this pattern.

5. **Character counters on intake fields** — business name (100), description (500), and all use-case-specific fields (100) now have maxLength + visible counters. Server-side validation in the checkout API should match these limits.

---

## Active Build Context

Active PRDs per CLAUDE.md: PRD_06 (dashboard), PRD_01 (intake), PRD_03 (compliance site), PRD_05 (deliverable). Phase 2 PRDs remain out of scope.

DECISIONS.md has 57 decisions loaded (D-57 added this session).
