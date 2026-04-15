# PRD: Settings Page
## RelayKit — Per-App Settings
### Version 2.1 — April 14, 2026

> **Status:** Updated. Aligned with current prototype, DECISIONS.md (through D-348), PRICING_MODEL.md, VOICE_AND_PRODUCT_PRINCIPLES_v2.md, and WORKSPACE_DESIGN_SPEC.md. Supersedes V1.0 (March 23, 2026).
>
> **Source of truth:** Prototype at `prototype/app/apps/[appId]/settings/page.tsx` (port 3001). This PRD describes the production version. The prototype is the visual spec.
>
> **Dependencies:** Account settings page (not yet built — holds email, auth phone, payment method). Carrier registration pipeline (rewrite pending for TCR CSP). Stripe billing integration (PRICING_MODEL.md).
>
> **Decision refs:** D-98, D-99, D-126, D-150, D-153, D-154, D-164, D-193, D-194, D-195, D-201, D-202, D-203, D-204, D-205, D-206, D-207, D-208, D-209, D-210, D-211, D-212, D-213, D-214, D-293, D-294, D-304, D-309, D-320, D-321, D-332, D-334, D-344, D-345, D-346, D-347, D-348.

---

## 1. PURPOSE

Settings is the per-app administrative page. It shows the developer what they have, what state it's in, and gives them the controls they need to manage their app.

Settings is a utility panel: everything findable, nothing hidden, no surprises. It is not a setup wizard, onboarding flow, conversion surface, or educational experience. The developer comes here to check facts and change settings, not to learn how SMS works.

**Design principle:** Settings never surfaces compliance mechanics, carrier infrastructure, or registration process details. If the developer needs to understand something about their registration, the interface states what's true — not why it's true or how it works underneath. This is consistent with the product thesis: the developer doesn't think about compliance because RelayKit handles it.

---

## 2. LAYOUT

- Route: `/apps/[appId]/settings` (child page of the workspace — D-332, D-345)
- Page heading: "Settings" h1 below the back link
- Navigation: "← Back to [app name]" link at top (e.g., "← Back to GlowStudio"). Links to `/apps/[appId]`.
- 600px max-width, centered
- Sections stack vertically as distinct cards (rounded border, padding, `space-y-6`)
- Sections appear and disappear based on lifecycle state — the page never shows irrelevant empty sections
- All body text: 14px (`text-sm`). Section headers: 18px (`text-lg font-semibold`). Action links: right-aligned.
- Ask Claude button available on this page (same entry point pattern as workspace header). Opens panel pre-loaded with the developer's app context and current state. Deflects support questions ("why was my registration rejected?", "how do I update my payment method?") before they become emails.

### Account Access

The top nav includes an account avatar button (right side) with a dropdown menu containing: account settings link (email, auth phone, payment method) and sign out. This is consistent across all authenticated pages, not specific to Settings. Account-level fields do not appear on the per-app Settings page — they live on the account settings page accessed via this dropdown.

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

**Visible:** All states except Onboarding.

This section shows the app-scoped business identity collected during the wizard and (post-registration) submitted to carriers.

#### Building (pre-registration)

Fields are editable — the developer can review and change what they set up during onboarding before paying $49 to register.

| Field | Display | Editable | Notes |
|-------|---------|----------|-------|
| Business name | [from wizard] | Yes — inline edit | |
| Category | [e.g., "Appointment reminders"] | Read-only | Changing use case = new app. |
| EIN | Masked (e.g., "••••••4567") | Yes — "Edit" link triggers EIN verification flow | Only visible if EIN was provided during onboarding. |
| EIN (not on file) | "Not on file" | "Add" link | Opens EIN verification flow. Adding EIN unlocks marketing messages. |

**Production edit pattern:** Editable fields open the corresponding wizard step component in a modal (e.g., clicking Edit on business name opens the `/start/business` name input as a modal, clicking Edit on EIN opens the EIN verification flow as a modal). The wizard components accept a `mode` prop — `"wizard"` for onboarding, `"modal"` for Settings edits — that controls navigation behavior. For the prototype, inline editing is sufficient.

#### Post-registration (Pending, Extended Review, Registered, Rejected)

All fields are read-only — they were locked at registration submission.

