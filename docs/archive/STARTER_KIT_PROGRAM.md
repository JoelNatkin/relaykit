> **ARCHIVED 2026-04-27.** Strategic premise (first-party RelayKit-built starter kits) retired by MASTER_PLAN §13 + §16. RelayKit no longer builds its own starters; Phase 9 integrates RelayKit into existing third-party starters.
> **See instead:** MASTER_PLAN.md §13 (Phase 9 — Starter Kit Integration Validation) and docs/AI_INTEGRATION_RESEARCH.md (Phase 8 rationale + AGENTS.md template work).

---

# STARTER_KIT_PROGRAM.md — RelayKit
## Open-Source App Starters as Developer Acquisition Channel
### Status: BACKLOG — Post-Launch Initiative
### Captured: March 31, 2026
### Updated: April 17, 2026 (Sections 12–19 added)

---

## 1. WHAT THIS IS

Open-source app foundations on GitHub with Supabase auth, Stripe billing, and RelayKit SMS pre-integrated — designed for AI coding tools (Claude Code, Cursor, Windsurf) to customize into any vertical. Each starter is intentionally minimal: clean structure, working infrastructure, and AI-friendly documentation that invites the developer to make it theirs.

**This is a complement to the core product, not a replacement.** Most developers will add RelayKit to existing apps or build their own from scratch using the SDK directly. The starters serve developers who want a running start on a new project — and who may not have discovered RelayKit otherwise.

---

## 2. STRATEGIC THESIS

### The problem starters solve

Vibe coders can generate UI and CRUD logic with AI tools in minutes. What they can't generate is the invisible infrastructure that has real consequences when done wrong: carrier-compliant SMS, TCPA consent management, 10DLC registration. These are exactly the things AI tools hallucinate or skip entirely.

### The positioning

A RelayKit starter is not a template. It's a foundation that already solved auth, payments, and compliant SMS — the developer's AI tool handles everything else. The creative possibilities are effectively infinite because the starter doesn't define the app category; the developer does.

**Key framing:** "This starter ships with working auth, Stripe billing, and compliant SMS via RelayKit. Everything else is yours to build."

### Why this works for RelayKit specifically

1. **Trojan horse for adoption.** RelayKit is already wired in. The developer isn't evaluating whether to add SMS — it's already there, working. Removing it is harder than keeping it.
2. **The demo moment is tangible.** A real text message arriving on a real phone is the most compelling demo in developer tooling. Every starter produces this moment within minutes.
3. **Sandbox-first conversion.** Developers build, test, and validate their app idea in sandbox mode — free, no credit card, no time limit. They only pay when they've proven the concept works for their business. (Consistent with existing sandbox conversion path in PRICING_MODEL.md.)
4. **Content flywheel.** Each vertical is a unique GitHub repo, unique search result, unique YouTube video. Creators can't exhaust the content because each vertical is a different story with the same payoff.
5. **Long-tail SEO.** "Next.js appointment booking app with SMS," "Cursor build restaurant order notifications," "AI built veterinary reminder app" — each starter generates its own cluster of discoverable terms.

---

## 3. ARCHITECTURE

### Shared core (identical across all starters)

- **Supabase** — auth, database, row-level security
- **Stripe** — billing scaffold (checkout session, webhook handler, subscription management)
- **RelayKit SDK** — `npm install relaykit`, zero-config init, sandbox API key from env
- **SMS_GUIDELINES.md** — compliance co-pilot for the developer's AI tool (D-283)
- **AI-optimized README** — what the starter includes, what's yours to build, suggested AI prompts, pricing transparency section

### Vertical scaffolding (thin layer per starter)

- Data model that implies a direction (e.g., appointments table, products table, contacts table)
- 1–2 seed routes that establish the app pattern
- RelayKit message types wired to the relevant use case namespace (e.g., `relaykit.appointments.*`, `relaykit.orders.*`)
- Vertical-specific README section with customization prompts

### One codebase, light forks

