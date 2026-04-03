# RelayKit Voice & Product Principles
**Version 2.0**
**April 2, 2026**

> **Replaces:** V4_EXPERIENCE_PRINCIPLES_v1.1.md. That document is retired. Remove references to it in CLAUDE.md and other project files.
>
> **What this document does:** Gives CC and any contributor the voice to write in, the rules for what not to say, the hierarchy for when to say anything at all, and the emotional register for every word that survives.

---

## 1. The Product Principle

The product is the message. If the interface needs explanation, the interface is wrong.

Design the interaction so it's obvious. If it can't be obvious, make it learnable through doing. If it can't be learned through doing, use a few words. If a few words aren't enough, the design needs to change — not the copy.

Every word in the product earns its place by being the only way to communicate what the interface can't show. There is no other justification for text on a screen.

---

## 2. Product Voice

This is the voice inside the product — dashboard, messages page, settings, errors, onboarding, states, tooltips, modals, buttons. Everywhere after someone has arrived.

### What it sounds like

Quiet. Confident. Short. It states facts. It doesn't sell, explain, or educate unless someone asks. It treats the user as someone who is busy doing something and doesn't want to be interrupted.

A button says what it does. A status says what's true. An error says what went wrong and what to do. Nothing else.

### Examples

| Surface | Good | Bad |
|---|---|---|
| Button | Go live | Submit your registration to begin the carrier approval process |
| Status | Live | Status: Active — your registration has been approved by carriers |
| Status | In review — a few days | Pending — waiting for carrier approval (estimated 3-5 business days) |
| Error | That phone number doesn't look right | Invalid phone format — use E.164 format (e.g. +15551234567) |
| Error | Something went wrong. Try again. | An unexpected error occurred while processing your request |
| Empty state | No messages sent yet | You haven't sent any messages. Get started by sending your first test message to verify your integration is working correctly. |
| Marketing status | Marketing: being reviewed | Marketing campaign registration has been submitted to carriers and is currently pending approval |
| Pricing | Marketing adds $10/month | Enabling marketing messages will add $10/month to your subscription to cover additional carrier infrastructure costs |
| Toggle label | Marketing messages | Enable marketing message capabilities for your account |
| Confirmation | Done | Your changes have been saved successfully |
| Rejection | Carriers flagged your business description. Here's what to fix. | Registration failed due to insufficient business description |

### The one-sentence rule

If the product must explain something — a field label that's ambiguous, a state that's unfamiliar, a restriction that isn't obvious — one sentence. That's the ceiling. If the explanation needs two sentences, the design has a problem that copy can't fix.

The one sentence should be a plain fact, not a reframe, not a lesson, not a sales pitch. "Registration usually takes a few days." Not "Carriers are carefully reviewing your traffic profile to ensure compliance with industry standards."

---

## 3. Demand Voice

This is the voice before the product — marketing pages, category landings, use case selection, social media, READMEs, blog posts, email. Everywhere someone hasn't decided yet.

### What it sounds like

Human. Concrete. Grounded. It talks about people and their days, not systems and their features. It's confident without being loud. It never asks for credit. It paints a picture the reader recognizes, then steps back.

### The scenario principle

The demand voice works by recognition. The reader sees a situation they know — from their own life, their customers' lives, or the life of someone they're building for — and realizes a text message would fix it.

Rules for scenarios:

**Always a person, never a system.** "Your customer is sitting in the parking lot wondering if their appointment is still on." Not "reduce no-show rates with automated appointment reminders."

**Always specific, never categorical.** "The dog walker sending texts one at a time from their personal phone." Not "small businesses with manual communication workflows."

**The text message is the resolution.** The story ends with the text arriving and the problem dissolving. The product is the last sentence, not the first.

**Mundane on purpose.** Haircuts, deliveries, pickups, prescriptions, soccer practice. The power is in the recognition, not the stakes. No transformation language. No "empowering." No drama.

### The rhythm principle

Alternate between the human moment and the quiet fact. Never a wall of scenarios — gets sappy. Never a wall of facts — gets boring. Moment, fact, moment, fact.

> Your customer gets a text when their table is ready. No registration delays, no compliance headaches, no code changes.

> There's a tutoring company where parents don't know if the session is confirmed until they call. One text message, sent automatically, fixes that. We make that trivially easy.

### The grounding principle

The demand voice is warm but never soft. Seriousness comes through in the facts that sit next to the scenarios. Pricing stated plainly. Timeframes stated plainly. What you get, stated plainly. The warmth makes people care. The facts make people trust.

> Build and test for free. No credit card, no time limit.
> When you're ready to go live: $49 to register. $150 after approval. $19/month.
> That's it.

### What the demand voice never does

It never explains infrastructure. 10DLC, carrier registration, TCR, consent management, TCPA, SHAFT-C — none of these appear in demand-voice contexts. If someone only ever sees the demand voice, they think sending compliant texts from an app is just... easy. Because it is. For them.

It never describes friction it has eliminated. The old way is obvious to anyone who's tried the old way. If they haven't tried it, they don't need to hear about it. The contrast is experienced, not explained.

It never names competitors.

---

## 4. The Contrast Principle

We don't talk about the old way. We don't describe the problem in terms of what used to be hard. We don't list the steps we've eliminated. We don't show a "before RelayKit" column next to an "after RelayKit" column.

If someone visits Twilio's docs and then visits RelayKit, the contrast is self-evident. If someone visits RelayKit without ever seeing Twilio, they just think this is how SMS works. Both experiences are fine. Both lead to using RelayKit.

