"use client";

import { useState } from "react";
import {
  Calendar,
  Package,
  Shield01,
  MessageChatCircle,
  Announcement02,
  Users01,
  Globe01,
  ClipboardCheck,
  ArrowRight,
} from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { UseCaseTile } from "@/components/intake/use-case-tile";

const USE_CASES = [
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
    description: "Booking confirmations, waitlist updates",
    icon: ClipboardCheck,
  },
] as const;

export default function StartPage() {
  const [selectedUseCase, setSelectedUseCase] = useState<string | null>(null);

  return (
    <div className="flex min-h-svh flex-col bg-primary">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-12 sm:px-6 lg:py-16">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-display-sm font-semibold text-primary sm:text-display-md">
            What does your app do?
          </h1>
          <p className="text-lg text-tertiary">
            Pick the closest match. This helps us write your registration for
            maximum approval odds.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {USE_CASES.map((useCase) => (
            <UseCaseTile
              key={useCase.id}
              id={useCase.id}
              label={useCase.label}
              description={useCase.description}
              icon={useCase.icon}
              isSelected={selectedUseCase === useCase.id}
              onSelect={setSelectedUseCase}
            />
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            size="lg"
            color="primary"
            iconTrailing={ArrowRight}
            isDisabled={!selectedUseCase}
            href={
              selectedUseCase
                ? `/start/scope?use_case=${selectedUseCase}`
                : undefined
            }
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
