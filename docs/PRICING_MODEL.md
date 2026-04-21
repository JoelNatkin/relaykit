# PRICING MODEL UPDATE
## RelayKit — Managed SMS Compliance Infrastructure with Free Sandbox
### Version 6.0 — April 8, 2026

> **This document replaces pricing sections in PROJECT_OVERVIEW.md, PRD_01 Section 5, and PRD_07 Sections 2 & 4. Feed this to CC alongside the relevant PRD when building Stripe integration.**
>
> **CHANGE LOG (v6.0):** Registration simplified to $49 flat fee — no $150 go-live payment, no two-part payment structure (D-320). Overages changed to $8 per 500 messages (D-321). Marketing campaign bundled into $49 registration — no additional registration charge for second campaign (D-334). EIN is the gate for marketing, not payment. Beta pricing section removed — $49 is the price for everyone. Unit economics and LTV models recalculated.
>
> **CHANGE LOG (v5.1):** Pricing made symmetrical — first campaign $19/month, second campaign $29/month regardless of direction (D-304). Marketing-only validated as standalone vertical (D-305). EIN verification required for marketing access (D-302). Business identity pre-validation from EIN lookup (D-303). Website intake interview replaces spec file prompt (D-300).
>
> **CHANGE LOG (v5.0):** Marketing available in sandbox from day one. Smart registration: both campaigns auto-submit if developer used marketing in sandbox, transactional-only otherwise. On-demand marketing activation post-registration with no extra fee. Monthly tiers: $19/mo transactional, $29/mo transactional+marketing — auto-adjusts when marketing activates. Separate $29 one-time marketing add-on eliminated (D-294). Compliance enforcement moved to authoring time; runtime three-tier enforcement removed (D-293). Proxy reframed as delivery engine. Sandbox sends to verified phones only (D-298). SDK and raw API documented as equal entry points (D-296). New tables use project_id, not user_id (D-299).
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
| **Sandbox** | Free | Instant API key, SDK or API access, all namespaces including marketing, message authoring, no time limit. Verified phones only (D-298). |
| **Full-Stack Setup** | $49 flat fee | 10DLC registration — transactional and marketing campaigns both covered by single $49 fee. Marketing requires EIN (D-302, D-334). Full refund if rejected. |
| **Full-Stack Monthly** | $19/month (one campaign) or $29/month (two campaigns) — direction-agnostic (D-304) | Live messaging through delivery proxy, 500 messages included. Second campaign tier activates automatically when developer enables a second campaign type (D-294, D-304). |
| **BYO Twilio** (Phase 2) | $199 one-time | Registration submitted to customer's own Twilio account, no monthly |
| **Platform** (Phase 2) | Per-tenant pricing | SaaS platforms registering their tenants (see Section 3B) |

Everything a customer needs to stay compliant is included in full-stack. Marketing is not an upsell — it's available from sandbox and activates seamlessly when the developer is ready. The EIN is the gate for marketing access, not payment (D-334).

---

## 1. FREE SANDBOX TIER

### What's included (no credit card, no time limit)

- Sandbox API key (`rk_test_` prefix) — instant on signup
- **SDK access** — `npm install relaykit` with sandbox key, same API surface as production
- **Raw API access** — `POST /v1/messages` with sandbox key, same endpoints as SDK. SDK and API are equal paths (D-296).
- **All namespaces including marketing** — full message library available from day one, not gated (D-294). Marketing usage in sandbox is tracked to determine whether the marketing campaign auto-submits at registration.
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

Sandbox → Use case selection → Message authoring on website (all namespaces including marketing; EIN required for marketing — D-302) → `npm install relaykit` or direct API integration → Integration built → Engagement signals met → Registration CTA → Intake wizard (pre-populated from dashboard work) → Stripe checkout ($49) → Campaign(s) submitted (transactional, marketing, or both based on sandbox usage and EIN) → Approval → Live at $19/month (one campaign) or $29/month (both campaigns active)

