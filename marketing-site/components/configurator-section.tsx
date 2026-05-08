"use client";

import { Copy01, Edit01, Plus, Stars02 } from "@untitledui/icons";
import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";

type VerticalId =
  | "verification"
  | "appointments"
  | "orders"
  | "support"
  | "marketing"
  | "team"
  | "community"
  | "waitlist";

type PackId = "saas" | "personal" | "real-estate" | "fitness" | "ecommerce" | "custom";

type ToneId = "standard" | "friendly" | "brief";

interface StubMessage {
  name: string;
  tooltip: string;
  body: string;
}

interface CustomMessage {
  id: string;
  name: string;
  body: string;
}

interface Vertical {
  id: VerticalId;
  title: string;
  description: string;
  messages: StubMessage[];
  alwaysOn?: boolean;
  note?: string;
}

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
        body: "Verification code: [[482910]]. Expires in 10 minutes.",
      },
      {
        name: "Login code",
        tooltip: "Sent when a user requests a login code.",
        body: "Your login code is [[731062]]. If you didn't request this, ignore this message.",
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
        body: "Your appointment is confirmed for [[Friday]] at [[2:00 PM]]. Reply STOP to opt out.",
      },
      {
        name: "Reminder",
        tooltip: "Sent the day before the appointment.",
        body: "Reminder — your appointment is [[tomorrow]] at [[10:30 AM]]. Reply STOP to opt out.",
      },
      {
        name: "Reschedule",
        tooltip: "Sent when an appointment is rescheduled.",
        body: "Need to reschedule? Visit {website}. Reply STOP to opt out.",
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
        body: "Order #[[4827]] confirmed. Track at {website}/orders/[[4827]]. Reply STOP to opt out.",
      },
      {
        name: "Shipped",
        tooltip: "Sent when the order ships.",
        body: "Your order has shipped. Tracking: [[1Z999AA10000123456]]. Reply STOP to opt out.",
      },
      {
        name: "Out for delivery",
        tooltip: "Sent when the order is out for delivery.",
        body: "Out for delivery [[today]]. We'll text again when it arrives. Reply STOP to opt out.",
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
        body: "Ticket #[[1893]] — we've replied. View at {website}/help. Reply STOP to opt out.",
      },
      {
        name: "Resolved",
        tooltip: "Sent when the ticket is resolved.",
        body: "Your support ticket is resolved. Let us know if anything else comes up. Reply STOP to opt out.",
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
        body: "[[20%]] off this week. Shop at {website}. Reply STOP to opt out.",
      },
      {
        name: "New drop",
        tooltip:
          "Sent to opted-in subscribers when new inventory is announced.",
        body: "New drop [[today]]. Take a look: {website}. Reply STOP to opt out.",
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
        body: "Sarah is out sick. Mark, can you cover the [[3 PM]] shift? Reply STOP to opt out.",
      },
      {
        name: "Deploy succeeded",
        tooltip: "Sent when a production deploy completes.",
        body: "Production deploy succeeded. All checks green. Reply STOP to opt out.",
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
        body: "Tomorrow's meetup is on. [[7 PM]] at the usual spot. Reply STOP to opt out.",
      },
      {
        name: "New thread",
        tooltip: "Sent when a new thread starts in a followed channel.",
        body: "New thread in the founders channel. Read it at {website}. Reply STOP to opt out.",
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
        body: "Your table's ready. Come on in. Reply STOP to opt out.",
      },
      {
        name: "Up next",
        tooltip: "Sent when the customer is next in line.",
        body: "You're next on the waitlist. About [[5 minutes]]. Reply STOP to opt out.",
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
};

const TONES: Array<{ id: ToneId; label: string }> = [
  { id: "standard", label: "Standard" },
  { id: "friendly", label: "Friendly" },
  { id: "brief", label: "Brief" },
];

const VARIABLE_TOKEN_CLASSES = "text-text-brand-secondary";

