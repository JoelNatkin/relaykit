/** Neutral pill showing a post's narrative lane (Demand / Supply /
 *  Retrospective / Worldview). Styled distinctly from the cluster badge. */
import { LANES } from "@/lib/blog/clusters";
import type { Lane } from "@/lib/blog/types";

export function LaneBadge({ lane }: { lane: Lane }) {
  return (
    <span className="inline-flex items-center rounded-full bg-bg-tertiary px-2.5 py-0.5 text-xs font-medium text-text-tertiary">
      {LANES[lane].label}
    </span>
  );
}
