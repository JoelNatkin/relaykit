# RelayKit — Product Requirements Document
## Consolidated from prototype, decisions, and strategy sessions
### April 7, 2026 — Living document, not a build spec

> **Scope of this document:** This is the product-level "what and why" — the story, the architecture, the principles. It does not describe screens, UI flows, or visual specifications. For those, see:
> - **WORKSPACE_DESIGN_SPEC.md** — target UI architecture, screen flows, page layouts
> - **PROTOTYPE_SPEC.md** — pixel-level current state of each prototype screen
> - **DECISIONS.md** — the audit trail of every product choice

---

## What RelayKit Is

RelayKit lets developers add SMS messaging to their apps without becoming telecom compliance experts. The developer picks their use case, previews and customizes compliant messages on the website, and integrates using the SDK (`npm install relaykit`) or the raw API (`POST /v1/messages`) — both deliver the same experience (D-296). AI coding tools wire the SDK into the app; no-code platforms call the API directly. RelayKit handles carrier registration, consent management, and message compliance.

The developer's job is building their app. RelayKit's job is everything else about SMS.

---

## Who It's For

Developers and builders who need their app to send text messages to US phone numbers. Particularly:

- **Vibe coders and indie builders** using AI coding tools (Claude Code, Cursor, Windsurf, GitHub Copilot, Cline) who want SMS to just work — they use the SDK
- **No-code and low-code builders** using platforms like Lovable, Bolt, and Replit who need compliant SMS without touching a terminal — they call the API directly or use a platform connector (D-296, D-297)
- **Small SaaS teams** adding messaging to existing products who need compliance handled
- **Agencies and vertical builders** building for specific industries who need category-specific message templates

The common thread: they build apps (with code or AI tools), but they don't want to learn 10DLC registration, TCPA consent rules, carrier content policies, or opt-out enforcement. All audiences get the same product — same messages, same authoring surface, same compliance, same pricing (D-296). The only difference is the entry point.

---

## The Problem

Sending a text message from an app should take an afternoon. In reality it takes weeks.

Before sending a single message, a developer must: register their brand with The Campaign Registry, submit a carrier campaign with correctly formatted sample messages and campaign descriptions, build and host a compliance website with a privacy policy containing specific mobile data language, create a compliant opt-in form with seven required disclosure elements, get carrier approval (days to weeks), provision a phone number, and set up opt-out handling.

First-time rejection rates are estimated at 30-50%. Each rejection costs money and days. Most developers give up.

After registration, the developer is responsible for TCPA compliance ($500-$1,500 per violation with no cap), carrier content rules, consent management, opt-out enforcement, quiet hours, and rate limits they probably don't know exist.

RelayKit eliminates all of this.

---

## The Solution — What the Developer Experiences

### Step 1: Pick a use case and answer business context questions

The developer visits RelayKit and picks their category: appointments, orders, verification, customer support, marketing, team alerts, community, or waitlist. A short intake wizard collects business context — business name, EIN (optional for transactional, required for marketing), service details, website, and any additional notes.

### Step 2: Preview and customize messages

The developer sees their complete message set — pre-written, carrier-compliant, and personalized with the business context they just provided. For appointments: booking confirmation, appointment reminder, rescheduling notice, cancellation notice, no-show follow-up, and pre-visit instructions. Each message comes in multiple style variants (Standard, Friendly, Brief) and can be edited inline with real-time compliance checking. Non-compliant messages cannot be saved (D-293).

The website is the message authoring surface (D-279). Message content is saved server-side, tied to the developer's project. The SDK delivers whatever is saved — the developer's codebase never contains message text.

### Step 3: Create an account and build with AI

The developer creates an account (email + OTP verification), then receives three things to paste into their AI coding tool: an install command (`npm install relaykit`), an API key setup prompt, and a build prompt tailored to their business. The AI tool reads the SDK, finds the right integration points in the developer's codebase, and wires up compliant SMS sending.

The developer tests in sandbox mode — messages are validated and logged, delivered to up to 5 verified phone numbers. The sandbox runs the same compliance checks as production.

Developers who don't use a package manager — including those building on no-code platforms — skip the SDK and call `POST /v1/messages` directly with their API key. Same templates, same compliance checks, same results (D-296).

### Step 4: Go live

When the developer is ready for real message delivery, they complete registration. RelayKit handles the entire carrier registration process: brand registration with TCR, campaign submission, compliance site deployment, phone number provisioning. The developer pays $49 at submission. If rejected, full refund. On approval, the developer's sandbox API key is replaced with a live key. Same code, same SDK, same API. Messages start delivering to real phones.

