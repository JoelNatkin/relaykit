# RelayKit Master Plan
### The holistic plan that guides all of our work
### Version 1.4 — April 30, 2026

**v1.4 — 2026-04-30:** Phase 6 (Vertical Hydration) scope expanded to include OTP-as-feature work. Server-side validation endpoint, universal sendCode+checkCode SDK pair (D-370), dashboard Verification panel, onboarding round-trip OTP test, and API/prototype template registry reconciliation now ship at launch as part of Phase 6 rather than deferred to post-launch. Drives D-369 (validation in launch scope), D-370 (SDK naming), D-371 (customizability). Marketing pillar "Verification included" depends on this Phase 6 expansion.

**v1.3 — 2026-04-28:** §9 Phase 5 amendment — lock in msgverified-hosted opt-in form as required launch-scope work, no longer conditional. Adds per-customer signup URL (`msgverified.com/{slug}/signup`), brand-name display, D-365 consent language, SMS verification, consent-ledger integration, slug provisioning during onboarding, and registration of the URL as the carrier-submission CTA. Reason: post-3b rejection (2026-04-27) surfaced that customers come to RelayKit *to get* SMS — they don't already have a signup form, so without RelayKit hosting one, every customer registration would fail CR4015 (functional opt-in/CTA URL). The "if carriers require it" framing in v1.2 is wrong; carriers always require a functional CTA URL, and the customer reality means RelayKit must host. Out-of-scope-for-launch items added (custom theming beyond brand name, multi-opt-in per slug, customer-domain hosting, multi-language). Open design questions noted (slug format/collision handling, brand customization scope, onboarding-flow surfacing) — to be resolved at Phase 5 design start. Title line bumped to 1.3.

**v1.2 — 2026-04-26:** §5 Phase 1 amendment — retire Experiment 4 as a separate experiment; merge old Experiments 3 and 4 into a single new Experiment 3 covering the full registration arc (3a brand, 3b campaign, 3c upgrade); renumber old Experiment 5 to new Experiment 4; update §5 prose paragraphs accordingly. Reason: 3b's procedure already covers what Experiment 4 was originally defined as ("Submit a campaign registration and measure time"); the experiments log has organically grown 3a/3b/3c sub-experiments that better describe the registration work; an orphan Experiment 4 reference creates ledger drift.

> **Purpose:** A single plan that holds the entire picture of where RelayKit is going and how we get there, written so Joel (non-technical UX designer and founder) can read it, catch smells, and make sure the vision stays on track. This document supersedes ad-hoc priority lists and session-to-session planning for big-picture decisions. Detailed specs still live in their own docs (MESSAGE_PIPELINE_SPEC, SDK_BUILD_PLAN, PROTOTYPE_SPEC, etc.).
>
> **Posture:** Rebuild cleanly. No corner-cutting. Prove before we build. Test in the right order. Each phase ends with something that demonstrably works before the next phase starts. CC writes code; Joel is PM's hands for running experiments and reviewing work; PM plans, reviews, and maintains this document.
>
> **How to use this document:** Read the paragraphs. Skim the lists. If something feels wrong, say so. Update it when big things change. Reference specific phases by name when talking to PM or CC.

---

## 0. The North Star

RelayKit exists so that an independent developer building an application that needs to send SMS can add it cleanly, compliantly, and confidently, without becoming an expert in carrier regulation. The developer's AI coding tool should be able to read our documentation and produce a working integration step by step, checking in at each stage, without hallucinations or shortcuts. The developer should be able to test real text messages to their own phone before committing any money, should be able to register their business for live messaging for $49 and have it approved within days (not weeks), and should never have to read a paragraph about 10DLC or carrier rules in our product. When something goes wrong, the product should tell them plainly what happened and what to do. When something is working, the product should be quiet and get out of the way. Pricing should be stated as facts on every surface, with no dark patterns.

That is the whole thesis. Every phase of this plan serves it. If a phase stops serving it, we stop that phase.

**The customer values, ranked:**

1. **Fast registration** — the single biggest differentiator. Sinch's ~3 day approval vs. Twilio's weeks is launch-or-no-launch for an indie developer. Everything depends on Sinch actually delivering on this.
2. **The AI tool integrates RelayKit correctly** — using an incremental, checkpoint-based workflow (Explore → Plan → Code → Verify per the AI integration research), with AGENTS.md, cursor rules, and per-builder guides making first-try success realistic.
3. **Honest pricing, stated plainly** — $49 registration, $19/month, 500 messages included, full refund if rejected. No fine print anywhere.
4. **Compliant by default, without teaching** — the developer never has to think about 10DLC, opt-out handling, or consent ledgers. The product handles it. Messages that can't comply can't be sent.
5. **Free to prove it works** — sandbox, no credit card, no time limit, real text messages to verified phones. Pay only when going live.
6. **One layer for everything SMS** — programmatic sends, verification codes, review requests, inbound replies, all through the same SDK and dashboard.
7. **Quiet product, no jargon** — the voice principles. Words as last resort. Knowledgeable colleague tone.

---

## 1. The State of Things (May 1, 2026)

Here is a picture of where we actually stand, mid-Phase 1, against this plan at v1.4.

