# EXPLORATION_BRIEF_v2.md — RelayKit Prototype
## Holistic Prototype: Site Architecture + Dashboard Revision
### March 13, 2026 — For Claude Code

---

## Context

You're working in the `/prototype` directory (port 3001). This is a UI-only prototype — no backend, no database, no auth. Everything is mocked with state toggles and sample data.

**What already exists in the prototype:**
- Category chooser page (`/c/categories` or similar)
- Read-only message catalog page (`/c/[category]/messages`) — substantially built, Untitled UI components, copy system, opt-in preview, working well
- Three dashboard versions at `/prototype/dashboard-v1`, `/prototype/dashboard-v2`, `/prototype/dashboard-v3` (A = progressive single page, B = tabbed workspace, C = card-based grid)
- A Settings tab on Dashboard B with SMS alerts toggle, account info, API key management
- Temp nav bar connecting all prototype pages

**What this brief asks you to build:**
A holistic prototype that covers the full site — from marketing front door through logged-in app experience. Not production-ready, but enough to click through and evaluate the architecture, page flow, and information placement.

---

## READ THESE FIRST

Before writing any code or copy:

1. `DECISIONS.md` — Read in full. Confirm the count. Pay special attention to D-84 through D-100 (new entries from this session).
2. `docs/V4_-_RELAYKIT_EXPERIENCE_PRINCIPLES.md` — Mandatory before any user-facing string. Apply vocabulary table, framing shift table, emotional states map, one-sentence principle.
3. This brief.

---

## The Big Picture: Page Architecture

RelayKit has two contexts: **public marketing pages** (no auth) and **logged-in app pages** (after sign-in). The prototype should stub both.

### Public Pages (no auth required)

**1. Marketing home page (`/`)**
Stub this. Headline, value prop, "how it works" steps, category grid linking to category landing pages. The vision: "Tell Claude Code to build your messaging feature. It might just work on the first try." (D-93). This page communicates the core positioning so that in-app pages can assume context.

**2. Category landing pages (`/sms/[category]`)**
One per category (appointments, orders, verification, support, marketing, internal, community, waitlist). These are the public-facing, persuasive versions — they explain the value prop for that specific use case, show a preview of what the developer gets, and lead to the Messages page. Compliance education lives here too — what 10DLC is, why it matters, what RelayKit handles — so the in-app experience doesn't have to re-explain it.

Stub 1-2 of these (appointments is the primary example). They don't need to be fully designed, just enough to show content placement and flow into the Messages page.

**3. Messages page (`/sms/[category]/messages`) — ALREADY BUILT**
The read-only message catalog. This is the lead magnet — viewable without auth. The developer browses the full message library for their category, sees previews, copies templates, reads AI prompt nudges.

**New for this version:**
- **Variant pill selectors** at the top of the messages section. Each category has 2-3 message variant sets with different word order/phrasing (D-91). Pills let the developer toggle between them. Example pills: "Standard" / "Action-first" / "Context-first". The selected variant changes which message text appears in the cards. This is visual only — all variants are available for copy regardless of which pill is selected.
- **Blueprint download CTA** at the bottom of the messages section (or as a sticky footer). This is where the auth gate lives: "Get your {app_name} SMS Blueprint" → if not logged in, prompts sign-in/sign-up → after auth + phone verification → download. The Blueprint download is the climax of this page (D-84, D-97).
- **Platform-specific setup instructions** appear at/near the download moment (D-92). Three steps max, one line per platform.
- **Marketing section** below the transactional messages, separated by a clear divider. Reframe from "select these" to "Available with a marketing campaign — add anytime from your dashboard" (D-89). The +$10/mo note stays.

### Auth Gate

When the developer wants their Blueprint, they hit the auth gate. Prototype this as a simple modal or page:
- Email input → "We'll send you a magic link" (mock — no actual email)
- After "auth": collect app name ("What's your app called?") and sandbox phone number ("What number should we text?" — framed as development tooling, exciting not bureaucratic) (D-96)
- Then: Blueprint download moment with platform instructions

### Logged-In Pages

**4. Your Apps (`/apps`)**
The logged-in home page (D-94). Shows a list of the developer's apps. Each app card shows: app name, category, status badge (sandbox / building / registered / live), last activity date. "Add new app" CTA.

For the prototype, show 1-2 sample apps:
- "RadarLove" — appointments category, sandbox status
- Maybe a second one in a different category to show the multi-app pattern

Clicking an app card enters the per-app experience.

**New app flow from Your Apps:**
"Add new app" → lightweight category selection (D-100 — logged-in variant, not the full marketing page) → app name → phone verification → Blueprint download → enters the per-app experience.

**5. Per-App Experience (`/apps/[appId]/...`)**

This is where the three dashboard versions (A, B, C) live — but revised. The per-app experience has **progressive tabs** (D-97):

**Before Blueprint download:** No tab bar. The app view is the Messages page for that app's category. The Blueprint download CTA is prominent. No Compliance tab, no Settings tab — they haven't earned their place yet.

