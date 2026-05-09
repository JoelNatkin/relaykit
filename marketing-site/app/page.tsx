import Image from "next/image";
import Link from "next/link";
import { ConfiguratorSection } from "@/components/configurator-section";
import { HeroOtpVisual } from "@/components/hero-otp-visual";
import { PreviewListMock } from "@/components/preview-list-mock";

const AI_TOOLS = [
  { src: "/logos/claude-logo.svg", alt: "Claude Code" },
  { src: "/logos/cursor-logo.svg", alt: "Cursor" },
  { src: "/logos/windsurf-logo.svg", alt: "Windsurf" },
  { src: "/logos/github-copilot-logo.svg", alt: "GitHub Copilot" },
  { src: "/logos/cline-logo.svg", alt: "Cline" },
] as const;

const STARTER_KITS = ["ShipFast", "Supastarter", "MakerKit", "Vercel + Supabase"] as const;

const CODE_BLOCK = `import { relaykit } from 'relaykit';

await relaykit.appointments.sendConfirmation({
  to: customer.phone,
  appointment: { time: '2:00 PM Friday' }
});`;

export default function MarketingHome() {
  return (
    <div>
      {/* Section 1 — Hero */}
      <div className="pt-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-[3fr_2fr]">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
                SMS for builders
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-text-tertiary">
                Two files. Your AI tool. A working SMS feature.
              </p>
              <p className="mt-4 text-sm font-medium text-text-primary">
                $49 + $19/mo. Three days to live.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                {AI_TOOLS.map((tool) => (
                  <Image
                    key={tool.alt}
                    src={tool.src}
                    alt={tool.alt}
                    width={120}
                    height={20}
                    className="h-5 w-auto opacity-70"
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-center md:justify-end">
              <HeroOtpVisual />
            </div>
          </div>
        </div>
      </div>

      {/* Section 2 — Configurator */}
      <ConfiguratorSection />

      {/* Section 3 — Build it */}
      <section className="mx-auto mt-24 max-w-5xl px-6">
        <div>
          <h2 className="text-center text-2xl font-bold text-text-primary">
            Two files. Your AI tool.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center leading-relaxed text-text-tertiary">
            Most of the integration is already done. The rest takes minutes.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2">
          <div>
            <h3 className="text-base font-bold text-text-primary">Starting fresh</h3>
            <p className="mt-2 text-sm leading-relaxed text-text-tertiary">
              RelayKit slots cleanly into the starter kits builders use. The SDK fits where
              you&apos;d expect; patterns match common stacks.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
              {STARTER_KITS.map((kit) => (
                <span key={kit} className="text-sm font-medium text-text-tertiary">
                  {kit}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-text-primary">Already built</h3>
            <p className="mt-2 text-sm leading-relaxed text-text-tertiary">
              Hand the build spec to your AI tool, point it at where you handle auth, and it does
              the wiring. Takes a little longer than starting fresh — well-trodden, docs cover the
              edges.
            </p>
          </div>
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-text-tertiary">
          Your AI tool learns RelayKit through the build spec. Ask it where to wire opt-outs, or
          whether a message body will pass review — it&apos;ll know.
        </p>

        <div className="mt-8">
          <pre className="mx-auto max-w-2xl overflow-x-auto whitespace-pre rounded-lg bg-bg-secondary px-4 py-4 text-xs font-mono leading-relaxed text-text-secondary">
            {CODE_BLOCK}
          </pre>
          <p className="mx-auto mt-2 max-w-2xl text-center text-xs text-text-tertiary">
            That&apos;s the send.
          </p>
        </div>

        <p className="mt-10 text-center text-sm text-text-tertiary">
          Tests are included. The build spec wires them in.
        </p>
      </section>

      {/* Section 4 — Test it for real */}
      <section className="mx-auto mt-24 max-w-5xl px-6">
        <div>
          <h2 className="text-center text-2xl font-bold text-text-primary">Test it for real.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center leading-relaxed text-text-tertiary">
            Real SMS, real phones, before customers see anything.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 items-start gap-10 md:grid-cols-[3fr_2fr]">
          <div className="flex flex-col gap-4">
            <p className="text-base leading-relaxed text-text-secondary">
              You don&apos;t have to wait for production to know if it works. Add yourself, your
              team, your beta testers — each person verifies once. After that, your app&apos;s SMS
              features work for them exactly the way they&apos;ll work for customers. Verification
              codes, reminders, the whole flow.
            </p>
            <p className="text-base leading-relaxed text-text-secondary">
              Your AI tool also sets up testing utilities in your app: trigger an OTP, fire a
              reminder, queue a message — end-to-end, from your editor.
            </p>
            <p className="mt-2 text-sm italic leading-relaxed text-text-tertiary">
              When you go live, it&apos;s the same code path. No surprises.
            </p>
          </div>
          <PreviewListMock />
        </div>
      </section>

      {/* Section 5 — We handle the paperwork */}
      <section className="mx-auto mt-24 max-w-3xl px-6 text-center">
        <h2 className="text-2xl font-bold text-text-primary">We handle the paperwork.</h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-text-secondary">
          Registration paperwork. The approval back-and-forth. The opt-in form your users see. STOP
          handling. Opt-out tracking. Delivery monitoring.
        </p>
        <p className="mt-6 text-sm italic text-text-tertiary">
          We read it so you don&apos;t have to.
        </p>
      </section>

      {/* Section 6 — Pricing */}
      <section className="mx-auto mt-24 max-w-5xl px-6">
        <p className="text-center text-sm font-semibold text-text-brand-secondary">
          Simple pricing
        </p>
        <h2 className="mt-1 text-center text-2xl font-bold text-text-primary">
          Free to build. $49 + $19/mo to go live.
        </h2>

        <div className="mx-auto mt-10 max-w-[540px] rounded-xl border border-border-primary p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
              Stage 1
            </p>
            <h3 className="mt-2 text-lg font-bold text-text-primary">Build for free</h3>
            <p className="mt-2 text-sm leading-relaxed text-text-tertiary">
              Set up your messages. Wire up the SDK. Test with real phones. No credit card.
            </p>
          </div>

          <hr className="my-6 border-border-secondary" />

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
              Stage 2
            </p>
            <h3 className="mt-2 text-lg font-bold text-text-primary">Go live for $49 + $19/mo</h3>
            <p className="mt-2 text-sm leading-relaxed text-text-tertiary">
              We file your registration with carriers. Approval takes about three days. 500
              messages included per month. $8 per 500 over. Refund if you&apos;re not approved.
            </p>
          </div>
        </div>

        <p className="mx-auto mt-6 max-w-[540px] text-center text-xs text-text-tertiary">
          Marketing categories add $10/mo. Volume pricing above 5,000 messages.
        </p>

        <p className="mx-auto mt-4 max-w-[540px] text-center text-sm text-text-tertiary">
          US and Canada at launch. We don&apos;t handle HIPAA, healthcare-regulated workflows, or
          enterprise procurement.
        </p>
      </section>

      {/* Section 7 — Closing CTA */}
      <section className="mx-auto mt-24 mb-24 max-w-3xl px-6 text-center">
        <h2 className="text-2xl font-bold text-text-primary">Ready when you are.</h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-text-tertiary">
          Configure today. Live in three days. Refund if not approved.
        </p>
        <Link
          href="/start/verify"
          className="mt-8 inline-block rounded-lg border border-border-primary bg-bg-primary px-4 py-2 text-sm font-semibold text-text-secondary transition duration-100 ease-linear hover:bg-bg-primary_hover"
        >
          Get early access
        </Link>
      </section>
    </div>
  );
}
