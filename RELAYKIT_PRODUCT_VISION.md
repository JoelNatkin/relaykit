# RelayKit — Product Vision
## The SMS Context Layer for AI Coding Tools
### Established: March 12, 2026

---

## 1. What RelayKit Is

RelayKit is the SMS context layer for AI coding tools. It gives a developer's AI everything it needs to build a complete, compliant SMS feature on the first try — the message templates, the trigger logic, the compliance rules, the API spec, and the right questions to ask before writing a line of code.

The build spec is the product. The API is the runtime.

RelayKit is not an SMS API in the traditional sense. A traditional SMS API gives you endpoints and says "figure it out." RelayKit gives your AI coding tool a complete brief — one that encodes the domain knowledge a developer would otherwise spend hours researching — and lets the AI do the building. The developer picks a use case, gets their documents, hands them to their AI, and watches it work.

The compliance infrastructure (carrier registration, opt-out enforcement, quiet hours, content scanning, drift detection) runs underneath. It's why the product works. But it's not what the developer experiences first. What they experience first is: I told my AI to build SMS into my app, and it did.

---

## 2. The Developer's Experience

This is the story from the developer's perspective, beginning to end.

### Discovery

A developer needs SMS in their app. They find RelayKit. The promise is immediate and specific: **"Tell Claude Code to build your messaging feature. It might just work on the first try."**

They don't see a wall of compliance jargon. They don't see a Twilio signup flow. They see a product that speaks their language — AI-native, developer-first, "here's what you're getting" not "here's what you need to learn."

### Category selection

The developer picks a use case category: appointments, orders, verification, support, marketing, internal, community, or waitlist. That's the only decision that matters at this stage. The category defines their registration scope, their message library, their compliance rules, and the shape of their build spec.

There is no plan builder. There is no message curation step. There is no "choose which messages you want." The category is enough.

### The messages page

After picking a category, the developer sees every message type available for their use case — booking confirmations, reminders, cancellations, rescheduling notices, no-show follow-ups, pre-visit instructions, and more. All of them. Not a selection they need to make, but a catalog of what's possible.

Each message card shows the message name, a realistic preview personalized with whatever the developer entered (their app name, their website), a template view toggle showing the raw variables, and an AI prompt nudge — a one-line suggestion like *"Write a booking confirmation that includes service type, date, and time."* Every element is copyable.

The opt-in consent form sits alongside the messages, updating dynamically to reflect the full scope of what the category covers. It's educational: this is what your users will see, this is the language that keeps you compliant, this is what you'll copy into your app.

Marketing messages are visible below a clear divider. They're part of the reference — the developer can see what's possible — but they're marked as requiring a separate marketing campaign. This is not a gate or an upsell. It's a fact about how carrier registration works: marketing requires separate consent and a separate campaign submission.

The messages page is a magazine, not a form. It reads like "here's what you're getting" not "here's what you need to do." The developer leaves this page understanding the full landscape of messages their app could send, with copy buttons and AI prompts that make it trivially easy to bring that content into their build conversation.

### The build spec

The developer generates their build spec. This is not a document they assemble or curate. It's generated from their category selection — the full canonical implementation for their use case, ready for an AI coding tool to consume.

The build spec contains:

**The complete message library for their category.** Every message type, with trigger logic, template text, variable lists, and compliance notes. Not a curated subset — the full set. The AI coding tool will help the developer decide which ones to implement during the build conversation.

**A "Before building, ask me" section.** Clarifying questions the AI should ask before writing code — questions RelayKit knows matter but can't answer for the developer. Do you have an existing database schema? What framework handles scheduled jobs? Where does the opt-in form live in your existing signup flow? What language is your backend? These questions are use-case-aware: an appointment app gets different questions than a verification system.

**The technical integration spec.** Environment variables, API endpoint, authentication, the `sendSMS()` function signature, webhook handler structure, error codes and what they mean, opt-in form requirements with exact disclosure language.

**Condensed compliance rules.** The essential boundaries from SMS_GUIDELINES.md — what they can send, what they can't, what requires a separate campaign. Written for the AI to internalize, not for the developer to memorize.

