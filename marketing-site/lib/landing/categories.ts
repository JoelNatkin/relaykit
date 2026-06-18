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
        q: "Who should get the failed payment text?",
        lead: "The person who can fix it.",
        body: "Texting everyone on the account just adds noise for the people who can't update the card anyway.",
      },
      {
        q: "Who should get a new-device alert?",
        lead: "The person who signed in.",
        body: "It's their security event, and they're the only one who can confirm it or lock things down.",
      },
      {
        q: "Which account events are worth a text?",
        lead: "The ones a customer has to act on right now.",
        body: "If it can wait until they next open the app, it doesn't need a text. Receipts and digests can stay in email.",
        list: ["A declined payment", "A new-device sign-in", "An account suspension"],
      },
      {
        q: "What if we don't have a user's phone number?",
        lead: "They still get the email.",
        body: "Account messages matter enough to send as both a text and an email: the text reaches whoever sees it first, the email is the record everyone gets.",
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
        q: "Which order updates are worth a text?",
        lead: "The ones tied to a moment that's passing.",
        body: "Confirmations and receipts can stay in email, where the customer can find them later.",
        list: ["Out for delivery", "Ready for pickup", "A payment that needs action"],
      },
      {
        q: "Should every status change get a text?",
        lead: "Probably not.",
        body: "A text for each tiny step trains people to stop reading them. The few that need attention right now are the ones that earn the channel.",
      },
      {
        q: "Who gets the shipping text?",
        lead: "The person who placed the order.",
        body: "If a gift is shipping to someone else, the buyer still gets the updates, since they're the one who can act on a problem.",
      },
      {
        q: "What about a delivery that goes wrong?",
        lead: "That's the most useful text of all.",
        body: "A missed delivery or a failed payment is exactly the moment a customer wants to hear from you, while there's still time to fix it.",
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
        q: "When should a reminder go out?",
        lead: "Far enough ahead that the customer can still act on it.",
        body: "A reminder the day before, with a reschedule link, turns a forgotten booking into one that's kept or moved instead of missed.",
      },
      {
        q: "Does a confirmation text help?",
        lead: "Yes, at the moment of booking.",
        body: "It gives the customer a record they can find later and a way to change plans early, before the slot becomes hard to fill.",
      },
      {
        q: "What about last-minute changes?",
        lead: "A reschedule link in every reminder.",
        body: "The customer who can't make it moves themselves, and the open slot has time to find someone else.",
      },
      {
        q: "Who gets the reminder?",
        lead: "The person the appointment is for.",
        body: "If someone booked on another's behalf, both can be worth a text, since either one might be the one who needs to act.",
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
        lead: "No.",
        body: "A one-time code is the one message that stays clear of opt-out language, since someone asked for it the instant they requested the code. RelayKit handles that exception for you.",
      },
      {
        q: "How fast does a code need to arrive?",
        lead: "Within seconds.",
        body: "A code that lands after the customer has given up is worse than no code at all, since they've already hit a wall and moved on.",
      },
      {
        q: "What goes in a verification message?",
        lead: "The code, the app it's for, and how long it lasts.",
        body: "Anything more gets in the way of the one thing the customer is scanning for.",
      },
      {
        q: "Can the same setup send other security texts?",
        lead: "Yes.",
        body: "New-device sign-ins and password resets sit right next to verification, and they reach the person who can confirm the action or shut it down.",
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
        q: "Which support moments are worth a text?",
        lead: "The ones where a customer is waiting on you.",
        body: "Routine acknowledgements can stay in email.",
        list: ["A reply posted", "A ticket resolved", "A callback about to happen"],
      },
      {
        q: "Won't a text feel intrusive?",
        lead: "Not when it carries something the customer asked for.",
        body: "They opened the ticket, so a reply or a resolution is news, not an interruption.",
      },
      {
        q: "Who gets the support text?",
        lead: "The person on the ticket.",
        body: "If a teammate is looped in, the original requester stays the one who hears about the reply, since the conversation is theirs.",
      },
      {
        q: "What about a long back-and-forth?",
        lead: "A text for the first reply and the resolution is usually enough.",
        body: "Texting every message in a long thread turns a helpful nudge into noise.",
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
        q: "Who should a team alert reach?",
        lead: "Whoever can act on it right now, not the whole team.",
        body: "The on-call engineer needs the page; everyone else can read about it later in the log.",
      },
      {
        q: "What deserves an alert versus a digest?",
        lead: "A text fits anything that can't wait until morning.",
        body: "The rest read better in a daily summary than as a buzz at midnight.",
        list: ["An outage", "A failed job", "A high-value signup"],
      },
      {
        q: "Do these texts follow the same rules?",
        lead: "Team alerts go to your own people, who agreed to receive them as part of the job.",
        body: "RelayKit still handles the carrier side so the alerts get through.",
      },
      {
        q: "Can the same setup reach more than one person?",
        lead: "Yes.",
        body: "A rotation or an escalation can move an alert from one teammate to the next, so a missed page doesn't sit unanswered.",
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
        q: "Why does a waitlist text beat an email?",
        lead: "Because the window is short.",
        body: "A spot that's open for ten minutes is gone by the time most people check email. A text lands while the chance is still real.",
      },
      {
        q: "Who gets the notification?",
        lead: "The next person in line, one at a time.",
        body: "Notifying the whole list at once creates a scramble and a lot of disappointed replies for a single open spot.",
      },
      {
        q: "What if they don't respond?",
        lead: "The offer can pass to the next person after a set time.",
        body: "A clear window in the message lets the spot keep moving instead of sitting empty.",
      },
      {
        q: "Does this work for restocks too?",
        lead: "Yes.",
        body: "A back-in-stock text is the same idea: a limited thing became available, and the people who asked to know get the first chance at it.",
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
        q: "What community messages are worth a text?",
        lead: "The time-sensitive ones.",
        body: "General updates and digests read fine in email or in-app.",
        list: ["An event starting", "A reply to something they posted", "A vote closing"],
      },
      {
        q: "Won't members feel over-messaged?",
        lead: "They will if every post becomes a text.",
        body: "Keeping texts to the moments that call them back, like an event about to start, keeps the channel welcome instead of noisy.",
      },
      {
        q: "Who opted in to these?",
        lead: "Members who joined and chose to hear from the community.",
        body: "A well-timed text to them feels like a favor rather than a broadcast.",
      },
      {
        q: "Is a community text the same as marketing?",
        lead: "No.",
        body: "A reminder about something a member already joined is different from a promotion. Marketing has its own setup and consent, which RelayKit keeps separate.",
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
        q: "What makes a marketing text welcome?",
        lead: "Consent and timing.",
        body: "A customer who chose to hear from you, getting an offer that's relevant, reads it as useful. The same message to someone who didn't ask reads as spam.",
      },
      {
        q: "How is marketing different from the rest?",
        lead: "It's the one category that needs its own opt-in and its own setup.",
        body: "RelayKit runs marketing as a separate track, so a promotion never rides on the consent someone gave for account texts.",
      },
      {
        q: "Does marketing cost extra?",
        lead: "Yes, marketing adds $10 a month on top of your plan.",
        body: "It runs as its own registered track. Everything else, the transactional messages, is included.",
      },
      {
        q: "How does opting out work?",
        lead: "Anyone can stop marketing texts at any time.",
        body: "RelayKit honors it automatically while leaving their account messages untouched. The two consents stay separate.",
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
