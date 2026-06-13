# RelayKit Customer Archetype Foundation

> **Purpose:** The corpus-derived model of who has the problem RelayKit solves — organized by app shape and SMS need. Feeds Indie Hackers prospecting, blog and SEO topic selection, marketing-site positioning, starter-kit integration choices, lead qualification, and product roadmap prioritization. Build once, reference everywhere.
>
> Not for: channel tactics and posting plans (MARKETING_STRATEGY), phase ordering and out-of-scope list (MASTER_PLAN), pricing numbers (PRICING_MODEL), screen-level UI (PROTOTYPE_SPEC), the message corpus itself (`marketing-site/lib/message-library/*`).
>
> **Relationship to other docs:** MARKETING_STRATEGY's audience section (MD-9) references this doc rather than restating it — MARKETING_STRATEGY answers "who do we reach and where," this answers "who has the problem." MASTER_PLAN's roadmap references §4 of this doc as a prioritization input. Per the One Source Rule, the archetype model lives here and nowhere else.
>
> **Maintenance:** CC-maintained. PM proposes changes; CC writes them on disk. Treat like MASTER_PLAN — load-bearing but amendable when ground reality contradicts it.

### Version 1.0 — drafted 2026-05-25

---

## 0. How to read this doc

This doc has four parts, each doing a distinct job.

**§1 — The app-shape model.** The spine. Indie SaaS is not one customer; it is a set of recognizable app shapes, and each shape lights up a predictable bundle of message categories. This section names the shapes and maps each to its category bundle, its supply-side (visible) need, its demand-side (latent, unproven) need, and the signals that identify it in the wild.

**§2 — Channel-fit honesty.** For each category, where SMS is *inherently* the right tool versus where it is a *preference call* against email, in-app, push, TOTP, or passkeys. The principle: we do not want to be in the business of convincing. Where SMS obviously wins, we hunt. Where it is close, we mention it and move on.

**§3 — The demand-thesis verdict.** RelayKit's founding bet is that indie developers abandoned SMS because it was too hard, so easy SMS reawakens latent demand. This section states where the research supports that and where it does not. It is a verdict, not a restatement.

**§4 — Roadmap input.** Two halves. **§4a** — the message categories deferred or gated, why, and what would change the posture. **§4b** — the horizon audiences (multi-tenant platforms, no-EIN builders) that are real but post-launch, kept here so they inform sequencing without distorting launch priority.

A reader who wants to find IH prospects reads §1 and §2. A reader deciding what to build next reads §4. A reader writing positioning copy reads §1, §2, and §3.

---

## 1. The app-shape model

### 1.1 Why app shape, not category

The message corpus has nine categories. It is tempting to treat each as an archetype — "the appointments customer," "the order-updates customer." That is the wrong unit. A category is something an app *sends*; an archetype is the *kind of app* doing the sending. One app shape sends from several categories, and the bundle it sends from is predictable from the shape alone.

The corpus itself shows the structure. Two categories — Verification and Account events — apply to nearly every SaaS, because every SaaS has a signup and a billing surface. They are infrastructure, not signal. The other categories require a specific app shape to be relevant: an app only sends Order updates if it ships or fulfills something; it only sends Waitlist messages if it gates access; it only sends Team alerts if it has an operational or on-call surface. So the model is built from app shapes, and the universal categories are noted as a floor every shape sits on rather than as a distinguishing trait.

### 1.2 The shapes

Six app shapes cover the reachable launch audience. They are not mutually exclusive — a real product can be two at once — but each is recognizable, and each has a characteristic category bundle.

**Shape A — Scheduling and booking apps.** Software where a person reserves a slot of someone's time: salon and barber booking tools, tutoring and coaching platforms, fitness class booking, professional services scheduling, field-service dispatch. The defining feature is a calendar with appointments that can be confirmed, reminded, rescheduled, cancelled, and missed.

- *Category bundle:* Appointments (primary), Verification (floor), Account events (floor), Marketing (secondary — rebooking, promotions).
- *Supply-side need:* Visible and acute. No-show cost is felt directly and measured easily; the operator knows exactly what an empty slot costs. The appointment-reminder use case is the single most-recognized SMS use case in the small-business world.
- *Demand-side need:* Low. There is little latent demand to reawaken here — the need is already conscious. The opportunity is not "they forgot they wanted this," it is "they want it and the 10DLC wall stopped them or pushed them to a closed booking platform."
- *IH-visible signals:* The product description contains "booking," "scheduling," "appointments," "calendar," "no-show." The founder posts about no-show rates, calendar integrations, or reminder workflows. The app has a public booking page.