> **Conversion psychology:** The SDK + message library is what makes the sandbox sticky. Developers invest time customizing messages (including marketing messages) and wiring up namespace functions. By the time they want to go live, switching to another provider means rebuilding the entire integration. The SDK is the moat. For no-code builders, the website authoring surface and API key are the equivalent lock-in (D-296, D-297).
>
> **Marketing conversion psychology (D-294, D-334):** Developers who use marketing in sandbox have already committed to it as a feature. Auto-submitting both campaigns at no extra registration cost removes friction entirely. The EIN they provided during onboarding is all they need — marketing activation is earned through identity verification, not payment.

---

## 2. PRICING STRUCTURE (Full-Stack Tier)

### Registration Fee (D-320, D-334)
- **$49 flat fee** at registration submission — covers brand registration + transactional campaign + marketing campaign (if EIN provided). Both campaigns included in the single fee (D-334). RelayKit absorbs the additional ~$15 TCR cost for the second campaign.
- **Full $49 refund if registration is rejected**
- No go-live fee. No second payment. Developer goes live automatically on approval.
- **User-facing display:** "$49 to register + $19/mo" — one price, no fine print.

> **Note (D-334):** The $49 registration fee is a customer acquisition cost, not a profit center. Dual-campaign registrations may be near break-even or slightly negative on the registration fee alone. This is acceptable because those developers have higher LTV ($29/mo vs $19/mo) and are more deeply invested in the platform.

### Monthly Subscription (Required)

Two tiers based on campaign count — direction-agnostic (D-304, D-305):

- **$19/month** — Single-campaign tier. Applies to any developer with one registered campaign — transactional-only or marketing-only (D-304, D-305). Billed monthly, starts after registration approval.
- **$29/month** — Dual-campaign tier. Applies when a developer has both transactional and marketing campaigns registered, regardless of which was first (D-304). The $10/month increase covers additional carrier infrastructure (second TCR campaign monthly fee).

Tier changes are seamless:
- **$19 → $29:** Happens automatically when the second campaign activates. Developer is informed upfront on pricing page and during registration: "Adding marketing messages adds $10/month."
- **$29 → $19:** Developer deactivates either campaign type in Settings. Takes effect next billing cycle. Deactivated campaign suspended with carrier. Re-enabling later requires campaign re-submission (~few days, no fee to developer).

Both tiers include:
  - 500 SMS segments per month (combined pool if marketing is active — transactional and marketing draw from the same pool)
  - Phone number rental
  - Delivery proxy (template lookup, interpolation, carrier send, opt-out enforcement, quiet hours, rate limiting) (D-293)
  - Message preview endpoint (validate templates before sending)
  - Compliance site hosting (kept live and audit-ready)
  - Trust score monitoring
  - Campaign status visibility
  - Carrier regulation change tracking

$29 tier additionally includes:
  - Active marketing campaign registration with carrier
  - Recipient-level marketing consent enforcement at proxy (marketing messages to recipients without explicit opt-in are blocked at infrastructure level)
  - Marketing consent language on compliance site

> **Note (D-304, D-305):** For marketing-only customers at $19/month, the marketing consent features are included at the $19 tier. The $29 tier additional features only apply when BOTH campaigns are active.

### Multi-Project Billing (Phase 2 — PRD_11)
Each registered project carries its own subscription. One customer with multiple registered projects pays per project:
- $49 registration fee per project
- $19 or $29/month per registered project (depending on whether marketing is active for that project — D-294)
- Overages tracked and billed per project
- All subscriptions managed under one Stripe Customer record — one billing portal, all projects visible
- Sandbox projects are always free regardless of project count

### Auto-Scaling Message Blocks (D-321)
- When usage exceeds 500 messages, additional blocks are added automatically
- **$8 per additional 500 messages**
- No service interruption — messages keep sending
- Blocks added in real-time as usage crosses thresholds
- Requires valid payment method on file (enforced at checkout)

### Monthly Billing Example
| Usage | Monthly Bill ($19 tier) | Effective Rate |
|-------|------------------------|----------------|
| 0–500 | $19 | 3.8¢/msg |
| 501–1,000 | $27 | 2.7¢/msg |
| 1,001–1,500 | $35 | 2.3¢/msg |
| 1,501–2,000 | $43 | 2.2¢/msg |
| 3,000 | $59 | 2.0¢/msg |
| 5,000 | $91 | 1.8¢/msg |
| 10,000 | $171 | 1.7¢/msg |

