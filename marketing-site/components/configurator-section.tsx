"use client";

import {
  Announcement02,
  Calendar,
  ClipboardCheck,
  Copy01,
  Edit01,
  Globe01,
  MessageChatCircle,
  Package,
  ShieldTick,
  Users01,
} from "@untitledui/icons";
import Link from "next/link";
import { useEffect, useMemo, useState, type FC } from "react";

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

interface Vertical {
  id: VerticalId;
  title: string;
  description: string;
  icon: FC<{ className?: string }>;
  messages: string[];
  alwaysOn?: boolean;
  note?: string;
}

const VERTICALS: Vertical[] = [
  {
    id: "verification",
    title: "Verification",
    description: "Login codes, password resets, MFA.",
    icon: ShieldTick,
    alwaysOn: true,
    messages: [
      "{businessName} verification code: 482910. Expires in 10 minutes.",
      "Your {businessName} login code is 731062. If you didn't request this, ignore this message.",
    ],
  },
  {
    id: "appointments",
    title: "Appointments",
    description: "Confirmations, reminders, reschedules.",
    icon: Calendar,
    messages: [
      "{businessName}: Your appointment is confirmed for Friday at 2:00 PM. Reply STOP to opt out.",
      "{businessName}: Reminder — your appointment is tomorrow at 10:30 AM. Reply STOP to opt out.",
      "{businessName}: Need to reschedule? Visit {website}. Reply STOP to opt out.",
    ],
  },
  {
    id: "orders",
    title: "Order updates",
    description: "Shipping, tracking, delivery.",
    icon: Package,
    messages: [
      "{businessName}: Order #4827 confirmed. Track at {website}/orders/4827. Reply STOP to opt out.",
      "{businessName}: Your order has shipped. Tracking: 1Z999AA10000123456. Reply STOP to opt out.",
      "{businessName}: Out for delivery today. We'll text again when it arrives. Reply STOP to opt out.",
    ],
  },
  {
    id: "support",
    title: "Customer support",
    description: "Ticket updates and resolutions.",
    icon: MessageChatCircle,
    messages: [
      "{businessName}: Ticket #1893 — we've replied. View at {website}/help. Reply STOP to opt out.",
      "{businessName}: Your support ticket is resolved. Let us know if anything else comes up. Reply STOP to opt out.",
    ],
  },
  {
    id: "marketing",
    title: "Marketing",
    description: "Promos, launches, re-engagement.",
    icon: Announcement02,
    note: "Requires EIN. Adds a few days to registration.",
    messages: [
      "{businessName}: 20% off this week. Shop at {website}. Reply STOP to opt out.",
      "{businessName}: New drop today. Take a look: {website}. Reply STOP to opt out.",
    ],
  },
  {
    id: "team",
    title: "Team alerts",
    description: "Shift reminders, system pings, on-call.",
    icon: Users01,
    messages: [
      "{businessName}: Sarah is out sick. Mark, can you cover the 3 PM shift? Reply STOP to opt out.",
      "{businessName}: Production deploy succeeded. All checks green. Reply STOP to opt out.",
    ],
  },
  {
    id: "community",
    title: "Community",
    description: "Event reminders, group updates.",
    icon: Globe01,
    messages: [
      "{businessName}: Tomorrow's meetup is on. 7 PM at the usual spot. Reply STOP to opt out.",
      "{businessName}: New thread in the founders channel. Read it at {website}. Reply STOP to opt out.",
    ],
  },
  {
    id: "waitlist",
    title: "Waitlist",
    description: "Spot available, queue position.",
    icon: ClipboardCheck,
    messages: [
      "{businessName}: Your table's ready. Come on in. Reply STOP to opt out.",
      "{businessName}: You're next on the waitlist. About 5 minutes. Reply STOP to opt out.",
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

function pillClasses(active: boolean): string {
  const base =
    "rounded-full px-3 py-1.5 text-sm font-medium transition duration-100 ease-linear";
  if (active) {
    return `${base} bg-bg-brand-secondary text-text-brand-secondary border border-bg-brand-secondary`;
  }
  return `${base} bg-bg-primary text-text-secondary border border-border-secondary hover:bg-bg-primary_hover`;
}

function substitute(template: string, name: string, site: string): string {
  return template.replaceAll("{businessName}", name).replaceAll("{website}", site);
}

export function ConfiguratorSection() {
  const [pack, setPack] = useState<PackId>("saas");
  const [selected, setSelected] = useState<Set<VerticalId>>(
    () => new Set(PACK_DEFAULTS.saas),
  );
  const [tone, setTone] = useState<ToneId>("standard");
  const [businessName, setBusinessName] = useState("");
  const [website, setWebsite] = useState("");
  const [editedBodies, setEditedBodies] = useState<Record<string, string>>({});
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingDraft, setEditingDraft] = useState("");
  const [copyToastVisible, setCopyToastVisible] = useState(false);

  const renderName = businessName.trim() || "Acme";
  const renderWebsite = website.trim() || "acme.com";

  function bodyFor(verticalId: VerticalId, index: number): string {
    const key = `${verticalId}:${index}`;
    return editedBodies[key] ?? VERTICAL_BY_ID[verticalId].messages[index];
  }

  function handlePackClick(nextPack: PackId) {
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

  function handleEditStart(key: string, currentBody: string) {
    setEditingKey(key);
    setEditingDraft(currentBody);
  }

  function handleEditSave(key: string) {
    setEditedBodies((prev) => ({ ...prev, [key]: editingDraft }));
    setEditingKey(null);
    setEditingDraft("");
  }

  function handleEditCancel() {
    setEditingKey(null);
    setEditingDraft("");
  }

  const selectedInOrder = useMemo<VerticalId[]>(
    () => VERTICALS.filter((v) => selected.has(v.id)).map((v) => v.id),
    [selected],
  );

  async function handleCopy() {
    const lines: string[] = [];
    for (const id of selectedInOrder) {
      const vertical = VERTICAL_BY_ID[id];
      lines.push(vertical.title);
      vertical.messages.forEach((_, i) => {
        const body = bodyFor(id, i);
        lines.push(`${renderName}: ${substitute(body, renderName, renderWebsite)}`);
      });
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
  // render the same Standard text — flagged in plan as a known YOLO stub.
  void tone;

  return (
    <section className="bg-bg-secondary py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Configure your SMS
          </h2>
          <p className="mt-3 text-base text-text-tertiary">
            OTP is included. Add what else you need.
          </p>
          <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Link
              href="/signup"
              className="rounded-lg bg-bg-brand-solid px-5 py-2.5 text-sm font-semibold text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover"
            >
              Get started
            </Link>
            <p className="text-sm text-text-tertiary">
              You can change any of this later in your workspace.
            </p>
          </div>
        </div>

        {/* Pill row */}
        <div className="mt-10 flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-2">
            {PACKS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handlePackClick(p.id)}
                className={pillClasses(pack === p.id)}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div
            aria-hidden
            className="mx-2 hidden h-6 self-center border-l border-border-secondary sm:block"
          />
          <div className="flex flex-wrap gap-2">
            {TONES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTone(t.id)}
                className={pillClasses(tone === t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-border-secondary bg-bg-primary px-3 py-1.5 text-sm font-medium text-text-secondary transition duration-100 ease-linear hover:bg-bg-primary_hover"
          >
            <Copy01 className="size-4" />
            {copyToastVisible ? "Copied" : "Copy"}
          </button>
        </div>

        {/* Personalize inputs */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Your business name"
            className="block w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2.5 text-base text-text-primary placeholder:text-text-placeholder focus:border-border-brand focus:outline-none"
          />
          <input
            type="text"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="yourwebsite.com"
            className="block w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2.5 text-base text-text-primary placeholder:text-text-placeholder focus:border-border-brand focus:outline-none"
          />
        </div>

        {/* Table */}
        <div className="mt-8 grid grid-cols-1 overflow-hidden rounded-lg border border-border-secondary bg-bg-primary md:grid-cols-[30%_70%]">
          {/* Left: verticals list */}
          <div className="border-b border-border-secondary md:border-b-0 md:border-r">
            {VERTICALS.map((v) => {
              const Icon = v.icon;
              const isSelected = selected.has(v.id);
              const isAlwaysOn = v.alwaysOn === true;
              return (
                <div
                  key={v.id}
                  className="border-b border-border-secondary px-4 py-3 last:border-b-0"
                >
                  <button
                    type="button"
                    onClick={() => handleVerticalToggle(v.id)}
                    disabled={isAlwaysOn}
                    className="flex w-full items-center gap-3 text-left disabled:cursor-default"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      disabled={isAlwaysOn}
                      tabIndex={-1}
                      className="size-4 shrink-0 rounded border-border-secondary text-bg-brand-solid"
                    />
                    <Icon className="size-4 shrink-0 text-text-quaternary" />
                    <span className="flex-1 text-sm font-medium text-text-primary">
                      {v.title}
                    </span>
                    {isAlwaysOn ? (
                      <span className="shrink-0 rounded-full bg-bg-brand-secondary px-2 py-0.5 text-xs font-medium text-text-brand-secondary">
                        Always included
                      </span>
                    ) : null}
                  </button>
                  {isSelected ? (
                    <div className="mt-2 pl-7 text-xs text-text-tertiary">
                      {v.description}
                      {v.note ? (
                        <p className="mt-1 text-text-secondary">{v.note}</p>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          {/* Right: messages */}
          <div>
            {selectedInOrder.map((id) => {
              const vertical = VERTICAL_BY_ID[id];
              return (
                <div key={id} className="border-b border-border-secondary last:border-b-0">
                  <div className="border-b border-border-secondary px-4 py-2">
                    <h3 className="text-sm font-semibold text-text-primary">
                      {vertical.title}
                    </h3>
                  </div>
                  <div>
                    {vertical.messages.map((_, i) => {
                      const key = `${id}:${i}`;
                      const body = bodyFor(id, i);
                      const isEditing = editingKey === key;
                      return (
                        <div
                          key={key}
                          className="border-b border-border-secondary px-4 py-3 last:border-b-0"
                        >
                          {isEditing ? (
                            <div>
                              <textarea
                                value={editingDraft}
                                onChange={(e) => setEditingDraft(e.target.value)}
                                rows={3}
                                className="block w-full rounded-md border border-border-primary bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-placeholder focus:border-border-brand focus:outline-none"
                              />
                              <div className="mt-2 flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={handleEditCancel}
                                  className="rounded-md border border-border-secondary bg-bg-primary px-3 py-1 text-xs font-medium text-text-secondary hover:bg-bg-primary_hover"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleEditSave(key)}
                                  className="rounded-md bg-bg-brand-solid px-3 py-1 text-xs font-semibold text-white hover:bg-bg-brand-solid_hover"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start gap-2">
                              <p className="flex-1 text-sm text-text-secondary">
                                <span className="font-semibold text-text-primary">
                                  {renderName}:
                                </span>{" "}
                                {substitute(body, renderName, renderWebsite)}
                              </p>
                              <button
                                type="button"
                                onClick={() => handleEditStart(key, body)}
                                className="shrink-0 rounded-md p-1 text-text-quaternary hover:bg-bg-primary_hover hover:text-text-secondary"
                                aria-label="Edit message"
                              >
                                <Edit01 className="size-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
