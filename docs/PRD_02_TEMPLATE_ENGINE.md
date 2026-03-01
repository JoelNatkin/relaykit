# PRD_02: TEMPLATE ENGINE
## RelayKit — Compliance Artifact Generation
### Version 1.0 — Feb 26, 2026

> **Dependencies:** Consumes intake data defined in PRD_01. Outputs feed PRD_03 (Compliance Site), PRD_04 (Twilio Submission), and PRD_05 (Deliverable).

---

## 1. OVERVIEW

The template engine takes structured intake data from PRD_01 and generates six compliance artifacts:

1. **Campaign description** — submitted to Twilio/TCR as the official use case description
2. **Sample messages** — 3 messages submitted as examples of what the customer will send
3. **Opt-in description** — text explaining how consumers consent to receive messages
4. **Privacy policy** — full legal page deployed on the compliance site
5. **Terms of service** — full legal page deployed on the compliance site
6. **Opt-in page content** — the form copy and disclosure language for the compliance site

The engine is a deterministic template system, not AI-generated. Every variable is filled from intake data. This is intentional — predictable output means predictable approval. We can trace every rejection back to a specific template and fix it.

### Architecture
```
intake_data (from PRD_01)
       ↓
  Template Engine
       ↓
  ┌─────────────────────────────────┐
  │  campaign_description (string)  │ → Twilio campaign submission (PRD_04)
  │  sample_messages (string[])     │ → Twilio campaign submission (PRD_04)
  │  opt_in_description (string)    │ → Twilio campaign submission (PRD_04)
  │  privacy_policy (string)        │ → Compliance site (PRD_03)
  │  terms_of_service (string)      │ → Compliance site (PRD_03)
  │  opt_in_page_content (object)   │ → Compliance site (PRD_03)
  └─────────────────────────────────┘
```

---

## 2. TEMPLATE VARIABLES

These variables are derived from intake data and available in all templates.

| Variable | Source | Example |
|----------|--------|---------|
| `{business_name}` | `intake.business_name` | "PetBook" |
| `{business_description}` | `intake.business_description` | "A booking platform for pet groomers" |
| `{contact_name}` | `intake.contact_name` | "Joel Smith" |
| `{contact_email}` | `intake.email` | "joel@petbook.com" |
| `{contact_phone}` | `intake.phone` (formatted) | "(555) 123-4567" |
| `{address_full}` | Concatenated address fields | "123 Main St, Austin, TX 78701" |
| `{website_url}` | `intake.website_url` OR compliance site URL | "https://petbook.com" or "https://petbook.smsverified.com" |
| `{use_case_label}` | Mapped from `intake.use_case` | "appointment reminders" |
| `{message_frequency}` | Mapped from use case defaults | "approximately 2-4 messages per week" |
| `{service_type}` | `intake.service_type` | "pet grooming" |
| `{product_type}` | `intake.product_type` | "handmade jewelry" |
| `{app_name}` | `intake.app_name` OR `intake.business_name` | "PetBook" |
| `{community_name}` | `intake.community_name` | "Austin Dog Owners" |
| `{venue_type}` | `intake.venue_type` | "restaurant" |
| `{compliance_site_url}` | Generated slug + domain | "https://petbook.smsverified.com" |
| `{current_date}` | Date of generation | "February 26, 2026" |
| `{current_year}` | Year of generation | "2026" |

### Slug generation
The compliance site slug is derived from `business_name`:
1. Lowercase
2. Replace spaces and special chars with hyphens
3. Remove consecutive hyphens
4. Truncate to 30 chars
5. Check uniqueness against existing slugs in database
6. If taken, append `-2`, `-3`, etc.

---

## 3. CAMPAIGN DESCRIPTIONS (by use case)

Each use case has a base template. The customer can override on Screen 3 (PRD_01), but most won't.

