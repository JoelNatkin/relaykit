"use client";

import type { Message, MessageTier as MessageTierType } from "@/data/messages";
import type { CustomMessage } from "@/context/session-context";
import { useSession } from "@/context/session-context";
import { MessageCard, AddMessageCard } from "./message-card";

interface MessageTierProps {
  tier: MessageTierType;
  messages: Message[];
  categoryId: string;
  title?: string;
  titleRight?: string;
  subtitle?: string;
}

export function MessageTier({
  messages,
  categoryId,
  title,
  titleRight,
  subtitle,
}: MessageTierProps) {
  const { state, deleteCustomMessage } = useSession();

  // Get custom messages for this category
  const customMessages = state.customMessages.filter(
    (m) => m.categoryId === categoryId
  );

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
          <MessageCard
            key={message.id}
            message={message}
            categoryId={categoryId}
          />
        ))}

        {/* Custom messages */}
        {customMessages.map((message: CustomMessage) => (
          <MessageCard
            key={message.id}
            message={message}
            categoryId={categoryId}
            isCustom
            onDelete={() => deleteCustomMessage(message.id)}
          />
        ))}

        {/* Add message card */}
        <AddMessageCard categoryId={categoryId} />
      </div>
    </div>
  );
}
