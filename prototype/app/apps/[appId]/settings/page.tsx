"use client";

import { useState } from "react";
import { useSession } from "@/context/session-context";
import { SAMPLE } from "@/components/dashboard/sample-data";
import { CopyButton } from "@/components/dashboard/shared";

export default function AppSettings() {
  const { state } = useSession();
  const [smsNotify, setSmsNotify] = useState(true);
  const isLive = state.appState === "live";

  return (
    <div className="py-4 space-y-6">
      {/* SMS compliance alerts toggle */}
      <div className="rounded-xl border border-border-secondary bg-bg-primary p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text-primary">
              SMS compliance alerts
            </p>
            <p className="text-xs text-text-tertiary mt-0.5">
              Get SMS alerts when drift is detected or messages are blocked.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={smsNotify}
            onClick={() => setSmsNotify(!smsNotify)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition duration-100 ease-linear ${
              smsNotify ? "bg-bg-brand-solid" : "bg-bg-tertiary"
            }`}
          >
            <span
              className={`pointer-events-none inline-block size-5 rounded-full bg-bg-primary shadow-xs ring-0 transition duration-100 ease-linear ${
                smsNotify ? "translate-x-[22px]" : "translate-x-[2px]"
              } mt-[2px]`}
            />
          </button>
        </div>
        {smsNotify && (
          <p className="mt-3 text-xs text-text-quaternary">
            Alerts go to {SAMPLE.phone}
          </p>
        )}
      </div>

      {/* Account info */}
      <div className="rounded-xl border border-border-secondary bg-bg-primary p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Account info</h3>
        <dl className="space-y-3">
          {[
            ["Business name", SAMPLE.businessName],
            ["Email", SAMPLE.email],
            ["Phone", SAMPLE.phone],
            ["Category", SAMPLE.useCase],
            ...(isLive
              ? [
                  ["Registration date", SAMPLE.registrationDate],
                  ["Approved", SAMPLE.approvalDate],
                  ["Campaign ID", SAMPLE.campaignSid],
                ]
              : []),
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between">
              <dt className="text-xs text-text-tertiary">{label}</dt>
              <dd className="text-xs font-medium text-text-primary">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* API key management */}
      <div className="rounded-xl border border-border-secondary bg-bg-primary p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-1">API keys</h3>
        <p className="text-xs text-text-tertiary mb-4">
          Your AI coding tool will use this key automatically when it reads your SMS Blueprint.
        </p>

        <div className="space-y-4">
          {/* Sandbox key — always visible */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <p className="text-xs font-medium text-text-quaternary uppercase tracking-wide">
                Sandbox
              </p>
              {!isLive && (
                <span className="inline-flex items-center rounded-full bg-bg-brand-secondary px-2 py-0.5 text-[11px] font-medium text-text-brand-secondary">
                  Active
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded-md bg-bg-secondary px-3 py-2 text-sm font-mono text-text-primary">
                {SAMPLE.sandboxApiKey}
              </code>
              <CopyButton text={SAMPLE.sandboxApiKey} />
            </div>
            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                className="text-xs font-medium text-text-brand-secondary hover:text-text-brand-secondary_hover transition duration-100 ease-linear"
              >
                Regenerate
              </button>
            </div>
          </div>

          {/* Live key — only post-registration */}
          {isLive && (
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <p className="text-xs font-medium text-text-quaternary uppercase tracking-wide">
                  Live
                </p>
                <span className="inline-flex items-center rounded-full bg-bg-success-secondary px-2 py-0.5 text-[11px] font-medium text-text-success-primary">
                  Active
                </span>
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded-md bg-bg-secondary px-3 py-2 text-sm font-mono text-text-primary">
                  {SAMPLE.liveApiKey}
                </code>
                <CopyButton text={SAMPLE.liveApiKey} />
              </div>
              <p className="mt-1.5 text-[11px] text-text-quaternary">
                Live keys cannot be regenerated. Contact support if compromised.
              </p>
            </div>
          )}
        </div>

        <p className="mt-4 text-xs text-text-quaternary border-t border-border-secondary pt-3">
          You can also find your key in{" "}
          <span className="font-mono">
            {SAMPLE.businessName.toLowerCase()}_sms_blueprint.md
          </span>
        </p>
      </div>

      {/* Billing (D-99) */}
      <div className="rounded-xl border border-border-secondary bg-bg-primary p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Billing</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-tertiary">Plan</span>
            <span className="text-xs font-medium text-text-primary">
              {isLive ? "Transactional — $19/mo" : "Sandbox — Free"}
            </span>
          </div>
          {isLive && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-tertiary">Messages this month</span>
                <span className="text-xs font-medium text-text-primary">
                  {SAMPLE.messagesThisMonth.toLocaleString()} / {SAMPLE.messagesIncluded} included
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-tertiary">Overage</span>
                <span className="text-xs font-medium text-text-primary">
                  {Math.max(0, SAMPLE.messagesThisMonth - SAMPLE.messagesIncluded).toLocaleString()} messages × $0.015
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-border-secondary pt-3">
                <span className="text-xs text-text-tertiary">Current period total</span>
                <span className="text-sm font-semibold text-text-primary">
                  ${(19 + Math.max(0, SAMPLE.messagesThisMonth - SAMPLE.messagesIncluded) * 0.015).toFixed(2)}
                </span>
              </div>
            </>
          )}
        </div>
        <button
          type="button"
          className="mt-4 text-xs font-medium text-text-brand-secondary hover:text-text-brand-secondary_hover transition duration-100 ease-linear"
        >
          View account billing →
        </button>
      </div>
    </div>
  );
}
