# RelayKit — PROJECT OVERVIEW
## Master Reference Document (v2.0 — Mar 1, 2026)

> **What this file is:** The single source of truth for the RelayKit project. Upload this to any new Claude conversation to maintain full context. Update this file whenever architecture decisions change or build milestones are reached.
>
> **v2.0 CHANGE:** Product evolved from a registration-only service to a compliance-first SMS API with messaging proxy, developer sandbox, and inline compliance enforcement. See Section 12 for full change history.

---

## 1. PRODUCT DEFINITION

### What it is
RelayKit is a compliance-first SMS API for developers. Developers get an API key instantly, start building in a free sandbox, and go live when they're ready. RelayKit handles everything: A2P 10DLC registration, compliance website generation, and ongoing message compliance enforcement. Every message sent through RelayKit's API is automatically checked for opt-out violations, prohibited content, quiet hours, and rate limits before reaching carriers. The developer never touches Twilio, never navigates carrier regulations, and never worries about fines.

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
1. Developer signs up, gets a free sandbox API key instantly
2. Builds and tests full SMS integration (outbound + inbound + opt-out handling) against live, responsive API
3. When ready to go live, completes intake wizard with use-case-driven advisory (5-10 minutes)
4. RelayKit detects industry vertical and surfaces specific guidance during intake
5. Generates all compliance artifacts from approval-optimized templates
6. Deploys a hosted compliance website on a neutral subdomain
7. Submits 10DLC registration programmatically via Twilio ISV account (runs in background)
8. On approval, developer swaps sandbox key for live key — same code, same endpoint
9. Every message flows through compliance proxy — violations blocked before reaching carriers
10. Ongoing drift detection catches messages gradually moving outside registered use case
11. Message preview endpoint lets developers validate templates before deploying

### Key differentiators
- **Instant sandbox** — developers start building before any registration or payment. Full outbound + inbound + opt-out testing against a live API. No competitor offers this.
- **Compliance proxy** — every message passes through inline compliance checks (opt-out enforcement, SHAFT-C scanning, quiet hours, rate limiting) BEFORE reaching carriers. Violations are prevented, not detected after the fact.
- **ISV model** — customers never touch Twilio. We operate the infrastructure and hand them a simple API key.
- **Use case advisory screen** — shows customers what their registration allows and doesn't, helps them expand coverage before committing. No competitor does pre-registration advisory.
- **Auto-generated compliance websites** — the #1 cause of rejections, eliminated entirely.
- **AI-native deliverable** — two files (MESSAGING_SETUP.md + SMS_GUIDELINES.md) designed for AI coding tools, not human documentation reading.
- **Industry-specific compliance co-pilot** — 17 vertical modules (healthcare, legal, financial, restaurant, etc.) that give the customer's AI coding assistant deep operational knowledge about SMS in their specific industry.
- **Self-serve at every tier** — from solo developer to SaaS company, the product is the same. Pricing tiers scale with volume. No sales team needed.
- **BYO Twilio option** — developers with existing Twilio accounts can use registration-only tier, with frictionless upgrade path to the full proxy.
- **Sole proprietor path support** — most competitors focus on established businesses with EINs.
- **Message preview endpoint** — developers validate message templates against their registration before deploying. Returns compliance verdict with rewrite suggestions.
- **Drift detection for all** — Claude-powered semantic analysis catches messages gradually leaving the approved use case. Included for every customer, not a paid tier.
- **Approval-optimized templates** improve with every submission — the moat deepens with volume.

### Pricing
- **Free sandbox** — instant API key, full outbound + inbound testing, no payment required
- **$199 setup** — 10DLC registration, compliance site, all artifacts, Twilio submission, rejection handling
- **$19/month** — 500 messages included, dedicated phone number, compliance proxy, baseline monitoring
- **$15 per additional 1,000 messages** — auto-scaling, no interruption. Volume tapering at 5k+.
- **Registration Only (BYO Twilio)** — $199 one-time for customers who bring their own Twilio account (Phase 2)

