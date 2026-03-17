# CLAUDE.md — RelayKit

## Project
RelayKit — SMS registration service for vibe coders. Handles A2P 10DLC registration so indie developers can send texts from their apps. $199 setup fee + $19/month (Transactional) or $29/month (Mixed) subscription. Fully automated pipeline. Dashboard-first experience: developers build and test in sandbox before registering.

## Tech Stack
- Next.js 14+ (App Router) — uses `src/` directory from Untitled UI starter kit
- Supabase (Postgres, Auth, Storage)
- Stripe Checkout
- Tailwind CSS v4.1 + Untitled UI design system (see component rules below)
- Cloudflare Workers (background jobs)
- Cloudflare Pages (compliance site hosting)
- Twilio API (ISV model — we own the account, customers get credentials)

## Design System Rules
- Untitled UI React (open-source components)
- Light mode default, dark mode switcher is nice-to-have for v1
- ALWAYS use Untitled UI semantic color classes (text-primary, bg-secondary, border-brand, fg-error-primary, etc.)
- NEVER use raw Tailwind colors (text-gray-900, bg-blue-700, etc.)
- Icons: @untitledui/icons — import named icons like `import { Calendar, Package } from "@untitledui/icons"`
- All react-aria-components imports MUST be prefixed with Aria* (e.g., `import { Button as AriaButton } from "react-aria-components"`)
- All files use kebab-case naming (e.g., `date-picker.tsx`, not `DatePicker.tsx`)
- **For full component API, props, examples, and color token tables:** read `docs/UNTITLED_UI_REFERENCE.md`

### Design System Quick Reference
These are the rules you must always follow. The full reference doc has detailed props, examples, and color tables.

**Semantic colors (always use these, never raw Tailwind):**
- Text: `text-primary`, `text-secondary`, `text-tertiary`, `text-quaternary`, `text-disabled`, `text-placeholder`, `text-brand-primary`, `text-brand-secondary`, `text-error-primary`, `text-warning-primary`, `text-success-primary`
- Background: `bg-primary`, `bg-secondary`, `bg-tertiary`, `bg-brand-primary`, `bg-brand-solid`, `bg-error-primary`, `bg-success-primary`, `bg-overlay`
- Border: `border-primary`, `border-secondary`, `border-tertiary`, `border-brand`, `border-error`
- Foreground (icons): `fg-primary`, `fg-secondary`, `fg-tertiary`, `fg-brand-primary`, `fg-error-primary`, `fg-success-primary`

**Component imports:**
```typescript
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Badge, BadgeWithDot } from "@/components/base/badges/badges";
import { Avatar } from "@/components/base/avatar/avatar";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
```

**Icon gotchas:**
- `ShieldCheck` does NOT exist in @untitledui/icons — use `ShieldTick`
- Always verify icon names before using them
- Pass as component ref: `<Button iconLeading={ChevronDown}>` (preferred)
- Pass as element: `<Button iconLeading={<ChevronDown data-icon className="size-4" />}>`

**CSS transitions:** `className="transition duration-100 ease-linear"` for hover/color changes

**No Link component** — use `<Button href="/path" color="link-color">` instead

## Architecture Rules
- All Twilio API calls use fetch() against REST API — NO Twilio SDK
- Auth is magic link only (Supabase Auth) — no passwords anywhere
- Template engine uses string interpolation — NO AI/LLM generation for compliance artifacts
- Compliance sites are static HTML deployed to Cloudflare Pages
- Sensitive credentials go in environment variables — NEVER in code or committed files
- Twilio Auth Token must ONLY exist in .env / environment variables

## Twilio Account Info
- Account SID: see .env file (starts with AC...)
- Entity: VAULTED PRESS LLC (ISV Reseller)
- Primary Customer Profile SID: see .env file (starts with BU...)
- Auth Token: NEVER COMMIT — use TWILIO_AUTH_TOKEN env var

## Code Style
- TypeScript everywhere
- Use `src/app/` directory (App Router), not `pages/`
- Server actions for form submissions where appropriate
- Prefer server components by default, client components only when needed
- Use Supabase SSR helpers for auth

