# RelayKit — PROJECT OVERVIEW
## Master Reference Document (v3.0 — Mar 3, 2026)

> **What this file is:** The single source of truth for the RelayKit project. Upload this to any new Claude conversation to maintain full context. Update this file whenever architecture decisions change or build milestones are reached.
>
> **v3.0 CHANGE:** Dashboard-first experience + two-path product model. The sandbox dashboard is now the primary product surface with use case selection, message plan builder, build spec generator, and dual-path Quick Start. Build spec (SMS_BUILD_SPEC.md) is the primary sandbox deliverable — AI coding tools read it to build the entire SMS integration. Two-path model: Path A (full RelayKit via dashboard) is v1, Path B (BYO Twilio registration-only) is Phase 2. See Section 12 for full change history.

---

## 1. PRODUCT DEFINITION

### What it is
RelayKit is a compliance-first SMS API for developers. Developers sign up with an email, get a sandbox API key instantly, and land on a dashboard where they select their use case, curate compliant message templates in a plan builder, and generate a build spec their AI coding tool reads to build the entire SMS integration. When ready to go live, they complete a short registration form (mostly pre-filled from their dashboard work), and RelayKit handles everything: 10DLC registration, compliance site, and ongoing message compliance enforcement through an inline proxy. The developer swaps one API key and their app sends real texts.

### Who it's for
Developers of all sizes who need their app to send SMS to US phone numbers:
- **Solo developers and vibe coders** — building with Cursor, Bolt, Lovable, Replit, Claude Code. Want SMS to just work.
- **SaaS companies and small teams** — adding messaging features to existing products. Need compliance audit trails and infrastructure they can trust.
- **Agencies and vertical software builders** — building for specific industries (healthcare, legal, restaurants). Need industry-aware compliance guardrails.

The common thread: they can write code (or use AI to generate it) but don't want to become telecom compliance specialists.

### The problem
10DLC registration is a multi-step bureaucratic process involving brand registration, campaign submission, carrier approval, and phone number provisioning. It requires a live compliant website, a specific privacy policy, proper opt-in language, correctly formatted sample messages, and precisely worded campaign descriptions. First-time rejection rates are estimated at 30-50%, with each rejection costing $15 and 7-14 days. Most developers give up on SMS entirely.

After registration, developers are responsible for TCPA compliance ($500–$1,500 per violation, no cap), carrier content rules, opt-out enforcement, quiet hours, and rate limits they probably don't know exist. TCPA class action filings doubled year-over-year in early 2025.

### The solution
1. Developer signs up with email, gets a free sandbox API key instantly
2. Selects use case on dashboard from 8 categories (or "Just exploring")
3. Curates messages in plan builder — selects, edits, and toggles compliant templates
4. Generates build spec — a markdown file their AI coding tool reads to build the SMS integration
5. Also receives sandbox SMS_GUIDELINES.md — compliance rules for their AI coding tool
6. Builds and tests full SMS integration in sandbox (outbound, inbound, opt-out handling)
7. When ready to go live, clicks Register — intake wizard pre-populated from dashboard work
8. RelayKit generates all compliance artifacts, deploys compliance site
9. Submits 10DLC registration programmatically via Twilio ISV account
10. On approval, developer swaps sandbox key for live key — same code, same endpoint
11. Every message flows through compliance proxy — violations blocked before reaching carriers
12. Ongoing drift detection catches messages gradually moving outside registered use case

### Key differentiators
- **Instant sandbox** — developers start building before any registration or payment. Full outbound + inbound + opt-out testing against a live API. No competitor offers this.
- **Message plan builder** — developers design their SMS feature while simultaneously pre-populating registration and learning compliance boundaries. Card-based interface serves triple duty: product design, compliance education, registration pre-work.
- **Build spec for AI coding tools** — SMS_BUILD_SPEC.md generated from message plan, consumable by Cursor, Claude Code, Bolt, Lovable, Replit. The only SMS API that gives your AI coding tool a complete build spec.
- **Dashboard-first experience** — use case selection, message curation, build spec generation all happen in sandbox before any payment.
- **Compliance proxy** — every message passes through inline compliance checks (opt-out enforcement, SHAFT-C scanning, quiet hours, rate limiting) BEFORE reaching carriers. Violations are prevented, not detected after the fact.
- **ISV model** — customers never touch Twilio. We operate the infrastructure and hand them a simple API key.
- **AI-native deliverable** — three files across the lifecycle: SMS_BUILD_SPEC.md (sandbox), MESSAGING_SETUP.md (post-registration), SMS_GUIDELINES.md (both editions). Designed for AI coding tools, not human documentation reading.
- **Use case advisory screen** — shows customers what their registration allows and doesn't, helps them expand coverage before committing. No competitor does pre-registration advisory.
- **Auto-generated compliance sites** — the #1 cause of rejections, eliminated entirely.
- **Industry-specific compliance co-pilot** — 17 vertical modules (healthcare, legal, financial, restaurant, etc.) that give the customer's AI coding assistant deep operational knowledge about SMS in their specific industry.
- **Platform tier ready** — architecture supports multi-tenant SaaS registration in Phase 2 (PRD_10). Six v1 architectural guardrails ensure the single-company product doesn't prevent platform-tier expansion.
- **BYO Twilio option** — Model 2: registration submitted to customer's own Twilio account, not under our ISV. Zero ISV risk. Phase 2.
- **Self-serve at every tier** — from solo developer to SaaS company, the product is the same. Pricing tiers scale with volume. No sales team needed.
- **Sole proprietor path support** — most competitors focus on established businesses with EINs.
- **Message preview endpoint** — developers validate message templates against their registration before deploying. Returns compliance verdict with rewrite suggestions.
- **Drift detection for all** — Claude-powered semantic analysis catches messages gradually leaving the approved use case. Included for every customer, not a paid tier.
- **Approval-optimized templates** improve with every submission — the moat deepens with volume.

