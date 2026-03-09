"use client";

import { useParams, redirect } from "next/navigation";
import { motion } from "framer-motion";
import { CATEGORIES } from "@/data/categories";
import { MESSAGES } from "@/data/messages";
import { PreviewAsInput } from "@/components/plan-builder/preview-as-input";
import { ConsentPreview } from "@/components/plan-builder/consent-preview";
import { ComplianceChecklist } from "@/components/plan-builder/compliance-checklist";

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

      <div className="mt-6 rounded-xl border border-dashed border-tertiary p-8 text-center text-quaternary">
        Message cards (coming soon)
      </div>
    </motion.div>
  );
}
