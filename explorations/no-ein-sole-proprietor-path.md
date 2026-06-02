Status: promoted (2026-06-02) — deferred at launch; MASTER_PLAN §Out of scope at launch

# No-EIN / Sole-Proprietor Customer Path

> **Purpose:** Working notes on whether RelayKit can serve US founders who have no EIN. Active research, not a committed decision. Update when the Sinch support reply lands; promote to a D-number or MASTER_PLAN scope note when resolved.
>
> Related: BACKLOG "Sole Proprietor customer segment" entry (the 4-option a/b/c/d analysis this informs).

## The question

RelayKit's North Star is "any independent developer." A meaningful share of indie SaaS founders are sole proprietors with no EIN. Can they become RelayKit customers and send compliant SMS, with RelayKit staying on Sinch?

## What's confirmed

**Standard 10DLC brand registration is EIN-gated — and the wall is TCR, not Sinch.** A manual walk of Sinch's "New brand" form (2026-05-24) confirmed the entity-type dropdown is exactly four options: Private Profit, Public Profit, Non-Profit, Government. No sole-proprietor option. The tax ID field is labeled "Corporate tax ID (EIN) or VAT ID" with helper text stating US companies must provide an EIN. This matches the Sinch OpenAPI spec already cited in CARRIER_BRAND_REGISTRATION_FIELDS.md.

The deeper finding: TCR (The Campaign Registry) — the registry every US 10DLC path runs through — itself excludes sole proprietors. TCR requires an EIN to verify each brand, and states sole proprietors are excluded. Sinch's form is just faithfully reflecting TCR's rule. This means the constraint is not Sinch-specific and does not move by switching carriers or by RelayKit becoming a CSP — a CSP still registers each customer as its own EIN-backed brand in TCR.

This kills three of the four BACKLOG options: secondary carrier, RelayKit-as-CSP, and any umbrella-brand approach all still route through TCR's 10DLC registry and hit the identical exclusion.

**Toll-free verification is the one live path.** Toll-free does not run through TCR's 10DLC brand registry. Sinch's toll-free verification documentation includes a SOLE_PROPRIETOR entity type, and states that if no EIN is available (e.g. a sole proprietor with no employees), additional vetting is required on review. The same sole-proprietor exemption is documented industry-wide (Bandwidth, Twilio), so it's a stable reality, not a Sinch quirk.

Caveats on the toll-free path:
- The sole-proprietor route triggers a manual exemption review — approval is not guaranteed and extends processing time.
- US-only. Non-US founders with no business registration at all are not served by this path.
- Toll-free verification is free, but messages cannot send on an unverified number.

**Toll-free is not a second-class product at launch volumes.** Throughput: toll-free standard is ~3 MPS vs. 10DLC's ~4 MPS — functionally equivalent for OTP and modest marketing sends; the gap only bites at bulk volumes RelayKit's launch customers won't hit. Deliverability: toll-free gives handset-level delivery confirmation (10DLC gives only carrier-level) — arguably better for OTP. One real cost difference: 10DLC inbound is free, toll-free inbound is not — minor, but a true line item.

**The LLC fallback is heavier than "just get an EIN."** An EIN alone doesn't clear the wall — there's no sole-proprietor entity type regardless. The real fallback is forming an LLC (then the EIN comes free with it). That's a state filing, ~$50–500 plus possible annual fees, days-to-weeks, and a change to the founder's business structure — not a 10-minute errand.

## What's still open

Sent to Sinch support (onlineteam@sinch.com) on 2026-05-25 — awaiting reply:

1. Real-world sole-proprietor TFN approval rate and timeline vs. a standard EIN-backed submission.
2. What satisfies the Business Registration Number field for a no-EIN sole proprietor — alternate identifier, or blank-and-flagged.
3. Is TFN verification available via the Registration API (same API used for 10DLC), or form-only? (Determines build cost.)
4. Toll-free throughput, ramp behavior, and carrier filtering vs. 10DLC.

Not asked / reason through ourselves: non-US founders with no business registration — likely no compliant US path; probably out of launch scope.

### Email sent (verbatim, for the record)

Subject: Questions about Toll-Free Verification for sole proprietors

Hi,

I'm a developer building on Sinch's SMS APIs. I have a few questions about Toll-Free Number (TFN) verification — specifically for customers who are sole proprietors without an EIN. If different questions need different teams, please feel free to route them; answers to any subset are helpful.

1. Sole proprietor verification. Your TFN documentation notes that if no EIN is available (e.g. a sole proprietor with no employees), additional vetting is required and approval isn't guaranteed. In practice, what does that review look like — roughly what share of sole-proprietor submissions get approved, and what's the typical timeline compared to a standard EIN-backed submission?

2. What satisfies the Business Registration Number field for a sole proprietor with no EIN? Is there an alternate identifier you accept, or is the submission made with the field left blank and flagged for manual review?

3. API vs. form. Is TFN verification available through the Registration API (the same API used for 10DLC brand and campaign registration), or is it submitted only via the online Toll-Free Verified Sender Form? If it's available via API, a pointer to the relevant endpoints would be great.

4. Throughput and deliverability. For a newly verified toll-free number, what are the messaging throughput limits, and how do ramp-up behavior and carrier filtering compare to a 10DLC number?