The core is maintained as a single repository. Each vertical starter is a thin fork that adds the scaffolding layer. Spinning up a new vertical is a half-day of work once the core is solid: define the data model, wire in the relevant SDK namespace, write the vertical README section, push to GitHub.

---

## 4. RELATIONSHIP TO EXISTING SYSTEMS

### Template engine (PRD_02)

The template engine already defines message libraries across 8 use cases (appointments, orders, verification, support, marketing, internal, community, waitlist) plus `exploring`. Each starter selects from this existing library via the SDK namespace pattern. **No new message content is needed** — the starters consume what the template engine already produces.

### SDK (validated, D-265–D-278)

The SDK's per-vertical namespace pattern (`relaykit.appointments.sendConfirmation()`, `relaykit.orders.sendShipping()`) was validated across 25 experiment rounds with 3 AI tools. The starters are the natural public distribution of this validated pattern. AI tools read the SDK function names, infer integration points, and wire calls correctly on first attempt (D-268).

### Build spec validation

The validation program tested whether AI coding tools can read a spec and produce a working SMS integration in an existing codebase. The starters are the productized output of this work — existing codebases with the integration already done, ready for AI tools to extend. If validation succeeded (it did, D-265), the starters are proven by design.

### Sandbox and conversion path (PRICING_MODEL.md)

The starter funnel is identical to the existing conversion path:

Starter clone → AI customization → sandbox testing → idea validation → registration CTA → $49 submission → approval → $150 go-live → $19/month

The sandbox's role as customer acquisition infrastructure (documented in PRICING_MODEL.md Section 1) extends naturally to starters. The starter is just a new entry point into the same funnel. Sandbox costs are unchanged — shared phone number, ~$0.0079/segment, budgeted as acquisition cost.

### Message reference page / lead magnet (existing backlog idea)

The starters supersede the message reference page concept as a lead magnet. A message reference page says "here's what compliant SMS looks like." A starter says "here's a working app with compliant SMS already in it — make it yours." The reference page could still exist as a secondary content asset, but the starters are the higher-conversion version of the same idea.

> **Note:** This is a positioning evolution, not a contradiction. The message reference page remains viable as lightweight content marketing. The starters are the experiential version that converts at a higher rate because the developer has a running app, not a document.

### Competitive positioning (STRATEGY_NOTES.md)

The starters reinforce RelayKit's "category of one" position. Per STRATEGY_NOTES.md, nobody else has built a delivery model where an AI coding tool reads an SDK and produces a compliant SMS integration. The starters extend this advantage by putting that SDK inside a working app — the developer experiences the "3 minutes to a real text message" promise (STRATEGY_NOTES.md, Path to 10/10) without visiting relaykit.ai first.

### Experience Principles (V4 v1.1)

Starter READMEs follow the same voice and principles:

- **Unequivocal claims:** "This starter ships with compliant SMS. RelayKit handles registration, compliance monitoring, and opt-out enforcement."
- **Pricing as facts:** "$49 to register. $150 after approval. Full refund if rejected. $19/month after that."
- **No forbidden vocabulary:** No "campaign," "promotional," "required," "violation."
- **Developer as hero:** "Your AI tool builds the app. RelayKit handles the compliance."

---

## 5. PRICING TRANSPARENCY

Every starter README includes a plaintext pricing section. No links to a pricing page. No "see plans." The developer knows exactly what RelayKit costs before they clone the repo.

```
## RelayKit Pricing

Build and test for free in sandbox. No credit card, no time limit.

When you're ready to go live with real customers:
- $49 to submit your registration
- $150 after carrier approval (full refund if rejected)
- $19/month — 500 messages included, dedicated phone number, 
  compliance monitoring, opt-out enforcement

That's it. No hidden fees.
```

This is consistent with D-216 (pricing as facts, not fine print) and the Experience Principles prohibition on dark patterns.

---

## 6. CONTENT AND DISTRIBUTION SCALE

### Use case × vertical matrix

Each of the 8 production use cases (excluding `exploring`) maps to multiple real-world verticals:

