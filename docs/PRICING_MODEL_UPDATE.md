# PRICING MODEL UPDATE
## RelayKit — From One-Time to Recurring Infrastructure
### Updated Feb 28, 2026

> **This document replaces pricing sections in PROJECT_OVERVIEW.md, PRD_01 Section 5, and PRD_07 Sections 2 & 4. Feed this to CC alongside the relevant PRD when building Stripe integration.**

---

## DECISION SUMMARY

RelayKit is no longer a one-time registration service. It is managed SMS compliance infrastructure with recurring billing.

**Old model:** $199 one-time. Done.
**New model:** $199 setup + $19/month subscription with auto-scaling message blocks.

---

## 1. PRICING STRUCTURE

### One-Time Setup Fee
- **$199** — covers 10DLC registration, compliance site generation, all artifacts, Twilio submission, rejection handling, and integration kit delivery

### Monthly Subscription (Required)
- **$19/month** — billed monthly, starts after registration approval
- Includes:
  - 1,000 SMS segments per month
  - Phone number rental
  - Compliance site hosting (kept live and audit-ready)
  - Baseline compliance monitoring (8 rules per message)
  - Trust score monitoring
  - Campaign status visibility
  - Carrier regulation change tracking

### Auto-Scaling Message Blocks
- When usage exceeds 1,000 messages, additional blocks are added automatically
- **$15 per additional 1,000 messages**
- No service interruption — messages keep sending
- Blocks added in real-time as usage crosses thresholds
- Requires valid payment method on file (enforced at checkout)

### Monthly Billing Example
| Usage | Monthly Bill | Effective Rate |
|-------|-------------|----------------|
| 0–1,000 | $19 | 1.9¢/msg |
| 1,001–2,000 | $34 | 1.7¢/msg |
| 2,001–3,000 | $49 | 1.6¢/msg |
| 3,001–4,000 | $64 | 1.6¢/msg |
| 5,000 | $79 | 1.6¢/msg |
| 10,000 | $154 | 1.5¢/msg |

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

## 2. STRIPE IMPLEMENTATION (Replaces PRD_01 Section 5)

### Checkout Flow
1. Customer clicks "Start my registration" on Screen 3 (Review & Confirm)
2. Frontend calls `POST /api/checkout`
3. Backend creates a **Stripe Checkout Session** in `subscription` mode with:
   - **Line item 1:** Setup fee — $199.00 one-time (using `price_data` with `recurring: null` or a one-time Stripe Price)
   - **Line item 2:** Monthly subscription — $19.00/month recurring (Stripe Price object)
   - Customer email pre-filled from intake
   - `payment_method_collection: 'always'` (required for future overage billing)
   - Success URL: `relaykit.com/dashboard?session_id={CHECKOUT_SESSION_ID}`
   - Cancel URL: `relaykit.com/start/review`
   - Metadata: `{ intake_session_id: "{id}" }`
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
3. Create customer + registration records
4. Trigger artifact generation pipeline
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
- At end of billing cycle (or triggered by threshold crossing), create Stripe Invoice Items for overage blocks
- Use Stripe's `usage_record` API on a metered price, OR simply create one-time invoice items — decide during build based on what's simpler
- **v1 simplification:** If metered billing is too complex for launch, hard-cap at 1,000 and require manual plan upgrade. Add auto-scaling in week 3. Flag this decision for Joel.

### Subscription Lifecycle
```
CHECKOUT → active (subscription created, $199 + $19 charged)
  → payment_past_due (card fails on renewal)
    → 7-day grace period
    → suspended (messaging paused)
    → reactivated (card updated) OR churned (30 days no payment)
  → cancelled (customer cancels)
    → messaging paused immediately  
    → compliance site stays live 30 days
    → data retained 90 days
```

---

## 3. SCREEN 3 PREVIEW CARD UPDATE

The Review & Confirm screen (Screen 3) preview card currently shows:
```
WHAT HAPPENS NEXT
1. You pay $199
2. We submit your registration...
3. You get an integration kit...
```

**Replace with:**
```
WHAT HAPPENS NEXT
1. You pay $199 setup + $19/month
2. We submit your registration to US carriers (usually 3–10 days)
3. You get an integration kit with live credentials and compliance co-pilot
4. Your SMS infrastructure stays live, monitored, and compliant

YOUR PLAN
$199 one-time setup
$19/month includes 1,000 messages, phone number, compliance hosting & monitoring
Additional messages: $15 per 1,000 (auto-scales, no interruption)
```

---

## 4. LANDING PAGE PRICING UPDATE (Replaces PRD_07 Section 4)

### Section 4: What You Get
```
$199 setup + $19/month. Everything included.

SETUP ($199 one-time)
✓ 10DLC carrier registration (90%+ first-time approval rate)
✓ Compliance website with privacy policy, terms, and opt-in page
✓ AI-native integration kit — drop two files in your project and go
✓ Industry-specific compliance co-pilot (17 verticals)
✓ Rejection handling — we fix and resubmit

MONTHLY ($19/month)
✓ 1,000 SMS messages included
✓ Dedicated phone number
✓ Compliance site hosting (always live, always audit-ready)
✓ Message compliance monitoring (every message scanned)
✓ Trust score & campaign status monitoring
✓ Carrier regulation change alerts

NEED MORE MESSAGES?
Grows in predictable $15 steps per 1,000 messages.
No service interruption. No surprise bills. No contracts.
```

