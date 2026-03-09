"use client";

import { useSession } from "@/context/session-context";
import { CATEGORIES } from "@/data/categories";

export function TopNav() {
  const { state } = useSession();

  const categoryLabel = state.selectedCategory
    ? CATEGORIES.find((c) => c.id === state.selectedCategory)?.label ?? null
    : null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
      {/* Left: wordmark + category */}
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-gray-900">RelayKit</span>
        {categoryLabel && (
          <span className="text-sm text-gray-400">· {categoryLabel}</span>
        )}
      </div>

      {/* Center: empty for now */}
      <div />

      {/* Right: Register button */}
      <button
        type="button"
        onClick={() => alert("Registration flow coming soon.")}
        className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition duration-100 ease-linear hover:bg-brand-700"
      >
        Register &rarr;
      </button>
    </nav>
  );
}
