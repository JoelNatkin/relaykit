"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { X } from "@untitledui/icons";
import { Eyebrow } from "@/components/home/section-ui";
import { CATEGORIES, interpolateBody } from "@/lib/message-library";
import type { Category, VariantTone } from "@/lib/message-library";
import { useConfiguratorState } from "@/lib/configurator/use-configurator-state";

// "The messages" — a clean, lightweight message browser that replaces the home's
// embedded configurator peek (see /explorations/home-messages-redesign.md). It
// shows the selected category's real corpus messages as clean cards in a
// fixed-height, dot-paginated carousel — no configurator chrome. The full tool
// stays at /messages. Business name is shared with /messages via the
// useConfiguratorState store (continuity of intent, MASTER_PLAN #7); tone is
// local and not persisted.

const TONES: VariantTone[] = ["Standard", "Friendly", "Brief"];

// Pill display order — Verification is 4th. Top row = first 4, bottom row = next 5.
const CATEGORY_ORDER = [
  "account-events",
  "order-updates",
  "appointments",
  "verification",
  "customer-support",
  "team-alerts",
  "waitlist",
  "community",
  "marketing",
];
const BY_ID = new Map(CATEGORIES.map((c) => [c.id, c]));
const ORDERED: Category[] = CATEGORY_ORDER.map((id) => BY_ID.get(id)).filter(
  (c): c is Category => Boolean(c),
);

const DEFAULT_CATEGORY = "account-events";
const PER_PAGE = 6; // fixed area = 2 cols × 3 rows

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

interface MessagesSectionProps {
  // When set, the browser is locked to one category and the pill rows are
  // hidden — used by sub-vertical landing pages to pin the dominant category
  // (D-436). Defaults to the full pill browser (home behavior).
  lockedCategory?: string;
  eyebrow?: string;
  heading?: string;
  bridge?: string;
}

