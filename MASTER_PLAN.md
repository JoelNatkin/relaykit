# RelayKit Master Plan

> **Purpose:** Vision and roadmap for RelayKit — North Star, what we're building, ranked customer values, working principles, phase list, active focus, out-of-scope at launch. 1-2 screens. Joel and PM edit; CC reads only.
>
> Not for: decision rationale (DECISIONS), screen-level UI (PROTOTYPE_SPEC), customer-experience descriptions (PRODUCT_SUMMARY), session progress (CC_HANDOFF), detailed phase deliverables (those land in CC session prompts when entering each phase).

---

## North Star

RelayKit exists so that an independent developer building an application that needs to send SMS can add it cleanly, compliantly, and confidently, without becoming an expert in carrier regulation. The developer's AI coding tool should be able to read our documentation and produce a working integration step by step, without hallucinations or shortcuts. The developer should be able to test real text messages to their own phone before committing any money, register their business for live messaging for $49 and have it approved within days (not weeks), and never have to read a paragraph about 10DLC or carrier rules in our product. When something goes wrong, the product tells them plainly what happened and what to do. When something is working, the product is quiet and gets out of the way. Pricing is stated as facts on every surface, with no dark patterns.

That is the whole thesis. Every phase serves it. If a phase stops serving it, we stop that phase.

## Launch focus

The North Star is RelayKit's eventual purpose — serving any independent developer who needs SMS. Launch is the live, integrated product: a developer clones a supported starter kit, integrates RelayKit end to end, and goes from clone to paid live texts. Launch ships on a curated set of starter kits rather than a single one — triangulating the most common kits so the product is proven against more than one codebase shape (count and identity TBD; see golden-path GTM work). All nine message categories are live; the corpus is complete and is not a launch variable. Neither verification nor marketing is RelayKit's identity — both are fully offered, each may have its own landing page, but the brand sits above them as the layer that lets builders add SMS (D-416, D-417). Distribution leans on embedding RelayKit into existing successful starter kits rather than building our own — the Resend playbook.

## Customer values, ranked

1. **Fast registration** — Sinch's ~3 day approval vs. Twilio's weeks. The single biggest differentiator.
2. **AI tool integrates correctly** — incremental Explore → Plan → Code → Verify workflow with AGENTS.md, cursor rules, per-builder guides.
3. **Honest pricing, stated plainly** — $49 registration, $19/mo, 500 messages included, $8 per 500 overage, full refund if rejected. No fine print.
4. **Compliant by default** — developer never thinks about 10DLC, opt-out handling, or consent ledgers. Messages that can't comply can't be sent.
5. **Free to prove it works** — sandbox with real text messages to verified phones. No credit card, no time limit. Pay only when going live.
6. **One layer for everything SMS** — transactional sends, verification codes, marketing campaigns, review requests, inbound replies, all through the same SDK and dashboard.
7. **Quiet product, no jargon** — Voice & Product Principles v2.0. Words as last resort.

## Working principles

1. **Prove, build, finish.** Experiments before assumptions. Finish each phase before starting the next. Accept real elapsed time in exchange for reliable outcomes. No corner-cutting.
2. **Roles.** PM is the architect, CC is the builder, Joel is PM's hands and the decision-maker.
3. **Voice principles are non-negotiable.** Every user-facing surface runs through Voice & Product Principles v2.0.
4. **Pricing is transparent on every surface.** No fine print, no dark patterns.
5. **Build for the future shape.** Intake, templates, compliance constraints, and customer config are structured as queryable data from day one — so the future AI-driven configuration layer has clean material to work with.
6. **Two-layer security by default.** Customer's app defends what reaches RelayKit's API (Layer A, via AGENTS.md integration guidance). RelayKit's pipeline defends what reaches Sinch (Layer B — country allow-list, rate limits, premium-prefix block). Neither layer alone is sufficient. A structural advantage of integration-driven SDKs that usage-based incumbents can't match. Details in SECURITY_DRAFT.md.

## What "phase" means

Phases are sequenced chunks of work that move RelayKit toward launch. Each has an ordered number and ends with something demonstrably working before the next begins.

## Pre-launch checklist (complete)

Phase 1 (Sinch Proving Ground) is the active phase by the numbered sequence below. A short pre-launch checklist sat in front of it as gating work; all five items are now done:

