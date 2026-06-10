"use client";

import { useEffect, useState } from "react";
import { X } from "@untitledui/icons";
import { Eyebrow } from "@/components/home/section-ui";
import { StepStrip, type Step } from "@/components/step-strip";

// Page-level orientation strip for /messages ONLY — deliberately not inside
// ConfiguratorSection (that component also renders in the home's clipped peek;
// this strip must not leak there). Renders the shared <StepStrip/> — the same
// canonical home How-it-works look (D-427 accent system). Dismissible,
// persisted to localStorage.

const DISMISS_KEY = "relaykit_quickstart_dismissed";

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
      <div className="relative rounded-[22px] border border-border-primary bg-surface-card p-7 pb-11 shadow-xl">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="absolute right-4 top-4 rounded-md p-1 text-text-tertiary transition duration-100 ease-linear hover:text-text-primary"
        >
          <X className="size-5" aria-hidden />
        </button>

        <Eyebrow>Quick Start</Eyebrow>
        <h2 className="mt-8 text-2xl font-bold tracking-tight text-text-primary">
          Build your message plan in three steps.
        </h2>

        <StepStrip steps={STEPS} className="mt-12" />
      </div>
    </section>
  );
}
