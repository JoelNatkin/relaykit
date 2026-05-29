Status: exploring (2026-05-29, revised) — Session 120 output. Captures the pre-registration-submission state model: what gets captured where, what's editable where, what flows forward, what's verified at each threshold, and how failure modes are handled. NOT canon. Promotes to MASTER_PLAN principle additions + a PRD-level spec covering home → onboarding → workspace → registration as a single continuity pipeline + updates to PROTOTYPE_SPEC across affected surfaces. Do not propagate into PRODUCT_SUMMARY or any implementation prompt until promotion.

**Companion to:** `/explorations/vertical-constraints.md` (the elig design that captures the first identity facts). This doc is the pipeline; that doc is the front door.

# Pre-submission state model — capture, editability, continuity, failure

The continuity-of-intent principle (MASTER_PLAN §Working principles, item 7) says state flows forward from the home page through registration submission, gaining scrutiny at each threshold, never re-collection. This document is the operational substance of that principle: which fields are captured where, which are editable where, what verification and cross-check happens at which threshold, and what happens when things go wrong inside the window between first home-page visit and the registration-submit click.

Pre-submission only. Everything after the user clicks "Start my registration — $49" is governed by Settings PRD §4.1 (post-registration lock) and §5 (rejection behavior) and is out of scope here.

---

## §1 — The three-pattern editability rule

Every pre-submission piece of state falls into one of three editability patterns. The pattern determines how editing works, where the affordance lives, and what guarantees hold.

**Locked at onboarding exit.** Identity facts that registration depends on and that downstream cross-checks would invalidate if changed. Business name, the EIN-verified legal identity bundle (legal name, address, entity type), vertical, sub-vertical, multi-tenant flag, website URL. These are editable freely on the home page and in onboarding. The moment the user completes onboarding and lands in the workspace, they are locked for the duration of that project. Changing any of them requires "Start a new project" — a destination that ports authored messages forward and resets identity from the home page. See §7 for the specific scenarios that justify this path.

**Addable but not changeable.** EIN value is its own category. A user can start on the no-EIN (TFN) path through onboarding and add an EIN later in the workspace via the existing "Add EIN" affordance on the registration card. Adding an EIN unlocks marketing eligibility. But once an EIN is bound to a project — whether at onboarding or via post-onboarding add — it can't be swapped for a different EIN. A different EIN means a different legal entity, which means a new project.

**Editable in workspace.** Authoring-layer content and a small set of operational fields. Variable values per category, custom messages authored, per-message hand-edits and tone pins, categories selected (additive only — turn on a new category to author its messages; cannot toggle off a category with authored content without explicit clear), notification phone (with re-verify flow), Preview list members. These edit freely in the workspace without consequence beyond their own surface.

**Re-verifiable.** Verified facts where the affordance is "unbind and try again," not "type a new value." Notification phone (re-verify via OTP flow, same component as onboarding). EIN itself is not re-verifiable pre-submission once bound — it's locked. Email is account-level and governed by Settings PRD §8.1 (magic-link verification of new email before old email is revoked).

The 80/20 read this rule encodes: most users get identity right at onboarding because the wizard is short, the stakes are made explicit at the opening informational step (§4), and the EIN verification step catches typos in the moment. Users who realize mid-build they picked wrong get an honest path (start a new project, keep your messages), not a bespoke edit-anywhere infrastructure that would cost us cross-check validity for every cohort to serve a small one.

---

## §2 — State capture inventory

The complete list of pre-submission state, where it's first captured, what it's used for downstream, and which editability pattern applies.

**Home configurator captures:**
- Categories selected (Pattern: editable) — used for messages corpus, registration use-case mapping, workspace shape.
- Multi-tenant flag, from elig section (Pattern: locked at onboarding exit) — used for bucket verdict, registration eligibility, downstream campaign type.
- Vertical and sub-vertical, from elig section (Pattern: locked at onboarding exit) — used for bucket verdict, per-category content rules, carrier vertical mapping, downstream cross-checks.
- Business name token (Pattern: locked at onboarding exit) — used for every message preview, registration submission business name, SDK env var.
- Variable values per category (Pattern: editable) — used for message previews and rendering.
- Custom messages authored (Pattern: editable) — additive to corpus.
- Per-message tone pins and hand-edits (Pattern: editable) — message-local overrides.