All compliance features are included for every paying customer: inline enforcement, drift detection, and message preview. No paid compliance tiers.

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
[Developer] → [Sandbox Signup (free)] → [Sandbox API Key]
                                              ↓
                               [Build & test against sandbox API]
                               [Outbound + inbound + opt-out flows]
                                              ↓
                                [Ready to go live? → Intake Wizard]
                                              ↓
               [Intake Wizard (Next.js)] → [Stripe Payment ($199 + $19/mo)]
                                              ↓
                                    [Supabase: store customer record]
                                              ↓
                              [Template Engine: generate artifacts]
                                              ↓
                            [Compliance Site Generator: deploy to subdomain]
                                              ↓
                  [Twilio Submission: subaccount → brand → campaign → number]
                                              ↓
                    [Approval → Generate live API key → Notify developer]
                                              ↓
                        [Developer swaps sandbox key for live key]
                                              ↓
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
  - use_case (enum: see use case definitions)
  - stack (nullable — what they're building with)
  - stripe_customer_id
  - stripe_subscription_id
  - subscription_status (active, past_due, suspended, cancelled, churned)
  - twilio_subaccount_sid
  - twilio_subaccount_auth (encrypted via Supabase Vault)
  - sandbox_active (boolean)
  - live_active (boolean)
  - sensitive_industry (nullable)
  - created_at

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
  - submitted_at, approved_at, updated_at

generated_artifacts
  - id (uuid, PK)
  - registration_id (FK)
  - privacy_policy_text, terms_text, campaign_description
  - sample_messages (jsonb)
  - opt_in_description
  - compliance_site_url
  - deliverable_content (text — the generated MESSAGING_SETUP.md)
  - compliance_site_slug, template_version

api_keys
  - id (uuid, PK)
  - customer_id (FK)
  - key_hash (SHA-256, never store plaintext)
  - key_prefix (first 12 chars for display)
  - environment ('sandbox' or 'live')
  - is_active, created_at, last_used_at, revoked_at

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
  - registration_id (FK) / customer_id (FK)
  - phone_number, opted_out_at, opted_back_in_at, source

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
8. Purchase phone number, add to Messaging Service
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

> **NOTE:** All templates must be refined based on actual approval/rejection data. Track which exact language passes and which gets rejected. This is the core IP.

---

## 5. THE DELIVERABLE (AI-CONSUMABLE INTEGRATION + COMPLIANCE CO-PILOT)

### What it is
Two markdown files that together give the customer's AI coding assistant everything it needs to integrate SMS correctly and keep it compliant long-term.

### File 1: MESSAGING_SETUP.md (Integration Kit)
```markdown
# SMS Integration for {business_name}
## Your API key (add to your .env file)
RELAYKIT_API_KEY={rk_live_key}
RELAYKIT_WEBHOOK_SECRET={webhook_secret}

## About your SMS setup
{use_case_description, phone_number, compliance_site_url}

## Send a message
{fetch-based sendSMS() function calling api.relaykit.dev/v1/messages}

## Handle incoming messages (webhook)
{JSON event handler for message.received and opt_out.created events}

## What RelayKit handles automatically
{opt-out enforcement, quiet hours, content scanning, rate limiting, keyword handling}

## Compliance: opt-in form
{HTML form with all 8 CTIA-required elements}

## Quick integration guide
{Natural language instructions for AI coding assistants}
```

### File 2: SMS_GUIDELINES.md (Compliance Co-Pilot)
Written *to the AI coding assistant*, not to the human. Acts as a persistent system prompt. Contents:
- Registration context (use case, approved message types, frequency, phone number)
- 5 hard rules (never send without opt-in, never ignore STOP, stay within use case, always identify sender, include opt-out language)
- Best practices (frequency limits, quiet hours, content quality, error handling)
- Consent collection requirements (8 mandatory elements, checkbox rules, what to store)
- Quick-reference scenarios ("Can I send to all my users?", "Can I add promos?")
- **Industry-specific modules** (appended based on detected vertical — see PRD_05 Addendum)

### Vertical-specific modules (17 industries)
Dental, general medical, mental health, physical therapy, veterinary, salon/spa, fitness, legal, financial, restaurant, real estate, home services, ecommerce, SaaS, education, nonprofit, automotive.

### Format decisions
- Universal code uses `fetch()` — works in any JS environment
- Single API key, single endpoint, JSON in/out
- Error codes are human-readable and actionable (e.g., `recipient_opted_out`, `quiet_hours_violation`)
- The AI coding assistant doesn't need to build opt-out handling, rate limiting, or content filtering — RelayKit handles it at the infrastructure level

---

## 6. COMPLIANCE SITE SPECIFICATION

### What it is
A minimal static website deployed at `{slug}.{compliance_domain}` on a neutral domain that looks like the customer's own site, not RelayKit's. Satisfies carrier review requirements.

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
All PRDs written including PRD_09 (Messaging Proxy).

### Days 3-7: Core product build (IN PROGRESS)
- [x] Project scaffolding (Next.js + Supabase + Stripe)
- [x] Database schema and migrations
- [x] Intake wizard UI — Screens 1-3 complete
- [x] Template engine — 28 files, all 8 use cases, 17 vertical modules
- [ ] Intake wizard — Screen 4 (Review) and Screen 5 (Payment)
- [ ] Compliance site generator (template → deploy to subdomain)
- **Milestone: Can take a real customer from landing page to payment to generated artifacts**

### Days 8-11: Automation layer
- [ ] Programmatic Twilio subaccount creation
- [ ] Programmatic brand registration
- [ ] Programmatic campaign submission
- [ ] Phone number purchase and provisioning
- [ ] Webhook listeners for status changes
- [ ] Rejection parsing and alerting
- [ ] Customer dashboard (registration status, compliance site link, deliverable download)
- [ ] Status notification emails
- **Milestone: Full automated pipeline from payment to approval monitoring**

### Days 12-14: Deliverable engine, polish, launch
- [ ] Deliverable generator (MESSAGING_SETUP.md with RelayKit API key)
- [ ] Approval email with dashboard link
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

### Phase 2 (Weeks 3-4 post-launch):
- Rate limiting (trust-score-aware carrier MPS)
- Quiet hours enforcement (inline)
- Webhook retry with dead letter queue
- BYO Twilio registration-only tier
- Baseline compliance monitoring (async checks BM-01, BM-02, BM-06)

### Phase 3 (Month 2+):
- Drift detection escalation automation (throttle → pause)
- PHI detection for healthcare customers (inline)
- Compliance site monitoring (all customers)
- Advanced rate limiting with queue mode
- Real-time usage dashboard
- Compliance site monitoring

### Explicitly NOT in v1
- Stack-specific deliverables (launch with universal format)
- Multiple use-case-specific landing pages (one main landing page)
- Automated rejection auto-fix (manual review initially)
- Multi-provider support (Twilio only)
- Mobile app
- Referral program
- Advanced rate limiting with queue mode (Phase 2)
- BYO Twilio tier (Phase 2)

---

## 8. GO-TO-MARKET STRATEGY

### Phase 1: Validate (weeks 1-4 post-launch)
- Post in vibe coding communities: Cursor forums, Replit community, Bolt/Lovable discords, r/SideProject, r/SaaS
- Answer every 10DLC question on Reddit, HN, Stack Overflow
- Build-in-public posts on Twitter/X
- **Lead with sandbox:** "Add SMS to your app in 5 minutes — free sandbox, no registration required"
- Target: first 50 sandbox signups, first 20 paying customers
- Measure: sandbox-to-paid conversion, approval rate, messages per customer

### Phase 2: Organic growth (months 2-3)
- SEO content targeting: "SMS API for developers," "10DLC registration rejected," "TCPA compliant messaging API," "add texting to my app"
- Use-case-specific blog posts: "How to add appointment reminders to your app," "Ship order notifications in 48 hours"
- Publish approval rate as marketing proof point
- Tutorial content: "Build an SMS feature in 5 minutes with RelayKit's sandbox"

### Phase 3: Paid acquisition (month 3+, only if unit economics confirm)
- Google Ads on high-intent search terms
- Sponsored posts in developer communities
- Target CAC: $30-50
- Start with $2-3K/month, self-fund from revenue

### Key marketing messages

**Primary:** "Start building with SMS in 5 minutes. Go live when you're ready. Never break the rules."

**Secondary hooks (every feature is a front door):**
- "Add SMS to your app in 5 minutes" → leads with sandbox
- "Stop fighting 10DLC registration" → leads with registration automation
- "Send SMS without risking $500-per-text fines" → leads with compliance proxy
- "The Stripe for SMS" → leads with analogy

### Use case as marketing channel
Each use case becomes its own content angle:
- "Get your appointment reminder app sending texts in 48 hours"
- "Ship your order notification system with real SMS"
- "Add verification codes to your app — we handle the compliance"

---

## 9. FINANCIAL MODEL

### Unit economics — Registration (one-time)
| Item | Typical Customer | High Volume Standard |
|------|-----------------|---------------------|
| Revenue | $199 | $199 |
| Twilio brand + campaign | ~$19.50 | ~$61.00 |
| Stripe processing (3%) | ~$6.54 | ~$6.54 |
| Support/review time | $7.50-15 | $7.50-15 |
| **Gross profit** | **~$163-170** | **~$116-124** |
| **Gross margin** | **~82-85%** | **~58-62%** |

### Unit economics — Monthly Subscription
| Item | Low Use Case | Marketing/Mixed |
|------|-------------|----------------|
| Revenue (base) | $19.00 | $19.00 |
| Phone number rental | ~$1.15 | ~$1.15 |
| Twilio campaign monthly fee | ~$1.50 | ~$10.00 |
| Compliance site hosting | ~$0.50 | ~$0.50 |
| Monitoring + proxy infrastructure | ~$1.50 | ~$1.50 |
| Message cost (500 × $0.01 blended) | ~$5.00 | ~$5.00 |
| Stripe processing (3%) | ~$0.57 | ~$0.57 |
| **Monthly gross profit** | **~$8.78** | **~$0.28** |

> Marketing-heavy customers may be margin-negative on base tier. Margin comes from: (1) most customers won't use all 500 messages monthly, (2) message block overage ($15/1k) carries ~33% margin.

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

### Revenue Targets
| Milestone | Customers | Setup Rev | MRR (base) | Est. Overage MRR | Total Annual |
|-----------|----------|-----------|-----------|-----------------|-------------|
| Validation | 50 | $9,950 | $950 | ~$200 | ~$23,750 |
| Traction | 500 | $99,500 | $9,500 | ~$3,000 | ~$249,500 |
| Scale | 2,000 | $398,000 | $38,000 | ~$15,000 | ~$1,034,000 |

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
- **BYO Twilio:** Planned for Phase 2 as registration-only entry tier with upgrade path.
- **Auth:** Magic link via Supabase Auth (no passwords). Works for both sandbox and paid users.
- **Sole proprietor OTP:** Async step during onboarding — after payment, Twilio sends OTP to customer's phone.
- **Encrypted credential storage:** Supabase Vault for stored API keys and Twilio subaccount auth tokens.

### Still open
- [ ] **Domain:** Need to acquire relaykit.com or alternative.
- [ ] **Compliance site domain:** Use a neutral domain (not relaykit.com subdomain). Candidates TBD.
- [ ] **API domain:** api.relaykit.dev (preferred) — needs DNS setup.

---

## 11. PROJECT FILES INDEX

| File | Status | Description |
|------|--------|-------------|
| PROJECT_OVERVIEW.md | ✅ Complete (v2.0) | This file — master reference |
| PRD_01_INTAKE_WIZARD.md | ✅ Complete | Use case tiles, advisory screen, question flows, Stripe checkout |
| PRD_02_TEMPLATE_ENGINE.md | ✅ Complete | Artifact generation logic and all templates |
| PRD_03_COMPLIANCE_SITE.md | ✅ Complete | Static site structure, deployment, HTML templates |
| PRD_04_TWILIO_SUBMISSION.md | ✅ Complete (updated) | API sequence, subaccounts, state machine, rejection handling |
| PRD_05_DELIVERABLE.md | ✅ Complete (v2.0) | MESSAGING_SETUP.md (RelayKit API) + SMS_GUIDELINES.md |
| PRD_05_ADDENDUM_VERTICALS.md | ✅ Complete | 17 industry-specific AI instruction modules |
| PRD_06_DASHBOARD.md | ✅ Complete (updated) | Sandbox + registered customer experience, API keys, usage |
| PRD_07_LANDING_PAGE.md | ✅ Complete (updated) | Sandbox-first marketing, conversion flow |
| PRD_08_COMPLIANCE_MONITORING.md | ✅ Complete (updated) | Inline/async split, drift detection baseline, message preview, sensitive industry |
| PRD_09_MESSAGING_PROXY.md | ✅ Complete | Proxy architecture, sandbox, API spec, compliance pipeline |
| PRICING_MODEL_UPDATE.md | ✅ Complete (updated) | Subscription model + sandbox + BYO tiers |
| SMS_GUIDELINES_TEMPLATE.md | ✅ Complete | Base compliance co-pilot template |
| WORKING_BACKWARDS_EVOLVED.md | ✅ Complete | Full product vision, working backwards from delivery |
| BUILD_LOG.md | ✅ Active | Running log of progress and decisions |

---

## 12. CHANGE HISTORY

### v1.0 (Feb 26-27, 2026)
Original product concept: registration-only service. $199 one-time. Direct-to-Twilio deliverable. Async compliance monitoring (PRD_08).

### v1.5 (Feb 28, 2026)
Pricing model update: $199 setup + $19/month subscription with auto-scaling message blocks. See PRICING_MODEL_UPDATE.md.

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