A comparison page may exist for SEO or for developers actively evaluating alternatives. If it does, it's factual and specific — what each platform requires the developer to do. Not combative, not dismissive. Just a clear table. It lives in documentation, not in the primary marketing flow.

---

## 5. The Information Hierarchy

Three tiers. The default is always the lowest tier that gets the job done.

### Tier 1: Show, don't tell (default)

The interface communicates through design. A green dot means live. A phone buzzes with a test message. A counter shows messages sent. No words needed.

This is the target state for every interaction. If a screen is at Tier 1, it's done.

### Tier 2: A few words (when the interface can't show it)

Short, factual, confident. A button label. A status phrase. A one-sentence explanation. Never a paragraph. Never a pitch. The words exist because the interface alone would be ambiguous.

Most product surfaces live at Tier 2. The goal is to keep pushing toward Tier 1.

### Tier 3: Full explanation (for people who go looking)

Documentation. FAQs. Expandable sections. Tooltips the user deliberately opens. This is where 10DLC, carrier rules, consent mechanics, compliance details, and registration nuances live.

The voice in Tier 3 is still human, still clear, still concise by documentation standards. Knowledgeable friend, not legal brief. But it's allowed to be thorough. Someone reading Tier 3 content has chosen to learn. Respect that choice by being complete.

**The rule:** Tier 3 content is never referenced or surfaced in Tier 1 or Tier 2 contexts unless the user explicitly asks. Infrastructure stays behind the curtain until someone pulls the curtain aside.

---

## 6. The Kill List

Words and phrases that never appear in Tier 1 (product surface) or Tier 2 (inline copy). They may appear in Tier 3 (documentation) when technically necessary.

### Compliance and carrier jargon

| Kill | Why | Replacement (if needed) |
|---|---|---|
| 10DLC | Means nothing to the user | Don't mention it. If you must: "carrier registration" |
| Campaign | Carrier/TCR jargon | "messages" or "marketing messages" |
| Promotional | Dated | "marketing" |
| TCR / The Campaign Registry | Infrastructure | Don't mention it |
| TCPA | Legal acronym | "consent rules" if you must, but prefer "we handle consent" |
| SHAFT-C | Compliance acronym | Don't mention it |
| Compliance (as a standalone noun) | Abstract, corporate | Specific: "opt-out handling" or "message scanning" or don't mention it |
| Opt-in / opt-out (as jargon) | Fine in documentation, too technical for product surface | "consent" or just handle it silently |
| A2P | Industry jargon | Don't mention it |
| Carrier | Too inside-baseball for most users | "go live" or just describe the outcome |
| Trust score | Means nothing to the user | Don't surface it |

### Tone killers

| Kill | Why | Replacement |
|---|---|---|
| Required | Parental | Don't say it. Design the interface so it's obvious. |
| Not allowed | Restriction framing | Rewrite the interaction. If unavoidable: "that won't work because..." |
| Failed | Blame framing | What happened + what to do |
| Violation | Legal threat | Never use |
| You must | Coercive | Never use |
| Please note | Passive-aggressive bureaucratic | Never use |
| Error (for carrier rejections) | Rejections aren't bugs | Describe what happened plainly |
| Pending (alone) | Dead-end word | Always pair with a timeframe or what's happening |
| Seamlessly / seamless | SaaS cliché | Just describe what happens |
| Powerful | Empty superlative | Show the power, don't claim it |
| Leverage | Corporate jargon | "use" |
| Robust | Meaningless | Say what it actually does |
| Utilize | "Use" exists | "use" |
| Unlock | Gamification language | Say what becomes available |
| Empower | Corporate inspiration language | Never use |
| Excited (as "we're excited to...") | Performative | Just announce the thing |

### Over-explanation patterns

These aren't single words — they're structural patterns to avoid in Tier 1 and Tier 2.

**The mechanism reveal.** "We handle opt-out — here's how: when a recipient texts STOP, our proxy intercepts the message, updates the consent ledger, confirms with a reply, and blocks future messages to that number." Just say "We handle opt-out." The mechanism is Tier 3.

**The hedge-then-claim.** "While SMS compliance can be complex, RelayKit simplifies the process by..." Just make the claim. "We handle compliance."

**The unnecessary context.** "US carriers require all businesses sending text messages to register their brand through a process called 10DLC. RelayKit handles this registration for you." Just: "We handle registration." The context is Tier 3 for anyone who wants it.

**The feature as a sentence.** "RelayKit includes a built-in compliance site generator that automatically creates and hosts a four-page carrier-compliant website for your business." Just: "We build and host your compliance site." Or even less — just show it in the dashboard.

---

## CC Instructions

When building any screen or writing any user-facing text:

1. Start at Tier 1. Can the interface communicate this without words? If yes, stop.
2. If words are needed, keep them at Tier 2. One sentence max for explanations. Factual, not promotional.
3. Check the kill list. If you've written a killed word, rewrite or remove.
4. Check the voice. Product surface = quiet, confident, short. Marketing surface = human scenarios + quiet facts.
5. Ask: would removing this text make the screen worse? If the answer is "no" or "maybe not," remove it.
6. Never explain infrastructure in Tier 1 or Tier 2. If the user needs to understand carrier mechanics, registration details, or compliance rules, that content lives in Tier 3 — documentation, FAQs, or expanded views the user deliberately opens.
7. For demand voice contexts: lead with a recognizable human moment, ground with a plain fact. Never lead with a feature.

---

*RelayKit LLC — v2.0*
*Supersedes: V4_EXPERIENCE_PRINCIPLES_v1.1.md*
