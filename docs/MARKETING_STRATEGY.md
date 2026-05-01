# RelayKit Marketing Strategy

> **Purpose:** Single source for how we win the market with what we're building. Strategy, plays, decisions, channels, tooling. Audience-organized, trigger-conditioned, prose-readable.
>
> **Tier 3 doc.** Load on demand when marketing topics surface. Not read at session start.
>
> **Decisions discipline:** Marketing decisions live here, not in DECISIONS.md. DECISIONS.md carries a one-line pointer back to this doc for marketing-domain decisions. Same seven-gate-test rigor as product decisions; different file.
>
> **Companion:** docs/MARKETING_STRATEGY_ARCHIVE.md holds deprecated approaches with reasoning, in case conditions change and a parked direction becomes relevant again.

## North Star

RelayKit wins by being the SMS layer that indie hackers actually ship with — not because we have features competitors lack, but because we collapse the work of "send a compliant text from your app" into something a developer using AI coding tools can integrate in under thirty minutes. Pre-written compliant messages and handled carrier registration are the genuine differentiators. Audience-narrow, use-case-broad: we serve indie developers and small-team founders shipping SaaS apps with modern stacks (Next.js, Supabase, Stripe), and within that audience we cover every SMS use case those apps need. Verification is included with every plan — that's the marketing pillar that opens the door, not the entire product.

