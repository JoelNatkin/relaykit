/** Plain-text lane indicator (Demand / Supply / Retrospective / Worldview).
 *
 *  Deliberately NOT a pill: lane filtering is out of scope for V1, so the
 *  styling must not imply a clickable control. Rendered as quiet tertiary
 *  text alongside the (clickable) cluster badge. */
import { LANES } from "@/lib/blog/clusters";
import type { Lane } from "@/lib/blog/types";

export function LaneBadge({ lane }: { lane: Lane }) {
  return (
    <span className="text-xs text-text-tertiary">{LANES[lane].label}</span>
  );
}
