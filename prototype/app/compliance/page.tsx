import Link from "next/link";
import { Footer } from "@/components/footer";
import {
  ArrowRight,
  ShieldTick,
  MessageCheckCircle,
  Stars02,
  Target01,
  BarChart07,
  Code01,
  AlertTriangle,
  Zap,
  Globe01,
} from "@untitledui/icons";

export default function CompliancePage() {
  return (
    <div>
      {/* Breadcrumb */}
      <div className="mx-auto max-w-4xl px-6 pt-10">
        <nav className="text-sm text-text-tertiary">
          <Link href="/" className="hover:text-text-secondary transition duration-100 ease-linear">Home</Link>
          <span className="mx-1.5">/</span>
          <span className="text-text-secondary">Compliance</span>
        </nav>
      </div>

      {/* Hero */}
      <div className="mx-auto max-w-4xl px-6 pt-10 pb-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
          Compliance, handled.
        </h1>
        <p className="mt-4 text-lg text-text-tertiary max-w-2xl mx-auto leading-relaxed">
          US carriers require registration, content rules, and opt-out handling for every
          business that sends texts. RelayKit handles all of it &mdash; before, during,
          and after your messages go out.
        </p>
      </div>

      {/* Section 1: Before your messages send */}
      <div className="bg-bg-secondary py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-2xl font-bold text-text-primary">
            Before your messages send
          </h2>
          <p className="mt-3 text-text-tertiary leading-relaxed max-w-2xl">
            Every message your app sends through RelayKit is checked against carrier rules
            before it reaches anyone&apos;s phone. Problems get caught before delivery &mdash; not after.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                icon: ShieldTick,
                title: "Opt-out enforcement",
                desc: "When someone replies STOP, future messages to that number are blocked automatically.",
              },
              {
                icon: MessageCheckCircle,
                title: "Message content checks",
                desc: "Every message is scanned before sending. Something wrong? Clear error, not a silent failure.",
              },
              {
                icon: Stars02,
                title: "Compliance that learns",
                desc: "Our system gets smarter over time \u2014 adapting to carrier rule changes so your messages stay compliant without you tracking updates.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-xl border border-border-secondary bg-bg-primary p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bg-brand-secondary">
                  <card.icon className="size-5 text-fg-brand-primary" />
                </div>
                <h3 className="mt-4 text-sm font-bold text-text-primary">{card.title}</h3>
                <p className="mt-2 text-sm text-text-tertiary leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stat callout 1 */}
      <div className="py-14">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-xl italic text-text-quaternary leading-snug">
            TCPA opt-out violations carry fines of $500&ndash;$1,500 per message. RelayKit makes them impossible.
          </p>
        </div>
      </div>

      {/* Section 2: After your messages deliver */}
      <div className="bg-bg-secondary py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-2xl font-bold text-text-primary">
            Ongoing protection
          </h2>
          <p className="mt-3 text-text-tertiary leading-relaxed max-w-2xl">
            We watch what goes out and catch problems early.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              {
                icon: Target01,
                title: "Automatic fixes",
                desc: "If a message doesn\u2019t meet carrier rules, we rewrite it before it goes out. You get a notification with what changed and why.",
              },
              {
                icon: BarChart07,
                title: "Continuous scanning",
                desc: "Every message is checked for business name, opt-out language, and content rules. Issues are fixed in real time.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-xl border border-border-secondary bg-bg-primary p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bg-brand-secondary">
                  <card.icon className="size-5 text-fg-brand-primary" />
                </div>
                <h3 className="mt-4 text-sm font-bold text-text-primary">{card.title}</h3>
                <p className="mt-2 text-sm text-text-tertiary leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Section 3: Before you deploy */}
      <div className="bg-bg-secondary py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-2xl font-bold text-text-primary">
            Before you deploy
          </h2>
          <p className="mt-3 text-text-tertiary leading-relaxed max-w-2xl">
            Your AI builds with compliance baked in from the start.
          </p>

          <div className="mt-10 rounded-xl border border-border-secondary bg-bg-primary p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bg-brand-secondary">
              <Code01 className="size-5 text-fg-brand-primary" />
            </div>
            <h3 className="mt-4 text-sm font-bold text-text-primary">AI-powered message guidance</h3>
            <p className="mt-2 text-sm text-text-tertiary leading-relaxed max-w-2xl">
              The guidelines file we provide becomes your AI&apos;s compliance reference. As it helps you
              write new messages, it knows what&apos;s approved for your use case &mdash; and keeps you
              inside the lines.
            </p>
          </div>

        </div>
      </div>

      {/* Stat callout 3 */}
      <div className="py-14">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-xl italic text-text-quaternary leading-snug">
            The #1 reason registrations get rejected? Missing or incomplete compliance sites. RelayKit generates and hosts yours automatically.
          </p>
        </div>
      </div>

      {/* Section 4: When something needs attention */}
      <div className="bg-bg-secondary py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-2xl font-bold text-text-primary">
            When something needs attention
          </h2>
          <p className="mt-3 text-text-tertiary leading-relaxed max-w-2xl">
            We fix problems automatically and keep you informed.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                icon: Target01,
                iconColor: "text-fg-brand-primary",
                bgColor: "bg-bg-brand-secondary",
                title: "Minor",
                desc: "We fixed it automatically. You\u2019ll get a notification with what changed. Update your code when you get a chance.",
              },
              {
                icon: AlertTriangle,
                iconColor: "text-fg-warning-primary",
                bgColor: "bg-bg-warning-secondary",
                title: "Escalated",
                desc: "We fixed it, but this one needs your attention within 30 days. We\u2019ll remind you along the way.",
              },
              {
                icon: Zap,
                iconColor: "text-fg-error-primary",
                bgColor: "bg-bg-error-secondary",
                title: "Suspended",
                desc: "This message is blocked until you fix it. Edit it on your dashboard or update your code.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-xl border border-border-secondary bg-bg-primary p-6"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.bgColor}`}>
                  <card.icon className={`size-5 ${card.iconColor}`} />
                </div>
                <h3 className="mt-4 text-sm font-bold text-text-primary">{card.title}</h3>
                <p className="mt-2 text-sm text-text-tertiary leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm font-medium text-text-secondary">
            The goal: compliance runs itself. You stay informed, not burdened.
          </p>
        </div>
      </div>

      {/* Section 5: Your compliance site */}
      <div className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="flex gap-4 items-start">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-bg-brand-secondary">
              <Globe01 className="size-5 text-fg-brand-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text-primary">
                Your compliance site
              </h2>
              <p className="mt-3 text-text-tertiary leading-relaxed max-w-2xl">
                Carriers require every registered business to have a public page with a privacy
                policy, terms of service, and opt-in disclosure. Missing or incomplete sites are
                the #1 reason registrations get rejected.{" "}
                <span className="font-semibold text-text-primary">RelayKit generates your site automatically
                based on your use case, hosts it for you, and keeps it up to date.</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-bg-secondary py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="rounded-2xl bg-bg-brand-section p-10 text-center">
            <h2 className="text-2xl font-bold text-text-primary_on-brand">
              Ready to start building?
            </h2>
            <div className="mt-6 flex items-center justify-center gap-4">
              <Link
                href="/#categories"
                className="inline-flex items-center gap-2 rounded-lg bg-bg-primary px-5 py-2.5 text-sm font-semibold text-text-brand-secondary transition duration-100 ease-linear hover:bg-bg-primary_hover"
              >
                Pick your use case
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/#pricing"
                className="rounded-lg border border-border-primary px-5 py-2.5 text-sm font-semibold text-text-secondary_on-brand transition duration-100 ease-linear hover:bg-bg-primary/10"
              >
                See pricing
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
