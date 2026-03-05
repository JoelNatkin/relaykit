# PRD_02: TEMPLATE ENGINE
## RelayKit — Compliance Artifact Generation
### Version 2.0 — Mar 3, 2026

> **Dependencies:** Consumes intake data defined in PRD_01. Outputs feed PRD_03 (Compliance Site), PRD_04 (Twilio Submission), PRD_05 (Deliverable), PRD_06 (Dashboard — message plan builder), and PRD_08 (Compliance Monitoring — drift detection constants).
>
> **CHANGE LOG (v2.0):** Expanded Section 4 from 3 sample messages to 5–8 base + 3–4 expansion messages per use case. Added `exploring` use case (9th). Added `MessageTemplate` interface and `getMessageTemplates()` function to Section 10. Added `APPROVED_MESSAGE_TYPES` and `NOT_APPROVED_CONTENT` constant maps. Added expansion message metadata (`is_expansion`, `expansion_type`, `default_enabled`). `generateArtifacts()` unchanged — still selects 3 messages from the full set for Twilio TCR submission.
>
> **What v1.0 described:** 3 sample messages per use case, 8 use cases, `generateArtifacts()` only.
>
> **What v2.0 describes:** Full message template library (5–8 base + 3–4 expansion per use case), 9 use cases, `getMessageTemplates()` for dashboard consumption, compliance constants for PRD_05/PRD_08.

---

## 1. OVERVIEW

The template engine takes structured intake data from PRD_01 and generates six compliance artifacts:

1. **Campaign description** — submitted to Twilio/TCR as the official use case description
2. **Sample messages** — 3 messages submitted as examples of what the customer will send
3. **Opt-in description** — text explaining how consumers consent to receive messages
4. **Privacy policy** — full legal page deployed on the compliance site
5. **Terms of service** — full legal page deployed on the compliance site
6. **Opt-in page content** — the form copy and disclosure language for the compliance site

Additionally, the engine provides:

7. **Message template library** — full set of 5–8 base + 3–4 expansion messages per use case, consumed by the dashboard message plan builder (PRD_06)
8. **Compliance constants** — `APPROVED_MESSAGE_TYPES` and `NOT_APPROVED_CONTENT` maps consumed by PRD_05 (deliverable) and PRD_08 (drift detection)

The engine is a deterministic template system, not AI-generated. Every variable is filled from intake data. This is intentional — predictable output means predictable approval. We can trace every rejection back to a specific template and fix it.

