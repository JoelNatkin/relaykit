/** Shared formatting helpers for blog surfaces. */

const DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

/** Format an ISO date (`YYYY-MM-DD`) as e.g. "June 3, 2026".
 *  Parsed and formatted in UTC so the displayed day never shifts by locale. */
export function formatDate(iso: string): string {
  return DATE_FORMAT.format(new Date(`${iso}T00:00:00Z`));
}
