# RelayKit — PROJECT OVERVIEW
## Master Reference Document (v1.0 — Feb 26, 2026)

> **What this file is:** The single source of truth for the RelayKit project. Upload this to any new Claude conversation to maintain full context. Update this file whenever architecture decisions change or build milestones are reached.

---

## 1. PRODUCT DEFINITION

### What it is
RelayKit is a web app that gets vibe coders and indie developers through A2P 10DLC SMS registration so their apps can actually send text messages. The customer picks a use case, gets expert guidance on what their registration should cover, answers a few questions, pays $199, and we handle everything — generating their compliance website, privacy policy, terms of service, opt-in form, campaign description, and sample messages, then submitting their registration through our own Twilio ISV account. When approved, they receive two AI-consumable files: an integration kit and an industry-specific compliance co-pilot that lives in their codebase and guides their AI coding assistant to build SMS features correctly.

### Who it's for
Solo developers, indie hackers, and vibe coders (people building apps with AI coding tools like Cursor, Bolt, Lovable, Replit, Claude Code) who need their app to send SMS to US phone numbers and are blocked by the A2P 10DLC registration process.

### The problem
10DLC registration is a multi-step bureaucratic process involving brand registration, campaign submission, carrier approval, and phone number provisioning. It requires a live compliant website, a specific privacy policy, proper opt-in language, correctly formatted sample messages, and precisely worded campaign descriptions. First-time rejection rates are estimated at 30-50%, with each rejection costing $15 and 7-14 days. Vibe coders hit this wall the moment their AI-generated code tries to send a real text message. Many give up on SMS entirely.

### The solution
An automated pipeline that:
1. Interviews the customer via a use-case-driven intake wizard with expert advisory (5-10 minutes)
2. Detects the customer's industry and surfaces vertical-specific guidance during intake
3. Helps customers expand their registration to cover future needs before they commit
4. Generates all compliance artifacts from approval-optimized templates
5. Deploys a hosted compliance website on a neutral subdomain
6. Submits the 10DLC registration programmatically via our Twilio ISV account
7. Monitors approval status and handles rejections
8. Delivers an AI-consumable integration kit + industry-specific compliance co-pilot
9. Monitors outbound messages for ongoing compliance (baseline included, paid tier available)

### Key differentiators
- **ISV model** — customers never touch Twilio. We operate the infrastructure and hand them ready-to-use credentials
- **Use case advisory screen** — shows customers what their registration allows and doesn't, helps them expand coverage before committing. No competitor does pre-registration advisory
- **Auto-generated compliance websites** — the #1 cause of rejections, eliminated entirely
- **AI-native deliverable** — two files (MESSAGING_SETUP.md + SMS_GUIDELINES.md) designed for AI coding tools, not human documentation reading
- **Industry-specific compliance co-pilot** — 17 vertical modules (healthcare, legal, financial, restaurant, etc.) that give the customer's AI coding assistant deep operational knowledge about SMS in their specific industry
- **Ongoing compliance monitoring** — baseline scanning on every message (included), Claude-powered semantic drift analysis (paid tier)
- **Sole proprietor path support** — most competitors focus on established businesses with EINs
- **Approval-optimized templates** improve with every submission — the moat deepens with volume

### Pricing
- **$199 one-time** — Full registration including compliance site, all generated artifacts, Twilio submission, rejection handling, integration kit, and industry-specific compliance co-pilot
- **$29/month Compliance Shield** (post-launch): Claude-powered semantic drift analysis, weekly compliance reports, compliance site monitoring, proactive re-registration recommendations

### Key metric
**First-time approval rate.** Target: 90%+. This becomes the centerpiece of all marketing.

---

## 2. MARKET VALIDATION SUMMARY

### Pain validation (confirmed)
- 30-50% first-time rejection rate for DIY submissions (higher for sole proprietors)
- Campaign reviews currently taking 10-15 days per Twilio's own documentation
- Hacker News thread "Do 10DLC Requirements make it impossible for hobby projects to send SMS?" — 45 points, 19 comments, users describing process as "nightmare" and "designed to be obtuse," one commenter literally calling for "a wrapper opportunity here"
- 3CX forums full of users with multiple rejections, weeks of waiting, vague feedback
- Twilio's own vibe coding blog post acknowledges 10DLC friction, author routes around it using WhatsApp for testing
- Fiverr freelancers offering $10-55 registration gigs (demand signal for done-for-you service)