Thanks very much for the help.

Best,
Joel Natkin

## Where this goes next

When the Sinch reply lands, append it here. If it resolves the build-cost and approval-rate questions, this exploration promotes — either to a D-number (if it commits RelayKit to building the toll-free path) or a MASTER_PLAN scope note (if no-EIN is deferred or cut from launch). The product story under consideration: 10DLC for EIN'd businesses, toll-free for no-EIN US sole proprietors.

## Resolution (2026-06-02)

**Outcome: deferred at launch.** Sole proprietors without a registered business entity are out of scope at launch (MASTER_PLAN §Out of scope at launch). No D-number — a scope call, not a product-alternative decision.

**Terminology correction.** We stop calling this segment "no-EIN." An EIN is cheap and fast; it is not the wall. The wall is whether the founder is a registered legal business entity. The carrier ecosystem keys verification to a government business registration number (BRN), and a sole proprietor is, by definition, someone operating without forming a separate entity. The canonical term is now **"sole proprietor"** — it is the precise legal status, it is EIN-agnostic (a sole prop *with* an EIN still has no entity type in TCR's 10DLC registry), and it is the carrier ecosystem's own word (the toll-free entity-type list literally includes "Sole Proprietor").

**The Sinch reply (verbatim, for the record).** Received from Sukasini Sivasubbiramaniyan, Sinch Support, in reply to the 2026-05-24 email above:

> Hello Joel,
>
> Thank you for reaching out to our Customer Support team!
>
> Toll-Free sender verification usually takes up to 5 business days. If additional documents are required, the review may take longer. For sole proprietors without an EIN, extra verification checks are needed, and approval is not guaranteed. Because of this, the review process may take longer than standard EIN-backed submissions.
>
> Kindly make use of the below links:
> - What is the turnaround time for Toll-Free sender verification? (community.sinch.com … /ta-p/9153)
> - What is Business Registration Number for Toll-Free Sender? (community.sinch.com … /ta-p/18775)
>
> To request a TFN kindly make use of the below link:
> - Request New Toll-Free Numbers (community.sinch.com … /ta-p/18043)
>
> Kind regards,
> Sukasini Sivasubbiramaniyan | Sinch Support

The reply answered ~1 of the 4 questions directly (timeline, partially) and punted the rest to knowledge-base links. The links are where the consequential answers live.

**What the knowledge base resolved (the build-cost crux + a closing door):**

1. **No API on Sinch — manual form only (Q3, the build-cost answer).** Sinch states there is no automatic way to complete sender verification for TFNs; every Verified Sender Form is submitted and reviewed manually. The form lives in the Sinch dashboard on the number's detail page. This is the decisive finding: unlike 10DLC brand/campaign registration (API-driven end to end), the toll-free path **cannot be automated on Sinch**. (Note: this is a Sinch limitation, not industry-wide — Telnyx exposes a programmatic TFV API. Doesn't help us; we're on Sinch.)

2. **BRN required as of January 2026 (the escape hatch tightened).** A Business Registration Number is now mandatory for all new TFN verification submissions (optional from 2025-09-30). For US organizations the accepted BRN is the EIN, matched to the legal business name. The Sole Proprietor entity type survives with a carve-out — no EIN means additional vetting on review, with approval explicitly *not guaranteed*. So the only door for an unregistered founder is now a discretionary, manually-vetted maybe. Industry-wide (Twilio, Telnyx, SignalWire made the same change), so it doesn't move by switching carriers.

3. **The international BRN list sharpens who's actually in the group.** Sinch accepts national BRNs worldwide (Canadian BN, UK CRN, Australian ABN/ACN, EU VAT, etc.). The defining axis is "has a government business registration number." Non-US founders who hold one are **not** in the deferred group. The deferred group is precisely: founders with no acceptable BRN — canonically, US sole proprietors without a registered entity.

4. *(Minor, doesn't affect us:* already-verified TFNs are grandfathered — no resubmission under the new BRN rule. We only ever register new.)

**Why defer (Option C of three).** Two alternatives were considered and rejected: (A) RelayKit submits the VSF manually per customer — a blocking, rejection-prone manual step in every sole-prop onboarding, the wrong load at solo-founder stage; (B) hand the customer to Sinch's form — breaks the core promise by exposing telecom mechanics on a third-party surface mid-onboarding. Both trade away something central (the automated engine, or the experience promise) to serve a genuinely narrow segment that has a real alternative. **Option C — defer, door open:** the launch route for these founders is forming an entity (the EIN comes with it) → the fully automated 10DLC path. Interest is captured via the existing elig interest-tag. Reversible: if post-launch the tag fills up, Option A becomes a deliberate, volume-justified choice rather than a launch-time guess.

**Still open, deliberately not pursued pre-launch:** the real sole-prop approval rate (not published anywhere; only a Sinch human could give it, if at all) and a hard confirm that Sinch's newer API platform has zero programmatic TFV. Neither changes the launch call.

**Earlier BACKLOG options b/c/d remain killed** per "What's confirmed" above (the TCR 10DLC exclusion is registry-wide, so secondary carrier / RelayKit-as-CSP / umbrella-brand all hit the same wall).
