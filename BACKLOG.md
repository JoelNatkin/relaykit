# BACKLOG.md — RelayKit
## Ideas, Deferred Work, and Future Features
### Last updated: May 9, 2026

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

- **Marketing campaign registration flow** — "Start marketing registration" action on Messages tab (Approved state). Short form/modal reusing existing registration data, price change $19→$29/mo, second campaign submission, compliance site update. Includes updating the marketing messages section copy per lifecycle state (pre-reg vs. approved). Permanent affordance location TBD. (Origin: March 19 session, marketing section discussion) (D-304/D-305: also applies in reverse — marketing-only developer adding transactional)

- **Messages tab lifecycle state differentiation** — Approved state: personalization fields become read-only with registered values, no "registered" badges on individual messages (D-159). Pending/Changes Requested/Rejected states need their own Messages tab rendering. (Origin: PM_HANDOFF, March 19 planning)

- **SMS_GUIDELINES.md opt-in section** — Comprehensive opt-in requirements for the AI tool: consent language patterns, disclosure elements, required links, frequency disclosure, and explicit instructions to generate a compliant form component in the developer's framework. Critical for the "RelayKit keeps yours current" promise on the opt-in form preview. (Origin: March 19 session, opt-in form redesign)

- **A2P 10DLC vetting API error codes** — New error codes launching March 23, 2026. Review for actionable improvements to PRD_04 rejection handling and developer-facing error messaging. May improve the debrief experience (D-21). (Origin: March 19 session, Joel note)

- **Operations documentation** — How the app functions end-to-end so it can be handed off and managed. Reference: https://claude.ai/share/d121e93d-569b-419a-b906-8bdf99767dad (Origin: March 19 session, Joel note)

- **Compliance site logo** — Current compliance site uses a fake logo placeholder. Replace with text-based branding (business name styled as logo). Simple, no design dependency. Reference: https://claude.ai/share/3ac13015-ad7e-4534-ab80-9a110d89d2fc (Origin: March 19 session, Joel note)

- **Stripe out of sandbox mode** — Switch Stripe from test mode to live before beta. Coordinate with dev/prod environment split. (Origin: March 19 session, Joel note)

- **Second campaign registration flow** — UI and pipeline for adding a marketing campaign to an existing subaccount. Triggered from dashboard. (Origin: D-15, D-37, D-89, PRD_04 TODO-P2-02)

- **Multi-project dashboard (PRD_11)** — Multiple apps per account, project switcher, per-project billing. Schema guardrails already in place (D-11). (Origin: PRD_11, D-43)

- **Platform/multi-tenant tier (PRD_10)** — SaaS platforms register on behalf of their customers. Six architectural guardrails identified. (Origin: PRD_10, D-43)

- Moved to DECISIONS.md as D-346 — rate limiting is a launch requirement.

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

- **Sandbox API endpoint** — API endpoint exists and works. POST /v1/messages returns real msg_ IDs, validates templates across 30 templates in 8 namespaces, interpolates variables. Carrier send is a console.log stub until Sinch account confirms. Not mock mode — this is the real API with a carrier stub. (Origin: March 27 conversation, D-261, updated April 3)

- **Website intake interview per vertical** — Business context questions (business name, appointment types, booking lead time, cancellation policy, etc.) asked on the website before message customization. Powered by Claude on the backend (~20% of interactions, 80% deterministic branching logic). Answers personalize message templates and feed into the contextualized spec file delivered via `npx relaykit init`. Per-vertical question sets needed for each category. (Origin: April 3 noodling session, D-300)

- **EIN verification and business identity pre-validation** — When developer enters EIN (for marketing access or registration), look up and auto-populate legal business name, address, entity type, state of registration. Investigate data sources: IRS Business Master File, state SOS databases, Middesk, Enigma (~$1-3/lookup). ROI: $15 saved per prevented TCR rejection + ISV trust score protection. (Origin: April 3 noodling session, D-302, D-303)

- **Message editing UX: curated messages with locked variables** — Default curated set per vertical displayed on website. Individual messages show pill variants (tone/style). Click to edit opens inline editor with live compliance checking and AI fix button. Variables are locked per curated message type — editing changes copy only, never the data contract with the SDK. Custom messages (D-280) define their own variable schema. (Origin: April 3 noodling session, D-301)

- **App Doctor — AI support with round-trip diagnostics** — Claude support slideout acts as a specialist that can order tests. Core loop: developer reports issue → Claude generates a diagnostic prompt for the developer's AI tool → developer pastes results back → Claude pinpoints issue and generates fix. Per-message "Ask Claude" entry point pre-loads context (message definition, last test result, delivery status). SDK error design constraint: all error responses must be structured (status, error code, human-readable message, context hint) for clean diagnostic loop. (Origin: Session 25 design discussion)

- **Returning user onboarding (new project from Your Apps)** — When a developer with an existing account creates a new project, the wizard should pre-fill business name from account, auto-populate EIN if on file (confirmation card, no re-verification), and skip phone verify and signup/email verify entirely. The business name page for returning users needs its own design — the EIN section behaves differently. (Origin: Session 25 design discussion)

- **Confirm Anthropic brand usage for Claude references** — Can we reference Claude by name in the support panel UI and marketing copy? ("Ask Claude", "Claude helps you build, test, and troubleshoot"). Check Anthropic API terms of service. If yes, update ready page benefit #3 and marketing copy to name Claude explicitly. (Origin: Session 25 strategy discussion)

- **TCR CSP registration** — Register as Campaign Service Provider directly with TCR. $200 fee, 3-5 week approval. Decouples campaign registration from message delivery carrier. RelayKit owns brand/campaign registrations; carriers compete purely on delivery. Application at csp.campaignregistry.com. (Origin: Session 25 carrier strategy discussion)

- **Customer brand registration path tiering — Simplified vs Full + margin implication** — Sinch offers two registration tiers for EIN-bearing entities: Simplified (~60s approval observed in Experiment 3, $6 cost via dashboard or $10 cost via API per discrepancy in TBD note, capped at 3 numbers / lower throughput / no marketing) and Full ($50, 5-10 days vetting, unlimited campaigns/numbers, vetting score). Tiering decision is now also a margin decision: $49 customer registration fee leaves $13-28 margin on Simplified path but produces a $16-31 loss on Full path. Three product responses possible: (a) Simplified-by-default with route-to-Full when constraints bind (preserves $49 flat); (b) tiered fee structure ($49 / $99); (c) raise base fee to cover worst case. Design questions for Phase 5: routing logic by use case + projected volume + entity type, upgrade UX when volume outgrows Simplified caps, communication of tiers without violating Tier 2 voice rules, time-to-first-message under each path. Experiment 3 brand-leg timing (~60s) makes the customer-value claim defensible for Simplified path; Full-path timing measurement deferred. (Origin: April 25 chat during Sinch brand registration for Experiment 3)

