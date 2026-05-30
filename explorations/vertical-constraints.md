Status: exploring (2026-05-27, updated 2026-05-29 Session 121) — preservation of Product Thread 115 vertical-constraints work plus Session 119 elig-section design output. NOT canon. Promotes to a repo constraint data file + per-vertical primers + the elig section build via a sequenced series of follow-up sessions (see §6). Steps 1–4 + step 7 (elig section UI structural build, Session 121) now complete; steps 5/6/8/9 outstanding. The elig section is live in `marketing-site/` and consuming `/lib/constraints/`; PROTOTYPE_SPEC and PRODUCT_SUMMARY have been updated for that surface. The Airtable re-mapping (step 5), `industry-gating.ts` rework (step 6), per-vertical primer authoring (step 8), and SMS 101 page (step 9) remain prerequisites for promoting this exploration to canon.

**Session 117 output:** `/explorations/vertical-buckets-research.md` — bucket-level enumeration for all 137 sub-verticals, shaped to populate Airtable.

**Session 118 output:** Airtable Constraints base populated end-to-end (8 Verticals, 137 Sub-verticals, 12 Rules), `/lib/constraints/` schema built, `verticals.ts` generated and committed.

**Session 119 output:** D-418 superseded by D-422 (four buckets → five). Bucket strings in `/lib/constraints/` updated to D-422. Elig section design fully shaped — verdict-copy patterns for all five buckets, per-category copy patterns, three anchored 🟡 global cards authored, six 🔴 sub-vertical lines authored, dropdown structure decided.

# Vertical constraints — eligibility model, sub-vertical routing, content-rule sets, elig section design

A working-session sketch capturing the eligibility model, the sub-vertical routing principle, the full-depth content rules for the three constrained verticals authored in Product Thread 115, and the elig-section design from Session 119. Source of truth for the Airtable build, the repo constraint data file, the `industry-gating.ts` rework, the per-vertical primer authoring sessions, and the elig-section UI build.

The full content rules in §4 are authored at primer depth — more than what will surface in the elig section and more than what the SMS 101 page will carry on its face. They're preserved at depth here because condensing happens downstream, not now; the primer-authoring session needs the depth, the elig-copy session has already drawn the condensed version (§9).

---

## §1 — The two-question model

Two genuinely different questions a developer asks, and the elig section must answer them separately:

1. **Vertical eligibility** — "can my *business* use RelayKit?" About *who you are*.
2. **Message-content rules** — "can I send *this text*?" About *what the message says*.

Most of RelayKit's audience — generic indie SaaS — only ever encounters question 1, and the answer is yes. Question 2 only bites for a small set of constrained verticals (today: legal, fintech, healthcare-administrative).

---

## §2 — The five-bucket eligibility model

Every vertical (and, where routing splits it, every sub-vertical) lands in one of five buckets. The bucket strings below are the canonical Bucket union values in `/lib/constraints/types.ts` per D-422.

1. **Clear** (🟢) — no constraints, full eligibility. The dominant bucket — 64 of 137 sub-verticals. Generic indie SaaS lives here.

2. **Conditional** (🟡) — eligible with content rules. Today: legal-practice-tools, banking-budgeting-apps, healthcare-administrative, plus 22 other sub-verticals where rule layers exist (HIPAA-hygiene, FDCPA-adjacent, attorney-client privilege, EEOC-consent, locksmith fraud, fair-housing). 25 sub-verticals.

3. **Not yet, maybe not ever** (🟠) — vetting territory we haven't built UX/promise/submission rigor for. Includes TCR Special categories (gambling, dating, crypto, sweepstakes), regulated verticals (insurance, immigration legal-aid), and case-by-case vetting burdens. 35 sub-verticals. The "maybe not ever" honesty matters: vetting is a different operational animal we may never invest in.

