"use client";

import { useEffect, useState } from "react";
import { X } from "@untitledui/icons";
import { Eyebrow } from "@/components/home/section-ui";

// Page-level orientation strip for /messages ONLY — deliberately not inside
// ConfiguratorSection (that component also renders in the home's clipped peek;
// this strip must not leak there). Reuses How-it-works' exact visual language:
// the same gold cumulative progress bar + mono-label / title / body step markup
// (D-427 accent system). Dismissible, persisted to localStorage.

const DISMISS_KEY = "relaykit_quickstart_dismissed";

// Cumulative fills (thirds: 1/3, 2/3, full) — same pattern as the home steps.
type Step = { label: string; fill: string; title: string; body: string };

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
  // null until mounted → render nothing on the server and on the first client
  // paint (no SSR/client mismatch); the real visibility resolves in the effect.
  const [visible, setVisible] = useState<boolean | null>(null);

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(DISMISS_KEY) === "true";
    } catch {
      // localStorage blocked (private mode / hardened browser) — show the strip.
      dismissed = false;
    }
    setVisible(!dismissed);
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, "true");
    } catch {
      // Best-effort persistence; ignore storage failures.
    }
  };

  return (
    <section className="mx-auto mt-10 max-w-5xl px-6">
      <div className="relative rounded-[22px] border border-border-primary bg-surface-card p-7 shadow-xl">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="absolute right-4 top-4 rounded-md p-1 text-text-tertiary transition duration-100 ease-linear hover:text-text-primary"
        >
          <X className="size-5" aria-hidden />
        </button>

        <Eyebrow>Quick start</Eyebrow>
        <h2 className="mt-6 text-2xl font-bold tracking-tight text-text-primary">
          Build your message plan in three steps.
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-[52px] md:grid-cols-3 md:gap-y-9">
          {STEPS.map((step) => (
            <div key={step.label}>
              <div className="font-mono text-xs tracking-[0.12em] text-text-tertiary">
                {step.label}
              </div>
              <div className="mt-3 h-0.5 w-full bg-border-primary" aria-hidden>
                <div className={`h-full bg-bg-gold ${step.fill}`} />
              </div>
              <h3 className="mt-3 text-lg font-semibold text-text-primary">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
