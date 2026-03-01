import type { TemplateVariables } from "./types";

export function renderPrivacyPolicy(v: TemplateVariables): string {
  return `# Privacy Policy

**Effective Date:** ${v.current_date}
**Last Updated:** ${v.current_date}

${v.business_name} ("we," "us," or "our") is committed to protecting the privacy of our users and customers. This Privacy Policy describes how we collect, use, and protect your personal information, including information collected through our SMS messaging program.

## Information We Collect

We collect the following information when you use our services:

- **Contact information:** Name, email address, phone number, and mailing address
- **Account information:** Login credentials and account preferences
- **Communication data:** Messages sent to and from our SMS messaging service
- **Usage data:** How you interact with our services, including timestamps and frequency of messages

## How We Use Your Information

We use your information to:

- Provide and improve our ${v.use_case_label} services
- Send you SMS messages that you have consented to receive
- Respond to your inquiries and provide customer support
- Comply with legal obligations and enforce our terms of service

## SMS Messaging

When you opt in to receive SMS messages from ${v.business_name}, you consent to receive ${v.use_case_label} messages at the phone number you provided. Message frequency is ${v.message_frequency}. Message and data rates may apply.

You may opt out of receiving SMS messages at any time by replying STOP to any message. After opting out, you will receive a final confirmation message and no further messages will be sent. You may reply HELP for assistance or contact us at ${v.contact_email}.

## Mobile Information Sharing Disclosure

We do not sell, rent, loan, trade, lease, or otherwise transfer for profit any phone numbers or personal information collected through our SMS messaging program to any third party. **Opt-in data and consent for our SMS messaging program will not be shared with any third parties or affiliates for their marketing or promotional purposes.**

## Data Security

We implement reasonable administrative, technical, and physical security measures to protect your personal information from unauthorized access, use, or disclosure.

## Data Retention

We retain your personal information only as long as necessary to fulfill the purposes described in this policy or as required by law. You may request deletion of your data by contacting us at ${v.contact_email}.

## Third-Party Services

We may use third-party service providers to help operate our services (such as messaging platforms and hosting providers). These providers are contractually obligated to protect your information and may only use it to provide services on our behalf.

## Children's Privacy

Our services are not intended for individuals under the age of 13. We do not knowingly collect personal information from children under 13.

## Changes to This Policy

We may update this Privacy Policy from time to time. We will notify you of material changes by updating the "Last Updated" date at the top of this policy.

## Contact Us

If you have questions about this Privacy Policy or our data practices, contact us at:

${v.business_name}
${v.address_full}
Email: ${v.contact_email}
Phone: ${v.contact_phone}`;
}
