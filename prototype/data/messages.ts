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
}

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
    },
  ],
};
