"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CATEGORIES } from "@/data/categories";
import { MESSAGES } from "@/data/messages";
import { useSession } from "@/context/session-context";
import { CatalogCard } from "@/components/catalog/catalog-card";
import { CatalogOptIn } from "@/components/catalog/catalog-opt-in";
import { formatMultipleCopyBlocks } from "@/lib/catalog-helpers";

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

/* ── Page component ── */

export default function MessagesPage() {
  const params = useParams<{ categoryId: string }>();
  const router = useRouter();
  const { state } = useSession();

  const category = CATEGORIES.find((c) => c.id === params.categoryId);
  const messages = category ? MESSAGES[category.id] : undefined;
  const shouldRedirect = !category || !messages || messages.length === 0;

  // View mode: preview (interpolated) or template (raw)
  const [viewMode, setViewMode] = useState<"preview" | "template">("preview");

  // Selected card IDs for multi-select copy
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const { copied, copy } = useCopyFeedback();

  useEffect(() => {
    if (shouldRedirect) router.replace("/choose");
  }, [shouldRedirect, router]);

  if (shouldRedirect) return null;

  // category is guaranteed defined after the redirect guard above
  const cat = category!;
  const allMessages = MESSAGES[cat.id] || [];

  function toggleSelect(messageId: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(messageId)) {
        next.delete(messageId);
      } else {
        next.add(messageId);
      }
      return next;
    });
  }

  function selectAll() {
    setSelectedIds(new Set(allMessages.map((m) => m.id)));
  }

  function clearSelection() {
    setSelectedIds(new Set());
  }

  const selectedMessages = allMessages.filter((m) => selectedIds.has(m.id));
  const hasSelection = selectedIds.size > 0;

  function handleCopySelected() {
    const text = formatMultipleCopyBlocks(selectedMessages, cat.id, state);
    copy(text, "selected");
  }

  function handleCopyAll() {
    const text = formatMultipleCopyBlocks(allMessages, cat.id, state);
    copy(text, "all");
  }

  return (
    <div className="mx-auto max-w-[720px] px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <p className="mb-1 text-xs font-medium uppercase tracking-widest text-text-tertiary">
          {cat.label}
        </p>
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
            Your messages — included with your registration
          </h1>
        </div>
        <div className="mt-2 flex items-center gap-3">
          <Link
            href={`/c/${cat.id}/plan`}
            className="text-xs font-medium text-text-quaternary hover:text-text-brand-secondary transition duration-100 ease-linear"
          >
            ← Edit plan
          </Link>
        </div>
      </div>

      {/* Toolbar: view toggle + copy actions */}
      <div className="mb-4 flex items-center justify-between">
        {/* Left: view toggle */}
        <div className="flex items-center rounded-lg border border-border-secondary bg-bg-primary shadow-xs">
          <button
            type="button"
            onClick={() => setViewMode("preview")}
            className={`px-3 py-1.5 text-xs font-medium transition duration-100 ease-linear cursor-pointer rounded-l-lg ${
              viewMode === "preview"
                ? "bg-bg-active text-text-primary"
                : "text-text-tertiary hover:text-text-secondary"
            }`}
          >
            Preview
          </button>
          <button
            type="button"
            onClick={() => setViewMode("template")}
            className={`px-3 py-1.5 text-xs font-medium transition duration-100 ease-linear cursor-pointer rounded-r-lg ${
              viewMode === "template"
                ? "bg-bg-active text-text-primary"
                : "text-text-tertiary hover:text-text-secondary"
            }`}
          >
            Template
          </button>
        </div>

        {/* Right: copy actions */}
        <div className="flex items-center gap-2">
          {hasSelection && (
            <>
              <span className="text-xs text-text-tertiary">
                {selectedIds.size} selected
              </span>
              <button
                type="button"
                onClick={clearSelection}
                className="text-xs text-text-quaternary hover:text-text-secondary transition duration-100 ease-linear cursor-pointer"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={handleCopySelected}
                className="rounded-lg border border-border-secondary bg-bg-primary px-3 py-1.5 text-xs font-medium text-text-secondary shadow-xs hover:bg-bg-secondary transition duration-100 ease-linear cursor-pointer"
              >
                {copied === "selected" ? "Copied ✓" : "Copy selected"}
              </button>
            </>
          )}
          <button
            type="button"
            onClick={selectAll}
            className="text-xs text-text-quaternary hover:text-text-secondary transition duration-100 ease-linear cursor-pointer"
          >
            Select all
          </button>
          <button
            type="button"
            onClick={handleCopyAll}
            className="rounded-lg border border-border-secondary bg-bg-primary px-3 py-1.5 text-xs font-medium text-text-secondary shadow-xs hover:bg-bg-secondary transition duration-100 ease-linear cursor-pointer"
          >
            {copied === "all" ? "Copied ✓" : "Copy all"}
          </button>
        </div>
      </div>

      {/* Message cards — flat catalog, no tier grouping */}
      <div className="space-y-3">
        {allMessages.map((message) => (
          <CatalogCard
            key={message.id}
            message={message}
            categoryId={cat.id}
            state={state}
            isSelected={selectedIds.has(message.id)}
            onToggleSelect={toggleSelect}
            globalViewMode={viewMode}
          />
        ))}
      </div>

      {/* Opt-in consent preview */}
      <div className="mt-10">
        <CatalogOptIn
          appName={state.appName}
          website={state.website}
          allMessages={allMessages}
          selectedIds={selectedIds}
        />
      </div>
    </div>
  );
}
