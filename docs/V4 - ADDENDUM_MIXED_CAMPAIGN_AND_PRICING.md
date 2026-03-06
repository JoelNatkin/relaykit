# ADDENDUM: Mixed Campaign Registration, Pricing Tier, and Message Library Model
## Applies to: PRD_01, PRD_06, PRICING_MODEL.md, PRD_04 (flag), PRD_08 (flag)
### Date: March 4, 2026

> **Origin:** Strategy session surfacing four interconnected decisions about expansion registration mechanics, pricing, message library UX, and proxy enforcement. This addendum supersedes any conflicting language in the documents it touches. Apply these sections during the next PRD revision pass before PRD_06 build begins.

---

## ADDENDUM A — PRD_01: INTAKE WIZARD
### Replaces/Extends: Section 2B, Screen 1b — Expansion Options and Campaign Type Upgrade Logic

---

### A1. Correction: "Expansion" is a second campaign registration, not an upgrade

The current PRD_01 language describes expansion as upgrading the customer's existing campaign type. This is technically incorrect and must not be reflected in UX copy or backend logic.

**The reality:** TCR campaigns are static once approved. There is no mechanism to upgrade an approved `CUSTOMER_CARE` campaign to `MIXED`. Adding marketing capability after initial registration requires registering a **second campaign** alongside the existing one. RelayKit abstracts this completely — the developer never knows or cares that two campaigns exist — but the implementation and the copy must reflect it accurately.

**Corrected framing for UX copy:**
- ❌ "We'll upgrade your registration to cover marketing messages."
- ✅ "We'll register an additional campaign that covers marketing messages. Your transactional messages keep running without interruption."

**Corrected framing for the advisory note on expansion selection:**
> "Got it — we'll register a marketing campaign alongside your {use_case_label} registration. You'll be able to send both. Your existing messages won't be interrupted, and the new campaign is usually approved within 2–7 days."

This applies everywhere expansion is discussed — intake wizard, dashboard expansion toggle, and any email copy referencing registration changes.

---

### A2. New decision point: MIXED registration at signup

The intake wizard Screen 1b must present a proactive MIXED registration option for eligible use cases. This is the primary mechanism for avoiding future re-registration events.

**The problem it solves:** A developer who registers as transactional-only and later wants to send marketing messages cannot upgrade their existing campaign. Without this decision point, they'd need a second campaign registered later — a friction event RelayKit can eliminate by surfacing the choice upfront.

**The mechanism:** If the developer selects MIXED registration at signup, RelayKit registers them under a MIXED campaign type from day one. The proxy enforces recipient-level marketing consent at send time — if a marketing message is attempted to a recipient who hasn't given explicit marketing opt-in, it is **blocked before delivery** with a clear API error. The registration scope is broad. The permission gate is at the infrastructure level.

**Who sees this option:**

| Use case | Show MIXED option? |
|----------|--------------------|
| appointments | ✅ Yes |
| orders | ✅ Yes |
| support | ✅ Yes |
| community | ✅ Yes |
| waitlist | ✅ Yes (already MIXED by default) |
| internal | ❌ No (marketing to internal staff is out of scope) |
| verification | ❌ No (2FA campaign type; mixing marketing is a red flag to carriers) |
| marketing | ❌ No (already MARKETING type — broadest) |

**UI placement:** Below the existing expansion checkboxes on Screen 1b, as a distinct callout card — visually separate from the per-feature expansion checkboxes above it.

**Callout card copy:**

```
┌─────────────────────────────────────────────────────────┐
│  ⭐  Plan to send marketing messages someday?            │
│                                                          │
│  Register as Mixed now and you'll never need a second   │
│  registration. We enforce marketing consent rules at    │
│  the infrastructure level — if a recipient hasn't       │
│  opted into marketing, those messages are blocked       │
│  automatically.                                         │
│                                                          │
│  ☐  Register as Mixed ($29/month instead of $19)        │
│                                                          │
│  Most developers don't need this. Pick it if you're     │
│  already planning to send promotions.                   │
└─────────────────────────────────────────────────────────┘
```

**Key copy principles:**
- Honest about the price difference upfront — no surprises at checkout
- Framed as optional, not recommended by default
- "Most developers don't need this" sets the right expectation so it doesn't feel like a trap
- Emphasizes infrastructure enforcement (RelayKit handles consent gating, not the developer)

