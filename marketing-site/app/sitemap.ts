import type { MetadataRoute } from "next";
import { clusterSlugs } from "@/lib/blog/clusters";
import { getAllPosts } from "@/lib/blog/posts";
import { absoluteUrl } from "@/lib/blog/site";

/** Stable marketing routes that always belong in the sitemap. */
const STATIC_ROUTES = ["/", "/privacy", "/terms", "/acceptable-use", "/blog"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: absoluteUrl(route),
    lastModified: now,
  }));

  const clusterEntries: MetadataRoute.Sitemap = clusterSlugs().map((slug) => ({
    url: absoluteUrl(`/blog/cluster/${slug}`),
    lastModified: now,
  }));

  const postEntries: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(`${post.frontmatter.date}T00:00:00Z`),
  }));

  return [...staticEntries, ...clusterEntries, ...postEntries];
}
