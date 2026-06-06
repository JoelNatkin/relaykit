import { Eyebrow } from "@/components/home/section-ui";

const TOOLS = ["Claude", "Cursor", "Windsurf", "Copilot", "Cline", "Codex"];

// REAL SDK signature (sdk/src/index.ts): `new RelayKit()` +
// `appointments.sendConfirmation(phone, { date, time })` — overrides the v10
// artifact's invented `import { relaykit }` form (plan risk #1, user-locked).
// Hand-tokenized with semantic tokens on the theme-invariant code surface; the
// code block stays inverted + monochrome (no gold) in both themes.
function CodeCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border-primary bg-bg-code-surface shadow-xl">
      <div className="flex gap-1.5 border-b border-white/5 px-4 py-3.5" aria-hidden>
        <span className="size-2.5 rounded-full bg-bg-tertiary" />
        <span className="size-2.5 rounded-full bg-bg-tertiary" />
        <span className="size-2.5 rounded-full bg-bg-tertiary" />
      </div>
      <pre className="overflow-x-auto whitespace-pre p-6 font-mono text-sm leading-relaxed text-text-white">
        <span className="text-fg-brand-secondary">import</span>
        {" { "}
        <span className="text-fg-warning-secondary">RelayKit</span>
        {" } "}
        <span className="text-fg-brand-secondary">from</span>{" "}
        <span className="text-fg-success-secondary">{"'relaykit'"}</span>
        {";\n\n"}
        <span className="text-fg-brand-secondary">const</span>
        {" relaykit = "}
        <span className="text-fg-brand-secondary">new</span>{" "}
        <span className="text-fg-warning-secondary">RelayKit</span>
        {"();\n\n"}
        <span className="text-fg-brand-secondary">await</span>
        {" relaykit.appointments."}
        <span className="text-fg-warning-secondary">sendConfirmation</span>
        {"(customer.phone, {\n  "}
        <span className="text-fg-warning-secondary">date</span>
        {": "}
        <span className="text-fg-success-secondary">{"'Fri, Jun 6'"}</span>
        {",\n  "}
        <span className="text-fg-warning-secondary">time</span>
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
      <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.05fr]">
        <div>
          <Eyebrow>Build</Eyebrow>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Give your AI tool a build spec, not a pile of docs.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            RelayKit generates implementation instructions for your AI tool.
            Messages, variables, event triggers, testing steps, and integration
            guidance arrive for smooth integration.
          </p>
          <div className="mt-7 flex flex-wrap gap-2">
            {TOOLS.map((tool) => (
              <span
                key={tool}
                className="rounded-full border border-border-secondary px-3.5 py-1.5 font-mono text-xs text-text-secondary"
              >
                {tool}
              </span>
            ))}
          </div>
          <p className="mt-5 text-sm text-text-tertiary">
            Slots into ShipFast, Supastarter, MakerKit, and Vercel + Supabase.
          </p>
        </div>
        <div>
          <CodeCard />
          <p className="mt-3.5 font-mono text-sm text-text-tertiary">
            That&apos;s the send.
          </p>
        </div>
      </div>
    </section>
  );
}