function tonePillClasses(active: boolean): string {
  const base =
    "rounded-full px-3 py-1.5 text-sm font-medium transition duration-100 ease-linear";
  if (active) {
    return `${base} bg-bg-brand-secondary text-text-brand-secondary border border-bg-brand-secondary`;
  }
  return `${base} bg-bg-primary text-text-secondary border border-border-secondary hover:bg-bg-primary_hover`;
}

interface BodySegment {
  text: string;
  variable: boolean;
}

function parseBody(template: string, name: string, site: string): BodySegment[] {
  const segments: BodySegment[] = [];
  const re = /(\{businessName\}|\{website\}|\[\[[^\]]+\]\])/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(template)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        text: template.slice(lastIndex, match.index),
        variable: false,
      });
    }
    const tok = match[0];
    if (tok === "{businessName}") {
      segments.push({ text: name, variable: true });
    } else if (tok === "{website}") {
      segments.push({ text: site, variable: true });
    } else {
      segments.push({ text: tok.slice(2, -2), variable: true });
    }
    lastIndex = match.index + tok.length;
  }
  if (lastIndex < template.length) {
    segments.push({ text: template.slice(lastIndex), variable: false });
  }
  return segments;
}

function flattenTemplate(template: string, name: string, site: string): string {
  return template
    .replaceAll("{businessName}", name)
    .replaceAll("{website}", site)
    .replace(/\[\[([^\]]+)\]\]/g, "$1");
}

function renderBodySegments(segments: BodySegment[]): ReactNode[] {
  return segments.map((seg, i) =>
    seg.variable ? (
      <span key={i} className={VARIABLE_TOKEN_CLASSES}>
        {seg.text}
      </span>
    ) : (
      <span key={i}>{seg.text}</span>
    ),
  );
}

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
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

function buildPrefill(verticalId: VerticalId): string {
  if (verticalId === "verification") {
    return "[your message here]";
  }
  return "[your message here] Reply STOP to opt out.";
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M8 7V11" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <circle cx="8" cy="5.25" r="0.75" fill="currentColor" />
    </svg>
  );
}

interface InfoTooltipProps {
  text: string;
}

function InfoTooltip({ text }: InfoTooltipProps) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative flex-shrink-0">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        className="cursor-default text-fg-quaternary transition duration-100 ease-linear hover:text-fg-tertiary"
        aria-label={text}
      >
        <InfoIcon />
      </button>
      {show ? (
        <div className="pointer-events-none absolute bottom-full left-0 z-[100] mb-1 max-w-[280px] min-w-[220px] rounded-lg bg-bg-primary-solid px-3 py-2 text-xs leading-relaxed whitespace-normal text-text-white shadow-lg">
          {text}
        </div>
      ) : null}
    </div>
  );
}

interface MessageCardProps {
  name: string;
  tooltip?: string;
  template: string;
  businessName: string;
  website: string;
  onEdit: () => void;
}

function MessageCard({
  name,
  tooltip,
  template,
  businessName,
  website,
  onEdit,
}: MessageCardProps) {
  const segments = parseBody(template, businessName, website);
  return (
    <div className="rounded-xl border border-border-secondary bg-bg-primary p-4 shadow-xs">
      <div className="flex items-center gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <span className="truncate text-sm font-semibold text-text-primary">
            {name}
          </span>
          {tooltip ? <InfoTooltip text={tooltip} /> : null}
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
        <p className="text-sm leading-relaxed text-text-secondary">
          <span className={VARIABLE_TOKEN_CLASSES}>{businessName}</span>:{" "}
          {renderBodySegments(segments)}
        </p>
      </div>
    </div>
  );
}

interface SimpleBodyEditorProps {
  initialBody: string;
  onSave: (body: string) => void;
  onCancel: () => void;
}

