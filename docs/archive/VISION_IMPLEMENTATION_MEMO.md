# Product Vision — Implementation Memo
## Decision Implications & PRD Ripple Effects
### March 12, 2026 — Consume and discard after implementation

> **This document has a short shelf life.** It maps the decisions in RELAYKIT_PRODUCT_VISION.md to specific PRD changes, DECISIONS.md entries, and prototype updates. Once these changes are implemented, this document is obsolete. The vision doc is the permanent reference.

---

## New Decisions for DECISIONS.md

These should be recorded before any build session that touches the affected PRDs.

**D-next: Category selection is sufficient for registration scope.** No plan builder curation step. No message selection at the RelayKit level. The developer picks a category; RelayKit determines the campaign type, generates artifacts, and submits. All messages in the category library are available as reference.

**D-next: Full-library build spec.** The build spec includes every message type for the developer's category, not a curated subset. The AI coding tool helps the developer choose which to implement during the build conversation.

**D-next: Build spec includes "Before building, ask me" section.** Use-case-aware clarifying questions appear at the top of the build spec, before implementation instructions. The AI encounters them first and asks before building.

**D-next: Build spec generates a complete reference implementation.** The spec instructs the AI to produce a complete, working SMS feature — not a utility function, not a scaffold. All core messages for the category, triggered correctly, with error handling and opt-in form.

**D-next: Marketing is always a separate campaign (Option C).** Initial registration is always transactional-only. Marketing capability is added via a second campaign registration when the developer is ready. Never registered as MIXED from day one. "Add marketing campaign" not "upgrade."

**D-next: 5 sample messages to TCR, all transactional for initial registration.** No marketing messages consume sample slots on the initial submission. Updates D-42 (was "exactly 3") and pending D-82.

**D-next: Anti-cookie-cutter strategy for TCR submissions.** Sample message wording varies per registration using intake data. Selection rotates across the 5–8 available base messages per category. No two registrations submit identical samples.

**D-next: Platform-specific setup instructions at download moment.** The build spec download UI includes per-platform guidance (Claude Code, Cursor, others) — three steps max, one line per platform. Not a generic "drop this in your project root."

**D-next: Core positioning locked.** "Tell Claude Code to build your messaging feature. It might just work on the first try." All customer-facing copy points in this direction. RelayKit describes itself as the SMS context layer for AI coding tools.

---

## PRD Impact Map

### PRD_02 (Template Engine) — Content changes

- `generateArtifacts()` selects 5 messages, not 3. Update selection logic, interface comments, all "3 messages" references.
- Selection algorithm needs variety optimization: different message types/triggers across the 5, wording variation from intake data, rotation across the available 5–8 base messages.
- No change to `getMessageTemplates()` — it already returns the full library.
- `APPROVED_MESSAGE_TYPES` and `NOT_APPROVED_CONTENT` maps unchanged.
- MIXED campaign type registration removed from initial flow. `determineCampaignType()` in PRD_01 should no longer return MIXED for initial registration — always returns the narrow transactional type. MIXED only applies to the second marketing campaign.

### PRD_05 (Deliverable) — Structural changes

- Build spec template rewrite:
  - Section 1 adds "Before building, ask me" — use-case-aware clarifying questions at the top
  - Section 3 includes ALL messages for the category, not just "enabled" ones (the concept of enabled/disabled messages at the RelayKit level goes away)
  - Section 4 "What to build" reframed: instruct the AI to build a complete feature from the reference library, not just wire up selected messages
  - Questions are use-case-specific (appointment apps get different questions than verification systems)
- `generateBuildSpec()` function signature simplifies: no longer needs `messagePlan` with per-message enabled state. Takes category + customer data, returns the full library rendered with their business details.
- Build spec download moment copy: platform-specific instructions per Section 6 of the vision doc
- SMS_GUIDELINES.md scope unchanged but importance elevated — this is explicitly "half the product"

### PRD_06 (Dashboard) — Significant simplification

- **Plan builder removed as a concept.** The "choose your messages" step doesn't exist. Category selection → messages page (reference catalog) → build spec generation. The flow skips straight from use case tiles to the messages reference.
- **Messages page is read-only reference only.** No enabled/disabled state. No message selections that feed into anything. Checkboxes exist solely for "copy selected" functionality.
- **Build spec generator simplifies.** "Generate build spec" takes the category and customer data. No plan builder output to consume. No "enabled messages" to filter.
- **Marketing section on messages page reframed.** From "check these to add marketing" to "these are available when you add a marketing campaign." The +$10/mo note stays. The visual separation stays. The framing shifts from selection to information.
- **Go Live / registration flow unchanged** in mechanics, but the intake data contract simplifies since there's no per-message selection state to carry forward.
- **Three-tier message library (post-registration) unchanged in structure** but Tier 1 (canon messages) is now the 5 samples we submitted + any others in the category, not "messages the developer selected." Tier 2 framing ("also available") stays. Tier 3 (marketing expansion) stays.
- **"Ready to build?" section** updated with platform-specific instructions alongside the download.

### PRD_01 (Intake Wizard) — Moderate changes

- **Screen 1b (Advisory) simplifies.** No expansion checkboxes for marketing at initial registration. The advisory screen can still explain what the category covers, but there's no "also add marketing?" decision point. Marketing is a post-registration dashboard action.
- **Path 2 (Dashboard → Intake) simplifies.** The `DashboardToIntakeData` interface no longer carries per-message selections. It carries category + customer details.
- **Registration tier determination simplifies.** Initial registration is always the narrow transactional type for the category. No MIXED tier at checkout. The $29/mo mixed price point only applies when the developer adds marketing later.
- **Checkout pricing display:** Always $199 + $19/mo for initial registration. Mixed tier pricing ($29/mo) appears only when adding a marketing campaign from the dashboard.

