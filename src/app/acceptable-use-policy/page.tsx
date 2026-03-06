import Link from "next/link";

export const metadata = {
  title: "Acceptable Use Policy | RelayKit",
  description:
    "RelayKit Acceptable Use Policy — permitted and prohibited uses of the RelayKit platform.",
};

export default function AcceptableUsePolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-display-sm font-semibold text-primary">
          Acceptable Use Policy
        </h1>
        <p className="mt-2 text-sm text-tertiary">
          Effective Date: March 6, 2026 · Last Updated: March 6, 2026
        </p>
      </div>

      {/* Intro */}
      <div className="space-y-4">
        <p className="text-md leading-relaxed text-tertiary">
          This Acceptable Use Policy ("AUP") governs your use of the RelayKit
          platform and is incorporated by reference into the{" "}
          <Link
            href="/terms"
            className="text-brand-secondary underline hover:text-brand-primary"
          >
            RelayKit Terms of Service
          </Link>{" "}
          ("Terms"). Capitalized terms not defined here have the meanings given
          in the Terms.
        </p>
        <p className="text-md leading-relaxed text-tertiary">
          RelayKit operates as an ISV (Independent Software Vendor) under a
          shared carrier infrastructure. Every message sent through the platform
          affects RelayKit's carrier trust score and, by extension, every other
          developer on the platform. This AUP exists to protect the platform,
          your messaging capability, and every other developer building on
          RelayKit.
        </p>
      </div>

      <hr className="my-8 border-secondary" />

      {/* 1. Prohibited Content Categories */}
      <section className="mt-8">
        <h2 className="border-b border-secondary pb-2 text-lg font-semibold text-primary">
          1. Prohibited Content Categories
        </h2>

        <div className="mt-6 space-y-6">
          <div>
            <h3 className="text-base font-semibold text-secondary">
              1.1 SHAFT-C Content (Absolute Prohibition)
            </h3>
            <p className="mt-2 text-md leading-relaxed text-tertiary">
              You may not send messages containing content in the following
              categories, collectively known as SHAFT-C. These categories are
              prohibited by US carrier content policies and will result in
              immediate campaign suspension if detected:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-md text-tertiary">
              <li>
                <strong className="font-semibold text-secondary">
                  Sex / Sexual Content:
                </strong>{" "}
                Sexually explicit material, adult entertainment, escort
                services, dating with sexual content, pornography, or sexually
                suggestive promotions
              </li>
              <li>
                <strong className="font-semibold text-secondary">Hate:</strong>{" "}
                Content promoting hatred, violence, or discrimination based on
                race, ethnicity, religion, gender, sexual orientation,
                disability, national origin, or any other protected
                characteristic
              </li>
              <li>
                <strong className="font-semibold text-secondary">
                  Alcohol:
                </strong>{" "}
                Promotion, sale, or advertising of alcoholic beverages
                (exceptions may apply for businesses whose primary registration
                involves food and beverage — see Section 1.5)
              </li>
              <li>
                <strong className="font-semibold text-secondary">
                  Firearms / Ammunition:
                </strong>{" "}
                Promotion, sale, or advertising of firearms, ammunition,
                explosives, or weapons of any kind
              </li>
              <li>
                <strong className="font-semibold text-secondary">
                  Tobacco / Nicotine:
                </strong>{" "}
                Promotion, sale, or advertising of tobacco products,
                e-cigarettes, vaping products, or nicotine delivery systems
              </li>
              <li>
                <strong className="font-semibold text-secondary">
                  Cannabis / Marijuana:
                </strong>{" "}
                Any content related to cannabis, marijuana, CBD, THC, edibles,
                dispensaries, or related products, regardless of legality in
                your jurisdiction
              </li>
            </ul>
            <p className="mt-3 text-md leading-relaxed text-tertiary">
              SHAFT-C content is blocked automatically by RelayKit's Compliance
              Proxy before reaching carriers. Repeated attempts to send SHAFT-C
              content constitute a material breach of the Terms and may result
              in immediate Account termination.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-secondary">
              1.2 Illegal Content
            </h3>
            <p className="mt-2 text-md leading-relaxed text-tertiary">
              You may not use the Service to send messages that promote,
              facilitate, or relate to any illegal activity, including but not
              limited to:
            </p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-md text-tertiary">
              <li>Fraud, phishing, or social engineering</li>
              <li>Identity theft or impersonation</li>
              <li>Sale of controlled substances</li>
              <li>Money laundering or unlicensed financial services</li>
              <li>Gambling in jurisdictions where it is prohibited</li>
              <li>
                Any activity that violates federal, state, or local law
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold text-secondary">
              1.3 Harmful or Deceptive Content
            </h3>
            <p className="mt-2 text-md leading-relaxed text-tertiary">
              You may not send messages that:
            </p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-md text-tertiary">
              <li>Contain false, misleading, or deceptive claims</li>
              <li>
                Impersonate another person, business, or organization
              </li>
              <li>
                Misrepresent the sender's identity or the purpose of the
                message
              </li>
              <li>
                Contain malware, phishing links, or links to malicious websites
              </li>
              <li>
                Attempt to collect sensitive personal information (passwords,
                Social Security numbers, credit card numbers) via SMS
              </li>
              <li>
                Use deceptive opt-in practices (e.g., pre-checked consent
                boxes, buried disclosures, consent bundled with unrelated
                agreements)
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold text-secondary">
              1.4 Unsolicited Messages
            </h3>
            <p className="mt-2 text-md leading-relaxed text-tertiary">
              You may not use the Service to send unsolicited bulk messages
              ("spam"). Every message you send must be to a recipient who has
              provided valid, documented consent to receive messages from your
              business for the specific type of content you are sending.
              Purchased, rented, or scraped phone number lists are strictly
              prohibited.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-secondary">
              1.5 Content Allowlists
            </h3>
            <p className="mt-2 text-md leading-relaxed text-tertiary">
              Certain businesses operate in industries where restricted terms
              appear in normal business communications (e.g., a restaurant
              mentioning "wine pairings" or a bar announcing "cocktail
              specials"). During the registration process, RelayKit generates
              per-customer content allowlists based on your business type and
              registered use case. These allowlists prevent false positives in
              the Compliance Proxy for terms that are legitimate in your
              industry context.
            </p>
            <p className="mt-3 text-md leading-relaxed text-tertiary">
              Content allowlists do not override the SHAFT-C prohibition — they
              apply narrowly to terms that are incidental to your registered
              business activity, not to promotional content for restricted
              products themselves. For example, a restaurant may reference
              alcoholic beverages available at their establishment, but may not
              run a promotional campaign for alcohol sales or delivery.
            </p>
          </div>
        </div>
      </section>

      <hr className="my-8 border-secondary" />

      {/* 2. Prohibited Industries */}
      <section className="mt-8">
        <h2 className="border-b border-secondary pb-2 text-lg font-semibold text-primary">
          2. Prohibited Industries
        </h2>

        <div className="mt-6 space-y-6">
          <div>
            <h3 className="text-base font-semibold text-secondary">
              2.1 Hard Decline — Not Permitted on RelayKit
            </h3>
            <p className="mt-2 text-md leading-relaxed text-tertiary">
              The following industries are not permitted to register or send
              messages through RelayKit at this time:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-md text-tertiary">
              <li>
                <strong className="font-semibold text-secondary">
                  Cannabis / Marijuana / CBD:
                </strong>{" "}
                Carrier content policies prohibit cannabis-related messaging
                regardless of legality in your state or jurisdiction. This is
                an absolute carrier-level restriction that RelayKit cannot
                override.
              </li>
              <li>
                <strong className="font-semibold text-secondary">
                  Firearms / Ammunition / Weapons:
                </strong>{" "}
                Carrier policies restrict firearms-related messaging. T-Mobile
                maintains a de facto ban on firearms promotional content.
              </li>
            </ul>
            <p className="mt-3 text-md leading-relaxed text-tertiary">
              If you operate in one of these industries and attempt to register,
              your registration will be declined during the intake process. No
              setup fee will be charged.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-secondary">
              2.2 Hard Decline with Waitlist — Future Support Planned
            </h3>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-md text-tertiary">
              <li>
                <strong className="font-semibold text-secondary">
                  Healthcare (HIPAA-covered entities):
                </strong>{" "}
                RelayKit's Compliance Proxy processes message content, which
                creates Business Associate obligations under HIPAA. We do not
                currently have the BAA infrastructure, encryption-at-rest audit
                trails, or 6-year record retention required to safely serve
                HIPAA-covered entities. Healthcare businesses requiring HIPAA
                compliance will be declined at intake with an option to join a
                waitlist for future support.
              </li>
            </ul>
            <p className="mt-3 text-md leading-relaxed text-tertiary">
              This restriction applies to medical practices, hospitals, mental
              health providers, dental offices, physical therapy clinics,
              pharmacies, and any entity that transmits Protected Health
              Information (PHI). Veterinary practices are{" "}
              <strong className="font-semibold text-secondary">not</strong>{" "}
              HIPAA-covered and may use the Service.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-secondary">
              2.3 Advisory Industries — Permitted with Guidance
            </h3>
            <p className="mt-2 text-md leading-relaxed text-tertiary">
              The following industries are permitted but receive additional
              compliance guidance during the registration process:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-md text-tertiary">
              <li>
                <strong className="font-semibold text-secondary">
                  Legal services:
                </strong>{" "}
                Messages must not contain case-specific details, legal
                strategy, or confidential client information. Attorney-client
                privilege extends to SMS — a misdirected message containing
                privileged information cannot be recalled.
              </li>
              <li>
                <strong className="font-semibold text-secondary">
                  Financial services (non-FINRA/SEC):
                </strong>{" "}
                Messages must not contain account numbers, balances,
                transaction amounts, SSNs, or specific financial figures.
                Appointment reminders and general notifications are permitted.
              </li>
              <li>
                <strong className="font-semibold text-secondary">
                  Restaurants / Food service:
                </strong>{" "}
                Permitted with standard compliance. Alcohol references in the
                context of menu items or dining experience are handled through
                content allowlists. Dedicated alcohol promotion campaigns
                require a marketing expansion registration.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <hr className="my-8 border-secondary" />

      {/* 3. Messaging Conduct Requirements */}
      <section className="mt-8">
        <h2 className="border-b border-secondary pb-2 text-lg font-semibold text-primary">
          3. Messaging Conduct Requirements
        </h2>

        <div className="mt-6 space-y-6">
          <div>
            <h3 className="text-base font-semibold text-secondary">
              3.1 Consent
            </h3>
            <p className="mt-2 text-md leading-relaxed text-tertiary">
              You must obtain valid consent from each recipient before sending
              any message. Consent requirements vary by message type:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-md text-tertiary">
              <li>
                <strong className="font-semibold text-secondary">
                  Transactional messages
                </strong>{" "}
                (appointment reminders, order updates, verification codes,
                support communications): Require express consent — the
                recipient must have voluntarily provided their phone number and
                agreed to receive the type of messages you are sending.
              </li>
              <li>
                <strong className="font-semibold text-secondary">
                  Marketing / promotional messages
                </strong>{" "}
                (offers, promotions, sales, loyalty programs): Require express
                written consent with clear and conspicuous disclosure of the
                type and frequency of messages, as mandated by the TCPA.
              </li>
            </ul>
            <p className="mt-3 text-md leading-relaxed text-tertiary">
              If you are registered under the Mixed tier, RelayKit's Compliance
              Proxy enforces recipient-level marketing consent — marketing
              messages sent to recipients who have not opted in to marketing
              content will be blocked with a{" "}
              <code className="rounded bg-secondary px-1 py-0.5 font-mono text-sm text-secondary">
                marketing_consent_required
              </code>{" "}
              error.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-secondary">
              3.2 Opt-Out Compliance
            </h3>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-md text-tertiary">
              <li>
                Every first message to a new recipient must include opt-out
                instructions (e.g., "Reply STOP to unsubscribe").
              </li>
              <li>
                You must honor opt-out requests immediately and without
                condition.
              </li>
              <li>
                You may not charge a fee, require additional steps, or impose
                conditions on opting out.
              </li>
              <li>
                RelayKit enforces opt-out at the infrastructure level —
                messages to recipients who have texted STOP are blocked
                automatically. You may not attempt to circumvent this
                enforcement.
              </li>
              <li>
                A recipient who has opted out may only be re-subscribed if they
                independently text START (or an equivalent keyword) to your
                number. You may not manually override an opt-out.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold text-secondary">
              3.3 Quiet Hours
            </h3>
            <p className="mt-2 text-md leading-relaxed text-tertiary">
              Messages sent between 9:00 PM and 9:00 AM in the recipient's
              local time zone are blocked by the Compliance Proxy. This is
              enforced at the infrastructure level. Several US states (including
              Florida, Oklahoma, and Washington) impose statutory quiet hours
              restrictions with penalties for violations. You may not attempt
              to circumvent quiet hours enforcement.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-secondary">
              3.4 Message Frequency
            </h3>
            <p className="mt-2 text-md leading-relaxed text-tertiary">
              You must not send messages at a frequency that exceeds what you
              declared during registration or what a reasonable recipient would
              expect. Excessive messaging to individual recipients is monitored
              by the async compliance pipeline and may trigger warnings or
              enforcement action.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-secondary">
              3.5 Sender Identification
            </h3>
            <p className="mt-2 text-md leading-relaxed text-tertiary">
              Every message should include your business name to identify the
              sender. Messages that do not identify the sender create carrier
              filtering risk and may trigger compliance warnings.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-secondary">
              3.6 Use Case Compliance
            </h3>
            <p className="mt-2 text-md leading-relaxed text-tertiary">
              Your messages must remain consistent with the use case you
              registered. If you registered for appointment reminders, your
              messages must relate to appointments. If your messaging needs
              evolve beyond your registered use case, you must expand your
              registration rather than gradually drifting outside your approved
              scope.
            </p>
            <p className="mt-3 text-md leading-relaxed text-tertiary">
              RelayKit's drift detection system monitors your production
              messages and compares them against your registered messages and
              registered use case. If drift is detected:
            </p>
            <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-md text-tertiary">
              <li>
                You will receive an alert with a suggested compliant
                alternative.
              </li>
              <li>
                Repeated drift (3 or more detections in 7 days) generates a
                dashboard warning and email notification.
              </li>
              <li>
                Persistent drift (10 or more detections in 30 days) may result
                in a sending rate reduction.
              </li>
              <li>
                Continued drift after rate reduction may result in messaging
                being paused until you acknowledge and resolve the issue.
              </li>
            </ol>
          </div>

          <div>
            <h3 className="text-base font-semibold text-secondary">
              3.7 Rate Limits
            </h3>
            <p className="mt-2 text-md leading-relaxed text-tertiary">
              RelayKit enforces carrier-assigned throughput limits on your
              messaging. If you exceed your allocated throughput, the API
              returns a{" "}
              <code className="rounded bg-secondary px-1 py-0.5 font-mono text-sm text-secondary">
                rate_limited
              </code>{" "}
              response with a{" "}
              <code className="rounded bg-secondary px-1 py-0.5 font-mono text-sm text-secondary">
                Retry-After
              </code>{" "}
              header. You must respect rate limit responses and implement
              appropriate retry logic. An abuse safeguard ceiling of 20,000
              messages per day is enforced across all Accounts — usage
              exceeding this threshold triggers automatic review.
            </p>
          </div>
        </div>
      </section>

      <hr className="my-8 border-secondary" />

      {/* 4. Prohibited Activities */}
      <section className="mt-8">
        <h2 className="border-b border-secondary pb-2 text-lg font-semibold text-primary">
          4. Prohibited Activities
        </h2>
        <p className="mt-4 text-md leading-relaxed text-tertiary">
          In addition to the content restrictions above, you may not:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-md text-tertiary">
          <li>
            <strong className="font-semibold text-secondary">
              Circumvent enforcement:
            </strong>{" "}
            Attempt to bypass, disable, or interfere with any compliance
            enforcement mechanism, including the Compliance Proxy, opt-out
            handling, quiet hours enforcement, SHAFT-C scanning, or drift
            detection
          </li>
          <li>
            <strong className="font-semibold text-secondary">
              Abuse the sandbox:
            </strong>{" "}
            Use sandbox API Keys for production messaging, send messages to
            recipients who have not consented, or use the sandbox to test
            prohibited content
          </li>
          <li>
            <strong className="font-semibold text-secondary">
              Resell or redistribute:
            </strong>{" "}
            Resell access to the Service, use the Service to provide SMS
            compliance or registration services to third parties, or create a
            competing product using RelayKit's infrastructure
          </li>
          <li>
            <strong className="font-semibold text-secondary">
              Reverse engineer:
            </strong>{" "}
            Reverse engineer, decompile, or disassemble any part of the Service
          </li>
          <li>
            <strong className="font-semibold text-secondary">
              Share API Keys:
            </strong>{" "}
            Share, publish, or expose your API Keys to unauthorized parties
          </li>
          <li>
            <strong className="font-semibold text-secondary">
              Automate registration abuse:
            </strong>{" "}
            Create multiple Accounts, submit fraudulent registration
            information, or use automated tools to manipulate the registration
            or compliance review process
          </li>
          <li>
            <strong className="font-semibold text-secondary">
              Interfere with the Service:
            </strong>{" "}
            Attempt to disrupt, degrade, or interfere with the Service or its
            infrastructure, including through denial-of-service attacks,
            injection attacks, or excessive API calls intended to overwhelm the
            system
          </li>
        </ul>
      </section>

      <hr className="my-8 border-secondary" />

      {/* 5. Enforcement */}
      <section className="mt-8">
        <h2 className="border-b border-secondary pb-2 text-lg font-semibold text-primary">
          5. Enforcement
        </h2>

        <div className="mt-6 space-y-6">
          <div>
            <h3 className="text-base font-semibold text-secondary">
              5.1 Inline Enforcement (Automatic)
            </h3>
            <p className="mt-2 text-md leading-relaxed text-tertiary">
              The Compliance Proxy automatically blocks messages that violate
              the following rules. Blocked messages return an error response to
              your application with an actionable error code. The message is
              never delivered to the carrier.
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-secondary">
                    <th className="py-2 pr-4 text-left font-semibold text-secondary">
                      Violation
                    </th>
                    <th className="py-2 pr-4 text-left font-semibold text-secondary">
                      Error Code
                    </th>
                    <th className="py-2 text-left font-semibold text-secondary">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary">
                  <tr>
                    <td className="py-3 pr-4 text-tertiary align-top">
                      Recipient opted out
                    </td>
                    <td className="py-3 pr-4 align-top">
                      <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs text-secondary">
                        recipient_opted_out
                      </code>
                    </td>
                    <td className="py-3 text-tertiary align-top">
                      Recipient previously texted STOP
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 text-tertiary align-top">
                      SHAFT-C content detected
                    </td>
                    <td className="py-3 pr-4 align-top">
                      <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs text-secondary">
                        content_prohibited
                      </code>
                    </td>
                    <td className="py-3 text-tertiary align-top">
                      Message contains prohibited content
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 text-tertiary align-top">
                      Quiet hours violation
                    </td>
                    <td className="py-3 pr-4 align-top">
                      <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs text-secondary">
                        quiet_hours_violation
                      </code>
                    </td>
                    <td className="py-3 text-tertiary align-top">
                      Message sent outside 9 AM – 9 PM recipient local time
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 text-tertiary align-top">
                      Empty message
                    </td>
                    <td className="py-3 pr-4 align-top">
                      <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs text-secondary">
                        content_prohibited
                      </code>
                    </td>
                    <td className="py-3 text-tertiary align-top">
                      Message body is empty or whitespace only
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 text-tertiary align-top">
                      Blocked URL
                    </td>
                    <td className="py-3 pr-4 align-top">
                      <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs text-secondary">
                        content_prohibited
                      </code>
                    </td>
                    <td className="py-3 text-tertiary align-top">
                      Message contains a URL on the carrier blocklist
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 text-tertiary align-top">
                      Marketing consent required
                    </td>
                    <td className="py-3 pr-4 align-top">
                      <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs text-secondary">
                        marketing_consent_required
                      </code>
                    </td>
                    <td className="py-3 text-tertiary align-top">
                      Mixed tier: recipient has not opted in to marketing
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-md leading-relaxed text-tertiary">
              <strong className="font-semibold text-secondary">
                You acknowledge that inline message blocking is an automated
                compliance control and that RelayKit has no liability for
                blocked messages or any business impact resulting from
                non-delivery.
              </strong>
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-secondary">
              5.2 Async Enforcement (Warnings and Escalation)
            </h3>
            <p className="mt-2 text-md leading-relaxed text-tertiary">
              Compliance checks that run after message delivery generate
              warnings and may escalate to enforcement actions:
            </p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-md text-tertiary">
              <li>
                <strong className="font-semibold text-secondary">
                  Business name missing:
                </strong>{" "}
                Warning notification
              </li>
              <li>
                <strong className="font-semibold text-secondary">
                  Opt-out language missing from first message:
                </strong>{" "}
                Warning notification
              </li>
              <li>
                <strong className="font-semibold text-secondary">
                  Excessive messaging frequency:
                </strong>{" "}
                Warning, then rate reduction if persistent
              </li>
              <li>
                <strong className="font-semibold text-secondary">
                  Semantic drift from registered use case:
                </strong>{" "}
                Alert with suggested rewrite, escalating to rate reduction and
                pause as described in Section 3.6
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold text-secondary">
              5.3 Manual Enforcement
            </h3>
            <p className="mt-2 text-md leading-relaxed text-tertiary">
              RelayKit reserves the right to review any Account and take
              enforcement action — including warning, suspension, or termination
              — for any violation of this AUP or the Terms, as described in
              Section 11 of the Terms of Service.
            </p>
          </div>
        </div>
      </section>

      <hr className="my-8 border-secondary" />

      {/* 6. Reporting Violations */}
      <section className="mt-8">
        <h2 className="border-b border-secondary pb-2 text-lg font-semibold text-primary">
          6. Reporting Violations
        </h2>
        <p className="mt-4 text-md leading-relaxed text-tertiary">
          If you believe another developer on the RelayKit platform is violating
          this AUP, or if an End User reports receiving unwanted messages from a
          RelayKit-powered application, please contact us at{" "}
          <a
            href="mailto:abuse@relaykit.com"
            className="text-brand-secondary underline hover:text-brand-primary"
          >
            abuse@relaykit.com
          </a>
          .
        </p>
      </section>

      <hr className="my-8 border-secondary" />

      {/* 7. Changes to This Policy */}
      <section className="mt-8">
        <h2 className="border-b border-secondary pb-2 text-lg font-semibold text-primary">
          7. Changes to This Policy
        </h2>
        <p className="mt-4 text-md leading-relaxed text-tertiary">
          RelayKit may update this AUP at any time. We will notify you of
          material changes via email at least{" "}
          <strong className="font-semibold text-secondary">
            fifteen (15) days
          </strong>{" "}
          before they take effect. The current version of the AUP is always
          available at relaykit.com/acceptable-use-policy.
        </p>
        <p className="mt-3 text-md leading-relaxed text-tertiary">
          Continued use of the Service after the effective date of any changes
          constitutes acceptance of the updated AUP. If you do not agree to the
          changes, you may cancel your Account before they take effect.
        </p>
        <p className="mt-3 text-md leading-relaxed text-tertiary">
          Non-material changes (such as clarifications, formatting updates, or
          additions to the prohibited content list that reflect existing carrier
          policies) may take effect immediately upon posting.
        </p>
      </section>

      <hr className="my-8 border-secondary" />

      {/* 8. Questions */}
      <section className="mt-8">
        <h2 className="border-b border-secondary pb-2 text-lg font-semibold text-primary">
          8. Questions
        </h2>
        <p className="mt-4 text-md leading-relaxed text-tertiary">
          If you have questions about this AUP or are unsure whether a specific
          use case is permitted, contact us at{" "}
          <a
            href="mailto:support@relaykit.com"
            className="text-brand-secondary underline hover:text-brand-primary"
          >
            support@relaykit.com
          </a>{" "}
          <strong className="font-semibold text-secondary">before</strong>{" "}
          registering or sending messages. We would rather help you understand
          the boundaries upfront than enforce them after the fact.
        </p>
      </section>

      <p className="mt-12 text-sm text-quaternary">
        This Acceptable Use Policy was last updated on March 6, 2026.
      </p>
    </div>
  );
}