> **Note (D-294, D-304):** These numbers show the $19/month single-campaign tier. For developers with both campaigns active ($29/month), add $10 to the base: 0–500 messages = $29, 501–1,000 = $37, etc. The message pool is combined — transactional and marketing messages draw from the same 500 included and the same overage blocks.

### Volume Tapering (Gentle, Not Aggressive)
At higher volumes, block pricing decreases slightly:
- 500–5,000 → $8 per 500 (effective $16 per 1,000)
- 5,001–20,000 → $7 per 500 (effective $14 per 1,000)
- 20,000+ → Custom pricing (contact us)

> **Rationale:** Heavy users increase carrier exposure and complaint risk. Margins must be maintained, not compressed. This is risk pricing, not commodity pricing.

### Abuse Safeguard Ceiling
- Hard daily cap: 20,000 messages/day (invisible to normal users)
- Triggers automatic review + alert to RelayKit admin
- Protects master carrier account from runaway loops or abuse
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
4. We create a subaccount under our carrier ISV, port their number, issue RelayKit API key
5. They swap their Twilio credentials for the RelayKit SDK (`npm install relaykit`)
6. The $199 they already paid covers the setup — no second setup fee

> **Key revenue insight:** BYO is an entry point, not a dead end. Upgrading adds the monthly subscription. Dashboard upsell: "Want automatic compliance protection? Switch to RelayKit's managed API — same code, one key swap."

---

## 3B. PLATFORM TIER (Phase 2 — Directional Pricing)

> **Status:** Phase 2 placeholder. These numbers are subject to market validation. Do NOT build pricing infrastructure for this tier yet. See PRD_10_PLATFORM_TIER.md for full product concept.

### Concept

SaaS platforms register their tenants' businesses through RelayKit's API. Each tenant gets individual 10DLC registration, compliance site, phone number, and compliance site hosting — orchestrated by the platform programmatically rather than by individuals through the intake wizard.

### Pricing direction

| Item | Price | Notes |
|------|-------|-------|
| Platform setup | $499 one-time | Platform verification, ISV configuration, onboarding |
| Per-tenant registration | $99 one-time | Same pipeline as single-company ($49), premium for API access |
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

---

## 4. STRIPE IMPLEMENTATION (Replaces PRD_01 Section 5)

### Checkout Flow (Full-Stack) — Single Payment (D-320)

1. Customer clicks "Start registration" on workspace
2. Frontend calls `POST /api/checkout` with `{ type: 'registration' }`
3. Backend creates a **Stripe Checkout Session** in `payment` mode:
   - **Line item:** Registration fee — $49.00 one-time
   - Customer email pre-filled from account
   - `payment_method_collection: 'always'` (card saved for monthly subscription)
   - Success URL: `relaykit.ai/apps/{appId}/messages?session_id={CHECKOUT_SESSION_ID}`
   - Cancel URL: `relaykit.ai/apps/{appId}/messages`
   - Metadata: `{ project_id: "{id}", type: "registration" }`
4. Customer completes payment — **$49 charged at checkout**
5. Redirects to workspace — registration pipeline begins
6. On approval: subscription starts automatically ($19/mo or $29/mo based on campaign count)

**Rejection: $49 refund**
- If registration is rejected, full $49 refund issued automatically
- Workspace shows rejection details with contact info
- RelayKit reviews what went wrong before any resubmission

### Checkout Flow (BYO Twilio) — Phase 2 (do not build)

> **Phase 2 — do not build.** This section describes the BYO Twilio checkout flow for future reference. Do not implement BYO checkout mode in v1.

1. Customer clicks "Register" from BYO intake flow
2. Frontend calls `POST /api/checkout` with `{ type: 'byo' }`
3. Backend creates a **Stripe Checkout Session** in `payment` mode (one-time, no subscription):
   - **Line item:** Setup fee — $199.00 one-time
   - Customer email pre-filled
   - `payment_method_collection: 'if_required'`
   - Success URL: `relaykit.ai/dashboard?session_id={CHECKOUT_SESSION_ID}`
   - Cancel URL: `relaykit.ai/start/review`
   - Metadata: `{ intake_session_id: "{id}", project_id: "{id}", type: "byo" }`
