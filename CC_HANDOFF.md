# CC_HANDOFF.md — Landing Page (PRD_07)

## Status

**PRD_07 (Landing Page): COMPLETE (8 tasks + review fixes).**

Build passes clean (`npm run build`). Landing page renders as static content. No new dependencies added.

**Previous builds: PRD_08 Phase 1 COMPLETE. PRD_09 Phase 1 COMPLETE. PRD_06 Dashboard COMPLETE. PRD_05 Deliverable Generator COMPLETE. PRD_01 Addendum COMPLETE.**

## Files Created This Session

```
supabase/migrations/20260307000000_byo_waitlist.sql  # byo_waitlist table (email capture)

src/app/api/byo-waitlist/route.ts          # POST /api/byo-waitlist — email upsert
src/app/terms/page.tsx                     # Stub — D-51 content added later
src/app/privacy/page.tsx                   # Stub — D-51 content added later

src/components/landing/landing-page.tsx    # Assembly component (all sections)
src/components/landing/nav.tsx             # Nav bar: logo, login, CTA
src/components/landing/hero.tsx            # h1 + subtext + CTA + tool pills
src/components/landing/problem.tsx         # Empathy section
src/components/landing/how-it-works.tsx    # 3-step section with FeaturedIcon
src/components/landing/what-you-get.tsx    # 3 pricing tier cards
src/components/landing/byo-waitlist.tsx    # Client: email capture form
src/components/landing/use-cases.tsx       # 8 use case tiles
src/components/landing/faq.tsx             # Client: 10-item accordion
src/components/landing/closing-cta.tsx     # Bottom CTA
src/components/landing/footer.tsx          # 3-column footer with legal links
```

## Files Modified This Session

```
src/app/page.tsx           # Replaced HomeScreen with LandingPage + OG metadata
src/app/layout.tsx         # Generic metadata ("RelayKit") — page-level overrides
```

## Files Deleted This Session

```
src/app/home-screen.tsx    # Untitled UI starter placeholder — replaced
```

## What This Build Delivers

1. **Single-page marketing landing page** at `/` — statically generated, no SSR data fetching.

2. **7 content sections:** Hero (AI-first positioning + tool pills), Problem (empathy), How It Works (3 steps), What You Get (3 pricing tiers), Use Cases (8 tiles), FAQ (10-item accordion), Closing CTA.

3. **BYO Twilio waitlist:** Email capture form → `POST /api/byo-waitlist` → `byo_waitlist` Supabase table. Upsert on email conflict (idempotent). No email automation — collection only.

4. **Legal stubs:** `/terms` and `/privacy` placeholder pages for D-51 content.

5. **SEO:** Page-level metadata with Open Graph and Twitter card tags. Semantic HTML (h1, h2, section, nav, footer). Section anchor IDs for in-page navigation.

6. **Footer:** Product/Company/Legal columns. Links to `#how-it-works`, `#pricing`, `#faq` anchors. `/privacy` and `/terms` routes.

## Decisions — No New Decisions This Session

All implementation followed existing decisions:
- D-17: Registration timing "approximately 2–3 weeks" (overrode PRD FAQ's "3–10 business days")
- D-27: Pricing locked ($199/$19/$15)
- D-36: "carrier-registered messages" (not "canon messages")
- D-38: No prohibited compliance phrases
- D-43: No Phase 2 features on landing page
- D-51: Terms/Privacy stubs (content added later)

## Gotchas for Next Session

1. **`/login` and `/signup` routes don't exist.** Nav and hero CTAs link to `/signup`, nav has `/login`. These need magic link auth pages built. For launch, could redirect both to `/dashboard` which triggers auth.

2. **BYO waitlist form uses plain `<input>` not Untitled UI `Input`.** The Untitled UI Input is React Aria-based and controlled form state was simpler with native HTML. Styled with semantic tokens. Works fine — just not using the design system component for this one input.

3. **Tool logos are text pills, not actual logos.** "Cursor", "Claude Code", "Lovable", "Replit", "Bolt" rendered as styled `<span>` badges. Replace with SVG logos when licensing is confirmed.

4. **No OG image.** Social sharing previews will be text-only until an image is added to the metadata.

5. **No sitemap.xml.** PRD_07 Section 4 calls for one. Low priority for single-page site but should be added via `app/sitemap.ts` before launch.

6. **Footer "About" link is `href="#"`.** Placeholder until an about page exists.

7. **FAQ accordion has no `aria-expanded` attributes.** Functional but could be improved for accessibility with `aria-expanded`/`aria-controls` on the toggle buttons.

## Carried Forward from Prior Sessions

- **D-51 (platform ToS/AUP) is a beta blocker.** `/terms` and `/privacy` stubs exist but need real content. Checkout screen needs ToS acceptance checkbox.
- **`/login` and `/signup` routes don't exist** — magic link auth pages needed.
- **Area code selector UI (PRD_01 Addendum Section 4.4) not built.** `preferred_area_code` passes through in checkout payload but no UI component exists.
- **Email templates not wired to sending** — `src/lib/emails/templates.ts` returns `{ subject, body }`. Need provider (Resend/SendGrid).
- **Compliance site link is `href="#"` placeholder** in `compliance/page.tsx`.
- **3 API routes still missing** (`/api/live-key`, `/api/usage`, `/api/registration-details`).
- **`sendSMS()` signature is load-bearing across two templates** — `build-spec-template.ts` and `template-relaykit.ts` must stay identical (PRD_05 Trap #6).
- **Button uses `onClick` not `onPress`** — Untitled UI extends HTML button.
- **`TWILIO_VERIFY_SID` env var required** for phone verification.
- **Supabase client `PromiseLike` does not have `.catch()`** — use `.then(({ error }) => { ... })` for fire-and-forget.
- **Zod uses `.issues` not `.errors`** — `parsed.error.issues[0]?.message`.

## What's NOT Built Yet

- `/login` and `/signup` auth pages (magic link)
- D-51 Terms of Service / Acceptable Use Policy content
- OG image for social sharing
- sitemap.xml
- Tool logo SVGs (using text pills currently)
- Conversion tracking events (PRD_07 Section 5 — Plausible or custom)
- PRD_08 Phase 2/3 (drift detection, quiet hours, URL blocklist)
