# PRD_07: LANDING PAGE
## RelayKit — Marketing Site & Conversion Flow
### Version 3.0 — Mar 3, 2026

> **Dependencies:** Links to sandbox signup and intake wizard (PRD_01). Standalone — no dependencies on other PRDs.
>
> **CHANGE LOG (v3.0):** Hero repositioned around AI coding tool workflow and build spec. How-it-works rewritten to reflect message plan builder → build spec → key swap flow. Free tier expanded to include message plan builder and build spec as line items. FAQ additions: AI coding tool compatibility, build spec contents. BYO Twilio fork point added to pricing section with email capture. SEO keywords updated for AI SMS integration. Conversion tracking adds `byo_waitlist_signup` event.
>
> **What v2.0 described:** Hero led with "Start building with SMS in 5 minutes." How-it-works described get-API-key → register → go-live. Free tier was just sandbox API key + testing. BYO Twilio was a one-line mention in FAQ.
>
> **What v3.0 describes:** Hero leads with AI coding tool workflow ("Tell your AI to add SMS"). How-it-works maps to dashboard experience: curate messages → generate build spec → key swap. Free tier highlights message plan builder and build spec as key differentiators. BYO Twilio gets email capture in pricing section. FAQ expanded for build spec and AI tool questions.

---

## 1. OVERVIEW

The landing page is a single-page marketing site at `relaykit.com` that converts visitors into sandbox signups, and from there into paying customers. It needs to accomplish three things in under 30 seconds: show that you can add SMS to your app by telling your AI coding tool to read a build spec, explain that RelayKit handles compliance when you're ready to go live, and get them to click "Start building free."

### URL
```
relaykit.com/
```

### Target visitor
A developer (likely using AI coding tools) who either:
1. **Wants to add SMS to their app** — searching for SMS APIs, attracted by the build spec and instant sandbox. Not yet aware of the compliance burden.
2. **Has hit the 10DLC wall** — searched for "10DLC registration rejected" or similar, high intent, wants the problem solved now.
3. **Is worried about compliance** — knows about TCPA, carrier fines, or has been burned before. Attracted by the compliance proxy.

The page must work for all three. Lead with the AI-first build experience (the hook), then address compliance (the why), then pricing (the how much).

### Design
- Untitled UI components
- Clean, fast, professional
- Dark nav, white body, single CTA color
- No stock photos, no hero illustrations — text-forward with subtle UI previews
- Mobile responsive

---

## 2. PAGE STRUCTURE

### Section 1: Hero
```
[Nav: RelayKit logo                   Login  |  Start building free →]

Tell your AI to add SMS to your app.

Pick your messages. Generate a build spec. Your AI coding tool reads it,
builds your SMS integration, and you test with a real API.
Go live when you're ready. No credit card required.

[Start building free →]

Developers building with:
[Cursor logo] [Claude Code logo] [Lovable logo] [Replit logo] [Bolt logo]
```

**Notes:**
- Primary CTA: "Start building free →" links to sandbox signup
- Secondary CTA in nav: "Login" for returning users
- No price in hero — lead with free. Price comes in the "What you get" section.
- "Developers building with" — these are the AI coding tools that consume the build spec. More prominent than v2.0 — they're central to the workflow, not just audience signaling. Aspirational in v1 (list tools our audience uses). Replace with real testimonials once we have them.
- Hero subtext emphasizes the developer's workflow: curate messages → generate spec → AI builds it. The developer designs their SMS feature; their AI tool writes the code.

### Section 2: The problem (empathy)
```
Every other SMS API makes you wait.

You want to add texting to your app. But first: register your business
with carriers, build a compliance site, write a privacy policy, submit
a campaign, wait 1-3 weeks, and hope it doesn't get rejected (40%+ do).

Then you're on the hook for TCPA compliance — $500 to $1,500 per
wrong text. Opt-out enforcement, quiet hours, content rules.

Most developers give up on SMS entirely. You don't have to.
```

**Unchanged from v2.0.** This section works because it's true and doesn't depend on the product shape.

