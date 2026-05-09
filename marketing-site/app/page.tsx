import Image from "next/image";
import Link from "next/link";
import { ConfiguratorSection } from "@/components/configurator-section";
import { PreviewListMock } from "@/components/preview-list-mock";

// Per-logo heights tune visual weight, not pixel height. Heights compensate
// for two things: (1) icon-plus-wordmark logos (Cursor, Copilot) render
// taller at a given pixel height than pure wordmarks because the icon
// glyph takes vertical room; (2) some SVGs have transparent padding baked
// into the viewBox — windsurf in particular uses only ~33% of its canvas
// height, so it needs roughly 2x the height of peers to render at matching
// visible size. The flex row uses items-center, so the taller windsurf
// cell centers cleanly with shorter siblings.
const AI_TOOLS = [
  { src: "/logos/tool_logos_wordmarks/claude_pos.svg", alt: "Claude Code", heightClass: "h-[18px]" },
  { src: "/logos/tool_logos_wordmarks/Cursor_pos.svg", alt: "Cursor", heightClass: "h-[22px]" },
  { src: "/logos/tool_logos_wordmarks/windsurf_pos.svg", alt: "Windsurf", heightClass: "h-[44px]" },
  { src: "/logos/tool_logos_wordmarks/Copilot_pos.svg", alt: "GitHub Copilot", heightClass: "h-[20px]" },
  { src: "/logos/tool_logos_wordmarks/Cline_pos.svg", alt: "Cline", heightClass: "h-[18px]" },
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
          <h1 className="text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
            SMS for builders
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-text-tertiary">
            Two files. Your AI tool. A working SMS feature.
          </p>
          <p className="mt-4 text-sm font-medium text-text-primary">
            $49 + $19/mo. Three days to live.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-3">
            {AI_TOOLS.map((tool) => (
              <Image
                key={tool.alt}
                src={tool.src}
                alt={tool.alt}
                width={140}
                height={24}
                className={`${tool.heightClass} w-auto brightness-0`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Section 2 — Configurator */}
      <ConfiguratorSection />

      {/* Section 3 — Build it */}
      <section className="mx-auto mt-24 max-w-5xl px-6">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Two files. Your AI tool.</h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-text-tertiary">
            Most of the integration is already done. The rest takes minutes.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 items-start gap-10 md:grid-cols-[11fr_9fr]">
          {/* Left col: Starting fresh + Already built stacked */}
          <div className="flex flex-col gap-8">
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
                Hand the build spec to your AI tool, point it at where you handle auth, and it
                does the wiring. Takes a little longer than starting fresh — well-trodden, docs
                cover the edges.
              </p>
            </div>
          </div>

          {/* Right col: code block + caption */}
          <div>
            <pre className="overflow-x-auto whitespace-pre rounded-lg bg-bg-secondary px-4 py-4 text-xs font-mono leading-relaxed text-text-secondary">
              {CODE_BLOCK}
            </pre>
            <p className="mt-2 text-xs text-text-tertiary">That&apos;s the send.</p>
          </div>
        </div>

        <p className="mt-10 max-w-2xl text-sm leading-relaxed text-text-tertiary">
          Your AI tool learns RelayKit through the build spec. Ask it where to wire opt-outs, or
          whether a message body will pass review — it&apos;ll know.
        </p>

        <p className="mt-6 text-sm text-text-tertiary">
          Tests are included. The build spec wires them in.
        </p>
      </section>

      {/* Section 4 — Test it for real */}
      <section className="mx-auto mt-24 max-w-5xl px-6">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Test it for real.</h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-text-tertiary">
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

      {/* Section 5 — Paperwork + Pricing (two-col merge) */}
      <section className="mx-auto mt-24 max-w-5xl px-6">
        <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-2">
          {/* Left col: paperwork */}
          <div>
            <h2 className="text-2xl font-bold text-text-primary">We handle the paperwork.</h2>
            <p className="mt-6 text-base leading-relaxed text-text-secondary">
              Registration paperwork. The approval back-and-forth. The opt-in form your users see.
              STOP handling. Opt-out tracking. Delivery monitoring.
            </p>
            <p className="mt-6 text-sm italic text-text-tertiary">
              We read it so you don&apos;t have to.
            </p>
          </div>

          {/* Right col: pricing */}
          <div>
            <h2 className="text-2xl font-bold text-text-primary">Simple pricing.</h2>

            <div className="mt-6 rounded-xl border border-border-primary p-8">
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
                <h3 className="mt-2 text-lg font-bold text-text-primary">
                  Go live for $49 + $19/mo
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-tertiary">
                  We file your registration with carriers. Approval takes about three days. 500
                  messages included per month. $8 per 500 over. Refund if you&apos;re not approved.
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs text-text-tertiary">
              Marketing categories add $10/mo. Volume pricing above 5,000 messages.
            </p>

            <p className="mt-3 text-sm text-text-tertiary">
              US and Canada at launch. We don&apos;t handle HIPAA, healthcare-regulated workflows,
              or enterprise procurement.
            </p>
          </div>
        </div>
      </section>

      {/* Section 6 — Closing CTA */}
      <section className="mx-auto mt-24 mb-24 max-w-5xl px-6">
        <h2 className="text-2xl font-bold text-text-primary">Ready when you are.</h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-text-tertiary">
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
