"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { CATEGORIES } from "@/data/categories";
import { MESSAGES } from "@/data/messages";
import { PreviewAsInput } from "@/components/plan-builder/preview-as-input";
import { ConsentPreview } from "@/components/plan-builder/consent-preview";
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
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* Left column — sticky on desktop */}
        <div className="lg:self-start lg:sticky lg:top-20">
          <h2 className="mb-3 text-xl font-semibold text-text-primary">
            Sample opt-in form
          </h2>
          <ConsentPreview categoryId={category.id} />
        </div>

        {/* Right column — message cards */}
        <div className="max-w-lg">
          <div className="lg:sticky lg:top-14 lg:z-10">
            <h2 className="mb-3 text-xl font-semibold text-text-primary lg:bg-bg-primary lg:pt-6 lg:pb-3 lg:border-b lg:border-border-secondary lg:-mt-6">
              Your messages
            </h2>
          </div>
          <div className="space-y-8">
            {core.length > 0 && (
              <MessageTier tier="core" messages={core} />
            )}
            {alsoCovered.length > 0 && (
              <MessageTier tier="also_covered" messages={alsoCovered} />
            )}
            {expansion.length > 0 && (
              <MessageTier
                tier="expansion"
                messages={expansion}
                title="Marketing & promotion messages"
                titleRight="+$10/mo"
                subtitle="Your users check an extra box when they sign up. We handle the rest."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