### PRD_01 Addendum (Dashboard Flow) — Simplifies

- `DashboardToIntakeData` interface drops `messages` array and `enabled` states. Carries category, business details, and customer metadata only.
- sessionStorage payload shrinks accordingly.

### PRD_04 (Twilio Submission) — Minor changes

- Receives 5 sample messages instead of 3 from `generateArtifacts()`. The submission code itself doesn't change (it passes the array), but the array is now always length 5.
- Initial registration is always the narrow campaign type. No MIXED submissions on first registration.
- Second campaign registration flow needed (new): when developer adds marketing, PRD_04 submits a second campaign on the existing subaccount. This is new functionality but aligns with the existing expansion model (D-15, D-37).
- Privacy Policy URL and Terms URL: investigate adding `privacyPolicyUrl` and `termsAndConditionsUrl` to campaign create call (compliance site URLs). Per the Twilio screenshot analysis.

### PRD_07 (Landing Page) — Positioning alignment

- Hero section leads with AI coding tool workflow, not compliance story
- "How it works" = pick your use case → get your build spec → tell your AI to build it
- Speed claims: "See your first SMS in 5 minutes" / "It might just work on the first try"
- Registration is step four, happens in background — not the headline
- Build spec is featured, not the dashboard or the API docs

### PRD_08 (Compliance Monitoring) — No changes

- Drift detection baseline is still canon messages (the 5 submitted + the full category scope)
- `APPROVED_MESSAGE_TYPES` and `NOT_APPROVED_CONTENT` unchanged
- Marketing consent enforcement unchanged (still requires `recipient_consents` for MIXED tier)

### PRD_09 (Messaging Proxy) — Minor changes

- Marketing consent check still applies, but only after developer has added a marketing campaign (second registration). The MIXED tier flag comes from having two active campaigns, not from initial registration.
- No other changes to proxy behavior.

---

## Schema Impact

### `message_plans` table

This table was designed to store per-message selections from the plan builder. With no plan builder, its role changes significantly.

**Option A — Simplify radically.** `message_plans` stores only category and tier. No per-message JSONB array. The build spec generator reads the category and renders the full library.

**Option B — Keep for future use.** The table structure stays, but the `messages` JSONB array is populated automatically with all messages for the category (all enabled, none edited). This preserves the schema for potential future features (like post-registration message customization) without requiring a migration.

**Recommendation:** Option B. The table is already built. Populating it automatically with the full library is trivial. If we ever want per-message state (post-registration customization, usage tracking per message type), the schema is ready.

### `message_plans.messages` JSONB

Each entry no longer has meaningful `enabled` or `edited_text` state at the RelayKit level. All messages are available. The JSONB still serves as a record of what the category contains, and `edited_text` can be repurposed later if we add post-registration customization.

### No new tables required

The `recipient_consents` table (already specced in PRD_08/PRD_09) handles marketing consent. The second campaign registration uses the existing registration pipeline. No new schema.

---

## Prototype Impact

### Messages page (`/c/[category]/messages`)

- **Already mostly correct.** The read-only catalog design is aligned with the vision.
- **Checkboxes stay** — they're for "copy selected" functionality, not message selection.
- **Marketing section divider stays** — reframe copy from "Your users check an extra box when they sign up" to something like "Available with a marketing campaign — add anytime from your dashboard."
- **No plan builder link needed.** Remove "← Edit plan" from the header if still present.
- **"Generate build spec" CTA** can live on this page or on the compliance/dashboard page. Placement TBD in prototype.
- **Platform setup instructions** appear at or near the download moment.

### Category chooser page

- Unchanged. Developer picks a category, goes to messages page.

### Compliance page (not yet prototyped)

- Unaffected by these changes. The compliance page is post-registration primary — registration status, drift alerts, API keys, usage. These decisions don't change its role.

---

## Docs to Update

When entering the next CC build session, these documents need the changes above applied before CC builds from them:

| Document | Change | Priority |
|----------|--------|----------|
| DECISIONS.md | Add ~9 new decisions listed above | Before any build session |
| PRD_02 | 3→5 sample messages, selection algorithm, remove MIXED from initial registration | Before Step 3 (PRD_05 build) |
| PRD_05 | Build spec template rewrite (full library, "Before building" section, reference implementation framing) | Before Step 3 |
| PRD_06 | Remove plan builder concept, simplify build spec generator, reframe marketing section | Before Step 2 (dashboard build) |
| PRD_01 | Remove marketing expansion from initial registration, simplify advisory screen | Before Step 4 |
| PRD_01 Addendum | Simplify DashboardToIntakeData interface | Before Step 4 |
| PRD_04 | Note: receives 5 samples now; second campaign registration flow needed | Before Step 5 or later |
| PRD_07 | Positioning alignment (can wait until Step 7) | Before Step 7 |
| Experience Principles | Fix "5–7 business days" → "2–3 weeks" (still pending from D-17) | Any time |

---

## What This Memo Does NOT Cover

- The "Before building, ask me" question sets per use case — these need to be authored as part of PRD_05 content work
- Platform-specific setup instruction copy — needs to be written for each supported platform
- The second campaign registration UX flow — needs design work (dashboard action, what the developer sees, timeline expectations)
- Landing page copy — depends on PRD_07 build, informed by vision doc Section 5
- Prototype compliance page design — separate workstream, not affected by these decisions