4. Stripe charges **$199 at checkout** — no recurring billing
5. Redirects to dashboard

### Stripe Product Configuration
```
Product: "RelayKit Registration"
  Price 1: $49.00 USD — one-time registration fee (D-320, D-334)

Product: "RelayKit SMS Infrastructure"
  Price 1: $19.00 USD/month — single-campaign tier (full-stack only, D-304)
  Price 2: $29.00 USD/month — dual-campaign tier (full-stack only, auto-applied when second campaign activates — D-294, D-304)

Product: "RelayKit Message Block"
  Price 1: $8.00 USD — one-time, per 500 messages (used for metered overage billing) (D-321)
  Price 2: $7.00 USD — one-time, per 500 messages (volume tier, 5k+)

Product: "RelayKit BYO Registration" (Phase 2)
  Price 1: $199.00 USD — one-time (BYO Twilio setup)
```

### Webhook Handling

**`checkout.session.completed` (registration):**
1. Verify signature
2. Look up project_id from metadata
3. Mark registration as `submitted`, store payment reference
4. Trigger registration pipeline (brand registration → campaign submission via carrier)
5. Store Stripe customer_id on customer record, save payment method for subscription

**On carrier approval (internal trigger, not Stripe webhook):**
1. Create subscription ($19/mo or $29/mo based on campaign count)
2. Swap sandbox API key for live key
3. Enable production message delivery
4. Mark registration as `live`

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
- Track message count per project per billing period using Supabase
- Proxy increments counter on every successful message send
- At end of billing cycle (or triggered by threshold crossing), create Stripe Invoice Items for overage blocks
- Use Stripe's `usage_record` API on a metered price, OR simply create one-time invoice items — decide during build based on what's simpler
- **v1 simplification:** If metered billing is too complex for launch, hard-cap at 500 and require manual plan upgrade. Add auto-scaling in week 3. Flag this decision for Joel.

### Subscription Lifecycle
```
SANDBOX (free, no Stripe involvement)
  → REGISTRATION CHECKOUT → submitted ($49 charged, registration pipeline starts)
    → If marketing-only vertical: marketing campaign submitted, EIN required (D-302, D-305)
    → If transactional-only vertical: transactional campaign submitted
    → If both used in sandbox + EIN provided: both campaigns submitted (D-334)
    → APPROVED → live (subscription starts: $19/mo or $29/mo based on campaign count)
      → Transactional-only adds marketing later → subscription adjusts to $29/mo next cycle
      → Marketing-only adds transactional later → subscription adjusts to $29/mo next cycle
      → Either campaign deactivated → subscription adjusts to $19/mo next cycle, campaign suspended
      → payment_past_due (card fails on renewal)
        → 7-day grace period
        → suspended (messaging paused)
        → reactivated (card updated) OR churned (30 days no payment)
      → cancelled (customer cancels)
        → messaging paused immediately
        → both campaigns suspended/deleted
        → compliance site stays live 30 days
        → data retained 90 days
        → sandbox continues to work (they can still test)
    → REJECTED → $49 refunded
      → RelayKit reviews rejection cause before any resubmission

  → BYO CHECKOUT (Phase 2) → byo_active ($199 charged, no subscription)
    → registration pipeline runs against customer's Twilio account
    → on completion: deliverables generated, customer self-sufficient
    → compliance site hosted indefinitely (negligible cost)
    → upgrade to full-stack available at any time (adds $19/month subscription, no second setup fee)
```

---

## 5. REGISTRATION SCREEN PREVIEW CARD

The registration review screen preview card:
```
WHAT HAPPENS NEXT
1. You pay $49 to register
2. We submit to US carriers — typically a few days
3. Your sandbox keeps working while you wait
4. On approval, you're live — same code, same API
   Full refund if not approved.

YOUR PLAN
$49 registration (one-time)
$19/month — 500 messages included
$29/month if you add marketing messages
Additional messages: $8 per 500 (auto-scales)
```

---

## 6. UPDATED UNIT ECONOMICS

