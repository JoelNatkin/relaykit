"use client";

import { usePathname } from "next/navigation";
import { useSession } from "@/context/session-context";
import { CATEGORIES } from "@/data/categories";

export function TopNav() {
  const { state } = useSession();
  const pathname = usePathname();

  // Don't show selected category on the chooser page — nothing's been chosen yet
  const isChooserPage = pathname === "/" || pathname === "/choose";

  const category = state.selectedCategory
    ? CATEGORIES.find((c) => c.id === state.selectedCategory)
    : null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-border-secondary bg-bg-primary px-6">
      {/* Left: wordmark + category */}
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-text-primary">RelayKit</span>
        {!isChooserPage && category && (
          <span className="text-sm font-medium text-text-tertiary">
            · {category.label}
          </span>
        )}
      </div>

      {/* Center: empty for now */}
      <div />

      {/* Right: Register button */}
      <button
        type="button"
        onClick={() => alert("Registration flow coming soon.")}
        className="rounded-lg bg-bg-brand-solid px-4 py-2 text-sm font-medium text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover"
      >
        Register &rarr;
      </button>
    </nav>
  );
}