| Use case | Example verticals |
|----------|------------------|
| Appointments | Salons, medical offices, auto shops, tutoring, pet grooming, fitness studios, spas, dental, veterinary, consultants |
| Orders | Restaurants, retail, e-commerce, bakeries, florists, meal prep, coffee shops, print shops |
| Verification | Any app with login, two-factor auth, account recovery |
| Support | SaaS help desks, IT support, customer service portals |
| Marketing | Retail promotions, loyalty programs, event marketing, seasonal sales |
| Internal | Team scheduling, shift management, office communications |
| Community | Clubs, religious organizations, sports leagues, neighborhood groups |
| Waitlist | Restaurants, popular venues, product launches, enrollment |

Each cell in this matrix is a potential starter, a potential YouTube video, a potential search result. The matrix doesn't need to be fully populated — even 5–10 starters across the highest-demand verticals creates significant distribution.

### Creator content mechanics

The "first text message" demo moment maps directly to the AI coding tool YouTube format ("I built X in Y minutes"). Each vertical is a unique video with the same satisfying payoff. Creators don't need to be paid or recruited — if the starter is genuinely good and the demo moment is genuinely impressive, the format produces itself.

### SEO mechanics

Each starter repo generates long-tail search terms organically:
- "{vertical} app with SMS notifications"
- "build {vertical} app with AI coding tool"
- "Next.js {vertical} app starter template"
- "{AI tool} build {vertical} booking/ordering/notification app"

---

## 7. BUILD PLAN

### Prerequisites (must be done before starters ship)

These are all on the existing production build priority list:

1. **Published npm package** — production SDK on npm (Priority 1 in consolidated PRD)
2. **Sandbox API endpoint** — `POST /v1/messages` that actually delivers (Priority 2)
3. **Sandbox signup flow** — issue API key, verify phone (Priority 3)

The starters cannot ship until a developer can `npm install relaykit`, set an env var, and receive a real sandbox text message.

### Starter build sequence

1. **Core foundation repo** — Supabase auth + Stripe billing + RelayKit SDK + SMS_GUIDELINES.md + AI-optimized README. This is the shared base.
2. **First vertical: Appointments** — highest existing content depth (PRD_02 has 6 base + 3 expansion messages, full campaign description, opt-in description). Data model: services, appointments, clients. SDK namespace: `relaykit.appointments.*`.
3. **Second vertical: Orders** — different app architecture validates generalization (proven in validation Round 4, D-269). Data model: products, orders, customers. SDK namespace: `relaykit.orders.*`. **Gated — see §19.**
4. **Expand based on traction** — add verticals where search demand, creator interest, or user requests indicate opportunity. Each new vertical is ~half a day of work.

### Estimated effort per starter

- Core foundation (one-time): 2–3 days
- Each vertical fork: 4–8 hours
- README and AI prompts: 1–2 hours per vertical
- Ongoing maintenance: dependency updates, SDK version bumps, README refinements

### Maintenance scope

The starters are intentionally minimal, which limits maintenance burden:
- Keep the RelayKit SDK version current
- Keep Supabase/Stripe/Next.js dependencies reasonable
- Verify AI tool prompts still produce good results (quarterly spot check)
- No UI polish to maintain — the AI tool handles that

---

## 8. WHAT THIS IS NOT

- **Not a replacement for the SDK-first path.** Most developers will `npm install relaykit` into their own existing app. The starters are an additional entry point, not the primary one.
- **Not a finished app.** The starters are intentionally raw — clean structure, working infrastructure, minimal UI. The developer's AI tool makes it theirs.
- **Not a hosted platform.** RelayKit doesn't host the developer's app. The starter is a repo they clone and deploy wherever they want (Vercel, Railway, their own server).
- **Not gated content.** Fully open source, no signup required to clone. Conversion happens when the developer wants to send real messages to real customers.

---

## 9. POTENTIAL CONTRADICTIONS AND NOTES

