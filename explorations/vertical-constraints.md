Status: exploring (2026-05-27) — preservation of today's vertical-constraints work (Product Thread 115). NOT canon. Promotes to a repo constraint data file + per-vertical primers via a sequenced series of follow-up sessions (see §6). Do not propagate into PROTOTYPE_SPEC, PRODUCT_SUMMARY, MARKETING_STRATEGY, or the live configurator until those follow-ups happen in order.

**Session 117 output:** `/explorations/vertical-buckets-research.md` — bucket-level enumeration for all 136 sub-verticals, shaped to populate Airtable.

# Vertical constraints — eligibility model, sub-vertical routing, content-rule sets

A working-session sketch capturing the eligibility model, the sub-vertical routing principle, and the full-depth content rules for the three constrained verticals authored in Product Thread 115. Source of truth for the Airtable build, the repo constraint data file, the `industry-gating.ts` rework, and the per-vertical primer authoring sessions that follow.

The full content rules below are authored at primer depth — more than what will surface in the configurator and more than what the SMS 101 page will carry on its face. They're preserved at depth here because condensing happens downstream, not now; the primer-authoring session needs the depth, the configurator session needs the condensation.

---

## §1 — The two-question model

Two genuinely different questions a developer asks, and the page (and the widget) must answer them separately:

1. **Vertical eligibility** — "can my *business* use RelayKit?" About *who you are*.
2. **Message-content rules** — "can I send *this text*?" About *what the message says*.

Most of RelayKit's audience — generic indie SaaS — only ever encounters question 1, and the answer is yes. Question 2 only bites for a small set of constrained verticals (today: legal, fintech, healthcare-administrative).

---

## §2 — The four-bucket eligibility model

Every vertical (and, where routing splits it, every sub-vertical) lands in one of four buckets:

1. **Barred at launch** — cannot use RelayKit, full stop. Cannabis (carrier-prohibited at federal level; prohibited even in jurisdictions where legalized); firearms (carrier-scrutiny + requires case-by-case approval babysitting that contradicts the one-person-shop posture — not statutorily banned, but flagged under SHAFT).

2. **Declined at launch, blanket** — empty at present, after healthcare moved to sub-vertical routing.

3. **Vetting-required, deferred (indeterminate status)** — the 12 TCR Special categories: Charity, K-12, Political Campaign, Sweepstakes, Polling and Voting, Emergency, Machine to Machine, Proxy, Direct Lending, Agents and Franchises, Social, Fraud Alert. Status is genuinely open ("may or may not ever"), not a roadmap commitment. Future work toward vetting capability is non-trivial UX and operational lift; backlog item, not committed item.

4. **In scope** — everything else, including legal, financial/fintech (eligible sub-verticals), restaurants, and the entire generic-indie-SaaS audience. Within this bucket, some verticals/sub-verticals carry content rules (see §4); most don't.

**Firearms-as-barred reasoning.** Firearms is *technically* not as absolutely barred as cannabis — a firearms business *can* sometimes get approved with risk-mitigation. But that's a case-by-case approval babysitting path, which contradicts the one-person-shop automation posture RelayKit is built around. Same outcome as cannabis at launch; honest reason is "we don't do vetting babysitting," not "carriers fully prohibit it."

---

## §3 — Sub-vertical routing

Flat vertical categorization is too coarse. "Financial services" contains both budgeting apps (safe) and payday lenders (vetting-required); "healthcare" contains both dentists doing appointment reminders (safe with PHI rules) and telehealth platforms messaging diagnoses (clinical, BAA territory).

The model: a top-level vertical can carry a **secondary dropdown** of sub-verticals. Each sub-vertical lands in one of the four buckets independently. The widget UI surfaces this as a conditional second dropdown — pick "Financial services" → see the sub-verticals → pick the one that matches → land in the correct bucket.

