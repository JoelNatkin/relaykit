import type { Category, Variable } from "./types";
import { SHARED_VARIABLES } from "./shared-variables";

/**
 * Marketing variable catalog: `business_name` from the shared set (the sender
 * frame), plus eight category-specific tokens defined locally.
 *
 * The category is discrete-disconnected (research §2): four standalone
 * messages (promotional-offer, product-launch, re-engagement,
 * event-invitation) with no sequence between them. Each carries a trigger
 * description in `groupNote`, not a step-N (documentation-only this wave per
 * D-408; reserved for the future workspace UX).
 *
 * This is the MARKETING TCR campaign — the sole category that carries
 * promotional content, the designated exception to D-399. It registers as its
 * own EIN-gated TCR campaign (D-247) and requires marketing-specific consent
 * separate from transactional opt-in.
 *
 * No token is typeConstrained — every value is plain GSM-7 text and counts
 * against the D-402 single-segment budget. `offer_link`, `launch_link`,
 * `reengagement_link`, and `rsvp_link` point at the developer's own surfaces
 * on their own domain — RelayKit does not shorten or host them; full URLs or
 * branded short links are preferred over public shorteners. `offer` is the
 * full offer phrase including any real deadline; `event_time` is a free-form
 * time string.
 */
const MARKETING_VARIABLES: Variable[] = [
  SHARED_VARIABLES.business_name,
  {
    name: "offer",
    description:
      "The full offer phrase, including any real deadline or scarcity ('30% off your first year', 'first 100 get 30% off'). The developer phrases legitimate urgency here — never manufactured urgency.",
    budgetChars: 32,
    source: "SDK call payload",
    example: "30% off your first year",
  },
  {
    name: "offer_link",
    description:
      "Link to claim the offer, on the developer's own domain. RelayKit does not shorten or host this URL; full URLs or branded short links are preferred over public shorteners (bit.ly etc.).",
    budgetChars: 26,
    source: "SDK call payload",
    example: "yourapp.com/offer",
  },
  {
    name: "launch_name",
    description:
      "What launched ('Brand Studio', 'our iOS app'). Budgeted for a short product name, not a sentence.",
    budgetChars: 22,
    source: "SDK call payload",
    example: "Brand Studio",
  },
  {
    name: "launch_link",
    description:
      "Link to the launched product, on the developer's own domain. RelayKit does not shorten or host this URL; full URLs or branded short links are preferred over public shorteners.",
    budgetChars: 26,
    source: "SDK call payload",
    example: "yourapp.com/new",
  },
  {
    name: "reengagement_link",
    description:
      "Link for a lapsed user to return, on the developer's own domain. RelayKit does not shorten or host this URL; full URLs or branded short links are preferred over public shorteners.",
    budgetChars: 26,
    source: "SDK call payload",
    example: "yourapp.com/whatsnew",
  },
  {
    name: "event_name",
    description:
      "The event's title ('Founder AMA'). Budgeted for a short event title, not a sentence.",
    budgetChars: 20,
    source: "SDK call payload",
    example: "Founder AMA",
  },
  {
    name: "event_time",
    description:
      "Free-form time the event happens or starts ('Thursday at 2pm ET'). Just the time — the body supplies the framing.",
    budgetChars: 16,
    source: "SDK call payload",
    example: "Thursday at 2pm ET",
  },
  {
    name: "rsvp_link",
    description:
      "Link to RSVP to the event, on the developer's own domain. RelayKit does not shorten or host this URL; full URLs or branded short links are preferred over public shorteners.",
    budgetChars: 26,
    source: "SDK call payload",
    example: "yourapp.com/rsvp",
  },
];