**Behavior:**
- Checkbox unchecked by default
- Checking it: price preview on the Review screen updates from $19/month to $29/month
- Checking it: `effective_campaign_type` in the data contract becomes `MIXED`
- Checking the MIXED option does NOT remove the per-feature expansion checkboxes above — those still inform campaign description and sample message generation
- If `waitlist` use case is selected (already MIXED by default), this callout does not appear — the customer is already getting MIXED

**Data contract addition:**

```typescript
{
  use_case: string,
  expansions: string[],
  effective_campaign_type: string,   // now also set by MIXED checkbox
  registration_tier: 'transactional' | 'mixed',  // NEW — drives pricing
}
```

---

### A3. Updated campaign type upgrade logic

```typescript
function determineCampaignType(
  useCase: string, 
  expansions: string[],
  registrationTier: 'transactional' | 'mixed'
): string {
  // Explicit MIXED election overrides everything
  if (registrationTier === 'mixed') {
    return 'MIXED';
  }

  // waitlist defaults to MIXED regardless
  if (useCase === 'waitlist') {
    return 'MIXED';
  }

  // No expansions = narrow default
  if (expansions.length === 0) {
    return DEFAULT_CAMPAIGN_TYPES[useCase];
  }

  // Promotional/marketing expansion = MIXED
  const hasPromoExpansion = expansions.some(e =>
    e.includes('promotional') || e.includes('offers') || e.includes('reviews')
  );
  if (hasPromoExpansion) {
    return 'MIXED';
  }

  // Non-promotional expansions = LOW_VOLUME_MIXED
  return 'LOW_VOLUME_MIXED';
}
```

> **Note for PRD_04 (Twilio Submission Engine):** When `effective_campaign_type` is `MIXED` AND the developer later wants to use marketing messages post-registration (i.e., they chose transactional initially), a **second campaign** must be registered on the existing subaccount — not a modification of the approved campaign. The submission engine needs a `registerSecondCampaign()` pathway. This is a new capability not currently specced in PRD_04. Flag for PRD_04 revision before that expansion flow is built.

---

---

## ADDENDUM B — PRICING_MODEL.md
### Replaces/Extends: Section 2 — Monthly Subscription, Unit Economics Table

---

### B1. Two monthly subscription tiers

The existing pricing model has a single $19/month base subscription. Marketing/mixed use cases are nearly breakeven at this price (~3% gross margin on the base). The MIXED upfront registration option (Addendum A2) creates a new pricing surface that must be separated.

**Updated subscription structure:**

| Tier | Price | Campaign Type | Monthly Campaign Fee (Twilio) | Gross Margin (base, 500 msgs) |
|------|-------|---------------|-------------------------------|-------------------------------|
| Transactional | $19/month | CUSTOMER_CARE / DELIVERY / 2FA / LOW_VOLUME | ~$1.50 | ~48% |
| Mixed | $29/month | MIXED | ~$10.00 | ~35% |

> **Pricing rationale:** The $10/month delta between tiers directly covers the ~$8.50 campaign fee difference, with modest additional margin. $29 is defensible — the developer is getting permanent marketing capability with no re-registration event, plus infrastructure-level recipient consent enforcement. The alternative (doing it themselves later) is a painful second registration process, a 2–7 day review wait, and no consent gating infrastructure.

**What's included in Mixed tier (same as Transactional, plus):**
- MIXED campaign registration (covers both transactional and promotional message types)
- Proxy enforces recipient-level marketing consent — marketing messages to non-opted-in recipients are blocked automatically with a clear API error
- Marketing consent tracking per recipient (RelayKit stores opt-in status, proxy checks it)
- All standard features: 500 SMS/month, phone number, inline compliance enforcement, drift detection, message preview, compliance site hosting

**Updated unit economics — Monthly Subscription:**

| Item | Transactional | Mixed |
|------|--------------|-------|
| Revenue (base) | $19.00 | $29.00 |
| Phone number rental | ~$1.15 | ~$1.15 |
| Twilio campaign monthly fee | ~$1.50 | ~$10.00 |
| Compliance site hosting | ~$0.50 | ~$0.50 |
| Proxy + Redis infrastructure | ~$1.00 | ~$1.25 (consent store) |
| Drift detection (Claude API) | ~$0.25 | ~$0.25 |
| Message cost (500 × $0.01) | ~$5.00 | ~$5.00 |
| Stripe processing (3%) | ~$0.57 | ~$0.87 |
| **Monthly gross profit** | **~$9.03** | **~$9.98** |
| **Monthly gross margin** | **~48%** | **~34%** |

