# RelayKit Workspace Design Spec
## From wizard to workspace — the new developer experience
### April 4, 2026

---

## What This Document Is

This is the design spec for reshaping the RelayKit prototype from a dashboard-first experience into a wizard-to-workspace flow. CC should read this alongside DECISIONS.md, PROTOTYPE_SPEC.md, and VOICE_AND_PRODUCT_PRINCIPLES_v2.md before building.

This is a phased rebuild. Not everything ships in one session. Each phase is independently useful.

---

## Design Principles

1. **One flow, one direction, one destination.** The developer arrives, sets up, and lands on their messages. No tabs to choose between. No "where do I start?" moment.
2. **Messages are the product.** Every screen exists to get the developer to their messages or to help them use their messages.
3. **The page grows with the developer.** First visit is minimal. Features appear as the developer's progress makes them relevant. No empty states for things they haven't done yet.
4. **We don't presume to know their app.** RelayKit knows messages and compliance. The developer's AI tool knows their codebase. We stay in our lane.
5. **Setup becomes Settings.** The data collected during onboarding is the same data that lives in Settings. The context changes, not the data.
6. **Never explain our process.** Intake questions ask. Message previews show. The summary confirms. No teaching the developer about compliance, registration pipelines, or carrier mechanics during onboarding. The product thesis is that they don't have to think about this stuff — the UI must prove that thesis, not undermine it.
7. **Everything is scoped to the app, not the account.** Business identity, EIN, categories, messages, API keys, demo list — all per-app. A developer account can have multiple apps (PRD_11), each with its own workspace. Design nothing that assumes one app per account.

---

## The Flow

### Step 1: `/start` — Vertical Picker

**URL:** `relaykit.ai/start`
**Auth required:** No

A single screen. One heading: "What's the main reason your app sends texts?" Below it, eight cards — one per vertical. Each card has the category name and a one-line description of what's included:

- **Appointments** — Confirmations, reminders, reschedules, cancellations
- **Orders** — Order updates, shipping, delivery, returns
- **Verification** — Login codes, password resets, 2FA
- **Support** — Ticket updates, resolution notices, follow-ups
- **Marketing** — Promotions, new arrivals, loyalty rewards
- **Team alerts** — Meeting reminders, schedule changes, incidents
- **Community** — Event updates, group announcements, renewals
- **Waitlist** — Position updates, spot available, reservations

One click advances. The "main reason" framing signals this is a starting point, not a final commitment — other categories can be added later.

Nothing else on the screen. No nav bar, no sign-in link, no marketing copy. Pure focus.

**Design notes:**
- Full viewport height, content centered vertically and horizontally
- Cards are large tap targets with category name (bold) and description (muted). 2-column grid on desktop, single column on mobile.
- Selecting a card immediately navigates to Step 2 — no "Next" button
- Use existing Untitled UI brand colors

### Step 2: `/start/[vertical]` — Intake Questions

**URL:** `relaykit.ai/start/appointments` (etc.)
**Auth required:** No

A conversational intake flow. Not a form — questions appear one at a time, building downward as the developer answers. 3-6 questions depending on vertical.

**Full intake question list (all verticals):**
1. "What's your business called?" → text input (all verticals)
2. Vertical-specific context (1-2 questions depending on vertical):
   - Appointments: "What do people book with you?" (e.g., "nail appointments," "dental cleanings," "tutoring sessions")
   - Orders: product type, shipping methods, return window
   - Verification: app name (if different from business name)
   - Support: (business name + website may be sufficient — no extra question)
   - Marketing: (no vertical-specific context needed beyond business name)
   - Team alerts / Internal: (business name may be sufficient)
   - Community: community name (if different from business name), venue type
   - Waitlist: venue type
3. "Do you have a website?" → optional URL input (all verticals)
4. Vertical-specific follow-ups (conditional):
   - Appointments: "Do you have a cancellation policy?" → yes/no, if yes → brief text input
5. EIN collection (conditional — see below)
6. "Anything else we should know?" → optional freeform text input. This field feeds into the AI summary (Step 3) and is available as context for AI help suggestions on the messages page. It does not directly modify message templates. Psychologically, it signals "we're listening" and lets developers add context we didn't think to ask about ("we're mobile-only," "we serve Spanish-speaking clients," "we call them sessions not appointments").

