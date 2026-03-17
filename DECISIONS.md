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

**D-74 — Plan builder reframed as read-only message catalog** (Date: 2026-03-11)
Plan builder reframed as read-only message catalog — not an editing/building tool. Developers browse and copy, they don't configure.

**D-75 — All message types pre-populated on catalog page** (Date: 2026-03-11)
All message types for a use case are pre-populated on the catalog page. No enable/disable toggles, no tier grouping on the catalog view.

**D-76 — Copy format includes preview and template** (Date: 2026-03-11)
Copy format includes both preview (with sample values) and template (with variable placeholders). Both are copyable.

**D-77 — Opt-in consent preview is live and copyable** (Date: 2026-03-11)
Opt-in consent preview is a live, copyable surface on the catalog page. Updates dynamically based on which message cards are selected.

**D-78 — SMS_GUIDELINES.md must be comprehensive for AI advisors** (Date: 2026-03-11)
SMS_GUIDELINES.md must be comprehensive enough that an AI coding assistant with only that file can serve as a competent SMS compliance advisor for that developer's business.

**D-79 — Message composer/editor cut entirely** (Date: 2026-03-11)
Message composer/editor cut entirely. Developers write their own messages using catalog templates and AI prompt nudges as guidance.

**D-80 — Catalog page tone is browse-and-reference** (Date: 2026-03-11)
UI tone for catalog page is browse-and-reference, not task-and-configure. Subtle interactions, magazine-style layout.

**D-81 — Sentence builder has two fields only** (Date: 2026-03-11)
Sentence builder has two fields only: app name and website URL. Business type/vertical captured at registration, not on the catalog page.

**D-82 — TCR submission variety strategy** (Date: 2026-03-11)
TCR submission variety strategy — use intake data to tailor the 3 sample messages submitted to TCR, not generic defaults.

**D-83 — Correct D-61 — catalog page is display-only** (Date: 2026-03-11)
Correct D-61 — catalog page is display-only. Editing capability was cut.


**D-84 — "SMS Blueprint" replaces "Build Spec" in all customer-facing copy** (Date: 2026-03-13)
The developer-facing document is called the **SMS Blueprint**, personalized as `{app_name} SMS Blueprint` (e.g., "RadarLove SMS Blueprint"). File: `{app_slug}_sms_blueprint.md`. "Build spec" sounds like work for the developer; "Blueprint" frames it as a plan their AI executes. Internal code references (function names, variable names) may remain `build_spec` for now — this is a customer-facing naming decision. The guidelines file is similarly personalized: `{app_name} SMS Guidelines`.
_Affects: PRD_05, PRD_06, all customer-facing copy, download UI, email templates._

**D-85 — No plan builder — category selection is sufficient for registration scope** (Date: 2026-03-13)
**Supersedes plan builder concept in PRD_06. Extends D-74, D-75.** There is no message selection step, no enable/disable toggle, no curation UI at the RelayKit level. The developer picks a category; RelayKit determines campaign type, generates artifacts, and submits. All messages in the category library are available as reference. The intelligence about "which messages should I implement?" lives in the conversation between the developer and their AI coding tool, not in a RelayKit UI.
_Affects: PRD_06 (significant simplification), PRD_01, PRD_02, PRD_05._

**D-86 — Full-library Blueprint — all messages for the category** (Date: 2026-03-13)
The SMS Blueprint includes every message type for the developer's category, not a curated subset. `generateBuildSpec()` (or equivalent) takes category + customer data and returns the full library rendered with their business details. No `messagePlan` with per-message enabled state. The AI coding tool sees the full landscape and helps the developer choose which to implement during the build conversation.
_Affects: PRD_05, PRD_06 build spec generator._

**D-87 — Blueprint includes "Before building, ask me" section** (Date: 2026-03-13)
Use-case-aware clarifying questions appear at the top of the Blueprint, before implementation instructions. The AI encounters them first and asks before writing code. Questions are use-case-specific: appointment apps get different questions than verification systems. Examples: "Do you have an existing database schema?" / "What framework handles scheduled jobs?" / "Where does the opt-in form live in your existing signup flow?" These question sets need to be authored per use case as PRD_05 content work.
_Affects: PRD_05 template structure._

