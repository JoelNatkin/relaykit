import { Feed } from "feed";
import { getAllPosts } from "@/lib/blog/posts";
import {
  absoluteUrl,
  BLOG_AUTHOR,
  BLOG_DESCRIPTION,
  BLOG_TITLE,
} from "@/lib/blog/site";

/** Generated at build time alongside the other blog routes. */
export const dynamic = "force-static";

export function GET() {
  const blogUrl = absoluteUrl("/blog");

  const feed = new Feed({
    title: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
    id: blogUrl,
    link: blogUrl,
    language: "en",
    copyright: `© ${new Date().getFullYear()} RelayKit LLC`,
    feedLinks: { rss2: absoluteUrl("/blog/feed.xml") },
    author: { name: BLOG_AUTHOR },
  });

  for (const post of getAllPosts()) {
    const url = absoluteUrl(`/blog/${post.slug}`);
    feed.addItem({
      title: post.frontmatter.title,
      id: url,
      link: url,
      description: post.frontmatter.description,
      date: new Date(`${post.frontmatter.date}T00:00:00Z`),
      author: [{ name: BLOG_AUTHOR }],
    });
  }

  return new Response(feed.rss2(), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