**Principle (worth elevating to the primer):** accepting any vertical or sub-vertical happens on RelayKit's terms. The widget isn't passively sorting; it's deciding, sub-vertical by sub-vertical, what it takes.

Implications for the data model: vertical → sub-vertical is a one-to-many relationship; each sub-vertical row carries its own bucket and content-rule pointer. The Airtable and the repo data file should both reflect this two-level structure.

---

## §4 — Constrained verticals (in-scope-with-content-rules)

These are the verticals where the per-vertical content layer applies. Authored at primer depth — the configurator will surface condensed versions, the primers will surface full versions.

### §4a — Legal

**Sub-vertical routing.** Legal/legal-tech splits into two:
- **Practice tools / case-management / client portals** → eligible with content rules (this section).
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
- **Banking & accounts** (neobanks doing account notifications), **budgeting & personal finance**, **payments processing** → eligible with content rules (this section).
- **Lending, debt collection, credit repair, credit services** → precluded at launch via the vetting-required bucket. These are not "content-rule-able" — they're vertical-eligibility decisions that route to preclusion. Lending, debt collection, and credit content face elevated carrier scrutiny; they also carry their own legal regimes (FDCPA for collections) above RelayKit's pay grade at launch.

**Principle.** Two risk sources, both real: (a) financial details that identify the recipient's money situation are privacy-sensitive (the SMS may be seen by others); (b) lending/credit/collections content draws elevated carrier scrutiny.

**Content rules** (for the eligible sub-verticals).

1. **No account balances, amounts, or financial figures.** Specific dollar figures expose the recipient's financial standing to anyone who sees the phone.
   - Unsafe: "Your account balance is $4,212. Payment of $300 is due Friday."
   - Safe: "{{workspace_name}}: there's an update on your account. View: {{account_link}}"

2. **No transaction specifics.** Merchant names, transaction amounts, where money was spent — exposes spending behavior.
   - Unsafe: "Your card was charged $89.40 at Liquor Barn."
   - Safe: "{{workspace_name}}: new activity on your account. Not you? {{account_link}}"

3. **Fraud and security alerts are encouraged, with no specifics.** "New sign-in, unrecognized device — secure your account" is exactly the right shape. The rule constrains *detail*, not the alert itself.

**Note for primer.** Rules around lending content, credit-decision content, and collections language are *not* content rules at the eligible-sub-vertical level — they're routing decisions that send the developer to a precluded sub-vertical. The primer should explain this clearly: "if your product is fundamentally a lending product, this isn't a content-rules conversation; you're in a different bucket entirely." This resolves the `CUSTOMER_ARCHETYPE_FOUNDATION` §4a flag about the fast-registration promise not being unconditionally honest for lending/credit/debt-collection — the answer is sub-vertical routing, not content qualification.

### §4c — Healthcare

**Sub-vertical routing.** Healthcare's split *is* the answer to the long-running BAA question:
- **Administrative / scheduling tools** (appointment booking, practice-management, patient-portal notifications, intake forms) → eligible with content rules (this section). PHI is never required for the message; if content rules hold, no PHI passes through RelayKit, and there's nothing for a BAA to cover.
- **Clinical / care-delivery** (telehealth platforms, EHR/EMR with patient SMS, anything that messages diagnoses, results, medications, or care instructions) → precluded at launch via the vetting-required bucket. PHI *is* the message; content rules can't make this safe; the BAA question is unavoidable. Future enablement is gated on the BAA liability call (legal, not product).

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

**BAA status.** Administrative healthcare does not need a BAA (no PHI passes through, by rule). Clinical healthcare is precluded at launch precisely because the BAA question can't be resolved on product grounds — it needs a legal call. That call is a tracked open item, indeterminate-status, in the vetting-required backlog.

### §4d — Restaurants

In-scope; advisory tier only. Carriers sometimes review promotional restaurant content under SHAFT (alcohol); this surfaces at promo time, not as content rules on the eligible side. Restaurants do not need their own content-rule set beyond the corpus-wide rules (no credentials, no promo outside Marketing, SHAFT-C in Marketing). The `industry-gating.ts` advisory copy stays appropriate.

