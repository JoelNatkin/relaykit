"use client";

import { useRouter } from "next/navigation";
import { XClose } from "@untitledui/icons";
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

  const Icon = category?.icon;

  if (!isOpen || !category || !Icon) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/50"
      />

      {/* Modal container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto relative w-full max-w-md rounded-2xl bg-bg-primary p-8 shadow-xl">
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-fg-quaternary transition duration-100 ease-linear hover:text-fg-secondary hover:bg-bg-secondary"
            aria-label="Close"
          >
            <XClose className="size-5" />
          </button>

          {/* Icon */}
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-border-secondary bg-bg-primary shadow-xs">
            <Icon className="size-6 text-fg-quaternary" />
          </div>

          <h2 className="text-xl font-bold text-text-primary mb-2">{category.label}</h2>

          {/* Covers line — the specifics people want to see */}
          <p className="text-sm text-text-tertiary mb-3">{category.coversLine}</p>

          {/* Description */}
          <p className="text-sm text-text-quaternary mb-6">{category.modalContent}</p>

          <button
            onClick={handleContinue}
            className="w-full rounded-lg bg-bg-brand-solid py-3 font-medium text-text-white hover:bg-bg-brand-solid_hover transition duration-100 ease-linear"
          >
            Continue &rarr;
          </button>
        </div>
      </div>
    </>
  );
}
