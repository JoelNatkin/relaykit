# PRD_01: INTAKE WIZARD
## RelayKit — Use Case Selection, Customer Intake, and Payment Flow
### Version 1.0 — Feb 26, 2026

> **Dependencies:** This PRD defines the data contract that feeds PRD_02 (Template Engine), PRD_03 (Compliance Site), and PRD_04 (Twilio Submission). All downstream components consume the `customer` and `registration` records created here.

---

## 1. OVERVIEW

The intake wizard is a 5-screen flow that takes a visitor from "I need my app to send texts" to paid customer in under 5 minutes. The flow is: Use Case Selection → Use Case Advisory → Business Details → Review & Confirm → Payment. After payment, the customer is redirected to their dashboard (PRD_06) where registration begins automatically.

The advisory screen (Screen 1b) is a key differentiator. It shows the customer exactly what they're committing to — what messages they'll be able to send and what they won't — and helps them expand their registration to cover future needs before they lock in. This is where RelayKit acts as the expert, crafting the right registration to maximize the customer's flexibility while maintaining approval odds.

### Design system
- **Untitled UI** components throughout
- Clean, minimal, high-trust aesthetic — this is a payment flow, not a playground
- Mobile responsive but desktop-first (vibe coders are on laptops)
- No sidebar navigation — single column wizard with progress indicator

### URL structure
```
relaykit.com/                    → Landing page (PRD_07)
relaykit.com/start               → Screen 1: Use Case Selection
relaykit.com/start/scope         → Screen 1b: Use Case Advisory
relaykit.com/start/details       → Screen 2: Business Details
relaykit.com/start/review        → Screen 3: Review & Confirm
relaykit.com/start/payment       → Stripe Checkout (hosted)
relaykit.com/dashboard           → Post-payment dashboard (PRD_06)
```

---

## 2. SCREEN 1: USE CASE SELECTION

### URL
`/start`

### Layout
- Headline: **"What does your app do?"**
- Subhead: "Pick the closest match. This helps us write your registration for maximum approval odds."
- 8 use case tiles in a 2x4 grid (2x2 on mobile, scrollable)
- Each tile: icon + label + one-line description
- Single select — clicking a tile highlights it and enables the Continue button
- Continue button (disabled until selection) at bottom

### Use case tiles

| ID | Label | Description | Icon suggestion |
|----|-------|-------------|-----------------|
| `appointments` | Appointment reminders | Confirmations, reminders, rescheduling | Calendar |
| `orders` | Order & delivery updates | Shipping notifications, delivery status | Package |
| `verification` | Verification codes | OTP, 2FA, login codes | Shield |
| `support` | Customer support | Two-way support conversations | MessageCircle |
| `marketing` | Marketing & promos | Offers, promotions, announcements | Megaphone |
| `internal` | Team & internal alerts | Staff notifications, internal ops | Users |
| `community` | Community & groups | Group messaging, community updates | Globe |
| `waitlist` | Waitlist & reservations | Booking confirmations, waitlist updates | ClipboardList |

### Behavior
- Tile click: highlight selected tile (primary color border + subtle background), deselect any previously selected tile
- Continue button: appears fixed at bottom of viewport on mobile
- Back: browser back returns to landing page
- State: selected use case stored in client-side state (React state or URL param), not yet persisted to database

### Data captured
```typescript
{
  use_case: 'appointments' | 'orders' | 'verification' | 'support' | 'marketing' | 'internal' | 'community' | 'waitlist'
}
```

---

## 2B. SCREEN 1B: USE CASE ADVISORY

### URL
`/start/scope`

### Purpose
This screen is the expert advisory moment. It shows the customer what their selected use case allows and doesn't allow, then proactively asks if they'll need adjacent functionality. Based on their answers, we may upgrade their TCR campaign type to give them broader coverage while maintaining high approval odds.

This is where we prevent the scenario where someone registers for appointment reminders, then six months later wants to send a birthday discount and discovers they can't without a whole new registration.

### Layout
- Headline: **"Let's make sure your registration covers everything you need"**
- Subhead: "Your use case determines what messages carriers will allow you to send. We want to get this right so you don't hit limitations later."
- Three sections stacked vertically: What's included, What's not included, Expansion options
- Continue button at bottom
- Back link to return to use case selection

### Section 1: What's included (green checkmarks)