---

## §5 — Stale state in `industry-gating.ts`

The current `prototype/lib/intake/industry-gating.ts` is flat (6 verticals, regex-matched, one advisory sentence each) and predates the sub-vertical routing model. It is now stale in two specific ways:

1. **Healthcare is flat-declined.** Under the new model, administrative healthcare is in-scope (with content rules) and only clinical healthcare is precluded. Flat decline blocks the dentist appointment-reminder use case wrongly.
2. **No sub-vertical structure.** Financial services, legal, and healthcare all need secondary-dropdown routing. The current regex model doesn't accommodate that.

`industry-gating.ts` rework is its own session, sequenced after the repo constraint data file exists (see §6).

---

## §6 — Sequence of follow-up sessions

In order. Each step requires the one above:

1. **This doc lands + D-numbers recorded** (today, Product Thread 115).
2. **Airtable build** — two-level structure (vertical → sub-vertical as linked records), pre-built views designed around how Joel actually uses it. Joel-led; PM specs the schema. Most verticals resolve to "eligible, no content rules" and fill in fast; the constrained ones get the depth from §4.
3. **Repo constraint data file** — CC builds the schema (the structure the configurator will read); Joel hand-transfers from Airtable into it. Single enforcement source of truth. Hand-transfer is deliberate; no live Airtable→repo sync.
4. **`industry-gating.ts` rework** — replace flat regex model with sub-vertical structure reading from the data file. CC.
5. **Per-vertical primer authoring** — full-depth guides for each constrained vertical, expanded from §4 with worked-example libraries. Permanently-accessible tier-3 docs. Joel + PM session.
6. **Configurator copy authoring** — condensed high-level rules that surface in the configurator UI when a sub-vertical with content rules is selected. Joel + PM session, source: the primers.
7. **Widget build on relaykit.ai** — two dropdowns (single/multi-tenant + business type) plus conditional sub-vertical secondary dropdown + eligibility verdict + content-rule preview where applicable. CC build; reads the constraint data file; surfaces what the primers established. Multi-tenant routes to a *feature-specific* waitlist (not the release waitlist).
8. **SMS 101 page** — the public tier-3 page housing the consent + multi-tenant explanation and pointing at the per-vertical primers. Mostly assembly once 1–7 exist.

---

## §7 — Relationships to existing docs

- **`CUSTOMER_ARCHETYPE_FOUNDATION` §4** names the deferred-category posture, the healthcare BAA revisit, and the content-specific advisory layer for lending/collections as fast-follows. This exploration *resolves* the latter two: the BAA revisit becomes a sub-vertical routing call (administrative healthcare in, clinical out, clinical's future gated on the BAA question); the lending/collections advisory layer becomes sub-vertical routing (those sub-verticals are precluded, not content-rule-able). Add a pointer from §4 to this exploration when the data file lands; don't restate.
- **`VERTICAL_TAXONOMY_DRAFT` §3** carries the TCR Special decline — consistent with our vetting-required bucket. No conflict; the new model is more granular but not incompatible.
- **`industry-gating.ts`** — stale, see §5. Rework is session 4 in the sequence above.
- **MASTER_PLAN** — no amendment required from the constraint work itself. The launch-definition amendment from the golden-path half of Product Thread 115 (D-416, D-417) already covers what changed at the launch level.

---

## §8 — Promotion criteria

This exploration is `promoted` when:
- The repo constraint data file is committed (sequence step 3 above), and
- `industry-gating.ts` has been reworked against it (step 4), and
- The per-vertical primers exist as canonical docs (step 5).

At that point, the canonical homes for this material are: the data file (enforcement structure), the primers (full-depth guidance), the configurator (condensed in-context rules), and the SMS 101 page (public tier-3 surface). This exploration's job ends.