- **Sole Proprietor customer segment — Sinch 10DLC API does not support** — Sinch's brand registration API `brandEntityType` enum accepts exactly three values: PUBLIC, PRIVATE, CHARITY_NON_PROFIT. There is no SOLE_PROPRIETOR option, and the dashboard form requires an EIN for all entity types. This means a meaningful slice of RelayKit's stated ICP (no-EIN indie devs, vibe coders, hobbyists) cannot be onboarded through Sinch's 10DLC path. Four product responses for Phase 5 design: (a) cut Sole Prop from ICP — likely wrong call; (b) secondary carrier for Sole Prop only (Telnyx and Twilio both have working self-serve Sole Prop flows) with the operational complexity of two-carrier integration; (c) route no-EIN customers to Sinch's TFN (toll-free number) verification path, which has a separate API surface (`/v1/projects/{projectId}/tfnVerification`) and doesn't require 10DLC brand registration / EIN — single-carrier, slightly higher per-number cost (~$2/mo vs ~$1/mo); (d) RelayKit as direct TCR CSP — RelayKit registers with TCR directly ($200, 3-5 weeks approval per pre-launch plan) and exposes the full TCR entity-type set including Sole Proprietor, with delivery still via Sinch (or other DCA partners). Option (d) solves Sole Prop AND unlocks broader strategic flexibility (full registration stack ownership, margin control, multi-carrier delivery) but requires absorbing TCR-level operational complexity (registration failure handling, MNO coordination, customer support escalations that today are absorbed by Sinch). Decision sequencing: pick a near-term option (a/b/c) for launch; revisit (d) post-launch when customer volume + product-market fit warrant the infrastructure investment. Doing (d) pre-launch to solve Sole Prop alone is solving a high-priority customer-value question by introducing the highest-risk infrastructure change — wrong order of operations. Additionally worth confirming with Sinch BDR Elizabeth Garner whether Sole Prop is supported via support escalation as an interim option. (Origin: April 25 chat — confirmed via Sinch OpenAPI spec; option (d) added in PM follow-up after CC plan execution) Apr 30, 2026 update: Resubmission cycle (campaign 3b) confirmed Sinch's review process is operationally manual (named human reviewer, ~1.3 business day turnaround). This data point tightens the case against option (b) "secondary carrier for Sole Prop only" — operating two carrier integrations means operating two manual review queues and two sets of human-coordination overhead. Doesn't change the overall recommendation (defer to Phase 5 design) but informs the choice when it surfaces.

- **BYO existing TCR brand import** — Sinch's brand registration UI surfaces an "I already have a brand registration from TCR that I want to import" path. Per TCR's CSP documentation, brand registrations and vetting tokens are portable across CSPs (each CSP must register the brand with TCR, but vetting can be imported via token). Strong product reasons to support this: (1) friction kill — customers already on Twilio/Plivo/other CSPs don't redo the multi-week vetting cycle; (2) faster path to first message than even Simplified-from-scratch; (3) captures customers in motion — Twilio pricing increases, service issues, etc. create churn moments; (4) lower CAC for that cohort. Open questions for Phase 5 design: TCR transfer fee structure, customer UX (paste credentials from old CSP vs. Sinch fetch via TCR API given brand ID), preservation of existing vetting score, carrier-side cutover delays. (Origin: April 25 chat during Sinch brand registration setup)

- **T-Mobile $250 non-use fee — design space for dormant customer campaigns** — T-Mobile assesses a $250 pass-through fee on any 10DLC campaign that goes inactive for a rolling 60-day window; public sources disagree on whether the trigger is "no number attached" or "no number AND no T-Mobile traffic," so conservative read assumes both must hold to avoid the fee. RelayKit policy is that the subscriber decides when to cancel — cutting customers off to avoid carrier fees is not acceptable — so RelayKit absorbs the risk that a paying customer goes quiet for 60+ days. Cost asymmetry is roughly three orders of magnitude: $250/60 days per dormant campaign vs. ~$1/mo per attached number plus ~$0.01 per keepalive SMS sent every ~50 days. Phase 5 design options to evaluate: (a) synthetic keepalive — RelayKit attaches a number and silently sends one message every ~50 days from each dormant campaign to a RelayKit-owned T-Mobile handset, invisible to the customer, brittle if T-Mobile changes the trigger or detects synthetic patterns; (b) customer-aware paused tier — explicit lower-priced "paused" subscription the customer chooses, RelayKit handles keepalive on their behalf; (c) absorb into base price — build expected dormant rate into the $19/mo, do nothing operationally; (d) auto-pause with notice — at 45 days inactive email the customer with 15 days to act before pausing, framed as fee protection rather than cancellation. Current lean is a hybrid of (a) plus reframing as a marketed customer benefit ("we keep your registration warm even when you're not using it"), but not yet decided. Open questions for Phase 5: does Sinch pass the $250 through or absorb/mark up; what's the actual trigger (BDR question or experiment); what's RelayKit's expected dormant rate at 100/500/1000 customers; if (a) is chosen, what does the keepalive message say and does it itself get carrier-reviewed for content. (Origin: 2026-04-25 chat — follow-on to Experiment 3a research)

- **RelayKit vertical-to-Sinch-use-case mapping for customer campaign registration** — Captured in `docs/VERTICAL_TAXONOMY_DRAFT.md` (Session 68, 2026-05-01). Draft doc holds the TCR taxonomy primer (Standard vs Special split — 10 + 12 categories), the 8-verticals-plus-Higher-Ed mapping table to TCR categories, the four settled calls (Special categories out at launch / add Higher Education / Internal as RelayKit-curated LVM / LVM as deliberate product surface), the three directional pieces pending Phase 5 design (three-doors-vs-two-doors UX / AI-assisted LVM scope / Community vertical disposition), the implementation impact surface inventory, and the Phase 5 prerequisite gates checklist. Phase 5 design work reads the draft as a prerequisite, not a reference. (Origin: 2026-04-26 chat — surfaced during Experiment 3b campaign creation; expanded into draft doc at PM Session 68, 2026-05-01)

