"use client";

import { useEffect, useState } from "react";
import { Phone01 } from "@untitledui/icons";
import { MESSAGES, CATEGORY_VARIANTS } from "@/data/messages";
import { useSession } from "@/context/session-context";
import { CatalogCard } from "@/components/catalog/catalog-card";

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

  const isWizard = state.registrationState === "default";
  const isApproved = state.registrationState === "approved";
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
        <h2 className="text-lg font-semibold text-text-primary">Messages</h2>
      </div>

      {/* Wizard body text */}
      {isWizard && (
        <p className="mb-8 text-sm text-text-tertiary">
          These are your messages — ready to use. Edit any message to match your voice.
        </p>
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
              sendIcon={isWizard ? phoneIcon : undefined}
              isEditing={editingMessageId === message.id}
              onEditRequest={setEditingMessageId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