| Field | Display | Notes |
|-------|---------|-------|
| Business name | [as submitted] | Read-only. No sub-text. |
| Category | [e.g., "Appointment reminders"] | Set at project creation. |
| EIN (on file) | Masked (e.g., "••••••4567") | Read-only. Locked at submission. |
| EIN (not on file) | "Not on file" + "Add" link | Available in all post-registration states. Adding EIN unlocks marketing. |

Business name cannot change without canceling and restarting registration — it was submitted to carriers. Category is set at use case selection — changing use case means a new app. EIN is locked at submission.

**Why email and phone aren't here (D-347):** Email and auth phone are account-level fields shared across all apps. They live on the account settings page, accessed via the avatar dropdown in the top nav. The per-app test phone is managed on the workspace via the Testers card (D-342). Settings only shows app-scoped fields.

**Interim note:** While the account settings page doesn't exist yet, the prototype may still show email and personal phone on this page for completeness. Production should omit them from per-app Settings once the account page is built.

---

### 4.2 Registration

**Visible:** Pending, Extended Review, Registered, Rejected. **Not visible in Building.**

This section states facts about the registration. It does not explain carrier mechanics, registration pipelines, or approval processes. See Section 5 for the full rejection behavior model.

#### Pending / Extended Review

Both states show the same status label. The only difference is the sub-copy.

| Row | Value |
|-----|-------|
| Status | Amber dot + "In review" |
| Submitted | [date] |

**Pending:** No sub-copy.

**Extended Review:** "This is taking longer than usual. We'll email you at [developer's email] when there's an update."

#### Registered

| Row | Value |
|-----|-------|
| Status | Green dot + "Active" |
| Your SMS number | [dedicated number, e.g., +1 (555) 867-5309] |
| Approved | [date] |

Link: "View compliance site →" — opens `{slug}.msgverified.com` in new tab.

#### Rejected

| Row | Value |
|-----|-------|
| Status | Red dot + "Not approved" |
| Submitted | [date] |
| Reviewed | [date] |

**Rejection reason:** One or two lines explaining what happened, mapped from the carrier error code. The tone here is factual, not warm — the developer reached this state because they misrepresented their business or violated the acceptable use policy (see Section 5). Example:

> Your registration wasn't approved. The business information provided didn't match public records.

Followed by:

> Contact us at support@relaykit.ai if you believe this is an error.

No "What was submitted" detail block on the workspace card. On the Settings page, we do show the submitted fields for reference (business name, masked EIN, address, use case) since Settings is the factual reference surface. No "Start a new registration" CTA — the developer needs to talk to us first. No refund language in this section — financial details are in Billing.

---

### 4.3 API Keys

**Visible:** All states.

**Heading:** "API keys"

No sub-copy. The heading plus TEST/LIVE labels plus copy button are self-explanatory.

#### Test Key (all states)

- Label: "TEST" + green "Active" badge
- Monospace field: full key (e.g., `rk_test_rL7x9Kp2mWqYvBn4`) + copy button
- No Regenerate — test keys are low-security (delivers to verified phones only, daily cap)

**Data:**
- Format: `rk_test_{random_32_chars}`
- Stored as plaintext in `auth.users.raw_user_meta_data.test_api_key`
- Generated at project creation. Re-displayable (not hashed).

#### Live Key (Registered only)

- Divider between test and live sections
- Label: "LIVE" + green "Active" badge
- Masked field: `rk_live_••••••••••••••••••••` + copy button (visually disabled when masked: `opacity-30 cursor-not-allowed`, no click action)
- "Regenerate" link below field (right-aligned)

**Regenerate confirmation dialog:**
> This will immediately invalidate your current live key and generate a new one. The new key will be shown once — copy it before closing. Any code using the old key will stop working.
>
> Buttons: "Cancel" / "Regenerate" (destructive red)

**After regeneration:** New key displayed unmasked, copy button active. On next page load, key is masked again.

**Sub-copy below key fields:** "Live key is shown once when generated. Use Regenerate if you need a new one."

**Data:**
- Format: `rk_live_{random_32_chars}`
- Stored as SHA-256 hash in `api_keys` table
- Shown once at generation (on approval, or after regeneration on Settings)
- Not retrievable after page navigation — hash cannot be reversed

---

### 4.4 Billing

**Visible:** All states. Content varies.

#### Building

| Row | Value |
|-----|-------|
| Plan | Test mode — Free |

Sub-copy: "No credit card required."

#### Pending / Extended Review

