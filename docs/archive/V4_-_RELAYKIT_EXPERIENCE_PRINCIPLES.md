# RelayKit Voice & Experience Principles
**Version 1.0 — For CC and product decisions**

---

## The Core Philosophy

Most compliance tools treat the developer as a subject — someone who must be managed, warned, corrected, and herded through a process they don't fully understand. The natural result is a product that feels like a nagging parent: *you have to do this, you can't do that, this isn't allowed.*

RelayKit operates from a completely different premise.

**The developer is the hero. RelayKit is the guide.**

The 10DLC registration process is genuinely hard. It trips up funded startups. It has arcane rules, opaque carrier review windows, and consequences for getting it wrong that can tank an entire SMS program. A developer who successfully navigates it and comes out the other side with an approved, live campaign has done something real. They're not just "compliant" — they're operating at a professional level that most of their peers haven't reached.

RelayKit's job is to make that journey feel like what it actually is: a rite of passage into a more capable, more protected, more professional version of themselves as a builder.

The constraint is the credential. The approval is the achievement. The dashboard is the proof.

---

## The Framing Shift: Every Screen, Every State

The table below defines how RelayKit translates compliance reality into developer empowerment. This framing governs all UI copy, status language, error states, and onboarding text throughout the product.

| The Compliance Reality | Nagging Parent (Never Say) | Trusted Guide (Always Say) |
|---|---|---|
| You need a privacy policy | "A privacy policy is required" | "Carriers verify this page exists before trusting your traffic" |
| You can't send that message | "This content is not allowed" | "That phrasing gets flagged as gray-market — here's what gets through" |
| Your registration is pending | "Pending — waiting for approval" | "You're in carrier review. Most campaigns clear in 5–7 days." |
| The form needs more detail | "Required field missing" | "Carriers need this to verify your business is real — one more thing" |
| Your campaign was rejected | "Registration failed" | "Carriers flagged this. Here's exactly why, and what approved campaigns look like." |
| This is your compliance site | "Required compliance documentation" | "This is what tells carriers you have real opt-in practices — it's part of why your traffic gets trusted" |
| You're approved | "Status: Active" | "You're live. Here's what you can build now." |

---

## The Hero's Journey, Mapped to RelayKit

Joseph Campbell's monomyth — the structure underlying every hero story from Star Wars to The Odyssey — is directly applicable here. The developer's experience with 10DLC registration follows the same arc, whether they know it or not. RelayKit should consciously design every touchpoint to honor that arc.

### Act I: The Ordinary World → The Call

**Who the user is when they arrive:** A developer who needs SMS. They've shipped code before. They know Twilio exists. They've hit a wall — either they tried to register on their own and got lost, or they Googled "10DLC registration" and immediately felt overwhelmed.

**What they need at this moment:** To feel like this is solvable. Not easy — solvable. There's an important difference. Easy would be dishonest. Solvable, with a guide, is true.

**RelayKit's job in this act:**
- The landing page and intake wizard entry point should name the problem honestly, not minimize it
- Signal immediately that RelayKit has been here before, knows the terrain, and has already done the hard work of understanding what carriers actually want
- The sandbox (instant, pre-registration) gives them a first win before they've committed anything — a taste of the destination

**Copy principle for this act:** *Name the dragon. Then hand them a sword.*

---

### Act II: Crossing the Threshold → The Road of Trials

**Who the user is during intake:** Someone who has committed. They've entered the wizard. They're answering questions about their business, their use case, their messages. This is where friction lives — and where the nagging parent impulse is strongest.

**What they need at this moment:** To understand *why* each step matters, not just that it's required. When they know why, the friction becomes signal: *this process is thorough because what's on the other side is real.*

**RelayKit's job in this act:**
- Every field that might feel bureaucratic gets a one-line "why this matters" annotation — not a tooltip wall, just a single sentence that reframes the ask
- The use-case selection screen names what kind of builder they are — that's identity work, not just categorization
- Generated compliance artifacts (campaign description, sample messages, compliance site) should be briefly surfaced as *what they represent*, not just delivered silently as output
- Read-only fields should be explained as protection, not restriction: *"We lock this because carrier-evaluated content needs to match exactly what we submit — edits here cause rejections"*

**Copy principle for this act:** *Every constraint explained is a wall that becomes a door.*

