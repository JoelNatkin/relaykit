# AI-Assisted SMS Integration for the Modern TypeScript Stack
## Research Document for RelayKit
### April 15, 2026

> **Purpose:** Evidence base for a new PRD covering how RelayKit should structure its SDK, README, integration prompt, and first-party starter kit to serve vibe coders working on Next.js/TypeScript stacks with AI coding tools.
>
> **Operating principle applied throughout:** Prefer honest, conservative claims over optimistic ones that fail expectations. Findings that complicate the plan are flagged as such, not explained away.
>
> **Confidence markers:** Claims are tagged as **[strong evidence]**, **[suggestive]**, or **[anecdotal]** where uncertainty matters.

---

## Executive Summary — Seven Key Findings

**1. AGENTS.md is the emerging open standard for AI-agent guidance, and it's the right primitive for RelayKit.** **[strong evidence]** Stewarded by the Agentic AI Foundation under the Linux Foundation, supported by Codex, Cursor, Claude Code, Gemini, Aider, Zed, Factory, and more. Ships at the repo root, tool-agnostic, plain markdown. RelayKit should generate AGENTS.md snippets for developers to paste into their projects, and the starter kit should ship with a curated one.

**2. LLM-generated AGENTS.md files actively hurt performance.** **[strong evidence]** An ETH Zurich study found that auto-generated context files reduced task success rates by ~3% and increased inference costs by 20%. Only human-curated, concise files improve outcomes. This means RelayKit's AGENTS.md snippets must be hand-crafted, short (~60 lines max), and surgical — not "comprehensive."

**3. Resend is the closest analog to what RelayKit should become, and their AI onboarding infrastructure is the bar.** **[strong evidence]** Dedicated `/docs/ai-onboarding` section, MCP server, markdown-accessible docs (append `.md` to any URL), `llms.txt` and `llms-full.txt` files, agent skills via `npx skills add`, Cursor deeplink integration ("Open in Cursor" buttons), and per-builder integration guides for Lovable, v0, Bolt.new, Replit, Base44, and Leap.new. This is table stakes now, not a differentiator.

**4. YourNextStore (5.3k GitHub stars) is the proof-of-concept for "AI-native" Next.js products.** **[strong evidence]** Ships AGENTS.md + CLAUDE.md + tool-specific directories (`.cursor/skills`, `.claude`, `.codex/skills`, `.opencode/skills`, `.zed`). Typed SDK methods (`productBrowse()`, `cartUpsert()`). Idiomatic Next.js App Router patterns "matching what LLMs have seen thousands of times." RelayKit's starter kit should follow this pattern directly.

**5. "First-try success" is genuinely hard. The 1,500–3,000 line active-scope ceiling is real.** **[strong evidence]** Practitioners studying AI developer productivity report this as the practical limit for reliable agent sessions. Beyond that, cross-file dependency reasoning breaks down. This validates the pivot away from "paste one prompt and done" — incremental workflows with scope control produce better outcomes.

**6. The module pattern is NOT the universal default. SDK providers differ.** **[suggestive]** Resend initializes in-route (no `lib/` folder). Clerk is more invasive (middleware + provider). Supabase uses `lib/supabase/client.ts`. There is no single convention — the "`lib/relaykit/`" pattern I proposed earlier is reasonable but not inevitable. RelayKit should be *opinionated* about this for the starter but permissive for brownfield integrations.

**7. Claude Code has a native "plan mode." Cursor doesn't, to the same degree.** **[strong evidence]** Claude Code's plan mode lets developers discuss architecture before code writing, which is exactly the checkpoint-based workflow we want. Cursor's equivalent is weaker. This affects prompt design — instructions should leverage plan mode where available, simulate it where not.

**Complications flagged:**
- Vibe coders increasingly use Lovable/Bolt/Replit which produce valid code but with tool-specific quirks. We can't assume the "modern TypeScript stack" is identical across exit paths.
- `AGENTS.md` adoption is wide but not universal. Claude Code reads it via fallback, not native priority. CLAUDE.md still has standing in the Claude-specific community.
- The ETH study is one paper, not consensus. Directionally right, but we shouldn't treat the 3% figure as gospel.

