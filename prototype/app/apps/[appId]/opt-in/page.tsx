"use client";

import { useEffect } from "react";
import { MESSAGES } from "@/data/messages";
import { useSession } from "@/context/session-context";
import { CatalogOptIn } from "@/components/catalog/catalog-opt-in";

/* ── localStorage personalization ── */

const PERSONALIZE_KEY = "relaykit_personalize";

function loadPersonalization() {
  try {
    const stored = localStorage.getItem(PERSONALIZE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // localStorage unavailable
  }
  return { appName: "", website: "", serviceType: "" };
}

/* ── Page ── */

export default function OptInPreviewPage() {
  const { state, setField } = useSession();

  const categoryId = state.selectedCategory || "appointments";
  const allMessages = MESSAGES[categoryId] || [];
  const coreMessages = allMessages.filter((m) => m.tier !== "expansion");

  // Load personalization from localStorage on mount
  useEffect(() => {
    const saved = loadPersonalization();
    if (saved.appName) setField("appName", saved.appName);
    if (saved.website) setField("website", saved.website);
    if (saved.serviceType) setField("serviceType", saved.serviceType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {/* Heading */}
      <div className="mb-2">
        <h2 className="text-lg font-semibold text-text-primary">Built into your app, styled to match</h2>
      </div>

      {/* Context line */}
      <p className="mb-8 text-sm text-text-secondary">
        Your AI tool creates your opt-in form, styled for your app. Always up to date.
      </p>

      {/* Opt-in form preview */}
      <div className="max-w-[400px]">
        <CatalogOptIn
          appName={state.appName}
          website={state.website}
          allMessages={coreMessages}
        />
      </div>
    </div>
  );
}
