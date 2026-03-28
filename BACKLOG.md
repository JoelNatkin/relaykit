# BACKLOG.md — RelayKit
## Ideas, Deferred Work, and Future Features
### Last updated: March 28, 2026

> **How this file works:**
> - This is a parking lot, not a commitment list. Nothing here is scheduled.
> - Items move to DECISIONS.md when they become real decisions with implementation implications.
> - CC does not build anything from this file unless Joel explicitly promotes an item.
> - Joel adds items freely during browser chats. CC can suggest additions. PM reviews periodically.
> - Format: brief description + origin (where the idea came from) + any relevant decision references.

---

## Likely — Will probably happen, timing TBD

### Product Features

- **Rejected state registration data display** — Expand "What was submitted" fields based on carrier error code mapping. Currently shows business name, EIN (masked), address, use case. May need website URL, business description, etc. (Origin: Settings PRD session, March 22–23)

- **Privacy/legal compliance baseline** — Privacy policy, ToS, cookie consent, GDPR/CCPA/state law data practice disclosures. Required before beta. (Origin: Settings session, March 22)

- **Developer tools on Messages tab** — Sandbox phone display and "Send test message" action. Moved from Settings (D-203). (Origin: Settings session, March 22)

- **Account-level settings page** — Email, personal phone (with re-verification), payment method (Stripe Customer Portal), notification preferences, danger zone (delete account). Needed for multi-project. (Origin: Settings PRD, March 23)

- **High-volume pricing tier (5,000+/mo)** — Special pricing not yet defined. Billing section needs update when locked. (Origin: Settings session, March 22)

- **Message composer UI** — Dashboard tool for drafting/testing messages in-app. Joel has ideas, explicitly deferred. Revisit after beta feedback reveals whether AI tool + SMS_GUIDELINES.md is sufficient or developers want an in-app authoring surface. (Origin: multiple sessions, explicitly deferred)

- **Sandbox behavior analysis** — PRD_08 compliance checking running in sandbox, non-blocking, clearable warnings. Validates developer's messages against their registered use case before they go live. (Origin: D-158, prototype planning)

- **"Can I send this?" message explorer** — Input a message, get instant compliance verdict. Wraps the preview endpoint. Phase 2 feature in PRD_06 Section 12. (Origin: PRD_06 v3, Phase 2 list)

- **Dashboard AI co-pilot** — Chat icon in lower corner, SMS compliance advisor that knows the developer's registration. Phase 2/3 feature. (Origin: ONBOARDING_UX_DECISIONS_v2 Section 16)

- **Unspent capacity nudge** — "Your registration also covers [message types you haven't used yet]." Tier 2 discovery. (Origin: D-35, PRD_06 Section 12)

- **BYO Twilio tier (Model 2)** — $199 one-time, registration submitted to customer's own Twilio account. No proxy, no monitoring. Entry point to full RelayKit. (Origin: D-26, PRICING_MODEL Section 3, D-43 Phase 2)

- **Marketing campaign registration flow** — "Start marketing registration" action on Messages tab (Approved state). Short form/modal reusing existing registration data, price change $19→$29/mo, second campaign submission, compliance site update. Includes updating the marketing messages section copy per lifecycle state (pre-reg vs. approved). Permanent affordance location TBD. (Origin: March 19 session, marketing section discussion)

- **Messages tab lifecycle state differentiation** — Approved state: personalization fields become read-only with registered values, no "registered" badges on individual messages (D-159). Pending/Changes Requested/Rejected states need their own Messages tab rendering. (Origin: PM_HANDOFF, March 19 planning)

- **SMS_GUIDELINES.md opt-in section** — Comprehensive opt-in requirements for the AI tool: consent language patterns, disclosure elements, required links, frequency disclosure, and explicit instructions to generate a compliant form component in the developer's framework. Critical for the "RelayKit keeps yours current" promise on the opt-in form preview. (Origin: March 19 session, opt-in form redesign)

- **A2P 10DLC vetting API error codes** — New error codes launching March 23, 2026. Review for actionable improvements to PRD_04 rejection handling and developer-facing error messaging. May improve the debrief experience (D-21). (Origin: March 19 session, Joel note)

- **Operations documentation** — How the app functions end-to-end so it can be handed off and managed. Reference: https://claude.ai/share/d121e93d-569b-419a-b906-8bdf99767dad (Origin: March 19 session, Joel note)

