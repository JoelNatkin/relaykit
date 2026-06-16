# Home Messages section redesign — category-pills message browser

**Status:** promoted to D-435 (2026-06-16) — shipped as `marketing-site/components/home/messages-section.tsx`, replacing the home configurator peek. Canonical spec now lives in PROTOTYPE_SPEC.md (home `#4`). This file remains as the historical record of why the section looks the way it does; the approved design source is `explorations/home-mockups/relaykit-home-messages-mockup.html`.

## The problem

On the live home (`/`), the Messages section (`#configurator`) embeds the **real configurator through a clipped window** — categories sidebar, checkboxes, the elig industry dropdown, Copy button, kebab menus, the in-card Variables dropdown. That projects *tool complexity* the moment a visitor lands, before they've understood what RelayKit is. The Variables section right after it compounds the "in the weeds" feeling: two dense, chrome-heavy sections back to back.

By contrast, the landing mockup's Messages section flows better precisely because it's **just clean message cards** — a dot, a title, a personalized body — with no configurator chrome. It reads like "here are the messages," not "here is a tool you have to learn."

## The plan

Replace the embedded configurator peek on the home with a **clean, lightweight message browser**: the landing mockup's clean-card look, plus **category breadth via a horizontal pill strip** (so a visitor can see the range — verification, orders, appointments, alerts, etc. — without a checkbox sidebar). The full configurator stays at `/messages`; the home links out to it.

This keeps the "show the product" intent of leading with Messages (Session 136 reorder) while dropping the complexity that made the peek feel heavy.

## Design direction

Modeled on the landing mockup's Messages section (`relaykit-devtools-landing-mockup.html`):

- **Header:** eyebrow "The messages" + H2 "Messages for every job." + bridge (locked): "From login codes to event invites, every message your app sends is ready to use."
- **Category selector (new, replaces the checkbox sidebar):** the 9 categories. **Desktop: two stacked pill rows — 4 on top, 5 under** — order Account events · Order updates · Appointments · Verification / Customer support · Team alerts · Waitlist · Community · Marketing. **Mobile (below `md`): a native `<select>` dropdown** instead of the pill rows. The **selected category is primary yellow**; the others are muted. **Default selection = Account events.**
- **Controls row (kept):** business-name input (left) + tone pills Standard / Friendly / Brief (right). The **selected tone pill is monochromatic** (neutral fill, not yellow) — yellow is reserved for category selection so the two control rows read as different kinds of choice.
- **Stack spacing:** category pills → 32px → business-name + tone row → 16px → cards (the controls hug the cards like the landing section).
- **Message cards:** a 2-column grid of the selected category's real messages (from `lib/message-library`), in the active tone variant — gold pip + title + body. **Every substituted variable value is bolded** — the business name AND every `{{token}}` value (queue position, links, card-ending digits, etc.); literal copy and the "Reply STOP to opt out." tail stay unbolded. Business name shows "Acme" as the example until the visitor types their own.
- **Dropped chrome:** industry/elig dropdown, category checkboxes, Copy button, 3-dot kebab menus, the in-card Variables dropdown. None of it appears.
- **Out to the tool:** an "Open Messages →" link (bottom-right) to the full configurator at `/messages`.

## The height solution (the key constraint)

Categories hold **4–9 messages**, but the section's height must stay consistent regardless of which category is selected. Approach (final):

- **Fixed card area sized to exactly 6 cards** (2 cols × 3 rows). No internal scroll, no bottom gradient, no trailing affordance card.
- **Dot-paginated carousel: 6 cards per page.** Centered page dots sit below the card area, **shown only when there's more than one page**; a dot click — and swipe — advances. A 9-message category = **2 pages (6 + 3)**; the partial page keeps the same fixed height (empty slots below are fine). A ≤6-message category is a single page with no dots.
- The "Open Messages →" link stays bottom-right. The default selection (Account events, 5 messages) is a single page; a >6 category (Order updates, Appointments, Customer support, Team alerts, Community) shows the carousel + dots.

## Open questions — resolved

1. **Personalization beyond business-name?** **Resolved: business-name + tone only** on the home. Every other variable's personalization lives in `/messages` (the full configurator). Cards show each variable's corpus example value, bolded.
2. **Category selector layout.** **Resolved: two stacked pill rows on desktop (4 + 5), native `<select>` on mobile** (below `md`). Not a wrap cluster or a single scrolling strip.
3. **Default category.** **Resolved: Account events.**
4. **Replace vs. sit alongside?** **Resolved: this replaces the `#configurator` embedded peek** (and the "Copy the templates… Twilio, Sinch, Telnyx…" trust paragraph below it is removed from the home). The Variables section that follows is unaffected for now.
5. **Continuity-of-intent (MASTER_PLAN #7).** **Resolved: business name only carries forward** — the input binds to the existing `useConfiguratorState()` store (`state.businessName` / `setBusinessName`), so home and `/messages` share one persisted value and the hook owns the merge. Tone is local (not persisted). The empty-state "Acme" example is presentation only and is never written to the store.

## Mockup

`explorations/home-mockups/relaykit-home-messages-mockup.html` — the **approved** design (screenshot-reviewed). Standalone, vanilla (Inter + JetBrains Mono, real dark+gold tokens from `globals.css`), no deps. Real message copy for all 9 categories (3 tones each) pulled from `lib/message-library`. Presentational only; **not** a D-number. The real component (`marketing-site/components/home/messages-section.tsx`) ports this using semantic tokens and the real corpus (`interpolateBody` for the bold-every-variable treatment) + `useConfiguratorState` for the business-name carry-forward.
