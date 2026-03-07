# CC_HANDOFF.md — Session Handoff
**Date:** 2026-03-07 (audit session)
**Branch:** main (all work committed and pushed)

---

## Commits This Session

```
b34a255  fix: opt-out pipeline fail-closed — block messages on DB errors, add error logging
41e3aa3  fix: add Stripe webhook event.id deduplication table
feb36d8  fix: add customers.user_id, tighten NOT NULL constraints per migration audit
```

---

## What We Completed

### Code audit — three critical paths traced

Audited the Twilio state machine, Stripe webhook, and opt-out pipeline for race conditions, idempotency, and failure handling. Findings documented below with fixes applied.

### Fix 1: Opt-out pipeline fail-closed (CRITICAL → resolved)

The entire opt-out system was silently swallowing database errors. The Supabase JS client returns `{ data, error }` but no function in `opt-out.ts` checked `error`. A DB failure on the read path returned "not opted out," allowing messages to be sent to recipients who texted STOP.

**Files changed:**
- `src/lib/proxy/opt-out.ts` — all three functions (`isOptedOut`, `addOptOut`, `removeOptOut`) now check Supabase error field. `isOptedOut` returns `true` on DB failure (fail-closed). `addOptOut`/`removeOptOut` throw on failure with CRITICAL logging.
- `src/app/api/webhooks/inbound/[registrationId]/route.ts` — STOP/START handling wrapped in try/catch. Still returns 200 to Twilio but logs CRITICAL error when persistence fails.
- `src/lib/proxy/forward.ts` — `.catch(() => {})` on retroactive opt-out replaced with proper error logging.

### Fix 2: Stripe webhook event.id deduplication

No idempotency check existed. The handler relied on database UNIQUE constraints on `customers` as an implicit guard. Added explicit deduplication.

**Files changed:**
- `supabase/migrations/20260307100000_stripe_events.sql` — new `stripe_events` table (event ID as PK).
- `src/app/api/webhooks/stripe/route.ts` — INSERT event ID before processing; 23505 (unique violation) → return 200 immediately.

### Fix 3: Migration schema audit fixes

Audited all 7 migrations and cross-referenced every query pattern in code against schema indexes and constraints.

**Files changed:**
- `supabase/migrations/20260307200000_audit_fixes.sql` — adds `customers.user_id UUID NOT NULL` with FK + index, CHECK constraint on `webhook_endpoints`, NOT NULL on `message_scans.message_id` and `compliance_alerts.customer_id`.
- `src/lib/proxy/auth.ts` — post-registration path reads `user_id` from customers row directly. Eliminates O(n) `listUsers()` scan on every API call. `verifiedPhone` lookup only fires for sandbox env via `getUserById`.
- `src/app/api/webhooks/stripe/route.ts` — resolves `user_id` from auth.users at customer creation time.
- `src/app/api/webhooks/inbound/[registrationId]/route.ts` — live path reads `user_id` from customers instead of `listUsers()` scan.

---

## Audit Findings (for reference)

### Twilio state machine race condition — LOW risk (no fix needed)
- Optimistic concurrency lock (`WHERE id = $id AND status = $fromStatus`) is solid
- No Twilio brand/campaign webhooks configured — all advancement is via polling, eliminating poller-vs-webhook race
- Minor: no distributed lock on cron, non-atomic metadata writes after status transition

### Stripe webhook — MEDIUM risk (fixed)
- No `event.id` deduplication → fixed with `stripe_events` table
- `customers` table UNIQUE constraints remain as secondary defense

### Opt-out pipeline — HIGH risk (fixed)
- All DB errors silently swallowed → fixed with error checking, fail-closed reads, throwing writes
- TCPA exposure from sending to opted-out recipients → eliminated by fail-closed pattern

### Schema audit findings (fixed / documented)
- HIGH: Missing `customers.user_id` + O(n) listUsers scan → fixed
- MEDIUM: `webhook_endpoints` missing CHECK constraint → fixed
- MEDIUM: `message_scans.message_id` nullable → fixed (NOT NULL)
- MEDIUM: `compliance_alerts.customer_id` nullable → fixed (NOT NULL)
- LOW: `byo_waitlist.created_at` missing NOT NULL → not fixed (trivial)
- LOW: No FK from `user_id` columns to `auth.users` → not fixed (possibly intentional for TCPA record preservation)

---

## Decisions Made This Session

None. This was a pure audit/fix session — no product, architecture, or UX decisions.

---

## Not Done / Deferred (carried forward)

- **D-51 checkout checkbox** — ToS/AUP acceptance checkbox in intake wizard still not wired (beta blocker)
- **Landing page plan** — `docs/plans/2026-03-05-landing-page.md` remains untracked
- **SMOKE_TEST_BUGS.md** — untracked reference doc in repo root
- **byo_waitlist.created_at NOT NULL** — trivial fix, not worth a migration
- **FK from user_id columns to auth.users** — sms_opt_outs, messages, sandbox_daily_usage, webhook_endpoints. Document rationale if intentional (TCPA record preservation).

---

## Uncommitted / Untracked Files

- `SMOKE_TEST_BUGS.md` — smoke test bug list (reference only)
- `docs/plans/2026-03-05-landing-page.md` — landing page plan from prior session

---

## Gotchas for Next Session

1. **Migration 20260307200000 deletes all customers rows** — it's a dev-only destructive migration that adds `user_id NOT NULL`. If there's test data you care about, re-seed after running migrations.

2. **Three remaining `listUsers()` calls are intentional** — Stripe webhook (one-time at customer creation), pre-reg sandbox auth (D-55), sandbox inbound webhook (D-54). All are cases where no customer row exists. Don't try to eliminate these without an alternative lookup table.

3. **Opt-out `isOptedOut` now fails closed** — if the DB is down, ALL messages will be blocked (not just opted-out recipients). This is the correct tradeoff for TCPA compliance but will surface as "all messages failing" if Supabase has an outage.

4. **Stripe dedup uses Postgres error code 23505** — this is the standard unique violation code. If Supabase changes their PostgREST error format, the dedup logic would need updating.

5. **Forward.ts retroactive opt-out is still fire-and-forget** — the `.catch()` now logs CRITICAL instead of swallowing, but the message is still returned as failed to the caller regardless. The opt-out write is best-effort with monitoring.

---

## Active Build Context

Active PRDs per CLAUDE.md: PRD_06 (dashboard), PRD_01 (intake), PRD_03 (compliance site), PRD_05 (deliverable). Phase 2 PRDs remain out of scope.

DECISIONS.md has 57 decisions loaded (no new decisions this session).
