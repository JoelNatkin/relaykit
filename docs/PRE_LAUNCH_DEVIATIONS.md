# Pre-Launch Deviations

> **Purpose:** Track marketing-site copy and UI changes made to present a pre-launch posture — an active configurator paired with a waitlist CTA — while onboarding and delivery are still being built. Each entry records the exact before/after and the file it lives in, so the whole set can be reverted in one pass when the product ships.
>
> Not for: permanent copy or voice revisions, and not for legal-doc claim cuts (those live in `docs/LEGAL_DOC_DEFERRED_CLAIMS.md`). Everything in this file is temporary by definition and reverts together.

---

## Active deviations

### 1 — Hero pre-launch tag

**File:** `marketing-site/app/page.tsx`

**Before:** No tag above the hero H1 ("SMS for builders").

**After:** Added a tag above the H1 — `PRE-LAUNCH · SHIPPING SUMMER 2026` (small-caps eyebrow, brand-accent token).

**Restoration trigger:** Onboarding and delivery ship — remove the tag element entirely.

### 2 — Mid-page CTA below the configurator

**File:** `marketing-site/components/configurator-section.tsx`

**Before:** Link labeled `Start building with SMS →`, `href="/signup"`.

**After:** Link labeled `Get early access`, `href="/start/verify"` — matches the top-nav and closing-section "Get early access" buttons. Waitlister wiring is a follow-up session.

**Restoration trigger:** Onboarding and delivery ship — restore the label `Start building with SMS →` and `href="/signup"`.

### 3 — Pre-CTA paragraph above the mid-page CTA

**File:** `marketing-site/components/configurator-section.tsx`

**Before:** "Next: a few quick questions, then you build with your AI tool while we register you. Three days to your first real text."

**After:** "Pre-launch. The messages above are yours — copy them and use them with any provider today. The full product, with onboarding and delivery, ships summer 2026. Get on the list and we'll tell you when."

**Restoration trigger:** Onboarding and delivery ship — restore the original paragraph.

### 4 — Configurator subhead

**File:** `marketing-site/components/configurator-section.tsx`

**Before:** "All messages included. You can change these later in your workspace."

**After:** "All messages included — yours to copy and use with any provider today."

**Restoration trigger:** Onboarding and delivery ship — restore the original subhead.

---

## Restoration

Product ships and onboarding is live → revert all entries above, delete this doc.
