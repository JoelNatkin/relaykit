# CC_HANDOFF.md — Session Handoff
**Date:** 2026-03-14 (marketing page revision pass)
**Branch:** main

---

## Commits This Session

```
[this commit]  feat: marketing home page and compliance page — full revision pass
```

Previous session commits (already on main):
```
1cc2545  docs: D-101–D-104, vision implementation memo
417d205  feat: settings tab — SMS alerts, account info, API keys, billing (D-98, D-99)
b9e1004  feat: compliance tab — sandbox preview + live monitoring with 5 scenario states
76d66fb  feat: revised dashboards A/B/C — Blueprint hero, no plan builder, per-app shell
eeb393f  feat: per-app experience shell — progressive tabs, state toggle, Blueprint hero
```

---

## What We Completed

### Marketing Home Page (`prototype/app/page.tsx`) — Full Revision

- **Hero**: New subhead — "The fastest way to add compliant SMS to any app."
- **How it works**: 3 steps with eyebrow "How it works", headline "Shorter than your last standup." Step circles changed from solid purple to light lavender bg with purple number (matches icon style elsewhere).
- **Step copy**: (1) "A full library of compliant messages." (2) "Drop two files in. Your AI handles the rest." (3) "Build in a fully functional sandbox. Free."
- **Category grid**: "Explore use cases" section with gray background, per-category CTAs ("View [category] messages →")
- **Pricing**: Two-card layout (Sandbox $0 / Live $199+$19/mo), matching border treatment (both `border-primary`), no highlighted card. Last bullet: "Need more messages? $15 per 1,000. Scales with usage — up or down."
- **Compliance cards**: "Why RelayKit?" eyebrow, 4 cards (opt-out, content checks, quiet hours, ongoing monitoring), concluding line
- **Comparison table**: 3-column (DIY / Others / RelayKit) with row descriptions, updated copy throughout including "Handled, or your money back." for registration
- **Footer**: 3 columns (Product, Company, Legal) + © 2026 Vaulted Press LLC
- **Removed**: Bottom redundant CTA section

### Compliance Page (`prototype/app/compliance/page.tsx`) — New Page

- **Hero**: "Compliance, handled." with explanatory subhead
- **5 content sections** with alternating gray/white backgrounds:
  1. "Before your messages send" — 3 cards (opt-out, content checks, quiet hours)
  2. "Ongoing protection" — 2 cards (drift detection, quality monitoring)
  3. "Before you deploy" — single card (AI-powered message guidance)
  4. "When something needs attention" — 3 severity cards (drift/warning/critical)
  5. "Your compliance site" — paragraph with bold closing sentence
- **3 pull-quote callouts** between sections (italic, lighter text, elegant style)
- **Bottom CTA**: "Ready to start building?" with gray background
- **Footer**: Same as home page

### Nav Bar (`prototype/components/top-nav.tsx`)

- "Sign in" / "Sign out" changed from filled purple button to plain text link style

### Decision Added

- **D-105**: Registration money-back guarantee — full refund of $199 if registration not approved

---

## Gotchas for Next Session

1. **Delete `.next` before every dev server start.** Cache corruption is recurring. Always: stop → `rm -rf prototype/.next` → restart.

2. **`@untitledui/icons` name check**: `ShieldCheck` does NOT exist — use `ShieldTick`. Always verify icon names before using them.

3. **Category pages**: Only "appointments" has full content. Other categories show placeholder stubs.

4. **Auth flow is fully mocked** — no Supabase. The "magic link sent" screen has a "Continue" button.

5. **No Untitled UI base components in prototype** — plain Tailwind with semantic color tokens only.

6. **SessionStorage key:** `relaykit_prototype` — separate from production's `relaykit_intake`.

7. **DECISIONS.md now has 105 decisions** (D-01 through D-105).

8. **D-104 gate**: PRDs must be updated to reflect D-84–D-103 before any production code is built from them.

9. **D-105**: Registration money-back guarantee is displayed on home page. Terms need ToS detail.

10. **Comparison table structure**: Each row has `topic`, `desc`, `diy`, `others`, `relaykit` fields. First column is 300px wide.

11. **Page section backgrounds alternate**: Both pages use per-section wrappers (not a single container) for full-width gray/white alternation.

---

## Prototype File Map

```
prototype/
├── app/
│   ├── page.tsx                          # Marketing home (revised)
│   ├── compliance/page.tsx               # Public compliance page (NEW)
│   ├── auth/page.tsx                     # Auth gate (5-step mock)
│   ├── apps/
│   │   ├── page.tsx                      # Your Apps (logged-in home)
│   │   └── [appId]/
│   │       ├── layout.tsx                # Per-app shell (tabs, state toggle)
│   │       ├── page.tsx                  # Redirects to /messages
│   │       ├── messages/page.tsx         # Messages tab (dispatches A/B/C)
│   │       ├── compliance/page.tsx       # Compliance tab (5 scenarios)
│   │       └── settings/page.tsx         # Settings tab (alerts, keys, billing)
│   ├── sms/[category]/
│   │   ├── page.tsx                      # Category landing (public)
│   │   └── messages/page.tsx             # Public messages stub
│   └── c/[categoryId]/messages/page.tsx  # Catalog with variant pills
├── components/
│   ├── top-nav.tsx                       # Context-aware nav (revised)
│   ├── catalog/catalog-card.tsx          # Message card with variant support
│   └── dashboard/
│       ├── shared.tsx                    # Shared dashboard primitives
│       ├── dashboard-a-revised.tsx       # Dashboard A (progressive single page)
│       ├── dashboard-b-revised.tsx       # Dashboard B (tabbed workspace)
│       ├── dashboard-c-revised.tsx       # Dashboard C (card grid)
│       └── sample-data.ts               # Mock data (SAMPLE constant)
├── context/session-context.tsx           # State management
└── data/messages.ts                      # Message library + variants
```

---

## What's Next

- Category landing pages beyond "appointments" need full content
- Production PRDs must be updated per D-104 before production code resumes
- ToS needs D-105 money-back guarantee language
- Change map is in `docs/VISION_IMPLEMENTATION_MEMO.md`