**Shape B — Commerce and physical fulfillment.** Software where an order is placed and something physical or time-bound is delivered: e-commerce tools, print-on-demand, subscription boxes, local delivery, ticketing. The defining feature is an order with a lifecycle — confirmed, processing, shipped, delivered, returned, refunded.

- *Category bundle:* Order updates (primary), Verification (floor), Account events (floor), Marketing (secondary).
- *Supply-side need:* Visible. Shipping-notification SMS is an expected consumer experience; customers ask for it. Returns and refund confirmations are felt as support-ticket deflection.
- *Demand-side need:* Moderate. Many small commerce builders rely on the carrier's own tracking notifications (UPS/USPS texts) and never consider sending their own branded order SMS — they have given up a touchpoint without noticing. That is genuine latent demand.
- *IH-visible signals:* The product description contains "orders," "shipping," "fulfillment," "store," "checkout," "subscription box." The founder posts about Stripe, cart abandonment, or fulfillment logistics.

**Shape C — Access-gated and capacity-limited apps.** Software where demand exceeds available supply and access is rationed: launch waitlists, early-access betas, limited-capacity services, drop-based products, reservation systems for scarce resources. The defining feature is a queue.

- *Category bundle:* Waitlist (primary), Verification (floor), Account events (floor), Marketing (secondary — broad-list announcements).
- *Supply-side need:* Mixed. A founder running a launch waitlist knows they have a list; they may not have thought of SMS as the channel to work it. A capacity-recovery flow (a fully-booked service texting "a spot opened") has sharper, more visible need.
- *Demand-side need:* High and specific. This is the strongest latent-demand case in the corpus. Almost every indie SaaS has a pre-launch waitlist, almost all of them work it by email, and "your turn" is exactly the kind of time-sensitive, single-recipient moment where email's 20% open rate quietly loses a meaningful share of conversions. The founder does not experience this as a problem because they never see the un-opened email. That is latent demand in its truest form.
- *IH-visible signals:* The product description contains "waitlist," "early access," "join the list," "limited spots," "drop." The founder is pre-launch or recently launched. There is a public landing page with an email capture.

**Shape D — Operational and developer tooling.** Software that monitors, alerts, or coordinates work: uptime and monitoring tools, on-call and incident tooling, internal dashboards, deployment tools, anything where a human needs to be pulled to a problem fast. The defining feature is an event that demands a person's attention now.

- *Category bundle:* Team alerts (primary), Verification (floor), Account events (floor). Marketing is rarely relevant here.
- *Supply-side need:* Visible for the alerting use case — an on-call engineer who misses a page is a felt failure. Less visible for routine operational messages (shift scheduling), which many tools route through Slack.
- *Demand-side need:* Moderate. The latent piece is that many small ops tools assume Slack or email is sufficient for alerting and never offer SMS, then discover that a Slack notification at 3am does not wake anyone. The on-call page is a use case where SMS is not a preference — it is the only channel that works when the device is asleep.
- *IH-visible signals:* The product description contains "monitoring," "uptime," "alerts," "on-call," "incident," "status." The founder posts about reliability, PagerDuty alternatives, or DevEx.

**Shape E — Community and cohort products.** Software organized around a recurring group: paid communities, cohort-based courses, membership programs, event-driven groups, creator memberships. The defining feature is a roster of members moving through shared moments — onboarding, events, milestones.

- *Category bundle:* Community (primary), Verification (floor), Account events (floor), Marketing (secondary — event promotion).
- *Supply-side need:* Low to mixed. A community operator does not usually frame their problem as "I need SMS." They frame it as "members miss the live event" or "new members go quiet in week one." SMS is a means they have not connected to those problems.
- *Demand-side need:* Moderate, but with a caveat. The live-event reminder is a strong fit — a text that arrives 30 minutes before a call is hard to beat. But a real share of community SMS demand is actually "send a notification from my Discord or Slack to phone numbers," which is an integration RelayKit does not offer at launch (BACKLOG). The honest read: the demand exists, but part of it points at a product RelayKit does not yet have.
- *IH-visible signals:* The product description contains "community," "cohort," "membership," "members," "course." The founder posts about engagement, retention, churn, or event attendance.