Dynamic content based on selected use case. Displayed as a card with a green left border.

**Header:** "With a {use_case_label} registration, you can send:"

| Use case | Included capabilities |
|----------|----------------------|
| appointments | ✓ Appointment confirmations and reminders · ✓ Rescheduling and cancellation notices · ✓ Follow-up messages after appointments · ✓ Two-way replies (customer can text back to confirm/reschedule) |
| orders | ✓ Order confirmations · ✓ Shipping and tracking notifications · ✓ Delivery confirmations · ✓ Return and exchange status updates · ✓ Two-way replies for delivery issues |
| verification | ✓ One-time passwords (OTP) · ✓ Two-factor authentication codes · ✓ Phone number verification · ✓ Login confirmation codes |
| support | ✓ Support ticket acknowledgments · ✓ Status updates on open tickets · ✓ Resolution notifications · ✓ Two-way support conversations · ✓ Customer satisfaction follow-ups |
| marketing | ✓ Promotional offers and discount codes · ✓ Product and service announcements · ✓ Sale and event notifications · ✓ Loyalty and rewards updates · ✓ Newsletter-style updates |
| internal | ✓ Shift and schedule notifications · ✓ Operational alerts and updates · ✓ Team meeting reminders · ✓ System status notifications · ✓ Internal policy updates |
| community | ✓ Event announcements and reminders · ✓ Community news and updates · ✓ Membership notifications · ✓ Group activity alerts · ✓ RSVP collection via reply |
| waitlist | ✓ Waitlist position updates · ✓ "Your table/spot is ready" alerts · ✓ Reservation confirmations · ✓ Availability notifications · ✓ Two-way replies (accept/decline) |

### Section 2: What's not included (amber/yellow border)

**Header:** "This registration does NOT cover:"

| Use case | Not included |
|----------|-------------|
| appointments | ✗ Marketing offers or discount codes · ✗ Promotional announcements · ✗ Review requests · ✗ Newsletters or general updates |
| orders | ✗ Marketing offers to past customers · ✗ Promotional announcements · ✗ Review requests · ✗ Cross-selling or upselling messages |
| verification | ✗ Any non-security messages · ✗ Marketing or promotions · ✗ Account updates unrelated to verification · ✗ Newsletters |
| support | ✗ Outbound marketing or promotions · ✗ Messages not initiated by a support interaction · ✗ Cold outreach · ✗ Review requests |
| marketing | ✗ Messages to people who haven't explicitly opted in to marketing · ✗ Content from other brands (affiliate marketing) · Note: Marketing has the strictest consent requirements — every recipient must have checked a specific marketing opt-in checkbox |
| internal | ✗ Messages to customers or external contacts · ✗ Marketing content · ✗ Messages to anyone who isn't a team member |
| community | ✗ Commercial advertising · ✗ Messages to non-members · ✗ Sponsored content from third parties |
| waitlist | ✗ Marketing offers · ✗ Promotional content · ✗ Messages unrelated to reservations and waitlist |

### Section 3: Expansion options (interactive)

**Header:** "Will you also need any of these in the future?"

Show 3-4 checkboxes based on the selected use case. These represent common adjacent needs that would require a broader registration. Checking any of these triggers a campaign type upgrade.

| Use case | Expansion options shown |
|----------|----------------------|
| appointments | ☐ Send promotional offers to past clients (e.g., discounts, seasonal specials) · ☐ Request reviews or feedback after appointments · ☐ Send birthday or anniversary messages |
| orders | ☐ Send promotional offers to past customers · ☐ Announce new products to existing customers · ☐ Request reviews after delivery |
| verification | ☐ Send account-related notifications (password resets, security alerts) · ☐ Send onboarding or welcome messages |
| support | ☐ Send proactive outreach (e.g., known issue alerts) · ☐ Follow up with satisfaction surveys · ☐ Send promotional offers to support contacts |
| marketing | (No expansion needed — marketing is already the broadest use case) |
| internal | ☐ Send messages to contractors or freelancers (not full-time staff) · ☐ Send operational alerts to customers |
| community | ☐ Send sponsored or partner content · ☐ Collect payments or fees via SMS links |
| waitlist | ☐ Send promotional offers to past guests · ☐ Announce new availability or special events · ☐ Request reviews after visits |

### Campaign type upgrade logic

