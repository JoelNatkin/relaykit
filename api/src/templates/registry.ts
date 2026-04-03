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
    sendReschedule: {
      id: 'appointments_reschedule_confirmation',
      namespace: 'appointments',
      event: 'sendReschedule',
      template:
        '{business_name}: Your {service_type} appointment has been rescheduled to {date} at {time}. Reply STOP to unsubscribe.',
      variables: ['business_name', 'service_type', 'date', 'time'],
      description: 'When appointment is rescheduled',
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
    sendNoShow: {
      id: 'appointments_noshow_followup',
      namespace: 'appointments',
      event: 'sendNoShow',
      template:
        '{business_name}: We missed you at your {service_type} appointment today. To rebook, visit {website_url} or call us. Reply STOP to unsubscribe.',
      variables: ['business_name', 'service_type', 'website_url'],
      description: 'Follow-up after a no-show',
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
    sendDelivered: {
      id: 'orders_delivered',
      namespace: 'orders',
      event: 'sendDelivered',
      template:
        '{business_name}: Your order #{order_id} was delivered today. We hope you love it! Reply STOP to opt out.',
      variables: ['business_name', 'order_id'],
      description: 'When delivery is confirmed',
    },
    sendReturn: {
      id: 'orders_return_confirmation',
      namespace: 'orders',
      event: 'sendReturn',
      template:
        '{business_name}: Your return for order #{order_id} has been received. We\'ll process your refund within 5-7 business days. Reply STOP to opt out.',
      variables: ['business_name', 'order_id'],
      description: 'When return is received',
    },
    sendRefund: {
      id: 'orders_refund_confirmation',
      namespace: 'orders',
      event: 'sendRefund',
      template:
        '{business_name}: Your refund for order #{order_id} has been processed. Please allow 3-5 business days for it to appear. Reply STOP to opt out.',
      variables: ['business_name', 'order_id'],
      description: 'When refund is processed',
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
    sendNewDevice: {
      id: 'verification_new_device',
      namespace: 'verification',
      event: 'sendNewDevice',
      template:
        '{app_name}: A new device ({device}) just signed into your account. If this wasn\'t you, secure your account immediately.',
      variables: ['app_name', 'device'],
      description: 'When login from unrecognized device',
    },
  },

  support: {
    sendTicketCreated: {
      id: 'support_acknowledgment',
      namespace: 'support',
      event: 'sendTicketCreated',
      template:
        '{business_name}: Thanks for reaching out! A support agent will respond shortly. Your ticket: #{ticket_id}. Reply STOP to opt out of messages.',
      variables: ['business_name', 'ticket_id'],
      description: 'When support request received',
    },
    sendStatusUpdate: {
      id: 'support_status_update',
      namespace: 'support',
      event: 'sendStatusUpdate',
      template:
        '{business_name} Support: Your ticket #{ticket_id} has been updated — status is now {status}. Reply STOP to unsubscribe.',
      variables: ['business_name', 'ticket_id', 'status'],
      description: 'When ticket status changes',
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
    sendNewArrivals: {
      id: 'marketing_new_arrivals',
      namespace: 'marketing',
      event: 'sendNewArrivals',
      template:
        '{business_name}: New arrivals just dropped! Check out what\'s new at {website_url}. Reply STOP to unsubscribe.',
      variables: ['business_name', 'website_url'],
      description: 'New product announcements',
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
    sendShiftConfirmation: {
      id: 'internal_shift_confirmation',
      namespace: 'internal',
      event: 'sendShiftConfirmation',
      template:
        '{business_name}: Your shift on {date} at {time} is confirmed. Reply STOP to opt out.',
      variables: ['business_name', 'date', 'time'],
      description: 'When shift is assigned or confirmed',
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
    sendGroupUpdate: {
      id: 'community_group_update',
      namespace: 'community',
      event: 'sendGroupUpdate',
      template:
        '{community_name}: {content} Reply STOP to opt out of updates.',
      variables: ['community_name', 'content'],
      description: 'General group announcement',
    },
    sendRenewalNotice: {
      id: 'community_renewal_notice',
      namespace: 'community',
      event: 'sendRenewalNotice',
      template:
        '{community_name}: Your membership renews on {renewal_date}. Questions? Reply HELP. Reply STOP to unsubscribe.',
      variables: ['community_name', 'renewal_date'],
      description: 'Membership renewal reminder',
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
    sendReservationConfirmed: {
      id: 'waitlist_reservation_confirmed',
      namespace: 'waitlist',
      event: 'sendReservationConfirmed',
      template:
        '{business_name}: Your reservation is confirmed for {date} at {time}. See you then! Reply STOP to opt out.',
      variables: ['business_name', 'date', 'time'],
      description: 'When reservation is confirmed',
    },
    sendWaitTimeUpdate: {
      id: 'waitlist_wait_time_update',
      namespace: 'waitlist',
      event: 'sendWaitTimeUpdate',
      template:
        '{business_name}: Updated wait time — approximately {estimated_wait}. We\'ll text when your spot is ready. Reply STOP to opt out.',
      variables: ['business_name', 'estimated_wait'],
      description: 'When wait time estimate changes',
    },
  },
};