> **Note:** Mixed tier gross margin is lower than Transactional but healthy and sustainable — a significant improvement over the current ~3% breakeven on marketing customers at $19/month. Message block overage economics are identical across both tiers.

---

### B2. Pricing display at checkout

The Review & Confirm screen (Screen 3) price preview card must reflect which tier was selected:

**Transactional:**
```
YOUR PLAN
$199 one-time setup
$19/month — 500 messages, phone number, compliance proxy & monitoring
Additional messages: $15 per 1,000 (auto-scales)
```

**Mixed:**
```
YOUR PLAN
$199 one-time setup
$29/month — 500 messages, phone number, compliance proxy & monitoring
  Includes: marketing campaign registration + recipient consent enforcement
Additional messages: $15 per 1,000 (auto-scales)
```

---

### B3. Stripe implementation note

Two Stripe Price objects are needed for the monthly subscription:
- `price_transactional` — $19/month recurring
- `price_mixed` — $29/month recurring

The `registration_tier` field from the intake data contract determines which price is used in the `POST /api/checkout` call. This is a new requirement for PRICING_MODEL.md Section 7 (CC Implementation Notes).

---

---

## ADDENDUM C — PRD_06: CUSTOMER DASHBOARD
### Replaces/Extends: Section 11 (Messages tab) and Section 12 (Message Library)

---

### C1. Three-tier message library (post-registration)

The current spec describes two tiers in the post-registration Messages tab: canon messages (starred) and expansion messages. A critical third tier is missing: messages that are **within the current registration scope but were not selected by the developer during the plan builder phase**.

This tier gives developers a clear picture of the full freedom their registration actually provides — reducing anxiety about sending variations, reducing unnecessary re-registration requests, and surfacing a natural upsell moment for the expansion path.

**Updated three-tier model:**

**Tier 1 — Your registered messages (canon)**
- Messages the developer selected and edited in the plan builder, finalized at registration
- Displayed with ⭐ star badge
- Read-only — cannot be edited post-registration
- These are the drift detection baseline
- Clearly framed: "These are the messages your registration is built around."

**Tier 2 — Also available with your registration**
- Messages from the developer's use case template library (PRD_02) that are within their registered campaign type but were NOT selected during the plan builder
- Displayed with ✅ green indicator
- Copyable — developer can use these in their code
- NOT guaranteed safe — framed as "within your registration scope" not "approved"
- The message preview endpoint (`POST /v1/messages/preview`) is the right tool for definitive validation before deployment
- Copy beneath section header: "These message types are within your {use_case_label} registration. They weren't part of your original plan, but you can likely send them. Use the preview endpoint to validate before deploying."

**Tier 3 — Requires additional registration**
- Expansion messages from PRD_02 that are outside the current campaign type
- Displayed with ⭐+ or lock icon
- NOT available to send on current registration — proxy will block them with a clear error
- Each card shows what's needed and a path to add it
- **Corrected framing:** "We'll register a marketing campaign alongside your current one — your existing messages keep running. Usually approved in 2–7 days."
- CTA: "Add marketing registration — $10/month additional" (or tier upgrade if on Transactional plan and upgrading to Mixed)

**Entry anatomy (updated):**

```
TIER 1 — YOUR REGISTERED MESSAGES
┌────────────────────────────────────────────────────────┐
│ ⭐ Booking confirmation                        [Copy]  │
│ "{business_name}: Your appointment is confirmed..."    │
│ 🟢 Registered — your drift detection baseline         │
└────────────────────────────────────────────────────────┘

TIER 2 — ALSO AVAILABLE WITH YOUR REGISTRATION
┌────────────────────────────────────────────────────────┐
│ ✅ No-show follow-up                          [Copy]  │
│ "{business_name}: We missed you today!..."             │
│ 🟢 Within your registration scope                     │
└────────────────────────────────────────────────────────┘

TIER 3 — REQUIRES ADDITIONAL REGISTRATION
┌────────────────────────────────────────────────────────┐
│ 🔒 Promotional offer                    [Add →]       │
│ "{business_name}: Enjoy 20% off your next visit..."   │
│ 🟡 Needs marketing campaign — proxy will block        │
└────────────────────────────────────────────────────────┘
```

