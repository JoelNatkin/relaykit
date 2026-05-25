Status: exploring

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