### FAQ Updates
```
Q: What does $19/month cover?
A: Your phone number, 1,000 messages, compliance site hosting, and 
ongoing monitoring that keeps your SMS channel safe and approved. 
Think of it as managed SMS infrastructure — you build, we keep 
the carrier compliance handled.

Q: What if I send more than 1,000 messages?
A: We automatically add message blocks at $15 per 1,000. No 
interruption, no surprise bills — just predictable $15 steps 
as your app grows.

Q: Can I cancel?
A: Yes, anytime. No contracts. If you cancel, messaging stops 
but your compliance site stays live for 30 days.

Q: What ongoing costs are there beyond RelayKit?
A: None. Phone number rental and carrier fees are included in 
your $19/month. You don't need a Twilio account.
```

> **Note:** Remove the old FAQ answer that says "Twilio charges per-message fees... RelayKit's fee is one-time." This is no longer accurate.

---

## 5. UPDATED UNIT ECONOMICS

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
| Monitoring infrastructure | ~$1.00 | ~$1.00 |
| Message cost (1,000 × $0.01 blended) | ~$10.00 | ~$10.00 |
| Stripe processing (3%) | ~$0.57 | ~$0.57 |
| **Monthly gross profit** | **~$4.28** | **~($4.22)** |
| **Monthly gross margin** | **~23%** | **negative** |

> **⚠️ Important:** For marketing/mixed use cases, the $19/month base barely breaks even or loses money when including 1,000 messages. The margin comes from two places: (1) most customers won't use all 1,000 messages every month, and (2) message block overage ($15/1k) carries ~33% margin. Monitor this closely. If marketing-heavy customers cluster, consider whether marketing use cases should be on a higher base tier in a future pricing revision.

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
| Light user (500 msg/mo) | $199 | $228 | $0 | $427 |
| Typical user (1,000 msg/mo) | $199 | $228 | $0 | $427 |
| Growth user (3,000 msg/mo) | $199 | $228 | $360 | $787 |
| Scale user (10,000 msg/mo) | $199 | $228 | $1,620* | $2,047 |

*Scale user benefits from volume tapering at 5k+

> **Note:** LTV does not change from previous version because the Twilio fee correction affects one-time registration cost (already captured in setup) and monthly campaign fee (absorbed into the $19 base). The customer-facing pricing is unchanged.

### Revenue Targets (Updated)
| Milestone | Customers | Setup Rev | MRR (base) | Est. Overage MRR | Total Annual |
|-----------|----------|-----------|-----------|-----------------|-------------|
| Validation | 50 | $9,950 | $950 | ~$200 | ~$23,750 |
| Traction | 500 | $99,500 | $9,500 | ~$3,000 | ~$249,500 |
| Scale | 2,000 | $398,000 | $38,000 | ~$15,000 | ~$1,034,000 |

---

## 6. PRD_04 FEE TABLE CORRECTION

PRD_04 Section 2 has an outdated Twilio fee structure. Replace the fee table with:

```
### Twilio fee structure (pass-through costs per customer)
| Item | Cost | Frequency |
|------|------|-----------|
| Brand registration (sole prop) | $4.50 | One-time |
| Brand registration (low volume standard) | $4.50 | One-time |
| Brand registration (standard, includes vetting) | $46.00 | One-time |
| Campaign vetting | $15.00 | One-time |
| Phone number | ~$1.15/month | Recurring |
| Campaign fee | $1.50–$10.00/month | Recurring (varies by use case) |
| **Total initial (sole prop / low vol standard)** | **~$20.65** | — |
| **Total initial (standard)** | **~$62.15** | — |
| **Total recurring** | **~$2.65–$11.15/mo** | — |
```

> **Note:** Secondary vetting is now bundled into the $46 Standard Brand fee (as of Aug 2025). It is no longer a separate $41.50 charge. Remove all references to "Standard vetting: $41.50" from PRD_04.

---

## 7. PROJECT_OVERVIEW.md UPDATES

### Decisions Made — Replace pricing entry:
```
- **Pricing:** $199 one-time setup + $19/month subscription (1,000 messages 
  included, auto-scaling $15 blocks). Volume tapering at 5k+ messages.
```

### Explicitly NOT in v1 — Remove this line:
```
- Recurring subscription billing  ← REMOVE THIS, it's now in v1
```

### Add to v1 scope:
```
- Stripe subscription billing (setup fee + monthly recurring)
- Basic usage tracking per customer per billing period
- Payment failure handling with 7-day grace period
```

---

## 8. COMPLIANCE SHIELD — UNCHANGED

Compliance Shield ($29/month) remains a **post-launch** upsell layered on top of the base $19/month subscription. It adds Claude-powered semantic drift analysis and weekly reports. No changes needed to PRD_08.

When Compliance Shield launches, customers on $19/month who upgrade effectively pay $48/month ($19 base + $29 Shield). This should be presented as a single upgrade, not a confusing stack.

---

## 9. CC IMPLEMENTATION NOTES

### What CC needs to build for Stripe (in order):
1. Stripe product + price creation (can be done via Stripe Dashboard or API seed script)
2. `POST /api/checkout` — creates Subscription checkout session with one-time setup fee
3. `POST /api/webhooks/stripe` — handles `checkout.session.completed`, `invoice.payment_failed`, `customer.subscription.deleted`
4. Customer record stores: `stripe_customer_id`, `stripe_subscription_id`, `subscription_status`
5. Basic usage counter: increment on each outbound message (PRD_04/PRD_08 integration point)
6. **v1 decision point:** If metered billing is complex, launch with hard cap at 1,000 and manual upgrade. Add auto-scaling in phase 2.

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
