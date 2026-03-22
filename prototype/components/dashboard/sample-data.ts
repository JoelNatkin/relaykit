/**
 * Sample data for dashboard explorations.
 * Fictional business: RadarLove — appointment reminder app.
 */

export const SAMPLE = {
  businessName: "RadarLove",
  website: "radarlove.app",
  useCase: "Appointment reminders",
  categoryId: "appointments",
  email: "joel@radarlove.app",
  phone: "+1 (512) 555-0147",
  sandboxApiKey: "rk_sandbox_rL7x9Kp2mWqYvBn4",
  liveApiKey: "rk_live_Tx8bQr3nJfLpYm6w",
  webhookSecret: "whsec_aR5tPz8kLm2xNq4v",
  complianceSiteUrl: "https://radarlove.msgverified.com",
  registrationDate: "Feb 28, 2026",
  approvalDate: "Mar 12, 2026",
  campaignSid: "CMP-RL-20260228",

  // Usage stats (live state)
  messagesThisMonth: 2847,
  messagesIncluded: 500,
  deliveryRate: 98.6,
  optOutRate: 0.3,

  // Registration steps
  registrationSteps: [
    { label: "Business verified", done: true },
    { label: "Campaign submitted", done: true },
    { label: "Carrier review", done: false, active: true },
    { label: "Approved", done: false },
  ],

  // Canon messages (the 3 registered ones)
  canonMessages: [
    {
      name: "Booking confirmation",
      template:
        "RadarLove: Your appointment is confirmed for {date} at {time}. Reply STOP to opt out.",
    },
    {
      name: "Reminder (24h)",
      template:
        "RadarLove: Reminder — your appointment is tomorrow at {time}. Reply STOP to opt out.",
    },
    {
      name: "Cancellation notice",
      template:
        "RadarLove: Your appointment on {date} has been cancelled. Visit radarlove.app to rebook. Reply STOP to opt out.",
    },
  ],

  // Platform setup steps
  platformSetup: [
    {
      label: "Install the SDK",
      code: "npm install @relaykit/node",
      done: true,
    },
    {
      label: "Add your API key",
      code: 'const relay = new RelayKit({ apiKey: "rk_sandbox_..." });',
      done: false,
    },
    {
      label: "Send a test message",
      code: 'await relay.messages.send({ to: "+15125550147", template: "booking_confirmation" });',
      done: false,
    },
  ],
} as const;