**Appointments example flow:**
1. "What's your business called?" → text input
2. "What do people book with you?" → text input
3. "Do you have a website?" → optional URL input
4. "Do you have a cancellation policy?" → yes/no, if yes → brief text input
5. EIN (conditional)
6. "Anything else we should know?" → optional freeform

**EIN collection (triggers for any second campaign, not just marketing):**
EIN is required for any developer who wants more than one campaign — whether that's transactional + marketing, or two different transactional categories (e.g., orders + appointments). Sole props without EIN are limited to one campaign of any type.

- If the developer picked marketing as primary: EIN is required during intake (marketing always requires EIN for carrier registration).
- If the developer picked a transactional primary: EIN is asked if they indicate interest in marketing or a second category. "Do you have an EIN? It unlocks marketing messages and additional use cases." Not required to proceed — they can skip and add later from Settings.
- On EIN entry: inline verification, business identity fields auto-populate (D-303), developer confirms.
- If no EIN: single campaign path. No dead-end UI, no "you can't do this." The option for a second category simply isn't offered.

**As the developer answers,** the right side of the screen (or below on mobile) shows a live preview of their first message materializing with their real business context. Business name populates, service type fills in. The message appears to write itself from their answers.

**Design notes:**
- Left column: questions, building downward. Right column: live message preview (desktop). Single column with preview below on mobile.
- Each question has generous spacing. Feels like a conversation, not a form.
- Inputs auto-focus on reveal. Enter key advances to next question.
- Message preview uses the same card treatment as the messages page (continuity)
- Back button available but unobtrusive

### Step 3: Intake Summary

**Still on:** `relaykit.ai/start/[vertical]` (or a sub-step)
**Auth required:** No

After the last question, the screen transitions to a summary. This is AI-powered — not just echoing back their inputs, but synthesizing: "You're building appointment SMS for GlowStudio, a nail salon. We'll set up booking confirmations, reminders, reschedule and cancellation notices, no-show follow-ups, and pre-visit instructions — all with your business name and service details already filled in."

The summary feels like RelayKit understood them, not like a form recap.

**Below the summary:** Editable fields showing the structured data (business name, service type, vertical, EIN if provided). The developer can correct anything before proceeding.

**CTA:** "See your messages →"

**If EIN was verified:** Before advancing to messages, offer: "Want to add another category?" Shows the vertical picker again (minus the one they already picked). If they select a second category, a brief 1-2 question intake for that vertical (we already have their business name, EIN, etc. — just need category-specific context). Both categories' messages appear on the messages page. If they skip, they can always add from Settings later.

**Design notes:**
- This is a moment of delight. The AI summary should feel warm and specific, not templated.
- The editable fields below are compact — inline edit on tap, not a full form
- This data becomes the foundation of Settings after signup
- The "add another category" offer should feel like a bonus, not a required step. Small, secondary CTA below the primary "See your messages" button.

### Step 4: Verify Phone

**Inline step** — could be a modal or an inline expansion on the summary page.

"Where should we send test messages?" Phone input, send OTP, verify. Developer now has a primary test phone.

**Design notes:**
- This should feel lightweight, not like a separate step. One input, one button, one OTP field.
- After verification: "Verified ✓" with the number displayed. Immediate transition to messages.

### Step 5: `/start/[vertical]/messages` — Messages (The Destination)

**URL:** `relaykit.ai/start/[vertical]/messages`
**Auth required:** No (but messages are session-scoped until signup)
**This is the most important screen in the product.**

The developer lands here and sees their complete message set for the vertical. All messages, pre-populated with their business context from intake. Every message has a send button from the start (phone is verified from Step 4).

**Layout:**

**Intake summary panel:**
A summary on the page showing the key data collected during intake. Displays all collected information — business name, service type, website, EIN (if provided), phone number, vertical-specific context, and freeform notes. "Edit" opens a panel where all fields are editable. Editing message-affecting fields (business name, service type, website) updates message previews live — this reuses the existing Personalize functionality as its foundation. If the developer enters or edits their EIN in the panel, offer a second category to add.

