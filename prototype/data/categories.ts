export interface PersonalizationField {
  key: string;
  label: string;
  placeholder: string;
  required: boolean;
  helperText: string;
}

export interface Category {
  id: string;
  label: string;
  icon: string;
  description: string;
  modalContent: string | null;
  coversLine: string;
  personalizationFields: PersonalizationField[];
}

export const CATEGORIES: Category[] = [
  {
    id: "verification",
    label: "Verification codes",
    icon: "\u{1F510}",
    description: "OTP, 2FA, login codes, password resets",
    modalContent:
      "Login codes, signup verification, password resets, and multi-factor auth. Every message is triggered by your user \u2014 they request it, your app sends it. Highest-trust SMS category with carriers.",
    coversLine:
      "OTP \u00B7 2FA \u00B7 phone verification \u00B7 password reset \u00B7 device alerts",
    personalizationFields: [
      {
        key: "appName",
        label: "App name",
        placeholder: "Acme",
        required: true,
        helperText: "This appears in every text your users receive",
      },
      {
        key: "website",
        label: "Website",
        placeholder: "acme.com",
        required: false,
        helperText: "Used for links in security alerts",
      },
    ],
  },
  {
    id: "appointments",
    label: "Appointment reminders",
    icon: "\u{1F4C5}",
    description: "Booking confirmations, reminders, rescheduling",
    modalContent:
      "Booking confirmations, reminders, rescheduling and cancellation notices. Messages about appointments they already booked.",
    coversLine:
      "confirmations \u00B7 reminders \u00B7 rescheduling \u00B7 cancellations \u00B7 no-show follow-ups",
    personalizationFields: [
      {
        key: "appName",
        label: "Business name",
        placeholder: "Acme Dental",
        required: true,
        helperText: "This appears in every text your customers receive",
      },
      {
        key: "serviceType",
        label: "Service type",
        placeholder: "dental, hair salon",
        required: false,
        helperText: "Personalizes your message templates",
      },
      {
        key: "website",
        label: "Website",
        placeholder: "acmedental.com",
        required: false,
        helperText: "Used for booking links",
      },
    ],
  },
  {
    id: "orders",
    label: "Order & delivery updates",
    icon: "\u{1F4E6}",
    description: "Shipping, tracking, delivery notifications",
    modalContent:
      "Order confirmations, shipping and tracking updates, delivery notifications.",
    coversLine:
      "order confirmed \u00B7 shipped \u00B7 out for delivery \u00B7 delivered \u00B7 returns \u00B7 pickup ready",
    personalizationFields: [
      {
        key: "appName",
        label: "Business name",
        placeholder: "Acme",
        required: true,
        helperText: "This appears in every text your customers receive",
      },
      {
        key: "productType",
        label: "Product type",
        placeholder: "electronics, clothing",
        required: false,
        helperText: "Personalizes your message templates",
      },
      {
        key: "website",
        label: "Website",
        placeholder: "acme.com",
        required: false,
        helperText: "Used for order tracking links",
      },
    ],
  },
  {
    id: "support",
    label: "Customer support",
    icon: "\u{1F4AC}",
    description: "Ticket updates, resolution notices, conversations",
    modalContent:
      "Ticket acknowledgments, status updates, resolution notices, two-way conversations.",
    coversLine:
      "ticket received \u00B7 status updates \u00B7 resolved \u00B7 follow-ups \u00B7 escalation notices",
    personalizationFields: [
      {
        key: "appName",
        label: "Business name",
        placeholder: "Acme",
        required: true,
        helperText: "This appears in every text your customers receive",
      },
      {
        key: "website",
        label: "Website",
        placeholder: "acme.com",
        required: false,
        helperText: "Used for support portal links",
      },
    ],
  },
  {
    id: "marketing",
    label: "Marketing & promos",
    icon: "\u{1F4E3}",
    description: "Promotions, announcements, sales, loyalty rewards",
    modalContent:
      "Promotional offers, announcements, sales, loyalty rewards. Unlike others, these go to opted-in recipients, not in response to user action. Carriers scrutinize more closely.",
    coversLine:
      "promotions \u00B7 announcements \u00B7 sales \u00B7 loyalty \u00B7 back-in-stock",
    personalizationFields: [
      {
        key: "appName",
        label: "Business name",
        placeholder: "Acme",
        required: true,
        helperText: "This appears in every text your customers receive",
      },
      {
        key: "whatYouSell",
        label: "What you sell/offer",
        placeholder: "handmade candles, SaaS tools",
        required: false,
        helperText: "Personalizes your message templates",
      },
      {
        key: "website",
        label: "Website",
        placeholder: "acme.com",
        required: false,
        helperText: "Used for promotional links",
      },
    ],
  },
  {
    id: "internal",
    label: "Team & internal alerts",
    icon: "\u{1F465}",
    description: "Shift reminders, schedule changes, system alerts",
    modalContent:
      "Shift reminders, schedule changes, system alerts. Sent to your own team, not customers.",
    coversLine:
      "shift notifications \u00B7 meeting reminders \u00B7 system alerts \u00B7 policy updates \u00B7 task assignments",
    personalizationFields: [
      {
        key: "appName",
        label: "Company name",
        placeholder: "Acme Corp",
        required: true,
        helperText: "This appears in every text your team receives",
      },
      {
        key: "website",
        label: "Website",
        placeholder: "acme.com",
        required: false,
        helperText: "Used for internal portal links",
      },
    ],
  },
  {
    id: "community",
    label: "Community & groups",
    icon: "\u{1F3D8}\uFE0F",
    description: "Event announcements, membership notifications",
    modalContent:
      "Event announcements, membership notifications, community news.",
    coversLine:
      "events \u00B7 community news \u00B7 membership updates \u00B7 group alerts \u00B7 RSVP",
    personalizationFields: [
      {
        key: "appName",
        label: "Organization name",
        placeholder: "Acme Community",
        required: true,
        helperText: "This appears in every text your members receive",
      },
      {
        key: "website",
        label: "Website",
        placeholder: "acmecommunity.org",
        required: false,
        helperText: "Used for event and membership links",
      },
    ],
  },
  {
    id: "waitlist",
    label: "Waitlist & reservations",
    icon: "\u231B",
    description: "Table-ready alerts, waitlist updates, reservations",
    modalContent:
      '"Your table is ready" alerts, waitlist updates, reservation confirmations.',
    coversLine:
      "waitlist updates \u00B7 table/spot ready \u00B7 reservations \u00B7 availability alerts",
    personalizationFields: [
      {
        key: "appName",
        label: "Business name",
        placeholder: "Acme",
        required: true,
        helperText: "This appears in every text your customers receive",
      },
      {
        key: "venueType",
        label: "Venue type",
        placeholder: "restaurant, salon, clinic",
        required: false,
        helperText: "Personalizes your message templates",
      },
      {
        key: "website",
        label: "Website",
        placeholder: "acme.com",
        required: false,
        helperText: "Used for reservation links",
      },
    ],
  },
  {
    id: "exploring",
    label: "Just exploring",
    icon: "\u{1F50D}",
    description: "Not sure yet \u2014 just want to see how it works",
    modalContent: null,
    coversLine: "",
    personalizationFields: [],
  },
];