> **"Two files" positioning (existing backlog note):** The current backlog notes that "two files" (the delivery mechanism) should not be advertised publicly because it exposes the approach to competitors. The starters inherently reveal the integration pattern (SDK + SMS_GUIDELINES.md). By the time starters ship, the SDK will be public on npm anyway — the pattern is visible by design. The competitive moat is the combination of SDK + template engine + compliance automation, not the delivery mechanism itself. **No contradiction, but worth acknowledging the shift.**

> **Message reference page (existing backlog idea):** This document positions starters as the higher-conversion version of the lead magnet concept. The message reference page is not invalidated — it could serve as a lightweight content asset for developers who aren't ready to clone a repo. **Complementary, not contradictory.**

> **PRD_07 Landing Page (last in production build order):** The starters could generate traffic before the landing page is built. Developers arriving from GitHub repos need somewhere to land. The starters' README pricing section and a link to sandbox signup may be sufficient initially, but PRD_07 should account for starter-sourced traffic in its design. **Sequencing consideration, not a contradiction.**

> **Platform tier (PRD_10, Phase 2):** Platform customers (scheduling platforms with 100+ tenants) might also benefit from starters customized for their architecture. This is Phase 2 scope. Do not design starters for platform-tier use cases now. **No contradiction — explicitly out of scope.**

---

## 10. SUCCESS METRICS (post-launch)

- GitHub stars and forks per starter repo
- Sandbox signups attributed to starter repos (track via UTM or referrer)
- Conversion rate: starter clone → sandbox signup → registration
- Creator content volume (YouTube videos, blog posts, tweets featuring starters)
- Search impressions for starter-related long-tail terms
- Time from clone to first sandbox message (target: under 10 minutes)

---

## 11. TIMING

**Build after:** Production SDK is published, sandbox API endpoint works, sandbox signup flow exists (Priorities 1–3 in consolidated PRD).

**Build before:** Major marketing push, Product Hunt launch, or paid acquisition spend. The starters should be discoverable before money is spent driving traffic.

**Overlap with:** Build spec validation work (the integration patterns are already validated). Core foundation repo can be started as soon as the SDK is on npm.

---

## 12. TECHNICAL STACK

Locked-in stack decisions for the core foundation. Every vertical fork inherits these choices.

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 15+ App Router | Server components default; AI coding tools know the pattern cold |
| Language | TypeScript strict | Type safety during AI-generated modifications |
| Database + auth | Supabase (Postgres + Auth, magic-link) | Matches RelayKit's own stack |
| ORM | Drizzle (primary) or Prisma (acceptable alternative) | Drizzle preferred for AI readability |
| Payments | Stripe Checkout + webhook handler | Lowest-friction billing path |
| SMS | RelayKit SDK (`npm install relaykit`) | Obviously |
| UI | Tailwind v4.1 + shadcn/ui | shadcn gives developers a component library they own, no runtime dep |
| Deployment | Vercel primary; any Node host supported | One-click Deploy button in the README |

**Why shadcn/ui over a component library:** shadcn copies components into the developer's repo rather than installing as a dependency. AI tools can edit the components freely, and the developer owns the code. Lower friction than MUI or Chakra for starter use.

**Why Drizzle over Prisma:** Drizzle's schema file reads more like SQL and less like magic. AI tools handle it more reliably for novel schemas. Prisma still works — if a developer's AI tool reaches for Prisma, don't fight it.

---

## 13. FILE STRUCTURE

Group-by-feature layout. Matches the patterns AI coding tools produce most reliably.

```
/app
├── (auth)/
│   ├── login/page.tsx
│   └── signup/page.tsx
├── (dashboard)/
│   ├── layout.tsx
│   └── [feature]/
│       ├── page.tsx
│       └── actions.ts        # Server actions colocated
├── api/
│   └── webhooks/
│       └── stripe/route.ts
├── layout.tsx
└── page.tsx                   # Landing page with pricing block

/lib
├── relaykit/
│   ├── client.ts              # SDK init (see SDK_BUILD_PLAN §7)
│   └── notifications.ts       # Wrapper functions per business event
├── supabase/
│   ├── client.ts              # Browser client
│   ├── server.ts              # Server client
│   └── middleware.ts          # Auth middleware
├── stripe/
│   └── client.ts              # Stripe init
└── db/
    ├── schema.ts              # Drizzle schema
    └── index.ts               # DB client

/components
└── ui/                        # shadcn components (copied in, not imported)

/types                          # Shared type definitions
```

