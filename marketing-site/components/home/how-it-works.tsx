import { Eyebrow } from "@/components/home/section-ui";
import { StepStrip, type Step } from "@/components/step-strip";

// Progress fill widths track the three steps (1/3, 2/3, full), filled in gold
// (D-427 accent system).
const STEPS: Step[] = [
  {
    label: "01 · PLAN",
    fill: "w-1/3",
    title: "Choose your messages",
    body: "Pick the messages your app needs from templates that already know the rules.",
    link: { href: "/messages", text: "Browse the messages →" },
  },
  {
    label: "02 · BUILD",
    fill: "w-2/3",
    title: "Build and test",
    body: "Hand the spec to your AI tool, then test the full flow on real phones before launch.",
  },
  {
    label: "03 · LAUNCH",
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
          What it takes to go live.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-text-secondary">
          No telecom expertise required. We handle the carrier side.
        </p>
      </div>
      <StepStrip steps={STEPS} className="mt-14" />
    </section>
  );
}
