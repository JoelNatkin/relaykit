export default function CategoryLanding({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
      <p className="text-text-tertiary text-sm">Category landing page — Task 3</p>
    </div>
  );
}
