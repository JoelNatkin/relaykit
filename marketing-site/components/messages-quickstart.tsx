import { Eyebrow } from "@/components/home/section-ui";
import { StepStrip, type Step } from "@/components/step-strip";

// Permanent orientation section for /messages ONLY — deliberately not inside
// ConfiguratorSection (that component also renders in the home's clipped peek;
// this section must not leak there). Mirrors the home How-it-works section
// exactly (max-w-5xl, hairline borders, max-w-2xl heading, shared <StepStrip/>),
// minus the intro paragraph. Static server component — no dismiss/state.

// Cumulative fills (thirds: 1/3, 2/3, full) — same pattern as the home steps.
const STEPS: Step[] = [
  {
    label: "01 · Details",
    fill: "w-1/3",
    title: "Add your business",
    body: "Your business name and industry, so the templates read like your app.",
  },
  {
    label: "02 · Select",
    fill: "w-2/3",
    title: "Pick your messages",
    body: "Choose the categories and the individual messages your app sends.",
  },
  {
    label: "03 · Personalize",
    fill: "w-full",
    title: "Make it yours",
    body: "Fill in your own variables, tweak the wording, then copy it into your code.",
  },
];

export function MessagesQuickstart() {
  return (
    <section className="mx-auto mt-20 max-w-5xl border-t border-b border-border-secondary px-6 py-20">
      <div className="max-w-2xl">
        <Eyebrow>Quick Start</Eyebrow>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          Build your message plan in three steps.
        </h2>
      </div>
      <StepStrip steps={STEPS} className="mt-14" variant="card" />
    </section>
  );
}
