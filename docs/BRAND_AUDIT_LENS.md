# Brand Audit Lens

> A short doc that tells the audit Claude — and Joel — how to walk SaaS sites without producing vanilla observations. Loaded as standing context for Claude in Chrome during the audit phase. Retires when Stage 2 (`BRAND_DIRECTION.md`) consumes its outputs.

## Why this exists

You can spot good design instantly. You can spot bad copy instantly. But walked through a normal browser, the notes that come out are: "this is clean," "the hero feels nice," "I like their spacing." Those are vanilla observations. They feed nothing.

This audit produces something sharper: the **committed decision** on each site. What did the team pick to dominate? What did they refuse to do? What design law are they living by that another team would not have picked? One insight per site. That's the unit of value.

The output feeds Stage 2 — a design system with point of view (`BRAND_DIRECTION.md`). We are not designing yet. We are building the conviction the design will need.

## What RelayKit is (project context for the audit)

RelayKit is a B2B SMS compliance infrastructure platform. A developer installs an SDK (`npm install relaykit`) and gets compliant SMS without learning carrier mechanics. The audience is indie SaaS founders shipping production SaaS on modern stacks (Next.js + Supabase + Vercel + Stripe), typically using AI coding tools (Cursor, Claude Code, Windsurf). Marketing channel through beta is Indie Hackers only; the marketing site is designed for that traffic specifically — readers who already trust the build-in-public posture and want to confirm RelayKit is real, not skeptics being converted from cold.

If a friend with no context landed on relaykit.ai for ten seconds, the right answer to "what kind of company was that?" is: *"it's a developer tool that handles SMS, made for indie SaaS."* Two beats — what kind of thing, who it's for. That's the categorical bucket. Anything that pushes us into "compliance product" or "enterprise infrastructure" is wrong direction.

The product narrative: *carrier registration takes weeks and rejects you for nothing; we make it ~3 days and refund you if it fails. The goddamn thing builds itself.*

## Working stance hypothesis

**Knowing peer + matter-of-fact wonder, product-front-and-center.**

Texture:
- *Knowing* — aware the industry is absurd, not pretending it has dignity it doesn't have. Wit shows up when wit is earned, not as performance.
- *Peer* — speaking across, not down. No ceremony, no condescension. Not authority-shaped (parental); peer-shaped (collaborator).
- *Matter-of-fact* — stating what is, not selling. Plain-spoken.
- *Wonder* — occasional moments of "this used to be impossible and now it isn't," and the copy lets that land instead of explaining it away.
- *Product-first* — product evidence (screens, code samples, real behavior) leads. Marketing copy is small relative to the product showing itself.

Reference points: Stripe's early "seven lines of code" register, the way 37signals writes when they're being good at it, Marc Lou when he writes about ShipFast, Linear's drier moments, Resend's homepage. None of those are *fun* and none are *serious-by-default*. They're specific.

**Sardonic toward the industry, generous to the customer.** The wit punches at carrier bureaucracy, jargon, and the time-suck of figuring out 10DLC. It does not punch at the customer. The customer is being respected — their time, their attention, their not-having-to-learn-things-they-don't-want-to-know.

**The audience's enemies, not ours.** Not telecoms, not competitors. *Wasted time, jargon you shouldn't have to learn, pumping attacks on your bill, attention software demands.* Strong copy is positioned against those things.

The audit confirms, sharpens, or replaces this hypothesis. **It is not a foregone conclusion.**

## The vanilla trap (the operating mode this doc rejects)

Vanilla observation language sounds like:
- "This is clean."
- "I like the hero."
- "Nice typography."
- "Good spacing."
- "Feels modern."
- "It's a SaaS site."

These descriptions are reversible — they apply to fifty sites. They produce no decision and no contrast. If the audit notes read like this, the audit failed.