**Shape F — Generic B2B SaaS.** Software that does not fit A–E: analytics tools, productivity apps, AI tools, content tools, dev libraries with a dashboard, most horizontal B2B products. The defining feature is the absence of a defining feature — there is no calendar, no order, no queue, no on-call surface, no roster.

- *Category bundle:* Verification (floor) and Account events (floor) only. No primary category.
- *Supply-side need:* Verification need is real but invisible (see §2). Account-events need — payment-failed, trial-ending — is real and churn-relevant but quiet.
- *Demand-side need:* This is the hard case for the demand thesis. See §3.
- *IH-visible signals:* No SMS-shaped signal. The product is identifiable as indie SaaS but nothing in its description points at a transactional SMS need. This shape is the bulk of Indie Hackers by count and the weakest to hunt by category.

### 1.3 The two universal categories

Verification and Account events sit under every shape as a floor.

**Verification** applies to any app with a signup. It is the broadest possible need and therefore the weakest hunting signal — "this app has signups" identifies nearly everything and so identifies nothing. Its value is not as a hunting filter but as the conversion-path opener: a developer searching "send SMS verification code Next.js" has declared intent, and that intent is addressable by content (§2, §3). Verification is a wedge by *search intent*, not by *app shape*.

**Account events** — payment-failed, trial-ending, subscription-confirmed, new-device-signin, account-suspended — applies to any app with paid billing. Also near-universal, also a weak hunting signal. Its strategic role is different: it is the category that makes "RelayKit is not just OTP" true. A generic B2B SaaS with no primary category still has a real account-events need (a failed-payment text recovers churn an email misses). It is the floor that keeps Shape F from being a non-customer.

The discipline this section enforces: do not hunt prospects by the universal categories. Hunt by the primary category of Shapes A–E. Use the universal categories to size the total market and to shape content, not to build a prospect list.

---

## 2. Channel-fit honesty

The instruction behind this section: RelayKit should not have to *convince* anyone. Where SMS is obviously the right tool, the product sells itself and we lean in. Where SMS is merely one option among several, it becomes a preference call, and a preference call is a marketing problem, not a slam-dunk. Being honest about which is which keeps the positioning credible — a developer who catches us overclaiming on one category distrusts us on all of them.

SMS has three inherent structural advantages, and they are the whole basis of the analysis below. First, **reach without an install** — SMS arrives on any phone with a number; push requires the user to have installed a native app and granted permission, which most web-app users have not done. Second, **no spam folder and no feed** — SMS lands in the same place as messages from family, with no promotions tab and no algorithm deciding visibility; email's real open rate sits around 20–25% and is further obscured by privacy features that block tracking. Third, **it works when the device is otherwise unreachable** — SMS rides cellular signal and reaches a phone that is asleep, offline, or has the app closed.

Those advantages matter enormously for some messages and barely at all for others. SMS's cost is real — it is almost always more expensive per message than email or push — so the question for each category is whether the advantage is worth paying for.

### 2.1 Where SMS inherently wins

These are the categories where SMS is not a preference — it is the appropriate tool, and a developer choosing email instead is accepting a worse outcome. RelayKit can state the case plainly here without overclaiming.

**Appointment reminders (Shape A).** Time-sensitive, single-recipient, and consequential — a missed reminder is a missed appointment. The recipient is often not in the app and may not have it installed at all. Email's open rate loses a real fraction of reminders silently; SMS does not. This is the strongest inherent-fit case in the corpus and the most universally recognized.

**Order and shipping updates (Shape B).** Expected by the recipient, time-relevant, and consumer-facing. The recipient is a buyer who may have no account and no app. SMS is the channel consumers now expect for "it shipped" and "it is out for delivery." Email works but is visibly second-best.

**Waitlist "your turn" and capacity openings (Shape C).** The single moment in the waitlist lifecycle where the channel choice decides the outcome. A spot that opens is claimed or lost on a clock; an email that sits unopened for two hours loses the claim. SMS's read-within-minutes property is the entire value.

