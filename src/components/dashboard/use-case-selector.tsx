"use client";

import { useState, useTransition } from "react";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import {
  Calendar,
  Package,
  Shield01,
  MessageChatCircle,
  Announcement02,
  Users01,
  Globe01,
  ClipboardCheck,
  SearchLg,
} from "@untitledui/icons";
import type { UseCaseId } from "@/lib/intake/use-case-data";
import type { FC } from "react";

interface UseCaseTile {
  id: UseCaseId;
  label: string;
  description: string;
  icon: FC<{ className?: string }>;
}

// Labels and descriptions use plain language (Experience Principles:
// "Help them recognize themselves. Use plain language, not category jargon.")
const USE_CASE_TILES: UseCaseTile[] = [
  {
    id: "appointments",
    label: "Appointment reminders",
    description: "Confirmations, reminders, rescheduling",
    icon: Calendar,
  },
  {
    id: "orders",
    label: "Order & delivery updates",
    description: "Shipping notifications, delivery status",
    icon: Package,
  },
  {
    id: "verification",
    label: "Verification codes",
    description: "OTP, 2FA, login codes",
    icon: Shield01,
  },
  {
    id: "support",
    label: "Customer support",
    description: "Two-way support conversations",
    icon: MessageChatCircle,
  },
  {
    id: "marketing",
    label: "Marketing & promos",
    description: "Offers, promotions, announcements",
    icon: Announcement02,
  },
  {
    id: "internal",
    label: "Team & internal alerts",
    description: "Staff notifications, internal ops",
    icon: Users01,
  },
  {
    id: "community",
    label: "Community & groups",
    description: "Group messaging, community updates",
    icon: Globe01,
  },
  {
    id: "waitlist",
    label: "Waitlist & reservations",
    description: "Waitlist positions, reservation holds, availability alerts",
    icon: ClipboardCheck,
  },
  {
    id: "exploring",
    label: "Just exploring",
    description: "Try SMS patterns from multiple use cases",
    icon: SearchLg,
  },
];

interface UseCaseSelectorProps {
  onSelect: (useCase: UseCaseId) => void;
}

export function UseCaseSelector({ onSelect }: UseCaseSelectorProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedId, setSelectedId] = useState<UseCaseId | null>(null);

  function handleSelect(useCase: UseCaseId) {
    setSelectedId(useCase);
    startTransition(() => {
      onSelect(useCase);
    });
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-primary">
          What are you building?
        </h2>
        <p className="mt-1 text-sm text-tertiary">
          Pick the closest match — you can always change it.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {USE_CASE_TILES.map((tile) => {
          const isSelected = selectedId === tile.id;

          return (
            <button
              key={tile.id}
              type="button"
              disabled={isPending}
              onClick={() => handleSelect(tile.id)}
              className={`
                flex flex-col items-start gap-3 rounded-xl border p-4
                text-left transition duration-100 ease-linear
                ${
                  isSelected
                    ? "border-brand bg-brand-primary_alt ring-1 ring-brand"
                    : "border-secondary bg-primary hover:border-brand hover:bg-primary_hover"
                }
                ${isPending ? "opacity-60" : ""}
              `}
            >
              <FeaturedIcon
                icon={tile.icon}
                size="md"
                color={isSelected ? "brand" : "gray"}
                theme="light"
              />
              <div>
                <p className="text-sm font-medium text-primary">
                  {tile.label}
                </p>
                <p className="mt-0.5 text-xs text-tertiary">
                  {tile.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
