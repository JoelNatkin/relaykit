"use client";

import { ChevronDown, Copy01, Edit01, Plus } from "@untitledui/icons";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MessageEditCard } from "@/components/configurator/message-edit-card";
import {
  getExampleValues,
  interpolateTemplate,
} from "@/lib/configurator/example-values";
import {
  SessionProvider,
  type SessionState,
} from "@/lib/configurator/session-context";
import type {
  CustomMessage,
  PackId,
  PillId,
  StubMessage,
  ToneId,
  Vertical,
  VerticalId,
} from "@/lib/configurator/types";
import { VARIABLE_TOKEN_CLASSES } from "@/lib/editor/variable-token";

const VERTICALS: Vertical[] = [
  {
    id: "verification",
    title: "Verification",
    description:
      "Login OTPs, signup codes, password resets, MFA, new device alerts",
    alwaysOn: true,
    messages: [
      {
        name: "Verification code",
        tooltip: "Sent when a user requests a verification code.",
        variables: ["business_name", "code"],
        requiresStop: false,
        variants: {
          standard: "{business_name}: Verification code: {code}. Expires in 10 minutes.",
          friendly: "Hi! Your {business_name} verification code is {code}. Expires in 10 minutes.",
          brief: "{business_name} code: {code}.",
        },
      },
      {
        name: "Login code",
        tooltip: "Sent when a user requests a login code.",
        variables: ["business_name", "code"],
        requiresStop: false,
        variants: {
          standard: "{business_name}: Your login code is {code}. If you didn't request this, ignore this message.",
          friendly: "{business_name}: Hey! Your login code is {code}. Didn't request this? Ignore this message.",
          brief: "{business_name} login code: {code}.",
        },
      },
    ],
  },
  {
    id: "appointments",
    title: "Appointments",
    description:
      "Confirmations, reminders, reschedules, cancellations, no-show follow-ups",
    messages: [
      {
        name: "Confirmation",
        tooltip: "Sent when a customer books an appointment.",
        variables: ["business_name", "day", "time"],
        requiresStop: true,
        variants: {
          standard: "{business_name}: Your appointment is confirmed for {day} at {time}. Reply STOP to opt out.",
          friendly: "{business_name}: You're booked! See you {day} at {time}. Reply STOP to opt out.",
          brief: "{business_name}: Confirmed {day} {time}. Reply STOP to opt out.",
        },
      },
      {
        name: "Reminder",
        tooltip: "Sent the day before the appointment.",
        variables: ["business_name", "when", "time"],
        requiresStop: true,
        variants: {
          standard: "{business_name}: Reminder — your appointment is {when} at {time}. Reply STOP to opt out.",
          friendly: "{business_name}: Just a heads-up — see you {when} at {time}! Reply STOP to opt out.",
          brief: "{business_name}: {when} at {time}. Reply STOP to opt out.",
        },
      },
      {
        name: "Reschedule",
        tooltip: "Sent when an appointment is rescheduled.",
        variables: ["business_name", "website"],
        requiresStop: true,
        variants: {
          standard: "{business_name}: Need to reschedule? Visit {website}. Reply STOP to opt out.",
          friendly: "{business_name}: Need a different time? Hop over to {website}. Reply STOP to opt out.",
          brief: "{business_name}: Reschedule at {website}. Reply STOP to opt out.",
        },
      },
    ],
  },
  {
    id: "orders",
    title: "Order updates",
    description:
      "Shipping confirmations, delivery alerts, return status, refund notices",
    messages: [
      {
        name: "Order confirmed",
        tooltip: "Sent when an order is placed.",
        variables: ["business_name", "order_id", "website"],
        requiresStop: true,
        variants: {
          standard: "{business_name}: Order #{order_id} confirmed. Track at {website}. Reply STOP to opt out.",
          friendly: "{business_name}: Got your order! #{order_id} is confirmed — track at {website}. Reply STOP to opt out.",
          brief: "{business_name}: Order #{order_id} confirmed. {website}. Reply STOP to opt out.",
        },
      },
      {
        name: "Shipped",
        tooltip: "Sent when the order ships.",
        variables: ["business_name", "tracking_number"],
        requiresStop: true,
        variants: {
          standard: "{business_name}: Your order has shipped. Tracking: {tracking_number}. Reply STOP to opt out.",
          friendly: "{business_name}: It's on the way! Tracking: {tracking_number}. Reply STOP to opt out.",
          brief: "{business_name}: Shipped. Tracking: {tracking_number}. Reply STOP to opt out.",
        },
      },
      {
        name: "Out for delivery",
        tooltip: "Sent when the order is out for delivery.",
        variables: ["business_name", "when"],
        requiresStop: true,
        variants: {
          standard: "{business_name}: Out for delivery {when}. We'll text again when it arrives. Reply STOP to opt out.",
          friendly: "{business_name}: Almost there! Out for delivery {when}. We'll text when it arrives. Reply STOP to opt out.",
          brief: "{business_name}: Out for delivery {when}. Reply STOP to opt out.",
        },
      },
    ],
  },
  {
    id: "support",
    title: "Customer support",
    description: "Ticket updates, resolution notices, satisfaction follow-ups",
    messages: [
      {
        name: "Reply received",
        tooltip: "Sent when an agent replies to the ticket.",
        variables: ["business_name", "ticket_id", "website"],
        requiresStop: true,
        variants: {
          standard: "{business_name}: Ticket #{ticket_id} — we've replied. View at {website}. Reply STOP to opt out.",
          friendly: "{business_name}: We just replied to ticket #{ticket_id} — take a look at {website}. Reply STOP to opt out.",
          brief: "{business_name}: #{ticket_id} replied. {website}. Reply STOP to opt out.",
        },
      },
      {
        name: "Resolved",
        tooltip: "Sent when the ticket is resolved.",
        variables: ["business_name"],
        requiresStop: true,
        variants: {
          standard: "{business_name}: Your support ticket is resolved. Let us know if anything else comes up. Reply STOP to opt out.",
          friendly: "{business_name}: All sorted! Your ticket is resolved — let us know if anything else comes up. Reply STOP to opt out.",
          brief: "{business_name}: Ticket resolved. Reply STOP to opt out.",
        },
      },
    ],
  },
  {
    id: "marketing",
    title: "Marketing",
    description: "Promos, re-engagement, product launches, seasonal campaigns",
    note: "Requires EIN. Adds a few days to registration.",
    messages: [
      {
        name: "Weekly promo",
        tooltip: "Sent to opted-in subscribers for weekly offers.",
        variables: ["business_name", "discount", "website"],
        requiresStop: true,
        variants: {
          standard: "{business_name}: {discount} off this week. Shop at {website}. Reply STOP to opt out.",
          friendly: "{business_name}: Treat yourself — {discount} off this week at {website}. Reply STOP to opt out.",
          brief: "{business_name}: {discount} off. {website}. Reply STOP to opt out.",
        },
      },
      {
        name: "New drop",
        tooltip: "Sent to opted-in subscribers when new inventory is announced.",
        variables: ["business_name", "when", "website"],
        requiresStop: true,
        variants: {
          standard: "{business_name}: New drop {when}. Take a look: {website}. Reply STOP to opt out.",
          friendly: "{business_name}: Fresh stuff just dropped {when} — peek at {website}. Reply STOP to opt out.",
          brief: "{business_name}: New drop. {website}. Reply STOP to opt out.",
        },
      },
    ],
  },
  {
    id: "team",
    title: "Team alerts",
    description:
      "Shift reminders, system alerts, escalation pings, on-call notifications",
    messages: [
      {
        name: "Shift cover",
        tooltip: "Sent when a shift needs coverage.",
        variables: ["business_name", "shift_time"],
        requiresStop: true,
        variants: {
          standard: "{business_name}: Sarah is out sick. Mark, can you cover the {shift_time} shift? Reply STOP to opt out.",
          friendly: "{business_name}: Hey Mark — Sarah's out sick. Got the {shift_time} shift? Reply STOP to opt out.",
          brief: "{business_name}: Mark, cover {shift_time}? Sarah's out. Reply STOP to opt out.",
        },
      },
      {
        name: "Deploy succeeded",
        tooltip: "Sent when a production deploy completes.",
        variables: ["business_name"],
        requiresStop: true,
        variants: {
          standard: "{business_name}: Production deploy succeeded. All checks green. Reply STOP to opt out.",
          friendly: "{business_name}: Deploy's live and all checks are green. Reply STOP to opt out.",
          brief: "{business_name}: Deploy green. Reply STOP to opt out.",
        },
      },
    ],
  },
  {
    id: "community",
    title: "Community",
    description:
      "Event reminders, group updates, membership alerts, RSVP confirmations",
    messages: [
      {
        name: "Meetup tonight",
        tooltip: "Sent the day of a community meetup.",
        variables: ["business_name", "time"],
        requiresStop: true,
        variants: {
          standard: "{business_name}: Tomorrow's meetup is on. {time} at the usual spot. Reply STOP to opt out.",
          friendly: "{business_name}: See you at the meetup tomorrow — {time} at the usual spot! Reply STOP to opt out.",
          brief: "{business_name}: Meetup tomorrow {time}. Reply STOP to opt out.",
        },
      },
      {
        name: "New thread",
        tooltip: "Sent when a new thread starts in a followed channel.",
        variables: ["business_name", "website"],
        requiresStop: true,
        variants: {
          standard: "{business_name}: New thread in the founders channel. Read it at {website}. Reply STOP to opt out.",
          friendly: "{business_name}: Fresh thread in the founders channel — give it a read at {website}. Reply STOP to opt out.",
          brief: "{business_name}: New thread. {website}. Reply STOP to opt out.",
        },
      },
    ],
  },
  {
    id: "waitlist",
    title: "Waitlist",
    description: "Spot available, queue position, reservation holds, invite codes",
    messages: [
      {
        name: "Table ready",
        tooltip: "Sent when a table opens.",
        variables: ["business_name"],
        requiresStop: true,
        variants: {
          standard: "{business_name}: Your table's ready. Come on in. Reply STOP to opt out.",
          friendly: "{business_name}: Your table's ready — come on in! Reply STOP to opt out.",
          brief: "{business_name}: Table ready. Reply STOP to opt out.",
        },
      },
      {
        name: "Up next",
        tooltip: "Sent when the customer is next in line.",
        variables: ["business_name", "wait_time"],
        requiresStop: true,
        variants: {
          standard: "{business_name}: You're next on the waitlist. About {wait_time}. Reply STOP to opt out.",
          friendly: "{business_name}: You're up next — about {wait_time} to go. Reply STOP to opt out.",
          brief: "{business_name}: Up next. About {wait_time}. Reply STOP to opt out.",
        },
      },
    ],
  },
];