**D-88 — Blueprint generates a complete reference implementation** (Date: 2026-03-13)
The Blueprint instructs the AI to produce a complete, working SMS feature — not a utility function, not a scaffold. All core messages for the category triggered correctly, with error handling, opt-in form, and compliance patterns baked in. The "Before building, ask me" pattern (D-87) is what makes the first-try claim credible.
_Affects: PRD_05 template content and framing._

**D-89 — Marketing is always a separate campaign — never MIXED on initial registration** (Date: 2026-03-13)
**Supersedes D-16.** Initial registration is always transactional-only. This is a strategy, not a limitation: a transactional-only submission tells a tight, coherent story to the TCR reviewer. Marketing capability is added via a second campaign registration when the developer is ready. `determineCampaignType()` should never return MIXED for initial registration. The $29/mo mixed price point only applies when the developer adds marketing later. "Add marketing campaign" — never "upgrade." Strengthens D-15 and D-37.
_Affects: PRD_01, PRD_02, PRD_04, PRD_06, PRICING_MODEL._

**D-90 — 5 sample messages to TCR, all transactional for initial registration** (Date: 2026-03-13)
**Supersedes D-42 (was "exactly 3"). Updates D-82 (also referenced 3).** TCR accepts 2–5 samples; RelayKit always submits 5 (the maximum) because more samples give the reviewer a fuller picture. For transactional campaigns, all 5 samples are transactional messages from the category library. No marketing messages consume sample slots. Selection follows the anti-cookie-cutter strategy (D-91).
_Affects: PRD_02 generateArtifacts(), PRD_04 submission payload._

**D-91 — Anti-cookie-cutter strategy for TCR submissions and message display** (Date: 2026-03-13)
Two layers: (1) **Wording variation** — each category has 2–3 message variant sets with different word order and phrasing. Not every message starts with `{app_name}:`. A dental practice's reminder reads differently from a hair salon's. (2) **Selection rotation** — with 5–8 base messages per category, the 5 submitted to TCR rotate across registrations to avoid pattern detection. On the Messages page, pill selectors let the developer browse variant sets and mix-and-match. This is both a UX improvement and a registration approval strategy.
_Affects: PRD_02 template library (content authoring), Messages page prototype, PRD_04 selection algorithm._

**D-92 — Platform-specific setup instructions at Blueprint download moment** (Date: 2026-03-13)
Three steps max, one line per platform (Claude Code, Cursor, others). Lives on the Messages page near the Blueprint download CTA. Not a tutorial, not a video. Example — Claude Code: `Put both files in your project root. Then: "Read radarlove_sms_blueprint.md and build my messaging feature."`
_Affects: PRD_05 download UX, Messages page prototype._

**D-93 — Core positioning locked** (Date: 2026-03-13)
"Tell Claude Code to build your messaging feature. It might just work on the first try." All customer-facing copy points in this direction. RelayKit describes itself as the SMS context layer for AI coding tools. The Blueprint is the product. The API is the runtime.
_Affects: PRD_07 landing page, all marketing copy, onboarding copy._

**D-94 — "Your Apps" is the logged-in home page** (Date: 2026-03-13)
After login, the developer lands on "Your Apps" — a list of their apps with status per app (sandbox / building / registered / live). This page is also the launch point for new apps: "Add new app" → category selection (logged-in variant) → app name → phone verification → Blueprint download. Scales from 1 to N apps without redesign.
_Affects: PRD_06, PRD_11 (this partially implements the multi-project concept at a lightweight level)._

**D-95 — One app = one registration = one category = one Blueprint (1:1:1:1)** (Date: 2026-03-13)
Hard guardrails. Each app gets exactly one category, one registration, one Blueprint, one subaccount. A developer with two different apps makes two separate registrations. This keeps scope clean for TCR, prevents category confusion, and gives new users a clear mental model.
_Affects: PRD_06, PRD_04, "Your Apps" page design._

