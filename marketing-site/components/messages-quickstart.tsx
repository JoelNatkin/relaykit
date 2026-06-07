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

// Cumulative fills (25/50/75/100%) — same pattern as the home steps.
type Step = { label: string; fill: string; title: string; body: string };

const STEPS: Step[] = [
  {
    label: "01 · Details",
    fill: "w-1/4",
    title: "Add your business",
    body: "Your business name and industry, so the templates read like your app.",
  },
  {
    label: "02 · Select",
    fill: "w-1/2",
    title: "Pick your messages",
    body: "Choose the categories and the individual messages your app sends.",
  },
  {
    label: "03 · Personalize",
    fill: "w-3/4",
    title: "Add your data",
    body: "Open Variables to fill in your own values and adjust the wording.",
  },
  {
    label: "04 · Edit",
    fill: "w-full",
    title: "Make it yours",
    body: "Edit any message or add your own, then copy them into your code.",
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
      <div className="relative rounded-2xl border border-border-secondary p-7">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="absolute right-4 top-4 rounded-md p-1 text-text-tertiary transition duration-100 ease-linear hover:text-text-primary"
        >
          <X className="size-5" aria-hidden />
        </button>

        <Eyebrow>Quick start</Eyebrow>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-text-primary">
          Build your message plan in four steps.
        </h2>

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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
