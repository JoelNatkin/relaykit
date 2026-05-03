# RelayKit Security

> **Status: DRAFT — v0.1.** Most-developed section is §3 (pumping defense), per the pumping defense integration wave (PM session 2026-05-03). Other §2 surface entries are stubs that fill in as the broader threat-modeling workstream activates (BACKLOG entry — RelayKit launch threat model). Promotes from DRAFT to canonical when the threat-modeling exercise completes and §2 stubs reach §3-level depth.

---

## §1 — Security posture

RelayKit assumes its customers do not have a security team. Indie SaaS founders building with AI coding tools ship fast, focus on product, and do not have the bandwidth to threat-model their SMS integration before launch. Defenses ship by default — not as paid add-ons, not as opt-in features, not as enterprise-tier upsells. Country allow-list defaults to US-only. Per-destination rate limits default conservative. Premium-prefix block list defaults to RelayKit-maintained. Bot defense practices ship as core integration content, not appendix.

The integration moment is the only realistic leverage point for prescriptive defense. RelayKit's AI-tool-driven integration model means defenses get wired into the customer's app at integration time, by the customer's AI tool, following RelayKit's prescribed practices. Retrofitting six months later is not a thing that happens. This makes integration-time guidance content load-bearing for the security promise — not just developer experience.

The structural differentiation: usage-based incumbents (Twilio, Plivo, Vonage, Prelude) hand developers an SDK and let them figure out app-side defense on their own. RelayKit's integration prescribes app-side defense as core content. No usage-based incumbent can copy this without rebuilding their developer-experience stack.

Cross-reference: MARKETING_STRATEGY.md MD-13 (positioning pillar).

---

## §2 — Threat surface inventory

Pumping is the most prominent threat for SMS-sending products but not the only one. RelayKit's threat surface includes the categories below. Pumping is developed in §3; other categories are stubs awaiting the broader threat-modeling workstream.

- **Pumping / artificially inflated traffic.** Developed in §3. Cross-reference: D-373, D-374, MARKETING_STRATEGY MD-13/MD-14/MD-15, MASTER_PLAN §2 working principle, §9 Phase 5 scope, §12 Phase 8 scope, §17 risks, §18 open questions.

- **API-key account takeover.** Stub. Attacker compromises legitimate customer API key and sends fraudulent traffic that looks like normal customer traffic from RelayKit's vantage. Defenses to design: per-API-key anomaly detection on usage patterns, rapid key rotation, alerting customers when usage looks anomalous, requiring re-auth for sensitive operations (rate-limit increases, country allow-list expansion). Tracked in: BACKLOG threat-modeling workstream entry.

- **TCR campaign suspension cascades.** Stub. One customer's compliance violation, spam complaints, or content drift triggers carrier action against RelayKit's broader ISV operation — "one bad customer poisons the well." Defenses to design: rigorous customer vetting at intake, complaint-rate monitoring per customer, willingness to terminate customer relationships fast when patterns emerge. Hardest part: being willing to fire paying customers. Tracked in: BACKLOG threat-modeling workstream entry.

- **Number reputation damage.** Stub. RelayKit-allocated numbers accumulate complaint history (sometimes from before a customer used them) that degrades deliverability silently — carriers do not always tell you this is happening. Defenses to design: per-number per-carrier delivery rate monitoring, proactive recycling when reputation degrades, sourcing numbers from clean pools. Tracked in: BACKLOG threat-modeling workstream entry.

- **Content drift in production.** Stub. Campaign registered as 2FA + Account Notification but production content drifts toward Marketing or Customer Care, gets flagged in periodic carrier audits. Defenses to design: template locking that keeps customer-edited content within compliance gates, content drift monitoring, periodic internal audits. Tracked in: BACKLOG threat-modeling workstream entry.

- **Opt-out integrity attacks (STOP flooding).** Stub. Attacker scripts STOP messages from many numbers to a specific RelayKit-allocated number, artificially inflating opt-out complaint rate and triggering carrier throttling or suspension. Defenses to design: STOP-rate ratio monitoring with anomaly detection, distinguishing organic from synthetic STOP patterns. Tracked in: BACKLOG threat-modeling workstream entry.