The result is a document that, when handed to an AI coding tool, produces a complete working SMS integration — not a utility function, not a scaffold, but a feature. The messages send at the right times, the opt-in form collects consent correctly, the error handling is real, and the compliance patterns are baked in.

### The "Before building, ask me" pattern

This is what makes the first-try claim credible.

RelayKit knows SMS compliance cold. It knows what triggers each message type, what consent language is required, what error codes mean, what carriers will flag. But it doesn't know the developer's codebase — their framework, their database schema, their existing signup flow, their deployment environment.

The build spec's clarifying questions bridge that gap. When the AI encounters the "Before building, ask me" section, it pauses and asks. The developer answers. The AI then builds an integration that fits their specific codebase, not a generic one that needs rework.

This reframes the build spec from a document into a **handoff from a knowledgeable collaborator** — one who has done the compliance research, prepared all the materials, and is honest about what only the developer can answer. That's more useful and more honest than a raw API reference, which gives you nothing and leaves you to figure out the questions yourself.

### SMS_GUIDELINES.md — the AI's compliance brain

SMS_GUIDELINES.md ships alongside the build spec. It's not documentation for the developer — it's a persistent compliance co-pilot for their AI coding tool.

When the AI reads SMS_GUIDELINES.md, it becomes capable of:

- Answering "Can I send this?" about any message the developer proposes
- Knowing that if the developer implements message type A, they also need B
- Knowing that if message A includes content X, then message C must include Y
- Warning when a proposed message drifts outside the registered campaign scope
- Generating opt-in language that's compliant for the developer's specific use case
- Understanding what requires a separate marketing campaign vs. what's covered

The guidelines document is comprehensive enough that an AI coding tool given *only that file* can serve as a fully competent SMS compliance advisor for that specific developer's business. It contains the approved message types, the prohibited content, boundary examples, compliance mechanics (opt-in, opt-out, quiet hours), and the developer's use case context.

This is half the product. The build spec gets the integration built. The guidelines keep it compliant over time — through every code change, every new message type, every "can I also send this?" conversation the developer has with their AI.

### The platform setup moment

The developer downloads two files: SMS_BUILD_SPEC.md and SMS_GUIDELINES.md.

The download moment includes platform-specific instructions — three steps max, one line per platform:

**Claude Code:**
> Put both files in your project root. Then: `"Read SMS_BUILD_SPEC.md and build my messaging feature."`

**Cursor:**
> Put both files in your project root. Open Composer and say: `"Read SMS_BUILD_SPEC.md and build my messaging feature."`

**Other tools:**
> Same pattern. Put the files where the AI can see them. Tell it to read the build spec.

That's the entire product promise made concrete in one sentence. No tutorial. No video. No onboarding sequence. Drop two files, say one sentence, watch it build.

### Sandbox

The developer's AI builds the integration. They test it in sandbox — real messages to their verified phone number, real compliance enforcement on every send, real error codes for anything that would fail in production.

The sandbox is where they prove the integration works. It's not the main event — the build spec conversation was the main event. The sandbox is confirmation.

### Registration

