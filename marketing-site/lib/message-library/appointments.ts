import type { Category, Variable } from "./types";
import { SHARED_VARIABLES } from "./shared-variables";

/**
 * Appointments variable catalog: `workspace_name` and `customer_name` from the
 * shared set, plus five category-specific tokens. Per D-398, `workspace_name`
 * is the sender frame in every body. `customer_name` is catalogued as a shared
 * reference but is used by no body as authored — it stays in the catalog per
 * the §8 shared-reference convention.
 *
 * The category is workflow-shaped (research §1): a seven-step appointment
 * lifecycle (confirmation → reminder-distant → reminder-proximate →
 * reschedule-confirmation → cancellation-confirmation → no-show-follow-up →
 * post-appointment). Every message carries its lifecycle position in
 * `groupNote` (documentation-only this wave per D-408; reserved for the future
 * workspace UX).
 *
 * No token is typeConstrained — every value is plain GSM-7 text and counts
 * against the D-402 single-segment budget. `appointment_time` is a combined
 * date+time string; `reschedule_link`, `cancel_link`, and `feedback_link`
 * point at the developer's own surfaces on their own domain — RelayKit does
 * not shorten or host them. `service_type` and `location` were considered for
 * the catalog and deliberately dropped.
 */
const APPOINTMENTS_VARIABLES: Variable[] = [
  SHARED_VARIABLES.workspace_name,
  SHARED_VARIABLES.customer_name,
  {
    name: "appointment_time",
    description:
      "Combined appointment date and time in a single string ('Tue, March 4th, 2:00 PM'). The category's load-bearing token — every confirmation and reminder must state date and time unambiguously.",
    budgetChars: 24,
    source: "SDK call payload",
    example: "Tue, March 4th, 2:00 PM",
  },
  {
    name: "provider_name",
    description:
      "Name of the provider, host, or staff member the appointment is with ('Dr. Sarah Chen', 'Coach Mike'). Optional — for venue bookings, reservations, and date-range stays with no named provider, the developer may omit it; when the value is empty the confirmation copy is adapted to read naturally without a provider (the variable is optional in the template, not removed).",
    budgetChars: 18,
    source: "SDK call payload",
    example: "Dr. Sarah Chen",
  },
  {
    name: "reschedule_link",
    description:
      "Link to the reschedule / rebooking page on the developer's own domain. RelayKit does not shorten or host this URL.",
    budgetChars: 24,
    source: "SDK call payload",
    example: "yourapp.com/reschedule",
  },
  {
    name: "cancel_link",
    description:
      "Link to the cancellation page on the developer's own domain. RelayKit does not shorten or host this URL.",
    budgetChars: 24,
    source: "SDK call payload",
    example: "yourapp.com/cancel",
  },
  {
    name: "feedback_link",
    description:
      "Link to the post-appointment feedback form on the developer's own domain. RelayKit does not shorten or host this URL.",
    budgetChars: 24,
    source: "SDK call payload",
    example: "yourapp.com/feedback",
  },
  {
    name: "eta",
    description:
      "Short estimated time until a mobile provider, technician, or driver arrives ('25 min', '10:15 AM'). Longer formats would not fit the budget.",
    budgetChars: 12,
    source: "SDK call payload",
    example: "25 min",
  },
  {
    name: "form_link",
    description:
      "Link to the pre-visit intake, consent, or check-in form on the developer's own domain. RelayKit does not shorten or host this URL.",
    budgetChars: 24,
    source: "SDK call payload",
    example: "yourapp.com/forms",
  },
];