### Carrier Fee Schedule (estimated, pending ISV tier confirmation — D-271)
| Item | Estimated Cost | Notes |
|------|---------------|-------|
| Brand registration | ~$4.50 | TCR fee, same regardless of carrier |
| Campaign vetting | ~$15.00 | TCR fee |
| Phone number | ~$1.00/mo | Carrier pricing varies |
| Campaign monthly fee | ~$1.50–$10/mo | Varies by use case |

> **Note:** Carrier fee schedule needs confirmation once ISV/reseller account is active or CSP is approved. TCR fees are carrier-agnostic. Phone number and platform fees may differ by carrier. Update this section when production pricing is confirmed.

### Full-Stack Registration (D-320, D-334)
| Item | Single Campaign | Both Campaigns (D-334) |
|------|----------------|----------------------|
| Revenue | $49 | $49 |
| TCR brand + campaign(s) | ~$19.50 | ~$34.50 |
| Stripe processing (3%) | ~$1.47 | ~$1.47 |
| Support/review time | $7.50–15 | $7.50–15 |
| **Gross profit** | **~$13–21** | **~-$2 to $6** |
| **Gross margin** | **~27–42%** | **~-4% to 12%** |

> **Registration is a customer acquisition cost, not a profit center.** Margin comes from the monthly subscription and overages. Dual-campaign registrations may be near break-even or slightly negative on the registration fee alone — this is acceptable because those developers have higher LTV ($29/mo vs $19/mo) and are more deeply invested in the platform.

> **Re-vetting fee policy:** Campaign resubmissions after rejection incur a non-refundable $15 TCR vetting fee per event. RelayKit absorbs this cost as part of the rejection handling service. Each resubmission adds ~$15 to COGS for that registration. Monitor `resubmission_count` per registration — use cases or intake patterns with high rejection rates are both a template quality signal and a margin risk flag. Target: <5% of registrations require resubmission.

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
| Item | $19/month (Single Campaign — Transactional) | $19/month (Single Campaign — Marketing-Only) | $29/month (Dual Campaign) |
|------|-------------|-------------|------------------------|
| Revenue (base) | $19.00 | $19.00 | $29.00 |
| Phone number rental | ~$1.00 | ~$1.00 | ~$1.00 |
| Carrier campaign monthly fee | ~$1.50 | ~$5.00* | ~$10.00 |
| Compliance site hosting | ~$0.50 | ~$0.50 | ~$0.50 |
| Proxy + Redis infrastructure | ~$1.00 | ~$1.00 | ~$1.00 |
| Drift detection (Claude API sampling) | ~$0.25 | ~$0.25 | ~$0.25 |
| Message cost (500 × $0.01 blended) | ~$5.00 | ~$5.00 | ~$5.00 |
| Stripe processing (3%) | ~$0.57 | ~$0.57 | ~$0.87 |
| **Monthly gross profit** | **~$9.18** | **~$5.68** | **~$10.38** |
| **Monthly gross margin** | **~48%** | **~30%** | **~36%** |

*Marketing campaign monthly fee from carrier may be higher than transactional — estimated ~$5.00 pending ISV tier confirmation (D-271). Adjust when production pricing is confirmed.

> **Note (D-294, D-304, D-305):** The dual-campaign tier at $29/month resolves the previous near-breakeven problem. Marketing-only customers at $19/month have lower margin (~30%) than transactional-only (~48%) due to higher carrier campaign fees, but this is acceptable for a single-campaign user. The dual-campaign surcharge restores healthy margin (~36%) when both campaigns are active. Both tiers benefit from: (1) most customers not using all 500 messages monthly, and (2) overage revenue kicking in earlier.

### Message Block Revenue (D-321)
| Item | Amount |
|------|--------|
| Revenue per 500 block | $8.00 |
| Message cost (500 × $0.01) | ~$5.00 |
| **Gross profit per block** | **~$3.00** |
| **Gross margin** | **~38%** |