### Step 5: Stay compliant

Compliance is handled at two layers. First, at authoring time: the website's real-time compliance checking prevents non-compliant messages from being saved. Missing business name, missing opt-out language, SHAFT-C content flags — all caught before the message enters the system. If it can't be saved, it can't be sent (D-293).

Second, at delivery time: the messaging proxy enforces operational rules — opt-out (STOP replies honored automatically), consent status (marketing messages require explicit opt-in), quiet hours, and rate limits. The proxy is a delivery engine, not a content enforcement engine.

The developer never has to think about compliance. RelayKit handles it — before the message is saved, and again before it's delivered.

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

### Marketing
Weekly promotion, new arrivals, loyalty reward, seasonal sale, back-in-stock, abandoned cart. Marketing requires EIN and is registered as a separate campaign.

### Team Alerts
Meeting reminder, schedule change, shift confirmation, emergency broadcast, policy update, system status.

### Community
Event reminder, group update, membership renewal, RSVP confirmation, new member welcome.

### Waitlist
Position update, spot available, reservation confirmation, wait time update, cancellation/rebooking.

---

## Marketing Messages

Marketing messages are a separate campaign registration from transactional messages. One transactional + one marketing per project maximum. No multiple transactional verticals — developers needing multiple verticals use multi-project (PRD_11).

**EIN requirement:** Marketing messages require a verified business tax ID (EIN). Transactional-primary developers can add marketing later by providing an EIN in Settings. Marketing-primary developers must provide an EIN during onboarding.

**Information architecture:** No marketing content surfaces during onboarding except a "What about marketing messages?" tooltip on the messages page. After signup, the workspace surfaces a marketing invitation — EIN-aware: developers with an EIN see "add marketing for $49," developers without see guidance on adding an EIN. Pricing always reflects only what the developer is signing up for.

**Consent:** Marketing messages require separate recipient consent (TCPA). RelayKit handles this: the SDK includes top-level consent functions (`relaykit.recordConsent()`, `relaykit.checkConsent()`, `relaykit.revokeConsent()` — D-274), the consent API stores records, and the proxy blocks marketing messages to recipients who haven't opted in.

The words "campaign" and "promotional" never appear in customer-facing copy. The developer sees "marketing messages."

---

## Carrier Strategy

### TCR CSP Registration (Primary Path)
RelayKit is pursuing registration as a Campaign Service Provider (CSP) directly with The Campaign Registry (TCR). This decouples campaign registration from message delivery: RelayKit owns all brand and campaign registrations, and any DCA/connectivity partner handles message delivery. Benefits: carrier-agnostic delivery, ability to switch delivery partners without re-registering campaigns, direct visibility into registration status and issues, no dependency on a single carrier's account management.

Application: csp.campaignregistry.com. $200 one-time fee. 3-5 week approval timeline.

### Delivery Partners (Separate from Registration)
As a CSP, RelayKit chooses connectivity partners purely for message delivery — price, API quality, deliverability, and approval speed. Evaluation needed:

- **Telgorithm:** Fastest campaign approvals (24-48 hours), relationships with all three major DCAs. Requires 500K messages/month minimum — too high for launch.
- **Telnyx:** Worth evaluating for lower-volume CSP connectivity.
- **SignalWire:** Worth evaluating for CSP support and approval timelines.
- **Sinch:** Original carrier choice (D-215). Account upgrade stalled. Can serve as delivery partner once CSP is approved.
- **Bandwidth:** Slowest approvals (5-10+ business days). Not recommended.

### How Registration Works (Once CSP is Active)
1. Developer completes registration form on RelayKit website
2. RelayKit registers the brand with TCR via API (EIN verification, business identity)
3. RelayKit submits the campaign to TCR (use case, sample messages, opt-in description, compliance site URL)
4. TCR shares the campaign with the elected connectivity partner (DCA)
5. DCA reviews for CTIA compliance (24 hours to 10+ business days depending on partner)
6. On approval: phone number provisioned, live API key issued, developer is sending

### Legacy Accounts
- **Sinch:** Trial account at dashboard.sinch.com. Payment rejected with no explanation. Account manager contacted. Not blocking prototype work.
- **Twilio:** ISV Reseller account under VAULTED PRESS LLC. Working but not used for new work. Entity name changing to RelayKit LLC (D-195). Production carrier submission pipeline was built for Twilio and needs remapping when carrier strategy finalizes.

---

## Compliance Infrastructure