### Competitive landscape
- **No one targets vibe coders/indie developers specifically**
- TextBetter: white-glove registration bundled with SMS platform, $25/month
- Zing: full-service consulting for Twilio users, enterprise-focused
- Alive5: compliance review bundled with SMS platform, $5-100/month
- Telgorithm: high-volume ISVs (500K+ msg/month), 95% approval rate
- NotificationAPI/Pingram: handles registration for notification API customers
- **Gap: No AI-powered interview-and-generate workflow. No auto-generated compliance sites. No LLM-consumable deliverables.**

### Market size
- Twilio alone: 402K+ active accounts (Q4 2025), 77K net new in 2025
- Cursor: 7M developers. Replit: 30M+ users. Lovable: $100M ARR in 8 months.
- 84% of developers use or plan to use AI coding tools (Stack Overflow)
- Estimated SAM: 100K-300K potential users/year
- Conservative first-year target: 2,000-5,000 customers ($400K-$1M revenue)

### Regulatory trajectory (strongest tailwind)
- 10DLC getting stricter, not simpler. 100% of unregistered traffic blocked since Feb 2025.
- TCR added Authentication+ (Oct 2024), increased fees (Aug 2025)
- T-Mobile SMS fees rose 50% in 2024. Carrier fines up to $10K per violation.
- No alternative channel eliminates 10DLC need (RCS, toll-free, WhatsApp all have own issues)
- Industry projects 10DLC persists through at least 2030
- 53+ countries now require sender ID pre-registration globally

---

## 3. TECHNICAL ARCHITECTURE

### Stack
| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Frontend | Next.js on Vercel or Cloudflare Pages | Fast, modern, good DX with Claude Code |
| Design system | Untitled UI | Pre-built components, consistent design, no aesthetic decisions |
| Database | Supabase (Postgres) | Joel's existing toolkit, auth built-in, real-time subscriptions |
| Backend logic | Cloudflare Workers | Joel's existing toolkit, serverless, fast cold starts |
| Payments | Stripe Checkout | Standard, reliable, handles tax/receipts |
| SMS provider API | Twilio (v1 only) | Largest provider, best API, Joel's existing experience |
| Compliance site hosting | Cloudflare Pages (subdomain) | Static sites, auto-SSL, fast deployment |
| Email | Resend or Supabase built-in | Transactional emails (receipt, status updates, deliverable) |

### System architecture (high level)
```
[Customer] → [Intake Wizard (Next.js)] → [Stripe Payment]
                                              ↓
                                    [Supabase: store customer record]
                                              ↓
                              [Template Engine (Worker): generate artifacts]
                                              ↓
                            [Compliance Site Generator: deploy to subdomain]
                                              ↓
                          [Twilio Submission Worker: brand → campaign → number]
                                              ↓
                        [Webhook Listener: status updates → Supabase]
                                              ↓
                    [Approval detected → Generate deliverable → Send email]
                                              ↓
                          [Customer Dashboard: status, downloads, links]
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
  - stripe_payment_id
  - created_at

registrations
  - id (uuid, PK)
  - customer_id (FK)
  - status (enum: pending_payment, generating_artifacts, submitting_brand, brand_approved, submitting_campaign, campaign_approved, provisioning_number, complete, rejected, needs_attention)
  - twilio_brand_sid (nullable)
  - twilio_campaign_sid (nullable)
  - twilio_messaging_service_sid (nullable)
  - twilio_phone_number (nullable)
  - trust_score (nullable)
  - rejection_reason (nullable)
  - rejection_code (nullable)
  - submitted_at
  - approved_at
  - updated_at

generated_artifacts
  - id (uuid, PK)
  - registration_id (FK)
  - privacy_policy_text
  - terms_text
  - campaign_description
  - sample_messages (jsonb — array of 3-5 messages)
  - opt_in_description
  - compliance_site_url
  - deliverable_url (nullable — generated on approval)

twilio_credentials
  - id (uuid, PK)
  - customer_id (FK)
  - account_sid (encrypted)
  - auth_token (encrypted)
  - created_at
```

