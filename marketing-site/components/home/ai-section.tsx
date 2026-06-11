import Image from "next/image";
import { Eyebrow } from "@/components/home/section-ui";

// AI-tool wordmark logos with dark/light asset swap (restored from the prior
// home). negSrc = the dark-mode wordmark; when null, a brightness-0/dark:invert
// filter approximates it. Per-logo heightClass tunes optical weight.
const AI_TOOLS = [
  { src: "/logos/tool_logos_wordmarks/claude_pos.svg", negSrc: null, alt: "Claude Code", heightClass: "h-[16px]" },
  { src: "/logos/tool_logos_wordmarks/Cursor_pos.svg", negSrc: "/logos/tool_logos_wordmarks/Cursor_neg.svg", alt: "Cursor", heightClass: "h-[22px]" },
  { src: "/logos/tool_logos_wordmarks/windsurf_pos.svg", negSrc: "/logos/tool_logos_wordmarks/windsurf_neg.svg", alt: "Windsurf", heightClass: "h-[14px]" },
  { src: "/logos/tool_logos_wordmarks/Copilot_pos.svg", negSrc: null, alt: "GitHub Copilot", heightClass: "h-[20px]" },
  { src: "/logos/tool_logos_wordmarks/Cline_pos.svg", negSrc: "/logos/tool_logos_wordmarks/Cline_neg.svg", alt: "Cline", heightClass: "h-[18px]" },
  { src: "/logos/tool_logos_wordmarks/codex_pos.svg", negSrc: "/logos/tool_logos_wordmarks/codex_neg.svg", alt: "Codex", heightClass: "h-[22px]" },
] as const;

// REAL SDK signature (sdk/src/index.ts): `new RelayKit()` +
// `appointments.sendConfirmation(phone, { date, time })` — overrides the v10
// artifact's invented `import { relaykit }` form (plan risk #1, user-locked).
// Hand-tokenized with semantic tokens on the theme-invariant code surface; the
// code block stays inverted + monochrome (no gold) in both themes.
function CodeCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border-secondary bg-surface-card shadow-xl">
      <div className="flex gap-1.5 border-b border-white/5 px-4 py-3.5" aria-hidden>
        <span className="size-2.5 rounded-full bg-bg-tertiary" />
        <span className="size-2.5 rounded-full bg-bg-tertiary" />
        <span className="size-2.5 rounded-full bg-bg-tertiary" />
      </div>
      <pre className="overflow-x-auto whitespace-pre p-6 font-mono text-sm leading-relaxed text-text-white">
        <span className="text-fg-brand-secondary">import</span>
        {" { "}
        <span className="text-gold">RelayKit</span>
        {" } "}
        <span className="text-fg-brand-secondary">from</span>{" "}
        <span className="text-fg-success-secondary">{"'relaykit'"}</span>
        {";\n\n"}
        <span className="text-fg-brand-secondary">const</span>
        {" relaykit = "}
        <span className="text-fg-brand-secondary">new</span>{" "}
        <span className="text-gold">RelayKit</span>
        {"();\n\n"}
        <span className="text-fg-brand-secondary">await</span>
        {" relaykit.appointments."}
        <span className="text-gold">sendConfirmation</span>
        {"(customer.phone, {\n  "}
        <span className="text-gold">date</span>
        {": "}
        <span className="text-fg-success-secondary">{"'Fri, Jun 6'"}</span>
        {",\n  "}
        <span className="text-gold">time</span>
        {": "}
        <span className="text-fg-success-secondary">{"'2:00 PM'"}</span>
        {",\n});"}
      </pre>
    </div>
  );
}

export function AiSection() {
  return (
    <section
      id="build"
      className="mx-auto max-w-5xl border-t border-border-secondary px-6 py-20 sm:py-28"
    >
      <Eyebrow>Build</Eyebrow>
      <div className="mt-8 grid items-start gap-14 md:mt-10 lg:grid-cols-2">
        {/* min-w-0 lets the columns shrink below their content width so the
            code block's overflow-x-auto scrolls internally instead of forcing
            horizontal page overflow on mobile (grid items default to min-w:auto). */}
        <div className="min-w-0">
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Give your AI tool a build spec, not a pile of docs.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            RelayKit generates implementation instructions for your AI tool.
            Messages, variables, event triggers, testing steps, and integration
            guidance arrive for smooth integration.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-3">
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
              ),
            )}
          </div>
          <p className="mt-5 text-sm text-text-tertiary">
            Slots into ShipFast, Supastarter, MakerKit, and Vercel + Supabase.
          </p>
        </div>
        <div className="min-w-0">
          <CodeCard />
          <p className="mt-3.5 font-mono text-sm text-text-tertiary">
            That&apos;s the send.
          </p>
        </div>
      </div>
    </section>
  );
}