### Compliance Site
RelayKit generates and hosts a live, carrier-compliant website for each developer at a neutral domain (e.g., glowstudio.msgverified.com). Four pages: home (business info), privacy policy (with mandatory mobile data non-sharing language), terms of service, and SMS opt-in form. The site looks like the developer's own — no RelayKit branding. Carriers verify this site exists during registration review.

When marketing is active, the compliance site includes marketing consent language automatically.

### Messaging Proxy
Every outbound message passes through RelayKit's delivery proxy before reaching carriers. The proxy handles: template lookup and data interpolation, consent status verification (marketing messages require explicit opt-in), opt-out enforcement (STOP replies honored automatically), quiet hours (8 AM–9 PM recipient local time via NPA-NXX lookup for marketing messages — D-309), and rate limits.

The proxy does not perform content enforcement. Compliance is enforced at authoring time on the website — non-compliant messages cannot be saved, therefore cannot be sent (D-293). The proxy is a delivery engine, not a content judgment layer.

### Consent Management
RelayKit provides full consent lifecycle management:
- **Opt-in:** The SDK's consent functions and generated AI tool prompt include consent form specifications with TCPA-compliant language. The developer's AI tool builds the form natively in their app. On form submission, the developer's app calls `relaykit.recordConsent()` (D-274). RelayKit stores the consent record — timestamped, auditable, retained for 4 years.
- **Opt-out:** STOP replies intercepted automatically by the proxy. No developer code required.
- **Enforcement:** The proxy checks consent before every marketing message. No consent on file = message blocked.

### Compliance Monitoring
When carrier content rules change after messages were authored, RelayKit re-runs compliance checks against saved templates and notifies affected developers. This is a RelayKit operational process — not a customer-facing dashboard feature (D-293).

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

**Zero-config init:** `new RelayKit()` reads `RELAYKIT_API_KEY` from `process.env`. Explicit config available via `new RelayKit({ apiKey })` (D-278).

**Graceful failure by default:** Missing phone → null + console warning. Missing API key → null + console warning. Network error → null + console warning. Compliance blocks → structured result: `{ id: null, status: 'blocked', reason: 'recipient_opted_out' }`. Optional strict mode (`new RelayKit({ strict: true })`) throws `RelayKitError` instead (D-277).

**Static for launch:** All namespaces are exposed regardless of the developer's configured messages. Dynamic method discovery (only exposing namespaces the developer uses) is backlog (D-330 pending).

### How the SDK works with the website (D-279)

The website is the authoring surface; the SDK is the delivery mechanism. The developer picks a use case and customizes messages on the website. Message content is saved server-side, tied to the developer's API key. The SDK sends semantic events (`relaykit.appointments.sendConfirmation(phone, { date, time })`); the server composes the actual SMS from the developer's saved templates. The developer's codebase never contains message text.

Custom messages authored on the website (D-280) are callable via `relaykit.send({ to, messageType: 'custom_post_visit_thankyou', data })`. Same compliance checks, same proxy, same API endpoint underneath.

### Generated AI Tool Prompt (D-331 pending)

After signup, the developer receives a short prompt to paste into their AI coding tool. The prompt includes the developer's business name, use case, and a directive to use all SDK message templates. The AI tool introspects the SDK for details — the prompt is an entry point, not a comprehensive reference. This replaces the earlier SMS_GUIDELINES.md concept for the initial get-started moment. SMS_GUIDELINES.md may return as a separate workstream for deeper compliance context.

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

## Pricing (D-320, D-321)

### Free Tier — Sandbox
$0 forever. Build and test the full SMS integration — all namespaces including marketing. No credit card, no time limit. SDK access, full API access, curated message library, message authoring on website, custom message authoring, sandbox API key, verified phone number. Sends to up to 5 verified phones only.

### Go Live
- **$49 registration fee** at submission. Full refund if rejected. Single payment, no split, no go-live fee.
- **$19/month** subscription. 500 messages included. Dedicated phone number, delivery proxy, compliance site hosting.
- **$8 per 500 additional messages** beyond the included 500 (D-321). Lower increment matches vibe coder usage patterns.
- Second campaign (marketing) is an additional $49 registration fee. Monthly pricing for two campaigns TBD — prior model was $29/mo combined (D-304) but may be revisited.

### Display
"Free while you build and test." as the lead. "When you're ready for real delivery: $49 registration + $19/mo." with "500 messages included. Additional messages $8 per 500." as secondary line. No mention of marketing pricing unless the developer is adding marketing.

---

## Voice and Experience Principles (Summary)

