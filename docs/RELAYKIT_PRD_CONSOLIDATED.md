# RelayKit — Product Requirements Document
## Consolidated from prototype, decisions, and strategy sessions
### March 31, 2026 — Living document, not a build spec

---

## What RelayKit Is

RelayKit lets developers add SMS messaging to their apps without becoming telecom compliance experts. The developer picks their use case, previews and customizes compliant messages on the website, installs the SDK (`npm install relaykit`), and their AI coding tool wires it into the app. RelayKit handles carrier registration, consent management, message compliance, and ongoing enforcement.

The developer's job is building their app. RelayKit's job is everything else about SMS.

---

## Who It's For

Developers who need their app to send text messages to US phone numbers. Particularly:

- **Vibe coders and indie builders** using AI coding tools (Claude Code, Cursor, Windsurf, GitHub Copilot, Cline) who want SMS to just work
- **Small SaaS teams** adding messaging to existing products who need compliance handled
- **Agencies and vertical builders** building for specific industries who need category-specific message templates

The common thread: they can write code or use AI tools to generate it, but they don't want to learn 10DLC registration, TCPA consent rules, carrier content policies, or opt-out enforcement.

---

## The Problem

Sending a text message from an app should take an afternoon. In reality it takes weeks.

Before sending a single message, a developer must: register their brand with The Campaign Registry, submit a carrier campaign with correctly formatted sample messages and campaign descriptions, build and host a compliance website with a privacy policy containing specific mobile data language, create a compliant opt-in form with seven required disclosure elements, get carrier approval (days to weeks), provision a phone number, and set up opt-out handling.

First-time rejection rates are estimated at 30-50%. Each rejection costs money and days. Most developers give up.

After registration, the developer is responsible for TCPA compliance ($500-$1,500 per violation with no cap), carrier content rules, consent management, opt-out enforcement, quiet hours, and rate limits they probably don't know exist.

RelayKit eliminates all of this.

---

## The Solution — What the Developer Experiences

### Step 1: Pick a use case

The developer visits RelayKit and picks their category: appointments, orders, verification, customer support, marketing, team alerts, community, or waitlist. Each category has a complete system of pre-written, carrier-compliant messages tailored to that use case.

For appointments, this includes: booking confirmation, appointment reminder, rescheduling confirmation, cancellation notice, no-show follow-up, and pre-visit instructions. Each message comes in multiple style variants (brand-first, action-first, context-first) and can be personalized with the developer's business name, service type, and website.

### Step 2: Preview and customize messages on the website

The website is the message authoring surface (D-279). The developer previews their curated message library, edits text inline with real-time compliance indicators (D-281), and optionally authors custom messages beyond the curated library (D-280). Message content is saved server-side, tied to the developer's API key. The developer can also download SMS_GUIDELINES.md — a compliance co-pilot document their AI coding tool uses for context (D-283).

### Step 3: Install the SDK and build with AI

The developer runs `npm install relaykit` and hands their AI coding tool the project. The SDK provides per-vertical namespace functions (e.g., `relaykit.appointments.sendConfirmation()`) that AI tools use correctly on first attempt — validated across Claude Code, Cursor, and Windsurf in 25 experiment rounds (D-265). The SDK sends semantic events; the server composes actual SMS from the developer's saved templates. The developer's codebase never contains message text.

The AI tool reads function names like `sendBookingConfirmation` and infers integration points without being told when to call them (D-268). It finds the booking creation handler, the cancellation flow, the reminder scheduler, and wires in the right SDK call at the right moment.

The developer tests in sandbox mode — messages are validated and logged but don't require carrier registration. The sandbox runs the same compliance checks as production.

### Step 4: Go live