1. **Blog infrastructure + first post** — shipped (in-repo MDX scaffold per D-387/D-388 + first published post).
2. **Live-site tweaks** — marketing-site polish complete.
3. **Configurator message refinement** — done (corpus authored across all 9 categories Sessions 91–103).
4. **Configurator authoring layer** — `categoryValues` state, Variables forms, char-warning, reset affordances. Shipped Session 106 (D-414/D-415); fast-follows (double-click variable → focused Variables form; live chip refresh via React context) shipped Session 107.
5. **First Indie Hackers post** — live on Indie Hackers.

The Phase 1 downstream experiments (2b inbound MO, 3c brand upgrade, 4 STOP/START/HELP) and the Phase 2 Session B kickoff are no longer gated. This section is retained as historical record of what sequenced in front of Phase 1 experiment pickup; it does not renumber the phase list below.

## The phases

1. **Phase 0 — Doc reconciliation + architectural decisions.** Clean up docs, record `/src` sunset, align ground truth before building.
2. **Phase 1 — Sinch proving ground.** Experiments confirming Sinch's registration timing and webhook behavior.
3. **Phase 2 — Session B (Sinch outbound delivery).** Build the "actually send a text" step in `/api` against proven Sinch behavior, with delivery-report callbacks.
4. **Phase 3 — Database reconciliation.** Single clean schema on `/api/supabase`. Archive `/src`-era migrations.
5. **Phase 4 — Inbound message handling.** Sinch webhook receiver for MO payloads, STOP/START/HELP, developer webhook forwarding.
6. **Phase 5 — Registration pipeline on Sinch.** Brand + campaign submissions (transactional, plus EIN-gated marketing when applicable) via Sinch APIs. Fast-registration promise verified end-to-end. `msgverified.com` opt-in form per customer.
7. **Phase 6 — Vertical hydration + verification-as-feature.** Wizard-to-workspace handoff for every vertical. OTP as universal SDK primitive (sendCode/checkCode) with server-side validation.
8. **Phase 7 — `/api` deployment.** Staging then production at `api.relaykit.ai`.
9. **Phase 8 — SDK publication + AI integration artifacts.** Publish `relaykit` to npm. Ship AGENTS.md, cursor rules, README, per-builder guides.
10. **Phase 9 — Starter kit integration validation.** Integrate RelayKit into popular starters (KolbySisk, Vercel/Supabase). Prove the workflow.
11. **Phase 10 — Launch readiness.** Two-way dashboard, email integration, compliance site, final polish.

Phase 0 + Phase 1 ran in parallel (Phase 0 was doc work, Phase 1 was elapsed-time-bound waiting for Sinch approvals). Phases 2 onward are sequential.

## Active focus

**Phase 2 — Session B (Sinch outbound delivery).** Phase 1 (Sinch Proving Ground) complete as of 2026-05-24 — all experiments (1 / 1b / 2a / 3a / 3b cycle / 2b / 3c / 4) closed with fixtures and findings captured. Session B builds the `/api` outbound send path against the proven Sinch behavior, including delivery-report callback handling. Phase 1's open items (four cumulative API/dashboard inconsistencies for BDR, webhook signature-verification design, MO→outbound correlation architectural choice, and the consent-ledger commitment scoped to Phase 4) carry forward as Session B kickoff inputs.

## Out of scope at launch

Naming these explicitly so they don't drift in:

- Full two-way inbox product (basic viewer at launch)
- Multi-project support (single-project at launch)
- BYO Twilio/Sinch (managed-only)
- Platform tier (post-launch)
- Drip sequences / multi-message workflows
- MMS / media attachments
- RCS, WhatsApp
- Link tracking / branded short links
- Compliance audit log export
- Review request sentiment branching
- Starter kits we build ourselves (superseded by third-party integration)
- AI-driven configuration layer (6–12 months post-launch, possibly its own phase)
- Automated anomaly detection (manual monitoring bridge for first 50 customers)
- Claude AI support slideout / App Doctor

Scope creep is the single biggest risk to this plan. When a new idea surfaces, the question is: is it in the plan, or is it a distraction? If it's a distraction, it goes to BACKLOG.

---

*End of MASTER_PLAN.md*