**Onboarding adds and verifies:**
- EIN status (Pattern: addable post-onboarding via Add EIN; not changeable once bound).
- EIN value, if EIN path (Pattern: addable but not changeable).
- Verified legal identity bundle: legal name, address, entity type (Pattern: locked at onboarding exit) — auto-populated from EIN verification, used for registration submission.
- Website URL (Pattern: locked at onboarding exit) — used for registration submission and cross-check signal.
- Verified phone (Pattern: re-verifiable in workspace) — used for test message delivery and notification destination.
- Vertical/sub-vertical sign-off (new surface; see §4) — plain-language confirmation of what the user picked on the home page, ramping scrutiny before workspace lock.

**Account creation adds:**
- Email + auth identity (Pattern: editable via Settings §8.1 magic-link verification, account-level) — used for login, all email notifications, Stripe customer record.

**Workspace adds and refines:**
- Notification phone (re-verifiable, lives in workspace per Settings PRD §6).
- Preview list members (editable, lives in workspace per workspace spec).
- All Pattern-editable authoring content from the home configurator persists and continues to be editable.

**Registration submission captures (authored by RelayKit, signed off by user):**
- Business description (free text, 500 chars) — authored by RelayKit from upstream signals (vertical, sub-vertical, business name, website), surfaced for sign-off at the registration finalize step. The user reviews and can request changes; we hold authoring authority because the description is the field carriers compare against everything else.
- First name, last name — registration contact info (may be pre-filled from auth identity if collected; otherwise entered fresh).
- Anything else carrier-required that the upstream pipeline didn't supply.

The Pattern-locked fields appear on the registration review screen as read-only. Edit affordances route back through the appropriate flow — into onboarding-mode with pre-filled state if the user is still in the editable window, or "Start a new project" if identity has locked. Pattern-editable fields don't appear on the registration review at all — they're message-layer concerns, not identity.

**Note on what's no longer captured.** The current onboarding "Service details" screen (Step 3 in the existing flow) collected a free-text service-type detail. This is dead. It was a holdover from when registration captured a separate service field, and its job is now done better by the elig section (vertical/sub-vertical structured pick) feeding into the business description that RelayKit authors at registration time. Removed entirely from the new flow.

---

## §3 — Continuity of intent — what flows forward, when scrutiny ramps

Three thresholds in the pipeline. State accumulates at each, but the *quality* of state changes — from casual capture to verified fact. Critically, cross-checks fire per-step inline as the user enters or confirms information, not as a final gate at threshold exit. Leaving onboarding should feel okay, not scary, if we've done the inline work well.

**Threshold 1: home page → onboarding entry.** Triggered by "Start building" (or whatever the eventual CTA name is). At this point the user has selected categories, picked vertical/sub-vertical via the elig section, typed a business name token, and possibly authored messages. None of this is verified yet. All of it flows forward as pre-filled state into the onboarding wizard. Cross-checks: none yet at this threshold — they fire in the next step as the user enters each verifiable fact. The bargain at this threshold is implicit: "we'll ask you to confirm and add detail next."

**Threshold 2: onboarding → workspace entry.** Triggered by the final onboarding step. By the time the user reaches this threshold, every piece of identity has been confirmed or verified in the step where it was captured — EIN verified inline at the EIN step, website checked inline at the website step, vertical confirmed inline at the sign-off step, phone OTP-verified inline at the phone step. Threshold 2 isn't a gate; it's just the natural end of the wizard. The bargain becomes explicit here: "These facts are locked from here on. Take a moment with them." Onboarding UI states this commitment plainly — not buried in fine print, not surfaced as fear-language.

Per-step inline cross-checks include:
- **EIN step:** EIN format validation; EIN verification against IRS records; legal name/address/entity type returned and surfaced for "This is my business" sign-off. Already implemented.
- **Website step:** lightweight domain check — does the domain resolve, does it reference the business name or vertical in visible content. Not yet designed. Surfaces inline ("We took a look at vaultedpress.store — does this look right?") and lets the user proceed regardless. The check is signal, not a gate.
- **Vertical sign-off step:** plain-language description of the home-page elig pick (see §4). User confirms or routes back to home to change.
- **Phone step:** OTP verify, already implemented.