This panel replaces the current Personalize slide-over. Same data, same live-preview behavior, but reframed from "see how messages look" to "here's what you told us" — the source of truth that feeds messages and eventually Settings.

The summary is always accessible on the messages page (not just first visit). After signup, the same data lives in Settings but remains accessible from the messages page for quick reference and edits.

**Message cards:**

Each message is a card showing the full message text — not truncated, not collapsed to a single row.

**Default state:**
- Title ("Booking confirmation") — bold, top of card
- Info icon (i) — in the title row, right side. Taps to show what this message is for.
- Edit button — in the title row, right side (where copy icon was). Opens the edit state.
- Full message text below the title, with personalized variables highlighted (business name, service type, dates, etc.)
- Send button — round icon button, floats outside the card on the right side. Always one tap to send to primary phone.

No card numbers. No template/preview toggle. No copy button. No "Modify with AI" in default state.

**Edit state** (triggered by Edit button, or possibly by clicking into the message text — discoverability TBD in prototype):
- Title + info icon unchanged
- Message text becomes an editable textarea, variables still highlighted
- Send button remains available on the right (developer can send mid-edit to test changes)
- Bottom of card expands to reveal edit controls:
  - **Style pills:** "Current" (always first — shows the saved version for reference without canceling), then style variants (names TBD — current "Brand-first / Action-first / Context-first" labels need more evocative names; park for later). Tapping a pill swaps textarea content to that variant as a suggestion — Accept/Revert buttons appear. AI pre-validates pill swaps before showing.
  - **AI help input:** Freeform text field — "How should we change this?" Developer types a request ("make it more casual," "add my cancellation policy"), AI rewrites and shows result in textarea as a suggestion — same Accept/Revert flow as pills. AI pre-validates before showing. For now, wire the UI only — no actual AI call.
  - **Contextual AI suggestions:** Per-message suggested modifications (e.g., "Add a reschedule option with a link," "Include preparation instructions"). Tapping one triggers the same AI rewrite flow.
- **Save / Cancel buttons** at the bottom of the card (inside the card, not floating)
- **Compliance feedback on manual edits only:** If the developer manually types changes AND the edit breaks compliance, quiet grey helper text appears after a few seconds of inactivity with a brief explanation. Save button swaps to "Fix" (or similar — CTA name TBD). Fix triggers auto-correction. If the developer fixes the issue themselves, Save returns automatically. Save is disabled while non-compliant. No green checkmarks. No yellow warnings. No scare colors. The developer never learns about compliance rules — they just can't save a broken message, and there's always a one-click fix.
- AI-generated changes (pill swap, AI help, Fix) are always pre-validated — compliance feedback never appears on our own output.

**Edit interaction model — preview before commit:**
All text changes from pills or AI help follow the same pattern: new text appears in the textarea as a suggestion, Accept/Revert buttons appear below. The developer sees the result before it's applied. Accept keeps the new text. Revert returns to what was there before. This applies equally to pill swaps, freeform AI rewrites, and Fix auto-corrections. The developer stays in control throughout.

**Message grouping:**
Messages are grouped by category (namespace). If the developer selected one category, all messages for that category are shown. If they selected two categories (e.g., appointments + marketing, or orders + appointments), messages are grouped under category headers.

If the developer has an EIN but only selected one category, a subtle affordance at the bottom of the messages: "Add another category" — opens the vertical picker to add a second. Second category's messages appear in a new group.

If the developer does NOT have an EIN, no "add another category" affordance. They have one category, it's complete, no dead ends.

**Pricing note within multi-category view:** If two categories are present, a brief note near the top: "Two categories register as separate campaigns. $29/mo instead of $19/mo when you go live." Factual, not pushy.

**"Send to my phone" as a persistent action:**
In addition to per-card send buttons, a floating or bottom-anchored button: "Send to my phone." Tapping it opens a quick picker — select a message, tap send, phone buzzes. This is the hook moment for first-time visitors who want to see a real text before committing.

