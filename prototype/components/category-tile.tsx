"use client";

import type { Category } from "@/data/categories";

interface CategoryTileProps {
  category: Category;
  onClick: () => void;
}

export function CategoryTile({ category, onClick }: CategoryTileProps) {
  const Icon = category.icon;

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-start gap-3 rounded-xl border border-border-secondary bg-bg-primary p-5 text-left shadow-xs transition-shadow duration-150 hover:bg-bg-primary_hover hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
    >
      {/* Featured icon — matches production FeaturedIcon gray/light */}
      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border-secondary bg-bg-primary shadow-xs">
        <Icon className="size-5 text-fg-quaternary" />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-text-primary">
          {category.label}
        </span>
        <span className="text-sm text-text-tertiary">
          {category.description}
        </span>
      </div>
    </button>
  );
}