**On-call pages and urgent alerts (Shape D).** The clearest case in the corpus. An on-call engineer is asleep, the laptop is closed, Slack is not going to wake them. SMS reaches a sleeping phone. This is not "SMS is better here" — it is "the alternatives structurally do not work for this message."

**Security alerts — new-device-signin, account-suspended (Account events, all shapes).** Time-sensitive and trust-critical: the recipient needs to catch a compromise fast, and may be locked out of the very account whose email they would otherwise rely on. Out-of-band delivery is the point.

**Verification for new signups and account recovery — as the universal coverage layer.** This one needs a precise frame, because the easy version of the claim is wrong (see §2.3).

### 2.2 Where SMS is a preference call

These are the categories where SMS is a legitimate option but not an obvious winner — the alternatives are good enough that the choice comes down to taste, audience, and budget. RelayKit can offer these and mention them; it should not build positioning around being obviously right here.

**Marketing messages (Shapes A, B, C, E).** SMS marketing genuinely outperforms email marketing on open and response rate. But for an app whose users are reachable in-app, push notifications are free, richer, and deep-link straight to the product — and email marketing, while lower-engagement, is far cheaper at scale. SMS marketing wins when the audience is not app-installed and the message is time-bound. Otherwise it is a budget-and-audience judgment. Note also that SMS marketing carries the heavier compliance load (separate EIN-gated campaign, separate consent), which raises the bar for "worth it."

**Community updates and onboarding (Shape E).** The live-event reminder is close to inherent-fit (time-sensitive, the value is the arrival). But community announcements, milestones, and the multi-step onboarding nudges are messages an engaged member would equally well receive in-app, by push, or by email. For a community whose members live in a Discord or Slack, that is where the notification belongs — and RelayKit does not bridge to those at launch.

**Account events that are not urgent — trial-ending, subscription-confirmed (all shapes).** Trial-ending is recoverable churn and SMS does lift it, but email handles it adequately and most apps already do. Subscription-confirmed is a no-action receipt; email is the natural home. Payment-failed sits closer to the inherent-win line because the consequence (service interruption) is sharp, but even there email is the incumbent and the SMS case is "marginally better," not "obviously right."

**Routine team messages — shift scheduling, service-level alerts (Shape D).** Distinct from the on-call page. A shift-scheduled notice or an informational SLA notice is not a wake-the-person message; many teams route these through Slack and are content. SMS is fine here, not necessary.

### 2.3 The verification frame — getting it right

Verification deserves its own treatment because the obvious pitch is subtly wrong and a sophisticated developer will catch it.

The research is consistent: SMS one-time passwords are being downgraded from *primary* authentication factor to *fallback*. NIST has classified SMS OTP as a "restricted" authenticator; regulated financial services in several countries are phasing it out for high-assurance use; adversary-in-the-middle phishing kits defeat SMS codes in real time. Passkeys are the phishing-resistant default the industry is converging on, with TOTP as the middle option.

That sounds like bad news for a verification wedge. It is not — but only if the claim is framed precisely. The same research is equally consistent that SMS OTP **remains essential as the universal coverage layer** for new signups and account recovery, and is expected to stay relevant for at least a decade. Passkey adoption is only roughly a quarter to a third of users; the rest still need a code. A user signing up on a device with no passkey enrolled, or recovering an account they are locked out of, still needs SMS.

So the honest claim is not "SMS verification is the best way to verify." It is: **SMS verification is the coverage floor every app still needs, even as passkeys take the primary slot.** Pitched as the former, a developer who has read anything about auth in 2026 pushes back and the credibility hit spreads to the rest of the pitch. Pitched as the latter, it is unarguable and it is still a real, durable need. The configurator already encodes a version of this honesty — the login-code message carries advisory framing that SMS is the least-secure second factor and TOTP or passkeys are preferable. The marketing voice should match that restraint: position verification as universal coverage and account-recovery fallback, not as the security frontier.

This also means the verification *search-intent* play (§3) stays valuable — developers still search for how to send an SMS code, because they still need to — but the content should meet them with the accurate frame, not an overclaim they will see through.

---

## 3. The demand-thesis verdict

RelayKit's founding bet, stated in Thread 1's handoff: SMS got abandoned by indie developers because it was too hard, so easy SMS reawakens latent demand the developer does not know they have given up.

