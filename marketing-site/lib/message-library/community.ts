import type { Category, Variable } from "./types";

/**
 * Community variable catalog: nine category-specific tokens, all defined
 * locally — `community_name` is the sender frame and is NOT drawn from
 * `shared-variables.ts`, because members recognize a community by its own name
 * rather than the parent business name (D-398's workspace_name frame does not
 * apply here). `community_name` mirrors the shape of `workspace_name` — a
 * config-level name token sourced from workspace settings.
 *
 * The category is mixed in shape (research §2): five discrete messages
 * (live-event-reminder, event-invitation, moderation-update, member-milestone,
 * community-announcement) plus a four-step onboarding sequence (welcome,
 * first-action, resource-pointer, week-1-checkin). Onboarding messages carry
 * their step position in `groupNote`; discrete messages carry a trigger
 * description there instead (documentation-only this wave per D-408; reserved
 * for the future workspace UX).
 *
 * No token is typeConstrained — every value is plain GSM-7 text and counts
 * against the D-402 single-segment budget. `join_link`, `rsvp_link`,
 * `update_link`, `announcement_link`, and `resource_link` point at the
 * developer's own surfaces on their own domain — RelayKit does not shorten or
 * host them. `event_time` is a free-form time string ("in 30 minutes");
 * `milestone` is a short phrase ("1 year", "100 posts").
 */
const COMMUNITY_VARIABLES: Variable[] = [
  {
    name: "community_name",
    description:
      "The community's own name as members recognize it — not the parent business name. The sender frame in every body.",
    budgetChars: 30,
    source: "workspace settings",
    example: "The Founder Circle",
  },
  {
    name: "event_name",
    description:
      "The event's title ('Cohort Kickoff', 'Founder AMA'). Budgeted for a short event title, not a sentence.",
    budgetChars: 22,
    source: "SDK call payload",
    example: "Cohort Kickoff",
  },
  {
    name: "event_time",
    description:
      "Free-form time the event happens or starts ('in 30 minutes', 'next Thursday'). Just the time — the body supplies the framing.",
    budgetChars: 16,
    source: "SDK call payload",
    example: "in 30 minutes",
  },
  {
    name: "join_link",
    description:
      "Link to join the live event, on the developer's own domain. RelayKit does not shorten or host this URL.",
    budgetChars: 26,
    source: "SDK call payload",
    example: "yourapp.com/live",
  },
  {
    name: "rsvp_link",
    description:
      "Link to RSVP to the event, on the developer's own domain. RelayKit does not shorten or host this URL.",
    budgetChars: 26,
    source: "SDK call payload",
    example: "yourapp.com/rsvp",
  },
  {
    name: "update_link",
    description:
      "Link to the moderation update's detail, on the developer's own domain. RelayKit does not shorten or host this URL.",
    budgetChars: 26,
    source: "SDK call payload",
    example: "yourapp.com/update",
  },
  {
    name: "milestone",
    description:
      "Short phrase naming the milestone reached ('1 year', '100 posts'). Just the phrase — the body supplies the framing.",
    budgetChars: 18,
    source: "SDK call payload",
    example: "1 year",
  },
  {
    name: "announcement_link",
    description:
      "Link to the announcement's detail, on the developer's own domain. RelayKit does not shorten or host this URL.",
    budgetChars: 26,
    source: "SDK call payload",
    example: "yourapp.com/news",
  },
  {
    name: "resource_link",
    description:
      "Link to the orientation resource, on the developer's own domain. RelayKit does not shorten or host this URL.",
    budgetChars: 26,
    source: "SDK call payload",
    example: "yourapp.com/start",
  },
];