**Design notes:**
- Message cards show full message text in default state — no truncation, no collapsed single-row view
- Clear visual hierarchy: title is bold/medium weight, message text is regular, variables highlighted in brand color
- Send button floats outside the card on the right as a round icon button — immediately recognizable (paper plane or similar), always one tap
- Edit button lives in the title row icon area — replaces the old copy/template icons
- Edit state expands the bottom of the card to reveal controls; the card itself doesn't change shape otherwise
- Keep vertical rhythm comfortable — developer should see 3-5 cards without scrolling on a standard viewport (cards are taller now with full message text)
- Marketing section should feel like part of the same page, not a separate tab or section that feels bolted on
- All interactions are inline. No modals for editing. No modals for sending. The page is the workspace.
- The global style pill bar above the cards is removed — pills live inside each card's edit state
- The global "Personalize," "Show template," and "Copy all" controls are removed — personalization is handled by the intake summary panel; template view and copy are not needed in the new flow

### Step 6: Signup

**Triggered by:** "Continue" button at the bottom of the messages step — same visual treatment as every other wizard advance. Not a separate decision moment. Not triggered by send-to-phone. The developer has looked at their messages, maybe edited a couple, maybe sent a test. When they're ready, they scroll down and hit the same kind of button they've been hitting since the vertical picker.

**Appears as:** The next step in the wizard flow, not a modal or gate. Same page structure as prior steps.

**Price reveal:** This is where the developer learns what it costs. A single line above the signup inputs: "Free while you build. $99 + $19/mo when you're ready for real delivery." Informational, not a gate — signup itself is free. The developer has experienced the product (intake, messages, test send) but invested zero engineering time. If the price doesn't work, they close the tab and lost nothing. No sunk cost, no surprise later. Every developer who proceeds builds with full knowledge of the cost. The go-live button is never a surprise. (D-314, D-315)

**Signup inputs:** Email input. OTP verification. One optional checkbox: "Send me product updates" (unchecked by default — we build opt-in compliance software). That's it.

On signup:
- API key generated (`rk_sandbox_` prefix)
- If they came from `npx relaykit init` earlier: they already have the CLI installed. After signup, the instructions say "Go back to your terminal and run `npx relaykit init` again — it'll pull your messages and API key automatically now that you're signed up." The developer initiates, stays in control. No background session linking, no browser-to-terminal magic.
- If web-only (no CLI session): "What do you build with?" — show tool icons (Claude Code, Cursor, Windsurf, Copilot, Cline, Other). One tap. Then show setup instructions tailored to that tool — the right command, the right way to feed it the spec file. API key shown once, copy button. This also gives us useful audience data without making it feel like a survey.
- Wizard chrome dissolves. Setup context card gets a "Looks good" / dismiss affordance if not already dismissed. The messages page is now the workspace.

**What changes after signup:**
- Messages are saved to the developer's account (no longer session-scoped)
- The URL shifts from `/start/[vertical]/messages` to `/app/[appId]/messages` (scoped to app, not user — supports multi-app future)
- Demo list functionality will appear after first SDK send (see Progressive Disclosure below)

---

## The Workspace (Post-Signup)

After signup, the wizard is done. The developer's workspace is the messages page. It's the same page they were just on, minus the wizard framing.

### Navigation

**Top bar:** RelayKit logo | App name + vertical badge | Settings (icon/link) | Sign out

No tabs in sandbox. The messages page IS the app. Settings is accessible via icon/link in the top bar, not as a tab.

**After registration (pending/approved):** Add an "Overview" link in the top bar. Overview shows registration status (the existing timeline stepper, which is good) and, after approval, delivery metrics. Overview is not visible before registration because there's nothing to overview.

### Messages Page (Workspace)

Same layout as Step 5, minus setup context card (which was dismissed or auto-removed at signup). All message cards, all editable, all sendable.

**Additions that appear over time (progressive disclosure):**

**After first SDK send detected:**
- "Demo phones" section appears below the messages. Collapsed by default: "Your phone: +1 (555) 123-4567"
- Expandable to show: primary phone (always active), "Add someone" button
- Adding a person: enter phone + name label, OTP verification, added to list
- Invite link: secondary action within the demo section, generates branded link
- Per-card send action now shows recipient picker: primary phone pre-checked, demo list members as checkboxes
- Note in demo section: "Checked phones also receive messages when your app sends in sandbox."
- Per-session selection: every page load starts with only primary phone checked