---

### C2. Expansion flow correction (post-registration)

When a developer clicks "Add →" on a Tier 3 message card, the current spec implies a registration modification flow. This must be corrected.

**Corrected expansion flow:**

1. Developer clicks "Add marketing registration" CTA
2. Modal appears:
   ```
   Add marketing messaging

   We'll register a marketing campaign alongside your current
   appointment reminders registration. Your existing messages
   keep running without interruption.

   What this includes:
   ✓ Promotional offers, discount codes, announcements
   ✓ Review requests and re-engagement messages
   ✓ Recipient consent enforcement (we block marketing to
     anyone who hasn't explicitly opted in)

   Monthly cost: +$10/month added to your subscription
   Timeline: Usually approved in 2–7 days

   [Start marketing registration]  [Not now]
   ```
3. On confirm: RelayKit registers a second MARKETING campaign on the customer's existing Twilio subaccount. Existing CUSTOMER_CARE campaign is unaffected and continues delivering.
4. Dashboard shows a second registration progress stepper during review period.
5. On approval: Tier 3 marketing messages unlock. Proxy now permits them to recipients with marketing opt-in.

> **Note for PRD_04:** The Twilio submission engine needs a `registerSecondCampaign(subaccountSid, campaignType)` function. The existing pipeline assumes one campaign per customer. This is flagged here for PRD_04 revision — do not build the expansion flow until PRD_04 is updated to support it.

---

### C3. Mixed tier indicator on dashboard

Customers on the Mixed tier should have a visible indicator in their dashboard that they have both transactional and marketing campaign coverage. Suggested placement: the Details card (Section 10.5) or a "Your plan" card.

```
Your registration covers:
✓ Appointment reminders (transactional)
✓ Marketing & promotions (mixed — recipient consent required)

Marketing messages are blocked automatically for recipients
who haven't opted in to marketing. Manage consent in your
app's opt-in flow.
```

---

---

## ADDENDUM D — PRD_04 AND PRD_08: FLAGS FOR FUTURE REVISION

> These are not full spec changes — they are flags to ensure these PRDs are updated before the expansion flow or second campaign path is built. Both PRDs are already committed and built; these flags apply to the next revision pass.

---

### D1. PRD_04 — Twilio Submission Engine

**Flag: Second campaign registration capability needed**

The current submission engine assumes one campaign per customer subaccount. The expansion flow (Addendum C2) and the MIXED upfront registration (Addendum A2) both require the engine to support registering a second campaign on an existing subaccount without touching the first.

**What needs adding to PRD_04:**
- `registerSecondCampaign(subaccountSid, campaignType, artifacts)` function
- State machine pathway for second campaign (separate from primary registration state machine)
- Second campaign status tracked on a new column or JSONB field — `registrations.secondary_campaigns[]`
- Webhook handling for second campaign approval/rejection events
- Phone number must be associated with BOTH campaigns in Twilio's Messaging Service sender pool

**Do not build this until PRD_04 is revised.**

---

### D2. PRD_08 — Compliance Monitoring

**Flag: Campaign-aware drift detection needed**

The current drift detector compares outbound messages against canon messages without awareness of which campaign type applies to which message. Once a customer has both a transactional and a marketing campaign registered, the drift analyzer needs to know:

- Transactional messages → compare against CUSTOMER_CARE canon
- Marketing messages → compare against MARKETING/MIXED canon (different threshold, different registered messages)
- A marketing message sent to a recipient without marketing opt-in → this is a consent violation, not a drift event — different handling path

**What needs adding to PRD_08:**
- Message classification step before drift comparison (transactional vs. marketing)
- Separate canon sets per campaign type
- Consent violation detection distinct from content drift detection
- Dashboard alert copy differentiated: "Consent violation" (blocked, urgent) vs. "Content drift" (warning, review)

**Do not build multi-campaign drift detection until PRD_08 is revised.**

---

*End of addendum. Apply to source PRDs before PRD_06 build begins.*