export const COMMUNITY: Category = {
  id: "community",
  name: "Community",
  description:
    "Event reminders, community updates, milestones, and member onboarding.",
  tcrMapping: "ACCOUNT_NOTIFICATION",
  variables: COMMUNITY_VARIABLES,
  compliance: {
    rules: [
      "No credentials in the body (D-393) — community messages carry event details, links, and milestones only, never license keys, API keys, or passwords.",
      "No promotional content (D-399, corpus-wide) — community messages inform and congratulate; an offer or discount makes it Marketing. Milestone and announcement messages sit closest to this line.",
      "Single GSM-7 segment (D-402) — every body stays under 160 characters at worst-case token substitution; all bodies are ASCII-only with no emoji.",
      "Includes {{community_name}} as the sender frame in every body — members recognize the community by its own name, not the parent business; D-398's workspace_name frame does not apply here.",
      "Honors STOP/HELP — every body carries the standard STOP opt-out language ('Reply STOP to opt out.', shortened to 'STOP to opt out.' in Brief variants), matching the appointments/customer-support/waitlist precedent. This is not the Verification 2FA carve-out.",
    ],
  },
  messages: [
    {
      id: "live-event-reminder",
      name: "Live event reminder",
      tooltip: "Sent shortly before a live community event begins.",
      description:
        "Time-sensitive reminder that a live community event is starting, with a join link. The highest-frequency Community message — the SMS arrival is the value.",
      groupNote:
        "Discrete community message - sent shortly before a live community event begins.",
      variables: ["community_name", "event_name", "event_time", "join_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{community_name}}: {{event_name}} starts {{event_time}}. Join: {{join_link}} Reply STOP to opt out.",
          charCount: 135,
        },
        {
          tone: "Friendly",
          body: "Your {{community_name}} community has {{event_name}} starting {{event_time}}: {{join_link}} Reply STOP to opt out.",
          charCount: 149,
        },
        {
          tone: "Brief",
          body: "{{community_name}}: {{event_name}} {{event_time}}. {{join_link}} STOP to opt out.",
          charCount: 116,
        },
      ],
    },
    {
      id: "event-invitation",
      name: "Event invitation",
      tooltip: "Sent when a new community event is posted.",
      description:
        "Announces a newly posted community event and invites members to RSVP. Lower frequency than the live-event reminder; sometimes paired with a follow-up reminder.",
      groupNote:
        "Discrete community message - sent when a new event is posted to the community.",
      variables: ["community_name", "event_name", "event_time", "rsvp_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{community_name}}: new event - {{event_name}} on {{event_time}}. RSVP: {{rsvp_link}} Reply STOP to opt out.",
          charCount: 143,
        },
        {
          tone: "Friendly",
          body: "Your {{community_name}} has a new event - {{event_name}}, {{event_time}}. RSVP: {{rsvp_link}} Reply STOP to opt out.",
          charCount: 151,
        },
        {
          tone: "Brief",
          body: "{{community_name}} event: {{event_name}}, {{event_time}}. RSVP: {{rsvp_link}} STOP to opt out.",
          charCount: 129,
        },
      ],
    },
    {
      id: "moderation-update",
      name: "Moderation update",
      tooltip: "Sent when the community needs member attention.",
      description:
        "Low-frequency, high-signal notice that the community needs members' attention — a moderation action or urgent change — with a link to the detail.",
      groupNote:
        "Discrete community message - sent when the community needs member attention for a moderation or urgent update.",
      variables: ["community_name", "update_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{community_name}}: an important update for the community. Details here: {{update_link}} Reply STOP to opt out.",
          charCount: 134,
        },
        {
          tone: "Friendly",
          body: "Your {{community_name}} community has an update that needs your attention: {{update_link}} Reply STOP to opt out.",
          charCount: 136,
        },
        {
          tone: "Brief",
          body: "{{community_name}}: important community update. {{update_link}} STOP to opt out.",
          charCount: 103,
        },
      ],
    },
    {
      id: "member-milestone",
      name: "Member milestone",
      tooltip: "Sent when a member reaches a community milestone.",
      description:
        "Congratulates a member on a milestone reached in the community — an anniversary, a post-count threshold, a role change. Congratulates only; never carries an offer (D-399).",
      groupNote:
        "Discrete community message - triggered when a member reaches a tenure, activity, or role milestone.",
      variables: ["community_name", "milestone"],
      variants: [
        {
          tone: "Standard",
          body: "{{community_name}}: you've reached {{milestone}} in the community. Thanks for being here. Reply STOP to opt out.",
          charCount: 129,
        },
        {
          tone: "Friendly",
          body: "Your time in {{community_name}} just hit a milestone - {{milestone}}. Glad you're part of it. Reply STOP to opt out.",
          charCount: 133,
        },
        {
          tone: "Brief",
          body: "{{community_name}}: {{milestone}} reached. Thanks for being here. STOP to opt out.",
          charCount: 99,
        },
      ],
    },
    {
      id: "community-announcement",
      name: "Community announcement",
      tooltip: "Sent when there's community news to share.",
      description:
        "Mid-frequency announcement of something new within the community itself — a new channel, track, or feature. Community housekeeping, not a promotional offer (D-399).",
      groupNote:
        "Discrete community message - sent when there is community-housekeeping news to share.",
      variables: ["community_name", "announcement_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{community_name}}: there's something new in the community. Take a look: {{announcement_link}} Reply STOP to opt out.",
          charCount: 134,
        },
        {
          tone: "Friendly",
          body: "Your {{community_name}} community has something new to share: {{announcement_link}} Reply STOP to opt out.",
          charCount: 123,
        },
        {
          tone: "Brief",
          body: "{{community_name}}: something new in the community. {{announcement_link}} STOP to opt out.",
          charCount: 107,
        },
      ],
    },
    {
      id: "welcome",
      name: "Welcome",
      tooltip: "Sent immediately when a member joins.",
      description:
        "First onboarding touch — sent immediately when a member joins, confirming they're in and setting a warm tone.",
      groupNote:
        "Community onboarding - step 1 of 4: sent immediately when a member joins the community.",
      variables: ["community_name"],
      variants: [
        {
          tone: "Standard",
          body: "{{community_name}}: you're in. Welcome to the community - glad to have you here. Reply STOP to opt out.",
          charCount: 115,
        },
        {
          tone: "Friendly",
          body: "Welcome to your new community, {{community_name}}. We're really glad you joined. Reply STOP to opt out.",
          charCount: 115,
        },
        {
          tone: "Brief",
          body: "Welcome to {{community_name}}. Glad you're here. STOP to opt out.",
          charCount: 77,
        },
      ],
    },
    {
      id: "first-action",
      name: "First action",
      tooltip: "Sent 24-48h after a member joins.",
      description:
        "Nudges a new member toward their first meaningful action — introducing themselves in the intros channel.",
      groupNote:
        "Community onboarding - step 2 of 4: sent 24-48h after a member joins.",
      variables: ["community_name"],
      variants: [
        {
          tone: "Standard",
          body: "{{community_name}}: settling in? A good first step is to introduce yourself in the intros channel. Reply STOP to opt out.",
          charCount: 133,
        },
        {
          tone: "Friendly",
          body: "Your {{community_name}} community is waiting - introduce yourself in the intros channel. Reply STOP to opt out.",
          charCount: 123,
        },
        {
          tone: "Brief",
          body: "{{community_name}}: introduce yourself in the intros channel when you get a chance. STOP to opt out.",
          charCount: 112,
        },
      ],
    },
    {
      id: "resource-pointer",
      name: "Resource pointer",
      tooltip: "Sent 3-5 days after a member joins.",
      description:
        "Points a new member to the orientation guide so they can find their way around the community.",
      groupNote:
        "Community onboarding - step 3 of 4: sent 3-5 days after a member joins.",
      variables: ["community_name", "resource_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{community_name}}: here's the orientation guide to help you find your way around: {{resource_link}} Reply STOP to opt out.",
          charCount: 144,
        },
        {
          tone: "Friendly",
          body: "Still finding your way around {{community_name}}? The orientation guide helps: {{resource_link}} Reply STOP to opt out.",
          charCount: 140,
        },
        {
          tone: "Brief",
          body: "{{community_name}}: your orientation guide is here. {{resource_link}} STOP to opt out.",
          charCount: 107,
        },
      ],
    },
    {
      id: "week-1-checkin",
      name: "Week 1 check-in",
      tooltip: "Sent 7 days after a member joins.",
      description:
        "A one-week check-in asking how the new member is settling in.",
      groupNote:
        "Community onboarding - step 4 of 4: sent 7 days after a member joins.",
      variables: ["community_name"],
      variants: [
        {
          tone: "Standard",
          body: "{{community_name}}: you've been part of the community for a week now. How's it going so far? Reply STOP to opt out.",
          charCount: 127,
        },
        {
          tone: "Friendly",
          body: "Your first week in {{community_name}} is done - how's it going so far? Reply STOP to opt out.",
          charCount: 105,
        },
        {
          tone: "Brief",
          body: "{{community_name}}: one week in. How's it going? STOP to opt out.",
          charCount: 77,
        },
      ],
    },
  ],
};