| Row | Value |
|-----|-------|
| Registration fee | $49 paid · [date] |

Link: "View account billing →" (right-aligned, navigates to account-level billing page)

#### Registered

| Row | Value |
|-----|-------|
| Plan | $19/mo |
| Includes | 500 messages, then $8 per additional 500 |
| Next billing | [date] |

Link: "Manage billing →" (right-aligned, opens Stripe Customer Portal)

Separator line.

"Cancel plan" — text link, tertiary styling (`text-text-tertiary`, `hover:text-text-error-primary`).

**Cancel modal:**
> **Cancel your plan**
>
> Your plan will stay active through [billing period end date]. After that, live messaging stops but your test environment stays available — your code, your API key, and your test setup aren't going anywhere.
>
> Type CANCEL to confirm.
>
> [text input field]
>
> Buttons: "Keep plan" (grey) / "Cancel plan" (red, disabled until input matches "CANCEL")

No guilt copy, no survey (D-153). The typing requirement prevents accidental destructive action.

**Marketing pricing note (D-294, D-304):** When a developer has both transactional and marketing campaigns active, the plan displays as "$29/mo" instead of "$19/mo." The Includes row stays the same (500 messages are a combined pool). The $10/month increase is communicated during the marketing upsell flow, not re-explained on Settings.

#### Rejected

| Row | Value |
|-----|-------|
| Registration fee | See Section 5 for refund policy |
| Plan | Test mode — Free |

The registration fee line reflects the refund outcome: "$49 refunded · [date]" for process-failure rejections where RelayKit refunded at its discretion, or no refund line for AUP violations. See Section 5 for the full policy.

---

### 4.5 Notifications

**Visible:** All states.

**Heading:** "Notifications"
**Sub-copy:** "Get a text when something needs your attention."

Toggle switch, **off by default** (D-201).

When on: "Texts go to [auth phone number]" with "Change" link (navigates to account settings).
When off: phone destination line hidden.

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
- Notification phone inherited from account-level auth phone
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

Three phone numbers exist in the system. Never use the bare label "Phone" (D-207):

| Label | What it is | Where it lives |
|-------|-----------|----------------|
| Auth phone | Developer's own number. Used for login OTP and text notifications. | Account settings page (via avatar dropdown) |
| Your SMS number | Dedicated number assigned at registration approval. The number the developer's customers see. | Settings → Registration section (Registered only) |
| Test phone | Primary phone for receiving test messages. | Workspace → Testers card (D-342). Not on Settings. |

---

## 7. ACCOUNT-LEVEL VS. APP-LEVEL FIELDS (D-347)

**Account-level** (shared across all apps, lives on account settings page):
- Email
- Auth phone
- Payment method
- Sign out

Accessed via avatar button dropdown in the top nav. Not on the per-app Settings page.

**App-level** (per-app, lives on Settings):
- Business name (read-only post-registration)
- Category (read-only)
- Registration status and details
- API keys (test + live)
- Plan and billing for this app
- Cancellation
- Text notification toggle

**Interim treatment:** While the account settings page doesn't exist, the prototype shows email and personal phone on Settings for completeness. Production Settings should only show app-scoped fields. Account-level fields move to the account page when it's built.

---

## 8. DATA MODEL

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

Note: email and phone edits are account-level writes, handled on the account settings page (D-347).

---

## 9. ERROR STATES

| Scenario | Handling |
|----------|---------|
| Stripe billing fetch fails | "Billing information unavailable" with retry link |
| API key copy fails | Toast: "Couldn't copy to clipboard. Select and copy manually." |
| Live key regeneration fails | Modal stays open: "Something went wrong. Try again." |
| Cancel plan fails | Modal stays open: "Cancellation couldn't be processed. Try again or contact support." |

---

## 10. SECTION ORDER BY STATE

| Section | Building | Pending | Extended Review | Registered | Rejected |
|---------|----------|---------|-----------------|------------|----------|
| Business info | ✓ (editable) | ✓ (locked) | ✓ (locked) | ✓ (locked) | ✓ (locked) |
| Registration | — | ✓ | ✓ | ✓ | ✓ |
| API keys | ✓ (test) | ✓ (test) | ✓ (test) | ✓ (test + live) | ✓ (test) |
| Billing | ✓ | ✓ | ✓ | ✓ | ✓ |
| Notifications | ✓ | ✓ | ✓ | ✓ | ✓ |

