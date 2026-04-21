RelayKit Workspace Design Spec
From wizard to workspace — the new developer experience
Updated: April 7, 2026 (Session 25)

What This Document Is
This is the design spec for reshaping the RelayKit prototype from a dashboard-first experience into a wizard-to-workspace flow. CC should read this alongside DECISIONS.md, PROTOTYPE_SPEC.md, and VOICE_AND_PRODUCT_PRINCIPLES_v2.md before building.
This is a phased rebuild. Not everything ships in one session. Each phase is independently useful.

Design Principles

One flow, one direction, one destination. The developer arrives, sets up, and lands on their messages. No tabs to choose between. No "where do I start?" moment.
Messages are the product. Every screen exists to get the developer to their messages or to help them use their messages.
The page grows with the developer. First visit is minimal. Features appear as the developer's progress makes them relevant. No empty states for things they haven't done yet.
We don't presume to know their app. RelayKit knows messages and compliance. The developer's AI tool knows their codebase. We stay in our lane.
Setup becomes Settings. The data collected during onboarding is the same data that lives in Settings. The context changes, not the data.
Never explain our process. Intake questions ask. Message previews show. The summary confirms. No teaching the developer about compliance, registration pipelines, or carrier mechanics during onboarding. The product thesis is that they don't have to think about this stuff — the UI must prove that thesis, not undermine it.
Everything is scoped to the app, not the account. Business identity, EIN, categories, messages, API keys, demo list — all per-app. A developer account can have multiple apps (PRD_11), each with its own workspace. Design nothing that assumes one app per account.


Prototype Architecture

Registration States
Six states, shown in the prototype state switcher in this order:

Onboarding → Building → Pending → Extended Review → Registered → Rejected

Onboarding: The wizard flow. No dashboard, no tabs. Developer is answering intake questions and hasn't signed up yet. Previously called "Default."
Building: Post-signup, pre-registration. Single-page workspace centered on Messages. Developer has an account, sandbox API key, and is building/testing. This is where everyone starts after signup.
Pending: Registration submitted, under carrier review. Same Messages workspace with registration status indicator.
Extended Review: Carrier requested changes, resubmission under review. Same workspace with extended status.
Registered: Live and sending. Messages workspace with delivery metrics at top. Previously called "Approved."
Rejected: Registration not approved. Messages workspace with rejection details and retry path.