### appointments
```
{business_name} sends SMS messages to customers who have opted in to receive appointment reminders, scheduling confirmations, and rescheduling notifications related to {service_type} services. Customers provide consent by entering their phone number on the {business_name} website at {website_url} or by providing their phone number in person during booking. The consent form includes a clear disclosure about message types, frequency, and opt-out instructions. Message frequency is {message_frequency} per recipient. Customers can opt out at any time by replying STOP. Standard message and data rates may apply.
```

### orders
```
{business_name} sends SMS messages to customers who have opted in to receive order confirmations, shipping updates, and delivery notifications for {product_type} purchases. Customers provide consent by entering their phone number during checkout on the {business_name} website at {website_url}. The checkout form includes a clear disclosure about message types, frequency, and opt-out instructions. Message frequency is {message_frequency} per recipient, varying based on order activity. Customers can opt out at any time by replying STOP. Standard message and data rates may apply.
```

### verification
```
{app_name} sends SMS messages containing one-time verification codes (OTP) to users who have provided their phone number during account registration or login. Messages are sent only when the user initiates a verification request. This is a transactional, security-related use case. Message frequency is as-needed, typically 1-3 messages per login attempt. Users can contact {contact_email} for support. Standard message and data rates may apply.
```

### support
```
{business_name} sends and receives SMS messages with customers who have opted in to receive customer support communications. Customers initiate contact by texting the {business_name} support number or by providing their phone number on the support page at {website_url}. The support page includes a clear disclosure about message types and opt-out instructions. Message frequency varies based on support interactions. Customers can opt out at any time by replying STOP. Standard message and data rates may apply.
```

### marketing
```
{business_name} sends SMS messages to customers who have opted in to receive promotional offers, product announcements, and marketing communications. Customers provide explicit consent by completing the SMS opt-in form on the {business_name} website at {website_url}. The opt-in form includes a clear disclosure stating message types, expected frequency of {message_frequency}, that message and data rates may apply, and instructions for opting out by replying STOP or requesting help by replying HELP. Customers can opt out at any time by replying STOP.
```

### internal
```
{business_name} sends SMS messages to team members and internal staff who have opted in to receive operational notifications, schedule updates, and internal alerts. Team members provide consent when onboarding by acknowledging the messaging policy. Message frequency is {message_frequency}, varying based on operational needs. Recipients can opt out at any time by replying STOP. Standard message and data rates may apply.
```

### community
```
{community_name} sends SMS messages to community members who have opted in to receive group updates, event notifications, and community announcements. Members provide consent by joining the community and entering their phone number on the sign-up page at {website_url}. The sign-up form includes a clear disclosure about message types, frequency, and opt-out instructions. Message frequency is {message_frequency}. Members can opt out at any time by replying STOP. Standard message and data rates may apply.
```

### waitlist
```
{business_name} sends SMS messages to customers who have opted in to receive waitlist updates, reservation confirmations, and availability notifications related to {venue_type} services. Customers provide consent by entering their phone number when joining the waitlist on the {business_name} website at {website_url} or in person. The form includes a clear disclosure about message types, frequency, and opt-out instructions. Message frequency is {message_frequency} per recipient. Customers can opt out at any time by replying STOP. Standard message and data rates may apply.
```

---

## 4. SAMPLE MESSAGES (by use case)

Three messages per use case. At least one must include the business name. At least one must include opt-out language. All must match the declared campaign purpose.

### appointments
```json
[
  "{business_name}: Reminder — your {service_type} appointment is scheduled for tomorrow at 2:00 PM. Reply C to confirm or R to reschedule. Reply STOP to opt out.",
  "{business_name}: Your appointment has been confirmed for March 5 at 10:30 AM. We look forward to seeing you! Reply STOP to unsubscribe.",
  "{business_name}: We have a cancellation! An opening is available on March 8 at 3:00 PM. Reply YES to book. Reply STOP to opt out."
]
```