**Section render order on page:** Business info → Registration → API keys → Billing → Notifications.

**Building state:** Four sections visible (Business info, API keys, Billing, Notifications). Business info is editable. No registration section.

---

## 11. IMPLEMENTATION NOTES

### Route
`/apps/[appId]/settings` (D-345)

### Component structure (recommended)
```
settings/
  page.tsx                    # Main page, reads registrationState from context
  sections/
    business-info.tsx         # Read-only registration fields
    registration.tsx          # State-conditional (pending/extended/registered/rejected)
    api-keys.tsx              # Test + live key display
    billing.tsx               # State-conditional
    notifications.tsx         # Toggle + notification destination
  components/
    key-field.tsx             # Monospace field + copy button
    cancel-modal.tsx          # Cancellation confirmation with CANCEL input
    regenerate-modal.tsx      # Live key regeneration confirmation
```

### Supabase RLS
Settings reads scoped to authenticated user's projects. RLS policies ensure users only read/write their own projects.

### Stripe integration
Billing data fetched server-side via Stripe Node SDK. Cancel calls Stripe API to cancel at period end. "Manage billing" links to Stripe Customer Portal (server-side `stripe.billingPortal.sessions.create()`).

---

## 12. OPEN QUESTIONS

| # | Question | Blocked on | Recommendation |
|---|----------|-----------|----------------|
| 1 | Additional fields in rejection "What was submitted" | Carrier error code mapping | Start with business name, EIN, address, use case. Expand as needed. |
| 2 | Error code mapping completeness | Carrier selection + error code documentation | Build mapping table per carrier during production. |
| 3 | Live key initial reveal UX | Approval celebration design | The first reveal happens at the approval moment, not on Settings. Settings always shows masked unless just regenerated. |
| 4 | Dual-campaign billing display ($29/mo) | Marketing upsell flow completion | Show $19/mo for now. When marketing activates, Billing section reflects $29/mo automatically. |
| 5 | Account settings page design | Separate PRD | Needs email, auth phone, payment method, sign out, danger zone (delete account). |
| 6 | Ask Claude panel design on Settings | Claude panel design session | Same entry point as workspace. Pre-loaded with app context and current state. Stub for now. |

### Resolved since V1.0

| Old # | Question | Resolution |
|-------|----------|------------|
| 1 (v1) | Review timeline value | "A few days." Configurable in production. |
| 2 (v1) | Account-level edit flow | Account settings page via avatar dropdown (D-347). Per-app Settings shows only app-scoped fields. |
| 7 (v1) | High-volume pricing tier | Deferred. Volume tapering in PRICING_MODEL.md ($7/500 at 5k+) but not surfaced on Settings. |
| 8 (v1) | Approved-but-pre-activation state | Eliminated. D-320: single $49 payment. No split payment, no activation sub-state. |
| 10 (v1) | Registration intake expectations copy | Handled by wizard flow design. |

---

## 13. CHANGELOG

| Date | Change |
|------|--------|
| 2026-03-23 | V1.0 — Preliminary PRD written from stabilized prototype. |
| 2026-04-14 | V2.0 — Full rewrite. State names, route, pricing, notifications rename, copy alignment. |
| 2026-04-14 | V2.1 — Added Settings h1. Business Info section now visible in all states including Building (editable pre-registration, locked post-registration). Added EIN row to Business Info with verified/not-on-file states. Restructured Account Info → Business Info (app-scoped only, D-347). Added account avatar dropdown to layout. Added Section 5: Rejection Behavior (four scenarios, fault model, refund rules, error code mapping). Rewrote Notifications with specific triggers per D-348. Replaced "sandbox" with "test" in API key labels and billing. Fixed user-facing status labels. Added Ask Claude entry point. Cancel modal requires typing CANCEL. Updated phone disambiguation. Removed drift detection references. Fixed onboarding redirect to `/apps/[appId]`. Noted production edit pattern: wizard step components reused in modals. |
| 2026-04-15 | V2.2 — Synced with implemented prototype. Removed "Verified" prefix from EIN display. EIN "Add" link available in all states when not on file (not hidden post-registration). Removed "Set during registration" sub-text from business name. Removed "Estimated review" row and Pending sub-copy. Removed Campaign ID from Registered. Removed API keys sub-copy. Removed "Plan: Test mode — Free" row from Pending/Extended Review billing. Notifications section now implemented. |