### Pricing
- **Free sandbox** — instant API key, full testing, message plan builder, build spec generator, sandbox SMS_GUIDELINES.md, message library. No time limit.
- **$199 setup** — 10DLC registration, compliance site, all artifacts, Twilio submission, rejection handling
- **$19/month** — 500 messages included, dedicated phone number, compliance proxy, baseline monitoring
- **$15 per additional 1,000 messages** — auto-scaling, no interruption. Volume tapering at 5k+.
- **BYO Twilio (Phase 2)** — $199 one-time. Model 2: registration submitted to customer's own Twilio account. No monthly, no proxy. 89-93% gross margin.
- **Platform tier (Phase 2)** — per-tenant pricing for SaaS platforms registering their tenants. See PRICING_MODEL.md and PRD_10.

All compliance features are included for every paying customer: inline enforcement, drift detection, and message preview. No paid compliance tiers. See PRICING_MODEL.md for full economics.

### Key metrics
- **First-time approval rate.** Target: 90%+. Centerpiece of all marketing.
- **Sandbox-to-registration conversion rate.** Target: 30%+.
- **Messages per customer per month.** Drives recurring revenue.

---

## 2. MARKET VALIDATION SUMMARY

### Pain validation (confirmed)
- 30-50% first-time rejection rate for DIY submissions (higher for sole proprietors)
- Campaign reviews currently taking 10-15 days per Twilio's own documentation
- Hacker News thread "Do 10DLC Requirements make it impossible for hobby projects to send SMS?" — 45 points, 19 comments, users describing process as "nightmare" and "designed to be obtuse," one commenter literally calling for "a wrapper opportunity here"
- Developer quote: "I'd happily pay 3x Twilio's messaging fee if I had no BS to go through"
- Developers abandoning SMS entirely rather than navigating registration
- Fiverr freelancers offering $10-55 registration gigs (demand signal for done-for-you service)

### Competitive landscape
- **No one bundles registration + sending + compliance into one developer API**
- Twilio/Telnyx/Plivo: raw APIs, leave compliance to developer
- SimpleTexting/EZTexting/SlickText: marketing dashboards, no developer API, 3-10x more expensive per message
- NotificationAPI: handles A2P registration for notification customers (narrow scope)
- Telgorithm: 10DLC compliance specialist (500K+ msg/month minimum)
- TextBetter, Zing, Alive5: various registration/compliance bundles, enterprise-focused
- **Gap: No instant sandbox + automated registration + compliance proxy for small-to-mid builders**

### Market size
- Twilio alone: 402K+ active accounts (Q4 2025), 77K net new in 2025
- Cursor: 7M developers. Replit: 30M+ users. Lovable: $100M ARR in 8 months.
- 84% of developers use or plan to use AI coding tools (Stack Overflow)
- Estimated SAM: 100K-300K potential users/year
- Conservative first-year target: 2,000-5,000 customers

### Regulatory trajectory (strongest tailwind)
- 10DLC getting stricter, not simpler. 100% of unregistered traffic blocked since Feb 2025.
- TCR added Authentication+ (Oct 2024), increased fees (Aug 2025)
- T-Mobile SMS fees rose 50% in 2024. Carrier fines up to $10K per violation.
- TCPA class action filings surged: 507 in Q1 2025 vs 239 in Q1 2024 (112% increase)
- April 2025 TCPA amendments: consumers can revoke consent through "any reasonable manner"
- No alternative channel eliminates 10DLC need (RCS, toll-free, WhatsApp all have own issues)
- Industry projects 10DLC persists through at least 2030

---

## 3. TECHNICAL ARCHITECTURE

### Stack
| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Frontend | Next.js on Vercel | Fast, modern, good DX with Claude Code |
| Design system | Untitled UI | Pre-built components, consistent design, no aesthetic decisions |
| Database | Supabase (Postgres) | Joel's existing toolkit, auth built-in, real-time subscriptions |
| SMS proxy API | Next.js Edge Runtime on Vercel | Low latency, global distribution for message routing |
| Cache / rate limiting | Upstash Redis (serverless) | Opt-out lookups, rate limit counters, API key cache |
| Payments | Stripe Checkout + Subscriptions | Standard, reliable, handles tax/receipts |
| SMS provider | Twilio (ISV model) | Largest provider, best API, Joel's existing experience |
| Compliance site hosting | Cloudflare Pages (subdomain) | Static sites, auto-SSL, fast deployment |
| Email | Resend or Supabase built-in | Transactional emails (receipt, status updates, deliverable) |