export function MessagesSection({
  lockedCategory,
  eyebrow = "The messages",
  heading = "Messages for every job.",
  bridge = "From login codes to event invites, every message your app sends is ready to use.",
}: MessagesSectionProps = {}) {
  // Business name is the only field that carries forward — bound to the shared
  // configurator store so home and /messages stay in sync. "Acme" is shown as
  // the empty-state example only; it is never written to the store.
  const { state, setBusinessName } = useConfiguratorState();
  const [selCat, setSelCat] = useState(lockedCategory ?? DEFAULT_CATEGORY);
  const [tone, setTone] = useState<VariantTone>("Standard");
  const [page, setPage] = useState(0);
  const touchX = useRef(0);

  const category = BY_ID.get(selCat) ?? ORDERED[0];
  const displayName = state.businessName.trim() || "Acme";
  const pages = chunk(category.messages, PER_PAGE);
  const safePage = Math.min(page, pages.length - 1);
  const visible = pages[safePage] ?? [];

  function selectCategory(id: string) {
    setSelCat(id);
    setPage(0);
  }

  function goPage(i: number) {
    setPage(Math.max(0, Math.min(pages.length - 1, i)));
  }

  return (
    <section
      id="configurator"
      className="mx-auto max-w-5xl border-t border-border-secondary px-6 py-20 sm:py-28"
    >
      <div className="max-w-2xl">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          {heading}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-text-secondary">
          {bridge}
        </p>
      </div>

      {/* Category selector — horizontal-scroll pill row on mobile, two pill rows
          on desktop. Hidden when locked to a single category (D-436). */}
      {!lockedCategory && (
      <div className="mt-10">
        <div
          className="flex flex-nowrap gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden"
          role="group"
          aria-label="Message category"
        >
          {ORDERED.map((c) => {
            const active = c.id === selCat;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => selectCategory(c.id)}
                aria-pressed={active}
                className={`shrink-0 cursor-pointer rounded-full border px-4 py-2.5 text-sm font-medium transition duration-100 ease-linear ${
                  active
                    ? "border-bg-gold bg-bg-gold text-text-on-gold"
                    : "border-border-secondary text-text-tertiary hover:border-border-primary hover:text-text-secondary"
                }`}
              >
                {c.name}
              </button>
            );
          })}
        </div>
        <div
          className="hidden flex-col gap-2 md:flex"
          role="group"
          aria-label="Message category"
        >
          {[ORDERED.slice(0, 4), ORDERED.slice(4)].map((row, ri) => (
            <div key={ri} className="flex flex-wrap gap-2">
              {row.map((c) => {
                const active = c.id === selCat;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => selectCategory(c.id)}
                    aria-pressed={active}
                    className={`cursor-pointer rounded-full border px-[15px] py-2 text-[13px] font-medium transition duration-100 ease-linear ${
                      active
                        ? "border-bg-gold bg-bg-gold text-text-on-gold"
                        : "border-border-secondary text-text-tertiary hover:border-border-primary hover:text-text-secondary"
                    }`}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Controls — business name + tone. Below md: name (2/3) + tone select (1/3)
          in one row; md+: name (md:w-80) + the three tone pills. Hug the cards. */}
      <div className="mb-4 mt-8 flex items-center gap-3 md:flex-wrap md:justify-between md:gap-4">
        {/* Business name — relative wrapper for the clear (X) button. */}
        <div className="relative min-w-0 grow-[2] basis-0 md:grow-0 md:basis-auto">
          <input
            type="text"
            value={state.businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Your business name"
            maxLength={24}
            autoComplete="off"
            aria-label="See the messages as your business"
            className="w-full rounded-lg border border-border-primary bg-surface-card py-3 pl-4 pr-10 text-base text-text-primary transition duration-100 ease-linear placeholder:text-text-quaternary focus:border-border-gold focus:outline-none md:w-80"
          />
          {state.businessName && (
            <button
              type="button"
              onClick={() => setBusinessName("")}
              aria-label="Clear business name"
              className="absolute right-2.5 top-1/2 inline-flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-text-quaternary transition duration-100 ease-linear hover:text-text-secondary"
            >
              <X className="size-4" aria-hidden />
            </button>
          )}
        </div>

        {/* Tone — native select below md, pills at md+. Same `tone` state either way. */}
        <select
          aria-label="Message tone"
          value={tone}
          onChange={(e) => setTone(e.target.value as VariantTone)}
          className="min-w-0 grow basis-0 rounded-lg border border-border-primary bg-surface-card px-3 py-3 text-base text-text-primary md:hidden"
        >
          {TONES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <div
          className="hidden gap-1.5 md:flex"
          role="group"
          aria-label="Message tone"
        >
          {TONES.map((t) => {
            const active = t === tone;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTone(t)}
                aria-pressed={active}
                // Selected tone = monochromatic neutral (NOT gold — gold is
                // reserved for category selection).
                className={`cursor-pointer rounded-full border border-border-primary px-3.5 py-1.5 text-[12.5px] font-medium transition duration-100 ease-linear ${
                  active
                    ? "bg-border-primary text-text-primary"
                    : "text-text-tertiary hover:text-text-secondary"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cards — fixed area sized to exactly 6 (2×3) at md+; stacked on mobile. */}
      <div
        className="grid grid-cols-1 gap-3.5 md:h-[394px] md:auto-rows-[122px] md:grid-cols-2 md:content-start md:overflow-hidden"
        onTouchStart={(e) => {
          touchX.current = e.changedTouches[0].clientX;
        }}
        onTouchEnd={(e) => {
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 40 && pages.length > 1) {
            goPage(safePage + (dx < 0 ? 1 : -1));
          }
        }}
      >
        {visible.map((msg) => {
          const variant =
            msg.variants.find((v) => v.tone === tone) ?? msg.variants[0];
          const segments = interpolateBody(variant.body, category.variables, {
            businessName: displayName,
          });
          return (
            <div
              key={msg.id}
              className="overflow-hidden rounded-xl border border-border-secondary bg-surface-card px-[18px] py-4"
            >
              <div className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-text-primary">
                <span
                  className="size-1.5 shrink-0 rounded-sm bg-bg-gold"
                  aria-hidden
                />
                {msg.name}
              </div>
              {/* Every {{token}} value renders bold/bright; literal copy + the
                  STOP tail stay plain. */}
              <p className="text-[13.5px] leading-relaxed text-text-secondary line-clamp-3">
                {segments.map((seg, i) =>
                  seg.isVariable ? (
                    <span key={i} className="font-medium text-text-primary">
                      {seg.text}
                    </span>
                  ) : (
                    <span key={i}>{seg.text}</span>
                  ),
                )}
              </p>
            </div>
          );
        })}
      </div>

      {/* Footer — centered page dots (only when >1 page) + bottom-right link. */}
      <div className="relative mt-5 flex min-h-[26px] items-center justify-center">
        {pages.length > 1 && (
          <div className="flex gap-[9px]" aria-label="Message pages">
            {pages.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goPage(i)}
                aria-label={`Page ${i + 1} of ${pages.length}`}
                aria-current={i === safePage ? "true" : undefined}
                className={`size-2 cursor-pointer rounded-full transition duration-100 ease-linear ${
                  i === safePage ? "bg-text-secondary" : "bg-border-primary"
                }`}
              />
            ))}
          </div>
        )}
        <Link
          href="/messages"
          className="absolute right-0 top-1/2 -translate-y-1/2 text-sm font-medium text-gold transition duration-100 ease-linear hover:opacity-90"
        >
          Open Messages <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