Three Layout Systems (plus standalone)
The wizard flow spans multiple route trees with different layout systems that produce visually consistent results:
/start/* pages use WizardStepShell (per-page component) inside prototype/app/start/layout.tsx:

Top nav: RelayKit wordmark only (no Sign in, no Sign out, no Your Apps)
Vertical pill appears next to wordmark on all /start/* pages after the picker (read from sessionStorage)
Back/Continue provided by WizardStepShell — each page passes backHref, continueHref, canContinue, onBeforeContinue
Content: centered in max-w-[540px] container

/apps/[appId]/* wizard pages (messages, ready) use WizardLayout (shared wrapper via AppLayout state check):

Top nav: RelayKit wordmark → Appointments pill → state switcher dropdown → onboarding dropdown. No Sign out.
Below nav: ← Back and Continue on the same row, aligned with nav edges
Content: centered in max-w-[540px] container
WizardContinueContext lets pages override header Continue with custom {onClick, disabled}
getPageConfig(pathname, appId) drives Back/Continue targets per page

/apps/[appId]/signup and /signup/verify are inside WizardLayout but with no header chrome:

backHref: null, continueHref: null → header Back/Continue row hidden entirely
Pages render their own inline ← Back links inside the content column
Content: centered in max-w-[400px] container

/apps/[appId]/get-started is standalone:

AppLayout renders <>{children}</> — no WizardLayout, no DashboardLayout
Page manages its own nav (wordmark + pill + onboarding dropdown)
Content: centered in max-w-[500px] container
State transition boundary: exits flip registrationState to "building"

Route behavior by state:
Onboarding (wizard):

/apps/[appId]/messages → wizard messages page (new copy, no send icons)
/apps/[appId]/ready → benefit-led pre-signup page
/apps/[appId]/signup → email entry (400px, inline Back, full-width Send code)
/apps/[appId]/signup/verify → OTP verification (400px, inline Back, 6-digit input, 60s resend cooldown)
/apps/[appId]/get-started → setup steps + state transition boundary (500px, standalone layout)
/apps/[appId]/opt-in → redirects to /messages (removed from flow, page returns null)
/apps/[appId]/overview → redirects to /start (Onboarding state should not render dashboard)

Building:

/apps/[appId]/messages → The workspace. Single page with setup cards (dismissible) at top, message rows, registration CTA (lightweight banner or card), Settings via icon/link to child page. No tabs.
/apps/[appId]/settings → Settings child page (Account info, API keys, Billing). Navigated to via icon/link from messages page, not a tab.
/apps/[appId]/overview → redirects to /messages
/apps/[appId]/ready → redirects to /messages
/apps/[appId]/signup → redirects to /messages

Pending / Extended Review / Rejected:

/apps/[appId]/messages → The workspace. Setup cards (if still needed), message rows, compact registration status indicator. Same page, evolved state.
/apps/[appId]/settings → Settings child page
/apps/[appId]/overview → redirects to /messages

Registered:

/apps/[appId]/messages → The workspace. Delivery metrics at top (replacing setup cards), message rows with real delivery data, marketing campaign CTA if eligible.
/apps/[appId]/settings → Settings child page
/apps/[appId]/overview → redirects to /messages

ProtoNavHelper: Floating bottom-left "Nav ↑" pill for non-linear design review. Expands to jump links for every page in every state. Prototype-only, strip on port.
TopNav has four distinct modes (pathname regex + conditionals):

/start and /start/* → wordmark-only, with vertical pill on /start/*, onboarding dropdown (right side)
/apps/*/messages|ready|signup|signup/verify|get-started + registrationState === "onboarding" → wordmark + Appointments pill + state switcher + onboarding dropdown. No Sign out.
/apps/* + non-onboarding state → full dashboard nav (wordmark + Your Apps + Sign out)
Marketing pages → full marketing nav (wordmark + Use Cases + Compliance + Sign in)

Onboarding dropdown: Native <select>, text-xs text-text-quaternary. 11 numbered options covering the full wizard flow. Only visible when registrationState === "onboarding". Prototype-only control for jumping between screens.

The Flow
Step 1: Vertical Picker ✅ BUILT
Route: /start
Heading: "What's the main reason your app sends texts?"
Eight cards in 2-column grid (single column mobile):

Appointments — Confirmations, reminders, reschedules, cancellations, no-show follow-ups
Verification codes — Login OTPs, signup codes, password resets, MFA, new device alerts
Order updates — Shipping confirmations, delivery alerts, return status, refund notices
Customer support — Ticket updates, resolution notices, satisfaction follow-ups
Marketing — Promos, re-engagement, product launches, seasonal campaigns
Team alerts — Shift reminders, system alerts, escalation pings, on-call notifications
Community — Event reminders, group updates, membership alerts, RSVP confirmations
Waitlist — Spot available, queue position, reservation holds, invite codes

Cards are click targets — no CTA text, no "Explore →". Clicking saves vertical to sessionStorage and navigates to /start/business.
Nothing else on the screen. RelayKit wordmark only. No nav items, no sign-in link, no marketing copy. Pure focus.
Step 2: Business Name + EIN ✅ BUILT
Route: /start/business
Heading: "What's your business called?"
Body: "You can change any of this later."
Business name input: Full width, placeholder "Your business name", autofocus. Continue disabled until filled.
EIN section (expandable, optional for transactional primary):

Collapsed state: "I have a business tax ID (EIN)" as brand purple text link with ⓘ tooltip ("A 9-digit tax ID for your business. Entering one unlocks marketing messages and additional use cases.")
Expanded state: link changes to "Cancel" (text-text-tertiary, right-aligned on same line as label) which collapses and clears. EIN input (XX-XXXXXXX format, auto-dash), "Verify" button inline right.
Verification: Two-phase spinner — "Verifying..." (1s) → "Checking sources..." (1.5s). Simulates primary lookup + AI fallback.
Verified state: Business identity card (name, address, entity type · state) with ✕ dismiss in top-right. Checkbox inside card: "This is my business" with ⓘ tooltip ("Misrepresenting business identity will result in account termination."). Continue disabled until checkbox checked. Inline note below card: "This also qualifies you for marketing messages — you can add those after you're set up." (informational only, no CTA)
Failed state: "We couldn't verify this EIN. You can try again or continue without it." Continue stays enabled. EIN data not saved.
Format error: "EIN should be 9 digits (XX-XXXXXXX)" — inline, on blur.
Marketing-primary: EIN section expanded by default, no collapse option. Required — Continue disabled without verified EIN. Failed state: "We couldn't verify this EIN. Marketing messages require a verified business identity. You can switch to a different use case to get started, or try a different EIN."

Prototype state cycler (Default/Verified/Failed) for design review — strip on port.
Back → /start. Continue → /start/details.

Returning user (new project from Your Apps): Business name pre-filled from account, editable. EIN auto-populated if on file with confirmation card (no re-verification needed). Phone verify (Step 6) and signup/email verify (Steps 9/9.5) skipped entirely. Design for this page needs prototyping — backlog item.

Step 3: Service Context ✅ BUILT
Route: /start/details
Heading: "Tell us about your business"
Body: "This helps us write messages that sound like they're from you."
Two inputs, sequential (second appears after first is answered):
Input 1 — Dropdown (native select, custom chevron via appearance: none + SVG background):
Label: "What kind of business?"
Options: Salon & beauty, Dental, Medical, Fitness & wellness, Tutoring & education, Consulting, Auto service, Home services, Pet care, Photography, Other
Input 2 — Text input (fades in after dropdown selection):
Label: "What do people book with you?"
Contextual placeholder based on dropdown (e.g., Salon → "e.g., nail appointments, haircuts"; Dental → "e.g., dental cleanings, checkups"; Other → "e.g., appointments, sessions")
Both required. Continue disabled until both filled.
Back → /start/business. Continue → /start/website.
Step 4: Website ✅ BUILT
Route: /start/website
Heading: "Do you have a website?"
Body: "We'll link to it in your messages so customers can find you online."
URL input: Placeholder "glowstudio.com". Optional.
Skip link below Continue button (text-text-tertiary, centered, mt-3) — advances without entering a URL.
Continue always enabled.
Note: If no website provided, messages that reference {website_url} omit that line entirely. The compliance site URL (msgverified.com) is never shown to end customers — it's infrastructure for carrier review only.
Back → /start/details. Continue → /start/context.
Step 5: Context ✅ BUILT
Route: /start/context
Heading: "Anything else we should know?"
Body: "This helps us tailor your messages. You can always adjust later."
Textarea: 4 rows, no placeholder, optional. Label: "Notes for us"
Skip link below Continue button (text-text-tertiary, centered, mt-3).
Continue always enabled.
Feeds into AI summary (future Step 3 if built) and AI help context on messages page. Does not directly modify templates.
Back → /start/website. Continue → /start/verify.
Step 6: Phone Verification ✅ BUILT
Route: /start/verify
Heading: "Verify your phone number"
Body: "Your phone is your test device for messages."
Phone input state: +1 prefix (non-editable), placeholder "(555) 123-4567". "Send code" button (compact purple, inline right). 1.5s stub delay → OTP state.
OTP state: "We sent a code to +1 (555) 123-4567. Use a different number" (inline text link). 6 digit boxes stretched to match Continue button width (keep gaps, widen boxes). Any 6 digits work in prototype.
60-second resend cooldown: "Resend code in XXs" (disabled gray) counting down, swaps to clickable "Resend code" at 0. Centered below Continue. Client-side only.
Continue disabled until verified.
Back → /start/context. Continue → /apps/glowstudio/messages (hardcoded for prototype).
Step 7: Messages ✅ BUILT (updated Session 25)
Route: /apps/[appId]/messages (Onboarding state)
This is the most important screen in the product.
The developer lands here and sees their complete message set for the vertical. All messages, pre-populated with their business context from intake.
Heading: "Here's what your app will send"
Body: "Each message is tailored to your business. Adjust any message anytime. Your app always sends the latest version."
Marketing messages link: "What about marketing messages?" — purple text, no underline, below body text. On click shows black tooltip (white text, rounded corners). Content is EIN-aware based on sessionStorage:
- EIN provided: "You're all set to add marketing messages after you create your account. We'll walk you through it."
- No EIN: "Marketing messages require a business tax ID (EIN). You can add one anytime in settings to unlock them."
Wizard header: RelayKit + Appointments pill (top nav), ← Back + "Continue" (below nav). "Continue" appears at top-right AND bottom of the page — dual CTA. Bottom Continue is full-width purple in the content column. No send icons next to message cards in Onboarding state.
Message cards, edit state, style pills, AI help, compliance checks: See PROTOTYPE_SPEC.md for full card anatomy.
Back → /start/verify. Continue → /apps/[appId]/ready.
Step 7.5: Opt-in Form Preview — REMOVED FROM FLOW
Route: /apps/[appId]/opt-in — page returns null, all traffic redirects to /messages.
Joel flagged this page as unsatisfying. Removed from wizard flow. File retained with original implementation in a reference comment. D-317 specifies opt-in form should be viewable post-onboarding on demand from messages page (modal or slideout). Design TBD.
Step 8: Ready ✅ BUILT (updated Session 25)
Route: /apps/[appId]/ready
Heading: "SMS that just works"
Body: "Create your account and we'll generate everything your tool needs to build."
Five benefit lines with green CheckCircle icons. Bold lead sentence + tertiary detail. Generous spacing (space-y-7):
✓ One prompt gets you started. Paste it into your AI tool and it builds your SMS feature — tailored to your app, your customers, your messages.
✓ Test with real people, real phones. Send messages to up to 5 people — your team, your co-founder, a client you're trying to impress.
✓ An expert in your corner. Not a chatbot — a full AI assistant that knows your business, your messages, and how SMS works. It helps you troubleshoot and get your app just right.
✓ Change a message here, your app updates automatically. No code changes, no prompts. Your app picks up the new version on the next send.
✓ You never think about compliance. Opt-in forms, opt-out handling, message formatting — things that sink SMS features at other companies. We handle all of it.
Pricing:
"Free while you build and test." — text-lg font-semibold
"When you're ready for real delivery: $49 registration + $19/mo." — dollar amounts semibold (D-320)
"500 messages included. Additional messages $8 per 500." — text-sm, dollar amounts semibold (D-321)
CTA: Full-width purple "Create account" → /apps/[appId]/signup
No Continue button in WizardLayout header — the CTA button is the only forward action. Back → /apps/[appId]/messages.
Step 9: Signup — Email Entry ✅ BUILT
Route: /apps/[appId]/signup
Heading: "Create your account"
Body: "We'll send you a code to verify your email and sign in."
Layout: 400px max-width column. Inline ← Back to /ready (no WizardLayout header Back/Continue — header row hidden). No Sign out in nav.
Email input: Full width, placeholder "you@company.com", autofocus. Full-width purple "Send code" button below input. 1.5s stub delay → navigates to /signup/verify. Email stored in sessionStorage (relaykit_signup_email).
Step 9.5: Signup — Email Verify ✅ BUILT (updated Session 25)
Route: /apps/[appId]/signup/verify
Heading: "Check your email"
Body: "We sent a code to {email}" — reads email from sessionStorage.
Layout: 400px max-width column. Inline ← Back to /signup. No Sign out in nav.
OTP input: 6 digit boxes stretched to match Confirm button width (keep gaps, widen boxes). Auto-advance, paste support, backspace navigation. Any 6 digits work in prototype.
Actions: Full-width purple "Confirm" button (always enabled). 60-second resend cooldown below: "Resend code in XXs" (disabled gray) counting down, swaps to clickable "Resend code" at 0.
On success: Navigates to /apps/[appId]/get-started. Does NOT change registrationState — state transition happens on get-started page exits only (D-322).
Step 10: Get Started ✅ BUILT — kept as transition screen
Route: /apps/[appId]/get-started
The get-started page serves as a focused transition moment between onboarding and the dashboard. The same content also appears on the Overview page in Building state, so this page is a "breath" screen, not the primary home for setup steps.
Heading: "Start building"
Body: "Everything your AI tool needs to build your SMS feature."
Layout: 500px max-width column. Standalone (no WizardLayout, no DashboardLayout). Top nav: wordmark + Appointments pill + onboarding dropdown only.
Tool logo farm: 6 left-aligned logos (40px circles) — Claude Code, Cursor, Windsurf, GitHub Copilot, Cline, Other. Same SVG assets as home page hero. No top padding above logos, 20px space below.
Three numbered cards with copy buttons (top-right, clipboard → check swap on copy):

Install RelayKit — helper: "Run this in your project's terminal." Content: npm install relaykit
Add your API key — helper: "Paste this prompt into your AI tool to add the key." Content: Add this API key to my .env file: RELAYKIT_API_KEY=rk_test_7Kx9mP2vL4qR8nJ5
Add SMS to your app — helper: "Paste this prompt into your AI tool to start building." Content: I installed the RelayKit SDK. Add SMS to my app. I run a hair styling business called Club Woman. The SDK has my message templates — use them all.

Card titles are numbered ("1. Install RelayKit"). Helper text is text-xs text-text-quaternary. Content blocks are bg-bg-secondary rounded-lg. All content is hardcoded for prototype — production generates from wizard sessionStorage data + server-created project.
CTA: Full-width purple "View on dashboard" → setRegistrationState("building") + navigate to /messages.
Footer: "We also sent this to your email." + "Need help? Talk to our AI assistant →" (also transitions state on click).
State transition boundary (D-322): Everything before this page is Onboarding state. Both exit actions set registrationState to "building" before navigating.

The Workspace (Post-Signup)

After signup, the developer lands on one page: Messages. This is the workspace. It evolves with their lifecycle but never splits into tabs. There is no Overview page, no tab bar. Settings is a child page accessed via an icon or link in the top bar.

Note: The current prototype still has the tabbed Overview/Messages/Settings structure from Session 25. The next major CC session will replace it with the single-page layout described here. The Overview page content (setup cards, registration card, metrics) migrates onto the Messages page. The Overview route redirects to Messages.

Navigation
Top bar: RelayKit logo | App name + vertical badge | Settings (icon/link) | Sign out
No tabs. The messages page IS the app. Settings is a separate child page navigated to and from — not a tab.

Messages Page — The Single Workspace
The messages page is the center of gravity across all post-signup states. Content appears and evolves at the top and bottom of the page as the developer progresses. The message rows are always the core.

Page structure (top to bottom, Building state):

Setup section (dismissible): Logo farm + three copyable setup cards (Install RelayKit, Add your API key, Add SMS to your app). Same content as get-started page. Dismissible — once the developer has copied what they need, they can collapse or hide this section. It doesn't come back after dismissal.
Registration CTA: Lightweight banner or small card — "Ready to go live? $49 registration + $19/mo." with a CTA. Not a full timeline column. Compact, present but not dominant.
Message rows: Each message is a self-contained workspace row:
  - Collapsed: Message name (bold) + preview text (truncated, gray) + last sent timestamp ("Sent 2m ago" or "Not tested") + "Send test" button (small, outlined) + "Ask Claude" icon button + kebab menu (edit, delete)
  - Expanded (edit): Editable textarea + style pills (Standard/Friendly/Brief) + AI rewrite input + compliance feedback with Restore + Save/Cancel
  - "Ask Claude" opens the Claude support slideout pre-loaded with this message's context
  - "Send test" sends to default verified number, with dropdown to pick from demo list if multiple numbers added
Add message CTA: "+ Add message" at bottom of message list. Expands inline editor (same as edit state but with message name input). Custom messages get identical row treatment — no visual distinction from generated messages.

Page structure evolution by state:

Building: Setup cards (top, dismissible) → registration CTA → message rows → add message
Pending: Setup cards (if not dismissed) → compact registration status ("Submitted — typically approved in a few days") → message rows → add message
Extended Review: Same as Pending with "Changes requested" status
Registered: Three metrics cards (Delivery, Recipients, Usage & Billing) at top → message rows with real delivery data (last sent becomes real timestamps, delivery status per message) → add message. Marketing campaign CTA if eligible.
Rejected: Rejection status with retry CTA → message rows → add message

Message row lifecycle:
Before any SDK activity: All rows show "Not tested" status.
After first API call detected: Rows that received sends show "Sent [timestamp]" + delivery status. Rows without sends still show "Not tested" — this IS the integration checklist. The developer can see at a glance which messages their app is sending and which still need wiring.
After registration: "Not tested" becomes "No sends" and timestamps reflect real delivery data. Delivery status per message type becomes meaningful (delivered, failed, pending).

Demo list / recipient management:
Lives near the testing UI, not in Settings. When the developer first taps "Send test" on any message, if they haven't set a default test number, prompt them to verify one (or use the phone from onboarding as default). "Add a test phone" option in a section below messages or in a popover from the Send test button. Up to 5 verified numbers. Per-message send test uses default number with dropdown for alternatives.

Claude Support Slideout:
Persistent button on the messages page (and Settings). Opens a wide panel (500-600px) that pushes page content left. Pre-loaded with developer's business context, vertical, configured messages, and current lifecycle state. Per-message "Ask Claude" entry pre-loads that specific message's context, last test result, and delivery status. Not a chatbot widget — a full conversation panel. App Doctor capability: Claude can generate diagnostic prompts for the developer's AI tool, interpret pasted results, and generate fix prompts.

Message Edit Lifecycle
The website authors, the SDK delivers (D-279).
Message copy edits are zero-code. Edit on the website → next send from the app uses the new copy automatically. Confirm after every save: "Saved. Your app will use this version on the next send."
New messages don't require return trips. The spec file tells the AI tool to build handlers for ALL messages from day one.
We don't generate new prompts for the tool on return visits. After changes, we show what changed and the function signatures. The developer tells their tool what to do.
SMS_GUIDELINES.md updates via API. When messages change or categories are added, the guidelines file updates automatically.

Marketing Messages Architecture
Marketing messages require a separate campaign registration. The developer's path:

During onboarding: No marketing messaging surfaces except the "What about marketing messages?" tooltip on the messages page (Step 7). EIN-aware content tells them the path forward without pushing a decision.
EIN verified on business name page: One-line forward reference after verification: "This also qualifies you for marketing messages — you can add those after you're set up." Informational only, no CTA.
Post-signup workspace: Marketing invitation appears on the messages page (only if EIN on file): "Want to send marketing messages? Add a second campaign for $49." If no EIN: "Marketing messages require a business tax ID (EIN). Add your EIN to unlock marketing." with link to Settings.
Marketing-first flow: EIN required upfront (non-collapsible on business name page). Transactional vertical added automatically.
One transactional + one marketing per project. No multiple transactional verticals (multi-project support via PRD_11 handles that use case).
Pricing reflects only what the developer is signing up for. No marketing pricing shown unless they're adding marketing.

Settings
Settings is a child page, not a tab. Accessed from an icon or link in the top bar. Navigating to Settings leaves the messages page; navigating back returns to it.
In Building (pre-registration)
Settings is the intake data in editable form.
Sections:

Your business: Business name, service type, website, EIN (add or edit)
Categories: Active categories. EIN on file → "Add another category." No EIN → "Add your EIN to unlock additional categories."
API key: Sandbox key, copyable. "Your AI tool reads this from your .env file."
Your phone: Primary verified number. "Change" to re-verify.

After Registration
Settings grows:

Registration: Status, timeline, campaign ID, compliance site link, SMS number
Billing: Plan, usage, next billing date, manage billing link (Stripe portal)
API keys: Sandbox key + live key (shown once at generation, masked after)
Danger zone: Cancel plan, delete account


Shared Wizard Infrastructure
prototype/app/start/layout.tsx — min-h viewport wrapper for all /start/* pages.
prototype/components/wizard-step-shell.tsx — reusable shell. Pages pass backHref, continueHref, canContinue, onBeforeContinue. Renders Back link + children + full-width Continue button.
prototype/lib/wizard-storage.ts — sessionStorage under relaykit_wizard key. WizardData fields: vertical, businessName, industry, serviceType, website, context, verifiedPhone, ein, businessIdentity. Exposes VERTICAL_LABELS for the nav pill.
wizardFadeIn keyframe in globals.css — shared by /start/business (EIN expand) and /start/details (service type reveal).
WizardContinueContext — lets /apps/[appId]/* pages register {onClick, disabled} to override WizardLayout's header Continue button. Register inside a useEffect and return () => setOverride(null) on unmount.

Key Decisions Referenced

D-279: Website authors, SDK delivers
D-293: Compliance at authoring time, not send time
D-294: Marketing auto-submits or activates on-demand
D-295: No expansion modal
D-296: SDK and API are equal paths
D-300: Intake interview with Claude on backend
D-301: Locked variable schemas per message type
D-302: EIN required for any second campaign (amended — any second campaign, not just marketing)
D-303: Business identity pre-validation from EIN lookup
D-304: Symmetrical pricing — first campaign $19, second $29
D-305: Marketing-only is valid standalone
D-310: EIN and business identity are per-app, not per-account
D-311: Multiple categories submit simultaneously at registration — no sequencing
D-312: TCR allows up to 5 campaigns per brand; v1 supports max 2
D-313: Pre-auth message send requires special endpoint or session token
D-314: Single $99 go-live fee — superseded by D-320
D-315: Price revealed at signup step
D-316: Signup is a wizard step, not a separate decision moment
D-317: Opt-in form removed from wizard flow. Post-onboarding viewable on demand (modal or slideout). Design TBD.
D-318: Messages wizard step has Continue at top and bottom
D-319: Compliance restore replaces full message with clean variant, not a partial patch
D-320: Registration fee $49 flat. No split, no go-live fee. $19/mo unchanged. Supersedes D-314 and D-193/D-216.
D-321: Overage pricing: $8 per 500 additional messages beyond 500 included in base.
D-322: Get-started page is the state transition boundary. registrationState flips to Building only on exit.
D-323: Signup split into email entry + OTP verification (two pages).
D-324: State rename — Default → Onboarding, Approved → Registered.
D-325: New "Building" state between Onboarding and Pending.
D-326: Building state Overview layout (Start building left column + registration card right column).
D-327: Remove "Build your SMS feature" accordion from Overview.
D-328: Messages page onboarding/dashboard divergence.
D-329: Ready page copy — "SMS that just works."
D-330 (pending): SDK stays static for launch — all namespaces exposed. Dynamic discovery is backlog.
D-331 (pending): Generated prompt replaces SMS_GUIDELINES.md for get-started moment.
D-332 (pending): Single-page workspace — no tabs, Messages is sole workspace page, Settings is child page.
D-333 (pending): One transactional + one marketing per project max. No multiple transactional verticals.


What This Replaces in the Current Prototype
Removed (done):

Compliance alerts system (D-293)
Marketing expansion modal (D-294, D-295)
Global style pill bar, Personalize slideout, Show template, Copy all
PlaybookSummary flow diagram, AI tool setup dropdown, ToolPanel
Download/Re-download CTAs
Card numbers, per-card copy/template toggle, "Modify with AI" accordion
Opt-in form right column on messages page (D-317)
"Current" pill + Accept/Revert preview flow
Opt-in wizard step (removed from flow, page returns null)
Old 4-step "Build your SMS feature" onboarding wizard (replaced by get-started content on Overview)
Monolithic signup page (replaced by email + OTP split — D-323)
Product updates checkbox on signup (removed, may return later)
Phone preview icons on onboarding messages page (removed — send test features live on dashboard version only)
"Default" and "Approved" state names (renamed to Onboarding and Registered)
Overview/Messages/Settings tab bar (replaced by single-page Messages workspace + Settings as child page)

Preserved:

Registration status timeline stepper — compact version used in Pending/Extended Review/Rejected status indicators on Messages page
Registered-state metrics cards (Delivery, Recipients, Usage & Billing) — appear at top of Messages page in Registered state
Settings page structure for post-registration — grows from Building Settings as a child page


Build Phases
Phase 1: Workspace Reshape ✅ DONE
Messages-first workspace. Overview tab removed in sandbox. Tab bar hidden in Onboarding state.
Phase 2: Message Card Redesign ✅ DONE
New default/edit card states. Style pills (Standard/Friendly/Brief/Custom). AI help input with sparkle icon. Compliance checks with Restore. Single-card editing.
Phase 2.5: Error States Design Session (PM + Joel, no CC)
Walk through every interaction that can fail before locking in copy. Key interactions: EIN verification, phone OTP, AI rewrite, compliance, network errors, signup OTP.
Phase 3: Wizard Flow ✅ DONE
Full wizard entry flow: vertical picker → business name + EIN → service context → website → context → phone verify → messages → ready → signup (email) → email verify (OTP) → get-started. Layout architecture, shared infrastructure, sessionStorage persistence, all verification states. Signup split into two focused pages (D-323). Get-started page built with three copyable setup steps.
Phase 3.5: State Rename + Building State + Overview Redesign ✅ DONE (Session 25)
Renamed Default → Onboarding, Approved → Registered. Added Building state between Onboarding and Pending. Overview in Building state shows "Start building" content (left column) + "Ready to go live?" registration card (right column). Removed stale "Build your SMS feature" accordion from Pending/Extended Review/Rejected states. Fixed Onboarding state to not render dashboard.
Phase 3.6: Messages Page Cleanup ✅ DONE (Session 25)
Updated messages page copy (Onboarding state): "Here's what your app will send" heading, new body text, Continue CTAs replacing "Start building", removed send icons from onboarding version, added EIN-aware "What about marketing messages?" tooltip. Updated ready page copy: "SMS that just works" heading. Fixed Back button alignment, Skip button placement, phone verify visual consistency.
Phase 3.7: Single-Page Workspace Build (NEXT)
Replace the tabbed dashboard with the single Messages-centric workspace. Remove Overview and Messages/Settings tabs. Messages page becomes the sole workspace page. Migrate setup cards, registration CTA, and metrics onto the messages page in their respective lifecycle positions. Settings becomes a child page accessed via icon/link. Evolve message cards into self-contained workspace rows with test status, Send test, Ask Claude, and kebab menu. Overview route redirects to Messages.
Phase 3.8: Claude AI Support Slideout
Wide panel (500-600px) triggered by persistent button and per-message "Ask Claude". Pushes page content left. Pre-loaded with developer's business context, vertical, configured messages, and lifecycle state. Prototype stubs the chat interface. App Doctor round-trip diagnostic loop designed but not wired to real AI.
Phase 3.9: Wire Wizard Data Into Messages
Read sessionStorage business name and service type, interpolate into message card templates. Currently messages show hardcoded demo data.
Phase 4: Demo Functionality
Demo list management, per-session selection, recipient picker, invite link, test activity log. Per-message "Send test" with default number and dropdown for demo list.
Phase 5: Go Live Flow
Pre-filled registration confirmation screen. Depends on EIN verification backend (D-302, D-303).

Backlog Items (from Session 25)

Business name page for returning users (new project from Your Apps): pre-fill business name, auto-populate EIN, skip phone verify and signup. Needs design prototyping.
App Doctor / AI support with round-trip diagnostics: Support AI generates diagnostic prompts for developer's AI tool → developer pastes results back → Claude pinpoints issue and generates fix. Per-message "Ask Claude" entry point. SDK error design constraint: structured responses (status, error code, human-readable message, context hint) for clean diagnostic loop.
Confirm Anthropic brand usage: Can we reference Claude by name in the support panel and marketing copy? ("Ask Claude", "Claude helps you build, test, and troubleshoot"). Check terms of service for API customers.
Stale pricing sweep: D-320 ($49 flat) and D-321 ($8/500) still not reflected in: overview registration card (FIXED in Building state), register/review pages, settings billing section, /sms/[category]/messages public pricing, marketing home.

Visual Design Strategy
Untitled UI is being used as a wireframe kit, not as the final visual identity. A dedicated visual design sprint will happen after the product shape stabilizes.
What this means for CC:

Use Untitled UI components for structure and behavior
Do not treat Untitled UI's visual style as the brand
Prepare for a clean reskin — semantic color tokens, functional component names, thin remappable token layer
Animations come last — no animations now except functional transitions


Notes for CC

Read VOICE_AND_PRODUCT_PRINCIPLES_v2.md before writing any user-facing copy
Read UNTITLED_UI_REFERENCE.md for component patterns, color tokens, and icon usage
The prototype uses Untitled UI components, Tailwind v4.1, React Aria foundations — use them
Do not invent new color tokens or typography scales — use the existing system
The aesthetic should be clean, confident, and minimal. Precision over flair.
Every screen should feel like less than the current prototype, not more. We are subtracting.
No explaining our process in UI copy. Questions ask. Previews show. If you're tempted to add an explanation, cut it.
Multi-tenant aware. All state scoped to appId, not userId. URL structure: /apps/[appId]/.
The spec file builds everything. All messages available from day one. The messages page is for reviewing, editing, and testing — not enabling.
TopNav wizard detection uses pathname regex. Four modes: /start/* (wordmark + onboarding), wizard app routes in Onboarding (wordmark + pill + state switcher + onboarding, no Sign out), dashboard (full nav + Sign out), marketing (full marketing nav). New wizard pages need to update the regex.
WizardLayout's getPageConfig is pathname-driven. Signup paths match via pathname.includes("/signup") and return null for both Back and Continue (header row hidden). New wizard steps under /apps/[appId]/ need entries.
/start/* pages use WizardStepShell, not WizardLayout. Different plumbing, same visual result.
AppLayout has three special-case paths: isGetStarted (standalone render), isRegisterFlow (bare max-w-5xl render), and everything else (WizardLayout or DashboardLayout).
Variant IDs are stable (standard / action-first / context-first) even though labels changed. Don't rename the IDs.
Public marketing page at /sms/[category]/page.tsx has its own variant data with old labels — separate from in-app pills.
OTP is inlined in 3 places (/start/verify, /apps/[appId]/signup/verify, sign-in modal). Extract to shared component when touching any of them.
Signup email in sessionStorage under key relaykit_signup_email. Verify page reads on mount. Direct navigation to verify without going through signup will show blank email.
State transition boundary: registrationState does NOT change during OTP verify. It only flips to "building" when exiting the get-started page (D-322).
Onboarding and workspace Messages pages have cleanly separated rendering logic — they will diverge further (onboarding has no send icons or test controls, workspace has full row controls). Changes to one should not affect the other.
The workspace is a single page (Messages). There are no tabs. Overview route redirects to Messages. Settings is a child page. All lifecycle content (setup cards, registration status, metrics) lives on the Messages page in state-appropriate positions.

## Right Rail State Matrix

Reference for all right rail content across registration states.

### PENDING STATE (no metrics)

| EIN | Marketing | Right rail |
|-----|-----------|------------|
| No EIN | Not added | Registration status (Appointments: In review) + divider + Marketing upsell ("Add your EIN →") |
| With EIN | Not added | Registration status (Appointments: In review) + divider + Marketing upsell ("Add marketing messages →") |
| With EIN | Just confirmed via upsell | Registration status (Appointments: In review, Marketing: In review) — upsell gone. Marketing messages appear in list. |
| With EIN | Added at signup (D-336) | Registration status (Appointments: In review, Marketing: In review) — no upsell. Marketing messages in list. |

### REGISTERED STATE (has metrics)

| EIN | Marketing | Right rail (below Usage & Billing) |
|-----|-----------|------------|
| No EIN | Not added | Marketing upsell only ("Add your EIN →") |
| With EIN | Not added | Marketing upsell only ("Add marketing messages →") |
| With EIN | Just confirmed via upsell, in review | Registration status (Marketing: In review) — no Appointments row. Marketing messages in list. |
| With EIN | Marketing registered | "Your messages are live!" (Marketing: Registered) + Close. Marketing messages in list. |
| With EIN | Dismissed / no marketing | No right rail card |