When the customer checks expansion options, we silently upgrade the TCR campaign type to accommodate broader messaging while maintaining approval odds:

```typescript
function determineCampaignType(useCase: string, expansions: string[]): string {
  // If no expansions selected, use the default narrow type
  if (expansions.length === 0) {
    return DEFAULT_CAMPAIGN_TYPES[useCase];
  }
  
  // If any promotional/marketing expansion is selected, upgrade to MIXED
  const hasPromoExpansion = expansions.some(e => 
    e.includes('promotional') || e.includes('offers') || e.includes('reviews')
  );
  
  if (hasPromoExpansion) {
    return 'MIXED'; // Covers both transactional and promotional
  }
  
  // For non-promotional expansions, use LOW_VOLUME_MIXED
  return 'LOW_VOLUME_MIXED';
}

const DEFAULT_CAMPAIGN_TYPES: Record<string, string> = {
  appointments: 'CUSTOMER_CARE',
  orders: 'DELIVERY_NOTIFICATIONS',
  verification: 'TWO_FACTOR_AUTHENTICATION',
  support: 'CUSTOMER_CARE',
  marketing: 'MARKETING',
  internal: 'LOW_VOLUME',
  community: 'LOW_VOLUME',
  waitlist: 'MIXED',
};
```

### When campaign type upgrades

If an expansion is selected:
1. Show an inline note below the checkboxes: **"Got it — we'll register you for a broader messaging category that covers both {original_use_case_label} and {expansion_description}. This may require slightly stricter consent language on your opt-in form, which we'll handle automatically."**
2. The template engine (PRD_02) uses the expanded campaign type and adjusts:
   - Campaign description to cover both the primary use case and expansions
   - Sample messages to include at least one example of the expanded functionality
   - Opt-in language to explicitly cover the broader message types
   - Privacy policy remains the same (already broad enough)
3. SMS_GUIDELINES.md (PRD_05) reflects the expanded approved message types

### If marketing expansion is selected for a non-marketing use case
Show an additional advisory note: **"Adding promotional messaging means recipients must give separate, explicit consent for marketing texts — not just transactional consent. We'll add a specific marketing opt-in to your compliance site. This is stricter than a transactional-only registration, but it gives you the flexibility to send both."**

This is important because marketing consent requires an unchecked checkbox that specifically mentions promotional messages, while transactional consent can be more implicit. We handle this difference in the template engine, but the customer should understand why their opt-in form looks different.

### Behavior
- Expansion checkboxes are all unchecked by default
- Selecting/deselecting an expansion updates the inline advisory note in real-time
- Continue button is always enabled (no expansions required)
- Back link returns to use case tile selection (Screen 1)
- State: selected use case + expansion selections stored in client-side state

### Data captured (additions to Screen 1)
```typescript
{
  use_case: string,
  expansions: string[], // IDs of selected expansion options
  effective_campaign_type: string, // computed from use_case + expansions
}
```

---

## 3. SCREEN 2: BUSINESS DETAILS

### URL
`/start/details`

### Layout
- Headline: **"Tell us about your business"**
- Subhead: "We use this to register your messaging with US carriers. Takes about 2 minutes."
- Single column form
- Continue button at bottom
- Back link to return to use case selection

### Form fields

All fields are visible on initial load (no progressive disclosure). Fields are grouped with subtle section dividers.

**Section: Your business**

| Field | Label | Type | Required | Validation | Placeholder/Help |
|-------|-------|------|----------|------------|------------------|
| `business_name` | Business or app name | text | Yes | Min 2 chars, max 100 | "The name your customers will see on texts" |
| `business_description` | What does your business/app do? | textarea | Yes | Min 20 chars, max 500 | "Describe your app in a sentence or two. Example: 'A booking platform for pet groomers'" |
| `has_ein` | Do you have a US business tax ID (EIN)? | radio (Yes/No) | Yes | — | Help tooltip: "If you're a sole proprietor or hobbyist without an EIN, select No. We'll register you as a sole proprietor." |
| `ein` | EIN | text | If has_ein=Yes | 9 digits, format XX-XXXXXXX | "XX-XXXXXXX" |
| `business_type` | Business type | select | If has_ein=Yes | — | Options: LLC, Corporation, Partnership, Non-profit |

**Section: Contact information**