**D-96 — Email + phone verification required before Blueprint download** (Date: 2026-03-13)
Auth gate (sign in / sign up via magic link or email OTP per D-59) precedes Blueprint download. Email enables re-engagement ("You started building — ready to register?"). Sandbox phone number collected as "What number should we text?" — framed as development tooling, exciting not bureaucratic. This is separate from TCR business phone collected at registration. Strengthens the phone verification split established in D-46.
_Affects: Messages page auth gate, onboarding flow._

**D-97 — Per-app pages: Messages, Compliance, Settings — tabs appear after Blueprint download** (Date: 2026-03-13)
Before Blueprint download, the per-app experience is the Messages page only — no tab bar component, no Compliance, no Settings. After Blueprint download, the tab bar appears with Messages + Compliance + Settings. Tabs earn their place by becoming relevant. Compliance education lives on marketing/category landing pages, not in the app.
_Affects: Per-app layout component, prototype progressive disclosure._

**D-98 — Settings tab exists post-Blueprint-download only** (Date: 2026-03-13)
Contains: SMS compliance alerts toggle, account info (business name, email, phone, registration date), API key management (sandbox + live side by side, copy buttons, regenerate for sandbox only). Sub-copy on API keys: "Your AI coding tool will use this key automatically when it reads your SMS Blueprint."
_Affects: Per-app Settings page._

**D-99 — Billing lives per-app AND per-account** (Date: 2026-03-13)
Per-app Settings shows that app's plan, cost, and status (sandbox / active / paused). Parent-level account view shows total monthly spend across all apps, payment method, invoices, billing history. Per-app answers "what does this app cost me?" — parent answers "what does RelayKit cost me?"
_Affects: Settings tab billing section, "Your Apps" or account-level billing page._

**D-100 — Logged-in return flow uses lighter category selection** (Date: 2026-03-13)
When a logged-in developer creates a new app from "Your Apps," they see a streamlined category selection — not the full marketing category landing page. It assumes they already know what RelayKit is and skips the value prop/persuasion. Pick a use case → name the app → verify phone → get Blueprint. Auth already handled.
_Affects: "Your Apps" new app flow, category selection component (two faces: public/persuasive vs. logged-in/streamlined)._

**D-101 — Opt-in disclosure must enumerate implemented message types** AI documents must instruct on updating it. SMS_GUIDELINES.md includes an explicit instruction that opt-in disclosure language must be updated whenever the developer adds or removes a message type. The Blueprint's "Before building, ask me" section asks which message types are being implemented so the AI generates correct opt-in language from the start. The opt-in form is not a static block — it's a living disclosure tied to the developer's actual message set.

**D-102 — App name vs. business name: two separate fields with different mutability rules** (Date: 2026-03-13)
app_name is a mutable display label on the app record. The developer can change it at any time across the full lifecycle. It's used in: "Your Apps" card labels, nav/header, Messages page sentence builder previews, Blueprint filename ({app_slug}_sms_blueprint.md), Blueprint message previews, and platform setup instruction copy. Changing it pre-registration is trivial — regenerate the Blueprint. Changing it post-registration updates the UI display but does not affect the registration, compliance site, canon messages, or TCR submission.
business_name is collected at registration time (intake wizard business details), stored on the registration record, and immutable after TCR submission. It's used in: TCR brand registration, campaign description, canon messages (the 5 submitted samples), compliance site content at {slug}.msgverified.com, opt-in disclosure language, and drift detection baseline. Changing it requires canceling and restarting registration.
Pre-registration, business_name doesn't exist yet. The Blueprint and Messages page use app_name everywhere. At registration, the developer confirms or provides their legal business name — it may match app_name or differ (e.g., app is "RadarLove", business is "Radar Love LLC"). This is fine — CTIA requires brand identification in messages but doesn't require an exact match to the legal entity name.
The {app_name} variable in message templates resolves to whichever name is contextually appropriate: app_name in sandbox/preview contexts, business_name in registration/compliance/canon contexts. The Blueprint's opt-in disclosure section uses business_name when available, falling back to app_name pre-registration.
Edge case: if a developer changes app_name after downloading their Blueprint, the old file on disk contains the old name. The download UI should note "Re-download if you've changed your app name" but this is not a blocking issue — the AI will use whatever name is in the file, and the developer can override it in conversation.
Affects: app record schema (app_name mutable field), registration record schema (business_name immutable after submission), Blueprint generator (name resolution logic), Messages page sentence builder, compliance site generator, TCR submission payload, drift detection baseline.