- **Customer registration form due for design round informed by Sinch dashboard reality** — The /apps/[appId]/register form (BusinessDetailsForm with Zod validation) was last meaningfully reviewed many sessions ago. Running 3a (brand) and 3b (campaign) directly through Sinch's dashboard surfaced field-by-field reality of what Sinch actually wants — including some fields RelayKit's current form doesn't capture and others that may be unnecessary. Per PRODUCT_SUMMARY §7 (registration submission), the form is confirmed to submit via Sinch API at production but field set, structure, and step decomposition are unknown vs Sinch's actual brand and campaign submission shapes. Phase 5 design task: walk Sinch's brand and campaign forms field-by-field, audit RelayKit's current intake + registration forms for coverage, decide what stays in onboarding wizard vs registration form, and decide what RelayKit auto-derives vs asks the customer. Should also incorporate carrier-form learnings around: privacy/terms URLs (msgverified per-customer site model), opt-in documentation URL, use case sub-categorization for LVM, embedded link/phone toggles, optional explanatory comments. (Origin: 2026-04-26 chat — surfaced during Experiment 3b)

- **AI URL scan for customer registration content + gotcha detection** — During onboarding, customer enters their website URL. RelayKit scans the site (homepage + linked T&C/privacy/opt-in URLs) and produces two outputs: (1) auto-drafted non-generic carrier registration copy — brand name, business description, business address, what the business does — matching the standard RelayKit wrote for its own 3b submission; (2) pre-submission gotcha list — placeholder/"Coming Soon" pages (CR2005), missing business address (CR2002), brand name mismatch with registered legal name (CR2020), broken or missing T&C/privacy links, opt-in URL not rendering (CR4015). Customer can fix gotchas and re-scan, or proceed and accept risk. Why this matters: customer-submitted registrations default to generic boilerplate, which carriers reject. RelayKit's own 3b rejection (2026-04-27) is the canonical test case — every CR code received would have been catchable by a pre-submission scan. Without this, customers hit the same wall, and the "fast carrier approval" value prop fails on first contact. Minimum viable: fetch homepage + linked policy/opt-in URLs, LLM extraction pass on rendered content, output editable auto-drafted registration description plus gotcha list with severity. Risks: sites that block scrapers (Cloudflare bot protection), single-page apps where content isn't in initial HTML, sites where address/brand are images not text, LLM hallucination on extracted content (mitigation: customer reviews/edits before submission). Why backlog and not launch: launch can ship with msgverified-hosted opt-in form solving the structural CR4015 issue, customers can manually write registration copy at launch (helped by examples and templates), AI scan is the productized version that scales — fast follow once customer registrations are flowing. (Origin: 2026-04-28 chat — surfaced post-3b rejection, paired with msgverified opt-in form launch-scope addition)

- **Process for keeping legal docs (Terms / Privacy / Acceptable Use) in sync with product reality** — Legal docs are binding customer agreements; they drift when product decisions land that change pricing, features, capabilities, or carrier infrastructure. Today there's no mechanism to catch this. Decisions, plan changes, and UI changes have processes (DECISIONS.md ledger, MASTER_PLAN versioning, PROTOTYPE_SPEC); legal docs don't. Surfaced 2026-04-28 during marketing-site session when Terms required ~17 edits to align with current product (Twilio→Sinch, $199→$49, "Mixed tier" removal, drift detection claims, compliance-site definitions, etc.) — every one of those was a product decision that should have triggered a Terms review at the time it landed, but didn't. Design goal: painless for Joel. Possible shapes: (a) checklist gate added to CC close-out — "did this session change anything that affects Terms / Privacy / AUP? if yes, flag for follow-up"; (b) tag system in DECISIONS.md — decisions that touch legal-doc-relevant surfaces get a [LEGAL] tag, surfaced at phase boundaries; (c) periodic legal-doc audit cadence (every N decisions or every phase boundary, whichever first) similar to the DECISIONS retirement sweep; (d) PM-level checklist before any binding-customer-doc-affecting commit. Whatever the shape, the trigger should be automatic-or-near-automatic from existing PM/CC discipline, not requiring Joel to remember a separate workflow. Companion artifact: docs/LEGAL_DOC_DEFERRED_CLAIMS.md (created same session) tracks claims removed from legal docs that should restore once features ship — that's the read-side of the same problem; this BACKLOG entry is the process for the write-side. (Origin: 2026-04-28 chat — surfaced during marketing-site Terms editorial pass)

- **RelayKit-as-sender SMS templates for production /start/verify flow** — D-365 commits the prototype to displaying carrier-defensible consent language at /start/verify, but the underlying SMS infrastructure is fully stubbed: no template, no string, no API call exists for the verification code SMS, and no template exists for the test messages the disclosure promises ("you can receive test messages at this number when you trigger them"). When the prototype ports to production in Phase 5+, RelayKit-as-sender SMS templates need to be authored to satisfy what the disclosure promised — a verification code SMS with RelayKit sender ID, code, and STOP keyword (carrier-standard pattern: "RelayKit: Your verification code is 847291. Reply STOP to opt out."), and the test-message templates that get triggered through the dashboard. Both are RelayKit's own messages, not developer-facing canon templates (which exist at prototype/lib/intake/templates.ts and prototype/data/messages.ts but serve a different purpose). These RelayKit-sender templates also need to be the sample messages declared in 3b's campaign registration. (Origin: 2026-04-26 chat — surfaced during D-365 implementation review)

- **PRD_SETTINGS_v2_3 rejection-behavior model — incorporate clone-edit-resubmit mechanic** — When Phase 5 design begins, update PRD_SETTINGS rejection-behavior section (§5) to incorporate Sinch's actual resubmission mechanic (clone, edit, resubmit; new Registration ID; rejected campaign retains terminal state). Currently a forward-looking gap, not active drift. Source: experiments/sinch/experiments-log.md Experiment 3b cycle entry. (Origin: Session 60 close-out surface item, 2026-04-30)

- **Sinch reseller designation — Phase 5 architecture decision** — Sinch's account model has two states: standard customer (current — RelayKit registers its own brand and campaigns) and reseller (RelayKit registers customer brands and campaigns on their behalf, billing flows Sinch → RelayKit → Customer). Reseller is required when RelayKit's product model activates: developer signs up, RelayKit handles their carrier registration. Reseller status involves contract review with Sinch, pricing reclassification implications (volume discounts + commitment levels), customer-campaign nesting architecture, possibly tax/regulatory paperwork, and changed carrier review patterns. Account currently set to "No" (non-reseller) — correct for the current state of registering RelayKit's own infrastructure. Coordinate the switch with Sinch BDR Elizabeth Garner during Phase 5 design. Do NOT change account status before then — switching mid-stream could disrupt approved campaigns. When the reseller transition is discussed with the Sinch BDR, also confirm Sinch ISV economics on multi-campaign per customer: whether reseller pricing is per-campaign or per-customer-account, what volume discounts apply across a customer's multiple campaigns, and how Sinch's costs scale when a single customer holds (e.g.) one LVM campaign + one Standard 2FA campaign + one Standard Marketing campaign. Tightly coupled to the multi-campaign pricing question (per separate BACKLOG entry on per-campaign-add-on vs all-included-tier pricing). Cross-reference: MASTER_PLAN v1.5 §18 open questions. (Origin: PM Session 62, 2026-05-01, surfaced when Sinch dashboard prompted reseller confirmation after campaign approval. Multi-campaign Sinch ISV economics question added 2026-05-03 in strategic repositioning integration.)

