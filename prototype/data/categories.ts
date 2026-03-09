import type { FC } from "react";
import {
  Calendar,
  Package,
  Shield01,
  MessageChatCircle,
  Announcement02,
  Users01,
  Globe01,
  ClipboardCheck,
  SearchLg,
} from "@untitledui/icons";

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
  icon: FC<{ className?: string }>;
  description: string;
  modalContent: string | null;
  coversLine: string;
  /** Consent form heading prefix, e.g. "Get appointment reminders from" */
  formHeading: string;
  personalizationFields: PersonalizationField[];
}

export const CATEGORIES: Category[] = [
  {
    id: "verification",
    label: "Verification codes",
    icon: Shield01,
    description: "OTP, 2FA, login codes, password resets",
    modalContent:
      "Login codes, signup verification, password resets, and multi-factor auth. Every message is triggered by your user \u2014 they request it, your app sends it. Highest-trust SMS category with carriers.",
    coversLine:
      "OTP \u00B7 2FA \u00B7 phone verification \u00B7 password reset \u00B7 device alerts",
    formHeading: "Get verification codes from",
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
    icon: Calendar,
    description: "Booking confirmations, reminders, rescheduling",
    modalContent:
      "Booking confirmations, reminders, rescheduling, and cancellation notices. Messages about appointments they already booked \u2014 your customers expect these.",
    coversLine:
      "confirmations \u00B7 reminders \u00B7 rescheduling \u00B7 cancellations \u00B7 no-show follow-ups",
    formHeading: "Get appointment reminders from",
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
    icon: Package,
    description: "Shipping, tracking, delivery notifications",
    modalContent:
      "Order confirmations, shipping updates, tracking notifications, and delivery alerts. Your customers just bought something \u2014 keep them in the loop from checkout to doorstep.",
    coversLine:
      "order confirmed \u00B7 shipped \u00B7 out for delivery \u00B7 delivered \u00B7 returns \u00B7 pickup ready",
    formHeading: "Get order updates from",
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
    icon: MessageChatCircle,
    description: "Ticket updates, resolution notices, conversations",
    modalContent:
      "Ticket acknowledgments, status updates, resolution notices, and two-way conversations. Your customers text in, your team texts back.",
    coversLine:
      "ticket received \u00B7 status updates \u00B7 resolved \u00B7 follow-ups \u00B7 escalation notices",
    formHeading: "Get support updates from",
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
    icon: Announcement02,
    description: "Promotions, announcements, sales, loyalty rewards",
    modalContent:
      "Promotional offers, announcements, sales, and loyalty rewards. Unlike transactional messages, these go to opted-in recipients \u2014 not in response to a user action. Carriers scrutinize these more closely.",
    coversLine:
      "promotions \u00B7 announcements \u00B7 sales \u00B7 loyalty \u00B7 back-in-stock",
    formHeading: "Get updates from",
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
    icon: Users01,
    description: "Shift reminders, schedule changes, system alerts",
    modalContent:
      "Shift reminders, schedule changes, and system alerts. These go to your own team, not customers \u2014 simpler compliance, faster approval.",
    coversLine:
      "shift notifications \u00B7 meeting reminders \u00B7 system alerts \u00B7 policy updates \u00B7 task assignments",
    formHeading: "Get team alerts from",
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
    icon: Globe01,
    description: "Event announcements, membership notifications",
    modalContent:
      "Event announcements, membership notifications, and community news. Keep your members informed about what\u2019s happening and what\u2019s next.",
    coversLine:
      "events \u00B7 community news \u00B7 membership updates \u00B7 group alerts \u00B7 RSVP",
    formHeading: "Get community updates from",
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
    icon: ClipboardCheck,
    description: "Table-ready alerts, waitlist updates, reservations",
    modalContent:
      "\u201CYour table is ready\u201D alerts, waitlist updates, and reservation confirmations. Time-sensitive messages your customers are actively waiting for.",
    coversLine:
      "waitlist updates \u00B7 table/spot ready \u00B7 reservations \u00B7 availability alerts",
    formHeading: "Get waitlist updates from",
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
    icon: SearchLg,
    description: "Not sure yet \u2014 just want to see how it works",
    modalContent: null,
    coversLine: "",
    formHeading: "Get messages from",
    personalizationFields: [],
  },
];
