"use client";

import type { Message, MessageTier as MessageTierType } from "@/data/messages";
import { MessageCard } from "./message-card";

interface MessageTierProps {
  tier: MessageTierType;
  messages: Message[];
  title: string;
  subtitle: string;
}

export function MessageTier({
  messages,
  title,
  subtitle,
}: MessageTierProps) {
  return (
    <div>
      {/* Header */}
      <div className="mb-3">
        <h3 className="text-xs font-semibold text-text-quaternary uppercase tracking-wider">
          {title}
        </h3>
        <p className="text-xs text-text-quaternary mt-0.5">{subtitle}</p>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-3">
        {messages.map((message) => (
          <MessageCard key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
}