### orders
```json
[
  "{business_name}: Your order #1234 has been confirmed! We'll notify you when it ships. Reply STOP to opt out of notifications.",
  "{business_name}: Great news — your order has shipped! Track it here: https://example.com/track/1234. Reply STOP to unsubscribe.",
  "{business_name}: Your package was delivered today at 2:15 PM. We hope you love it! Reply STOP to opt out."
]
```

### verification
```json
[
  "Your {app_name} verification code is 847293. This code expires in 10 minutes. If you didn't request this, ignore this message.",
  "{app_name}: Your login code is 551628. Do not share this code with anyone.",
  "{app_name}: Use code 392047 to verify your phone number. This code expires in 5 minutes."
]
```

### support
```json
[
  "{business_name}: Thanks for reaching out! A support agent will respond shortly. Reply STOP to opt out of messages.",
  "{business_name} Support: Your issue (#4521) has been resolved. Let us know if you need anything else. Reply STOP to unsubscribe.",
  "{business_name}: We received your message and are looking into it. Expected response time: 2 hours. Reply STOP to opt out."
]
```

### marketing
```json
[
  "{business_name}: This week only — 20% off your next order with code SAVE20. Shop now at {website_url}. Reply STOP to unsubscribe.",
  "{business_name}: New arrivals just dropped! Check out what's new: {website_url}/new. Msg & data rates may apply. Reply STOP to opt out.",
  "{business_name}: Thanks for being a loyal customer! Enjoy free shipping on your next order. Use code FREESHIP. Reply STOP to unsubscribe."
]
```

### internal
```json
[
  "{business_name} Team: Reminder — staff meeting tomorrow at 9:00 AM in the main conference room. Reply STOP to opt out.",
  "{business_name} Alert: Schedule change — your shift on Friday has been moved to 2:00 PM. Please confirm. Reply STOP to unsubscribe.",
  "{business_name} Ops: System maintenance scheduled for tonight 11 PM - 2 AM. Please save your work. Reply STOP to opt out."
]
```

### community
```json
[
  "{community_name}: Meetup this Saturday at 10 AM at Central Park! RSVP by replying YES. Reply STOP to opt out of updates.",
  "{community_name}: Welcome to the group! Events and updates will be sent to this number. Reply HELP for info or STOP to leave.",
  "{community_name}: Reminder — dues are due by March 15. Details at {website_url}. Reply STOP to unsubscribe."
]
```

### waitlist
```json
[
  "{business_name}: You're on the waitlist! Estimated wait: 25 minutes. We'll text when your table is ready. Reply STOP to opt out.",
  "{business_name}: Your table is ready! Please check in at the host stand within 10 minutes. Reply STOP to unsubscribe.",
  "{business_name}: A reservation has opened up for tonight at 7:30 PM. Reply YES to book or NO to pass. Reply STOP to opt out."
]
```

---

## 5. OPT-IN DESCRIPTIONS (by use case)

This text is submitted to Twilio/TCR explaining how consumers give consent. It must reference a specific mechanism (website form, keyword, verbal consent).

### appointments
```
Customers provide opt-in consent when booking an appointment through the {business_name} website at {website_url}. The booking form includes a phone number field and an unchecked consent checkbox with the following disclosure: "By providing your phone number, you agree to receive appointment reminders and scheduling messages from {business_name}. Message frequency varies. Msg & data rates may apply. Reply HELP for help. Reply STOP to cancel." Customers who book in person provide verbal consent after staff reads the SMS disclosure. The privacy policy at {website_url}/privacy contains additional details about data handling.
```

### orders
```
Customers provide opt-in consent during checkout on the {business_name} website at {website_url}. The checkout form includes a phone number field and an unchecked consent checkbox with the following disclosure: "By providing your phone number, you agree to receive order updates and delivery notifications from {business_name}. Message frequency varies by order. Msg & data rates may apply. Reply HELP for help. Reply STOP to cancel." The privacy policy at {website_url}/privacy contains additional details about data handling.
```

