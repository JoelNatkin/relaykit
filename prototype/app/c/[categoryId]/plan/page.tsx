"use client";

import { useParams, redirect } from "next/navigation";
import { motion } from "framer-motion";
import { CATEGORIES } from "@/data/categories";
import { MESSAGES } from "@/data/messages";
import { PreviewAsInput } from "@/components/plan-builder/preview-as-input";
import { ConsentPreview } from "@/components/plan-builder/consent-preview";
import { ComplianceChecklist } from "@/components/plan-builder/compliance-checklist";
import { MessageTier } from "@/components/plan-builder/message-tier";

export default function PlanPage() {
  const params = useParams<{ categoryId: string }>();
  const category = CATEGORIES.find((c) => c.id === params.categoryId);
  const messages = category ? MESSAGES[category.id] : undefined;

  if (!category || !messages || messages.length === 0) {
    redirect("/choose");
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-2xl px-4 py-8"
    >
      <h1 className="mb-6 text-2xl font-bold text-primary">
        {category.icon} Your {category.label} message plan
      </h1>

      <PreviewAsInput />

      <ConsentPreview categoryId={category.id} />

      <ComplianceChecklist categoryId={category.id} />

      {(() => {
        const categoryMessages = MESSAGES[category.id] || [];
        const core = categoryMessages.filter((m) => m.tier === "core");
        const alsoCovered = categoryMessages.filter(
          (m) => m.tier === "also_covered"
        );
        const expansion = categoryMessages.filter(
          (m) => m.tier === "expansion"
        );

        return (
          <div className="mt-6 space-y-8">
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
        );
      })()}
    </motion.div>
  );
}