**D-103 — message_plans table kept but auto-populated with full category library** (Option B) (Date: 2026-03-13)
With the plan builder removed (D-85), the message_plans table's role changes. Rather than storing per-message selections, it stores the full category library automatically. When a developer selects a category, message_plans is populated with all messages for that category — all enabled, none edited. The messages JSONB array structure is preserved. The enabled and edited_text fields exist but carry no meaningful state at the RelayKit level. This preserves the schema for potential future features (post-registration message customization, usage tracking per message type) without requiring a migration. The Blueprint generator reads category + customer data directly rather than consuming plan builder output.
Alternative rejected: Option A (radical simplification removing JSONB array) — would require schema migration if we ever want per-message state back.
Affects: PRD_06, message_plans table, Blueprint generator input.

**D-104 — PRDs must be updated before production build steps resume** (Date: 2026-03-13)
D-84 through D-103 represent significant product direction changes that are NOT yet reflected in the PRD files. Before CC builds production code from any PRD, that PRD must be updated to reflect current decisions. The change map (from VISION_IMPLEMENTATION_MEMO.md in docs/) lists specific changes per PRD. Priority order matches the build order: PRD_06 before Step 2, PRD_05 before Step 3, PRD_02 before Step 3, PRD_01 + Addendum before Step 4, PRD_04 before Step 5, PRD_07 before Step 7. CC must not build from a PRD that contradicts D-84–D-103 — if it encounters a conflict, flag it per the standard DECISIONS conflict protocol.
Affects: All PRDs, build order timing, CC session planning.

**D-105 — Registration money-back guarantee** (Date: 2026-03-14)
If a customer's 10DLC registration is not approved, they receive a full refund of the $199 setup fee. This guarantee is displayed on the marketing home page. Scope: covers registration rejection only, not account suspension due to customer violations post-approval. Terms to be detailed in ToS.
Affects: Marketing home page, pricing display, ToS, Stripe refund logic (future).

**D-106 — Category landing page has message style preview with variant toggle** (Date: 2026-03-15)
The `/sms/[category]` landing page includes a message preview section below the hero with three style pills (Brand-first / Action-first / Context-first) and three sample message cards (Booking confirmation, Appointment reminder, Cancellation notice). Each card shows the message text in the selected variant with interpolated preview values. Variable values render as `font-medium text-text-brand-tertiary` (subtle purple, medium weight) to distinguish from static text without competing with card titles. Trigger lines use "Sent when..." format, not "Triggers when...". This section demonstrates the anti-cookie-cutter strategy (D-91) on the marketing page.
_Affects: `prototype/app/sms/[category]/page.tsx`._

**D-107 — Public messages page at /sms/[category]/messages replaces placeholder** (Date: 2026-03-15)
The `/sms/[category]/messages` page is a full public-facing marketing page with the complete message library, style variant pills, `CatalogCard` components with checkboxes/copy/prompt nudges, and a `CatalogOptIn` form — all reusing components from the existing `/c/[category]/messages` catalog page. Styled as a marketing page (same nav, footer, typography as Home and `/sms/[category]`), not as an in-app dashboard. The existing `/c/[category]/messages` page remains unchanged.
_Affects: `prototype/app/sms/[category]/messages/page.tsx`._

**D-108 — "Download RelayKit" is the single primary CTA, not two separate buttons** (Date: 2026-03-15)
The messages page uses a single entry point — "Download RelayKit" — not separate "Download Blueprint" and "Start building with RelayKit" buttons. One door, not two. The download action triggers an auth gate (sign in to download). This applies to both the default layout and the steps layout. The CTA text does not include the word "Blueprint" — it's "Download RelayKit" or "Download RelayKit for [Category]".
_Affects: `prototype/app/sms/[category]/messages/page.tsx`, all CTA copy on the messages page._