Cross-step alignment checks (e.g., does typed business name fuzzy-match EIN-verified legal name) fire as soft warnings at the step where the second piece of information arrives, not at threshold exit. Substantive mismatches surface with a "Are you sure?" affordance; cosmetic differences (LLC vs L.L.C., capitalization, abbreviations) flow through silently.

**Threshold 3: workspace → registration submit.** Triggered by the user clicking "Start my registration — $49" on the final review screen. This is the sharpest threshold in the product. Past this point, the user is in the Settings PRD §4.1 / §5 regime — locked, with rejection paths governing what can change.

The 5-minute hold (§5) begins after this click; the user can withdraw within the window before submission fires.

---

## §3.5 — One-way flow: home cannot mutate workspace

Critical rule worth its own section. The continuity-of-intent flow is strictly **one-way**: home configurator → onboarding → workspace.

Once a user completes onboarding and authored content lands in the workspace, the home page configurator becomes a marketing surface only. It can preview the product experience for a returning unauthenticated visitor, but it cannot mutate workspace state. There is no path by which changes made on the home page propagate into an active workspace.

This rule matters because authenticated users may revisit the marketing site (intentionally or by mistake). The product must guarantee that nothing they do there can damage their build state. The home configurator either redirects authenticated users to their app, or shows a "preview only — your changes here won't affect your app" notice, or simply renders in marketing-preview mode with no save behavior. Implementation choice; the rule is that workspace state is sacred from the moment it's created.

---

## §4 — The opening informational step and the vertical sign-off

Two new onboarding surfaces emerge from the editability model. Both ramp scrutiny in a way the current wizard doesn't.

**Step 0: the opening informational step.** First screen of the wizard. Plain, honest framing of what the user is about to do and why it matters. Most users come in with no understanding of carrier registration, 10DLC, or why SMS needs more setup than email. This step is where we tell them, briefly and without jargon, what we're about to do together.

Rough shape:

