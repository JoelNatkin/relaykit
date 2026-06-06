"use client";

import { useState } from "react";
import Link from "next/link";
import { CATEGORIES, flattenBody } from "@/lib/message-library";
import type { VariantTone } from "@/lib/message-library";
import { MessageReadCard } from "@/components/configurator/message-read-card";
import {
  PAGE_TONES,
  tonePillClasses,
  effectiveBody,
} from "@/components/configurator/tone-pill";
import { Eyebrow } from "@/components/home/section-ui";

// The peek renders the canonical Appointments corpus through the canonical
// MessageReadCard + tone-pill (D-379/D-381 — one source, no drift). It is a
// preview, not the full tool: tone + Copy are live, but no editing, elig,
// persistence, custom messages, or business-name input. businessName="" makes
// identity tokens resolve to corpus example values, so no SessionProvider is
// needed (and the visible data never contradicts the cards).
const CATEGORY = CATEGORIES.find((c) => c.id === "appointments");

function StripCheckbox({ active }: { active: boolean }) {
  return (
    <span
      className={`mt-0.5 grid size-[17px] flex-none place-items-center rounded border ${
        active
          ? "border-border-gold bg-bg-gold text-text-on-gold"
          : "border-border-primary"
      }`}
      aria-hidden
    >
      {active ? (
        <svg viewBox="0 0 24 24" fill="none" className="size-3">
          <path
            d="M20 6 9 17l-5-5"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
    </span>
  );
}

export function ConfiguratorPeek() {
  const [tone, setTone] = useState<VariantTone>("Standard");
  const [copied, setCopied] = useState(false);

  if (!CATEGORY) return null;
  const messages = CATEGORY.messages.slice(0, 2);

  function handleCopy() {
    if (!CATEGORY) return;
    const text = messages
      .map((m) =>
        flattenBody(effectiveBody(m, undefined, undefined, tone), CATEGORY.variables, {
          businessName: "",
        }),
      )
      .join("\n\n");
    void navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-xl">
          <Eyebrow>The configurator · live today</Eyebrow>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Start with a complete message plan.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            RelayKit generates the messages most apps need, customized for your
            industry and use case.
          </p>
        </div>
        {/* Gold text affordance — D-427 site 2 (the only gold text link). */}
        <Link
          href="/messages"
          className="text-sm font-medium text-gold transition duration-100 ease-linear hover:opacity-90"
        >
          Open the configurator <span aria-hidden>→</span>
        </Link>
      </div>

      <div className="mt-11 grid overflow-hidden rounded-2xl border border-border-primary bg-bg-primary shadow-xl md:grid-cols-[244px_1fr] dark:bg-bg-secondary">
        {/* Category strip — the real corpus (CATEGORIES); Appointments active. */}
        <div className="flex gap-2 overflow-x-auto border-b border-border-secondary bg-bg-primary p-3 md:flex-col md:gap-1 md:overflow-visible md:border-r md:border-b-0 dark:bg-bg-primary">
          {CATEGORIES.map((cat) => {
            const active = cat.id === CATEGORY.id;
            return (
              <div
                key={cat.id}
                className={`flex flex-none items-start gap-2.5 rounded-lg px-2.5 py-2.5 md:flex-auto ${
                  active ? "bg-bg-secondary" : ""
                }`}
              >
                <StripCheckbox active={active} />
                <div>
                  <div className="text-sm font-medium text-text-primary">
                    {cat.name}
                  </div>
                  <div className="mt-0.5 hidden text-xs text-text-tertiary md:block">
                    {cat.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Edit panel */}
        <div className="p-5">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="rounded-lg border border-border-secondary bg-bg-primary px-3 py-2 text-sm text-text-secondary dark:bg-bg-primary">
              {CATEGORY.name}
            </span>
            <div className="ml-auto flex gap-1.5">
              {PAGE_TONES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTone(t)}
                  className={tonePillClasses(tone === t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {messages.map((m) => (
              <MessageReadCard
                key={m.id}
                name={m.name}
                tooltip={m.tooltip}
                body={effectiveBody(m, undefined, undefined, tone)}
                variables={CATEGORY.variables}
                categoryVariables={{}}
                businessName=""
                requiresStop={false}
                onEdit={() => {}}
                onVariableDoubleClick={() => {}}
              />
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-text-tertiary">2 messages</span>
            <button
              type="button"
              onClick={handleCopy}
              className="cursor-pointer text-sm font-medium text-text-secondary transition duration-100 ease-linear hover:text-text-primary"
            >
              {copied ? "Copied" : "Copy messages"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
