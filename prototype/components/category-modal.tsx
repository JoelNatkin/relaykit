"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "@/context/session-context";
import type { Category } from "@/data/categories";

interface CategoryModalProps {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CategoryModal({ category, isOpen, onClose }: CategoryModalProps) {
  const router = useRouter();
  const { setCategory } = useSession();

  function handleContinue() {
    if (!category) return;
    setCategory(category.id);
    router.push(`/c/${category.id}/setup`);
    onClose();
  }

  return (
    <AnimatePresence>
      {isOpen && category && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50"
          />

          {/* Modal container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <motion.div
              key="modal"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="pointer-events-auto w-full max-w-md rounded-2xl bg-white p-8 shadow-xl"
            >
              <div className="text-4xl mb-4">{category.icon}</div>
              <h2 className="text-xl font-bold mb-3">{category.label}</h2>
              <p className="text-gray-600 mb-4">{category.modalContent}</p>
              <p className="text-sm text-gray-400 mb-6">{category.coversLine}</p>

              <button
                onClick={handleContinue}
                className="w-full rounded-lg bg-brand-600 py-3 font-medium text-white hover:bg-brand-700 transition duration-100 ease-linear"
              >
                This is me &rarr; Continue
              </button>

              <button
                onClick={onClose}
                className="mt-3 w-full cursor-pointer text-center text-sm text-gray-500"
              >
                &larr; Back
              </button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
