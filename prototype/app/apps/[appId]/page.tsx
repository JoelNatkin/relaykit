"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { InfoCircle, Stars02 } from "@untitledui/icons";
import { MESSAGES, CATEGORY_VARIANTS, type Message } from "@/data/messages";
import { useSession } from "@/context/session-context";
import { CatalogCard } from "@/components/catalog/catalog-card";
import type { LastSent, ActivityEntry } from "@/components/catalog/catalog-card";
import { TestPhonesCard, INITIAL_TEST_PHONES, type TestPhone } from "@/components/test-phones-card";
import { SetupInstructions, SetupToggle } from "@/components/setup-instructions";
import { useSetupToggleState } from "@/context/setup-toggle-context";
import { AskClaudePanel } from "@/components/ask-claude-panel";
import { loadWizardData, saveWizardData, VERTICAL_LABELS } from "@/lib/wizard-storage";
import { EinInlineVerify } from "@/components/ein-inline-verify";
import type { BusinessIdentity } from "@/components/ein-inline-verify";

/* ── Marketing messages (D-336) ── */

const MARKETING_MESSAGES: Message[] = [
  {
    id: "mkt_new_service",
    categoryId: "appointments",
    name: "New service announcement",
    tier: "core",
    defaultEnabled: true,
    template: "Hi {first_name}, GlowStudio now offers {service_name}! Book your first session and get 15% off. Reply STOP to opt out.",
    trigger: "When a new service is added",
    requiresStop: true,
    expansionType: "marketing",
    consentLabel: "new service announcements",
  },
  {
    id: "mkt_seasonal",
    categoryId: "appointments",
    name: "Seasonal promotion",
    tier: "core",
    defaultEnabled: true,
    template: "Hey {first_name}, spring refresh specials are here at GlowStudio! Book this week for 20% off any facial. Reply STOP to opt out.",
    trigger: "Seasonal or time-limited promotions",
    requiresStop: true,
    expansionType: "marketing",
    consentLabel: "seasonal promotions",
  },
  {
    id: "mkt_reengagement",
    categoryId: "appointments",
    name: "Re-engagement",
    tier: "core",
    defaultEnabled: true,
    template: "Hi {first_name}, we miss you at GlowStudio! It\u2019s been a while since your last visit. Book today and enjoy $10 off. Reply STOP to opt out.",
    trigger: "Customer inactive for 60+ days",
    requiresStop: true,
    expansionType: "marketing",
    consentLabel: "re-engagement messages",
  },
  {
    id: "mkt_loyalty",
    categoryId: "appointments",
    name: "Loyalty reward",
    tier: "core",
    defaultEnabled: true,
    template: "Hey {first_name}, you\u2019ve been a GlowStudio regular! Your next appointment comes with a complimentary add-on. Book now. Reply STOP to opt out.",
    trigger: "Customer reaches loyalty milestone",
    requiresStop: true,
    expansionType: "marketing",
    consentLabel: "loyalty rewards",
  },
];

const MARKETING_BADGE = (
  <span className="inline-flex items-center rounded-full bg-bg-brand-secondary px-2 py-0.5 text-[10px] font-medium text-text-brand-secondary shrink-0 mt-1">
    Marketing
  </span>
);

/* ── Mock monitor data ──
   Keyed by coreMessages index. First 3 have delivered history; the 4th has a
   recent failure with carrier error detail. Remaining cards have null → look
   identical to pre-monitor-mode. Prototype only — production will query real
   send logs. */

const MOCK_NOW = Date.now();
const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const mockIso = (msAgo: number) => new Date(MOCK_NOW - msAgo).toISOString();

const MOCK_LAST_SENT: (LastSent | null)[] = [
  { timestamp: mockIso(3 * MINUTE), status: "delivered", recipientName: "Joel" },
  { timestamp: mockIso(22 * MINUTE), status: "delivered", recipientName: "Sarah" },
  { timestamp: mockIso(2 * HOUR), status: "delivered", recipientName: "Joel" },
  { timestamp: mockIso(DAY), status: "failed", recipientName: "Joel" },
];

