import Link from "next/link";

// Shared step strip — the canonical HOME how-it-works look (progress line on
// top, mono label, title, body, optional gold link). Used by both the home
// How-it-works section and the /messages quick-start card so the two render
// identically. Progress fills are gold per the D-427 accent system. Server
// component (no client state); callers own any surrounding chrome.
export type Step = {
  label: string;
  fill: string;
  title: string;
  body: string;
  link?: { href: string; text: string };
};

export function StepStrip({
  steps,
  className,
}: {
  steps: Step[];
  className?: string;
}) {
  return (
    <div
      className={`grid grid-cols-1 gap-x-[60px] gap-y-[60px] md:grid-cols-3${
        className ? ` ${className}` : ""
      }`}
    >
      {steps.map((step) => (
        <div key={step.label} className="relative pt-6">
          <div
            className="absolute inset-x-0 top-0 h-0.5 bg-border-primary"
            aria-hidden
          >
            <div className={`h-full bg-bg-gold ${step.fill}`} />
          </div>
          <div className="font-mono text-xs uppercase tracking-[0.12em] text-text-tertiary">
            {step.label}
          </div>
          <h3 className="mt-4 text-lg font-semibold text-text-primary">
            {step.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">
            {step.body}
          </p>
          {step.link ? (
            <Link
              href={step.link.href}
              className="mt-3 inline-block text-sm font-medium text-gold transition duration-100 ease-linear hover:opacity-90"
            >
              {step.link.text}
            </Link>
          ) : null}
        </div>
      ))}
    </div>
  );
}