function SimpleBodyEditor({ initialBody, onSave, onCancel }: SimpleBodyEditorProps) {
  const [draft, setDraft] = useState(initialBody);
  return (
    <div className="rounded-xl border border-border-secondary bg-bg-primary p-4 shadow-xs">
      <div className="rounded-lg border border-border-primary bg-bg-primary px-3 py-2.5 shadow-xs transition duration-100 ease-linear focus-within:border-border-brand">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
          className="block min-h-[4.5rem] w-full resize-none bg-transparent text-sm leading-relaxed text-text-secondary outline-none"
        />
      </div>
      <div className="mt-3 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="cursor-pointer px-3 py-1.5 text-sm font-medium text-text-tertiary transition duration-100 ease-linear hover:text-text-secondary"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onSave(draft)}
          disabled={draft.trim() === ""}
          className="cursor-pointer rounded-lg bg-bg-brand-solid px-4 py-2 text-sm font-semibold text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          Save
        </button>
      </div>
    </div>
  );
}

interface AddMessageEditorProps {
  verticalId: VerticalId;
  onSave: (name: string, body: string) => void;
  onCancel: () => void;
}

function AddMessageEditor({ verticalId, onSave, onCancel }: AddMessageEditorProps) {
  const [name, setName] = useState("");
  const [body, setBody] = useState(buildPrefill(verticalId));
  const [aiInput, setAiInput] = useState("");
  const inputId = `add-${verticalId}`;
  const nameEmpty = name.trim() === "";
  const bodyEmpty = body.trim() === "";

  return (
    <div className="rounded-xl border border-border-secondary bg-bg-primary p-4 shadow-xs">
      <div>
        <label
          htmlFor={`${inputId}-name`}
          className="mb-1.5 block text-sm font-medium text-text-secondary"
        >
          Name
        </label>
        <input
          id={`${inputId}-name`}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Holiday hours"
          className="w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2.5 text-sm text-text-primary shadow-xs transition duration-100 ease-linear placeholder:text-text-placeholder focus:border-border-brand focus:outline-none"
        />
      </div>

      <div className="mt-4">
        <label
          htmlFor={`${inputId}-body`}
          className="mb-1.5 block text-sm font-medium text-text-secondary"
        >
          Message
        </label>
        <div className="w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2.5 shadow-xs transition duration-100 ease-linear focus-within:border-border-brand">
          <textarea
            id={`${inputId}-body`}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            className="block min-h-[4.5rem] w-full resize-none bg-transparent text-sm leading-relaxed text-text-secondary outline-none"
          />
        </div>
        <div className="mt-2 flex items-start">
          <button
            type="button"
            onClick={() => undefined}
            className="ml-auto inline-flex cursor-pointer items-center gap-1 py-1.5 text-xs font-semibold whitespace-nowrap text-text-brand-secondary transition-colors duration-100 hover:text-text-brand-secondary_hover"
          >
            <Plus className="size-3.5" />
            Variable
          </button>
        </div>
      </div>

      <div className="mt-3">
        <div className="relative">
          <Stars02 className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-fg-brand-primary" />
          <input
            type="text"
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            placeholder={
              body.trim() === buildPrefill(verticalId).trim() || body.trim() === ""
                ? "Ask AI: write me a message"
                : "Ask AI: polish my edit"
            }
            className="w-full rounded-lg border border-border-primary bg-bg-primary py-2 pr-3 pl-9 text-sm text-text-primary shadow-xs transition duration-100 ease-linear placeholder:text-text-placeholder focus:border-border-brand focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="cursor-pointer px-3 py-1.5 text-sm font-medium text-text-tertiary transition duration-100 ease-linear hover:text-text-secondary"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onSave(name.trim(), body.trim())}
          disabled={nameEmpty || bodyEmpty}
          className="cursor-pointer rounded-lg bg-bg-brand-solid px-4 py-2 text-sm font-semibold text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export function ConfiguratorSection() {
  const [pack, setPack] = useState<PackId>("saas");
  const [selected, setSelected] = useState<Set<VerticalId>>(
    () => new Set<VerticalId>(PACK_DEFAULTS.saas),
  );
  const [tone, setTone] = useState<ToneId>("standard");
  const [businessName, setBusinessName] = useState("");
  const [website, setWebsite] = useState("");
  const [editedStubs, setEditedStubs] = useState<Record<string, string>>({});
  const [customMessages, setCustomMessages] =
    useState<Record<VerticalId, CustomMessage[]>>(EMPTY_CUSTOM);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [addingTo, setAddingTo] = useState<VerticalId | null>(null);
  const [copyToastVisible, setCopyToastVisible] = useState(false);

  const renderName = businessName.trim() || "Acme";
  const renderWebsite = website.trim() || "acme.com";

  function stubBody(verticalId: VerticalId, index: number): string {
    const key = `${verticalId}:stub:${index}`;
    return editedStubs[key] ?? VERTICAL_BY_ID[verticalId].messages[index].body;
  }

  function customBody(verticalId: VerticalId, id: string): string {
    return customMessages[verticalId].find((m) => m.id === id)?.body ?? "";
  }

  function handlePackChange(nextPack: PackId) {
    setPack(nextPack);
    setSelected(new Set(PACK_DEFAULTS[nextPack]));
  }

  function handleVerticalToggle(id: VerticalId) {
    if (VERTICAL_BY_ID[id].alwaysOn) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    setPack("custom");
  }

  function handleStubSave(verticalId: VerticalId, index: number, body: string) {
    const key = `${verticalId}:stub:${index}`;
    setEditedStubs((prev) => ({ ...prev, [key]: body }));
    setEditingKey(null);
  }

  function handleCustomSave(verticalId: VerticalId, id: string, body: string) {
    setCustomMessages((prev) => ({
      ...prev,
      [verticalId]: prev[verticalId].map((m) =>
        m.id === id ? { ...m, body } : m,
      ),
    }));
    setEditingKey(null);
  }

  function handleAddSave(verticalId: VerticalId, name: string, body: string) {
    const id = makeId();
    setCustomMessages((prev) => ({
      ...prev,
      [verticalId]: [...prev[verticalId], { id, name, body }],
    }));
    setAddingTo(null);
  }

  const selectedInOrder = useMemo<VerticalId[]>(
    () => VERTICALS.filter((v) => selected.has(v.id)).map((v) => v.id),
    [selected],
  );

  const websiteShown = useMemo(() => {
    for (const id of selectedInOrder) {
      const vertical = VERTICAL_BY_ID[id];
      for (let i = 0; i < vertical.messages.length; i++) {
        if (stubBody(id, i).includes("{website}")) return true;
      }
      for (const m of customMessages[id]) {
        if (m.body.includes("{website}")) return true;
      }
    }
    return false;
  }, [selectedInOrder, editedStubs, customMessages]);

  async function handleCopy() {
    const lines: string[] = [];
    for (const id of selectedInOrder) {
      const vertical = VERTICAL_BY_ID[id];
      lines.push(vertical.title);
      vertical.messages.forEach((_, i) => {
        lines.push(
          `${renderName}: ${flattenTemplate(stubBody(id, i), renderName, renderWebsite)}`,
        );
      });
      for (const m of customMessages[id]) {
        lines.push(
          `${renderName}: ${flattenTemplate(m.body, renderName, renderWebsite)}`,
        );
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

  // Tone is selectable but only "standard" varies content for now. Other tones
  // render the same Standard text — known YOLO stub.
  void tone;

  return (
    <section className="bg-bg-primary py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Configure your SMS
          </h2>
          <p className="mt-3 text-base text-text-tertiary">
            OTP is included. Add what else you need. You can change any of this
            later in your workspace.
          </p>
        </div>

        {/* Personalize inputs */}
        <div
          className={`mt-8 grid grid-cols-1 gap-3 ${websiteShown ? "sm:grid-cols-2" : ""}`}
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

        {/* Side-by-side panels */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-[3fr_7fr]">
          {/* Categories panel */}
          <div className="overflow-hidden rounded-xl border border-border-secondary bg-bg-primary">
            <div className="border-b border-border-secondary px-4 pt-5 pb-4">
              <h3 className="text-base font-semibold text-text-primary">Categories</h3>
              <div className="mt-4">
                <label
                  htmlFor="recommended-combinations"
                  className="mb-1.5 block text-sm font-medium text-text-secondary"
                >
                  Recommended combinations
                </label>
                <select
                  id="recommended-combinations"
                  value={pack}
                  onChange={(e) => handlePackChange(e.target.value as PackId)}
                  className="w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2.5 text-sm text-text-primary transition duration-100 ease-linear focus:border-border-brand focus:outline-none"
                >
                  {PACKS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
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
                            Always included
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-xs text-text-tertiary">
                        {v.description}
                      </p>
                      {isSelected && v.note ? (
                        <p className="mt-1 text-xs text-text-secondary">{v.note}</p>
                      ) : null}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Messages panel */}
          <div className="rounded-xl border border-border-secondary bg-bg-primary">
            <div className="px-4 pt-5 pb-4">
              <h3 className="text-base font-semibold text-text-primary">Messages</h3>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  {TONES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTone(t.id)}
                      className={tonePillClasses(tone === t.id)}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border-secondary bg-bg-primary px-3 py-1.5 text-sm font-medium text-text-secondary transition duration-100 ease-linear hover:bg-bg-primary_hover"
                  >
                    <Copy01 className="size-4" />
                    {copyToastVisible ? "Copied" : "Copy"}
                  </button>
                  <Link
                    href="/signup"
                    className="inline-flex rounded-lg bg-bg-brand-solid px-4 py-1.5 text-sm font-semibold text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover"
                  >
                    Get started
                  </Link>
                </div>
              </div>
            </div>
            <div className="space-y-8 px-4 pb-4">
              {selectedInOrder.map((id) => {
                const vertical = VERTICAL_BY_ID[id];
                const customs = customMessages[id];
                const isAdding = addingTo === id;
                return (
                  <div key={id}>
                    <h4 className="mb-3 text-sm font-semibold text-text-primary">
                      {vertical.title}
                    </h4>
                    <div className="space-y-3">
                      {vertical.messages.map((stub, i) => {
                        const key = `${id}:stub:${i}`;
                        const body = stubBody(id, i);
                        return editingKey === key ? (
                          <SimpleBodyEditor
                            key={key}
                            initialBody={body}
                            onSave={(next) => handleStubSave(id, i, next)}
                            onCancel={() => setEditingKey(null)}
                          />
                        ) : (
                          <MessageCard
                            key={key}
                            name={stub.name}
                            tooltip={stub.tooltip}
                            template={body}
                            businessName={renderName}
                            website={renderWebsite}
                            onEdit={() => setEditingKey(key)}
                          />
                        );
                      })}

                      {customs.map((m) => {
                        const key = `${id}:custom:${m.id}`;
                        const body = customBody(id, m.id);
                        return editingKey === key ? (
                          <SimpleBodyEditor
                            key={key}
                            initialBody={body}
                            onSave={(next) => handleCustomSave(id, m.id, next)}
                            onCancel={() => setEditingKey(null)}
                          />
                        ) : (
                          <MessageCard
                            key={key}
                            name={m.name}
                            template={body}
                            businessName={renderName}
                            website={renderWebsite}
                            onEdit={() => setEditingKey(key)}
                          />
                        );
                      })}

                      {isAdding ? (
                        <AddMessageEditor
                          verticalId={id}
                          onSave={(name, body) => handleAddSave(id, name, body)}
                          onCancel={() => setAddingTo(null)}
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() => setAddingTo(id)}
                          disabled={addingTo !== null && addingTo !== id}
                          className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-dashed border-border-secondary bg-bg-primary px-4 py-3 text-sm font-medium text-text-brand-secondary transition duration-100 ease-linear hover:border-border-brand hover:text-text-brand-secondary_hover disabled:cursor-not-allowed disabled:opacity-60"
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
          </div>
        </div>
      </div>
    </section>
  );
}