### Architecture
```
intake_data (from PRD_01)
       ↓
  Template Engine
       ↓
  ┌─────────────────────────────────────────────┐
  │  campaign_description (string)              │ → Twilio campaign submission (PRD_04)
  │  sample_messages (string[])                 │ → Twilio campaign submission (PRD_04)
  │  opt_in_description (string)                │ → Twilio campaign submission (PRD_04)
  │  privacy_policy (string)                    │ → Compliance site (PRD_03)
  │  terms_of_service (string)                  │ → Compliance site (PRD_03)
  │  opt_in_page_content (object)               │ → Compliance site (PRD_03)
  └─────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────┐
  │  getMessageTemplates(useCase)               │ → Dashboard plan builder (PRD_06)
  │  APPROVED_MESSAGE_TYPES                     │ → PRD_05 deliverable, PRD_08 drift
  │  NOT_APPROVED_CONTENT                       │ → PRD_05 deliverable, PRD_08 drift
  └─────────────────────────────────────────────┘
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

### exploring
```
{business_name} sends SMS messages to users who have opted in to receive transactional notifications, informational updates, and service-related communications. Users provide consent by entering their phone number on the {business_name} website at {website_url}. The consent form includes a clear disclosure about message types, frequency, and opt-out instructions. Message frequency is {message_frequency} per recipient. Users can opt out at any time by replying STOP. Standard message and data rates may apply.
```

---

## 4. MESSAGE TEMPLATES (by use case)

Each use case provides a full message template library: 5–8 **base messages** covering the standard lifecycle for that use case, plus 3–4 **expansion messages** that require a broader registration scope (typically adding marketing or mixed campaign type).

### How these are used

- **Dashboard message plan builder (PRD_06):** `getMessageTemplates(useCase)` returns the full set. Developer selects/deselects and edits in the plan builder UI.
- **Twilio TCR submission (PRD_04):** `generateArtifacts()` selects the 3 best messages from the enabled base messages for the `sample_messages` field. Selection logic: pick messages with business name + opt-out language + highest use-case relevance.
- **Build spec (PRD_05):** All enabled messages are included in the developer's build spec document.
- **Drift detection (PRD_08):** Enabled messages become canon messages after registration; drift analyzer compares production messages against them.

### Template metadata

Every message template includes:
- **id** — unique identifier: `{useCase}_{snake_case_category}`
- **category** — human-readable label shown in the plan builder card
- **template** — full message text with `{variable}` placeholders
- **trigger** — when this message is sent (helps AI coding tools and the developer)
- **variables** — array of variable names used in this template
- **is_expansion** — `false` for base messages, `true` for expansion messages
- **expansion_type** — `null` for base, `'marketing'` or `'mixed'` for expansion
- **default_enabled** — `true` for the 2–3 most common base messages; `false` for all others and all expansion messages
- **compliance_elements** — `{ has_opt_out: boolean, has_business_name: boolean }`

---

### appointments

#### Base messages (6)

| # | ID | Category | Default | Template | Trigger | Variables | Compliance |
|---|-----|----------|---------|----------|---------|-----------|------------|
| 1 | `appointments_booking_confirmation` | Booking confirmation | ☑ ON | `"{business_name}: Your {service_type} appointment is confirmed for {date} at {time}. See you then! Reply HELP for help, STOP to unsubscribe."` | When client books an appointment | `business_name`, `service_type`, `date`, `time` | opt_out: ✓, biz_name: ✓ |
| 2 | `appointments_reminder_24hr` | Appointment reminder (24hr) | ☑ ON | `"{business_name}: Reminder — your {service_type} appointment is tomorrow at {time}. Reply C to confirm or R to reschedule. Reply STOP to opt out."` | 24 hours before appointment | `business_name`, `service_type`, `time` | opt_out: ✓, biz_name: ✓ |
| 3 | `appointments_reschedule_confirmation` | Rescheduling confirmation | ☐ OFF | `"{business_name}: Your appointment has been rescheduled to {date} at {time}. Reply STOP to opt out of messages."` | When client reschedules | `business_name`, `date`, `time` | opt_out: ✓, biz_name: ✓ |
| 4 | `appointments_cancellation` | Cancellation notice | ☑ ON | `"{business_name}: Your appointment on {date} has been cancelled. To rebook, visit {website_url} or call us. Reply STOP to unsubscribe."` | When appointment is cancelled | `business_name`, `date`, `website_url` | opt_out: ✓, biz_name: ✓ |
| 5 | `appointments_noshow_followup` | No-show follow-up | ☐ OFF | `"{business_name}: We missed you today! Would you like to reschedule your {service_type} appointment? Reply YES or visit {website_url}. Reply STOP to opt out."` | After a missed appointment | `business_name`, `service_type`, `website_url` | opt_out: ✓, biz_name: ✓ |
| 6 | `appointments_previsit` | Pre-visit instructions | ☐ OFF | `"{business_name}: Your appointment is today at {time}. Please arrive 10 minutes early. Questions? Reply to this message. Reply STOP to opt out."` | Morning of appointment | `business_name`, `time` | opt_out: ✓, biz_name: ✓ |

#### Expansion messages (4)

| # | ID | Category | Expansion Type | Template | Trigger | Variables | Compliance |
|---|-----|----------|---------------|----------|---------|-----------|------------|
| E1 | `appointments_promo_offer` | Promotional offer | marketing | `"{business_name}: Happy holidays! Enjoy 20% off your next {service_type} visit. Book at {website_url}. Reply STOP to opt out."` | Manually sent for promotions | `business_name`, `service_type`, `website_url` | opt_out: ✓, biz_name: ✓ |
| E2 | `appointments_birthday` | Birthday/anniversary | marketing | `"{business_name}: Happy birthday! Here's a special treat — 15% off your next appointment. Book at {website_url}. Reply STOP to unsubscribe."` | On client's birthday | `business_name`, `website_url` | opt_out: ✓, biz_name: ✓ |
| E3 | `appointments_reengagement` | Re-engagement | marketing | `"{business_name}: We miss you! It's been a while since your last visit. Book your next {service_type} appointment at {website_url}. Reply STOP to opt out."` | After X days of inactivity | `business_name`, `service_type`, `website_url` | opt_out: ✓, biz_name: ✓ |
| E4 | `appointments_review_request` | Review request | mixed | `"{business_name}: Thanks for your visit today! We'd love your feedback: {website_url}/review. Reply STOP to opt out."` | After completed appointment | `business_name`, `website_url` | opt_out: ✓, biz_name: ✓ |

---

### orders

#### Base messages (7)

| # | ID | Category | Default | Template | Trigger | Variables | Compliance |
|---|-----|----------|---------|----------|---------|-----------|------------|
| 1 | `orders_confirmation` | Order confirmation | ☑ ON | `"{business_name}: Your order #{order_id} has been confirmed! We'll notify you when it ships. Reply STOP to opt out of notifications."` | When order is placed | `business_name`, `order_id` | opt_out: ✓, biz_name: ✓ |
| 2 | `orders_shipped` | Shipping notification | ☑ ON | `"{business_name}: Great news — your order #{order_id} has shipped! Track it here: {tracking_url}. Reply STOP to unsubscribe."` | When order ships | `business_name`, `order_id`, `tracking_url` | opt_out: ✓, biz_name: ✓ |
| 3 | `orders_out_for_delivery` | Out for delivery | ☐ OFF | `"{business_name}: Your order #{order_id} is out for delivery today. Keep an eye out! Reply STOP to opt out."` | When out for delivery | `business_name`, `order_id` | opt_out: ✓, biz_name: ✓ |
| 4 | `orders_delivered` | Delivery confirmation | ☑ ON | `"{business_name}: Your order #{order_id} was delivered today. We hope you love it! Reply STOP to opt out."` | When delivery is confirmed | `business_name`, `order_id` | opt_out: ✓, biz_name: ✓ |
| 5 | `orders_delay_notice` | Delay notification | ☐ OFF | `"{business_name}: Update on order #{order_id} — there's a slight delay. New estimated delivery: {date}. We apologize for the wait. Reply STOP to opt out."` | When shipment is delayed | `business_name`, `order_id`, `date` | opt_out: ✓, biz_name: ✓ |
| 6 | `orders_return_confirmation` | Return confirmed | ☐ OFF | `"{business_name}: We received your return for order #{order_id}. Your refund will be processed within 5-7 business days. Reply STOP to unsubscribe."` | When return is received | `business_name`, `order_id` | opt_out: ✓, biz_name: ✓ |
| 7 | `orders_pickup_ready` | Ready for pickup | ☐ OFF | `"{business_name}: Your order #{order_id} is ready for pickup! Visit us at {address} during business hours. Reply STOP to opt out."` | When order is ready for pickup | `business_name`, `order_id`, `address` | opt_out: ✓, biz_name: ✓ |

#### Expansion messages (3)

| # | ID | Category | Expansion Type | Template | Trigger | Variables | Compliance |
|---|-----|----------|---------------|----------|---------|-----------|------------|
| E1 | `orders_reorder_reminder` | Reorder reminder | marketing | `"{business_name}: Running low? Reorder your {product_type} favorites at {website_url}. Reply STOP to opt out."` | After estimated usage period | `business_name`, `product_type`, `website_url` | opt_out: ✓, biz_name: ✓ |
| E2 | `orders_flash_sale` | Flash sale | marketing | `"{business_name}: Flash sale! 25% off all {product_type} for the next 24 hours. Shop now: {website_url}. Reply STOP to unsubscribe."` | Manually sent for promotions | `business_name`, `product_type`, `website_url` | opt_out: ✓, biz_name: ✓ |
| E3 | `orders_review_request` | Review request | mixed | `"{business_name}: How's your order? We'd love to hear from you: {website_url}/review. Reply STOP to opt out."` | Days after delivery | `business_name`, `website_url` | opt_out: ✓, biz_name: ✓ |

---

### verification

#### Base messages (5)

| # | ID | Category | Default | Template | Trigger | Variables | Compliance |
|---|-----|----------|---------|----------|---------|-----------|------------|
| 1 | `verification_login_code` | Login verification code | ☑ ON | `"Your {app_name} verification code is {code}. This code expires in 10 minutes. If you didn't request this, ignore this message."` | When user requests login OTP | `app_name`, `code` | opt_out: ✗, biz_name: ✓ (via app_name) |
| 2 | `verification_signup_code` | Signup verification code | ☑ ON | `"{app_name}: Use code {code} to verify your phone number. This code expires in 5 minutes."` | During account registration | `app_name`, `code` | opt_out: ✗, biz_name: ✓ |
| 3 | `verification_password_reset` | Password reset code | ☐ OFF | `"{app_name}: Your password reset code is {code}. Expires in 10 minutes. If you didn't request this, secure your account immediately."` | When user requests password reset | `app_name`, `code` | opt_out: ✗, biz_name: ✓ |
| 4 | `verification_mfa_code` | Multi-factor auth code | ☐ OFF | `"{app_name}: Your security code is {code}. Do not share this code with anyone. This code expires in 5 minutes."` | When MFA is triggered | `app_name`, `code` | opt_out: ✗, biz_name: ✓ |
| 5 | `verification_device_confirmation` | New device alert | ☐ OFF | `"{app_name}: A new device just signed in to your account. If this wasn't you, reset your password immediately at {website_url}."` | When login from new device detected | `app_name`, `website_url` | opt_out: ✗, biz_name: ✓ |

> **Note:** Verification messages intentionally omit opt-out language. OTP/2FA messages are transactional and user-initiated — STOP language is not required and would be confusing. TCR recognizes this for the `TWO_FACTOR_AUTHENTICATION` campaign type.

#### Expansion messages (3)

| # | ID | Category | Expansion Type | Template | Trigger | Variables | Compliance |
|---|-----|----------|---------------|----------|---------|-----------|------------|
| E1 | `verification_security_tip` | Security tip | mixed | `"{app_name}: Security tip — enable two-factor authentication to protect your account. Set it up at {website_url}/settings. Reply STOP to opt out."` | After account creation | `app_name`, `website_url` | opt_out: ✓, biz_name: ✓ |
| E2 | `verification_welcome` | Welcome message | mixed | `"{app_name}: Welcome! Your account is verified and ready to go. Get started at {website_url}. Reply STOP to opt out."` | After successful verification | `app_name`, `website_url` | opt_out: ✓, biz_name: ✓ |
| E3 | `verification_feature_announcement` | Feature announcement | marketing | `"{app_name}: New feature alert — you can now use passkeys for faster login. Learn more: {website_url}/blog. Reply STOP to unsubscribe."` | Manually sent | `app_name`, `website_url` | opt_out: ✓, biz_name: ✓ |

---

### support

#### Base messages (6)

| # | ID | Category | Default | Template | Trigger | Variables | Compliance |
|---|-----|----------|---------|----------|---------|-----------|------------|
| 1 | `support_acknowledgment` | Ticket acknowledgment | ☑ ON | `"{business_name}: Thanks for reaching out! A support agent will respond shortly. Your ticket: #{ticket_id}. Reply STOP to opt out of messages."` | When support request received | `business_name`, `ticket_id` | opt_out: ✓, biz_name: ✓ |
| 2 | `support_resolution` | Issue resolved | ☑ ON | `"{business_name} Support: Your issue (#{ticket_id}) has been resolved. Let us know if you need anything else. Reply STOP to unsubscribe."` | When ticket is closed | `business_name`, `ticket_id` | opt_out: ✓, biz_name: ✓ |
| 3 | `support_eta` | Response ETA | ☑ ON | `"{business_name}: We received your message and are looking into it. Expected response time: {eta}. Reply STOP to opt out."` | When request is queued | `business_name`, `eta` | opt_out: ✓, biz_name: ✓ |
| 4 | `support_followup` | Follow-up check-in | ☐ OFF | `"{business_name}: Checking in — is your issue (#{ticket_id}) fully resolved? Reply YES if all good, or describe what's still wrong. Reply STOP to opt out."` | Days after resolution | `business_name`, `ticket_id` | opt_out: ✓, biz_name: ✓ |
| 5 | `support_escalation` | Escalation notice | ☐ OFF | `"{business_name}: Your issue (#{ticket_id}) has been escalated to a senior agent. You'll hear from us within {eta}. Reply STOP to unsubscribe."` | When ticket is escalated | `business_name`, `ticket_id`, `eta` | opt_out: ✓, biz_name: ✓ |
| 6 | `support_info_needed` | Information requested | ☐ OFF | `"{business_name}: We need a bit more info to resolve your issue (#{ticket_id}). Please reply with the details or call us at {contact_phone}. Reply STOP to opt out."` | When agent needs more info | `business_name`, `ticket_id`, `contact_phone` | opt_out: ✓, biz_name: ✓ |

#### Expansion messages (3)

| # | ID | Category | Expansion Type | Template | Trigger | Variables | Compliance |
|---|-----|----------|---------------|----------|---------|-----------|------------|
| E1 | `support_satisfaction_survey` | Satisfaction survey | mixed | `"{business_name}: How was your support experience? Rate us 1-5 by replying with a number. Reply STOP to opt out."` | After ticket resolution | `business_name` | opt_out: ✓, biz_name: ✓ |
| E2 | `support_new_feature_tip` | Feature tip | marketing | `"{business_name}: Did you know? You can now track your support tickets online at {website_url}/support. Reply STOP to unsubscribe."` | Periodic | `business_name`, `website_url` | opt_out: ✓, biz_name: ✓ |
| E3 | `support_maintenance_notice` | Maintenance notice | mixed | `"{business_name}: Heads up — scheduled maintenance on {date} from {time}. Some features may be briefly unavailable. Reply STOP to opt out."` | Before scheduled maintenance | `business_name`, `date`, `time` | opt_out: ✓, biz_name: ✓ |

---

### marketing

#### Base messages (6)

| # | ID | Category | Default | Template | Trigger | Variables | Compliance |
|---|-----|----------|---------|----------|---------|-----------|------------|
| 1 | `marketing_weekly_promo` | Weekly promotion | ☑ ON | `"{business_name}: This week only — 20% off your next order with code SAVE20. Shop now at {website_url}. Reply STOP to unsubscribe."` | Weekly promo schedule | `business_name`, `website_url` | opt_out: ✓, biz_name: ✓ |
| 2 | `marketing_new_arrivals` | New arrivals | ☑ ON | `"{business_name}: New arrivals just dropped! Check out what's new: {website_url}/new. Msg & data rates may apply. Reply STOP to opt out."` | When new products launch | `business_name`, `website_url` | opt_out: ✓, biz_name: ✓ |
| 3 | `marketing_loyalty_reward` | Loyalty reward | ☑ ON | `"{business_name}: Thanks for being a loyal customer! Enjoy free shipping on your next order. Use code FREESHIP at {website_url}. Reply STOP to unsubscribe."` | Loyalty program triggers | `business_name`, `website_url` | opt_out: ✓, biz_name: ✓ |
| 4 | `marketing_seasonal_sale` | Seasonal sale | ☐ OFF | `"{business_name}: Our seasonal sale starts now — up to 40% off select items. Shop: {website_url}/sale. Reply STOP to opt out."` | Seasonal event triggers | `business_name`, `website_url` | opt_out: ✓, biz_name: ✓ |
| 5 | `marketing_back_in_stock` | Back in stock | ☐ OFF | `"{business_name}: Good news — the item you wanted is back in stock! Grab it before it's gone: {website_url}. Reply STOP to unsubscribe."` | When watched item restocks | `business_name`, `website_url` | opt_out: ✓, biz_name: ✓ |
| 6 | `marketing_abandoned_cart` | Abandoned cart | ☐ OFF | `"{business_name}: You left something in your cart! Complete your order at {website_url}/cart. Reply STOP to opt out."` | After cart abandonment | `business_name`, `website_url` | opt_out: ✓, biz_name: ✓ |

#### Expansion messages (3)

| # | ID | Category | Expansion Type | Template | Trigger | Variables | Compliance |
|---|-----|----------|---------------|----------|---------|-----------|------------|
| E1 | `marketing_referral` | Referral program | marketing | `"{business_name}: Share the love! Give a friend $10 off and get $10 when they order. Details: {website_url}/referral. Reply STOP to opt out."` | Periodic to active customers | `business_name`, `website_url` | opt_out: ✓, biz_name: ✓ |
| E2 | `marketing_vip_early_access` | VIP early access | marketing | `"{business_name}: VIP exclusive — shop our new collection 24 hours before everyone else. Early access: {website_url}/vip. Reply STOP to unsubscribe."` | Before public product launch | `business_name`, `website_url` | opt_out: ✓, biz_name: ✓ |
| E3 | `marketing_event_invite` | Event invitation | mixed | `"{business_name}: You're invited! Join us for a special event on {date}. Details and RSVP: {website_url}/events. Reply STOP to opt out."` | Before events | `business_name`, `date`, `website_url` | opt_out: ✓, biz_name: ✓ |

---

### internal

#### Base messages (6)

| # | ID | Category | Default | Template | Trigger | Variables | Compliance |
|---|-----|----------|---------|----------|---------|-----------|------------|
| 1 | `internal_meeting_reminder` | Meeting reminder | ☑ ON | `"{business_name} Team: Reminder — staff meeting tomorrow at {time} in the main conference room. Reply STOP to opt out."` | Day before meeting | `business_name`, `time` | opt_out: ✓, biz_name: ✓ |
| 2 | `internal_schedule_change` | Schedule change | ☑ ON | `"{business_name} Alert: Schedule change — your shift on {date} has been moved to {time}. Please confirm by replying OK. Reply STOP to unsubscribe."` | When schedule is updated | `business_name`, `date`, `time` | opt_out: ✓, biz_name: ✓ |
| 3 | `internal_system_maintenance` | System maintenance | ☑ ON | `"{business_name} Ops: System maintenance scheduled for {date} {time}. Please save your work. Reply STOP to opt out."` | Before planned maintenance | `business_name`, `date`, `time` | opt_out: ✓, biz_name: ✓ |
| 4 | `internal_incident_alert` | Incident alert | ☐ OFF | `"{business_name} URGENT: System incident in progress. Status page: {website_url}/status. Updates will follow. Reply STOP to opt out."` | During active incident | `business_name`, `website_url` | opt_out: ✓, biz_name: ✓ |
| 5 | `internal_policy_update` | Policy update | ☐ OFF | `"{business_name}: New team policy effective {date}. Please review details at {website_url}. Reply STOP to unsubscribe."` | When policy changes | `business_name`, `date`, `website_url` | opt_out: ✓, biz_name: ✓ |
| 6 | `internal_task_assignment` | Task assignment | ☐ OFF | `"{business_name}: New task assigned to you — {task_description}. Due by {date}. Questions? Reply to this message. Reply STOP to opt out."` | When task is assigned | `business_name`, `task_description`, `date` | opt_out: ✓, biz_name: ✓ |

#### Expansion messages (3)

| # | ID | Category | Expansion Type | Template | Trigger | Variables | Compliance |
|---|-----|----------|---------------|----------|---------|-----------|------------|
| E1 | `internal_team_celebration` | Team celebration | mixed | `"{business_name}: Congrats to the team on hitting our quarterly goal! Lunch on us this Friday. Reply STOP to opt out."` | Milestone achieved | `business_name` | opt_out: ✓, biz_name: ✓ |
| E2 | `internal_training_reminder` | Training reminder | mixed | `"{business_name}: Reminder — mandatory training session on {date} at {time}. Register at {website_url}. Reply STOP to unsubscribe."` | Before training events | `business_name`, `date`, `time`, `website_url` | opt_out: ✓, biz_name: ✓ |
| E3 | `internal_company_news` | Company news | mixed | `"{business_name}: Company update — read the latest news from leadership at {website_url}/news. Reply STOP to opt out."` | When news is published | `business_name`, `website_url` | opt_out: ✓, biz_name: ✓ |

---

### community

#### Base messages (6)

| # | ID | Category | Default | Template | Trigger | Variables | Compliance |
|---|-----|----------|---------|----------|---------|-----------|------------|
| 1 | `community_event_notification` | Event notification | ☑ ON | `"{community_name}: Meetup this Saturday at {time} at {location}! RSVP by replying YES. Reply STOP to opt out of updates."` | When event is scheduled | `community_name`, `time`, `location` | opt_out: ✓, biz_name: ✓ (via community_name) |
| 2 | `community_welcome` | Welcome message | ☑ ON | `"{community_name}: Welcome to the group! Events and updates will be sent to this number. Reply HELP for info or STOP to leave."` | When member joins | `community_name` | opt_out: ✓, biz_name: ✓ |
| 3 | `community_dues_reminder` | Dues/payment reminder | ☐ OFF | `"{community_name}: Reminder — dues are due by {date}. Details at {website_url}. Reply STOP to unsubscribe."` | Before payment deadline | `community_name`, `date`, `website_url` | opt_out: ✓, biz_name: ✓ |
| 4 | `community_event_reminder` | Event reminder | ☑ ON | `"{community_name}: Reminder — tomorrow's event starts at {time}. See you there! Reply STOP to opt out."` | Day before event | `community_name`, `time` | opt_out: ✓, biz_name: ✓ |
| 5 | `community_event_cancelled` | Event cancelled | ☐ OFF | `"{community_name}: Tomorrow's event has been cancelled. We'll reschedule soon — stay tuned. Reply STOP to opt out."` | When event is cancelled | `community_name` | opt_out: ✓, biz_name: ✓ |
| 6 | `community_announcement` | General announcement | ☐ OFF | `"{community_name}: {announcement_text}. Details at {website_url}. Reply STOP to unsubscribe."` | Manual announcement | `community_name`, `announcement_text`, `website_url` | opt_out: ✓, biz_name: ✓ |

#### Expansion messages (3)

| # | ID | Category | Expansion Type | Template | Trigger | Variables | Compliance |
|---|-----|----------|---------------|----------|---------|-----------|------------|
| E1 | `community_sponsor_promo` | Sponsor promotion | marketing | `"{community_name}: Special offer from our sponsor — 20% off at {sponsor_name}. Use code COMMUNITY20 at {website_url}. Reply STOP to opt out."` | Sponsor partnership | `community_name`, `sponsor_name`, `website_url` | opt_out: ✓, biz_name: ✓ |
| E2 | `community_merchandise` | Merchandise announcement | marketing | `"{community_name}: New merch alert! Rep the community — shop at {website_url}/shop. Reply STOP to unsubscribe."` | When merch launches | `community_name`, `website_url` | opt_out: ✓, biz_name: ✓ |
| E3 | `community_survey` | Community survey | mixed | `"{community_name}: We want to hear from you! Take our quick survey: {website_url}/survey. Reply STOP to opt out."` | Periodic engagement | `community_name`, `website_url` | opt_out: ✓, biz_name: ✓ |

---

### waitlist

#### Base messages (6)

| # | ID | Category | Default | Template | Trigger | Variables | Compliance |
|---|-----|----------|---------|----------|---------|-----------|------------|
| 1 | `waitlist_joined` | Waitlist confirmation | ☑ ON | `"{business_name}: You're on the waitlist! Estimated wait: {wait_time}. We'll text when your table is ready. Reply STOP to opt out."` | When customer joins waitlist | `business_name`, `wait_time` | opt_out: ✓, biz_name: ✓ |
| 2 | `waitlist_ready` | Table/spot ready | ☑ ON | `"{business_name}: Your table is ready! Please check in at the host stand within 10 minutes. Reply STOP to unsubscribe."` | When spot opens | `business_name` | opt_out: ✓, biz_name: ✓ |
| 3 | `waitlist_opening` | Opening available | ☑ ON | `"{business_name}: A reservation has opened up for {date} at {time}. Reply YES to book or NO to pass. Reply STOP to opt out."` | When cancellation creates opening | `business_name`, `date`, `time` | opt_out: ✓, biz_name: ✓ |
| 4 | `waitlist_update` | Wait time update | ☐ OFF | `"{business_name}: Quick update — your estimated wait is now {wait_time}. Thanks for your patience! Reply STOP to opt out."` | When wait time changes significantly | `business_name`, `wait_time` | opt_out: ✓, biz_name: ✓ |
| 5 | `waitlist_reservation_confirmation` | Reservation confirmed | ☐ OFF | `"{business_name}: Your reservation is confirmed for {date} at {time}. Party of {party_size}. See you then! Reply STOP to unsubscribe."` | When reservation is made | `business_name`, `date`, `time`, `party_size` | opt_out: ✓, biz_name: ✓ |
| 6 | `waitlist_reservation_reminder` | Reservation reminder | ☐ OFF | `"{business_name}: Reminder — your reservation is tonight at {time}. Reply C to confirm or X to cancel. Reply STOP to opt out."` | Day of reservation | `business_name`, `time` | opt_out: ✓, biz_name: ✓ |

#### Expansion messages (4)

| # | ID | Category | Expansion Type | Template | Trigger | Variables | Compliance |
|---|-----|----------|---------------|----------|---------|-----------|------------|
| E1 | `waitlist_special_event` | Special event invite | marketing | `"{business_name}: Join us for a special {venue_type} event on {date}! Reserve your spot: {website_url}. Reply STOP to opt out."` | Before special events | `business_name`, `venue_type`, `date`, `website_url` | opt_out: ✓, biz_name: ✓ |
| E2 | `waitlist_happy_hour` | Happy hour / daily special | marketing | `"{business_name}: Today's special — half-price appetizers from 4-6 PM. Walk in or reserve: {website_url}. Reply STOP to unsubscribe."` | Daily specials | `business_name`, `website_url` | opt_out: ✓, biz_name: ✓ |
| E3 | `waitlist_loyalty_perk` | Loyalty perk | marketing | `"{business_name}: Thanks for dining with us! Your next visit earns double loyalty points. Details: {website_url}. Reply STOP to opt out."` | After visit | `business_name`, `website_url` | opt_out: ✓, biz_name: ✓ |
| E4 | `waitlist_review_request` | Review request | mixed | `"{business_name}: Thanks for visiting! How was your experience? Leave a review: {website_url}/review. Reply STOP to opt out."` | After visit completes | `business_name`, `website_url` | opt_out: ✓, biz_name: ✓ |

---

### exploring

The `exploring` use case provides a curated cross-section of common message patterns from multiple use cases. This gives developers who selected "Just exploring" a representative set to experiment with in the sandbox without committing to a specific use case.

#### Base messages (8)

| # | ID | Category | Default | Template | Trigger | Variables | Compliance |
|---|-----|----------|---------|----------|---------|-----------|------------|
| 1 | `exploring_confirmation` | Booking/order confirmation | ☑ ON | `"{business_name}: Your request has been confirmed! We'll follow up with details. Reply STOP to opt out."` | After user action confirmed | `business_name` | opt_out: ✓, biz_name: ✓ |
| 2 | `exploring_reminder` | Reminder | ☑ ON | `"{business_name}: Reminder — you have an upcoming event tomorrow at {time}. Reply STOP to unsubscribe."` | Day before scheduled event | `business_name`, `time` | opt_out: ✓, biz_name: ✓ |
| 3 | `exploring_status_update` | Status update | ☑ ON | `"{business_name}: Update on your request — it's being processed. We'll notify you when it's ready. Reply STOP to opt out."` | When status changes | `business_name` | opt_out: ✓, biz_name: ✓ |
| 4 | `exploring_verification` | Verification code | ☐ OFF | `"{business_name}: Your verification code is {code}. This code expires in 10 minutes."` | When user requests code | `business_name`, `code` | opt_out: ✗, biz_name: ✓ |
| 5 | `exploring_support_ack` | Support acknowledgment | ☐ OFF | `"{business_name}: Thanks for reaching out! We'll get back to you shortly. Reply STOP to opt out."` | When support request received | `business_name` | opt_out: ✓, biz_name: ✓ |
| 6 | `exploring_delivery_update` | Delivery/shipment update | ☐ OFF | `"{business_name}: Your order has shipped! Track it here: {tracking_url}. Reply STOP to unsubscribe."` | When order ships | `business_name`, `tracking_url` | opt_out: ✓, biz_name: ✓ |
| 7 | `exploring_welcome` | Welcome message | ☐ OFF | `"{business_name}: Welcome! You'll receive updates at this number. Reply HELP for info or STOP to opt out."` | When user signs up | `business_name` | opt_out: ✓, biz_name: ✓ |
| 8 | `exploring_alert` | Alert/notification | ☐ OFF | `"{business_name}: Heads up — {alert_text}. Details at {website_url}. Reply STOP to opt out."` | Event-driven alerts | `business_name`, `alert_text`, `website_url` | opt_out: ✓, biz_name: ✓ |

#### Expansion messages (3)

| # | ID | Category | Expansion Type | Template | Trigger | Variables | Compliance |
|---|-----|----------|---------------|----------|---------|-----------|------------|
| E1 | `exploring_promo` | Promotional message | marketing | `"{business_name}: Special offer — save 20% with code SAVE20. Shop at {website_url}. Reply STOP to opt out."` | Manual promotion | `business_name`, `website_url` | opt_out: ✓, biz_name: ✓ |
| E2 | `exploring_feedback` | Feedback request | mixed | `"{business_name}: We'd love your feedback! Take a quick survey: {website_url}/feedback. Reply STOP to unsubscribe."` | Periodic | `business_name`, `website_url` | opt_out: ✓, biz_name: ✓ |
| E3 | `exploring_reengagement` | Re-engagement | marketing | `"{business_name}: It's been a while! Check out what's new at {website_url}. Reply STOP to opt out."` | After inactivity period | `business_name`, `website_url` | opt_out: ✓, biz_name: ✓ |

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

### exploring
```
Users provide opt-in consent by entering their phone number on the {business_name} website at {website_url}. The form includes an unchecked consent checkbox with the following disclosure: "By providing your phone number, you agree to receive service notifications and updates from {business_name}. Message frequency varies. Msg & data rates may apply. Reply HELP for help. Reply STOP to cancel." The privacy policy at {website_url}/privacy contains additional details about data handling.
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
| exploring | "Enter your phone number to receive service notifications and updates from {business_name}." |

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
| exploring | `LOW_VOLUME` | true | true | true |

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