There is more built than the documentation admits. The SDK — the npm package that developers will install — is essentially done. It's a complete TypeScript library with eight vertical namespaces (appointments, orders, verification, support, marketing, internal, community, waitlist), around thirty methods, dual-published, with tests, packed at v0.1.0 and ready to ship to npm. The message-authoring prototype — the UI developers will use to preview and customize their messages — is in good shape, with the appointments vertical working end-to-end. A new backend called `/api` has begun, built on clean modern foundations (Hono framework, strict TypeScript, passing tests), and the first part of the message pipeline (Session A) is complete. Session B (real Sinch outbound + delivery-report callbacks) has not started yet, but most of its gating Phase 1 findings have now landed. The marketing site at `relaykit.ai` went live during Session 57 (Next.js 15 on Vercel — real home page plus Terms, Privacy, and Acceptable Use), and the early-access capture surface (`/start/verify` plus `/start/get-started`) shipped in Session 58 as the first work to flow through the new branch-and-preview workflow recorded in D-368.

Phase 1 — the Sinch proving ground — is the active phase, and it is producing real evidence. Experiments 1 (send one SMS), 1b (delivery report rejection), 2a (delivery-report callback shape), 3a (brand registration submission + timing), and 3b (campaign registration submission + timing) are complete. Experiment 3b ran a full rejection-to-approval cycle: original submission 2026-04-26 (registration ID `01kq5ahkf08v64ymqnxsnme5bg`) was rejected 2026-04-27 with four codes (`CR2020` entity name mismatch, `CR2002` address invalid, `CR2005` website inaccessible, `CR4015` CTA missing); all four causes were remediated across Sessions 57–60 (SC SOS Amended Articles certified 2026-04-09; Notice of Change of Registered Agent processed in <24 hours; marketing site live at relaykit.ai with the `/start/verify` opt-in CTA); resubmission 2026-04-30 (registration ID `01kqfnhy0q1rjv242c163a1wyv`) was approved 2026-05-01 with TCR Campaign ID `CU4IUD0`, all four major US carriers `REGISTERED`, T-Mobile Brand Tier `LOW` (2,000/day brand-shared), AT&T Message Class `T` (75/min), Verizon and US Cellular `REGISTERED` with no per-operator throttling visible. The 3b approval unblocks Experiments 2b (inbound MO message shape), 3c (Simplified→Full brand upgrade), and 4 (STOP/START/HELP reply handling — renumbered from old Experiment 5 in the v1.2 amendment), all of which have full procedures drafted and are now ready to run. Concrete findings already in hand: unregistered 10DLC traffic silently drops at the carrier despite a 201 from Sinch (Exp 1); delivery reports arrive on a Sinch-hosted webhook in ~1.7 s and carry no signature header (Exp 2a); the brand-registration field surface plus the 5-API-state vs. 7-dashboard-state mismatch are characterized for Phase 5 (Exp 3a); Sinch's resubmission mechanic is "clone, edit, resubmit" — terminal `Rejected` status on the original Registration ID, new Registration ID for the resubmission, with cross-source SOS verification as the gating concern (Exp 3b cycle); CR2002 was the load-bearing fix (single root cause masking as four rejection codes, confirmed by the approval coming through with no further changes to CR2020/CR2005/CR4015 surfaces); and Sinch's dashboard surfaces a "Reseller status" prompt to accounts with at least one approved campaign — RelayKit is currently `No` (non-reseller), correct for the current state, with the switch coordinated through Sinch BDR at Phase 5 design start (BACKLOG entry tracks the design surface). Full Phase 1 evidence in `experiments/sinch/experiments-log.md` including the 3b approval-time addendum.

There are still real gaps. `/api` cannot actually send a text message yet — the "call Sinch" step remains a placeholder until Phase 2 Session B kicks off; that kickoff is now unblocked on the experiments side, gated on a few open enum-semantics + signature-verification design decisions. `/api` isn't deployed anywhere. The SDK isn't published to npm yet. Only the Appointments vertical works end-to-end in the prototype — every other vertical has its data defined but the wizard doesn't hand off correctly to the workspace (Phase 6 work). There's no AGENTS.md, no SDK README, no cursor rules committed (Phase 8). The compliance site at msgverified.com doesn't exist yet. Email delivery through Resend isn't wired up.

The technical-debt story is unchanged in shape but has hardened in form. The original RelayKit production app, built on Twilio, still exists in a directory called `/src`, and the decision to sunset rather than preserve or federate it is now formally recorded as D-358. The `/src` capability-to-phase rebuild map lives in SRC_SUNSET.md; `/src` itself has been frozen since Phase 0 closed and will stay frozen while Phases 2–5 rebuild its capabilities on `/api` with Sinch.

Nothing is on fire. The foundation is solid. Phase 1 is producing the evidence Phase 2+ depends on, on the elapsed-time cadence the plan budgeted for, and the discipline of proving things work before building on top of them is what will make this successful.

---

## 2. Working Principles

These are the rules we operate by. If we violate one, we're probably making a mistake.

**Prove, then build.** Before we build a feature that depends on external systems (Sinch, carrier rules, real webhook shapes), we run small experiments to confirm how those systems actually behave. Experiments are throwaway code kept in their own directory. Production code is built against real recorded responses, not assumptions.

**One phase at a time.** Each phase ends with a demonstrable artifact — something Joel can see working. We don't start Phase N+1 until Phase N is proven. This prevents the "five things half-built" state.