We win on distribution before we win on growth. Distribution is where 72% of indie products fail, not product. Our distribution lives in three places: where indie hackers start projects (starter kits like Makerkit, Supastarter, ShipFast), where they ask each other questions (Indie Hackers, Hacker News, Reddit's r/SaaS, AI-tool Discords), and where they read founders they trust (X, founder blogs, public-build threads). We are present in all three before we ask anyone to buy.

We stay scrappy and founder-led until at least $5K MRR or 50–100 paying customers, whichever comes first. The hire trigger is "channels are converting and Joel is the bottleneck on scaling them" — not "we should have marketing." Pre-revenue marketing spend ceiling is $0–$500/month, and most months it's the lower end. Time and content investment is unlimited.

## The Unfair Advantages We Lean On

Founder authenticity for the indie audience. Joel building RelayKit as a non-technical founder using AI coding tools is not a flaw in the story — it's the story. The audience we're targeting is people doing exactly that, and the product they get is the proof that it works.

Compliance abstraction is the genuine product differentiator. Twilio, Sinch, and Bandwidth give developers raw APIs and tell them to handle 10DLC themselves. Stytch and Auth0 are auth platforms with SMS as one feature, not SMS-with-compliance. RelayKit sits in unoccupied territory: SMS infrastructure where compliance is handled, registration is automated, and message templates are pre-written and pre-approved.

AI as force multiplier. Stripe's 2024 Indie Founder Report found 44% of profitable SaaS products are run by a single founder; the number doubled since 2018. AI coding tools cut development time by ~60%; AI-assisted content production cuts marketing execution from 20–30% of a founder's week to 5–10%. One person + AI tooling can do the work of a five-person team three years ago — but only if the AI is used for execution and the founder protects strategic and customer-facing work as their own.

Build-in-public posture. Public revenue, public failures, public learnings. Pieter Levels (Nomad List, $3M+ ARR) and Marc Lou (ShipFast, 8,100+ active users) both built audiences this way. The compounding asset isn't a follower count — it's the trust accumulated across months of honesty.

## Audience: The People We're Trying to Reach

The doc is organized by audience because every play traces back to who we're trying to reach. Within each audience, we list the plays in order of leverage with trigger conditions instead of dates.

### Primary: Indie hackers and small-team founders shipping with starter kits

These are developers and indie founders building SaaS products on modern stacks. They use Makerkit, Supastarter, ShipFast, KolbySisk's open-source starter, or the Vercel SaaS template as their starting point. They build with Cursor, Claude Code, or Windsurf. They ship fast, they iterate, they read indie founders' Twitter feeds. They have no patience for enterprise sales motions or carrier jargon. SMS is something they need but actively avoid because of 10DLC complexity. This is the launch audience.

**Where they are:** ShipFast Discord (5,000+ members), Supastarter community, Makerkit forums, Indie Hackers (1.2M+ members), Hacker News, r/SaaS and r/indiehackers on Reddit, dev Twitter / X, AI-tool Discords (Cursor, Claude Code, Windsurf, Lovable, Bolt).

**Plays for this audience, ranked by leverage:**

**Play 1 — Starter-kit integration program.** Download each major starter, integrate RelayKit using the SDK, document every friction point, fix the friction in our README and AGENTS.md, then send the working fork to the maintainer with a partnership pitch. Sequence: KolbySisk free starter first (lowest stakes, validates the integration), then ShipFast (Marc Lou is a one-person operation that ships everything; he'll try it), then Supastarter (Jonathan Wilke explicitly markets AI-coding-agent support — natural alignment), then Makerkit (most enterprise-leaning, highest reach), then Vercel official starter (institutional but slowest). Each integration is dual-purpose: validation + partnership. This replaces "build our own starter" entirely. Resend is the explicit playbook precedent — they got into the market by being embedded in everyone else's starters, not by building their own. **Trigger to start:** SDK published to npm. **Trigger to advance to next starter:** prior starter's integration is clean and the maintainer has been contacted (whether or not they've responded).

**Play 2 — Reference content as both integration guide and SEO landing.** "Add SMS to {starter}" guide at relaykit.ai/guides/{starter} for each starter. The guide is the integration reference + an affiliate landing page for the starter itself. Pricing stated transparently in each guide ($49 to register, $19/mo, full refund if registration rejected). Anyone landing on the page who doesn't own the starter clicks through our affiliate link to buy it. Per-customer math: a Makerkit affiliate sale (~$120 commission) covers ~2.6 years of rev share on one outbound RelayKit referral. **Trigger to start:** SDK on npm + first starter integration working. **Trigger to expand:** each new starter integrated.

**Play 3 — Indie Hackers / Hacker News presence.** Show up for feedback, not hype. Pieter Levels and Nathan Barry both built audiences by sharing revenue, failures, and decisions in public. Joel posts learnings (build progress, registration mechanics, AI-tool comparisons), responds genuinely to others, doesn't pitch. The 80/20 rule: 80% of posts help others, 20% mention the product, and only when relevant. Show HN at launch with the same posture: here's what we built, here's what we learned, ask away. **Trigger to start:** today (passive lead-bookmarking and community presence) → active posting once SDK is on npm. **Trigger to escalate:** product is live and shippable.

**Play 4 — Affiliate program participation.** Sign up for ShipFast (50% on first purchase), Supastarter, Saaspegasus, and Makerkit affiliate programs as reference content goes live. Free passive income on content already being produced. Disclose affiliate relationships clearly per FTC and per audience trust norms. **Trigger to start:** when first starter integration guide is live.

**Play 5 — Long-tail OTP / verification SEO.** Buyer intent for "send SMS verification code Next.js," "Twilio Verify alternative," "10DLC registration for indie hackers" is real and the long-tail keywords are winnable. Position content around these queries while positioning the product broadly ("developer SMS done right, including verification"). Article cadence: 1–2 per week, AI-assisted drafting with founder voice on top. SEO compounds — articles written today drive customers for years (cited 702% ROI over 3 years for content-led indie SaaS). **Trigger to start:** marketing site has a /guides path and at least one starter integration guide live.

**Play 6 — Beta cohort recruitment, vertical-diverse.** Per BACKLOG entry on OTP-led beta MVP. Recruit 5–8 testers diverse on intended use case (some appointments, some orders, some OTP-primary) — all use OTP during beta, all complete full carrier registration for their chosen vertical. Sourcing from bookmarked Reddit / HN / X complaints about 10DLC + AI-tool Discord members + Indie Hackers regulars. Outreach script: warm reply to public 10DLC complaint, no cold templates. Beta value exchange: free OTP messages during beta, registration fee waived, grandfathered pricing at launch. **Trigger to start recruiting:** Phase 6 (verification feature) is shipping, registration flow works for non-RelayKit customers. **Trigger to close cohort:** 8 testers committed.

**Play 7 — X / dev Twitter presence.** Build-in-public thread cadence, weekly. Topics: what shipped this week, what broke, what we learned about carrier mechanics, AI-coding-tool comparisons, integration walkthroughs. Audience compounds slowly; this is a 12-month investment, not a 30-day one. **Trigger to start:** today (low intensity), escalate when SDK is on npm.

### Secondary: AI-tool-first builders (Cursor / Claude Code / Windsurf users)

Subset of the primary audience but with a sharper hook: they've experienced first-hand what "AI tool integrates an SDK in 3 minutes" feels like, and they recognize the pattern when our README/AGENTS.md is structured for it. Reachable through the same channels but with different copy emphasis. Activation moment: they paste our SDK README into their AI tool and watch the integration happen.

**Plays:** AGENTS.md as a marketing artifact (the file an AI tool reads to integrate us — quality of this file is itself a sales pitch when developers compare AI integration experiences), AI-tool comparison content ("which AI coding tool integrates SMS fastest?" — RelayKit wins because we built for this), demos in Cursor / Claude Code / Windsurf walkthroughs posted to YouTube and Twitter.

**Trigger conditions:** SDK published with AGENTS.md polished → integration demos recorded → comparison content shipped.

### Tertiary watch: No-code vibe coders (Lovable / Bolt / Replit users)

A genuinely large audience but a different delivery model is required. These users don't `npm install` anything. RelayKit would need to be a native connector, a Twilio-API-drop-in, or a hosted endpoint configured through a UI. Lovable launched a Twilio connector that exposes raw Twilio without compliance — that's the gap, and it's unoccupied. Building for this audience is a Phase 5+ exploration, not a launch play. The reason it's worth tracking: if Lovable/Bolt/Replit usage continues to grow, the addressable market for RelayKit-as-connector is potentially larger than the technical-vibe-coder market.

**Trigger to activate as a target:** RelayKit has paying customers in the primary audience and a connector-shaped delivery model has been scoped (post-launch product work).

## Plays in Active Sequence

This section is the operational view across audiences — what fires when, regardless of which audience the play is for.

### Pre-launch (now → SDK on npm)

- Bookmark warm leads. Every public 10DLC complaint on Reddit, HN, X goes into a leads list. No outreach yet, just capture.
- Set up affiliate accounts (ShipFast, Supastarter, Makerkit, Saaspegasus). Trivial; do it now.
- Draft the starter-kit integration guide template (one canonical structure, fill in per starter as integrations land).
- Joel begins low-intensity X presence: weekly build-in-public posts, no pitch.
- Sign up for / lurk in: Indie Hackers, ShipFast Discord, Supastarter community, Makerkit forum, Cursor / Claude Code / Windsurf Discords.

### Launch wave (SDK live → first 10 customers)

- Show HN post. Format: "Show HN: I built an SMS layer for indie hackers — here's what I learned about 10DLC." Honest, link to relaykit.ai, link to the GitHub. Engage every comment for the first 24 hours.
- Indie Hackers launch post. Same content, IH norms (revenue transparency, failure honesty).
- Manual outreach to bookmarked leads. Personal messages, not templates. "I noticed you posted about 10DLC headaches in March. We just shipped something that handles that. Want to try it free during beta?"
- Marc Lou DM with working ShipFast fork. Same for Jonathan Wilke / Supastarter, KolbySisk, Makerkit.
- First reference content live: at least one /guides/{starter} page.

### Growth wave (10 → 50 customers)

- Reference content production accelerates: one starter guide per week.
- Affiliate-program activation. Place affiliate links in every guide.
- Long-tail SEO investment. 1–2 AI-assisted articles per week targeting OTP / verification / 10DLC / starter-specific queries.
- Beta cohort testimonials surfaced as case studies.
- X presence escalates: daily or near-daily posts, integration demos as visual content.

### Scale signal (50–100+ customers)

- Re-evaluate hiring. The signal is "channels convert and Joel is the bottleneck on scaling them," not "we have more revenue."
- If hiring: fractional or contract dev-marketing specialist with developer-audience experience. Not a generalist. Pieter Levels' rule: "Hiring is increasing the complexity of your product, business and life." Default is no hire.
- Content systems-vs-founder-output question: is content production something a contractor can take over, or is founder voice still the moat? Likely founder voice for X / IH / HN, contractor-able for SEO articles.
- Possible no-code expansion exploration. If Lovable/Bolt/Replit usage signals are strong, scope a connector-shaped delivery model.

## Marketing Decisions on Record

Each decision states what was decided, what was rejected, what triggers a revisit. Same gate-test rigor as product decisions in DECISIONS.md.

**MD-1 — Audience-narrow, use-case-broad positioning.** We position RelayKit as "the SMS layer for indie hackers shipping with starter kits," covering every SMS use case those apps need. Rejects: "RelayKit for OTP" (use-case-narrow — leaves money on the table; OTP space saturated with focused competitors), "RelayKit for everyone who needs SMS" (audience-broad — diluted message, can't compete with Twilio on generality). Trigger to revisit: customer base diverges meaningfully from the indie-hacker profile, or a vertical use case dominates such that audience-narrow framing creates friction.

**MD-2 — Founder-led marketing until $5K MRR or 50–100 customers.** Joel runs all customer-facing marketing personally. AI tools assist execution; founder voice and customer conversations stay protected as Joel's. Rejects: hire a marketer pre-revenue, hire an agency, run paid ads at scale. Trigger to revisit: Joel identifies a channel that converts but lacks bandwidth to scale it.

**MD-3 — Build-in-public posture with revenue transparency.** Joel publishes revenue, failures, and learnings on X / Indie Hackers. Pieter Levels / Marc Lou / Nathan Barry pattern. Rejects: opaque marketing (lose trust), partial transparency (flagged as performative). Trigger to revisit: revenue transparency creates a competitive disadvantage (e.g., enterprise customer requires confidentiality).

**MD-4 — Starter-kit embedding strategy, not first-party starter.** RelayKit is integrated into existing successful starters (Makerkit, Supastarter, ShipFast, KolbySisk's, Vercel's), not packaged as its own starter. Resend playbook. Rejects: build our own starter (already considered and dropped — see archive), no starter strategy. Trigger to revisit: every major starter rejects partnership, or our integration quality consistently fails maintainer review.

**MD-5 — Affiliate-program participation as revenue side-channel.** Sign up as affiliates for every starter we produce reference content for. Disclose relationships clearly. Rejects: hide affiliate relationships, refuse affiliate income on principle, build an affiliate program of our own pre-launch. Trigger to revisit: affiliate income exceeds 20% of revenue (becomes a real strategic axis), or a starter program creates a conflict of interest.

**MD-6 — Community presence, not cold email or paid acquisition, until $5K MRR.** Free channels only: Indie Hackers, HN, Reddit, X, Discords, GitHub. Cold email blasts and paid ads off the table. Rejects: outbound email at scale (poor fit for indie audience, AI-detection now defeats it), paid acquisition (CAC math doesn't work pre-revenue). Trigger to revisit: $5K MRR threshold, or a cold-email play is being run by a contractor we trust to do it without sounding AI-generated.

**MD-7 — "Verification included" as the marketing pillar.** Every vertical includes built-in phone verification. Pillar wording confirmed in PM Session 62 / VERIFICATION_SPEC §12. This is not a use-case positioning — it's a feature inclusion that opens conversion paths from OTP-search buyers without narrowing the product. Rejects: "free OTP" (pricing implication issues), "OTP-only positioning" (collapses the audience and use case). Trigger to revisit: validation-flow shipping reveals demand patterns we didn't anticipate.

**MD-8 — DEFERRED — Pricing transparency stance.** The cost-show / margin-show / value-show question (per the March pricing-transparency conversation) is parked. We default to value-stated-as-facts pricing on the marketing site (the existing Voice Principles posture), without publishing cost structure. The richer transparency move is real but the strategic call hasn't been made. Trigger to resolve: a competitor undercuts on price and we want to surface our cost structure as defense, OR Joel wants to make the case proactively as differentiation.

## Tools and Force Multipliers

### AI roles

- **PM Claude (browser):** strategy, doc maintenance, marketing copy review, voice consistency, decision drafting. Joel's thinking partner.
- **Claude Code:** doc execution, marketing artifact production (landing pages, guides, integration walkthroughs, READMEs, AGENTS.md), site builds. Marketing-strategy-doc maintenance same way as MASTER_PLAN.
- **ChatGPT:** first-draft long-form research-heavy posts, AI-tool-comparison content, research synthesis when Claude's web search isn't the right fit.
- **v0:** landing-page drafts when shadcn-styled scaffolding is faster than from-scratch.
- **Perplexity:** ad-hoc competitive research with citations. Used for fact-finding, not voice-sensitive work.
- **Cursor / Claude Code (in IDE):** marketing site builds, integration code in starter forks.

### Content quality discipline

Anything human-facing (cold outreach, X posts, IH posts, customer emails) is founder-voiced even if AI-drafted. Anything machine-facing (SEO articles, docs, AGENTS.md) can be AI-heavy with founder review. AI-detection by recipients is real in 2026 — recipients flagging "this sounds AI-written" cuts reply rates dramatically. Founder voice is not aesthetic preference; it's reply-rate insurance.

### SaaS tooling — one of each, no proliferation

- **Plausible or Fathom** for site analytics. Privacy-respecting; the dev audience notices and approves.
- **Resend** for email. Integrates cleanest with our stack; affiliate program available; built by the same playbook we're following.
- **Posthog** for product analytics, post-customer-acquisition.
- **Cal.com** for any 1:1 demos or beta-onboarding calls. Open-source, indie-aligned, also represents one of our ICP archetypes (eat the dog food).
- **Senja or Testimonial.to** when testimonials start flowing.
- **GitHub** as the social hub. The README is marketing; the AGENTS.md is marketing.

Tooling decisions are captured in this section. Adding a tool to the stack lands here, not silently.

### Mentor reading list (free, asynchronous)

We don't talk to these people. Their public writing is our curriculum.

- **Pieter Levels (Nomad List):** bootstrapping, transparency, multi-product portfolio, "no team by design"
- **Marc Lou (ShipFast):** velocity, indie distribution, X presence, ship-fast-and-iterate
- **Jonathan Wilke (Supastarter):** AI-native developer products, starter-kit operator economics
- **Nathan Barry (ConvertKit):** personal outreach scaling, creator-economy lessons, building systems on top of personal effort
- **Tony Dinh (Black Magic / TypingMind):** solo SaaS at scale, Asia-based bootstrapping
- **Rauno Metsa (Linear / Indie SaaS):** design-as-marketing in dev tools

## Channels

Per-channel snapshot of current state and trigger conditions.

- **relaykit.ai** — homepage live, /start/verify live, /guides/ path planned. Trigger for guides: SDK on npm.
- **GitHub (JoelNatkin/relaykit)** — public repo. README is the integration entry point. AGENTS.md is the AI-tool entry point. Both are marketing artifacts, treated with the same discipline as customer-facing copy.
- **X / dev Twitter (@joelnatkin)** — low-intensity build-in-public posts now; daily presence post-launch.
- **Hacker News** — Show HN post planned for launch. Engage on others' posts with relevant context (10DLC, indie SaaS) before then.
- **Indie Hackers** — passive presence now; active posting once SDK ships.
- **Reddit (r/SaaS, r/indiehackers, r/webdev)** — passive lead bookmarking; active engagement on 10DLC threads opportunistically.
- **Starter-kit communities** — ShipFast Discord, Supastarter community, Makerkit forum. Lurk now, engage when integrations land.
- **AI-tool Discords** — Cursor, Claude Code, Windsurf, Lovable, Bolt. Lurk now, engage when comparison content ships.
- **Email list (msgverified.com / relaykit.ai newsletter)** — not yet collected. Trigger to start: SDK on npm.

## What We're Explicitly Not Doing

- Paid ads pre-revenue (CAC math doesn't work; reserved for post-$5K-MRR experimentation).
- Hiring pre-revenue (Pieter Levels rule: hiring increases complexity of product, business, life).
- Building our own starter kit (superseded by embedding strategy — see archive).
- Cold email blasts (poor fit for audience; AI-detection defeats it; trust-eroding even when it works).
- Healthcare ICP (D-18 — declined at intake).
- Enterprise sales motion (wrong audience, wrong product shape, wrong founder).
- Conference sponsorship (CAC math, founder-time math, audience-fit math all fail).
- Press / journalist outreach (not where indie audience reads; not how this product gets distributed).

End of file.
