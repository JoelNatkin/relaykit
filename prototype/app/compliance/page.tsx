import Link from "next/link";
import {
  ArrowRight,
  ShieldTick,
  MessageCheckCircle,
  Clock,
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
      {/* Hero */}
      <div className="mx-auto max-w-4xl px-6 pt-20 pb-16 text-center">
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
                icon: Clock,
                title: "Quiet hours and rate limits",
                desc: "Set your rules. We enforce them automatically \u2014 including timezone-aware delivery windows.",
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
                title: "Drift detection",
                desc: "If your messages stray from approved types, our AI catches it and tells you what to fix \u2014 before carriers notice.",
              },
              {
                icon: BarChart07,
                title: "Message quality monitoring",
                desc: "We check for your business name and opt-out instructions \u2014 smart warnings, not hard blocks.",
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

      {/* Stat callout 2 */}
      <div className="py-14">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-xl italic text-text-quaternary leading-snug">
            Carrier suspensions don&apos;t come with a warning. By the time you find out, your number is already offline.
          </p>
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
            We don&apos;t let problems sit on a dashboard waiting for you to notice.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                icon: Target01,
                iconColor: "text-fg-brand-primary",
                bgColor: "bg-bg-brand-secondary",
                title: "Drift detected",
                desc: "Your messages are still delivering, but something\u2019s shifting. We email you what changed and how to bring it back in line.",
              },
              {
                icon: AlertTriangle,
                iconColor: "text-fg-warning-primary",
                bgColor: "bg-bg-warning-secondary",
                title: "Compliance warning",
                desc: "A pattern needs attention \u2014 missing business name, opt-out gaps, or frequency spikes. Daily digest keeps you informed without spamming.",
              },
              {
                icon: Zap,
                iconColor: "text-fg-error-primary",
                bgColor: "bg-bg-error-secondary",
                title: "Critical issue",
                desc: "Something needs immediate action. You\u2019ll get a dashboard alert, email, and optional text to your phone. We don\u2019t wait for you to check a dashboard.",
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
            The goal: you should never be surprised by a carrier suspension.
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
      <footer className="border-t border-border-secondary">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <p className="text-sm font-semibold text-text-primary">Product</p>
              <ul className="mt-3 flex flex-col gap-2">
                <li><Link href="/#how-it-works" className="text-sm text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear">How it works</Link></li>
                <li><Link href="/#categories" className="text-sm text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear">Use cases</Link></li>
                <li><Link href="/compliance" className="text-sm text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear">Compliance</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">Company</p>
              <ul className="mt-3 flex flex-col gap-2">
                <li><Link href="/about" className="text-sm text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear">About</Link></li>
                <li><Link href="/blog" className="text-sm text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear">Blog</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">Legal</p>
              <ul className="mt-3 flex flex-col gap-2">
                <li><Link href="/terms" className="text-sm text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear">Terms</Link></li>
                <li><Link href="/privacy" className="text-sm text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear">Privacy</Link></li>
                <li><Link href="/acceptable-use-policy" className="text-sm text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear">Acceptable Use</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t border-border-tertiary pt-6">
            <p className="text-xs text-text-quaternary">&copy; 2026 Vaulted Press LLC</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