**No corner-cutting.** If a phase feels like it wants to skip a step to save time, we don't. The posture is "do it right." Shortcuts taken now become bugs and confusion later. Joel has explicitly agreed to accept real elapsed time in exchange for reliable outcomes.

**Sunset over federate.** When old code and new code both want to do the same thing, we kill the old code. The `/src` Twilio codebase is being retired, not maintained alongside `/api`.

**Documentation is part of the work.** Every phase ends with updated docs. Stale docs are as broken as stale code. REPO_INDEX, DECISIONS, spec documents, and this master plan all get updated at phase boundaries.

**PM is the architect, CC is the builder, Joel is PM's hands and the decision-maker.** CC does not make strategic decisions. Joel does not write code. PM reviews CC's work before it ships. This three-way role structure is load-bearing.

**The voice principles are not negotiable.** User-facing copy, error messages, dashboard labels, marketing copy — all of it runs through Voice & Product Principles v2.0. Tier 1 (show, don't tell) is the default. Tier 3 (full explanation) is only for people who go looking.

**Pricing is transparent.** Every surface that mentions money states the price plainly. $49 registration. $19/month. $8 per 500 overage messages. Full refund if rejected. No "see pricing" links, no fine print.

---

## 3. The Ten Phases

This is the whole plan from where we are to a launched product. Each phase has its own section below. The order is deliberate — each phase unlocks the next. Some phases can run in parallel tracks (explicitly called out), but most are sequential.

A high-level summary of the whole path:

1. **Phase 0: Doc reconciliation + architectural decisions** — Clean up what we know, record the `/src` sunset decision, get everyone aligned on ground truth before building anything.
2. **Phase 1: Sinch proving ground** — Run experiments to prove Sinch does what we need, measure registration approval time, capture real response shapes.
3. **Phase 2: Session B (Sinch outbound delivery)** — Build the "actually send a text message" step in `/api`, against proven Sinch behavior.
4. **Phase 3: Database reconciliation** — Clean up the two-database situation. Single clean schema on `/api/supabase` going forward.
5. **Phase 4: Inbound message handling** — Build Sinch webhook receiver in `/api`, handle STOP/START/HELP, forward to developer's webhook endpoint.
6. **Phase 5: Registration pipeline on Sinch** — Rebuild brand and campaign submission against Sinch's APIs, verify fast registration end-to-end.
7. **Phase 6: Vertical hydration + verification-as-feature** — Fix the wizard-to-workspace handoff so every vertical works end-to-end, not just appointments. Ship verification as a universal SDK primitive (sendCode+checkCode on every namespace) backed by server-side validation infrastructure, plus a dashboard Verification panel and an onboarding round-trip OTP test. Specifics in VERIFICATION_SPEC.md.
8. **Phase 7: `/api` deployment** — Stand up `api.relaykit.ai`. Staging first, then production.
9. **Phase 8: SDK publication and AI-integration artifacts** — Publish RelayKit to npm. Ship AGENTS.md, cursor rules, README, per-builder guides.
10. **Phase 9: Starter kit integration validation** — Download popular starters (KolbySisk, Vercel/Supabase), integrate RelayKit, prove the integration workflow works for real developers, approach starter maintainers.
11. **Phase 10: Launch readiness** — Review request templates, OTP polish, two-way dashboard view, compliance site, email integration, pricing sweep, final quality pass.

Two-way messaging, OTP verification, review requests, and other launch features live inside phases 6 and 10 rather than as their own phases, because they're applications of capabilities the earlier phases build, not separate projects.

---

## 4. Phase 0 — Doc Reconciliation + Architectural Decisions

Before we start building, we get everyone and everything aligned on what's true right now. The audit produced a list of places where the specs say one thing and the code says another. Leaving those gaps in place means every future session starts with CC operating on partial lies. That's a silent tax on every decision that follows. Phase 0 pays that tax down.

This phase also records the biggest architectural decision we've made: sunsetting the `/src` Twilio codebase entirely. That decision needs a D-number, a paragraph of reasoning in DECISIONS.md, and updates to every spec that currently assumes `/src` stays alive. Nothing can proceed cleanly without this.

Phase 0 is not a build phase. It's a reading, writing, and deciding phase. Joel and PM do most of the work; CC only gets involved to apply the cleanup.

**What gets done:**

- Record `/src` sunset as an official decision with reasoning
- Record `rk_sandbox_` → `rk_test_` prefix change (D-349) and apply the sweep (Phase 0 Group E — completed 2026-04-21)
- Write `SRC_SUNSET.md` — `/src` capability-to-phase map for the Phase 2–5 rebuilds (Phase 0 Group F — completed 2026-04-21)
- Update REPO_INDEX to reflect reality (commit counts, decision count, file ages)
- Update CLAUDE.md where it references wrong storage keys or stale conventions
- Rewrite SDK_BUILD_PLAN to reflect shipped state and remaining work (README, AGENTS.md, publication)
- Update MESSAGE_PIPELINE_SPEC to note what Phase 1 experiments will inform
- Archive superseded PRDs with explicit deprecation headers
- Update this master plan as the canonical reference going forward

**What does not get done in Phase 0:**

Anything that depends on Sinch behaving a specific way. Those parts of the docs stay in draft state until Phase 1 experiments produce real evidence. Examples: exact Sinch response shapes in MESSAGE_PIPELINE_SPEC Session B, registration flow timing claims on the marketing site, inbound webhook payload shape.

**Phase 0 demo moment:** Joel reads the updated docs, and they match his understanding of the product. No contradictions, no lies, no stale numbers.

**Phase 0 output:** Updated repo with consistent documentation. New D-numbers recorded. This master plan becomes the operating reference.

---

## 5. Phase 1 — Sinch Proving Ground

Before we build anything on top of Sinch, we prove Sinch actually does what we've been assuming it does. The whole product positioning rests on Sinch's fast carrier registration. If Sinch takes two weeks instead of three days, the marketing story has to change. If Sinch's inbound webhook payload looks different than we expect, the pipeline design changes. If Sinch handles STOP replies at the carrier layer automatically, our inbound logic is simpler; if not, it's bigger. These are unknowns we cannot afford to discover three weeks into building.

The experiments run against a real Sinch account. Code written here is throwaway — it lives in an `/experiments/sinch/` directory and never gets ported directly into production. What gets ported is the *knowledge* — documented response shapes, measured timings, captured webhook payloads, screenshots of approval flows. This becomes the ground truth for Phases 2, 4, and 5.

Joel is PM's hands for this phase. PM writes each experiment's procedure, what to observe, what to record. Joel runs the experiment (or has CC run it) and reports results. PM interprets and updates the experiments log.

**The four experiments:**

1. **Provision a phone number and send one SMS.** Simplest possible test. Proves the Sinch account works, proves the outbound API shape, produces a real response payload we can use as test fixture for Phase 2. Findings (recorded): Sinch returned a 201 with a ULID `carrier_message_id` and ~240 ms ack latency, but Joel's phone never received the message — unregistered 10DLC traffic silently drops at the carrier despite the success response at the API layer. This is the load-bearing finding behind Phase 2's delivery-report callback requirement (a 201 cannot be trusted as evidence of delivery).

2. **Configure webhook receiver, capture callback payloads.** Two parts: 2a captures the delivery-report callback shape (runnable now; Phase 2 depends on this to distinguish "submitted to Sinch" from "delivered" after Experiment 1's silent-drop finding). 2b captures the mobile-originated reply payload (Phase 4 contract; blocked on Experiment 3 since unregistered traffic can't be replied to).

3. **Submit brand and campaign registrations and measure timing across the full registration arc.** Tracked as sub-experiments 3a (brand registration submission and approval timing — the ground truth for the fast-registration claim), 3b (campaign registration submission and approval timing — what actually gates go-live for a customer), and 3c (Simplified→Full brand upgrade — answers Phase 5 design questions about field deltas, cost, timing, and continuity for the upgrade path). Each sub-experiment captures submission response shape, observes state transitions, and records elapsed wall-clock time.

4. **Test STOP/START/HELP reply handling.** Send a message, reply STOP from Joel's phone. Observe: does Sinch auto-handle the opt-out at the carrier level? Do we receive notification? Do we need to block further messages ourselves? This determines how big our inbound logic needs to be.

**Phase 1 demo moment:** An experiments log document that contains, for each experiment: what we did, what we observed, the real payload shapes captured, the timings measured, and screenshots. Joel and PM read it together and feel confident about what Sinch actually does.

**Phase 1 output:** `/experiments/sinch/experiments-log.md`. Real fixtures captured. Confidence that the product promise is deliverable — or, if it isn't, early warning so we can adjust course.

**Elapsed time estimate:** Experiments 1 and 2a can happen same-day. Experiment 3's sub-experiments take actual days of elapsed time waiting for Sinch to approve (which is the point — we're measuring this). Experiments 2b and 4 are quick once Experiment 3 unblocks them. Expected phase duration: roughly one week of elapsed time, most of it waiting.