- **TESTING_GUIDE_DRAFT.md prototype validation** — Run `docs/TESTING_GUIDE_DRAFT.md` through Claude Code, Cursor, and Windsurf against a sample Next.js + Supabase app with a registered RelayKit account. For each tool: feed the guide as integration context, ask it to build the test/debug surface for the Appointments vertical (the recipe section), evaluate whether the generated surface meaningfully addresses the eight signals (1: code fired send / 2: RelayKit accepted / 3: carrier accepted / 4: handset received / 5: rendered text / 6: consent state / 7: reply handling / 8: flow advance). Iterate the draft based on findings — clarify sections that produce inconsistent or shallow output, cut sections AI tools ignore. **Success criterion:** at least one tool produces a surface a developer would actually find useful without modification. **Failure mode:** if all three tools produce surfaces that miss critical signals or require heavy hand-correction, the architectural posture in the next entry is wrong and the embedded-dashboard alternative needs reconsideration. Gates the architectural-posture and marketing-positioning entries below. (Origin: PM Session 67, draft capture from prior chat threads on developer test surfaces, 2026-05-01)

- **Test surface lives in developer's app, built by their AI coding tool from RelayKit-shipped guide** — RelayKit does not ship an embedded test dashboard for verifying the developer's integration. The expertise ships as `docs/TESTING_GUIDE_DRAFT.md` (parallels AGENTS.md), and the developer's AI coding tool (Claude Code, Cursor, Windsurf, Copilot, Cline) builds the test/debug surface inside the developer's app, using their components, schema, and styling. Rationale: only the developer's tool can see both halves of the loop (RelayKit-side via SDK return values + webhooks; developer-side via their database, business logic, and UI). RelayKit shipping a hosted dashboard would only see its own half and would misalign with the AI-tool-as-integrator thesis. Retires the embedded-dashboard direction explored in earlier chat threads (no canonical-doc references to retire — the idea never landed in DECISIONS or any spec). Promote to D-number when implementation activates in Phase 8 (SDK publication + AI integration artifacts), as a sub-deliverable alongside AGENTS.md and the published SDK. Gated on the prototype-validation entry above succeeding. (Origin: PM Session 67, 2026-05-01)

- **Test phone consent model — codify implicit consent via list membership; hard separation between test and production send paths** — Test phones added to a developer's Testers list (the Preview list / Testers card established by D-342; user-facing label is "Preview list" per PROTOTYPE_SPEC L366, internal code identifiers stay `tester`/`testRecipients`) are treated as having implicit consent for development/testing messages by virtue of (a) OTP verification at add time and (b) the developer asserting authority to send test traffic by adding the number to the test list. Test phones do not require the formal per-message-type consent records that production recipients require. **The implicit-consent semantics and the test/production send-path separation below are net-new architectural ground** — no current D-number directly covers either. D-342 establishes only the Testers card UI and the verified/invited status concept; it does not speak to consent semantics or pipeline separation. The send pipeline must enforce hard separation: production code paths cannot route to test phones, test code paths cannot route to production phones; crossover attempts return a clear error about test/production environment separation. Dashboard documents the consent posture inline on the Testers card so developers internalize that test consent is different from production consent. Promote to D-number when Phase 2 Session B (send pipeline) implementation activates, since recipient classification is exactly where the send pipeline architecture decides this. Verification needed before promotion: (a) confirm `/api` consent ledger schema can accommodate a recipient-class distinction without breaking changes (or surface that as implementation work); (b) re-confirm at promotion time that PRODUCT_SUMMARY / PROTOTYPE_SPEC haven't drifted into contradictory claims (Session 68 pre-record check confirmed they describe the Preview list mechanically without consent-semantics statements — no contradiction at this snapshot). Implementation surface when promoted: Testers card UI (consent disclosure copy), send pipeline (recipient classification), consent ledger (test recipient handling), test mode SDK behavior, dashboard documentation. (Origin: PM chat thread April 30, surfaced PM Session 68, 2026-05-01)

- **Special TCR categories — out of scope at launch** — Charity, K-12, Political Campaign, Sweepstakes, Polling and Voting, Emergency, Machine to Machine, Proxy, Direct Lending, Agents and Franchises, Social, Fraud Alert all require carrier vetting workflows (Aegis third-party verification, Campaign Verify, carrier human review, documentation back-and-forth) incompatible with RelayKit's one-person-shop automation posture and the planned paid-lookup-plus-AI-research approval-confidence stack. Decline at intake — pattern adapted from D-18's hard-decline. Decline copy TBD per Voice & Product Principles when intake flow design activates in Phase 5. Post-launch revisit gated on observed customer pull from these segments. Cross-reference: `docs/VERTICAL_TAXONOMY_DRAFT.md` §3. (Origin: PM Session 68, 2026-05-01)

- **Add Higher Education vertical** — TCR Standard category, clean 1:1 fit, no vetting friction. Real ICP segment (universities, online learning programs, postsecondary institutions). Phase 5 implementation work — additive, no architecture change: full message template set (verification, registration confirmation, deadline reminders, course/cohort communications), intake entry, dashboard surface, onboarding-wizard vertical option. Cross-reference: `docs/VERTICAL_TAXONOMY_DRAFT.md` §3. (Origin: PM Session 68, 2026-05-01)

- **Indie SaaS pack namespace composition — existing namespace stretch vs new namespace addition** — The launch audience (indie SaaS founders per MASTER_PLAN v1.5 §0 / MARKETING_STRATEGY MD-9) has main use cases that don't cleanly map to the existing 8 SDK namespaces (D-273): signup welcomes, payment-failed alerts, subscription changes, founder-facing app-monitoring alerts. `verification` covers OTP. `support` is shaped wrong (customer-service-shaped, not account-event-shaped). `internal` is employee-facing, not user-facing account events. Two design directions: (a) stretch an existing namespace to include account events — likely poor fit since `support` would have to bend semantics and `internal`'s employee-vs-user split is load-bearing; (b) add a new namespace (`accounts`? `saas`?) specifically for SaaS account events. (b) is cleaner but adds SDK surface area and template-authorship work. Decision sequencing: pick at indie SaaS pack composition design (Phase 5/6 work). Cross-reference: MASTER_PLAN v1.5 §17 risk + §18 open questions; D-372 three-layer model. Unblocks at: indie SaaS audience-pack composition design start. (Origin: PM session 2026-05-03 strategic repositioning integration.)

