# DECISIONS.md — RelayKit
## Authoritative Decision Log

> **How this file works:**
> - CC reads this at the start of every session (triggered by `DECISIONS CHECK` command)
> - CC checks relevant entries before implementing anything touching architecture, data model, pricing, UX copy, or compliance logic
> - When a new decision is made during a session, CC appends it at the end under `## New This Session` with date and context
> - When a direction in this session contradicts an existing entry, CC stops and flags it explicitly: `"⚠ DECISION CONFLICT: This contradicts D-[number]. Proceeding would mean [X]. Confirm override before I continue."`
> - Joel reviews and either confirms the override (updating the entry) or reverts the direction

---

## ARCHITECTURE

**D-01 — Twilio ISV model: subaccounts per customer**
Each customer gets a dedicated Twilio subaccount (Architecture #1). Never a shared account or Messaging Service shared across customers. Subaccount isolation means one customer's compliance issues cannot affect another's traffic or trust score.
_Alternatives rejected: Architecture #4 (shared account with Messaging Services) — rejected because proxy enforcement requires per-customer isolation and subaccount credentials._
_Affects: PRD_04, PRD_09, all Twilio API calls_

**D-02 — No Twilio SDK — fetch() only**
All Twilio API calls use `fetch()` against the Twilio REST API directly. No `twilio` npm package anywhere in the codebase.
_Reason: Avoids SDK version lock, keeps the dependency surface small, works identically across Edge Runtime and Node._
_Affects: PRD_04, PRD_09, all lib/twilio/ files_

**D-03 — Magic link auth only — no passwords**
Authentication is Supabase magic link exclusively. No password fields, no OAuth, no session tokens beyond what Supabase manages.
_Affects: All auth surfaces, signup flow, dashboard access_

**D-04 — Deterministic template generation — no AI for compliance artifacts**
The template engine uses string interpolation exclusively. No LLM generation for campaign descriptions, sample messages, opt-in copy, or compliance site content. Output must be deterministic and reproducible for regulatory submissions.
_Reason: Carrier-evaluated compliance content must be consistent. AI generation introduces variance that can cause rejections on resubmission._
_Affects: PRD_02, lib/templates/, all generateArtifacts() calls_

**D-05 — Compliance sites on Cloudflare Pages, neutral domain**
Static HTML compliance sites are deployed to Cloudflare Pages on a RelayKit-controlled neutral domain (not the customer's domain). This is included in the setup fee.
_Reason: Customers without websites need a compliant URL for carrier review. Neutral domain means RelayKit controls uptime and content integrity._
_Affects: PRD_03, lib/compliance-site/_

**D-06 — Messaging proxy architecture — all traffic through RelayKit**
Every customer message routes through RelayKit's proxy before reaching Twilio. This is Architecture #1 and is non-negotiable in v1.
_Reason: (1) Platform protection — violations blocked before carriers see them. (2) Revenue alignment — usage metering is a byproduct of routing. (3) Customer stickiness — integration lock-in before payment._
_Alternatives rejected: Direct-to-Twilio delivery — rejected because async monitoring detects violations after carriers see them, which is too late for ISV trust score protection._
_Affects: PRD_09, all /v1/messages handling_

**D-07 — MESSAGING_SETUP.md template is canonical in PRD_05 Section 3.1**
The authoritative home for the MESSAGING_SETUP.md template is PRD_05_DELIVERABLE.md Section 3.1. PRD_09 Section 10 references it; it does not redefine it. No other PRD should contain a competing template definition.
_Affects: PRD_05, PRD_09_

**D-08 — resolveMessageContext() pattern for Phase 2 readiness**
The proxy pipeline uses an explicit `resolveMessageContext()` function that takes the authenticated customer (and future optional `tenant_id`) and returns registration details, subaccount credentials, canon messages, and compliance rules. All downstream checks use this context object — never reaching back to the customer record for business details.
_Reason: Phase 2 platform tier will supply context from tenant records. This pattern makes the migration non-breaking._
_Affects: PRD_09, lib/proxy/compliance-pipeline.ts_

**D-09 — Business-identity fields are authoritative on registrations, not customers**
Phone number, campaign SID, canon messages — these live on the `registrations` record. The `customers` record may denormalize for convenience. Exception: `twilio_subaccount_sid` is correctly customer-scoped (one subaccount per customer, shared across registrations in Phase 2).
_Affects: Database schema, all queries touching registration identity fields_

---

## DATA MODEL

**D-10 — message_plans: no UNIQUE constraint on customer_id**
The `message_plans` table does NOT have a UNIQUE constraint on `customer_id`. Phase 2 multi-project allows multiple plans per customer.
_Affects: PRD_06 schema, Supabase migration_

**D-11 — Nullable project_id columns added now for Phase 2 migration**
`message_plans` and `api_keys` both have a nullable `project_id UUID` column from day one, with a migration comment: "Phase 2: multi-project. Will become NOT NULL after migration." Do not build project-switching UI or `/dashboard/[projectId]/` URL structure in v1.
_Affects: PRD_06 schema, PRD_11 (Phase 2)_

**D-12 — business_industry is nullable on customers table**
`customers.business_industry` is TEXT nullable. Populated from `business_description` at intake by vertical detection. No breaking change in v1.
_Affects: PRD_06 schema, PRD_02 vertical detection_

**D-13 — Canon messages stored as JSONB on registrations table**
Canon messages (the 3 messages selected for TCR submission) are snapshotted as a JSONB column on the `registrations` record at registration time. Drift detection compares production messages against this snapshot, not against the live message plan.
_Reason: Registration content must be immutable after submission. The plan builder can change; the registration cannot._
_Affects: PRD_06, PRD_08 BM-09, lib/compliance/drift-analyzer.ts_

**D-14 — recipient_consents table for MIXED tier marketing consent**
Marketing consent is tracked in a dedicated `recipient_consents` table with `consent_type IN ('transactional', 'marketing')`. Not stored on the opt-outs table. MIXED tier proxy checks this table before delivering marketing-classified messages.
_Affects: PRD_08 BM-10, PRD_09 /v1/consents endpoint, lib/proxy/compliance-pipeline.ts_

---

## REGISTRATION & COMPLIANCE

**D-15 — Campaign registration is static after approval**
An approved TCR campaign cannot be modified. Adding marketing capability post-registration requires registering a **second campaign** on the existing subaccount — not upgrading or modifying the existing one.
_Copy rule: "We'll register an additional campaign" — never "upgrade your registration."_
_Affects: PRD_01 expansion logic, PRD_04, PRD_06 dashboard expansion CTA, all UX copy_

**D-16 — MIXED tier registered from day one**
If a customer selects marketing capability (via expansion options or explicit MIXED election), their campaign type is determined at intake and registered as MIXED from the start. There is no upgrade path from transactional to MIXED within the same campaign.
_Affects: PRD_01 determineCampaignType(), PRD_04 submission, PRICING_MODEL_

**D-17 — Campaign review timing is 2–3 weeks**
Current TCR baseline is 10–15 business days (~2–3 weeks). Never write "5–7 days" or "3–10 business days" anywhere — in UI copy, emails, PRDs, or documentation.
_Affects: PRD_06 pending state copy, PRD_09 engagement nudge copy, all email templates, all marketing copy_

**D-18 — Healthcare/HIPAA is a hard decline at intake**
Healthcare and HIPAA-adjacent use cases are declined during intake. No BAA. No PHI routing through the proxy. This is a platform constraint, not a product gap.
_Affects: PRD_01 use case selection, prohibited business screening_

**D-19 — Compliance monitoring is non-optional for all customers**
Drift detection and inline compliance enforcement apply to all paying customers. There is no opt-out and no paid tier for compliance. Charging separately would create ISV liability without visibility.
_Reason: RelayKit shares ISV account risk. A customer who opts out and sends noncompliant content puts the entire platform at risk._
_Affects: PRD_08, PRD_09 compliance pipeline, PRICING_MODEL_

**D-20 — $15 re-vetting fee absorbed by RelayKit**
Campaign resubmission after rejection incurs a $15 Twilio/TCR vetting fee. RelayKit absorbs this as a COGS line item. It is not passed to the customer. Track `resubmission_count` per registration; 3+ rejections flagged for manual review as a margin risk signal.
_Affects: PRICING_MODEL unit economics, PRD_04 rejection handling_

**D-21 — Rejection surfaces as debrief, not error**
Rejection cards and emails must include: (1) plain-language explanation of what was flagged, (2) why it triggers a carrier flag, (3) exact fix being applied, (4) what an approved version looks like. Never show raw error codes or "our team is reviewing" language.
_Affects: PRD_04 rejection table, PRD_06 Section 10.7, email template Email 5_

**D-22 — Sole prop OTP: 3-use lifetime limit advisory**
TCR limits a phone number to 3 lifetime brand verifications across all providers. Surface an advisory before sole prop OTP submission. Never suppress this warning.
_Affects: PRD_04 AWAITING_OTP state, PRD_06 OTP action card_

**D-23 — EIN 5-brand limit detection (Phase 2 TODO)**
TCR allows max 5 Standard Brands per EIN. Detection and blocking before a 6th registration is submitted is a Phase 2 TODO (D-04 in PRD_04 Phase 2 section). Do not silently allow a 6th submission.
_Affects: PRD_04 TODO-P2-03_

**D-24 — Multi-channel opt-out required (April 2025 TCPA)**
Any reasonable means of opt-out must be honored — not just STOP keyword. Email, web form, phone call, natural language ("leave me alone") all qualify. Developers must call `POST /v1/opt-outs` when any channel receives a revocation request. `SMS_GUIDELINES.md` instructs AI coding tools to implement this pattern.
_Affects: PRD_08 sms_opt_outs schema, PRD_09 /v1/opt-outs endpoint, SMS_GUIDELINES_TEMPLATE_

**D-25 — Authentication+ 2.0 state added to state machine**
`AWAITING_BRAND_AUTH` is a valid registration state for public/for-profit brands that must click a TCR email verification link. Dashboard card: "Check your email — TCR sent a verification link to {email}. Click it within 7 days."
_Affects: PRD_04 RegistrationStatus enum, PRD_06 status card_

**D-26 — BYO Twilio is Model 2, not Model 3**
BYO Twilio registration creates a Primary Customer Profile in the customer's own Twilio Trust Hub — not a subaccount under RelayKit's ISV. This means their traffic does not flow through RelayKit's account.
_Reason: Model 3 (subaccount under ISV + direct credentials) would route their traffic through our ISV account without proxy coverage. Unmonitorable ISV risk._
_Phase 2 — do not build in v1._
_Affects: PRD_09 Section 11, PRICING_MODEL Section 3_

---

## PRICING

**D-27 — Core pricing: $199 setup + $19/month transactional + $29/month mixed**
- $199 one-time setup fee (registration, compliance site, artifacts, rejection handling)
- $19/month transactional tier (500 messages included)
- $29/month mixed tier (transactional + marketing campaign + recipient consent enforcement)
- $15 per additional 1,000 message block (auto-scaling)
_Affects: PRICING_MODEL, PRD_01 Stripe checkout, all marketing copy_

**D-28 — Sandbox is permanently free**
The sandbox tier is free with no time limit, no credit card required. Sandbox messages route through a shared RelayKit Twilio number to the developer's verified phone only.
_Reason: Sandbox is customer acquisition cost. At 100 sandbox developers sending 50 messages/day, carrier cost is ~$40/day — cheaper than paid acquisition._
_Affects: PRD_09 sandbox, PRICING_MODEL Section 1_

**D-29 — Compliance Shield paid tier removed**
There is no paid compliance tier. Drift detection and all compliance enforcement is baseline for all paying customers. The former $29/month Compliance Shield tier is eliminated.
_Affects: PRICING_MODEL, PRD_08_

**D-30 — Multi-project billing: $199 + $19/$29 per project (Phase 2)**
Each registered project carries its own subscription. All subscriptions under one Stripe Customer record. Sandbox projects always free regardless of count.
_Phase 2 — do not build in v1._
_Affects: PRICING_MODEL Section multi-project, PRD_11_

---

## UX & COPY

**D-31 — Experience Principles doc is mandatory before writing copy**
`V4_-_RELAYKIT_EXPERIENCE_PRINCIPLES.md` must be read before writing any user-facing string. The vocabulary table and framing shift table are binding constraints on all UI copy, emails, error messages, status text, button labels, and tooltips.
_No exceptions for "minor" strings._
_Affects: All components with user-facing text_

**D-32 — Pending states always have narrative — never just a badge**
Every waiting or pending state must include: what's completed, what's happening now, what's next, and a "keep building" prompt. A status badge alone is never sufficient.
_Affects: PRD_06 Section 10.1 stepper copy, all registration status states_

**D-33 — Approval moment has required copy — do not genericize**
The approval moment copy ("Most developers never get here. You did.") is intentional and must not be softened, shortened, or replaced with generic "You're live!" language.
_Affects: PRD_06 Section 10.6 resources card, Email 4_

**D-34 — Read-only campaign content in review screen**
Campaign descriptions and sample messages are read-only in the wizard review screen. Users cannot edit compliance-critical content that has been generated for carrier submission.
_Reason: Edits to carrier-evaluated content cause rejections on resubmission._
_Affects: PRD_01 Screen 4 (review), template engine output display_

**D-35 — Three-tier message library structure**
Messages in the plan builder and library are organized into three tiers: (1) Included with registration (default on, green), (2) Also available with registration (default off, gray — unspent capacity), (3) Requires additional campaign (expansion, starred). Tier 2 toggling does not change registration scope. Tier 3 triggers second campaign registration.
_Affects: PRD_06 Sections 4 and 12, message plan builder UI_

**D-36 — Canon messages = "registered messages" in developer-facing UI**
Internal term is "canon messages." Developer-facing label is "registered messages" — clearer for the audience. Drift alerts say "your messages drifted from your registration" not "from your canon."
_Affects: PRD_06 message library, PRD_08 drift alert copy, all developer-facing UI_

**D-37 — Expansion options are "second campaign," never "upgrade"**
When a customer adds marketing capability post-registration, it is a second campaign registration. Copy must say "We'll register an additional campaign" — never "upgrade your registration" or "expand your plan."
_Affects: PRD_01 expansion UI, PRD_06 dashboard expansion CTA, PRD_04 TODO-P2-02_

**D-38 — ISV legal posture: never guarantee compliance outcomes**
RelayKit is a telecom compliance registration platform, not a compliance attorney. Never write copy implying compliance outcomes are guaranteed.
_Prohibited phrases: "ensures compliance," "guarantees approval," "fully compliant messaging," "we handle compliance," "stay compliant automatically."_
_Affects: All marketing copy, onboarding copy, dashboard copy, emails_

**D-39 — Field annotations are one sentence maximum**
"Why this matters" annotations on form fields are exactly one sentence. Never a paragraph.
_Affects: PRD_01 Screen 3 business details, all form field help text_

---

## DELIVERABLES & DOCUMENTS

**D-40 — Three-document lifecycle model**
Developers receive three documents across two stages:
1. `SMS_BUILD_SPEC.md` — sandbox, pre-payment, generated from message plan builder
2. `SMS_GUIDELINES.md` (sandbox edition) — sandbox, pre-payment
3. `MESSAGING_SETUP.md` + `SMS_GUIDELINES.md` (production) — post-registration approval
_Affects: PRD_05, PRD_06 build spec generator, dashboard Resources card_

**D-41 — Build spec is primary sandbox deliverable and conversion mechanism**
The build spec is designed to be good enough that even experienced developers choose it over manual integration. It creates investment (real time building) before any money changes hands, which is the primary conversion mechanism.
_Affects: PRD_05, PRD_06 Section 5_

**D-42 — generateArtifacts() selects exactly 3 messages for TCR**
`generateArtifacts()` selects exactly 3 messages from the full template set for Twilio/TCR campaign submission. `getMessageTemplates()` returns the full library for the dashboard plan builder. These are two separate functions with separate purposes.
_Affects: PRD_02, lib/templates/_

---

## PHASE 2 — DO NOT BUILD IN V1

**D-43 — Phase 2 items are explicitly out of scope for v1**
The following must not be built in v1: BYO Twilio tier, Platform/multi-tenant tier (PRD_10), multi-project dashboard (PRD_11), toll-free number path, brand re-use for second projects (PRD_04 TODO-P2-01), second campaign registration pathway UI (PRD_04 TODO-P2-02), EIN 5-brand limit detection (PRD_04 TODO-P2-03), Authentication+ 2.0 expansion to all brands (PRD_04 TODO-P2-04), advanced rate limiting with queue mode, sandbox behavior analysis for use case inference.
_Any PRD section marked "Phase 2" or "BYO Twilio" is out of scope._

---

## New This Session

_CC appends new decisions here during build sessions. Format:_
_**D-[next number] — [Title]** (Date: YYYY-MM-DD)_
_Decision, reason, alternatives considered if any, files affected._

**D-44 — Pre-registration use case stored in Supabase user metadata, not customers table** (Date: 2026-03-05)
Sandbox users don't have a `customers` row until intake/payment — the customers table requires many NOT NULL fields (business_name, business_description, contact info, etc.) that aren't collected until the intake wizard. Pre-registration use case selection is persisted to `auth.users.raw_user_meta_data` via `supabase.auth.updateUser({ data: { use_case } })`. The dashboard layout reads from user metadata when no customer record exists, falling back to `customer.use_case` post-payment. When a customer record is created at checkout, the use_case value is copied from user metadata to the customers table.
_Alternative rejected: Creating a minimal customers row with nullable fields — would require schema changes to the existing customers table and risk breaking the intake/checkout flow._
_Affects: `src/app/api/use-case/route.ts`, `src/app/dashboard/layout.tsx`, `POST /api/checkout` (future: copy metadata to customer record)._

**D-45 — Sandbox API keys stored in plaintext in user metadata** (Date: 2026-03-05)
Pre-registration sandbox API keys are stored as full plaintext in `auth.users.raw_user_meta_data.sandbox_api_key`. This differs from production keys (which are SHA-256 hashed in the `api_keys` table, shown once, never retrievable). The plaintext approach is justified because sandbox keys are low-security: limited to 100 messages/day, deliver only to the developer's verified phone, and must be re-displayable on the dashboard. Post-registration, sandbox keys move to the `api_keys` table with proper hashing.
_Alternative rejected: Hashing sandbox keys like production keys — would prevent re-display on the dashboard, forcing a "shown once" UX that conflicts with the sandbox's learn-as-you-build experience._
_Affects: `src/app/api/sandbox-key/route.ts`, `src/components/dashboard/sandbox-api-key-card.tsx`._

**D-46 — Sandbox phone verification uses Twilio Verify API, separate from TCR brand OTP** (Date: 2026-03-05)
Sandbox phone verification (verifying the developer's phone number for sandbox message delivery) uses the Twilio Verify API via `TWILIO_VERIFY_SID`. This is a completely separate flow from the TCR brand OTP verification in `src/app/api/otp/route.ts` (which submits OTP codes to Twilio Trust Hub for brand identity verification). The verified phone is stored in user metadata as `verified_phone`.
_Affects: `src/app/api/phone-verify/route.ts`, `src/components/dashboard/phone-verification-card.tsx`, `src/app/dashboard/layout.tsx`._

**D-47 — Messages tab is read-only library; plan builder lives only on Overview** (Date: 2026-03-05)
The Messages tab shows a read-only message library with a "Edit your message plan" link back to the Overview tab. The plan builder component is not duplicated on the Messages tab to avoid dual-instance sync issues (two interactive instances of the same component writing to the same `/api/message-plan` endpoint). Post-registration, the Messages tab shows canon messages (from registration JSONB) marked with a star badge and "Registered message" label (D-36).
_Alternative rejected: Rendering the plan builder on both tabs — would require shared state synchronization or real-time updates between two instances of the same component._
_Affects: `src/app/dashboard/messages/page.tsx`, `src/components/dashboard/message-library.tsx`, `src/components/dashboard/message-library-entry.tsx`._

**D-48 — Email templates are deterministic functions, no provider wired yet** (Date: 2026-03-05)
Email templates (Emails 0–5) are implemented as deterministic string interpolation functions in `src/lib/emails/templates.ts` returning `{ subject, body }` objects. No email provider (Resend, SendGrid, etc.) is integrated yet — templates are ready to plug into any provider. Emails 6–7 (drift alert, message blocked) are deferred to the PRD_08 compliance monitoring build since they depend on drift detection infrastructure that doesn't exist yet.
_Affects: `src/lib/emails/templates.ts`, `src/lib/emails/types.ts`._

**D-49 — Intake wizard needs three-tier industry gating before beta** (Date: 2026-03-05)
Before beta launch, the intake wizard (PRD_01 Screen 2) needs a three-tier industry gating layer: Tier 1 (advisory guidance, proceed allowed) for industries like legal, financial, restaurants that have elevated carrier scrutiny but are registrable. Tier 2 (hard decline with waitlist CTA) for healthcare — no HIPAA/BAA per D-18. Tier 3 (hard decline, no waitlist) for cannabis and firearms — carrier ecosystem exclusions that cannot be registered under any circumstance. Implementation: extend `SENSITIVE_INDUSTRIES` config with cannabis/firearms patterns and add blocking logic during the PRD_01 dashboard-path build (Step 4).
_Affects: `src/lib/intake/` (future), PRD_01 Screen 2 business details._

**D-50 — MESSAGING_SETUP.md uses credential placeholders, not actual keys** (Date: 2026-03-05)
The downloaded MESSAGING_SETUP.md contains placeholder strings for credentials: `"Your live API key (copy from dashboard)"` and `"Your webhook secret (copy from dashboard)"`. Production API keys are SHA-256 hashed in the `api_keys` table and shown once at approval time — they cannot be retrieved for inclusion in a downloadable file. The developer copies real values from the dashboard approval moment, not from the downloaded document. This is consistent with D-45's distinction between sandbox keys (plaintext, re-displayable) and production keys (hashed, shown once).
_Affects: `src/lib/deliverable/generator.ts`, `src/app/api/deliverable/route.ts`._

**D-51 — RelayKit platform ToS/AUP required before beta** (Date: 2026-03-05)
RelayKit needs its own Terms of Service and Acceptable Use Policy governing the relationship between RelayKit and developers who sign up. This is separate from the per-customer ToS generated by PRD_02 (which governs the customer-to-end-user relationship). Must include: prohibited use categories (cannabis, firearms, healthcare without BAA, SHAFT-C content), right to suspend/terminate for misrepresentation or prohibited content, right to block messages inline without liability, no refund on setup fee for policy violations. Beta blocker — no onboarding without this in place.
_Affects: new docs (RELAYKIT_TOS.md, RELAYKIT_AUP.md or combined), PRD_01 checkout screen (acceptance checkbox), landing page footer links._

**D-52 — Phase 1 proxy uses Postgres-only, no Redis** (Date: 2026-03-05)
All proxy data access (opt-out lookups, daily limit checks, API key auth) queries Postgres directly. No Redis cache layer in Phase 1. Phase 1 volumes (low hundreds of developers, 100 sandbox msgs/day each) don't justify the operational complexity of a Redis dependency. Redis can be added later as a performance optimization — the data access patterns are already designed for it (opt-out check is a single-row lookup, daily limit is a single-row upsert). When Redis is added, Postgres remains source of truth; Redis is a read-through cache.
_Affects: All `src/lib/proxy/` modules, `src/lib/sandbox/limits.ts`. No `@upstash/redis` dependency._

**D-53 — Opt-out table keyed on user_id, not customer_id** (Date: 2026-03-05)
`sms_opt_outs` uses `user_id` (Supabase auth ID) as the primary lookup key, not `customer_id`. This is because pre-registration sandbox users have no `customers` row — they only have an auth user. The `customer_id` column is nullable and populated when available (post-registration). The partial unique index is on `(user_id, phone_number) WHERE opted_back_in_at IS NULL`. This means opt-outs persist across the sandbox→registration transition because the `user_id` doesn't change.
_Affects: `supabase/migrations/20260306000000_messaging_proxy.sql`, `src/lib/proxy/opt-out.ts`, `src/lib/proxy/compliance-pipeline.ts`._

**D-54 — Sandbox inbound webhook uses 'sandbox' sentinel registrationId** (Date: 2026-03-05)
The shared sandbox Twilio number's Messaging Service is configured with inbound webhook URL `https://{domain}/api/webhooks/inbound/sandbox`. The inbound handler checks `registrationId === 'sandbox'` to switch to sandbox lookup logic, which matches the inbound `From` number against `verified_phone` in user metadata to identify the sandbox user. This avoids creating a fake registration row for the sandbox.
_Affects: `src/app/api/webhooks/inbound/[registrationId]/route.ts`. The sandbox Messaging Service must be manually configured in Twilio to point to this URL._

**D-55 — Pre-registration API key auth uses admin.listUsers() scan** (Date: 2026-03-05)
When a sandbox API key is not found in the `api_keys` table (pre-registration), the auth module falls back to scanning all auth users via `supabase.auth.admin.listUsers()` looking for a matching `sandbox_api_key` in user metadata. This is an O(n) scan across all users. Acceptable for Phase 1 (low hundreds of users), but will need optimization before scale: either migrate pre-reg keys to `api_keys` table at generation time, or add an index/lookup table mapping key hashes to user IDs.
_Affects: `src/lib/proxy/auth.ts`._

**D-56 — Compliance site domain is msgverified.com** (Date: 2026-03-06)
Customer compliance sites deploy to `{slug}.msgverified.com`. The domain `msgverified.com` is registered on Cloudflare. This supersedes the placeholder "neutral domain" language in D-05. Each customer's compliance site URL follows the pattern `https://{slug}.msgverified.com` where `slug` is derived at registration time.
_Affects: PRD_03, `src/lib/compliance-site/`, any code that constructs or displays the compliance site URL._

**D-57 — Intake wizard form data must never appear in URL query params** (Date: 2026-03-07)
Business details (EIN, phone, address, business description, email) are sensitive PII and must only be persisted in sessionStorage (`relaykit_intake` key), never serialized into URL query parameters. URLs between intake wizard screens carry only routing params: `use_case`, `expansions`, `campaign_type`, and `path`. This was enforced after a smoke test revealed the details page was serializing all form fields into the `/start/review` URL.
_Affects: `src/app/start/details/page.tsx`, `src/app/start/review/page.tsx`, any future intake wizard screens._

**D-58 — Single auth page at /login, no separate signup** (Date: 2026-03-08)
Login and signup are collapsed into a single page at `/login` with copy "Enter your email to continue." There is no sign-up vs sign-in distinction — `signInWithOtp()` handles both cases (creates account on first use, signs in on subsequent uses). `/signup` redirects to `/login`. All landing page CTAs point to `/login`. This eliminates user confusion about which page to use and removes the "Already have an account?" / "Don't have an account?" cross-links.
_Affects: `src/app/login/page.tsx`, `src/app/signup/page.tsx`, `src/components/auth/magic-link-form.tsx`, `src/components/landing/nav.tsx`, `src/components/landing/hero.tsx`, `src/components/landing/closing-cta.tsx`._

**D-59 — Auth uses email OTP verification, not magic links** (Date: 2026-03-08)
Authentication uses Supabase `signInWithOtp()` to send a 6-digit email code, verified client-side via `verifyOtp({ email, token, type: 'email' })`. The user never leaves the `/login` page. This replaces the previous magic link flow which redirected through `/auth/callback`. The callback route has been removed. Supabase dashboard must have email OTP template configured (using `{{ .Token }}` not `{{ .ConfirmationURL }}`).
_Reason: Magic links open in a new browser context (different tab, sometimes different browser on mobile), breaking session continuity. OTP keeps the user on the same page._
_Affects: `src/components/auth/magic-link-form.tsx`, `src/app/auth/callback/` (deleted). Supabase dashboard: Authentication > Email Templates._

**D-60 — Message cards use inline editing, no modal** (Date: 2026-03-09)
Message cards edit in place — click Edit on a card and the preview swaps to an editable textarea within the same card. No modal. The Edit button is hidden while editing; Save and Cancel buttons appear at the bottom of the card. Future iteration (next session): cards will be always-editable with no Edit button at all, and Save/Cancel will only appear after a change is detected.
_Affects: `prototype/components/plan-builder/message-card.tsx`. `prototype/components/plan-builder/message-edit-modal.tsx` deleted._

**D-61 — Locked compliance elements in message cards** (Date: 2026-03-09)
`{app_name}:` prefix and "Reply STOP to opt out." suffix are non-editable in every message. They render as normal text (same font, same color as editable content — not gray or faded) inside a single bordered container that reads as one continuous SMS. The developer edits only the middle portion. The cursor cannot enter the locked regions.
_Affects: `prototype/components/plan-builder/message-card.tsx`, `parseTemplate()` and `reconstructTemplate()` helpers._

**D-62 — Variable pills show interpolated preview data, not raw syntax** (Date: 2026-03-09)
In preview mode, variables like `{date}` and `{time}` render as interpolated values ("Mar 15, 2026", "2:30 PM") inside subtle gray background pills (`bg-bg-secondary text-text-secondary`). Not purple, not red. `{code}` keeps its warning-toned pill. STOP is bold only — no red color. These are informational, not error states.
_Affects: `prototype/components/plan-builder/message-card.tsx`, `renderMessagePreview()` function._

**D-63 — Fixed variable palette per category** (Date: 2026-03-09)
Developers cannot create custom variables. Each category defines a fixed set of variables (e.g., `{app_name}`, `{date}`, `{time}`, `{code}`, `{service_type}`, `{website_url}`). Future iteration: a variable palette row will appear when the textarea has focus, allowing insertion of available variables. Not yet built.
_Affects: `prototype/data/messages.ts` (variable definitions), `prototype/components/plan-builder/message-card.tsx` (future palette UI)._

**D-64 — Custom messages via Add message card** (Date: 2026-03-09)
Developers can add new messages via an "Add message" card at the bottom of each tier group. Custom messages get a "Custom" badge and are deletable. Default messages (from the category data) can only be toggled off, never deleted. Not yet built — next session.
_Affects: `prototype/components/plan-builder/message-card.tsx` (future), `prototype/components/plan-builder/message-tier.tsx` (future Add card)._

**D-65 — Trigger line format is "Triggers when..." or "Triggers..."** (Date: 2026-03-09)
Trigger lines on message cards use the format "Triggers when appointment booked" (event-based) or "Triggers 24h before appointment" (time-based). The word "Triggers" is always prepended; the original trigger text is lowercased if it starts with a capital letter. Shown in both preview and edit modes.
_Affects: `prototype/components/plan-builder/message-card.tsx`, `formatTrigger()` function._

**D-66 — "Available" replaces "Included" as second-tier badge name** (Date: 2026-03-09)
The `also_covered` tier badge displays as "Available" in the UI, not "Included." Tooltip: "Your registration includes these — turn on what you need." This was changed in session 4 and is now confirmed as a decision.
_Affects: `prototype/components/plan-builder/message-card.tsx`, `TIER_BADGES` constant._

**D-67 — Badge taxonomy is Core / Available / Add-on** (Date: 2026-03-09)
User-facing badge names are Core (purple), Available (green), Add-on (blue). This replaces the internal Tier 1/2/3 language. The internal `MessageTier` type values remain `core`, `also_covered`, `expansion` — only the display labels changed.
_Affects: `prototype/components/plan-builder/message-card.tsx`, `TIER_BADGES` constant._

**D-68 — Compliance checklist card removed** (Date: 2026-03-09)
The standalone compliance checklist component (`compliance-checklist.tsx`) has been deleted. Compliance protection is handled by locked elements on each card (D-61) rather than a separate checklist panel.
_Affects: `prototype/components/plan-builder/compliance-checklist.tsx` (deleted)._

**D-69 — Always-editable message cards with contentEditable pill editor** (Date: 2026-03-09)
Message cards are always editable — no Edit button, no modal, no mode toggle. The message body uses a `contentEditable` div with non-editable pill spans (`contentEditable="false"` + `data-var` attribute) for variable chips. Save/Cancel buttons appear only when the content has changed (dirty state tracking). This replaces the previous textarea-based edit mode toggled by an Edit button (supersedes the intermediate state described in D-60).
_Affects: `prototype/components/plan-builder/message-card.tsx`._

**D-70 — Business name is a movable pill, validated on save** (Date: 2026-03-09)
`{app_name}` is no longer a locked prefix. It renders as a regular variable pill that can be moved, deleted, or repositioned within the message. However, saving is blocked if `{app_name}` is absent: red border on the message container, error text "Your business name must appear in every message," and an "Insert business name" quick-fix link. This replaces the locked-prefix approach from D-61. The only locked element is now the STOP suffix.
_Affects: `prototype/components/plan-builder/message-card.tsx`._

**D-71 — Variable palette with category-specific fixed variables** (Date: 2026-03-09)
When the contentEditable area has focus, a row of available variable pills appears below the message. Each pill is a button that inserts the variable at cursor position. Variables are category-specific and fixed: verification gets `app_name, code, website_url, customer_name`; appointments gets `app_name, date, time, service_type, customer_name, website_url`. Variables can be inserted multiple times. Implements D-63.
_Affects: `prototype/components/plan-builder/message-card.tsx`, `CATEGORY_VARIABLES` constant._

**D-72 — Custom messages via Add message card** (Date: 2026-03-09)
"+ Add message" card at the bottom of each tier group creates a new custom message. Custom messages get a "Custom" badge (neutral gray), editable title and trigger fields, and a Delete button. Default messages from category data can only be toggled off — never deleted. Custom messages are stored in `sessionState.customMessages` array. Implements D-64.
_Affects: `prototype/components/plan-builder/message-card.tsx` (AddMessageCard), `prototype/components/plan-builder/message-tier.tsx`, `prototype/context/session-context.tsx`._

**D-73 — Catalog page is flat with nature badges, not tier grouping** (Date: 2026-03-10)
The read-only message catalog page (`/c/[category]/messages`) displays all messages in a single flat list — no Core/Available/Add-on tier sections. Each card shows a "Transactional" or "Marketing" nature badge based on `expansionType`, not the tier badge used on the plan page. This is intentional: the catalog is a copy-and-go reference for developers, not a plan builder. Tier structure is only relevant on the interactive plan page (`/c/[category]/plan`).
_Affects: `prototype/app/c/[categoryId]/messages/page.tsx`, `prototype/components/catalog/catalog-card.tsx`, `prototype/lib/catalog-helpers.ts`._

**D-74 — Catalog opt-in preview is always visible** (Date: 2026-03-10)
The opt-in consent preview on the catalog page is always visible in a two-column layout (45/55 split), not conditionally shown only when messages are selected. When no messages are checked, it shows generic consent text ("I agree to receive text messages from {name}"). When messages are selected, consent labels become specific. This mirrors the plan page's always-visible layout. The opt-in title ("Sample opt-in form") is a section header above the card, not inside it.
_Affects: `prototype/app/c/[categoryId]/messages/page.tsx`, `prototype/components/catalog/catalog-opt-in.tsx`._

**D-75 — Catalog sentence builder is two fields: app name + website** (Date: 2026-03-10)
The catalog page sentence builder reads "I'm building [MyApp]. Our website is [myapp.com]" — two inline editable fields only. The business type/vertical field (service type, venue type, product type) has been removed. Template interpolation still works because `CATEGORY_EXAMPLE_VALUES` in `catalog-helpers.ts` defaults to sensible values (e.g., `serviceType || "appointment"`) when the session field is empty.
_Affects: `prototype/app/c/[categoryId]/messages/page.tsx`._

**D-76 — Marketing-only badges on catalog cards** (Date: 2026-03-10)
Catalog message cards only show a badge for Marketing messages (purple: `bg-[#F9F5FF] border-[#E9D7FE] text-[#7C3AED]`). Transactional messages get no badge — the absence of a badge implies transactional. This supersedes D-73's mention of both Transactional and Marketing badges; the original green Transactional badge was removed to reduce visual noise.
_Affects: `prototype/components/catalog/catalog-card.tsx`._

**D-77 — Educational tooltips per message ID on catalog cards** (Date: 2026-03-10)
Each catalog card's info icon shows an educational tooltip explaining what the message does and when it's sent (e.g., "Sent when a user requests a login code. Confirms their identity before granting access."). Tooltip text is keyed by message ID in a `TOOLTIP_TEXT` map in `catalog-helpers.ts`. Falls back to formatted trigger text for messages without a specific tooltip. Tooltip uses hardcoded `bg-[#333333]` with `text-white` and `max-w-[280px]` because semantic dark tokens resolve incorrectly in the prototype.
_Affects: `prototype/lib/catalog-helpers.ts`, `prototype/components/catalog/catalog-card.tsx`._

**D-78 — Prompt nudges are short imperatives with inline copy icon** (Date: 2026-03-10)
Prompt nudges on catalog cards and the opt-in preview are short imperative sentences (e.g., "Write a login verification code that expires in 10 minutes.") — no "Ask your AI:" prefix. Each nudge is wrapped in curly quotes and has an inline copy icon button next to it. Nudge text is keyed per message ID in `PROMPT_NUDGE_BY_ID` map with a generic fallback for future categories.
_Affects: `prototype/lib/catalog-helpers.ts`, `prototype/components/catalog/catalog-card.tsx`, `prototype/components/catalog/catalog-opt-in.tsx`._

**D-79 — Copy combo button on catalog toolbar** (Date: 2026-03-10)
The catalog toolbar uses a split copy button: the main button copies selected messages (or all if none selected), and a chevron dropdown offers "Copy N selected" and "Copy all N messages" options. Replaces the previous separate "Select all" / "Copy all" / "Copy selected" buttons. A "Clear all" text button appears when messages are selected.
_Affects: `prototype/app/c/[categoryId]/messages/page.tsx`._

**D-80 — Catalog marketing section divider** (Date: 2026-03-11)
The catalog page splits messages into two groups: transactional (tier !== "expansion") displayed first, then marketing (tier === "expansion") below a section divider. The divider shows "Marketing & promotion messages" heading, "+$10/mo" right-aligned, and subtext "Your users check an extra box when they sign up. We handle the rest." — matching the plan page's `MessageTier` component pattern. Only appears when expansion messages exist for the category.
_Affects: `prototype/app/c/[categoryId]/messages/page.tsx`._

**D-81 — Catalog toolbar is icon-only (no text toggle)** (Date: 2026-03-11)
The catalog toolbar uses icon-only buttons instead of the previous "Preview | Template" bordered pill toggle. A single Code/Eye icon button toggles view mode. The clipboard+chevron copy dropdown replaces the split button. Icons sit inline with the "Your messages" h2 in a flex row. Scroll-triggered border uses IntersectionObserver + sentinel div to show border only when the sticky header is stuck.
_Affects: `prototype/app/c/[categoryId]/messages/page.tsx`._

**D-82 — Sentence builder inputs use hidden span measurement for width** (Date: 2026-03-11)
Inline sentence builder inputs measure actual text width using a hidden `<span>` that mirrors font properties (font-semibold, text-lg). Input width is set to `spanOffsetWidth + 8px`. Minimum width is 80px. When empty, the input shows placeholder at minimum width. When filled, it shrinks to fit the typed text. This replaces the previous ch-unit approach which was inaccurate.
_Affects: `prototype/app/c/[categoryId]/messages/page.tsx`._

**D-83 — Catalog card checkbox moved to far right** (Date: 2026-03-11)
The selection checkbox on catalog cards moved from the left side of the header (before the title) to the far right (after all icon buttons). Order: [Title + badge] ... [code toggle] [info] [copy] [8px gap] [checkbox]. The `ml-2` provides visual separation from the icon button group.
_Affects: `prototype/components/catalog/catalog-card.tsx`._

**D-84 — Catalog card title bumped to text-base** (Date: 2026-03-11)
Message card titles (e.g., "Booking confirmation") increased from `text-sm` to `text-base` for better visual hierarchy. Body-to-header spacing reduced from `mt-3` (12px) to `mt-1` (4px).
_Affects: `prototype/components/catalog/catalog-card.tsx`._

**D-85 — Catalog prompt nudge uses background strip** (Date: 2026-03-11)
Catalog card prompt nudges render in a subtle background strip at the bottom of the card: `border-t border-border-secondary bg-bg-secondary rounded-b-xl` with negative margins to span the full card width. Matches the plan page's card footer pattern.
_Affects: `prototype/components/catalog/catalog-card.tsx`._

**D-86 — Opt-in card copy icon is absolute-positioned** (Date: 2026-03-11)
The opt-in preview card's copy button moved from a separate top bar with border-b divider to an absolute-positioned icon at `top-3 right-4`. Legal links changed from clickable `<a>` tags to non-clickable `<span>` elements showing the actual URLs (e.g., "myapp.com/privacy"). Prompt nudge area top padding reduced.
_Affects: `prototype/components/catalog/catalog-opt-in.tsx`._

**D-87 — service_type default changed to empty string** (Date: 2026-03-11)
The `service_type` variable in `CATEGORY_EXAMPLE_VALUES` for appointments changed from defaulting to `"appointment"` to `""`. This prevents "appointment appointment" duplication in templates like "Your {service_type} appointment". Copy block output uses `.replace(/  +/g, " ")` to collapse double spaces from empty variables.
_Affects: `prototype/lib/catalog-helpers.ts`._
