# BUILD HANDOFF — Mar 4, 2026

## Where We Are

PRD_04 (Twilio Submission) is complete — 10 clean commits, build passes.

Between finishing PRD_04 and now, we ran two documentation cycles:

**Cycle 1 (Mar 3):** Major strategy redesign around dashboard-first experience. PRDs 05, 06, 07 rewritten. New docs added: PRD_01 Addendum, PRICING_MODEL, PRD_10 (Phase 2 placeholder), ONBOARDING_UX_DECISIONS_v2, UX Narrative.

**Cycle 2 (Mar 4):** Deep review round across all V4 additions. 8 new documents produced covering experience principles, mixed campaign mechanics, industry compliance posture, multi-project architecture, and two full gap analysis audits. All high-priority findings integrated into project files. Five core documents updated: CLAUDE.md, PRD_01, PRD_04, PRD_06, PRICING_MODEL. PRD_08 and PRD_09 updated with marketing consent schema, campaign-aware drift detection, multi-channel opt-out, and TCPA timing corrections.

Every project file is now consistent and ready for build.

---

## What's Built So Far

- [x] Project scaffolding (Next.js + Supabase + Stripe)
- [x] Database schema and migrations
- [x] Intake wizard — Screens 1, 1b, 2, 3
- [x] Stripe checkout integration
- [x] Template engine — all 9 use cases (including `exploring`), `MessageTemplate` interface, `getMessageTemplates()`, 5–8 base messages + 3–4 expansion messages per use case, `APPROVED_MESSAGE_TYPES`, `NOT_APPROVED_CONTENT`
- [x] Twilio submission pipeline — PRD_04 complete (state machine, subaccounts, brand registration, campaign submission, phone provisioning, OTP, polling, webhooks, rejection handling)
- [x] Compliance site generator — PRD_03 complete (4-page static HTML, Cloudflare Pages deployment, robots.txt, preview route)

---

## What's Next: The Build Order

1. **PRD_04 guardrail refactor (30 min, do first)** — Add `RegistrationContext` pattern, `resolveMessageContext()` stub, Phase 2 migration comments on `message_plans.project_id` and `api_keys.project_id` nullable columns. These are architectural guardrails for Phase 2 multi-project — add them now so the schema migration is clean later.

2. **PRD_06 dashboard (BIG BUILD)** — The main event. Use case selection, message plan builder, build spec generator, dual-path Quick Start, progressive disclosure across 6 lifecycle stages, registered dashboard with pending narrative and approval moment copy, three-tier message library. Feed CC `PRD_06_DASHBOARD.md` and `PRD_02_TEMPLATE_ENGINE.md` together.

3. **PRD_05 deliverables** — Build spec generator + post-registration `MESSAGING_SETUP.md` + `SMS_GUIDELINES.md`. Feeds directly from the dashboard plan builder output.

4. **PRD_01 intake wizard — dashboard path** — Pre-populated intake wizard when entered from dashboard (PRD_01_ADDENDUM_DASHBOARD_FLOW.md). Path 2 of the intake wizard uses dashboard data to pre-fill. This is the registration flow from the dashboard Go Live CTA.

5. **PRD_09 messaging proxy and sandbox API** — Proxy pipeline, sandbox infrastructure, API key management, compliance enforcement. This is when the product becomes end-to-end testable.

6. **PRD_08 compliance monitoring** — Async drift detection, alerts, preview endpoint. Depends on proxy being live.

7. **PRD_07 landing page** — Last, after product is working.

---

## How to Resume

Start a new chat in this project. Give it the system prompt (PM/architect role) and say:

> We're resuming the RelayKit build. PRD_04 and PRD_03 are complete. Read PROJECT_OVERVIEW.md first for full context, then let's start with the PRD_04 guardrail refactor before the main PRD_06 dashboard build.

---

## Critical Things the New Session Must Know

**PRD_06 is a full rewrite from any previous version.** Do not let CC build from memory or a previous spec. Feed it `PRD_06_DASHBOARD.md` explicitly. It now includes: pending state narrative copy for each stepper step, approval moment copy (exact wording required — do not let CC genericize it), rejection card debrief spec, full email templates with vocabulary-compliant subject lines, three-tier message library structure, schema fixes (no UNIQUE on `customer_id`, nullable `project_id`).

**Experience Principles doc is mandatory before any copy.** `V4_-_RELAYKIT_EXPERIENCE_PRINCIPLES.md` must be read by CC before writing any user-facing string — CLAUDE.md now contains this instruction. Remind CC explicitly when starting any screen-building task.

**Campaign expansion ≠ upgrade.** TCR campaigns are static. Adding marketing capability after registration requires a second campaign, not modifying the existing one. Copy throughout the dashboard and intake wizard must say "additional campaign" not "upgrade." This is in CLAUDE.md Platform Constraints.

**Campaign review timing is 2–3 weeks.** Not 5–7 days. Every pending state, email, and marketing surface uses "typically 2–3 weeks." This is in CLAUDE.md Platform Constraints.

**Multi-project V1 guardrails.** Add nullable `project_id UUID` columns to `message_plans` and `api_keys` at creation time with a comment: "Phase 2: multi-project. Will become NOT NULL after migration." Do NOT build project-switching UI or `/dashboard/[projectId]/` URL structure in V1.

**Two paths through the intake wizard.** Path 1 = fresh from landing page (all fields empty). Path 2 = from dashboard Go Live CTA (use case + messages pre-populated from plan builder). PRD_01_ADDENDUM_DASHBOARD_FLOW.md defines Path 2. These share the same wizard screens; state management and data contracts are different.

**Canon messages are on the registrations table** as a JSONB column. Finalized at registration from the developer's curated plan builder selections. Drift detection measures production messages against canon messages, not build spec drafts.

**Phase 2 items are clearly labeled.** Don't build: BYO Twilio tier, platform tier (PRD_10), multi-project dashboard (PRD_11), or anything marked "Phase 2" in any PRD.