- **Multi-campaign upgrade UX — customer-initiated vs pre-approved envelope auto-graduate** — When a customer's volume outgrows LVM-Mixed ceilings (T-Mobile LOW tier 2,000/day brand-shared, AT&T T-class 75/min per Experiment 3b), the architecture supports adding a dedicated Standard category campaign for the high-volume traffic shape (e.g., a 2FA-heavy customer registers a separate 2FA Standard campaign while keeping LVM for the long tail). Question: how does this graduation happen for the customer, given each additional campaign carries real per-campaign cost (Sinch ISV economics + carrier fees) that flows through to billing? (a) **Customer-initiated.** Telemetry surfaces a prompt when headroom is closing; customer explicitly accepts both the new campaign and the price change. Slowest path, highest transparency, lowest trust risk. (b) **Pre-approved envelope auto-graduate.** Customer opts in at signup or in settings to a policy like "RelayKit will register additional campaigns when my volume warrants — up to $X/mo additional." Telemetry-driven graduation then operates within the pre-approved envelope without per-event consent. Hybrid: auto on the operational side, explicit on the consent side. Implies a per-campaign add-on pricing shape (so the envelope amount maps cleanly to additional campaigns) rather than all-included tier — see the multi-campaign pricing entry below. (c) **Pure auto-graduate, no prior consent.** Foreclosed. Auto-billing-changing the customer mid-month without explicit accept is a customer-trust failure mode independent of how clean the telemetry is. Listed here only to record that it was considered and rejected. Decision pending between (a) and (b). Tightly coupled to multi-campaign pricing shape (separate BACKLOG entry below). Unblocks at: Phase 5 design + Sinch ISV economics confirmation + first ~20 customers' observed traffic shapes. Cross-reference: MASTER_PLAN v1.5 §18 open questions; §9 Phase 5 campaign architecture subsection. (Origin: PM session 2026-05-03 strategic repositioning integration.)

- **Launch campaign-architecture choice — LVM-Mixed-for-everyone vs auto-route high-projection customers into Standard** — Two launch postures for the registration pipeline that submits each customer's first campaign. (a) **LVM-Mixed default for everyone.** Every customer starts on LVM-Mixed regardless of projected volume. Multi-campaign upgrade (separate BACKLOG entry above) handles graduation later. Conservative — single architecture at launch, simpler customer-facing flow, simpler RelayKit operational footprint. (b) **Auto-route at intake.** Customer's intake answers (projected volume, use-case coherence) drive a routing decision: low-volume or mixed-use → LVM; high-volume or coherent-single-use → Standard category from day one. Aggressive — better fit for high-projection customers, but adds intake complexity and pre-launch confidence in routing logic. Tradeoff: simplicity-and-speed vs better-day-one-fit. Unblocks at: Phase 5 design (conservative-vs-aggressive launch choice). Cross-reference: MASTER_PLAN v1.5 §18 open questions; §9 Phase 5 campaign architecture subsection; VERTICAL_TAXONOMY_DRAFT §4 (related three-doors-vs-two-doors UX question at the intake-form layer). (Origin: PM session 2026-05-03 strategic repositioning integration.)

- **Multi-campaign pricing — per-campaign add-on vs all-included tier** — When a customer graduates from LVM-Mixed to multi-campaign architecture (per the multi-campaign upgrade UX entry above), pricing shape needs to reflect underlying carrier/Sinch costs. (a) **Per-campaign add-on pricing.** Each additional campaign adds $X/mo to the subscription (similar to marketing's +$10/mo pattern per D-334). Transparent cost-tracking, simple billing math, customer sees cause-and-effect. Maps naturally to the pre-approved-envelope upgrade UX (envelope amount = additional add-on dollars allowed). Risk: every campaign upgrade is a billing change at exactly the moment customer volume is growing — friction in customer-initiated UX, less of an issue under pre-approved envelope. (b) **All-included tier pricing.** Customer's subscription tier covers up to N campaigns at the customer's volume class; tier upgrades happen at higher volume thresholds. Bundles complexity into clean tier shape. Risk: poor cost-tracking transparency, tier boundaries become a product-design rather than billing-math question; doesn't map cleanly to a pre-approved-envelope UX (no "$X/mo additional" handle). The two questions are tightly coupled — pre-approved-envelope upgrade UX implies (a); all-included tier implies customer-initiated upgrade. Unblocks at: Phase 5 design + Sinch ISV economics confirmation from BDR conversation. Cross-reference: MASTER_PLAN v1.5 §18 open questions; PRICING_MODEL.md (canonical pricing source); multi-campaign upgrade UX BACKLOG entry above. (Origin: PM session 2026-05-03 strategic repositioning integration.)

- **SMS_GUIDELINES.md authoring hook — structure content per MASTER_PLAN architectural design principles** — When SMS_GUIDELINES.md authoring activates (PRD_05 content expansion task), structure the doc's content to serve both purposes simultaneously: (a) human readers who need a comprehensive SMS compliance reference for their developer's specific business, and (b) the future AI configuration layer (MASTER_PLAN v1.5 §16 deferred — AI-driven configuration) that operates on structured compliance data. Concretely: encode TCR categories, Sinch entity types, throughput classes, gating rules, vetting requirements as machine-readable structured data alongside prose explanations. Templates referenced in the guide carry metadata (use case, variables, compliance gates, audience-pack fit, throughput class implications) per the four architectural design principles in MASTER_PLAN v1.5 §2. Doc currently doesn't exist — PRD_05 is in /docs/archive (Twilio era, retired). Authoring trigger conditions TBD. Cross-reference: MASTER_PLAN v1.5 §2 working principles; D-372 three-layer model. (Origin: PM session 2026-05-03 strategic repositioning integration; placeholder hook so the design-principles requirement isn't lost when SMS_GUIDELINES authoring eventually activates.)