### System architecture (high level)
```
[Developer] → [Signup (email)] → [Sandbox API Key + Dashboard]
                                        |
                         [Use case selection (8 tiles + "Just exploring")]
                                        |
                         [Message plan builder (curate templates)]
                                        |
                         [Build spec generator → SMS_BUILD_SPEC.md + SMS_GUIDELINES.md]
                                        |
                         [Build & test in sandbox]
                                        |
                         [Ready to go live? → Register]
                                        |
              [Intake Wizard (pre-populated from dashboard)]
                                        |
                         [Stripe Payment ($199 + $19/mo)]
                                        |
                               [Supabase: store customer record]
                                        |
                         [Template Engine: generate artifacts]
                                        |
                       [Compliance Site Generator: deploy to subdomain]
                                        |
                 [Twilio Submission: subaccount → brand → campaign → number]
                                        |
                   [Approval → Generate live API key → Notify developer]
                                        |
                       [Developer swaps sandbox key for live key]
                                        |
        [Customer App] → [POST api.relaykit.dev/v1/messages]
                                ↓
             [Compliance Pipeline: auth → opt-out → rate limit →
              content scan → quiet hours]
                                ↓
                   [Forward to Twilio subaccount API]
                                ↓
                          [Carrier → End user]
```

### Database schema (core tables)
```
customers
  - id (uuid, PK)
  - email
  - name
  - business_name
  - ein (nullable — sole props won't have one)
  - address_line1, city, state, zip
  - phone
  - use_case (text — set on dashboard, may be null for new users)
  - stack (nullable — what they're building with)
  - stripe_customer_id
  - stripe_subscription_id
  - subscription_status (active, past_due, suspended, cancelled, churned, byo_active)
  - tier (sandbox, full_stack, byo)
  - twilio_subaccount_sid
  - twilio_subaccount_auth (encrypted via Supabase Vault)
  - sandbox_active (boolean)
  - live_active (boolean)
  - sensitive_industry (nullable)
  - created_at
  -- Phase 2: will add is_platform BOOLEAN, platform_config JSONB

registrations
  - id (uuid, PK)
  - customer_id (FK)
  - status (enum: pending_payment, generating_artifacts, deploying_site, verifying_site,
    submitting_brand, awaiting_otp, brand_pending, brand_approved, vetting_in_progress,
    creating_service, submitting_campaign, campaign_pending, provisioning_number,
    complete, rejected, needs_attention)
  - twilio_brand_sid, twilio_campaign_sid, twilio_messaging_service_sid
  - twilio_phone_number (nullable)
  - trust_score (nullable)
  - rejection_reason, rejection_code (nullable)
  - use_case (text — copied from customers.use_case at registration time)
  - business_name (text — denormalized from customers at registration time)
  - use_case_label (text — human-readable label, e.g. "Appointment reminders")
  - effective_campaign_type (text — 'standard' | 'mixed' | 'marketing')
  - approved_message_types (text — from template engine)
  - not_approved_content (text — from template engine)
  - message_frequency (text — from template engine)
  - preferred_area_code (text, nullable)
  - canon_messages (jsonb — finalized messages, schema below)
  - submitted_at, approved_at, updated_at
  -- Phase 2: will add nullable tenant_id FK

### Canon messages schema (registrations.canon_messages)

Canon messages are a first-class entity stored as JSONB on the `registrations` table. They are populated during the Stripe webhook handler: from `selected_messages` (Path 2 / dashboard flow) or from `generated_artifacts.sample_messages` reformatted (Path 1 / cold entry). All downstream consumers read from `registrations.canon_messages`.

```typescript
type CanonMessage = {
  template_id: string;        // e.g., 'appointments_booking_confirmation'
  category: string;           // e.g., 'Booking confirmation'
  text: string;               // Full message text with {variables}
  trigger: string;            // e.g., 'When client books an appointment'
  variables: string[];        // e.g., ['business_name', 'date', 'time']
  is_expansion: boolean;      // true for expansion messages
};

