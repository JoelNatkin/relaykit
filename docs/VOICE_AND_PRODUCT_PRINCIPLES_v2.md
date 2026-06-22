# RelayKit Voice & Product Principles
**Version 2.1**
**June 12, 2026**

> **Replaces:** V4_EXPERIENCE_PRINCIPLES_v1.1.md. That document is retired. Remove references to it in CLAUDE.md and other project files.
>
> **What this document does:** Gives CC and any contributor the voice to write in, the rules for what not to say, the hierarchy for when to say anything at all, and the emotional register for every word that survives.
>
> **v2.1:** §3 (Demand Voice) replaced with the Straight-Talking Principles
> (STP). Governs all marketing, blog, and community writing. §1–§2 and
> §4–§6 unchanged.

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

This is the voice before the product — marketing pages, category landings,
blog posts, community comments, social media, READMEs, email. Everywhere
someone hasn't decided yet.

### The Straight-Talking Principles (STP)

Write like a straight-talking person explaining something to a smart, busy
peer — the plain truth, in as few words as it takes. No selling, no
performance.

1. **Say the true thing plainly.** State facts. If a sentence sounds like an
   ad, rewrite it or cut it.
2. **Fewest words that carry the meaning.** Cut adjectives that add no
   information — "complete," "powerful," "seamless," "robust."
3. **Name concrete, real things.** "Reminders, order updates, login codes" —
   not "messaging solutions" or any abstraction.
4. **Don't presume.** "Most apps," "a lot of devs" — not "your app does X."
   Let people recognize themselves.
5. **Don't oversell — and undersell if that's the honest version.** "Most
   apps need a couple" beats "you'll want them all." Understating earns trust.
6. **Plain words, no jargon or buzzwords.** If a normal person wouldn't say
   it out loud to a friend, don't write it.
7. **Confident, not excited.** No exclamation energy, no "game-changing."
   Say what's true and stop.
8. **Vary the rhythm.** Don't repeat a sentence shape — dash contrasts,
   triads, runs of same-length sentences. Don't end by restating the point.
   If a pattern shows up twice, break it the third time.

### Form, not fragments

Write in normal, flowing prose — complete sentences, connected paragraphs.
Vary sentence length naturally: mostly medium, some long, some short.
Brevity means cutting ideas and words that add nothing — never chopping
sentences into fragments. No one-line-paragraph staccato.

### Integrity rules

Every stat is real and sourced — never invented or rounded for effect. The
product is the punchline, not the subject. In communities: answer the
person's actual question first; mention RelayKit only if it genuinely
answers what they asked.

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
7. For demand voice / marketing, blog, and community contexts: follow the STP in §3. Explain the product and the problem concretely and honestly; carrier or compliance terms are allowed where they sharpen the explanation (§4 still applies).

---

## 7. Q&A Authoring Rules

This section governs Q&A cards on sub-vertical and category landing pages. These cards are the developer's first encounter with the specific questions their vertical raises — they should read like answers from a knowledgeable peer, not a compliance officer.

### The job of a Q&A card

Answer the real question a developer in this vertical would actually search for. Make the lead the direct answer. Put the useful fact in the body. Stop.

Q&A cards are not a place to explain RelayKit's infrastructure, reassure the developer that we handle the hard parts, or surface compliance mechanics they'll never need to think about. That content lives in Tier 3 documentation.

### What belongs in Q&A

Questions a developer in this specific vertical would genuinely search for or run into:
- Timing and sequencing decisions ("how many reminders should I send?")
- Recipient targeting decisions ("who gets the alert — the account owner or every team member?")
- Vertical-specific edge cases ("what do I send when a patient no-shows vs. cancels?")
- Practical content decisions ("should this text include the amount or just a link?")
- One opt-in placement card per page — see boilerplates below

### What does NOT belong in Q&A

These topics are either handled entirely by RelayKit or belong in dedicated documentation elsewhere. Do not surface them in Q&A.

**Compliance and registration mechanics:**
- Which TCR campaign type a message registers under
- What an EIN is or that one is required
- How opt-in or consent works mechanically
- SHAFT-C restrictions
- Carrier filtering rules
- 10DLC, A2P, or any carrier jargon
- What happens if you mix transactional and promotional content in the same send
- Registration timelines or approval processes

**Multi-tenant questions — never in Q&A:**
- "Should the message come from my app's name or my customer's business name?"
- Any question about sending on behalf of another business
- Any question that implies the recipient might recognize a different brand than the one registered

