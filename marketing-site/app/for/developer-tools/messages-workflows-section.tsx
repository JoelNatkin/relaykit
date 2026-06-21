"use client";

import { useState } from "react";
import { X } from "@untitledui/icons";
import { Eyebrow } from "@/components/home/section-ui";
import type { VariantTone } from "@/lib/message-library";
import { useConfiguratorState } from "@/lib/configurator/use-configurator-state";
import { MessagesSection } from "@/components/home/messages-section";
import { WorkflowsSection } from "@/components/home/workflows-section";
import { findSubVerticalLanding } from "@/lib/landing/sub-verticals";

// The developer-tools "messages" section: one heading, one set of controls
// (business name + tone), and a Workflows / All messages toggle. Workflows
// (default) leads with the sub-vertical's curated workflows; All messages drops
// to the full 9-category browser. Both views are driven by the same business
// name (shared via the configurator store) and tone, so switching the toggle
// keeps the visitor's context. The browser renders chromeless — this component
// owns the heading + controls, so there's no duplicate chrome (D-436 reuse).

const TONES: VariantTone[] = ["Standard", "Friendly", "Brief"];
const ENTRY = findSubVerticalLanding("developer-tools");

type View = "workflows" | "messages";

export function MessagesWorkflowsSection() {
  const { state, setBusinessName } = useConfiguratorState();
  const [view, setView] = useState<View>("workflows");
  const [tone, setTone] = useState<VariantTone>("Standard");

  // The registry guarantees the developer-tools entry; guard for type-safety.
  if (!ENTRY) return null;

  return (
    <section
      id="configurator"
      className="mx-auto max-w-5xl border-t border-border-secondary px-6 py-20 sm:py-28"
    >
      <div className="max-w-2xl">
        <Eyebrow>The messages</Eyebrow>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          Developer tools &amp; API platform messages. And all of the others.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-text-secondary">
          All nine message categories are included — one registration.
        </p>
      </div>

      {/* View toggle — two adjacent pills sharing one border (segmented control).
          Selected = monochromatic neutral; gold stays reserved for category
          selection (D-405/D-427). */}
      <div
        className="mt-8 inline-flex rounded-lg border border-border-primary p-0.5"
        role="group"
        aria-label="Message view"
      >
        {(
          [
            ["workflows", "Workflows"],
            ["messages", "All messages"],
          ] as [View, string][]
        ).map(([key, label]) => {
          const active = view === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setView(key)}
              aria-pressed={active}
              className={`cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition duration-100 ease-linear ${
                active
                  ? "bg-border-primary text-text-primary"
                  : "text-text-tertiary hover:text-text-secondary"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Shared controls — business name + tone. Drive both views. Same pattern
          as MessagesSection: name (2/3) + tone select below md; name (md:w-80) +
          tone pills at md+. */}
      <div className="mb-4 mt-8 flex items-center gap-3 md:flex-wrap md:justify-between md:gap-4">
        <div className="relative min-w-0 grow-[2] basis-0 md:grow-0 md:basis-auto">
          <input
            type="text"
            value={state.businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Your business name"
            maxLength={24}
            autoComplete="off"
            aria-label="See the messages as your business"
            className="w-full rounded-lg border border-border-primary bg-surface-card py-3 pl-4 pr-10 text-base text-text-primary transition duration-100 ease-linear placeholder:text-text-quaternary focus:border-border-gold focus:outline-none md:w-80"
          />
          {state.businessName && (
            <button
              type="button"
              onClick={() => setBusinessName("")}
              aria-label="Clear business name"
              className="absolute right-2.5 top-1/2 inline-flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-text-quaternary transition duration-100 ease-linear hover:text-text-secondary"
            >
              <X className="size-4" aria-hidden />
            </button>
          )}
        </div>

        <select
          aria-label="Message tone"
          value={tone}
          onChange={(e) => setTone(e.target.value as VariantTone)}
          className="min-w-0 grow basis-0 rounded-lg border border-border-primary bg-surface-card px-3 py-3 text-base text-text-primary md:hidden"
        >
          {TONES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <div
          className="hidden gap-1.5 md:flex"
          role="group"
          aria-label="Message tone"
        >
          {TONES.map((t) => {
            const active = t === tone;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTone(t)}
                aria-pressed={active}
                className={`cursor-pointer rounded-full border border-border-primary px-3.5 py-1.5 text-[12.5px] font-medium transition duration-100 ease-linear ${
                  active
                    ? "bg-border-primary text-text-primary"
                    : "text-text-tertiary hover:text-text-secondary"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {view === "workflows" ? (
        <WorkflowsSection
          workflows={ENTRY.workflows}
          businessName={state.businessName}
          tone={tone}
        />
      ) : (
        <MessagesSection
          chromeless
          tone={tone}
          defaultCategory={ENTRY.defaultCategory}
        />
      )}
    </section>
  );
}
