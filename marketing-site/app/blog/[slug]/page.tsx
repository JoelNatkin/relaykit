import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd, buildArticleJsonLd } from "@/components/blog/json-ld";
import { MdxContent } from "@/components/blog/mdx-content";
import { PostHeader } from "@/components/blog/post-header";
import { Prose } from "@/components/blog/prose";
import { getAllPosts, getPostBySlug } from "@/lib/blog/posts";
import { DEFAULT_OG_IMAGE } from "@/lib/blog/site";

/** Only published slugs are pre-rendered; anything else 404s. */
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const { frontmatter } = post;
  const url = `/blog/${slug}`;
  const ogImage = frontmatter.og_image ?? DEFAULT_OG_IMAGE;

  return {
    title: `${frontmatter.title} | RelayKit Blog`,
    description: frontmatter.description,
    // Self-canonical unless the post declares it is mirrored from elsewhere.
    alternates: { canonical: frontmatter.canonical_url ?? url },
    openGraph: {
      type: "article",
      title: frontmatter.title,
      description: frontmatter.description,
      url,
      publishedTime: frontmatter.date,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: frontmatter.title,
      description: frontmatter.description,
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="px-4 py-16 sm:px-6 lg:px-8">
      <Prose>
        <PostHeader post={post} />
        <MdxContent source={post.content} />
      </Prose>
      <JsonLd data={buildArticleJsonLd(post)} />
    </div>
  );
}