- **Carrier policy whiplash.** Stub. Carriers change rules with sometimes-short notice (T-Mobile's 2024 throughput tier restructure was a recent example); customers built against the old rules suddenly need to migrate. Defenses to design: ongoing carrier-relationship monitoring via the Sinch ISV channel, public commitment to absorb policy transitions for customers when possible. Tracked in: BACKLOG threat-modeling workstream entry.

---

## §3 — Pumping defense

### §3.1 — Architectural commitment

Pumping defense is two-layer:

- **Layer A — app-side defense.** Prescribed via integration-time guidance in AGENTS.md, the integration prompt template (D-331), and per-builder guides. The customer's AI tool wires these defenses into the customer's app during integration.
- **Layer B — pipeline-side defense.** Namespace-agnostic, runs in RelayKit's message pipeline on every send.

Both layers are load-bearing — neither alone is sufficient. Cross-reference: D-373.

### §3.2 — Layer A — app-side defenses

Seven prescribed practices the customer's AI tool wires in at integration time:

1. **Bot detection on the form.** Cloudflare Turnstile, hCaptcha invisible, or framework-native equivalent on every public form that triggers an SMS send (signup, login, booking, waitlist).
2. **Per-IP edge rate-limiting.** Framework middleware (Next.js middleware, Hono `rate-limiter-flexible`, equivalents) rate-limiting requests per source IP before any RelayKit API call.
3. **Per-account-state rate-limiting.** A signed-in user requesting their fifth OTP in five minutes is suspicious; an unsigned visitor requesting their first is not. The integration logic respects this distinction.
4. **Honeypot fields.** Hidden form fields that humans do not fill but bots do.
5. **Phone validation pre-send.** Reject malformed numbers, obvious test numbers, and numbers outside the customer's known-good consent ledger when applicable.
6. **Server-side gating, never client-side.** Defenses that live in client-side JavaScript are bypassable. Integration enforces defenses on the server.
7. **Namespace-specific surface guidance.** Public-facing surfaces (verification, waitlist, public booking) get the strongest defenses; semi-public surfaces (orders, support, community) get appropriate-grade defenses; internal surfaces get minimal defenses since they fire from authenticated admin actions.

Content drafting deferred to SDK_BUILD_PLAN extension at Phase 8 design (Wave 2 of pumping defense integration). AGENTS.md, integration prompt template, and per-builder guides will include a defensive-practices section as core content, not appendix.

### §3.3 — Layer B — pipeline-side defenses

Five layers in RelayKit's message pipeline. Layers 1–4 ship at launch; layer 5 deferred per D-374.

| # | Defense | Status | Description |
|---|---------|--------|-------------|
| 1 | Country allow-list | Phase 5 launch | E.164 prefix check before any send. US-only default; customer-managed expansion. Estimated kill rate ~95% of pumping campaigns per industry data. |
| 2 | Per-destination rate limit | Phase 5 launch | Same phone number cannot trigger more than N sends in T window per customer. Default conservative (e.g., 3 sends per hour per number per customer); customer-lowerable, not raisable. |
| 3 | Per-customer rate limit | Phase 5 launch | Total send rate across a customer's account. Generalizes the OTP-scoped rate limit work in VERIFICATION_SPEC §6 to all sends, namespace-agnostic. |
| 4 | Premium-prefix block list | Phase 5 launch | Static list of known fraud destinations within +1 (Caribbean prefixes that bill at premium-SMS rates, area codes with documented fraud patterns). RelayKit-maintained; customer-overridable with explicit opt-in. |
| 5 | Anomaly detection | DEFERRED post-launch | Manual-monitoring bridge for first 50 customers per D-374. Graduation to automated detection when graduation triggers met. |

Implementation reference deferred to MESSAGE_PIPELINE_SPEC extension at Phase 5 design (Wave 2 of pumping defense integration).

### §3.4 — Manual monitoring bridge

During the first-50-customers window, RelayKit-side manual monitoring substitutes for automated anomaly detection:

- Billing dashboard signals (cost per customer per day, deviation from onboarding-stated projections)
- Per-customer destination distribution (long-tail diversity is healthy; clustered destinations are a signal)
- Velocity vs onboarding-stated volume projections

Manual intervention on detected attacks. RelayKit absorbs detection-latency overage on confirmed attacks as part of the structural commitment ("your bill stays predictable"). Bounded by detection latency — minutes of attack traffic before pause.

Graduation to automated anomaly detection is post-launch BACKLOG work. Graduation triggers: customer count exceeds manual monitoring capacity; sufficient real-traffic data accumulated to characterize false-positive thresholds without guessing; customer-tier-mix matures enough to need per-tier baseline differentiation.

Cross-reference: D-374, MARKETING_STRATEGY MD-15.

### §3.5 — Marketing pillar

The pumping defense pillar is framed upstream-as-headline:

> Real users keep getting their messages. Attacks do not reach the carrier. Your bill stays predictable.

Not "we cap your bill" — that framing sounds like an outage to customers when their real users cannot log in. The promise is that defenses fire upstream of any cost (bot detection, rate limits, country allow-list, per-destination caps), so attacks rarely reach the billing surface in the first place.

The two-layer architecture is itself the differentiation. Twilio, Plivo, Vonage, Prelude give developers SDKs and let them figure out Layer A on their own. RelayKit's AI-tool-driven integration model prescribes Layer A as core integration content. No usage-based incumbent can copy this without rebuilding their developer-experience stack.

Cross-reference: MARKETING_STRATEGY MD-13 (positioning pillar), MD-14 (awareness-gap risk), MD-15 (build-in-public content lane).

---

## §4 — Defenses-by-design

Defaults are on, not opt-in. The structural posture (§1) plays out at the per-feature level:

- **Country allow-list** — defaults to US-only. Customer opts in to additional countries explicitly, not by default.
- **Per-destination rate limit** — defaults to conservative. Customer can lower (tighter), cannot raise (looser); raising would lower effective protection.
- **Premium-prefix block list** — defaults to RelayKit-maintained. Customer can override individual prefixes with explicit opt-in for documented business reasons.
- **Per-customer rate limit** — defaults set per subscription tier. Customer can lower within tier, not raise.
- **Bot defense in integration** — AGENTS.md and the integration prompt prescribe defense practices as core content. The customer's AI tool wires them in at integration time, not as opt-in middleware.

The architectural posture is that every default points toward defense, every loosening requires explicit customer action with documented business reason.

Cross-reference: §1 posture, MARKETING_STRATEGY MD-13.

---

## §5 — What is tracked elsewhere

This document is the canonical home for security posture, threat surface inventory, and pumping defense detail. Related material lives in canonical sources elsewhere:

- **MASTER_PLAN.md §2** — pumping defense by default working principle
- **MASTER_PLAN.md §9** — Phase 5 scope (pipeline-side Layers 1–4 + manual monitoring bridge)
- **MASTER_PLAN.md §12** — Phase 8 scope (Layer A integration guidance)
- **MASTER_PLAN.md §16** — automated anomaly detection deferred
- **MASTER_PLAN.md §17** — risks (Layer A skipping, sophisticated attackers post-launch, manual monitoring scaling limit, adjacent threat surfaces)
- **MASTER_PLAN.md §18** — open architectural questions (per-destination rate limit defaults, customer-tunable scope, anomaly detection graduation triggers, Layer A enforcement, baseline architecture)
- **DECISIONS.md D-373** — two-layer pumping defense architectural commitment
- **DECISIONS.md D-374** — manual-monitoring bridge for first 50 customers; automated anomaly detection deferred
- **MARKETING_STRATEGY.md MD-13** — pumping defense as launch positioning pillar (upstream-as-headline)
- **MARKETING_STRATEGY.md MD-14** — pumping awareness-gap risk acknowledged
- **MARKETING_STRATEGY.md MD-15** — build-in-public content lane (pumping defense graduation narrative)
- **BACKLOG.md** — six pumping defense entries (anomaly detection graduation, customer controls scope, forensics view, Layer A enforcement, destination-pool baselines, attack-pattern observation framework) + one broader threat-modeling workstream entry

---

*RelayKit LLC — DRAFT v0.1. Authored: PM session 2026-05-03 pumping defense integration.*