- **Compliance site logo** — Current compliance site uses a fake logo placeholder. Replace with text-based branding (business name styled as logo). Simple, no design dependency. Reference: https://claude.ai/share/3ac13015-ad7e-4534-ab80-9a110d89d2fc (Origin: March 19 session, Joel note)

- **Stripe out of sandbox mode** — Switch Stripe from test mode to live before beta. Coordinate with dev/prod environment split. (Origin: March 19 session, Joel note)

- **Second campaign registration flow** — UI and pipeline for adding a marketing campaign to an existing subaccount. Triggered from dashboard. (Origin: D-15, D-37, D-89, PRD_04 TODO-P2-02)

- **Multi-project dashboard (PRD_11)** — Multiple apps per account, project switcher, per-project billing. Schema guardrails already in place (D-11). (Origin: PRD_11, D-43)

- **Platform/multi-tenant tier (PRD_10)** — SaaS platforms register on behalf of their customers. Six architectural guardrails identified. (Origin: PRD_10, D-43)

- **Advanced rate limiting with queue mode** — Instead of rejecting rate-limited messages, queue and drip-send. (Origin: D-43 Phase 2 list)

- **EIN 5-brand limit detection** — Track `registration_count_by_ein`, block 6th submission. (Origin: D-23, PRD_04 TODO-P2-03)

- **Authentication+ 2.0 expansion** — Extend brand auth verification to all brand types. (Origin: D-25, PRD_04 TODO-P2-04)

- **Brand re-use for second projects** — Same brand, different campaign, skip brand registration. (Origin: PRD_04 TODO-P2-01)

- **Toll-free number path** — Alternative to 10DLC for certain use cases. (Origin: D-43 Phase 2 list)

- **UX simplicity audit / "naive eyes" pass** — Fresh CC session, no project context. Screenshots or live prototype only. Instructions: be ruthlessly honest about information density, jargon, unnecessary complexity. Evaluate every page against "would a developer who just wants to add SMS feel overwhelmed?" Consider A/B testing current vs simplified version. (Origin: March 27 bike ride conversation, D-262)

- **FAQ sections on key pages** — Move inline explanations to FAQ sections. Main content becomes confident claims. FAQ catches edge cases and "how does it work" questions. Applies to: marketing modal, category landing, home page, compliance page. (Origin: March 27 conversation, D-263)

- **Marketing page copy pass for "two files" removal** — Update all marketing pages to remove references to "two files" per D-257. Replace with outcome-focused language. Affects: home page hero, category landing, messages page hero, How it Works modal. (Origin: D-257, March 27 session)

- **Category landing "What's included" vocabulary update** — The "Need marketing messages too?" section on category landing uses "campaign" and "promotional" language. Update per D-254. Also update "Sole proprietor registrations are limited to one campaign." (Origin: March 27 session)

- **Marketing message style pills on category landing** — Add marketing message style pill treatment (Brand-first / Action-first / Context-first) alongside existing transactional messages on category landing page. Shows marketing messages as cross-sell surface in pre-signup flow. (Origin: March 27 session)

- **Build spec empirical testing program** — Write a real build spec by hand for appointments use case. Test with Claude Code, Cursor, Windsurf, Copilot, Cline against a fresh project. Record what works, what breaks, what questions the AI asks. Then test with 5-8 real developers at different skill levels. Then test across frameworks (Next.js, Flask, React Native, Node). Highest-priority validation activity. (Origin: March 27 conversation, D-260)

- **Sandbox API (mock mode)** — Build a sandbox API endpoint that accepts message requests, validates format, returns mock responses. No carrier integration needed. Enables build spec testing immediately. (Origin: March 27 conversation, D-261)

### Infrastructure & Operations

- **Sinch migration implementation** — Sinch confirmed (D-215). Create PRD_04-equivalent mapping doc: each Twilio module mapped to Sinch API equivalent. Registration API (brand + campaign), SMS API (send/receive), number provisioning, webhook handlers, credential model. Estimated 2–3 CC sessions. (Origin: March 22 brainstorming, D-199, confirmed D-215)

- **Dev/prod environment split** — Half-day config task. Separate Supabase projects, Stripe test/live keys, Twilio sandbox/production. Deferred until approaching beta. (Origin: BUILD_HANDOFF.md, multiple sessions)

- **Redis cache layer for proxy** — Read-through cache for opt-out lookups, daily limits, API key auth. Not needed at Phase 1 volumes. (Origin: D-52)

- **Migrate pre-reg API key auth from listUsers() scan** — Current O(n) scan (D-55) needs optimization before scale. Options: key hash lookup table, or migrate sandbox keys to api_keys table at generation time. (Origin: D-55)

