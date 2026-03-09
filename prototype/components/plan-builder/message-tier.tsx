"use client";

import type { Message, MessageTier as MessageTierType } from "@/data/messages";
import { MessageCard } from "./message-card";

interface MessageTierProps {
  tier: MessageTierType;
  messages: Message[];
  title?: string;
  titleRight?: string;
  subtitle?: string;
}

export function MessageTier({
  messages,
  title,
  titleRight,
  subtitle,
}: MessageTierProps) {
  return (
    <div>
      {/* Header — only shown for tiers that need an explainer */}
      {title && (
        <div className="mb-3">
          <div className="flex items-baseline justify-between">
            <h3 className="text-sm font-semibold text-text-primary">
              {title}
            </h3>
            {titleRight && (
              <span className="text-sm text-text-quaternary">{titleRight}</span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-text-tertiary mt-0.5">{subtitle}</p>
          )}
        </div>
      )}

      {/* Cards */}
      <div className="flex flex-col gap-3">
        {messages.map((message) => (
          <MessageCard key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
}