**D-109 — Messages page subhead references "two files", not "Blueprint"** (Date: 2026-03-15)
The messages page subhead and CTA copy avoid the word "Blueprint" and instead reference the deliverable as "two files your AI coding tool reads to build and maintain your messaging feature." This is more concrete and less branded. The integrated hero variant (selected as the default) weaves the CTA inline into the subhead paragraph.
_Affects: Messages page hero copy._

**D-110 — Tool selector with per-tool setup instructions** (Date: 2026-03-15)
The `?layout=steps` version of the messages page includes a tool selector section between the hero and the main content. Six tools: Claude Code, Cursor, Windsurf, GitHub Copilot, Cline, and Other. Each shows a recognizable SVG icon (48px circle) and 2-3 lines of per-tool setup instructions. The prompt/command text renders in a light inline code style (`font-mono bg-bg-secondary`) with a clipboard copy button. Claude Code is selected by default. The section has no card wrapper — sits directly on the page. This implements D-92 (platform-specific setup instructions) in a more interactive format.
_Affects: `prototype/app/sms/[category]/messages/page.tsx` (steps layout)._

**D-111 — Personalization via localStorage, not session-only** (Date: 2026-03-15)
The messages page stores personalization data (app name, website URL, service type) in `localStorage` under the key `relaykit_personalize`, not just `sessionStorage`. This survives page refreshes and return visits. The data syncs to the session context on mount and updates message cards, opt-in form, and CTA copy in real time. In the default layout, personalization is accessed via a slideout panel triggered by a "Personalize" button. In the steps layout, personalization fields are always visible in the left column.
_Affects: `prototype/app/sms/[category]/messages/page.tsx`._

**D-112 — Marketing messages separated from core messages on public page** (Date: 2026-03-15)
On the public messages page, expansion/marketing messages (Promotional offer, Feedback request) are removed from the main message list and displayed in a separate "Need promotional messages too?" callout section. The callout explains that marketing requires a separate carrier registration (reinforcing D-89). Marketing message cards render at 70% opacity with `border-border-tertiary` and an "Available with marketing registration" badge. This is consistent with D-89's position that initial registration is always transactional-only.
_Affects: `prototype/app/sms/[category]/messages/page.tsx`._

**D-113 — Steps layout is the default messages page** (Date: 2026-03-16, updated from 2026-03-15)
The steps layout is now the default for the public messages page at `/sms/[category]/messages`. The old layout (right-heavy, messages left + opt-in right) is preserved at `?layout=default` for comparison. The steps layout includes the tool selector (D-110), personalization on the left, and messages on the right. Both layouts share the same data, components, and localStorage persistence. Decision finalized — steps layout won.
_Affects: `prototype/app/sms/[category]/messages/page.tsx`._

**D-114 — Download modal with account upsell and files-only path** (Date: 2026-03-16)
The "Download RelayKit" button on the messages page opens a modal with two paths: (1) Create an account (email → 6-digit OTP → downloading confirmation) which gives them sandbox access, personalized files, and a dashboard; (2) "Just the files please" which triggers an immediate download and shows a soft re-invitation ("Your sandbox is free whenever you're ready"). The modal headline is "Get more from RelayKit with an account" with two grouped benefit lists: what the files give you (3 items) and what an account adds (5 items). The OTP input uses 6 individual digit boxes matching the production PinInput component styling.
_Affects: `prototype/app/sms/[category]/messages/page.tsx`._

**D-115 — Tool selector uses real SVG logos** (Date: 2026-03-16)
The tool selector section uses official SVG logos from `prototype/public/logos/` for Claude Code, Cursor, Windsurf, GitHub Copilot, and Cline. "Other" uses a generic code brackets icon. Logos render at full color at all times — unselected at 60% opacity, selected at 100% with a 2px solid purple border on the circle. No background fill on either state.
_Affects: `prototype/app/sms/[category]/messages/page.tsx`, `prototype/public/logos/`._