**After demo list has members:**
- Demo section shows: "Your phone + 2 others" when collapsed
- Expanded: list with labels ("Sarah — shop owner"), masked numbers, checkboxes, remove button per person
- Mode 1 (manual website send): per-card send action with recipient picker
- Mode 2 (app-triggered): checked phones receive sandbox sends from the app

**Test activity log:**
- Appears after first successful send (website or SDK)
- Below messages, above demo section (or collapsible panel)
- Simple chronological list: message name, recipient, timestamp, delivery status
- "Booking confirmation → +1 (555) 123-4567 — delivered, 2 min ago"
- SDK-triggered sends are labeled: "From your app" badge
- Capped at last 20 entries, no pagination needed

**Integration test checklist (appears after signup):**
A collapsible "Test your integration" section. Vertical-specific checklist mapping app actions to expected messages:

For appointments:
- ☐ Book an appointment → Booking confirmation
- ☐ Wait for reminder window → Reminder sent
- ☐ Reschedule → Reschedule confirmation
- ☐ Cancel → Cancellation notice

Each item auto-completes when the API detects the corresponding send. The developer watches the list fill up in real time as they test their app.

When an item doesn't fire, offer a contextual prompt they can paste into their AI tool: "The booking confirmation sends but the cancellation handler isn't firing. Here's what to tell your tool:" with a copy button containing something like "When an appointment is cancelled, call `relaykit.appointments.sendCancellation(phone, { date })`. It's not firing — find where cancellations are handled and wire it in."

We're not debugging their app. We're telling them which SDK call should fire and letting their tool figure out where it goes. Stays in our lane.

The checklist disappears (or collapses to "All messages verified ✓") once every item is checked. Gone when it's done its job.

### "Go Live" CTA

A banner or persistent element on the workspace (not in the way, but visible):
"Ready for real delivery? Go live →"

Clicking opens a pre-filled registration confirmation. NOT a form. A review screen:
- Business name: GlowStudio ✓
- Business type: LLC ✓ (from EIN lookup if available)
- EIN: ••••4567 ✓ (if provided)
- Address: [pre-filled from EIN lookup, or fields to fill]
- Categories to register: Appointments, Marketing (each submits as a separate TCR campaign)
- Messages per category: 6 appointment, 3 marketing ✓
- Contact: their email ✓
- Pricing: $99 one-time + $19/mo (one category) or $99 one-time + $29/mo (two categories)

Only fields we don't already have are empty inputs. For many developers, this is a "Confirm and pay $99" button. No pricing surprise — the developer saw the cost at signup (D-315) and has been building with full knowledge since. Full refund if registration is rejected.

**Registration logic:** We submit all categories the developer used in sandbox as separate TCR campaigns simultaneously. No sequencing, no "primary first, second later." One submission, one $99 fee, all campaigns reviewed together.

---

## Message Edit Lifecycle

**The website authors, the SDK delivers (D-279).** This has concrete UX implications:

**Message copy edits are zero-code.** When a developer edits a message on the website, the next send from their app uses the new copy automatically. No code change, no redeployment, no new spec file. The website should confirm this after every save: "Saved. Your app will use this version on the next send."

**New messages don't require return trips.** The spec file tells the AI tool to build handlers for ALL messages from day one. If the developer enables a new message type on the website later, the handler likely already exists in their code. The SDK call just starts working because the server has the template.

**We don't generate new prompts for the tool on return visits.** By the second visit, the developer's AI tool has vastly more context about their app than we do. Any guidance we give about where to put new code would be guessing. After changes on the website, we show what changed (e.g., "2 new messages available") and the function signatures. The developer tells their tool what to do. We show available functions, not integration instructions.

**SMS_GUIDELINES.md updates via API.** When messages change or categories are added, the guidelines file updates automatically. The developer's tool fetches the latest version when asked — no manual download.

---

### In Sandbox (pre-registration)

Settings is the intake data in editable form. Accessed from top bar icon/link.

