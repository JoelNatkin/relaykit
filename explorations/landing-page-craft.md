# Landing Page Craft
Status: exploring (2026-06-18)

> **Scope:** Working reference for the sub-vertical landing page system — writing rules, page archetypes, reader/page JTBD, optimization findings, and capability-tracking. This is an exploration, not canon: it informs the pages but isn't load-bearing. The writing rules and research are settled thinking; templates and worked examples fill in over subsequent sessions. Graduates to a skill only if it earns it through use.

## Purpose

We're building a system of sub-vertical landing pages — one per addressable sub (and per concept/category hub) — that serve a human builder, AI retrieval engines, and Google simultaneously. This doc holds what we've learned about how to write them and how to make them findable without sacrificing readability.

**Scope rule:** a ship-it page maps to exactly one second-dropdown sub-vertical — the configurator's third box (e.g. "Developer tools / API platforms / infrastructure SaaS"), never a whole vertical ("B2B SaaS & developer tooling"). If the dominant story reads generic across a vertical's subs, that's the tell the page is mis-scoped — drop to a specific sub. Dominant category is then that sub's lead category, which can differ sub to sub within one vertical (Identity/SSO → Verification; Customer support/helpdesk → Customer support; Dev tools/API → Account events).

## The writing rules

1. **One page, one job.** Name the dominant story in a sentence; every section advances or supports it, none restates it. If two sections make the same point, cut or merge. (The first healthcare draft had four sections all arguing "reminders reduce no-shows" — that's the failure mode.)
2. **The reader is the builder, not the end user.** Stories stay end-user-centered (the patient who reschedules from the couch), but the mental destination is always "my customers need this."
3. **Don't over-prove a premise the audience already holds.** A developer landing here already knows missed appointments cost money. Move fast to "I can picture this in my product" — don't sell the problem they already feel. (Demand-voice refinement: VOICE §3 says make the problem concrete, but for an audience that already feels it, concrete becomes condescending.)
4. **Secondary use cases are where "feature" becomes "platform."** Give them real weight — that section reframes RelayKit from one reminder feature into a capability. The 9 message categories play different roles per sub; that's free per-page uniqueness.
5. **Cut 25-30% on default.** The tighter version reads as a product page; the longer as an article. Product page wins.

**The needle to thread (structure vs. voice):** Be answer-first and self-contained at the SECTION level — lead each section with the liftable answer — but let the prose inside breathe. This satisfies AI extraction without collapsing into choppy listicle prose that would wreck the measured voice. The edited healthcare page does exactly this; it's a rule, not a contradiction.

## AI-prose tells to avoid

**Underlying diagnosis:** AI prose defaults to announcing lessons through abstract pattern-naming. Human prose generalizes through denser specific story. **The fix:** stay in scene, generalize through specifics, never announce the lesson, trust the reader to do the recognition work. After drafting, do a tells pass — each tell found is a sign the prose is announcing instead of telling.

1. **Staccato fragment trains.** Five or more short fragments in a row, used as default texture rather than earned emphasis.
2. **Abstract-pattern → contrarian-flip template.** "Common [X] reflex: [list]. That reflex is wrong for [pivot]." Replace with a story where the reflex shows up and the character pivots.
3. **Summary noun phrases as subject.** "Common founder reflex," "The conventional wisdom," "The typical mistake." Locate ideas in specific instances instead.
4. **Hollow closers.** "Run the playbook." "That's the model." "Execute on it." "Ship it." "Done." Cut them. Either land on the specific or trust the post to end without ceremony.
5. **Italicized punchline as solo-sentence paragraph.** AI's favorite "moral of the story" announcement. If the italics are doing the work, the sentence isn't.
6. **Frame breaks** from first-person specific to third-person abstract. Voice flipping mid-piece from "I sketched / I killed" to "founders tend to..." — pick one register and stay.
7. **"Not X. It's Y." rhetorical.** "The leverage isn't 2x different. It's 50–100x different." Once per piece if at all; never as a closer.
8. **Triple parallel construction.** "Instead of X, you Y. Instead of A, you B. Instead of C, you D." One parallel sentence is fine. Three in a row is a tell.
9. **Anaphora.** "They already publish. They already ship updates. They already have Discords." A tell when used to generate emphasis; fine in genuine list contexts.
10. **Consultant-speak.** "Surface," "land, sign up, convert," "leverage," "different muscle," "run the playbook," "build a flywheel," "GTM motion."

## JTBD per page type

Each template opens with its reader's job (why they landed) and the page's job (what we need it to do) — different things, both belong at the top.

- **Ship-it page** (Clear bucket — most subs). Reader's job: "I'm building [app type] and considering texting — show me what good looks like and confirm I can do it, so I can decide to build it and start now." Page's job: prove the capability is real and table-stakes, then hand off to /messages preconfigured. Conversion = landing in the tool.
- **Honest-no page** (Not-yet bucket). Reader's job: "I'm building [restricted app type] and need a straight answer on whether I can text my users and why, so I can stop guessing and plan around reality." Page's job: be the trusted straight answer nobody else publishes (highest-E-E-A-T, highest-citation play) and capture "request it" intent. Conversion = trust + waitlist.
- **Hub page** (category or concept). Reader's job: "I'm trying to understand [a message category, or a concept like opt-out / registration] — give me the canonical explanation and where it applies, so I can orient." Page's job: connective tissue — the citeable definition that distributes authority to the sub pages it links. Conversion = onward click.
- **Comparison page** (evaluation intent / SEO). Reader's job: "I'm evaluating how to add SMS and weighing the options — show me factually what each requires of me." Page's job: capture branded-adjacent and "alternatives to X" queries with a factual table; win the Sinch-approval-speed differentiator honestly. Lives in documentation, not the primary marketing flow (VOICE §4).

## Page archetypes (shape)

- **Ship-it:** moment → phone thread → dominant use case → secondary use cases → craft rules → CTA to /messages preconfigured.
- **Honest-no:** the question → why mostly no → what carriers flag → what would change it → "request it" CTA.
- **Hub:** definition → message set or concept explainer → links to the subs where it applies.
- **Comparison:** factual table of what each platform requires the developer to do; no combative framing, no dismissiveness.

Converge on layout WITHIN an archetype (predictable structure helps parsing, throughput, and reader trust); diverge BETWEEN archetypes (different reader-jobs justify different shapes). Substance varies enough per sub on its own — don't manufacture cosmetic layout variation.

## Ship-it page skeleton (component map)

The production fold-back of a ship-it page (D-436). A page is built by **reusing the live home section components**, not cloning the mockup HTML. Three reuse buckets:

- **B1 — shared chrome, imported as-is** from `marketing-site/components/home/*` (home copy verbatim, no per-page change): status band · problem (Recognition) · paperwork · build (AiSection) · test (Prove) · process (HowItWorks) · price (Pricing) · closing CTA (FinalCta). A chrome change lands once and propagates to every page.
- **2a — authored fresh each page** (the sub's dominant story; content sourced from the sub's mockup): hero · moment · details/Q&A · "rest"/secondaries · related.
- **2b — same home component, sub-specific DATA only** (optional props that default to the home's current behavior): **Messages** = the home `MessagesSection` locked to the sub's dominant category; **Variables** = the home `VariablesSection` fed a sub-matched example. **Numbers** is used verbatim (no per-sub stats yet — defer a stats-override mechanism until a sub needs different numbers).

**Invariant:** Build, Test, and Numbers do **not** vary per sub. If a mockup tailored them (e.g. an account-events code snippet, "a payment failure, a sign-in" test copy), that reverts to the home copy on the production page.

**Locked section order** (first applied on the Developer-tools page; Variables sits right after Messages, mirroring the home, now that it carries sub-matched data):

| # | Section | Bucket |
|---|---------|--------|
| 1 | Hero | 2a authored (animated phone notification, reduced-motion-aware) |
| 2 | Status band | B1 |
| 3 | Moment | 2a authored |
| 4 | Messages | 2b (locked to dominant category) |
| 5 | Variables | 2b (sub-matched example) |
| 6 | Details / Q&A | 2a authored |
| 7 | Numbers | 2b verbatim |
| 8 | Problem | B1 |
| 9 | Paperwork | B1 |
| 10 | Build | B1 |
| 11 | Test | B1 |
| 12 | Price | B1 |
| 13 | Rest (secondaries) | 2a authored — the honest secondary categories, named and framed editorially (NOT a second interactive browser) |
| 14 | Related | 2a authored — sibling-sub chips (live cross-links once sibling pages exist) |
| 15 | Closing CTA | B1 |

**Routing / canonical (D-436):** URL = `/for/{short-slug}` (short, human-curated kebab — e.g. `/for/developer-tools`), NOT the long `/lib/constraints` data slug. The page resolves its sub data (`name`/`bucket`/rules) from `/lib/constraints` by the canonical data slug separately. Each page is self-canonical (`canonical` → its own path, never `/`).

### Link model — Funnel / Fork / Farm

Three jobs for outbound links; keep them distinct so the page has exactly one spine and the rest reads as a quiet directory.

- **Funnel** — the forward CTAs that move a convinced reader into the tool. **Only three on a ship-it page:** Hero, the Messages section ("Open messages →"), and the Closing CTA. Do NOT add forward CTAs to Build, Test, How, Price, or Rest — extra funnels dilute the spine. (Funnels that are part of a verbatim home component stay; we neither add to nor strip the shared chrome — home must remain byte-identical. A landing-specific funnel is a landing-OWNED element composed *around* the component.)
- **Fork** — one sideways link for the reader who needs a specific detail before committing (e.g. Paperwork → "What registration actually involves →" to the 10DLC pain-point page). Rendered as a landing-owned element placed AFTER the verbatim component, never inside it. At most one per page.
- **Farm** — a quiet directory at the FOOT of the page (below the Closing CTA): sibling subs, the parent vertical hub, and a couple of common-question/concept pages. Low-contrast, link-list styling — a directory, not a CTA. It distributes authority across the cluster (internal-linking / topical-authority play) without competing with the funnel.

**Page-type rule for the Farm:**
- **Sub page** (ship-it / honest-no) → a *light* Farm: a few sibling subs + the vertical hub + 1–2 concept/question pages.
- **Vertical hub** → the hub's primary body IS the down-links to its subs (those read as Funnel links, not Farm); a Farm is redundant.
- **Topic / keyword page** → route to the single best-fit sub (or `/messages`); don't sprout a Farm of its own.

## Category-page type (D-437)

A **second** page type, distinct from the `/for/{slug}` sub-vertical ship-it page above. Where a ship-it page is one-per-sub (built from one mockup, routed `/for/{short-slug}`, sub data resolved from `/lib/constraints`), a **category page** is one-per-message-category, and all nine are generated from a single template + a data registry — nine same-shape pages from data, not nine forks.

- **Route:** one dynamic route `marketing-site/app/messages/[category]/page.tsx` — `generateStaticParams` over the registry, `dynamicParams=false` (unknown slug 404s), per-category `generateMetadata`, self-canonical to `/messages/{urlSlug}` (never `/`). The `/messages` hub (the configurator) is the segment index and does not collide.
- **Registry:** `marketing-site/lib/landing/categories.ts` — one `CategoryLanding` entry per category, authored by PM as a data block. The public **`urlSlug`** is split from the corpus key **`lockedCategory`**: equal for 7, differing for Orders (`orders`/`order-updates`) and Customer support (`support`/`customer-support`). The route param, canonical, sitemap, and Farm links key off `urlSlug`; `MessagesSection` + the corpus key off `lockedCategory`. Categories are **not** `/lib/constraints` sub-verticals — no constraints coupling.
- **Three reuse buckets** (same idea as the ship-it skeleton): **B1** shared chrome imported verbatim (status band, problem, paperwork, build, test, process, price, closing CTA, plus the bottom full `MessagesSection` with all 9 pills); **2b** same home component fed registry data (`MessagesSection` locked via `lockedCategory`; `VariablesSection` given the entry's `variablesExample`; `NumbersSection` verbatim); **2a** authored-from-registry sections — Hero, Moment, Details/Q&A — rendered by prop-driven components in `marketing-site/components/landing/*`. Section order mirrors the ship-it page.
- **Hero notification:** `hero-notification-mock.tsx` takes the entry's `heroExamples: string[]` — it rotates (with the pause toggle) when there are 2+ examples and renders a single static notification (no toggle) when there's one. One-vs-animated is data-driven by length, not a flag.
- **Farm:** the foot directory lists the **other 8 category pages** (`/messages/{urlSlug}` — real targets, all 9 are generated) plus the 2 standing concept/question links. (On a category page the Farm's "siblings" are the other categories, not other subs.)

The `/for/{slug}` ship-it skeleton above stays operative for the deferred dev-tools sub-vertical page; the two page types coexist (D-436 scoping cross-ref).

## Optimization findings

The core finding: the techniques converge. Writing for a builder's scan pattern, for AI extraction, and for durable SEO mostly reward the SAME structure. "Readable vs. optimized" is largely a false choice.

**Proven, and serve humans too — build the rules around these:**
- Answer-first / BLUF. AI retrieval scores a page on its opening; ~44% of LLM citations come from the first 30% of the text. First ~200 words answer the query directly.
- Chunked, self-contained sections (the "information island" test). Engines chunk a page and score passages independently — opening, each H2, each FAQ answer, each table row compete separately.
- Question-shaped headings ("Can a banking app send SMS?"). When a heading matches a query's phrasing, the content beneath becomes the candidate answer.
- Concrete data and tables. Adding statistics is the single most effective optimization (~30-40% visibility lift, Princeton/KDD). Tables cited ~4.2x more than equivalent prose; numbered lists ~2.7x. This is why our original data (registration timings, rejection-cause analysis) matters most.

**Durable SEO verities, unglamorous, still true:**
- Crawlability is the gate — verify GPTBot/ClaudeBot/PerplexityBot are allowed (Cloudflare now blocks AI bots by default in some configs); ship a sitemap.
- Topical authority via clusters + internal linking — maps directly onto our hub/sub link graph; AI uses query fan-out, so broad coverage beats one definitive post. Avoid orphans; link deliberately (every link splits the authority it passes).
- E-E-A-T, especially Experience — named authorship, primary-source data, first-hand signals. We've actually run the registrations; that's the edge.

**Contested / overhyped — honest verdicts:**
- llms.txt: adoption ~10%, no major AI company commits to reading it, near-zero crawler fetch in the data. Ship a simple one as cheap forward-looking B2A insurance; expect zero citation lift; do NOT build per-page markdown mirrors for it.
- Schema: rigorous controlled data shows near-noise (and slightly negative for already-cited pages) for generic Article/Breadcrumb schema. BUT attribute-rich Product/Review/Offer schema with REAL populated fields (pricing, ratings, specs) is cited more, and the advantage concentrates in lower-authority domains — which is us. So: Product/Offer/FAQ schema with populated fields; skip generic types; don't expect miracles.

## Capability as a tracked dependency

Pages assert what's true now (free authoring, no two-way, no marketing yet, per-sub timing). The backlog will change these, silently rotting pages. Make capability a tracked, linked dependency, not hardcoded prose:
- Write boundaries as a LINK to a small evergreen capability/status page, not a hardcoded sentence. When status flips, update one page; dependents inherit it (One Source Rule for capability claims).
- Airtable tracks page → capability links, so "what breaks when two-way ships?" is a query, not an audit.
- Side benefit: capability/roadmap pages are citeable concept pages, and a visible status + last-updated is a freshness signal.

## Competitor handling

Concentrate competitor co-occurrence in dedicated comparison pages and factual FAQ entries; keep sub-page bodies clean (VOICE §4 — no naming competitors in the primary marketing flow, no combative before/after). The comparison page is built to rank and be cited for "alternatives to X" queries; sub pages link to it rather than seeding "unlike Twilio…" into the body. Honest "RelayKit isn't right if you need X" content is high-trust and well-cited, but belongs on the comparison page where the reader is in evaluation mode — never on a page whose job is to convert a reader for whom we ARE right.

## To build (next sessions)

- The four templates (ship-it, honest-no, hub, comparison), each opening with its JTBD pair.
- First filled worked example: the healthcare-administrative ship-it page (use the edited version — tightened ~25-30%, builder-framed open).
- Second worked example: an honest-no page (candidate: crypto / personal investing).
- Cross-reference with the Airtable Pages base once its schema lands.
- **Legal-entity-required explainer (hub/concept page)** — content on why RelayKit needs a registered business entity. Needed soon, for when registration starts blocking sign-ups without one: this is the evergreen page that block links to, and that sub / honest-no pages reference. The truthful route for sole proprietors (form a registered entity → 10DLC) lives here. Flip side of the permanently-unsupported sole-proprietor constraint — frame as a clear requirement, not a rejection.
