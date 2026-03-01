import type { TemplateVariables } from "./types";

export function renderTermsOfService(v: TemplateVariables): string {
  return `# Terms of Service

**Effective Date:** ${v.current_date}
**Last Updated:** ${v.current_date}

These Terms of Service ("Terms") govern your use of services provided by ${v.business_name} ("we," "us," or "our"), including our SMS messaging program.

## Acceptance of Terms

By using our services or opting in to receive SMS messages from ${v.business_name}, you agree to be bound by these Terms. If you do not agree, do not use our services or opt in to our messaging program.

## SMS Messaging Program

### Opt-In
By providing your phone number and consenting to receive messages, you agree to receive SMS messages from ${v.business_name} related to ${v.use_case_label}. Consent is not a condition of purchase or use of our services.

### Message Frequency
Message frequency is ${v.message_frequency}. Frequency may vary based on your interactions with our services.

### Costs
Message and data rates may apply depending on your mobile carrier and plan. ${v.business_name} does not charge for SMS messages, but your carrier may.

### Opt-Out
You may opt out of receiving SMS messages at any time by replying STOP to any message you receive from us. You will receive a one-time confirmation message after opting out. No further messages will be sent unless you re-subscribe.

### Help
For assistance with our messaging program, reply HELP to any message or contact us at ${v.contact_email}.

### Supported Carriers
Major US carriers are supported. Carriers are not liable for delayed or undelivered messages.

## Use of Services

You agree to use our services only for lawful purposes and in accordance with these Terms. You agree not to:

- Use our services in any way that violates applicable laws or regulations
- Send unsolicited messages to individuals who have not opted in
- Impersonate any person or entity
- Interfere with or disrupt our services

## Limitation of Liability

To the maximum extent permitted by law, ${v.business_name} shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services, including our SMS messaging program.

## Changes to Terms

We may modify these Terms at any time. Continued use of our services after changes constitutes acceptance of the updated Terms.

## Contact Us

Questions about these Terms? Contact us at:

${v.business_name}
${v.address_full}
Email: ${v.contact_email}
Phone: ${v.contact_phone}`;
}
