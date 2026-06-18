import type { VariablesExample } from "@/components/home/variables-section";

/**
 * Per-category landing-page registry. One entry per message category drives the
 * dynamic route at `app/messages/[category]/page.tsx`, which composes the shared
 * home components (chrome + data-fed sections) around the authored sections
 * below. Category pages are decoupled from `/lib/constraints` — categories are
 * not sub-verticals (extends + scopes D-436; the `/for/{slug}` recipe stays for
 * the deferred dev-tools page).
 *
 * Public URL and corpus key are split:
 *   - `urlSlug`        — the public route segment; canonical, sitemap, and Farm
 *                        links all key off this (e.g. "orders", "support").
 *   - `lockedCategory` — the message-library category id, used by MessagesSection
 *                        and the corpus (e.g. "order-updates", "customer-support").
 * Equal for 7 of 9 categories; Orders and Customer support differ.
 *
 * All entry TEXT is authored by PM (the data block). From existing code we lift
 * only the structured shapes: heroExamples bodies, the VariablesExample object,
 * and the section rendering.
 */

export interface CategoryQA {
  /** Question heading. */
  q: string;
  /** Bold lead sentence, rendered before the body. */
  lead: string;
  body: string;
  /** Optional gold-dot bullet list under the body. */
  list?: string[];
}

export interface CategoryLanding {
  /** Public route segment — canonical, sitemap, Farm links key off this. */
  urlSlug: string;
  /** Message-library category id — MessagesSection lockedCategory + corpus key. */
  lockedCategory: string;
  /** Display name (Farm links, etc.). */
  name: string;

  // SEO — per-category generateMetadata.
  metaTitle: string;
  metaDescription: string;

  // Hero (bucket 2a). The mock rotates heroExamples when >1, static when 1.
  heroEyebrow: string;
  h1: string;
  heroBody: string;
  heroExamples: string[];

  // Moment (bucket 2a) — the eyebrow/heading are constant, in the component.
  moment: { body: string; exampleSms: string; exampleReply: string };

  // Details / Q&A (bucket 2a).
  detailsHeading: string;
  qa: CategoryQA[];

  // Messages browser, locked via lockedCategory (bucket 2b).
  messagesEyebrow: string;
  messagesHeading: string;
  messagesBridge: string;

  // Variables, sub-matched example (bucket 2b).
  variablesExample: VariablesExample;

  // Reserved — NumbersSection takes no override today; deferred until wired.
  numbersOverride?: unknown;
}

// Account-events hero notification bodies — the original 5 mock bodies, reused
// as this category's heroExamples (rotation order).
const ACCOUNT_EVENTS_HERO_EXAMPLES = [
  "Card ending 4242 was declined. Update payment to keep your account active: yourapp.com/billing",
  "Your trial ends in 3 days. Choose a plan to keep your account: yourapp.com/billing",
  "New sign-in from Chrome on Mac, Denver. Not you? Secure your account: yourapp.com/security",
  "Your account has been suspended. Review the details and next steps here: yourapp.com/account",
  "Your subscription change is confirmed. View the details in your account: yourapp.com/account",
];

/**
 * The nine category landing entries (#1–#9), authored by PM (the data block at
 * .pm/category-data-block.md). The dynamic route generates one static page per
 * entry via `categorySlugs()`.
 */
