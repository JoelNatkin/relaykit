import type { Metadata } from "next";
import { PostCard } from "@/components/blog/post-card";
import { getAllPosts } from "@/lib/blog/posts";
import { BLOG_DESCRIPTION, BLOG_TITLE } from "@/lib/blog/site";

export const metadata: Metadata = {
  title: `${BLOG_TITLE} | RelayKit`,
  description: BLOG_DESCRIPTION,
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold text-text-primary">{BLOG_TITLE}</h1>
        <p className="mt-2 text-base leading-relaxed text-text-tertiary">
          {BLOG_DESCRIPTION}
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-base text-text-tertiary">
          No posts yet — check back soon.
        </p>
      ) : (
        <div>
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
