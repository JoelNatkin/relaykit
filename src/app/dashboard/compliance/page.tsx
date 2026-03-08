"use client";

import { useCallback, useState } from "react";
import { ComplianceStatusCard } from "@/components/dashboard/compliance-status-card";
import {
  DriftAlertCard,
  type DriftAlert,
} from "@/components/dashboard/drift-alert-card";
import { CanonMessagesRef } from "@/components/dashboard/canon-messages-ref";
import {
  ComplianceActivityLog,
  type ComplianceEvent,
} from "@/components/dashboard/compliance-activity-log";
import { Button } from "@/components/base/buttons/button";
import { LinkExternal01 } from "@untitledui/icons";

// ---------------------------------------------------------------------------
// Mock data — design preview, no API calls
// ---------------------------------------------------------------------------

const MOCK_STATS = {
  total: 847,
  clean: 839,
  blocked: 2,
  warnings: 6,
};

const MOCK_CANON_MESSAGES = [
  {
    id: "canon-1",
    category: "Booking confirmation",
    text: "{business_name}: Your appointment is confirmed for {date} at {time}. Reply HELP for help, STOP to opt out.",
  },
  {
    id: "canon-2",
    category: "Appointment reminder",
    text: "{business_name}: Reminder — your appointment is tomorrow at {time}. Reply C to confirm or R to reschedule. Reply STOP to opt out.",
  },
  {
    id: "canon-3",
    category: "Cancellation notice",
    text: "{business_name}: Your appointment on {date} has been cancelled. To rebook, visit {link} or reply HELP. Reply STOP to opt out.",
  },
];

const MOCK_DRIFT_ALERTS: DriftAlert[] = [
  {
    id: "drift-1",
    flaggedMessage:
      "Hey {name}, we're running a 20% off special this week! Book now at {link}",
    closestCanon: {
      category: "Appointment reminder",
      text: "{business_name}: Reminder — your appointment is tomorrow at {time}. Reply C to confirm or R to reschedule. Reply STOP to opt out.",
    },
    reason:
      "This message contains promotional content (\"20% off special\") but your campaign is registered for appointment reminders. Promotional offers are outside your registered use case.",
    suggestedRewrite:
      "{business_name}: We have openings this week. To book an appointment, visit {link} or reply BOOK. Reply STOP to opt out.",
    consequence:
      "Carriers may suspend your campaign if messages consistently drift from your registered use case, which would prevent all your messages from being delivered.",
    acknowledged: false,
    createdAt: "2026-03-08T14:32:00Z",
  },
];

const MOCK_ACTIVITY: ComplianceEvent[] = [
  {
    id: "evt-1",
    type: "clean",
    description: "42 messages scanned — all within registration",
    timestamp: "Today, 2:45 PM",
  },
  {
    id: "evt-2",
    type: "drift",
    description:
      "Message flagged — promotional content outside registered use case",
    timestamp: "Today, 2:32 PM",
  },
  {
    id: "evt-3",
    type: "blocked",
    description: "Message blocked — sent during quiet hours (10:14 PM ET)",
    timestamp: "Yesterday, 10:14 PM",
  },
  {
    id: "evt-4",
    type: "clean",
    description: "156 messages scanned — all within registration",
    timestamp: "Yesterday, 6:00 PM",
  },
  {
    id: "evt-5",
    type: "blocked",
    description: "Message blocked — recipient previously opted out",
    timestamp: "Mar 6, 3:22 PM",
  },
  {
    id: "evt-6",
    type: "clean",
    description: "89 messages scanned — all within registration",
    timestamp: "Mar 6, 12:00 PM",
  },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DashboardCompliancePage() {
  const [alerts, setAlerts] = useState(MOCK_DRIFT_ALERTS);

  const handleAcknowledge = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId ? { ...a, acknowledged: true } : a,
      ),
    );
  }, []);

  const unacknowledgedAlerts = alerts.filter((a) => !a.acknowledged);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-lg font-semibold text-primary">Compliance</h1>
        <p className="mt-1 text-sm text-tertiary">
          Your registration status and message monitoring.
        </p>
      </div>

      <ComplianceStatusCard
        status={unacknowledgedAlerts.length > 0 ? "attention" : "good"}
        stats={MOCK_STATS}
        driftMessage={
          unacknowledgedAlerts.length > 0
            ? "Some of your messages are drifting from your registered use case. See suggestions below."
            : undefined
        }
      />

      <DriftAlertCard
        alerts={unacknowledgedAlerts}
        onAcknowledge={handleAcknowledge}
      />

      <CanonMessagesRef messages={MOCK_CANON_MESSAGES} />

      <ComplianceActivityLog events={MOCK_ACTIVITY} />

      <div className="border-t border-secondary pt-6">
        <Button
          href="https://appts.msgverified.com"
          color="link-color"
          size="sm"
          iconTrailing={LinkExternal01}
        >
          View your compliance site
        </Button>
        <p className="mt-1 text-xs text-quaternary">
          This is the page carriers check to verify your opt-in practices.
        </p>
      </div>
    </div>
  );
}
