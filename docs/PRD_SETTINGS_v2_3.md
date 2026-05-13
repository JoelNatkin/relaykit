# PRD: Settings

> **Purpose:** Settings business logic — lifecycle states (Building → Pending → Registered → Rejected), field visibility rules, rejection-behavior model, refund-policy mechanics, error-code mapping, notification triggers, account-vs-app field split.
>
> Not for: Settings UI layout (PROTOTYPE_SPEC owns canonical screen-level layout), pricing tiers and dollar facts (PRICING_MODEL), carrier registration mechanics (MASTER_PLAN Phase 5).

## RelayKit — Per-App Settings + Account Settings
### Version 2.3 — April 15, 2026

> **Status:** Updated. Added Account Settings page spec (resolves open question #5). Corrected phone model — RelayKit uses email-only auth (magic link, D-03/D-59), no auth phone. Aligned with current prototype, DECISIONS.md, PRICING_MODEL.md, VOICE_AND_PRODUCT_PRINCIPLES_v2.md, and WORKSPACE_DESIGN_SPEC.md.
>
> **Source of truth:** Prototype at `prototype/app/apps/[appId]/settings/page.tsx` and `prototype/app/account/page.tsx` (port 3001). This PRD describes the production version. The prototype is the visual spec.
>
> **Dependencies:** Carrier registration pipeline (rewrite pending for TCR CSP). Stripe billing integration (PRICING_MODEL.md).
>
> **Decision refs:** D-03, D-59, D-98, D-99, D-126, D-150, D-153, D-154, D-164, D-193, D-194, D-195, D-201, D-202, D-203, D-204, D-205, D-206, D-207, D-208, D-209, D-210, D-211, D-212, D-213, D-214, D-293, D-294, D-304, D-309, D-320, D-321, D-332, D-334, D-344, D-345, D-346, D-347, D-348.

---

## 1. PURPOSE

Settings is the per-app administrative page. It shows the developer what they have, what state it's in, and gives them the controls they need to manage their app.

Settings is a utility panel: everything findable, nothing hidden, no surprises. It is not a setup wizard, onboarding flow, conversion surface, or educational experience. The developer comes here to check facts and change settings, not to learn how SMS works.

**Design principle:** Settings never surfaces compliance mechanics, carrier infrastructure, or registration process details. If the developer needs to understand something about their registration, the interface states what's true — not why it's true or how it works underneath. This is consistent with the product thesis: the developer doesn't think about compliance because RelayKit handles it.

---

## 2. LAYOUT

> See PROTOTYPE_SPEC §Settings page (L589–L603) for canonical UI layout (route, H1, back link, max-width, card spacing, typography, Ask Claude entry point). PROTOTYPE_SPEC L21 owns the avatar-dropdown / Sign-out placement. This PRD owns the business logic that the layout supports — see §3 Lifecycle States, §4.5 Notification Triggers, §5 Rejection Behavior, §7 Account-vs-App Split below.

---

## 3. LIFECYCLE STATES

Settings renders differently based on the app's registration status. The table below shows internal values (used in code), but the developer never sees these labels — they see the status indicators described in each section.

| Internal state | What appears on Settings |
|---------------|------------------------|
| `building` | No registration section. Test mode. |
| `pending` | Registration section with "In review" status. |
| `extended_review` | Registration section with "In review" status (same label as pending). |
| `registered` | Registration section with "Active" status. |
| `rejected` | Registration section with "Not approved" status. |

The developer sees at most three status labels across their entire lifecycle: "In review" (amber), "Active" (green), "Not approved" (red). Building and Registered states show no status indicator in the header bar (D-344); Building shows "Test mode" with a yellow dot, Registered shows "Live" with a green dot.

**Note on Onboarding:** Settings is not accessible during onboarding (wizard flow). The gear icon only appears on the workspace page, which doesn't exist until after signup. If a user navigates to `/apps/[appId]/settings` during onboarding (e.g., typed URL, stale bookmark), redirect to `/apps/[appId]` — the app shell already renders wizard chrome when `registrationState === "onboarding"`.

**Note on Extended Review:** The internal state machine value can remain `changes_requested` for backward compatibility. The developer sees "In review" — the same label as Pending. From their perspective, the registration is still being reviewed. It's taking longer, and we tell them so in the sub-copy, but it's not a different status. (See Section 5 for the full rejection behavior model that explains why Extended Review exists.)

---

## 4. SECTIONS

Five sections. Each section's visibility is state-dependent. The page only renders sections relevant to the developer's current state.

### 4.1 Business Info

> See PROTOTYPE_SPEC §Settings page (L605–L616) for canonical UI layout (Building editable / post-registration locked field tables, EIN row pattern shared via `EinRow` component). This PRD owns the architectural rationale below.

**Visible:** All states except Onboarding.

**Why email and phone aren't here (D-347):** Email is an account-level field shared across all apps. It lives on the account settings page, accessed via the avatar dropdown in the top nav. The per-app test phone is managed on the workspace via the Testers card (D-342). Settings only shows app-scoped fields.

**Why fields lock post-registration:** Business name cannot change without canceling and restarting registration — it was submitted to carriers. Category is set at use case selection — changing use case means a new app. EIN is locked at submission.

---

### 4.2 Registration

> See PROTOTYPE_SPEC §Settings page (L618–L642) for canonical UI layout (status indicators, sub-copy, table rows per state, compliance-site link). This PRD owns the rejection behavior model — see §5.

**Visible:** Pending, Extended Review, Registered, Rejected. **Not visible in Building.**

This section states facts about the registration. It does not explain carrier mechanics, registration pipelines, or approval processes. See Section 5 for the full rejection behavior model.

**Rejection reason copy (Rejected state only):** One or two lines explaining what happened, mapped from the carrier error code. The tone here is factual, not warm — the developer reached this state because they misrepresented their business or violated the acceptable use policy (see Section 5). Example:

> Your registration wasn't approved. The business information provided didn't match public records.

Followed by:

> Contact us at support@relaykit.ai if you believe this is an error.

No "What was submitted" detail block on the workspace card. On the Settings page, we do show the submitted fields for reference (business name, masked EIN, address, use case) since Settings is the factual reference surface. No "Start a new registration" CTA — the developer needs to talk to us first. No refund language in this section — financial details are in Billing.

---

### 4.3 API Keys

> See PROTOTYPE_SPEC §Settings page (L644–L658) for canonical UI layout (TEST/LIVE labels, masked field pattern, copy button, regenerate confirmation modal copy, divider, sub-copy). This PRD owns the data model — see §9.

**Visible:** All states. Test key always; Live key in Registered only.

---

### 4.4 Billing

> See PROTOTYPE_SPEC §Settings page (L660–L667) for canonical UI layout (state-by-state row tables, "Manage billing" / "View account billing" link affordances, cancel-modal copy). Pricing facts (numbers, refund policy, dual-campaign tier) live in `docs/PRICING_MODEL.md` per One Source Rule. This PRD owns the cancellation UX policy and the Rejected-state refund display below.

**Visible:** All states. Content varies.

**Cancellation policy (D-153):** No guilt copy, no survey. Cancel modal requires typing "CANCEL" — the typing requirement prevents accidental destructive action.

**Marketing pricing display (D-294, D-304):** Dual-campaign tier pricing is communicated during the marketing upsell flow, not re-explained on Settings. The $10/month delta surfaces only in the upsell context.

**Rejected refund display:** The registration fee line on the Rejected Billing card reflects the refund outcome from §5 — refund date for process-failure rejections, no refund line for AUP violations.

---

### 4.5 Notifications

> See PROTOTYPE_SPEC §Settings page (L686–L688) for canonical UI layout (heading, sub-copy, toggle, on/off phone-destination display, "Change" link). This PRD owns the trigger matrix and notification-phone model below.

**Visible:** All states. Toggle off by default (D-201).

**Note on notification phone:** RelayKit uses email-only authentication (magic link, D-03/D-59). There is no "auth phone." The notification phone is the developer's verified phone from the onboarding flow (`/start/verify`, D-46) — the same number used for test message delivery. If the developer wants to change their notification destination, the "Change" link opens an inline phone verification flow (same component as onboarding).

**What triggers a text notification (D-348):**
- Registration approved — "Your app is live! Log in to get your live API key."
- Registration rejected — "Your registration wasn't approved. Check your email for details."
- Payment failed — sent on day 1 of grace period. "Your payment didn't go through. Update your card to keep messages sending."
- Account suspended — sent when messaging stops. "Your messaging is paused. Update your payment method to resume."

**What triggers an email (always on, no toggle):**
- Welcome/signup confirmation
- Registration submitted confirmation
- Registration approved (with detail and live key instructions)
- Registration rejected (with reason and next steps)
- Payment failed (days 1, 3, 6 of grace period)
- Account suspended

**What we handle silently (no notification, no developer action needed):**
- Rate limiting — messages are delayed and queued, not dropped. Developer's app gets a normal response. (D-346)
- Quiet hours — marketing messages queued for delivery after quiet hours end (8 AM–9 PM recipient local time via NPA-NXX lookup). Transactional messages allowed through. (D-309)
- Opt-out received — recipient removed from future sends automatically at the proxy level.
- Approaching message cap — dashboard indicator only. Overage auto-scales (D-321), so no action needed.

**Design note:** The notification toggle controls text messages only. Email notifications are always on — there's no way to disable them. This is intentional: email is the baseline communication channel and includes detail that texts can't carry (rejection reasons, billing links, live key instructions). Texts are the "heads up, go check your email" nudge.

**Data:**
- `sms_notifications_enabled: boolean` (default: false) — per-app setting
- Notification phone: developer's verified phone from onboarding (`/start/verify`)
- Delivered via dedicated RelayKit system number (not the developer's app number)

---

## 5. REJECTION BEHAVIOR

This section defines how rejections work end-to-end: what causes them, what the developer sees, and what happens to their money. Settings surfaces this through the Registration section (4.2) and the Billing section (4.4).

### The Model

RelayKit is the intermediary between the developer and the carrier. The developer provides business information; RelayKit authors the messages, generates the compliance site, and submits the registration. When a carrier rejects a registration, the fault almost always lies with RelayKit's process, not the developer's input.

This creates two fundamentally different rejection experiences:

### Scenario A: Process failure (RelayKit's fault)

The carrier rejected something RelayKit authored or should have validated before submission. The developer never sees "Not approved" — they see "In review" (Extended Review state) while we fix and resubmit.

| Carrier rejection reason | Why it's our fault | What happens |
|--------------------------|-------------------|--------------|
| Message content doesn't match use case | We authored the messages based on their vertical selection. | We fix the content and resubmit. Developer stays in Extended Review. |
| Compliance site issue (missing privacy policy, opt-in form not found, site unreachable) | We generated and host the compliance site. | We fix the site and resubmit. Developer stays in Extended Review. |
| Business verification failed (EIN mismatch, business not found) | Our EIN verification step should have caught this before submission. | We investigate. If our validation was wrong, we fix our process and resubmit. Developer stays in Extended Review. |
| Campaign description unclear | Template engine generated a description the carrier didn't like. | We rewrite and resubmit. Developer stays in Extended Review. |

**Cost:** RelayKit absorbs the ~$15 TCR re-vetting fee per resubmission. Track resubmission count per registration — 3+ resubmissions flags for manual review as a margin risk.

**Refund:** Not applicable — the developer never enters Rejected state. If after investigation we determine we can't get it approved (rare), we refund the $49 at our discretion, move them to Rejected with an apologetic explanation, and review our process to prevent recurrence.

### Scenario B: Developer fault (misrepresentation or AUP violation)

The developer provided false business information or their actual business activity violates the acceptable use policy. This is the only scenario where the developer sees the Rejected state.

| Carrier rejection reason | Why it's their fault | What happens |
|--------------------------|---------------------|--------------|
| Business is doing something different than declared | Passed our EIN check but carrier discovers actual business doesn't match (e.g., said salon, actually crypto pump group). | Rejected. AUP violation. |
| Prohibited content category discovered post-submission | SHAFT content or prohibited industry that got past our wizard gating. | Rejected. AUP violation. |

**Refund:** No refund for AUP violations or misrepresentation. The ToS and AUP (both accepted at signup) explicitly state this. The $49 registration fee is non-refundable when terminated for violations.

**Resubmission:** No automatic resubmission. No "Start a new registration" CTA. The developer contacts support if they believe the rejection is an error. We review before allowing any re-registration.

### How This Maps to Settings

**Extended Review (Scenario A):** Registration section shows "In review" (same as Pending). Sub-copy acknowledges the delay and promises an email update. The developer has no idea anything went wrong — they just know it's taking longer. This is by design: the problem is ours to fix, not theirs to worry about.

**Rejected (Scenario B):** Registration section shows "Not approved" with a factual reason and support contact. Billing section shows registration fee with no refund (or refund if we chose to issue one at our discretion). No warm "we'll sort it out" tone — the developer reached this state through misrepresentation. But no accusatory tone either — we state facts and offer a path to contact us.

### Error Code Mapping

The registration record stores the raw carrier rejection reason (error code + description). A lookup table maps carrier error codes to:
1. Internal classification: Scenario A (process failure) or Scenario B (developer fault)
2. Internal action: auto-resubmit, investigate, or reject
3. Developer-facing copy (for Rejected state only): plain-language explanation

This mapping is deterministic (D-04) — not AI-generated. Unmapped error codes default to Scenario A (investigate) because false-negative rejections (blaming the developer for our mistake) are worse than false-positive extended reviews (taking extra time to investigate).

---

## 6. PHONE NUMBER DISAMBIGUATION

Two phone numbers exist in the system. Never use the bare label "Phone" (D-207):

| Label | What it is | Where it lives |
|-------|-----------|----------------|
| Your SMS number | Dedicated number assigned at registration approval. The number the developer's customers see. | Settings → Registration section (Registered only) |
| Verified phone | Developer's own number. Collected at onboarding (`/start/verify`, D-46). Used for test message delivery and (if opted in) text notifications. | Workspace → Testers card (D-342). Notification destination on Settings. |

**Note:** RelayKit uses email-only authentication (magic link, D-03/D-59). There is no separate "auth phone." The verified phone from onboarding serves both test delivery and notification purposes.

---

## 7. ACCOUNT-LEVEL VS. APP-LEVEL FIELDS (D-347)

**Account-level** (shared across all apps, lives on account settings page at `/account`):
- Email (login identity, magic link target, notification destination)
- Payment method (Stripe Customer, shared across all app subscriptions)
- Delete account (destructive, affects everything)

Accessed via avatar button dropdown in the top nav. Not on the per-app Settings page. Sign out is also in the avatar dropdown.

**App-level** (per-app, lives on Settings):
- Business name (read-only post-registration)
- Category (read-only)
- Registration status and details
- API keys (test + live)
- Plan and billing for this app
- Cancellation
- Text notification toggle

**Account settings page:** Now built at `/account`. See Section 8 for the full spec.

---

## 8. ACCOUNT SETTINGS PAGE

Route: `/account`

The account settings page manages fields shared across all apps. It is accessed via the avatar dropdown in the top nav ("Account settings" link). It is not a child of any app — it's a top-level page.

> See PROTOTYPE_SPEC §Account Settings page (L671–L684) for canonical UI layout (back link, headings, Login / Payment method / Delete account card sections, modal patterns matching the Cancel plan modal). This PRD owns the email-change flow, billing-portal integration, and deletion policy below.

### 8.1 Login

The email address is the developer's login identity (magic link target), Stripe Customer email, and destination for all email notifications. One email, one developer.

**Change flow:** Clicking "Change" opens an inline flow:
1. Developer enters new email address
2. Magic link sent to the *new* email for verification
3. Change takes effect only after the new email is verified
4. If not verified, nothing changes — the old email remains active

This prevents account hijacking via session-based email swaps. The Stripe Customer email updates automatically when the account email changes.

### 8.2 Payment Method

"Manage billing →" opens the Stripe Customer Portal (server-side `stripe.billingPortal.sessions.create()`). All app subscriptions are under one Stripe Customer record — one card, one portal. The developer manages all billing from here, not per-app.

### 8.3 Delete Account

**What deletion does (production):**
- Cancels all active Stripe subscriptions immediately (not at period end)
- Initiates carrier registration wind-down for all registered apps
- Marks account for 90-day data retention, then permanent deletion
- Revokes all API keys immediately
- Signs the developer out

### Data Model

#### Reads

| Data | Source | Notes |
|------|--------|-------|
| Email | `auth.users.email` | Login identity |
| Payment method | Stripe API | Card brand + last 4 via `stripe.customers.retrieve()` |

#### Writes

| Action | Target | Notes |
|--------|--------|-------|
| Change email | `auth.users.email` | Requires verification of new email via magic link |
| Manage billing | Stripe Customer Portal | Redirect to hosted portal |
| Delete account | Multiple | Stripe cancel, carrier wind-down, account soft-delete, session revoke |

---

## 9. DATA MODEL (PER-APP SETTINGS)

### Reads

| Data | Source | Notes |
|------|--------|-------|
| Business name | `registrations.business_name` | Null in Building state |
| Category | `projects.use_case` | Set at project creation |
| Registration status | `registrations.status` | Null in Building state |
| Registration details | `registrations.*` | Submitted date, approved date, campaign ID, phone number |
| Test API key | `auth.users.raw_user_meta_data.test_api_key` | Plaintext, re-displayable |
| Live API key (masked) | `api_keys` table | SHA-256 hashed, not retrievable |
| Plan/billing | Stripe API | Subscription status, amount, next billing date |
| Notifications toggle | `projects.sms_notifications_enabled` | Default: false |
| Rejection classification | `registrations.rejection_code` + `registrations.rejection_detail` | Raw carrier response, mapped to developer-facing copy and internal classification |

### Writes

| Action | Target | Notes |
|--------|--------|-------|
| Toggle notifications | `projects.sms_notifications_enabled` | Boolean flip |
| Regenerate live key | `api_keys` table | Delete old hash, generate new, hash and store, return plaintext once |
| Cancel plan | Stripe API | Cancel at period end. Update `projects.status`. |

Note: email edits are account-level writes, handled on the account settings page (`/account`, D-347).

---

## 10. ERROR STATES

| Scenario | Handling |
|----------|---------|
| Stripe billing fetch fails | "Billing information unavailable" with retry link |
| API key copy fails | Toast: "Couldn't copy to clipboard. Select and copy manually." |
| Live key regeneration fails | Modal stays open: "Something went wrong. Try again." |
| Cancel plan fails | Modal stays open: "Cancellation couldn't be processed. Try again or contact support." |

---

## 11. SECTION ORDER BY STATE

**Render order:** Business info → Registration → API keys → Billing → Notifications.

> See PROTOTYPE_SPEC §Settings page for state-by-state visibility (which sections render in which states, edit-vs-locked treatment of Business info, test-vs-live API key gating). The Registration section is the only fully state-conditional one — it does not render in Building.

---

## 13. OPEN QUESTIONS

| # | Question | Blocked on | Recommendation |
|---|----------|-----------|----------------|
| 1 | Additional fields in rejection "What was submitted" | Carrier error code mapping | Start with business name, EIN, address, use case. Expand as needed. |
| 2 | Error code mapping completeness | Carrier selection + error code documentation | Build mapping table per carrier during production. |
| 3 | Live key initial reveal UX | Approval celebration design | The first reveal happens at the approval moment, not on Settings. Settings always shows masked unless just regenerated. |
| 4 | Dual-campaign billing display ($29/mo) | Marketing upsell flow completion | Show $19/mo for now. When marketing activates, Billing section reflects $29/mo automatically. |

### Resolved since V1.0

| Old # | Question | Resolution |
|-------|----------|------------|
| 6 (v2) | Ask Claude panel design on Settings | Resolved — Ask Claude pattern standardized in PROTOTYPE_SPEC L34 (same entry point pattern as workspace header, app-context pre-loaded). |
| 5 (v2) | Account settings page design | Resolved in V2.3. Section 8 specifies the full page: Login (email), Payment method (Stripe portal), Delete account (with DELETE confirmation). No auth phone — RelayKit uses email-only auth (D-03/D-59). |
| 1 (v1) | Review timeline value | "A few days." Configurable in production. |
| 2 (v1) | Account-level edit flow | Account settings page via avatar dropdown (D-347). Per-app Settings shows only app-scoped fields. |
| 7 (v1) | High-volume pricing tier | Deferred. Volume tapering in PRICING_MODEL.md ($7/500 at 5k+) but not surfaced on Settings. |
| 8 (v1) | Approved-but-pre-activation state | Eliminated. D-320: single $49 payment. No split payment, no activation sub-state. |
| 10 (v1) | Registration intake expectations copy | Handled by wizard flow design. |

---

## 14. CHANGELOG

| Date | Change |
|------|--------|
| 2026-03-23 | V1.0 — Preliminary PRD written from stabilized prototype. |
| 2026-04-14 | V2.0 — Full rewrite. State names, route, pricing, notifications rename, copy alignment. |
| 2026-04-14 | V2.1 — Added Settings h1. Business Info section now visible in all states including Building (editable pre-registration, locked post-registration). Added EIN row to Business Info with verified/not-on-file states. Restructured Account Info → Business Info (app-scoped only, D-347). Added account avatar dropdown to layout. Added Section 5: Rejection Behavior (four scenarios, fault model, refund rules, error code mapping). Rewrote Notifications with specific triggers per D-348. Replaced "sandbox" with "test" in API key labels and billing. Fixed user-facing status labels. Added Ask Claude entry point. Cancel modal requires typing CANCEL. Updated phone disambiguation. Removed drift detection references. Fixed onboarding redirect to `/apps/[appId]`. Noted production edit pattern: wizard step components reused in modals. |
| 2026-04-15 | V2.2 — Synced with implemented prototype. Removed "Verified" prefix from EIN display. EIN "Add" link available in all states when not on file (not hidden post-registration). Removed "Set during registration" sub-text from business name. Removed "Estimated review" row and Pending sub-copy. Removed Campaign ID from Registered. Removed API keys sub-copy. Removed "Plan: Test mode — Free" row from Pending/Extended Review billing. Notifications section now implemented. |
| 2026-04-15 | V2.3 — Added Account Settings page spec (Section 8): Login (email with change-via-magic-link verification), Payment method (Stripe Customer Portal), Delete account (type DELETE confirmation, 90-day retention). Resolved open question #5. Corrected phone model throughout: RelayKit uses email-only auth (magic link, D-03/D-59), no auth phone. Phone disambiguation reduced from three numbers to two (Your SMS number + Verified phone). Notification phone is the developer's verified phone from onboarding, not an account-level auth phone. Updated avatar dropdown spec: "Account settings" link + "Sign out"; freestanding Sign out removed from top nav. Removed all interim notes about account page not existing. |
