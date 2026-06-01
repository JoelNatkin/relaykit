"use client";

/**
 * Elig section — the customer-facing eligibility surface on the home
 * configurator. Renders three label-less dropdowns per vertical-constraints
 * §9.2: multi-tenant (D1), vertical (D2), sub-vertical (D3 conditional).
 *
 * Sits at the top of the configurator's right column above the tone pills,
 * per §9 ("upper right of the configurator area, above the message tone
 * toggle"). Below md: the configurator grid collapses to one column and the
 * section appears between the mobile categories summary and the tone pills.
 *
 * State is hoisted into the parent (configurator-section.tsx) so the parent
 * can gate sibling rendering (Wave 2: disabled categories panel + replaced
 * message stream on 🟠/⚫/🔴 verdicts). This component is presentational
 * apart from owning the open/close state inside each EligDropdown.
 *
 * Wave 1 ships dropdowns + state + localStorage emission only — no verdict
 * UI. Wave 2 adds the five verdict-card variants and the empty-state
 * placeholder.
 */

import type { EligState } from "@/lib/configurator/use-elig-state";
import { VERTICALS, findVertical } from "../../../lib/constraints";
import { EligDropdown, type EligDropdownOption } from "./elig-dropdown";
import { EligVerdictCard } from "./elig-verdict-card";

/**
 * D3 placeholder copy. Default: "What kind of {vertical-name-lowercased}?".
 * Per PM ruling §5.7, edge-case verticals get hand-edited renditions so the
 * sentence reads naturally with multi-word or punctuated names.
 */
const D3_PLACEHOLDER_OVERRIDES: Record<string, string> = {
  "home-local-services": "home or local services",
  "retail-hospitality": "retail or hospitality",
  "creator-community": "creator or community work",
  "b2b-saas": "B2B SaaS or developer tooling",
  "civic-public-sector": "civic or public-sector work",
};

export function eligD3Placeholder(vertical: {
  slug: string;
  name: string;
}): string {
  const phrase =
    D3_PLACEHOLDER_OVERRIDES[vertical.slug] ?? vertical.name.toLowerCase();
  return `What kind of ${phrase}?`;
}

const VERTICAL_OPTIONS: EligDropdownOption[] = VERTICALS.map((v) => ({
  value: v.slug,
  label: v.name,
}));

export interface EligSectionProps {
  state: EligState;
  onVerticalChange: (slug: string | null) => void;
  onSubVerticalChange: (slug: string | null) => void;
  /** Opens the EligRequestModal from the verdict card's Not-yet footer. */
  onRequest: () => void;
}

export function EligSection({
  state,
  onVerticalChange,
  onSubVerticalChange,
  onRequest,
}: EligSectionProps) {
  const selectedVertical = state.verticalSlug
    ? findVertical(state.verticalSlug)
    : null;

  // D3 surfaces only when the picked vertical has any routingTrigger:true
  // sub-vertical (§9.2). Options include ALL sub-verticals — routingTrigger
  // gates whether the dropdown surfaces at all; users still need to be able
  // to land on non-routing sub-verticals like cannabis or restaurants.
  const showSubVerticalDropdown = !!(
    selectedVertical &&
    selectedVertical.subVerticals.some((s) => s.routingTrigger)
  );

  // "Not our lane" sub-verticals render disabled + grouped under a "Not
  // supported" header. Membership comes straight from the data bucket — not a
  // hardcoded list — so it tracks data changes. The dropdown sorts disabled
  // options to the bottom.
  const subVerticalOptions: EligDropdownOption[] = selectedVertical
    ? selectedVertical.subVerticals.map((s) => ({
        value: s.slug,
        label: s.name,
        disabled: s.bucket === "Not our lane",
      }))
    : [];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <EligDropdown
          placeholder="What industry does your app serve?"
          value={state.verticalSlug}
          options={VERTICAL_OPTIONS}
          onChange={onVerticalChange}
          ariaLabel="What industry does your app serve?"
        />
        {showSubVerticalDropdown && selectedVertical ? (
          <EligDropdown
            placeholder={eligD3Placeholder(selectedVertical)}
            value={state.subVerticalSlug}
            options={subVerticalOptions}
            onChange={onSubVerticalChange}
            ariaLabel={eligD3Placeholder(selectedVertical)}
            clearable={false}
            disabledGroupLabel="Not supported"
          />
        ) : null}
      </div>
      <EligVerdictCard state={state} onRequest={onRequest} />
    </div>
  );
}
