/** Pill linking to a cluster index page. Display name comes from the
 *  cluster registry so it is defined in exactly one place. */
import Link from "next/link";
import { getCluster } from "@/lib/blog/clusters";
import type { ClusterSlug } from "@/lib/blog/types";

export function ClusterBadge({ slug }: { slug: ClusterSlug }) {
  const cluster = getCluster(slug);
  if (!cluster) return null;

  return (
    <Link
      href={`/blog/cluster/${slug}`}
      className="inline-flex items-center rounded-full bg-bg-brand-secondary px-2.5 py-0.5 text-xs font-medium text-text-brand-secondary transition duration-100 ease-linear hover:bg-bg-brand-primary"
    >
      {cluster.name}
    </Link>
  );
}
