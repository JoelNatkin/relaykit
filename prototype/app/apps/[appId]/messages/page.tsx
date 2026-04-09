"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Phone01, Settings01 } from "@untitledui/icons";
import { MESSAGES, CATEGORY_VARIANTS } from "@/data/messages";
import { useSession } from "@/context/session-context";
import { CatalogCard } from "@/components/catalog/catalog-card";
import { SetupInstructions, SetupToggle, useSetupToggle } from "@/components/setup-instructions";
import { loadWizardData, saveWizardData, VERTICAL_LABELS } from "@/lib/wizard-storage";
import { EinInlineVerify } from "@/components/ein-inline-verify";
import type { BusinessIdentity } from "@/components/ein-inline-verify";

/* ── localStorage personalization ── */

const PERSONALIZE_KEY = "relaykit_personalize";

interface PersonalizeData {
  appName: string;
  website: string;
  serviceType: string;
}

function loadPersonalization(): PersonalizeData {
  try {
    const stored = localStorage.getItem(PERSONALIZE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // localStorage unavailable
  }
  return { appName: "", website: "", serviceType: "" };
}

/* ── Registered values (Approved state) ── */

const REGISTERED_VALUES: PersonalizeData = {
  appName: "GlowStudio",
  website: "glowstudio.com",
  serviceType: "Beauty & wellness appointments",
};

/* ── Page ── */

export default function AppMessagesPage() {
  const { state, setField } = useSession();

  const isWizard = state.registrationState === "onboarding";
  const isBuilding = state.registrationState === "building";
  const isApproved = state.registrationState === "registered";
  const categoryId = state.selectedCategory || "appointments";
  const allMessages = MESSAGES[categoryId] || [];
  const variants = CATEGORY_VARIANTS[categoryId];

  // Load personalization from localStorage on mount
  // In Approved state, use registered values instead
  useEffect(() => {
    if (isApproved) {
      setField("appName", REGISTERED_VALUES.appName);
      setField("website", REGISTERED_VALUES.website);
      setField("serviceType", REGISTERED_VALUES.serviceType);
    } else {
      const saved = loadPersonalization();
      if (saved.appName) setField("appName", saved.appName);
      if (saved.website) setField("website", saved.website);
      if (saved.serviceType) setField("serviceType", saved.serviceType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApproved]);

  const coreMessages = allMessages.filter((m) => m.tier !== "expansion");

  // Check if EIN was provided in wizard flow — re-reads on switcher change
  const [hasEin, setHasEin] = useState(false);
  const [showMarketingTooltip, setShowMarketingTooltip] = useState(false);
  useEffect(() => {
    function readEin() {
      const data = loadWizardData();
      setHasEin(!!data.ein);
    }
    readEin();
    window.addEventListener("relaykit-ein-change", readEin);
    return () => window.removeEventListener("relaykit-ein-change", readEin);
  }, []);

  // Registration card: marketing radio + vertical label + inline EIN
  const [includeMarketing, setIncludeMarketing] = useState(false);
  const [einExpanded, setEinExpanded] = useState(false);
  const verticalLabel = (VERTICAL_LABELS[categoryId] || categoryId).toLowerCase();

  function handleEinSave(ein: string, identity: BusinessIdentity) {
    saveWizardData({ ein, businessIdentity: identity });
    setHasEin(true);
    setEinExpanded(false);
    window.dispatchEvent(new Event("relaykit-ein-change"));
  }

  function handleEinCancel() {
    setEinExpanded(false);
  }

  // Single-card editing: clicking a new card's pencil closes any open edit.
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

  function handleSend(messageId: string) {
    // Stub — future: send to verified phone
    console.log("Send message:", messageId);
  }

  const { appId } = useParams<{ appId: string }>();
  const phoneIcon = <Phone01 className="size-[18px]" />;
  const registrationState = state.registrationState;
  const isPending = registrationState === "pending";
  const isChangesRequested = registrationState === "changes_requested";
  const isRejected = registrationState === "rejected";

  /* ── Setup toggle (per-state persistence) ── */
  const { visible: setupVisible, toggle: setupToggle } = useSetupToggle(registrationState);

  /* ── Shared message list ── */
  const messageList = (
    <div className={isWizard ? "" : "max-w-[540px]"}>
      <div className="space-y-5">
        {coreMessages.map((message) => (
          <CatalogCard
            key={message.id}
            message={message}
            categoryId={categoryId}
            state={state}
            variants={variants}
            onSend={handleSend}
            sendIcon={phoneIcon}
            hideSend={isWizard}
            isEditing={editingMessageId === message.id}
            onEditRequest={setEditingMessageId}
          />
        ))}
      </div>
    </div>
  );

  /* ── Wizard (Onboarding) state ── */
  if (isWizard) {
    return (
      <div>
        <div className="mb-2">
          <h1 className="text-2xl font-bold text-text-primary">
            Here{"\u2019"}s what your app will send
          </h1>
        </div>
        <div className="mb-8">
          <p className="text-sm text-text-tertiary">
            Each message is tailored to your business. Edit messages any time. Your app always sends the latest version.
          </p>
          <div className="relative mt-2 inline-block">
            <button
              type="button"
              onClick={() => setShowMarketingTooltip((v) => !v)}
              onBlur={() => setShowMarketingTooltip(false)}
              className="text-sm text-text-brand-secondary hover:text-text-brand-secondary_hover transition duration-100 ease-linear cursor-pointer"
            >
              What about marketing messages?
            </button>
            {showMarketingTooltip && (
              <div className="absolute left-0 top-full mt-1 z-[100] rounded-lg bg-[#333333] px-3 py-2 text-xs text-white shadow-lg min-w-[260px] max-w-[320px] whitespace-normal leading-relaxed">
                {hasEin
                  ? "You\u2019re all set to add marketing messages after you create your account. We\u2019ll walk you through it."
                  : "Marketing messages require a business tax ID (EIN). You can add one anytime in settings."}
              </div>
            )}
          </div>
        </div>
        {messageList}
      </div>
    );
  }

  /* ── Registered state: single-column, no right rail ── */
  if (isApproved) {
    return (
      <div>
        <div className="flex items-center justify-end gap-4 mb-4">
          <SetupToggle checked={setupVisible} onChange={setupToggle} />
          <Link href={`/apps/${appId}/settings`} className="flex items-center gap-1.5 text-sm font-medium text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear">
            <Settings01 className="size-4" />
            Settings
          </Link>
        </div>
        <SetupInstructions visible={setupVisible} />

        {/* Delivery metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="rounded-xl border border-border-secondary bg-bg-primary p-5">
            <p className="text-sm font-semibold text-text-tertiary uppercase tracking-wide">Delivery</p>
            <div className="mt-3">
              <span className="text-3xl font-semibold text-text-success-primary">98.4%</span>
            </div>
            <p className="mt-1 text-sm text-text-secondary">delivery rate</p>
            <p className="mt-3 text-sm text-text-secondary">1,812 delivered &middot; 22 failed &middot; 8 pending</p>
            <p className="mt-1 text-sm text-text-success-primary">&uarr; 0.3% vs last period</p>
          </div>

          <div className="rounded-xl border border-border-secondary bg-bg-primary p-5">
            <p className="text-sm font-semibold text-text-tertiary uppercase tracking-wide">Recipients</p>
            <div className="mt-3">
              <span className="text-3xl font-semibold text-text-primary">284</span>
            </div>
            <p className="mt-1 text-sm text-text-secondary">unique recipients this period</p>
            <p className="mt-3 text-sm text-text-secondary">12 opt-outs (4.2%) &middot; 38 inbound replies</p>
            <p className="mt-1 text-sm text-text-success-primary">&uarr; 1.2% vs last period</p>
          </div>

          <div className="rounded-xl border border-border-secondary bg-bg-primary p-5">
            <p className="text-sm font-semibold text-text-tertiary uppercase tracking-wide">Usage &amp; billing</p>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-3xl font-semibold text-text-primary">347</span>
              <span className="text-lg text-text-tertiary">/ 500</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-bg-secondary">
              <div className="h-2 rounded-full bg-bg-brand-solid" style={{ width: "69.4%" }} />
            </div>
            <p className="mt-2 text-sm text-text-secondary">153 messages remaining this period</p>
            <p className="mt-2 text-xs text-text-tertiary">Plan: $19/mo &middot; 500 included</p>
          </div>
        </div>

        {messageList}
      </div>
    );
  }

  /* ── All other states: two-column layout with right rail ── */
  return (
    <div>
      <div className="flex items-center justify-end gap-4 mb-4">
        <SetupToggle checked={setupVisible} onChange={setupToggle} />
        <Link href={`/apps/${appId}/settings`} className="flex items-center gap-1.5 text-sm font-medium text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear">
          <Settings01 className="size-4" />
          Settings
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-6 md:gap-16">
        {/* LEFT — setup instructions + messages */}
        <div className="min-w-0 flex-1">
          <SetupInstructions visible={setupVisible} />
          {messageList}
        </div>

        {/* RIGHT — Registration card */}
        <div className="order-first md:order-last md:w-[300px] md:shrink-0">
          <div className="rounded-xl bg-gray-50 p-6 md:sticky md:top-20">
            {isBuilding ? (
              !einExpanded ? (
                /* Card A — Registration card */
                <div style={{ animation: "einCardFade 200ms ease-out" }}>
                  <h3 className="text-lg font-semibold text-text-primary">Ready to go live?</h3>
                  {hasEin ? (
                    <>
                      <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                        Registration takes a few days.
                      </p>
                      <div className="mt-4 space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="campaign-type"
                            checked={!includeMarketing}
                            onChange={() => setIncludeMarketing(false)}
                            className="accent-[var(--color-brand-600)]"
                          />
                          <span className="text-sm text-text-primary">Just {verticalLabel}</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="campaign-type"
                            checked={includeMarketing}
                            onChange={() => setIncludeMarketing(true)}
                            className="accent-[var(--color-brand-600)]"
                          />
                          <span className="text-sm text-text-primary">Add marketing messages too</span>
                        </label>
                      </div>
                    </>
                  ) : (
                    <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                      Registration takes a few days. An EIN lets us enable optional marketing messages.{" "}
                      <button
                        type="button"
                        onClick={() => setEinExpanded(true)}
                        className="font-semibold text-text-brand-secondary hover:text-text-brand-secondary_hover transition duration-100 ease-linear cursor-pointer"
                      >Add EIN.</button>
                    </p>
                  )}
                  <p className="mt-4 text-sm font-semibold text-text-primary">
                    $49 registration + {includeMarketing && hasEin ? "$29" : "$19"}/mo
                  </p>
                  <p className="mt-1 text-xs text-text-tertiary">500 messages included, then $8 per 500</p>
                  <Link
                    href={`/apps/${appId}/register`}
                    className="mt-5 inline-flex items-center rounded-lg bg-bg-brand-solid px-4 py-2.5 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover"
                  >
                    Start registration &rarr;
                  </Link>
                </div>
              ) : (
                /* Card B — EIN verification card */
                <div style={{ animation: "einCardFade 200ms ease-out" }}>
                  <EinInlineVerify
                    onSave={handleEinSave}
                    onCancel={handleEinCancel}
                  />
                </div>
              )
            ) : isPending ? (
              <>
                <h3 className="text-base font-semibold text-text-primary">Registration status</h3>
                <div className="mt-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-bg-brand-secondary px-2.5 py-1 text-xs font-medium text-text-brand-secondary">
                    <span className="w-1.5 h-1.5 rounded-full bg-fg-brand-primary" />
                    Under carrier review
                  </span>
                </div>
                <div className="mt-4 space-y-1">
                  <p className="text-sm font-semibold text-text-secondary">Submitted March 17, 2026</p>
                  <p className="text-sm text-text-tertiary">
                    Typically approved in a few days. We&#39;ll email you at{" "}
                    <a href="mailto:jen@glowstudio.com" className="font-medium text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear">
                      jen@glowstudio.com
                    </a>.
                  </p>
                </div>
              </>
            ) : isChangesRequested ? (
              <>
                <h3 className="text-base font-semibold text-text-primary">Registration status</h3>
                <div className="mt-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-bg-brand-secondary px-2.5 py-1 text-xs font-medium text-text-brand-secondary">
                    <span className="w-1.5 h-1.5 rounded-full bg-fg-brand-primary" />
                    Under review
                  </span>
                </div>
                <div className="mt-4 space-y-1">
                  <p className="text-sm font-semibold text-text-secondary">Submitted March 17, 2026 &middot; Updated March 24, 2026</p>
                  <p className="text-sm text-text-tertiary">
                    Your registration is taking a bit longer than expected. We&apos;re on it &mdash; we&#39;ll email you at{" "}
                    <a href="mailto:jen@glowstudio.com" className="font-medium text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear">
                      jen@glowstudio.com
                    </a>{" "}
                    when it&apos;s resolved.
                  </p>
                </div>
              </>
            ) : isRejected ? (
              <>
                <h3 className="text-base font-semibold text-text-primary">Registration status</h3>
                <div className="mt-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-bg-error-secondary px-2.5 py-1 text-xs font-medium text-text-error-primary">
                    <span className="w-1.5 h-1.5 rounded-full bg-fg-error-primary" />
                    Not approved
                  </span>
                </div>
                <p className="mt-4 text-sm font-semibold text-text-success-primary">$49 refunded March 28, 2026</p>
                <div className="my-4 border-t border-border-secondary" />
                <p className="text-sm font-semibold text-text-primary">What happened</p>
                <p className="mt-2 text-sm text-text-tertiary leading-relaxed">
                  Your business information couldn&apos;t be verified with the details provided.
                </p>
                <p className="mt-4 text-sm text-text-tertiary leading-relaxed">
                  We&apos;re looking into what went wrong on our end. Reach out if you&apos;d like to discuss.
                </p>
                <a href="mailto:hello@relaykit.ai" className="mt-1 inline-block text-sm font-medium text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear">
                  hello@relaykit.ai
                </a>
              </>
            ) : null}
          </div>

        </div>
      </div>
    </div>
  );
}
