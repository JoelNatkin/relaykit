"use client";

import { motion } from "framer-motion";
import type { Category } from "@/data/categories";

interface CategoryTileProps {
  category: Category;
  onClick: () => void;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function CategoryTile({ category, onClick }: CategoryTileProps) {
  return (
    <motion.button
      variants={itemVariants}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      onClick={onClick}
      className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow duration-150 hover:border-brand-200 hover:shadow-md"
    >
      <span className="text-3xl">{category.icon}</span>
      <span className="font-semibold text-center">{category.label}</span>
      <span className="text-sm text-gray-500 text-center">
        {category.description}
      </span>
    </motion.button>
  );
}