---

## 6. Phase 2 — Session B (Sinch Outbound Delivery + Delivery-Report Callbacks)

Now that we know what Sinch actually looks like, we can build the "actually send a text message" step in `/api`. This is what MESSAGE_PIPELINE_SPEC calls Session B. The `/api` backend currently receives a send request, validates it, applies compliance rules, interpolates template variables, and then… writes to a log and returns a fake success. Phase 2 replaces that placeholder with a real call to Sinch.

Phase 1 Experiment 1 revealed that a 201 response from Sinch is not evidence of delivery — unregistered 10DLC traffic silently drops at the carrier despite a success response at the API layer. Phase 2 therefore cannot truthfully implement outbound delivery without also implementing the delivery-report callback loop: Sinch POSTs to a webhook we own, we update the message row from an intermediate state to a terminal one, and `/api` is finally able to report accurate delivery status. The callback infrastructure originates as the experimental Cloudflare Worker from Phase 1 Experiment 2a; Phase 2 ports it into `/api` as a real route and wires it to the `messages` table.

The refactor to accept Sinch as an injected dependency is explicit in MESSAGE_PIPELINE_SPEC. The test suite uses real Sinch response shapes captured in Phase 1 as fixtures — both the send-path fixtures from Experiment 1 and the callback-payload fixture from Experiment 2a — which means our tests are testing against reality, not guesses.