4. **Not yet** (⚫) — capacity-deferred. We want this; it's on the roadmap; not in launch. Multi-tenant support routes here. Sub-verticals: real-estate lead-gen, solar lead-gen, audience-growth tooling, healthcare clinical/mental-health/pharmacies (BAA-gated). 6 sub-verticals + multi-tenant feature.

5. **Not our lane** (🔴) — we won't offer this. Merges D-418's "Barred" and "Declined" — the merged "we won't" bucket regardless of whether the "won't" reason is carrier-imposed or values-imposed. Cannabis, firearms, vape/tobacco, adult content, adult dating (all SHAFT carrier-prohibition). Plus surveillance/employee-monitoring (values-permanent). 7 sub-verticals.

**Distinguishing 🟠 from ⚫.** Both are "not yet" at launch, but the disposition differs. 🟠 is honest about uncertainty — vetting may never happen. ⚫ is forward-looking — capacity-deferred, actively wanted. The user-facing copy reflects this (§9).

**Distinguishing ⚫ deferred from 🔴 values-permanent.** The bright line is *values posture vs. capacity gate*. Capacity-deferred = industry serves with infrastructure we don't have at launch ops; we want to build it. Values-permanent = we won't build it at any operating scale. Surveillance is the only values-permanent row in the corpus today; future PMs evaluating new RelayKit-specific bars apply this test.

**Firearms-as-Not-our-lane reasoning.** Firearms is *technically* not as absolutely barred as cannabis — a firearms business *can* sometimes get approved with risk-mitigation. But that's a case-by-case approval babysitting path, which contradicts the one-person-shop automation posture RelayKit is built around. Same outcome as cannabis at launch; honest reason is "we don't do vetting babysitting," not "carriers fully prohibit it."

---

## §3 — Sub-vertical routing

Flat vertical categorization is too coarse. "Financial services" contains both budgeting apps (🟢/🟡) and payday lenders (🟠); "healthcare" contains both dentists doing appointment reminders (🟡) and telehealth platforms messaging diagnoses (⚫ BAA-gated).

The model: a top-level vertical can carry a **secondary dropdown** of sub-verticals. Each sub-vertical lands in one of the five buckets independently. The elig section UI surfaces this as a conditional secondary dropdown — pick the vertical, then where routing applies, pick the sub-vertical, then land in the correct bucket.

**Routing trigger.** 60 of 137 sub-verticals carry `routingTrigger: true`. Some verticals are routing-heavy (civic surfaces it on most rows), some never trigger. The data file is the source of truth for whether the secondary dropdown surfaces.

**Principle (worth elevating to the primer):** accepting any vertical or sub-vertical happens on RelayKit's terms. The elig section isn't passively sorting; it's deciding, sub-vertical by sub-vertical, what it takes.

---

## §4 — Constrained verticals (Conditional / 🟡, with content rules)

These are the verticals where the per-vertical content layer applies. Authored at primer depth — the elig section surfaces condensed versions per §9, the primers will surface full versions.

### §4a — Legal

**Sub-vertical routing.** Legal/legal-tech splits into two:
- **Practice tools / case-management / client portals** → 🟡 with content rules (this section).
- **Specific sub-practices that may trigger vetting** (bankruptcy practice, criminal defense, immigration legal aid as standalone product focus) → flag for sub-vertical review before authoring rules; provisionally same content rules but possibly elevated scrutiny.

**Principle.** SMS is an insecure, often-shared channel. The recipient's phone may be seen by others. The rule isn't "legal can't send texts" — it's "the text can't contain anything that breaches client confidentiality or attorney-client privilege if read by the wrong eyes."

**Content rules.**

1. **No case or matter specifics.** No charges, claims, allegations, case outcomes, settlement figures, or matter descriptions.
   - Unsafe: "Your hearing for the DUI case is Thursday at 9am."
   - Safe: "You have an appointment with {{provider_name}} on {{appointment_time}}."