Full document: `docs/VOICE_AND_PRODUCT_PRINCIPLES_v2.md`

**The developer is the hero. RelayKit is the guide.** Every screen, every status message, every error state follows this philosophy.

**Unequivocal claims over hedged explanations.** Marketing copy makes confident statements. Detail lives in FAQs, not inline. "We handle opt-in and opt-out." Not "We provide tools to help you manage consent compliance."

**One-sentence education.** When a constraint needs explaining, one sentence maximum. "Carriers need this to verify your business is real." Not a paragraph.

**Claim, then depth.** Lead with the claim (what 80% read). Support with one sentence (for the curious). Put mechanism detail in secondary surfaces (for the 20% who want to understand how).

**Reduce to the job.** Every element on a screen should serve the developer's current task. If it doesn't, move it somewhere else — even if it's accurate and well-written.

**Vocabulary rules:** Use "marketing messages" never "campaign" or "promotional." Use "registration" not "campaign submission." Use "live" not "active." Never leave a pending state without narrative. Never use "required," "violation," "you must," or "please note." Use "your AI tool builds it" — outcome language, not mechanism (D-257). Use "we handle..." — unequivocal claim language (D-263).

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
- **One product, multiple entry points.** SDK users and API-direct users get the same experience — same templates, same compliance, same pricing. The only difference is how they arrive. (D-296)
- **Compliance at authoring time, not send time.** Non-compliant messages can't be saved. The proxy delivers; the website enforces. (D-293)
- **Website gathers context, AI tool executes.** The RelayKit website asks the business context questions and generates a fully specified brief. The developer's AI tool receives instructions, not questions. (D-300)
- **Decisions are recorded.** 329+ decisions in DECISIONS.md govern everything from architecture to vocabulary. CC reads them every session.
- **One page, one purpose.** The post-signup workspace is a single Messages-centric page that evolves with the developer's lifecycle. No tabs. Setup, testing, registration, and metrics all live on one surface.

---

## What's Built

### Production (committed, working code)
- Project scaffolding (Next.js, Supabase, Stripe, Tailwind)
- Database schema and migrations
- Stripe checkout integration
- Template engine (all 8 use cases, 5-8 base + 3-4 expansion messages per use case)
- Compliance site generator (4-page static HTML, Cloudflare Pages deployment)
- Carrier submission pipeline (state machine, subaccount creation, brand registration, campaign submission, phone provisioning, webhooks) — built for Twilio, needs remapping to TCR/new carrier

### Prototype (UI source of truth, port 3001)
- Full onboarding wizard (vertical picker → business name + EIN → service context → website → notes → phone verify → messages → ready → signup → email verify → get-started)
- Post-signup workspace with six lifecycle states (Onboarding, Building, Pending, Extended Review, Registered, Rejected)
- Messages page with style variants (Standard/Friendly/Brief), AI rewrite, compliance checking with Restore
- Settings page with lifecycle state differentiation
- Sign-in modal with email + OTP flow
- Full marketing pages (home, category landing, messages page, compliance)
- Admin pages (control room, registration pipeline, customer list/detail)

### Validated (experiments complete, ready for production build)
- SDK API surface — per-vertical namespaces, top-level consent, zero-config init, graceful failure, single API endpoint (D-272–D-278)
- Mock SDK package — starting point for production SDK
- Integration pattern — AI tools wire SDK calls into existing codebases correctly on first attempt
- Cross-vertical generalization — same SDK pattern works for appointments and orders on fundamentally different app architectures
- Full experiment log: `docs/BUILD_SPEC_VALIDATION_LOG.md`

### Not Yet Built
- **Single-page workspace** — collapse tabbed dashboard into Messages-centric single page (see WORKSPACE_DESIGN_SPEC.md)
- **Production SDK** — convert mock to TypeScript, `tsup` build pipeline, npm publish (D-272)
- **Sandbox API endpoint** — `POST /v1/messages`, API key validation, template lookup, carrier sandbox delivery
- **TCR CSP registration** — register as Campaign Service Provider, build registration pipeline against TCR API
- **Delivery partner integration** — evaluate and integrate with Telnyx/SignalWire/other for message delivery
- Messaging proxy (PRD_09) — delivery engine: template lookup, interpolation, carrier send, opt-out enforcement, quiet hours (D-293)
- Consent API endpoints — `POST /v1/consent`, `GET /v1/consent/:phone`, `DELETE /v1/consent/:phone`
- EIN verification and business identity pre-validation (D-302, D-303)
- Claude AI support slideout with per-message context and round-trip diagnostics (App Doctor)
