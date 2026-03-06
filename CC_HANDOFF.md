# CC_HANDOFF.md — Messaging Proxy & Developer Sandbox (PRD_09 Phase 1)

## Status

**PRD_09 Phase 1 (Messaging Proxy & Developer Sandbox): COMPLETE (all 10 tasks).**

Build passes clean (`npm run build`). No new dependencies added (Postgres-only, no Redis — D-52).

**Previous builds: PRD_06 Dashboard COMPLETE. PRD_05 Deliverable Generator COMPLETE. PRD_01 Addendum (Dashboard Path + Industry Gating) COMPLETE.**

## Files Created This Session

```
supabase/migrations/20260306000000_messaging_proxy.sql     # 5 new tables: sms_opt_outs, recipient_consents, messages, webhook_endpoints, sandbox_daily_usage

src/lib/proxy/types.ts                    # AuthenticatedContext, ProxyResponse, ProxyError, makeProxyError()
src/lib/proxy/auth.ts                     # Dual-path API key auth (api_keys table + user metadata fallback)
src/lib/proxy/compliance-pipeline.ts      # Orchestrates opt-out, SHAFT-C, marketing consent checks
src/lib/proxy/opt-out.ts                  # isOptedOut(), addOptOut(), removeOptOut() — Postgres-backed
src/lib/proxy/content-scanner.ts          # scanForShaftC() — regex SHAFT-C keyword detection
src/lib/proxy/marketing-consent.ts        # classifyMessageType(), checkMarketingConsent() — D-14 MIXED tier
src/lib/proxy/forward.ts                  # forwardToTwilio() — subaccount forwarding with 21610 defense-in-depth
src/lib/proxy/message-logger.ts           # logMessage() — fire-and-forget, SHA-256 body hash
src/lib/proxy/usage-meter.ts              # incrementUsage() — billing period upsert on message_usage
src/lib/proxy/webhook-forwarder.ts        # forwardWebhookEvent() — HMAC-SHA256 signed delivery

src/lib/sandbox/limits.ts                 # checkAndIncrementDailyLimit() — 100/day Postgres upsert
src/lib/sandbox/manager.ts                # sendSandboxMessage() — verified phone, [SANDBOX] prefix, parent account

src/app/api/v1/messages/route.ts          # POST /v1/messages — main send endpoint
src/app/api/v1/opt-outs/route.ts          # GET + POST /v1/opt-outs
src/app/api/v1/opt-outs/[phoneNumber]/route.ts  # GET /v1/opt-outs/{phone}
src/app/api/v1/consents/route.ts          # POST /v1/consents
src/app/api/v1/consents/[phoneNumber]/route.ts  # DELETE /v1/consents/{phone}
src/app/api/v1/webhooks/route.ts          # POST + GET /v1/webhooks
src/app/api/v1/webhooks/[webhookId]/route.ts    # DELETE /v1/webhooks/{id}
src/app/api/v1/account/route.ts           # GET /v1/account
```

## Files Modified This Session

```
src/app/api/webhooks/inbound/[registrationId]/route.ts  # Stub → full STOP/START + webhook forwarding
src/app/api/webhooks/status/[registrationId]/route.ts   # Stub → status update + retroactive opt-out
src/app/dashboard/layout.tsx                             # sandboxMessageCount + phoneVerified wired to real data
DECISIONS.md                                              # D-52 through D-55 appended
CC_HANDOFF.md                                             # This file
```

## Decisions Made This Session

- **D-52 — Phase 1 proxy uses Postgres-only, no Redis.** Volumes don't justify Redis in Phase 1. Designed for easy Redis addition later.
- **D-53 — Opt-out table keyed on user_id, not customer_id.** Pre-reg sandbox users have no customers row. Opt-outs persist across sandbox→registration transition.
- **D-54 — Sandbox inbound webhook uses 'sandbox' sentinel registrationId.** Shared sandbox number's Messaging Service points to `/api/webhooks/inbound/sandbox`.
- **D-55 — Pre-registration API key auth uses admin.listUsers() scan.** O(n) across all users — acceptable for Phase 1, needs optimization before scale.