### MessageTemplate interface

This is the interface consumed by PRD_06's message plan builder via `getMessageTemplates()`.

```typescript
interface MessageTemplate {
  id: string;                  // e.g., 'appointments_booking_confirmation'
  category: string;            // e.g., 'Booking confirmation'
  template: string;            // Full message text with {variables}
  trigger: string;             // "When client books an appointment"
  variables: string[];         // ['business_name', 'date', 'time']
  is_expansion: boolean;       // true for expansion messages
  expansion_type?: string;     // 'marketing' | 'mixed' — only present if is_expansion
  default_enabled: boolean;    // true for the 2-3 most common base messages
  compliance_elements: {
    has_opt_out: boolean;
    has_business_name: boolean;
  };
}

/**
 * Returns the full message template library for a given use case.
 * Called by PRD_06 dashboard when developer selects a use case.
 * Returns base messages first, then expansion messages.
 */
function getMessageTemplates(useCase: string): MessageTemplate[] {
  const templates = MESSAGE_TEMPLATES[useCase];
  if (!templates) throw new Error(`Unknown use case: ${useCase}`);
  return templates;
}
```

### generateArtifacts() — unchanged from v1.0

`generateArtifacts()` still produces the 6 compliance artifacts for Twilio submission. It selects the best 3 messages from the full template set for `sample_messages`. Selection logic:

