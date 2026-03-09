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

  const categoryMessages = MESSAGES[category.id] || [];
  const core = categoryMessages.filter((m) => m.tier === "core");
  const alsoCovered = categoryMessages.filter((m) => m.tier === "also_covered");
  const expansion = categoryMessages.filter((m) => m.tier === "expansion");

  return (
    <div className="mx-auto max-w-[1000px] px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <p className="mb-1 text-xs font-medium uppercase tracking-widest text-text-tertiary">
          {category.label}
        </p>
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
          Your message plan
        </h1>
      </div>

      <PreviewAsInput />

      {/* Two-column layout: left sticky preview, right scrollable messages */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-[45fr_55fr]">
        {/* Left column — sticky on desktop */}
        <div className="mx-auto w-full max-w-[500px] md:mx-0 md:max-w-none md:self-start md:sticky md:top-20">
          <h2 className="mb-3 text-xl font-semibold text-text-primary">
            Sample opt-in form
          </h2>
          <ConsentPreview categoryId={category.id} formHeading={category.formHeading} />
        </div>

        {/* Right column — message cards */}
        <div className="mx-auto w-full max-w-[500px] md:mx-0 md:max-w-none">
          <div className="md:sticky md:top-14 md:z-10">
            <h2 className="mb-3 text-xl font-semibold text-text-primary md:bg-bg-primary md:pt-6 md:pb-3 md:border-b md:border-border-secondary md:-mt-6">
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
