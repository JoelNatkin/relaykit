# PRICING MODEL UPDATE
## RelayKit — Managed SMS Compliance Infrastructure with Free Sandbox
### Version 5.0 — April 2, 2026

> **This document replaces pricing sections in PROJECT_OVERVIEW.md, PRD_01 Section 5, and PRD_07 Sections 2 & 4. Feed this to CC alongside the relevant PRD when building Stripe integration.**
>
> **CHANGE LOG (v5.0):** Marketing registration bundled with transactional — both campaigns submit at registration, no separate add-on (D-294). Marketing add-on pricing removed. Monthly tier distinction ($19 transactional vs $29 mixed) collapsed — single subscription tier, final price TBD. Compliance enforcement moved to authoring time; runtime three-tier enforcement removed (D-293). Proxy reframed as delivery engine. Sandbox updated: all namespaces including marketing available, sends to verified phones only (D-294, D-298). SDK and raw API documented as equal entry points (D-296). New tables use project_id, not user_id (D-299).
>
> **CHANGE LOG (v4.0):** Registration fee restructured: $49 at submission + $150 customer-initiated at approval (D-193, D-194, D-216). Beta pricing added: $49 flat, capped slots (D-196). Carrier layer changed from Twilio to Sinch (D-215). Delivery model locked: SDK (`npm install relaykit`) replaces file downloads (D-266). Website is message authoring surface (D-279). Sandbox tier updated to reflect SDK-first experience. Unit economics updated for fee split and Sinch. All references to "build spec" and "deliverable file" updated to reflect SDK delivery model.
>
> **CHANGE LOG (v3.0):** Free sandbox tier updated with message plan builder, build spec generator, sandbox SMS_GUIDELINES.md, and message library. BYO Twilio tier rewritten as Model 2 (registration submitted to customer's own Twilio account, not through our ISV). Platform tier pricing direction added (Phase 2 placeholder). All core pricing numbers unchanged: $199/$19/$15.
>
> **CHANGE LOG (v2.0):** Added free sandbox tier. Compliance Shield paid tier ($29/month) removed — drift detection is now baseline for all customers. BYO Twilio tier added for Phase 2. Infrastructure costs updated to include proxy + Redis.

---

## DECISION SUMMARY

RelayKit has four tiers, one pricing structure, and no paywalled compliance features.

| Tier | Price | What it is |
|------|-------|-----------|
| **Sandbox** | Free | Instant API key, SDK or API access, full testing including marketing, message authoring, no time limit. Verified phones only (D-298). |
| **Full-Stack Setup** | $49 at submission + $150 at approval | 10DLC registration via Sinch — both transactional and marketing campaigns submitted (D-294), compliance site, all artifacts |
| **Full-Stack Monthly** | $19/month (TBD — may adjust for bundled marketing) | Live messaging through delivery proxy, 500 messages included |
| **BYO Twilio** (Phase 2) | $199 one-time | Registration submitted to customer's own Twilio account, no monthly |
| **Platform** (Phase 2) | Per-tenant pricing | SaaS platforms registering their tenants (see Section 3B) |

Everything a customer needs to stay compliant is included in full-stack. No upsells, no tiered protection. Marketing is bundled, not an add-on.

### Beta Pricing (D-196)
Beta users pay **$49 flat** for registration — no $150 approval payment. Framed as early access pricing. Beta users keep their registration at full pricing launch. Capped at 25–50 slots for natural urgency and clean cutover. Beta access requires completing a prototype user test session (D-197).

---

## 1. FREE SANDBOX TIER

### What's included (no credit card, no time limit)

- Sandbox API key (`rk_sandbox_` prefix) — instant on signup
- **SDK access** — `npm install relaykit` with sandbox key, same API surface as production
- **Raw API access** — `POST /v1/messages` with sandbox key, same endpoints as SDK. SDK and API are equal paths (D-296).
- **All namespaces including marketing** — full message library available from day one, not gated (D-294)
- Outbound messages to verified phone numbers only (100/day limit) — no sending to real end users without registration (D-298)
- Inbound message forwarding (replies from verified number)
- Opt-out testing (STOP/START keyword handling)
- Compliance checks at authoring time — real-time validation on the website (D-293)
- Dashboard with API key, verified phone, usage counter
- **Message authoring on website** — use case selection, 5–8 compliant message templates per use case, inline editing with compliance indicators (D-279, D-281)
- **Custom message authoring** — developer-authored messages beyond curated library, compliance pre-review on save (D-280)
- **SMS_GUIDELINES.md** — compliance co-pilot document for the developer's project, use-case-specific (D-283)
- **Message library** — curated messages with copy icons and compliance indicators

### How it works with the SDK (D-266, D-279)

The sandbox works with the SDK or the raw API — both are equal paths to the same experience (D-296). Developer picks a use case on the website, previews and optionally edits messages (including marketing messages), then either runs `npm install relaykit` or makes direct API calls with their sandbox key. The SDK reads the sandbox API key from `.env` and provides per-vertical namespace functions (e.g., `relaykit.appointments.sendConfirmation()`). Message content lives on RelayKit's servers, tied to the developer's API key — the SDK sends semantic events, the server composes the actual SMS from the developer's saved templates. The developer's codebase never contains message text.

No-code/low-code builders using Lovable, Bolt, or Replit skip the SDK and call `POST /v1/messages` directly. Same templates, same compliance, same results (D-296, D-297).

### Purpose

The sandbox is customer acquisition. Developers build their entire SMS integration for free, with a real working SDK, before paying anything. By the time they register, they've already invested time in the integration — the payment is to go live, not to start building.

The SDK + curated message library captures domain knowledge (compliance rules, message patterns, trigger logic) that developers would otherwise spend hours researching. It's the reason they choose RelayKit over direct Sinch/Twilio integration, even before they know about the compliance proxy.

### Costs to RelayKit

- Shared sandbox phone number: ~$1.15/month
- Per-message carrier cost: ~$0.0079/segment
- SDK hosting/npm: negligible
- At 100 active sandbox developers sending 50 messages/day: ~$40/day carrier cost
- This is customer acquisition cost, cheaper than any paid channel

### Conversion path

Sandbox → Use case selection → Message authoring on website (all namespaces including marketing) → `npm install relaykit` or direct API integration → Integration built → Engagement signals met → Registration CTA → Intake wizard (pre-populated from dashboard work) → Stripe checkout ($49) → Both transactional and marketing campaigns submitted (D-294) → Transactional approval → Developer-initiated $150 payment → Live (marketing follows when its campaign clears)

> **Conversion psychology:** The SDK + message library is what makes the sandbox sticky. Developers invest time customizing messages (including marketing messages) and wiring up namespace functions. By the time they want to go live, switching to another provider means rebuilding the entire integration. The SDK is the moat. For no-code builders, the website authoring surface and API key are the equivalent lock-in (D-296, D-297).

---

## 2. PRICING STRUCTURE (Full-Stack Tier)

### Registration Fee — Two-Part Payment (D-193, D-194, D-216)
- **$49 at registration submission** — covers brand + both campaign submissions (transactional + marketing) to Sinch/TCR (D-294)
- **$150 at carrier approval** — customer-initiated, not auto-charged (D-194)
- **Full $49 refund if registration is rejected**
- **User-facing display (D-216):** Pricing cards show "$199 to register + $19/mo" as the headline. Feature bullet explains: "$49 to register. $150 only after you're approved. Full refund if not."
- **Total registration cost: $199** ($49 + $150)

### Monthly Subscription (Required)
- **$19/month** — starts after registration approval. Billed monthly.

> **Pricing note (D-294):** The previous $19/month (transactional) vs $29/month (mixed) distinction has been eliminated. Marketing is bundled at registration — every customer gets both campaigns. The base monthly price may need adjustment to absorb the additional carrier costs of a second campaign. TBD pending Sinch fee confirmation. For now, assume $19/month as the floor.

- Includes:
  - 500 SMS segments per month (combined pool — transactional + marketing)
  - Phone number rental
  - Delivery proxy (template lookup, interpolation, carrier send, opt-out enforcement, quiet hours, rate limiting) (D-293)
  - Recipient-level marketing consent enforcement at proxy (marketing messages to recipients without explicit opt-in are blocked)
  - Message preview endpoint (validate templates before sending)
  - Compliance site hosting (kept live and audit-ready, includes marketing consent language from day one)
  - Trust score monitoring
  - Campaign status visibility
  - Carrier regulation change tracking

### Multi-Project Billing (Phase 2 — PRD_11)
Each registered project carries its own subscription. One customer with multiple registered projects pays per project:
- $49 + $150 registration fees per project
- $19/month per registered project (marketing included — D-294, final price TBD)
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

> **Note (D-294):** These numbers assume $19/month base. If the monthly price adjusts to absorb bundled marketing costs, update this table accordingly.

### Volume Tapering (Gentle, Not Aggressive)
At higher volumes, block pricing decreases slightly:
- 1,000–5,000 → $15 per 1,000
- 5,001–20,000 → $13 per 1,000
- 20,000+ → Custom pricing (contact us)

> **Rationale:** Heavy users increase carrier exposure and complaint risk. Margins must be maintained, not compressed. This is risk pricing, not commodity pricing.

### Abuse Safeguard Ceiling
- Hard daily cap: 20,000 messages/day (invisible to normal users)
- Triggers automatic review + alert to RelayKit admin
- Protects master Sinch account from runaway loops or abuse
- Customer notified if ceiling hit: "Unusual activity detected. Contact support."

---

## 3. BYO TWILIO TIER

> **Phase 2 — do not build.** Registration-as-a-service for developers who have their own Twilio account and want to handle messaging directly through Twilio. Retained as a future entry point and upgrade path.

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
2. Experience the SDK, message authoring, compliance tools
3. Upgrade to full RelayKit: $19/month
4. We create a subaccount under our Sinch ISV, port their number, issue RelayKit API key
5. They swap their Twilio credentials for the RelayKit SDK (`npm install relaykit`)
6. The $199 they already paid covers the setup — no second setup fee

> **Key revenue insight:** BYO is an entry point, not a dead end. The $199 is the same whether they go full-stack or BYO. Upgrading adds the monthly subscription. Dashboard upsell: "Want automatic compliance protection? Switch to RelayKit's managed API — same code, one key swap."

---

## 3B. PLATFORM TIER (Phase 2 — Directional Pricing)

> **Status:** Phase 2 placeholder. These numbers are subject to market validation. Do NOT build pricing infrastructure for this tier yet. See PRD_10_PLATFORM_TIER.md for full product concept.

### Concept

SaaS platforms register their tenants' businesses through RelayKit's API. Each tenant gets individual 10DLC registration, compliance site, phone number, and compliance site hosting — orchestrated by the platform programmatically rather than by individuals through the intake wizard.

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

### Checkout Flow (Full-Stack) — Two-Part Payment (D-193, D-194)

**Part 1: Registration Submission ($49)**
1. Customer clicks "Register now" on dashboard
2. Frontend calls `POST /api/checkout` with `{ step: 'submission' }`
3. Backend creates a **Stripe Checkout Session** in `payment` mode:
   - **Line item:** Registration submission fee — $49.00 one-time
   - Customer email pre-filled from sandbox account
   - `payment_method_collection: 'always'` (card saved for future $150 + subscription)
   - Success URL: `relaykit.ai/dashboard?session_id={CHECKOUT_SESSION_ID}`
   - Cancel URL: `relaykit.ai/register`
   - Metadata: `{ customer_id: "{id}", step: "submission" }`
4. Customer completes payment — **$49 charged at checkout**
5. Redirects to dashboard — registration pipeline begins

**Part 2: Approval Payment ($150 + subscription start)**
1. Developer receives approval notification (email + dashboard)
2. Developer clicks "Go live" on dashboard (customer-initiated, not auto-charged — D-194)
3. Frontend calls `POST /api/checkout` with `{ step: 'approval' }`
4. Backend creates a **Stripe Checkout Session** in `subscription` mode:
   - **Line item 1:** Go-live fee — $150.00 one-time
   - **Line item 2:** Monthly subscription — $19.00/month recurring (includes both transactional and marketing — D-294)
   - Card pre-filled from saved payment method
   - Success URL: `relaykit.ai/dashboard?session_id={CHECKOUT_SESSION_ID}`
   - Metadata: `{ customer_id: "{id}", step: "approval" }`
5. Stripe charges $150 + first month $19 = **$169 at approval checkout**
6. Redirects to dashboard — sandbox key swaps for live key

**Rejection: $49 refund**
- If registration is rejected, full $49 refund issued automatically
- Dashboard shows rejection debrief with resubmission guidance
- Resubmission follows the same $49 checkout flow

**Beta checkout (D-196):**
- Single payment: $49 flat, no second payment
- No subscription created until post-beta conversion
- Metadata: `{ customer_id: "{id}", step: "submission", beta: true }`

### Checkout Flow (BYO Twilio) — Phase 2 (do not build)

> **Phase 2 — do not build.** This section describes the BYO Twilio checkout flow for future reference. Do not implement BYO checkout mode in v1.

1. Customer clicks "Register" from BYO intake flow
2. Frontend calls `POST /api/checkout` with `{ tier: 'byo' }`
3. Backend creates a **Stripe Checkout Session** in `payment` mode (one-time, no subscription):
   - **Line item:** Setup fee — $199.00 one-time
   - Customer email pre-filled
   - `payment_method_collection: 'if_required'`
   - Success URL: `relaykit.ai/dashboard?session_id={CHECKOUT_SESSION_ID}`
   - Cancel URL: `relaykit.ai/start/review`
   - Metadata: `{ intake_session_id: "{id}", customer_id: "{id}", tier: "byo" }`
4. Stripe charges **$199 at checkout** — no recurring billing
5. Redirects to dashboard

### Stripe Product Configuration
```
Product: "RelayKit Registration Submission"
  Price 1: $49.00 USD — one-time submission fee

Product: "RelayKit Go Live"
  Price 1: $150.00 USD — one-time approval fee

Product: "RelayKit SMS Infrastructure"
  Price 1: $19.00 USD/month — base subscription, includes transactional + marketing (D-294, final price TBD)

Product: "RelayKit Message Block"
  Price 1: $15.00 USD — one-time (used for metered overage billing)
  Price 2: $13.00 USD — one-time (volume tier, 5k+)

Product: "RelayKit BYO Registration" (Phase 2)
  Price 1: $199.00 USD — one-time (BYO Twilio setup)
```

### Webhook Handling

**`checkout.session.completed` (submission step):**
1. Verify signature
2. Look up customer_id from metadata
3. Mark registration as `submitted`, store payment reference
4. Trigger registration pipeline (brand registration → campaign submission via Sinch)
5. Store Stripe customer_id on customer record, save payment method for future charges

**`checkout.session.completed` (approval step):**
1. Verify signature
2. Look up customer_id from metadata
3. Mark registration as `live`
4. Store subscription_id on customer record
5. Swap sandbox API key for live key
6. Enable production message delivery

**`invoice.payment_failed`** — full-stack only:
1. Mark customer as `payment_past_due`
2. Send email: "Your payment failed. Update your card to keep SMS active."
3. Grace period: 7 days before suspension
4. After grace: pause messaging (messages queue but don't send)

**`customer.subscription.deleted`** — full-stack only:
1. Mark customer as `churned`
2. Pause messaging
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
  → SUBMISSION CHECKOUT → submitted ($49 charged, registration pipeline starts)
    → APPROVED → APPROVAL CHECKOUT → live ($150 + $19/mo charged)
      → payment_past_due (card fails on renewal)
        → 7-day grace period
        → suspended (messaging paused)
        → reactivated (card updated) OR churned (30 days no payment)
      → cancelled (customer cancels)
        → messaging paused immediately
        → compliance site stays live 30 days
        → data retained 90 days
        → sandbox continues to work (they can still test)
    → REJECTED → $49 refunded
      → resubmission available (another $49 checkout)

  → BETA CHECKOUT → submitted ($49 charged, no approval payment)
    → APPROVED → live (no $150, no subscription until post-beta)

  → BYO CHECKOUT (Phase 2) → byo_active ($199 charged, no subscription)
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
1. You pay $49 to submit your registration
2. We submit to US carriers — usually a few days (via Sinch)
3. Your sandbox keeps working while you wait
4. On approval, pay $150 to go live — same code, same API
   Full refund on the $49 if not approved.

YOUR PLAN
$49 registration fee (now) + $150 go-live fee (after approval)
$19/month includes 500 messages, phone number, delivery proxy
Transactional messages go live first. Marketing follows shortly.
Additional messages: $15 per 1,000 (auto-scales, no interruption)
```

> Updated from v3.0 to reflect D-193 fee split, D-215 Sinch timeline, and D-194 customer-initiated second payment.

---

## 6. UPDATED UNIT ECONOMICS

### Sinch Fee Schedule (estimated, pending ISV tier confirmation — D-271)
| Item | Estimated Cost | Notes |
|------|---------------|-------|
| Brand registration | ~$4.50 | TCR fee, same regardless of carrier |
| Campaign vetting | ~$15.00 | TCR fee |
| Phone number | ~$1.00/mo | Sinch pricing may differ slightly from Twilio |
| Campaign monthly fee | ~$1.50–$10/mo | Varies by use case |

> **Note:** Sinch fee schedule needs confirmation once ISV/reseller account is upgraded from trial (D-271). TCR fees are carrier-agnostic. Phone number and platform fees may differ. Update this section when Sinch production pricing is confirmed.

### Full-Stack Registration (two-part payment)
| Item | Typical Customer | High Volume Standard |
|------|-----------------|---------------------|
| Revenue ($49 + $150) | $199 | $199 |
| Sinch/TCR brand + campaign | ~$19.50 | ~$61.00 |
| Stripe processing (3% × 2 transactions) | ~$7.11 | ~$7.11 |
| Support/review time | $7.50–15 | $7.50–15 |
| **Gross profit** | **~$162–170** | **~$116–124** |
| **Gross margin** | **~81–85%** | **~58–62%** |

> **Note on two-transaction Stripe fees:** Two separate charges ($49 + $169) have slightly higher total processing cost than a single $218 charge (~$7.11 vs ~$6.54). The ~$0.57 difference is trivial relative to the conversion benefit of the split payment structure.

> **Note (D-294):** These economics now include a second campaign submission (marketing). Estimated additional TCR cost: ~$15 campaign vetting fee. This slightly reduces gross margin on registration. Updated numbers TBD pending Sinch fee confirmation. Estimated impact: gross profit drops by ~$15 per registration, gross margin drops ~7-8 percentage points.

> **Re-vetting fee policy:** Campaign resubmissions after rejection incur a non-refundable $15 TCR vetting fee per event. RelayKit absorbs this cost as part of the rejection handling service. Each resubmission adds ~$15 to COGS for that registration. Monitor `resubmission_count` per registration — use cases or intake patterns with high rejection rates are both a template quality signal and a margin risk flag. Target: <5% of registrations require resubmission.

### Beta Registration (D-196)
| Item | Amount |
|------|--------|
| Revenue | $49 |
| Sinch/TCR brand + campaign | ~$19.50 |
| Stripe processing (3%) | ~$1.47 |
| Support/review time | $7.50–15 |
| **Gross profit** | **~$13–21** |
| **Gross margin** | **~27–42%** |

> Beta is intentionally low-margin. The value is user testing feedback and early proof points, not revenue. Capped at 25–50 slots.

### BYO Twilio Registration (one-time) — Phase 2
| Item | Amount |
|------|--------|
| Revenue | $199 |
| Twilio brand + campaign fees | $0 (charged to their account) |
| Stripe processing (3%) | ~$5.97 |
| Compliance site hosting (ongoing) | ~$0.50/month |
| Support/review time | $7.50–15 |
| **Gross profit** | **~$178–185** |
| **Gross margin** | **~89–93%** |

> BYO has BETTER margins than full-stack because carrier registration fees are charged to their account (not ours), no phone number rental, no proxy infrastructure, no ongoing monitoring. Only cost is Stripe processing, compliance site hosting (minimal), and one-time support time.

### Full-Stack Monthly Subscription
| Item | Low Use Case | High Use Case |
|------|-------------|------------------------|
| Revenue (base) | $19.00 | $19.00 |
| Phone number rental | ~$1.00 | ~$1.00 |
| Sinch campaign monthly fee | ~$1.50 | ~$10.00 |
| Compliance site hosting | ~$0.50 | ~$0.50 |
| Proxy + Redis infrastructure | ~$1.00 | ~$1.00 |
| Drift detection (Claude API sampling) | ~$0.25 | ~$0.25 |
| Message cost (500 × $0.01 blended) | ~$5.00 | ~$5.00 |
| Stripe processing (3%) | ~$0.57 | ~$0.57 |
| **Monthly gross profit** | **~$9.18** | **~$0.68** |
| **Monthly gross margin** | **~48%** | **~4%** |

> **⚠️ Note (D-294):** All customers now have marketing included. The higher carrier cost column (previously "mixed") applies to any customer actively using marketing messages, which increases Sinch campaign monthly fees (~$10 vs ~$1.50). At 500 included messages, high-use marketing customers are roughly breakeven. Margin comes from: (1) most customers won't use all 500 messages every month, (2) overage kicks in earlier, and (3) many customers will use marketing lightly or not at all, staying in the low-cost column despite having access.

### Message Block Revenue
| Item | Amount |
|------|--------|
| Revenue per 1,000 block | $15.00 |
| Message cost (1,000 × $0.01) | ~$10.00 |
| **Gross profit per block** | **~$5.00** |
| **Gross margin** | **~33%** |

### Customer LTV Model (12-month retention)
| Scenario | Setup ($49+$150) | Monthly × 12 | Overage | Total LTV |
|----------|-----------------|-------------|---------|-----------|
| Light user (250 msg/mo) | $199 | $228 | $0 | $427 |
| Typical user (1,000 msg/mo) | $199 | $228 | $90 | $517 |
| Growth user (3,000 msg/mo) | $199 | $228 | $360 | $787 |
| Scale user (10,000 msg/mo) | $199 | $228 | $1,620* | $2,047 |
| Beta user (12-month, typical) | $49 | $228 | $90 | $367 |
| BYO (no monthly) | $199 | $0 | $0 | $199 |
| BYO → full-stack upgrade (month 3) | $199 | $171** | $68 | $438 |

*Scale user benefits from volume tapering at 5k+
**9 months at $19/month after upgrade

> **Note (D-294):** LTV model assumes $19/month base. If monthly price adjusts for bundled marketing, update accordingly. Marketing-heavy customers may have higher carrier costs but the same subscription revenue — monitor margin per customer segment.

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
1. Stripe product + price creation (can be done via Stripe Dashboard or API seed script) — note: now 4 products instead of 3 (submission fee, go-live fee, monthly, message block)
2. `POST /api/checkout` — accepts `{ step: 'submission' | 'approval', beta?: boolean }` for full-stack, `{ tier: 'byo' }` for BYO (Phase 2)
3. `POST /api/webhooks/stripe` — handles `checkout.session.completed` (with step differentiation), `invoice.payment_failed`, `customer.subscription.deleted`
4. Customer record stores: `stripe_customer_id`, `stripe_subscription_id` (nullable until approval), `subscription_status`, `tier` ('full_stack' | 'byo'), `registration_step` ('submitted' | 'approved' | 'rejected' | 'live')
5. Refund logic: auto-refund $49 on registration rejection
6. Basic usage counter: increment on each outbound message (proxy integration point, full-stack only)
7. **v1 decision point:** If metered billing is complex, launch with hard cap at 500 and manual upgrade. Add auto-scaling in phase 2.

### Environment Variables (add to .env)
```
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_SUBMISSION_PRICE_ID=price_...     # $49 one-time
STRIPE_GOLIVE_PRICE_ID=price_...         # $150 one-time
STRIPE_MONTHLY_PRICE_ID=price_...        # $19/month
STRIPE_MESSAGE_BLOCK_PRICE_ID=price_...  # $15 per 1k
```

### Database Additions
```sql
-- Add to customers table
stripe_customer_id TEXT,
stripe_subscription_id TEXT,       -- NULL until approval payment
subscription_status TEXT DEFAULT 'sandbox',
-- CHECK (subscription_status IN ('sandbox', 'submitted', 'approved', 'live', 'past_due', 'suspended', 'cancelled', 'churned', 'byo_active'))
-- NOTE (D-299): New tables should use project_id instead of customer_id for ownership. Existing schema is acceptable but will be migrated when multi-user support is built.
tier TEXT DEFAULT 'sandbox',
-- CHECK (tier IN ('sandbox', 'full_stack', 'byo'))
-- NOTE (D-294): 'mixed' tier eliminated. All full_stack customers have marketing included.
registration_step TEXT,
-- CHECK (registration_step IN ('submitted', 'approved', 'rejected', 'live'))
is_beta BOOLEAN DEFAULT FALSE,
submission_payment_id TEXT,        -- Stripe PaymentIntent ID for $49
approval_payment_id TEXT,          -- Stripe PaymentIntent ID for $150

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