**Sections:**
- **Your business:** Business name, service type, website, EIN (add or edit). This is the intake data. Editing business name here updates it in all message previews.
- **Categories:** Shows active categories (e.g., "Appointments"). If EIN is on file, "Add another category" affordance. If no EIN, "Add your EIN to unlock additional categories" with inline EIN input.
- **API key:** Sandbox key, copyable. Note: "Your AI tool reads this from your .env file."
- **Your phone:** Primary verified number. "Change" to re-verify a different number.

That's it. Clean, minimal, directly useful.

### After Registration

Settings grows:
- **Registration:** Status, timeline, campaign ID, compliance site link, SMS number
- **Billing:** Plan, usage, next billing date, manage billing link (Stripe portal)
- **API keys:** Sandbox key + live key (shown once at generation, masked after)
- **Danger zone:** Cancel plan, delete account

---

## Key Decisions Referenced

- D-279: Website authors, SDK delivers
- D-293: Compliance at authoring time, not send time
- D-294: Marketing auto-submits or activates on-demand
- D-295: No expansion modal
- D-296: SDK and API are equal paths
- D-300: Intake interview with Claude on backend
- D-301: Locked variable schemas per message type
- D-302: EIN required for any second campaign (AMENDED — was "marketing only," now any second campaign of any type. Sole props limited to one campaign.)
- D-303: Business identity pre-validation from EIN lookup
- D-304: Symmetrical pricing — first campaign $19, second $29
- D-305: Marketing-only is valid standalone
- D-310: EIN and business identity are per-app, not per-account (PENDING — needs to be recorded)
- D-311: Multiple categories submit simultaneously at registration — no sequencing (PENDING — needs to be recorded)
- D-312: TCR allows up to 5 campaigns per brand; v1 supports max 2, additional campaigns backlogged (PENDING — needs to be recorded)
- D-313: Pre-auth message send — a special endpoint or temporary session token allowing message sends before signup, scoped to verified phone only (PENDING — needs design and recording)
- D-314: Single $99 go-live fee replaces $49 submission + $150 approval split (PENDING — needs to be recorded)
- D-315: Price revealed at signup step, not at go-live or on arrival (PENDING — needs to be recorded)
- D-316: Signup is a wizard step, not a separate decision moment — same "Continue" treatment as other wizard advances (PENDING — needs to be recorded)

---

## What This Replaces in the Current Prototype

**Removed (already done this session):**
- Compliance alerts system (D-293)
- Marketing expansion modal (D-294, D-295)

**To be removed/replaced:**
- Overview tab as default landing → Messages is default, Overview appears after registration
- Onboarding wizard (4-step "Build your SMS feature") → Replaced by the `/start` wizard flow
- Three-tab dashboard (Overview, Messages, Settings) in sandbox → Single messages workspace + Settings via top bar
- "Download RelayKit" / "Re-download RelayKit" buttons → Replaced by `npx relaykit init` with session linking
- "AI tool setup" dropdown on Messages tab → Removed; the tool integration happens via CLI, not the website
- Message flow diagram (numbered 1-6 step visualization) → Removed; the developer already knows what messages they have because they just set them up
- "All messages scanned before delivery" compliance line → Removed per D-293
- Period selector dropdown on Overview → Only appears post-approval when metrics exist

**To be preserved:**
- Registration status timeline stepper (screenshot 6) — good design, moves to post-registration Overview
- Approved-state metrics cards (Delivery, Recipients, Usage & Billing) — moves to post-registration Overview
- Settings page structure for post-registration (Account info, Registration, API keys, Billing) — grows from sandbox Settings
- Message card styling foundation — adapt for new collapsed/expanded states
- Style variant pills (Brand-first, Action-first, Context-first) — inside expanded edit state

---

## Build Phases

### Phase 1: Workspace Reshape (do first)
Reshape the existing dashboard into the messages-first workspace. Remove Overview tab in sandbox. Remove onboarding wizard. Messages page becomes the landing page. Settings accessible from top bar. This is surgery on existing code, not net-new pages.

### Phase 2: Message Card Redesign
New collapsed/expanded card states. Per-card send button. Inline editing with style pills, AI help placeholder, and validation indicators. This can use the existing Messages tab content as a starting point.

### Phase 2.5: Error States Design Session (PM + Joel, no CC)
Before building the wizard flow, walk through every interaction that can fail and design the recovery. Prevention first — flows should be designed so errors are hard to trigger (progressive disclosure, inline validation on delay, smart defaults). Then for failures that can still happen, design what the developer sees.

