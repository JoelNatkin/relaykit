"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { MESSAGES, CATEGORY_VARIANTS } from "@/data/messages";
import { useSession } from "@/context/session-context";
import { CatalogCard } from "@/components/catalog/catalog-card";
import { CatalogOptIn } from "@/components/catalog/catalog-opt-in";

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
  const { appId } = useParams<{ appId: string }>();
  const { state, setField } = useSession();

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

  function handleSend(messageId: string) {
    // Stub — future: send to verified phone
    console.log("Send message:", messageId);
  }

  return (
    <div>
      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_376px]">

        {/* LEFT — messages */}
        <div className="max-w-[540px]">
          {/* Messages header */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-text-primary">Messages</h2>
          </div>

          {/* Message cards */}
          <div className="space-y-5">
            {coreMessages.map((message) => (
              <CatalogCard
                key={message.id}
                message={message}
                categoryId={categoryId}
                state={state}
                variants={variants}
                onSend={handleSend}
              />
            ))}
          </div>
        </div>

        {/* RIGHT — opt-in only */}
        <div className="max-w-[376px] lg:ml-auto lg:self-start lg:sticky lg:top-20">
          <h2 className="text-lg font-semibold text-text-primary mb-1">
            Opt-in form
          </h2>
          <p className="mb-6 text-sm text-text-secondary">
            {isApproved
              ? "Your registered opt-in form. RelayKit keeps it current with your compliance site."
              : "Carriers require an opt-in form before you can send messages. RelayKit generates and maintains yours."}
          </p>
          <CatalogOptIn
            appName={state.appName}
            website={state.website}
            allMessages={coreMessages}
          />
        </div>
      </div>
    </div>
  );
}