### Section 3: How it works (3 steps)
```
Pick your messages. Generate a spec. Ship it.

[1]  Choose what your app sends
     Pick your use case, browse compliant message templates,
     toggle what you need, edit the wording. You're designing
     your SMS feature — we handle the compliance boundaries.

[2]  Generate your build spec
     One click creates a markdown file your AI coding tool reads
     to build your entire SMS integration. Drop it in your project
     and tell your AI: "Read SMS_BUILD_SPEC.md and build my SMS feature."

[3]  Go live with one key swap
     Register when you're ready. Same API, same code.
     Swap your sandbox key for your live key.
     Your app sends real texts.
```

**Notes:**
- Steps now map to the actual dashboard experience: use case selection + message plan builder → build spec generation → registration + key swap.
- Step 1 is about the developer curating their messages (which simultaneously pre-populates registration). This is the triple-duty design from PRD_06.
- Step 2 highlights the build spec as the primary deliverable and gives the exact prompt developers will use with their AI tool.
- Step 3 is unchanged in substance from v2.0 — it's the same key-swap story, just tighter.

### Section 4: What you get
```
Everything you need. Nothing you don't.

INSTANT — FREE
  ✓ Sandbox API key (real, working API)
  ✓ Message plan builder — pick and customize your messages
  ✓ Build spec for your AI coding tool
  ✓ SMS compliance guidelines for your project
  ✓ Full outbound + inbound message testing
  ✓ Opt-out handling (STOP/START)
  ✓ Same compliance checks as production
  ✓ No credit card, no time limit

SETUP — $199
  ✓ 10DLC brand and campaign registration
  ✓ Hosted compliance site with privacy policy and terms
  ✓ Carrier-approved campaign descriptions and sample messages
  ✓ Your curated messages become carrier-registered canon messages
  ✓ SMS opt-in form with all required disclosures
  ✓ Rejection handling — we fix and resubmit, no extra cost
  ✓ MESSAGING_SETUP.md — production build spec for your AI coding tool

MONTHLY — $19/month
  ✓ Dedicated phone number
  ✓ 500 messages included
  ✓ Compliance proxy — every message checked before delivery
  ✓ Opt-out enforcement, quiet hours, content scanning
  ✓ Drift detection — we alert you if messages leave your approved use case
  ✓ Message preview endpoint — validate templates before deploying
  ✓ Auto-scaling — $15 per additional 1,000 messages, no interruption

---

Need registration only?
If you already have a Twilio account and just need help with 10DLC
registration and compliance artifacts, we're building a $199 one-time
registration-only option.

[Get notified when it launches →]  [email input] [Submit]
```

**Notes:**
- Free tier now leads with message plan builder and build spec — these are the key differentiators. No other SMS API gives you a document your AI tool can read to build the integration.
- SETUP tier adds "Your curated messages become carrier-registered canon messages" — connects the sandbox work to the registration outcome. Also reframes MESSAGING_SETUP.md as "production build spec" to connect it to the sandbox build spec.
- MONTHLY tier unchanged from v2.0.
- BYO Twilio fork point placed after the three tiers per briefing Option C — it's where someone comparing pricing would look for alternatives. Does not distract from primary sandbox CTA. Small, secondary, just email capture.
- BYO email stored in `byo_waitlist` Supabase table. No automation for v1 — just collect emails.

### Section 5: Use cases (shows breadth)
```
Works for whatever you're building.

[Tiles — display only]
Appointment reminders · Order notifications · Verification codes
Customer support · Marketing · Team alerts · Community · Waitlists
```

**Unchanged from v2.0.** These match the 8 use case tiles from PRD_06 Section 3. Clicking a tile does nothing on the landing page — they're display-only to show breadth.