const VERTICAL_BY_ID: Record<VerticalId, Vertical> = VERTICALS.reduce(
  (acc, v) => {
    acc[v.id] = v;
    return acc;
  },
  {} as Record<VerticalId, Vertical>,
);

const PACKS: Array<{ id: PackId; label: string }> = [
  { id: "saas", label: "SaaS" },
  { id: "personal", label: "Personal services" },
  { id: "real-estate", label: "Real estate" },
  { id: "fitness", label: "Fitness" },
  { id: "ecommerce", label: "E-commerce" },
  { id: "custom", label: "Custom" },
];

const PACK_DEFAULTS: Record<PackId, VerticalId[]> = {
  saas: ["verification", "orders", "support", "team"],
  personal: ["verification", "appointments", "support"],
  "real-estate": ["verification", "appointments", "support"],
  fitness: ["verification", "appointments", "marketing", "community"],
  ecommerce: ["verification", "orders", "support", "marketing"],
  custom: ["verification"],
  none: ["verification"],
};

const TONE_OPTIONS: Array<{ id: ToneId; label: string }> = [
  { id: "standard", label: "Standard" },
  { id: "friendly", label: "Friendly" },
  { id: "brief", label: "Brief" },
];

function tonePillClasses(active: boolean): string {
  const base =
    "rounded-full px-3 py-1.5 text-sm font-medium transition duration-100 ease-linear";
  if (active) {
    return `${base} bg-bg-brand-secondary text-text-brand-secondary border border-bg-brand-secondary`;
  }
  return `${base} bg-bg-primary text-text-secondary border border-border-secondary hover:bg-bg-primary_hover`;
}

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function buildCustomPrefill(verticalId: VerticalId): string {
  if (verticalId === "verification") {
    return "{business_name}: [your message here]";
  }
  return "{business_name}: [your message here] Reply STOP to opt out.";
}