export const APPOINTMENTS: Category = {
  id: "appointments",
  name: "Appointments",
  description:
    "Confirmations, reminders, reschedules, cancellations, no-show follow-ups.",
  tcrMapping: "ACCOUNT_NOTIFICATION",
  variables: APPOINTMENTS_VARIABLES,
  compliance: {
    rules: [
      "Includes {{workspace_name}} as the sender frame in every body (D-398).",
      "TCR ACCOUNT_NOTIFICATION mapping — Standard Class, auto-approved at TCR; lower carrier scrutiny than Marketing.",
      "Honors STOP/HELP — standard transactional opt-out applies to every body. This is not the Verification 2FA carve-out.",
      "No promotional content (D-399, corpus-wide). Per D-392 the post-appointment message is thanks + feedback only — rebooking promotions route to a Marketing campaign, never an Appointments stage.",
      "Quiet hours — proactive reminders respect 8am-9pm recipient local time; confirmations triggered by a user action (a just-completed booking) may fall within quiet hours.",
      "Reschedule, cancel, and feedback links point at the developer's own domain — RelayKit does not shorten or host them.",
    ],
  },
  messages: [
    {
      id: "confirmation",
      name: "Confirmation",
      tooltip: "Sent when a booking is confirmed.",
      description:
        "Confirms a newly booked appointment with provider and time — the 'your appointment is locked in' moment. {{provider_name}} is optional: for venue bookings, reservations, and date-range stays with no named provider, omit it and the confirmation reads as a booking with the workspace itself.",
      groupNote:
        "Appointment lifecycle - step 1 of 7: sent immediately after booking is confirmed in the developer's system.",
      variables: ["workspace_name", "provider_name", "appointment_time"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: your appointment with {{provider_name}} is confirmed for {{appointment_time}}. Reply STOP to opt out.",
          charCount: 138,
        },
        {
          tone: "Friendly",
          body: "You're booked! {{provider_name}} will see you {{appointment_time}}. We'll send a reminder. Reply STOP to opt out. - {{workspace_name}}",
          charCount: 151,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: confirmed with {{provider_name}}, {{appointment_time}}. STOP to opt out.",
          charCount: 109,
        },
      ],
    },
    {
      id: "reminder-distant",
      name: "Reminder - distant",
      tooltip: "Sent the day before the appointment.",
      description:
        "Lead-time reminder sent the day before — often the most-opened SMS in the sequence.",
      groupNote:
        "Appointment lifecycle - step 2 of 7: sent T-24h before appointment_time.",
      variables: [
        "workspace_name",
        "provider_name",
        "appointment_time",
        "cancel_link",
        "reschedule_link",
      ],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: reminder - your appointment is tomorrow, {{appointment_time}}. Cancel: {{cancel_link}} Reply STOP to opt out.",
          charCount: 154,
        },
        {
          tone: "Friendly",
          body: "See you tomorrow! {{provider_name}} at {{appointment_time}}. Change or cancel: {{reschedule_link}} Reply STOP to opt out.",
          charCount: 131,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: tomorrow with {{provider_name}}, {{appointment_time}}. STOP to opt out.",
          charCount: 108,
        },
      ],
    },
    {
      id: "reminder-proximate",
      name: "Reminder - proximate",
      tooltip: "Sent about an hour before the appointment.",
      description:
        "Final nudge sent about an hour out; higher show-up rate when paired with the day-before reminder.",
      groupNote:
        "Appointment lifecycle - step 3 of 7: sent T-1h before appointment_time.",
      variables: [
        "workspace_name",
        "provider_name",
        "appointment_time",
        "cancel_link",
      ],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: your appointment is in 1 hour, {{appointment_time}}. Cancel: {{cancel_link}} Reply STOP to opt out.",
          charCount: 144,
        },
        {
          tone: "Friendly",
          body: "Almost time - {{provider_name}} sees you in about an hour, {{appointment_time}}. Reply STOP to opt out. - {{workspace_name}}",
          charCount: 141,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: in 1 hour - {{provider_name}}, {{appointment_time}}. STOP to opt out.",
          charCount: 106,
        },
      ],
    },
    {
      id: "reschedule-confirmation",
      name: "Reschedule confirmation",
      tooltip: "Sent when an appointment is rescheduled.",
      description:
        "Confirms the new time after a reschedule and resets the reminder schedule.",
      groupNote:
        "Appointment lifecycle - step 4 of 7: sent when the user reschedules an existing appointment.",
      variables: ["workspace_name", "appointment_time", "provider_name"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: your appointment is rescheduled to {{appointment_time}} with {{provider_name}}. Reply STOP to opt out.",
          charCount: 139,
        },
        {
          tone: "Friendly",
          body: "Got it - you're now set for {{appointment_time}} with {{provider_name}}. See you then! Reply STOP to opt out. - {{workspace_name}}",
          charCount: 147,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: moved to {{appointment_time}}, {{provider_name}}. STOP to opt out.",
          charCount: 103,
        },
      ],
    },
    {
      id: "cancellation-confirmation",
      name: "Cancellation confirmation",
      tooltip: "Sent when an appointment is cancelled.",
      description:
        "Warm acknowledgment of a cancellation, with an optional rebooking link.",
      groupNote:
        "Appointment lifecycle - step 5 of 7: sent when the user cancels.",
      variables: ["workspace_name", "provider_name", "reschedule_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: your appointment with {{provider_name}} is cancelled. Rebook anytime: {{reschedule_link}} Reply STOP to opt out.",
          charCount: 150,
        },
        {
          tone: "Friendly",
          body: "Your appointment is cancelled - no problem. Want to rebook? {{reschedule_link}} Reply STOP to opt out. - {{workspace_name}}",
          charCount: 140,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: cancelled. Rebook: {{reschedule_link}} STOP to opt out.",
          charCount: 92,
        },
      ],
    },
    {
      id: "no-show-follow-up",
      name: "No-show follow-up",
      tooltip: "Sent after a missed appointment.",
      description:
        "Non-judgmental, friction-low rebooking path sent when no check-in is received after the appointment time.",
      groupNote:
        "Appointment lifecycle - step 6 of 7: sent T+1h after appointment_time if no check-in event received.",
      variables: ["workspace_name", "provider_name", "reschedule_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: we missed you today. Want to rebook with {{provider_name}}? {{reschedule_link}} Reply STOP to opt out.",
          charCount: 140,
        },
        {
          tone: "Friendly",
          body: "Sorry we missed you! Happy to find a new time - rebook here: {{reschedule_link}} Reply STOP to opt out. - {{workspace_name}}",
          charCount: 141,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: missed you. Rebook: {{reschedule_link}} STOP to opt out.",
          charCount: 93,
        },
      ],
    },
    {
      id: "post-appointment",
      name: "Post-appointment",
      tooltip: "Sent after the appointment to collect feedback.",
      description:
        "Thanks-and-feedback touch after the appointment. Thanks + feedback only — rebooking promos route to a Marketing campaign (D-392).",
      groupNote:
        "Appointment lifecycle - step 7 of 7: sent T+1h to T+24h after the appointment is completed.",
      variables: ["workspace_name", "provider_name", "feedback_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: thanks for seeing {{provider_name}} today. We'd love your feedback: {{feedback_link}} Reply STOP to opt out.",
          charCount: 148,
        },
        {
          tone: "Friendly",
          body: "Thanks for coming in today! How did it go with {{provider_name}}? Tell us: {{feedback_link}} Reply STOP to opt out. - {{workspace_name}}",
          charCount: 156,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: thanks for visiting. Feedback: {{feedback_link}} STOP to opt out.",
          charCount: 104,
        },
      ],
    },
    {
      id: "on-the-way",
      name: "On the way",
      tooltip:
        "Sent when a mobile provider, technician, or driver is en route to the customer.",
      description:
        "The provider-en-route ping for mobile and field service — the provider travels to the customer, the inverse of the proximate reminder.",
      variables: ["workspace_name", "provider_name", "eta"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: {{provider_name}} is on the way, ETA about {{eta}}. Reply STOP to opt out.",
          charCount: 112,
        },
        {
          tone: "Friendly",
          body: "Heads up - {{provider_name}} is headed your way, ETA about {{eta}}. Reply STOP to opt out. - {{workspace_name}}",
          charCount: 129,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: {{provider_name}} on the way, ETA {{eta}}. STOP to opt out.",
          charCount: 97,
        },
      ],
    },
    {
      id: "service-complete",
      name: "Service complete",
      tooltip: "Sent when an on-site job or service visit is finished.",
      description:
        "A field-service terminal state — the on-site job or visit is done, often carrying a recap or feedback link.",
      variables: ["workspace_name", "feedback_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: your service is complete. Details: {{feedback_link}} Reply STOP to opt out.",
          charCount: 114,
        },
        {
          tone: "Friendly",
          body: "All done! Your {{workspace_name}} service is complete. Tell us how it went: {{feedback_link}} Reply STOP to opt out.",
          charCount: 135,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: service complete. {{feedback_link}} STOP to opt out.",
          charCount: 91,
        },
      ],
    },
    {
      id: "time-to-rebook",
      name: "Time to rebook",
      tooltip:
        "Sent when a recurring service is due and no appointment has been booked yet.",
      description:
        "A recurring-cadence 'you're due for your next visit — book a time' nudge where no appointment exists yet. Distinct from a confirmed-appointment reminder.",
      variables: ["workspace_name", "reschedule_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: Your next visit is due. Pick a time: {{reschedule_link}} Reply STOP to opt out.",
          charCount: 116,
        },
        {
          tone: "Friendly",
          body: "Time for your next {{workspace_name}} visit. Grab a slot here: {{reschedule_link}} Reply STOP to opt out.",
          charCount: 122,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: Next visit due. Book: {{reschedule_link}} STOP to opt out.",
          charCount: 95,
        },
      ],
    },
    {
      id: "pre-visit-form-request",
      name: "Pre-visit form request",
      tooltip:
        "Sent ahead of an appointment when intake, consent, or check-in forms need completing.",
      description:
        "A pre-appointment step — complete intake, consent, or check-in forms before the visit. Universal across intake / waiver / check-in flows.",
      variables: ["workspace_name", "appointment_time", "form_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: please complete your forms before your visit {{appointment_time}}: {{form_link}} Reply STOP to opt out.",
          charCount: 150,
        },
        {
          tone: "Friendly",
          body: "Before we see you {{appointment_time}}, please fill out your forms here: {{form_link}} Reply STOP to opt out. - {{workspace_name}}",
          charCount: 157,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: complete your forms before {{appointment_time}}: {{form_link}} STOP to opt out.",
          charCount: 126,
        },
      ],
    },
  ],
};
