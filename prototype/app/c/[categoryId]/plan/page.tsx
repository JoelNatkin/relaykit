"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { CATEGORIES } from "@/data/categories";
import { MESSAGES } from "@/data/messages";
import { PreviewAsInput } from "@/components/plan-builder/preview-as-input";
import { ConsentPreview } from "@/components/plan-builder/consent-preview";
import { ComplianceChecklist } from "@/components/plan-builder/compliance-checklist";
import { MessageTier } from "@/components/plan-builder/message-tier";

export default function PlanPage() {
  const params = useParams<{ categoryId: string }>();
  const router = useRouter();
  const category = CATEGORIES.find((c) => c.id === params.categoryId);
  const messages = category ? MESSAGES[category.id] : undefined;

  const shouldRedirect = !category || !messages || messages.length === 0;

  useEffect(() => {
    if (shouldRedirect) router.replace("/choose");
  }, [shouldRedirect, router]);

  if (shouldRedirect) return null;

  const Icon = category.icon;
  const categoryMessages = MESSAGES[category.id] || [];
  const core = categoryMessages.filter((m) => m.tier === "core");
  const alsoCovered = categoryMessages.filter((m) => m.tier === "also_covered");
  const expansion = categoryMessages.filter((m) => m.tier === "expansion");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border-secondary bg-bg-primary shadow-xs">
          <Icon className="size-5 text-fg-quaternary" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary">
          Your {category.label.toLowerCase()} message plan
        </h1>
      </div>

      <PreviewAsInput />

      {/* Two-column layout: left sticky preview, right scrollable messages */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        {/* Left column — sticky on desktop */}
        <div className="lg:self-start lg:sticky lg:top-20 space-y-6">
          <div>
            <h2 className="mb-3 text-xl font-semibold text-text-primary">
              What your users see
            </h2>
            <ConsentPreview categoryId={category.id} />
          </div>

          <ComplianceChecklist categoryId={category.id} />
        </div>

        {/* Right column — message cards */}
        <div>
          <h2 className="mb-3 text-xl font-semibold text-text-primary lg:sticky lg:top-20 lg:z-10 lg:bg-bg-primary lg:pb-3 lg:border-b lg:border-border-secondary">
            Your messages
          </h2>
          <div className="space-y-8">
            {core.length > 0 && (
              <MessageTier
                tier="core"
                messages={core}
                title="CORE MESSAGES"
                subtitle="On by default — most apps need these"
              />
            )}
            {alsoCovered.length > 0 && (
              <MessageTier
                tier="also_covered"
                messages={alsoCovered}
                title="ALSO COVERED"
                subtitle="Your registration includes these — turn on what you need"
              />
            )}
            {expansion.length > 0 && (
              <MessageTier
                tier="expansion"
                messages={expansion}
                title="⭐ NEEDS ADDITIONAL REGISTRATION"
                subtitle="We register a separate campaign alongside yours"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