Vanilla design (what we're trying to escape) looks like:
- Subtle borders × subtle shadows × subtle color × subtle hierarchy → invisible
- Centered, evenly spaced, predictable rhythm → "assembled" rather than designed
- 2–3 ideas per screen, all gentle, none committed → forgettable
- Untitled UI defaults applied without overrides → interchangeable

Vanilla copy looks like:
- "Powerful, flexible, scalable [x]"
- "Streamline your [workflow]"
- "[Verb] with ease"
- "Built for [audience]"
- Headlines that describe features instead of making claims
- Sentences that could run on a competitor's site

**Commodity 2026 patterns (table stakes, not differentiation).** Don't get excited when you see these — they're now baseline:
- Product-screenshot-led hero
- Dark theme for developer products
- Headlines under 8 words
- Real UI in feature tiles instead of icons or illustrations
- Bento-grid feature sections
- Animated terminal demos in the hero

These are what *every* design-forward developer SaaS does in 2026. They're necessary but not sufficient. RelayKit's edge has to come from register and copy laws — not from copying the visual pattern, which is becoming a commodity.

## Pre-registration

Before walking the first site, lock in gut answers. Anchors against bias from what we see.

1. What should RelayKit *not* feel like?
2. On first load, what feeling should land?
3. Which two registers are dominant, which two are out?
4. What kind of company is this — the friend test?

### Pre-registered for RelayKit (locked before audit)

**1. Not us:**
- Untitled UI / 2018-SaaS-average
- Carrier / enterprise / telecom-jargon-heavy
- AI-startup-vibe (gradient fluff, "the future is here")
- Hyper-minimalist tech-bro austerity (Linear pure-cool taken alone)
- Marketing-agency overdesign (Webflow showcase territory)
- Solemn compliance authority (Vanta / Drata / Stripe Atlas register)

Specific product names to avoid sounding like: Twilio, Plaid, Stripe Atlas, Vanta, Notion, Webflow.

**2. First-load feeling:**
- *Recognition + relief* — "I get what this is, and it looks like what I want."
- Sustained reinforcement down the page. **No letdown** — strong hero followed by fizzling sections is pre-rejected.
- *Cool ally discovered* — peer-shaped, not vendor-shaped, not authority-shaped.

**3. Register pair:**
- Dominant texture: *knowing peer + matter-of-fact wonder, product-front-and-center.*
- Out: brand-first machinery, fun-as-default, austere flex, solemn authority.
- In tension to watch: how much wit lands without tipping into "tries too hard."

**4. Friend test answer:**
- *"It's a developer tool that handles SMS, made for indie SaaS."*

Save these. Refer back when site findings start tugging in different directions.

## How to look (visual)

Per site, force these questions. Don't move on until each has a one-line answer.

**1. What's the visual center of gravity?** Type-led, structure-led, color-led, density-led, space-led, motion-led, illustration-led, photography-led? *Pick one.* If you can't pick one, the site is balanced (read: vanilla); note that as a finding.

**2. What 2–3 moves do they repeat relentlessly?** Not "they have nice typography" — *which* typographic move? Tight tracking? Display weights at body sizes? Mixed family pairings? Find the actual repeated move.

**3. Where did they break a rule on purpose?** Asymmetric alignment, intentional density spike, unexpected color jump, broken grid, unusual margin, weird scroll behavior. *The places that look "wrong on purpose" are the design.* If nothing breaks a rule, that's a finding — they committed to predictability.

**4. What did someone else not have done here?** This is the real test. If the design move could come from any halfway-good designer, it doesn't count. Look for the move that someone *else* would have softened, rounded, balanced, or removed.

**5. What design law are they living by?** Phrase it as a rule, not a token. *"Borders are real or absent — never subtle." "Primary actions weigh more than the rest of the page." "Body type runs at sizes that make most sites look small."* The law is what's enforced everywhere.

## How to read (copy)

Per site, force these questions on the homepage hero + 1–2 section headers + at least one long-form surface (changelog post, blog, docs intro):

**1. Claim or description?** Is the hero making a claim about reality (*"Your customers will reach you in three taps"*) or describing a feature (*"Multi-channel customer messaging"*)? Claims commit; descriptions hedge. Which kind dominates?

**2. What's the enemy?** Real strong copy is positioned against something — a pain, a competitor's failure mode, a category bad-habit. Name the enemy in one phrase. If there isn't one, that's a finding.

**3. Irreversibility test (hero/headline only).** Pick the strongest sentence on the page. Could it run on three direct competitors' sites? If yes, it's reversible — vanilla. If no — if it's only true of *this* product — note it; that's a high-craft signal.

**4. Voice register shift across surfaces.** Strong hero copy and strong long-form copy have different intensity. Hero is high-intensity, every-sentence-irreversible. Long-form is lower-intensity but in the same voice family — room to narrate, breathe, explain. Does the team handle the shift well, or does the long-form fall back to vanilla? Does the hero voice survive into the changelog? Watch for teams that solve this elegantly (Linear, Resend, 37signals).

**5. Ideas per screen.** How many ideas does the hero ask the reader to hold? One? Two? Five? Strong copy uses fewer ideas, harder.

**6. Tone register.** Smart engineer, marketer, support agent, brand voice, founder voice, none-of-the-above? Where's the register set, and is it held consistently down the page?

## How to read (UI signal from product imagery)

Lightweight third lens. *Note the scope:* we are auditing the marketing site, not the team's actual app. We can only see what they choose to show in screenshots, embedded demos, and product visuals on the marketing surface. The question is: *what does their chosen product imagery suggest about how their app thinks?*

Per site, look at the screenshots and product visuals on the marketing site and answer:

**1. What's their primary action model?** Command-driven (Linear, Raycast)? List-driven (Notion, GitHub)? Flow-driven (Stripe checkout, onboarding tools)? Dashboard-neutral (most SaaS, the vanilla default)? Something else? If you can't tell from the imagery, the imagery is ambiguous — note that.

**2. Does layout shift across states, or are states badges?** Onboarding screens, empty states, error states, post-success states — when shown, do they have different *layouts*, or just different status badges on the same layout? Layout-shift is real state-driven design; badge-only is decoration.

**3. Is hierarchy unmistakable or polite?** In the screenshots, is one element obviously the focus, or is everything evenly weighted? Polite hierarchy is cognitive flattening — vanilla.

**4. Hard structure or soft cards?** Visible section boundaries, deliberate grouping, clear containment — versus floating soft-shadow cards on a neutral field. Note which one their imagery commits to. Neither is universally right; the question is whether the choice fits what the user is doing.

**5. One obvious next step?** In flow-shaped screens (signup, configuration, ambiguous states), is the next action unmistakable or buried in optionality?

**Meta synthesis question:** *what does this product seem to think it IS?* Progress engine, command center, configurator, dashboard, library, workspace, document editor, control panel? The answer emerges from all five above.

**The visceral check:** *Did any of this team's product imagery make you want to see the actual app, sign up, or feel inspired?* If yes, capture which specific image and what about it landed. If no, note that — it's a signal that even good marketing-site design can fail to make the product look desirable.

## Per-site extraction format

Each site reduces to **one structured note**. Not a writeup. Not a screenshot dump.

```
Site: [url]
Stance label: [3-6 word phrase]
Center of gravity: [type / structure / color / density / space / motion / etc.]
Their design laws (1-3 max):
  - [Law in rule form]
Their copy moves (1-3 max):
  - [Move in rule form]
Their UI stance (from product imagery): [progress engine / command center / dashboard / configurator / library / etc.]
Visceral check: [Did imagery make you want to sign up? Yes/no + which image + what landed]
For RelayKit — borrow / be influenced by:
  - [Specific move + why it could fit]
For RelayKit — explicitly avoid:
  - [Specific move + why it doesn't fit]
The one-line takeaway:
  [Single sentence that captures the *committed decision* this site made.]
```

If the structured note can't be filled in cleanly, the site was vanilla and the finding is "vanilla — nothing to extract." Note it and move on. Don't pad.

## Pattern synthesis (produced after the walk, not during)

Once the per-site notes are in, audit-Claude produces synthesis covering:

1. **Convergence.** What stance/moves showed up across multiple high-quality sites in our adjacent category? (Convergence is signal, not just averaging.)
2. **Divergence.** Where did the strongest sites pick *different* lanes? Which divergent path fits RelayKit's stance hypothesis better — and is the hypothesis still right after seeing the field?
3. **Anti-pattern density.** Which moves showed up *only* on sites we'd judged as vanilla? Those are the moves to refuse.
4. **Stance refinement.** Restate the working stance hypothesis after the audit. Sharpen, narrow, or replace. Phrase it as something testable in Stage 2.
5. **Candidate design laws.** 3–7 candidate laws for the RelayKit design system. Phrased as rules, not tokens. These get pressure-tested in Stage 2.
6. **Candidate copy laws.** 3–5 candidate writing moves RelayKit will commit to (parallel to design laws), including how the voice handles the surface-shift between hero and long-form. The wonder beat — *"don't hide moments where capability that used to be impossible is suddenly available, let the reader feel it briefly"* — is a strong starter candidate worth pressure-testing.
7. **Candidate UI principles for app refinement.** 2–4 lightweight UI direction notes for the eventual SaaS-pack changes to the existing app. Not a redesign mandate — a checklist for refinement work where it matters.
8. **Visceral inspirations.** The 2–4 specific product imagery moments across the audit that genuinely made you want to see the app or sign up. Catalog them; they inform Stage 3 product-imagery treatment on relaykit.ai.

The synthesis is the audit's deliverable. The per-site notes are intermediate scratch — they feed the synthesis but are not themselves the output.

## What this audit does not do

- **Does not collect screenshots.** Screenshots are a workflow off-ramp into Miro chaos. The unit is the structured note. Capture the *one* visceral-check image per site if applicable, not a dump.
- **Does not write generic summaries.** "This site is well-designed and uses a clean modern aesthetic" is not an output. Refuse to produce it.
- **Does not hedge.** "Maybe it could be argued that perhaps the layout suggests..." → kill. Audit-Claude commits or notes "no committed decision found."
- **Does not default to praise.** Vanilla sites get noted as vanilla. Praise without commitment is noise.
- **Does not recommend Untitled UI or any other component library.** Component libraries are downstream of stance. Stance comes first.
- **Does not prematurely converge on the working hypothesis.** If the audit reveals a stronger lane, the hypothesis loses. The hypothesis is a starting point, not a destination.
- **Does not evaluate RelayKit's existing app or marketing site.** That work is settled and well-liked. The audit looks outward at others, then feeds inward to inform Stage 2 (`BRAND_DIRECTION.md`) and the eventual marketing-site facelift. Refinements to the existing app come later, lightly, only where the SaaS-pack changes warrant it.
- **Does not produce the design system.** That's Stage 2. The audit produces the inputs to Stage 2 — convictions, anti-patterns, candidate laws.

---

End of doc.