// registrations.canon_messages is CanonMessage[]
```

**Consumers:**
- PRD_05 deliverable generator reads `registrations.canon_messages` for MESSAGING_SETUP.md and production SMS_GUIDELINES.md
- PRD_08 drift analyzer reads `registrations.canon_messages` for semantic comparison
- PRD_06 dashboard Compliance tab displays canon messages as read-only reference

**Not the same as `generated_artifacts.sample_messages`:** The `sample_messages` column on `generated_artifacts` stores the Twilio API submission format (string array for TCR). Canon messages are the richer objects with template_id, category, trigger, variables, and expansion metadata.

generated_artifacts
  - id (uuid, PK)
  - registration_id (FK)
  - privacy_policy_text, terms_text, campaign_description
  - sample_messages (jsonb — Twilio API submission format, string array for TCR)
  - opt_in_description
  - compliance_site_url
  - compliance_site_slug, template_version
  -- NOTE: deliverable_content column removed. Document files (build-spec.md,
  --   guidelines-sandbox.md, messaging-setup.md, guidelines-production.md) are
  --   stored in Supabase Storage keyed by customer_id. See PRD_05 Section 8.
  --   Sandbox documents (build-spec, guidelines-sandbox) are customer-level.
  --   Production documents (messaging-setup, guidelines-production) are
  --   registration-scoped but stored under customer_id for simplicity.

message_plans
  - id (uuid, PK)
  - customer_id (FK, UNIQUE)
  - use_case (text)
  - messages (jsonb — array of template selections with edits)
  - build_spec_generated_at (timestamptz, nullable)
  - created_at, updated_at

api_keys
  - id (uuid, PK)
  - customer_id (FK)
  - key_hash (SHA-256, never store plaintext)
  - key_prefix (first 12 chars for display)
  - environment ('sandbox' or 'live')
  - is_active, created_at, last_used_at, revoked_at
  -- Phase 2: will add nullable tenant_id FK

webhook_endpoints
  - id (uuid, PK)
  - customer_id (FK)
  - url, events[], secret, is_active, created_at

messages
  - id (uuid, PK)
  - customer_id (FK)
  - external_id (msg_abc123 format)
  - twilio_sid, direction, to_number, from_number
  - body_hash (SHA-256, not storing body long-term)
  - status, compliance_result (jsonb), environment
  - idempotency_key, created_at, updated_at

sandbox_verified_numbers
  - id (uuid, PK)
  - customer_id (FK, UNIQUE)
  - phone_number, verified_at

sms_opt_outs
  - id (uuid, PK)
  - customer_id (FK) — primary key; sandbox opt-outs exist before registration
  - registration_id (FK, nullable) — populated for production-phase opt-outs
  - phone_number, opted_out_at, opted_back_in_at, source
  - UNIQUE(customer_id, phone_number)

message_usage
  - id (uuid, PK)
  - customer_id (FK)
  - billing_period_start, billing_period_end
  - message_count, blocks_billed, updated_at

message_scans, compliance_alerts, message_log, webhook_deliveries
  (see PRD_08 and PRD_09 for full schemas)
```

### Twilio API sequence
1. Create Twilio subaccount for customer (instant)
2. Create Brand Registration under subaccount (async, 1-7 days)
3. Poll brand status or receive webhook — wait for APPROVED
4. (If standard brand) Request secondary vetting (1-5 additional days)
5. Create Messaging Service with proxy webhook URLs
6. Create Campaign (async, 3-14 days)
7. Poll campaign status — wait for VERIFIED
8. Purchase phone number (area code preference from intake), add to Messaging Service
9. Generate RelayKit live API key (rk_live_)
10. Registration complete → generate deliverable → notify customer

