# PRICING MODEL UPDATE
## RelayKit — Managed SMS Compliance Infrastructure with Free Sandbox
### Version 3.0 — Mar 3, 2026

> **This document replaces pricing sections in PROJECT_OVERVIEW.md, PRD_01 Section 5, and PRD_07 Sections 2 & 4. Feed this to CC alongside the relevant PRD when building Stripe integration.**
>
> **CHANGE LOG (v3.0):** Free sandbox tier updated with message plan builder, build spec generator, sandbox SMS_GUIDELINES.md, and message library. BYO Twilio tier rewritten as Model 2 (registration submitted to customer's own Twilio account, not through our ISV). Platform tier pricing direction added (Phase 2 placeholder). All core pricing numbers unchanged: $199/$19/$15.
>
> **CHANGE LOG (v2.0):** Added free sandbox tier. Compliance Shield paid tier ($29/month) removed — drift detection is now baseline for all customers. BYO Twilio tier added for Phase 2. Infrastructure costs updated to include proxy + Redis.

---

## DECISION SUMMARY

RelayKit has four tiers, one pricing structure, and no paywalled compliance features.

| Tier | Price | What it is |
|------|-------|-----------|
| **Sandbox** | Free | Instant API key, full testing, message plan builder, build spec, no time limit |
| **Full-Stack Setup** | $199 one-time | 10DLC registration, compliance site, all artifacts, subaccount under our ISV |
| **Full-Stack Monthly** | $19/month | Live messaging through compliance proxy, 500 messages included |
| **BYO Twilio** (Phase 2) | $199 one-time | Registration submitted to customer's own Twilio account, no monthly |
| **Platform** (Phase 2) | Per-tenant pricing | SaaS platforms registering their tenants (see Section 3B) |

Everything a customer needs to stay compliant is included in full-stack. No upsells, no tiered protection.

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
- **Message plan builder** — use case selection, 5–8 compliant message templates per use case, inline editing, expansion message visibility
- **Build spec generator** — SMS_BUILD_SPEC.md generated from message plan, consumable by AI coding tools (Claude Code, Cursor, Copilot)
- **Sandbox SMS_GUIDELINES.md** — compliance co-pilot document for the developer's project, use-case-specific
- **Message library** — curated messages with copy icons and compliance indicators

### Purpose

The sandbox is customer acquisition. Developers build their entire SMS integration for free, with a real working API, before paying anything. By the time they register, they've already invested time in the integration — the payment is to go live, not to start building.

The build spec captures domain knowledge (compliance rules, message patterns, trigger logic) that developers would otherwise spend hours researching. It's the reason they choose RelayKit over direct Twilio integration, even before they know about the compliance proxy.

### Costs to RelayKit

- Shared sandbox phone number: ~$1.15/month
- Per-message carrier cost: ~$0.0079/segment
- Build spec generation: server-side string interpolation, negligible compute cost
- At 100 active sandbox developers sending 50 messages/day: ~$40/day carrier cost
- This is customer acquisition cost, cheaper than any paid channel

### Conversion path

Sandbox → Use case selection → Message plan builder → Build spec generation → Integration built → Engagement signals met → Registration CTA → Intake wizard (pre-populated from dashboard work) → Stripe checkout → Registration pipeline begins

> **Conversion psychology:** The build spec is what makes the sandbox sticky. Developers invest time curating messages and building from the spec. By the time they want to go live, switching to another provider means redoing all that work.

---

## 2. PRICING STRUCTURE (Full-Stack Tier)

### One-Time Setup Fee
- **$199** — covers 10DLC registration, compliance site generation, all artifacts, Twilio subaccount creation, Twilio submission, rejection handling, and integration kit delivery

### Monthly Subscription (Required)
- **$19/month** — Transactional tier. Billed monthly, starts after registration approval.
- **$29/month** — Mixed tier. Same as Transactional plus marketing campaign registration and recipient-level marketing consent enforcement at the proxy. Applies when `registration_tier = 'mixed'` (customer elected MIXED at intake, or selected a promotional expansion that required MIXED campaign type).
- Includes (both tiers):
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
- Mixed tier additionally includes:
  - Second campaign registration (marketing campaign alongside transactional)
  - Recipient-level marketing consent enforcement at proxy (messages to recipients without explicit marketing opt-in are blocked at infrastructure level)

### Multi-Project Billing (Phase 2 — PRD_11)
Each registered project carries its own subscription. One customer with multiple registered projects pays per project:
- $199 setup fee per project at registration time
- $19 or $29/month per registered project (Transactional or Mixed respectively)
- Overages tracked and billed per project
- All subscriptions managed under one Stripe Customer record — one billing portal, all projects visible
- Sandbox projects are always free regardless of project count

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

## 3. BYO TWILIO TIER

Registration-as-a-service for developers who have their own Twilio account and want to handle messaging directly through Twilio.

### Model 2: Registration to Customer's Own Twilio Account

We submit the 10DLC registration to the customer's own Twilio account, using their credentials. We create the Trust Hub profile, register the brand, create the campaign, and optionally provision a phone number — all under THEIR account. After registration completes, they're entirely self-sufficient. We have zero ongoing involvement with their Twilio account.

> **Why Model 2 (not Model 3):** Model 3 would create a subaccount under our ISV and give them the credentials to send directly through Twilio. Problem: their messages bypass our proxy but flow through our ISV account. If they drift or send prohibited content, our ISV trust score takes the hit. We'd be taking risk we can't monitor. Model 2 eliminates this entirely — their account, their problem.

### Pricing
- **$199 one-time** — registration only, no monthly subscription

### What we need from them
- Twilio Account SID + Auth Token (stored encrypted, used during registration pipeline only, discarded after completion)
- Their account must not be a trial account and must have A2P 10DLC capability enabled

### What we do
- Create Primary Customer Profile in their Trust Hub (not Secondary under our ISV)
- Register their brand
- Create their campaign with our template-generated content
- Optionally provision a new phone number (with area code preference) OR attach their existing number
- Generate and deploy compliance site
- Generate all artifacts (campaign description, sample messages, privacy policy, terms, opt-in form)
- Handle rejections and resubmissions

### What they get
- Completed 10DLC registration under their own Twilio account
- Compliance site (hosted by us on neutral domain, or they can self-host)
- SMS_GUIDELINES.md (production edition)
- Message library for their use case
- BYO MESSAGING_SETUP.md (Twilio API calls, not RelayKit API)
- Their registration is entirely theirs — they can modify campaign, add numbers, etc. through Twilio console

### What they DON'T get
- No proxy (messages go directly through their Twilio account)
- No compliance monitoring or drift detection
- No message preview endpoint
- No opt-out enforcement (they handle it)
- No quiet hours enforcement (they handle it)
- No ongoing RelayKit involvement

### Upgrade path

BYO customer's upgrade path to full RelayKit:
1. Sign up for sandbox (free — they already have the email from BYO registration)
2. Experience the message plan builder, build spec, compliance tools
3. Upgrade to full RelayKit: $19/month
4. We create a subaccount under our ISV, port their number, issue RelayKit API key
5. They swap their Twilio credentials for the RelayKit API key
6. The $199 they already paid covers the setup — no second setup fee

> **Key revenue insight:** BYO is an entry point, not a dead end. The $199 is the same whether they go full-stack or BYO. Upgrading adds the monthly subscription. Dashboard upsell: "Want automatic compliance protection? Switch to RelayKit's managed API — same code, one key swap."

---

## 3B. PLATFORM TIER (Phase 2 — Directional Pricing)

> **Status:** Phase 2 placeholder. These numbers are subject to market validation. Do NOT build pricing infrastructure for this tier yet. See PRD_10_PLATFORM_TIER.md for full product concept.

### Concept

SaaS platforms register their tenants' businesses through RelayKit's API. Each tenant gets individual 10DLC registration, compliance site, phone number, and compliance monitoring — orchestrated by the platform programmatically rather than by individuals through the intake wizard.

### Pricing direction

| Item | Price | Notes |
|------|-------|-------|
| Platform setup | $499 one-time | Platform verification, ISV configuration, onboarding |
| Per-tenant registration | $99 one-time | Same pipeline as single-company ($199), discounted for volume |
| Per-tenant monthly | $9/month | Phone number, compliance monitoring, proxy access |
| Messages | $12 per 1,000 | Slight volume discount over single-company rate |
| Platform monthly minimum | $49/month | Covers platform dashboard, API access, support |

### Volume tiers (as tenant count grows)

| Tenants | Per-tenant setup | Per-tenant monthly |
|---------|-----------------|-------------------|
| 1–25 | $99 | $9 |
| 26–100 | $79 | $7 |
| 101–500 | $59 | $5 |
| 500+ | Custom | Custom |

### Why the discount

Platform customer does the tenant acquisition (dramatically lower CAC for us). Platform provides business details programmatically (lower support cost). Volume creates infrastructure efficiency.

### Revenue example

A scheduling platform with 100 tenant businesses (26–100 tier):

- Platform setup: $499
- Tenant registrations: 100 × $79 = $7,900
- Monthly recurring: $49 (platform) + 100 × $7 (tenants) = $749/month = $8,988/year
- Total first-year revenue from single platform customer: ~$17,400 + message overage

Compare to 100 individual full-stack customers: $19,900 setup + $22,800 annual recurring. The platform tier trades per-unit margin for volume and reduced acquisition cost.

---

## 4. STRIPE IMPLEMENTATION (Replaces PRD_01 Section 5)

### Checkout Flow (Full-Stack)
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

### Checkout Flow (BYO Twilio) — Phase 2 (do not build)

> **Phase 2 — do not build.** This section describes the BYO Twilio checkout flow for future reference. Do not implement BYO checkout mode in v1.

1. Customer clicks "Register" from BYO intake flow
2. Frontend calls `POST /api/checkout` with `{ tier: 'byo' }`
3. Backend creates a **Stripe Checkout Session** in `payment` mode (one-time, no subscription):
   - **Line item:** Setup fee — $199.00 one-time
   - Customer email pre-filled
   - `payment_method_collection: 'if_required'`
   - Success URL: `relaykit.com/dashboard?session_id={CHECKOUT_SESSION_ID}`
   - Cancel URL: `relaykit.com/start/review`
   - Metadata: `{ intake_session_id: "{id}", customer_id: "{id}", tier: "byo" }`
4. Stripe charges **$199 at checkout** — no recurring billing
5. Redirects to dashboard

### Stripe Product Configuration
```
Product: "RelayKit SMS Registration"
  Price 1: $199.00 USD — one-time setup fee (used by both full-stack and BYO)
  
Product: "RelayKit SMS Infrastructure"  
  Price 1: $19.00 USD/month — base subscription (full-stack only)
  
Product: "RelayKit Message Block"
  Price 1: $15.00 USD — one-time (used for metered overage billing)
  Price 2: $13.00 USD — one-time (volume tier, 5k+)
```

### Webhook Handling
**`checkout.session.completed`** — same as current PRD_01 spec:
1. Verify signature
2. Look up intake_session_id
3. Create customer + registration records (or link to existing sandbox customer)
4. Trigger artifact generation pipeline (starts with subaccount creation — PRD_04 for full-stack, or direct Trust Hub submission for BYO)
5. Store Stripe customer_id and subscription_id on customer record (subscription_id null for BYO)

**`invoice.payment_failed`** — full-stack only:
1. Mark customer as `payment_past_due`
2. Send email: "Your payment failed. Update your card to keep SMS active."
3. Grace period: 7 days before suspension
4. After grace: pause Messaging Service (messages queue but don't send)

**`customer.subscription.deleted`** — full-stack only:
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
  → FULL-STACK CHECKOUT → active (subscription created, $199 + $19 charged)
    → payment_past_due (card fails on renewal)
      → 7-day grace period
      → suspended (messaging paused)
      → reactivated (card updated) OR churned (30 days no payment)
    → cancelled (customer cancels)
      → messaging paused immediately  
      → compliance site stays live 30 days
      → data retained 90 days
      → sandbox continues to work (they can still test)

  → BYO CHECKOUT → byo_active ($199 charged, no subscription)
    → registration pipeline runs against customer's Twilio account
    → on completion: deliverables generated, customer self-sufficient
    → compliance site hosted indefinitely (negligible cost)
    → upgrade to full-stack available at any time (adds $19/month subscription, no second setup fee)
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

> No change from v2.0. The build spec is a sandbox feature, not a paid feature. The preview card describes what payment buys.

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

### Full-Stack Registration (one-time)
| Item | Typical Customer | High Volume Standard |
|------|-----------------|---------------------|
| Revenue | $199 | $199 |
| Twilio brand + campaign | ~$19.50 | ~$61.00 |
| Stripe processing (3%) | ~$6.54 | ~$6.54 |
| Support/review time | $7.50–15 | $7.50–15 |
| **Gross profit** | **~$163–170** | **~$116–124** |
| **Gross margin** | **~82–85%** | **~58–62%** |

> **Re-vetting fee policy:** Campaign resubmissions after rejection incur a non-refundable $15 Twilio/TCR vetting fee per event. RelayKit absorbs this cost as part of the rejection handling service included in the $199 setup fee. Each resubmission adds ~$15 to COGS for that registration. Monitor `resubmission_count` per registration — use cases or intake patterns with high rejection rates are both a template quality signal and a margin risk flag. Target: <5% of registrations require resubmission.

### BYO Twilio Registration (one-time)
| Item | Amount |
|------|--------|
| Revenue | $199 |
| Twilio brand + campaign fees | $0 (charged to their account) |
| Stripe processing (3%) | ~$5.97 |
| Compliance site hosting (ongoing) | ~$0.50/month |
| Support/review time | $7.50–15 |
| **Gross profit** | **~$178–185** |
| **Gross margin** | **~89–93%** |

> BYO has BETTER margins than full-stack because Twilio registration fees are charged to their account (not ours), no phone number rental, no proxy infrastructure, no ongoing monitoring. Only cost is Stripe processing, compliance site hosting (minimal), and one-time support time.

### Full-Stack Monthly Subscription
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
| BYO (no monthly) | $199 | $0 | $0 | $199 |
| BYO → full-stack upgrade (month 3) | $199 | $171** | $68 | $438 |

*Scale user benefits from volume tapering at 5k+
**9 months at $19/month after upgrade

### Revenue Targets
| Milestone | Full-Stack Customers | BYO Customers | Setup Rev | MRR (base) | Est. Overage MRR | Total Annual |
|-----------|---------------------|---------------|-----------|-----------|-----------------|-------------|
| Validation | 40 | 10 | $9,950 | $760 | ~$160 | ~$21,030 |
| Traction | 400 | 100 | $99,500 | $7,600 | ~$2,400 | ~$221,500 |
| Scale | 1,600 | 400 | $398,000 | $30,400 | ~$12,000 | ~$907,200 |

> Revenue targets assume ~80% full-stack / ~20% BYO split. BYO customers contribute setup revenue only (until they upgrade). Platform tier revenue not included — it's additive when Phase 2 launches.

---

## 7. CC IMPLEMENTATION NOTES

### What CC needs to build for Stripe (in order):
1. Stripe product + price creation (can be done via Stripe Dashboard or API seed script)
2. `POST /api/checkout` — creates Subscription checkout session (full-stack) OR Payment checkout session (BYO) based on tier parameter
3. `POST /api/webhooks/stripe` — handles `checkout.session.completed`, `invoice.payment_failed`, `customer.subscription.deleted`
4. Customer record stores: `stripe_customer_id`, `stripe_subscription_id` (nullable for BYO), `subscription_status`, `tier` ('full_stack' | 'byo')
5. Basic usage counter: increment on each outbound message (proxy integration point, full-stack only)
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
stripe_subscription_id TEXT,       -- NULL for BYO customers
subscription_status TEXT DEFAULT 'active',
-- CHECK (subscription_status IN ('active', 'past_due', 'suspended', 'cancelled', 'churned', 'byo_active'))
tier TEXT DEFAULT 'full_stack',
-- CHECK (tier IN ('sandbox', 'full_stack', 'byo'))

-- New table for usage tracking (full-stack only)
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

### BYO-Specific Implementation Notes — Phase 2 (do not build)

> **Phase 2 — do not build.** These notes describe BYO Twilio Stripe integration for future reference.

- BYO checkout is simpler: one-time `payment` mode, no subscription
- BYO customers store Twilio credentials encrypted (Supabase Vault) during registration pipeline only
- Credentials discarded after registration completes — add `twilio_credentials_purged_at` timestamp
- BYO registration creates a Primary Customer Profile in THEIR Trust Hub (different API path than full-stack Secondary Profile under our ISV)
- BYO customers get `tier: 'byo'` and `subscription_status: 'byo_active'` — no subscription lifecycle to manage
- Compliance site hosting continues indefinitely for BYO (negligible cost, important for carrier audits)