---

## Section 1: State of the Art in AI-Assisted SDK Integration

### Resend — the reference implementation

Resend has effectively defined the modern "AI-native SDK" template. Their offerings:

- **Dedicated AI Onboarding docs section** at `/docs/ai-onboarding`, linked from top nav
- **MCP Server** — open source, covers full API, installable via `npx resend-mcp` or MCP client config
- **CLI** — usable by humans, agents, and CI/CD
- **Markdown-accessible docs** — append `.md` to any page URL to get LLM-ready content
- **`llms.txt` and `llms-full.txt`** — condensed and complete docs in single-file form for agent context
- **Agent Skills** — installable via `npx skills add resend/resend-skills resend/react-email resend/email-best-practices`
- **Cursor deeplinks** — "Open in Cursor" buttons on quickstart guides that populate the editor with pre-built prompts
- **Per-builder integration guides** for Lovable, v0, Bolt.new, Replit, Base44, Leap.new, and "Anything"

This is the new bar. RelayKit does not need *all* of it on day one, but the shape of the offering — a cohesive AI onboarding surface, not scattered docs — is what developers now expect from a serious SDK in 2026.

### Clerk — a different philosophical model

Clerk is more invasive: middleware.ts at the root, `<ClerkProvider>` wrapping the app, components like `<SignedIn>` sprinkled through the UI. The SDK becomes structural. This works for auth (Clerk needs to intercept requests) but isn't the model for RelayKit, which is closer to Resend's pattern: a pure-function API called from server-side code.

### Supabase — community-pattern-driven

Supabase is less opinionated about where the client lives, but community convention has settled on `lib/supabase/client.ts` and `lib/supabase/server.ts`. The Vercel Supabase starter template uses this pattern. Supabase itself publishes an official starter at vercel.com/templates/next.js/supabase that's widely adopted.

### Starter-kit ecosystem signal

Several paid/free starter kits now explicitly market themselves as "AI-agent ready":

- **Supastarter** (commercial) — "Ready for Cursor, Claude Code, Codex and other AI coding agents"
- **MakerKit** (commercial) — "AI-Agent Optimized: Custom rules for Claude Code, Cursor, and Codex. MCP server included"
- **YourNextStore** (free, 5.3k stars) — "Built for AI development (Claude, Codex, Cursor)"
- **Vercel Stripe-Supabase Starter** (free, official) — doesn't explicitly market AI, but is what AI tools have been trained on most heavily

**Implication for RelayKit:** Shipping a starter kit without AI-agent configuration would look dated. Even free, unpaid starters are shipping with AGENTS.md and cursor rules.

---

## Section 2: The AGENTS.md Standard

### What it is

AGENTS.md is a plain markdown file at a repository root that provides persistent instructions to AI coding agents. It emerged from collaboration between OpenAI Codex, Amp, Jules (Google), Cursor, and Factory in spring/summer 2025, and is now stewarded by the Agentic AI Foundation under the Linux Foundation.

Think of it as a README for AI agents — a predictable place where AI tools look for project-specific conventions, commands, and constraints.

**Supported by:** OpenAI Codex, GitHub Copilot (via support), Google Gemini CLI, Jules, Cursor, Aider, Zed, Factory, Phoenix, Kilo Code, Windsurf, Ona. Claude Code reads it via fallback; CLAUDE.md still has standing as the Claude-specific file. The pattern "ship both" is common.

### The ETH Zurich finding — the most important caveat

A 2025 ETH Zurich study on AGENTS.md effectiveness found:
- **LLM-generated AGENTS.md files reduced task success rates by approximately 3%**
- **Increased inference costs by over 20%**
- **Required 2-4 additional reasoning steps per task**
- **Architectural overview sections added no value and increased token budget**

Only human-curated files showed improvement. The conclusion: **brevity, specificity, and hand-crafting matter more than comprehensiveness.**

