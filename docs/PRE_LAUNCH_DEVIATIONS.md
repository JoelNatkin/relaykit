# Pre-Launch Deviations

> **Purpose:** Track marketing-site copy and UI changes made to present a pre-launch posture — an active configurator paired with a waitlist CTA — while onboarding and delivery are still being built. Each entry records the exact before/after and the file it lives in, so the whole set can be reverted in one pass when the product ships.
>
> Not for: permanent copy or voice revisions, and not for legal-doc claim cuts (those live in `docs/LEGAL_DOC_DEFERRED_CLAIMS.md`). Most entries are temporary and revert when the product ships; a few are flagged **permanent** — infrastructure that stays. See each entry's **Type**.

---

## Active deviations

### 1 — Hero pre-launch tag

**File:** `marketing-site/app/page.tsx`

**Before:** No tag above the hero H1 ("SMS for builders").

**After:** Added a tag above the H1 — `PRE-LAUNCH · SHIPPING SUMMER 2026` (small-caps eyebrow, brand-accent token).

**Restoration trigger:** Onboarding and delivery ship — remove the tag element entirely.

### 2 — Mid-page CTA below the configurator

**File:** `marketing-site/components/configurator-section.tsx`

**Type:** pre-launch-only

**Before:** Link labeled `Start building with SMS →`, `href="/signup"`.

**After:** `<button>` labeled `Get early access` that opens the waitlist modal with `cta_source="mid-page"` (no navigation).

**Restoration trigger:** Onboarding and delivery ship — restore the `<Link>` labeled `Start building with SMS →` with `href="/signup"`.

### 3 — Pre-CTA paragraph above the mid-page CTA

**File:** `marketing-site/components/configurator-section.tsx`

**Before:** "Next: a few quick questions, then you build with your AI tool while we register you. Three days to your first real text."

**After:** "The messages above are yours — copy them and use them with any provider today. The full product ships summer 2026."

**Restoration trigger:** Onboarding and delivery ship — restore the original paragraph.

### 4 — Configurator subhead

**File:** `marketing-site/components/configurator-section.tsx`

**Before:** "All messages included. You can change these later in your workspace."

**After:** "All messages included — yours to copy and use with any provider today."

**Restoration trigger:** Onboarding and delivery ship — restore the original subhead.

### 5 — Top-nav "Get early access" button

**File:** `marketing-site/components/top-nav.tsx`

**Type:** pre-launch-only

**Before:** `<Link>` labeled `Get early access`, `href="/start/verify"`.

**After:** `<button>` labeled `Get early access` that opens the waitlist modal with `cta_source="top-nav"`.

**Restoration trigger:** Onboarding and delivery ship — restore a product-entry link in place of the modal trigger.

### 6 — Closing-section "Get early access" button

**File:** `marketing-site/app/page.tsx`

**Type:** pre-launch-only

**Before:** `<Link>` labeled `Get early access`, `href="/start/verify"`.

**After:** `<EarlyAccessButton source="bottom">` — a `<button>` that opens the waitlist modal with `cta_source="bottom"`.

**Restoration trigger:** Onboarding and delivery ship — restore a product-entry link in place of the modal trigger.

### 7 — Waitlist modal component

**File:** `marketing-site/components/waitlist-modal.tsx` (new); mounted once in `marketing-site/app/layout.tsx`.

**Type:** pre-launch-only

**Before:** Did not exist.

**After:** Modal that captures an email for the early-access list, showing the visitor's configurator selection. Opened by all three "Get early access" buttons.

**Restoration trigger:** Onboarding and delivery ship — remove the component and its `<WaitlistModal />` mount in `layout.tsx`; the CTAs revert to product entry.

### 8 — Waitlist context

**File:** `marketing-site/context/waitlist-context.tsx` (new); `WaitlistProvider` mounted in `marketing-site/app/layout.tsx`; consumed by the publish-summary effect in `configurator-section.tsx`.

**Type:** pre-launch-only

**Before:** Did not exist.

**After:** React context holding modal open/close state and a lightweight configurator-selection summary.

**Restoration trigger:** Onboarding and delivery ship — remove the context, its provider in `layout.tsx`, and the publish-summary effect in `configurator-section.tsx`.

### 9 — POST /api/early-access endpoint

**File:** `marketing-site/app/api/early-access/route.ts` (new). Supporting modules: `marketing-site/lib/email/welcome.ts`, `marketing-site/lib/email/send.ts`.

**Type:** pre-launch-only (the route). **Note:** the `early_access_subscribers` table and its captured rows (migration `007_early_access_subscribers.sql`) are **permanent** — export/migrate the subscriber data for the launch broadcast; never drop it. `lib/email/send.ts` is reusable transactional-email infrastructure (keep); `lib/email/welcome.ts` is pre-launch content (remove with the route).

**Before:** Did not exist.

**After:** Route that validates an email, inserts a subscriber row, and sends the Resend welcome email for new signups.

**Restoration trigger:** Onboarding and delivery ship — remove the route and `welcome.ts` once the real signup flow replaces it; keep the table data and `send.ts`.

### 10 — GET /api/unsubscribe endpoint

**File:** `marketing-site/app/api/unsubscribe/route.ts` (new).

**Type:** permanent

**Before:** Did not exist.

**After:** Route that flips `unsubscribed_at` for a matching token and returns an unsubscribe-confirmation page.

**Restoration trigger:** None — keep. Every email sent during the pre-launch period carries an unsubscribe link that must keep working after launch (list hygiene / CAN-SPAM). Do not revert.

---

## Restoration

Product ships and onboarding is live → revert every entry flagged **pre-launch-only** above. Entries flagged **permanent** (and the `early_access_subscribers` table data) stay. Once only permanent entries remain, fold those into the permanent record and delete this doc.