export const MARKETING: Category = {
  id: "marketing",
  name: "Marketing",
  description:
    "Promotional offers, product launches, re-engagement, and event invitations.",
  tcrMapping: "MARKETING",
  variables: MARKETING_VARIABLES,
  compliance: {
    rules: [
      "No credentials in the body (D-393) — marketing messages carry offers, links, and announcements only, never license keys, API keys, or passwords.",
      "Promotional content permitted — Marketing is the sole campaign that carries offers, discounts, and launch promotion; it is the designated exception to D-399, which prohibits promotional content in every other category.",
      "Separate TCR campaign — Marketing registers as its own TCR campaign distinct from transactional, is EIN-gated (D-247), and requires explicit marketing-specific consent separate from transactional opt-in (two consent paths).",
      "SHAFT-C prohibited — even with consent, marketing bodies carry no sex, hate, alcohol, firearms, tobacco, or controlled-substance content; carriers scan and block.",
      "No manipulative urgency — legitimate scarcity and real deadlines are fine; false urgency, fake scarcity, ALL CAPS, exclamation pile-ons, and 'biggest/don't miss' framing are not.",
      "Single GSM-7 segment (D-402) — every body stays under 160 characters at worst-case token substitution; all bodies are ASCII-only with no emoji.",
      "Includes {{business_name}} as the sender frame in every body so the recipient knows which brand is messaging.",
      "STOP opt-out in every body — carries the standard STOP opt-out language ('Reply STOP to opt out.', shortened to 'STOP to opt out.' in Brief variants). STOP-only, not STOP/HELP (D-410) — HELP functions as a keyword regardless of body text.",
    ],
  },
  messages: [
    {
      id: "promotional-offer",
      name: "Promotional offer",
      tooltip: "Sent when a promotional offer or sale window opens.",
      description:
        "A promotional offer — a discount, sale window, or limited-time pricing. The most regulated of the Marketing messages; the offer phrase carries any legitimate urgency, never manufactured urgency.",
      groupNote:
        "Discrete marketing message - sent when a promotional offer or sale window opens.",
      variables: ["business_name", "offer", "offer_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{business_name}}: {{offer}}. Claim it here: {{offer_link}} Reply STOP to opt out.",
          charCount: 125,
        },
        {
          tone: "Friendly",
          body: "Your {{business_name}} offer: {{offer}}. Grab it here: {{offer_link}} Reply STOP to opt out.",
          charCount: 135,
        },
        {
          tone: "Brief",
          body: "{{business_name}}: {{offer}}. {{offer_link}} STOP to opt out.",
          charCount: 104,
        },
      ],
    },
    {
      id: "product-launch",
      name: "Product launch",
      tooltip: "Sent when a new product or feature goes live.",
      description:
        "Announces a new product, app, or major feature going live — a one-time send to an opted-in audience.",
      groupNote:
        "Discrete marketing message - sent when a new product or major feature goes live.",
      variables: ["business_name", "launch_name", "launch_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{business_name}}: {{launch_name}} is live. Take a look: {{launch_link}} Reply STOP to opt out.",
          charCount: 121,
        },
        {
          tone: "Friendly",
          body: "Your {{business_name}} update: {{launch_name}} just launched. See it here: {{launch_link}} Reply STOP to opt out.",
          charCount: 139,
        },
        {
          tone: "Brief",
          body: "{{business_name}}: {{launch_name}}, now live. {{launch_link}} STOP to opt out.",
          charCount: 104,
        },
      ],
    },
    {
      id: "re-engagement",
      name: "Re-engagement",
      tooltip: "Sent to win back a lapsed user.",
      description:
        "A win-back touch for a lapsed user. The most opt-out-sensitive Marketing message — the recipient has been silent for months and the SMS arrives uninvited.",
      groupNote:
        "Discrete marketing message - sent to re-engage a user who has lapsed.",
      variables: ["business_name", "reengagement_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{business_name}}: it's been a while. Here's what you've missed: {{reengagement_link}} Reply STOP to opt out.",
          charCount: 122,
        },
        {
          tone: "Friendly",
          body: "Your {{business_name}} account has been quiet - here's what's new since you left: {{reengagement_link}} Reply STOP to opt out.",
          charCount: 139,
        },
        {
          tone: "Brief",
          body: "{{business_name}}: it's been a while. What's new: {{reengagement_link}} STOP to opt out.",
          charCount: 101,
        },
      ],
    },
    {
      id: "event-invitation",
      name: "Event invitation",
      tooltip: "Sent to invite an opted-in audience to an event.",
      description:
        "Invites an opted-in audience to an event — a webinar, AMA, or launch event — with a time and an RSVP link.",
      groupNote:
        "Discrete marketing message - sent to invite an opted-in audience to an event.",
      variables: ["business_name", "event_name", "event_time", "rsvp_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{business_name}}: {{event_name}} is coming up {{event_time}}. RSVP here: {{rsvp_link}} Reply STOP to opt out.",
          charCount: 139,
        },
        {
          tone: "Friendly",
          body: "Your invite from {{business_name}}: {{event_name}}, {{event_time}}. RSVP: {{rsvp_link}} Reply STOP to opt out.",
          charCount: 139,
        },
        {
          tone: "Brief",
          body: "{{business_name}}: {{event_name}}, {{event_time}}. RSVP: {{rsvp_link}} STOP to opt out.",
          charCount: 116,
        },
      ],
    },
  ],
};
