"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  XClose,
  Sliders04,
  ArrowDown,
} from "@untitledui/icons";
import { MESSAGES, CATEGORY_VARIANTS } from "@/data/messages";
import { useSession } from "@/context/session-context";
import { CatalogCard } from "@/components/catalog/catalog-card";
import { CatalogOptIn } from "@/components/catalog/catalog-opt-in";
import { formatMultipleCopyBlocks } from "@/lib/catalog-helpers";


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

function savePersonalization(data: PersonalizeData) {
  try {
    localStorage.setItem(PERSONALIZE_KEY, JSON.stringify(data));
  } catch {
    // localStorage unavailable
  }
}

/* ── Copy feedback hook ── */

function useCopyFeedback() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = useCallback(async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      // Clipboard API unavailable
    }
  }, []);

  return { copied, copy };
}

/* ── Inline icons ── */

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function CodeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function ClipboardIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

/* ── Personalize slideout ── */

function PersonalizeSlideout({
  isOpen,
  onClose,
  data,
  onChange,
}: {
  isOpen: boolean;
  onClose: () => void;
  data: PersonalizeData;
  onChange: (data: PersonalizeData) => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 top-14 z-40 bg-white/50 transition-opacity duration-200"
          onClick={onClose}
        />
      )}
      <div
        ref={panelRef}
        className={`fixed top-14 right-0 z-50 h-[calc(100%-3.5rem)] w-full max-w-sm bg-bg-primary border-l border-border-secondary shadow-xl transition-transform duration-200 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border-secondary px-6 py-4">
          <h2 className="text-base font-semibold text-text-primary">
            Personalize messages
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-fg-quaternary hover:text-fg-secondary transition duration-100 ease-linear cursor-pointer"
            aria-label="Close"
          >
            <XClose className="size-5" />
          </button>
        </div>
        <div className="px-6 py-6 space-y-5">
          <p className="text-sm text-text-tertiary">
            See how messages look with your details.
          </p>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">App / business name</label>
            <input
              type="text"
              value={data.appName}
              placeholder="Enter business name"
              onChange={(e) => onChange({ ...data, appName: e.target.value })}
              className="w-full rounded-lg border border-border-primary bg-bg-primary px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-placeholder shadow-xs focus:border-border-brand focus:outline-none transition duration-100 ease-linear"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">Website URL</label>
            <div className="flex items-center rounded-lg border border-border-primary bg-bg-primary shadow-xs focus-within:border-border-brand transition duration-100 ease-linear">
              <span className="pl-3.5 text-sm text-text-quaternary select-none">https://</span>
              <input
                type="text"
                value={data.website}
                placeholder="Enter URL"
                onChange={(e) => onChange({ ...data, website: e.target.value })}
                className="flex-1 bg-transparent px-1 py-2.5 text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">Service type</label>
            <input
              type="text"
              value={data.serviceType}
              placeholder="Enter service type"
              onChange={(e) => onChange({ ...data, serviceType: e.target.value })}
              className="w-full rounded-lg border border-border-primary bg-bg-primary px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-placeholder shadow-xs focus:border-border-brand focus:outline-none transition duration-100 ease-linear"
            />
          </div>
        </div>
      </div>
    </>
  );
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

  const [showPersonalize, setShowPersonalize] = useState(false);
  const [activeVariant, setActiveVariant] = useState("standard");
  const [viewMode, setViewMode] = useState<"preview" | "template">("template");
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  const { copy } = useCopyFeedback();

  // Load personalization from localStorage on mount — switch to preview if data exists
  // In Approved state, use registered values instead
  useEffect(() => {
    if (isApproved) {
      setField("appName", REGISTERED_VALUES.appName);
      setField("website", REGISTERED_VALUES.website);
      setField("serviceType", REGISTERED_VALUES.serviceType);
      setViewMode("preview");
    } else {
      const saved = loadPersonalization();
      if (saved.appName) setField("appName", saved.appName);
      if (saved.website) setField("website", saved.website);
      if (saved.serviceType) setField("serviceType", saved.serviceType);
      if (saved.appName || saved.website || saved.serviceType) {
        setViewMode("preview");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApproved]);

  function handlePersonalizeChange(data: PersonalizeData) {
    setField("appName", data.appName);
    setField("website", data.website);
    setField("serviceType", data.serviceType);
    savePersonalization(data);
  }

  const personalizeData: PersonalizeData = {
    appName: state.appName,
    website: state.website,
    serviceType: state.serviceType,
  };

  // Split messages
  const coreMessages = allMessages.filter((m) => m.tier !== "expansion");
  const expansionMessages = allMessages.filter((m) => m.tier === "expansion");

  function getActiveTemplate(msg: (typeof allMessages)[number]): string | undefined {
    if (activeVariant === "standard" || !msg.variants) return undefined;
    return msg.variants[activeVariant] ?? undefined;
  }

  function handleCopyAll() {
    const text = formatMultipleCopyBlocks(coreMessages, categoryId, state);
    copy(text, "all");
  }

  const variantLabels: Record<string, string> = {
    standard: "Brand-first",
    "action-first": "Action-first",
    "context-first": "Context-first",
  };

  return (
    <div>
      {!isApproved && (
        <PersonalizeSlideout
          isOpen={showPersonalize}
          onClose={() => setShowPersonalize(false)}
          data={personalizeData}
          onChange={handlePersonalizeChange}
        />
      )}

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_376px]">

        {/* LEFT — messages */}
        <div className="max-w-[500px]">
          {/* Messages header */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-text-primary">Messages</h2>
            <p className="mt-1 text-sm text-text-secondary">
              {isApproved
                ? "You're live. These are your registered messages — add new ones, adapt existing ones, or have your AI tool riff on them. Compliance scanning keeps everything clean."
                : "Every message is pre-written for your use case and formatted for carriers. Copy them, adapt them, or let your AI tool use them as a starting point."}
            </p>
          </div>

          {/* Style variant pills + marketing pill */}
          {(variants && variants.length > 1 || expansionMessages.length > 0) && (
            <div className="mt-4 mb-5 flex flex-wrap items-center gap-2">
              {variants && variants.length > 1 && variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setActiveVariant(v.id)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition duration-100 ease-linear ${
                    activeVariant === v.id
                      ? "bg-bg-brand-secondary text-text-brand-secondary"
                      : "bg-bg-secondary text-text-secondary hover:bg-bg-secondary_hover"
                  }`}
                >
                  {variantLabels[v.id] || v.label}
                </button>
              ))}
              {expansionMessages.length > 0 && (
                <button
                  type="button"
                  onClick={() => document.getElementById("marketing-section")?.scrollIntoView({ behavior: "smooth" })}
                  className="rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap bg-bg-secondary text-text-secondary hover:bg-bg-secondary_hover transition duration-100 ease-linear cursor-pointer inline-flex items-center gap-1"
                >
                  Marketing
                  <ArrowDown className="size-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Toolbar row */}
          {isApproved ? (
            <div className="mb-3 flex items-center gap-5">
              <button
                type="button"
                onClick={() => setViewMode(viewMode === "preview" ? "template" : "preview")}
                className="flex items-center gap-1.5 text-sm text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear cursor-pointer"
              >
                {viewMode === "preview" ? <CodeIcon /> : <EyeIcon />}
                <span>{viewMode === "preview" ? "Show template" : "Show preview"}</span>
              </button>
              <button
                type="button"
                onClick={handleCopyAll}
                className="flex items-center gap-1.5 text-sm text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear cursor-pointer"
              >
                <ClipboardIcon className="w-3.5 h-3.5" />
                <span>Copy all</span>
              </button>
            </div>
          ) : (
            <div className="mb-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowPersonalize(true)}
                className="flex items-center gap-1.5 text-sm font-semibold text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear cursor-pointer"
              >
                <Sliders04 className="size-4" />
                Personalize
              </button>
              <div className="flex items-center gap-5">
                <button
                  type="button"
                  onClick={() => {
                    const hasData = !!(state.appName || state.website || state.serviceType);
                    if (viewMode === "template" && !hasData) {
                      setShowPersonalize(true);
                      return;
                    }
                    setViewMode(viewMode === "preview" ? "template" : "preview");
                  }}
                  className="flex items-center gap-1.5 text-sm text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear cursor-pointer"
                >
                  {viewMode === "preview" ? <CodeIcon /> : <EyeIcon />}
                  <span>{viewMode === "preview" ? "Show template" : "Show preview"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyAll}
                  className="flex items-center gap-1.5 text-sm text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear cursor-pointer"
                >
                  <ClipboardIcon className="w-3.5 h-3.5" />
                  <span>Copy all</span>
                </button>
              </div>
            </div>
          )}

          {/* Core message cards */}
          <div className="space-y-3">
            {coreMessages.map((message, i) => (
              <CatalogCard
                key={message.id}
                message={message}
                categoryId={categoryId}
                state={state}
                globalViewMode={viewMode}
                activeTemplate={getActiveTemplate(message)}
                isPromptsOpen={expandedCardId === message.id}
                onTogglePrompts={() =>
                  setExpandedCardId((prev) =>
                    prev === message.id ? null : message.id
                  )
                }
                onRequestPersonalize={() => setShowPersonalize(true)}
                cardNumber={i + 1}
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