- **Anomaly detection graduation roadmap** — When manual monitoring (D-374) hits scaling limits, automated anomaly detection ships in three stages: (1) **Alerts-only.** Velocity-vs-baseline + destination-diversity signal, per-customer + per-namespace baselines, log + email alert + dashboard banner. No auto-action. (2) **Tighten-on-warn.** At higher signal strength, auto-tighten country allow-list and auto-pause sends to net-new destinations (existing destinations in consent ledger keep working). (3) **Full pause + page.** At critical signal strength, full pause on net-new sends, page customer + RelayKit ops. Each stage graduates based on observed false-positive rate and customer count. Cross-reference: D-374, MASTER_PLAN v1.6 §18 question on graduation triggers, `docs/SECURITY_DRAFT.md` §3.3. (Origin: PM session 2026-05-03 pumping defense integration.)

- **Pumping defense customer controls scope** — Customer-facing controls for pumping defense settings need design at Phase 5. Open dimensions: (1) Country allow-list — customer-managed (add/remove countries explicitly). (2) Per-destination rate limit — customer-lowerable (tighter), not raisable. (3) Premium-prefix block list — customer-overridable with explicit opt-in for individual prefixes. (4) Per-customer rate limit — customer-tier-tunable, customer-lowerable within tier. (5) Manual-override "I'm running a campaign tomorrow" pre-authorization that temporarily raises baseline. Cross-reference: MASTER_PLAN v1.6 §18 question on customer-tunable scope, D-373, `docs/SECURITY_DRAFT.md` §3.3 + §4. (Origin: PM session 2026-05-03 pumping defense integration.)

- **Forensics view for confirmed attacks** — When an attack is confirmed (manually during first-50 window, automatically post-graduation), the customer dashboard surfaces a forensics view: attacker phone ranges, send count, time window, destination country distribution, blocked-vs-fired ratio. Helps the customer shore up app-side defenses (Layer A) and validates RelayKit's response. Build cost: small dashboard surface plus structured logging during incidents. Cross-reference: D-373, `docs/SECURITY_DRAFT.md` §3. (Origin: PM session 2026-05-03 pumping defense integration.)

- **Layer A enforcement check** — Open question whether RelayKit's pipeline does any "did you ship the defenses we told you to" check — e.g., requiring an `X-RelayKit-Defenses-Configured` header set by the customer's app once they've wired the recommended middleware, or checking response timing patterns that suggest bot-detection middleware is in the request path. Enforcement adds friction (developer experience cost); guidance-only puts more weight on Layer B + manual monitoring (D-374). Probably guidance-only at launch; revisit if attack patterns post-launch show systematic Layer A skipping. Cross-reference: MASTER_PLAN v1.6 §17 risk on Layer A skipping, §18 question on Layer A enforcement, D-373, `docs/SECURITY_DRAFT.md` §3.2. (Origin: PM session 2026-05-03 pumping defense integration.)

- **Destination-pool baselines as alternative anomaly-detection architecture** — When automated anomaly detection design activates (Entry A above), per-namespace baselines are the simpler launch shape. Alternative: destination-pool baselines (universe of phones a customer has ever sent to, regardless of namespace). Crosses namespaces but harder to compute and store. Per-namespace can miss attacks on a sparse namespace where there's no baseline to deviate from; destination-pool catches "fresh number to a customer who's never sent to this number" as a signal regardless of namespace. Worth revisiting when real attack patterns are observed. Cross-reference: MASTER_PLAN v1.6 §18 question on baseline architecture, `docs/SECURITY_DRAFT.md` §3.3. (Origin: PM session 2026-05-03 pumping defense integration.)

- **Attack-pattern observation framework for first-50-customers window** — During the manual-monitoring bridge (D-374), capture structured logging on observed attack patterns: how attacks were detected, attacker IP/destination characteristics, what defenses caught them (Layer A vs Layer B vs manual), how long detection took, what the customer's app surface looked like, what intervention RelayKit took. The structured log becomes the dataset that drives anomaly detection threshold tuning when graduation activates (Entry A above). Build-in-public content lane (MD-15) draws on these observations. Cross-reference: D-374, MD-15, `docs/SECURITY_DRAFT.md` §3.4. (Origin: PM session 2026-05-03 pumping defense integration.)

- **RelayKit launch threat model — comprehensive workstream beyond pumping defense** — Pumping defense is one species of telecom-adjacent threat. Adjacent threats tracked in `docs/SECURITY_DRAFT.md` §2 stubs include: API-key account takeover, TCR campaign suspension cascades from bad customers, number reputation damage, content drift in production, opt-out integrity attacks (STOP flooding), carrier policy whiplash. Each has its own defense architecture and its own BACKLOG-worthy graduation. Workstream scope: 4-6 hours of structured threat-modeling work (STRIDE or similar framework, attack-tree exercise per category, defense mapping) producing the next iteration of `docs/SECURITY_DRAFT.md` (§2 stubs filled to §3 depth). Promotes SECURITY_DRAFT from DRAFT to canonical. Build-in-public byproduct: "the threat model for indie SMS, by someone who built it" content lane per MD-15. Launch-period deliverable, not launch blocker. Cross-reference: `docs/SECURITY_DRAFT.md` §2, MASTER_PLAN v1.6 §17 adjacent-threats risk. (Origin: PM session 2026-05-03 pumping defense integration; broader threat surfacing folded in from earlier chat thread.)

### Infrastructure & Operations

- ~~**Rate limiting on POST /v1/signup/sandbox** — Public endpoint with no auth gate, needs rate limiting before launch. (Origin: PM review, April 1 session)~~ ✅ **Done** (April 3, 2026). In-memory IP-based, 5 req/IP/hour, applied to signup route only.

- **Multi-user / team access and project ownership transfer** — Single project_members join table keyed off project_id (D-299). Enables co-founder access, freelancer-to-client handoff, agency multi-client management, app sale/transfer. Build when a paying customer asks. Post-launch. (Origin: April 2 strategy session, D-299)

- **Sinch migration implementation** — Sinch confirmed (D-215). Create PRD_04-equivalent mapping doc: each Twilio module mapped to Sinch API equivalent. Registration API (brand + campaign), SMS API (send/receive), number provisioning, webhook handlers, credential model. Estimated 2–3 CC sessions. (Origin: March 22 brainstorming, D-199, confirmed D-215)

- **Dev/prod environment split** — Half-day config task. Separate Supabase projects, Stripe test/live keys, Twilio sandbox/production. Deferred until approaching beta. (Origin: BUILD_HANDOFF.md, multiple sessions)

- **Redis cache layer for proxy** — Read-through cache for opt-out lookups, daily limits, API key auth. Not needed at Phase 1 volumes. (Origin: D-52)

- **Migrate pre-reg API key auth from listUsers() scan** — Current O(n) scan (D-55) needs optimization before scale. Options: key hash lookup table, or migrate sandbox keys to api_keys table at generation time. (Origin: D-55)