The research and the corpus analysis support a **qualified yes**. The thesis is true in a specific shape and false in a broader one, and the difference is what makes it actionable.

**Where the thesis holds.** Latent demand is real for the sharp-signal workflow shapes — Scheduling (A), Commerce (B), Access-gated (C) — in exactly the cases where SMS inherently wins (§2.1). The mechanism is concrete and verifiable: 10DLC registration is a documented wall that takes weeks through the usual providers and is the consistently-cited reason small builders abandon SMS or never start. A founder running an email-only launch waitlist is not consciously aware that "your turn" emails are being missed, because they never see an un-opened email — that is latent demand in the literal sense, and it is addressable. The waitlist case is the strongest: near-universal among indie SaaS, near-universally worked by email, and a category where the channel choice measurably changes the outcome.

**Where the thesis is true-but-too-broad.** For Verification and Account events, "they need it" is correct and useless. Every SaaS has a signup and billing; saying the need exists everywhere identifies no one and prioritizes nothing. The need is real but it is not *latent* in the reawakening sense — a developer who skipped SMS verification chose TOTP, email links, or passkeys deliberately, often for good reasons. There is nothing to reawaken; there is a coverage gap to fill, which is a different and weaker pitch. These categories earn their place through search intent and through being the floor that makes RelayKit a complete product — not through latent demand.

**Where the thesis is weak or false.** For Shape F — generic B2B SaaS with no primary category — the thesis does not hold. These apps skipped SMS not because 10DLC was too hard but because they have no transactional SMS use case that beats their existing channels. Their users are in-app and reachable; push and email are sufficient; SMS would be a cost with no matching advantage. Easy SMS does not reawaken a demand that was never there. Shape F is a customer only for the universal-floor categories, and only weakly.

**The actionable conclusion.** The thesis should be carried as a *targeted* claim, not a universal one. RelayKit's latent-demand story is strongest for booking, commerce, and access-gated apps, and the marketing should hunt there. For the universal categories, the story is "complete coverage, finally easy" — not "demand reawakened." For generic B2B SaaS, there is no latent-demand story and the foundation should not pretend otherwise; that segment converts on verification search intent or not at all. A foundation that claimed latent demand everywhere would send prospecting effort at Shape F, which is the largest segment by count and the worst by fit — the most expensive possible mistake.

---

## 4. Roadmap input

This section gives MASTER_PLAN a prioritization input. It has two halves: categories deferred or gated (§4a), and audiences on the horizon (§4b). Both are kept here, clearly labeled as not-launch, so they inform sequencing without distorting launch focus.

### 4a. Deferred and gated message categories

The product ships eight configurator categories and eight SDK namespaces (D-386). The categories below are not in launch scope. Each entry states the posture, why, and what signal would change it.

**Healthcare / HIPAA — declined (policy).** RelayKit declines healthcare and HIPAA-adjacent use cases at intake (D-18). This is a RelayKit policy choice, not a carrier constraint — HEALTHCARE is a valid brand vertical in Sinch's API; RelayKit declines it because it holds no Business Associate Agreement and routes no protected health information through the proxy. *What would change it:* a deliberate decision to take on BAA obligations and the compliance infrastructure they require — a significant strategic commitment, not a template addition. Note that BACKLOG already holds "HIPAA-regulated appointment template variants" as a Likely item: healthcare is a real adjacent demand pool for Shape A (booking apps for clinics, dental, therapy), and the deferral is a cost-and-liability call, not a no-demand call. If booking-app customers cluster around healthcare, this is the highest-value deferred category to revisit.

**Cannabis and firearms — declined (carrier).** Hard decline, no waitlist (the Tier 3 industry-gating tier). Unlike healthcare, this is a carrier-ecosystem exclusion — these verticals cannot be registered under any circumstances. *What would change it:* nothing within RelayKit's control. Not a roadmap item; recorded for completeness.

**Elevated-scrutiny verticals — registrable, not declined.** Legal, financial, and similar verticals carry heavier carrier scrutiny but are registrable (the Tier 1 advisory tier in D-49). They are not a deferred category — they are in scope — but they are flagged here because they sit at an awkward seam between RelayKit's core promise and a real market, and the foundation should be honest about both.