### Section 6: FAQ
```
Questions

Q: Can I try before paying?
A: Yes — the sandbox is free, no credit card required. Pick your use case,
customize your messages, generate a build spec, and build your entire SMS
integration before paying anything. You only pay when you're ready to send
to real users.

Q: Does this work with my AI coding tool?
A: Yes. The build spec is a markdown file designed for AI coding assistants.
It works with Cursor, Claude Code, Copilot, Lovable, Bolt, Replit, and
any tool that can read project files. Tell your AI: "Read
SMS_BUILD_SPEC.md and build my SMS feature."

Q: What's in the build spec?
A: Everything your AI coding tool needs: your message templates with trigger
logic, the API endpoint and authentication, error handling for compliance
violations, webhook setup for inbound messages, and an opt-in form template.
It's use-case-specific — a dental appointment reminder app gets different
templates than an e-commerce order notification app.

Q: How long does registration take?
A: Typically 3-10 business days after you complete the intake. Your sandbox
continues to work while you wait. When approved, swap one API key and
you're live.

Q: Do I need a Twilio account?
A: No. We handle everything. Your app talks to RelayKit's API — we handle
Twilio, carriers, and compliance behind the scenes.

Q: What if my registration gets rejected?
A: We fix it and resubmit at no extra cost. Our templates are optimized
for first-time approval, but if carriers want changes, we handle it.

Q: Do I need an EIN / business entity?
A: No. We support sole proprietor registration — no EIN or LLC required.
You're limited to one campaign and one phone number, which is plenty
for most indie apps.

Q: What compliance does RelayKit handle automatically?
A: Every message through our API is checked for opt-out violations,
prohibited content (SHAFT-C), quiet hours, and rate limits. Violations are
blocked before reaching carriers. We also run drift detection to catch
messages gradually moving outside your registered use case.

Q: Can I validate my message templates before deploying?
A: Yes — the message preview endpoint checks any message against your
registration and compliance rules, and suggests compliant alternatives
if anything needs to change.

Q: What if I already have a Twilio account?
A: We're building a registration-only option for developers with existing
Twilio accounts. We'll handle the 10DLC paperwork and compliance
artifacts — you keep your Twilio setup.
[Get notified when it launches →]

Q: Can I use this with [Lovable / Bolt / Replit / etc.]?
A: Yes. The API works with any JavaScript-based framework. Your AI coding
tool reads the build spec and handles the framework-specific wiring.
The build spec includes everything the AI needs — message templates,
API setup, error handling, and webhook configuration.
```

**Changes from v2.0:**
- "Can I try before paying?" updated to mention message plan builder and build spec
- "Does this work with my AI coding tool?" — new, addresses the primary audience directly
- "What's in the build spec?" — new, handles the follow-up question and communicates depth
- "What if I already have a Twilio account?" — expanded with warmer language and email capture CTA
- "Can I use this with [Lovable / Bolt / Replit / etc.]?" — updated to reference build spec instead of generic "integration kit"
- FAQ order changed: moved AI tool questions near the top since they address the hero's positioning

### Section 7: CTA (closing)
```
Add SMS to your app. Let AI handle the code.

[Start building free →]

Free sandbox. No credit card. Build spec in minutes.
```