1. Filter to base messages only (no expansion) that are `default_enabled`
2. Prefer messages with both `has_opt_out: true` and `has_business_name: true`
3. Pick 3 messages with the highest use-case relevance (first 3 default-enabled)
4. Render templates with variable interpolation

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
  sample_messages: string[];          // Always exactly 3, rendered (no {variables})
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
    exploring: (d) => `${d.business_name} sends SMS messages to users who have opted in...`,
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
  exploring: 'service notifications and updates',
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
  exploring: 'varies based on usage',
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
  exploring: 'LOW_VOLUME',
};

/**
 * Per-use-case description of what message types are approved.
 * Consumed by PRD_05 (SMS_GUIDELINES.md) and PRD_08 (drift detection).
 */
const APPROVED_MESSAGE_TYPES: Record<string, string> = {
  appointments: 'Appointment confirmations, reminders, rescheduling notices, cancellation notices, no-show follow-ups, and pre-visit instructions',
  orders: 'Order confirmations, shipping notifications, delivery updates, delay notices, return confirmations, and pickup-ready alerts',
  verification: 'One-time verification codes (OTP), login codes, password reset codes, multi-factor authentication codes, and new-device security alerts',
  support: 'Support ticket acknowledgments, resolution notices, response ETAs, follow-up check-ins, escalation notices, and information requests',
  marketing: 'Promotional offers, new arrival announcements, loyalty rewards, seasonal sales, back-in-stock alerts, and abandoned cart reminders',
  internal: 'Meeting reminders, schedule changes, system maintenance notices, incident alerts, policy updates, and task assignments',
  community: 'Event notifications, welcome messages, dues reminders, event reminders, cancellation notices, and general announcements',
  waitlist: 'Waitlist confirmations, table/spot-ready alerts, opening notifications, wait time updates, reservation confirmations, and reservation reminders',
  exploring: 'Transactional confirmations, reminders, status updates, verification codes, support acknowledgments, delivery updates, welcome messages, and alerts',
};

