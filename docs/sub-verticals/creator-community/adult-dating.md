## Adult dating / hookup apps
**Vertical:** Creator economy & community
**Bucket:** Not yet, maybe not ever
**URL slug:** /for/adult-dating
> ⚠️ FUTURE REFERENCE ONLY — this sub-vertical is not currently served. Workflows and corpus additions documented here are for future use. Do not build into product surface until bucket changes to Clear or Conditional.

### What this builder is making
An adult-oriented dating/hookup app or platform where users create accounts, browse or match with other adults, and exchange messages, with the product itself centered on adult content and sexual connection. Operationally it looks like any consumer marketplace app: account creation, identity/age verification, matching, in-app messaging, and subscription or à-la-carte billing. The defining attribute is that the brand is an adult-content brand, which permanently changes its carrier-messaging eligibility regardless of how clean any individual send is.

### Why they need SMS
The non-content transactional moments are the same as any consumer app: proving phone ownership at signup, alerting on new-device sign-ins and account suspensions, and keeping paid subscriptions from silently lapsing on a failed card. None of these moments carry adult content — they are verification, account-security, and billing notices. The catch is that the brand can never get carrier brand registration approved (see Content constraints), so even these clean sends are blocked.

### Message categories
1. verification — phone-ownership proof at signup and step-up confirmations are the highest-volume transactional need for a consumer app of this shape
2. account-events — new-device sign-in, account suspension, and the billing lifecycle (payment failed, trial ending, subscription confirmed) are churn- and security-critical
3. customer-support — ticket lifecycle and account-issue resolution for a paid consumer product

Excluded: marketing (promotional category, explicitly SHAFT-C prohibited and EIN-gated — categorically unavailable to this brand), order-updates (no physical fulfillment), appointments (no scheduled-service model), team-alerts (internal ops, not the user-facing job), community (the platform is matching/messaging, not a managed community program), waitlist (not the core gating mechanic).

### Workflows

**Signup phone verification**
Prove the new account controls the phone number it claims at registration.
Sequence:
1. verification:verification-code — "Verification code" — sent when the user enters their phone at signup; carries the one-time code and expiry, no STOP/HELP (2FA carve-out)

**SMS-based login (second factor)**
Issue a one-time code when the user signs in with SMS as a second factor.
Sequence:
1. verification:login-code — "Sign-in code" — sent at login when SMS is the second factor; code plus expiry

**Account recovery**
Let a locked-out user recover access.
Sequence:
1. verification:recovery-code — "Recovery code" — sent when the user starts account recovery; code plus expiry

**Sensitive-action step-up**
Confirm a high-risk action (payment-method change, account-ownership transfer) with a code.
Sequence:
1. verification:confirmation-code — "Confirmation code" — sent before the sensitive action is committed; code plus expiry

**New-device security alert**
Tell the account owner when their account is accessed from an unrecognized device.
Sequence:
1. account-events:new-device-sign-in — "New sign-in alert" — sent on access from a new device, with a link to secure the account if it wasn't them

**Billing lifecycle**
Keep a paid subscription from lapsing and confirm changes.
Sequence:
1. account-events:trial-ending — "Trial ending" — sent a few days before a trial converts, prompting plan selection
2. account-events:payment-failed — "Payment failed" — sent when the card on file is declined, prompting a payment update
3. account-events:subscription-confirmed — "Subscription confirmed" — sent when a renewal, plan change, or cancellation goes through

**Account suspension notice**
Notify a user when their account is suspended (e.g., for a policy violation).
Sequence:
1. account-events:account-suspended — "Account suspended" — sent on suspension, with details and next steps

**Support ticket lifecycle**
Keep a user informed across a support request.
Sequence:
1. customer-support:ticket-received — "Ticket received" — sent when the request is logged
2. customer-support:agent-assigned — "Agent assigned" — sent when an agent picks it up
3. customer-support:agent-response — "Agent replied" — sent when the agent responds
4. customer-support:resolution-notification — "Ticket resolved" — sent when the ticket is closed
5. customer-support:csat-follow-up — "Rate your support" — sent after resolution to collect a rating

**Account issue resolved**
Tell a user a problem on their account was found and fixed with no action needed.
Sequence:
1. customer-support:account-issue-resolved — "Account issue fixed" — sent when the issue is resolved server-side

### Message gaps
None. Every transactional moment for this sub-vertical maps to an existing corpus message; the constraint here is the carrier-eligibility ceiling, not corpus coverage. (No content workflows are documented, by design — see Content constraints.)

### Content constraints
- SHAFT-C permanent prohibition: adult/sexual content is prohibited by carrier (CTIA) and TCR messaging rules regardless of recipient consent or age-gating. Sex content is not in the "age-gated opt-in may proceed" tier (unlike alcohol/tobacco) — it is rejected outright.
- Brand-level block, not message-level: TCR/carrier vetting reviews the brand's website and linked URLs, not just sample messages. An adult-content brand fails brand/campaign registration even when the proposed messages are purely transactional (verification, billing). The clean message inherits the prohibited brand.
- Marketing category is categorically unavailable: it is explicitly SHAFT-C prohibited and EIN-gated; no promotional send is possible for this brand.
- Penalty exposure: prohibited-content sends risk per-message fines (reported up to ~$2,000/message), number suspension, and permanent brand suspension.
- Net effect: even the transactional workflows above, while clean in body, cannot be provisioned because the underlying brand cannot pass registration.

### Disambiguation
This is distinct from mainstream (non-adult) dating apps, which are generally registrable: a PG-rated dating brand whose website and messaging carry no sexual content can pass 10DLC brand/campaign vetting and send the same verification and account-events workflows. The dividing line is the brand's content posture, not the app category — "dating" alone is not prohibited; adult/sexual content is. For an adult-content brand, the prohibition attaches at the brand level: carriers review the brand's site and linked URLs during vetting, so even a campaign whose sample messages are flawless verification or billing notices is rejected because the brand surface is SHAFT-C. That is why this sub-vertical is "Not yet, maybe not ever" — there is no consent flow, copy fix, or category choice that unblocks it; the only path would be a separate, fully non-adult brand, which is a different business.

### Sources
https://www.10dlc.org/en/shaft
https://simpletexting.com/sms-compliance/prohibited-content-shaft/
https://setshape.com/10dlc-registration-guidelines
https://www.bandwidth.com/blog/10dlc-registration-notes-for-non-traditional-brands/
https://help.twilio.com/articles/15778026827291-Why-Was-My-A2P-10DLC-Campaign-Registration-Rejected-
https://help.gohighlevel.com/support/solutions/articles/155000007572-understanding-a2p-campaign-rejection-reasons-required-fixes
