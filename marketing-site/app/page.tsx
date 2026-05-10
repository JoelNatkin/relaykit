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
//
// negSrc points to the dark-mode wordmark asset. When present, render
// dual Image elements with a block dark:hidden / hidden dark:block swap.
// When null, fall back to a CSS filter-invert workaround on the _pos asset.
// TODO(Joel): source claude_neg.svg and Copilot_neg.svg so all five logos
// can use the dual-Image swap and drop the filter workaround.
const AI_TOOLS = [
  { src: "/logos/tool_logos_wordmarks/claude_pos.svg", negSrc: null, alt: "Claude Code", heightClass: "h-[18px]" },
  { src: "/logos/tool_logos_wordmarks/Cursor_pos.svg", negSrc: "/logos/tool_logos_wordmarks/Cursor_neg.svg", alt: "Cursor", heightClass: "h-[22px]" },
  { src: "/logos/tool_logos_wordmarks/windsurf_pos.svg", negSrc: "/logos/tool_logos_wordmarks/windsurf_neg.svg", alt: "Windsurf", heightClass: "h-[44px]" },
  { src: "/logos/tool_logos_wordmarks/Copilot_pos.svg", negSrc: null, alt: "GitHub Copilot", heightClass: "h-[20px]" },
  { src: "/logos/tool_logos_wordmarks/Cline_pos.svg", negSrc: "/logos/tool_logos_wordmarks/Cline_neg.svg", alt: "Cline", heightClass: "h-[18px]" },
] as const;

// Hand-tokenized code sample with semantic-token-based syntax highlighting.
// Untitled UI tokens used for the categories that map cleanly onto code:
//   keywords  -> text-fg-brand-secondary (brand purple)
//   strings   -> text-fg-success-secondary (success green)
//   names     -> text-fg-warning-secondary (warning amber, used for both
//                identifiers and object keys)
// Default text on the dark bg uses text-text-white.
function CodeSample() {
  return (
    <pre className="overflow-x-auto whitespace-pre rounded-xl bg-bg-primary-solid px-6 py-6 text-sm font-mono leading-relaxed text-text-white">
      <span className="text-fg-brand-secondary">import</span>
      {" { relaykit } "}
      <span className="text-fg-brand-secondary">from</span>
      {" "}
      <span className="text-fg-success-secondary">{"'relaykit'"}</span>
      {";\n\n"}
      <span className="text-fg-brand-secondary">await</span>
      {" relaykit.appointments."}
      <span className="text-fg-warning-secondary">sendConfirmation</span>
      {"({\n  "}
      <span className="text-fg-warning-secondary">to</span>
      {": customer.phone,\n  "}
      <span className="text-fg-warning-secondary">appointment</span>
      {": { "}
      <span className="text-fg-warning-secondary">time</span>
      {": "}
      <span className="text-fg-success-secondary">{"'2:00 PM Friday'"}</span>
      {" }\n});"}
    </pre>
  );
}

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
            {AI_TOOLS.map((tool) =>
              tool.negSrc ? (
                <span key={tool.alt} className="contents">
                  <Image
                    src={tool.src}
                    alt={tool.alt}
                    width={140}
                    height={24}
                    className={`${tool.heightClass} w-auto brightness-0 dark:hidden`}
                  />
                  <Image
                    src={tool.negSrc}
                    alt=""
                    aria-hidden
                    width={140}
                    height={24}
                    className={`${tool.heightClass} hidden w-auto dark:inline-block`}
                  />
                </span>
              ) : (
                <Image
                  key={tool.alt}
                  src={tool.src}
                  alt={tool.alt}
                  width={140}
                  height={24}
                  className={`${tool.heightClass} w-auto brightness-0 dark:invert`}
                />
              )
            )}
          </div>
        </div>
      </div>

      {/* Section 2 — Configurator */}
      <ConfiguratorSection />

      {/* Section 3 — Build it */}
      <section className="mx-auto mt-[100px] max-w-5xl px-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-primary">
          Configure &gt; Build
        </p>
        <h2 className="mt-2 text-2xl font-bold text-text-primary">Two files. Your AI tool.</h2>

        <div className="mt-10 grid grid-cols-1 items-start gap-12 md:grid-cols-2">
          <div className="flex flex-col gap-5">
            <p className="text-base leading-relaxed text-text-secondary">
              Starting fresh. RelayKit slots into the starter kits you use — ShipFast,
              Supastarter, MakerKit, Vercel + Supabase.
            </p>
            <p className="text-base leading-relaxed text-text-secondary">
              Already built. Hand the build spec to your AI tool, point it at where you handle
              auth, and let it wire up the rest.
            </p>
          </div>

          <div>
            <CodeSample />
            <p className="mt-2 text-xs text-text-tertiary">That&apos;s the send.</p>
          </div>
        </div>
      </section>

      {/* Section 4 — Test it for real */}
      <section className="mx-auto mt-[100px] max-w-5xl px-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-primary">
          Build &gt; Test
        </p>
        <h2 className="mt-2 text-2xl font-bold text-text-primary">
          Real SMS, before customers see anything.
        </h2>

        <div className="mt-10 grid grid-cols-1 items-start gap-12 md:grid-cols-2">
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-base font-bold text-text-primary">Preview list</h3>
              <p className="mt-2 text-base leading-relaxed text-text-secondary">
                Add yourself, your team, your beta testers. Each person verifies once. After that,
                your app&apos;s SMS features work for them the way they will for customers.
              </p>
            </div>
            <div>
              <h3 className="text-base font-bold text-text-primary">Testing utilities</h3>
              <p className="mt-2 text-base leading-relaxed text-text-secondary">
                Your AI tool also sets up testing tools in your app. Trigger an OTP, fire a
                reminder, queue a message — from your editor.
              </p>
            </div>
          </div>
          <PreviewListMock />
        </div>
      </section>

      {/* Section 5 — Pricing + Paperwork (two-col merge) */}
      <section className="mx-auto mt-[100px] max-w-5xl px-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-primary">
          Test &gt; Go live
        </p>
        <div className="mt-2 grid grid-cols-1 items-start gap-12 md:grid-cols-2">
          {/* Left col: pricing */}
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

          {/* Right col: paperwork */}
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
        </div>
      </section>

      {/* Section 6 — Closing CTA */}
      <section className="mx-auto mt-[100px] mb-[100px] max-w-5xl px-6">
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