- **Testing strategy** — Unit tests for template engine, integration tests for Twilio pipeline, E2E for critical flows. Not yet designed. (Origin: general)

- **Autonomous build experiment** — Small self-contained project (no SMS) on secondary Mac to validate agentic pipeline end-to-end. (Origin: browser chat planning)

### Content & Marketing

- **Message reference page as lead magnet** — Pick use case, get full message reference with copyable blocks and opt-in language, no signup required. Content from PRD_02 template engine. Decision pending: fully public vs. gated. (Origin: PM_HANDOFF memory, multiple sessions)

- **Beta user recruitment plan** — 5–8 testers, indie developers/small SaaS founders. Channels: Reddit, Hacker News, Twitter/X, Indie Hackers, AI-tool Discords. (Origin: memory, planning sessions)

- **Landing page SEO keywords** — AI SMS integration, 10DLC registration service, SMS compliance for developers. PRD_07 has initial list. (Origin: PRD_07)

- **Live TCR registration smoke test** — Manually seed Supabase records, trigger PRD_04 state machine directly, bypass intake UI. Validates template engine produces TCR-approved campaigns. ~$50 for 2–3 runs. (Origin: planning sessions)

### Legal & Compliance

- **Platform ToS and AUP** — Beta blocker. Prohibited use categories, suspension rights, inline blocking rights. (Origin: D-51)

- **Three-tier industry gating** — Tier 1 advisory (legal, financial, restaurants), Tier 2 hard decline with waitlist (healthcare), Tier 3 hard decline no waitlist (cannabis, firearms). (Origin: D-49)

---

- **How it works modal V2 — full marketing page render** — Current V1 renders summary content (What You Get cards, pricing, FAQ). V2 could render the full marketing category page component inside the modal for richer context. Deferred — V1 is sufficient for beta. (Origin: March 23 session, D-218)

- **Playbook per-category expansion** — Add PLAYBOOK_FLOWS entries for verification, orders, support, and other categories. Currently only appointments is populated. Structure is ready (keyed by category slug). (Origin: March 23 session, D-217)

- **Post-download playbook variant** — On public Messages page, after download, the playbook section could expand to show the full prompt, prerequisites checklist ("Your app needs: a way to store appointments..."), and a copy button. Deferred as separate task. (Origin: March 23 brainstorming)

## Message Management (Deferred)

- **Full message library editor** — The proxy classifies every message by type. Architecturally feasible to surface all message types in a browsable library with editing. Deliberately deferred: creates two sources of truth (code vs dashboard), becomes a crutch, customer has to keep app and dashboard in sync. Only build if beta users explicitly request it and the two-source-of-truth problem has a clean solution. (Origin: D-240 discussion, March 25)

- **Marketing persona as dashboard user** — Developer builds the integration, marketing person edits message copy in the dashboard without touching code. Natural evolution of D-240 but not beta scope. Risk: slides toward Mailchimp territory (automations, audience management, campaign scheduling). The line is: RelayKit manages delivery and compliance, customer manages content. Everything beyond that is out of scope. (Origin: D-240 discussion, March 25)

---

## Maybe — Interesting ideas, not yet validated

- **Embeddable opt-in form (revisitable)** — Script tag or iframe that renders a branded opt-in form hosted by RelayKit. Rejected in favor of D-256 (AI-tool-built native forms) but could be a "zero effort" tier for developers who truly don't want to touch their code. (Origin: March 27 brainstorming)

- **Consent API as competitive differentiator on marketing pages** — "RelayKit handles opt-in and opt-out" as headline claim. Consent audit logging (D-255) is a strong story: timestamped, 4-year retention, legally defensible. Could be a section on home page or compliance page. (Origin: March 27 conversation)

- **Build spec as a new product category** — The pattern of "files written for AI tools to execute" may be a new class of developer tool — distinct from SDKs, starter kits, or documentation. Worth articulating as positioning if the pattern proves effective. Not actionable until build spec testing validates it works. (Origin: March 27 conceptual discussion)

- **Two-tab marketing page** — Tab 1 = marketing pitch, Tab 2 = use case content. Dropped in favor of the playbook summary section + How it works modal which solves the same problem without adding tabs. May revisit if user testing reveals context gaps. (Origin: March 23 brainstorming, explicitly dropped)

- **Variant-aware AI prompts** — Different per-card AI prompt suggestions based on Brand-first/Action-first/Context-first selection. Potentially overkill — prompts should focus on what the message does, not how it's styled. (Origin: March 19 session)