When the developer is ready to go live, they pay ($199 setup + $19/mo for transactional). RelayKit handles everything: brand registration, campaign submission, phone number provisioning, compliance site generation and deployment. The developer answers a few business details questions (if they haven't already) and waits.

Registration takes 2–3 weeks (10–15 business days). The developer's sandbox stays live the entire time. The dashboard says "keep building" at every pending state — this is not dead time.

When registration clears, the developer gets MESSAGING_SETUP.md (the build spec upgraded with production credentials) and SMS_GUIDELINES.md (production edition with canon messages and drift detection rules). They swap one environment variable. Their app works in production.

### Marketing capability

If a developer wants to send promotional messages — discount offers, review requests, seasonal campaigns — that's a separate marketing campaign registration. Not an upgrade. Not a checkbox during initial setup. A second campaign on the same subaccount, submitted when the developer is ready.

This is intentional. Carrier registration works better when each campaign tells a clean, focused story. A transactional campaign that says "we send appointment reminders" gets approved faster and more reliably than a mixed campaign that says "we send appointment reminders AND promotional offers." Since RelayKit's core value is high first-submission approval rates, we keep the initial registration maximally clean.

The messages page shows marketing messages from day one — they're visible, inspirational, clearly marked as requiring a separate step. When the developer wants them, it's a dashboard action: "Add marketing campaign." RelayKit handles the second registration. The developer adds $10/mo to their subscription and gets a full marketing message library.

---

## 3. The Full-Library Principle

Every message in RelayKit's library for a given category is available to the developer. There is no selection step. There is no curation. There is no "enable this message" toggle. The developer's category choice unlocks the entire library.

This means:

- The build spec includes all message types for the category, not a subset
- The messages page shows all message types, not a filtered view
- The AI coding tool sees the full landscape and helps the developer choose which to implement
- The developer is free to use any message that fits within their registered campaign scope

The intelligence about "which messages should I actually implement?" lives in the conversation between the developer and their AI coding tool — not in a selection UI on RelayKit. The AI, armed with the build spec and guidelines, asks the right questions: "You're building a booking app — do you need cancellation notices? What about no-show follow-ups?" The developer answers, and the AI builds accordingly.

This is a better experience than a plan builder for three reasons:

1. **Lower activation energy.** The developer doesn't have to understand the full message taxonomy to get started. The AI handles the narrowing.
2. **Better personalization.** The AI can ask context-aware questions ("Do you have a rescheduling flow in your app?") that a checkbox grid can't.
3. **No anxiety of choice.** The developer doesn't worry about whether they selected the right messages. Everything is available; the AI helps them use what they need.

---

## 4. The Anti-Cookie-Cutter Strategy

RelayKit submits 5 sample messages per campaign to TCR. Every use case category has 5–8 base messages available. If every registration submitted the same 5 messages with the same wording, reviewers would notice the pattern and flag it.

The anti-cookie-cutter strategy has two layers:

**Wording variation.** The 5 sample messages are rendered using the developer's intake data — their business name, business description, service type, app name. A dental practice's appointment reminder reads differently from a hair salon's, even though both are "appointment reminder" templates. The template engine uses this data to produce natural-sounding, business-specific language. No two registrations look identical.

**Selection rotation.** With 5–8 base messages per category, we don't always submit the same 5. The selection algorithm picks 5 that maximize variety (different message types, different triggers, different patterns) while ensuring the most important messages (those with opt-out language and business name) are always included. Across registrations, the specific 5 chosen will vary.

The combination means that even within a single category, every registration tells a slightly different story to the reviewer — same use case, different business, different message selection, different wording. This protects both RelayKit's ISV reputation and each individual developer's approval odds.

---

## 5. The Positioning

### The headline

> **"Tell Claude Code to build your messaging feature. It might just work on the first try."**

### Why it's true

No other SMS API can make this claim because no other SMS API gives the AI coding tool what it needs upfront:

- The complete message library for the developer's use case
- The trigger logic for every message type
- The compliance rules specific to their category
- The API spec and authentication
- The opt-in form language, exact and compliant
- The clarifying questions to ask before starting
- A canonical reference implementation to build from

The AI isn't guessing. It's executing against a complete spec built by people who know SMS compliance. The first-try success rate is high because the hard thinking happened before the AI touched the keyboard.

### The speed claims

> "See your first SMS in 5 minutes. Full integration built by your AI from there."

The 5-minute claim is about the sandbox: email → magic link → API key → phone verification → test message. The "built from there" claim is about the build spec: drop the file, give the instruction, the AI builds a complete feature.

Neither claim implies production readiness. Neither overreaches. Both are differentiated because no competitor can say them.

### What RelayKit is not

**Not an SMS API.** It's the context layer that makes any AI coding tool capable of building SMS correctly. The API is the runtime underneath.

**Not a message editor.** The messages on RelayKit are reference material — previews, templates, inspiration, copy targets. The real message authoring happens in conversation with the AI, during the build.

**Not a compliance quiz.** The developer doesn't need to learn SMS compliance. Their AI learns it by reading SMS_GUIDELINES.md. The developer just builds.

**Not a form to fill out.** Category selection is one click. Registration details are collected at payment time, not before. The messages page is a catalog, not a task.

**Not a nanny.** RelayKit is a trusted guide, not a nagging parent. The developer is a capable professional who accomplished something real. The product frames everything as "here's what you're getting" not "here's what you need to do."

---

## 6. The Registration Model

### Category = scope

When a developer picks a category, they've defined their registration scope. Each category maps to a specific TCR campaign type (CUSTOMER_CARE for appointments, DELIVERY_NOTIFICATIONS for orders, TWO_FACTOR_AUTHENTICATION for verification, etc.). The registration submission — brand, campaign description, sample messages, opt-in language — is generated deterministically from the category and the developer's business details.

### Transactional first, always

The initial registration is always transactional. This is not a limitation — it's a strategy. A transactional-only campaign submission tells a tight, coherent story to the TCR reviewer: this business sends appointment reminders (or order updates, or verification codes). All 5 sample messages demonstrate the same type of traffic. The campaign description, opt-in language, and compliance site all align. Clean story, high approval rate.

### Marketing is always a separate campaign

Promotional messages (discount offers, review solicitations, seasonal campaigns, feature announcements) require:

- A separate TCR campaign registration
- Separate, explicit marketing consent from recipients (unchecked checkbox, specific to promotional messages)
- A separate consent record per recipient

This is not a RelayKit rule. It's a carrier/legal requirement. Marketing consent is legally distinct from transactional consent under TCPA. Mixing them in a single campaign submission dilutes the story for the reviewer and introduces consent complexity that's better handled cleanly.

RelayKit makes the second campaign effortless: dashboard action, RelayKit handles the submission, developer adds $10/mo. But it's always a second campaign, never a mode on the first one. "Upgrade" is never the word. "Add marketing campaign" is.

### The 5 sample messages

TCR accepts 2–5 sample messages per campaign. RelayKit always submits 5 — the maximum — because more samples give the reviewer a fuller picture of the traffic profile, and fuller pictures get approved faster.

For transactional campaigns, all 5 samples are transactional messages from the category library. No marketing messages consume sample slots. This is another benefit of the "marketing is always separate" model — the transactional submission is undiluted.

Selection and rendering follow the anti-cookie-cutter strategy described in Section 4.

---

## 7. The Documents

RelayKit generates three markdown documents across two lifecycle stages. Together they form the complete developer toolkit.

### Sandbox stage (before payment)

**SMS_BUILD_SPEC.md** — The primary deliverable. Contains the full message library, trigger logic, "Before building, ask me" questions, technical integration spec, and condensed compliance rules. The AI reads this and builds a complete SMS feature.

**SMS_GUIDELINES.md (sandbox edition)** — The compliance co-pilot. Everything the AI needs to advise on message content, consent, and compliance — except production credentials and canon messages (which don't exist yet).

### Production stage (after registration)

**MESSAGING_SETUP.md** — The build spec upgraded with production credentials, canon messages, webhook secret, compliance site URL, and production enforcement details. The developer swaps one API key and their app works.

**SMS_GUIDELINES.md (production edition)** — Adds canon messages (the drift detection baseline), production enforcement rules, and the message preview endpoint for validating new message types before deployment.

### The one-key-swap promise

The code structure is identical between the build spec and MESSAGING_SETUP.md. A developer who built from the build spec changes one environment variable (`RELAYKIT_API_KEY` from sandbox to live) and their app works in production. This is a hard constraint on document design — if the function signatures, error codes, or integration patterns differ between sandbox and production documents, the promise is broken.

---

## 8. The Keep-Building Philosophy

Registration takes 2–3 weeks. That's carrier reality — not RelayKit's fault and not something to hide. But it's also not dead time.

The sandbox stays live throughout registration. Every pending state in the dashboard includes a "keep building" prompt. The developer's build spec works, their test messages send, their integration improves. By the time registration clears, they're not "starting to build" — they're finishing.

Every pending state displays: what's completed, what's happening now, what's next, and an invitation to keep working. No bare status badges. No empty waiting rooms. The narrative is always forward-looking: you're making progress, and so are we.

This philosophy extends to the entire product experience. RelayKit never makes the developer feel like they're waiting for permission. They picked a category, they got their build spec, their AI built their feature, they tested it, and when registration clears, they flip a key and go live. The momentum never stops.
