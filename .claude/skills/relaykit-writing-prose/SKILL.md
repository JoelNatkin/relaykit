---
name: relaykit-writing-prose
description: Use whenever writing RelayKit content for external audiences in the measured, paragraph-driven prose style — blog posts, Indie Hackers posts, marketing pages, social posts, partner pitches, READMEs, launch announcements, or any prose for readers outside the product UI. Provides drop-in voice rules, post structure, AI-prose tells to avoid, surface-specific notes (especially Indie Hackers), and the corpus-level supply/demand lane strategy. Apply even when the user just says "help me write a post about X" or "draft something for the launch" — if it's external-facing RelayKit prose in this style, use this skill. This is the traditional-prose style skill; a separate skill covers the choppier, punchier Indie Hackers post style.
---

# RelayKit External Writing — Prose Style

Voice and craft rules for RelayKit content aimed at people outside the product UI: blog posts, Indie Hackers posts, marketing pages, partner pitches, launch posts, social, email, READMEs.

This is the **traditional-prose style** skill — measured, paragraph-driven writing that generalizes through specific story. A separate skill covers the choppier, punchier Indie Hackers post style; when that style is wanted, defer to it instead.

This skill layers craft principles on top of the canonical voice document. Product-surface copy (dashboard, errors, settings, onboarding) follows a different bar — for those, defer to `docs/VOICE_AND_PRODUCT_PRINCIPLES_v2.md` directly.

## Workflow when writing

1. Read this whole file before drafting.
2. Identify the surface (Indie Hackers, blog, partner pitch, etc.) and the lane (supply / demand / retrospective).
3. Draft.
4. Run the drop-in test (§2) on the draft.
5. Polish pass: scan for AI tells (§7) and check against craft principles (§8). Rewrite anything that triggers.
6. If `references/exemplars.md` covers this surface or lane, read it and check your draft against the worked examples.

## 1. Voice baseline

Authoritative voice rules live in `docs/VOICE_AND_PRODUCT_PRINCIPLES_v2.md`. Everything in that document applies — Demand Voice (§3) is especially relevant for external writing; the Kill List (§6) applies universally.

This skill does not duplicate the voice doc. It layers on top of it: how to apply the voice to long-form writing for readers who have never heard of RelayKit and may not have thought about SMS as a developer concern in years.

## 2. The Drop-In Principle (universal)

Every post stands alone. No shared vocabulary accumulates across the corpus. A reader with zero prior knowledge — no familiarity with RelayKit, no familiarity with the SMS world, hasn't read any other post — must be able to drop into any post and follow from sentence one.

How to apply:

- Anchor every post in the reader's world before introducing yours.
- Function before name. Often, no name at all. Describe what an obscure entity does before naming it; usually skip naming it entirely.
- One obscure concept per post. If a post needs two, it's two posts.
- RelayKit is a consequence, not a prerequisite. Never assume the reader has heard of RelayKit or read another post. The byline is the full introduction.

### Drop-in test (run before delivering)

1. Could a developer who has never built with this category follow from sentence one?
2. Could a non-developer at a SaaS company (designer, PM, marketer) follow it?
3. Does any sentence assume knowledge from a prior post?
4. Is any acronym, company name, or regulation introduced without inline context?

Apply with generosity. Assume less, not more. Even terms common in your circle ("2FA," "Next.js," "fork") should be swapped for user-facing equivalents ("verification codes," "new project," "a copy") when the substitution works.

## 3. Tourist, not student

When a post touches the world RelayKit exists to hide from customers, the reader is a tourist, not a student. Sketch the shape of the strange world; never make the reader memorize it.

Reader-world specifics — their app, their customer, their funnel — are welcome and dense. Your-world specifics — 10DLC, TCR, AT&T Message Class T, carrier filtering — appear sparingly as flavor, often named only to be dismissed.

## 4. The 5-beat post structure

1. **Hook** (1 sentence): recognizable pain or counterintuitive claim.
2. **Cost** (1–3 sentences): what that pain costs them. Concrete.
3. **Misdiagnosis** (optional): what people usually assume is the cause.
4. **Insight** (2–6 sentences): the actual cause or fix. The thing the reader paid for by reading.
5. **Outward turn** (2–4 sentences, or implicit): translate to the reader. Soft RelayKit mention if natural. Sign off.

The outward turn can be implicit — the specific story does the generalizing — when explicit second-person address would feel announce-y. Trust the reader to recognize themselves in the specifics.

**JTBD overlay:** at each beat, ask "does this serve the reader's job, or describe my world?" If "my world," rewrite or cut.

## 5. Title formula

- 40–60 characters.
- Names a recognizable thing.
- Frames as tension, surprise, or specific number.
- Never "I built" or "We launched."

Patterns that work:

- "[Recognizable thing] isn't [common assumption]. It's [actual thing]."
- "Why [specific painful thing] (and the part nobody tells you)"
- "[Specific number]. Here's [the lesson]."
- "[Doing the thing] shouldn't [common painful expectation]." — e.g., "Adding text messages to your app shouldn't take a month."
- "I almost [obvious approach]" — optionally with "Here's why I didn't" or similar resolution clause, but often stronger stopping at the tension. Let the post deliver the resolution; don't pre-spoiler the title.

## 6. The two lanes (corpus-level)

- **Supply lane:** "This annoying world exists. We make it easier." For readers already shopping for SMS but blocked. Stronger RelayKit mention permitted.
- **Demand lane:** "You have a problem you didn't know SMS could solve." For readers who stopped considering SMS years ago. Softer RelayKit mention — plant a seed, don't close. Shape inverts: the post starts inside the reader's product; SMS arrives at the end as a resolution.