### Customer LTV Model (12-month retention)
| Scenario | Setup ($49) | Monthly × 12 | Overage | Total LTV |
|----------|------------|-------------|---------|-----------|
| Light user (250 msg/mo) | $49 | $228 | $0 | $277 |
| Typical user (1,000 msg/mo) | $49 | $228 | $96 | $373 |
| Growth user (3,000 msg/mo) | $49 | $228 | $480 | $757 |
| Scale user (10,000 msg/mo) | $49 | $228 | $1,824 | $2,101 |
| BYO (no monthly) | $199 | $0 | $0 | $199 |
| BYO → full-stack upgrade (month 3) | $199 | $171* | $72 | $442 |
| Marketing user (1,000 msg/mo) | $49 | $348 | $96 | $493 |
| Marketing user (3,000 msg/mo) | $49 | $348 | $480 | $877 |
| Marketing-only user (1,000 msg/mo) | $49 | $228 | $96 | $373 |

*9 months at $19/month after upgrade

> **Overage calculation (D-321):** Messages beyond 500 included, divided by 500 (rounded up), multiplied by $8, times 12 months. Example: 1,000 msg/mo = 500 overage = 1 block × $8 × 12 = $96/year.
>
> **Note (D-294, D-304, D-305):** Marketing user rows (dual-campaign) assume $29/month × 12 = $348 annual subscription. Marketing-only user row assumes $19/month × 12 = $228 (same as transactional-only, single-campaign tier). Same overage rates apply. Dual-campaign users have higher LTV due to the $10/month premium, partially offset by higher carrier costs.

### Revenue Targets
| Milestone | Customers | Setup Rev | MRR (base) | Est. Overage MRR | Total Annual |
|-----------|-----------|-----------|-----------|-----------------|-------------|
| Validation | 50 | $2,450 | $950 | ~$200 | ~$16,250 |
| Traction | 500 | $24,500 | $9,500 | ~$3,000 | ~$177,500 |
| Scale | 2,000 | $98,000 | $38,000 | ~$15,000 | ~$734,000 |

> Revenue targets assume mixed $19/$29 average (~$19 weighted, most single-campaign at launch). Platform tier revenue not included — it's additive when Phase 2 launches.

---

## 7. CC IMPLEMENTATION NOTES

### What CC needs to build for Stripe (in order):
1. Stripe product + price creation (can be done via Stripe Dashboard or API seed script) — 3 products: registration fee, monthly subscription (two price tiers), message block (two price tiers)
2. `POST /api/checkout` — accepts `{ type: 'registration' }` for full-stack, `{ type: 'byo' }` for BYO (Phase 2)
3. `POST /api/webhooks/stripe` — handles `checkout.session.completed`, `invoice.payment_failed`, `customer.subscription.deleted`
4. Internal approval handler — creates subscription on carrier approval, swaps API key
5. Refund logic: auto-refund $49 on registration rejection
6. Basic usage counter: increment on each outbound message (proxy integration point, full-stack only)
7. **v1 decision point:** If metered billing is complex, launch with hard cap at 500 and manual upgrade. Add auto-scaling in phase 2.

### Environment Variables (add to .env)
```
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_REGISTRATION_PRICE_ID=price_...   # $49 one-time
STRIPE_MONTHLY_PRICE_ID=price_...        # $19/month
STRIPE_MONTHLY_DUAL_PRICE_ID=price_...   # $29/month
STRIPE_MESSAGE_BLOCK_PRICE_ID=price_...  # $8 per 500
```

### Database Additions
```sql
-- Add to customers table
stripe_customer_id TEXT,
stripe_subscription_id TEXT,       -- NULL until approval
subscription_status TEXT DEFAULT 'sandbox',
-- CHECK (subscription_status IN ('sandbox', 'submitted', 'approved', 'live', 'past_due', 'suspended', 'cancelled', 'churned', 'byo_active'))
-- NOTE (D-299): New tables should use project_id instead of customer_id for ownership. Existing schema is acceptable but will be migrated when multi-user support is built.
tier TEXT DEFAULT 'sandbox',
-- CHECK (tier IN ('sandbox', 'full_stack', 'byo'))
marketing_active BOOLEAN DEFAULT FALSE,
-- When TRUE, subscription is $29/month. When FALSE, $19/month. Toggled by marketing campaign activation/deactivation (D-294).
registration_step TEXT,
-- CHECK (registration_step IN ('submitted', 'approved', 'rejected', 'live'))
registration_payment_id TEXT,      -- Stripe PaymentIntent ID for $49

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
