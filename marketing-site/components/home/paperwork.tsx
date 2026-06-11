import { FileCheck02, ShieldTick, SlashCircle01 } from "@untitledui/icons";
import type { FC } from "react";
import { Eyebrow } from "@/components/home/section-ui";

// Featured-icon backgrounds are a gold tint (D-427 accent system).
const CARDS: { Icon: FC<{ className?: string }>; title: string; body: string }[] =
  [
    {
      Icon: FileCheck02,
      title: "Registration handled",
      body: "We file your brand and message registration with the carriers and walk it through approval. You stay in your editor.",
    },
    {
      Icon: ShieldTick,
      title: "Messages compliant",
      body: "Templates and custom messages are checked against what carriers allow, not just passed through.",
    },
    {
      Icon: SlashCircle01,
      title: "Opt-ins & opt-outs covered",
      body: "When someone replies STOP, we stop. Consent is tracked and enforced at delivery — not something you wire up yourself.",
    },
  ];

export function Paperwork() {
  return (
    <section
      id="rules"
      className="mx-auto max-w-5xl border-t border-border-secondary px-6 py-20 sm:py-28"
    >
      <div className="max-w-2xl">
        <Eyebrow>The paperwork</Eyebrow>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          You build the feature. We handle the bureaucracy.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-text-secondary">
          Every text message carries a stack of carrier rules. We&apos;ve read
          all of it, so you don&apos;t have to.
        </p>
      </div>
      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
        {CARDS.map(({ Icon, title, body }) => (
          <div
            key={title}
            className="rounded-2xl border border-border-secondary bg-surface-card p-6 transition duration-150 ease-linear hover:-translate-y-0.5 hover:border-border-primary"
          >
            <div className="mb-4 grid size-8 place-items-center rounded-lg bg-bg-gold/15 text-gold">
              <Icon className="size-4" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-text-primary">
              {title}
            </h3>
            <p className="text-sm leading-relaxed text-text-secondary">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