Key interactions to cover:
- EIN verification fails (bad number, no match, service unavailable)
- EIN/business name mismatch (lookup returns a different name)
- Phone OTP expires or wrong code entered
- AI summary generation fails or returns nonsense
- Message edit fails validation and developer tries to save anyway
- Message edit AI rewrite produces non-compliant output
- Network errors during any async operation
- Pre-auth send fails (before signup, no API key)
- Signup OTP fails or email already exists

Output: error state designs added to this spec before Phase 3 begins.

### Phase 3: `/start` Wizard Flow
Net-new pages: vertical picker, intake questions, summary, phone verification, and pre-auth messages view. This is the top-of-funnel that doesn't exist yet. Requires the most new code.

### Phase 4: Demo Functionality
Demo list management, per-session selection, recipient picker on send, invite link, test activity log. Progressive disclosure based on SDK send detection.

### Phase 5: Go Live Flow
Pre-filled registration confirmation screen. Replaces the current multi-field registration form. Depends on EIN verification backend (D-302, D-303) for full auto-population.

---

## Visual Design Strategy

Untitled UI is being used as a wireframe kit, not as the final visual identity. The current prototype uses Untitled UI for component structure, spacing, interaction patterns, and data hierarchy — but the visual design is not final. A dedicated visual design sprint will happen after the product shape stabilizes.

**What this means for CC right now:**

- **Use Untitled UI components for structure and behavior.** They give us consistent layouts, accessibility, and interaction patterns. That's their job.
- **Do not treat Untitled UI's visual style as the brand.** It's generic SaaS. RelayKit will have its own visual identity. The design sprint will define typography, color palette, spacing refinements, and motion.
- **Prepare for a clean reskin.** This is the critical requirement. Every visual decision must be easy to change later:
  - Use semantic color tokens aliased through theme config, not hardcoded hex values or Untitled UI color names baked into className strings. `text-brand-primary` is good. `text-purple-600` baked everywhere is a painful redesign.
  - Name components after their function, not their appearance. `RegistrationStatusStepper` not `PurpleTimelineCard`.
  - Keep the token layer thin and remappable. If all brand colors flow through a theme.css config, reskinning is an afternoon. If they're scattered across 50 files, it's a week.
- **Animations come last.** The design sprint will define motion and micro-interactions after the visual identity is set. Do not add animations now — they'll be thrown away. The exception is functional transitions (expand/collapse, loading states) which should use simple CSS transitions (`transition duration-100 ease-linear` per Untitled UI defaults).

---

## Notes for CC

- Read VOICE_AND_PRODUCT_PRINCIPLES_v2.md before writing any user-facing copy
- Read UNTITLED_UI_REFERENCE.md for component patterns, color tokens, and icon usage
- The prototype uses Untitled UI components, Tailwind v4.1, React Aria foundations — use them
- Do not invent new color tokens or typography scales — use the existing system
- The frontend-design skill is available — use it for layout creativity within the Untitled UI system, not against it
- The aesthetic should be clean, confident, and minimal — not "bold" in the sense of the design skill's maximalist suggestions. RelayKit is a developer tool. Precision over flair.
- Every screen should feel like less than the current prototype, not more. We are subtracting.
- **No explaining our process in UI copy.** Do not write helper text, tooltips, or descriptions that teach the developer about compliance, TCR, carrier registration, or campaign mechanics. Questions ask. Previews show. If you're tempted to add an explanation, cut it.
- **Multi-tenant aware.** All state is scoped to `appId`, not `userId`. The URL structure uses `/app/[appId]/`. The current prototype already has `/apps/[appId]/` — maintain this pattern. Do not hardcode anything to assume one app per account. When multi-project ships (PRD_11), each app gets its own workspace with zero changes to the workspace itself — just a project list page and switcher added on top.
- **The spec file builds everything.** The AI tool receives all messages across all categories and builds handlers for all of them on day one. The developer's app grows into the message set over time. This means the messages page is not about "enabling" individual messages — they're all available. The page is for reviewing copy, editing, and testing.
