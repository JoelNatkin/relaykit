"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSession } from "@/context/session-context";
import { CopyButton } from "@/components/copy-button";
import { loadWizardData } from "@/lib/wizard-storage";

const APP_NAMES: Record<string, string> = {
  glowstudio: "GlowStudio",
};

/* ── Inline editable field ── */

function EditableField({
  label,
  value,
  editingField,
  fieldKey,
  onEdit,
  onSave,
  onCancel,
  editValue,
  onEditValueChange,
}: {
  label: string;
  value: string;
  editingField: string | null;
  fieldKey: string;
  onEdit: (key: string, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  editValue: string;
  onEditValueChange: (v: string) => void;
}) {
  const isEditing = editingField === fieldKey;

  if (isEditing) {
    return (
      <div>
        <dt className="text-sm text-text-tertiary mb-1.5">{label}</dt>
        <dd>
          <input
            type="text"
            value={editValue}
            onChange={(e) => onEditValueChange(e.target.value)}
            className="w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2 text-sm text-text-primary shadow-xs focus:border-border-brand focus:outline-none"
            autoFocus
          />
          <div className="mt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="text-sm font-medium text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSave}
              className="rounded-md bg-bg-brand-solid px-3 py-1.5 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover cursor-pointer"
            >
              Save
            </button>
          </div>
        </dd>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <dt className="text-sm text-text-tertiary">{label}</dt>
      <dd className="flex items-center gap-2">
        <span className="text-sm font-medium text-text-primary">{value}</span>
        <button
          type="button"
          onClick={() => onEdit(fieldKey, value)}
          className="text-sm font-medium text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear cursor-pointer"
        >
          Edit
        </button>
      </dd>
    </div>
  );
}

/* ── Read-only field ── */

function ReadOnlyField({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <dt className="text-sm text-text-tertiary">{label}</dt>
        <dd className="text-sm font-medium text-text-primary">{value}</dd>
      </div>
      {sub && <p className="mt-0.5 text-xs text-text-quaternary">{sub}</p>}
    </div>
  );
}

/* ── EIN row ── */

function EinRow({
  hasEIN,
  showAddWhenMissing,
  editable = false,
}: {
  hasEIN: boolean;
  showAddWhenMissing: boolean;
  editable?: boolean;
}) {
  if (!hasEIN) {
    if (!showAddWhenMissing) return null;
    return (
      <div className="flex items-center justify-between">
        <dt className="text-sm text-text-tertiary">EIN</dt>
        <dd className="flex items-center gap-2">
          <span className="text-sm font-medium text-text-primary">Not on file</span>
          <button
            type="button"
            className="text-sm font-medium text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear cursor-pointer"
          >
            Add
          </button>
        </dd>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-between">
      <dt className="text-sm text-text-tertiary">EIN</dt>
      <dd className="flex items-center gap-2">
        <span className="text-sm font-medium text-text-primary">••••••4567</span>
        {editable && (
          <button
            type="button"
            className="text-sm font-medium text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear cursor-pointer"
          >
            Edit
          </button>
        )}
      </dd>
    </div>
  );
}

/* ── Confirmation modal (reusable) ── */

function ConfirmModal({
  open,
  title,
  body,
  confirmLabel,
  cancelLabel = "Cancel",
  destructive = false,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  body: string;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-xl bg-bg-primary border border-border-secondary shadow-xl p-6">
        <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
        <p className="mt-3 text-sm text-text-secondary leading-relaxed">{body}</p>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-border-primary bg-bg-primary px-4 py-2.5 text-sm font-semibold text-text-secondary transition duration-100 ease-linear hover:bg-bg-secondary cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-lg px-4 py-2.5 text-sm font-semibold text-text-white transition duration-100 ease-linear cursor-pointer ${
              destructive
                ? "bg-bg-error-solid hover:bg-[var(--color-error-700)]"
                : "bg-bg-brand-solid hover:bg-bg-brand-solid_hover"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Status dot ── */

function StatusDot({ color }: { color: "green" | "amber" | "red" | "grey" }) {
  const colors = {
    green: "bg-[#12B76A]",
    amber: "bg-[#F79009]",
    red: "bg-[#F04438]",
    grey: "bg-[#98A2B3]",
  };
  return <span className={`inline-block h-2 w-2 rounded-full ${colors[color]}`} />;
}

/* ── Page ── */

export default function AppSettings() {
  const { appId } = useParams<{ appId: string }>();
  const { state } = useSession();
  const rs = state.registrationState;
  const isDefault = rs === "onboarding" || rs === "building";
  const isPending = rs === "pending";
  const isExtendedReview = rs === "changes_requested";
  const isApproved = rs === "registered";
  const isRejected = rs === "rejected";
  const hasRegistered = !isDefault; // post-registration = any non-default state
  const appName = APP_NAMES[appId] || appId;

  // EIN toggle — read from wizard sessionStorage (driven by top-bar dev switcher)
  const [hasEIN, setHasEIN] = useState(false);
  useEffect(() => {
    function readEin() {
      setHasEIN(!!loadWizardData().ein);
    }
    readEin();
    window.addEventListener("relaykit-ein-change", readEin);
    return () => window.removeEventListener("relaykit-ein-change", readEin);
  }, []);

  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  // Modal states
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelConfirmText, setCancelConfirmText] = useState("");
  const [regenSandboxModalOpen, setRegenSandboxModalOpen] = useState(false);
  const [regenLiveModalOpen, setRegenLiveModalOpen] = useState(false);

  // Editable field values (prototype local state)
  const [businessName, setBusinessName] = useState(appName);

  function startEdit(key: string, value: string) {
    setEditingField(key);
    setEditValue(value);
  }

  function saveEdit() {
    if (editingField === "business_name") setBusinessName(editValue);
    setEditingField(null);
  }

  function cancelEdit() {
    setEditingField(null);
  }

  return (
    <div className="py-4 space-y-6 max-w-[600px] mx-auto">
      {/* Back link */}
      <Link
        href={`/apps/${appId}`}
        className="inline-flex items-center gap-1 text-sm font-medium text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear"
      >
        &larr; Back to {appName}
      </Link>

      <h1 className="text-2xl font-semibold text-text-primary mb-6">Settings</h1>

      {/* Modals */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-bg-primary border border-border-secondary shadow-xl p-6">
            <h2 className="text-lg font-semibold text-text-primary">Cancel your plan</h2>
            <p className="mt-3 text-sm text-text-secondary leading-relaxed">
              Your plan will stay active through April 14, 2026. After that, live messaging stops but your test environment stays available — your code, your API key, and your test setup aren&apos;t going anywhere.
            </p>
            <div className="mt-4">
              <label htmlFor="cancel-confirm" className="block text-sm text-text-tertiary mb-1.5">
                Type CANCEL to confirm
              </label>
              <input
                id="cancel-confirm"
                type="text"
                value={cancelConfirmText}
                onChange={(e) => setCancelConfirmText(e.target.value)}
                placeholder="CANCEL"
                className="w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2 text-sm text-text-primary shadow-xs focus:border-border-brand focus:outline-none"
              />
            </div>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setCancelModalOpen(false);
                  setCancelConfirmText("");
                }}
                className="rounded-lg border border-border-primary bg-bg-primary px-4 py-2.5 text-sm font-semibold text-text-secondary transition duration-100 ease-linear hover:bg-bg-secondary cursor-pointer"
              >
                Keep plan
              </button>
              <button
                type="button"
                disabled={cancelConfirmText !== "CANCEL"}
                onClick={() => {
                  setCancelModalOpen(false);
                  setCancelConfirmText("");
                }}
                className="rounded-lg bg-bg-error-solid px-4 py-2.5 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-[var(--color-error-700)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Cancel plan
              </button>
            </div>
          </div>
        </div>
      )}
      <ConfirmModal
        open={regenSandboxModalOpen}
        title="Regenerate test key"
        body="This will invalidate your current test key. Code using it will stop working."
        confirmLabel="Regenerate"
        destructive
        onCancel={() => setRegenSandboxModalOpen(false)}
        onConfirm={() => setRegenSandboxModalOpen(false)}
      />
      <ConfirmModal
        open={regenLiveModalOpen}
        title="Regenerate live key"
        body="This will immediately invalidate your current live key and generate a new one. The new key will be shown once — copy it before closing. Any code using the old key will stop working."
        confirmLabel="Regenerate"
        destructive
        onCancel={() => setRegenLiveModalOpen(false)}
        onConfirm={() => setRegenLiveModalOpen(false)}
      />

      {/* ── Section 1: Business Info ── */}
      <div className="rounded-xl border border-border-secondary bg-bg-primary p-5">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Business info</h3>
        <dl className="space-y-3">
          {isDefault ? (
            <>
              <EditableField
                label="Business name"
                value={businessName}
                editingField={editingField}
                fieldKey="business_name"
                onEdit={startEdit}
                onSave={saveEdit}
                onCancel={cancelEdit}
                editValue={editValue}
                onEditValueChange={setEditValue}
              />
              <ReadOnlyField label="Category" value="Appointment reminders" />
              <EinRow hasEIN={hasEIN} showAddWhenMissing editable={hasEIN} />
            </>
          ) : (
            <>
              <ReadOnlyField label="Business name" value={businessName} />
              <ReadOnlyField label="Category" value="Appointment reminders" />
              <EinRow hasEIN={hasEIN} showAddWhenMissing={isApproved} />
            </>
          )}
        </dl>
      </div>

      {/* ── Section 3: Registration ── */}
      {isPending && (
        <div className="rounded-xl border border-border-secondary bg-bg-primary p-5">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Registration</h3>
          <dl className="space-y-3">
            <div className="flex items-center justify-between">
              <dt className="text-sm text-text-tertiary">Status</dt>
              <dd className="flex items-center gap-1.5 text-sm font-medium text-text-primary">
                <StatusDot color="amber" />
                In review
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-sm text-text-tertiary">Submitted</dt>
              <dd className="text-sm font-medium text-text-primary">Mar 10, 2026</dd>
            </div>
          </dl>
        </div>
      )}

      {isExtendedReview && (
        <div className="rounded-xl border border-border-secondary bg-bg-primary p-5">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Registration</h3>
          <dl className="space-y-3">
            <div className="flex items-center justify-between">
              <dt className="text-sm text-text-tertiary">Status</dt>
              <dd className="flex items-center gap-1.5 text-sm font-medium text-text-primary">
                <StatusDot color="amber" />
                Extended review
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-sm text-text-tertiary">Submitted</dt>
              <dd className="text-sm font-medium text-text-primary">Mar 10, 2026</dd>
            </div>
          </dl>
          <p className="mt-4 text-sm text-text-tertiary">
            This is taking longer than usual. We&apos;ll email you at jen@glowstudio.com when there&apos;s an update.
          </p>
        </div>
      )}

      {isApproved && (
        <div className="rounded-xl border border-border-secondary bg-bg-primary p-5">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Registration</h3>
          <dl className="space-y-3">
            <div className="flex items-center justify-between">
              <dt className="text-sm text-text-tertiary">Status</dt>
              <dd className="flex items-center gap-1.5 text-sm font-medium text-text-primary">
                <StatusDot color="green" />
                Active
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-sm text-text-tertiary">Your SMS number</dt>
              <dd className="text-sm font-medium text-text-primary">+1 (555) 867-5309</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-sm text-text-tertiary">Approved</dt>
              <dd className="text-sm font-medium text-text-primary">Mar 31, 2026</dd>
            </div>
          </dl>
          <div className="mt-4 flex justify-end">
            <a
              href="#"
              className="text-sm font-medium text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear"
            >
              View compliance site &rarr;
            </a>
          </div>
        </div>
      )}

      {isRejected && (
        <div className="rounded-xl border border-border-secondary bg-bg-primary p-5">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Registration</h3>
          <dl className="space-y-3">
            <div className="flex items-center justify-between">
              <dt className="text-sm text-text-tertiary">Status</dt>
              <dd className="flex items-center gap-1.5 text-sm font-medium text-text-primary">
                <StatusDot color="red" />
                Not approved
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-sm text-text-tertiary">Submitted</dt>
              <dd className="text-sm font-medium text-text-primary">Mar 10, 2026</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-sm text-text-tertiary">Reviewed</dt>
              <dd className="text-sm font-medium text-text-primary">Mar 22, 2026</dd>
            </div>
          </dl>

          <p className="mt-4 text-sm text-text-secondary leading-relaxed">
            Your registration wasn&apos;t approved. The business information provided didn&apos;t match public records.
          </p>
          <p className="mt-2 text-sm text-text-secondary leading-relaxed">
            Contact us at{" "}
            <a
              href="mailto:support@relaykit.ai"
              className="text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear"
            >
              support@relaykit.ai
            </a>{" "}
            if you believe this is an error.
          </p>
        </div>
      )}

      {/* ── Section 4: API Keys ── */}
      <div className="rounded-xl border border-border-secondary bg-bg-primary p-5">
        <h3 className="text-lg font-semibold text-text-primary mb-4">API keys</h3>

        <div className="space-y-4">
          {/* Test key — always visible */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <p className="text-sm font-medium text-text-quaternary uppercase tracking-wide">
                Test
              </p>
              <span className="inline-flex items-center rounded-full bg-bg-success-secondary px-2 py-0.5 text-xs font-medium text-text-success-primary">
                Active
              </span>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded-md bg-bg-secondary px-3 py-2 text-sm font-mono text-text-primary">
                rk_sandbox_rL7x9Kp2mWqYvBn4
              </code>
              <CopyButton text="rk_sandbox_rL7x9Kp2mWqYvBn4" />
            </div>
          </div>

          {/* Live key — Approved state only */}
          {isApproved && (
            <>
              <div className="border-t border-border-secondary pt-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <p className="text-sm font-medium text-text-quaternary uppercase tracking-wide">
                    Live
                  </p>
                  <span className="inline-flex items-center rounded-full bg-bg-success-secondary px-2 py-0.5 text-xs font-medium text-text-success-primary">
                    Active
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 rounded-md bg-bg-secondary px-3 py-2 text-sm font-mono text-text-primary tracking-wider">
                    rk_live_••••••••••••••••••••
                  </code>
                  {/* When a live key is freshly regenerated, this button becomes active with the real key value.
                      For now, only the masked/disabled state is shown. */}
                  <button
                    type="button"
                    disabled
                    className="rounded-md border border-border-secondary p-1.5 text-fg-quaternary opacity-30 cursor-not-allowed"
                    aria-label="Copy to clipboard"
                  >
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
                <div className="mt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setRegenLiveModalOpen(true)}
                    className="text-sm font-medium text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear cursor-pointer"
                  >
                    Regenerate
                  </button>
                </div>
              </div>
              <p className="text-xs text-text-quaternary">
                Live key is shown once when generated. Use Regenerate if you need a new one.
              </p>
            </>
          )}
        </div>
      </div>

      {/* ── Section 5: Billing ── */}
      <div className="rounded-xl border border-border-secondary bg-bg-primary p-5">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Billing</h3>
        <div className="space-y-3">
          {/* Default */}
          {isDefault && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-tertiary">Plan</span>
                <span className="text-sm font-medium text-text-primary">Test mode — Free</span>
              </div>
              <p className="text-xs text-text-quaternary">No credit card required.</p>
            </>
          )}

          {/* Pending / Extended Review */}
          {(isPending || isExtendedReview) && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-tertiary">Registration fee</span>
                <span className="text-sm font-medium text-text-primary">$49 paid · Mar 10, 2026</span>
              </div>
              <div className="flex justify-end">
                <a
                  href="#"
                  className="text-sm font-medium text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear"
                >
                  View account billing &rarr;
                </a>
              </div>
            </>
          )}

          {/* Approved */}
          {isApproved && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-tertiary">Plan</span>
                <span className="text-sm font-medium text-text-primary">$19/mo</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-tertiary">Includes</span>
                <span className="text-sm font-medium text-text-primary">500 messages, then $8 per additional 500</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-tertiary">Next billing</span>
                <span className="text-sm font-medium text-text-primary">Apr 14, 2026</span>
              </div>
              <div className="flex justify-end">
                <a
                  href="#"
                  className="text-sm font-medium text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear"
                >
                  Manage billing &rarr;
                </a>
              </div>
              <div className="border-t border-border-secondary pt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => setCancelModalOpen(true)}
                  className="text-sm font-medium text-text-tertiary hover:text-text-error-primary transition duration-100 ease-linear cursor-pointer"
                >
                  Cancel plan
                </button>
              </div>
            </>
          )}

          {/* Rejected */}
          {isRejected && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-tertiary">Registration fee</span>
                <span className="text-sm font-medium text-text-primary">$49 refunded · Mar 22, 2026</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-tertiary">Plan</span>
                <span className="text-sm font-medium text-text-primary">Test mode — Free</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
