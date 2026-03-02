# PRICING MODEL UPDATE
## RelayKit — Managed SMS Compliance Infrastructure with Free Sandbox
### Version 2.0 — Mar 1, 2026

> **This document replaces pricing sections in PROJECT_OVERVIEW.md, PRD_01 Section 5, and PRD_07 Sections 2 & 4. Feed this to CC alongside the relevant PRD when building Stripe integration.**
>
> **CHANGE LOG (v2.0):** Added free sandbox tier. Compliance Shield paid tier ($29/month) removed — drift detection is now baseline for all customers. BYO Twilio tier added for Phase 2. Infrastructure costs updated to include proxy + Redis.

---

## DECISION SUMMARY

RelayKit has three tiers, one pricing structure, and no paywalled compliance features.

| Tier | Price | What it is |
|------|-------|-----------|
| **Sandbox** | Free | Instant API key, full testing, no time limit |
| **Setup** | $199 one-time | 10DLC registration, compliance site, all artifacts |
| **Monthly** | $19/month | Live messaging through compliance proxy, 500 messages included |

Everything a customer needs to stay compliant is included. No upsells, no tiered protection.

---

## 1. FREE SANDBOX TIER

### What's included (no credit card, no time limit)
- Sandbox API key (`rk_sandbox_` prefix) — instant on signup
- Full API access (same endpoints as production)
- Outbound messages to one verified phone number (100/day limit)
- Inbound message forwarding (replies from verified number)
- Opt-out testing (STOP/START keyword handling)
- Same compliance checks as production (content scanning, opt-out enforcement)
- Dashboard with API key, verified phone, usage counter

### Purpose
The sandbox is customer acquisition. Developers build their entire SMS integration for free, with a real working API, before paying anything. By the time they register, they've already invested time in the integration — the payment is to go live, not to start building.

### Costs to RelayKit
- Shared sandbox phone number: ~$1.15/month
- Per-message carrier cost: ~$0.0079/segment
- At 100 active sandbox developers sending 50 messages/day: ~$40/day carrier cost
- This is customer acquisition cost, cheaper than any paid channel

### Conversion path
Sandbox → Registration CTA on dashboard (engagement-signal-aware nudge) → Intake wizard (PRD_01) → Stripe checkout → Registration pipeline begins

---

## 2. PRICING STRUCTURE

### One-Time Setup Fee
- **$199** — covers 10DLC registration, compliance site generation, all artifacts, Twilio subaccount creation, Twilio submission, rejection handling, and integration kit delivery

### Monthly Subscription (Required)
- **$19/month** — billed monthly, starts after registration approval
- Includes:
  - 500 SMS segments per month
  - Phone number rental
  - Compliance proxy (every message scanned inline before delivery)
  - Opt-out enforcement, quiet hours, SHAFT-C content scanning, rate limiting
  - Semantic drift detection (Claude-powered, sampled, with rewrite suggestions)
  - Message preview endpoint (validate templates against registration)
  - Compliance site hosting (kept live and audit-ready)
  - Trust score monitoring
  - Campaign status visibility
  - Carrier regulation change tracking

### Auto-Scaling Message Blocks
- When usage exceeds 500 messages, additional blocks are added automatically
- **$15 per additional 1,000 messages**
- No service interruption — messages keep sending
- Blocks added in real-time as usage crosses thresholds
- Requires valid payment method on file (enforced at checkout)

### Monthly Billing Example
| Usage | Monthly Bill | Effective Rate |
|-------|-------------|----------------|
| 0–500 | $19 | 3.8¢/msg |
| 501–1,500 | $34 | 2.3¢/msg |
| 1,501–2,500 | $49 | 2.0¢/msg |
| 2,501–3,500 | $64 | 1.8¢/msg |
| 5,000 | $86 | 1.7¢/msg |
| 10,000 | $161 | 1.6¢/msg |

### Volume Tapering (Gentle, Not Aggressive)
At higher volumes, block pricing decreases slightly:
- 1,000–5,000 → $15 per 1,000
- 5,001–20,000 → $13 per 1,000
- 20,000+ → Custom pricing (contact us)

> **Rationale:** Heavy users increase carrier exposure and complaint risk. Margins must be maintained, not compressed. This is risk pricing, not commodity pricing.

### Abuse Safeguard Ceiling
- Hard daily cap: 20,000 messages/day (invisible to normal users)
- Triggers automatic review + alert to RelayKit admin
- Protects master Twilio account from runaway loops or abuse
- Customer notified if ceiling hit: "Unusual activity detected. Contact support."

---

## 3. BYO TWILIO TIER (Phase 2)

Registration-only service for developers who bring their own Twilio account.

### Pricing
- **$199 one-time** — registration only, no monthly subscription
- No proxy, no compliance monitoring, no managed phone number
- Delivers: direct Twilio credentials (SID, auth token, Messaging Service SID) + SMS_GUIDELINES.md compliance co-pilot