## Env Vars Required (New)

```
SANDBOX_TWILIO_NUMBER=+1XXXXXXXXXX    # Shared sandbox Twilio number
SANDBOX_DAILY_LIMIT=100                # Sandbox daily message limit (default 100)
```

## Gotchas for Next Session

1. **`admin.listUsers()` in auth.ts is O(n)** — scans all users to find pre-reg sandbox key matches (D-55). Fine for Phase 1 (<500 users). Before scale: either store pre-reg keys in `api_keys` table at generation time, or add a lookup table.

2. **Sandbox inbound requires manual Twilio setup** — the shared sandbox number's Messaging Service must have its inbound webhook pointed to `https://{domain}/api/webhooks/inbound/sandbox` (D-54). This is a one-time Twilio console config, not automated.

3. **`sms_opt_outs.customer_id` is nullable** — pre-reg sandbox users don't have a customer record. All opt-out lookups use `user_id`. The `customer_id` column is populated when available but is not the lookup key.

4. **Supabase client `PromiseLike` does not have `.catch()`** — fire-and-forget patterns must use `.then(({ error }) => { ... })` not `.then().catch()`. This tripped the build during implementation.

5. **Zod uses `.issues` not `.errors`** — `parsed.error.issues[0]?.message` is the correct accessor. `parsed.error.errors` does not exist in the Zod version used.

6. **Marketing consent check only runs for MIXED tier** — `compliance-pipeline.ts` checks `ctx.effectiveCampaignType === 'mixed'` before running `classifyMessageType()`. Transactional-only customers never hit the consent check.

7. **Message body is never stored** — `messages.body_hash` is a SHA-256 hash. The plaintext body is never persisted. This is deliberate PII avoidance.

8. **Webhook secrets are stored in plaintext** in `webhook_endpoints.secret` — needed for HMAC signing on every forward. This is the standard pattern (same as Stripe, GitHub).

9. **Phase 1 webhooks have no retry** — single delivery attempt. Phase 2 adds exponential backoff + dead letter queue.

10. **`forwardToTwilio()` catches Twilio error 21610** and retroactively adds the number to the opt-out list. This defense-in-depth means RelayKit's opt-out list self-heals even if the inline check missed.

11. **`sendSandboxMessage()` uses `getParentCredentials()`** — sandbox sends via the parent Twilio account, not a subaccount. Live sends use `getSubaccountCredentials()`.

## Carried Forward from Prior Sessions

- **D-51 (platform ToS/AUP) is a beta blocker.** Checkout screen needs ToS acceptance checkbox. Not built — decision only.
- **Area code selector UI (PRD_01 Addendum Section 4.4) not built.** `preferred_area_code` passes through in checkout payload but no UI component exists.
- **Email templates not wired to sending** — `src/lib/emails/templates.ts` returns `{ subject, body }`. Need provider (Resend/SendGrid).
- **Compliance site link is `href="#"` placeholder** in `compliance/page.tsx`.
- **Compliance `hasAlerts` always false** — no drift detection until PRD_08.
- **3 API routes still missing** (`/api/live-key`, `/api/usage`, `/api/registration-details`) — now partially addressed by `/v1/account` endpoint but dashboard-specific routes may still be needed.
- **`sendSMS()` signature is load-bearing across two templates** — `build-spec-template.ts` and `template-relaykit.ts` must stay identical (PRD_05 Trap #6).
- **Button uses `onClick` not `onPress`** — Untitled UI extends HTML button.
- **`TWILIO_VERIFY_SID` env var required** for phone verification.

## What's NOT Built Yet (PRD_09 Phase 2/3)

- Rate limiting (full token bucket with trust-score-aware MPS)
- Quiet hours enforcement
- Per-customer content allowlists based on vertical detection
- URL blocklist scanning
- Drift detection (Claude-powered sampled message analysis)
- Message preview endpoint (`POST /v1/messages/preview`)
- Webhook retry with exponential backoff + dead letter queue
- Message status tracking beyond Twilio callbacks
- Idempotency key support
- GET /v1/messages and GET /v1/messages/{id} (list/get endpoints)
- Registration nudge based on engagement signals