**After Blueprint download:** Tab bar appears with three tabs:
- **Messages** — the message catalog (same component as the public page, but now in the logged-in context with the app's data)
- **Compliance** — see Compliance Tab section below
- **Settings** — see Settings Tab section below

### Prototype State Toggles

Keep the state toggle pattern from the existing dashboards, but update the states to reflect the progressive tab model:

| Toggle State | What's Visible |
|---|---|
| Pre-download | Messages page only, no tab bar, Blueprint download CTA prominent |
| Post-download (Sandbox) | Tab bar with Messages + Compliance + Settings. Sandbox API key in Settings. Compliance shows sandbox-mode content. |
| Registered (Live) | Same tabs, but with live data, live API key, real compliance monitoring content |

---

## Dashboard Versions: What to Revise

Revise all three dashboard versions (A, B, C) to work within the per-app experience described above. The key changes from the previous exploration:

### Things to fix across all versions

1. **Kill Pre-reg as a state.** The developer's category is already decided before they reach the per-app view (either from marketing front door or from "Add new app" on Your Apps). There is no "pre-registration" state in the dashboard. The first meaningful state is "pre-Blueprint-download" which is just the Messages page without tabs.

2. **Build spec → Blueprint.** All copy changes from "build spec" to "SMS Blueprint" or "{app_name} SMS Blueprint" (D-84).

3. **No plan builder anywhere.** No "choose your messages" step. No enable/disable toggles on message cards (except checkboxes for copy-selected functionality). The category unlocks the full library (D-85, D-86).

4. **Phone verification is two separate things** that must never be conflated:
   - **Sandbox test number** — "What number should we text?" — collected before Blueprint download, framed as development tooling
   - **TCR business phone** — collected during Go Live/registration flow as part of business identity (alongside EIN, business name, etc.)

5. **The Blueprint is the hero moment of sandbox.** The sandbox API key is embedded in the Blueprint. So a separate "API key card" and "getting started steps" on the overview are redundant in the pre-download state. After download, the API key lives in Settings for direct access.

6. **Platform setup instructions** — not raw `npm install` commands. Tool-specific guides: Claude Code, Cursor, etc. Three steps max, one line per platform (D-92). These appear at the Blueprint download moment.

7. **Campaign review timing = 2-3 weeks** everywhere. Never "5-7 days" (D-17, existing decision).

8. **Marketing section on Messages = informational, not selection.** "Available with a marketing campaign — add anytime from your dashboard." Never "upgrade" (D-89).

9. **Sample data uses "RadarLove"** as the fictional appointments business.

### Version-specific notes

**Dashboard B (tabbed — leading candidate):**
- The Settings tab CC already built is good — keep SMS alerts toggle, account info, API key management
- Tab bar should only appear after Blueprint download (D-97)
- The Overview tab concept may not be needed if Messages is the default landing tab for the per-app view — evaluate whether there's enough content for a separate Overview or if it's redundant

**Dashboard A (progressive single page) and C (card-based grid):**
- Apply the same corrections
- These are still candidates — the revisions may change which one feels best

---

## Compliance Tab Design

The compliance tab appears after Blueprint download (D-97). It has two modes based on registration status.

### Sandbox mode (post-download, pre-registration)

Light content. The developer hasn't registered yet, so there's no real compliance monitoring. But we can:
- Explain what compliance monitoring will do once they're live (brief, one-sentence-principle)
- Show that sandbox messages already run through compliance checks ("Every sandbox message goes through the same checks as production — look at your API responses for enforcement details")
- Surface the Go Live CTA here as well as on Messages

Do NOT show: fake checklists, auto-generated compliance status items, or anything that looks like busywork.

### Live mode (post-registration)

This is the full compliance experience. Design reference: use the compliance page design reference document (provided separately). Key points:

**Top of page: KPI dashboard.** Three stat cards — status (green/amber/red), messages scanned count with clean/blocked/warned breakdown, last scanned timestamp. Scannable in under five seconds.

**Five jobs to be done** (in priority order):
1. Triage quickly — green or not green, in under 5 seconds
2. Know what to do — every alert answers: what happened, why it matters, what to do now
3. Feel covered — "RelayKit caught this before it reached the carrier"
4. Reference canon messages when debugging — side-by-side comparison, one click
5. Know how RelayKit will reach them — alert types, escalation paths, no surprises

**Alert card anatomy:** Every alert follows the same structure — type badge, timestamp, what happened (one sentence), why it matters (one sentence), what to do (action or "nothing — we handled it"), and an expand for full detail.

**Five UI states** (design each as first-class, not edge cases):
1. All clear — green status, maybe a reassurance message, minimal
2. Blocks detected (handled automatically) — amber, cards showing what was caught
3. Drift warnings — messages drifting from registered scope
4. Escalation notices — unresolved issues that need developer action
5. Consent violations — marketing sent without proper consent

**Alert styling by type:**
- Blocks: amber border, shield icon — "caught and handled"
- Drift: yellow border, compass icon — "trending off-course"
- Escalation: red border, alert icon — "action needed"
- Consent: red border, lock icon — "consent gap"

**Copy tone:** Knowledgeable colleague who caught something, handled it, and is now briefing you. Not a legal warning. Not a nagging parent.

**Canon messages reference:** Visible on this tab, read-only, clearly labeled. When a drift alert fires, the developer can compare what they sent against what they registered. Side-by-side should be one click from any drift alert.

**"How compliance works" expandable:** One-time read, collapsible. Brief explainer of what RelayKit monitors and why. Most developers read it once and never open it again.

---

## Settings Tab Design

Appears after Blueprint download (D-98). CC already prototyped this on Dashboard B — keep that design and refine:

- **SMS compliance alerts toggle** — "Text me about compliance issues / Get SMS alerts when drift is detected"
- **Account info** — Business name, email, phone, registration date (read-only display, edit via support or re-registration)
- **API key management** — Sandbox key (copy + regenerate) and Live key (copy, cannot regenerate) side by side. Sub-copy: "Your AI coding tool will use this key automatically when it reads your SMS Blueprint. You can also find it in {app_slug}_sms_blueprint.md."
- **Billing section** (D-99) — This app's plan, cost, status. Link to parent account billing for total spend / invoices / payment method.

Post-registration only shows live key. Pre-registration shows sandbox key only.

---

## Your Apps Page Design

This is the logged-in home (D-94). Keep it simple:

- Page title: "Your Apps" or just the developer's name/greeting
- App cards in a grid or list. Each card: app name, category badge, status badge (sandbox/building/registered/live), last activity
- "Add new app" card/button — prominent but not overwhelming
- If developer has only one app, still show this page (it scales from 1 to N without redesign — D-94)
- Clicking an app card navigates to `/apps/[appId]/messages` (the per-app Messages page)

---

## Build Plan

Before writing any code, give me a numbered build plan. Each task should be one committable unit. Organize roughly as:

1. Site shell + routing (nav, public vs logged-in layout, temp auth toggle)
2. Marketing home page stub
3. Category landing page stub (appointments)
4. Auth gate mock (email → app name → phone → download)
5. Your Apps page
6. Per-app experience shell (progressive tabs, state toggles)
7. Revise Dashboard A with all corrections above
8. Revise Dashboard B with all corrections above
9. Revise Dashboard C with all corrections above
10. Compliance tab (sandbox mode + live mode)
11. Settings tab refinement
12. Message variant pills on Messages page
13. Blueprint download moment + platform instructions

I'll review the plan before you start building. Don't write any implementation code until I approve the plan.

---

## Key Decisions Reference

These are the decisions most relevant to this prototype work. Read the full DECISIONS.md for all entries.

| Decision | Summary |
|---|---|
| D-17 | Campaign review = 2-3 weeks, never "5-7 days" |
| D-33 | Approval copy: "Most developers never get here. You did." |
| D-84 | "SMS Blueprint" replaces "Build Spec" in all customer-facing copy |
| D-85 | No plan builder — category selection unlocks full library |
| D-86 | Full-library Blueprint — all messages for the category |
| D-87 | Blueprint includes "Before building, ask me" section |
| D-89 | Marketing always separate campaign, never MIXED initially (supersedes D-16) |
| D-90 | 5 sample messages to TCR (supersedes D-42) |
| D-91 | Anti-cookie-cutter: variant sets, pill selectors, rotation |
| D-92 | Platform-specific setup at download moment |
| D-93 | Core positioning: "Tell Claude Code to build your messaging feature" |
| D-94 | "Your Apps" is logged-in home |
| D-95 | One app = one registration = one category = one Blueprint |
| D-96 | Email + phone verification before Blueprint download |
| D-97 | Tabs appear after Blueprint download only (no tab bar before) |
| D-98 | Settings tab post-download only |
| D-99 | Billing per-app AND per-account |
| D-100 | Logged-in return flow uses lighter category selection |

---

## Sample Data

- **Business name:** RadarLove
- **Category:** Appointments
- **App name:** RadarLove
- **Email:** joel@radarlove.app
- **Website:** radarlove.app
- **Sandbox API key:** sk_sandbox_rL7x9Kp2mWqYvBn4
- **Live API key:** sk_live_Tx8bQr3nJfLpYm6w
- **Phone:** +1 (512) 555-0147
- **Registration date:** Feb 28, 2026

---

## What NOT to Build

- No backend, no database, no real auth — everything is mocked
- No production code changes — stay in `/prototype`
- No Phase 2 features (multi-tenant, BYO Twilio, project switcher beyond basic Your Apps)
- No actual email sending or SMS sending
- No Framer Motion (causes hydration issues in this prototype)
- Don't rebuild the Messages page from scratch — it's already good. Add the variant pills, Blueprint download CTA, and platform instructions to it.