**D-116 — Your Apps page and project layout shell** (Date: 2026-03-16)
Logged-in users land at `/apps` showing their projects as cards in a grid. Each card shows app name, category pill, status pill (Sandbox/Registered/Live), and created date. Cards link to `/apps/[appId]/overview`. The per-project layout has a breadcrumb ("Your Apps / {AppName}") and four tabs: Overview, Messages, Registration, Settings. No state toggle or A/B/C switcher — those were prototype controls, now removed.
_Affects: `prototype/app/apps/page.tsx`, `prototype/app/apps/[appId]/layout.tsx`._

**D-117 — Standalone dashboards A/B/C deleted** (Date: 2026-03-16)
The standalone `/dashboard-a`, `/dashboard-b`, `/dashboard-c` routes and the `/choose` category picker page were deleted. Dashboard A/B/C were alternatives (per D-feedback); the per-project layout at `/apps/[appId]/` replaces them. The A/B/C components still exist in `components/dashboard/` but are not imported by any page. The top nav no longer shows Dash A/B/C links.
_Affects: Deleted `prototype/app/dashboard-a/`, `dashboard-b/`, `dashboard-c/`, `choose/`. Modified `prototype/components/top-nav.tsx`._

**D-118 — Top nav simplified: no per-project links** (Date: 2026-03-16)
Logged-out nav shows: Home, Appointments, Messages, Sign in. Logged-in nav shows: Your Apps, Sign out. Per-project tabs (Overview, Messages, Settings) live exclusively in the app layout tab bar, not in the top nav. No A/B/C version switcher or state toggle in the top nav.
_Affects: `prototype/components/top-nav.tsx`._

**D-119 — Overview page is guided onboarding, not a dashboard** (Date: 2026-03-16)
The Overview page at `/apps/[appId]/overview` is a two-column guided onboarding flow with 4 sequential steps: (1) Verify phone, (2) Send test message from dashboard, (3) Send message from code, (4) Build SMS feature with AI tool. Steps are always visible with locked/active/completed states and a vertical timeline connector. The right column is a persistent registration pitch card with benefits, pricing ($199 + $19/mo), D-105 refund guarantee, progress bar, and "Start registration" CTA. Steps unlock sequentially. Completing all 4 triggers a celebration message with registration CTA.
_Affects: `prototype/app/apps/[appId]/overview/page.tsx`._

**D-120 — App messages tab reuses public messages page** (Date: 2026-03-16)
The Messages tab at `/apps/[appId]/messages` renders the same component as the public messages page at `/sms/[category]/messages`. It imports and renders `PublicMessagesPage` directly. The component falls back to "appointments" when no category URL param is present. This ensures identical content in both contexts. Differentiation between logged-in and public versions is deferred to a later session.
_Affects: `prototype/app/apps/[appId]/messages/page.tsx`._

**D-121 — Shared footer component, dead links removed** (Date: 2026-03-16)
Footer extracted to a shared `Footer` component at `prototype/components/footer.tsx`. The "Company" section (About, Blog) was removed — those pages don't exist. Legal links (Terms, Privacy, Acceptable Use) point to `#` as placeholders. The footer is used on the messages page (both layouts) and compliance page. The homepage retains its own inline footer with scroll-to-section links.
_Affects: `prototype/components/footer.tsx`, multiple pages._

## New This Session

**D-122 — Tab order: Overview, Registration, Messages, Settings** (Date: 2026-03-16)
The app layout tab bar order is Overview → Registration → Messages → Settings. Registration moves to second position (previously third after Messages) because it's the natural next step after onboarding and should be visually adjacent to the Overview tab where users are guided.
_Affects: `prototype/app/apps/[appId]/layout.tsx`._

**D-123 — Registration sidebar on Overview is a minimal pointer, not a sales pitch** (Date: 2026-03-16)
The registration card in the Overview page right column was stripped back to: heading ("Go live with real users"), one line of context about 2–3 week timeline, pricing ($199 setup + $19/mo), refund guarantee, and a "Learn more →" tertiary link to the Registration tab. Removed: six benefit checkmarks, primary "Start registration" CTA button, progress bar with dots. The card is a quiet persistent reminder — the onboarding steps on the left own all primary actions.
_Affects: `prototype/app/apps/[appId]/overview/page.tsx`. Supersedes the sidebar portion of D-119._