**The `/lib/relaykit/` convention is prescriptive** — every starter ships with this structure and the wrappers pattern (see SDK_BUILD_PLAN.md §7). Developers adding new notifications extend `notifications.ts` rather than calling the SDK directly from route handlers.

---

## 14. WHAT'S SHIPPED IN THE STARTER

Extends the "Shared core" and "Vertical scaffolding" descriptions in §3 with concrete deliverables.

**Infrastructure**
- Supabase project config + migration files for auth tables
- Magic-link auth flow (signup, login, logout, session middleware)
- Stripe Checkout session creator
- Stripe webhook handler for subscription events
- RelayKit SDK pre-integrated; `lib/relaykit/client.ts` and `lib/relaykit/notifications.ts` scaffolded
- `.env.example` with every required variable commented

**UI scaffolding**
- Landing page with the pricing transparency block from §5
- Signup and login pages
- Authenticated dashboard shell with navigation
- Empty state for whatever vertical-specific content lives at `/dashboard`

**Vertical-specific (Appointments example)**
- `appointments` table schema with Drizzle types
- Two seed routes: create-appointment and list-appointments
- `notifyBookingCreated()` and `notifyBookingReminder()` wrappers in `lib/relaykit/notifications.ts`
- SMS_GUIDELINES.md tailored to the Appointments vertical (D-283)

**Developer tooling**
- `AGENTS.md` at repo root (template in §16)
- `README.md` with the pricing block, quick-start, and customization prompts
- Smoke test that verifies auth works and a single RelayKit send succeeds

---

## 15. WHAT'S NOT IN THE STARTER

Intentional omissions. Every one of these is something an AI coding tool can add in minutes on request — shipping them would raise maintenance burden without improving the demo moment.