## Project Directory Structure
```
src/
  app/                    # Next.js App Router pages
    start/                # Intake wizard flow
    dashboard/            # Customer dashboard
    api/                  # API routes
  components/
    base/                 # Untitled UI base components (DO NOT MODIFY)
    application/          # Untitled UI application components
    intake/               # Intake wizard components (RelayKit custom)
    dashboard/            # Dashboard components (RelayKit custom)
    landing/              # Landing page components (RelayKit custom)
  lib/
    intake/               # Intake wizard logic
    templates/            # Template engine (compliance artifact generation)
    compliance-site/      # HTML generation + Cloudflare deployment
    twilio/               # Twilio API integration
    deliverable/          # MESSAGING_SETUP.md generation
  hooks/                  # Custom React hooks
  providers/              # React context providers
  styles/                 # Global styles and theme (Untitled UI)
  utils/                  # Utility functions
supabase/
  migrations/             # Database migrations
docs/                     # PRDs (reference only, not deployed)
```

## Commands
- `npm run dev` — local dev server
- `npm run build` — production build

## Build Discipline
- Update PROGRESS.md after every commit — check off completed items, move "In Progress" forward

## DECISIONS.md Protocol

`DECISIONS.md` is the authoritative log of every material product, architecture, UX, legal, and pricing decision made on this project. It is the single source of truth when something feels ambiguous.

### When Joel types `DECISIONS CHECK` at the start of a session:
1. Read `DECISIONS.md` in full before reading any PRD or writing any code
2. Confirm back: `"DECISIONS.md read. [N] decisions loaded. Ready to proceed."`
3. Keep all entries active in working memory for the duration of the session

### During a session — before implementing anything that touches:
- Architecture or data model
- Pricing or billing logic
- UX copy or status language
- Compliance rules or enforcement logic
- Registration pipeline behavior
- Phase 2 scope boundaries

...check DECISIONS.md for relevant entries first.

### When a conflict is detected:
Stop immediately and surface it explicitly before writing any code:

> `⚠ DECISION CONFLICT: This contradicts D-[number] ("[decision title]"). The existing decision says [X]. What you've asked for would mean [Y]. Do you want to override D-[number], or should I proceed differently?`

Wait for Joel to confirm before continuing. If Joel confirms an override, note it as a new decision entry.

### When a new decision is made during a session:
Append it to `DECISIONS.md` under `## New This Session` using this format:

```
**D-[next number] — [Title]** (Date: YYYY-MM-DD)
[One paragraph: the decision, the reason, alternatives considered if any, files affected.]
```

Do this at the moment the decision is confirmed — not as a batch at session end.

### What counts as a new decision:
- Any architectural choice not already in DECISIONS.md
- Any pricing or scope change
- Any copy rule or vocabulary constraint
- Any explicit "we won't do X" or "we'll always do Y"
- Any Phase 2 deferral that wasn't already listed in D-43
- Any override of an existing DECISIONS.md entry

## UX & Copy Rules — MANDATORY
**Before writing any user-facing strings** (UI labels, status text, error messages, email subjects/bodies, onboarding copy, empty states, button text, helper text, toast notifications) — read `docs/V4_-_RELAYKIT_EXPERIENCE_PRINCIPLES.md` in full and apply:
1. The **Vocabulary table** — use the "Words We Use" column, avoid the "Words We Avoid" column
2. The **Framing Shift table** — if a screen communicates a constraint or requirement, use the "Trusted Guide" column, never the "Nagging Parent" column
3. The **Emotional States map** — know what emotional state the user is in at that screen and write copy to meet them there
4. The **One-sentence principle** — any explanatory annotation is one sentence maximum, never a paragraph
5. **Never leave a pending/waiting state without narrative** — every waiting state must include: what's completed, what's happening now, what's next, and a "keep building" prompt

This applies to every component CC writes. There are no exceptions for "minor" strings — labels, tooltips, and error codes set tone too.

## Platform Constraints — Do Not Contradict These
These decisions are resolved. Do not re-litigate them or suggest alternatives.

