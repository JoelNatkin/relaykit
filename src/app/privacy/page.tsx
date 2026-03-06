import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | RelayKit",
  description:
    "RelayKit Privacy Policy — how we collect, use, store, and protect your information.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-display-sm font-semibold text-primary">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-tertiary">
          Effective Date: March 6, 2026 · Last Updated: March 6, 2026
        </p>
      </div>

      {/* Intro */}
      <div className="space-y-4">
        <p className="text-md leading-relaxed text-tertiary">
          Vaulted Press LLC, a South Carolina limited liability company doing
          business as RelayKit ("RelayKit," "we," "us," or "our"), is committed
          to protecting the privacy of developers who use our platform. This
          Privacy Policy describes how we collect, use, store, and protect your
          information when you use the RelayKit platform and services (the
          "Service").
        </p>
        <p className="text-md leading-relaxed text-tertiary">
          This Privacy Policy applies to you as a developer using RelayKit. For
          information about how your End Users' data is handled through the
          messaging proxy, see Section 7.
        </p>
      </div>

      <hr className="my-8 border-secondary" />

      {/* 1. Information We Collect */}
      <section className="mt-8">
        <h2 className="border-b border-secondary pb-2 text-lg font-semibold text-primary">
          1. Information We Collect
        </h2>

        <div className="mt-6 space-y-6">
          <div>
            <h3 className="text-base font-semibold text-secondary">
              1.1 Account Information
            </h3>
            <p className="mt-2 text-md leading-relaxed text-tertiary">
              When you create a RelayKit account, we collect:
            </p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-md text-tertiary">
              <li>
                <strong className="font-semibold text-secondary">
                  Email address
                </strong>{" "}
                — used for magic link authentication, account communications,
                and registration status notifications
              </li>
              <li>
                <strong className="font-semibold text-secondary">
                  Full name
                </strong>{" "}
                — submitted as part of your 10DLC registration
              </li>
              <li>
                <strong className="font-semibold text-secondary">
                  Phone number
                </strong>{" "}
                — used for carrier OTP verification during the registration
                process
              </li>
              <li>
                <strong className="font-semibold text-secondary">
                  Business information
                </strong>{" "}
                — business name, type (LLC, corporation, sole proprietor,
                etc.), EIN (if applicable), street address, city, state, and
                ZIP code, as required for 10DLC brand registration
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold text-secondary">
              1.2 Registration and Use Case Information
            </h3>
            <p className="mt-2 text-md leading-relaxed text-tertiary">
              When you go through the registration process, we collect:
            </p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-md text-tertiary">
              <li>
                <strong className="font-semibold text-secondary">
                  Use case selection
                </strong>{" "}
                — the type of SMS messaging you intend to send (e.g.,
                appointment reminders, order updates, verification codes)
              </li>
              <li>
                <strong className="font-semibold text-secondary">
                  Business description
                </strong>{" "}
                — a brief description of your application or service
              </li>
              <li>
                <strong className="font-semibold text-secondary">
                  Service-specific details
                </strong>{" "}
                — depending on your use case, additional context such as
                service type, product type, community name, or venue type
              </li>
              <li>
                <strong className="font-semibold text-secondary">
                  Website URL
                </strong>{" "}
                — if you have an existing website for your application
              </li>
              <li>
                <strong className="font-semibold text-secondary">
                  Message plan selections
                </strong>{" "}
                — the message templates you choose and configure through the
                dashboard
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold text-secondary">
              1.3 Payment Information
            </h3>
            <p className="mt-2 text-md leading-relaxed text-tertiary">
              We use Stripe to process payments. RelayKit does not directly
              collect, store, or have access to your full credit card number,
              expiration date, or CVV. Stripe collects and processes payment
              information in accordance with their privacy policy. We receive
              from Stripe: a tokenized payment method identifier, billing
              email, payment status, and transaction history.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-secondary">
              1.4 Usage Data
            </h3>
            <p className="mt-2 text-md leading-relaxed text-tertiary">
              We automatically collect:
            </p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-md text-tertiary">
              <li>
                <strong className="font-semibold text-secondary">
                  API usage
                </strong>{" "}
                — request timestamps, endpoints called, response codes, message
                counts, and error rates
              </li>
              <li>
                <strong className="font-semibold text-secondary">
                  Dashboard activity
                </strong>{" "}
                — pages visited, features used, and session duration (collected
                via standard web analytics)
              </li>
              <li>
                <strong className="font-semibold text-secondary">
                  Message metadata
                </strong>{" "}
                — timestamps, recipient phone numbers (hashed for analytics),
                delivery status, and compliance check results for messages sent
                through the Compliance Proxy
              </li>
              <li>
                <strong className="font-semibold text-secondary">
                  Message content
                </strong>{" "}
                — the text content of outbound SMS messages routed through the
                Compliance Proxy (see Section 4 for retention details)
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold text-secondary">
              1.5 Technical Data
            </h3>
            <p className="mt-2 text-md leading-relaxed text-tertiary">
              We collect standard technical data including IP address, browser
              type, operating system, device type, and referring URL. This is
              used for security, fraud prevention, and service improvement.
            </p>
          </div>
        </div>
      </section>

      <hr className="my-8 border-secondary" />

      {/* 2. How We Use Your Information */}
      <section className="mt-8">
        <h2 className="border-b border-secondary pb-2 text-lg font-semibold text-primary">
          2. How We Use Your Information
        </h2>
        <p className="mt-4 text-md leading-relaxed text-tertiary">
          We use the information we collect to:
        </p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-md text-tertiary">
          <li>
            <strong className="font-semibold text-secondary">
              Provide the Service
            </strong>{" "}
            — create and manage your account, process your 10DLC registration,
            provision messaging infrastructure, and deliver your compliance
            artifacts
          </li>
          <li>
            <strong className="font-semibold text-secondary">
              Process payments
            </strong>{" "}
            — charge setup fees, monthly subscriptions, and message overage
            through Stripe
          </li>
          <li>
            <strong className="font-semibold text-secondary">
              Enforce compliance
            </strong>{" "}
            — scan outbound messages for prohibited content, enforce opt-out
            handling, quiet hours, rate limits, and drift detection as described
            in our{" "}
            <Link
              href="/terms"
              className="text-brand-secondary underline hover:text-brand-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/acceptable-use-policy"
              className="text-brand-secondary underline hover:text-brand-primary"
            >
              Acceptable Use Policy
            </Link>
          </li>
          <li>
            <strong className="font-semibold text-secondary">
              Communicate with you
            </strong>{" "}
            — send registration status updates, compliance alerts, payment
            notifications, and service announcements via email
          </li>
          <li>
            <strong className="font-semibold text-secondary">
              Improve the Service
            </strong>{" "}
            — analyze usage patterns (in aggregate) to improve features, fix
            bugs, and plan product development
          </li>
          <li>
            <strong className="font-semibold text-secondary">
              Protect the platform
            </strong>{" "}
            — detect and prevent fraud, abuse, and violations of our Terms and
            AUP
          </li>
          <li>
            <strong className="font-semibold text-secondary">
              Comply with legal obligations
            </strong>{" "}
            — respond to lawful requests from law enforcement or regulatory
            authorities
          </li>
        </ul>
        <p className="mt-4 text-md leading-relaxed text-tertiary">
          We do not use your information for advertising purposes. We do not
          build advertising profiles. We do not sell your information.
        </p>
      </section>

      <hr className="my-8 border-secondary" />

      {/* 3. How We Share Your Information */}
      <section className="mt-8">
        <h2 className="border-b border-secondary pb-2 text-lg font-semibold text-primary">
          3. How We Share Your Information
        </h2>

        <div className="mt-6 space-y-6">
          <div>
            <h3 className="text-base font-semibold text-secondary">
              3.1 Service Providers
            </h3>
            <p className="mt-2 text-md leading-relaxed text-tertiary">
              We share information with third-party service providers who help
              us operate the Service:
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-secondary">
                    <th className="py-2 pr-4 text-left font-semibold text-secondary">
                      Provider
                    </th>
                    <th className="py-2 pr-4 text-left font-semibold text-secondary">
                      What We Share
                    </th>
                    <th className="py-2 text-left font-semibold text-secondary">
                      Purpose
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary">
                  <tr>
                    <td className="py-3 pr-4 font-semibold text-secondary align-top">
                      Twilio
                    </td>
                    <td className="py-3 pr-4 text-tertiary align-top">
                      Business name, EIN, address, phone number, use case
                      details, campaign description, sample messages
                    </td>
                    <td className="py-3 text-tertiary align-top">
                      10DLC brand and campaign registration with US carriers
                      via The Campaign Registry (TCR)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-semibold text-secondary align-top">
                      Stripe
                    </td>
                    <td className="py-3 pr-4 text-tertiary align-top">
                      Email address, payment method (collected directly by
                      Stripe)
                    </td>
                    <td className="py-3 text-tertiary align-top">
                      Payment processing
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-semibold text-secondary align-top">
                      Supabase
                    </td>
                    <td className="py-3 pr-4 text-tertiary align-top">
                      All account and registration data
                    </td>
                    <td className="py-3 text-tertiary align-top">
                      Database hosting and authentication
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-semibold text-secondary align-top">
                      Cloudflare
                    </td>
                    <td className="py-3 pr-4 text-tertiary align-top">
                      Compliance site content, business information displayed
                      on compliance pages
                    </td>
                    <td className="py-3 text-tertiary align-top">
                      Compliance site hosting and CDN
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-semibold text-secondary align-top">
                      Resend
                    </td>
                    <td className="py-3 pr-4 text-tertiary align-top">
                      Email address
                    </td>
                    <td className="py-3 text-tertiary align-top">
                      Transactional email delivery (registration updates,
                      compliance alerts)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-md leading-relaxed text-tertiary">
              These providers process your information only as necessary to
              provide their services to us and are contractually obligated to
              protect it.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-secondary">
              3.2 Carrier Registration
            </h3>
            <p className="mt-2 text-md leading-relaxed text-tertiary">
              When you register for 10DLC, your business information — including
              your legal business name, EIN, address, and use case details —
              is submitted to The Campaign Registry (TCR) and US wireless
              carriers as part of the required brand and campaign registration
              process. This information becomes part of your registered profile
              with TCR and is used by carriers to evaluate your messaging
              traffic.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-secondary">
              3.3 Legal Disclosures
            </h3>
            <p className="mt-2 text-md leading-relaxed text-tertiary">
              We may disclose your information if required by law, regulation,
              legal process, or governmental request, or if we believe
              disclosure is necessary to protect the rights, property, or
              safety of RelayKit, our users, or the public.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-secondary">
              3.4 Business Transfers
            </h3>
            <p className="mt-2 text-md leading-relaxed text-tertiary">
              If RelayKit is involved in a merger, acquisition, or sale of
              assets, your information may be transferred as part of that
              transaction. We will notify you via email and post a prominent
              notice on the Service before any such transfer and any associated
              change to this Privacy Policy.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-secondary">
              3.5 No Sale of Data
            </h3>
            <p className="mt-2 text-md leading-relaxed text-tertiary">
              RelayKit does not sell, rent, or trade your personal information
              to third parties for their own marketing or commercial purposes.
            </p>
          </div>
        </div>
      </section>

      <hr className="my-8 border-secondary" />

      {/* 4. Message Content and Data Retention */}
      <section className="mt-8">
        <h2 className="border-b border-secondary pb-2 text-lg font-semibold text-primary">
          4. Message Content and Data Retention
        </h2>

        <div className="mt-6 space-y-6">
          <div>
            <h3 className="text-base font-semibold text-secondary">
              4.1 Message Content Processing
            </h3>
            <p className="mt-2 text-md leading-relaxed text-tertiary">
              All outbound SMS messages sent through the Compliance Proxy are
              processed by RelayKit's compliance infrastructure. This processing
              includes real-time scanning for prohibited content, opt-out
              enforcement, quiet hours compliance, and rate limit enforcement.
              Message content is not reviewed by humans except in the context
              of investigating reported violations or responding to legal
              process.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-secondary">
              4.2 Retention Schedule
            </h3>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-md text-tertiary">
              <li>
                <strong className="font-semibold text-secondary">
                  Full message content:
                </strong>{" "}
                30 days — retained for drift detection and compliance dispute
                resolution, then permanently deleted
              </li>
              <li>
                <strong className="font-semibold text-secondary">
                  Message metadata
                </strong>{" "}
                (timestamps, recipient phone numbers, delivery status,
                compliance check results):{" "}
                90 days — retained for compliance audit purposes
              </li>
              <li>
                <strong className="font-semibold text-secondary">
                  Account and registration data:
                </strong>{" "}
                90 days after account closure, then permanently deleted
              </li>
              <li>
                <strong className="font-semibold text-secondary">
                  Payment records:
                </strong>{" "}
                Retained as required by applicable tax and financial
                regulations (typically 7 years)
              </li>
            </ul>
          </div>
        </div>
      </section>

      <hr className="my-8 border-secondary" />

      {/* 5. Data Security */}
      <section className="mt-8">
        <h2 className="border-b border-secondary pb-2 text-lg font-semibold text-primary">
          5. Data Security
        </h2>
        <p className="mt-4 text-md leading-relaxed text-tertiary">
          We implement reasonable technical and organizational security measures
          to protect your information, including:
        </p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-md text-tertiary">
          <li>Encryption in transit (TLS) for all API and dashboard traffic</li>
          <li>
            API keys are hashed (SHA-256) at rest — live production keys are
            shown once and cannot be retrieved
          </li>
          <li>
            Supabase Row Level Security (RLS) ensures your data is accessible
            only to your account
          </li>
          <li>
            Magic link authentication eliminates password storage and associated
            breach risks
          </li>
        </ul>
        <p className="mt-3 text-md leading-relaxed text-tertiary">
          No security system is impenetrable. While we take reasonable steps to
          protect your information, we cannot guarantee absolute security.
          Notify us immediately at{" "}
          <a
            href="mailto:security@relaykit.com"
            className="text-brand-secondary underline hover:text-brand-primary"
          >
            security@relaykit.com
          </a>{" "}
          if you believe your account has been compromised.
        </p>
      </section>

      <hr className="my-8 border-secondary" />

      {/* 6. Your Rights and Choices */}
      <section className="mt-8">
        <h2 className="border-b border-secondary pb-2 text-lg font-semibold text-primary">
          6. Your Rights and Choices
        </h2>

        <div className="mt-6 space-y-6">
          <div>
            <h3 className="text-base font-semibold text-secondary">
              6.1 Access and Correction
            </h3>
            <p className="mt-2 text-md leading-relaxed text-tertiary">
              You may access and update your account information at any time
              through the dashboard. If you need to correct registration
              information that has already been submitted to TCR, contact us at{" "}
              <a
                href="mailto:support@relaykit.com"
                className="text-brand-secondary underline hover:text-brand-primary"
              >
                support@relaykit.com
              </a>{" "}
              — note that corrections may require resubmission and a new carrier
              review period.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-secondary">
              6.2 Account Deletion
            </h3>
            <p className="mt-2 text-md leading-relaxed text-tertiary">
              You may request deletion of your account by canceling your
              subscription and contacting support. Account data is retained for
              90 days after closure for compliance audit purposes, then
              permanently deleted. Note that business information already
              submitted to TCR and carriers cannot be withdrawn from their
              systems.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-secondary">
              6.3 Communications Preferences
            </h3>
            <p className="mt-2 text-md leading-relaxed text-tertiary">
              You may opt out of non-essential communications (such as product
              updates and newsletters) by clicking the unsubscribe link in any
              marketing email. You cannot opt out of transactional emails
              related to your account, registration status, compliance alerts,
              and payment notifications — these are necessary for the operation
              of the Service.
            </p>
          </div>
        </div>
      </section>

      <hr className="my-8 border-secondary" />

      {/* 7. End User Data */}
      <section className="mt-8">
        <h2 className="border-b border-secondary pb-2 text-lg font-semibold text-primary">
          7. End User Data
        </h2>
        <p className="mt-4 text-md leading-relaxed text-tertiary">
          When you use the Service to send SMS messages to your End Users,
          RelayKit processes End User phone numbers and message content as a
          data processor acting on your behalf. You are the data controller
          responsible for your End Users' data.
        </p>
        <p className="mt-3 text-md leading-relaxed text-tertiary">
          Specifically:
        </p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-md text-tertiary">
          <li>
            <strong className="font-semibold text-secondary">
              Recipient phone numbers
            </strong>{" "}
            are stored in hashed form for opt-out tracking. We do not maintain
            a plaintext directory of your End Users' phone numbers.
          </li>
          <li>
            <strong className="font-semibold text-secondary">
              Opt-out records
            </strong>{" "}
            are maintained indefinitely to prevent re-messaging of individuals
            who have requested to stop receiving messages. This retention is a
            compliance requirement under TCPA.
          </li>
          <li>
            <strong className="font-semibold text-secondary">
              Marketing consent records
            </strong>{" "}
            (for Mixed tier) are retained as long as your account is active and
            for 90 days after closure.
          </li>
        </ul>
        <p className="mt-3 text-md leading-relaxed text-tertiary">
          You are responsible for ensuring you have appropriate legal basis
          under applicable privacy laws to provide End User phone numbers to
          RelayKit for message delivery, and for maintaining your own records
          of End User consent.
        </p>
      </section>

      <hr className="my-8 border-secondary" />

      {/* 8. Cookies and Tracking */}
      <section className="mt-8">
        <h2 className="border-b border-secondary pb-2 text-lg font-semibold text-primary">
          8. Cookies and Tracking
        </h2>
        <p className="mt-4 text-md leading-relaxed text-tertiary">
          RelayKit uses session cookies required for authentication (Supabase
          auth tokens) and functional cookies necessary for the dashboard to
          operate. We do not use third-party advertising cookies or behavioral
          tracking pixels.
        </p>
        <p className="mt-3 text-md leading-relaxed text-tertiary">
          We may use standard web analytics to collect aggregated, anonymized
          information about how the dashboard is used. This data does not
          identify individual users and is used solely to improve the product.
        </p>
      </section>

      <hr className="my-8 border-secondary" />

      {/* 9. Changes to This Policy */}
      <section className="mt-8">
        <h2 className="border-b border-secondary pb-2 text-lg font-semibold text-primary">
          9. Changes to This Privacy Policy
        </h2>
        <p className="mt-4 text-md leading-relaxed text-tertiary">
          We may update this Privacy Policy from time to time. Material changes
          will be communicated via email to the address associated with your
          account at least{" "}
          <strong className="font-semibold text-secondary">thirty (30) days</strong>{" "}
          before they take effect. The updated policy will be posted at
          relaykit.com/privacy with the new effective date.
        </p>
        <p className="mt-3 text-md leading-relaxed text-tertiary">
          Your continued use of the Service after the effective date of any
          changes constitutes acceptance of the updated Privacy Policy.
        </p>
      </section>

      <hr className="my-8 border-secondary" />

      {/* 10. Contact */}
      <section className="mt-8">
        <h2 className="border-b border-secondary pb-2 text-lg font-semibold text-primary">
          10. Contact
        </h2>
        <p className="mt-4 text-md leading-relaxed text-tertiary">
          If you have questions about this Privacy Policy or how your
          information is handled, contact us at:
        </p>
        <div className="mt-4 space-y-1 text-md text-tertiary">
          <p className="font-semibold text-secondary">
            Vaulted Press LLC (d/b/a RelayKit)
          </p>
          <p>5196 Celtic Dr, North Charleston, SC 29405</p>
          <p>
            Email:{" "}
            <a
              href="mailto:privacy@relaykit.com"
              className="text-brand-secondary underline hover:text-brand-primary"
            >
              privacy@relaykit.com
            </a>
          </p>
          <p>Website: relaykit.com</p>
        </div>
      </section>

      <p className="mt-12 text-sm text-quaternary">
        This Privacy Policy was last updated on March 6, 2026.
      </p>
    </div>
  );
}