**Notes:**
- Closing CTA echoes the AI-first positioning from the hero
- "Build spec in minutes" replaces "Live in minutes" — more accurate for the sandbox experience (you're not live until you register, but you have a build spec immediately)

### Footer
```
RelayKit

Product          Company          Legal
How it works     About            Privacy Policy
Pricing          Contact          Terms of Service
FAQ

© 2026 RelayKit. All rights reserved.
```

**Unchanged from v2.0.**

---

## 3. SOCIAL PROOF STRATEGY

v1 launches without testimonials. The page structure accommodates them for when we have them.

### Phase 1 (launch): Tool logos
"Developers building with Cursor, Claude Code, Lovable, Replit, and Bolt use RelayKit."
(Technically true once our first customers from those platforms exist.)

### Phase 2 (after 20+ customers): Metrics
"90%+ first-time approval rate across {X} registrations."
"{Y} developers building in sandbox right now."
"{Z} build specs generated this month."

### Phase 3 (after 50+ customers): Testimonials
Customer quotes with use case context:
"I told Cursor to read the build spec and had my SMS integration working in 10 minutes. Swapped the key when registration came through and never looked back." — Name, app description

### Placement
Between Sections 3 and 4 (after "how it works," before "what you get").

---

## 4. SEO

### Page title
"SMS API for Developers | AI Build Spec, Free Sandbox — RelayKit"

### Meta description
"Free SMS sandbox with AI build spec — pick your messages, generate a spec, and let your AI coding tool build the integration. RelayKit handles 10DLC registration and compliance. No credit card required."

### Target keywords (inform content but don't stuff)
- Primary: "SMS API for developers", "SMS sandbox", "10DLC registration service"
- Secondary: "AI SMS integration", "build spec for SMS", "compliant SMS API", "TCPA compliant messaging", "Twilio 10DLC rejected", "10DLC registration help"
- Long tail: "how to add SMS to my app", "vibe coding SMS", "add texting to Lovable app", "free SMS API testing", "SMS compliance proxy", "AI coding tool SMS", "Cursor SMS integration", "Claude Code SMS"

### Technical SEO
- Semantic HTML (h1, h2, section, article)
- Open Graph tags for social sharing
- Fast load time (static page, no client-side rendering needed for SEO)
- Sitemap.xml with landing page + future blog posts

---

## 5. CONVERSION TRACKING

### Events
| Event | Trigger |
|-------|---------|
| `page_view` | Landing page loads |
| `cta_click_hero` | Hero CTA clicked |
| `cta_click_bottom` | Bottom CTA clicked |
| `sandbox_signup_start` | Sandbox signup form shown |
| `sandbox_signup_complete` | Sandbox account created |
| `byo_waitlist_signup` | BYO Twilio email submitted |
| `faq_expand` | FAQ item opened |
| `scroll_depth_50` | Visitor scrolls to 50% |
| `scroll_depth_100` | Visitor scrolls to bottom |

### Implementation
Plausible Analytics (privacy-friendly, no cookie banner needed) or simple custom events to `/api/events`. Decide during build.

---

## 6. BYO TWILIO WAITLIST

### What it is
A simple email capture for developers who already have Twilio accounts and want registration-only service. Phase 2 feature — the landing page just collects interest.

### Placement
In Section 4 (What you get), below the three pricing tiers. Small, secondary — does not compete with the primary sandbox CTA.

### Implementation
- Inline email input + submit button
- No modal, no separate page
- On submit: insert into `byo_waitlist` Supabase table, show confirmation text ("We'll email you when it's ready.")
- Fire `byo_waitlist_signup` tracking event

### Database
```sql
CREATE TABLE byo_waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### What NOT to build
- No email automation (v1 is just collection)
- No BYO-specific landing page or section
- No pricing details beyond "$199 one-time" mention
- No feature comparison between full RelayKit and BYO

---

## 7. IMPLEMENTATION NOTES

### File structure
```
app/
  page.tsx                # Landing page
  login/
    page.tsx              # Magic link login for returning customers
  signup/
    page.tsx              # Sandbox signup (email → magic link)

components/
  landing/
    Hero.tsx
    Problem.tsx
    HowItWorks.tsx
    WhatYouGet.tsx
    BYOWaitlist.tsx        # New — email capture component
    UseCases.tsx
    FAQ.tsx
    ClosingCTA.tsx
    Footer.tsx
```

### Performance
- Landing page should be statically generated (no server-side data fetching)
- Target: < 1 second load time
- No heavy JS bundles — this page is mostly text and CSS
- Images: only tool logos (SVG, inline or lazy-loaded)
- BYO waitlist form is the only interactive element requiring client JS

### A/B testing (future)
Structure components to be easily swappable for testing different:
- Headlines ("Tell your AI to add SMS to your app" vs "Add SMS to your app in minutes")
- CTA text ("Start building free" vs "Get your build spec" vs "Add SMS to your app")
- Whether to show price in hero vs only in "What you get"
- Sandbox signup placement (hero vs separate page)
- Build spec emphasis (hero subtext vs dedicated section)

---

## 8. WHAT NOT TO DO

These are explicitly out of scope per the briefing:

- **Don't add the message plan builder as a live demo on the landing page.** The landing page sells the concept; the dashboard delivers the experience. Screenshots or mockups of the plan builder are acceptable as social proof imagery (Phase 2), but not an interactive widget.
- **Don't make the BYO path equal prominence to the sandbox path.** BYO is Phase 2. It gets a mention and an email capture, not a full section.
- **Don't change the pricing numbers.** $199 setup, $19/month, $15/1000 overage are locked per PRICING_MODEL_UPDATE.md.
- **Don't add the AI compliance co-pilot to the landing page.** It's Phase 2. The build spec and message plan builder are v1 features. The co-pilot is aspirational.
- **Don't oversell.** No "revolutionary," no "game-changing." State the value proposition plainly: free sandbox, real API, build spec for your AI tool, compliance handled, one key swap to go live.
