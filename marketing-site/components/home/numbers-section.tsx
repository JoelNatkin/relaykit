import { Eyebrow } from "@/components/home/section-ui";

// "The numbers" — a presentational, STATIC email-vs-SMS stat block. Ported from
// the dev-tools landing mockup's "The numbers" section and genericized for any
// app's messages. Every stat is real and sourced (see the footnote); bar colors
// use the semantic success/error tokens (green = the stronger channel on a
// metric, red = the weaker), and bar LENGTH encodes favorable performance — the
// better channel always gets the longer bar (so email's slow time-to-open is a
// short red bar, not a long one).

type Row = {
  channel: string;
  value: string;
  // Bar fill width as a percentage of favorable performance (longer = better),
  // not the literal value magnitude.
  fill: number;
  // The stronger channel on this metric (green + emphasized) vs the weaker (red).
  strong: boolean;
};

type StatCard = { label: string; rows: [Row, Row] };

const STATS: StatCard[] = [
  {
    label: "Gets opened",
    rows: [
      { channel: "Text message", value: "98%", fill: 100, strong: true },
      { channel: "Email", value: "~20%", fill: 20, strong: false },
    ],
  },
  {
    label: "Time to first open",
    rows: [
      { channel: "Text message", value: "~90 sec", fill: 100, strong: true },
      { channel: "Email", value: "~90 min", fill: 12, strong: false },
    ],
  },
  {
    label: "Gets a reply",
    rows: [
      { channel: "Text message", value: "~45%", fill: 100, strong: true },
      { channel: "Email", value: "~6%", fill: 13, strong: false },
    ],
  },
  {
    label: "Gets through",
    rows: [
      { channel: "Text message", value: "~98%", fill: 98, strong: true },
      { channel: "Email", value: "~84%", fill: 84, strong: false },
    ],
  },
];

function StatRow({ channel, value, fill, strong }: Row) {
  return (
    <div className="mt-[18px] first:mt-0">
      <div className="mb-[9px] flex items-baseline justify-between gap-3">
        <span
          className={`text-[12px] font-semibold ${
            strong ? "text-text-primary" : "text-text-tertiary"
          }`}
        >
          {channel}
        </span>
        <span
          className={`font-bold leading-none tabular-nums ${
            strong
              ? "text-2xl text-text-primary"
              : "text-[19px] text-text-tertiary"
          }`}
        >
          {value}
        </span>
      </div>
      <div
        aria-hidden
        className="h-[7px] overflow-hidden rounded-full bg-white/[0.06]"
      >
        <div
          className={`h-full min-w-[5px] rounded-full ${
            strong ? "bg-fg-success-primary" : "bg-fg-error-primary"
          }`}
          style={{ width: `${fill}%` }}
        />
      </div>
    </div>
  );
}

export function NumbersSection() {
  return (
    <section
      id="numbers"
      className="mx-auto max-w-5xl border-t border-border-secondary px-6 py-20 sm:py-28"
    >
      <div className="max-w-2xl">
        <Eyebrow>The numbers</Eyebrow>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          When a message can&apos;t wait, send a text.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-text-secondary">
          The messages an app sends — login codes, order updates, reminders —
          only do their job when someone sees them. Here&apos;s how text and
          email compare.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
        {STATS.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-border-secondary bg-surface-inset p-5"
          >
            <div className="mb-[22px] text-[17px] font-semibold text-text-primary">
              {card.label}
            </div>
            {card.rows.map((row) => (
              <StatRow key={row.channel} {...row} />
            ))}
          </div>
        ))}
      </div>

      <p className="mt-[18px] text-[12.5px] leading-relaxed text-fg-quaternary">
        Industry SMS-vs-email benchmarks, 2025–26 — open and response from
        SMS-marketing aggregates; email inbox placement from Validity&apos;s 2025
        deliverability report. SMS open is inferred from delivery, not
        pixel-tracked; reported email open rates are distorted by tracking-pixel
        prefetch and blocking.
      </p>
    </section>
  );
}