2. **No third-party or opposing-party names.** A message naming anyone other than the recipient can expose a relationship the recipient hasn't disclosed.
   - Unsafe: "Reminder: deposition with opposing counsel Re: Smith v. Jones."
   - Safe: "Reminder: your scheduled appointment is tomorrow, {{appointment_time}}."

3. **No legal-status or sensitive-context language.** Words that reveal the nature of the legal matter — "arrest," "custody," "bankruptcy," "immigration," "divorce."
   - Unsafe: "Documents for your bankruptcy filing are ready."
   - Safe: "{{workspace_name}}: documents are ready for review. View: {{account_link}}"

4. **Default to the portal, not the SMS.** Substance lives behind an authenticated link; the text is a notification that something exists, never the content itself.

**Pattern.** The SMS says *that* something happened and *when*; the authenticated surface says *what*. This is already how RelayKit's templates are shaped, so legal is mostly a "don't undo the existing shape" rule, plus the no-naming and no-status-words prohibitions which are legal-specific.

### §4b — Financial services / fintech

**Sub-vertical routing.** Fintech splits sharply:
- **Banking & accounts** (neobanks doing account notifications), **budgeting & personal finance**, **payments processing** → 🟡 with content rules (this section).
- **Lending, debt collection, credit repair, credit services** → routed to 🟠 (vetting) or 🔴 (Not our lane — debt collection specifically). These are not "content-rule-able" — they're vertical-eligibility decisions. Lending, debt collection, and credit content face elevated carrier scrutiny; they also carry their own legal regimes (FDCPA for collections) above RelayKit's pay grade at launch.

**Principle.** Two risk sources, both real: (a) financial details that identify the recipient's money situation are privacy-sensitive (the SMS may be seen by others); (b) lending/credit/collections content draws elevated carrier scrutiny.

**Content rules** (for the eligible sub-verticals).

1. **No account balances, amounts, or financial figures.** Specific dollar figures expose the recipient's financial standing to anyone who sees the phone.
   - Unsafe: "Your account balance is $4,212. Payment of $300 is due Friday."
   - Safe: "{{workspace_name}}: there's an update on your account. View: {{account_link}}"

2. **No transaction specifics.** Merchant names, transaction amounts, where money was spent — exposes spending behavior.
   - Unsafe: "Your card was charged $89.40 at Liquor Barn."
   - Safe: "{{workspace_name}}: new activity on your account. Not you? {{account_link}}"

3. **Fraud and security alerts are encouraged, with no specifics.** "New sign-in, unrecognized device — secure your account" is exactly the right shape. The rule constrains *detail*, not the alert itself.

**Note for primer.** Rules around lending content, credit-decision content, and collections language are *not* content rules at the eligible-sub-vertical level — they're routing decisions that send the developer to a 🟠 or 🔴 sub-vertical. The primer should explain this clearly: "if your product is fundamentally a lending product, this isn't a content-rules conversation; you're in a different bucket entirely."

### §4c — Healthcare

**Sub-vertical routing.** Healthcare's split *is* the answer to the long-running BAA question:
- **Administrative / scheduling tools** (appointment booking, practice-management, patient-portal notifications, intake forms) → 🟡 with content rules (this section). PHI is never required for the message; if content rules hold, no PHI passes through RelayKit, and there's nothing for a BAA to cover.
- **Clinical / care-delivery** (telehealth platforms, EHR/EMR with patient SMS, anything that messages diagnoses, results, medications, or care instructions) → ⚫ Not yet (capacity-deferred on BAA program). PHI *is* the message; content rules can't make this safe; the BAA question is unavoidable. Future enablement is gated on the BAA liability call (legal, not product).

**Principle.** Stricter than legal or fintech, because in healthcare the recipient's identity-as-patient is itself sensitive — even a facility name can leak a diagnosis. The SMS is a doorbell, never a delivery.

**Content rules** (for the administrative sub-vertical).

1. **No health conditions, diagnoses, or treatments.** Nothing naming why the patient is being seen.
   - Unsafe: "Reminder: your chemotherapy session is Thursday at 9am."
   - Safe: "{{workspace_name}}: your appointment with {{provider_name}} is {{appointment_time}}."