const EMPTY_CUSTOM: Record<VerticalId, CustomMessage[]> = {
  verification: [],
  appointments: [],
  orders: [],
  support: [],
  marketing: [],
  team: [],
  community: [],
  waitlist: [],
};

function flattenTemplateForCopy(
  template: string,
  verticalId: VerticalId,
  state: SessionState,
): string {
  return interpolateTemplate(template, verticalId, state)
    .map((s) => s.text)
    .join("");
}

interface RenderedBodyProps {
  template: string;
  verticalId: VerticalId;
  state: SessionState;
}

function RenderedBody({ template, verticalId, state }: RenderedBodyProps) {
  const segments = interpolateTemplate(template, verticalId, state);
  return (
    <p className="text-sm leading-relaxed text-text-secondary">
      {segments.map((seg, i) =>
        seg.isVariable ? (
          <span key={i} className={VARIABLE_TOKEN_CLASSES}>
            {seg.text}
          </span>
        ) : (
          <span key={i}>{seg.text}</span>
        ),
      )}
    </p>
  );
}

interface MessageReadCardProps {
  name: string;
  tooltip?: string;
  template: string;
  verticalId: VerticalId;
  state: SessionState;
  onEdit: () => void;
}

function MessageReadCard({
  name,
  tooltip,
  template,
  verticalId,
  state,
  onEdit,
}: MessageReadCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <div className="rounded-xl border border-border-secondary bg-bg-primary p-4 shadow-xs">
      <div className="flex items-center gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <span className="truncate text-sm font-semibold text-text-primary">{name}</span>
          {tooltip ? (
            <div className="relative flex-shrink-0">
              <button
                type="button"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onFocus={() => setShowTooltip(true)}
                onBlur={() => setShowTooltip(false)}
                className="cursor-default text-fg-quaternary transition duration-100 ease-linear hover:text-fg-tertiary"
                aria-label={tooltip}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.25" />
                  <path d="M8 7V11" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                  <circle cx="8" cy="5.25" r="0.75" fill="currentColor" />
                </svg>
              </button>
              {showTooltip ? (
                <div className="pointer-events-none absolute bottom-full left-0 z-[100] mb-1 max-w-[280px] min-w-[220px] rounded-lg bg-bg-primary-solid px-3 py-2 text-xs leading-relaxed whitespace-normal text-text-white shadow-lg">
                  {tooltip}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onEdit}
          aria-label="Edit message"
          className="cursor-pointer p-1 text-fg-quaternary transition duration-100 ease-linear hover:text-fg-secondary"
        >
          <Edit01 className="size-[17px]" />
        </button>
      </div>
      <div className="mt-1">
        <RenderedBody template={template} verticalId={verticalId} state={state} />
      </div>
    </div>
  );
}

type MessageKey = string;

interface CustomEditorState {
  verticalId: VerticalId;
  draft: CustomMessage;
  isNew: boolean;
}

export function ConfiguratorSection() {
  const [pack, setPack] = useState<PackId>("saas");
  const [selected, setSelected] = useState<Set<VerticalId>>(
    () => new Set<VerticalId>(PACK_DEFAULTS.saas),
  );
  const [globalTone, setGlobalTone] = useState<ToneId>("standard");
  const [businessName, setBusinessName] = useState("");
  const [website, setWebsite] = useState("");

  // Per-message tone override (only set when user explicitly chose in edit card)
  const [perMessageTone, setPerMessageTone] = useState<Record<MessageKey, ToneId>>({});
  // Custom-edited bodies (set when activePillId === "custom" on save)
  const [editedStubs, setEditedStubs] = useState<Record<MessageKey, string>>({});

  const [customMessages, setCustomMessages] =
    useState<Record<VerticalId, CustomMessage[]>>(EMPTY_CUSTOM);

  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [customEditor, setCustomEditor] = useState<CustomEditorState | null>(null);
  const [copyToastVisible, setCopyToastVisible] = useState(false);

  const sessionState = useMemo<SessionState>(
    () => ({
      businessName: businessName.trim() || "Acme",
      website: website.trim() || "acme.com",
    }),
    [businessName, website],
  );

  const selectedInOrder = useMemo<VerticalId[]>(
    () => VERTICALS.filter((v) => selected.has(v.id)).map((v) => v.id),
    [selected],
  );

  function stubKey(verticalId: VerticalId, index: number): MessageKey {
    return `${verticalId}:stub:${index}`;
  }

  function customKey(verticalId: VerticalId, id: string): MessageKey {
    return `${verticalId}:custom:${id}`;
  }

  function effectiveStubTemplate(verticalId: VerticalId, index: number): {
    template: string;
    pillId: PillId;
  } {
    const key = stubKey(verticalId, index);
    if (editedStubs[key] !== undefined) {
      return { template: editedStubs[key], pillId: "custom" };
    }
    const tone = perMessageTone[key] ?? globalTone;
    const stub = VERTICAL_BY_ID[verticalId].messages[index];
    return { template: stub.variants[tone] ?? stub.variants.standard, pillId: tone };
  }

  function handlePackChange(nextPack: PackId) {
    setPack(nextPack);
    setSelected(new Set(PACK_DEFAULTS[nextPack]));
  }

  function handleVerticalToggle(id: VerticalId) {
    if (VERTICAL_BY_ID[id].alwaysOn) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setPack("custom");
  }

  function handleStubSave(
    verticalId: VerticalId,
    index: number,
    result: { template: string; pillId: PillId },
  ) {
    const key = stubKey(verticalId, index);
    if (result.pillId === "custom") {
      setEditedStubs((prev) => ({ ...prev, [key]: result.template }));
    } else {
      const tone: ToneId = result.pillId;
      setEditedStubs((prev) => {
        if (!(key in prev)) return prev;
        const { [key]: _omit, ...rest } = prev;
        void _omit;
        return rest;
      });
      setPerMessageTone((prev) => ({ ...prev, [key]: tone }));
    }
    setEditingKey(null);
  }

  function handleCustomSave(verticalId: VerticalId, id: string, body: string) {
    setCustomMessages((prev) => ({
      ...prev,
      [verticalId]: prev[verticalId].map((m) => (m.id === id ? { ...m, body } : m)),
    }));
    setEditingKey(null);
    setCustomEditor(null);
  }

  function handleAddSave(verticalId: VerticalId, body: string) {
    const newMessage: CustomMessage = {
      id: makeId(),
      name: "Custom message",
      body,
      requiresStop: verticalId !== "verification",
    };
    setCustomMessages((prev) => ({
      ...prev,
      [verticalId]: [...prev[verticalId], newMessage],
    }));
    setCustomEditor(null);
  }

  function openAddEditor(verticalId: VerticalId) {
    setEditingKey(null);
    setCustomEditor({
      verticalId,
      draft: {
        id: makeId(),
        name: "Custom message",
        body: buildCustomPrefill(verticalId),
        requiresStop: verticalId !== "verification",
      },
      isNew: true,
    });
  }

  async function handleCopy() {
    const lines: string[] = [];
    for (const id of selectedInOrder) {
      const vertical = VERTICAL_BY_ID[id];
      lines.push(vertical.title);
      vertical.messages.forEach((_, i) => {
        const { template } = effectiveStubTemplate(id, i);
        lines.push(flattenTemplateForCopy(template, id, sessionState));
      });
      for (const m of customMessages[id]) {
        lines.push(flattenTemplateForCopy(m.body, id, sessionState));
      }
      lines.push("");
    }
    const text = lines.join("\n").trim();
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return;
    }
    setCopyToastVisible(true);
  }

  useEffect(() => {
    if (!copyToastVisible) return;
    const timer = setTimeout(() => setCopyToastVisible(false), 1500);
    return () => clearTimeout(timer);
  }, [copyToastVisible]);

  const websiteShown = useMemo(() => {
    for (const id of selectedInOrder) {
      const vertical = VERTICAL_BY_ID[id];
      const valueMap = getExampleValues(id);
      if (!valueMap.has("website")) continue;
      for (let i = 0; i < vertical.messages.length; i++) {
        const { template } = effectiveStubTemplate(id, i);
        if (template.includes("{website}")) return true;
      }
      for (const m of customMessages[id]) {
        if (m.body.includes("{website}")) return true;
      }
    }
    return false;
  }, [selectedInOrder, editedStubs, customMessages, perMessageTone, globalTone]);

  return (
    <SessionProvider state={sessionState}>
      <section className="bg-bg-primary pt-15 pb-16 sm:pb-20">
        <div className="mx-auto max-w-5xl px-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-text-primary">
              Configure your messages
            </h2>
            <p className="mt-3 text-base text-text-tertiary">
              Verification codes included. You can change these later in your workspace.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 items-start gap-8 md:grid-cols-[3fr_7fr]">
            {/* Categories panel */}
            <div className="overflow-hidden rounded-xl border border-border-secondary bg-bg-primary md:min-w-60">
              <div className="px-4 pt-5 pb-6">
                <h3 className="text-base font-semibold text-text-primary">Categories</h3>
                <div className="mt-4">
                  <label
                    htmlFor="recommended-combinations"
                    className="mb-1.5 block text-sm font-medium text-text-secondary"
                  >
                    Recommended combinations
                  </label>
                  <div className="relative">
                    <select
                      id="recommended-combinations"
                      value={pack}
                      onChange={(e) => handlePackChange(e.target.value as PackId)}
                      className="block w-full appearance-none rounded-lg border border-border-primary bg-bg-primary py-2.5 pr-9 pl-3 text-base text-text-primary transition duration-100 ease-linear focus:border-border-brand focus:outline-none"
                    >
                      {PACKS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                      <option disabled>──────────</option>
                      <option value="none">None</option>
                    </select>
                    <ChevronDown
                      aria-hidden
                      className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-fg-quaternary"
                    />
                  </div>
                </div>
              </div>
              {VERTICALS.map((v) => {
                const isSelected = selected.has(v.id);
                const isAlwaysOn = v.alwaysOn === true;
                return (
                  <div
                    key={v.id}
                    className="border-b border-border-secondary px-4 py-5 last:border-b-0"
                  >
                    <button
                      type="button"
                      onClick={() => handleVerticalToggle(v.id)}
                      disabled={isAlwaysOn}
                      className="flex w-full items-start gap-3 text-left disabled:cursor-default"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        readOnly
                        disabled={isAlwaysOn}
                        tabIndex={-1}
                        className="mt-0.5 size-4 shrink-0 rounded border-border-secondary text-bg-brand-solid"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-text-primary">
                            {v.title}
                          </span>
                          {isAlwaysOn ? (
                            <span className="shrink-0 rounded-full bg-bg-brand-secondary px-2 py-0.5 text-xs font-medium text-text-brand-secondary">
                              Included
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 text-xs text-text-tertiary">{v.description}</p>
                        {isSelected && v.note ? (
                          <p className="mt-1 text-xs text-text-secondary">{v.note}</p>
                        ) : null}
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Messages column */}
            <div className="md:max-w-[540px]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  {TONE_OPTIONS.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setGlobalTone(t.id)}
                      className={tonePillClasses(globalTone === t.id)}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-2 py-1.5 text-sm font-medium text-text-tertiary transition duration-100 ease-linear hover:text-text-secondary"
                >
                  <Copy01 className="size-4" />
                  {copyToastVisible ? "Copied" : "Copy"}
                </button>
              </div>

              <div
                className={`mt-4 grid grid-cols-1 gap-3 ${websiteShown ? "sm:grid-cols-2" : ""}`}
              >
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Your business name"
                  className="block w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2.5 text-base text-text-primary placeholder:text-text-placeholder focus:border-border-brand focus:outline-none"
                />
                {websiteShown ? (
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="yourwebsite.com"
                    className="block w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2.5 text-base text-text-primary placeholder:text-text-placeholder focus:border-border-brand focus:outline-none"
                  />
                ) : null}
              </div>

              <div className="mt-8 space-y-7">
                {selectedInOrder.map((id) => {
                  const vertical = VERTICAL_BY_ID[id];
                  const customs = customMessages[id];
                  const isAdding = customEditor?.verticalId === id && customEditor.isNew;
                  return (
                    <div key={id}>
                      <h4 className="mb-3 text-base font-semibold text-text-primary">
                        {vertical.title}
                      </h4>
                      <div className="space-y-3">
                        {vertical.messages.map((stub: StubMessage, i) => {
                          const key = stubKey(id, i);
                          const { template, pillId } = effectiveStubTemplate(id, i);
                          if (editingKey === key) {
                            return (
                              <MessageEditCard
                                key={key}
                                name={stub.name}
                                tooltip={stub.tooltip}
                                verticalId={id}
                                variables={stub.variables}
                                requiresStop={stub.requiresStop}
                                variants={stub.variants}
                                initialTemplate={template}
                                initialPillId={pillId}
                                onSave={(result) => handleStubSave(id, i, result)}
                                onCancel={() => setEditingKey(null)}
                              />
                            );
                          }
                          return (
                            <MessageReadCard
                              key={key}
                              name={stub.name}
                              tooltip={stub.tooltip}
                              template={template}
                              verticalId={id}
                              state={sessionState}
                              onEdit={() => {
                                setCustomEditor(null);
                                setEditingKey(key);
                              }}
                            />
                          );
                        })}

                        {customs.map((m) => {
                          const key = customKey(id, m.id);
                          if (editingKey === key) {
                            return (
                              <MessageEditCard
                                key={key}
                                name={m.name}
                                verticalId={id}
                                variables={["business_name"]}
                                requiresStop={m.requiresStop}
                                initialTemplate={m.body}
                                initialPillId="custom"
                                onSave={(result) =>
                                  handleCustomSave(id, m.id, result.template)
                                }
                                onCancel={() => setEditingKey(null)}
                              />
                            );
                          }
                          return (
                            <MessageReadCard
                              key={key}
                              name={m.name}
                              template={m.body}
                              verticalId={id}
                              state={sessionState}
                              onEdit={() => {
                                setCustomEditor(null);
                                setEditingKey(key);
                              }}
                            />
                          );
                        })}

                        {isAdding && customEditor ? (
                          <MessageEditCard
                            name={customEditor.draft.name}
                            verticalId={id}
                            variables={["business_name"]}
                            requiresStop={customEditor.draft.requiresStop}
                            initialTemplate={customEditor.draft.body}
                            initialPillId="custom"
                            onSave={(result) => handleAddSave(id, result.template)}
                            onCancel={() => setCustomEditor(null)}
                          />
                        ) : (
                          <button
                            type="button"
                            onClick={() => openAddEditor(id)}
                            disabled={
                              customEditor !== null && customEditor.verticalId !== id
                            }
                            className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-border-secondary bg-bg-primary px-4 py-3 text-sm font-medium text-text-brand-secondary transition duration-100 ease-linear hover:border-border-brand hover:text-text-brand-secondary_hover disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <Plus className="size-4" />
                            Add message
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8">
                <p className="text-sm text-text-secondary">
                  Next: a few quick questions, then you build with your AI tool while we
                  register you. Three days to your first real text.
                </p>
                <Link
                  href="/signup"
                  className="mt-4 flex h-15 w-full items-center justify-center rounded-lg bg-bg-brand-solid text-base font-semibold text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover"
                >
                  Save to my workspace →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SessionProvider>
  );
}