### What's included
- 10DLC registration through RelayKit's ISV account
- Compliance site generation and hosting
- All artifacts (campaign description, sample messages, privacy policy, terms, opt-in form)
- Rejection handling
- BYO Twilio deliverable (MESSAGING_SETUP.md with Twilio API calls instead of RelayKit API)

### Upgrade path
Persistent dashboard upsell: "Want automatic compliance protection? Switch to RelayKit's managed API — same code, one key swap."

Migration: create subaccount under RelayKit ISV, port existing number, swap API key. Customer's code changes are minimal (endpoint URL + auth header).

### Why offer this
- Some developers already have Twilio accounts and won't give them up
- Entry tier creates relationship — upgrade to proxy later
- $199 one-time is still profitable (82%+ margin on registration)
- Captures customers who would otherwise do it themselves or use a Fiverr gig

---

## 4. STRIPE IMPLEMENTATION (Replaces PRD_01 Section 5)

### Checkout Flow
1. Customer clicks "Register now" on dashboard (or "Start my registration" on intake Screen 3)
2. Frontend calls `POST /api/checkout`
3. Backend creates a **Stripe Checkout Session** in `subscription` mode with:
   - **Line item 1:** Setup fee — $199.00 one-time (using `price_data` with `recurring: null` or a one-time Stripe Price)
   - **Line item 2:** Monthly subscription — $19.00/month recurring (Stripe Price object)
   - Customer email pre-filled from intake (or from sandbox account)
   - `payment_method_collection: 'always'` (required for future overage billing)
   - Success URL: `relaykit.com/dashboard?session_id={CHECKOUT_SESSION_ID}`
   - Cancel URL: `relaykit.com/start/review`
   - Metadata: `{ intake_session_id: "{id}", customer_id: "{id}" }`
4. Customer completes payment on Stripe's hosted checkout
5. Stripe charges $199 + first month $19 = **$218 at checkout**
6. Redirects to dashboard

### Stripe Product Configuration
```
Product: "RelayKit SMS Registration"
  Price 1: $199.00 USD — one-time setup fee
  
Product: "RelayKit SMS Infrastructure"  
  Price 1: $19.00 USD/month — base subscription
  
Product: "RelayKit Message Block"
  Price 1: $15.00 USD — one-time (used for metered overage billing)
  Price 2: $13.00 USD — one-time (volume tier, 5k+)
```

### Webhook Handling
**`checkout.session.completed`** — same as current PRD_01 spec:
1. Verify signature
2. Look up intake_session_id
3. Create customer + registration records (or link to existing sandbox customer)
4. Trigger artifact generation pipeline (starts with subaccount creation — PRD_04)
5. Store Stripe customer_id and subscription_id on customer record