- **Testing strategy** — 109 tests across SDK (22) and API (87). Vitest, TDD, dependency-injected mocks via createApp(). Quality gates: tsc --noEmit + eslint + vitest before every commit. No UI tests — manual testing for prototype. Integration tests cover full SDK-to-API chain. Substantially complete for current scope. (Origin: general, updated April 3)

- **Autonomous build experiment** — Small self-contained project (no SMS) on secondary Mac to validate agentic pipeline end-to-end. (Origin: browser chat planning)

- **Claude API integration for website backend** — Server-side Claude calls for: intake interview edge cases, edited message compliance evaluation, AI fix button rewrites, custom message authoring guidance, transactional-vs-marketing content classification. Deterministic code handles: template registry, variable validation, message length, opt-out language detection, SHAFT screening, required elements, segment counting. Target: ~80/20 deterministic-to-Claude ratio. (Origin: April 3 noodling session, D-300)

- **Message pipeline refactor (pre-Sinch)** — Refactor `handlePostMessages` from a single function into a pipeline of discrete steps: validate → checkConsent → checkQuietHours → normalizePhone → interpolate → send → logDelivery → respond. Each step is a separate testable function that receives message context and can short-circuit. Required before Sinch integration to avoid a monolithic handler. Awareness items: sandbox keys (null user_id) should bypass consent enforcement; marketing namespace triggers both consent check and quiet hours. (Origin: April 3 architecture audit, D-309)

- **Messages table for delivery tracking and metering** — Create a `messages` table: id, user_id, api_key_id, namespace, event, to_phone, composed_text, status (queued/sent/delivered/failed), carrier_message_id, created_at, delivered_at, failed_at, queued_until (for quiet hours). Foundation for: usage metering (PRICING_MODEL), delivery analytics (backlog), sandbox usage tracking (D-294), quiet hours queue (D-309). Build alongside Sinch integration. (Origin: April 3 architecture audit)

- **Phone number normalization utility** — Add `normalizePhone(to)` that strips formatting and ensures E.164 format (+1XXXXXXXXXX). Apply in shared validation before consent lookup, quiet hours check, or carrier send. Prevents mismatches between SDK input format and consent record format. Small but prevents a class of bugs. (Origin: April 3 architecture audit)

- **Registration data injection for template variables** — Templates use `{business_name}` and similar registration-level variables. Currently passed by developer in `data` field. In production, merge server-side registration data (from intake/EIN) with developer-provided data, developer takes precedence. Requires a `CustomerLookup` or `RegistrationStore` service alongside existing KeyLookup and ConsentStore. Build when intake interview (D-300) or EIN verification (D-302) lands. (Origin: April 3 architecture audit)