**D-124 — Step 3 code block collapsed by default with expander** (Date: 2026-03-16)
The "Now you send one" code block in the Overview onboarding shows only the first 4 lines (fetch URL, method, auth header) by default. A "Show full script" toggle reveals the rest. The copy button always copies the full script regardless of collapsed state. The `to` number is pre-filled with the user's verified phone from Step 1, and the `body` is pre-filled with the message selected in Step 2.
_Affects: `prototype/app/apps/[appId]/overview/page.tsx`._

**D-125 — Step 3 troubleshooting directs users to their AI coding tool** (Date: 2026-03-16)
Instead of inline Node.js troubleshooting text ("When your terminal prints 'queued'..."), Step 3 shows: "Having trouble? Copy this into your AI coding tool:" followed by a copyable prompt block. This keeps RelayKit's voice consistent — we're a tool for vibe coders, so debugging help comes from their AI tool, not from us.
_Affects: `prototype/app/apps/[appId]/overview/page.tsx`._

**D-126 — Registration tab removed — Overview absorbs registration at each lifecycle stage** (Date: 2026-03-16)
The Registration tab is removed from the app layout tab bar. Tabs are now: Overview, Messages, Settings (three tabs only). Registration content lives on the Overview page — the Go live sidebar card during onboarding, and the celebration CTA after completing all steps. As the product matures, Overview will surface registration status contextually rather than as a separate tab. Supersedes D-122.
_Affects: `prototype/app/apps/[appId]/layout.tsx`._

**D-127 — Troubleshooting in onboarding uses progressive disclosure** (Date: 2026-03-16)
Troubleshooting blocks in onboarding steps are wrapped in collapsible expanders, collapsed by default. The trigger is a simple clickable text link (e.g., "Having trouble?"). This keeps the primary flow clean while making help discoverable. The pattern is extensible — additional troubleshooting options can be added inside the expander later.
_Affects: `prototype/app/apps/[appId]/overview/page.tsx`._

**D-128 — Step 3 completion button says "I got the message" not "I sent it"** (Date: 2026-03-16)
The self-report button in Step 3 changed from "I sent it ✓" to "I got the message ✓". The user's action is sending a script from their terminal, but the confirmation they care about is receiving the SMS on their phone. The button text should match the outcome, not the action.
_Affects: `prototype/app/apps/[appId]/overview/page.tsx`._

**D-129 — Completed onboarding collapses to single row with "Review steps" expander** (Date: 2026-03-16)
When all 4 onboarding steps are complete, the step-by-step timeline is replaced with a single collapsed row: green checkmark + "Sandbox setup complete" + "Review steps" toggle. Expanding shows the four completed step labels. This frees the page for registration content without losing access to the onboarding summary.
_Affects: `prototype/app/apps/[appId]/overview/page.tsx`._

**D-130 — Sidebar card disappears post-onboarding — registration pitch takes full width** (Date: 2026-03-16)
The two-column layout (steps + sidebar card) is replaced with a full-width layout once onboarding completes. The "Go live with real users" sidebar card is removed. Registration pitch content becomes the main content area below the collapsed onboarding row. Supersedes D-123 for the completed state.
_Affects: `prototype/app/apps/[appId]/overview/page.tsx`._