### Twilio API sequence
1. Create Brand Registration (`POST /v1/a2p/BrandRegistrations`) — async, returns brand_sid
2. Poll brand status or receive webhook — wait for APPROVED
3. (If standard brand) Trigger secondary vetting (`POST /v1/a2p/BrandRegistrations/{sid}/Vettings`)
4. Create Messaging Service (`POST /v1/Services`)
5. Create Campaign (`POST /v1/Services/{sid}/Compliance/Usa2p`) — async
6. Poll campaign status — wait for VERIFIED
7. Purchase phone number (`POST /v1/IncomingPhoneNumbers`) with area code preference
8. Add number to Messaging Service
9. Registration complete → generate deliverable → notify customer

### Sole proprietor flow (special handling)
- No EIN required — uses personal info
- OTP verification required (code sent to customer's phone) — **requires human-in-the-loop relay**
- Limited to 1 campaign, 1 phone number
- Lower throughput ceiling (adequate for indie apps)
- Simpler brand registration but same campaign requirements

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

### Per-use-case generated artifacts (example: Appointment Reminders)

**Campaign description template:**
"Messages are sent by {business_name} to opted-in customers to provide appointment reminders and scheduling confirmations for {service_type} services. Customers opt in by providing their phone number when booking an appointment at {website_url} or in person. Message frequency is approximately 2-4 messages per week. Reply STOP to unsubscribe. Reply HELP for help."

**Sample messages (3 required):**
1. "{business_name}: Reminder — your {service_type} appointment is tomorrow at {time}. Reply C to confirm or R to reschedule. Reply STOP to opt out."
2. "{business_name}: Your appointment has been confirmed for {date} at {time}. See you then! Reply STOP to unsubscribe."
3. "{business_name}: We have an opening on {date} at {time}. Would you like to book? Reply YES to confirm. Reply STOP to opt out."

**Opt-in description template:**
"Customers provide opt-in consent when booking an appointment through the {business_name} website at {website_url}. The booking form includes an unchecked checkbox with the following disclosure: 'By providing your phone number, you agree to receive appointment reminders and scheduling messages from {business_name}. Message frequency varies. Message and data rates may apply. Reply STOP to unsubscribe. Reply HELP for help.' Customers may also opt in verbally during in-person booking, at which time staff reads the SMS disclosure."

> **NOTE:** All templates must be refined based on actual approval/rejection data. Track which exact language passes and which gets rejected. This is the core IP.

---

## 5. THE DELIVERABLE (AI-CONSUMABLE INTEGRATION + COMPLIANCE CO-PILOT)

### What it is
Two markdown files that together give the customer's AI coding assistant everything it needs to integrate SMS correctly and keep it compliant long-term.

### File 1: MESSAGING_SETUP.md (Integration Kit)
```markdown
# SMS Integration for {app_name}
## Your credentials (add these to your .env file)
TWILIO_ACCOUNT_SID={actual_sid}
TWILIO_AUTH_TOKEN={scoped_api_key}  # Isolated per customer, not our master token
TWILIO_MESSAGING_SERVICE_SID={actual_sid}
TWILIO_PHONE_NUMBER={actual_number}

## What this app sends
{use_case_description}

## Send a message
{code_snippet — universal fetch-based implementation, no SDK required}

## Handle inbound replies
{webhook_endpoint_code}
{STOP/HELP handled automatically by Messaging Service}

## Opt-in form (required for compliance)
{embeddable HTML form with all 8 CTIA-required elements}

## Integration instructions
Tell your AI coding assistant:
"Read MESSAGING_SETUP.md and do the following:
1. Add the environment variables to my .env
2. Create a utility function for sending SMS
3. Create a POST endpoint at /api/sms/inbound for incoming messages
4. Add the SMS opt-in form to my sign-up page
5. Add sendSMS calls wherever I need notifications"

Also read SMS_GUIDELINES.md before making any changes to messaging functionality.
```

### File 2: SMS_GUIDELINES.md (Compliance Co-Pilot)
Written *to the AI coding assistant*, not to the human. Acts as a persistent system prompt.

Contents:
- Registration context (use case, approved message types, frequency, phone number)
- 5 hard rules (never send without opt-in, never ignore STOP, stay within use case, always identify sender, include opt-out language)
- Best practices (frequency limits, quiet hours, content quality, error handling)
- Consent collection requirements (8 mandatory elements, checkbox rules, what to store)
- Quick-reference scenarios ("Can I send to all my users?", "Can I add promos?")
- **Industry-specific modules** (appended based on detected vertical — see PRD_05 Addendum)

### Vertical-specific modules (17 industries)
When the customer's industry is detected during intake, the relevant operational module is appended to SMS_GUIDELINES.md. Each contains industry rules, safe/unsafe message patterns, recommended timing, and best practices the AI applies automatically.

Verticals: dental, general medical, mental health, physical therapy, veterinary, salon/spa, fitness, legal, financial, restaurant, real estate, home services, ecommerce, SaaS, education, nonprofit, automotive.

### Format decisions
- Universal code uses `fetch()` — works in any JS environment (Next.js, Node, Workers, etc.)
- No framework-specific code in v1 — the AI coding assistant handles adaptation
- Credentials are real and ready to use — no "replace with your..." placeholders
- Each customer gets a scoped Twilio API key, not our master auth token
- Natural language instructions designed for LLM consumption

---

## 6. COMPLIANCE SITE SPECIFICATION

### What it is
A minimal static website deployed at `{slug}.{compliance_domain}` (e.g., `petbook.smsverified.com`) on a neutral domain that looks like the customer's own site, not RelayKit's. Satisfies carrier review requirements.

### Pages
1. **Home** — App/business name, 2-3 sentence description, contact email, link to privacy policy and terms
2. **Privacy Policy** — Generated from template, includes mandatory mobile data non-sharing clause
3. **Terms of Service** — Generated from template, includes messaging-specific terms
4. **SMS Opt-In** — Working form with all required disclosure language, unchecked consent checkbox

### Technical requirements
- HTTPS (auto-SSL via Cloudflare)
- No broken links
- Must be publicly accessible (no auth, no "coming soon")
- Clean, professional appearance (Untitled UI components or simple HTML/CSS)
- Must match brand name in registration

### Critical privacy policy language (mandatory for approval)
Must include verbatim or equivalent:
"We do not share, sell, or distribute your mobile phone number or any personal information collected through our SMS messaging program to third parties for their marketing purposes. Mobile opt-in data and consent will not be shared with any third parties or affiliates for marketing or promotional purposes."

---

## 7. BUILD PLAN (14 DAYS)

### Working approach
- Joel builds with Claude Code
- Design system: Untitled UI
- PRDs written before any code
- Each PRD is a separate file uploaded to Claude Code conversations as needed

### Day 1-2: PRD writing
Write all PRDs with Claude (browser). Deliverables:
- [ ] PRD_01_INTAKE_WIZARD.md
- [ ] PRD_02_TEMPLATE_ENGINE.md
- [ ] PRD_03_COMPLIANCE_SITE.md
- [ ] PRD_04_TWILIO_SUBMISSION.md
- [ ] PRD_05_DELIVERABLE.md
- [ ] PRD_06_DASHBOARD.md
- [ ] PRD_07_LANDING_PAGE.md

### Days 3-7: Core product build
- [ ] Project scaffolding (Next.js + Supabase + Stripe)
- [ ] Database schema and migrations
- [ ] Intake wizard UI (use case tiles → question flow → Stripe checkout)
- [ ] Template engine (intake answers → generated artifacts)
- [ ] Compliance site generator (template → deploy to subdomain)
- [ ] Manual submission path (review artifacts → submit via Twilio console/API)
- **Milestone: Can take a real customer from landing page to payment to generated artifacts**

### Days 8-11: Automation layer
- [ ] Programmatic Twilio brand registration
- [ ] Programmatic campaign submission
- [ ] Phone number purchase and provisioning
- [ ] Webhook listeners for status changes
- [ ] Rejection parsing and alerting
- [ ] Customer dashboard (registration status, compliance site link, deliverable download)
- [ ] Status notification emails
- **Milestone: Full automated pipeline from payment to approval monitoring**

### Days 12-14: Deliverable engine, polish, launch
- [ ] Deliverable generator (MESSAGING_SETUP.md with real credentials)
- [ ] Approval email with deliverable
- [ ] Landing page with marketing copy
- [ ] Integration testing with real Twilio submissions
- [ ] Edge case handling and error states
- [ ] Production deployment
- **Milestone: Live product accepting real customers**

### Explicitly NOT in v1 (cut to protect timeline)
- Stack-specific deliverables (launch with universal format)
- Multiple use-case-specific landing pages (one main landing page)
- Recurring subscription billing
- Automated rejection auto-fix (manual review initially)
- Multi-provider support (Twilio only)
- Mobile app
- Referral program
- Analytics dashboard beyond basic status

---

## 8. GO-TO-MARKET STRATEGY

### Phase 1: Validate (weeks 1-4 post-launch)
- Post in vibe coding communities: Cursor forums, Replit community, Bolt/Lovable discords, r/SideProject, r/SaaS, indie hacker communities
- Answer every 10DLC question on Reddit, HN, Stack Overflow
- Build-in-public posts on Twitter/X
- Target: first 50 paying customers
- Measure: conversion rate, approval rate, customer feedback

### Phase 2: Organic growth (months 2-3)
- SEO content targeting: "10DLC registration rejected," "Twilio campaign denied," "how to register SMS campaign," "vibe coding SMS," "add texting to my app"
- Use-case-specific blog posts: "How to add appointment reminders to your app," "Ship order notifications in 48 hours"
- Publish approval rate as marketing proof point

### Phase 3: Paid acquisition (month 3+, only if unit economics confirm)
- Google Ads on high-intent search terms
- Sponsored posts in developer communities
- Target CAC: $30-50 (3-4x ROAS at $199 price point)
- Start with $2-3K/month, self-fund from revenue

### Key marketing message
**"Your app can send text messages. We handle the carrier compliance."**

Secondary: "90%+ first-time approval rate. Live in 48 hours. $199."

### Use case as marketing channel
Each use case becomes its own landing page and acquisition channel:
- "Get your appointment reminder app sending texts in 48 hours"
- "Ship your order notification system with real SMS"
- "Add verification codes to your app — we handle the compliance"

---

## 9. FINANCIAL MODEL

### Unit economics — Registration (one-time)
| Item | Amount |
|------|--------|
| Revenue per customer | $199 |
| Twilio pass-through costs | $19.50-61 |
| Compliance site hosting (monthly amortized) | ~$1 |
| Payment processing (Stripe ~3%) | ~$6 |
| Support/review time (30-60 min @ $15/hr) | $7.50-15 |
| **Gross profit per customer** | **$116-165** |
| **Gross margin** | **58-83%** |

### Unit economics — Compliance Shield (recurring, post-launch)
| Item | Amount |
|------|--------|
| Monthly revenue per subscriber | $29 |
| Claude API cost (sampling ~10% of messages) | ~$0.25/mo |
| Infrastructure (scanning, storage) | ~$1/mo |
| Stripe processing | ~$0.87/mo |
| **Monthly gross profit per subscriber** | **~$26.88** |
| **Gross margin** | **~93%** |

### Targets
| Milestone | Customers | One-time Rev | Shield MRR (20% attach) | Timeline |
|-----------|----------|-------------|------------------------|----------|
| Validation | 50 | $9,950 | $290/mo | Month 1-2 |
| Traction | 500 | $99,500 | $2,900/mo | Month 3-6 |
| Scale | 2,000 | $398,000 | $11,600/mo | Year 1 |

---

## 10. DECISIONS MADE & OPEN QUESTIONS

### Decided
- **Product name:** RelayKit
- **Twilio account structure:** ISV model — we operate our own Twilio account and register customer brands/campaigns under it. Customers never touch Twilio. We provision numbers and hand them credentials in the deliverable.
- **Sole proprietor OTP flow:** Async step during onboarding — after payment, Twilio sends OTP to customer's phone, customer enters it in the dashboard to continue registration.
- **Encrypted credential storage:** Supabase Vault for any stored API keys.

### Still open
- [ ] **Domain:** Need to acquire relaykit.com or alternative. Check availability.
- [ ] **Compliance site domain:** Use a neutral domain (not relaykit.com subdomain) so compliance sites look like they belong to the customer's business. Candidates TBD.

---

## 11. PROJECT FILES INDEX

| File | Status | Description |
|------|--------|-------------|
| PROJECT_OVERVIEW.md | ✅ Complete | This file — master reference |
| PRD_01_INTAKE_WIZARD.md | ✅ Complete | Use case tiles, advisory screen, question flows, Stripe checkout |
| PRD_02_TEMPLATE_ENGINE.md | ✅ Complete | Artifact generation logic and all templates |
| PRD_03_COMPLIANCE_SITE.md | ✅ Complete | Static site structure, deployment, HTML templates |
| PRD_04_TWILIO_SUBMISSION.md | ✅ Complete | API sequence, state machine, rejection handling |
| PRD_05_DELIVERABLE.md | ✅ Complete | MESSAGING_SETUP.md + SMS_GUIDELINES.md format and generation |
| PRD_05_ADDENDUM_VERTICALS.md | ✅ Complete | 17 industry-specific AI instruction modules |
| PRD_06_DASHBOARD.md | ✅ Complete | Customer post-purchase experience |
| PRD_07_LANDING_PAGE.md | ✅ Complete | Marketing site, copy, conversion flow |
| PRD_08_COMPLIANCE_MONITORING.md | ✅ Complete | Message scanning, Compliance Shield, sensitive industry handling |
| SMS_GUIDELINES_TEMPLATE.md | ✅ Complete | Base compliance co-pilot template |
| WORKING_BACKWARDS_EVOLVED.md | ✅ Complete | Full product vision, working backwards from delivery |
| BUILD_LOG.md | ✅ Active | Running log of progress and decisions |

---

## 12. CONVERSATION HISTORY CONTEXT

This project originated from a conversation on Feb 26, 2026 where Joel (building LightLift, a restaurant SMS marketing platform) reflected on his painful experience with A2P 10DLC registration through Twilio. The conversation identified that the registration friction isn't just a personal annoyance but a systemic barrier that prevents a large population of builders — especially vibe coders — from shipping SMS features. Key insights accumulated across sessions:

1. **The demand can be created, not just captured.** Many potential customers don't know SMS is accessible to them. The marketing message is aspirational ("your app can send texts") not remedial ("fix your rejected registration").

2. **Auto-generating compliance websites is a unique value-add.** Joel had to create a placeholder website during his own registration process. This is a confirmed blocker that no competitor addresses.

3. **Use case segmentation with expert advisory makes intake fast and maximizes coverage.** Instead of open-ended questions, use case tiles pre-load defaults, and the advisory screen helps customers expand their registration to cover future needs before committing.

4. **The AI-consumable deliverable + compliance co-pilot is the key differentiator.** Two files: MESSAGING_SETUP.md for integration, SMS_GUIDELINES.md for ongoing compliance. The co-pilot is written to the AI coding assistant, not the human, and is customized per industry vertical.

5. **Vertical-specific knowledge is a moat.** 17 industry modules (healthcare, legal, restaurant, etc.) ship with the deliverable, giving each customer's AI coding assistant deep operational knowledge about SMS in their specific industry.

6. **Compliance monitoring is both platform protection and recurring revenue.** As the ISV, we see all message traffic. Baseline scanning is included and non-optional. Compliance Shield at $29/month adds Claude-powered drift analysis and weekly reports.

7. **"Picks and blue jeans during the gold rush."** We don't need customers' apps to succeed. We just need builders to keep building apps that want to send texts. The vibe coding wave drives demand.

8. **The product has a time-bounded window of maximum opportunity.** The vibe coding wave is happening now. Speed to market matters more than perfection. Joel committed to a 2-week build leveraging Claude Code and tight PRDs.

9. **Twilio ISV setup is the critical path.** The Primary Customer Profile (with photo ID, selfie, and ISV Reseller designation) should be submitted immediately — approval takes 1-5+ business days and is a blocker for processing any customer registrations.

10. **Architecture type #4** (no subaccounts, Messaging Services mapped to customers) is appropriate for v1 volume, with a plan to migrate to type #1 (subaccounts) at scale for compliance isolation.
