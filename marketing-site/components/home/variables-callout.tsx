import {
  APPOINTMENTS,
  ORDER_UPDATES,
  VERIFICATION,
  interpolateBody,
} from "@/lib/message-library";
import type { Category, Variable } from "@/lib/message-library";

// Real before→after: each example is a canonical corpus message (the same
// bodies the configurator produces), shown as its raw {{token}} template, then
// resolved through interpolateBody with corpus example values. No artifact
// placeholders. No outer card — the pairs sit on the page background.
type Example = { body: string; variables: Variable[] };

function pick(category: Category, messageId: string): Example {
  const message = category.messages.find((m) => m.id === messageId);
  const variant =
    message?.variants.find((v) => v.tone === "Standard") ?? message?.variants[0];
  return { body: variant?.body ?? "", variables: category.variables };
}

const EXAMPLES: Example[] = [
  pick(APPOINTMENTS, "confirmation"),
  pick(ORDER_UPDATES, "order-shipped"),
  pick(VERIFICATION, "verification-code"),
];

// Template: regular font for words; only the {{token}} segments render in mono
// with a slight gold-tint background (same tint as the "What we handle"
// featured-icon backgrounds).
function TemplateForm({ body }: { body: string }) {
  return (
    <>
      {body
        .split(/(\{\{\w+\}\})/g)
        .filter(Boolean)
        .map((part, i) => {
          const match = part.match(/^\{\{(\w+)\}\}$/);
          return match ? (
            <span
              key={i}
              className="rounded bg-bg-gold/15 px-1.5 py-0.5 font-mono text-[0.82rem] text-gold"
            >
              {match[1]}
            </span>
          ) : (
            <span key={i}>{part}</span>
          );
        })}
    </>
  );
}

// Resolved preview via interpolateBody (corpus example values, businessName="").
// Variable segments take the neutral text-variable color — same as the card.
function PreviewForm({ body, variables }: Example) {
  return (
    <>
      {interpolateBody(body, variables, { businessName: "" }).map((seg, i) =>
        seg.isVariable ? (
          <span key={i} className="font-medium text-text-variable">
            {seg.text}
          </span>
        ) : (
          <span key={i}>{seg.text}</span>
        ),
      )}
    </>
  );
}

export function VariablesCallout() {
  return (
    <div className="mt-10">
      <div className="text-lg font-semibold text-text-primary">
        See exactly what customers will receive.
      </div>
      <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-text-secondary">
        Preview appointment times, order details, links, names, and other
        variables using realistic data — before you ever write code.
      </p>
      <div className="mt-4">
        {EXAMPLES.map((ex, i) => (
          <div
            key={i}
            className="grid items-center gap-3 border-t border-dashed border-border-secondary py-5 md:grid-cols-[1fr_2rem_1fr]"
          >
            <div className="text-sm leading-relaxed text-text-secondary">
              <TemplateForm body={ex.body} />
            </div>
            <div className="hidden text-center text-text-tertiary md:block" aria-hidden>
              →
            </div>
            <div className="rounded-2xl rounded-br-sm border border-border-secondary bg-bg-primary px-3.5 py-3 text-sm leading-relaxed text-text-secondary dark:bg-bg-secondary">
              <PreviewForm body={ex.body} variables={ex.variables} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
