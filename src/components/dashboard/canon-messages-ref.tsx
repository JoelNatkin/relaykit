"use client";

import { useState } from "react";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Star01, Copy01, Check } from "@untitledui/icons";

interface CanonMessage {
  id: string;
  category: string;
  text: string;
}

interface CanonMessagesRefProps {
  messages: CanonMessage[];
}

function CanonMessageCard({ message }: { message: CanonMessage }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable
    }
  }

  return (
    <div className="rounded-lg border border-secondary bg-primary p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <Star01 className="size-4 shrink-0 text-fg-brand-secondary" />
            <span className="text-sm font-medium text-primary">
              {message.category}
            </span>
            <Badge size="sm" color="brand" type="pill-color">
              Registered message
            </Badge>
          </div>
          <p className="mt-1.5 whitespace-pre-wrap font-mono text-sm text-tertiary">
            &ldquo;{message.text}&rdquo;
          </p>
        </div>
        <Button
          size="sm"
          color="tertiary"
          iconLeading={copied ? Check : Copy01}
          onClick={handleCopy}
        >
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
    </div>
  );
}

export function CanonMessagesRef({ messages }: CanonMessagesRefProps) {
  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-sm font-semibold text-primary">
          Registered messages
        </h2>
        <p className="mt-1 text-sm text-tertiary">
          These are the messages your registration is built around.
        </p>
      </div>
      {messages.map((msg) => (
        <CanonMessageCard key={msg.id} message={msg} />
      ))}
    </div>
  );
}
