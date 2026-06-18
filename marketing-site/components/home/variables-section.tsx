import { Edit01 } from "@untitledui/icons";
import { Eyebrow } from "@/components/home/section-ui";

// "The variables" — a presentational, STATIC illustration of the message
// authoring experience (D-434). It replaces the prior VariablesCallout
// before→after block. Nothing here is interactive: the active input + caret,
// gold-tint values, the open variable menu, the mouse cursor, and the dimmed
// controls are all illustrative. Geometry is ported
// 1:1 from explorations/landing-page-mockups/relaykit-devtools-landing-mockup.html
// (the design source) translated to the real dark+gold tokens.
//
// The example DATA is parameterized via the optional `example` prop (D-436) so
// sub-vertical landing pages can show a sub-matched message; the home passes
// nothing and gets DEFAULT_EXAMPLE (the appointment example). The eyebrow / H2 /
// bridge copy stay static — only the data varies.

// One run of editor-body text. `kind` undefined = literal copy; "value" = a
// bold identity-tone value (mockup `.v`); "highlight" = a gold-tinted value
// (mockup `.vhl`). Bake surrounding spaces into the literal segments.
export type VarSeg = { t: string; kind?: "value" | "highlight" };

export interface VariablesExample {
  // Card-1 active field value (shown with the static caret).
  inputValue: string;
  // Card-1 editor body (one highlighted value).
  card1Body: VarSeg[];
  // Card-2 editor body (one highlighted value) — the "drop one in" target.
  card2Body: VarSeg[];
  // Card-2 open "Insert variable" menu rows.
  menuRows: { name: string; value: string; selected?: boolean }[];
}

const DEFAULT_EXAMPLE: VariablesExample = {
  inputValue: "Jordan Lee",
  card1Body: [
    { t: "Summit Fitness", kind: "value" },
    { t: ": your appointment with " },
    { t: "Jordan Lee", kind: "highlight" },
    { t: " is confirmed for " },
    { t: "Tue, March 4th, 2:00 PM", kind: "value" },
    { t: ". Reply STOP to opt out." },
  ],
  card2Body: [
    { t: "Summit Fitness", kind: "value" },
    { t: ": your appointment with " },
    { t: "Jordan Lee", kind: "value" },
    { t: " is confirmed for " },
    { t: "Tue, March 4th, 2:00 PM", kind: "value" },
    { t: ". Reschedule " },
    { t: "summitfitness.com/reschedule", kind: "highlight" },
    { t: " Reply STOP to opt out." },
  ],
  menuRows: [
    { name: "workspace_name", value: "Summit Fitness" },
    { name: "provider_name", value: "Jordan Lee" },
    {
      name: "reschedule_link",
      value: "summitfitness.com/reschedule",
      selected: true,
    },
    { name: "appointment_time", value: "Tue, March 4th, 2:00 PM" },
  ],
};

// Static gold text-cursor — illustrative only (no blink). Card-1 input only.
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
    <span className="rounded-[5px] bg-bg-gold/20 px-1.5 pb-[3px] pt-px font-medium text-text-primary">
      {children}
    </span>
  );
}

// Render an editor body from its segment list.
function Body({ segments }: { segments: VarSeg[] }) {
  return (
    <>
      {segments.map((seg, i) => {
        if (seg.kind === "value") return <V key={i}>{seg.t}</V>;
        if (seg.kind === "highlight") return <Vhl key={i}>{seg.t}</Vhl>;
        return <span key={i}>{seg.t}</span>;
      })}
    </>
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

// The open "Insert variable" menu (mockup `.vdropwrap`) — right-anchored,
// width calc(100% - 16px), rows from `menuRows`, cursor on the selected row.
function VariableMenu({
  rows,
}: {
  rows: VariablesExample["menuRows"];
}) {
  return (
    <div className="absolute right-0 top-[calc(100%+8px)] z-10 w-[calc(100%-16px)] overflow-hidden rounded-[10px] border border-border-primary bg-surface-inset shadow-[0_8px_20px_rgba(0,0,0,0.35)]">
      <div className="pt-2">
        {rows.map((row) => (
          <div
            key={row.name}
            className={`relative flex items-center justify-between gap-4 py-[5px] pl-4 pr-4 text-[13px] [&+&]:border-t [&+&]:border-border-tertiary ${
              row.selected ? "bg-white/[0.06]" : ""
            }`}
          >
            <span className="whitespace-nowrap font-mono text-[12px] text-text-tertiary">
              {row.name}
            </span>
            <span
              className={`min-w-0 truncate text-text-primary ${
                row.selected ? "opacity-100" : "opacity-60"
              }`}
            >
              {row.value}
            </span>
            {row.selected ? <CursorGlyph /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export function VariablesSection({
  example = DEFAULT_EXAMPLE,
}: {
  example?: VariablesExample;
} = {}) {
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
        <div className="rounded-2xl border border-border-secondary bg-surface-card p-5 pb-7">
          <h3 className="text-[17px] font-semibold text-text-primary">
            Preview with your data
          </h3>
          <p className="mb-7 mt-2 text-sm leading-relaxed text-text-secondary">
            Enter a value once and it shows in every message.
          </p>

          {/* Active field — always shown in its active state, so the border is
              the lighter quaternary tone (#79716B = fg-quaternary), not the
              stronger resting border. */}
          <div className="mb-5">
            <div className="rounded-lg border border-fg-quaternary bg-bg-primary px-3 py-2.5 text-[13.5px] font-medium text-text-primary">
              {example.inputValue}
              <Caret />
            </div>
          </div>

          <div className="rounded-xl border border-border-secondary bg-surface-inset p-3.5">
            <EditorHead />
            <div className="rounded-[9px] border border-border-primary bg-bg-primary px-[13px] py-3 text-sm leading-relaxed text-text-secondary">
              <Body segments={example.card1Body} />
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
        <div className="rounded-2xl border border-border-secondary bg-surface-card p-5 pb-7">
          <h3 className="text-[17px] font-semibold text-text-primary">
            Customize any message
          </h3>
          <p className="mb-7 mt-2 text-sm leading-relaxed text-text-secondary">
            Open the variable list and drop one in.
          </p>

          <div className="rounded-xl border border-border-secondary bg-surface-inset p-3.5">
            <EditorHead />
            <div className="rounded-[9px] border border-border-primary bg-bg-primary px-[13px] py-3 text-sm leading-relaxed text-text-secondary">
              <Body segments={example.card2Body} />
            </div>
            <div className="relative mt-3 flex items-center justify-end">
              <InsertVariable />
              <VariableMenu rows={example.menuRows} />
            </div>
            <EditorActions />
          </div>
        </div>
      </div>
    </section>
  );
}