- **Sandbox consent bypass** — Sandbox keys have null user_id (D-292). Consent enforcement requires user_id. When building proxy-level consent checks for marketing messages, sandbox keys should bypass consent enforcement entirely (they're testing, not sending to real opt-in lists). Explicit decision needed before proxy build. (Origin: April 3 architecture audit, D-292)

- **Custom template database lookup path (D-280)** — Current `lookupTemplate(namespace, event)` only checks the static TypeScript registry. Custom messages (D-280) will live in a database. When built, lookupTemplate falls through: static registry first, then `custom_templates` table query with user_id scope. Current function signature is fine — don't couple anything to the assumption that all templates are static. (Origin: April 3 architecture audit, D-280)

- **Pre-Phase-2 DECISIONS.md audit** — Review D-84 through D-362 for internal consistency, identify superseded/conflicting decisions, propose consolidation. Estimated 3–4 hours CC + 1–2 hours PM↔Joel resolution. Run before Phase 2 Session B kickoff. (Origin: Session 44, 2026-04-23 — flagged during Phase 1 Experiment 1 capture when Implications-for-Phase-2 surfaced that the MESSAGE_PIPELINE_SPEC drafted contract may need updates against real-world Sinch behavior)

- **Configure eslint in /prototype** — Production workspaces (/api, /sdk, /marketing-site) all enforce eslint per CLAUDE.md quality gates. /prototype has no eslint config and CC has no automated linting available there. Prototype is the UI source of truth and ports to production verbatim — letting it drift on style or unused-imports/no-explicit-any/etc. costs more than fixing later. Match the eslint config of one of the production workspaces (probably /marketing-site since it's the most recent and uses the same Next 15 + React 19 + TS strict stack). One-session task. (Origin: Session 60, surfaced during custom-message-wizard exposure work, 2026-04-30)

- **Recent Activity → full message log with clickthrough** — Cross-cutting work surfaced by Phase 6 verification panel scoping. Every message-type card today shows a Recent Activity tail with database rows in test & debug mode; row count is currently unbounded and there's no clickthrough to see complete history. Cap at 5 rows per card and add a "View all" clickthrough to a full message log filtered to that template type, with columns for phone (masked), timestamp, status, error reason. Affects every message type, not OTP-specific. (Origin: PM Session 62 verification panel scoping, 2026-04-30)

- **Cap Recent Activity rows at 5 per message card** — Currently no max set. Small fix, separate from full-message-log work. (Origin: PM Session 62, 2026-04-30)

- **Account-tier rate-limit self-serve in dashboard** — Per VERIFICATION_SPEC §6, OTP rate limits at launch are support-escalated for account-tier overrides. Post-launch enhancement: expose account-tier rate-limit configuration in dashboard for self-serve adjustment. Reduces support load as customer base grows. (Origin: D-369 implementation note, 2026-04-30)

- **OTP-led beta MVP, vertical-diverse registration** — Beta launch model: beta users complete full carrier registration for their chosen vertical (appointments, orders, support, etc.) so the registration pipeline gets exercised across multiple verticals before broad launch. During beta, OTP/verification is the only end-to-end working flow — non-OTP verticals show "coming soon" in the dashboard until Phase 6 finishes hydrating them. Beta launches at Phase 6 close. Unblock conditions captured: D-369 commits validation infrastructure to launch scope; D-370 commits the symmetric sendCode+checkCode SDK pair across every namespace; D-371 commits message-customizability rules. MASTER_PLAN v1.4 expands Phase 6 to deliver this work. VERIFICATION_SPEC.md is the canonical implementation spec. (Origin: PM Session 62, 2026-04-30)

- **"Verification included" marketing pillar rollout** — Pillar wording confirmed as "Verification included." Expanded copy template for context-sensitive surfaces: "built-in phone verification you can use for account verification, login codes, sensitive-action confirmation, device verification..." Per starter integration guides: "While you're here, RelayKit handles phone verification too — same SDK, no extra setup." See VERIFICATION_SPEC §12 for canonical rollout surface inventory (homepage, pricing page, every starter guide). The word "verification" is the convergence anchor — covers the full surface without committing to "auth platform" framing or developer jargon. (Origin: PM Session 62, 2026-04-30)

### Marketing & Growth

- **Lovable/Bolt/Replit connector exploration** — Investigate Lovable's connector program. Build a dead-simple landing page aimed at no-code builders. Measure signup interest. API endpoint already exists — connector is a distribution play. Post-launch, after SDK path has paying customers. (Origin: April 2 strategy session, D-296/D-297)

- **"Your AI tool builds your test surface, with our help" as differentiator angle** — Marketing positioning that follows from the architectural posture entry under Likely → Product Features (test surface lives in developer's app, RelayKit ships the prompt-shaped guide). Frames RelayKit's testing story as native to the developer's app, in their style, against their data — not a hosted dashboard living elsewhere. Distinguishes from Twilio / MessageBird / Plivo / Sinch direct, all of whom either ship a hosted console or expect the developer to roll their own. The "with our help" half is the AGENTS.md-style guide doing the heavy lifting. Promote to MD-number in `docs/MARKETING_STRATEGY.md` after the TESTING_GUIDE_DRAFT.md prototype validation entry passes — if AI tools produce bad surfaces from the guide, the positioning evaporates and this entry retires unused. (Origin: PM Session 67, 2026-05-01)

- **Marketing-site message catalog depth parity** — Marketing-site configurator currently has ~2–3 stubs per vertical; prototype/dashboard has ~6 per vertical (Appointments depth: Booking confirmation, Appointment reminder, Pre-visit instructions, Reschedule notice, No-show follow-up, Cancellation notice). Decision: expand marketing-site stubs to match prototype depth so the configurator demonstrates real depth out of the gate and users commit to a path. Two open sub-questions: (a) port the prototype's MESSAGES data wholesale, or author marketing-side stubs that align with prototype titles; (b) when promoted from BACKLOG, do this work alongside Friendly/Brief variant content polish (currently YOLO stubs per Session 74 plan), since both touch the same template files. Defer behind page-architecture work and dark mode unless the home-page configurator feels too thin in early user testing or beta feedback. (Origin: Session 74 close, 2026-05-09)

### Content & Marketing

- **Message reference page as lead magnet** — Pick use case, get full message reference with copyable blocks and opt-in language, no signup required. Content from PRD_02 template engine. Decision pending: fully public vs. gated. (Origin: PM_HANDOFF memory, multiple sessions)

- **Beta user recruitment plan** — 5–8 testers, indie developers/small SaaS founders. Channels: Reddit, Hacker News, Twitter/X, Indie Hackers, AI-tool Discords. (Origin: memory, planning sessions)

- **Landing page SEO keywords** — AI SMS integration, 10DLC registration service, SMS compliance for developers. PRD_07 has initial list. (Origin: PRD_07)

- **Live TCR registration smoke test** — Manually seed Supabase records, trigger PRD_04 state machine directly, bypass intake UI. Validates template engine produces TCR-approved campaigns. ~$50 for 2–3 runs. (Origin: planning sessions)

- **Constraint demolition framework as blog post / methodology** — Formalized design approach: define ideal experience, list every assumed constraint, classify as real vs inherited, demolish inherited ones. Could use AI to extract constraints from competitor docs. Potential post: "How we designed RelayKit by demolishing inherited constraints." Post-launch content marketing. (Origin: April 2 strategy session)

### Pricing & Business Model

- **Explore lower barriers to entry between free and $199** — Options explored: middle pricing tiers, usage-triggered registration credits, monthly installments, per-message pricing. No decision reached. Current $49/$150 split already provides a low entry point. Keep same pricing for all audiences (D-296). Revisit with real conversion data. Post-launch, data-driven. (Origin: April 2 strategy session, D-296)

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

## Sandbox Demo Features (High Priority — builds value that justifies $199)

- **Multiple verified phone numbers (1 primary + up to 5 demo slots)** — Expand from 1 verified phone to 1 primary + up to 5 demo list phones. Primary for developer iteration ("Send to my phone" on website). Demo list for stakeholder demos. Each demo phone verified via OTP. Per-session selection — nobody receives messages unless explicitly included. 100/day cap shared across all numbers. No "send to all" button. STOP works for everyone. (Origin: April 2 strategy session)

- **"Send to my phone" button on website authoring surface** — Every message preview on the website has a send button that delivers to the developer's primary verified phone. Closes the authoring loop physically. No SMS platform offers this today. (Origin: April 2 strategy session)

- **Manual message send from website to demo list (Mode 1)** — Developer picks a message on the website, selects demo list recipients, hits send. For collaborative message review with stakeholders. Independent from app-triggered sends. (Origin: April 2 strategy session)

- **App-triggered send to demo list (Mode 2)** — When the developer's app fires an event in sandbox mode, messages deliver to primary phone plus selected demo list members. The boardroom demo scenario. Requires per-session recipient selection in dashboard. (Origin: April 2 strategy session)

- **Shareable invite link for demo list** — Developer gets a unique URL from dashboard. Recipient opens link, sees branded page, enters phone, verifies via OTP, joins demo list. Capped at 10 unique recipients per day. Developer can revoke link. Lower priority — fast follow after demo list core. (Origin: April 2 strategy session)

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

---

## Open-Source SMS Compliance Linter

Open-source repo (separate from main RelayKit codebase) that packages SMS compliance knowledge into a developer tool. Serves as a marketing vehicle targeting vibe coders, indie devs, and newsletter coverage (TLDR AI, Simon Willison, etc.).

**Core: deterministic validators (no API key required)**
- Quiet hours checker with NPA-NXX timezone lookup
- Opt-out language presence and placement validation
- SHAFT content keyword detection
- Segment counter (handles Unicode/emoji encoding edge cases)
- Transactional vs marketing classification rules
- TCR/10DLC registration requirement checker
- Character limit and link shortener carrier flagging rules

**AI layer (requires user's own LLM API key)**
- Gray-area content evaluation (marketing disguised as transactional, borderline SHAFT)
- Carrier rejection risk scoring
- Message rewrite suggestions

**Structured compliance ruleset (the real asset)**
- Machine-readable JSON/YAML rules covering verticals, obligations, carrier-specific gotchas
- Designed for community contributions as carrier rules evolve

**Distribution:** CLI tool, potential GitHub Action, callable from AI coding tools.

**Upgrade path to RelayKit:** The linter diagnoses compliance problems; RelayKit solves them. Natural funnel from open-source user to paid customer.

**Timing:** Post-launch. Build after Priorities 1–3.
