// StatusBand — slim now/later band between Hero and the paperwork section.
// Extracted from app/page.tsx (Session 139) so landing pages can reuse it as-is.
export function StatusBand() {
  return (
    <section className="mx-auto max-w-5xl border-t border-border-secondary px-6 py-8 text-center">
      <p className="text-base text-text-primary">
        Our free message templates are live.
        <br />
        <span className="text-text-tertiary">Sending arrives Summer 2026.</span>
      </p>
    </section>
  );
}