Phase 2 also applies database migration 005, which creates the `messages` table that `/api` needs for logging. Up to this point the table has existed only as a migration file; Phase 2 actually runs it. The status column's enumerated values need revisiting in light of Experiment 1 — a decision to land at Phase 2 Session B kickoff (likely a new D-number) settles whether `'sent'` means "submitted to carrier" or "delivered per callback" and introduces whatever intermediate state is required.

**What gets done:**

- Refactor `createApp()` to accept a Sinch sender via dependency injection
- Build `/api/src/carrier/sinch.ts` — the module that actually calls Sinch
- Replace the send-step stub with a real Sinch call
- Replace the log-delivery stub with a real database write
- Build the delivery-report callback receiver in `/api` (ports the Experiment 2a Worker into a real route)
- Implement Sinch webhook signature verification (covers both delivery reports in Phase 2 and MO payloads in Phase 4 — one verification layer, two payload types on top)
- Configure the Sinch Service Plan callback URL to point at the deployed `/api` endpoint
- Implement the status-transition flow from submission-time state to terminal state on callback, plus a timeout-based "presumed failed" fallback for the silent-drop case
- Apply migration 005
- Revise `messages.status` enum semantics per the kickoff decision
- Write tests using Phase 1's captured fixtures (both send-path and callback-path)
- Verify `/api` can send a real SMS and receive its delivery report end-to-end

**What does not get done in Phase 2:**

Mobile-originated (MO) inbound messages — replies from recipients — are Phase 4. Phase 2 builds the webhook receiver infrastructure and handles delivery-report payloads only; Phase 4 extends the same receiver to dispatch MO payloads into the inbound-handler logic. Registration pipeline is Phase 5. Deployment is Phase 7. Quiet hours / queueing / Session C is deferred to post-launch unless a real customer need emerges.

**Phase 2 demo moment:** Joel sends a curl command to `/api` running locally, a real text message arrives on his phone via Sinch, and the `messages` row transitions from its submission-time state to `'sent'` (or `'failed'`, if carrier-side issues arise) based on the delivery-report callback. The response shape matches what the SDK expects.

**Phase 2 output:** `/api` can reliably send SMS via Sinch *and* accurately report delivery outcomes. Database has a real `messages` table with logs. Webhook receiver infrastructure is production-grade and ready for Phase 4 to extend. All tests still pass.

---

## 7. Phase 3 — Database Reconciliation