| Field | Label | Type | Required | Validation | Placeholder/Help |
|-------|-------|------|----------|------------|------------------|
| `contact_name` | Your full name | text | Yes | Min 2 chars | — |
| `email` | Email address | email | Yes | Valid email format | "We'll send your registration updates and deliverable here" |
| `phone` | Mobile phone number | tel | Yes | Valid US phone, 10 digits | "Used for carrier verification — we'll send a code to this number" |
| `address_line1` | Street address | text | Yes | Min 5 chars | — |
| `address_city` | City | text | Yes | Min 2 chars | — |
| `address_state` | State | select | Yes | Valid US state | Dropdown of 50 states + DC |
| `address_zip` | ZIP code | text | Yes | 5 digits | "XXXXX" |

**Section: Your app (contextual — varies by use case)**

| Field | Label | Type | Required | Appears for use cases | Placeholder/Help |
|-------|-------|------|----------|-----------------------|------------------|
| `website_url` | Do you have a website for this app? | text | No | All | "If yes, enter URL. If not, we'll create a compliance page for you." |
| `service_type` | What type of service? | text | Yes | appointments | "e.g., dental, hair salon, consulting, auto repair" |
| `product_type` | What do you sell/deliver? | text | Yes | orders | "e.g., clothing, food delivery, handmade goods" |
| `app_name` | App name (if different from business) | text | No | verification | "The name users see when they get a code" |
| `community_name` | Community or group name | text | Yes | community | "e.g., Local Runners Club, Beta Testers" |
| `venue_type` | Type of venue/business | text | Yes | waitlist | "e.g., restaurant, barbershop, clinic" |

### Conditional logic
- If `has_ein` = No: hide `ein` and `business_type` fields. Show inline note: "No problem! We'll register you as a sole proprietor. You're limited to one campaign and one phone number, which is plenty for most indie apps."
- If `website_url` is empty: show inline note: "We'll generate a compliance website for your business — it's included in the price."
- Use-case-specific fields appear based on the use case selected on Screen 1

### Validation
- All validation is inline (field-level), shown on blur
- Email format validation
- Phone number: strip formatting, validate 10 digits, US only
- EIN: strip formatting, validate 9 digits
- ZIP: validate 5 digits
- Continue button disabled until all required fields pass validation
- On submit: client-side validation first, then server-side validation before proceeding

### Data captured
```typescript
{
  // From Screen 1 + 1b
  use_case: string,
  expansions: string[],
  effective_campaign_type: string,
  
  // Business
  business_name: string,
  business_description: string,
  has_ein: boolean,
  ein: string | null,
  business_type: string | null, // LLC, Corporation, Partnership, Non-profit
  
  // Contact
  contact_name: string,
  email: string,
  phone: string, // stored as 10 digits, no formatting
  address_line1: string,
  address_city: string,
  address_state: string, // 2-letter code
  address_zip: string,
  
  // App-specific
  website_url: string | null,
  service_type: string | null,
  product_type: string | null,
  app_name: string | null,
  community_name: string | null,
  venue_type: string | null,
}
```

---

## 4. SCREEN 3: REVIEW & CONFIRM

### URL
`/start/review`

### Layout
- Headline: **"Here's what we'll register for you"**
- Subhead: "Review your details and the messaging profile we've generated. You can edit anything before proceeding."
- Two-column layout on desktop (details left, generated preview right). Single column stacked on mobile.

### Left column: Your details
Display all customer-entered information in a read-only summary card with an "Edit" link that returns to Screen 2 with fields pre-filled.

```
Business: {business_name}
Type: {Sole Proprietor | business_type}
Contact: {contact_name}
Email: {email}
Phone: {formatted_phone}
Address: {full_address}
Use case: {use_case_label}
```

### Right column: Generated preview
Show a preview of what we'll submit on their behalf. This is generated by the Template Engine (PRD_02) using the customer's inputs. Displayed in a card with subtle background.

```
CAMPAIGN DESCRIPTION
"{generated_campaign_description}"

SAMPLE MESSAGES
1. "{generated_sample_1}"
2. "{generated_sample_2}"  
3. "{generated_sample_3}"

COMPLIANCE WEBSITE
We'll create a page at {slug}.{compliance_domain} with:
✓ Privacy policy (with required mobile data language)
✓ Terms of service (with messaging disclosures)
✓ SMS opt-in form (with all carrier-required elements)

WHAT HAPPENS NEXT
1. You pay $199
2. We submit your registration to US carriers (usually 2-7 days)
3. You get an integration kit to add SMS to your app
```

