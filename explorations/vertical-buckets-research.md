# Vertical buckets research

> **Status:** exploring
> **Created:** 2026-05-27, Session 117
> **Author:** PM (with Joel review per-batch by family)
> **Promotes to:** canonical when Airtable is populated (Session 118+) and the data ships to the configurator widget. Status changes to `promoted to D-XXX` when that lands.

> **Purpose:** Structured research output enumerating verticals → sub-verticals with bucket / constraint source / routing trigger / bucket reason / notes per row. Output shape maps 1:1 to the Airtable schema documented in `AIRTABLE_SCHEMA.md`. Session 118 bulk-populates Airtable from this doc with zero translation work.
>
> Not for: committed policy (bucket values are revisable per Joel's read, customer pull, Sinch feedback); detailed primer-depth rule authoring (lives in `/explorations/vertical-constraints.md` §4 for the three anchored sub-verticals); schema mechanics (lives in `AIRTABLE_SCHEMA.md`).

## 1. Methodology

**Scope: pragmatic-first.** The 136 sub-verticals enumerated below cover the indie-developer customer pool most likely to surface through the configurator widget at launch. Long-tail edge cases (niche industrial verticals, academia-specific research tooling, certain regulated commodities) are left as "let customer pull surface them" rather than padding the corpus with categories lacking real signal. The framework held across all eight families; absence of a row is meaningful signal, not a gap.

**Review cadence: per-batch by family.** PM produced one family at a time (financial → healthcare → home services → professional services → retail/hospitality → creator/community → B2B SaaS → civic/public-sector). Joel reviewed each batch before the next started. This caught miscategorizations early and surfaced cross-vertical disambiguation seams (e.g., real estate ops vs lead-gen, dating gradient, surveillance vs court/correctional) that wouldn't have surfaced in end-to-end review.

**Universal-feedback framing.** Customer-facing honesty drove every Constraint source assignment. The customer landing on the widget with a verdict needs to know whether the constraint is industry-wide regulatory (FCC, FDA, state law), industry-wide standard (TCR Special, carrier policy), RelayKit-specific permanent (values posture), RelayKit-specific deferred (ops capacity), RelayKit-specific case-by-case (vetting), or not applicable (standard). The framing tells them whether to shop other providers or accept SMS isn't their channel.

**No meta-routing rows.** During B2B SaaS batch, PM proposed a "vertical-specific SaaS catch-all" row to absorb indie devs in narrow verticals not fitting elsewhere. Joel rejected: a catch-all absorbs customer-pull signal we'd rather see surfaced as "you don't have my vertical → tell us about it." That signal is how we learn which sub-verticals to author next. The principle generalizes: don't create meta-routing rows; let unfit customers hit an explicit "not yet served" path that's more honest than routing into an underpowered placeholder. **Methodology principle worth carrying forward to product design more broadly.**

**Anchored validation.** Three sub-verticals had primer-depth treatment in `vertical-constraints.md` §4 before this research started: legal practice (§4a), fintech-banking (§4b), healthcare administrative (§4c). Each anchored its respective family's first batch (professional services, financial, healthcare) and validated that the schema field shape captured real authored rules without lossy compression. The other 133 sub-verticals are bucket-shaped only — rules drafting happens in subsequent primer-authoring sessions.

**The output is not committed policy.** It's PM's best-judgment proposal. Bucket values shift based on Joel's read, customer pull, Sinch feedback. The durable artifact is the *structure* — sub-verticals enumerated, bucket-shaped, mapped to schema fields. Specific bucket values stay editable in Airtable forever.

## 2. Bucket distribution observations

Across 136 sub-verticals:

- **🟢 In-scope, no content rules:** dominant in home services (12/16) and retail (15/22). Strategic asset — the widget UX feels fast and welcoming to the largest indie-dev customer pool (e-commerce, restaurants, salons, hotels, fitness, subscription boxes, trade services, project management, dev tools). Heavy verticals correctly feel slower and more careful. The shape of the corpus is doing strategic work.
- **🟡 In-scope, with content rules:** scattered across all families. Where real rule layers exist (HIPAA-hygiene, FDCPA-adjacent, attorney-client privilege, EEOC-consent, locksmith fraud, fair-housing) the rules are documented carrier-enforcement categories or industry-standard practice, not authored opinions.
- **🟠 Vetting-required (indeterminate):** concentrated in financial (5/13), creator/community (5/18 counting #4 and #8), civic/public-sector (8/18 — highest density). TCR Special-category territory plus case-by-case vetting burden. Vetting backlog will be a real operational concern post-launch.
- **🔴 Barred at launch (carrier prohibition statutory):** SHAFT-anchored. Cannabis, firearms, vape/tobacco, adult content, adult dating. All industry-wide regulatory, not authored. One additional row at this tier: B2B SaaS #9 surveillance — but with RelayKit-specific permanent framing rather than carrier-prohibition. See §3 below.
- **⚫ Declined at launch (RelayKit-specific deferred):** three rows. Financial #12 real-estate lead-gen, home services #15 solar lead-gen, creator/community #6 audience-growth tooling. All "industry serves with deep vetting infrastructure; we don't have that capacity at launch" cases. Distinct from the values-bar in surveillance (see §3).

**Pattern by family:**

| Family | 🟢 | 🟡 | 🟠 | 🔴 | ⚫ | Character |
|---|---|---|---|---|---|---|
| Financial services | 2 | 3 | 6 | 1 | 1 | Heavy vetting, regulated |
| Healthcare | 2 | 4 | 3 | 0 | 3 | BAA-gated, deferred-heavy |
| Home & local services | 11 | 2 | 2 | 0 | 1 | Mostly standard |
| Professional services | 10 | 6 | 2 | 0 | 0 | Standard with B2B exceptions |
| Retail & hospitality | 15 | 0 | 3 | 4 | 0 | Standard + SHAFT bars |
| Creator & community | 6 | 3 | 8 | 1 | 1 | Middle-heavy, abuse-pattern-rich |
| B2B SaaS & dev tooling | 12 | 5 | 1 | 0 | 0 | Lightest, with surveillance bar |
| Civic & public sector | 6 | 4 | 8 | 0 | 0 | TCR-framework-gated |
| **Totals** | **64** | **27** | **33** | **6** | **5** | |

(Counting note: B2B SaaS #9 surveillance counted in 🔴 column; its Constraint-source framing is documented separately in §3. Healthcare 🔴 = 0 because BAA-gated rows land at ⚫ deferred, not 🔴 statutory-barred.)

## 3. Constraint source patterns

The Constraint source field is doing universal-feedback work. Patterns:

**Industry-wide regulatory** applies where federal/state statute drives the constraint (FCC, FDA, FDCPA, TCPA, state alcohol/firearms/tobacco regulation). Customer right next move: accept SMS isn't viable through standard infrastructure. Includes SHAFT (TCR carrier implementation of underlying federal regulatory posture), debt collection (FDCPA), some immigration/court/correctional rows, emergency alerts.

**Industry-wide standard** applies where TCR Special-category framework or carrier-policy convention drives the constraint, but it's implemented at the industry layer (all reputable providers handle it the same way). Customer right next move: accept industry-standard vetting overhead. Includes gambling, sweepstakes, dating, ticket resale, political, government, crypto/Web3 — also alcohol delivery and SHAFT-adjacent rows that aren't statutorily prohibited.

**RelayKit-specific, permanent** is rare and load-bearing. Used once in corpus: B2B SaaS #9 surveillance/spyware-adjacent. Anchored as values posture, not capacity gate. The category is barred under any future RelayKit operating scale — not deferred. This is the riskiest constraint-source call in the corpus and the framing was deliberate. Future PMs evaluating new RelayKit-specific bars should apply the test: is this a category we'd serve at any operating scale? If yes → "deferred." If no → "permanent."

**RelayKit-specific, deferred** captures categories industry serves with deep vetting infrastructure we don't have at launch ops capacity. Three rows: real-estate lead-gen, solar lead-gen, audience-growth tooling. Plus healthcare BAA-gated rows (#1 clinical, #3 mental health, #7 pharmacies). Customer right next move: shop other providers who've built the vetting infrastructure; check back as RelayKit grows.

**RelayKit-specific, case-by-case** captures vetting-required rows where the case-by-case nature is the constraint itself — the bucket can't be determined from the sub-vertical alone. Healthcare condition management (#6), medical billing (#8), medical devices (#10), insurance navigation (#11), creator monetization (#4), CPaaS-adjacent (#14), correctional/probation (#12), public defender/legal aid (#18 in civic).

**Not applicable** applies to clean 🟢 standard rows. The majority position across the corpus.

**Permanent vs deferred bright line (worth carrying forward):** values posture vs capacity gate. Document the reasoning explicitly when assigning "permanent" because future PMs will revisit and the framing needs to defend itself without the original context.

## 4. Shared-prohibition patterns (and the duplicate-per-row implementation)

Several prohibition patterns recur across multiple sub-verticals:

- **FDCPA-adjacent / no-coercion language in payment/arrears messaging** — financial #10 (collections, full case), professional services #15 (property management rental-arrears), civic #9 (utility shutoff). Likely also healthcare #2/#8 (medical billing past-due) and B2B SaaS #5 (HR payroll-arrears).
- **HIPAA-hygiene / no clinical content in SMS body** — healthcare #2 administrative (full case), healthcare #8 medical billing, healthcare #13 virtual-first clinic admin. Cross-applies wherever PHI-adjacent content could leak.
- **Attorney-client privilege hygiene** — professional services #1 (full case), civic #18 (public defender/legal aid).
- **Consent hygiene / no cold-outreach without consent** — B2B SaaS #2 CRM, B2B SaaS #6 ATS, professional services #8 recruiting.
- **EEOC-adjacent framing hygiene** — B2B SaaS #5 HR, B2B SaaS #6 ATS, professional services #8 recruiting.
- **No guaranteed outcomes / no professional-results promises** — professional services #1 legal, financial #1/#2 banking/payments (guaranteed returns variant), professional services #14 real estate ops (guaranteed sale price variant).
- **SHAFT regulatory framing** — retail #16/#17/#18/#19, creator/community #14 adult dating.

**Implementation note for synthesis methodology:** these patterns get **duplicated per sub-vertical row in the Rules table, not multi-linked**. The schema's `Applies to` field is single-link (resolved in Session 116 diligence pass) precisely to preserve per-sub-vertical rewrite quality — utility-shutoff context phrasing differs from rental-arrears phrasing differs from medical-billing past-due phrasing, even when the underlying prohibition (no-coercion-in-payment-language) is identical. The duplication is the feature, not a bug.

**Authoring shortcut for Session 118+ rule-population sessions:** write the prohibition once in a working scratch, then produce per-sub-vertical safe rewrites that adapt to context. Source field on each Rule row points back to this synthesis section so the shared lineage is traceable.

## 5. Cross-vertical disambiguation seams

These are the load-bearing distinctions where the widget secondary dropdown earns its UX cost. Each is a case where the customer landing on the same business surface gets a different verdict based on product shape:

1. **Real estate ops (professional services #14, 🟡) vs real-estate lead-gen referral (financial #12, ⚫).** Same business surface; different SMS shape; different verdict. Cleanest universal-feedback example in the corpus.
2. **Mainstream dating (creator/community #12, 🠠) vs non-romantic social (#13, 🟢) vs adult dating (#14, 🔴).** Three-tier framing handled gracefully via secondary dropdown.
3. **Court/correctional comms (civic #11/#12, 🠠 vetting) vs surveillance/spyware (B2B SaaS #9, 🔴 values-bar).** Consent-regime bright line: is the SMS recipient overtly aware they're under supervision and was that supervision statutorily or contractually authorized? Yes → vetting. No → values-bar. Future PMs evaluating new monitoring-adjacent sub-verticals apply this test first.
4. **Campaign-ops tooling (civic #4) vs political/advocacy platform SaaS (creator/community #16).** Both vet under TCR Political; distinction is product shape (one campaign internal ops vs. multi-tenant platform).
5. **Solar installation dispatch (home services #14, 🟢) vs solar lead-gen (#15, ⚫).** Same business surface; different SMS shape; different verdict.
6. **Clinical care (healthcare #1, ⚫ BAA-gated) vs administrative healthcare (#2, 🟡) vs virtual-first clinic admin (#13, 🟡) vs veterinary (#9, 🟡).** PHI-adjacency drives the gradient.
7. **Creator monetization clean (creator/community #4, 🠠) vs adult creator monetization (routes to retail #19, 🔴 SHAFT).** Vetting flow needs an explicit upfront question routing the SHAFT-variant correctly before deeper review. Flagged for vetting-workflow design session.
8. **B2B SaaS that builds for vertical X (e.g., a property-management SaaS) vs operates in vertical X.** Resolved by removing the meta-routing row; customer-pull signal surfaces explicitly when fit is missing.
9. **Direct moving company ops (home services #5, 🟢) vs moving brokerage/aggregator (#16, 🠠).** Bait-and-switch abuse profile in brokering.
10. **In-person mobile notary (professional services #10, 🟢) vs remote online notarization (#16, 🟡).** State-by-state RON authorization variance.

These ten seams are where the widget UX delivers its core value: same plain-English customer description, different bucket call. Document carefully when implementing the widget secondary dropdown.

## 6. Operational notes for downstream sessions

**For Session 118 Airtable population:**

1. Populate Verticals table first (8 rows). Use Slug values exactly as listed in each batch header.
2. Populate Sub-verticals next (136 rows). Parent vertical links to corresponding Verticals row. Status = "Bucket assigned" for all rows initially. Priority unset (Joel's pass later).
3. Populate Rules table for the three anchored sub-verticals only: professional services #1 (legal, ~8-10 rules from §4a), financial #1 (banking, ~6-8 rules from §4b), healthcare #2 (admin healthcare, ~5-7 rules from §4c). Total ~20 Rule rows. Source field references the §4 sections.
4. Joel builds the 11 views in Airtable UI after rows land (specs in `AIRTABLE_SCHEMA.md`).

**For vetting-workflow design sessions:**

- Creator/community #4 needs an explicit "Does any creator on your platform produce adult content?" routing question before deeper vetting review. SHAFT-variant routes to retail #19 decline.
- Civic/public-sector vetting concentrations (8 rows) will define operational throughput needs. TCR-framework registration is process-heavy.
- Disinformation-as-a-service / astroturfing platforms don't get a bucket row, but vetting layer needs to recognize and decline them when they surface through political/advocacy intake.

**For per-primer authoring sessions (post-launch):**

- Three anchored sub-verticals already exist (§4a/§4b/§4c). Next priority: any sub-vertical landing in 🟡 in-scope-with-content-rules where customer-pull signal emerges. Don't pre-author primers for all 27 🟡 rows — author as customer pull demands.

**For widget UX implementation:**

- Civic/public-sector has highest routing-trigger density (12 of 18 with ✓). Test the secondary dropdown UX against this family first — if it works here, it works everywhere.
- Creator/community verdict copy may want more verbose framing than retail/home-services. Almost every row in that family needs to communicate *why* the bucket call landed where it did (audience-growth deferred on ops; adult dating SHAFT; creator monetization clean-vs-SHAFT-adjacent; political vs nonprofit TCR-split; dating-gradient carrier-scrutiny). Verbose-verdict-copy density is family-dependent — script accordingly.
- 🟢 standard verdicts can be fast/welcoming. 🠠 vetting verdicts need timeline expectations. ⚫ deferred verdicts need universal-feedback honesty ("industry serves this; we don't yet"). 🔴 barred verdicts need carrier-vs-RelayKit-source distinction. Verdict copy template families correspond to bucket types.

## 7. The 136 rows

Format below maps 1:1 to Airtable Sub-verticals table fields. Each batch's parent Vertical row is named first. Bucket values use the exact select-option strings from `AIRTABLE_SCHEMA.md`.

---

### Vertical: Financial services
**Slug:** `financial-services` | **TCR mapping:** FINANCIAL

| # | Name | Bucket | Constraint source | Routing trigger | Bucket reason | Notes |
|---|---|---|---|---|---|---|
| 1 | Banking & budgeting apps (consumer) | 🟡 In-scope, with content rules | Industry-wide regulatory | ✓ | Standard eligibility | Mint-style budgeting / neobank wrapper. §4b authored. Rules: no guaranteed returns, no investment advice framing, transaction-amount handling. |
| 2 | Payments / money movement (consumer) | 🟡 In-scope, with content rules | Industry-wide regulatory | ✓ | Standard eligibility | Venmo-for-X, P2P apps, payout notifications. Same rule family as #1. |
| 3 | Personal investing / brokerage | 🟠 Vetting-required (indeterminate) | Industry-wide standard | ✓ | TCR Special category | Robinhood-for-X or crypto trading. Investment advice + FINRA-adjacent. Vet. |
| 4 | Crypto / Web3 wallets, exchanges, DeFi | 🟠 Vetting-required (indeterminate) | Industry-wide standard | ✓ | TCR Special category | TCR explicitly flags crypto. Vet — wallet ≠ exchange ≠ yield products. |
| 5 | Lending / BNPL / credit | 🟠 Vetting-required (indeterminate) | Industry-wide standard | ✓ | TCR Special category | Affirm-for-X, Klarna clones, short-term lending. TILA/UDAAP scrutiny. Includes mortgage origination tooling — split only if a real customer surfaces. Payday-adjacent declines, prime BNPL likely vettable. |
| 6 | Insurance (consumer-facing) | 🟠 Vetting-required (indeterminate) | Industry-wide regulatory | ✓ | TCR Special category | Lemonade-style insurtech, policy management. Conservative posture; likely-promotable to 🟡 if Sinch confirms standard pathway. |
| 7 | Tax prep / filing software (consumer) | 🟡 In-scope, with content rules | Industry-wide standard | ✓ | Standard eligibility | TurboTax-for-X. Light rules: refund/amount framing, IRS-impersonation avoidance. Not primer-depth. |
| 8 | Accounting / bookkeeping SaaS (B2B sold to SMBs) | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | QuickBooks-for-creators. B2B transactional. Standard. |
| 9 | Financial advisor / wealth-management tools | 🟠 Vetting-required (indeterminate) | Industry-wide regulatory | ✓ | TCR Special category | SEC/state-RIA scrutiny. CRM-for-RIAs, client-portal SMS. Vet. |
| 10 | Debt collection / collections tooling | 🔴 Barred at launch | Industry-wide regulatory | | Carrier prohibition (statutory) | FDCPA. Carriers flat-decline collections SMS through standard 10DLC. |
| 11 | Money-transfer remittance (cross-border) | 🟠 Vetting-required (indeterminate) | Industry-wide regulatory | ✓ | TCR Special category | Wise/Remitly clones. FinCEN MSB territory. Country-allowlist friction (Layer B) plus carrier scrutiny. |
| 12 | Real-estate referral / lead-gen SMS | ⚫ Declined at launch | RelayKit-specific, deferred | | Customer-pull dependent | Highest-abuse category in carrier enforcement data. Industry handles with heavy filtering; we defer until ops headcount. |
| 13 | Earned wage access / on-demand pay | 🟠 Vetting-required (indeterminate) | Industry-wide standard | ✓ | TCR Special category | DailyPay/Earnin/Branch territory. TCR classification sits unsettled between lending and payroll. |

---

### Vertical: Healthcare
**Slug:** `healthcare` | **TCR mapping:** HEALTHCARE

| # | Name | Bucket | Constraint source | Routing trigger | Bucket reason | Notes |
|---|---|---|---|---|---|---|
| 1 | Clinical care / patient-facing (covered entities) | ⚫ Declined at launch | RelayKit-specific, deferred | | BAA gating (legal call) | Telehealth, EHR, patient portal. HIPAA + BAA territory. Industry serves (Twilio HIPAA edition, Sinch BAA path); we defer until BAA program exists. D-18 lineage. Includes lab results delivery, imaging reports, "test ready" notifications. |
| 2 | Healthcare administrative (scheduling, intake, billing — non-clinical) | 🟡 In-scope, with content rules | Industry-wide standard | ✓ | Standard eligibility | §4c authored. Dental office, PT, clinic intake. No PHI in body. Rules: no diagnosis/treatment, no medication names, no test results. HIPAA-hygiene patterns are industry-standard across providers. |
| 3 | Mental health / therapy platforms | ⚫ Declined at launch | RelayKit-specific, deferred | | BAA gating (legal call) | BetterHelp-for-X, Talkspace clones. Same BAA gating as #1. |
| 4 | Wellness / fitness / habit tracking (non-clinical) | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Strava-for-X, habit trackers, meditation reminders. No medical claims = standard. |
| 5 | Nutrition / meal planning (non-clinical) | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | MyFitnessPal-for-X. Standard unless framing escalates to #6. |
| 6 | Health condition management (consumer, non-clinical framing) | 🟠 Vetting-required (indeterminate) | RelayKit-specific, case-by-case | ✓ | Vetting burden (case-by-case) | Diabetes-coaching, fertility tracking, chronic-condition support. Vet — informational ≠ diagnostic. |
| 7 | Pharmacies / prescription apps | ⚫ Declined at launch | RelayKit-specific, deferred | | BAA gating (legal call) | Prescription = PHI in most state interpretations. Same BAA gating. |
| 8 | Medical billing / RCM tools (B2B) | 🟡 In-scope, with content rules | RelayKit-specific, case-by-case | ✓ | Standard eligibility | B2B billing SaaS for clinics. Staff-facing, no patient PHI in SMS. Rules: no patient names + diagnosis combinations, no account-number + condition pairing. |
| 9 | Veterinary clinics & pet health | 🟡 In-scope, with content rules | Not applicable | ✓ | Standard eligibility | Not HIPAA-covered. Light rules around medication mentions for liability hygiene. |
| 10 | Medical device / wearable companion apps | 🟠 Vetting-required (indeterminate) | RelayKit-specific, case-by-case | ✓ | Vetting burden (case-by-case) | Oura-for-X, CGM companion apps. FDA-cleared crosses into clinical; consumer wearables don't. Vet on regulatory status. |
| 11 | Health insurance navigation / benefits | 🟠 Vetting-required (indeterminate) | RelayKit-specific, case-by-case | ✓ | TCR Special category | Open-enrollment helpers, benefits-apps. Adjacent to clinical without being clinical. |
| 12 | Clinical research / patient recruitment | 🟠 Vetting-required (indeterminate) | Industry-wide regulatory | ✓ | TCR Special category | Trial-recruitment platforms. IRB-governed, HIPAA-adjacent. |
| 13 | Virtual-first clinic admin (booking/intake, no clinical content in SMS) | 🟡 In-scope, with content rules | Industry-wide standard | ✓ | Standard eligibility | Virtual-first practices distinct from brick-and-mortar admin (#2). If any SMS touches clinical content — appointment notes referencing symptoms, follow-up about results — escalates to #1 clinical. |
| 14 | Caregiving / home health coordination | 🟠 Vetting-required (indeterminate) | RelayKit-specific, case-by-case | ✓ | Vetting burden (case-by-case) | Care.com-for-X, home-health-aide scheduling, family-caregiver coordination. Sits between #2 admin and #6 condition management. |

---

### Vertical: Home & local services
**Slug:** `home-local-services` | **TCR mapping:** PROFESSIONAL or RETAIL depending on row

| # | Name | Bucket | Constraint source | Routing trigger | Bucket reason | Notes |
|---|---|---|---|---|---|---|
| 1 | Trade services dispatch (HVAC, plumbing, electrical) | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | ServiceTitan-for-X. "Tech is 20 min away," "job complete." TCR PROFESSIONAL. |
| 2 | Landscaping / lawn care | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Route-management for lawn-care crews. |
| 3 | Cleaning services (residential + commercial) | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Handy-for-X, Tidy clones. |
| 4 | Home improvement / contractors / remodeling | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Contractor-CRM. Commitments live in contracts, not SMS. |
| 5 | Moving services (direct ops) | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Direct moving company dispatch. Brokering/lead-gen = #16. |
| 6 | Pest control | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Service-window + treatment-complete pattern. |
| 7 | Pool / spa maintenance | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Same pattern as #2/#6. |
| 8 | Locksmith / emergency services | 🟡 In-scope, with content rules | Industry-wide standard | ✓ | Standard eligibility | Documented carrier-fraud category. Rules: no "guaranteed arrival time," no pricing-bait patterns. |
| 9 | Junk removal / hauling | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | 1-800-Got-Junk-for-X. |
| 10 | Appliance repair | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Same pattern as #1. |
| 11 | Home security / monitoring (consumer) | 🟠 Vetting-required (indeterminate) | Industry-wide standard | ✓ | TCR Special category | Ring-for-X / SimpliSafe companion. False-alarm liability, dispatch coordination. |
| 12 | Storage facilities (self-storage SaaS) | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Self-storage management. Access codes, payment reminders. |
| 13 | Pet services (grooming, walking, boarding, training) | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Wag-for-X, Rover clones, grooming CRMs. Distinct from veterinary (healthcare #9). |
| 14 | Solar installation dispatch | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Installation/service ops only — lead-gen is #15. |
| 15 | Solar lead-generation | ⚫ Declined at launch | RelayKit-specific, deferred | | Customer-pull dependent | Same abuse profile as real-estate referral SMS (financial #12). Industry serves with heavy vetting; we defer until ops capacity exists. |
| 16 | Moving services brokerages / aggregators | 🟠 Vetting-required (indeterminate) | Industry-wide standard | ✓ | TCR Special category | FMCSA enforcement actions, bait-and-switch pricing patterns. Direct moving company ops = #5 standard. |

---

### Vertical: Professional services
**Slug:** `professional-services` | **TCR mapping:** PROFESSIONAL

| # | Name | Bucket | Constraint source | Routing trigger | Bucket reason | Notes |
|---|---|---|---|---|---|---|
| 1 | Legal practice tools (law-firm CRM, client intake, case management) | 🟡 In-scope, with content rules | Industry-wide standard | ✓ | Standard eligibility | §4a authored. Clio-for-X. Rules: no guaranteed outcomes, no legal advice framing, attorney-client privilege hygiene. |
| 2 | Accounting / CPA practice tools (B2B, not bookkeeping SaaS) | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | CPA-firm-CRM. Distinct from financial #8 (bookkeeping SaaS sold to SMBs). Includes solo-bookkeeper tools. |
| 3 | Tax practice tools (preparer-facing, B2B) | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Tools for tax preparers. Distinct from financial #7 (consumer tax-prep). |
| 4 | Business / management consultants | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Consultant-practice CRM. |
| 5 | Marketing / advertising agencies | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Agency-CRM. Distinct from marketing-as-a-channel (separate vertical). |
| 6 | Design studios / freelance design tools | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Dribbble-meets-Honeybook pattern. |
| 7 | Architecture / engineering firms | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Firm-CRM tooling. |
| 8 | Recruiting / staffing agencies | 🟡 In-scope, with content rules | Industry-wide standard | ✓ | Standard eligibility | Recruiter-CRM. Rules: candidate-consent hygiene, no aggressive "apply now!" patterns, EEOC-adjacent language hygiene. |
| 9 | Immigration services (visa/document prep, non-attorney) | 🟠 Vetting-required (indeterminate) | RelayKit-specific, case-by-case | ✓ | Vetting burden (case-by-case) | Sits between #1 (attorney-supervised) and standalone document-prep (UPL exposure). Vet on substance. |
| 10 | Notary services / mobile notaries (in-person) | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | NotaryNinja-for-X. Mobile notary = this row. RON = #16. |
| 11 | Translation / interpretation services | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Agency-CRM for translators. |
| 12 | Private investigation / security services | 🟠 Vetting-required (indeterminate) | Industry-wide standard | ✓ | TCR Special category | PI-firm tooling. State-licensed, surveillance-tool-adjacent scrutiny. |
| 13 | Coaching / executive coaching (non-clinical, non-therapy) | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Coach-CRM. Includes career/job-search coaching. If framing crosses into clinical territory (anxiety treatment, depression management), escalates to healthcare #3. |
| 14 | Real estate agents / brokerages (operations, not lead-gen) | 🟡 In-scope, with content rules | Industry-wide standard | ✓ | Standard eligibility | Compass-for-X. Rules: no "guaranteed sale price" language, no fair-housing-adjacent framing issues. Distinct from financial #12 (real-estate lead-gen referral SMS). |
| 15 | Property management (rental ops) | 🟡 In-scope, with content rules | Industry-wide standard | ✓ | Standard eligibility | Property-management SaaS. Rules: no late-fee-threat language, FDCPA-adjacent hygiene for arrears comms. |
| 16 | Remote online notarization (RON) | 🟡 In-scope, with content rules | Industry-wide standard | ✓ | Standard eligibility | Notarize-for-X, BlueNotary clones. State-by-state RON authorization variance; identity-verification messaging requirements. In-person mobile notary = #10. |

---

### Vertical: Retail & hospitality
**Slug:** `retail-hospitality` | **TCR mapping:** RETAIL or HOSPITALITY depending on row

| # | Name | Bucket | Constraint source | Routing trigger | Bucket reason | Notes |
|---|---|---|---|---|---|---|
| 1 | E-commerce / online retail (general consumer goods) | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Shopify-app-for-X. Includes auction-format e-commerce — bid-related comms live in product UI, post-auction SMS is identical to standard retail. TCR RETAIL. |
| 2 | Restaurants (single-location operations) | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Resy-for-independents. TCR HOSPITALITY. |
| 3 | Restaurant chains / multi-location ops | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Same pattern as #2 at scale. |
| 4 | Food delivery / ghost kitchens | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | DoorDash-for-X. |
| 5 | Grocery / specialty food retail | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Instacart-for-X. |
| 6 | Alcohol delivery / alcohol retail | 🟠 Vetting-required (indeterminate) | Industry-wide standard | ✓ | TCR Special category | TCR SHAFT-adjacent (the A). Drizly-for-X. State-by-state licensing. Includes subscription wine/beer clubs (Winc-for-X pattern) — same vetting path. |
| 7 | Cafés / coffee shops (single location) | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Mobile-order pickup pattern. |
| 8 | Hotels / boutique accommodations | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Boutique-hotel PMS. |
| 9 | Short-term rental management (Airbnb-host tooling) | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Hostfully-for-X, Guesty clones. |
| 10 | Salons / spas / personal grooming | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Booksy-for-X. |
| 11 | Tattoo / piercing studios | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Studio CRM. |
| 12 | Event ticketing (primary sales — venues, organizers) | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Venue-CRM or event-platform. |
| 13 | Ticket resale / secondary marketplace | 🟠 Vetting-required (indeterminate) | Industry-wide standard | ✓ | TCR Special category | StubHub-clone. Scalper-adjacent abuse patterns, dynamic-pricing surge messaging, urgency framing. |
| 14 | Gyms / fitness studios (membership ops) | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Mindbody-for-X. |
| 15 | Subscription boxes / recurring physical goods | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Cratejoy-for-X. |
| 16 | Cannabis retail / dispensaries | 🔴 Barred at launch | Industry-wide regulatory | | Carrier prohibition (statutory) | TCR SHAFT — explicit carrier prohibition. Currently in `industry-gating.ts` as Tier 3. Cannabis carve-outs exist in some states for medical/regulated programs but require specialized non-10DLC infrastructure — not industry-standard SMS. |
| 17 | Firearms / ammunition retail | 🔴 Barred at launch | Industry-wide regulatory | | Carrier prohibition (statutory) | TCR SHAFT. Specialized FFL communication tools exist outside 10DLC. |
| 18 | Vape / tobacco / nicotine retail | 🔴 Barred at launch | Industry-wide regulatory | | Carrier prohibition (statutory) | TCR SHAFT (the T). Carrier-prohibited at 10DLC layer. |
| 19 | Adult content / age-gated retail (non-pharmaceutical) | 🔴 Barred at launch | Industry-wide regulatory | | Carrier prohibition (statutory) | TCR SHAFT (the S). Carrier-prohibited. |
| 20 | Gambling / sportsbooks / casino apps | 🟠 Vetting-required (indeterminate) | Industry-wide standard | ✓ | TCR Special category | TCR Gambling Special. State-licensed (DraftKings/FanDuel pattern). Not flat-declined like SHAFT — case-by-case on state licensure. |
| 21 | Sweepstakes / contest platforms | 🟠 Vetting-required (indeterminate) | Industry-wide standard | ✓ | TCR Special category | Documented "you won!" scam abuse patterns. |
| 22 | Pet retail / specialty pet goods | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Chewy-for-X. Distinct from veterinary (healthcare #9) and pet services (home services #13). |

---

### Vertical: Creator economy & community
**Slug:** `creator-community` | **TCR mapping:** PROFESSIONAL, RETAIL, or LOW_VOLUME depending on row

| # | Name | Bucket | Constraint source | Routing trigger | Bucket reason | Notes |
|---|---|---|---|---|---|---|
| 1 | Newsletter / email creator tools (paid subscriptions) | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Substack-for-X. |
| 2 | Course creator / cohort-based learning platforms | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Teachable-for-X, Maven-for-X. |
| 3 | Membership / community platforms (Circle/Mighty Networks style) | 🟡 In-scope, with content rules | Industry-wide standard | ✓ | Standard eligibility | Community SaaS. Rules: no aggressive engagement-baiting SMS, no DM-relay without consent, no growth-hack "invite 5 friends" SMS. |
| 4 | Creator monetization tools (tip jars, paid DMs, fan-club tooling) | 🟠 Vetting-required (indeterminate) | RelayKit-specific, case-by-case | ✓ | Vetting burden (case-by-case) | Patreon-clone, Cameo-for-X, paid-DM for legit creators. Adult-content variants land in retail #19 (🔴 SHAFT). Customers landing here who indicate adult-content variants in vetting intake route to retail #19. Vetting flow needs an explicit upfront question: "Does any creator on your platform produce adult content?" |
| 5 | Live streaming / video creator tools | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Stream-management for Twitch/YouTube creators. |
| 6 | Audience-growth / follower-management tools | ⚫ Declined at launch | RelayKit-specific, deferred | | Vetting burden (case-by-case) | "Grow your Instagram with SMS" category. High-abuse profile: follower-buying, engagement-pods, bulk-DM SMS. Industry serves some via heavy vetting; we don't have ops capacity. Legitimate audience-analytics tools land in B2B SaaS as analytics tooling. |
| 7 | Podcast hosting / podcaster tools | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Buzzsprout-for-X. |
| 8 | Influencer marketplaces / brand-creator matchmaking | 🟠 Vetting-required (indeterminate) | Industry-wide standard | ✓ | TCR Special category | AspireIQ-for-X. Vet on whether SMS is to creators (B2B) or to brands' end-consumers (heavier). |
| 9 | Fan engagement / fan club platforms | 🟡 In-scope, with content rules | Industry-wide standard | ✓ | Standard eligibility | Fan-club CRM. Rules: no celebrity-impersonation SMS patterns, fan-opt-in consent hygiene, no "exclusive offer from [celebrity]" without verifiable authorization. |
| 10 | Patreon-style recurring patronage (non-adult) | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Adult-content variants land in retail #19. |
| 11 | Online community for affinity groups (hobby, professional, support) | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Hobby forum SaaS, professional-association communities, peer-support (non-clinical). Includes async/Discord-style learning communities — cohort-based learning is #2. |
| 12 | Dating / matchmaking apps | 🟠 Vetting-required (indeterminate) | Industry-wide standard | ✓ | TCR Special category | Hinge-for-X. TCR Special — romance-scam abuse vectors. |
| 13 | Social discovery / friendship apps (non-dating) | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Bumble-BFF-for-X, Meetup-for-X. Carrier scrutiny drops when framing is explicitly non-romantic. |
| 14 | Adult dating / hookup apps | 🔴 Barred at launch | Industry-wide regulatory | | Carrier prohibition (statutory) | TCR SHAFT. Same regulatory framing as retail #19. |
| 15 | Religious / faith-based community tools (platform SaaS) | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Planning-Center-for-X platform layer. Institutional church/mosque/synagogue admin = civic #14. |
| 16 | Political / advocacy / cause-based organizing (platform SaaS) | 🟠 Vetting-required (indeterminate) | Industry-wide standard | ✓ | TCR Special category | NGP-VAN-for-X. Multi-tenant platform-shape distinct from civic #4 (single-campaign internal ops). Both vet under TCR Political. |
| 17 | Nonprofit / charity / fundraising platforms (SaaS) | 🟡 In-scope, with content rules | Industry-wide standard | ✓ | Standard eligibility | DonorBox-for-X. Rules: no donation-urgency manipulation, no implied tax-deductibility without 501c3 disclosure, no shame-pattern asks. Institutional 501c3 internal donor-comms tooling = civic #13. |
| 18 | Web3 / DAO governance & coordination tooling | 🟠 Vetting-required (indeterminate) | Industry-wide standard | ✓ | TCR Special category | Distinct from financial #4 (crypto-financial wallet/exchange ops) and #3 (general community). DAO-specific abuse: pump-and-dump signal SMS, governance-manipulation, airdrop-scam coordination. Token transactions → financial #4; community coordination shape → #3; governance/coordination overlap with crypto-adjacent abuse → this row. |

---

### Vertical: B2B SaaS & developer tooling
**Slug:** `b2b-saas` | **TCR mapping:** PROFESSIONAL or LOW_VOLUME depending on row

| # | Name | Bucket | Constraint source | Routing trigger | Bucket reason | Notes |
|---|---|---|---|---|---|---|
| 1 | Project management / productivity SaaS | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Linear-for-X, Asana-clone. |
| 2 | CRM / sales SaaS | 🟡 In-scope, with content rules | Industry-wide standard | ✓ | Standard eligibility | HubSpot-for-X. Rules at customer-facing comms layer: no cold-outreach without consent hygiene, no spam-pattern prospecting. Internal team-comms shape is standard. |
| 3 | Customer support / helpdesk SaaS | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Intercom-for-X. |
| 4 | Internal communications / team chat tools | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Slack-for-X variants. |
| 5 | HR / HRIS / payroll-adjacent SaaS | 🟡 In-scope, with content rules | Industry-wide standard | ✓ | Standard eligibility | Gusto-for-X. Rules: no salary/comp-disclosure in SMS body, EEOC-adjacent hygiene for recruiting flows, no termination/discipline via SMS. |
| 6 | Applicant tracking / recruiting platforms | 🟡 In-scope, with content rules | Industry-wide standard | ✓ | Standard eligibility | Greenhouse-for-X. Adjacent to professional services #8 — distinction is product shape (ATS software vs. recruiting agency operations). |
| 7 | Identity / authentication / SSO SaaS | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Auth0-clone. RelayKit's wedge use case lives at the SDK layer (sendCode/checkCode); the dev *building* an auth product is a clean standard customer at the vertical layer. |
| 8 | Cybersecurity / threat detection / SIEM | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Datadog-for-security. Incident alerts to ops teams. Distinct from #9 surveillance via consent regime (overt enterprise security ops vs. covert monitoring). |
| 9 | Surveillance / employee monitoring / spyware-adjacent | 🔴 Barred at launch | RelayKit-specific, permanent | | Vetting burden (case-by-case) | Stalkerware-adjacent — distinct from #8 legitimate cybersecurity. **Permanent reflects values posture, not capacity.** The category is barred under any future RelayKit operating scale — not deferred. Distinct from creator/community #6 audience-growth (deferred on ops). Carriers don't statutorily prohibit MDM/monitoring software — they tolerate enterprise MDM with thin consent. The honest Bucket reason is values-bar, not carrier-imposed. We bar this because we choose to. Legitimate enterprise MDM for company-owned devices with overt consent → #1 or #8. |
| 10 | Marketing automation / email-marketing SaaS | 🟡 In-scope, with content rules | Industry-wide standard | ✓ | Standard eligibility | Mailchimp-for-X. Two-layer concern: the dev's own operational SMS is standard B2B; *what their customers send through their platform* concentrates TCPA risk. Vetting at activation may apply, but widget-time verdict reflects the dev's actual question. |
| 11 | Analytics / business intelligence SaaS | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Mixpanel-for-X. |
| 12 | Developer tools / API platforms / infrastructure SaaS | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Vercel-for-X. Includes AI/ML platforms — model-deployment notifications, training-complete alerts, inference-quota warnings. SMS shape identical to standard dev-tools operational. Includes workflow-automation platforms (Zapier-clone pattern) — chained-send rate-limit concerns handled at proxy layer (Layer B), not via content rules. |
| 13 | E-signature / document workflow SaaS | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | DocuSign-for-X. |
| 14 | Customer engagement / messaging platforms (CPaaS-adjacent) | 🟠 Vetting-required (indeterminate) | RelayKit-specific, case-by-case | ✓ | Vetting burden (case-by-case) | Reseller-framework concerns. Twilio-clone → decline; customer-engagement layer with SMS as one channel among many → vettable. |
| 15 | Survey / feedback collection SaaS | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Typeform-for-X. Survey-pull distinct from #10 marketing-automation push-engagement. |
| 16 | Logistics / supply-chain / fleet management SaaS | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Samsara-for-X. |
| 17 | Compliance / legal-ops / GRC tooling | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Vanta-for-X. Distinct from professional services #1 (legal practice tools). |
| 18 | Education / EdTech operational SaaS (K-12 and higher-ed admin tooling) | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | School-admin tooling, parent-comms apps, attendance systems. Distinct from creator/community #2 (cohort-based, creator-led learning). Real and large indie-dev category. |
| 19 | Childcare / preschool / after-school program operational SaaS | 🟡 In-scope, with content rules | Industry-wide standard | ✓ | Standard eligibility | Brightwheel-for-X. Rules: no behavioral-incident details in SMS body, no photo-of-child references without consent framing, no medical/dietary info in body. Distinct from #18 (institutional K-12) and healthcare #2 (administrative healthcare) — parent/child consent landscape. |
| 20 | IoT / connected-device platforms (consumer-facing) | 🟠 Vetting-required (indeterminate) | Industry-wide standard | ✓ | TCR Special category | Consumer IoT — smart home, connected appliances. Distinct from B2B IoT operational which folds to #12 or #16. Abuse vectors: device-alert manipulation, geofencing-based marketing. |

---

### Vertical: Civic & public sector
**Slug:** `civic-public-sector` | **TCR mapping:** GOVERNMENT, POLITICAL, or CHARITY depending on row

| # | Name | Bucket | Constraint source | Routing trigger | Bucket reason | Notes |
|---|---|---|---|---|---|---|
| 1 | Government agency communications (federal/state/local operational) | 🟠 Vetting-required (indeterminate) | Industry-wide standard | ✓ | TCR Special category | TCR Government vertical. Constituent-comms tooling. Includes election administration tooling — poll-worker coordination, voter-roll updates, election-night logistics. Distinct from #3 (voter-registration platforms, public-facing) and #4 (partisan campaign ops). Same TCR Government framework. |
| 2 | Emergency alerts / public safety notifications | 🟠 Vetting-required (indeterminate) | Industry-wide regulatory | ✓ | TCR Special category | Everbridge-for-X. FCC + WEA-adjacent. Critical-infrastructure framing means high vetting bar. |
| 3 | Voter registration / civic engagement (nonpartisan) | 🟠 Vetting-required (indeterminate) | Industry-wide standard | ✓ | TCR Special category | VoteAmerica-style. TCR distinguishes nonpartisan civic from #4 partisan political. |
| 4 | Political campaigns / partisan organizing (single-campaign ops) | 🟠 Vetting-required (indeterminate) | Industry-wide standard | ✓ | TCR Special category | TCR Political vertical. Single-campaign internal ops vs. multi-tenant advocacy-platform SaaS (creator/community #16). Both vet under TCR Political; distinction is product shape. |
| 5 | Public-school district communications | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Parent-comms tooling at district level. TCR allows under standard or LOW_VOLUME depending on district size. Distinct from B2B SaaS #18 (private/multi-district edtech SaaS) — district-direct customer. |
| 6 | Higher-education administration | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Campus-comms. Distinct from #2 (emergency alerts proper) and creator/community #2 (cohort-based learning). |
| 7 | Library systems / civic information services | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Hold-ready, due-date reminders, fines. |
| 8 | Public transit / mass transit operational | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Service disruptions, route changes. |
| 9 | Municipal utilities (water, power, gas) | 🟡 In-scope, with content rules | Industry-wide standard | ✓ | Standard eligibility | Utility-customer-comms SaaS. Rules: outage notifications need FCC-aligned framing, no shutoff-threat language without due-process disclosure (state PUC variance), no payment-collection drift into FDCPA territory. |
| 10 | 311 / non-emergency civic services | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | 311-platform tooling. |
| 11 | Court / judicial system communications | 🟠 Vetting-required (indeterminate) | Industry-wide regulatory | ✓ | TCR Special category | Court-notification tooling. Subpoenas, hearing reminders, jury duty. State-by-state judicial-rules variance. Due-process implications. **Distinct from B2B SaaS #9 (surveillance) via the consent regime:** court-supervised compliance is overt, statutorily-authorized, and the supervised party knows they're being supervised. Surveillance #9 is covert installation or thin-consent monitoring. Future PMs evaluating new monitoring-adjacent sub-verticals apply the consent test first: is the SMS recipient overtly aware they're under supervision and was that supervision statutorily or contractually authorized? Yes → vetting tier. No → values-bar tier. |
| 12 | Correctional / probation / parole communications | 🟠 Vetting-required (indeterminate) | Industry-wide regulatory | ✓ | Vetting burden (case-by-case) | Check-in/probation-management SaaS. Vulnerable-population with consent-complexity (court-ordered vs. voluntary). **Distinct from B2B SaaS #9 (surveillance) via consent regime** — same bright line as #11. Court-supervised compliance is overt and statutorily authorized; surveillance #9 is covert or thin-consent. Apply the consent test: overt + authorized → vetting. Covert or thin-consent → values-bar. |
| 13 | Charity / 501c3 fundraising (institutional, not platform) | 🟡 In-scope, with content rules | Industry-wide standard | ✓ | Standard eligibility | Donor-comms tooling for an institutional charity. Creator/community #17 covers fundraising-platform SaaS; this row covers institutional 501c3 internal donor-comms tooling. Distinction is product shape. |
| 14 | Faith-based institutional administration (church, mosque, synagogue ops) | 🟢 In-scope, no content rules | Not applicable | | Standard eligibility | Institutional-direct vs. platform-SaaS (creator/community #15). Service reminders, small-group coordination, donation receipts. |
| 15 | Public health / community health communications (non-clinical) | 🟠 Vetting-required (indeterminate) | Industry-wide regulatory | ✓ | TCR Special category | Public-health-comms tooling — vaccination reminders, screening campaigns, community outreach. Distinct from healthcare #2 (administrative healthcare) and healthcare #6 (condition management). TCR Government/Healthcare overlap. |
| 16 | Housing assistance / public-housing administration | 🟡 In-scope, with content rules | Industry-wide standard | ✓ | Standard eligibility | HUD-program-administration SaaS. Rules: no eviction-threat language without due-process framing (FDCPA-adjacent at institutional layer), no benefits-conditional language that pattern-matches coercion. |
| 17 | Veterans services / military-family support | 🟠 Vetting-required (indeterminate) | Industry-wide standard | ✓ | TCR Special category | VA-adjacent, military-family-support platforms. Vulnerable-population framework plus federal-government overlap. |
| 18 | Public defender / legal aid operational tooling | 🟡 In-scope, with content rules | Industry-wide standard | ✓ | Standard eligibility | Case-management SaaS for public-defender offices or legal-aid nonprofits. Distinct from professional services #1 (private legal practice) — funding model and client population differs. Public-defender clients often vulnerable, court-appointed not client-selected, consent-regime overlap to #12 correctional. Rules: same attorney-client privilege hygiene as professional services #1, plus extra vulnerability-aware framing (no court-date threats, no benefits-loss-language, more careful about case-status messaging since clients may share devices). |

---

## 8. Open items for downstream sessions

**Sub-verticals likely promotable on Sinch confirmation:**
- Financial #6 insurance (conservative 🟠 posture; likely promotable to 🟡 if Sinch confirms standard pathway)

**Sub-verticals where customer pull could refine the bucket:**
- Financial #5 lending — mortgage origination folded in; split only if a real customer surfaces
- Home services #1-13 — auctions folded into retail #1; split only if auction-specific framing surfaces

**Bucket-edge cases that may need re-review:**
- Healthcare #10 medical devices (FDA-cleared vs. consumer wearable gradient)
- Healthcare #14 caregiving (sits between admin #2 and condition management #6)
- Creator/community #4 creator monetization (SHAFT-variant routing during vetting)
- B2B SaaS #14 CPaaS-adjacent (reseller-framework gradient)
- Civic #15 public health (Government/Healthcare overlap)

**Categories deliberately not given rows (let customer pull surface them):**
- Defense / national-security adjacent tooling
- Disinformation-as-a-service / astroturfing (handled by vetting decline, not pre-empted at bucket layer)
- Academia-specific research tooling
- Niche industrial verticals
- Regulated commodities not covered by SHAFT

If customer pull surfaces any of these, add a row at that point rather than padding the corpus now.

---

*End of vertical-buckets-research.md*
