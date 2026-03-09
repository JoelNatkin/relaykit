"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "@/context/session-context";
import { MESSAGES } from "@/data/messages";

interface ConsentPreviewProps {
  categoryId: string;
}

export function ConsentPreview({ categoryId }: ConsentPreviewProps) {
  const { state } = useSession();

  const appName = state.appName || "Your App";
  const messages = MESSAGES[categoryId] ?? [];

  const enabledBase = messages.filter(
    (m) => m.tier !== "expansion" && state.enabledMessages[m.id]
  );

  const enabledExpansion = messages.filter(
    (m) => m.tier === "expansion" && state.enabledMessages[m.id]
  );

  const hasExpansion = enabledExpansion.length > 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-secondary bg-secondary shadow-sm">
      {/* Browser chrome */}
      <div className="flex h-8 items-center border-b border-secondary bg-tertiary px-3 gap-1.5">
        <div className="w-2 h-2 rounded-full bg-quaternary" />
        <div className="w-2 h-2 rounded-full bg-quaternary" />
        <div className="w-2 h-2 rounded-full bg-quaternary" />
        <div className="mx-auto rounded bg-primary px-2 py-0.5 text-[10px] text-placeholder">
          {(state.appName || "yourapp").toLowerCase().replace(/\s+/g, "")}.com/sms-consent
        </div>
      </div>

      {/* Form content */}
      <div className="bg-primary p-6">
        <h3 className="text-lg font-semibold text-primary mb-1">{appName}</h3>
        <p className="text-sm text-tertiary mb-4">SMS Notifications</p>

        <p className="text-sm text-secondary mb-3">
          By checking the box below, you agree to receive the following text
          messages from <strong>{appName}</strong>:
        </p>

        {/* Base message bullets */}
        <motion.ul layout className="mb-4 space-y-1.5">
          <AnimatePresence initial={false}>
            {enabledBase.map((msg) => (
              <motion.li
                key={msg.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center text-sm text-secondary"
              >
                <span className="mr-2 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-success-solid" />
                {msg.name}
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        {/* Opt-out language */}
        <p className="text-sm text-secondary mb-2">
          Reply <span className="font-semibold text-error-primary">STOP</span> to
          any message to opt out.
        </p>

        {/* Frequency disclaimer */}
        <p className="text-xs text-placeholder mb-3">
          Message frequency varies. Message and data rates may apply.
        </p>

        {/* Links */}
        <p className="mb-4 space-x-3">
          <a href="#" className="text-xs text-brand-secondary underline">
            Privacy Policy
          </a>
          <a href="#" className="text-xs text-brand-secondary underline">
            Terms of Service
          </a>
        </p>

        {/* Checkbox */}
        <label className="flex items-start gap-2 text-sm text-secondary cursor-pointer">
          <div className="mt-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border border-primary bg-primary">
            <span className="text-xs text-brand-secondary">&#10003;</span>
          </div>
          <span>
            I agree to receive text messages from <strong>{appName}</strong>
          </span>
        </label>

        {/* Expansion section — the teaching moment */}
        <AnimatePresence initial={false}>
          {hasExpansion && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <hr className="border-secondary my-4" />

              <p className="text-sm font-medium text-warning-primary mb-2">
                📣 Marketing Messages
              </p>

              <ul className="mb-3 space-y-1.5">
                <AnimatePresence initial={false}>
                  {enabledExpansion.map((msg) => (
                    <motion.li
                      key={msg.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center text-sm text-secondary"
                    >
                      <span className="mr-2 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-warning-solid" />
                      {msg.name}
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>

              <label className="flex items-start gap-2 text-sm text-secondary cursor-pointer">
                <div className="mt-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border border-primary bg-primary">
                  <span className="text-xs text-brand-secondary">&#10003;</span>
                </div>
                <span>
                  I also agree to receive <strong>marketing messages</strong>{" "}
                  from <strong>{appName}</strong>. You can opt out at any time.
                </span>
              </label>

              <p className="text-xs text-warning-primary mt-2">
                This requires a separate campaign registration
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
