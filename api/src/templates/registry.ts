export interface MessageTemplate {
  id: string;
  namespace: string;
  event: string;
  template: string;
  variables: string[];
  description: string;
}

export const registry: Record<string, Record<string, MessageTemplate>> = {
  appointments: {
    sendConfirmation: {
      id: 'appointments_booking_confirmation',
      namespace: 'appointments',
      event: 'sendConfirmation',
      template:
        '{business_name}: Your {service_type} appointment is confirmed for {date} at {time}. See you then! Reply HELP for help, STOP to unsubscribe.',
      variables: ['business_name', 'service_type', 'date', 'time'],
      description: 'When client books an appointment',
    },
    sendReminder: {
      id: 'appointments_reminder_24hr',
      namespace: 'appointments',
      event: 'sendReminder',
      template:
        '{business_name}: Reminder — your {service_type} appointment is tomorrow at {time}. Reply C to confirm or R to reschedule. Reply STOP to opt out.',
      variables: ['business_name', 'service_type', 'time'],
      description: '24 hours before appointment',
    },
    sendCancellation: {
      id: 'appointments_cancellation',
      namespace: 'appointments',
      event: 'sendCancellation',
      template:
        '{business_name}: Your appointment on {date} has been cancelled. To rebook, visit {website_url} or call us. Reply STOP to unsubscribe.',
      variables: ['business_name', 'date', 'website_url'],
      description: 'When appointment is cancelled',
    },
  },

  orders: {
    sendConfirmation: {
      id: 'orders_confirmation',
      namespace: 'orders',
      event: 'sendConfirmation',
      template:
        '{business_name}: Your order #{order_id} has been confirmed! We\'ll notify you when it ships. Reply STOP to opt out of notifications.',
      variables: ['business_name', 'order_id'],
      description: 'When order is placed',
    },
    sendShipping: {
      id: 'orders_shipped',
      namespace: 'orders',
      event: 'sendShipping',
      template:
        '{business_name}: Great news — your order #{order_id} has shipped! Track it here: {tracking_url}. Reply STOP to unsubscribe.',
      variables: ['business_name', 'order_id', 'tracking_url'],
      description: 'When order ships',
    },
    sendDelivery: {
      id: 'orders_delivered',
      namespace: 'orders',
      event: 'sendDelivery',
      template:
        '{business_name}: Your order #{order_id} was delivered today. We hope you love it! Reply STOP to opt out.',
      variables: ['business_name', 'order_id'],
      description: 'When delivery is confirmed',
    },
  },

  verification: {
    sendCode: {
      id: 'verification_login_code',
      namespace: 'verification',
      event: 'sendCode',
      template:
        'Your {app_name} verification code is {code}. This code expires in 10 minutes. If you didn\'t request this, ignore this message.',
      variables: ['app_name', 'code'],
      description: 'When user requests login OTP',
    },
    sendPasswordReset: {
      id: 'verification_password_reset',
      namespace: 'verification',
      event: 'sendPasswordReset',
      template:
        '{app_name}: Your password reset code is {code}. Expires in 10 minutes. If you didn\'t request this, secure your account immediately.',
      variables: ['app_name', 'code'],
      description: 'When user requests password reset',
    },
  },

  support: {
    sendAcknowledgment: {
      id: 'support_acknowledgment',
      namespace: 'support',
      event: 'sendAcknowledgment',
      template:
        '{business_name}: Thanks for reaching out! A support agent will respond shortly. Your ticket: #{ticket_id}. Reply STOP to opt out of messages.',
      variables: ['business_name', 'ticket_id'],
      description: 'When support request received',
    },
    sendResolution: {
      id: 'support_resolution',
      namespace: 'support',
      event: 'sendResolution',
      template:
        '{business_name} Support: Your issue (#{ticket_id}) has been resolved. Let us know if you need anything else. Reply STOP to unsubscribe.',
      variables: ['business_name', 'ticket_id'],
      description: 'When ticket is closed',
    },
  },

  marketing: {
    sendPromotion: {
      id: 'marketing_weekly_promo',
      namespace: 'marketing',
      event: 'sendPromotion',
      template:
        '{business_name}: This week only — 20% off your next order with code SAVE20. Shop now at {website_url}. Reply STOP to unsubscribe.',
      variables: ['business_name', 'website_url'],
      description: 'Weekly promo schedule',
    },
    sendLoyaltyReward: {
      id: 'marketing_loyalty_reward',
      namespace: 'marketing',
      event: 'sendLoyaltyReward',
      template:
        '{business_name}: Thanks for being a loyal customer! Enjoy free shipping on your next order. Use code FREESHIP at {website_url}. Reply STOP to unsubscribe.',
      variables: ['business_name', 'website_url'],
      description: 'Loyalty program triggers',
    },
  },

  internal: {
    sendMeetingReminder: {
      id: 'internal_meeting_reminder',
      namespace: 'internal',
      event: 'sendMeetingReminder',
      template:
        '{business_name} Team: Reminder — staff meeting tomorrow at {time} in the main conference room. Reply STOP to opt out.',
      variables: ['business_name', 'time'],
      description: 'Day before meeting',
    },
    sendScheduleChange: {
      id: 'internal_schedule_change',
      namespace: 'internal',
      event: 'sendScheduleChange',
      template:
        '{business_name} Alert: Schedule change — your shift on {date} has been moved to {time}. Please confirm by replying OK. Reply STOP to unsubscribe.',
      variables: ['business_name', 'date', 'time'],
      description: 'When schedule is updated',
    },
  },

  community: {
    sendEventReminder: {
      id: 'community_event_notification',
      namespace: 'community',
      event: 'sendEventReminder',
      template:
        '{community_name}: Meetup this Saturday at {time} at {location}! RSVP by replying YES. Reply STOP to opt out of updates.',
      variables: ['community_name', 'time', 'location'],
      description: 'When event is scheduled',
    },
    sendWelcome: {
      id: 'community_welcome',
      namespace: 'community',
      event: 'sendWelcome',
      template:
        '{community_name}: Welcome to the group! Events and updates will be sent to this number. Reply HELP for info or STOP to leave.',
      variables: ['community_name'],
      description: 'When member joins',
    },
  },

  waitlist: {
    sendConfirmation: {
      id: 'waitlist_joined',
      namespace: 'waitlist',
      event: 'sendConfirmation',
      template:
        '{business_name}: You\'re on the waitlist! Estimated wait: {wait_time}. We\'ll text when your table is ready. Reply STOP to opt out.',
      variables: ['business_name', 'wait_time'],
      description: 'When customer joins waitlist',
    },
    sendSpotAvailable: {
      id: 'waitlist_ready',
      namespace: 'waitlist',
      event: 'sendSpotAvailable',
      template:
        '{business_name}: Your table is ready! Please check in at the host stand within 10 minutes. Reply STOP to unsubscribe.',
      variables: ['business_name'],
      description: 'When spot opens',
    },
  },
};