*The market.* This is not a fringe pool. Fintech is one of the largest and most active segments of indie SaaS — lending tools, neobank-adjacent products, crypto and payments apps, expense and invoicing software, "vertical fintech" embedding financial features into a niche. Legal-adjacent software — case management, client intake, document automation, collections tooling — is smaller but real and growing. Both segments have genuine, often acute, transactional SMS need: a payment-due reminder, a funds-available alert, a document-ready-to-sign notice, a court-date reminder are all messages where SMS's reach and immediacy matter as much as they do for any appointment reminder. By the §1 app-shape model, a fintech product is frequently a Shape B (commerce/fulfillment of money movement) or a Shape A (scheduled financial events); a legal product is frequently a Shape A (court dates, appointments) with a collections edge. In raw demand terms, these are attractive customers.

*The issue.* The friction is that RelayKit's single sharpest promise — fast registration, days not weeks — is the promise hardest to keep for exactly these verticals. Carrier vetting for financial services and legal is documented as content-specific, not merely slower: lending, credit, and debt-collection content draws enhanced scrutiny and stricter sample-message review from the carriers themselves, on top of the standard TCR campaign review. The realistic outcomes for an elevated-scrutiny brand are a longer review, a higher rejection-and-resubmit rate, and in some content sub-categories — most notably anything resembling debt collection or high-cost lending — a real chance of non-approval regardless of how clean the registration is. Sinch's roughly three-day turnaround, which is RelayKit's headline differentiator, is a transactional-and-2FA-campaign figure. It does not reliably hold for a lending or collections campaign, and a fintech founder who was sold "approved in days" and then waits three weeks for a rejection has been mis-sold.

*The posture this implies.* Three things, none of which is "decline." First, **do not let the fast-registration promise overreach.** The promise is honest for the launch-target shapes (booking, commerce, generic SaaS sending transactional or 2FA traffic); it should not be stated unconditionally in any surface a fintech or legal founder will read. The honest framing for them is "fast for standard transactional messaging; financial and legal use cases carry additional carrier review we will walk you through" — slower, but true, and true is what protects the differentiator everywhere else. Second, **the content-rules distinction matters more here than the vertical label.** A fintech doing account-event and verification messaging — trial-ending, payment-confirmed, login codes — is close to a normal Shape B/F customer and registers roughly normally. A fintech doing lending solicitation or debt collection is a different risk class. The foundation's guidance is to qualify on *what the messages say*, not on "is this fintech," because most indie fintech SMS need is the benign kind. Third, **this is where RelayKit's compliance-authoring model is a genuine asset rather than a liability.** A platform that authors the messages and checks them against the registered use case at authoring time can keep an elevated-scrutiny customer inside the lines in a way a raw send-anything API cannot — the heightened-scrutiny vertical is precisely the customer who benefits most from compliance collapsing to authoring time. That is a real positioning angle, but it is a Tier 3 / documentation angle (the customer who has chosen to learn), not a homepage claim.

*What would change the posture.* Nothing about eligibility — these verticals are registrable today. What could change is treatment: if elevated-scrutiny customers cluster, it is worth a dedicated intake path that sets expectations honestly up front, vetting-aware copy in the registration flow, and possibly a content-specific advisory layer in the configurator for lending and collections language. None of that is launch scope; it is a fast-follow if the segment shows up.

**Higher Education — deferred, buildable (D-386).** Unlike healthcare and cannabis, Higher Ed is not declined — it is simply unbuilt. It was deferred from launch because it was the highest-effort, lowest-payoff Phase 2a authoring task: authoring it would mean inventing sub-uses, a variable model, a FERPA-shaped compliance overlay, and a TCR mapping from a blank slate, for an audience (universities) that is not the launch target. *What would change it:* real customer pull from the higher-ed segment. Adding it post-launch is straightforward and benefits from evidence-driven sub-use definition rather than blank-slate authoring. This is the most likely deferred category to become a real ninth namespace, and it should be revisited first if higher-ed demand appears.

**Corpus gaps inside shipped categories.** Two smaller items, both in BACKLOG: Order updates delivery-exception messages (failed delivery, weather delay) are skipped at launch because most indie SaaS defers these to carrier-direct notifications; per-send free-text variables for action-specific transactional templates are deferred pending evidence of demand. Neither is a category-level gap; both are noted so the foundation's category map is honest about what "Order updates" and "Verification" cover today.

### 4b. Horizon audiences

