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
} from "@untitledui/icons";

export type UseCaseId =
  | "appointments"
  | "orders"
  | "verification"
  | "support"
  | "marketing"
  | "internal"
  | "community"
  | "waitlist";

export interface ExpansionOption {
  id: string;
  label: string;
}

export interface ScopeItem {
  text: string;
  /** If set, this item flips from "not included" to "included" when any of these expansions are selected */
  unlockedBy?: string[];
}

export interface UseCaseDefinition {
  id: UseCaseId;
  label: string;
  description: string;
  icon: FC<{ className?: string }>;
  included: string[];
  notIncluded: ScopeItem[];
  expansions: ExpansionOption[];
}

export const USE_CASES: Record<UseCaseId, UseCaseDefinition> = {
  appointments: {
    id: "appointments",
    label: "Appointment reminders",
    description: "Confirmations, reminders, rescheduling",
    icon: Calendar,
    included: [
      "Appointment confirmations and reminders",
      "Rescheduling and cancellation notices",
      "Follow-up messages after appointments",
      "Two-way replies (customer can text back to confirm/reschedule)",
    ],
    notIncluded: [
      {
        text: "Marketing offers or discount codes",
        unlockedBy: ["promotional_offers_past_clients"],
      },
      {
        text: "Promotional announcements",
        unlockedBy: ["promotional_offers_past_clients"],
      },
      {
        text: "Review requests",
        unlockedBy: ["reviews_feedback"],
      },
    ],
    expansions: [
      {
        id: "promotional_offers_past_clients",
        label:
          "Send promotional offers to past clients (e.g., discounts, seasonal specials)",
      },
      {
        id: "reviews_feedback",
        label: "Request reviews or feedback after appointments",
      },
      {
        id: "birthday_anniversary",
        label: "Send birthday or anniversary messages",
      },
    ],
  },
  orders: {
    id: "orders",
    label: "Order & delivery updates",
    description: "Shipping notifications, delivery status",
    icon: Package,
    included: [
      "Order confirmations",
      "Shipping and tracking notifications",
      "Delivery confirmations",
      "Return and exchange status updates",
      "Two-way replies for delivery issues",
    ],
    notIncluded: [
      {
        text: "Marketing offers to past customers",
        unlockedBy: ["promotional_offers_past_customers"],
      },
      {
        text: "Promotional announcements",
        unlockedBy: ["announce_new_products"],
      },
      {
        text: "Review requests",
        unlockedBy: ["reviews_after_delivery"],
      },
      {
        text: "Cross-selling or upselling messages",
        unlockedBy: ["promotional_offers_past_customers"],
      },
    ],
    expansions: [
      {
        id: "promotional_offers_past_customers",
        label: "Send promotional offers to past customers",
      },
      {
        id: "announce_new_products",
        label: "Announce new products to existing customers",
      },
      {
        id: "reviews_after_delivery",
        label: "Request reviews after delivery",
      },
    ],
  },
  verification: {
    id: "verification",
    label: "Verification codes",
    description: "OTP, 2FA, login codes",
    icon: Shield01,
    included: [
      "One-time passwords (OTP)",
      "Two-factor authentication codes",
      "Phone number verification",
      "Login confirmation codes",
    ],
    notIncluded: [
      {
        text: "Account-related notifications (password resets, security alerts)",
        unlockedBy: ["account_notifications"],
      },
      {
        text: "Onboarding or welcome messages",
        unlockedBy: ["onboarding_welcome"],
      },
    ],
    expansions: [
      {
        id: "account_notifications",
        label:
          "Send account-related notifications (password resets, security alerts)",
      },
      {
        id: "onboarding_welcome",
        label: "Send onboarding or welcome messages",
      },
    ],
  },
  support: {
    id: "support",
    label: "Customer support",
    description: "Two-way support conversations",
    icon: MessageChatCircle,
    included: [
      "Support ticket acknowledgments",
      "Status updates on open tickets",
      "Resolution notifications",
      "Two-way support conversations",
      "Customer satisfaction follow-ups",
    ],
    notIncluded: [
      {
        text: "Outbound marketing or promotions",
        unlockedBy: ["promotional_offers_support_contacts"],
      },
      {
        text: "Messages not initiated by a support interaction",
        unlockedBy: ["proactive_outreach"],
      },
      {
        text: "Satisfaction surveys or feedback requests",
        unlockedBy: ["satisfaction_surveys"],
      },
    ],
    expansions: [
      {
        id: "proactive_outreach",
        label: "Send proactive outreach (e.g., known issue alerts)",
      },
      {
        id: "satisfaction_surveys",
        label: "Follow up with satisfaction surveys",
      },
      {
        id: "promotional_offers_support_contacts",
        label: "Send promotional offers to support contacts",
      },
    ],
  },
  marketing: {
    id: "marketing",
    label: "Marketing & promos",
    description: "Offers, promotions, announcements",
    icon: Announcement02,
    included: [
      "Promotional offers and discount codes",
      "Product and service announcements",
      "Sale and event notifications",
      "Loyalty and rewards updates",
      "Newsletter-style updates",
    ],
    notIncluded: [],
    expansions: [],
  },
  internal: {
    id: "internal",
    label: "Team & internal alerts",
    description: "Staff notifications, internal ops",
    icon: Users01,
    included: [
      "Shift and schedule notifications",
      "Operational alerts and updates",
      "Team meeting reminders",
      "System status notifications",
      "Internal policy updates",
    ],
    notIncluded: [
      {
        text: "Messages to customers or external contacts",
        unlockedBy: ["operational_alerts_customers"],
      },
      {
        text: "Messages to anyone who isn't a team member",
        unlockedBy: ["contractors_freelancers"],
      },
    ],
    expansions: [
      {
        id: "contractors_freelancers",
        label:
          "Send messages to contractors or freelancers (not full-time staff)",
      },
      {
        id: "operational_alerts_customers",
        label: "Send operational alerts to customers",
      },
    ],
  },
  community: {
    id: "community",
    label: "Community & groups",
    description: "Group messaging, community updates",
    icon: Globe01,
    included: [
      "Event announcements and reminders",
      "Community news and updates",
      "Membership notifications",
      "Group activity alerts",
      "RSVP collection via reply",
    ],
    notIncluded: [
      {
        text: "Commercial advertising",
        unlockedBy: ["sponsored_partner_content"],
      },
      {
        text: "Sponsored content from third parties",
        unlockedBy: ["sponsored_partner_content"],
      },
    ],
    expansions: [
      {
        id: "sponsored_partner_content",
        label: "Send sponsored or partner content",
      },
      {
        id: "payments_fees_sms",
        label: "Collect payments or fees via SMS links",
      },
    ],
  },
  waitlist: {
    id: "waitlist",
    label: "Waitlist & reservations",
    description: "Booking confirmations, waitlist updates",
    icon: ClipboardCheck,
    included: [
      "Waitlist position updates",
      '"Your table/spot is ready" alerts',
      "Reservation confirmations",
      "Availability notifications",
      "Two-way replies (accept/decline)",
    ],
    notIncluded: [
      {
        text: "Marketing offers",
        unlockedBy: ["promotional_offers_past_guests"],
      },
      {
        text: "Event and availability announcements",
        unlockedBy: ["announce_availability_events"],
      },
      {
        text: "Post-visit review requests",
        unlockedBy: ["reviews_after_visits"],
      },
    ],
    expansions: [
      {
        id: "promotional_offers_past_guests",
        label: "Send promotional offers to past guests",
      },
      {
        id: "announce_availability_events",
        label: "Announce new availability or special events",
      },
      {
        id: "reviews_after_visits",
        label: "Request reviews after visits",
      },
    ],
  },
};

export const USE_CASE_LIST = Object.values(USE_CASES);