/**
 * Per-use-case description of what content is NOT approved.
 * Consumed by PRD_05 (SMS_GUIDELINES.md) and PRD_08 (drift detection).
 * These are the boundaries the drift analyzer checks against.
 */
const NOT_APPROVED_CONTENT: Record<string, string> = {
  appointments: 'Marketing promotions, discount offers, upsells, referral requests, review solicitations, or any message unrelated to scheduling. To add promotional messages, register a separate marketing campaign.',
  orders: 'Marketing promotions, product recommendations, upsells, cross-sells, review solicitations, or any message unrelated to order lifecycle. To add promotional messages, register a separate marketing campaign.',
  verification: 'Marketing messages, promotional offers, newsletters, account activity summaries, feature announcements, or any message the user did not explicitly request. Verification messages must be user-initiated.',
  support: 'Marketing promotions, product announcements, upsells, survey requests, or any message unrelated to an active support interaction. To add promotional messages, register a separate marketing campaign.',
  marketing: 'Transactional messages disguised as marketing (e.g., "your order shipped" in a marketing campaign), messages to recipients who haven\'t given explicit marketing consent, or SHAFT-C content (sex, hate, alcohol, firearms, tobacco, cannabis).',
  internal: 'External customer communications, marketing to team members, messages to non-employees, or any content targeting consumers rather than internal staff.',
  community: 'Direct product sales, third-party advertising, messages to non-members, or commercial promotions unrelated to community activities. Sponsor promotions require marketing expansion.',
  waitlist: 'Marketing promotions, menu advertising, event marketing, loyalty program solicitations, or any message unrelated to waitlist/reservation status. To add promotional messages, register a separate marketing campaign.',
  exploring: 'SHAFT-C content (sex, hate, alcohol, firearms, tobacco, cannabis), messages to recipients who haven\'t opted in, or high-volume blast messaging. Choose a specific use case before going to production.',
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
