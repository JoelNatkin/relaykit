# CC_HANDOFF.md — Compliance Monitoring (PRD_08 Phase 1)

## Status

**PRD_08 Phase 1 (Compliance Monitoring): COMPLETE (all 11 tasks).**

Build passes clean (`npm run build`). No new dependencies added.

**Previous builds: PRD_09 Phase 1 COMPLETE. PRD_06 Dashboard COMPLETE. PRD_05 Deliverable Generator COMPLETE. PRD_01 Addendum COMPLETE.**

## Files Created This Session

```
supabase/migrations/20260306100000_compliance_monitoring.sql  # 2 new tables: message_scans, compliance_alerts

src/lib/compliance/types.ts               # AsyncCheckResult, AsyncScanResult
src/lib/compliance/scanner.ts             # runAsyncChecks() — BM-01, BM-02, BM-06
src/lib/compliance/alert-generator.ts     # persistScanAndAlert() — 24h dedup per rule

src/app/api/compliance/alerts/route.ts    # GET + PATCH /api/compliance/alerts

src/components/dashboard/drift-alert-card.tsx  # DriftAlertCard — compliance suggestions list
```

## Files Modified This Session

```
src/lib/proxy/types.ts                    # Added businessName to AuthenticatedContext
src/lib/proxy/auth.ts                     # Populates businessName from customers table
src/app/api/v1/messages/route.ts          # Wired async compliance checks after delivery
src/components/dashboard/compliance-status-card.tsx  # Props: hasAlerts → alertCount + stats
src/app/dashboard/compliance/page.tsx     # Data-driven: fetches /api/compliance/alerts
src/lib/emails/templates.ts              # Added Emails 6+7 (warning digest, blocks notification)
src/lib/emails/types.ts                  # Added ComplianceWarningDigestVars, MessagesBlockedVars
src/app/start/review/page.tsx            # Updated consent copy + added monitoring_consent to payload
```

## What This Build Delivers

1. **Async monitoring pipeline:** After every live message delivery, three checks run fire-and-forget:
   - BM-01: Business name present in message body
   - BM-02: First message to new recipient includes opt-out language
   - BM-06: Message frequency within weekly limits (getWeeklyLimit per campaign type: 20 transactional, 40 mixed)

2. **Alert infrastructure:** Scan results land in `message_scans`. Failed checks generate `compliance_alerts` with 24h per-rule deduplication. Dashboard queries via `/api/compliance/alerts`.

3. **Dashboard compliance tab:** Now data-driven — shows scan stats (scanned/clean/warnings), unacknowledged alerts with "Got it" acknowledge button. No longer hardcoded "All clear."

4. **Email templates 6+7:** Warning daily digest and blocked messages notification (deterministic, no provider wired).

5. **Checkout consent:** Updated copy per PRD_08 Section 6, `monitoring_consent` included in checkout payload.

## Decisions — No New Decisions This Session

All implementation followed existing decisions (D-19 non-optional monitoring, D-24 multi-channel opt-out, D-29 no paid tier, D-52 Postgres-only).

## Gotchas for Next Session

1. **`message_scans` is keyed on `registration_id`, not `customer_id`** — the alerts API route resolves the customer's latest registration to query scan stats. If multi-project (Phase 2) adds multiple registrations per customer, the stats query will need to aggregate across registrations.

2. **Async checks query the `messages` table by `customer_id`** — BM-02 (first message) and BM-06 (frequency) both use `customer_id` + `to_number` filters on the `messages` table. This works for v1 single-project but may need `registration_id` scoping in Phase 2.

3. **`businessName` on AuthenticatedContext** — added in this session. Populated from `customers.business_name` in `resolvePostRegistrationContext()`. Null for sandbox. Used by async scanner for BM-01 business name check.

4. **Alert dedup is 24h window** — one alert per (customer_id, rule_id) per 24 hours. If a customer sends 100 messages without their business name, only one BM-01 alert is created per day.

5. **`monitoring_consent` in checkout payload** — added to the POST body but not yet consumed by `/api/checkout`. The checkout route should persist this to the customer record when that route is updated.

6. **Email templates 6+7 not wired to sending** — same as Emails 0–5, these return `{ subject, body }` but no email provider is integrated yet.

7. **Compliance site link still `href="#"`** — carried forward from prior session.

## Carried Forward from Prior Sessions

- **D-51 (platform ToS/AUP) is a beta blocker.** Checkout screen needs ToS acceptance checkbox. Not built — decision only.
- **Area code selector UI (PRD_01 Addendum Section 4.4) not built.** `preferred_area_code` passes through in checkout payload but no UI component exists.
- **Email templates not wired to sending** — `src/lib/emails/templates.ts` returns `{ subject, body }`. Need provider (Resend/SendGrid).
- **Compliance site link is `href="#"` placeholder** in `compliance/page.tsx`.
- **3 API routes still missing** (`/api/live-key`, `/api/usage`, `/api/registration-details`) — partially addressed by `/v1/account` endpoint but dashboard-specific routes may still be needed.
- **`sendSMS()` signature is load-bearing across two templates** — `build-spec-template.ts` and `template-relaykit.ts` must stay identical (PRD_05 Trap #6).
- **Button uses `onClick` not `onPress`** — Untitled UI extends HTML button.
- **`TWILIO_VERIFY_SID` env var required** for phone verification.
- **Supabase client `PromiseLike` does not have `.catch()`** — use `.then(({ error }) => { ... })` for fire-and-forget.
- **Zod uses `.issues` not `.errors`** — `parsed.error.issues[0]?.message`.

## What's NOT Built Yet (PRD_08 Phase 2/3)

- BM-05 quiet hours enforcement (inline)
- BM-08 URL blocklist scanning (inline)
- BM-09 semantic drift detection (Claude API, sampled analysis)
- Message preview endpoint (`POST /v1/messages/preview`)
- Per-customer SHAFT-C content allowlists based on vertical detection
- PHI detection for healthcare customers (inline)
- Drift escalation automation (throttle → pause)
- Admin alert system (Joel notifications)
- Compliance site monitoring
- Historical compliance trend data
- Daily digest / blocked notification email sending (templates exist, no provider)