### verification
```
Users provide opt-in consent when they enter their phone number during account registration or when they request a verification code on the {app_name} platform at {website_url}. The phone number input includes a disclosure: "We'll send a verification code to this number. Msg & data rates may apply." Verification codes are sent only when explicitly requested by the user. The privacy policy at {website_url}/privacy contains additional details about data handling.
```

### support
```
Customers provide opt-in consent when they initiate a support conversation by texting the {business_name} support number or by submitting their phone number on the support page at {website_url}. The support page includes a disclosure: "By providing your phone number, you agree to receive support-related messages from {business_name}. Message frequency varies. Msg & data rates may apply. Reply HELP for help. Reply STOP to cancel." The privacy policy at {website_url}/privacy contains additional details about data handling.
```

### marketing
```
Customers provide explicit opt-in consent by completing the SMS subscription form on the {business_name} website at {website_url}. The form includes a phone number field and an unchecked consent checkbox with the following disclosure: "By checking this box and providing your phone number, you consent to receive marketing and promotional messages from {business_name}. Message frequency: {message_frequency}. Msg & data rates may apply. Reply HELP for help. Reply STOP to cancel. View our Privacy Policy at {website_url}/privacy and Terms at {website_url}/terms." Consent is not a condition of purchase.
```

### internal
```
Team members provide opt-in consent during onboarding by acknowledging the {business_name} internal messaging policy. The policy states: "By providing your phone number, you agree to receive operational notifications and schedule updates from {business_name}. Message frequency varies. Msg & data rates may apply. Reply HELP for help. Reply STOP to cancel." The privacy policy at {website_url}/privacy contains additional details about data handling.
```

### community
```
Members provide opt-in consent when joining {community_name} by entering their phone number on the sign-up page at {website_url}. The sign-up form includes an unchecked consent checkbox with the following disclosure: "By providing your phone number, you agree to receive community updates and event notifications from {community_name}. Message frequency: {message_frequency}. Msg & data rates may apply. Reply HELP for help. Reply STOP to cancel." The privacy policy at {website_url}/privacy contains additional details about data handling.
```

### waitlist
```
Customers provide opt-in consent when joining the waitlist at {business_name} through the website at {website_url} or in person. The waitlist form includes a phone number field with the following disclosure: "By providing your phone number, you agree to receive waitlist updates and reservation notifications from {business_name}. Message frequency varies. Msg & data rates may apply. Reply HELP for help. Reply STOP to cancel." Customers who join in person provide verbal consent after staff reads the SMS disclosure. The privacy policy at {website_url}/privacy contains additional details about data handling.
```

---

## 6. PRIVACY POLICY TEMPLATE

One universal template used for all use cases. Variables customize it per customer.

> **CRITICAL:** This template contains mandatory language required by carriers. The mobile data non-sharing clause MUST be present verbatim or registration will be rejected. Do not modify the sentences marked [MANDATORY] without reviewing against current TCR/carrier requirements.