---

### Act III: The Ordeal → The Reward

**The pending state is the most emotionally charged moment in the product.** This is where most compliance tools fail completely — they leave the user in a void with a status badge and no narrative.

The carrier review window is not dead time. It's the ordeal. The hero has submitted their application to the gatekeepers. They're waiting for judgment. How RelayKit holds them during this period defines whether they feel anxious or confident.

**RelayKit's job in this act:**
- The dashboard pending state is a narrative, not a status bar
- Show what has already been completed and verified — the accumulation of what they've built
- Explain what's happening on the carrier side in plain language: who's reviewing, what they're looking for, why it takes the time it takes
- The sandbox remains live and usable — this isn't a waiting room, it's a staging environment. The developer can keep building. The SMS layer is ready; it's waiting for the carrier's signature.
- Never show a raw progress percentage without context. "Your campaign is in carrier review — step 3 of 3" is better than "67% complete"

**Specific copy pattern for pending states:**

> *Your brand is verified. Your campaign is submitted. Carriers are reviewing your traffic profile — this is the step that makes everything downstream trustworthy. Most campaigns clear in 2–3 weeks (10–15 business days). In the meantime, your sandbox is live. Keep building.*

**For rejection states specifically:** Rejection is the most painful moment in the journey. It's also the moment where RelayKit can differentiate most sharply from competitors who just show an error code.

A rejection should read like a debrief, not a failure notice:
- What carriers flagged, in plain language
- Why that specific thing triggers a flag (the underlying carrier logic)
- What approved campaigns look like in contrast
- The exact change needed, framed as "here's how you cross this threshold"

Rejection handled well becomes the moment a user trusts RelayKit most. They saw behind the curtain. They got real information. They know their guide actually understands the terrain.

---

### Act IV: The Return — Approved, Live, and Changed

**The approval moment is the most underdeveloped touchpoint in the entire product.** It's tempting to just flip a status badge to green. That's a massive missed opportunity.

The developer who just got their campaign approved has genuinely accomplished something. They navigated a system that most of their peers haven't. They have infrastructure that scales with their business. They're a different kind of builder than they were 10 days ago.

**This moment should feel like crossing a finish line, not closing a ticket.**

**Recommended post-approval state:**

This is not a congratulations banner. It's a statement of what they now *are*:

> *Your campaign is approved.*
>
> *You now have verified SMS infrastructure — a registered brand, an approved campaign, and a compliance record on file with The Campaign Registry. Most developers never get here. You did.*
>
> *Here's what you can build with it:*
> [message plan builder unlocked]
> [add another project]
> [view your compliance documents]

The language "most developers never get here" is intentional. It's true, and it matters. It names the achievement without being sycophantic. It creates a moment of identity shift — the user now sees themselves differently.

**This is the word-of-mouth moment.** The developer who feels this way about RelayKit will tell other developers. Not "it's a good tool" but "it actually got me through the 10DLC thing — it's not as bad as you think if you use RelayKit."

---

## Multi-Project Architecture: The Expanding Identity

One of the most important product decisions flowing from this philosophy: **single login, multiple projects.**

The developer who approved their first campaign isn't finished with RelayKit — they're just getting started. They have other apps. Client projects. Side projects that are gaining users. Every one of those is a potential new campaign, a new $199 setup, a new $19/month subscription.

If RelayKit requires a new account per project, the product becomes infrastructure they manage. If RelayKit gives them one home where all their projects live and grow, the product becomes part of their developer identity.

The dashboard is not a registration status tracker. It's a developer's **SMS credential portfolio** — all their projects, all their registration states, all their message plans, living in one place.

When a second project is added, the onboarding flow should acknowledge what they already know:

> *You've done this before. Your brand is already verified — we'll link this project to your existing record. This campaign should move faster.*

This creates a compounding feeling of expertise. The developer doesn't just get better results from RelayKit over time — they feel more capable. The product grows with their identity.

---

## The Vocabulary of RelayKit

Words RelayKit uses and words it avoids. This list governs all UI copy, emails, error messages, and system status text. Feed this to CC whenever user-facing strings are being written.

### Words We Use