### What works in an AGENTS.md (synthesized from sources)

Short — under 60 lines is the sweet spot. Focused on:
- **Commands** — exact commands to build, test, lint (placed early, agents reference repeatedly)
- **Constraints** — "NEVER commit API keys," "Use `useApi` hook, never raw fetch"
- **Non-obvious conventions** — things the agent can't infer from the codebase
- **Gotchas and domain vocabulary** — prevent common errors
- **Security boundaries** — what not to touch

What doesn't work:
- Architectural overviews (the agent can discover structure itself)
- Long explanations of "why"
- Duplicating README content
- Auto-generated sections that go stale

### Implication for RelayKit

Our SDK can't ship an AGENTS.md into the user's project automatically (it's their repo, they own it). But we can:

1. **Generate AGENTS.md snippets** on the website, personalized to the developer's use case, for them to paste into their existing AGENTS.md (or create a new one)
2. **Ship a full AGENTS.md in the starter kit** that we control
3. **Publish canonical snippets** at relaykit.ai/docs/agents-md that developers or their AI tools can pull

The snippet should be human-curated, surgical, and specific — no architectural essays about what RelayKit is. Just:
- The two or three SDK methods they'll use
- The hard constraints ("server-side only," "never modify opt-out state")
- One example call
- Where to look for more detail if needed

---

## Section 3: Real-World Failure Modes on Brownfield Codebases

### The 1,500–3,000 line active-scope ceiling

**[strong evidence]** This number comes up repeatedly in practitioner writing as the practical limit for reliable AI agent sessions. Beyond this, cross-file dependency reasoning degrades. Consequences:

- Agents "patch symptoms" rather than root causes in large codebases
- Edits to file A cause implicit assumptions about file B that never get validated
- Test failures get processed after the context has already drifted from why the edit was made
- Long chat sessions accumulate contradictory instructions ("context cruft")

**Implication for RelayKit:** Our integration workflow should keep active scope under this ceiling. That means one vertical at a time, not "add SMS" as a single monolithic task.

### Cursor-specific risks

Cursor operates on whatever files are open and whatever is explicitly `@mentioned`. Common failures:
- Leaving the full project open in sidebar → every file becomes fair game
- Composer mode can touch files you didn't mean to modify
- Scope creep is a documented tool personality (from our own validation logs and external reviews)

**Mitigation patterns actually used in the field:**
- Close all tabs except files in scope
- Use `.cursorrules` (now `.cursor/rules/`) for persistent constraints like "never modify files in /config directory"
- Create short-lived branches per AI task
- Checkpoint commits before each prompt
- Test immediately after each edit

### Claude Code's different risk profile

Claude Code reads more broadly (grep, trace imports, build mental model) and costs more in inference. But it's more careful — "Plan mode" lets developers discuss architecture before code is written. Its main risks are cost and occasional over-investigation.

### What brownfield developers actually do

From practitioner writeups on production codebases:
- Greenfield workflow differs significantly from brownfield workflow
- On brownfield: smaller tasks, more test-first, more explicit file scoping
- Branching per AI task is standard
- "Claude Code for execution, Cursor for review" is a common combined pattern

### Implication for RelayKit

The instructions we ship should assume brownfield patterns. That means:
- Explicit "integrate one message type at a time" guidance
- Checkpoint verification between steps
- Hard file-scoping ("only modify these files: ...")
- Branch-and-test hygiene baked into the workflow

This is the "not quite YOLO, not quite manual" middle path from our earlier conversation. The research supports it.

---

## Section 4: Compartmentalization Patterns

### The `lib/<service>/` convention

**[suggestive, not strong]** Looking at real-world starters and examples:

- `lib/supabase/client.ts` + `lib/supabase/server.ts` — Supabase community convention
- `lib/prisma.ts` — Prisma/Clerk stack convention
- `lib/stripe/stripe-admin.ts` + `lib/stripe/stripe-client.ts` — common Stripe pattern
- `@/libs/resend/resend-client.ts` — used in the kolbysisk starter

But also:
- **Resend** does NOT prescribe this — they initialize inline in route handlers
- **Clerk** uses middleware and providers, not a `lib/` folder
- **Many tutorials** instantiate the SDK directly in the file where it's used

**So there's no universal convention.** What exists is a *Next.js ecosystem preference* for `lib/<service>/` that AI tools have seen many times and will produce naturally if prompted.

### What RelayKit should do

For the **starter kit**: prescribe the pattern. Ship with `lib/relaykit/client.ts` and `lib/relaykit/notifications.ts` (or similar named wrappers). Make it the visible, copyable example.

For **brownfield integrations**: don't require it. The AGENTS.md snippet can say "prefer a dedicated module under `lib/relaykit/` if one doesn't already exist, but match the developer's existing service-integration pattern if one does."

This matches how developers actually work. If their Supabase integration is in `lib/supabase/`, they'll want RelayKit at `lib/relaykit/`. If their Stripe integration is inline in route handlers, they'll add RelayKit the same way. Fighting that produces worse integrations.

### The wrapper-function pattern specifically

One nuance worth preserving from our earlier conversation: wrapping `relaykit.appointments.sendConfirmation()` in a named function `notifyBookingCreated(booking)` provides real benefits:
- Developer's business logic stays clean
- Error handling is centralized
- Testing and mocking are easier
- Rollback is cleaner

But this is a *style preference*, not a requirement. The SDK works fine without it. The starter should demonstrate the pattern; the docs can recommend it; we should not enforce it.

---

## Section 5: Plan-First and Checkpoint Workflows

### What's actually in the tools

- **Claude Code plan mode** — native, lets developers discuss architecture before code writing. Explicit workflow: Explore → Plan → Code → Verify.
- **Cursor** — no formal plan mode, but agents can be instructed to plan first. Less reliable without explicit prompt.
- **Aider architect mode** — plans with one model, executes with another
- **GitHub Copilot Chat** — more autocomplete-oriented, plan-first is user-driven

**Implication:** Our prompt can reliably say "show me your plan first" on Claude Code. On Cursor, we need to be more explicit: "Before writing any code, list the files you'll modify, the integration points you'll add, and the data flow. Wait for my approval."

### The Explore → Plan → Code → Verify pattern

From AGENTS.md documentation and practitioner writeups, this is becoming the canonical safe workflow. Applied to RelayKit:

1. **Explore:** Agent scans codebase, identifies framework, database, existing patterns
2. **Plan:** Agent proposes integration points and file changes, in a reviewable plan
3. **Code:** Agent adds one integration point (e.g., booking confirmation) with the SDK
4. **Verify:** Developer or agent runs a test send; confirms message delivery
5. **Repeat** for next message type

This is the incremental workflow you suggested, now validated by external practice.

---

## Section 6: Client-Only App Reality

### The actual landscape

**[suggestive]** Most "client-only" modern TypeScript apps aren't truly client-only:

- **Vite SPAs** often have a BFF (backend-for-frontend) via Vercel, Cloudflare Workers, or Supabase Edge Functions
- **Lovable/Bolt outputs** typically include a backend — they export to Next.js or similar full-stack frameworks
- **Expo/React Native** apps almost always have a backend (API Gateway, Supabase, custom server)
- **Pure client-only apps** are rare in commercial contexts; they exist but are usually prototypes or games

**So the "no backend" case is narrower than it seems.** The real problem is: the developer has a frontend-heavy stack with a *thin* backend they haven't built yet or don't want to expand.

### Reasonable guidance patterns

The crisp answer for Vite SPAs and similar:

**"RelayKit requires server-side execution. If you don't have a backend yet, add one of these:**
- **Supabase Edge Functions** (if using Supabase) — copy this 3-file example
- **Vercel Serverless Functions** (if deploying on Vercel) — copy this 3-file example
- **Cloudflare Workers** (if deploying on Cloudflare) — copy this 3-file example"

This reframes "you can't use RelayKit without a backend" as "here's how to add the minimal backend you need." It's a concrete path, not a dead end.

### For the starter kit

Because we're prescribing Next.js, this problem largely disappears. Next.js includes API routes and server actions by default. Every starter kit integration happens server-side naturally.

---

## Section 7: AI Tool Behavioral Differences (2026 Update)

### Claude Code
- Most careful, best constraint adherence (confirmed in our validation + external reviews)
- Full 200K context reliably (1M token beta on Opus 4.6)
- Plan mode built-in
- CLI-first, works in background
- More expensive per task
- Better for large refactors, architectural work
- Best for production/brownfield

### Cursor
- Fastest execution, but more scope creep
- Composer mode can touch more files than intended
- Good for interactive development, inline edits
- Multi-model flexibility (GPT-5.3, Claude 4.5, Gemini 3, Composer)
- Cloud agents can run up to 10 parallel workers
- Context window effectively 70K-120K (not the advertised 200K)
- Best for speed, greenfield, well-scoped tasks

### Windsurf
- Most thorough documentation of what it's doing
- Asks confirmation questions (tool personality)
- Slowest but most detailed
- Good for learning what's happening

### Codex (OpenAI)
- Most variable: excellent when it works, hallucinates API methods when it doesn't
- Runs code in sandbox and verifies it works
- Catches runtime errors but not semantic mistakes
- Latency issues for interactive work

### Implication for RelayKit
We should continue targeting the most aggressive tool (Cursor) as the constraint-setting baseline. If our AGENTS.md and prompts produce correct behavior on Cursor, they'll work on the others. But we should also leverage Claude Code's plan mode explicitly — it's a real advantage we can instruct developers to use.

---

## Section 8: Starter Kit Plan

### Stack recommendation

Based on research, the canonical modern TypeScript stack in 2026 is:

- **Next.js 15+ App Router** — most AI-tool-trained framework
- **TypeScript strict mode** — helps AI tools produce correct code
- **Supabase** — auth + Postgres, dominant in indie SaaS
- **Stripe** — billing
- **Tailwind CSS** — styling
- **shadcn/ui** — component primitives
- **Drizzle or Prisma** — ORM (slight preference for Drizzle in newer starters)
- **Vercel** — deployment (default; works with Railway, Cloudflare, etc.)

This matches the starters that have traction (Supastarter, MakerKit, Vercel Stripe-Supabase Starter, YourNextStore).

### File structure

Group-by-feature pattern (validated by KolbySisk, Supastarter, MakerKit):

```
relaykit-appointments-starter/
├── AGENTS.md                       # Human-curated, <60 lines, RelayKit-aware
├── CLAUDE.md                       # Claude-specific, minimal duplication
├── README.md                       # Human-focused quickstart
├── .cursor/rules/
│   └── relaykit.mdc                # Cursor-specific rules
├── .env.example
├── app/
│   ├── (auth)/                     # Auth pages
│   ├── (dashboard)/                # Main app
│   ├── api/
│   │   ├── bookings/               # Booking CRUD
│   │   └── webhooks/
│   │       ├── stripe/
│   │       └── relaykit/           # Optional inbound webhook handler
│   └── layout.tsx
├── components/                     # shadcn/ui + custom
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── stripe/
│   │   └── admin.ts
│   └── relaykit/
│       ├── client.ts               # SDK initialization
│       └── notifications.ts        # Wrapper functions per event
├── features/
│   ├── bookings/                   # Booking-specific UI + logic
│   └── pricing/
├── drizzle/                        # Schema + migrations
├── package.json
└── tsconfig.json
```

### What's in the box

- **Auth** — Supabase auth, magic link + OAuth, fully configured
- **Billing** — Stripe subscription scaffold, webhook handling, test fixtures
- **RelayKit integrated** — against the appointments vertical specifically
  - SDK installed and initialized
  - `lib/relaykit/notifications.ts` with wrapper functions for all 6 appointment message types
  - SDK calls wired into the booking create/update/cancel flows
  - Test phone verification flow connected
- **Database schema** — services, appointments, clients with proper relationships
- **Two seed routes** — booking creation + booking list (enough to establish pattern)
- **Landing page** — minimal, brandable
- **Dashboard** — bookings view with create/edit/cancel actions

### What's not in the box (intentional)

- No notification preferences UI (the developer adds this if needed)
- No calendar/availability engine (use case-specific)
- No team features, roles, or permissions
- No email templates beyond transactional basics
- No analytics
- No internationalization
- No mobile responsiveness polish
- No tests beyond smoke tests

The starter should feel *raw and clean*, not finished. It's a foundation, not a product.

### AGENTS.md content (draft sketch)

```markdown
# Appointment Booking Starter with RelayKit SMS

## Commands
- `pnpm dev` — start dev server
- `pnpm build` — production build
- `pnpm typecheck` — TypeScript check
- `pnpm lint` — lint

**IMPORTANT:** Run `pnpm typecheck` and `pnpm lint` before committing.

## Architecture
- Next.js 15 App Router
- Supabase for auth + Postgres (via Drizzle)
- Stripe for billing
- RelayKit for SMS

## RelayKit Integration
- SDK initialized in `lib/relaykit/client.ts` — reads `RELAYKIT_API_KEY` from env
- All SDK calls happen server-side only — NEVER from client components
- Wrapper functions in `lib/relaykit/notifications.ts` — call these, not the SDK directly
- To add a new notification: add a wrapper function in notifications.ts, call it from the relevant server action or API route

## Security
- NEVER commit `.env` files
- NEVER call RelayKit from client-side code
- NEVER modify message content — templates are server-side, SDK sends semantic events only

## Conventions
- Components: PascalCase (`BookingCard.tsx`)
- Server actions: colocated with feature in `features/<feature>/actions.ts`
- Database: Drizzle schemas in `drizzle/schema.ts`

## Gotchas
- RelayKit test mode sends only to verified phones. Verify your phone first.
- Never retry failed sends manually — RelayKit handles retries server-side.
- Opt-out enforcement is automatic. Do not build opt-out logic.
```

That's ~50 lines. Human-curated. Surgical. This is what a good AGENTS.md looks like.

### Discoverability

- **GitHub repo** — public, MIT license, RelayKit org
- **Vercel template gallery** — submit for listing
- **RelayKit marketing site** — featured on the home page and in the wizard flow
- **Direct link** in the "Add SMS to your app" step of onboarding
- **NPM keywords** — the package README links to the starter

### Maintenance model

- RelayKit owns updates
- Version-pinned to Next.js major versions (15.x → 16.x is a breaking bump)
- SDK version updates happen automatically via dependabot
- Quarterly sanity check: run the AGENTS.md prompt against all supported AI tools, confirm output still works

### Relationship to STARTER_KIT_PROGRAM.md

The existing starter kit program doc plans for 8+ verticals (appointments, orders, verification, support, marketing, internal, community, waitlist). This research recommends:

- **Ship the appointments vertical first.** It has the most content depth (PRD_02) and the clearest use case.
- **Validate with 10+ vibe coders before building more.** If the appointments starter is genuinely adopted, build orders next. If it's not, fix the appointments starter or reconsider the strategy before expanding.
- **Treat each starter as a ~1-day build once the core foundation exists**, per STARTER_KIT_PROGRAM.md estimate.

---

## Section 9: Recommendations with Confidence Levels

### Strong recommendations (high confidence)

1. **Adopt AGENTS.md as the primary agent-facing documentation format.** It's the emerging standard, widely supported, and the correct primitive. **[strong evidence]**

2. **Human-curate the AGENTS.md. Never auto-generate it.** The ETH study is directional evidence that auto-generated files hurt more than help. Our AGENTS.md should be hand-written, updated when real issues surface. **[strong evidence]**

3. **Build AI onboarding infrastructure comparable to Resend's.** Markdown-accessible docs, llms.txt, MCP server eventually, per-builder integration guides. These are table stakes, not differentiators. **[strong evidence]**

4. **Ship the starter kit with AGENTS.md, CLAUDE.md, and cursor rules.** All three, because tool ecosystems haven't fully consolidated. Follow YourNextStore's directory pattern as the reference. **[strong evidence]**

5. **Use the incremental workflow (add → test → verify → next) as the primary integration path.** Validated by real-world practice and the 1,500-3,000 line ceiling. The "YOLO" path should remain as a fast-track option for greenfield. **[strong evidence]**

6. **Prescribe `lib/relaykit/` for the starter kit. Don't require it for brownfield.** Match the developer's existing patterns instead of forcing ours. **[suggestive]**

7. **Target Next.js + Supabase + Stripe as the canonical stack.** It's dominant, well-trained in AI tools, and matches the target audience. Non-Next.js stacks use the REST API with less white-glove support. **[strong evidence]**

### Moderate confidence recommendations

8. **Build the MCP server eventually, but not on day one.** Nice-to-have, not essential for launch. Prioritize the SDK, README, and starter first. **[suggestive]**

9. **Use "Explore → Plan → Code → Verify" as the workflow structure.** Native in Claude Code, simulatable in Cursor via prompt instructions. **[suggestive]**

10. **The wrapper-function pattern (`notifyBookingCreated(booking)`) should be shown, not required.** Good practice, not enforced. **[suggestive]**

### Tentative recommendations (low confidence, worth testing)

11. **Per-builder integration guides for Lovable, Bolt.new, Replit** may matter more than SDK quality for the vibe coder segment. Worth testing with early users to see where they actually spend time stuck. **[anecdotal]**

12. **A "test mode checkpoint" between each integration step** — forcing a verified test send before moving to the next message type — may be the single biggest reliability boost. Untested hypothesis; worth piloting. **[anecdotal]**

---

## Section 10: Open Questions

1. **Should RelayKit ship Claude Skills?** Resend does (`npx skills add resend/resend-skills`). Adoption is hard to measure. Probably Phase 2.

2. **What's the right MCP server scope?** Should it expose the full SDK API (like Resend), or just the message-sending subset? Trade-off between utility and surface area.

3. **How do we handle the Lovable/Bolt/Replit export-to-code reality?** These tools export to standard code, but users often don't realize this. Need a clear "once you've exported" integration path.

4. **Does the vibe coder audience actually read AGENTS.md themselves?** Or is it entirely the AI tool's territory? Affects tone and content.

5. **Starter kit licensing** — MIT seems right, but should we attach any brand requirements? Most successful starters stay fully permissive.

6. **How do we measure success post-launch?** Today we have no instrumentation for whether integrations succeed. Even lightweight telemetry would close a major loop.

---

## Appendix: Things That Did Not Confirm My Earlier Thinking

Being honest about where the research complicated my prior suggestions:

**"First-try success across codebases" — narrower than claimed.** The 1,500-3,000 line ceiling is a hard constraint. "Paste prompt, get working SMS" is not a realistic goal for brownfield. The pivot to incremental workflow isn't just preference — it's what the evidence supports.

**"lib/<service>/ is the universal convention" — overstated.** There's a Next.js ecosystem preference, but Resend doesn't use it, Clerk doesn't use it. The convention is weaker than I made it sound.

**"Modern TypeScript stack dominates" — directionally right but not as clean as "70-80%".** Actual stack diversity is higher. Vite SPAs, Expo apps, and Lovable exports all have their own patterns. The "Next.js + Supabase" positioning is correct as a priority target, but shouldn't imply exclusivity.

**"The README does the heavy lifting" — partially true, but AGENTS.md does more.** The README is for humans. AGENTS.md is for agents. Treating them as the same document is wrong.

**"One prompt, one integration" — unambiguously wrong.** Multi-step, scoped, checkpointed integration is both safer AND faster in practice. The YOLO framing is bad.

These corrections strengthen the plan — they don't weaken it.

---

*Research document — not yet scheduled for PRD drafting*
*RelayKit LLC — April 15, 2026*