**Registration model:**
- Each customer gets a Twilio subaccount (Architecture #1). Never shared accounts.
- Campaign registration is static once approved — adding marketing capability post-registration requires a **second campaign registration**, not an upgrade to the existing one. Copy and logic must reflect this: "We'll register an additional campaign" not "We'll upgrade your registration."
- MIXED tier ($29/month) is registered as MIXED from day one. Proxy enforces recipient-level marketing consent at send time.

**ISV legal posture:**
- RelayKit is a telecom compliance registration platform, not a compliance attorney. Never write copy implying compliance outcomes are guaranteed.
- Prohibited language: "ensures compliance," "guarantees approval," "fully compliant messaging," "we handle compliance," "stay compliant automatically." See Experience Principles for the full substitution table.
- Healthcare/HIPAA: decline at intake. No BAA. No PHI routing through the proxy. This is a hard platform constraint, not a feature gap.

**Campaign review timing:**
- Current baseline is **10–15 business days** (approximately 2–3 weeks). Never write "5–7 days" anywhere. The sandbox remains live and usable throughout this window — lean into that in copy.

**Multi-project architecture (V1 guardrails):**
- V1 ships single-project (one registration per customer). PRD_11 defines Phase 2 multi-project.
- Build V1 with these columns in place so Phase 2 migration is clean:
  - `message_plans` — add nullable `project_id UUID` column with comment: "Phase 2: multi-project. Will become NOT NULL after migration."
  - `api_keys` — add nullable `project_id UUID` column with same comment.
- Do NOT build project-switching UI, project list, or `/dashboard/[projectId]/` URL structure in V1.

**Sole proprietor OTP limit:**
- TCR limits a phone number to 3 lifetime brand verifications. Surface an advisory note in the UI before sole prop OTP submission: "TCR limits this to 3 verifications per phone number lifetime."

**EIN brand limit:**
- TCR allows a maximum of 5 Standard Brands per EIN. Track `registration_count_by_ein`. Surface a warning before a 6th registration would be submitted.

## Critical Implementation Notes
- Wizard screens (/start, /start/scope, /start/details, /start/review) use sessionStorage key "relaykit_intake" for cross-screen state persistence. This must be preserved in all changes to wizard components.
- sessionStorage reads happen in useEffect (not useState initializers) to avoid SSR hydration mismatches.

## PRD Reference
Read the relevant PRD before building each component. PRDs are in the /docs directory.

**Active build window:**
| File | Purpose |
|------|---------|
| PRD_06_DASHBOARD.md | Customer dashboard (main build) |
| PRD_01_INTAKE_WIZARD.md | Intake wizard (including dashboard pre-populated path) |
| PRD_01_ADDENDUM_DASHBOARD_FLOW.md | Dashboard → intake data contract |
| PRD_03_COMPLIANCE_SITE.md | Static site generator + Cloudflare deployment |
| PRD_05_DELIVERABLE.md | Build spec + SMS_GUIDELINES.md generation |
| PRD_02_TEMPLATE_ENGINE.md | Template/artifact generation — already built, read before touching |
| PRD_04_TWILIO_SUBMISSION.md | Registration pipeline — already built, read before touching |

**Strategy and design reference (read before UX/copy decisions):**
| File | Purpose |
|------|---------|
| V4_-_RELAYKIT_EXPERIENCE_PRINCIPLES.md | **Mandatory before writing any user-facing copy** |
| V4_-_ADDENDUM_MIXED_CAMPAIGN_AND_PRICING.md | Mixed campaign mechanics, three-tier message library, pricing |
| ONBOARDING_UX_DECISIONS_v2.md | Full UX decision record — consult for any dashboard UX question |

**Phase 2 — do not build yet:**
| File | Purpose |
|------|---------|
| V4_-_PRD_11_MULTI_PROJECT_DASHBOARD.md | Multi-project architecture (Phase 2) |
| PRD_10_PLATFORM_TIER.md | Platform/multi-tenant tier (Phase 2) |
| PRD_07_LANDING_PAGE.md | Landing page |
| PRD_08_COMPLIANCE_MONITORING.md | Compliance monitoring |
| PRD_09_MESSAGING_PROXY.md | Messaging proxy |

**Do not build any section marked "Phase 2" or "BYO Twilio" in any PRD.**