export const CATEGORY_LANDINGS: CategoryLanding[] = [
  // ── 1. Account events ────────────────────────────────────────────────────
  {
    urlSlug: "account-events",
    lockedCategory: "account-events",
    name: "Account events",
    metaTitle: "Account event text messages | RelayKit",
    metaDescription:
      "Send the account messages customers act on: payment failures, security alerts, account changes. Free to author and test; RelayKit handles registration, opt-outs, and carrier rules.",
    heroEyebrow: "Account events",
    h1: "User account text messaging for your app.",
    heroBody:
      "Payment failures, security alerts, trial endings — the messages a customer needs to see before the damage is done.",
    heroExamples: ACCOUNT_EVENTS_HERO_EXAMPLES,
    moment: {
      body: "A payment fails on a Friday evening. The customer fixes it from their phone before the account lapses.",
      exampleSms:
        "Card ending 4242 was declined. Update payment to keep your account active: yourapp.com/billing",
      exampleReply: "Paid in minutes",
    },
    detailsHeading: "Q&A: Account event messages",
    qa: [
      {
        q: "Why send billing alerts by text instead of email?",
        lead: "Because card-declined emails don't get read.",
        body: "They land in spam, get buried in a promotions folder, or sit unread until the account lapses. A billing alert by text reaches the customer in seconds — which is the difference between a retry and a churn event.",
      },
      {
        q: "What goes in a security alert text?",
        lead: "The event, the device, and a link to act on it.",
        body: "A new sign-in from an unrecognized device tells the customer what happened and where to go if it wasn't them. Don't ask for credentials in the message — phishing SMS mimics this exact format, and your customers know it.",
      },
      {
        q: "Can I add an upgrade offer to a trial-ending text?",
        lead: "No — and this one matters.",
        body: "A trial-ending text with a discount code changes its legal classification from transactional to marketing, which requires a separate registration and separate consent. Keep the text factual; run promotions through the marketing channel.",
      },
      {
        q: "How does a customer know which account the text is about?",
        lead: "You put the app name at the start of every message.",
        body: "A generic 'your card was declined' with no sender context reads as phishing. RelayKit prefixes every account message with your workspace name so customers know exactly which subscription to act on.",
      },
    ],
    messagesEyebrow: "Account messages",
    messagesHeading: "Account messages, ready to send.",
    messagesBridge: "Every account message your app sends. Copy them, customize them, or write your own.",
    variablesExample: {
      inputValue: "4242",
      card1Body: [
        { t: "Acme", kind: "value" },
        { t: ": Card ending " },
        { t: "4242", kind: "highlight" },
        { t: " was declined. Update payment to keep your account active: " },
        { t: "yourapp.com/billing", kind: "value" },
        { t: ". Reply STOP to opt out." },
      ],
      card2Body: [
        { t: "Acme", kind: "value" },
        { t: ": Card ending " },
        { t: "4242", kind: "value" },
        { t: " was declined. Update payment: " },
        { t: "yourapp.com/billing", kind: "highlight" },
        { t: ". Reply STOP to opt out." },
      ],
      menuRows: [
        { name: "workspace_name", value: "Acme" },
        { name: "card_last4", value: "4242" },
        { name: "account_link", value: "yourapp.com/billing", selected: true },
        { name: "days_remaining", value: "3" },
      ],
    },
  },

  // ── 2. Orders ────────────────────────────────────────────────────────────
  {
    urlSlug: "orders",
    lockedCategory: "order-updates",
    name: "Orders",
    metaTitle: "Order and shipping text messages | RelayKit",
    metaDescription:
      "Send the order updates customers check for: shipping, delivery, pickup. Free to author and test; RelayKit handles registration, opt-outs, and carrier rules.",
    heroEyebrow: "Orders",
    h1: "Order and shipping texts for your app.",
    heroBody:
      "Order confirmations, shipping updates, delivery alerts — the messages a customer looks for after they buy.",
    heroExamples: [
      "Your order #1024 is out for delivery today. Track it: yourapp.com/track",
      "Your order #1024 has shipped. Follow it here: yourapp.com/track",
      "Your order is ready for pickup at the front desk: yourapp.com/orders",
      "We couldn't complete your order. Update your payment to finish: yourapp.com/checkout",
    ],
    moment: {
      body: "A package needs a signature and the customer is at work. The delivery text gets there in time to redirect it, before the driver leaves.",
      exampleSms:
        "Your order #1024 is out for delivery today. Track it or reschedule: yourapp.com/track",
      exampleReply: "Caught it in time",
    },
    detailsHeading: "Q&A: Order messages",
    qa: [
      {
        q: "Do I need to send every step in the lifecycle, or just some?",
        lead: "Just the ones that matter to your customer at that moment.",
        body: "Confirmed and shipped are the minimum — they bracket the wait. Out for delivery and delivered add detail for customers who track obsessively. Processing, return, and refund are there when you need them.",
      },
      {
        q: "My carrier already sends tracking texts — won't customers get two?",
        lead: "Sometimes, yes.",
        body: "Carrier notifications are generic. Yours come from your business name, link to your tracking page, and can include your return flow. Most customers don't mind two if the second one adds something.",
      },
      {
        q: "Can I add an offer to the delivery confirmation?",
        lead: "No — order messages can't carry promotions.",
        body: "A delivered text with a discount code changes its legal classification from transactional to marketing, which requires separate consent. Keep the order flow clean; run promotions through the marketing channel.",
      },
      {
        q: "What happens if delivery fails?",
        lead: "The carrier handles it.",
        body: "Failed deliveries, address issues, and weather delays go through carrier-direct notifications. RelayKit's order messages cover the lifecycle your system controls — confirmation through refund.",
      },
    ],
    messagesEyebrow: "Order messages",
    messagesHeading: "Order messages, ready to send.",
    messagesBridge: "Every order message your app sends. Copy them, customize them, or write your own.",
    variablesExample: {
      inputValue: "1024",
      card1Body: [
        { t: "Acme", kind: "value" },
        { t: ": Your order #" },
        { t: "1024", kind: "highlight" },
        { t: " is out for delivery today. Track it: " },
        { t: "yourapp.com/track", kind: "value" },
      ],
      card2Body: [
        { t: "Acme", kind: "value" },
        { t: ": Your order #" },
        { t: "1024", kind: "highlight" },
        { t: " is out for delivery today. Track it: " },
        { t: "yourapp.com/track", kind: "value" },
      ],
      menuRows: [
        { name: "workspace_name", value: "Acme" },
        { name: "order_number", value: "1024", selected: true },
        { name: "tracking_link", value: "yourapp.com/track" },
        { name: "delivery_date", value: "today" },
      ],
    },
  },

  // ── 3. Appointments ──────────────────────────────────────────────────────
  {
    urlSlug: "appointments",
    lockedCategory: "appointments",
    name: "Appointments",
    metaTitle: "Appointment reminder text messages | RelayKit",
    metaDescription:
      "Send the reminders that keep appointments from slipping: confirmations, day-before nudges, reschedule links. Free to author and test; RelayKit handles registration, opt-outs, and carrier rules.",
    heroEyebrow: "Appointments",
    h1: "Appointment text messaging for your app.",
    heroBody:
      "Booking confirmations, reminders, reschedule links — the messages that keep time slots booked.",
    heroExamples: [
      "Reminder, you have an appointment tomorrow at 2:00 PM. Reschedule: yourapp.com/reschedule",
      "Your appointment is confirmed for Thursday at 2:00 PM: yourapp.com/booking",
      "Need to move your appointment? Reschedule here: yourapp.com/reschedule",
      "Your appointment starts in 1 hour. See the details: yourapp.com/booking",
    ],
    moment: {
      body: "A booking made three weeks ago has slipped someone's mind, and the slot is about to go to waste. A reminder the day before gives them the chance to confirm it or move it.",
      exampleSms:
        "Reminder, you have an appointment tomorrow at 2:00 PM. Need to change it? yourapp.com/reschedule",
      exampleReply: "See you then",
    },
    detailsHeading: "Q&A: Appointment messages",
    qa: [
      {
        q: "How many reminders should I send?",
        lead: "Depends on your customers and how far out they book.",
        body: "A day-before reminder works for most appointment types. An hour-before nudge helps when no-shows are costly, but can feel like overkill for shorter-notice bookings. Start with one and see if your no-show rate warrants a second.",
      },
      {
        q: "What do you send when someone doesn't show up?",
        lead: "A non-judgmental rebooking text, sent an hour after the slot.",
        body: "Not 'you missed your appointment' — that reads as accusatory and bumps opt-out rates. 'We missed you — want to rebook?' gives them an easy path back without making them feel bad about it.",
      },
      {
        q: "Can the post-appointment text include an offer to rebook?",
        lead: "A link to reschedule, yes. A discount to rebook, no.",
        body: "A promotional incentive in a transactional message changes its legal classification and requires separate consent. Keep the post-appointment text to thanks and feedback; run rebooking promotions through the marketing channel.",
      },
      {
        q: "What's the most common mistake in appointment confirmation texts?",
        lead: "Confirming the booking without stating the time.",
        body: "A text that says 'your appointment is confirmed' forces the customer to scroll back through their booking to find when it is. Always include the date and time in the confirmation — that's the information they actually need.",
      },
    ],
    messagesEyebrow: "Appointment messages",
    messagesHeading: "Appointment messages, ready to send.",
    messagesBridge: "Every appointment message your app sends. Copy them, customize them, or write your own.",
    variablesExample: {
      inputValue: "2:00 PM",
      card1Body: [
        { t: "Acme", kind: "value" },
        { t: ": Reminder, you have an appointment tomorrow at " },
        { t: "2:00 PM", kind: "highlight" },
        { t: ". Reschedule: " },
        { t: "yourapp.com/reschedule", kind: "value" },
      ],
      card2Body: [
        { t: "Acme", kind: "value" },
        { t: ": Reminder, you have an appointment tomorrow at " },
        { t: "2:00 PM", kind: "highlight" },
        { t: ". Reschedule: " },
        { t: "yourapp.com/reschedule", kind: "value" },
      ],
      menuRows: [
        { name: "workspace_name", value: "Acme" },
        { name: "customer_name", value: "Jordan Lee" },
        { name: "appointment_time", value: "2:00 PM", selected: true },
        { name: "reschedule_link", value: "yourapp.com/reschedule" },
      ],
    },
  },

  // ── 4. Verification ──────────────────────────────────────────────────────
  {
    urlSlug: "verification",
    lockedCategory: "verification",
    name: "Verification",
    metaTitle: "Verification code text messages | RelayKit",
    metaDescription:
      "Send one-time codes and sign-in confirmations the moment a customer needs them. Free to author and test; RelayKit handles registration, opt-outs, and carrier rules.",
    heroEyebrow: "Verification",
    h1: "Verification code texts for your app.",
    heroBody:
      "One-time codes and sign-in confirmations — the messages a customer needs for access.",
    heroExamples: [
      "Your verification code is 480913. It expires in 10 minutes.",
      "Your sign-in code is 215704. Enter it to continue.",
      "New sign-in from a new device. Confirm it was you: yourapp.com/security",
      "Your password reset code is 736204. It expires in 10 minutes.",
    ],
    moment: {
      body: "A customer tries to log in from a new device and hits a code prompt. The code lands before they give up and reset their password.",
      exampleSms: "Your verification code is 480913. It expires in 10 minutes.",
      exampleReply: "Logged in",
    },
    detailsHeading: "Q&A: Verification messages",
    qa: [
      {
        q: "Do verification texts need a STOP line?",
        lead: "No — it's the one exception.",
        body: "Carriers carve out 2FA traffic from standard opt-out requirements. A STOP line on a one-time code is unnecessary.",
      },
      {
        q: "Is SMS still a good choice for login 2FA?",
        lead: "It's the most common choice, but not the most secure one.",
        body: "Authenticator apps and passkeys are harder to compromise than SMS. For a login second factor, they're the better recommendation. SMS earns its place for signup verification, account recovery, and confirming high-stakes actions — not as a primary auth layer.",
      },
      {
        q: "How much does verification SMS actually cost?",
        lead: "More than you'd expect if you're paying per verification.",
        body: "Twilio Verify charges $0.0575 per successful verification — retries and failures stack on top. At 5,000 verifications a month that's nearly $300. RelayKit's flat rate includes 500 messages; most indie SaaS verification volumes fit comfortably inside it.",
      },
      {
        q: "What's the difference between a verification code and a confirmation code?",
        lead: "The trigger, not the code itself.",
        body: "A verification code proves phone ownership — typically sent once at signup. A confirmation code adds friction before a specific action, like changing a payment method or transferring account ownership. Same six digits, different moment, different purpose in your app's logic.",
      },
    ],
    messagesEyebrow: "Verification messages",
    messagesHeading: "Verification messages, ready to send.",
    messagesBridge: "Every verification message your app sends. Copy them, customize them, or write your own.",
    variablesExample: {
      inputValue: "480913",
      card1Body: [
        { t: "Acme", kind: "value" },
        { t: ": Your verification code is " },
        { t: "480913", kind: "highlight" },
        { t: ". It expires in 10 minutes." },
      ],
      card2Body: [
        { t: "Acme", kind: "value" },
        { t: ": Your verification code is " },
        { t: "480913", kind: "highlight" },
        { t: ". It expires in 10 minutes." },
      ],
      menuRows: [
        { name: "workspace_name", value: "Acme" },
        { name: "code", value: "480913", selected: true },
        { name: "expiry_minutes", value: "10" },
      ],
    },
  },

  // ── 5. Customer support ──────────────────────────────────────────────────
  {
    urlSlug: "support",
    lockedCategory: "customer-support",
    name: "Customer support",
    metaTitle: "Support update text messages | RelayKit",
    metaDescription:
      "Send the replies customers are waiting on: ticket updates, agent responses, resolutions. Free to author and test; RelayKit handles registration, opt-outs, and carrier rules.",
    heroEyebrow: "Customer support",
    h1: "Support update texts for your app.",
    heroBody:
      "Ticket replies, status updates, agent responses — the messages that tell a customer their problem is moving.",
    heroExamples: [
      "We've replied to your support request #318. Read it: yourapp.com/tickets/318",
      "Your ticket #318 has been resolved. View the details: yourapp.com/tickets/318",
      "An agent is ready to help with your request: yourapp.com/support",
      "Your callback is scheduled for 3:00 PM today: yourapp.com/support",
    ],
    moment: {
      body: "A customer files a ticket and assumes it disappeared into a queue. The reply text brings them back the moment there's something to read.",
      exampleSms:
        "We've replied to your support request #318. Read it here: yourapp.com/tickets/318",
      exampleReply: "Sorted in one reply",
    },
    detailsHeading: "Q&A: Support messages",
    qa: [
      {
        q: "When should support texts go out — any time of day?",
        lead: "Use quiet hours as the default.",
        body: "8am to 9pm recipient time is the safe baseline for anything proactive. A reply notification on a ticket the customer opened is lower-risk outside those hours, but urgent service alerts aside, most support texts can wait until morning without losing anything.",
      },
      {
        q: "Can customers reply to a support text?",
        lead: "Yes, and it's worth designing for.",
        body: "Customer Care is the one category built for two-way conversation. A customer replying to a ticket update extends the thread. RelayKit's inbound handling makes that reply reachable from your system, so the support conversation can live on SMS without losing continuity.",
      },
      {
        q: "What's the difference between proactive outreach and a marketing re-engagement text?",
        lead: "One is support-shaped, one is sales-shaped.",
        body: "Proactive outreach fires when your system detects friction — a failed action, a stuck flow. It runs on your transactional registration. A re-engagement text is promotional, which requires separate consent and runs as a marketing add-on — a different channel with different rules, even if it uses the same phone number.",
      },
      {
        q: "Should the text say which agent is handling the ticket?",
        lead: "Only if it's a real person's name.",
        body: "Agent attribution builds trust when it's genuine. A name attached to a bot or a queue does the opposite. If your support is automated or pooled, leave the name out or attribute it honestly.",
      },
    ],
    messagesEyebrow: "Support messages",
    messagesHeading: "Support messages, ready to send.",
    messagesBridge: "Every support message your app sends. Copy them, customize them, or write your own.",
    variablesExample: {
      inputValue: "318",
      card1Body: [
        { t: "Acme", kind: "value" },
        { t: ": We've replied to your support request #" },
        { t: "318", kind: "highlight" },
        { t: ". Read it: " },
        { t: "yourapp.com/tickets/318", kind: "value" },
      ],
      card2Body: [
        { t: "Acme", kind: "value" },
        { t: ": We've replied to your support request #" },
        { t: "318", kind: "highlight" },
        { t: ". Read it: " },
        { t: "yourapp.com/tickets/318", kind: "value" },
      ],
      menuRows: [
        { name: "workspace_name", value: "Acme" },
        { name: "ticket_number", value: "318", selected: true },
        { name: "ticket_link", value: "yourapp.com/tickets/318" },
        { name: "agent_name", value: "Sam" },
      ],
    },
  },

  // ── 6. Team alerts ───────────────────────────────────────────────────────
  {
    urlSlug: "team-alerts",
    lockedCategory: "team-alerts",
    name: "Team alerts",
    metaTitle: "Team alert text messages | RelayKit",
    metaDescription:
      "Send the alerts your team needs before a dashboard: outages, failed jobs, high-value signups. Free to author and test; RelayKit handles registration, opt-outs, and carrier rules.",
    heroEyebrow: "Team alerts",
    h1: "Team alert text messaging for your app.",
    heroBody:
      "On-call pages, new signups, things that broke — the messages your team needs before they open a dashboard.",
    heroExamples: [
      "Error rate spiked on checkout 3 min ago. View: yourapp.com/alerts",
      "A background job failed and needs attention: yourapp.com/jobs",
      "New high-value signup just landed. See the account: yourapp.com/admin",
      "API latency is above threshold. Check the dashboard: yourapp.com/status",
    ],
    moment: {
      body: "The checkout error rate spikes at 2 a.m. and no one is watching the dashboard. The on-call engineer gets the page so the problem doesn't sit until morning.",
      exampleSms:
        "Error rate spiked on checkout 3 min ago. View the incident: yourapp.com/alerts",
      exampleReply: "Fixed in time",
    },
    detailsHeading: "Q&A: Team alert messages",
    qa: [
      {
        q: "Do I need consent from employees before texting them?",
        lead: "Yes — employment alone doesn't cover it.",
        body: "Federal text messaging law requires explicit consent from recipients, including employees. The cleanest approach is capturing opt-in during onboarding or in your hiring flow, not assuming it. Employees also retain the right to opt out, which is worth factoring into your shift-management design.",
      },
      {
        q: "What severity labels should I use?",
        lead: "Whatever the team already uses.",
        body: "P0/P1, SEV1/SEV2, Critical/High, Red/Yellow — all are valid. RelayKit doesn't prescribe one. The right label is the one the team responds to without having to think about it.",
      },
      {
        q: "Can team members acknowledge an alert by replying?",
        lead: "Yes — that's a common pattern.",
        body: "Escalation pings can prompt 'Reply ACK to claim it' — the reply stops the escalation clock and routes the incident to whoever responded. The inbound handling is on RelayKit's side; your system just receives the acknowledgment event.",
      },
      {
        q: "This category covers both shift scheduling and incident alerts — do I need both?",
        lead: "Only the ones your app sends.",
        body: "A scheduling tool for restaurants needs the shift lifecycle. A monitoring dashboard needs the alert events. They're both internal team communication, so you author only the message types your system actually triggers.",
      },
    ],
    messagesEyebrow: "Team alert messages",
    messagesHeading: "Team alert messages, ready to send.",
    messagesBridge: "Every team alert your app sends. Copy them, customize them, or write your own.",
    variablesExample: {
      inputValue: "checkout",
      card1Body: [
        { t: "Acme", kind: "value" },
        { t: ": Error rate spiked on " },
        { t: "checkout", kind: "highlight" },
        { t: " 3 min ago. View: " },
        { t: "yourapp.com/alerts", kind: "value" },
      ],
      card2Body: [
        { t: "Acme", kind: "value" },
        { t: ": Error rate spiked on " },
        { t: "checkout", kind: "highlight" },
        { t: " 3 min ago. View: " },
        { t: "yourapp.com/alerts", kind: "value" },
      ],
      menuRows: [
        { name: "workspace_name", value: "Acme" },
        { name: "alert_type", value: "checkout", selected: true },
        { name: "incident_link", value: "yourapp.com/alerts" },
        { name: "triggered_at", value: "3 min ago" },
      ],
    },
  },

  // ── 7. Waitlist ──────────────────────────────────────────────────────────
  {
    urlSlug: "waitlist",
    lockedCategory: "waitlist",
    name: "Waitlist",
    metaTitle: "Waitlist text messages | RelayKit",
    metaDescription:
      "Send time-sensitive openings while the chance is still live: spots, tables, restocks. Free to author and test; RelayKit handles registration, opt-outs, and carrier rules.",
    heroEyebrow: "Waitlist",
    h1: "Waitlist text messaging for your app.",
    heroBody:
      "Spot-available alerts, table-ready pings, back-in-stock notices — the messages that expire if they're late.",
    heroExamples: [
      "A spot just opened for tonight at 7:30. Reply YES in 10 minutes to claim it.",
      "You're next on the waitlist. Reply YES to take the spot: yourapp.com/claim",
      "The item you wanted is back in stock. Get it here: yourapp.com/shop",
      "A table is ready for you now. Reply YES to confirm: yourapp.com/claim",
    ],
    moment: {
      body: "A restaurant gets a cancellation for tonight at 7:30. The next person on the list claims the table; before it would have sat empty.",
      exampleSms:
        "A spot just opened for tonight at 7:30. Reply YES in the next 10 minutes to claim it.",
      exampleReply: "YES",
    },
    detailsHeading: "Q&A: Waitlist messages",
    qa: [
      {
        q: "What's the difference between a capacity waitlist and a pre-launch waitlist?",
        lead: "The window. Same six stages, completely different timing.",
        body: "A restaurant waitlist moves in minutes — 'you're up in 15' means now. A beta waitlist moves in weeks. The messages are the same shape, but the wait estimate token is the one doing all the work to set the right expectation.",
      },
      {
        q: "Does the join confirmation text matter?",
        lead: "More than any other message in the sequence.",
        body: "It's the only text the user is guaranteed to read. It sets the tone for everything that follows — what they expect, how long they'll wait, and whether they'll act when their turn comes. A generic 'you've been added to the waitlist' wastes it.",
      },
      {
        q: "How long should the grace window be?",
        lead: "Long enough that a busy person can act on it.",
        body: "For a restaurant table, 10 minutes is standard — the next person needs the spot. For a beta invite or a course cohort, 48 hours is more realistic. The window is a business decision: short keeps the queue moving, long captures people who don't check their phone immediately.",
      },
      {
        q: "Can the missed text include an offer to win them back?",
        lead: "No — but it can invite them to rejoin.",
        body: "A discount or promotional incentive changes the text's classification from transactional to marketing, which requires separate consent. Sticking to a simple rejoin link keeps it transactional and is usually enough to recover the people who just missed the window.",
      },
    ],
    messagesEyebrow: "Waitlist messages",
    messagesHeading: "Waitlist messages, ready to send.",
    messagesBridge: "Every waitlist message your app sends. Copy them, customize them, or write your own.",
    variablesExample: {
      inputValue: "7:30",
      card1Body: [
        { t: "Acme", kind: "value" },
        { t: ": A spot just opened for tonight at " },
        { t: "7:30", kind: "highlight" },
        { t: ". Reply YES in 10 minutes to claim it." },
      ],
      card2Body: [
        { t: "Acme", kind: "value" },
        { t: ": A spot just opened for tonight at " },
        { t: "7:30", kind: "highlight" },
        { t: ". Reply YES in 10 minutes to claim it." },
      ],
      menuRows: [
        { name: "workspace_name", value: "Acme" },
        { name: "customer_name", value: "Jordan Lee" },
        { name: "spot_time", value: "7:30", selected: true },
        { name: "claim_window", value: "10 minutes" },
      ],
    },
  },

  // ── 8. Community ─────────────────────────────────────────────────────────
  {
    urlSlug: "community",
    lockedCategory: "community",
    name: "Community",
    metaTitle: "Community text messages | RelayKit",
    metaDescription:
      "Send the nudges that bring members back: event reminders, replies, announcements. Free to author and test; RelayKit handles registration, opt-outs, and carrier rules.",
    heroEyebrow: "Community",
    h1: "Community text messaging for your app.",
    heroBody:
      "Event reminders, new-post alerts, member announcements — the messages that keep a community active.",
    heroExamples: [
      "Tonight's meetup starts at 6:30. Join here: yourapp.com/live",
      "Someone replied to your post. Read it: yourapp.com/thread",
      "Voting closes in 1 hour. Cast your vote: yourapp.com/vote",
      "A new event was added near you. See the details: yourapp.com/events",
    ],
    moment: {
      body: "Members booked a spot at your event months ago and haven't thought about it since. A text that morning puts it back on their radar.",
      exampleSms: "Tonight's meetup starts at 6:30. Here's the link to join: yourapp.com/live",
      exampleReply: "Almost forgot, thanks",
    },
    detailsHeading: "Q&A: Community messages",
    qa: [
      {
        q: "How often should I text community members?",
        lead: "Less than you think.",
        body: "One or two texts a week is the ceiling for most communities before opt-outs start climbing. SMS earns its place for the moments that need attention right now — a live event starting, an urgent update. Everything else reads better in email or in-app.",
      },
      {
        q: "What's the difference between a community announcement and a marketing message?",
        lead: "Whether it's selling something.",
        body: "A community announcement tells members about something new inside the community itself — a new channel, a new track, a format change. The moment it includes an offer or a discount it becomes marketing, which runs as a separate $10/month add-on with its own consent requirements.",
      },
      {
        q: "Should the texts come from our business name or the community name?",
        lead: "Use whichever name members actually recognize.",
        body: "If your community has its own name — The Founder Circle, Dev Collective, whatever it is — use that. If your community goes by your business name, they're the same thing. The community_name variable is where that goes; it sits at the front of every message.",
      },
      {
        q: "Should I send the full onboarding sequence to every new member?",
        lead: "Start with Welcome and see how members respond.",
        body: "The full sequence — Welcome, First action, Resource pointer, Week 1 check-in — is four texts in seven days. That works when the community is active and gives new members something real to do. If it's early days, start with Welcome only and add the rest when there's something worth pointing people toward.",
      },
    ],
    messagesEyebrow: "Community messages",
    messagesHeading: "Community messages, ready to send.",
    messagesBridge: "Every community message your app sends. Copy them, customize them, or write your own.",
    variablesExample: {
      inputValue: "6:30",
      card1Body: [
        { t: "Acme", kind: "value" },
        { t: ": Tonight's meetup starts at " },
        { t: "6:30", kind: "highlight" },
        { t: ". Join here: " },
        { t: "yourapp.com/live", kind: "value" },
      ],
      card2Body: [
        { t: "Acme", kind: "value" },
        { t: ": Tonight's meetup starts at " },
        { t: "6:30", kind: "highlight" },
        { t: ". Join here: " },
        { t: "yourapp.com/live", kind: "value" },
      ],
      menuRows: [
        { name: "workspace_name", value: "Acme" },
        { name: "member_name", value: "Jordan Lee" },
        { name: "event_time", value: "6:30", selected: true },
        { name: "event_link", value: "yourapp.com/live" },
      ],
    },
  },

  // ── 9. Marketing ─────────────────────────────────────────────────────────
  {
    urlSlug: "marketing",
    lockedCategory: "marketing",
    name: "Marketing",
    metaTitle: "Marketing text messages | RelayKit",
    metaDescription:
      "Send promotions customers opted in to receive, timed to land well. Free to author and test; RelayKit handles registration, opt-outs, and carrier rules.",
    heroEyebrow: "Marketing",
    h1: "Marketing text messaging for your app.",
    heroBody:
      "Promotions, launches, limited offers — the SMS channel that drives sales.",
    heroExamples: [
      "Early access to our new plan opens today. Take a look: yourapp.com/new",
      "Your offer ends tonight. Claim it before it's gone: yourapp.com/offer",
      "Just launched: something we think you'll like: yourapp.com/new",
      "A members-only perk, this week only: yourapp.com/perks",
    ],
    moment: {
      body: "A customer signed up for launch notifications six months ago. The morning the feature ships, the text is the first place they hear about it.",
      exampleSms: "Early access to our new plan opens today. Take a look: yourapp.com/new",
      exampleReply: "Been waiting for this",
    },
    detailsHeading: "Q&A: Marketing messages",
    qa: [
      {
        q: "Does getting someone's phone number for order updates mean I can send them promotions?",
        lead: "No — marketing requires its own separate opt-in.",
        body: "Transactional consent covers all other message categories — account alerts, order updates, appointment reminders, and the rest. Promotional texts need a separate, explicit agreement — 'I want to hear about offers.' The two consent paths are tracked independently, and mixing them is a compliance violation.",
      },
      {
        q: "What makes a marketing text feel like spam?",
        lead: "Fake urgency and vague promises.",
        body: "Carriers scan for manipulation patterns — ALL CAPS, multiple exclamation points, 'biggest ever,' 'don't miss out.' Those phrases trigger filtering and erode trust even when they get through. A marketing text that says what it is — 'we launched X, here's the link' — reads better than one that tries to manufacture excitement.",
      },
      {
        q: "Are there topics I can't promote, even with consent?",
        lead: "Yes — certain categories are blocked outright.",
        body: "Alcohol, tobacco, firearms, and controlled substances are restricted or blocked by carriers regardless of consent, with rules that vary by state. A cannabis dispensary with a fully consented list still can't send promotional SMS through standard carrier channels.",
      },
      {
        q: "How often is too often for marketing texts?",
        lead: "Most indie SaaS audiences tolerate one or two a month.",
        body: "Re-engagement texts carry the highest opt-out risk — the recipient has been quiet for months and the text arrives uninvited. Product launches and event invites land better because they're tied to something specific. Whatever the frequency, it should be disclosed at the point of opt-in.",
      },
    ],
    messagesEyebrow: "Marketing messages",
    messagesHeading: "Marketing messages, ready to send.",
    messagesBridge: "Every marketing message your app sends. Copy them, customize them, or write your own.",
    variablesExample: {
      inputValue: "new plan",
      card1Body: [
        { t: "Acme", kind: "value" },
        { t: ": Early access to our " },
        { t: "new plan", kind: "highlight" },
        { t: " opens today. Take a look: " },
        { t: "yourapp.com/new", kind: "value" },
      ],
      card2Body: [
        { t: "Acme", kind: "value" },
        { t: ": Early access to our " },
        { t: "new plan", kind: "highlight" },
        { t: " opens today. Take a look: " },
        { t: "yourapp.com/new", kind: "value" },
      ],
      menuRows: [
        { name: "workspace_name", value: "Acme" },
        { name: "customer_name", value: "Jordan Lee" },
        { name: "offer_name", value: "new plan", selected: true },
        { name: "offer_link", value: "yourapp.com/new" },
      ],
    },
  },
];

// Keyed on the PUBLIC slug — route param, canonical, and Farm all resolve here.
const BY_SLUG = new Map(CATEGORY_LANDINGS.map((e) => [e.urlSlug, e]));

export function findCategoryLanding(urlSlug: string): CategoryLanding | null {
  return BY_SLUG.get(urlSlug) ?? null;
}

export function categorySlugs(): string[] {
  return CATEGORY_LANDINGS.map((e) => e.urlSlug);
}