| Word/Phrase | Why |
|---|---|
| **Verified** | Active past tense — something has been confirmed, earned |
| **Approved** | The carrier made a judgment in your favor — that's meaningful |
| **Protected** | Frames compliance as shield, not cage |
| **Registered** | Concrete noun — you have a thing now |
| **Your traffic** | Ownership language — this is yours |
| **Carriers** | Specific, real actors — not "the system" or "the platform" |
| **In review** | Process language — something is happening, not just waiting |
| **Clear** | Campaigns "clear" review — positive motion language |
| **Live** | The best status word. Not "active" or "enabled" — *live* |
| **Build** | What developers do — keep surfacing this word |
| **Here's what this means** | The segue into explanation — conversational, not condescending |

### Words We Avoid

| Word/Phrase | Why |
|---|---|
| **Required** | Parental, compliance-speak |
| **Not allowed** | Restriction framing |
| **Failed** | Never use alone — always pair with "here's why and what to do" |
| **Violation** | Legal threat language — wrong tone entirely |
| **You must** | Imperative commands feel coercive |
| **Compliance** (as a noun alone) | Abstract and corporate — always contextualize it |
| **Please note** | Passive-aggressive bureaucratic hedge |
| **Error** (for carrier rejections) | Errors are bugs. Rejections are decisions — treat them differently |
| **Pending** (alone, without narrative) | Dead-end status — always accompany with context |
| **Complete** (for setup steps) | Bureaucratic. Use "done," "verified," "submitted" instead |

---

## Inline Education: The Principle of One Sentence

Throughout the product, RelayKit explains the "why" behind compliance requirements. The temptation is to write paragraphs. The principle is: **one sentence, maximum.**

One sentence is enough to reframe a constraint from arbitrary to meaningful. More than one sentence becomes a lecture.

**Pattern:**
`[Action required] — [one-sentence why]`

Examples:
- *"Add your opt-in method — carriers use this to verify you have consent from your users."*
- *"Sample messages are locked — edits here cause carrier rejections because submitted content must match exactly."*
- *"Your compliance site is being generated — this is the page carriers check to confirm your business is real."*

The one-sentence why is not documentation. It's not a tooltip. It's a brief, honest explanation from a guide who respects the developer's intelligence.

---

## Emotional States by Screen: A Reference Map

This table maps the expected emotional state of the user at each major touchpoint and defines RelayKit's job in response to that state.

| Screen/Moment | User's Emotional State | RelayKit's Job |
|---|---|---|
| Landing page | Overwhelmed, skeptical | Name the problem honestly. Signal expertise. Offer the sandbox as a first win. |
| Use-case selection | Uncertain about fit | Help them recognize themselves. Use plain language, not category jargon. |
| Business details form | Impatient, "why do you need this" | One-sentence why on every field that might feel intrusive. |
| Compliance site preview | Surprised this exists | Brief explanation: "This is what carriers check." Surface the value. |
| Review & confirm | Anxious, final-check mode | Everything locked and labeled. Reassurance that read-only = protected. |
| Payment / checkout | Commitment anxiety | Don't over-explain. Keep it clean. The value has already been established. |
| Post-payment, pre-submission | Expectant | Confirm what's happening next and when. Start the narrative. |
| Carrier review pending | Anxious, checking daily | Narrative status. What's verified, what's in progress, what's next. Sandbox is live — keep building. |
| Rejection | Gutted | Debrief, not error. Exact fix. Path forward immediately visible. |
| Approved | Relief + accomplishment | Name the achievement. State what they now have. Open the next door. |
| Return visit, adding project | Confident | Acknowledge their experience. Faster path. Portfolio view. |

---

## What This Means for CC

When building any screen that contains user-facing text, CC should:

1. **Check the Vocabulary section** — avoid forbidden words in all UI strings
2. **Check the Framing Shift table** — if the screen communicates a constraint, reframe it using the Trusted Guide column
3. **Check the Emotional States map** — know what state the user is in and design the copy to meet them there
4. **Apply the one-sentence principle** — explanatory copy is one sentence, never a paragraph
5. **Never leave a pending state without narrative** — any "waiting" state must include: what's been completed, what's happening now, what's next, and a keep-building prompt

This document is not a style guide. It's a philosophy made concrete. The goal is that a developer who uses RelayKit feels, at the end of the process, that they did something — not that something was done to them.

---

*RelayKit — Vaulted Press LLC*
*Document version: 1.0*
