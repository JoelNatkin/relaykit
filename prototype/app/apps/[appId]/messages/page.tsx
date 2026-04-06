"use client";

import { useEffect, useState } from "react";
import { Phone01 } from "@untitledui/icons";
import { MESSAGES, CATEGORY_VARIANTS } from "@/data/messages";
import { useSession } from "@/context/session-context";
import { CatalogCard } from "@/components/catalog/catalog-card";
import { loadWizardData } from "@/lib/wizard-storage";

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

  // Check if EIN was provided in wizard flow
  const [hasEin, setHasEin] = useState(false);
  const [showMarketingTooltip, setShowMarketingTooltip] = useState(false);
  useEffect(() => {
    const data = loadWizardData();
    setHasEin(!!data.ein);
  }, []);

  // Single-card editing: clicking a new card's pencil closes any open edit.
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

  function handleSend(messageId: string) {
    // Stub — future: send to verified phone
    console.log("Send message:", messageId);
  }

  const phoneIcon = <Phone01 className="size-[18px]" />;

  return (
    <div>
      {/* Heading — left-aligned in centered container */}
      <div className={isWizard ? "mb-2" : "mb-6"}>
        {isWizard ? (
          <h1 className="text-2xl font-bold text-text-primary">
            Here{"\u2019"}s what your app will send
          </h1>
        ) : (
          <h2 className="text-lg font-semibold text-text-primary">Messages</h2>
        )}
      </div>

      {/* Wizard body text */}
      {isWizard && (
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
                  : "Marketing messages require a business tax ID (EIN). You can add one anytime in settings to unlock them."}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Message cards */}
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
    </div>
  );
}
