"use client";

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
  const variants = {
    met: {
      className:
        "w-5 h-5 rounded-full bg-bg-success-secondary text-fg-success-primary flex items-center justify-center text-xs font-bold",
      content: "\u2713",
    },
    not_met: {
      className:
        "w-5 h-5 rounded-full bg-bg-error-secondary text-fg-error-primary flex items-center justify-center text-xs font-bold",
      content: "\u2717",
    },
    neutral: {
      className:
        "w-5 h-5 rounded-full bg-bg-tertiary text-fg-quaternary flex items-center justify-center text-xs font-bold",
      content: "\u2014",
    },
    advisory: {
      className:
        "w-5 h-5 rounded-full bg-bg-warning-secondary text-fg-warning-primary flex items-center justify-center text-xs font-bold",
      content: "!",
    },
  };

  const v = variants[status];

  return (
    <div className={v.className}>
      {v.content}
    </div>
  );
}

const StopKeyword = () => (
  <span className="text-text-error-primary font-semibold">STOP</span>
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
    <div className="rounded-xl border border-border-secondary bg-bg-primary p-5">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-secondary">
        Compliance check
      </h3>

      <div>
        {allChecks
          .filter((c) => c.visible)
          .map((check) => (
            <div
              key={check.id}
              className="flex items-start gap-3 py-2"
            >
              <div className="flex-shrink-0">
                <StatusIcon status={check.status} />
              </div>
              <div>
                <p className="text-sm font-medium text-text-secondary">
                  {check.label}
                </p>
                <p className="text-xs text-text-quaternary">{check.explanation}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