```markdown
# Privacy Policy

**Effective Date:** {current_date}
**Last Updated:** {current_date}

{business_name} ("we," "us," or "our") is committed to protecting the privacy of our users and customers. This Privacy Policy describes how we collect, use, and protect your personal information, including information collected through our SMS messaging program.

## Information We Collect

We collect the following information when you use our services:

- **Contact information:** Name, email address, phone number, and mailing address
- **Account information:** Login credentials and account preferences
- **Communication data:** Messages sent to and from our SMS messaging service
- **Usage data:** How you interact with our services, including timestamps and frequency of messages

## How We Use Your Information

We use your information to:

- Provide and improve our {use_case_label} services
- Send you SMS messages that you have consented to receive
- Respond to your inquiries and provide customer support
- Comply with legal obligations and enforce our terms of service

## SMS Messaging

When you opt in to receive SMS messages from {business_name}, you consent to receive {use_case_label} messages at the phone number you provided. Message frequency is {message_frequency}. Message and data rates may apply.

You may opt out of receiving SMS messages at any time by replying STOP to any message. After opting out, you will receive a final confirmation message and no further messages will be sent. You may reply HELP for assistance or contact us at {contact_email}.

## [MANDATORY] Mobile Information Sharing Disclosure

We do not sell, rent, loan, trade, lease, or otherwise transfer for profit any phone numbers or personal information collected through our SMS messaging program to any third party. **Opt-in data and consent for our SMS messaging program will not be shared with any third parties or affiliates for their marketing or promotional purposes.**

## Data Security

We implement reasonable administrative, technical, and physical security measures to protect your personal information from unauthorized access, use, or disclosure.

## Data Retention

We retain your personal information only as long as necessary to fulfill the purposes described in this policy or as required by law. You may request deletion of your data by contacting us at {contact_email}.

## Third-Party Services

We may use third-party service providers to help operate our services (such as messaging platforms and hosting providers). These providers are contractually obligated to protect your information and may only use it to provide services on our behalf.

## Children's Privacy

Our services are not intended for individuals under the age of 13. We do not knowingly collect personal information from children under 13.

## Changes to This Policy

We may update this Privacy Policy from time to time. We will notify you of material changes by updating the "Last Updated" date at the top of this policy.

## Contact Us

If you have questions about this Privacy Policy or our data practices, contact us at:

{business_name}
{address_full}
Email: {contact_email}
Phone: {contact_phone}
```

---

## 7. TERMS OF SERVICE TEMPLATE

One universal template. Includes messaging-specific terms required for compliance.

```markdown
# Terms of Service

**Effective Date:** {current_date}
**Last Updated:** {current_date}

These Terms of Service ("Terms") govern your use of services provided by {business_name} ("we," "us," or "our"), including our SMS messaging program.

## Acceptance of Terms

By using our services or opting in to receive SMS messages from {business_name}, you agree to be bound by these Terms. If you do not agree, do not use our services or opt in to our messaging program.

## SMS Messaging Program

### Opt-In
By providing your phone number and consenting to receive messages, you agree to receive SMS messages from {business_name} related to {use_case_label}. Consent is not a condition of purchase or use of our services.

### Message Frequency
Message frequency is {message_frequency}. Frequency may vary based on your interactions with our services.

### Costs
Message and data rates may apply depending on your mobile carrier and plan. {business_name} does not charge for SMS messages, but your carrier may.

### Opt-Out
You may opt out of receiving SMS messages at any time by replying STOP to any message you receive from us. You will receive a one-time confirmation message after opting out. No further messages will be sent unless you re-subscribe.

### Help
For assistance with our messaging program, reply HELP to any message or contact us at {contact_email}.

### Supported Carriers
Major US carriers are supported. Carriers are not liable for delayed or undelivered messages.

## Use of Services

You agree to use our services only for lawful purposes and in accordance with these Terms. You agree not to:

- Use our services in any way that violates applicable laws or regulations
- Send unsolicited messages to individuals who have not opted in
- Impersonate any person or entity
- Interfere with or disrupt our services

## Limitation of Liability

To the maximum extent permitted by law, {business_name} shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services, including our SMS messaging program.

## Changes to Terms

We may modify these Terms at any time. Continued use of our services after changes constitutes acceptance of the updated Terms.

## Contact Us

Questions about these Terms? Contact us at:

{business_name}
{address_full}
Email: {contact_email}
Phone: {contact_phone}
```

---

## 8. OPT-IN PAGE CONTENT

This defines the text content for the opt-in form on the compliance site (PRD_03 handles the actual HTML/deployment). The opt-in page is the most scrutinized element during carrier review.

### Form elements (all must be present)

| Element | Content |
|---------|---------|
| Heading | "Get {use_case_label} from {business_name}" |
| Subhead | Use-case-specific (see below) |
| Phone field label | "Mobile phone number" |
| Consent checkbox (UNCHECKED by default) | See disclosure text below |
| Submit button | "Subscribe" |
| Below-form disclosures | See fine print below |