These questions belong in the multi-tenant awareness widget elsewhere on the page. The rule is simple: if a different business name appears in the sender frame, that business needs its own registration. Q&A cards are not the place to surface this — the widget handles it.

**RelayKit capability reassurances:**
- "RelayKit handles X for you"
- "We manage Y so you don't have to"
- Questions whose answer is just "yes, we do that"
- Anything that exists to reassure rather than inform

**Generic questions that don't belong to this vertical:**
- "What's the difference between transactional and marketing SMS?" (universal, belongs in docs)
- "Can I send to international numbers?" (universal, belongs in docs)
- Any question that could appear unchanged on every vertical's page

### The test

Before writing a Q&A card, ask: would a developer building in this specific vertical actually search for this? If the question could appear unchanged on any other vertical's page, it's too generic. If the answer is primarily "RelayKit handles that," it's a capability reassurance, not a Q&A card. Cut it.

### Dos and don'ts — examples

| Do | Don't |
|---|---|
| "Who gets the deploy alert — the account owner or every engineer on the team?" | "Do deploy alerts require prior SMS consent from each recipient?" |
| "What's the difference between a system alert and an on-call page?" | "Which TCR campaign type do team alerts register under?" |
| "How many appointment reminders is too many?" | "Can I send status alerts to users who haven't opted in to SMS?" |
| "What do I send when a patient no-shows vs. cancels?" | "What's the right way to separate transactional and marketing consent?" |
| "Should the post-appointment text go before or after the CSAT follow-up?" | "Should the text come from my app's name or my customer's name?" |
| "Can I include the pay amount in a payday text?" | "RelayKit handles opt-outs — do I need to build anything on my side?" |

### Card budget

Each page has a fixed number of Q&A cards. Every card must earn its place. A useful distribution:
- 1–2 cards on the primary workflow decisions specific to this vertical
- 1 card on a content or targeting decision the developer genuinely has to make
- 1 opt-in placement card using the appropriate boilerplate below

Never use a card to tell the developer that RelayKit handles something. If RelayKit handles it, the developer doesn't need to know about it until they're reading Tier 3 docs.

### Opt-in placement — boilerplate cards

Every sub-vertical page includes exactly one opt-in placement card. Use the boilerplate that fits the vertical's audience. The only adaptation is the bracketed text — do not rewrite the structure or add compliance explanation.

**Boilerplate A — consumer-facing verticals** (appointments, orders, waitlist, community, customer support, etc.):

> **Q: When do I ask users if it's okay to text them?**
> Lead: Right when they give you their phone number for the first time.
> Body: For [this vertical], that's usually [specific moment — e.g. "when they book" / "at checkout" / "when they create an account"]. That's when texting makes sense to them and the ask feels natural. RelayKit hosts an opt-in page for your app — your AI tool will know how to link to it from the right spot in your flow.

**Boilerplate B — internal/team-facing verticals** (HR, CRM internal alerts, team chat, team alerts, etc.):

> **Q: Do I need to ask [employees / reps / team members] before texting them?**
> Lead: Yes — being part of your team doesn't automatically mean they agreed to receive texts.
> Body: The right place to capture it is during [onboarding / account creation / their first login]. RelayKit hosts an opt-in page for your app — your AI tool will know how to wire it in once you tell it where new [employees / users / reps] set up their profile.

Note: CRM has both an internal lane (rep alerts — Boilerplate B) and a consumer-facing lane (prospect demo reminders — Boilerplate A). Use whichever fits the primary workflow the page leads with.

### Register: write for a builder, not an engineer

Q&A cards are read by people building apps — often with an AI coding tool, not from a background in backend systems. Write as if you're answering a reasonable question from someone who understands their product but isn't steeped in SMS infrastructure, webhook patterns, or carrier mechanics.

The practical test: would this question and answer make sense to someone building their first app? If the question assumes knowledge of data models, event systems, or API integration patterns, reframe it around what the builder is trying to accomplish. If the answer walks through a technical implementation, cut the implementation and give the principle — their AI tool handles the code.

Avoid: questions that assume the reader knows what a webhook is, how MO messages work, or how to route API calls. Avoid answers that describe what to build rather than what to decide.

Aim for: a knowledgeable friend who knows how SMS works and can tell you what to do, without assuming you already know the vocabulary.




---

*RelayKit LLC — v2.1*
*Supersedes: V4_EXPERIENCE_PRINCIPLES_v1.1.md*