- **Opt-in form structured copy** — If developers struggle with the AI-tool-reads-guidelines approach, revisit making the opt-in form copyable as structured requirements (not HTML) that the AI tool can build from. (Origin: March 19 session)

- **Idea generator lead magnet** — Marketing site page sharing app ideas that use messaging. Conversion path: inspiration → category selection → Messages page → download. Reference: https://claude.ai/share/7aeffdcb-ee0e-4de5-b141-9559f1d4f96c (Origin: March 19 session, Joel note)

- **Blog on marketing site** — Lightweight blog, maybe just linked from footer. Primary purpose is SEO, not content marketing. (Origin: March 19 session, Joel note)

- **Design a logo** — RelayKit brand logo. Not blocking anything currently — "RelayKit" text treatment works for now. (Origin: March 19 session, Joel note)

- **Add animation to pages** — Page transitions, micro-interactions, scroll animations. Note: Framer Motion was previously removed due to hydration failures in prototype. Revisit approach. (Origin: March 19 session, Joel note)

- **Post-registration message customization** — Let developers tweak message wording after registration without re-registering. Tricky because canon messages are immutable (D-13). Could work for non-canon messages only. Schema supports it (D-103 preserved `edited_text` field). (Origin: D-103 discussion)

- **CSV export from dashboard** — Download delivery data, recipient lists, compliance logs. (Origin: D-150 Phase 2 list)

- **API health monitoring card** — Uptime, latency, error rates for the developer's integration. (Origin: D-150 Phase 2 list)

- **Usage forecasting** — Predict when developer will exceed their message block. (Origin: D-150 Phase 2 list)

- **Delivery drill-down** — Per-message delivery analytics (delivered, failed, pending by message type). (Origin: D-150 Phase 2 list)

- **Period comparisons** — This month vs. last month overlays on dashboard charts. (Origin: D-150 Phase 2 list)

- **Opt-out analysis** — Trends in opt-out rates, by message type, with suggestions. (Origin: D-150 Phase 2 list)

- **Use-case-specific dashboard cards** — Appointment-specific metrics (show rate after reminder), verification-specific (code entry success rate). (Origin: D-150 Phase 2 list)

- **Real-time dashboard updates** — Supabase Realtime subscriptions for live delivery and usage data. (Origin: PRD_06 Section 15)

- **Webhook delivery analytics** — Success/failure/retry rates for developer's inbound webhook endpoint. (Origin: general)

- **Self-serve compliance site customization** — Let developers modify compliance site colors, logo, and domain. Currently RelayKit-controlled. (Origin: general)

- **In-app onboarding tour** — Guided walkthrough for first-time dashboard visitors. Could be overkill if the progressive disclosure works. (Origin: general)

- **Referral program** — Developer refers developer, both get credits. (Origin: general)

- **Annual billing discount** — Standard SaaS pattern. Not relevant at beta scale. (Origin: general)

- **White-label compliance sites** — Customer's own domain, their branding. Premium feature? (Origin: general)

- **Message scheduling** — "Send this at 9 AM recipient local time." Currently developers handle their own scheduling. (Origin: general)

- **A/B testing for messages** — Send variant A to half, variant B to half, measure response rates. Far future. (Origin: general)

---

## Rejected — Considered and explicitly declined

| Idea | Why rejected | Decision ref |
|------|-------------|-------------|
| Twilio SDK dependency | Version lock, edge runtime incompatibility | D-02 |
| Password-based auth | Unnecessary complexity, magic link/OTP sufficient | D-03 |
| AI-generated compliance artifacts | Non-deterministic output, carrier rejection risk | D-04 |
| Shared Twilio account across customers | ISV trust score contamination | D-01 |
| Direct-to-Twilio delivery (no proxy) | Can't enforce compliance pre-send | D-06 |
| Paid compliance tier | ISV liability without visibility | D-19, D-29 |
| Healthcare/HIPAA support | No BAA, no PHI routing capability | D-18 |
| MIXED campaign on initial registration | Muddied story for TCR reviewers | D-89 |
| MIXED campaign type (any use) | Never used — not at intake, not as expansion. Marketing is always a second MARKETING campaign. | D-245, D-251 |
| In-app message composer v1 | AI tools + SMS_GUIDELINES.md is the authoring layer | D-79 |
| Plan builder / message curation UI | Category selection is sufficient for scope | D-85 |
| Model 3 BYO Twilio (subaccount + direct creds) | Unmonitorable ISV risk | D-26 |
