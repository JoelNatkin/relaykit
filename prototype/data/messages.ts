export type MessageTier = "core" | "also_covered" | "expansion";

export interface Message {
  id: string;
  categoryId: string;
  name: string;
  tier: MessageTier;
  defaultEnabled: boolean;
  template: string;
  trigger: string;
  requiresStop: boolean;
  expansionType: "mixed" | "marketing" | null;
  /** Plural label for consent paragraph, e.g. "booking confirmations" */
  consentLabel: string;
  /** Variant templates keyed by variant name. If absent, only the default template is used. */
  variants?: Record<string, string>;
}

/** Variant set definitions per category */
export interface VariantSet {
  id: string;
  label: string;
}

export const CATEGORY_VARIANTS: Record<string, VariantSet[]> = {
  appointments: [
    { id: "standard", label: "Brand-first" },
    { id: "action-first", label: "Action-first" },
    { id: "context-first", label: "Context-first" },
  ],
  verification: [
    { id: "standard", label: "Brand-first" },
    { id: "action-first", label: "Action-first" },
  ],
};

export const MESSAGES: Record<string, Message[]> = {
  verification: [
    {
      id: "verification_login_code",
      categoryId: "verification",
      name: "Login verification code",
      tier: "core",
      defaultEnabled: true,
      template:
        "{app_name} verification code: {code}. Expires in 10 minutes. If you didn't request this, ignore this message.",
      trigger: "When user requests login OTP",
      requiresStop: false,
      expansionType: null,
      consentLabel: "login verification codes",
    },
    {
      id: "verification_signup_code",
      categoryId: "verification",
      name: "Signup verification",
      tier: "core",
      defaultEnabled: true,
      template:
        "{app_name}: Use code {code} to verify your phone number. Expires in 5 minutes.",
      trigger: "During account registration",
      requiresStop: false,
      expansionType: null,
      consentLabel: "signup verifications",
    },
    {
      id: "verification_password_reset",
      categoryId: "verification",
      name: "Password reset code",
      tier: "also_covered",
      defaultEnabled: false,
      template:
        "{app_name}: Your password reset code is {code}. Expires in 10 minutes. If you didn't request this, secure your account immediately.",
      trigger: "When user requests password reset",
      requiresStop: false,
      expansionType: null,
      consentLabel: "password reset codes",
    },
    {
      id: "verification_mfa_code",
      categoryId: "verification",
      name: "Multi-factor auth code",
      tier: "also_covered",
      defaultEnabled: false,
      template:
        "{app_name}: Your security code is {code}. Do not share this code. Expires in 5 minutes.",
      trigger: "When MFA is triggered",
      requiresStop: false,
      expansionType: null,
      consentLabel: "multi-factor auth codes",
    },
    {
      id: "verification_device_confirmation",
      categoryId: "verification",
      name: "New device alert",
      tier: "also_covered",
      defaultEnabled: false,
      template:
        "{app_name}: A new device signed in to your account. If this wasn't you, reset your password at {website_url}.",
      trigger: "New device login detected",
      requiresStop: false,
      expansionType: null,
      consentLabel: "new device alerts",
    },
    {
      id: "verification_security_tip",
      categoryId: "verification",
      name: "Security tip",
      tier: "expansion",
      defaultEnabled: false,
      template:
        "{app_name}: Security tip \u2014 enable two-factor authentication to protect your account. Set it up at {website_url}/settings. Reply STOP to opt out.",
      trigger: "After account creation",
      requiresStop: true,
      expansionType: "mixed",
      consentLabel: "security tips",
    },
    {
      id: "verification_welcome",
      categoryId: "verification",
      name: "Welcome message",
      tier: "expansion",
      defaultEnabled: false,
      template:
        "{app_name}: Welcome! Your account is verified. Get started at {website_url}. Reply STOP to opt out.",
      trigger: "After successful verification",
      requiresStop: true,
      expansionType: "mixed",
      consentLabel: "welcome messages",
    },
    {
      id: "verification_feature_announcement",
      categoryId: "verification",
      name: "Feature announcement",
      tier: "expansion",
      defaultEnabled: false,
      template:
        "{app_name}: New feature \u2014 you can now use passkeys for faster login. Learn more: {website_url}/blog. Reply STOP to unsubscribe.",
      trigger: "Manually sent",
      requiresStop: true,
      expansionType: "marketing",
      consentLabel: "feature announcements",
    },
  ],

  appointments: [
    {
      id: "appointments_confirmation",
      categoryId: "appointments",
      name: "Booking confirmation",
      tier: "core",
      defaultEnabled: true,
      template:
        "{app_name}: Your {service_type} appointment is confirmed for {date} at {time}. Reply STOP to opt out.",
      trigger: "When appointment booked",
      requiresStop: true,
      expansionType: null,
      consentLabel: "booking confirmations",
      variants: {
        "action-first": "Confirmed — {service_type} appointment on {date} at {time}. {app_name} has you on the books. Reply STOP to opt out.",
        "context-first": "You just booked a {service_type} appointment. {app_name} confirms {date} at {time}. Reply STOP to opt out.",
      },
    },
    {
      id: "appointments_reminder",
      categoryId: "appointments",
      name: "Appointment reminder",
      tier: "core",
      defaultEnabled: true,
      template:
        "{app_name}: Reminder \u2014 your {service_type} appointment is tomorrow at {time}. Reply STOP to opt out.",
      trigger: "24h before appointment",
      requiresStop: true,
      expansionType: null,
      consentLabel: "appointment reminders",
      variants: {
        "action-first": "Tomorrow at {time} — your {service_type} appointment with {app_name}. Reply STOP to opt out.",
        "context-first": "Your {service_type} appointment is coming up. {app_name} reminder: tomorrow at {time}. Reply STOP to opt out.",
      },
    },
    {
      id: "appointments_previsit",
      categoryId: "appointments",
      name: "Pre-visit instructions",
      tier: "also_covered",
      defaultEnabled: false,
      template:
        "{app_name}: Your {service_type} appointment is today at {time}. Please arrive 10 minutes early. Details: {website_url}. Reply STOP to opt out.",
      trigger: "Morning of appointment",
      requiresStop: true,
      expansionType: null,
      consentLabel: "pre-visit instructions",
      variants: {
        "action-first": "Today at {time} — your {service_type} appointment. Arrive 10 min early. Details: {website_url}. {app_name}. Reply STOP to opt out.",
        "context-first": "It's the day of your {service_type} appointment. {app_name}: {time} today, arrive 10 minutes early. Details: {website_url}. Reply STOP to opt out.",
      },
    },
    {
      id: "appointments_reschedule",
      categoryId: "appointments",
      name: "Reschedule notice",
      tier: "also_covered",
      defaultEnabled: false,
      template:
        "{app_name}: Your {service_type} appointment has been rescheduled to {date} at {time}. Reply STOP to opt out.",
      trigger: "When appointment rescheduled",
      requiresStop: true,
      expansionType: null,
      consentLabel: "reschedule notices",
      variants: {
        "action-first": "Rescheduled — your {service_type} appointment is now {date} at {time}. {app_name}. Reply STOP to opt out.",
        "context-first": "There's been a change to your {service_type} appointment. {app_name} has moved it to {date} at {time}. Reply STOP to opt out.",
      },
    },
    {
      id: "appointments_noshow",
      categoryId: "appointments",
      name: "No-show follow-up",
      tier: "also_covered",
      defaultEnabled: false,
      template:
        "{app_name}: We missed you at your {service_type} appointment today. To rebook, visit {website_url}. Reply STOP to opt out.",
      trigger: "After a missed appointment",
      requiresStop: true,
      expansionType: null,
      consentLabel: "no-show follow-ups",
      variants: {
        "action-first": "Missed today — your {service_type} appointment. Rebook at {website_url}. {app_name}. Reply STOP to opt out.",
        "context-first": "Your {service_type} appointment was today. {app_name} noticed you couldn't make it — rebook at {website_url}. Reply STOP to opt out.",
      },
    },
    {
      id: "appointments_cancellation",
      categoryId: "appointments",
      name: "Cancellation notice",
      tier: "also_covered",
      defaultEnabled: false,
      template:
        "{app_name}: Your {service_type} appointment on {date} has been cancelled. To rebook, visit {website_url}. Reply STOP to opt out.",
      trigger: "When appointment cancelled",
      requiresStop: true,
      expansionType: null,
      consentLabel: "cancellation notices",
      variants: {
        "action-first": "Cancelled — your {service_type} appointment on {date}. Rebook at {website_url}. {app_name}. Reply STOP to opt out.",
        "context-first": "Your {service_type} appointment on {date} won't be happening. {app_name}: rebook at {website_url}. Reply STOP to opt out.",
      },
    },
    {
      id: "appointments_promo",
      categoryId: "appointments",
      name: "Promotional offer",
      tier: "expansion",
      defaultEnabled: false,
      template:
        "{app_name}: Book your next {service_type} appointment this week and get 15% off! Visit {website_url}. Reply STOP to unsubscribe.",
      trigger: "Manually sent",
      requiresStop: true,
      expansionType: "marketing",
      consentLabel: "promotional offers",
    },
    {
      id: "appointments_feedback",
      categoryId: "appointments",
      name: "Feedback request",
      tier: "expansion",
      defaultEnabled: false,
      template:
        "{app_name}: How was your {service_type} appointment? Rate your experience: {website_url}/review. Reply STOP to opt out.",
      trigger: "After appointment",
      requiresStop: true,
      expansionType: "mixed",
      consentLabel: "feedback requests",
    },
  ],
};
