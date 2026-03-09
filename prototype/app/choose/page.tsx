"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CATEGORIES, Category } from "@/data/categories";
import { CategoryTile } from "@/components/category-tile";
import { CategoryModal } from "@/components/category-modal";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export default function ChoosePage() {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  function handleTileClick(category: Category) {
    // Categories with no modal content (e.g. "Just exploring") don't open a modal
    if (!category.modalContent) {
      return;
    }
    setActiveCategory(category);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold">What are you building?</h1>
        <p className="mt-2 text-secondary">
          Pick your primary use case &mdash; you can always change this later.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {CATEGORIES.map((category) => (
          <CategoryTile
            key={category.id}
            category={category}
            onClick={() => handleTileClick(category)}
          />
        ))}
      </motion.div>

      <CategoryModal
        category={activeCategory}
        isOpen={activeCategory !== null}
        onClose={() => setActiveCategory(null)}
      />
    </div>
  );
}
