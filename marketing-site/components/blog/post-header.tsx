/** Post title block: cluster + lane badges, H1, and a meta line
 *  (date · reading time · byline). Mirrors the privacy-page header. */
import { formatDate } from "@/lib/blog/format";
import { BLOG_AUTHOR } from "@/lib/blog/site";
import type { Post } from "@/lib/blog/types";
import { ClusterBadge } from "./cluster-badge";
import { LaneBadge } from "./lane-badge";

export function PostHeader({ post }: { post: Post }) {
  const { frontmatter, readingTimeMinutes } = post;

  return (
    <header className="mb-10">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <ClusterBadge slug={frontmatter.cluster} />
        <LaneBadge lane={frontmatter.lane} />
      </div>
      <h1 className="text-3xl font-semibold text-text-primary">
        {frontmatter.title}
      </h1>
      <p className="mt-3 text-sm text-text-tertiary">
        <time dateTime={frontmatter.date}>{formatDate(frontmatter.date)}</time>
        {" · "}
        {readingTimeMinutes} min read
        {" · "}
        By {BLOG_AUTHOR}
      </p>
    </header>
  );
}
