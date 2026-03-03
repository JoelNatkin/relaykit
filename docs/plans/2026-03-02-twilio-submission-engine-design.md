# Twilio Submission Engine — Design Doc

**Date:** 2026-03-02
**PRD:** PRD_04
**Approach:** Thin fetch wrapper + recursive state machine (Approach A)

---

## Decisions

- **Steps 7-8 (API key gen, proxy webhooks):** Stubbed. API key generation built, proxy webhook URLs are placeholders. Pipeline marks COMPLETE after step 6 + key gen.
- **Compliance site deploy:** Stubbed. State exists in machine but deploy function saves artifacts and advances immediately. Cloudflare Pages integration wired later.
- **Poller:** Next.js API route (`POST /api/cron/poll-registrations`) with shared secret auth. External cron (Vercel cron / GitHub Actions) triggers it every 30 min.
- **Encryption for subaccount auth tokens:** Application-level AES-256-GCM via Node.js `crypto`. New env var `TWILIO_ENCRYPTION_KEY`. Column stores `{ iv, authTag, ciphertext }` as JSON. Two helpers: `encryptSecret()` / `decryptSecret()`.

---

## Architecture

### Twilio API Client Layer

`src/lib/twilio/client.ts`:
- `twilioFetch(endpoint, options)` — builds URL, sets Basic Auth, sends form-encoded body, retries 3x with exponential backoff on 429/500/503, logs to `twilio_api_log`, throws `TwilioApiError` on 4xx
- `parentClient()` — uses `TWILIO_ACCOUNT_SID` + `TWILIO_AUTH_TOKEN`
- `subaccountClient(sid, authToken)` — uses subaccount creds

Key detail: Twilio REST API uses form-encoded POST bodies, not JSON. Responses are JSON.

### Twilio Module Files

```
src/lib/twilio/
  client.ts              — twilioFetch(), parentClient(), subaccountClient(), encryptSecret(), decryptSecret()
  subaccount.ts          — createSubaccount(customer)
  brand.ts               — submitSoleProprietorBrand(reg), submitStandardBrand(reg)
  vetting.ts             — requestSecondaryVetting(brandSid), submitOtp(brandSid, otpCode)
  messaging-service.ts   — createMessagingService(reg, subaccountCreds)
  campaign.ts            — createCampaign(reg, artifacts, subaccountCreds)
  phone-number.ts        — purchasePhoneNumber(reg, subaccountCreds), assignToService(...)
  poll.ts                — fetchBrandStatus(brandSid), fetchCampaignStatus(serviceSid, subaccountCreds)
```

Each module returns resource SIDs. Modules don't touch the database — that's the orchestrator's job.

### Orchestrator

```
src/lib/orchestrator/
  state-machine.ts       — RegistrationStatus type, VALID_TRANSITIONS map, updateStatus()
  processor.ts           — processRegistration(registrationId) recursive switch
  poller.ts              — pollPendingRegistrations()
```

Sync steps execute and recurse. Async wait points return early. Every transition logged to `registration_events`.

### Database Migration

**Expand `registrations.status`** CHECK constraint to:
`pending_payment, creating_subaccount, generating_artifacts, deploying_site, submitting_brand, awaiting_otp, brand_pending, brand_approved, vetting_in_progress, creating_service, submitting_campaign, campaign_pending, provisioning_number, generating_api_key, complete, rejected, needs_attention`

**New columns on `registrations`:** twilio_trust_product_sid, twilio_end_user_sid, twilio_address_sid, twilio_vetting_sid, twilio_subaccount_sid (denormalized), trust_score, rejection_reason, rejection_code, compliance_site_url

**New columns on `customers`:** twilio_subaccount_sid, twilio_subaccount_auth (AES-256-GCM encrypted), live_active

**New tables:** twilio_api_log, registration_events, api_keys

RLS: service-role only for all new tables.

### API Routes

- `POST /api/cron/poll-registrations` — cron-triggered, shared secret auth via `CRON_SECRET` env var
- `POST /api/otp` — customer submits sole prop OTP code, advances from awaiting_otp
- `POST /api/webhooks/inbound/[registrationId]` — stub, returns 200
- `POST /api/webhooks/status/[registrationId]` — stub, returns 200
- Existing Stripe webhook modified: TODOs replaced with `processRegistration()` call

### New Environment Variables

- `TWILIO_ENCRYPTION_KEY` — 32-byte hex for AES-256-GCM
- `CRON_SECRET` — shared secret for cron route auth
- `RELAYKIT_API_DOMAIN` — defaults to `api.relaykit.dev` for webhook URLs