### Sole proprietor flow (special handling)
- No EIN required — uses personal info
- OTP verification required (code sent to customer's phone) — human-in-the-loop relay
- Limited to 1 campaign, 1 phone number
- Lower throughput ceiling (adequate for indie apps)

---

## 4. USE CASE DEFINITIONS

Each use case maps to a TCR campaign type and pre-loads defaults for campaign description, sample messages, message frequency, and opt-in flow. Customer sees friendly tiles, not telecom jargon.

| Tile label | TCR campaign type | Default frequency | Key template variables |
|-----------|------------------|-------------------|----------------------|
| Appointment reminders | Customer Care | 2-4/week per recipient | business_name, service_type |
| Order & delivery updates | Delivery Notifications | 3-5 per order | business_name, product_type |
| Verification codes | 2FA | As needed | app_name |
| Customer support | Customer Care | As needed | business_name |
| Marketing & promos | Marketing | 2-4/month | business_name, offer_type |
| Team & internal alerts | Low Volume Mixed | As needed | org_name |
| Community & groups | Low Volume Mixed | Varies | community_name |
| Waitlist & reservations | Mixed | 1-3 per booking | business_name, venue_type |
| **Just exploring** | Low Volume Mixed | As needed | business_name |

> **NOTE:** "Just exploring" maps to a universal template set covering common patterns across use cases. All templates must be refined based on actual approval/rejection data. Track which exact language passes and which gets rejected. This is the core IP.

---

## 5. THE DELIVERABLE (THREE-DOCUMENT LIFECYCLE)

### What it is
Three markdown files designed for AI coding assistants, generated across two lifecycle stages. Together they take a developer from "exploring" to "production-ready." All generated via deterministic string interpolation from templates + customer data (no AI generation). See PRD_05 for full specification.

### Document 1: SMS_BUILD_SPEC.md (sandbox — pre-payment)
Generated when developer clicks "Generate build spec" on dashboard after curating their message plan. Contains: environment setup (sandbox API key), all selected messages with triggers and variables, what to build (sendSMS function, message triggers, webhook handler, opt-in form, error handling), and condensed compliance rules referencing SMS_GUIDELINES.md. This is the primary sandbox deliverable and the primary conversion mechanism — developers invest real time building from it before paying.

### Document 2: MESSAGING_SETUP.md (post-registration)
The build spec upgraded with production credentials, canon messages, webhook secret, compliance site URL, and production enforcement details. A developer who built from the build spec swaps one API key and their app works in production. Separate templates for full-stack (RelayKit API) and BYO Twilio (direct Twilio API calls).

### Document 3: SMS_GUIDELINES.md (both editions)
Written to the AI coding assistant as a persistent compliance co-pilot. Two editions: sandbox (ships with build spec, everything except live credentials and canon messages) and production (adds canon messages, drift detection rules, production enforcement). Contains registration context, 5 hard rules, best practices, consent collection requirements, quick-reference scenarios, and industry-specific modules (17 verticals — see PRD_05_DELIVERABLE.md Section 8).

### Canon messages vs build spec messages
Build spec messages are the developer's selected/edited templates from the plan builder — working drafts for sandbox development. Canon messages are finalized at registration and become the compliance baseline for drift detection. Canon messages are a first-class entity, not buried in generated_artifacts.

### Vertical-specific modules (17 industries)
Dental, general medical, mental health, physical therapy, veterinary, salon/spa, fitness, legal, financial, restaurant, real estate, home services, ecommerce, SaaS, education, nonprofit, automotive.

### Format decisions
- Universal code uses `fetch()` — works in any JS environment
- Single API key, single endpoint, JSON in/out
- Error codes are human-readable and actionable (e.g., `recipient_opted_out`, `quiet_hours_violation`)
- The AI coding assistant doesn't need to build opt-out handling, rate limiting, or content filtering — RelayKit handles it at the infrastructure level
- Code structure is identical between build spec and MESSAGING_SETUP.md — only credentials change

---

## 6. COMPLIANCE SITE SPECIFICATION

### What it is
A minimal static website deployed at `{slug}.{compliance_domain}` on a neutral domain that looks like the customer's own site, not RelayKit's. Satisfies carrier review requirements. See PRD_03 for full specification.

### Pages
1. **Home** — App/business name, description, contact email, nav links
2. **Privacy Policy** — Generated from template, includes mandatory mobile data non-sharing clause
3. **Terms of Service** — Generated from template, includes messaging-specific terms
4. **SMS Opt-In** — Working form with all required disclosure language, unchecked consent checkbox

### Critical privacy policy language (mandatory for approval)
Must include verbatim or equivalent:
"We do not share, sell, or distribute your mobile phone number or any personal information collected through our SMS messaging program to third parties for their marketing purposes. Mobile opt-in data and consent will not be shared with any third parties or affiliates for marketing or promotional purposes."

---

## 7. BUILD PLAN

### Working approach
- Joel builds with Claude Code
- Design system: Untitled UI
- PRDs written before any code — feed to CC one at a time
- Each PRD is a separate file in the `docs/` directory

### Days 1-2: PRD writing ✅ COMPLETE
All PRDs written including PRD_09 (Messaging Proxy) and PRD_10 (Platform Tier placeholder).

### Days 3-7: Core product build
- [x] Project scaffolding (Next.js + Supabase + Stripe)
- [x] Database schema and migrations
- [x] Intake wizard UI — Screens 1, 1b, 2, 3 complete
- [x] Stripe checkout integration (subscription mode)
- [x] Template engine — 28 files, all 8 use cases, 17 vertical modules
- [x] Twilio submission pipeline — PRD_04 complete (10 commits). State machine, subaccount creation, brand registration, campaign submission, phone provisioning, polling, webhooks.
- [ ] Intake wizard — Screen 4 (Review) and Screen 5 (Payment)
- [ ] Compliance site generator (template → deploy to subdomain)
- **Milestone: Can take a real customer from landing page to payment to generated artifacts**

### Days 8-11: Automation layer ✅ SUPERSEDED
> **Note:** This original plan is superseded by the revised build order below. Tasks listed here have been absorbed into the revised sequence (PRD_04 Twilio submission pipeline is complete; remaining items are covered by PRD_06 dashboard build, PRD_05 deliverable, and PRD_09 proxy).

### Days 12-14: Deliverable engine, polish, launch ✅ SUPERSEDED
> **Note:** This original plan is superseded by the revised build order below.
- [ ] Landing page with marketing copy
- [ ] Integration testing with real Twilio submissions
- [ ] Edge case handling and error states
- [ ] Production deployment
- **Milestone: Live product accepting real customers**

### Days 15-17: Messaging Proxy & Sandbox
- [ ] Sandbox signup flow (email → magic link → API key)
- [ ] Sandbox phone verification
- [ ] Sandbox send + receive (outbound to verified number, inbound forwarding)
- [ ] Proxy API endpoints (send, status, list, opt-outs, webhooks)
- [ ] Compliance pipeline (opt-out check, SHAFT-C scan, inline blocking)
- [ ] Twilio forwarding (subaccount message routing)
- [ ] Usage metering (message counter per billing period)
- [ ] Dashboard additions (API keys, usage stats)
- **Milestone: Developer can sign up, build in sandbox, register, go live, and send compliant messages through RelayKit API**

### Revised build order (Mar 3, 2026)
1. PRD_04 guardrail refactor (30 min) — RegistrationContext pattern, Phase 2 migration comments, resolveMessageContext stub
2. PRD_06 dashboard build (big build) — Use case selection, message plan builder, build spec generator, dual-path Quick Start, progressive disclosure, three-tab structure
3. PRD_03 compliance site generator — Static HTML pages deployed to Cloudflare Pages
4. PRD_05 deliverable — Build spec generator + post-registration MESSAGING_SETUP.md upgrade + SMS_GUIDELINES.md both editions
5. Wire registration from dashboard — Pre-populated intake wizard from dashboard data (PRD_01 addendum), area code selection (PRD_01 addendum Section 4.4, PRD_06 Section 9)
6. Expand PRD_02 template content — 5-8 messages per use case (currently 2-3)
7. PRD_09 messaging proxy and sandbox API
8. PRD_07 landing page

### Phase 2 (post-launch):
- Platform tier (PRD_10) — tenants table, tenant management API, platform dashboard, platform pricing
- BYO Twilio registration-only tier — Model 2 (customer's own Twilio account), credential validation, different Trust Hub flow
- Dashboard AI co-pilot
- Message Explorer ("Can I send this?")
- SMS notification channel for compliance alerts
- Sandbox behavior analysis for use case inference

### Explicitly NOT in v1
- Stack-specific deliverables (launch with universal format)
- Multiple use-case-specific landing pages (one main landing page)
- Automated rejection auto-fix (manual review initially)
- Multi-provider support (Twilio only)
- Mobile app
- Referral program
- Advanced rate limiting with queue mode
- BYO Twilio tier (Phase 2)
- Platform tier (Phase 2)

---

## 8. GO-TO-MARKET STRATEGY

### Phase 1: Validate (weeks 1-4 post-launch)
- Post in vibe coding communities: Cursor forums, Replit community, Bolt/Lovable discords, r/SideProject, r/SaaS
- Answer every 10DLC question on Reddit, HN, Stack Overflow
- Build-in-public posts on Twitter/X
- **Lead with AI angle:** "Tell your AI to add SMS to your app" and "The only SMS API that gives your AI coding tool a complete build spec"
- **Secondary hooks:** "Add SMS to your app in 5 minutes — free sandbox, no registration required"
- Target: first 50 sandbox signups, first 20 paying customers
- Measure: sandbox-to-paid conversion, approval rate, messages per customer

### Phase 2: Organic growth (months 2-3)
- SEO content targeting: "SMS API for developers," "10DLC registration rejected," "TCPA compliant messaging API," "add texting to my app," "AI SMS integration"
- Use-case-specific blog posts: "How to add appointment reminders to your app," "Ship order notifications in 48 hours"
- Build spec as marketing asset: publish anonymized sample build spec as blog content
- Publish approval rate as marketing proof point
- Tutorial content: "Build an SMS feature in 5 minutes with RelayKit's build spec"

### Phase 3: Paid acquisition (month 3+, only if unit economics confirm)
- Google Ads on high-intent search terms
- Sponsored posts in developer communities
- Target CAC: $30-50
- Start with $2-3K/month, self-fund from revenue

### Key marketing messages

**Primary:** "Tell your AI to add SMS to your app. Generate a build spec. Go live when you're ready."

**Secondary hooks (every feature is a front door):**
- "Add SMS to your app in 5 minutes" → leads with sandbox
- "Stop fighting 10DLC registration" → leads with registration automation
- "Send SMS without risking $500-per-text fines" → leads with compliance proxy
- "The Stripe for SMS" → leads with analogy
- "The only SMS API that gives your AI coding tool a complete build spec" → leads with build spec

### Use case as marketing channel
Each use case becomes its own content angle:
- "Get your appointment reminder app sending texts in 48 hours"
- "Ship your order notification system with real SMS"
- "Add verification codes to your app — we handle the compliance"

---

## 9. FINANCIAL MODEL

### Unit economics — Full-Stack Registration (one-time)
| Item | Typical Customer | High Volume Standard |
|------|-----------------|---------------------|
| Revenue | $199 | $199 |
| Twilio brand + campaign | ~$19.50 | ~$61.00 |
| Stripe processing (3%) | ~$6.54 | ~$6.54 |
| Support/review time | $7.50-15 | $7.50-15 |
| **Gross profit** | **~$163-170** | **~$116-124** |
| **Gross margin** | **~82-85%** | **~58-62%** |

### Unit economics — BYO Twilio Registration (one-time)
| Item | Amount |
|------|--------|
| Revenue | $199 |
| Twilio fees | $0 (charged to their account) |
| Stripe processing (3%) | ~$5.97 |
| Compliance site hosting | ~$0.50/month |
| Support/review time | $7.50-15 |
| **Gross profit** | **~$178-185** |
| **Gross margin** | **~89-93%** |

### Unit economics — Monthly Subscription (full-stack)
| Item | Low Use Case | Marketing/Mixed |
|------|-------------|----------------|
| Revenue (base) | $19.00 | $19.00 |
| Phone number rental | ~$1.15 | ~$1.15 |
| Twilio campaign monthly fee | ~$1.50 | ~$10.00 |
| Compliance site hosting | ~$0.50 | ~$0.50 |
| Proxy + Redis infrastructure | ~$1.00 | ~$1.00 |
| Drift detection (Claude API) | ~$0.25 | ~$0.25 |
| Message cost (500 × $0.01) | ~$5.00 | ~$5.00 |
| Stripe processing (3%) | ~$0.57 | ~$0.57 |
| **Monthly gross profit** | **~$9.03** | **~$0.53** |

> Marketing-heavy customers may be roughly breakeven on base tier. Margin comes from: (1) most customers won't use all 500 messages monthly, (2) message block overage ($15/1k) carries ~33% margin.

### Message Block Revenue
| Revenue per 1,000 block | $15.00 |
| Message cost (1,000 × $0.01) | ~$10.00 |
| **Gross profit per block** | **~$5.00 (33%)** |

### Customer LTV Model (12-month retention)
| Scenario | Setup | Monthly × 12 | Overage | Total LTV |
|----------|-------|-------------|---------|-----------|
| Light user (250 msg/mo) | $199 | $228 | $0 | $427 |
| Typical user (1,000 msg/mo) | $199 | $228 | $90 | $517 |
| Growth user (3,000 msg/mo) | $199 | $228 | $360 | $787 |
| Scale user (10,000 msg/mo) | $199 | $228 | $1,620 | $2,047 |
| BYO (no monthly) | $199 | $0 | $0 | $199 |
| BYO → full-stack upgrade (mo 3) | $199 | $171 | $68 | $438 |

### Revenue Targets
| Milestone | Full-Stack | BYO | Setup Rev | MRR (base) | Est. Overage MRR | Total Annual |
|-----------|-----------|-----|-----------|-----------|-----------------|-------------|
| Validation | 40 | 10 | $9,950 | $760 | ~$160 | ~$21,030 |
| Traction | 400 | 100 | $99,500 | $7,600 | ~$2,400 | ~$221,500 |
| Scale | 1,600 | 400 | $398,000 | $30,400 | ~$12,000 | ~$907,200 |

> Revenue targets assume ~80% full-stack / ~20% BYO split. Platform tier revenue is additive — a single 100-tenant platform customer generates ~$17K+ first year. See PRICING_MODEL.md for full details including platform tier pricing direction.

---

## 10. DECISIONS MADE & OPEN QUESTIONS

### Decided
- **Product name:** RelayKit
- **Product model:** Compliance-first SMS API with messaging proxy. All messages route through RelayKit.
- **Twilio account structure:** ISV model, Architecture #1 — subaccounts per customer from launch. Required for proxy isolation.
- **Developer sandbox:** Free, instant, full outbound + inbound + opt-out testing. No registration or payment required.
- **API key format:** `rk_sandbox_` and `rk_live_` prefixes (Stripe pattern).
- **Compliance enforcement:** Inline (preventive) for critical rules. Async (detective) for warnings.
- **Pricing:** $199 setup + $19/month subscription with auto-scaling message blocks.
- **Auth:** Magic link via Supabase Auth (no passwords). Works for both sandbox and paid users.
- **Sole proprietor OTP:** Async step during onboarding — after payment, Twilio sends OTP to customer's phone.
- **Encrypted credential storage:** Supabase Vault for stored API keys and Twilio subaccount auth tokens.
- **Dashboard-first experience:** Dashboard is the primary product surface. Use case selection, message plan builder, build spec generator all happen in sandbox before registration.
- **Two-path product model:** Path A (full RelayKit via dashboard) is v1. Path B (BYO Twilio registration-only) is Phase 2.
- **BYO Twilio is Model 2:** Registration under customer's own Twilio account, not our ISV. Zero ISV risk. $199 one-time, no monthly.
- **Platform tier:** Phase 2 with six v1 architectural guardrails (PRD_10). Market validated via LightLift.
- **Message plan builder:** Card-based interface serving triple duty — product design, compliance education, registration pre-work.
- **Build spec as primary sandbox deliverable:** SMS_BUILD_SPEC.md generated from message plan, consumed by AI coding tools.
- **Canon messages:** Messages finalized at registration become the drift detection baseline. First-class entity, not buried in generated_artifacts.
- **Local phone number selection:** Area code preference at registration, default based on business address.
- **Deterministic generation:** All compliance artifacts, build specs, and guidelines use deterministic string interpolation, not AI generation.

### Still open
- [ ] **Domain:** Need to acquire relaykit.com or alternative.
- [ ] **Compliance site domain:** Use a neutral domain (not relaykit.com subdomain). Candidates TBD.
- [ ] **API domain:** api.relaykit.dev (preferred) — needs DNS setup.
- [ ] **Build spec validation:** Test against multiple AI coding tools (Cursor, Claude Code, Bolt, Lovable, Replit) before launch.

---

## 11. PROJECT FILES INDEX

| File | Status | Description |
|------|--------|-------------|
| PROJECT_OVERVIEW.md | Updated (v3.0) | This file — master reference |
| PRD_01_INTAKE_WIZARD.md | Complete | Use case tiles, advisory screen, question flows, Stripe checkout |
| PRD_01_ADDENDUM_DASHBOARD_FLOW.md | NEW | Conditional intake wizard variant when entered from dashboard |
| PRD_02_TEMPLATE_ENGINE.md | Complete | Artifact generation logic and all templates (content expansion pending) |
| PRD_03_COMPLIANCE_SITE.md | Complete | Static site structure, deployment, HTML templates |
| PRD_04_TWILIO_SUBMISSION.md | Complete | API sequence, subaccounts, state machine, rejection handling |
| PRD_05_DELIVERABLE.md | Updated (v3.0) | Build spec generator + MESSAGING_SETUP.md + SMS_GUIDELINES.md lifecycle |
| PRD_05_ADDENDUM_VERTICALS.md | N/A — content is embedded in PRD_05_DELIVERABLE.md (Section 8) and PRD_02_TEMPLATE_ENGINE.md | 17 industry-specific AI instruction modules |
| PRD_06_DASHBOARD.md | Rewritten (v3.0) | Dashboard-first experience: plan builder, build spec, progressive disclosure |
| PRD_07_LANDING_PAGE.md | Updated (v3.0) | AI-first positioning, build spec hero, BYO email capture |
| PRD_08_COMPLIANCE_MONITORING.md | Complete | Inline/async split, drift detection, message preview, sensitive industry |
| PRD_09_MESSAGING_PROXY.md | Complete | Proxy architecture, sandbox, API spec, compliance pipeline |
| PRD_10_PLATFORM_TIER.md | NEW (placeholder) | Phase 2 multi-tenant SaaS registration |
| PRICING_MODEL.md | Updated (v3.0) | All tiers including BYO Model 2 and platform direction |
| ONBOARDING_UX_DECISIONS_v2.md | NEW | 17-section UX decisions document from strategy sessions |
| RELAYKIT_UX_NARRATIVE_v2.md | NEW | Three-developer narrative showing full experience |
| SMS_GUIDELINES_TEMPLATE.md | Complete | Base compliance co-pilot template |
| WORKING_BACKWARDS_EVOLVED.md | Complete | Full product vision, working backwards from delivery |
| BUILD_LOG.md | Active | Running log of progress and decisions |

---

## 12. CHANGE HISTORY

### v1.0 (Feb 26-27, 2026)
Original product concept: registration-only service. $199 one-time. Direct-to-Twilio deliverable. Async compliance monitoring (PRD_08).

### v1.5 (Feb 28, 2026)
Pricing model update: $199 setup + $19/month subscription with auto-scaling message blocks. See PRICING_MODEL.md.

### v2.0 (Mar 1, 2026)
**Major pivot: messaging proxy + developer sandbox.** All messages now route through RelayKit's API. Key changes:
1. Added PRD_09 (Messaging Proxy & Developer Sandbox)
2. Architecture changed from #4 (shared account) to #1 (subaccounts per customer)
3. Critical compliance checks moved from async (PRD_08) to inline proxy enforcement
4. Deliverable outputs RelayKit API key instead of Twilio credentials
5. Free sandbox added as primary acquisition channel
6. Landing page repositioned from registration service to SMS API with compliance
7. Dashboard expanded for sandbox users, API key management, usage stats
8. BYO Twilio added as registration-only entry tier (Phase 2)
9. Target market broadened from "vibe coders" to full spectrum of developers

Motivation: inline compliance enforcement protects the ISV account (RelayKit's primary risk), per-message billing creates recurring revenue, sandbox eliminates the registration wall and creates integration lock-in.

### v3.0 (Mar 3, 2026)
**Dashboard-first experience + two-path product model.** Key changes:
1. PRD_06 completely rewritten — dashboard is now the primary product surface with use case selection, message plan builder, build spec generator, dual-path Quick Start, and progressive disclosure
2. PRD_05 rewritten — three-document deliverable lifecycle (build spec in sandbox, MESSAGING_SETUP.md post-registration, SMS_GUIDELINES.md both editions)
3. PRD_01 addendum added — conditional intake wizard flow when entered from dashboard with pre-populated data
4. PRD_07 updated — AI coding tool positioning, build spec as hero differentiator
5. PRD_10 added — Phase 2 platform tier placeholder with architectural guardrails
6. PRICING_MODEL updated — BYO Twilio switched to Model 2 (customer's own account), platform tier pricing direction, build spec added to free tier
7. Two-path product model established: Path A (full RelayKit via dashboard, v1) and Path B (BYO Twilio registration-only, Phase 2)
8. Six architectural guardrails added for Phase 2 platform tier compatibility
9. Build order revised to reflect dashboard-first development sequence

Motivation: The dashboard-first approach lets developers invest in the RelayKit integration before paying. The build spec captures domain knowledge that makes AI coding tools effective at SMS integration. The message plan builder simultaneously teaches compliance, designs the developer's product, and pre-populates their registration.