### Editable fields on this screen
The generated campaign description and sample messages should be editable inline (click to edit, contenteditable or textarea swap). Changes override the template defaults. Most customers won't edit — but power users who know their use case better than our template should be able to.

### Behavior
- "Edit details" link → returns to Screen 2 with all fields pre-filled
- Campaign description and sample messages: click to edit, auto-save to client state
- "Proceed to payment" button → creates Stripe Checkout session and redirects
- Back link → returns to Screen 2

### Data captured (additions to existing)
```typescript
{
  // All previous fields, plus:
  campaign_description_override: string | null, // null if they didn't edit
  sample_messages_override: string[] | null, // null if they didn't edit
}
```

---

## 5. PAYMENT (STRIPE CHECKOUT)

### Flow
1. Customer clicks "Proceed to payment" on Screen 3
2. Frontend calls backend API: `POST /api/checkout`
3. Backend creates Stripe Checkout Session with:
   - Price: $199.00 USD (one-time)
   - Product name: "RelayKit — SMS Registration"
   - Product description: "10DLC registration, compliance website, and SMS integration kit for {business_name}"
   - Customer email pre-filled from intake
   - Success URL: `relaykit.com/dashboard?session_id={CHECKOUT_SESSION_ID}`
   - Cancel URL: `relaykit.com/start/review` (return to review screen)
   - Metadata: `{ customer_intake_id: "{id}" }` (links payment to intake data)
4. Customer completes payment on Stripe's hosted checkout page
5. Stripe redirects to success URL

### On successful payment (webhook)
Stripe sends `checkout.session.completed` webhook to `POST /api/webhooks/stripe`

Backend handler:
1. Verify webhook signature
2. Look up `customer_intake_id` from session metadata
3. Create `customer` record in Supabase (from intake data)
4. Create `registration` record with status `generating_artifacts`
5. Trigger template engine (PRD_02) to generate all artifacts
6. Trigger compliance site generator (PRD_03) to deploy site
7. Trigger Twilio submission (PRD_04) to begin registration
8. Send confirmation email to customer with dashboard link

### On cancelled payment
Customer returns to review screen. No records created. Intake data preserved in client state so they can try again.

### Stripe product configuration
- Single product: "RelayKit SMS Registration"
- Single price: $199.00 USD, one-time
- No trial, no subscription (v1)
- Tax: let Stripe Tax handle if enabled, otherwise no tax collection in v1

---

## 6. ERROR STATES & EDGE CASES

### Form validation errors
- Inline field-level errors shown on blur
- Error summary at top of form if user clicks Continue with invalid fields
- Error styling: red border on field, red text below field, Untitled UI error pattern

### Duplicate submissions
- Check email uniqueness before creating Stripe session
- If email already has a completed registration: show message "You already have a registration with us. Check your email for your dashboard link or contact support."
- If email has a pending/failed registration: show message "You have a pending registration. [Go to dashboard] to check status."

### Stripe payment failures
- Stripe handles payment failures on their checkout page
- If customer's card is declined, Stripe shows error and lets them retry
- We don't need custom error handling for payment failures

### Browser back/forward
- Each screen has its own URL so browser navigation works naturally
- Client state (React state or sessionStorage) preserves form data across screens
- If user refreshes on Screen 2 or 3, form data may be lost — acceptable for v1, not a critical issue

### Timeout / abandoned sessions
- No timeout in v1
- Unpaid intake data is never persisted to database (only lives in client state)
- No abandoned cart recovery emails in v1

---

## 7. API ENDPOINTS

### `POST /api/checkout`
Creates Stripe Checkout session.

**Request body:**
```typescript
{
  use_case: string,
  business_name: string,
  business_description: string,
  has_ein: boolean,
  ein: string | null,
  business_type: string | null,
  contact_name: string,
  email: string,
  phone: string,
  address_line1: string,
  address_city: string,
  address_state: string,
  address_zip: string,
  website_url: string | null,
  service_type: string | null,
  product_type: string | null,
  app_name: string | null,
  community_name: string | null,
  venue_type: string | null,
  campaign_description_override: string | null,
  sample_messages_override: string[] | null,
}
```