const MOCK_ACTIVITY: (ActivityEntry[] | undefined)[] = [
  [
    { id: "e1", recipientName: "Joel", status: "delivered", timestamp: mockIso(3 * MINUTE) },
    { id: "e2", recipientName: "Sarah", status: "delivered", timestamp: mockIso(15 * MINUTE) },
    { id: "e3", recipientName: "Joel", status: "delivered", timestamp: mockIso(4 * HOUR) },
  ],
  [
    { id: "e1", recipientName: "Joel", status: "delivered", timestamp: mockIso(22 * MINUTE) },
    { id: "e2", recipientName: "Sarah", status: "delivered", timestamp: mockIso(2 * HOUR) },
    { id: "e3", recipientName: "Joel", status: "delivered", timestamp: mockIso(19 * HOUR) },
  ],
  [
    { id: "e1", recipientName: "Joel", status: "delivered", timestamp: mockIso(2 * HOUR) },
    { id: "e2", recipientName: "Sarah", status: "delivered", timestamp: mockIso(2 * DAY) },
  ],
  [
    {
      id: "e1",
      recipientName: "Joel",
      status: "failed",
      timestamp: mockIso(DAY),
      errorDetail: "Carrier rejected: invalid number format",
    },
    { id: "e2", recipientName: "Sarah", status: "delivered", timestamp: mockIso(3 * DAY) },
    { id: "e3", recipientName: "Joel", status: "delivered", timestamp: mockIso(5 * DAY) },
  ],
];

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

  // Marketing upsell card state (Pending right rail)
  const [upsellEinExpanded, setUpsellEinExpanded] = useState(false);
  const [upsellConfirmStep, setUpsellConfirmStep] = useState(false);
  const [upsellConfirmed, setUpsellConfirmed] = useState(false);

  // Registration status tracker (Pending right rail)
  const [regTrackerTooltip, setRegTrackerTooltip] = useState(false);
  const hasMarketingRegistered = upsellConfirmed;
  const verticalName = VERTICAL_LABELS[categoryId] || "Messages";

  // Registered state marketing upsell
  const [registeredUpsellEinExpanded, setRegisteredUpsellEinExpanded] = useState(false);
  const [registeredUpsellConfirmStep, setRegisteredUpsellConfirmStep] = useState(false);
  const [registeredUpsellConfirmed, setRegisteredUpsellConfirmed] = useState(false);

  // Registered state marketing-only registration tracker
  type RegMktTrackerState = "in-review" | "registered";
  const [regMktTrackerState, setRegMktTrackerState] = useState<RegMktTrackerState>("in-review");
  const [regMktTrackerDismissed, setRegMktTrackerDismissed] = useState(false);
  const [regMktTrackerTooltip, setRegMktTrackerTooltip] = useState(false);

  function handleRegisteredUpsellEinSave(ein: string, identity: BusinessIdentity) {
    saveWizardData({ ein, businessIdentity: identity });
    setHasEin(true);
    setRegisteredUpsellEinExpanded(false);
    setRegisteredUpsellConfirmStep(true);
    window.dispatchEvent(new Event("relaykit-ein-change"));
  }

  function handleRegisteredUpsellEinCancel() {
    setRegisteredUpsellEinExpanded(false);
  }

  function handleEinSave(ein: string, identity: BusinessIdentity) {
    saveWizardData({ ein, businessIdentity: identity });
    setHasEin(true);
    setEinExpanded(false);
    window.dispatchEvent(new Event("relaykit-ein-change"));
  }

  function handleEinCancel() {
    setEinExpanded(false);
  }

  function handleUpsellEinSave(ein: string, identity: BusinessIdentity) {
    saveWizardData({ ein, businessIdentity: identity });
    setHasEin(true);
    setUpsellEinExpanded(false);
    setUpsellConfirmStep(true);
    window.dispatchEvent(new Event("relaykit-ein-change"));
  }

  function handleUpsellEinCancel() {
    setUpsellEinExpanded(false);
  }

  // Single-card edit/monitor: at most one card is in edit state and at most
  // one is in monitor state. Opening one closes the other across all cards.
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [monitoringMessageId, setMonitoringMessageId] = useState<string | null>(null);

  function requestEdit(id: string | null) {
    setEditingMessageId(id);
    if (id !== null) setMonitoringMessageId(null);
  }

  function requestMonitor(id: string | null) {
    setMonitoringMessageId(id);
    if (id !== null) setEditingMessageId(null);
  }

  // Ask Claude panel — takes over the right rail (and metrics cards in the
  // Registered state) while open. Can be opened from the section header
  // (no focused message) or from inside a card's monitor expansion (focused
  // on that message's name).
  const [askClaudeOpen, setAskClaudeOpen] = useState(false);
  const [askClaudeFocusedMessage, setAskClaudeFocusedMessage] = useState<string | null>(null);

  function openAskClaude(focusedMessageName: string | null = null) {
    setAskClaudeFocusedMessage(focusedMessageName);
    setAskClaudeOpen(true);
    // Close any open edit/monitor since the panel replaces the right rail.
    setEditingMessageId(null);
    setMonitoringMessageId(null);
  }

  function closeAskClaude() {
    setAskClaudeOpen(false);
    setAskClaudeFocusedMessage(null);
  }

  // Measure the message-card column's viewport-relative top so the fixed
  // Ask Claude panel aligns with it. A zero-height ref div sits right above
  // the first card in both layouts.
  const messageTopRef = useRef<HTMLDivElement>(null);
  const [panelTopOffset, setPanelTopOffset] = useState(144);

  useEffect(() => {
    if (askClaudeOpen && messageTopRef.current) {
      setPanelTopOffset(Math.max(80, messageTopRef.current.getBoundingClientRect().top));
    }
  }, [askClaudeOpen]);

  // Test phones — shared between the right-rail Test phones card and the
  // Send test dropdown inside each CatalogCard's monitor expansion, so both
  // read from a single source of names.
  const [testPhones, setTestPhones] = useState<TestPhone[]>(INITIAL_TEST_PHONES);
  const testRecipientNames = testPhones.map((p) => p.name);

  function handleRemoveTestPhone(id: string) {
    setTestPhones((prev) => prev.filter((p) => p.id !== id));
  }

  function handleInviteTestPhone(name: string, phone: string) {
    setTestPhones((prev) => [
      ...prev,
      {
        id: `invited-${Date.now()}`,
        name,
        phone,
        status: "invited",
      },
    ]);
  }

  function handleEditTestPhone(id: string, name: string, phone: string) {
    setTestPhones((prev) =>
      prev.map((p) => (p.id === id ? { ...p, name, phone } : p))
    );
  }

  const { appId } = useParams<{ appId: string }>();
  const registrationState = state.registrationState;
  const isPending = registrationState === "pending";
  const isChangesRequested = registrationState === "changes_requested";
  const isRejected = registrationState === "rejected";

  /* ── Setup toggle state lives in DashboardLayout's header row; we just
         read the current visibility here to drive the panel below. ── */
  const { visible: setupVisible, toggle: setupToggle } = useSetupToggleState();

  /* ── Should marketing messages be shown? (D-336) ── */
  const showMarketingMessages = (isPending && hasEin && upsellConfirmed) || (isApproved && hasEin && registeredUpsellConfirmed);

  /* ── Section header (post-onboarding only) ── */
  const messagesSectionHeader = (
    <div className="mt-2 mb-4 flex w-full items-center">
      <h2 className="text-lg font-semibold text-text-primary">Messages</h2>
      <div className="ml-auto flex items-center gap-6">
        <SetupToggle checked={setupVisible} onChange={setupToggle} />
        <button
          type="button"
          onClick={() => openAskClaude()}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-brand-secondary hover:text-text-brand-secondary_hover transition duration-100 ease-linear cursor-pointer"
        >
          <Stars02 className="size-4 text-fg-brand-primary" />
          Ask Claude
        </button>
      </div>
    </div>
  );

  /* ── Ask Claude panel (reused across both layouts) ── */
  const askClaudePanel = (
    <AskClaudePanel
      focusedMessageName={askClaudeFocusedMessage}
      onClose={closeAskClaude}
      topOffset={panelTopOffset}
    />
  );

  /* ── Shared message list ── */
  const messageList = (
    <div>
      <div className="space-y-5">
        {showMarketingMessages && MARKETING_MESSAGES.map((message) => (
          <CatalogCard
            key={message.id}
            message={message}
            categoryId={categoryId}
            state={state}
            variants={variants}
            isEditing={editingMessageId === message.id}
            onEditRequest={requestEdit}
            badge={MARKETING_BADGE}
            monitorMode={!isWizard}
            isMonitoring={monitoringMessageId === message.id}
            onMonitorRequest={requestMonitor}
            testRecipients={testRecipientNames}
            onAskClaude={openAskClaude}
          />
        ))}
        {coreMessages.map((message, index) => (
          <CatalogCard
            key={message.id}
            message={message}
            categoryId={categoryId}
            state={state}
            variants={variants}
            isEditing={editingMessageId === message.id}
            onEditRequest={requestEdit}
            monitorMode={!isWizard}
            lastSent={MOCK_LAST_SENT[index] ?? null}
            activity={MOCK_ACTIVITY[index]}
            isMonitoring={monitoringMessageId === message.id}
            onMonitorRequest={requestMonitor}
            testRecipients={testRecipientNames}
            onAskClaude={openAskClaude}
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

  /* ── Registered state ── */
  if (isApproved) {
    const showRegisteredUpsell = !registeredUpsellConfirmed;

    return (
      <div>
        {/* Delivery metrics — hidden when the Ask Claude panel is open */}
        {!askClaudeOpen && (
        <div className="grid grid-cols-1 min-[860px]:grid-cols-3 gap-6 mb-6">
          <div className="rounded-xl border border-border-secondary bg-bg-primary p-5">
            <p className="text-sm font-semibold text-text-tertiary uppercase tracking-wide">Delivery</p>
            <div className="mt-3">
              <span className="text-3xl font-semibold text-text-success-primary">98.4%</span>
            </div>
            <p className="mt-1 text-sm text-text-secondary">delivery rate</p>
            <p className="mt-3 text-sm text-text-success-primary">&uarr; 0.3% vs last period</p>
          </div>

          <div className="rounded-xl border border-border-secondary bg-bg-primary p-5">
            <p className="text-sm font-semibold text-text-tertiary uppercase tracking-wide">Recipients</p>
            <div className="mt-3">
              <span className="text-3xl font-semibold text-text-primary">284</span>
            </div>
            <p className="mt-1 text-sm text-text-secondary">unique recipients this period</p>
            <p className="mt-3 text-sm text-text-success-primary">&uarr; 1.2% vs last period</p>
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
            <p className="mt-3 text-sm text-text-secondary">Plan: $19/mo &middot; 500 included</p>
          </div>
        </div>
        )}

        {messagesSectionHeader}

        <div
          className={
            askClaudeOpen
              ? "grid grid-cols-1 md:grid-cols-2 md:gap-10"
              : "grid grid-cols-1 min-[860px]:grid-cols-3 gap-6"
          }
        >
          <div className={askClaudeOpen ? "min-w-0" : "min-w-0 min-[860px]:col-span-2"}>
            <div ref={messageTopRef} />
            <SetupInstructions visible={setupVisible} />
            {messageList}
          </div>

          {askClaudeOpen ? (
            askClaudePanel
          ) : (
          /* RIGHT — stacks the marketing/tracker card (when present) and
              the Test phones card. The column always renders because Test
              phones is visible in every post-onboarding state. Sits in the
              third column of the same 3-col grid as the metrics row above. */
          <div className="order-first min-[860px]:order-last min-[860px]:sticky min-[860px]:top-20 space-y-4">
            {(showRegisteredUpsell || (registeredUpsellConfirmed && !regMktTrackerDismissed)) && (
              <div className="rounded-xl bg-gray-50 p-6">
                {showRegisteredUpsell ? (
                  registeredUpsellConfirmStep ? (
                    <div style={{ animation: "einCardFade 200ms ease-out" }}>
                      <h3 className="text-lg font-semibold text-text-primary">Confirm marketing messages</h3>
                      <p className="mt-3 text-sm text-text-secondary leading-relaxed">
                        Your plan updates from <span className="font-semibold text-text-primary">$19/mo</span> to <span className="font-semibold text-text-primary">$29/mo</span>. Registration typically takes a few days.
                      </p>
                      <p className="mt-1 text-xs text-text-tertiary">
                        Marketing messages share your 500 included messages.
                      </p>
                      <div className="mt-6 flex items-center justify-end gap-5">
                        <button
                          type="button"
                          onClick={() => setRegisteredUpsellConfirmStep(false)}
                          className="text-sm text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => { setRegisteredUpsellConfirmed(true); setRegisteredUpsellConfirmStep(false); }}
                          className="inline-flex items-center rounded-lg bg-bg-brand-solid px-4 py-2.5 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover cursor-pointer"
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                  ) : registeredUpsellEinExpanded ? (
                    <div style={{ animation: "einCardFade 200ms ease-out" }}>
                      <EinInlineVerify
                        onSave={handleRegisteredUpsellEinSave}
                        onCancel={handleRegisteredUpsellEinCancel}
                      />
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-base font-semibold text-text-primary">Add marketing messages</h3>
                      <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                        Promote new services, announce specials, and bring past clients back.
                      </p>
                      <p className="mt-3 text-sm font-semibold text-text-primary">
                        $29/mo instead of $19/mo.
                      </p>
                      {!hasEin ? (
                        <button
                          type="button"
                          onClick={() => setRegisteredUpsellEinExpanded(true)}
                          className="mt-5 inline-flex items-center rounded-lg bg-bg-brand-solid px-4 py-2.5 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover cursor-pointer"
                        >
                          Add your EIN &rarr;
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setRegisteredUpsellConfirmStep(true)}
                          className="mt-5 inline-flex items-center rounded-lg bg-bg-brand-solid px-4 py-2.5 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover cursor-pointer"
                        >
                          Add marketing messages &rarr;
                        </button>
                      )}
                    </div>
                  )
                ) : (
                  /* Marketing-only registration tracker */
                  <div style={{ animation: "einCardFade 200ms ease-out" }}>
                    {/* Prototype state cycler */}
                    <div className="flex justify-end mb-2">
                      <select
                        value={regMktTrackerState}
                        onChange={(e) => setRegMktTrackerState(e.target.value as RegMktTrackerState)}
                        className="text-xs text-text-quaternary bg-transparent border-none cursor-pointer focus:outline-none"
                      >
                        <option value="in-review">In review</option>
                        <option value="registered">Registered</option>
                      </select>
                    </div>

                    <div className="relative">
                      {regMktTrackerState === "registered" ? (
                        <h3 className="text-lg font-semibold text-text-primary">Your messages are live!</h3>
                      ) : (
                        <>
                          <h3 className="text-lg font-semibold text-text-primary inline-flex items-center gap-1.5">
                            Registration status
                            <button
                              type="button"
                              onClick={() => setRegMktTrackerTooltip((v) => !v)}
                              onBlur={() => setRegMktTrackerTooltip(false)}
                              className="cursor-pointer"
                            >
                              <InfoCircle className="size-4 text-text-quaternary" />
                            </button>
                          </h3>
                          {regMktTrackerTooltip && (
                            <div className="absolute left-0 top-full mt-1 z-[100] rounded-lg bg-[#333333] px-3 py-2 text-xs text-white shadow-lg min-w-[220px] max-w-[280px] whitespace-normal leading-relaxed">
                              Registration usually takes 2–3 days per message type.
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    <div className="mt-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-sm font-semibold text-text-primary">Marketing</span>
                          <p className="text-xs text-text-tertiary mt-0.5">Submitted 3/17/2026</p>
                        </div>
                        {regMktTrackerState === "in-review" ? (
                          <span className="inline-flex items-center rounded-full bg-bg-brand-secondary px-2 py-0.5 text-[10px] font-medium text-text-brand-secondary shrink-0 mt-1">
                            In review
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-bg-success-secondary px-2 py-0.5 text-[10px] font-medium text-text-success-primary shrink-0 mt-1">
                            Registered
                          </span>
                        )}
                      </div>
                    </div>

                    {regMktTrackerState === "registered" && (
                      <div className="mt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={() => setRegMktTrackerDismissed(true)}
                          className="inline-flex items-center rounded-lg bg-bg-brand-solid px-4 py-2.5 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover cursor-pointer"
                        >
                          Close
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            <TestPhonesCard
              phones={testPhones}
              onRemove={handleRemoveTestPhone}
              onInvite={handleInviteTestPhone}
              onEdit={handleEditTestPhone}
            />
          </div>
          )}
        </div>
      </div>
    );
  }

  /* ── All other states: two-column layout with right rail ── */
  return (
    <div>
      {messagesSectionHeader}

      <div
        className={
          askClaudeOpen
            ? "grid grid-cols-1 md:grid-cols-2 md:gap-10"
            : "grid grid-cols-1 min-[860px]:grid-cols-3 gap-6"
        }
      >
        {/* LEFT — setup instructions + messages */}
        <div className={askClaudeOpen ? "min-w-0" : "min-w-0 min-[860px]:col-span-2"}>
          <div ref={messageTopRef} />
          <SetupInstructions visible={setupVisible} />
          {messageList}
        </div>

        {askClaudeOpen ? (
          askClaudePanel
        ) : (
        /* RIGHT — Registration card stacked above the Test phones card.
            Sits in the same 3-col grid as the Registered state metrics row
            so rail widths match across states. */
        <div className="order-first min-[860px]:order-last min-[860px]:sticky min-[860px]:top-20 space-y-4">
          <div className="rounded-xl bg-gray-50 p-6">
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
                        {includeMarketing && (
                          <p className="pl-6 text-xs text-text-tertiary leading-relaxed">
                            You&apos;ll get access to marketing templates you can customize or write from scratch.
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                      Registration takes a few days.
                    </p>
                  )}
                  <p className="mt-4 text-sm font-semibold text-text-primary">
                    $49 registration + {includeMarketing && hasEin ? "$29" : "$19"}/mo
                  </p>
                  <p className="mt-1 text-xs text-text-tertiary">
                    500 messages included, then $8 per 500.
                    {!hasEin && (
                      <>
                        {" "}Add your EIN any time to enable optional marketing messages.{" "}
                        <button
                          type="button"
                          onClick={() => setEinExpanded(true)}
                          className="font-semibold text-text-brand-secondary hover:text-text-brand-secondary_hover transition duration-100 ease-linear cursor-pointer"
                        >Add EIN.</button>
                      </>
                    )}
                  </p>
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
            ) : (isPending || isChangesRequested) ? (
              upsellConfirmStep ? (
                /* Pricing confirmation step — takes over entire card */
                <div style={{ animation: "einCardFade 200ms ease-out" }}>
                  <h3 className="text-lg font-semibold text-text-primary">Confirm marketing messages</h3>
                  <p className="mt-3 text-sm text-text-secondary leading-relaxed">
                    Your plan updates from <span className="font-semibold text-text-primary">$19/mo</span> to <span className="font-semibold text-text-primary">$29/mo</span>. Registration typically takes a few days.
                  </p>
                  <p className="mt-1 text-xs text-text-tertiary">
                    Marketing messages share your 500 included messages.
                  </p>
                  <div className="mt-6 flex items-center justify-end gap-5">
                    <button
                      type="button"
                      onClick={() => setUpsellConfirmStep(false)}
                      className="text-sm text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => { setUpsellConfirmed(true); setUpsellConfirmStep(false); }}
                      className="inline-flex items-center rounded-lg bg-bg-brand-solid px-4 py-2.5 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover cursor-pointer"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              ) : upsellEinExpanded ? (
                /* Scenario 1: EIN verification card — takes over entire card */
                <div style={{ animation: "einCardFade 200ms ease-out" }}>
                  <EinInlineVerify
                    onSave={handleUpsellEinSave}
                    onCancel={handleUpsellEinCancel}
                  />
                </div>
              ) : (
              <div className="space-y-4">
                {/* Registration status — always "in review" in Pending state */}
                <div>
                  <div className="relative">
                    <h3 className="text-lg font-semibold text-text-primary inline-flex items-center gap-1.5">
                      Registration status
                      <button
                        type="button"
                        onClick={() => setRegTrackerTooltip((v) => !v)}
                        onBlur={() => setRegTrackerTooltip(false)}
                        className="cursor-pointer"
                      >
                        <InfoCircle className="size-4 text-text-quaternary" />
                      </button>
                    </h3>
                    {regTrackerTooltip && (
                      <div className="absolute left-0 top-full mt-1 z-[100] rounded-lg bg-[#333333] px-3 py-2 text-xs text-white shadow-lg min-w-[220px] max-w-[280px] whitespace-normal leading-relaxed">
                        Registration usually takes 2–3 days per message type.
                      </div>
                    )}
                  </div>

                  <div className="mt-3 space-y-2">
                    {/* Transactional row — always in review */}
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-sm font-semibold text-text-primary">{verticalName}</span>
                        <p className="text-xs text-text-tertiary mt-0.5">Submitted 3/17/2026</p>
                      </div>
                      <span className="inline-flex items-center rounded-full bg-bg-brand-secondary px-2 py-0.5 text-[10px] font-medium text-text-brand-secondary shrink-0 mt-1">
                        In review
                      </span>
                    </div>

                    {/* Marketing row — only if marketing was added, always in review */}
                    {hasMarketingRegistered && (
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-sm font-semibold text-text-primary">Marketing</span>
                          <p className="text-xs text-text-tertiary mt-0.5">Submitted 3/17/2026</p>
                        </div>
                        <span className="inline-flex items-center rounded-full bg-bg-brand-secondary px-2 py-0.5 text-[10px] font-medium text-text-brand-secondary shrink-0 mt-1">
                          In review
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Extended Review note — only in changes_requested state */}
                  {isChangesRequested && (
                    <p className="mt-4 text-sm text-text-tertiary leading-relaxed">
                      This is taking longer than usual. We&apos;ll email you at{" "}
                      <a
                        href="mailto:jen@glowstudio.com"
                        className="font-medium text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear"
                      >
                        jen@glowstudio.com
                      </a>{" "}
                      when there&apos;s an update.
                    </p>
                  )}
                </div>

                {/* Marketing upsell card — hidden after upsell confirmed */}
                {!upsellConfirmed && (
                  <div className="border-t border-border-secondary pt-4" style={{ animation: "einCardFade 200ms ease-out" }}>
                    <div>
                      <h3 className="text-base font-semibold text-text-primary">Add marketing messages</h3>
                      <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                        Promote new services, announce specials, and bring past clients back.
                      </p>
                      <p className="mt-3 text-sm font-semibold text-text-primary">
                        $29/mo instead of $19/mo.
                      </p>
                      {!hasEin ? (
                        <button
                          type="button"
                          onClick={() => setUpsellEinExpanded(true)}
                          className="mt-5 inline-flex items-center rounded-lg bg-bg-brand-solid px-4 py-2.5 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover cursor-pointer"
                        >
                          Add your EIN &rarr;
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setUpsellConfirmStep(true)}
                          className="mt-5 inline-flex items-center rounded-lg bg-bg-brand-solid px-4 py-2.5 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover cursor-pointer"
                        >
                          Add marketing messages &rarr;
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
              )
            ) : isRejected ? (
              /* Rejected state — per-type tracker rows with Not approved pills,
                 followed by the reason and contact email. No tooltip (nothing
                 to explain about timing), no marketing upsell. */
              <div>
                <h3 className="text-lg font-semibold text-text-primary">
                  Registration status
                </h3>

                <div className="mt-3 space-y-2">
                  {/* Transactional row */}
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-sm font-semibold text-text-primary">{verticalName}</span>
                      <p className="text-xs text-text-tertiary mt-0.5">Submitted 3/17/2026</p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-bg-error-secondary px-2 py-0.5 text-[10px] font-medium text-text-error-primary shrink-0 mt-1">
                      Not approved
                    </span>
                  </div>

                  {/* Marketing row — only if marketing was also registered */}
                  {hasMarketingRegistered && (
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-sm font-semibold text-text-primary">Marketing</span>
                        <p className="text-xs text-text-tertiary mt-0.5">Submitted 3/17/2026</p>
                      </div>
                      <span className="inline-flex items-center rounded-full bg-bg-error-secondary px-2 py-0.5 text-[10px] font-medium text-text-error-primary shrink-0 mt-1">
                        Not approved
                      </span>
                    </div>
                  )}
                </div>

                <p className="mt-4 text-sm text-text-tertiary leading-relaxed">
                  The business name on file didn&apos;t match your EIN records.
                </p>
                <p className="mt-2 text-sm text-text-tertiary leading-relaxed">
                  We know this is frustrating. Reply to your confirmation email or reach out at{" "}
                  <a
                    href="mailto:support@relaykit.ai"
                    className="font-medium text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear"
                  >
                    support@relaykit.ai
                  </a>{" "}
                  and we&apos;ll sort it out.
                </p>
              </div>
            ) : null}
          </div>
          <TestPhonesCard
            phones={testPhones}
            onRemove={handleRemoveTestPhone}
            onInvite={handleInviteTestPhone}
            onEdit={handleEditTestPhone}
          />
        </div>
        )}
      </div>
    </div>
  );
}
