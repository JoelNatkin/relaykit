# Pre-Launch Deviations

> **Purpose:** Track marketing-site copy and UI changes made to present a pre-launch posture — an active configurator paired with a waitlist CTA — while onboarding and delivery are still being built. Each entry records the exact before/after and the file it lives in, so the whole set can be reverted in one pass when the product ships.
>
> Not for: permanent copy or voice revisions, and not for legal-doc claim cuts (those live in `docs/LEGAL_DOC_DEFERRED_CLAIMS.md`). Most entries are temporary and revert when the product ships; a few are flagged **permanent** — infrastructure that stays. See each entry's **Type**.

---

## Session 122–123 reconciliation (configurator free-tool reframe + rework)

The Session 122 free-tool reframe (MD-21) and the Session 123 rework (D-424/D-425) **superseded the front-of-page waitlist-CTA posture** that entries 1–6 below describe. Verified against current code on `feat/configurator-reframe`:

- **Entries 1, 3, 4 — RESOLVED (reframe, not restoration).** The hero `PRE-LAUNCH · SHIPPING SUMMER 2026` tag is gone (a `Shipping Summer 2026` header now sits below the configurator instead); the pre-CTA paragraph and the configurator subhead were rewritten by the reframe, not reverted to their pre-launch originals. These did not "restore to the product flow" — the reframe replaced them outright. They no longer need tracking here.
- **Entry 2 — SUPERSEDED.** The mid-page CTA is now a "Copy messages" button (`handleCopy`), not a waitlist trigger. The "restore `Start building with SMS →`" plan is moot; the button's post-launch evolution is scoped in MD-21's revisit note ("add a 'Build with RelayKit' CTA beside 'Copy messages'").
- **Entries 5, 6 — SUPERSEDED.** Top-nav "Get early access" is removed entirely. The closing section is now an inline `BottomEmailCapture` "Join the list." email block (POST `/api/early-access`, `ctaSource: "bottom"`), not the modal-opening button.
- **Entry 11 (NEW) — point-of-use legal disclaimer.** The Session 123 rework added a disclaimer under the Copy CTA (D-424). It is **permanent**, not pre-launch — recorded below for completeness.
- **Entries 7, 8, 9, 10 — UNCHANGED.** The `WaitlistModal` + `WaitlistProvider` remain mounted in `layout.tsx` (now reachable-dead after the reframe removed every opener — teardown is a parked post-merge follow-up); the early-access API + permanent subscriber table persist.

Full revert of the resolved entries is unnecessary — they were superseded by a forward design change, not held for restoration. They are retained below as historical record; the live tracking set is now entries 7–11.

---

## Active deviations

### 1 — Hero pre-launch tag  *(RESOLVED — superseded by the Session 122 reframe; see reconciliation above)*

**File:** `marketing-site/app/page.tsx`

**Before:** No tag above the hero H1 ("SMS for builders").

**After:** Added a tag above the H1 — `PRE-LAUNCH · SHIPPING SUMMER 2026` (small-caps eyebrow, brand-accent token).

**Restoration trigger:** Onboarding and delivery ship — remove the tag element entirely.

### 2 — Mid-page CTA below the configurator  *(SUPERSEDED — now a "Copy messages" button; see reconciliation above)*

**File:** `marketing-site/components/configurator-section.tsx`

**Type:** pre-launch-only

**Before:** Link labeled `Start building with SMS →`, `href="/signup"`.

**After:** `<button>` labeled `Get early access` that opens the waitlist modal with `cta_source="mid-page"` (no navigation).

**Restoration trigger:** Onboarding and delivery ship — restore the `<Link>` labeled `Start building with SMS →` with `href="/signup"`.

### 3 — Pre-CTA paragraph above the mid-page CTA  *(RESOLVED — rewritten by the reframe; see reconciliation above)*

**File:** `marketing-site/components/configurator-section.tsx`

**Before:** "Next: a few quick questions, then you build with your AI tool while we register you. Three days to your first real text."

**After:** "The messages above are yours — copy them and use them with any provider today. The full product ships summer 2026."

**Restoration trigger:** Onboarding and delivery ship — restore the original paragraph.

### 4 — Configurator subhead  *(RESOLVED — rewritten by the reframe; see reconciliation above)*

**File:** `marketing-site/components/configurator-section.tsx`

**Before:** "All messages included. You can change these later in your workspace."

**After:** "All messages included — yours to copy and use with any provider today."

**Restoration trigger:** Onboarding and delivery ship — restore the original subhead.

### 5 — Top-nav "Get early access" button  *(SUPERSEDED — removed entirely by the reframe; see reconciliation above)*

**File:** `marketing-site/components/top-nav.tsx`

**Type:** pre-launch-only

**Before:** `<Link>` labeled `Get early access`, `href="/start/verify"`.

**After:** `<button>` labeled `Get early access` that opens the waitlist modal with `cta_source="top-nav"`.

**Restoration trigger:** Onboarding and delivery ship — restore a product-entry link in place of the modal trigger.

### 6 — Closing-section "Get early access" button  *(SUPERSEDED — now an inline `BottomEmailCapture` "Join the list." block; see reconciliation above)*

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

### 11 — Point-of-use legal disclaimer under the Copy CTA

**File:** `marketing-site/components/configurator-section.tsx`

**Type:** permanent

**Before:** Did not exist.

**After:** A one-line disclaimer under the bottom "Copy messages" CTA — "Not legal advice — you're responsible for consent and compliance. See our Terms." ("Terms" → `/terms`, Next `<Link>`). Product-side expression of the free-tool legal posture (D-424; `/explorations/LEGAL_EXPOSURE_REMEDIATION.md` §3.1).

**Restoration trigger:** None — keep. The free authoring tool persists past launch; the point-of-use disclaimer stays with it. (The companion browsewrap footer line, §3.2, is a separate parked add.)

---

## Restoration

Product ships and onboarding is live → revert every entry still flagged **pre-launch-only**. As of Session 123 the live pre-launch-only set is just **entries 7, 8, 9 (the route)** — the waitlist modal/context/welcome-email machinery, now reachable-dead after the reframe (post-merge teardown). Entries 1–6 were **superseded by the Session 122–123 reframe** (see the reconciliation block at the top — no revert needed). Entries flagged **permanent** (10, 11, the `send.ts` infra, and the `early_access_subscribers` table data) stay. Once only permanent entries remain, fold those into the permanent record and delete this doc.
