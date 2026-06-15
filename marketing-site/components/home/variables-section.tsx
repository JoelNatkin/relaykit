import { Edit01 } from "@untitledui/icons";
import { Eyebrow } from "@/components/home/section-ui";

// "The variables" — a presentational, STATIC illustration of the message
// authoring experience (D-434). It replaces the prior VariablesCallout
// before→after block. Nothing here is interactive: the active input + caret,
// gold-tint values, the open variable menu, the mouse cursor, the dimmed
// controls, and the fake scrollbar are all illustrative. Geometry is ported
// 1:1 from explorations/landing-page-mockups/relaykit-devtools-landing-mockup.html
// (the design source) translated to the real dark+gold tokens.

// Static gold text-cursor — illustrative only (no blink).
function Caret() {
  return (
    <span
      aria-hidden
      className="mx-px inline-block h-[1.05em] w-[1.5px] bg-gold align-[-2px]"
    />
  );
}

// Bold, identity-tone value span (mockup `.v`).
function V({ children }: { children: React.ReactNode }) {
  return <span className="font-medium text-text-primary">{children}</span>;
}

// `.v` value carrying the gold-tint highlight (mockup `.vhl`).
function Vhl({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-[5px] bg-bg-gold/15 px-1.5 py-px font-medium text-text-primary">
      {children}
    </span>
  );
}

// The "Confirmation / Edit" head row shared by both editor mocks.
function EditorHead() {
  return (
    <div className="mb-[11px] flex items-center justify-between gap-2.5">
      <span className="text-[13px] font-semibold text-text-primary">
        Confirmation
      </span>
      <span className="inline-flex items-center gap-[5px] text-[12px] text-fg-quaternary">
        <Edit01 className="size-[11px]" aria-hidden />
        Edit
      </span>
    </div>
  );
}

// "Insert variable ⌄" affordance (mockup `.vinsert`).
function InsertVariable() {
  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-text-secondary">
      Insert variable{" "}
      <span aria-hidden className="text-[12px] text-text-tertiary">
        ⌄
      </span>
    </span>
  );
}

// Cancel / Save footer (mockup `.vedit-actions`).
function EditorActions() {
  return (
    <div className="mt-3 flex items-center justify-end gap-3.5">
      <span className="text-[13px] font-medium text-text-tertiary">Cancel</span>
      <span className="rounded-[7px] border border-border-primary bg-surface-inset px-[17px] py-[7px] text-[13px] font-semibold text-text-primary">
        Save
      </span>
    </div>
  );
}

const MENU_ROWS: { name: string; value: string; selected?: boolean }[] = [
  { name: "workspace_name", value: "Summit Fitness" },
  { name: "provider_name", value: "Jordan Lee" },
  {
    name: "reschedule_link",
    value: "summitfitness.com/reschedule",
    selected: true,
  },
  { name: "appointment_time", value: "Tue, March 4th, 2:00 PM" },
  { name: "customer_name", value: "Olivia Rhye" },
  { name: "cancel_link", value: "summitfitness.com/cancel" },
  { name: "feedback_link", value: "summitfitness.com/feedback" },
];

// Decorative OS-style pointer glyph parked over the selected menu row.
// Literal hex is intentional: it is a near-white cursor with a page-ink
// outline (an OS cursor, not a themed surface) — not a Tailwind color class.
function CursorGlyph() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      width="20"
      height="20"
      className="pointer-events-none absolute left-[40%] top-[11px] z-[2] drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
    >
      <path
        d="M5.5 2.5 L5.5 19.4 L9.6 15.3 L12.4 21.6 L15 20.4 L12.2 14.2 L18.2 14.2 Z"
        fill="#F5F5F4"
        stroke="#13120E"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// The open "Insert variable" menu (mockup `.vdropwrap`) — exact geometry:
// right-anchored, width calc(100% - 16px), max-height 134px, overflow hidden,
// always-on fake scrollbar, cursor on the reschedule_link row.
function VariableMenu() {
  return (
    <div className="absolute right-0 top-[calc(100%+8px)] z-10 w-[calc(100%-16px)] overflow-hidden rounded-[10px] border border-border-primary bg-surface-inset shadow-[0_12px_32px_rgba(0,0,0,0.5)]">
      <div className="max-h-[134px] overflow-hidden pt-2">
        {MENU_ROWS.map((row) => (
          <div
            key={row.name}
            className={`relative flex items-center justify-between gap-4 py-1 pl-4 pr-[22px] text-[13px] [&+&]:border-t [&+&]:border-border-tertiary ${
              row.selected ? "bg-white/[0.06]" : ""
            }`}
          >
            <span className="whitespace-nowrap font-mono text-[12px] text-text-tertiary">
              {row.name}
            </span>
            <span
              className={`whitespace-nowrap text-text-primary ${
                row.selected ? "opacity-100" : "opacity-60"
              }`}
            >
              {row.value}
            </span>
            {row.selected ? <CursorGlyph /> : null}
          </div>
        ))}
      </div>
      {/* Always-on fake scrollbar (mockup `.vscroll`/`.vthumb`). */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[7px] right-[5px] top-[7px] w-[5px] rounded-full bg-white/[0.06]"
      >
        <div className="absolute left-0 top-0 h-[68%] w-full rounded-full bg-border-primary" />
      </div>
    </div>
  );
}

export function VariablesSection() {
  return (
    <section
      id="variables"
      className="mx-auto max-w-5xl border-t border-border-secondary px-6 py-20 sm:py-28"
    >
      <div className="max-w-2xl">
        <Eyebrow>The variables</Eyebrow>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          Make the messages yours, without breaking them.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-text-secondary">
          Preview every message, edit the wording, or add your own fields.{" "}
          <br className="hidden md:block" />
          The parts that keep you compliant stay locked.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Card 1 — Fill in your details */}
        <div className="rounded-2xl border border-border-secondary bg-surface-card p-5 pb-9">
          <h3 className="text-[17px] font-semibold text-text-primary">
            Preview with your data
          </h3>
          <p className="mb-6 mt-2 text-sm leading-relaxed text-text-secondary">
            Enter a value once and it shows in every message.
          </p>

          {/* Active field — always shown in its active state, so the border is
              the lighter quaternary tone (#79716B = fg-quaternary), not the
              stronger resting border. */}
          <div className="mb-5">
            <div className="mb-[7px] flex items-baseline justify-between gap-2">
              <span className="text-[11px] text-text-secondary">
                Provider name preview
              </span>
              <span className="font-mono text-[11px] text-text-tertiary">
                provider_name
              </span>
            </div>
            <div className="rounded-lg border border-fg-quaternary bg-bg-primary px-3 py-2.5 text-[13.5px] font-medium text-text-primary">
              Jordan Lee
              <Caret />
            </div>
          </div>

          <div className="rounded-xl border border-border-secondary bg-surface-inset p-3.5">
            <EditorHead />
            <div className="rounded-[9px] border border-border-primary bg-bg-primary px-[13px] py-3 text-sm leading-relaxed text-text-secondary">
              <V>Summit Fitness</V>: your appointment with{" "}
              <Vhl>Jordan Lee</Vhl>
              <Caret /> is confirmed for <V>Tue, March 4th, 2:00 PM</V>. Reply
              STOP to opt out.
            </div>
            <div className="mt-3 flex items-center justify-end opacity-60">
              <InsertVariable />
            </div>
            <div className="opacity-60">
              <EditorActions />
            </div>
          </div>
        </div>

        {/* Card 2 — Add a field */}
        <div className="rounded-2xl border border-border-secondary bg-surface-card p-5 pb-9">
          <h3 className="text-[17px] font-semibold text-text-primary">
            Add a field
          </h3>
          <p className="mb-6 mt-2 text-sm leading-relaxed text-text-secondary">
            Need another field? Open the variable list and drop it in
          </p>

          <div className="rounded-xl border border-border-secondary bg-surface-inset p-3.5">
            <EditorHead />
            <div className="rounded-[9px] border border-border-primary bg-bg-primary px-[13px] py-3 text-sm leading-relaxed text-text-secondary">
              <V>Summit Fitness</V>: your appointment with <V>Jordan Lee</V> is
              confirmed for <V>Tue, March 4th, 2:00 PM</V>. Reschedule{" "}
              <Vhl>summitfitness.com/reschedule</Vhl>
              <Caret /> Reply STOP to opt out.
            </div>
            <div className="relative mt-3 flex items-center justify-end">
              <InsertVariable />
              <VariableMenu />
            </div>
            <EditorActions />
          </div>
        </div>
      </div>
    </section>
  );
}
