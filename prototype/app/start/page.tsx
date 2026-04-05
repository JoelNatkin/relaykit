"use client";

import { useRouter } from "next/navigation";
import {
  Calendar,
  Package,
  Shield01,
  MessageChatCircle,
  Announcement02,
  Users01,
  Globe01,
  ClipboardCheck,
} from "@untitledui/icons";
import type { FC } from "react";

interface Vertical {
  id: string;
  label: string;
  icon: FC<{ className?: string }>;
  examples: string;
}

const VERTICALS: Vertical[] = [
  {
    id: "appointments",
    label: "Appointments",
    icon: Calendar,
    examples: "Confirmations, reminders, reschedules, cancellations, no-show follow-ups",
  },
  {
    id: "verification",
    label: "Verification codes",
    icon: Shield01,
    examples: "Login OTPs, signup codes, password resets, MFA, new device alerts",
  },
  {
    id: "orders",
    label: "Order updates",
    icon: Package,
    examples: "Shipping confirmations, delivery alerts, return status, refund notices",
  },
  {
    id: "support",
    label: "Customer support",
    icon: MessageChatCircle,
    examples: "Ticket updates, resolution notices, satisfaction follow-ups",
  },
  {
    id: "marketing",
    label: "Marketing",
    icon: Announcement02,
    examples: "Promos, re-engagement, product launches, seasonal campaigns",
  },
  {
    id: "internal",
    label: "Team alerts",
    icon: Users01,
    examples: "Shift reminders, system alerts, escalation pings, on-call notifications",
  },
  {
    id: "community",
    label: "Community",
    icon: Globe01,
    examples: "Event reminders, group updates, membership alerts, RSVP confirmations",
  },
  {
    id: "waitlist",
    label: "Waitlist",
    icon: ClipboardCheck,
    examples: "Spot available, queue position, reservation holds, invite codes",
  },
];

export default function StartPage() {
  const router = useRouter();

  function handleSelect(_verticalId: string) {
    // Prototype: all verticals navigate to the appointments workspace since
    // that's the only vertical with full message data.
    router.push("/apps/glowstudio/messages");
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-3xl">
        <h1 className="text-center text-2xl font-bold text-text-primary">
          What&apos;s the main reason your app sends texts?
        </h1>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {VERTICALS.map((vertical) => (
            <button
              key={vertical.id}
              type="button"
              onClick={() => handleSelect(vertical.id)}
              className="group flex flex-col rounded-xl border border-border-secondary bg-bg-primary p-6 text-left transition duration-100 ease-linear hover:border-border-brand hover:shadow-sm cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-bg-brand-secondary group-hover:bg-bg-brand-primary">
                  <vertical.icon className="size-5 text-fg-brand-primary group-hover:text-fg-white" />
                </div>
                <h3 className="text-base font-semibold text-text-primary">
                  {vertical.label}
                </h3>
              </div>
              <p className="mt-3 text-sm text-text-tertiary leading-relaxed">
                {vertical.examples}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