### Use-case-specific subheads

| Use case | Subhead |
|----------|---------|
| appointments | "Enter your phone number to receive appointment reminders and scheduling updates." |
| orders | "Enter your phone number to receive order confirmations and delivery updates." |
| verification | "Enter your phone number to receive verification codes." |
| support | "Enter your phone number to receive customer support messages." |
| marketing | "Sign up to receive exclusive offers and updates from {business_name}." |
| internal | "Enter your phone number to receive team notifications and schedule updates." |
| community | "Join {community_name} to receive event updates and community announcements." |
| waitlist | "Enter your phone number to receive waitlist and reservation updates." |

### Consent checkbox disclosure text
```
By checking this box and submitting this form, I consent to receive {use_case_label} 
text messages from {business_name} at the phone number provided. Message frequency: 
{message_frequency}. Message and data rates may apply. Reply HELP for help. Reply STOP 
to cancel. View our Privacy Policy ({website_url}/privacy) and Terms of Service 
({website_url}/terms).
```

### Below-form fine print
```
By opting in, you agree to receive automated text messages from {business_name}. 
Consent is not a condition of purchase. Message and data rates may apply. 
Message frequency: {message_frequency}. Text STOP to opt out at any time. 
Text HELP for help. View our Privacy Policy and Terms of Service.
```

> **CRITICAL COMPLIANCE NOTES:**
> - Checkbox MUST be unchecked by default
> - Phone number collection MUST NOT be mandatory unless the form's sole purpose is SMS opt-in
> - All seven CTIA-required elements must be visible near the phone field: brand name, message types, frequency, "Msg & data rates may apply", HELP info, STOP info, privacy policy link
> - Consent disclosure MUST NOT be hidden in a popup, tooltip, or collapsed section
> - Privacy policy and terms links must be functional (not broken, not 404)

---

## 9. USE CASE → TCR CAMPAIGN TYPE MAPPING

When submitting to Twilio, each use case maps to a specific TCR standard campaign type.

| Use case | TCR `usecase` value | Subscriber opt-in | Subscriber opt-out | Subscriber help |
|----------|--------------------|--------------------|--------------------|-----------------| 
| appointments | `CUSTOMER_CARE` | true | true | true |
| orders | `DELIVERY_NOTIFICATIONS` | true | true | true |
| verification | `TWO_FACTOR_AUTHENTICATION` | true | true | true |
| support | `CUSTOMER_CARE` | true | true | true |
| marketing | `MARKETING` | true | true | true |
| internal | `LOW_VOLUME` | true | true | true |
| community | `LOW_VOLUME` | true | true | true |
| waitlist | `MIXED` | true | true | true |

### Default message flow flags (submitted with campaign)

All campaigns set these to `true`:
- `hasEmbeddedLinks`: true (sample messages include URLs where applicable)
- `hasEmbeddedPhone`: false (unless support use case)
- `hasAgeGated`: false
- `hasDirectLending`: false
- `subscriberOptin`: true
- `subscriberOptout`: true
- `subscriberHelp`: true
- `numberPool`: false
- `directLending`: false
- `affiliateMarketing`: false

---

## 10. IMPLEMENTATION

### Function signature
```typescript
interface IntakeData {
  use_case: string;
  business_name: string;
  business_description: string;
  email: string;
  phone: string;
  contact_name: string;
  address_line1: string;
  address_city: string;
  address_state: string;
  address_zip: string;
  website_url: string | null;
  service_type: string | null;
  product_type: string | null;
  app_name: string | null;
  community_name: string | null;
  venue_type: string | null;
  has_ein: boolean;
  ein: string | null;
  business_type: string | null;
}

interface GeneratedArtifacts {
  campaign_description: string;
  sample_messages: string[];
  opt_in_description: string;
  privacy_policy: string;
  terms_of_service: string;
  opt_in_page_content: {
    heading: string;
    subhead: string;
    consent_checkbox_text: string;
    fine_print: string;
  };
  tcr_use_case: string;
  tcr_flags: Record<string, boolean>;
  compliance_site_slug: string;
}

function generateArtifacts(intake: IntakeData): GeneratedArtifacts
```