2. **No medications, prescriptions, or lab/test results.**
   - Unsafe: "Your prescription for Zoloft is ready for pickup."
   - Safe: "{{workspace_name}}: an item is ready for pickup. Details: {{account_link}}"

3. **No provider names or facility names that reveal the nature of care.** A general dentist is low-risk; "Valley Oncology" or "Dr. Chen, Psychiatry" discloses a condition by inference. Safest rule: provider/facility name in the body only where it carries no clinical signal — when in doubt, omit it.
   - Unsafe: "Reminder: your appointment at Bright Path Addiction Recovery is tomorrow."
   - Safe: "{{workspace_name}}: your appointment is tomorrow, {{appointment_time}}."

4. **No visit reason, department, or appointment-type detail.**
   - Unsafe: "Your OB-GYN follow-up is confirmed for March 4."
   - Safe: "{{workspace_name}}: your appointment is confirmed for {{appointment_time}}."

5. **The portal carries everything clinical.** The SMS notifies that an appointment, a result, or a document exists; the authenticated surface holds the substance. Same pattern as legal.

**BAA status.** Administrative healthcare does not need a BAA (no PHI passes through, by rule). Clinical healthcare is ⚫ Not yet at launch precisely because the BAA question can't be resolved on product grounds — it needs a legal call. That call is a tracked open item in the capacity-deferred queue.

### §4d — Restaurants

🟢 Clear at the sub-vertical level. Carriers sometimes review promotional restaurant content under SHAFT (alcohol); this surfaces at promo time, not as content rules on the eligible side. Restaurants do not need their own content-rule set beyond the corpus-wide rules (no credentials, no promo outside Marketing, SHAFT-C in Marketing).

---

## §5 — Stale state in `industry-gating.ts`

The current `prototype/lib/intake/industry-gating.ts` is flat (6 verticals, regex-matched, one advisory sentence each) and predates the sub-vertical routing model. It is now stale in two specific ways:

1. **Healthcare is flat-declined.** Under the new model, administrative healthcare is 🟡 (with content rules) and only clinical healthcare is ⚫ Not yet. Flat decline blocks the dentist appointment-reminder use case wrongly.
2. **No sub-vertical structure.** Financial services, legal, and healthcare all need secondary-dropdown routing. The current regex model doesn't accommodate that.

