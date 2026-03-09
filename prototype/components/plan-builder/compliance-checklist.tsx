"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "@/context/session-context";
import { MESSAGES } from "@/data/messages";

interface ComplianceChecklistProps {
  categoryId: string;
}

type CheckStatus = "met" | "not_met" | "neutral" | "advisory";

interface CheckItem {
  id: string;
  label: string;
  status: CheckStatus;
  explanation: React.ReactNode;
  visible: boolean;
}

function StatusIcon({ status }: { status: CheckStatus }) {
  const key = status;

  const variants = {
    met: {
      className:
        "w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold",
      content: "\u2713",
    },
    not_met: {
      className:
        "w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold",
      content: "\u2717",
    },
    neutral: {
      className:
        "w-5 h-5 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-xs font-bold",
      content: "\u2014",
    },
    advisory: {
      className:
        "w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold",
      content: "!",
    },
  };

  const v = variants[status];

  return (
    <motion.div
      key={key}
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 25 }}
      className={v.className}
    >
      {v.content}
    </motion.div>
  );
}

const StopKeyword = () => (
  <span className="text-rose-600 font-semibold">STOP</span>
);

export function ComplianceChecklist({ categoryId }: ComplianceChecklistProps) {
  const { state } = useSession();
  const messages = MESSAGES[categoryId] ?? [];

  // --- Check 1: Business/app name identified ---
  const hasAppName = state.appName.trim().length > 0;
  const check1: CheckItem = {
    id: "app_name",
    label: "Business/app name identified",
    status: hasAppName ? "met" : "not_met",
    explanation: hasAppName
      ? "Appears in consent form and all messages"
      : "Required \u2014 enter your app name above",
    visible: true,
  };

  // --- Check 2: Opt-out language present ---
  const enabledMessagesRequiringStop = messages.filter(
    (m) => state.enabledMessages[m.id] && m.requiresStop
  );
  const hasMessagesRequiringStop = enabledMessagesRequiringStop.length > 0;

  let optOutStatus: CheckStatus = "neutral";
  let optOutExplanation: React.ReactNode = (
    <>Not required for this message type</>
  );

  if (hasMessagesRequiringStop) {
    const allHaveStop = enabledMessagesRequiringStop.every((msg) => {
      const text =
        state.messageEdits[msg.id] ?? msg.template;
      return /stop/i.test(text);
    });
    optOutStatus = allHaveStop ? "met" : "not_met";
    optOutExplanation = allHaveStop ? (
      <>All messages include opt-out keyword</>
    ) : (
      <>
        Missing <StopKeyword /> keyword in one or more messages
      </>
    );
  }

  const check2: CheckItem = {
    id: "opt_out",
    label: "Opt-out language present",
    status: optOutStatus,
    explanation: optOutExplanation,
    visible: true,
  };

  // --- Check 3: Opt-out not required (OTP) ---
  const hasEnabledNoStop =
    categoryId === "verification" &&
    messages.some((m) => state.enabledMessages[m.id] && !m.requiresStop);

  const check3: CheckItem = {
    id: "otp_no_optout",
    label: "Opt-out not required (OTP)",
    status: "neutral",
    explanation: "Verification codes don\u2019t require opt-out language",
    visible: hasEnabledNoStop,
  };

  // --- Check 4: Message type coverage ---
  const enabledCount = Object.values(state.enabledMessages).filter(Boolean).length;
  const hasEnabled = enabledCount > 0;

  const check4: CheckItem = {
    id: "message_coverage",
    label: "Message type coverage",
    status: hasEnabled ? "met" : "not_met",
    explanation: hasEnabled
      ? `${enabledCount} message type${enabledCount === 1 ? "" : "s"} selected`
      : "Enable at least one message type",
    visible: true,
  };

  // --- Check 5: Separate consent for marketing ---
  const hasExpansionEnabled = messages.some(
    (m) => m.tier === "expansion" && state.enabledMessages[m.id]
  );

  const check5: CheckItem = {
    id: "marketing_consent",
    label: "Separate consent for marketing",
    status: "advisory",
    explanation:
      "Marketing messages require separate user consent \u2014 shown on consent form",
    visible: hasExpansionEnabled,
  };

  const allChecks = [check1, check2, check3, check4, check5];

  return (
    <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-700">
        Compliance check
      </h3>

      <div>
        <AnimatePresence initial={false}>
          {allChecks
            .filter((c) => c.visible)
            .map((check) => (
              <motion.div
                key={check.id}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="flex items-start gap-3 py-2"
              >
                <div className="flex-shrink-0">
                  <StatusIcon status={check.status} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {check.label}
                  </p>
                  <p className="text-xs text-gray-400">{check.explanation}</p>
                </div>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
