/** List item for the blog index and cluster index pages. */
import Link from "next/link";
import { formatDate } from "@/lib/blog/format";
import type { Post } from "@/lib/blog/types";
import { ClusterBadge } from "./cluster-badge";
import { LaneBadge } from "./lane-badge";

export function PostCard({ post }: { post: Post }) {
  const { frontmatter, readingTimeMinutes, slug } = post;

  return (
    <article className="border-b border-border-secondary py-8 first:pt-0">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <ClusterBadge slug={frontmatter.cluster} />
        <LaneBadge lane={frontmatter.lane} />
      </div>
      <h2 className="text-xl font-semibold text-text-primary">
        <Link
          href={`/blog/${slug}`}
          className="transition duration-100 ease-linear hover:text-text-brand-secondary"
        >
          {frontmatter.title}
        </Link>
      </h2>
      <p className="mt-2 text-base leading-relaxed text-text-tertiary">
        {frontmatter.description}
      </p>
      <p className="mt-3 text-sm text-text-quaternary">
        <time dateTime={frontmatter.date}>{formatDate(frontmatter.date)}</time>
        {" · "}
        {readingTimeMinutes} min read
      </p>
    </article>
  );
}
