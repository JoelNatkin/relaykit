"use client";

import { motion } from "framer-motion";
import type { Message, MessageTier as MessageTierType } from "@/data/messages";
import { MessageCard } from "./message-card";

interface MessageTierProps {
  tier: MessageTierType;
  messages: Message[];
  title: string;
  subtitle: string;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
};

export function MessageTier({
  messages,
  title,
  subtitle,
}: MessageTierProps) {
  return (
    <div>
      {/* Header */}
      <div className="mb-3">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {title}
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
      </div>

      {/* Cards */}
      <motion.div
        layout
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-3"
      >
        {messages.map((message) => (
          <MessageCard key={message.id} message={message} />
        ))}
      </motion.div>
    </div>
  );
}