**Response:**
```typescript
{
  checkout_url: string // Stripe hosted checkout URL
}
```

**Behavior:**
1. Validate all required fields server-side
2. Store intake data in a temporary `intake_sessions` table with a UUID
3. Create Stripe Checkout Session with `intake_session_id` in metadata
4. Return checkout URL

### `POST /api/webhooks/stripe`
Handles Stripe checkout.session.completed webhook.

**Behavior:**
1. Verify Stripe signature
2. Extract `intake_session_id` from metadata
3. Fetch intake data from `intake_sessions` table
4. Create `customer` record
5. Create `registration` record (status: `generating_artifacts`)
6. Create `generated_artifacts` record (initially empty, populated by template engine)
7. Delete intake session (cleanup)
8. Enqueue artifact generation + site deployment + Twilio submission
9. Send confirmation email

### `GET /api/preview`
Generates preview of campaign description and sample messages for Screen 3.

**Request query params:** All intake fields (or a subset needed for template generation)

**Response:**
```typescript
{
  campaign_description: string,
  sample_messages: string[],
  compliance_site_slug: string, // suggested slug based on business name
}
```

**Behavior:**
1. Run template engine (PRD_02) with provided inputs
2. Return generated text for preview display
3. No persistence — this is a read-only preview

---

## 8. DATABASE: INTAKE SESSION TABLE

This temporary table holds intake data between form submission and payment completion.

```sql
CREATE TABLE intake_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data JSONB NOT NULL, -- all intake form fields
  stripe_session_id TEXT, -- populated when checkout session is created
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '24 hours'
);

-- Auto-cleanup expired sessions
CREATE INDEX idx_intake_sessions_expires ON intake_sessions(expires_at);
```

Intake sessions are ephemeral. They exist only to bridge the gap between form completion and Stripe webhook. Cleaned up after successful payment or after 24-hour expiration.

---

## 9. ANALYTICS EVENTS (v1 — minimal)

Track these events to understand funnel conversion:

| Event | Trigger |
|-------|---------|
| `wizard_started` | Screen 1 loads |
| `use_case_selected` | Tile clicked (include `use_case` property) |
| `details_completed` | Screen 2 Continue clicked (passes validation) |
| `review_viewed` | Screen 3 loads |
| `review_edited` | Customer edits campaign description or sample messages |
| `checkout_initiated` | "Proceed to payment" clicked |
| `payment_completed` | Stripe webhook received |

Implementation: simple `fetch` calls to a `/api/events` endpoint that inserts into an `analytics_events` table, or use Plausible/PostHog if we want more out of the box. Decide during build.

---

## 10. IMPLEMENTATION NOTES FOR CLAUDE CODE

### Component structure (suggested)
```
app/
  start/
    page.tsx                    # Screen 1: Use Case Selection
    details/
      page.tsx                  # Screen 2: Business Details  
    review/
      page.tsx                  # Screen 3: Review & Confirm
  dashboard/
    page.tsx                    # Post-payment (PRD_06)
  api/
    checkout/
      route.ts                  # Create Stripe session
    preview/
      route.ts                  # Generate artifact preview
    webhooks/
      stripe/
        route.ts                # Handle Stripe webhooks
    events/
      route.ts                  # Analytics events

components/
  intake/
    UseCaseTile.tsx             # Individual use case tile
    UseCaseGrid.tsx             # Grid of tiles
    BusinessDetailsForm.tsx     # Screen 2 form
    ReviewPanel.tsx             # Screen 3 left column
    GeneratedPreview.tsx        # Screen 3 right column
    EditableText.tsx            # Inline-editable text for campaign desc/samples
  ui/
    (Untitled UI components)

lib/
  templates/                    # Template engine (PRD_02)
  stripe.ts                     # Stripe client config
  supabase.ts                   # Supabase client config
  validation.ts                 # Shared validation schemas (zod)
```

### State management
- Use React `useState` or `useReducer` for wizard state across screens
- Pass state via URL search params OR React context — decide during build based on what feels cleaner
- No global state management library needed (no Redux, no Zustand)
- Form validation: Zod schemas shared between client and server

### Key libraries
- `stripe` — Stripe SDK for checkout session creation
- `@supabase/supabase-js` — Database client
- `zod` — Schema validation (shared client/server)
- Untitled UI — Design components
- `lucide-react` — Icons for use case tiles