- Notification preferences UI (per-user opt-in, digest controls, channel selection)
- Calendar integration (Google Calendar, iCal, Outlook)
- Team / multi-seat features
- Email templates (RelayKit is SMS only)
- Analytics dashboards
- i18n / localization
- Mobile UI polish beyond Tailwind defaults
- Accessibility audit (Tailwind + shadcn get us to a reasonable baseline; full WCAG is the developer's job)
- Tests beyond the smoke test

If a developer asks "why doesn't the starter have X?" — the answer is "your AI tool can add it faster than we can keep it maintained."

---

## 16. AGENTS.md SNIPPET (TEMPLATE)

Every starter repo ships with `AGENTS.md` at the root, under 60 lines, telling AI coding tools what's already wired and what they can safely modify.

Draft template — refine once SDK_BUILD_PLAN.md README is finalized so namespaces and signatures stay in sync:

```markdown
# AGENTS.md

## What this project is

A [vertical] app scaffold with Supabase auth, Stripe billing, and
compliant SMS via RelayKit already wired in. Build on top of what's here.

## Hard constraints

- RelayKit SDK calls run server-side only. Never import `relaykit` into a
  client component. Never expose `RELAYKIT_API_KEY` to the browser.
- Do not modify the shape of RelayKit SDK calls. Wrapper functions in
  `/lib/relaykit/notifications.ts` are where new notification events go.
- Do not implement opt-out (STOP), quiet hours, or consent storage.
  RelayKit handles all three at the platform level.

## Where things live

- Auth: /lib/supabase/
- Payments: /lib/stripe/
- SMS: /lib/relaykit/
- Database schema: /lib/db/schema.ts
- Routes: /app/

## RelayKit methods available for this vertical

[personalized per vertical — for Appointments:]
- relaykit.appointments.sendConfirmation({ to, data })
- relaykit.appointments.sendReminder({ to, data })
- relaykit.appointments.sendCancellation({ to, data })

See node_modules/relaykit/README.md for full signatures and data shapes.

## Commands to run before committing

- npm run typecheck   — pass clean
- npm run lint        — pass clean
- npm run test        — smoke test only; does not send real SMS
```

A fuller draft lives in `docs/AI_INTEGRATION_RESEARCH.md` §8. When the SDK README reaches final form, do a same-session sweep of all starter AGENTS.md files to keep the signatures in sync.

---

## 17. DISCOVERABILITY

Where starters live and how developers find them.

- **GitHub organization:** `github.com/relaykit/starter-{vertical}` (e.g. `starter-appointments`, `starter-orders`)
- **Vercel template gallery:** a "Deploy" button in each README, submitted to Vercel's public gallery once the starter has real users
- **RelayKit marketing site:** a dedicated starters page, one card per vertical, deep-linking to the GitHub repo
- **npm keywords:** the published `relaykit` package tags include `starter`, `template`, and vertical names so npm search cross-references
- **README backlinks:** every starter links to relaykit.ai with UTM parameters, so sandbox signups are attributable to the originating starter

**No paid distribution until organic volume justifies it.** Wait until at least one starter hits triple-digit weekly clones from organic search and social before spending on placement.

---

## 18. MAINTENANCE MODEL

Extends the "Maintenance scope" bullet list in §7 with concrete policy.

- **Ownership:** RelayKit owns all starter repos. Contributors welcome via pull request; direct commit access restricted to the team.
- **Next.js version pinning:** starters pin to Next.js major releases. Bump when Next.js ships a major; ignore minor version chasing.
- **SDK version bumps:** automated via Dependabot (or equivalent). Each bump runs the smoke test; manual sign-off before merge if the smoke test fails.
- **Quarterly AI tool sanity check:** paste the integration prompt (SDK_BUILD_PLAN §5) into Claude Code, Cursor, Windsurf, Lovable, Bolt, and Replit. Verify each still produces a working integration from a fresh clone. Document the results. If any tool regresses, the README or AGENTS.md needs a revision — not the other way around.
- **Supabase and Stripe dependencies:** bump quarterly unless a security advisory forces sooner.
- **No responsive-design maintenance.** Tailwind defaults are the floor; the developer's AI tool polishes UI as part of customization. RelayKit does not ship visual refinements to starters.

---

## 19. VALIDATION GATE BEFORE SECOND STARTER

Updates §7 Step 3.

Before building the Orders starter (or any subsequent vertical), the Appointments starter has to prove it works in the wild — not just in principle.

### The gate

- **10+ real developers** have cloned the starter and customized it with an AI tool
- **3+ sandbox signups** attributable to the starter via UTM or referrer
- **5+ pieces of developer feedback** (survey responses, DMs, direct conversations) on what worked and what didn't

Hit all three → build the next starter. Miss any one → iterate on the first before expanding.

### Why this gate exists

The per-vertical generalization is proven in principle (D-269, 25 experiment rounds). That's not the same as the starter being *useful* to real developers. Building the second starter before validating the first is how projects accumulate unused scaffolding that's expensive to maintain and contributes nothing to adoption.

Real developers also surface things that are invisible in internal testing: confusing README ordering, assumptions baked into the AGENTS.md, missing seed data, `.env.example` gaps, AI tools that handle the pattern worse than the validation rounds suggested.

### Timing expectation

If the Appointments starter doesn't hit the gate in **~8 weeks** after launch, the problem is either the starter or the market. Don't push through by building more verticals — fix the first one, or step back and re-evaluate the thesis.

### Per-vertical effort

§7 estimates "4–8 hours per vertical fork" plus README and AI prompt refinement. In practice, once AGENTS.md and SMS_GUIDELINES.md polish are factored in, **plan on ~1 day per new vertical.** This is consistent with the existing range — just honest about where on the range things land when the work is done properly.

---

*RelayKit LLC*  
*Backlog document — not yet scheduled for implementation*
