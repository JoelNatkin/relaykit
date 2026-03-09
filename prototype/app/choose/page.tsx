"use client";

import { useState } from "react";
import { CATEGORIES, Category } from "@/data/categories";
import { CategoryTile } from "@/components/category-tile";
import { CategoryModal } from "@/components/category-modal";

export default function ChoosePage() {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  function handleTileClick(category: Category) {
    if (!category.modalContent) {
      return;
    }
    setActiveCategory(category);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-text-primary">What are you building?</h1>
        <p className="mt-2 text-text-tertiary">
          Pick your primary use case &mdash; you can always change this later.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((category) => (
          <CategoryTile
            key={category.id}
            category={category}
            onClick={() => handleTileClick(category)}
          />
        ))}
      </div>

      <CategoryModal
        category={activeCategory}
        isOpen={activeCategory !== null}
        onClose={() => setActiveCategory(null)}
      />
    </div>
  );
}