**D-131 — Registration pitch structure: hook → two-column → timeline → pricing → CTA → note** (Date: 2026-03-16)
The post-onboarding registration pitch follows a fixed structure: (1) hook line about sandbox vs. real users, (2) two asymmetric cards — "What we handle" (5 items) vs. "What you provide" (3 items, intentionally shorter), (3) horizontal timeline strip (You 5min → We submit → Carriers review 2–3 weeks → You're live), (4) pricing ($199 + $19/mo) with refund guarantee, (5) primary "Start registration" CTA, (6) no-pressure note about sandbox working indefinitely. The visual asymmetry between the two cards is deliberate — it communicates that the developer's burden is light.
_Affects: `prototype/app/apps/[appId]/overview/page.tsx`._

**D-132 — Three-section accordion: Build / Register / Monitor** (Date: 2026-03-16)
The Overview page uses three collapsible sections: "Build your SMS feature" (4-step onboarding wizard), "Register your app" (registration narrative + pitch), "Monitor your compliance" (placeholder for post-approval). Each section has a checkbox heading — unchecked when incomplete, checked when done. The first incomplete section auto-expands on page load; all others are collapsed. Any section can be expanded at any time. Completing Section 1 auto-collapses it and auto-expands Section 2. Supersedes D-129 (collapsed onboarding row) and D-130 (sidebar disappears post-onboarding). The right-column sidebar card now persists across all states.
_Affects: `prototype/app/apps/[appId]/overview/page.tsx`._

**D-133 — Per-step "Redo" links on completed onboarding steps** (Date: 2026-03-17)
Each completed onboarding step shows a "Redo" link on the right side of its collapsed summary row. Clicking "Redo" reopens the step to its interactive state without resetting any other step's completion. Completing the step again returns it to completed state. Step 1's old "Change" button (which reset all steps) is replaced by the non-destructive "Redo" pattern. Phone number changes in Step 1 trigger inline amber warning bars on completed Steps 2 and 3 (e.g., "Your verified number changed. Redo to send a test to +1 [new number]."). Warnings clear when the affected step is redone and completed with the new number. Step 4 is not affected by phone changes.
_Affects: `prototype/app/apps/[appId]/overview/page.tsx`._

**D-134 — Breadcrumb removed, app name above tabs** (Date: 2026-03-17)
The "Your Apps / GlowStudio" breadcrumb is removed from the app layout — redundant since "Your Apps" is in the top nav and projects are one level deep. The app name (`h1`) now sits above the tab bar. Hierarchy: app identity → tabs → tab content. The "Appointments" category pill sits next to the app name in the layout with purple brand styling (`bg-bg-brand-section_subtle text-text-brand-secondary`).
_Affects: `prototype/app/apps/[appId]/layout.tsx`, `prototype/app/apps/[appId]/overview/page.tsx`._

**D-135 — Right column card is persistent registration action card** (Date: 2026-03-17)
The right column card contains all registration action content: "Register your app" heading, intro paragraph, "Learn more →" link (placeholder href), "Start registration →" primary CTA, pricing ($199 setup + $19/mo with message volume details), refund guarantee, "We handle everything" checklist (4 items), and "Takes just a few minutes" checklist (3 items). All checklists use purple checkmarks. The card is persistent across all section states. The left column sections contain only narrative/educational content — no pricing, CTAs, or checklists.
_Affects: `prototype/app/apps/[appId]/overview/page.tsx`._

**D-136 — Registration section uses 2x2 card grid with icon squares** (Date: 2026-03-17)
The "Register your app" section content uses a structured layout: heading + intro paragraph, then a 2x2 card grid. Each card has an @untitledui/icons icon inside a purple rounded-square (`rounded-lg bg-bg-brand-secondary`), a bold heading, and body text. Cards: (1) MessageXCircle — "Without it, messages don't arrive", (2) ClipboardCheck — "The process is a hassle", (3) ShieldTick — "We handle the whole thing", (4) BellRinging03 — "You stay protected after approval". Timeline strip removed. No-pressure note shortened.
_Affects: `prototype/app/apps/[appId]/overview/page.tsx`._

**D-137 — Compliance section uses same 2x2 card grid pattern** (Date: 2026-03-17)
The "Monitor your compliance" section uses the same card grid pattern as the registration section. Cards: (1) MessageCheckCircle — "Every message checked before sending", (2) SlashCircle01 — "Opt-outs handled for you", (3) SearchRefraction — "We notice when things drift", (4) AlertTriangle — "You'll know when something needs attention". Footer: "Compliance monitoring activates after carrier registration."
_Affects: `prototype/app/apps/[appId]/overview/page.tsx`._