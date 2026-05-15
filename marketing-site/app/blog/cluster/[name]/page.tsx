import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/blog/post-card";
import { clusterSlugs, getCluster } from "@/lib/blog/clusters";
import { getPostsByCluster } from "@/lib/blog/posts";

/** Only the 11 known cluster slugs are pre-rendered; anything else 404s. */
export const dynamicParams = false;

export function generateStaticParams() {
  return clusterSlugs().map((name) => ({ name }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  const { name } = await params;
  const cluster = getCluster(name);
  if (!cluster) return {};

  return {
    title: `${cluster.name} | RelayKit Blog`,
    description: cluster.description,
    alternates: { canonical: `/blog/cluster/${name}` },
  };
}

export default async function ClusterIndexPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const cluster = getCluster(name);
  if (!cluster) notFound();

  const posts = getPostsByCluster(cluster.slug);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="mb-10">
        <p className="text-sm font-semibold text-text-brand-secondary">Cluster</p>
        <h1 className="mt-1 text-3xl font-semibold text-text-primary">
          {cluster.name}
        </h1>
        <p className="mt-2 text-base leading-relaxed text-text-tertiary">
          {cluster.description}
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-base text-text-tertiary">
          No posts in this cluster yet — check back soon.
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
