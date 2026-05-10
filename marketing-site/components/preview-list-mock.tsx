// Static Preview list mock for Section 4 (Test it for real). Mirrors
// prototype/components/test-phones-card.tsx structure — same card chrome,
// same status-dot conventions (verified = bg-fg-success-primary, invited =
// bg-fg-quaternary), same "+ Invite someone" link styling. Three hardcoded
// rows; non-interactive on the marketing surface.

const ROWS = [
  { name: "Joel", phone: "(555) 867-8842", status: "verified" as const },
  { name: "Sarah", phone: "(555) 412-5519", status: "verified" as const },
  { name: "Mike", phone: "(555) 290-3301", status: "invited" as const },
];

const STATUS_DOT = {
  verified: "bg-fg-success-primary",
  invited: "bg-fg-quaternary",
} as const;

const STATUS_LABEL = {
  verified: "Verified",
  invited: "Invited",
} as const;

export function PreviewListMock() {
  return (
    <div className="rounded-xl border border-border-secondary bg-bg-primary p-6">
      <h3 className="text-base font-semibold text-text-primary">Preview list</h3>
      <p className="mt-1 text-sm text-text-tertiary">
        Your safe audience for sending test messages, before and after launch.
      </p>

      <ul className="mt-4 divide-y divide-border-secondary">
        {ROWS.map((row) => (
          <li key={row.name} className="py-3 first:pt-0 last:pb-0">
            <div className="flex items-center justify-between gap-3">
              <span className="truncate text-sm font-semibold text-text-primary">{row.name}</span>
              <span className="inline-flex flex-shrink-0 items-center gap-1.5 whitespace-nowrap text-xs text-text-tertiary">
                <span
                  className={`inline-block size-1.5 rounded-full ${STATUS_DOT[row.status]}`}
                />
                {STATUS_LABEL[row.status]}
              </span>
            </div>
            <div className="mt-0.5 text-sm text-text-tertiary">{row.phone}</div>
          </li>
        ))}
      </ul>

      <div className="mt-3">
        <span className="text-sm font-semibold text-text-brand-secondary">+ Invite someone</span>
      </div>
    </div>
  );
}
