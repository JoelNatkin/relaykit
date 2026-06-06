import Link from "next/link";
import { Eyebrow } from "@/components/home/section-ui";

// Progress fill widths track the four steps (25/50/75/100%), filled in gold
// (D-427 accent system).
type Step = {
  label: string;
  fill: string;
  title: string;
  body: string;
  link?: { href: string; text: string };
};

const STEPS: Step[] = [
  {
    label: "01 · PLAN",
    fill: "w-1/4",
    title: "Choose your messages",
    body: "Pick the messages your app needs from templates that already know the rules.",
    link: { href: "/messages", text: "Browse the messages →" },
  },
  {
    label: "02 · BUILD",
    fill: "w-1/2",
    title: "Hand off the spec",
    body: "Give the build spec to your AI tool and let it wire up the integration.",
  },
  {
    label: "03 · PROVE",
    fill: "w-3/4",
    title: "Test with real phones",
    body: "Run the full flow to your own phone and your team's before launch.",
  },
  {
    label: "04 · LAUNCH",
    fill: "w-full",
    title: "Go live",
    body: "RelayKit handles registration and delivery. A few days to approval.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how"
      className="mx-auto max-w-5xl border-t border-border-secondary px-6 py-20 sm:py-28"
    >
      <div className="max-w-2xl">
        <Eyebrow>How it works</Eyebrow>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          From idea to live SMS, in four steps.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-text-secondary">
          No telecom expertise required. The hard parts happen on our side.
        </p>
      </div>
      <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step) => (
          <div key={step.label} className="relative pt-6">
            <div className="absolute inset-x-0 top-0 h-0.5 bg-border-primary" aria-hidden>
              <div className={`h-full bg-bg-gold ${step.fill}`} />
            </div>
            <div className="font-mono text-xs tracking-[0.12em] text-text-tertiary">
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
                className="mt-3 inline-block text-sm text-text-secondary transition duration-100 ease-linear hover:text-text-primary"
              >
                {step.link.text}
              </Link>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