Target corpus mix: ~60% demand, 30% supply, 10% retrospective.

Name the lane before drafting. The shape of the post changes depending on which one.

## 7. AI-tell avoidance (the most important section)

These patterns are AI-prose tells. Each must be avoided in finished posts.

**Underlying diagnosis:** AI prose defaults to announcing lessons through abstract pattern-naming. Human prose generalizes through denser specific story.

**The fix:** stay in scene, generalize through specifics, never announce the lesson, trust the reader to do the recognition work.

### The tells

1. **Staccato fragment trains.** Five or more short fragments in a row, used as default texture rather than earned emphasis.
2. **Abstract-pattern → contrarian-flip template.** "Common [X] reflex: [list]. That reflex is wrong for [pivot]." Replace with a story where the reflex shows up and the character pivots.
3. **Summary noun phrases as subject.** "Common founder reflex," "The conventional wisdom," "The typical mistake." Locate ideas in specific instances instead.
4. **Hollow closers.** "Run the playbook." "That's the model." "Execute on it." "Ship it." "Done." Cut them. Either land on the specific or trust the post to end without ceremony.
5. **Italicized punchline as solo-sentence paragraph.** AI's favorite "moral of the story" announcement. If the italics are doing the work, the sentence isn't.
6. **Frame breaks** from first-person specific to third-person abstract. Voice flipping mid-post from "I sketched / I killed" to "founders tend to..." — pick one register and stay.
7. **"Not X. It's Y." rhetorical.** "The leverage isn't 2x different. It's 50–100x different." Once per post if at all; never as a closer.
8. **Triple parallel construction.** "Instead of X, you Y. Instead of A, you B. Instead of C, you D." One parallel sentence is fine. Three in a row is a tell.
9. **Anaphora.** "They already publish. They already ship updates. They already have Discords." A tell when used to generate emphasis; fine in genuine list contexts.
10. **Consultant-speak.** "Surface," "land, sign up, convert," "leverage," "different muscle," "run the playbook," "build a flywheel," "GTM motion."

After drafting, do a tells pass. Each tell found in the draft is a sign the prose is announcing instead of telling.

## 8. Craft principles

Positive rules that emerged from iterating finished posts. They sit alongside the AI tells in §7 but operate differently — tells are negative patterns to scan for and remove; craft principles are positive rules to apply throughout drafting. Examples of each in action live in `references/exemplars.md`.

1. **Terminology discipline.** Once a post defines its key terms (e.g., "provider" vs. "carrier"), it must use those exact words when referring to those concepts. AI prose reaches for creative variants ("gauntlet," "the system," "your application accordingly") for variety's sake; the result is muddiness. Use the defined word again. Clarity beats elegance.

2. **In-scene specifics must be real, not invented.** "Stay in scene" doesn't license fabricating details for color. If there are no real scene-level details to draw on, abstract first-person reflection is more honest than invented specificity. Use real specifics when you have them; don't manufacture specifics to perform a principle.

3. **Don't construct rhetorical scapegoats that absolve actual competitors.** It's tempting to write a clean reversal — "X isn't the problem, Y is" — because it has good rhetorical energy. But if the product depends on X being part of the problem (otherwise why does it need to exist?), absolving X for rhetorical cleanness is a craft error. Test: does this post still motivate the product I'm building?

4. **Describe ecosystem relationships generously, not transactionally.** When a post mentions other companies, products, or maintainers in the space, the instinct is to frame outcomes around reciprocity. That reads as needy and zero-sum. Better: name what you contribute to them regardless of reciprocity. The reader trusts a participant, not a supplicant.

5. **State uncertainty once, then move on.** Self-deprecating sign-offs like "especially when it doesn't work" feel like founder humility while drafting but read as defeatism on publication. If the post already acknowledges uncertainty plainly, an additional negative beat is performative, not honest.

## 9. Other archetypes

**Retrospective:** "We almost did X. Here's why we didn't." Story-driven. No compliance world to manage; the reader is along for a decision walk-through. Shape: setup → temptation → moment-of-doubt → what swung it → what we did instead.

Beware the performative reversal — the temptation/doubt beat should be real, not a rhetorical detour. "For about an hour I felt smart" beats inserted for color read as theatrical and undermine the honesty the archetype depends on. If the doubt didn't actually happen, skip the beat.

**Competitor comparison:** UX angle, one competitor at a time. Walk the reader through the lived experience of using the other platform. Friction shown, never villainized. The contrast does the work — never editorialize.

## 10. Indie Hackers — surface-specific

### Mechanics

- ~51 character titles outperform.
- Thursday posts engage better than Tuesday.
- Front-load value in sentence 1.
- Virality builds over 6+ hours, not the first hour. Don't panic at low first-hour engagement.
- Answer every comment quickly.

### Format

- Prose paragraphs, minimal formatting.
- No emojis in body. No ✅/❌.
- Code blocks only when structure genuinely demands.
- Soft-plug only — never lead with product.
- Cadence: 1–2 substantive posts per week, plus 5–10 useful comments on others' posts per post you publish.

### The 2026 trust problem

The community is in active backlash against fake or inflated metrics. Pre-revenue + honest is a credible posture. When numbers appear, they should be specific and itemized, or absent entirely. Never round vague claims ("a few thousand users").

## 11. Parallel publishing

- Indie Hackers post first. Engagement lives there.
- Mirror to relaykit.ai blog 3–7 days later.
- Use canonical link discipline so duplicates don't compete in search.

## Exemplars

Worked examples live in `references/exemplars.md`. Read that file before drafting any post that maps to a surface or lane the exemplars cover. Patterns internalize faster from worked prose than from rules alone — the rules above tell you what to do; the exemplars show you what it looks like when it lands.
