"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
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
  const { appId } = useParams<{ appId: string }>();
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
      <div className="mb-2 text-center">
        <h2 className="text-lg font-semibold text-text-primary">Your opt-in form</h2>
      </div>

      {/* Context line */}
      <p className="mb-8 text-sm text-text-secondary text-center">
        RelayKit generates and maintains this for you. Your AI tool builds it into your app.
      </p>

      {/* Opt-in form preview */}
      <CatalogOptIn
        appName={state.appName}
        website={state.website}
        allMessages={coreMessages}
      />

      {/* Continue */}
      <div className="mt-8 flex flex-col items-center">
        <Link
          href={`/apps/${appId}/messages`}
          className="inline-flex rounded-lg bg-bg-brand-solid px-5 py-2.5 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover"
        >
          Continue
        </Link>
        <p className="mt-3 text-xs text-text-quaternary">
          Signup page coming soon
        </p>
      </div>
    </div>
  );
}
