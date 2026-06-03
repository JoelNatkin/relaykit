import Image from "next/image";
import { BottomEmailCapture } from "@/components/bottom-email-capture";
import { ConfiguratorSection } from "@/components/configurator-section";
import { PreviewListMock } from "@/components/preview-list-mock";

// Per-logo heights tune visual weight, not pixel height: icon-plus-wordmark
// logos (Cursor, Copilot, Codex) render taller at a given pixel height than
// pure wordmarks because the icon glyph takes vertical room. The flex row
// uses items-center, so different cell heights center cleanly.
//
// negSrc points to the dark-mode wordmark asset. When present, render
// dual Image elements with a block dark:hidden / hidden dark:block swap.
// When null, fall back to a CSS filter-invert workaround on the _pos asset.
// TODO(Joel): source claude_neg.svg and Copilot_neg.svg so all five logos
// can use the dual-Image swap and drop the filter workaround.
const AI_TOOLS = [
  { src: "/logos/tool_logos_wordmarks/claude_pos.svg", negSrc: null, alt: "Claude Code", heightClass: "h-[16px]" },
  { src: "/logos/tool_logos_wordmarks/Cursor_pos.svg", negSrc: "/logos/tool_logos_wordmarks/Cursor_neg.svg", alt: "Cursor", heightClass: "h-[22px]" },
  { src: "/logos/tool_logos_wordmarks/windsurf_pos.svg", negSrc: "/logos/tool_logos_wordmarks/windsurf_neg.svg", alt: "Windsurf", heightClass: "h-[14px]" },
  { src: "/logos/tool_logos_wordmarks/Copilot_pos.svg", negSrc: null, alt: "GitHub Copilot", heightClass: "h-[20px]" },
  { src: "/logos/tool_logos_wordmarks/Cline_pos.svg", negSrc: "/logos/tool_logos_wordmarks/Cline_neg.svg", alt: "Cline", heightClass: "h-[18px]" },
  { src: "/logos/tool_logos_wordmarks/codex_pos.svg", negSrc: "/logos/tool_logos_wordmarks/codex_neg.svg", alt: "Codex", heightClass: "h-[22px]" },
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
    <pre className="overflow-x-auto whitespace-pre rounded-xl border border-border-secondary bg-bg-code-surface px-6 py-6 text-sm font-mono leading-relaxed text-text-white">
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
            SMS for your app,
            <br />
            minus the rulebook.
          </h1>
          <p className="mt-4 max-w-2xl md:max-w-xl text-lg text-text-tertiary">
            Use these messages anywhere today. Send them through RelayKit Summer
            2026.
          </p>
          <a
            href="#sending"
            className="mt-4 inline-flex items-center gap-1 text-lg font-medium text-text-secondary transition duration-100 ease-linear hover:text-text-primary"
          >
            See how sending works ↓
          </a>
        </div>
      </div>

      {/* Section 2 — Configurator */}
      <ConfiguratorSection />

      {/* "Shipping Summer 2026" — heads the post-launch detail below the configurator */}
      <div id="sending" className="mx-auto mt-[100px] max-w-5xl px-6 scroll-mt-20">
        <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          Shipping Summer 2026
        </h1>
      </div>

      {/* Section 3 — Build it */}
      <section className="mx-auto mt-12 max-w-5xl px-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-primary">
          Configure &gt; Build
        </p>
        <h2 className="mt-2 text-2xl font-bold text-text-primary">Hand it to your AI tool.</h2>

        {/* AI-tool logo row — sits under the "Hand it to your AI tool." heading,
            where the tools it names belong (rather than in the hero). */}
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

        <div className="mt-10 grid grid-cols-1 items-start gap-12 md:grid-cols-2">
          <div className="flex flex-col gap-5">
            <p className="text-base leading-relaxed text-text-secondary">
              <strong className="font-bold text-text-primary">Starting fresh.</strong> RelayKit slots into the starter kits you use — ShipFast,
              Supastarter, MakerKit, Vercel + Supabase.
            </p>
            <p className="text-base leading-relaxed text-text-secondary">
              <strong className="font-bold text-text-primary">Already built.</strong> Hand our build spec to your AI tool and let it wire up the rest.
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
          Real texts to your phone, before you go live.
        </h2>

        <div className="mt-10 grid grid-cols-1 items-start gap-12 md:grid-cols-2">
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-base font-bold text-text-primary">Your circle of test phones.</h3>
              <p className="mt-2 text-base leading-relaxed text-text-secondary">
                Add yourself, your team, your beta testers. Each person verifies once. After that,
                your app&apos;s SMS features work for them the way they will for customers.
              </p>
            </div>
            <div>
              <p className="text-base font-semibold text-text-primary">
                A test page, built into your app.
              </p>
              <p className="mt-1 text-base leading-relaxed text-text-secondary">
                Trigger your real flows — a booking, an OTP, a reminder — and
                watch the whole loop resolve: sent, delivered, your database
                updated.
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

            <div className="mt-6 rounded-xl border border-border-secondary p-8 dark:bg-bg-secondary">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
                  Stage 1
                </p>
                <h3 className="mt-2 text-lg font-bold text-text-primary">Build for free</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-tertiary">
                  Set up your messages. Add the code to your app. Test with real phones. No credit card.
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
                  messages included per month. $8 per additional 500. Refund if you&apos;re not approved.
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-text-tertiary">
              Marketing category messages, add $10/mo. Volume pricing above 5,000
              messages. US and Canada at launch. We don&apos;t handle HIPAA,
              healthcare-regulated workflows, or enterprise procurement.
            </p>
          </div>

          {/* Right col: paperwork */}
          <div>
            <h2 className="text-2xl font-bold text-text-primary">We know the rules so you don&apos;t have to.</h2>
            <p className="mt-6 text-base leading-relaxed text-text-secondary">
              There&apos;s a thick stack of carrier regulation behind every text message — who you have to register with, what you&apos;re allowed to say, how fast you can send, what happens when someone replies STOP. We&apos;ve read all of it. You get clean code that drops into your app.
            </p>
          </div>
        </div>
      </section>

      {/* Section 6 — Closing CTA (two-column; left holds the block, right empty) */}
      <section className="mx-auto mt-[100px] mb-[100px] max-w-5xl px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* Left column */}
          <div>
            <h2 className="text-2xl font-bold text-text-primary">
              Join the list.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-text-tertiary">
              RelayKit adds SMS to the stack you&apos;re already building on.
              Summer 2026 is the target. I&apos;ll email you when it&apos;s live.
            </p>
            <p className="mt-2 text-base text-text-tertiary">
              — Joel, solo founder
            </p>
            <BottomEmailCapture />
          </div>
          {/* Right column — reserved */}
          <div />
        </div>
      </section>
    </div>
  );
}
