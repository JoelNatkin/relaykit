import type { ReactNode } from "react";

// Static before→after illustration (verbatim v10 copy). Variable tokens render
// NEUTRAL per the locked gold rule — never gilded.
function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded bg-bg-secondary px-1.5 py-0.5 font-mono text-[0.82rem] text-text-variable">
      {children}
    </span>
  );
}

function Strong({ children }: { children: ReactNode }) {
  return <b className="font-semibold text-text-primary">{children}</b>;
}

const SETS: { tmpl: ReactNode; prev: ReactNode }[] = [
  {
    tmpl: (
      <>
        Your appointment is confirmed for <Chip>{"{time}"}</Chip> on{" "}
        <Chip>{"{date}"}</Chip>.
      </>
    ),
    prev: (
      <>
        Your appointment is confirmed for <Strong>2:00 PM</Strong> on{" "}
        <Strong>Fri, Jun 6</Strong>.
      </>
    ),
  },
  {
    tmpl: (
      <>
        Order <Chip>{"{order}"}</Chip> shipped. Track it: <Chip>{"{link}"}</Chip>
      </>
    ),
    prev: (
      <>
        Order <Strong>#4821</Strong> shipped. Track it:{" "}
        <Strong>acme.co/t/4821</Strong>
      </>
    ),
  },
  {
    tmpl: (
      <>
        Hi <Chip>{"{name}"}</Chip>, your code is <Chip>{"{code}"}</Chip>. Expires
        in 10 min.
      </>
    ),
    prev: (
      <>
        Hi <Strong>Sarah</Strong>, your code is <Strong>482910</Strong>. Expires
        in 10 min.
      </>
    ),
  },
];

export function VariablesCallout() {
  return (
    <div className="mt-7 rounded-2xl border border-border-secondary bg-bg-primary p-7 dark:bg-bg-secondary">
      <div className="text-lg font-semibold text-text-primary">
        See exactly what customers will receive.
      </div>
      <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-text-secondary">
        Preview appointment times, order details, links, names, and other
        variables using realistic data — before you ever write code.
      </p>
      <div className="mt-4">
        {SETS.map((set, i) => (
          <div
            key={i}
            className="grid items-center gap-3 border-t border-dashed border-border-secondary py-4 md:grid-cols-[1fr_2rem_1fr]"
          >
            <div className="rounded-2xl rounded-bl-sm border border-border-secondary bg-bg-secondary px-3.5 py-3 font-mono text-sm leading-relaxed text-text-secondary">
              {set.tmpl}
            </div>
            <div className="text-center text-text-tertiary max-md:rotate-90 max-md:justify-self-start" aria-hidden>
              →
            </div>
            <div className="rounded-2xl rounded-br-sm border border-border-secondary bg-bg-secondary px-3.5 py-3 text-sm leading-relaxed text-text-secondary">
              {set.prev}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