These are not deferred *categories* — they are different *customers*. They are real, they are coming, and they are deliberately labeled post-launch so they do not pull launch positioning off the reachable audience. The discipline here is the important part: the backlog is full of legitimate futures, and a foundation that weighted them equally with launch reality would stop being useful for prioritization.

**The multi-tenant / platform builder.** Today RelayKit is one app, one registration, one campaign, one developer (D-95). The platform tier (BACKLOG, PRD_10) is a genuinely different customer: a developer building a *platform* — booking software for salons, a CRM, a vertical SaaS — whose own customers each need their own phone number and campaign. That developer is not adding SMS to their app; they are reselling RelayKit's compliance machinery to their tenants.

This does not change RelayKit's mission. The mission — an independent developer can add SMS cleanly and compliantly — still describes the platform builder; they are an independent developer with that exact problem, one layer up. But it is a second audience with a different economic shape, a different pricing model, and a hard dependency on RelayKit completing the Sinch reseller-account transition (BACKLOG, Phase 5+). It belongs in the foundation as a named archetype — **Shape G, the platform builder** — explicitly tagged horizon, not a launch hunting target. Naming it keeps the model durable; tagging it prevents "RelayKit for platforms" from leaking into launch positioning, which would be the failure mode.

**The sole-proprietor builder (no registered entity).** A meaningful slice of RelayKit's stated eventual audience — solo founders, vibe coders, and hobbyists operating as sole proprietors without a registered business entity — cannot onboard through the 10DLC path at all, because TCR has no sole-proprietor entity type and requires an EIN-backed registered entity (D-433; killed exploration `/explorations/no-ein-sole-proprietor-path.md`). This is the sharpest reason the reachable launch audience is narrower than the mission's audience. The honest statement for the foundation: **the served audience is registered-entity indie SaaS founders.** This segment is **permanently unsupported, not deferred** — the toll-free fallback that once looked like a path is confirmed permanently blocked (D-433), so there is no candidate onboarding path and they should never be marketed to as if they can sign up. The wall is registered-entity status, not the EIN itself (the EIN comes with the entity).

**Two-way / inbound — scheduled, not horizon.** Worth distinguishing from the above. Inbound message handling is not a horizon audience — it is Phase 4 scope, with a basic inbound viewer committed for launch. It is noted here only because it upgrades the channel-fit case for Customer support: a channel the recipient can *reply* to is something in-app notifications and push structurally cannot match. When inbound lands, Customer support moves closer to the inherent-win column for apps whose support model is conversational.

### 4c. What this section tells MASTER_PLAN

Synthesised for prioritization: among deferred categories, Higher Education is the most likely to earn a build, and healthcare the highest-value-but-highest-cost — both gated on observed customer pull, neither a launch concern. Among horizon audiences, the platform builder (Shape G) is the largest strategic expansion and is correctly gated on the Sinch reseller transition; the sole-proprietor segment (no registered entity) is the most acute *permanent* gap between stated audience and reachable audience — closed, not deferred (D-433), so it informs honest positioning rather than the post-launch build queue. None of this changes the launch plan. All of it should inform what gets built immediately after launch, in roughly that order.

---

## 5. Downstream artifacts

This foundation is the spine; several smaller artifacts fall out of it and are noted here so they are not re-derived from scratch.

- **The IH prospecting extract.** Shapes A–E with their IH-visible signals (§1.2) compress into a prospect-archetype card and a companion card Joel pastes into the Chrome extension. That extract is a direct subset of §1 and §2.1 — hunt the inherent-win shapes.
- **Blog and SEO topic selection.** §2 and §3 indicate where content should concentrate: the inherent-win categories and the verification search-intent frame from §2.3. Long-tail SEO targets the verification and 10DLC queries; the topical authority targets the booking/commerce/waitlist shapes.
- **Starter-kit integration priority.** §1's category bundles indicate which starters matter: starters that produce Shape A/B/C apps carry more RelayKit relevance than generic-SaaS starters.
- **Lead qualification.** §1.3's discipline — qualify on primary category, not universal floor — is the qualification rule.

These are not built in this doc. They are MARKETING_STRATEGY and BACKLOG follow-ups that reference this foundation.

---

*End of CUSTOMER_ARCHETYPE_FOUNDATION.md — v1.0*
