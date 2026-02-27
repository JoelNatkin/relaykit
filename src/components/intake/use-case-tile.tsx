"use client";

import type { FC } from "react";
import { cx } from "@/utils/cx";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";

interface UseCaseTileProps {
  id: string;
  label: string;
  description: string;
  icon: FC<{ className?: string }>;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const UseCaseTile = ({
  id,
  label,
  description,
  icon,
  isSelected,
  onSelect,
}: UseCaseTileProps) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={cx(
        "flex flex-col items-start gap-3 rounded-xl border p-4 text-left transition duration-100 ease-linear",
        "hover:bg-primary_hover",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
        isSelected
          ? "border-brand bg-brand-secondary"
          : "border-secondary bg-primary",
      )}
    >
      <FeaturedIcon
        icon={icon}
        size="md"
        color="gray"
        theme="light"
      />
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-primary">{label}</span>
        <span className="text-sm text-tertiary">{description}</span>
      </div>
    </button>
  );
};
