import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { MessageTextSquare01, FileCode02, Key01 } from "@untitledui/icons";

const STEPS = [
  {
    icon: MessageTextSquare01,
    title: "Choose what your app sends",
    description:
      "Pick your use case, browse compliant message templates, toggle what you need, edit the wording. You're designing your SMS feature — we handle the compliance boundaries.",
  },
  {
    icon: FileCode02,
    title: "Generate your build spec",
    description:
      'One click creates a markdown file your AI coding tool reads to build your entire SMS integration. Drop it in your project and tell your AI: "Read SMS_BUILD_SPEC.md and build my SMS feature."',
  },
  {
    icon: Key01,
    title: "Go live with one key swap",
    description:
      "Register when you're ready. Same API, same code. Swap your sandbox key for your live key. Your app sends real texts.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-t border-secondary bg-primary px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-display-xs font-semibold text-primary sm:text-display-sm">
          Pick your messages. Generate a spec. Ship it.
        </h2>
        <div className="mt-12 grid gap-10 sm:mt-16 sm:grid-cols-3 sm:gap-8">
          {STEPS.map((step, i) => (
            <div key={i} className="text-center sm:text-left">
              <div className="flex justify-center sm:justify-start">
                <FeaturedIcon
                  icon={step.icon}
                  color="brand"
                  theme="light"
                  size="lg"
                />
              </div>
              <p className="mt-4 text-sm font-semibold text-brand-secondary">
                Step {i + 1}
              </p>
              <h3 className="mt-1 text-lg font-semibold text-primary">
                {step.title}
              </h3>
              <p className="mt-2 text-md text-tertiary">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