`industry-gating.ts` rework is its own session, sequenced after the data file exists (it now does) and after the elig section UI is built (it doesn't yet). One open call: whether to rework `industry-gating.ts` in `/prototype` at all, given the directory is sunset-bound (D-358), or whether the gating logic should move to the elig section directly. Decision deferred to step 4.

---

## §6 — Sequence of follow-up sessions

Updated as of Session 119. In order. Each step requires the one above:

1. ~~This doc lands + D-numbers recorded~~ (Session 116, complete).
2. ~~Airtable build~~ — Session 118, complete (137 sub-verticals + 12 rules populated end-to-end).
3. ~~Repo constraint data file~~ — Session 118, complete (`/lib/constraints/types.ts` + `verticals.ts` committed).
4. ~~Session 119 elig design + D-422 + bucket-string rename~~ — complete.
5. **AIRTABLE_SCHEMA + live base re-mapping** — bring Airtable's bucket select-option strings into line with D-422. PM-led via connector. Bucket option values change from D-418-era to: Clear / Conditional / Not yet, maybe not ever / Not yet / Not our lane. The six "Declined at launch" rows in Airtable re-tag to "Not yet" per the constraintSource disambiguation already applied in the repo data file.
6. **`industry-gating.ts` rework** — replace flat regex model with sub-vertical structure reading from the data file. CC. Or fold into step 7 if `/prototype` rework isn't worth doing pre-sunset.
7. ~~**Elig section UI build**~~ — Session 121, complete across three waves. Wave 1 (`c9dddc4`) shipped the three-dropdown skeleton + state hook + lazy-create `localStorage.relaykit_elig` emission. Wave 2 (`0150537` + revision `5284d35`) added verdict cards across all five D-422 buckets (3 anchored 🟡 §9.4 cards + generic fallback, 🟠/⚫ inline waitlist with `interest_tag` POST, 5 §9.6 🔴 anchored lines + surveillance two-tier carve-out + generic 🔴 fallback, multi-tenant-specific ⚫ copy), disabled categories panel + empty-state on 🟠/⚫/🔴, bottom CTA hidden on every disabled bucket, and migration 009 (needs Supabase SQL Editor application before deploy). Wave 3 (`297af90`) added per-category §9.5 cards under affected category headers with `categoriesAffected` gating + Verification carve-out + non-functional Examples chevron (§9.8 expander content deferred). Built in `marketing-site/`. Reads `/lib/constraints/`. No live "Start building" CTA wired — pre-launch holds the surface with selections persisting for the future onboarding wizard.
8. **Per-vertical primer authoring** — full-depth guides for each 🟡 constrained sub-vertical, expanded from §4 with worked-example libraries. Permanently-accessible tier-3 docs. Joel + PM session. Author as customer pull demands; don't pre-author all 25 🟡 sub-verticals speculatively.
9. **SMS 101 page** — the public tier-3 page housing the consent + multi-tenant explanation and pointing at the per-vertical primers. Mostly assembly once 1–8 exist.

---

## §7 — Relationships to existing docs

- **`CUSTOMER_ARCHETYPE_FOUNDATION` §4** names the deferred-category posture, the healthcare BAA revisit, and the content-specific advisory layer for lending/collections as fast-follows. This exploration *resolves* the latter two: the BAA revisit becomes a sub-vertical routing call (administrative healthcare → 🟡, clinical → ⚫); the lending/collections advisory layer becomes sub-vertical routing (those sub-verticals are 🟠/🔴, not content-rule-able). Add a pointer from §4 to this exploration when this doc promotes.
- **`VERTICAL_TAXONOMY_DRAFT` §3** carries the TCR Special decline — consistent with our 🟠 bucket. No conflict.
- **`industry-gating.ts`** — stale, see §5. Rework is step 6 in the sequence above.
- **MASTER_PLAN** — no amendment required from the constraint work itself. The launch-definition amendment from the golden-path half of Product Thread 115 (D-416, D-417) already covers what changed at the launch level. Principle #7 (continuity of intent, Session 119) governs the elig-to-onboarding-to-registration data handoff shape.

---

## §8 — Promotion criteria

This exploration is `promoted` when:
- The repo constraint data file is committed (Session 118, ✅), and
- `industry-gating.ts` has been reworked against it (step 6), and
- The elig section UI is built and live (step 7), and
- The per-vertical primers exist as canonical docs (step 8).

At that point, the canonical homes for this material are: the data file (enforcement structure), the primers (full-depth guidance), the elig section UI (condensed in-context rules), and the SMS 101 page (public tier-3 surface). This exploration's job ends.

---

## §9 — Elig section design (Session 119)

The elig section ("elig") is the customer-facing eligibility surface on relaykit.ai. It sits in the upper right of the configurator area, above the message tone toggle. It answers the two-question model (§1) and shapes the messages section below it.

### §9.1 — Naming

**Elig section** / **elig**. Not "widget," not "eligibility widget," not "constraint checker." The naming is intentional: this surface is a section of the page, not a bolt-on tool.

### §9.2 — Structural decisions

**Dropdowns (three, two visible at any time):**

1. **Multi-tenant question.** Placeholder: *"My app sends messages..."*. Options: *"for one business (mine)"* / *"for many businesses (my customers)"*.
2. **Vertical.** Placeholder: *"What industry does your app serve?"*. Options: the 8 verticals from `/lib/constraints/`.
3. **Sub-vertical (conditional).** Surfaces only when the picked vertical has sub-verticals with `routingTrigger: true`. Placeholder: TBD at build time, follows the same label-less pattern.

**No field labels.** Placeholders do the labeling work. Locked Session 119.

**Reset affordance.** Small **×** appears inside each dropdown on the right side, only when a value is selected. Click = back to placeholder state. Each dropdown independent. Untitled UI Select `isClearable` pattern.

**Default state is free-use.** Leaving all dropdowns in placeholder state = the messages section works as the lead magnet it already is. Tire-kickers and message-only users browse freely. Making a selection = opt into the front-door experience. Single surface, no mode toggle.

**Continuity of intent.** Per MASTER_PLAN principle #7. Whatever the user enters in elig + messages flows forward into onboarding and registration without re-entry. Build elig now to hold its selections in a clean, exportable shape; wiring to onboarding happens at launch (no live CTAs yet).

### §9.3 — Verdict surface

Verdict appears as a card directly under the dropdowns (the "Global feedback" zone). The verdict card shape varies by bucket. Same zone, different weight.

🟢 **Clear** — quiet confirmation, low-contrast single line, no card:

> ✓ You're set — pick your messages below.

Check icon `fg-success-secondary`, line in `text-tertiary`, no border, no fill. Acknowledges the pick took effect without ceremony.

🟡 **Conditional** — blue info card, check icon, two-tier (collapsed + expander):

Collapsed:
> ✓ You're set — we'll flag the rules where they apply. *More info* [chevron]

Expanded (the why/what/how prose, three short paragraphs per the pattern: channel reality → vivid trio → consequence → what we keep out → what we do by default). See §9.4 for the three authored cards.

🟠 **Not yet, maybe not ever** — orange info card. Disabled categories column. Friendly empty state in messages area (illustration placeholder). Tagged waitlist signup. Per-sub-vertical copy follows pattern:

> This one's harder than we're set up for today.
> Get notified if it becomes available [email]

⚫ **Not yet** — orange info card. Same UX shape as 🟠 (disabled categories, empty-state, illustration, tagged waitlist). Copy is forward-looking:

> Coming soon. Get notified when it becomes available [email]

Multi-tenant routes here with this same shape — selecting "for many businesses (my customers)" in dropdown 1 triggers ⚫ Not yet without requiring dropdown 2/3.

🔴 **Not our lane** — orange info card. Same UX shape as 🟠/⚫ (disabled categories, empty-state, illustration). No waitlist (no future state we're working toward). Copy follows pattern:

> We're not able to send [sub-category] messages. Try searching for a specialized [type] provider.

See §9.5 for the six authored sub-vertical lines.

### §9.4 — 🟡 Conditional global card (expanded prose) — three authored cards

Pattern: **channel reality → vivid trio → consequence (whose harm, whose authority) → what we keep out → what we do by default.**

**Legal practice tools:**

> SMS is open infrastructure — unencrypted and shared across screens.
>
> "Arrest." "Custody." "Bankruptcy." If the wrong eyes see these in a message, that's a privilege breach to a court, and can risk your registration with carriers. So specifics stay out of the message body. Case details, names, and status words move into your app, behind a link.
>
> We shape your messages this way by default, and also help you author new ones safely.

**Banking / budgeting apps:**

> SMS is open infrastructure — unencrypted and shared across screens.
>
> "$4,212." "Charged at Liquor Barn." "Payment overdue." If the wrong eyes see these in a message, that's a privacy breach to your customer, and can risk your registration with carriers. So specifics stay out of the message body. Balances, transactions, and merchant names move into your app, behind a link.
>
> We shape your messages this way by default, and also help you author new ones safely.

**Healthcare administrative:**

> SMS is open infrastructure — unencrypted and shared across screens.
>
> "Chemotherapy." "Dr. Chen, Psychiatry." "Bright Path Recovery." If the wrong eyes see these in a message, that's a HIPAA exposure for your practice, and can risk your registration with carriers. So specifics stay out of the message body. Conditions, providers, and facility names move into your app, behind a link.
>
> We shape your messages this way by default, and also help you author new ones safely.

### §9.5 — 🟡 per-category cards (under category headers)

Per-category cards live in the content area under each affected category's header (not in the left rail category selector — that stays clean). Two-tier: collapsed line + expander labeled "Examples" + [chevron].

Pattern: **[Specifics] are a [vertical-specific harm] risk. Link to your app instead.**

**Legal × any affected category:**
> Case details, names, and status words are a privilege risk. Link to your app instead. *Examples* [chevron]

**Banking × any affected category:**
> Balances, transactions, and merchant names are a privacy risk. Link to your app instead. *Examples* [chevron]

**Healthcare-admin × any affected category:**
> Conditions, providers, and facility names are a HIPAA risk. Link to your app instead. *Examples* [chevron]

**Verification carve-out.** No per-category card on Verification for any vertical. Verification is content-neutral by nature (4-8 digit codes); the rules don't bite. The data model needs a `categoriesAffected` field (or similar) on the Rule type at implementation — currently rules are attached at sub-vertical level without per-category scoping.

**Card visibility ≠ rule enforcement.** Even where no per-category card surfaces, rules still enforce at the message level. The card is informational; enforcement is everywhere the rule applies.

**Examples writing rule.** Each example must be plausible for the vertical *and* applicable to the category. Generic-fits-anywhere examples fail. Subject example authoring to an independent sniff-test review (fresh Claude instance, no context contamination).

### §9.6 — 🔴 Not our lane — six authored sub-vertical lines

Standardized closer: **"Try searching for a..."**.

**Cannabis retail / dispensaries:**
> We're not able to send cannabis messages. Try searching for a specialized provider for state-regulated programs.

**Firearms / ammunition retail:**
> We're not able to send firearms messages. Try searching for a specialized FFL provider.

**Vape / tobacco / nicotine retail:**
> We're not able to send tobacco or vape messages. Try searching for an age-gated provider.

**Adult content / age-gated retail:**
> We're not able to send adult-content messages. Try searching for an age-gated provider.

**Adult dating / hookup apps:**
> We're not able to send messages for adult dating apps. Try searching for an age-gated provider.

**Surveillance / employee monitoring** (values-permanent — distinct shape):

Orange box (primary):
> We're not able to send messages for surveillance or covert monitoring tools.

Empty state (smaller type):
> Try searching for another provider.

The values-bar honesty (this is RelayKit's choice, not a carrier limit) stays internal. The surface stays short.

### §9.7 — Waitlist mechanics

🟠 and ⚫ both feed signal capture via the existing "Get early access" list with an **interest-tag field** — not separate segmented lists. Tag distinguishes downstream: vetting-interest (🟠) feeds "is this real demand or fringe?" queue; multi-tenant-interest / capacity-deferred-sub-vertical-interest (⚫) feeds "build this next" queue. Same mechanism, distinct signal.

🔴 gets no waitlist. There's no future state we're working toward.

The "promote interest-tag to real segmented waitlist" call gets revisited when demand justifies it or a deferred feature gets close to shipping.

### §9.8 — What's deferred from Session 119

- **Empty-state illustration** for 🟠/⚫/🔴 — placeholder hole at build time. One shared illustration vs. three distinct, TBD.
- **The "Start building" CTA** at launch — doesn't exist yet, no onboarding app to route to. Elig section holds its selections in a clean exportable shape; wiring happens at launch.
- **Per-category card content for non-anchored 🟡 sub-verticals** — author as customer pull demands, not pre-authored speculatively.
- **AIRTABLE_SCHEMA + live base re-mapping** to D-422 — step 5 in §6.
- **`industry-gating.ts` rework decision** — whether to rework in `/prototype` or move logic to elig section directly.

---

*End of vertical-constraints.md*
