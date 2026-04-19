/**
 * D-351 (revised 2026-04-18): custom messages are addressed by an immutable
 * slug assigned at first Save. The slug is derived from the user-visible name
 * with a collision-safe numeric suffix so two messages named "Holiday hours"
 * don't both claim the same slug.
 *
 * The collision set should include every live slug (active + archived). A
 * permanently-deleted slug is freed — consistent with the Delete modal's
 * "sends will fail" warning, which treats the slug as released.
 */
export function generateSlug(name: string, existingSlugs: Set<string>): string {
  const base = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const slug = base || "message";
  if (!existingSlugs.has(slug)) return slug;
  let n = 2;
  while (existingSlugs.has(`${slug}-${n}`)) n++;
  return `${slug}-${n}`;
}