> A few quick things to get you set up
>
> Sending texts isn't like sending emails. Carriers need to know who's sending messages and what kind of business they're for. We handle all the carrier stuff — but the info you give us in the next few minutes needs to be real, because they check.
>
> This takes about three minutes. Some things you tell us here we can't change later, so take a moment with each one.
>
> [Got it, let's go]

The voice is RelayKit's — quiet, factual, no jargon, no sales energy. The frame is "the system is what it is, we make it usable." This is also the place where the locked-after-onboarding rule gets stated up front, so when the user hits it later it isn't a surprise.

**Vertical/sub-vertical sign-off step.** The home-page elig section captures a structured pick via dropdowns. The pick is fast and lightweight by design — the elig section is the front door, not the contract. The sign-off is where the contract gets signed.

A dedicated onboarding step shows the user a plain-language description of what they picked:

> You're registering as a **beauty / wellness business** sending **appointment reminders**.
>
> Your messages confirm bookings, send reminders, handle reschedules, and follow up on missed appointments. They never include service details that could be sensitive — your customers see what time their appointment is, not what they're booked for.
>
> Does this describe your business?
>
> [Yes, this is right] [Something's off]

"Yes" advances. "Something's off" routes back to the home page elig section with current state preserved — the user can change their selection, and their authored messages survive per §6's preservation principle.

This pattern accomplishes several things at once: it surfaces what the structured pick actually *means* in plain language; it gives the user a moment to catch a wrong selection before identity locks; it makes the relationship between elig pick and downstream consequences visible without dragging compliance jargon into the surface.

**Wiggle room within a vertical (open).** The exploration-doc framing suggests we might allow a small range of closely-related sub-verticals within a top-level vertical to be interchangeable post-lock — e.g., "salon" and "spa" within beauty/wellness if their rule sets are identical. This requires sub-vertical adjacency data that doesn't exist in `/lib/constraints/` today and is probably a fast-follow rather than launch scope. Flagged in §8.

---

## §5 — The hard-edit boundary and the submission hold

Pre-submission everything is recoverable. Post-submission, the user has paid $49, the carrier has a record, and the identity facts are committed. The transition deserves more weight than a single click.

The registration submission is currently a three-screen sequence: **workspace registration card → finalize/edit form → review with pricing breakdown.**

**Workspace registration card.** "Start registration →" button on the workspace right rail. Initiates the registration flow when the user is ready.

**Finalize/edit form.** Pre-filled from upstream state. The user sees their business name, EIN status, verified EIN value (if applicable), business type, registered business address, contact info. Most fields are pre-filled with a "Pre-filled" indicator at the top right showing the user that this came from upstream. The user can edit, but each edit decreases the "Pre-filled" confidence indicator — substantive changes here are unusual and worth signaling.

The business description field is authored by RelayKit and surfaced here for review. The user can suggest changes (mechanics TBD — see §8), but RelayKit holds authoring authority because the description is the field carriers compare against everything else. Getting the language right matters for approval rates, and the user is rarely the best person to optimize that text. This protects them from typing themselves into a Scenario B rejection (Settings PRD §5).

**Review screen.** Shows "Your details" summary, "Pricing breakdown" ($49 due today, $19/mo after approval, refund policy), "What happens next" timeline, and a compliance acknowledgment checkbox. "Start my registration — $49" is the final commit button.

**The 5-minute submission hold.** After the user clicks "Start my registration — $49," the workspace transitions to a holding state for 5 minutes. The Sinch submission has not yet fired. The screen shows a clear acknowledgment ("Submitting your registration in 4:53") with a prominent "Cancel submission" button. The user can withdraw freely in this window — no fee charged, no state change to Pending, return to Building with everything intact. After 5 minutes elapse without cancellation, the submission goes to Sinch, the $49 is charged, the workspace transitions to Pending, and the post-submission regime takes over.

5 minutes is generous on purpose. The cost of the hold is trivial (a delay before our submission fires); the benefit is real (a user who realizes 90 seconds after clicking submit that they typed something wrong has a clean recovery path that doesn't involve customer support). There's no urgency on our end — registration approval takes a few days regardless of when our submission fires within this window.

---

## §6 — Preservation principle: authored content survives identity changes

Default behavior on every state change in the editable layer: **preserve the authored content.** Destructive operations are explicit, never automatic.

Concrete cases:

- User changes vertical/sub-vertical on the home page before onboarding. Default: preserve any authored messages. Re-flag each one against the new vertical's content rules. Surface rule violations as warnings, not deletions. Let the user decide what to do with flagged messages.
- User toggles off a category on the home page or in the workspace that has authored content. Default: preserve the authored content (it persists in state even if the category isn't currently selected). Re-toggling the category on restores access to the content. Explicit "Reset this category" via the existing kebab is the only path to deletion.
- User "starts a new project" from the workspace after onboarding identity-lock (see §7 for the specific scenarios this serves). Default: port all authored messages forward to the new project. Re-flag against the new project's vertical if it differs. The new project starts with identity in capture mode (home page), authored content already present.
- User clicks any of the existing reset affordances ("Reset all to defaults" kebab, per-category "Reset to defaults" kebab). These remain destructive by design — they exist for the user who wants a clean slate.

The principle: the system never silently discards work the user did. Either the work survives, or the user is told explicitly that something will be lost and asked to confirm.

---

## §7 — Failure mode coverage

Every meaningful failure mode in the pre-submission window, with the system's response. Not exhaustive; the table targets the cases we've identified as real and within our control.

**Home configurator state lost.** User closes tab, sessionStorage clears, returns days later. Current state: sessionStorage persistence handles this for the same browser. Cross-browser is lost. Acceptable for unauthenticated state. Authenticated state (post-signup) is server-persisted and survives.

**EIN verification source is flaky or down.** User enters valid EIN, our verification call fails. Current state (already implemented): failure surfaces honestly ("We couldn't verify this EIN. You can try again or continue without it.") with a path to continue. The user can complete onboarding without EIN-verified identity if our verification source is down, with the trade-off that they'll need to either retry later or accept the no-EIN path (no marketing initially; addable via the workspace Add EIN affordance later).

**User skips EIN expecting to add it later.** Already handled. The "Add EIN" affordance on the workspace registration card (visible in the no-EIN state) opens an inline EIN verify component, identical mechanics to onboarding. Adding EIN unlocks the "Add marketing messages too" option in the registration card. Copy at the EIN skip moment in onboarding should be honest about this path: "Marketing messages require an EIN. You can add one later in the workspace if you decide to send marketing."

**User verifies a phone number they no longer have access to.** Workspace re-verify flow exists per §1 and Settings PRD §6.

**User picks wrong vertical at onboarding, realizes during onboarding.** Solved by §4 sign-off step + the back-to-home affordance with authored content preserved.

**User picks wrong vertical at onboarding, realizes after workspace entry.** This is one of the specific scenarios that justifies "Start a new project" (see below). Vertical change cascades through every message's rule-flagging, and re-binding the existing project to a new vertical creates messy partial state. Clean restart with messages ported forward is the right answer.

**Custom messages don't fit the chosen vertical's rules.** Default: preserve the messages, surface the rule violations as warnings, let the user fix or override per the existing compliance hint pattern. The system doesn't decide what to discard.

**User's legitimate business genuinely changes (rename, relocate, new entity) — pre-registration.** This breaks into cases:

- **Rename only, same entity (same EIN, same address).** Most cases. The fix is a workspace-level edit of the business name token. Every message preview updates. No identity re-verification required. No code changes required (test API keys aren't business-bound). No new project.
- **Relocate only, same entity (same EIN, new address).** Workspace-level edit, with EIN re-verification touching the address field on the existing bundle. Test keys keep working.
- **Wait — but business name is "locked at onboarding exit" per §1.** Yes, with one carve-out: a legitimate rename of the same legal entity (verifiable via the same EIN) is editable via a workspace-side affordance that re-runs EIN verification to confirm the new name matches IRS records. This is an explicit narrow edit, not a re-open of the wizard. Conceptually: rename within a verified entity is "we trust the EIN, the name is a label." If the rename doesn't pass EIN re-verification, the user is in fresh-entity territory below.
- **New entity (new EIN), or sole-prop becomes EIN'd, or vice versa.** Genuinely different identity from the carrier's perspective. "Start a new project" — port messages forward, capture fresh identity, register the new entity. The old project can be closed or deleted.
- **Already registered (post-submission, post-approval).** Out of scope here. Settings PRD §4.1 governs — locked, no path to change identity on a live registration.

**User mid-build realizes RelayKit doesn't fit their use case.** Currently no graceful exit beyond the danger-zone delete in Settings. A "Close this project" affordance with an optional one-question "What didn't fit?" lets the user leave cleanly and gives us a high-signal departure reason. Recommended as a launch-readiness item; danger-zone delete remains as the fallback.

**SDK integration is failing, user can't diagnose whether it's their code, our SDK, or carrier weirdness.** Current state: Ask Claude in the workspace is intended as the load-bearing diagnostic tool here. Beyond that, the per-message activity log surfaces delivery state for testing. For genuinely stuck users, email support is the fallback. A one-person-shop product needs better than this eventually, but it's adequate at launch.

**User on TFN/no-EIN path wants to add Marketing.** Mechanically: user clicks "Add EIN" on the workspace registration card → enters EIN → verification succeeds → eligibility flips → workspace surfaces the Marketing category option in the registration card ("Add marketing messages too") → user enables and proceeds with registration. Pre-submission, this is a clean unlock path. Post-submission (already registered as TFN, now wanting to add marketing), this is a separate marketing campaign submission and belongs to Phase 5 / Settings concerns. The pre-submission case must work for launch; the post-submission case is fast-follow.

**Cross-check warnings surfaced inline are false positives.** User typed "Glow Studio LLC" and the EIN returned "Glow Studio, LLC" — punctuation mismatch flagged as substantive. Current state: cross-checks should fuzzy-match before flagging, and any flag the user can acknowledge with a single click ("Yes, this is right") should be acknowledgable. The cost of a false positive that requires a click is small; the cost of a false negative that lets a real mismatch through to carriers is large.

**Carrier rejects in Scenario A (RelayKit's fault).** Out of scope — post-submission. Governed by Settings PRD §5.

**Carrier rejects in Scenario B (developer fault).** Out of scope — post-submission. Governed by Settings PRD §5.

---

## §8 — Open questions and TBDs

- **Wiggle room within a vertical (§4 close).** Should sub-vertical changes within a top-level vertical with identical rule sets be allowed post-onboarding-lock as soft edits? Requires `/lib/constraints/` to carry adjacency data. Fast-follow candidate, not launch.

- **Business name rename via EIN re-verification.** §7 names this as a workspace-side narrow edit, but the affordance doesn't exist yet. UX shape TBD — probably a button on Settings or the workspace that opens an EIN re-verify modal scoped to the rename use case. Worth designing as part of the workspace redesign session.

- **The "Close this project" affordance.** Recommended in §7. Needs UX shape — modal vs. Settings danger-zone enhancement vs. workspace-level affordance. Probably belongs in Settings as a less-scary alternative to "Delete," with an optional reason capture.

- **Business description authoring authority and user-suggested changes.** §5 says RelayKit authors, user signs off, user can request changes. The mechanics of the dance need spec'ing — does the user edit inline and we re-approve? Do they leave a comment? Is there a back-and-forth, or is our authored version effectively final? Worth thinking through at registration-form-rework time.

- **Cross-check thresholds for substantive vs. cosmetic mismatch.** §3 names this but doesn't spec it. Fuzzy-match rules, character-distance thresholds, whitelist of common variations (LLC/L.L.C., Inc/Incorporated, etc.). Implementation detail to settle when threshold-2 cross-checks get built.

- **Website cross-check design.** §3 names the lightweight domain-resolution-and-content-reference check. Not yet designed. UX shape (where it surfaces, what it looks like when the check is in flight, what the failure mode looks like) is fast-follow work.

- **Prototype-side bridge for end-to-end design diligence.** The live elig section on relaykit.ai is a separate world from the app prototype on localhost:3002. During the design phase, we need a way to bring realistic home-configurator state into the app prototype so we can walk realistic end-to-end scenarios while designing. This isn't a launch concern — at launch, the live wiring handles it. It's a build-quality concern for the design phase. Probably looks like: a fixtures or "scenarios" mechanism in the prototype that pre-loads realistic post-home-configurator state for the wizard to consume. Worth a small build session to set up before the workspace redesign starts in earnest.

---

## §9 — Relationship to existing canon

- **MASTER_PLAN principle #7 (continuity of intent).** This doc operationalizes that principle. On promotion, MASTER_PLAN §Working principles may want a pointer to the canonical version of this spec.

- **`/explorations/vertical-constraints.md` §9 (elig design).** That doc captures the first identity facts. This doc captures what happens to those facts downstream. The two should promote together.

- **Settings PRD §4.1 (post-registration lock).** This doc ends where that doc begins. The handoff is the registration submit click + 5-minute hold expiry.

- **Settings PRD §5 (rejection behavior).** Same handoff — post-submission concerns.

- **PRODUCT_SUMMARY §4 (onboarding wizard).** Will need substantial updates when this doc promotes. The current wizard description is stale relative to the model defined here (Step 1 vertical picker dead, Step 3 service details dead, new Step 0 informational, new vertical sign-off step, Steps 7/8/11 dead, etc.).

- **PROTOTYPE_SPEC.** Multiple sections affected — onboarding screens, workspace shape, registration submission three-step flow, settings interactions. Promotion of this doc is a substantial PROTOTYPE_SPEC update, not a small one.

- **`prototype/lib/intake/industry-gating.ts`.** Its role under this model is defense-in-depth at registration submit time — it runs the regex check on the business description (which RelayKit authored, but still — last sanity check) as part of the threshold-3 cross-checks. The rework is a downstream session after the elig section is built and the workspace redesign is shaped. Step 6 of `/explorations/vertical-constraints.md` §6.

---

## §10 — Promotion criteria

This exploration is `promoted` when:

- The home page elig section is built (`/explorations/vertical-constraints.md` step 7), and
- The onboarding wizard rework is built (incorporating the §4 Step 0 + sign-off step and the §1 editability rule), and
- The workspace redesign is built (absorbing the configurator and surfacing the Pattern-editable affordances), and
- The registration form rework is built (incorporating the §5 three-step flow and 5-minute hold), and
- The "Start a new project" affordance exists with message porting per §6, and
- The narrow business-name-rename via EIN re-verification affordance exists.

At that point, the canonical homes for this material are: MASTER_PLAN (principle), Settings PRD (post-submission boundary), PRODUCT_SUMMARY (customer-experience description), PROTOTYPE_SPEC (UI), and a future BUSINESS_LOGIC spec or equivalent (the state machine and cross-check rules). This exploration's job ends.

---

*End of pre-submission-state-and-editability.md*
