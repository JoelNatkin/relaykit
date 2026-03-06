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
              When you register for 10DLC, your business information (name, EIN,
              address, use case, campaign description, and sample messages) is
              submitted to The Campaign Registry (TCR) and shared with US mobile
              carriers (AT&T, T-Mobile, Verizon, and others) as part of the
              brand and campaign registration process. This sharing is required
              for the Service to function — without it, your messages cannot be
              delivered. Carrier data handling is governed by each carrier's own
              privacy policies.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-secondary">
              3.3 Compliance Site
            </h3>
            <p className="mt-2 text-md leading-relaxed text-tertiary">
              The compliance site generated for you at{" "}
              <code className="rounded bg-secondary px-1 py-0.5 font-mono text-sm text-secondary">
                {"{slug}.msgverified.com"}
              </code>{" "}
              displays your business name, contact information (email, phone,
              address), privacy policy, terms of service, and SMS opt-in page.
              This information is publicly accessible by design — carrier
              reviewers, your End Users, and the general public can view it.
              This is a requirement of 10DLC registration.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-secondary">
              3.4 Legal Requirements
            </h3>
            <p className="mt-2 text-md leading-relaxed text-tertiary">
              We may disclose your information if required by law, legal
              process, or governmental request, or if we believe disclosure is
              necessary to protect our rights, your safety, or the safety of
              others, investigate fraud, or respond to a government request.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-secondary">
              3.5 Business Transfer
            </h3>
            <p className="mt-2 text-md leading-relaxed text-tertiary">
              If Vaulted Press LLC is involved in a merger, acquisition, or sale
              of assets, your information may be transferred as part of that
              transaction. We will notify you via email before your information
              becomes subject to a different privacy policy.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-secondary">
              3.6 No Sale of Personal Information
            </h3>
            <p className="mt-2 text-md leading-relaxed text-tertiary">
              We do not sell, rent, lease, or trade your personal information to
              third parties for their marketing or commercial purposes. We do
              not share your information with data brokers.
            </p>
          </div>
        </div>
      </section>

      <hr className="my-8 border-secondary" />

      {/* 4. Data Retention */}
      <section className="mt-8">
        <h2 className="border-b border-secondary pb-2 text-lg font-semibold text-primary">
          4. Data Retention
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-secondary">
                <th className="py-2 pr-4 text-left font-semibold text-secondary">
                  Data Type
                </th>
                <th className="py-2 pr-4 text-left font-semibold text-secondary">
                  Retention Period
                </th>
                <th className="py-2 text-left font-semibold text-secondary">
                  Reason
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary">
              <tr>
                <td className="py-3 pr-4 text-tertiary align-top">
                  Account information
                </td>
                <td className="py-3 pr-4 text-tertiary align-top">
                  Duration of account + 90 days after deletion
                </td>
                <td className="py-3 text-tertiary align-top">
                  Account operation and post-termination audit
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 text-tertiary align-top">
                  Registration data
                </td>
                <td className="py-3 pr-4 text-tertiary align-top">
                  Duration of account + 90 days
                </td>
                <td className="py-3 text-tertiary align-top">
                  Carrier compliance records
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 text-tertiary align-top">
                  Message content
                </td>
                <td className="py-3 pr-4 text-tertiary align-top">
                  30 days from send date
                </td>
                <td className="py-3 text-tertiary align-top">
                  Drift detection and dispute resolution
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 text-tertiary align-top">
                  Message metadata
                </td>
                <td className="py-3 pr-4 text-tertiary align-top">
                  90 days from send date
                </td>
                <td className="py-3 text-tertiary align-top">
                  Compliance audit trail
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 text-tertiary align-top">
                  Payment records
                </td>
                <td className="py-3 pr-4 text-tertiary align-top">
                  As required by tax and financial regulations (typically 7
                  years)
                </td>
                <td className="py-3 text-tertiary align-top">
                  Legal and tax obligations
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 text-tertiary align-top">
                  API usage logs
                </td>
                <td className="py-3 pr-4 text-tertiary align-top">
                  90 days
                </td>
                <td className="py-3 text-tertiary align-top">
                  Debugging, rate limit enforcement, abuse detection
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 text-tertiary align-top">
                  Compliance site content
                </td>
                <td className="py-3 pr-4 text-tertiary align-top">
                  Duration of account + 30 days after cancellation
                </td>
                <td className="py-3 text-tertiary align-top">
                  Carrier audit requirements
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-md leading-relaxed text-tertiary">
          After the retention period, data is permanently deleted. We do not
          retain data longer than necessary for the purposes described above.
        </p>
      </section>

      <hr className="my-8 border-secondary" />

      {/* 5. Data Security */}
      <section className="mt-8">
        <h2 className="border-b border-secondary pb-2 text-lg font-semibold text-primary">
          5. Data Security
        </h2>
        <p className="mt-4 text-md leading-relaxed text-tertiary">
          We implement reasonable administrative, technical, and physical
          security measures to protect your information, including:
        </p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-md text-tertiary">
          <li>
            <strong className="font-semibold text-secondary">
              Encryption in transit
            </strong>{" "}
            — all data transmitted between your application and RelayKit uses
            TLS 1.2 or higher
          </li>
          <li>
            <strong className="font-semibold text-secondary">
              Encryption at rest
            </strong>{" "}
            — sensitive credentials (Twilio subaccount credentials) are
            encrypted using AES-256-GCM before storage
          </li>
          <li>
            <strong className="font-semibold text-secondary">
              Access controls
            </strong>{" "}
            — database access is restricted to authenticated service accounts
            with least-privilege permissions
          </li>
          <li>
            <strong className="font-semibold text-secondary">
              API key security
            </strong>{" "}
            — API keys are hashed before storage; plaintext keys are shown once
            at generation and never stored
          </li>
          <li>
            <strong className="font-semibold text-secondary">
              Magic link authentication
            </strong>{" "}
            — no passwords are stored or transmitted
          </li>
          <li>
            <strong className="font-semibold text-secondary">
              Infrastructure security
            </strong>{" "}
            — hosted on Supabase (SOC 2 Type II compliant) and Cloudflare (SOC
            2 Type II, ISO 27001 certified)
          </li>
        </ul>
        <p className="mt-3 text-md leading-relaxed text-tertiary">
          No method of transmission or storage is 100% secure. While we strive
          to protect your information, we cannot guarantee absolute security.
        </p>
      </section>

      <hr className="my-8 border-secondary" />

      {/* 6. Your Rights */}
      <section className="mt-8">
        <h2 className="border-b border-secondary pb-2 text-lg font-semibold text-primary">
          6. Your Rights
        </h2>

        <div className="mt-6 space-y-6">
          <div>
            <h3 className="text-base font-semibold text-secondary">
              6.1 Access and Portability
            </h3>
            <p className="mt-2 text-md leading-relaxed text-tertiary">
              You may request a copy of the personal information we hold about
              you by contacting{" "}
              <a
                href="mailto:privacy@relaykit.com"
                className="text-brand-secondary underline hover:text-brand-primary"
              >
                privacy@relaykit.com
              </a>
              . We will provide the information in a structured, commonly used
              format within 30 days.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-secondary">
              6.2 Correction
            </h3>
            <p className="mt-2 text-md leading-relaxed text-tertiary">
              You may update your account information through the dashboard at
              any time. For corrections to registration data that has already
              been submitted to carriers, contact{" "}
              <a
                href="mailto:support@relaykit.com"
                className="text-brand-secondary underline hover:text-brand-primary"
              >
                support@relaykit.com
              </a>
              .
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-secondary">
              6.3 Deletion
            </h3>
            <p className="mt-2 text-md leading-relaxed text-tertiary">
              You may request deletion of your account and associated data by
              contacting{" "}
              <a
                href="mailto:privacy@relaykit.com"
                className="text-brand-secondary underline hover:text-brand-primary"
              >
                privacy@relaykit.com
              </a>
              . Upon receiving a verified deletion request:
            </p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-md text-tertiary">
              <li>
                Your account will be deactivated and messaging services
                suspended
              </li>
              <li>
                Personal information will be deleted within 30 days, except
                where retention is required by law or for legitimate business
                purposes (e.g., tax records, fraud prevention)
              </li>
              <li>
                Message content and metadata will be deleted according to the
                retention schedule in Section 4
              </li>
              <li>Your compliance site will be taken offline</li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold text-secondary">
              6.4 Opt-Out of Communications
            </h3>
            <p className="mt-2 text-md leading-relaxed text-tertiary">
              You may opt out of non-essential email communications (such as
              product updates or feature announcements) at any time. You cannot
              opt out of transactional emails related to your account,
              registration status, compliance alerts, or payment notifications,
              as these are necessary to provide the Service.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-secondary">
              6.5 California Residents
            </h3>
            <p className="mt-2 text-md leading-relaxed text-tertiary">
              If you are a California resident, you may have additional rights
              under the California Consumer Privacy Act (CCPA) and the
              California Privacy Rights Act (CPRA), including the right to know
              what personal information we collect and how it is used, the right
              to delete personal information, the right to opt out of the sale
              of personal information (we do not sell personal information), and
              the right to non-discrimination for exercising your privacy
              rights. To exercise these rights, contact{" "}
              <a
                href="mailto:privacy@relaykit.com"
                className="text-brand-secondary underline hover:text-brand-primary"
              >
                privacy@relaykit.com
              </a>
              .
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

        <div className="mt-6 space-y-6">
          <div>
            <h3 className="text-base font-semibold text-secondary">
              7.1 Your End Users' Information
            </h3>
            <p className="mt-2 text-md leading-relaxed text-tertiary">
              When you send SMS messages through RelayKit, we process your End
              Users' phone numbers and the content of messages sent to them. We
              process this information on your behalf as a service provider —
              you are the controller of your End Users' data.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-secondary">
              7.2 Our Use of End User Data
            </h3>
            <p className="mt-2 text-md leading-relaxed text-tertiary">
              We use End User data only to:
            </p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-md text-tertiary">
              <li>Route messages through carrier infrastructure</li>
              <li>
                Enforce compliance rules (opt-out handling, quiet hours, SHAFT-C
                scanning, consent verification)
              </li>
              <li>Detect semantic drift from your registered use case</li>
              <li>
                Generate aggregate, anonymized analytics (message volumes,
                delivery rates)
              </li>
            </ul>
            <p className="mt-3 text-md leading-relaxed text-tertiary">
              We do not use End User phone numbers or message content for our
              own marketing purposes, build profiles of End Users, sell End User
              data, or contact End Users directly (except to confirm opt-out
              requests as required by carrier policy).
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-secondary">
              7.3 Your Obligations
            </h3>
            <p className="mt-2 text-md leading-relaxed text-tertiary">
              You are responsible for providing appropriate privacy disclosures
              to your End Users, obtaining valid consent before sending
              messages, honoring opt-out requests, and complying with all
              applicable privacy laws regarding your End Users' data.
              RelayKit's compliance site generator creates a privacy policy and
              opt-in page that satisfy carrier requirements, but you are
              responsible for ensuring they meet the requirements of applicable
              law for your specific use case and jurisdiction.
            </p>
          </div>
        </div>
      </section>

      <hr className="my-8 border-secondary" />

      {/* 8. Cookies and Tracking */}
      <section className="mt-8">
        <h2 className="border-b border-secondary pb-2 text-lg font-semibold text-primary">
          8. Cookies and Tracking
        </h2>
        <p className="mt-4 text-md leading-relaxed text-tertiary">
          The RelayKit dashboard uses essential cookies for authentication
          (magic link session management) and security. We do not use
          third-party advertising cookies or cross-site tracking technologies.
        </p>
        <p className="mt-3 text-md leading-relaxed text-tertiary">
          We may use basic analytics to understand how developers use the
          dashboard (page views, feature usage, session duration). This data is
          aggregated and not linked to individual advertising profiles.
        </p>
      </section>

      <hr className="my-8 border-secondary" />

      {/* 9. Children's Privacy */}
      <section className="mt-8">
        <h2 className="border-b border-secondary pb-2 text-lg font-semibold text-primary">
          9. Children's Privacy
        </h2>
        <p className="mt-4 text-md leading-relaxed text-tertiary">
          The Service is not intended for use by individuals under 18 years of
          age. We do not knowingly collect personal information from children.
          If we learn that we have collected information from a child under 18,
          we will delete it promptly.
        </p>
      </section>

      <hr className="my-8 border-secondary" />

      {/* 10. International Users */}
      <section className="mt-8">
        <h2 className="border-b border-secondary pb-2 text-lg font-semibold text-primary">
          10. International Users
        </h2>
        <p className="mt-4 text-md leading-relaxed text-tertiary">
          The Service is designed for US-based SMS messaging (A2P 10DLC). Your
          data is processed and stored in the United States. If you access the
          Service from outside the United States, your information will be
          transferred to and processed in the United States, which may have
          different data protection laws than your country of residence.
        </p>
      </section>

      <hr className="my-8 border-secondary" />

      {/* 11. Changes to This Policy */}
      <section className="mt-8">
        <h2 className="border-b border-secondary pb-2 text-lg font-semibold text-primary">
          11. Changes to This Policy
        </h2>
        <p className="mt-4 text-md leading-relaxed text-tertiary">
          We may update this Privacy Policy from time to time. Material changes
          will be communicated via email at least{" "}
          <strong className="font-semibold text-secondary">
            thirty (30) days
          </strong>{" "}
          before they take effect. The current version is always available at
          relaykit.com/privacy.
        </p>
      </section>

      <hr className="my-8 border-secondary" />

      {/* 12. Contact Us */}
      <section className="mt-8">
        <h2 className="border-b border-secondary pb-2 text-lg font-semibold text-primary">
          12. Contact Us
        </h2>
        <p className="mt-4 text-md leading-relaxed text-tertiary">
          If you have questions about this Privacy Policy, want to exercise your
          privacy rights, or have concerns about how your data is handled:
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