**`invoice.payment_failed`** — new:
1. Mark customer as `payment_past_due`
2. Send email: "Your payment failed. Update your card to keep SMS active."
3. Grace period: 7 days before suspension
4. After grace: pause Messaging Service (messages queue but don't send)

**`customer.subscription.deleted`** — new:
1. Mark customer as `churned`
2. Pause Messaging Service
3. Compliance site remains live for 30 days (carrier audit protection)
4. Send email with reactivation link

### Usage Metering (v1 — Simple Approach)
- Track message count per customer per billing period using Supabase
- Proxy increments counter on every successful message send
- At end of billing cycle (or triggered by threshold crossing), create Stripe Invoice Items for overage blocks
- Use Stripe's `usage_record` API on a metered price, OR simply create one-time invoice items — decide during build based on what's simpler
- **v1 simplification:** If metered billing is too complex for launch, hard-cap at 500 and require manual plan upgrade. Add auto-scaling in week 3. Flag this decision for Joel.

### Subscription Lifecycle
```
SANDBOX (free, no Stripe involvement)
  → CHECKOUT → active (subscription created, $199 + $19 charged)
    → payment_past_due (card fails on renewal)
      → 7-day grace period
      → suspended (messaging paused)
      → reactivated (card updated) OR churned (30 days no payment)
    → cancelled (customer cancels)
      → messaging paused immediately  
      → compliance site stays live 30 days
      → data retained 90 days
      → sandbox continues to work (they can still test)
```

---

## 5. SCREEN 3 PREVIEW CARD UPDATE

The Review & Confirm screen (Screen 3) preview card:
```
WHAT HAPPENS NEXT
1. You pay $199 setup + $19/month
2. We submit your registration to US carriers (usually 3–10 days)
3. Your sandbox keeps working while you wait
4. On approval, swap your sandbox key for your live key — same code, same API

YOUR PLAN
$199 one-time setup
$19/month includes 500 messages, phone number, compliance proxy & monitoring
Additional messages: $15 per 1,000 (auto-scales, no interruption)
```

---

## 6. UPDATED UNIT ECONOMICS

### Twilio Fee Schedule (as of Aug 2025)
| Brand Type | Brand Fee | Campaign Vetting | Phone Number | Campaign Monthly Fee |
|------------|----------|-----------------|-------------|---------------------|
| Sole Proprietor | $4.50 | $15.00 | ~$1.15/mo | $1.50–$10/mo |
| Low Volume Standard (EIN, <6k msgs/day) | $4.50 | $15.00 | ~$1.15/mo | $1.50–$10/mo |
| Standard (EIN, high volume) | $46.00* | $15.00 | ~$1.15/mo | $1.50–$10/mo |

*Standard Brand $46 now includes secondary vetting (previously a separate $41.50 charge).

Campaign monthly fee varies by use case: $1.50 (transactional) to $10 (marketing/mixed). Most indie dev use cases (notifications, verification, appointments) are on the low end.

> **Key insight:** Most RelayKit customers will be Sole Prop or Low Volume Standard. Initial Twilio cost is ~$20 for the vast majority, not $62.

### Registration (one-time)
| Item | Typical Customer | High Volume Standard |
|------|-----------------|---------------------|
| Revenue | $199 | $199 |
| Twilio brand + campaign | ~$19.50 | ~$61.00 |
| Stripe processing (3%) | ~$6.54 | ~$6.54 |
| Support/review time | $7.50–15 | $7.50–15 |
| **Gross profit** | **~$163–170** | **~$116–124** |
| **Gross margin** | **~82–85%** | **~58–62%** |

### Monthly Subscription
| Item | Low Use Case | Marketing/Mixed Use Case |
|------|-------------|------------------------|
| Revenue (base) | $19.00 | $19.00 |
| Phone number rental | ~$1.15 | ~$1.15 |
| Twilio campaign monthly fee | ~$1.50 | ~$10.00 |
| Compliance site hosting | ~$0.50 | ~$0.50 |
| Proxy + Redis infrastructure | ~$1.00 | ~$1.00 |
| Drift detection (Claude API sampling) | ~$0.25 | ~$0.25 |
| Message cost (500 × $0.01 blended) | ~$5.00 | ~$5.00 |
| Stripe processing (3%) | ~$0.57 | ~$0.57 |
| **Monthly gross profit** | **~$9.03** | **~$0.53** |
| **Monthly gross margin** | **~48%** | **~3%** |

> **⚠️ Note:** Marketing/mixed use cases are roughly breakeven on the base tier at 500 included messages. Margin comes from: (1) most customers won't use all 500 messages every month, and (2) overage kicks in earlier, generating block revenue sooner. The move from 1,000 to 500 included significantly improves base tier economics.

### Message Block Revenue
| Item | Amount |
|------|--------|
| Revenue per 1,000 block | $15.00 |
| Message cost (1,000 × $0.01) | ~$10.00 |
| **Gross profit per block** | **~$5.00** |
| **Gross margin** | **~33%** |

### Customer LTV Model (12-month retention)
| Scenario | Setup | Monthly × 12 | Overage | Total LTV |
|----------|-------|-------------|---------|-----------|
| Light user (250 msg/mo) | $199 | $228 | $0 | $427 |
| Typical user (1,000 msg/mo) | $199 | $228 | $90 | $517 |
| Growth user (3,000 msg/mo) | $199 | $228 | $360 | $787 |
| Scale user (10,000 msg/mo) | $199 | $228 | $1,620* | $2,047 |

*Scale user benefits from volume tapering at 5k+

### Revenue Targets
| Milestone | Customers | Setup Rev | MRR (base) | Est. Overage MRR | Total Annual |
|-----------|----------|-----------|-----------|-----------------|-------------|
| Validation | 50 | $9,950 | $950 | ~$200 | ~$23,750 |
| Traction | 500 | $99,500 | $9,500 | ~$3,000 | ~$249,500 |
| Scale | 2,000 | $398,000 | $38,000 | ~$15,000 | ~$1,034,000 |

---

## 7. CC IMPLEMENTATION NOTES

### What CC needs to build for Stripe (in order):
1. Stripe product + price creation (can be done via Stripe Dashboard or API seed script)
2. `POST /api/checkout` — creates Subscription checkout session with one-time setup fee
3. `POST /api/webhooks/stripe` — handles `checkout.session.completed`, `invoice.payment_failed`, `customer.subscription.deleted`
4. Customer record stores: `stripe_customer_id`, `stripe_subscription_id`, `subscription_status`
5. Basic usage counter: increment on each outbound message (proxy integration point)
6. **v1 decision point:** If metered billing is complex, launch with hard cap at 500 and manual upgrade. Add auto-scaling in phase 2.

### Environment Variables (add to .env)
```
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_SETUP_PRICE_ID=price_...
STRIPE_MONTHLY_PRICE_ID=price_...
STRIPE_MESSAGE_BLOCK_PRICE_ID=price_...
```

### Database Additions
```sql
-- Add to customers table
stripe_customer_id TEXT,
stripe_subscription_id TEXT,
subscription_status TEXT DEFAULT 'active',
-- CHECK (subscription_status IN ('active', 'past_due', 'suspended', 'cancelled', 'churned'))

-- New table for usage tracking
CREATE TABLE message_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  billing_period_start TIMESTAMPTZ NOT NULL,
  billing_period_end TIMESTAMPTZ NOT NULL,
  message_count INTEGER DEFAULT 0,
  blocks_billed INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```
