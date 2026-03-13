"use client";

import Link from "next/link";
import { useSession } from "@/context/session-context";
import { SAMPLE } from "@/components/dashboard/sample-data";
import { ArrowRight, FileCheck02 } from "@untitledui/icons";

export default function AppMessages() {
  const { state } = useSession();
  const { appState } = state;

  // Pre-download: Messages page only, no tabs, Blueprint CTA prominent (D-97)
  if (appState === "pre-download") {
    return (
      <div className="py-8">
        {/* Blueprint CTA — hero position */}
        <div className="rounded-xl border border-border-brand bg-bg-brand-primary p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-bg-brand-secondary">
            <FileCheck02 className="size-6 text-fg-brand-primary" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-text-primary">
            Get your {SAMPLE.businessName} SMS Blueprint
          </h2>
          <p className="mt-2 text-sm text-text-tertiary max-w-md mx-auto">
            A complete integration guide with every message in the {SAMPLE.useCase.toLowerCase()} library, your sandbox API key, and platform-specific setup instructions.
          </p>
          <Link
            href="/auth"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-bg-brand-solid px-6 py-3 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover"
          >
            Get your SMS Blueprint
            <ArrowRight className="size-4" />
          </Link>
          <p className="mt-3 text-[11px] text-text-quaternary">
            Includes sandbox API key and setup instructions for Claude Code, Cursor, and Windsurf.
          </p>
        </div>

        {/* Preview of what the Blueprint includes */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-text-secondary mb-3">
            Preview: messages in this Blueprint
          </h3>
          <div className="space-y-2">
            {SAMPLE.canonMessages.map((msg, i) => (
              <div
                key={i}
                className="rounded-lg border border-border-secondary bg-bg-primary p-3"
              >
                <p className="text-xs font-medium text-text-primary">{msg.name}</p>
                <p className="mt-1 text-xs text-text-tertiary font-mono">{msg.template}</p>
              </div>
            ))}
            <p className="text-[11px] text-text-quaternary">
              + more messages in the full {SAMPLE.useCase.toLowerCase()} library
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Post-download (sandbox / live): show the message catalog
  return (
    <div className="py-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Message Library</h2>
          <p className="text-sm text-text-tertiary mt-0.5">
            {appState === "sandbox"
              ? "Your sandbox is live — test these messages as you build."
              : "Your registered messages. Carrier-approved and ready to send."}
          </p>
        </div>
        <Link
          href={`/c/${SAMPLE.categoryId}/messages`}
          className="text-xs font-medium text-text-brand-secondary hover:underline"
        >
          Open full catalog →
        </Link>
      </div>

      {/* Canon messages */}
      <div className="space-y-3">
        {SAMPLE.canonMessages.map((msg, i) => (
          <div
            key={i}
            className="rounded-xl border border-border-secondary bg-bg-primary p-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-text-primary">{msg.name}</p>
              {appState === "live" && (
                <span className="inline-flex items-center rounded-full bg-bg-success-secondary px-2 py-0.5 text-[11px] font-medium text-text-success-primary">
                  Registered
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-text-tertiary leading-relaxed">{msg.template}</p>
          </div>
        ))}
      </div>

      {/* Marketing section — informational (D-89) */}
      <div className="mt-8 border-t border-border-secondary pt-6">
        <div className="flex items-baseline justify-between">
          <h3 className="text-sm font-semibold text-text-primary">Marketing messages</h3>
          <span className="text-xs text-text-quaternary">+$10/mo</span>
        </div>
        <p className="mt-1 text-xs text-text-tertiary">
          Available with a marketing campaign — add anytime from your dashboard. We will register an additional campaign for marketing messages.
        </p>
      </div>
    </div>
  );
}