When the developer is ready for real message delivery, they complete a short registration form. RelayKit handles the entire carrier registration process: brand registration, campaign submission to carriers via Sinch, compliance site deployment, phone number provisioning. The developer pays $49 at submission. Approval typically takes a few days (Sinch's structural advantage — D-215). On approval, the developer pays $150 go-live fee (customer-initiated, not auto-charged — D-194). If rejected, full $49 refund.

The developer swaps their sandbox API key for a live key. Same code, same SDK, same API. Messages start delivering to real phones.

### Step 5: Stay compliant

Every message flows through RelayKit's compliance proxy before reaching carriers. The proxy scans for content issues, enforces opt-out (STOP replies blocked automatically), checks consent status for marketing messages, and catches drift from the developer's registered use case. Issues are fixed silently when possible, flagged to the developer when action is needed. SMS alerts notify the developer before problems escalate.

The developer never has to think about compliance again. RelayKit handles it continuously.

---

## Use Cases and Message Systems

Each use case is a complete messaging system, not a collection of individual templates. The system covers the full lifecycle of interactions for that category.

### Appointments
Booking confirmation, 24-hour reminder, rescheduling confirmation, cancellation notice, no-show follow-up, pre-visit instructions. Vertical-aware: a dental practice gets "your dental appointment" not "your appointment."

### Orders
Order confirmation, shipping notification, delivery update, delivery confirmation, return initiated, refund processed, review request.

### Verification
Verification code, password reset, new device alert, account recovery, welcome/onboarding.

### Customer Support
Ticket acknowledgment, status update, resolution confirmation, satisfaction follow-up, escalation notice, information request.

### Marketing (standalone or add-on)
Weekly promotion, new arrivals, loyalty reward, seasonal sale, back-in-stock, abandoned cart. Available as a primary use case or as an expansion alongside any transactional use case.

### Team Alerts
Meeting reminder, schedule change, shift confirmation, emergency broadcast, policy update, system status.

### Community
Event reminder, group update, membership renewal, RSVP confirmation, new member welcome.

### Waitlist
Position update, spot available, reservation confirmation, wait time update, cancellation/rebooking.

---

## Marketing Messages — The Expansion Path

Developers who register for a transactional use case (e.g., appointments) can add marketing messages later. This is a separate registration — a second MARKETING carrier registration alongside their existing transactional registration. RelayKit abstracts this completely; the developer never sees two registrations.

Marketing expansion requires an EIN (sole proprietors are limited to one registration). The expansion costs $29 one-time registration fee and $10/mo for 250 marketing messages (separate pool from transactional). Overage rates are the same.

Marketing messages require separate recipient consent — federal law (TCPA). RelayKit handles this: the SDK includes top-level consent functions (`relaykit.recordConsent()`, `relaykit.checkConsent()`, `relaykit.revokeConsent()` — D-274), the consent API stores records, and the proxy blocks marketing messages to recipients who haven't opted in.

The developer's dashboard shows marketing messages as locked until the expansion is registered and approved. On approval, everything unlocks automatically — the compliance site updates, new namespace functions become available in the SDK, and the proxy starts accepting marketing messages.

The words "campaign" and "promotional" never appear in customer-facing copy. The developer sees "marketing messages" and "marketing registration."

---

## Carrier Layer — Sinch

RelayKit operates as an ISV (Independent Software Vendor) on Sinch's platform (D-215). Sinch replaces Twilio as the carrier layer, driven by a structural advantage: Sinch performs CSP-level review before TCR submission, combined with RelayKit's clean template engine. This positions RelayKit for fast, often first-try approval. Registration typically completes in days, not weeks.

Each developer gets an isolated subaccount on Sinch for credential isolation, per-customer compliance enforcement, and clean usage reporting.

The registration pipeline: create subaccount → register brand → submit campaign with RelayKit-generated artifacts (campaign description, sample messages, opt-in description) → provision phone number → configure proxy webhooks → generate live API key.

Sinch account: dashboard.sinch.com, Project ID `6bf3a837-d11d-486c-81db-fa907adc4dd4`. Currently trial account — ISV/reseller upgrade pending (D-271).

---

## Compliance Infrastructure

### Compliance Site
RelayKit generates and hosts a live, carrier-compliant website for each developer at a neutral domain (e.g., glowstudio.msgverified.com). Four pages: home (business info), privacy policy (with mandatory mobile data non-sharing language), terms of service, and SMS opt-in form. The site looks like the developer's own — no RelayKit branding. Carriers verify this site exists during registration review.

When marketing is added, the compliance site updates automatically to include marketing consent language.

### Messaging Proxy
Every outbound message passes through RelayKit's compliance layer before reaching carriers. The proxy checks: content compliance (SHAFT-C screening, use case drift), consent status (marketing messages require explicit opt-in), opt-out enforcement (STOP replies honored automatically), quiet hours, and rate limits.

Three enforcement tiers:
- **Minor:** Fixed silently at the proxy level. Developer notified but no action needed.
- **Escalated:** Developer notified with 30-day window to fix. Only the affected message type is paused at day 30.
- **Suspended:** Blocked immediately. Message doesn't reach carriers.

### Consent Management
RelayKit provides full consent lifecycle management:
- **Opt-in:** The SDK's consent functions and SMS_GUIDELINES.md include consent form specifications with TCPA-compliant language. The developer's AI tool builds the form natively in their app. On form submission, the developer's app calls `relaykit.recordConsent()` (D-274). RelayKit stores the consent record — timestamped, auditable, retained for 4 years.
- **Opt-out:** STOP replies intercepted automatically by the proxy. No developer code required.
- **Enforcement:** The proxy checks consent before every marketing message. No consent on file = message blocked.

The developer's app can also store consent in their own database for their own logic. Both sides have it. RelayKit's database is the source of truth for enforcement.

The consent + SMS integration pattern was validated end-to-end in experiment Round 3: all three AI tools scored 18/18 on a six-task prompt covering TCPA-compliant checkbox, conditional phone validation, consent API, and SMS sending (D-269).

### Compliance Monitoring
Ongoing drift detection: RelayKit monitors whether the developer's messages are staying within their registered use case. If messages gradually shift from "appointment reminders" toward "promotional offers," RelayKit catches it before carriers flag it. The developer gets clear guidance on what needs to change.

---

## The SDK — Validated Delivery Model

The SDK (`npm install relaykit`) is RelayKit's production delivery mechanism (D-266). This was validated through 25 experiment rounds across 8 phases, testing 4 delivery models with 3 AI coding tools against 2 real open-source apps in 2 verticals (D-265). The SDK is the polished version of the working module format that proved 58% faster than spec files with equivalent reliability.

### Architecture (D-272–D-278)

**Dual publish:** ESM (default) + CJS fallback + TypeScript declarations, built via `tsup` (D-272). AI tools import correctly with zero adapter code regardless of the target app's module system.

**Per-vertical namespaces:** 8 namespaces matching use cases (D-273):
- `relaykit.appointments` — sendConfirmation, sendReminder, sendReschedule, sendCancellation, etc.
- `relaykit.orders` — sendConfirmation, sendShipping, sendDelivery, etc.
- `relaykit.verification` — sendCode, sendPasswordReset, sendDeviceAlert, etc.
- `relaykit.support` — sendAcknowledgment, sendStatusUpdate, sendResolution, etc.
- `relaykit.marketing` — sendPromotion, sendNewArrivals, sendLoyaltyReward, etc.
- `relaykit.internal` — sendMeetingReminder, sendScheduleChange, sendEmergency, etc.
- `relaykit.community` — sendEventReminder, sendGroupUpdate, sendWelcome, etc.
- `relaykit.waitlist` — sendPositionUpdate, sendSpotAvailable, sendConfirmation, etc.

**Top-level consent:** `relaykit.recordConsent()`, `relaykit.checkConsent()`, `relaykit.revokeConsent()` — cross-cutting, not namespaced (D-274).

**Direct send for custom messages and exploring:** `relaykit.send({ to, messageType, data })` — the escape hatch for developer-authored custom messages (D-280) and the `exploring` use case which has no domain semantics (D-275, D-282).

**Single API endpoint:** All SDK calls hit `POST /v1/messages`. Five total API endpoints (D-276):
- `POST /v1/messages` — send a message
- `POST /v1/consent` — record consent
- `GET /v1/consent/:phone` — check consent status
- `DELETE /v1/consent/:phone` — revoke consent
- `POST /v1/messages/preview` — validate before sending

**Zero-config init:** `new RelayKit()` reads `RELAYKIT_API_KEY` and `BUSINESS_NAME` from `process.env`. Explicit config available via `new RelayKit({ apiKey, businessName })` (D-278).

**Graceful failure by default:** Missing phone → null + console warning. Missing API key → null + console warning. Network error → null + console warning. Compliance blocks → structured result: `{ id: null, status: 'blocked', reason: 'recipient_opted_out' }`. Optional strict mode (`new RelayKit({ strict: true })`) throws `RelayKitError` instead (D-277).

### How the SDK works with the website (D-279)

The website is the authoring surface; the SDK is the delivery mechanism. The developer picks a use case and customizes messages on the website. Message content is saved server-side, tied to the developer's API key. The SDK sends semantic events (`relaykit.appointments.sendConfirmation(phone, { date, time })`); the server composes the actual SMS from the developer's saved templates. The developer's codebase never contains message text.

Custom messages authored on the website (D-280) are callable via `relaykit.send({ to, messageType: 'custom_post_visit_thankyou', data })`. Same compliance checks, same proxy, same API endpoint underneath.

### SMS_GUIDELINES.md (D-283)

A separate compliance co-pilot document that sits in the developer's project root. The AI coding tool reads it for compliance context while writing the integration. Whether it's downloaded from the website or generated by a CLI command (`npx relaykit init`) is deferred to production build. The SDK handles message sending; SMS_GUIDELINES.md handles compliance context.

### Validation Results Summary

25 rounds across 8 phases. Full results in `docs/BUILD_SPEC_VALIDATION_LOG.md`.

Key findings:
- Working module format is 58% faster than spec file with equivalent reliability (D-265)
- SDK namespace pattern used correctly by all tools on first attempt — Round 12: CC scored 20/20, Windsurf scored 19/20 (D-266)
- Function names carry intent — AI tools infer integration points without trigger descriptions (D-268)
- Consent + SMS two-module pattern validated end-to-end: 18/18 across all three tools (D-269)
- Repo report concept viable with Cursor hallucination mitigation (D-267)
- Module format generalizes across fundamentally different app architectures (appointment booking + e-commerce)

---

## Pricing

### Free Tier — Sandbox
$0 forever. Build and test the full SMS integration. No credit card, no time limit. SDK access, curated message library, message authoring on website, sandbox API key and phone number.

### Go Live (D-193, D-216)
- **$49 registration fee** at submission
- **$150 go-live fee** after carrier approval (customer-initiated — D-194; full $49 refund if rejected)
- **$19/month** — 500 messages included, dedicated phone number, compliance proxy, drift detection, compliance site hosting
- **$15 per additional 1,000 messages** (auto-scales, no interruption)
- Volume pricing available above 5,000 messages
- **Display:** "$199 to register + $19/mo" headline, with "$49 to register. $150 only after you're approved. Full refund if not." in feature details

### Marketing Add-On
- **$29 one-time** registration fee (no go-live fee — brand already verified)
- **+$10/month** — 250 marketing messages (separate pool)
- Same overage rates as transactional

### Beta (D-196)
- **$49 flat** — no $150 approval payment, no monthly until post-beta conversion
- Capped at 25–50 slots
- Access requires completing a prototype user test session (D-197)

---

## Dashboard

The developer's dashboard has three tabs: Overview, Messages, and Settings.

### Overview
Adapts to five lifecycle states: Default (sandbox, building), Pending (registration submitted), Approved (live, sending), Extended Review (carrier requested changes), and Rejected (with debrief and resubmission path).

Default state: compliance status section (message scanning results, SMS alerts toggle), onboarding wizard (verify phone → send test → send from code → build full feature), and registration sidebar with pricing and CTA.

Approved state: three metric cards (delivery rate, recipients, usage & billing), compliance attention section (flagged messages with enforcement tier), and marketing expansion banner.

### Messages
The developer's message library and authoring surface. In sandbox: all messages for their use case with personalization, style variants (brand-first, action-first, context-first), inline editing with compliance indicators, and custom message authoring. After approval: registered messages shown with their approved values, marketing section shows expansion path.

The Messages page is where developers preview, edit, and extend their message library. Message content saved here is what the SDK delivers — the website is the authoring surface, the SDK is the delivery mechanism (D-279).

### Settings
Business details, API keys, registration status, billing, and danger zone (cancel/delete). Five lifecycle state variants with appropriate fields and actions per state.

---

## Marketing Pages

### Home
Hero claim, AI tool logo farm, "How it works" three-step flow, use case grid, pricing cards (Free/Go live with D-216 display), comparison table (DIY vs Others vs RelayKit), and compliance value proposition.

### Category Landing (per use case)
Category-specific messaging with message previews in style variants, "What you get" cards, pricing context, and registration CTA. Deep page with "Why registration matters" FAQ section and "What's included from day one" checklist.

### Messages Page (public, pre-signup)
Full message library for the category. Playbook summary (D-217 — describes the messaging system and when messages fire, not a download gateway), style variant selector, tool selector with real logos, personalization slideout, download modal with How it Works context.

### Compliance Page
RelayKit's compliance value proposition. How the proxy works, what gets caught, how alerts work. Positions compliance as protection, not burden.

---

## Voice and Experience Principles (Summary)

**The developer is the hero. RelayKit is the guide.** Every screen, every status message, every error state follows this philosophy.

**Unequivocal claims over hedged explanations.** Marketing copy makes confident statements. Detail lives in FAQs, not inline. "We handle opt-in and opt-out." Not "We provide tools to help you manage consent compliance."

**One-sentence education.** When a constraint needs explaining, one sentence maximum. "Carriers need this to verify your business is real." Not a paragraph.

**Claim, then depth.** Lead with the claim (what 80% read). Support with one sentence (for the curious). Put mechanism detail in secondary surfaces (for the 20% who want to understand how).

**Reduce to the job.** Every element on a screen should serve the developer's current task. If it doesn't, move it somewhere else — even if it's accurate and well-written.

**Vocabulary rules:** Use "marketing messages" never "campaign" or "promotional." Use "registration" not "campaign submission." Use "live" not "active." Never leave a pending state without narrative. Never use "required," "violation," "you must," or "please note." Use "your AI tool builds it" — outcome language, not mechanism (D-257). Use "we handle..." — unequivocal claim language (D-263).

---

## What's Built

### Production (committed, working code)
- Project scaffolding (Next.js, Supabase, Stripe, Tailwind)
- Database schema and migrations
- Intake wizard (screens 1, 1b, 2, 3)
- Stripe checkout integration
- Template engine (all 8 use cases, 5-8 base + 3-4 expansion messages per use case)
- Compliance site generator (4-page static HTML, Cloudflare Pages deployment)
- Carrier submission pipeline (state machine, subaccount creation, brand registration, campaign submission, phone provisioning, webhooks) — built for Twilio, needs Sinch mapping (D-215)

### Prototype (UI source of truth, port 3001)
- Full marketing pages (home, category landing, messages page, compliance)
- Dashboard with all five lifecycle states
- Messages tab with style variants, personalization, download flow
- Settings page with lifecycle state differentiation
- Sign-in modal with email + OTP flow
- Compliance alerts system (three enforcement tiers)
- Marketing expansion modal with lifecycle states
- Admin pages (control room, registration pipeline, customer list/detail)

### Validated (experiments complete, ready for production build)
- SDK API surface — per-vertical namespaces, top-level consent, zero-config init, graceful failure, single API endpoint (D-272–D-278)
- Mock SDK package (`relaykit/` with `index.js`, `index.d.ts`, `package.json`) — starting point for production SDK
- Integration pattern — AI tools wire SDK calls into existing codebases correctly on first attempt
- Cross-vertical generalization — same SDK pattern works for appointments and orders on fundamentally different app architectures
- Full experiment log: `docs/BUILD_SPEC_VALIDATION_LOG.md`

### Not Yet Built
- **Production SDK** — convert mock to TypeScript, `tsup` build pipeline, npm publish (D-272)
- **Sandbox API endpoint** — `POST /v1/messages`, API key validation, template lookup, Sinch sandbox delivery
- **Sandbox signup flow** — issue API key, verify phone, show key in dashboard
- Messaging proxy (PRD_09) — the compliance enforcement layer
- Compliance monitoring (PRD_08) — drift detection
- Consent API endpoints — `POST /v1/consent`, `GET /v1/consent/:phone`, `DELETE /v1/consent/:phone`
- Sinch integration — carrier submission mapped to Sinch APIs (D-215, D-271)
- Marketing expansion registration flow — second campaign pipeline
- Message authoring UI on website — inline editing with compliance indicators (D-281)
- Custom message authoring — developer-authored messages beyond curated library (D-280)

---

## What's Next — Production Build Priority

The validation program is complete. The SDK architecture is locked. The build priority is now the shortest path to a developer experiencing `npm install relaykit` → real text message on their phone.

### Priority 1: SDK build pipeline
Convert mock `index.js` to TypeScript source, set up `tsup` for dual ESM/CJS output (D-272), npm publish workflow, versioning strategy. Well-scoped CC session. Mock SDK from Round 12 is the starting point.

### Priority 2: Sandbox API endpoint
`POST /v1/messages` — receive request, validate API key, look up message template, interpolate data, send through Sinch sandbox. This is where experiments connect to reality.

### Priority 3: Sandbox signup flow
Issue sandbox API key on signup. Verify one phone number. Show key in dashboard. This + SDK + endpoint = "3 minutes to a real text message."

### Priority 4: Sinch ISV upgrade
Trial account (D-271) needs upgrade to production ISV. Reseller toggle errored on trial. Required before real message delivery.

### Priority 5: Production build order (paused behind prototype stabilization — D-104)
When prototype screens stabilize and PRDs are updated: port dashboard, build consent API, build messaging proxy, build compliance monitoring, build landing page. See BUILD_HANDOFF.md for full sequence.

---

## Key Principles

- **The SDK is the product.** It's the artifact developers interact with. Iterate it like a product.
- **Thin SDK, living service.** Small package in the repo, intelligence on RelayKit's servers. Template updates, consent language changes, and compliance rule refinements flow through the API. The developer's code doesn't change. (D-258, D-259)
- **Website authors, SDK delivers.** Message content lives on the website and server. The SDK sends semantic events. The developer's codebase never contains message text. (D-279)
- **Function names carry intent.** AI tools infer when to call `sendBookingConfirmation()` without being told. Trigger descriptions are developer documentation, not AI instructions. (D-268)
- **Test before building.** 25 experiment rounds validated the delivery model before production infrastructure was built. (D-260, D-261)
- **Murphy's Law applies.** Every responsibility moved from the developer's app to RelayKit's servers is one less thing that breaks.
- **The developer still makes product decisions.** When to send, what data to include, where to put the opt-in form. RelayKit makes those decisions easier with use-case playbooks, not impossible to get wrong.
- **Prototype is the UI source of truth.** Production screens are ported from the prototype, not built from PRDs. (D-163)
- **Decisions are recorded.** 283 decisions in DECISIONS.md govern everything from architecture to vocabulary. CC reads them every session.