We have two `supabase/` directories with different `messages` table shapes. One was built for `/src` with Twilio; the other was built for `/api` with carrier-agnostic language. With `/src` being sunset, this resolves cleanly: we pick `/api/supabase` as the single source of truth, extend its schema where needed to support inbound messages (currently it's outbound-only), archive the `/src` migrations directory, and confirm (or provision) the database that `/api` will run against.

This phase is mostly structural cleanup. It's important because every phase after this assumes there's one database with one schema that everyone agrees on. Leaving two directories floating around is a confusion magnet.

This is also the phase where we address the audit's destructive migration concern — the one containing `DELETE FROM customers WHERE TRUE;`. That file needs to leave version control or be clearly quarantined.

**What gets done:**

- Extend `/api/supabase/migrations/005_messages_table.sql` (or add 006) to support inbound direction and storage
- Archive `/supabase/` (root-level) migrations — move to `/docs/archive/supabase-twilio-era/` with a README explaining
- Quarantine or remove the destructive audit migration
- Confirm which Supabase project `/api` runs against, document in README
- Rename any Twilio-specific column names to carrier-agnostic equivalents (`twilio_sid` → `carrier_message_id`, etc.)
- Confirm RLS policies are either committed to migrations or documented as service-role-only

**Phase 3 demo moment:** A fresh Supabase instance can be provisioned from `/api/supabase/migrations/` alone, and `/api` runs against it cleanly. No reference to `/src` or Twilio anywhere in the schema.

**Phase 3 output:** Single clean schema. One database. Documentation clearly states what tables exist and why.

---

## 8. Phase 4 — Inbound Message Handling (MO Replies)

RelayKit has promised inbound message forwarding as part of its sandbox and production offering (it's in PRICING_MODEL). Inbound is also required for two-way messaging, which we want at launch. The `/src` codebase has a working Twilio-era implementation we can learn from conceptually but won't port directly. `/api` needs inbound built from scratch against Sinch's MO webhook shape (captured in Phase 1 Experiment 2b, which is blocked on Experiment 3 landing a delivery-capable sender).

The webhook receiver endpoint itself is already live in `/api` as of Phase 2 — it was built there to handle delivery-report callbacks, which Phase 2 scope requires for truthful delivery semantics. Phase 4 extends that same receiver to recognize MO payload types, route them into the inbound-handler logic, and perform all the inbound-specific work: registration lookup, consent updates, developer-webhook forwarding, storage. The receiver endpoint is not new work in Phase 4; the MO-specific logic is.

Inbound means: when someone's customer replies to a message, Sinch's webhook fires to `/api`, `/api` figures out which developer's registration this reply belongs to, and either forwards it to the developer's own webhook endpoint or stores it for the developer to see on their dashboard (or both).

STOP/START/HELP handling is its own concern within inbound. Depending on what Phase 1 Experiment 4 shows, we either trust Sinch to handle opt-outs at the carrier level (and just update our consent ledger from the notification), or we handle opt-outs ourselves (parse STOP, update ledger, suppress further sends). Phase 4's design follows the evidence.

**What gets done:**

- MO payload type detection in the existing `/api` webhook receiver (routes delivery-report vs. MO to different handlers; signature verification is already in place from Phase 2)
- Registration lookup (which developer does this phone number belong to)
- Consent ledger update on STOP/START
- Developer webhook forwarding (if the developer configured one)
- Inbound message storage in the messages table (schema extension handled in Phase 3)
- Tests against Phase 1 Experiment 2b fixtures

**What does not get done in Phase 4:**

Delivery-report callbacks — those ship in Phase 2. Building the webhook receiver route itself — also Phase 2. Signature verification — also Phase 2. A full dashboard inbox UI — that's Phase 10. Phase 4 is the MO-specific plumbing; the viewer comes later.

**Phase 4 demo moment:** Joel sends a test message from `/api`, replies to it from his phone, and sees the reply land in the database. If a developer webhook is configured, the reply also arrives at that webhook. STOP from Joel's phone disables further sends to that number.

**Phase 4 output:** Inbound MO handling works. Two-way messaging's foundation is in place.

---

## 9. Phase 5 — Registration Pipeline on Sinch

This is the phase that delivers the fast-registration promise. Today's `/src` has a Twilio registration pipeline — it submits a brand to Twilio's Trust Hub, submits a campaign to The Campaign Registry, polls for approval, transitions the customer's registration state, and surfaces the result in the UI. Phase 5 rebuilds this entirely on Sinch, using the real Sinch registration APIs (shape captured in Phase 1 Experiment 3, sub-experiments 3a/3b/3c).

The UI for registration already exists in the prototype — it's a well-designed flow with onboarding, building, pending, extended-review, registered, and rejected states. Phase 5's job is to wire that UI to real Sinch submissions and real state transitions, not to redesign the UI.

This phase also delivers the msgverified.com opt-in form — the customer-facing signup surface that RelayKit hosts on each customer's behalf. v1.2 framed this as conditional ("if carriers require it"), which was wrong: every customer-side carrier registration requires a functional opt-in / CTA URL (carrier rejection code CR4015), and RelayKit's customers do not arrive with a signup form already on their site — that's why they're using RelayKit. Without RelayKit hosting the opt-in form, no customer registration can pass. Discovered post-3b rejection (2026-04-27).

**msgverified opt-in form:** Per-customer URL at `msgverified.com/{customer-slug}/signup`, displays the customer's brand name, carrier-defensible consent language per D-365, phone number entry → SMS verification code → opt-in confirmed and tracked in the existing consent ledger (same backend as the wired-up SDK flow). The URL is registered as the CTA on the customer's carrier submission. Slug is provisioned during onboarding (after business info, before registration).

Open design questions to resolve at Phase 5 design start: slug format and collision handling (likely a new D-number), URL displayed-brand customization scope, how the slug surfaces in the customer's onboarding flow.

**What gets done:**

- Sinch brand submission API integration
- Sinch campaign submission API integration
- Polling / webhook for status updates
- State transition logic (Building → Pending → Registered, etc.)
- UI wiring from prototype to production
- msgverified.com opt-in form per customer (slug provisioning during onboarding, brand display, D-365 consent language, SMS verification, consent-ledger integration, registration as carrier-submission CTA)
- Tests

**What does not get done in Phase 5:**

Marketing campaign expansion (that's a customer action post-registration, not part of the initial submission flow). Multi-project support. BYO Twilio. msgverified opt-in form scope is bounded at launch: no custom theming beyond brand name display, no multiple opt-ins per slug (one per project, matches D-333), no customer-domain hosting (the upgrade path, post-launch), no multi-language.

**Phase 5 demo moment:** Joel, simulating a new customer, clicks "register" in the prototype, pays $49, submits, and within a few days sees the registration move to approved and live. A real message from his app reaches a real phone number that isn't on his verified list. `msgverified.com/{slug}/signup` renders with his brand name, accepts a phone number, sends a verification code, and the opt-in lands in the consent ledger.

**Phase 5 output:** The fast-registration promise is real and demonstrable. The product can take a new customer from signup to go-live within days, not weeks.

---

## 10. Phase 6 — Vertical Hydration + Verification-as-Feature

Phase 6 fixes the broken wizard-to-workspace handoff for non-appointments verticals (verification, orders, customer support, marketing, internal, community, waitlist) and ships verification as a fully-realized feature available across every vertical's SDK namespace.

Vertical hydration: every vertical's wizard selection produces a working post-onboarding workspace with the right templates, the right registration scope, and the right SDK namespace methods. Demo moment per vertical: install SDK, call the namespace's primary method, receive a message.

Verification-as-feature: the universal primitive named in D-360 (OTP included with every vertical) ships as the symmetric sendCode+checkCode pair on every namespace per D-370. Server-side validation infrastructure (hashed code storage, TTL, attempt tracking, rate limits) ships per D-369. Dashboard Verification panel exposes the template (editable per D-371), test-send round-trip, and Recent Activity rows. Onboarding integrates a round-trip OTP test as the activation event. API and prototype template registries reconciled (current 3-vs-8 divergence resolved).

Marketing pillar "Verification included" becomes truthful at the close of Phase 6.

Specifics in VERIFICATION_SPEC.md.

---

## 11. Phase 7 — `/api` Deployment

Up to this point, `/api` has only run on Joel's local machine. For the SDK to call it, for developers to use it, it needs to live at a public HTTPS URL — probably `api.relaykit.ai`. This phase stands it up in a deployable form.

Deployment target is likely Cloudflare Workers, Railway, or Fly (to be decided in this phase based on cost and operational complexity). Staging environment first (`api-staging.relaykit.ai`) with a test Sinch account, then production once staging runs clean for a while.

This phase also establishes operational basics: logging, error monitoring (Sentry or similar), health checks, basic metrics.

**What gets done:**

- Deployment target chosen and configured
- Staging environment stood up
- Production environment stood up
- DNS configured (api.relaykit.ai, api-staging.relaykit.ai)
- Monitoring and logging
- Deployment documented for future changes

**Phase 7 demo moment:** A curl request from anywhere on the internet to `https://api-staging.relaykit.ai/v1/messages` sends a real SMS via Sinch. The request is logged. Errors are visible.

**Phase 7 output:** `/api` is live and accessible. The SDK, once published, can be pointed at it.

---

## 12. Phase 8 — SDK Publication + AI Integration Artifacts

The SDK exists as a built package. It's not on npm yet. This phase publishes it and ships the AI-integration artifacts that make "your AI tool integrates RelayKit correctly on the first try" a real claim.

The AI integration research document is the spec for this phase. Key deliverables: an AGENTS.md template developers paste into their own projects, a `.cursor/rules/` file, an SDK README (the AI integration research has a thirteen-section outline), per-builder integration guides (Lovable, Bolt, Replit, v0), and the Explore-Plan-Code-Verify workflow documented clearly.

The research also warns against auto-generating AGENTS.md — it has to be hand-curated and surgical (under sixty lines). That's a design constraint we respect.

**What gets done:**

- `relaykit` published to npm at v1.0.0
- SDK README (thirteen sections per AI integration research)
- AGENTS.md template for developers
- `.cursor/rules/relaykit.mdc` template
- Per-builder guides (Lovable, Bolt, Replit, v0)
- Quickstart documentation
- Integration workflow documentation (Explore → Plan → Code → Verify)

**What does not get done in Phase 8:**

MCP server, llms.txt, agent skills via `npx skills add`. These are Resend-level polish that come post-launch.

**Phase 8 demo moment:** Joel runs `npm install relaykit` from a fresh directory, pastes the AGENTS.md into a test app, asks Claude Code to add appointment reminder SMS, and watches it work correctly.

**Phase 8 output:** RelayKit is a real, installable npm package with enough supporting material for AI coding tools to integrate it reliably.

---

## 13. Phase 9 — Starter Kit Integration Validation

This phase validates the biggest strategic bet: that RelayKit can be embedded into popular third-party starter kits as the default SMS layer. We don't build our own starters (the previous plan). We integrate into existing ones, document every friction point, and fix issues until the integration workflow is clean.

The sequence (from the research): start with the KolbySisk starter (free, open source, already uses Resend, matches our structure). Download it, integrate RelayKit using the SDK, README, and AGENTS.md we built in Phase 8, document every point where it was hard or confusing. Fix those issues. Then repeat with the Vercel/Supabase starter. Two clean integrations prove the pattern generalizes.

These working forks become the basis for outreach to starter maintainers in Phase 10 (ShipFast, Supastarter, MakerKit, Vercel).

**What gets done:**

- Download and integrate RelayKit into KolbySisk starter
- Document friction points in an integration journal
- Fix README, AGENTS.md, or SDK based on findings
- Repeat with Vercel/Supabase starter
- Working forks published (RelayKit's own GitHub org)
- Integration documentation polished based on real experience

**Phase 9 demo moment:** A developer who has never seen RelayKit before can clone one of the integrated starters, set an environment variable, trigger a booking, and receive a real text message — with no other work.

**Phase 9 output:** Two working integrations in established starters. A battle-tested integration workflow. Material for approaching starter maintainers.

---

## 14. Phase 10 — Launch Readiness

The final phase. Everything built before this works in isolation. Phase 10 is the final polish: the details that make it a product a real customer pays for, trusts, and recommends.

**What gets done:**

- Two-way dashboard view — a basic inbox UI so developers and business users can see inbound messages (not a full inbox product; a functional viewer)
- Email integration (Resend) — registration confirmations, approval notices, billing receipts
- Compliance site finalization (msgverified.com) — privacy policy, terms, opt-in/out language, contact pages layered on top of Phase 5's per-customer opt-in form
- Raw-color-violation cleanup in prototype (per audit)
- Stale-pricing sweep across marketing pages
- Marketing site final copy pass against Voice Principles v2.0
- Starter maintainer outreach (ShipFast, Supastarter, MakerKit, Vercel)
- Final quality pass: end-to-end testing, error-state design, edge-case polish
- Launch plan finalization

**Phase 10 demo moment:** The whole product works. A stranger can visit the marketing site, sign up, build their integration using AI tools, test with real SMS, pay $49, get approved, go live, and handle two-way conversation — without any intervention from us.

**Phase 10 output:** A launched product. Real customers onboard themselves. We have a support queue instead of a build queue.

---

## 15. Parallel Tracks

Phases run mostly sequentially, but two things can usefully happen in parallel:

**Track: Documentation and decisions.** Throughout the build, PM and Joel keep documentation current, record new decisions as they come up, and update this master plan. This isn't a phase; it's ongoing work.

**Track: Phase 0 + Phase 1 experiments.** These run at the same time. Phase 0's doc reconciliation covers everything not dependent on Sinch reality. Phase 1 experiments run alongside because they have real elapsed time waiting for Sinch approval. By the time Phase 1 finishes, Phase 0 is also done, and we can start Phase 2 against finalized docs.

No other phases benefit from parallelization. Each subsequent phase's work depends on the previous phase's demonstrated success.

---

## 16. What Is Not In This Plan

There are real features and capabilities that RelayKit will want eventually. They are not in this plan because they are not launch-blocking. Naming them here so they don't secretly drift into scope:

- **Full two-way inbox product** — compose, search, templates, assignment, multi-user roles, mobile app. Phase 10 has a minimal viewer; the full product is post-launch.
- **Multi-project support** — one customer managing several apps. Single-project at launch.
- **BYO Twilio / Sinch** — customers bringing their own carrier account. Launch is managed-only.
- **Platform tier** — SaaS platforms registering their tenants. Post-launch.
- **Marketing campaign expansion** — adding marketing post-registration. Scoped for launch (EIN-gated), but the full marketing feature set is limited at launch.
- **Drip sequences / workflows** — multi-message flows. Post-launch.
- **MMS / media attachments** — post-launch.
- **RCS** — too early.
- **WhatsApp** — wrong audience for launch.
- **Link tracking / branded short links** — post-launch enhancement.
- **Claude AI support slideout / App Doctor** — post-launch feature, already in backlog.
- **Compliance audit log export for enterprise customers** — post-launch, when we move upmarket.
- **Review request sentiment branching** — post-launch, and only if we decide we want to ship Podium-style review-gating at all (ethically contested).
- **Starter kits we build ourselves** — superseded by third-party starter integration strategy.

This list matters because scope creep is the single biggest risk to this plan. When Joel or CC or PM wants to add something, the question is: "is this in the master plan, or is it a distraction?" If it's a distraction, it goes to BACKLOG.md and we keep moving.

---

## 17. Risks and What Could Go Wrong

Being honest about where the plan could break:

**Sinch fails the fast-registration promise.** If Phase 1 Experiment 3 (specifically 3a or 3b) shows Sinch approval taking 2+ weeks instead of 3 days, we have a positioning crisis. Mitigations: this is exactly why Phase 1 runs early; we learn this before committing engineering time; alternatives (Telnyx, SignalWire) exist and can be evaluated.

**`/src` sunset creates gaps we didn't anticipate.** Some capability in `/src` may turn out to be harder to rebuild cleanly than expected. Mitigation: discover this in a phase boundary, record it, adjust the affected phase rather than bulldoze through.

**AI integration claims don't hold up in real starter integrations.** Phase 9 could surface that AI tools still hallucinate or break the integration despite our best AGENTS.md. Mitigation: this is why Phase 9 is validation, not assumption. We fix based on findings; we don't ship claims we can't back up.

**Scope creep from Joel's enthusiasm or CC's helpfulness.** The biggest risk. Both parties tend to want to add "just one more thing." Mitigation: this plan is the counter. If it's not in here, it's not in scope.

**PM instructions or memory drift causes PM to lose context mid-build.** Already a known risk addressed by REPO_INDEX, PM_HANDOFF, session-start audit discipline. This plan adds another layer.

**One phase's demo passes but the underlying system has hidden bugs.** The demo moment isn't sufficient evidence alone. Mitigation: tests, code review, and the "push is gated by PM review" rule stay in force.

**Joel burns out.** Long plan, high discipline, one person on the non-technical side. Mitigation: explicit brevity in communication, clear step-by-step instructions, no forced pace. Phases can breathe.

---

## 18. How This Plan Gets Used

When PM and Joel start a chat, this is one of the documents PM reads first (along with REPO_INDEX and handoffs). The question "what are we working on right now?" has a clear answer: "we're in Phase N."

When a new idea surfaces in a conversation, the question is: "is this in Phase X, a new phase, or out of scope?" If it's out of scope, it goes to BACKLOG.md. If it fits an existing phase, we note it. If it demands a new phase, we amend this document.

When PM writes a CC prompt, the prompt references which phase and which subtask within the phase it addresses. CC's work stays scoped to that phase's deliverables.

At each phase boundary, PM updates this document: what happened in the phase, what changed in scope, what went into the BACKLOG, what the next phase looks like given what we learned.

This plan is a living document. It's not a contract; it's a compass. It should change when reality tells us it should. What it should not do is get ignored because it's inconvenient.

---

## 19. The First Move

Phase 0 starts now. Specifically:

1. Joel and PM agree on the `/src` sunset decision in the current chat. PM drafts it; Joel approves; CC records it as a new D-number in the next session.
2. PM writes a Phase 0 CC prompt covering the doc reconciliation work. CC executes, commits, PM reviews.
3. In parallel, PM writes Phase 1 Experiment 1 procedure (send one SMS via Sinch). Joel runs it. Results captured in a new `/experiments/sinch/experiments-log.md`.

Everything else waits its turn.

---

*End of master plan v1.4*