### Template rendering approach
Simple string interpolation — no template library needed. Each template is a function that receives `IntakeData` and returns a string with variables replaced.

```typescript
// Example
function renderCampaignDescription(intake: IntakeData): string {
  const templates = {
    appointments: (d) => `${d.business_name} sends SMS messages to customers who have opted in...`,
    orders: (d) => `${d.business_name} sends SMS messages to customers who have opted in...`,
    // ... etc
  };
  return templates[intake.use_case](deriveVariables(intake));
}
```

### Variable derivation
```typescript
function deriveVariables(intake: IntakeData) {
  const slug = generateSlug(intake.business_name);
  const complianceSiteUrl = intake.website_url || `https://${slug}.smsverified.com`;
  
  return {
    business_name: intake.business_name,
    business_description: intake.business_description,
    contact_name: intake.contact_name,
    contact_email: intake.email,
    contact_phone: formatPhone(intake.phone),
    address_full: `${intake.address_line1}, ${intake.address_city}, ${intake.address_state} ${intake.address_zip}`,
    website_url: complianceSiteUrl,
    use_case_label: USE_CASE_LABELS[intake.use_case],
    message_frequency: USE_CASE_FREQUENCIES[intake.use_case],
    service_type: intake.service_type || '',
    product_type: intake.product_type || '',
    app_name: intake.app_name || intake.business_name,
    community_name: intake.community_name || intake.business_name,
    venue_type: intake.venue_type || '',
    compliance_site_url: complianceSiteUrl,
    current_date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    current_year: new Date().getFullYear().toString(),
  };
}
```

### Constants
```typescript
const USE_CASE_LABELS: Record<string, string> = {
  appointments: 'appointment reminders and scheduling updates',
  orders: 'order confirmations and delivery notifications',
  verification: 'verification codes',
  support: 'customer support messages',
  marketing: 'promotional offers and updates',
  internal: 'team notifications and operational alerts',
  community: 'community updates and event notifications',
  waitlist: 'waitlist and reservation updates',
};

const USE_CASE_FREQUENCIES: Record<string, string> = {
  appointments: 'approximately 2-4 messages per week',
  orders: 'approximately 3-5 messages per order',
  verification: 'as needed, based on login/verification requests',
  support: 'varies based on support interactions',
  marketing: 'approximately 2-4 messages per month',
  internal: 'varies based on operational needs',
  community: 'approximately 2-4 messages per month',
  waitlist: 'approximately 1-3 messages per booking',
};

const TCR_USE_CASES: Record<string, string> = {
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

---

## 11. TEMPLATE REFINEMENT PROCESS

This is how the templates improve over time and become the moat.

### On every submission
Log to `template_submissions` table:
```sql
CREATE TABLE template_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID REFERENCES registrations(id),
  use_case TEXT NOT NULL,
  campaign_description TEXT NOT NULL,
  sample_messages JSONB NOT NULL,
  opt_in_description TEXT NOT NULL,
  was_overridden BOOLEAN DEFAULT false,
  override_fields JSONB, -- which fields the customer edited
  result TEXT, -- 'approved', 'rejected'
  rejection_code TEXT,
  rejection_reason TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);
```

### On rejection
1. Log rejection code and reason
2. Flag for manual review
3. After manual fix and resubmission, log what changed
4. If pattern emerges (same rejection on same template), update the base template

### Monthly review
Review `template_submissions` grouped by use case:
- Approval rate per use case
- Most common rejection reasons per use case
- Whether overrides correlate with higher/lower approval rates
- Update templates based on findings

> **This table is the core IP.** Over time it becomes a dataset of what language carriers approve and reject, segmented by use case. No competitor has this.
