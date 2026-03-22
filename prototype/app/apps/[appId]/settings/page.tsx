"use client";

import { useState } from "react";
import { useSession } from "@/context/session-context";
import { CopyButton } from "@/components/dashboard/shared";

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
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onSave}
              className="rounded-md bg-bg-brand-solid px-3 py-1.5 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover cursor-pointer"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="text-sm font-medium text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear cursor-pointer"
            >
              Cancel
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-overlay">
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
  const { state } = useSession();
  const rs = state.registrationState;
  const isDefault = rs === "default";
  const isPending = rs === "pending";
  const isExtendedReview = rs === "changes_requested";
  const isApproved = rs === "approved";
  const isRejected = rs === "rejected";
  const hasRegistered = !isDefault; // post-registration = any non-default state

  const [smsNotify, setSmsNotify] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  // Modal states
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [regenSandboxModalOpen, setRegenSandboxModalOpen] = useState(false);
  const [regenLiveModalOpen, setRegenLiveModalOpen] = useState(false);

  // Editable field values (prototype local state)
  const [email, setEmail] = useState("joel@radarlove.app");
  const [phone, setPhone] = useState("+1 (512) 555-0147");
  const [alertPhone] = useState("+1 (512) 555-0147");

  function startEdit(key: string, value: string) {
    setEditingField(key);
    setEditValue(value);
  }

  function saveEdit() {
    if (editingField === "email") setEmail(editValue);
    if (editingField === "phone") setPhone(editValue);
    setEditingField(null);
  }

  function cancelEdit() {
    setEditingField(null);
  }

  return (
    <div className="py-4 space-y-6 max-w-[600px] mx-auto">
      {/* Modals */}
      <ConfirmModal
        open={cancelModalOpen}
        title="Cancel your plan"
        body="Your plan will stay active through April 14, 2026. After that, live messaging stops but your sandbox stays available — your code, your API key, and your test environment aren't going anywhere."
        confirmLabel="Cancel plan"
        cancelLabel="Keep plan"
        destructive
        onCancel={() => setCancelModalOpen(false)}
        onConfirm={() => setCancelModalOpen(false)}
      />
      <ConfirmModal
        open={regenSandboxModalOpen}
        title="Regenerate sandbox key"
        body="This will invalidate your current sandbox key. Code using it will stop working."
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

      {/* ── Section 1: SMS Compliance Alerts ── */}
      <div className="rounded-xl border border-border-secondary bg-bg-primary p-5">
        <div className="flex items-start justify-between gap-10">
          <div>
            <p className="text-sm font-medium text-text-primary">SMS compliance alerts</p>
            <p className="text-sm text-text-tertiary mt-0.5">
              Get a text when live messages are blocked or your content drifts from your registered use case. You&apos;ll always get email alerts.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={smsNotify}
            onClick={() => setSmsNotify(!smsNotify)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition duration-100 ease-linear mt-0.5 ${
              smsNotify ? "bg-bg-brand-solid" : "bg-bg-tertiary"
            }`}
          >
            <span
              className={`pointer-events-none inline-block size-5 rounded-full bg-bg-primary shadow-xs ring-0 transition duration-100 ease-linear ${
                smsNotify ? "translate-x-[22px]" : "translate-x-[2px]"
              } mt-[2px]`}
            />
          </button>
        </div>
        {smsNotify && (
          <p className="mt-3 text-sm text-text-quaternary">
            Alerts go to {alertPhone}{" "}
            <button
              type="button"
              className="text-sm font-medium text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear cursor-pointer"
            >
              Edit
            </button>
          </p>
        )}
      </div>

      {/* ── Section 2: Account Info ── */}
      <div className="rounded-xl border border-border-secondary bg-bg-primary p-5">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Account info</h3>
        <dl className="space-y-3">
          {hasRegistered && (
            <ReadOnlyField
              label="Business name"
              value="RadarLove"
              sub="Set during registration"
            />
          )}
          <EditableField
            label="Email"
            value={email}
            editingField={editingField}
            fieldKey="email"
            onEdit={startEdit}
            onSave={saveEdit}
            onCancel={cancelEdit}
            editValue={editValue}
            onEditValueChange={setEditValue}
          />
          <EditableField
            label="Personal phone"
            value={phone}
            editingField={editingField}
            fieldKey="phone"
            onEdit={startEdit}
            onSave={saveEdit}
            onCancel={cancelEdit}
            editValue={editValue}
            onEditValueChange={setEditValue}
          />
          {hasRegistered && (
            <ReadOnlyField label="Category" value="Appointment reminders" />
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
            <div className="flex items-center justify-between">
              <dt className="text-sm text-text-tertiary">Estimated review</dt>
              <dd className="text-sm font-medium text-text-primary">2–3 weeks</dd>
            </div>
          </dl>
          <p className="mt-4 text-sm text-text-tertiary">
            Your sandbox is fully active while you wait.
          </p>
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
            The carrier asked for additional information about your registration. We&apos;re handling it — no action needed from you. We&apos;ll reach out if we need anything.
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
            <div className="flex items-center justify-between">
              <dt className="text-sm text-text-tertiary">Campaign ID</dt>
              <dd className="text-sm font-medium text-text-primary">C-XXXXXX</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-sm text-text-tertiary">Plan</dt>
              <dd className="text-sm font-medium text-text-primary">$19/mo</dd>
            </div>
          </dl>
          <a
            href="#"
            className="mt-4 inline-block text-sm font-medium text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear"
          >
            View compliance site &rarr;
          </a>
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

          {/* Debrief box */}
          <div className="mt-4 rounded-lg bg-bg-error-primary p-4">
            <p className="text-sm font-semibold text-text-primary">What happened</p>
            <p className="mt-1 text-sm text-text-secondary leading-relaxed">
              The carrier couldn&apos;t verify your business name against your EIN. Make sure your registered business name matches exactly what&apos;s on file with the IRS.
            </p>
          </div>

          <p className="mt-4 text-sm text-text-success-primary">
            Your $49 registration fee has been refunded.
          </p>
          <a
            href="#"
            className="mt-2 inline-block text-sm font-medium text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear"
          >
            Start a new registration &rarr;
          </a>
          <p className="mt-3 text-sm text-text-tertiary">
            Your sandbox is still active — your code and test environment aren&apos;t going anywhere.
          </p>
        </div>
      )}

      {/* ── Section 4: API Keys ── */}
      <div className="rounded-xl border border-border-secondary bg-bg-primary p-5">
        <h3 className="text-lg font-semibold text-text-primary mb-1">API keys</h3>
        <p className="text-sm text-text-tertiary mb-4">
          Your AI coding tool reads this key from your RelayKit files.
        </p>

        <div className="space-y-4">
          {/* Sandbox key — always visible */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <p className="text-sm font-medium text-text-quaternary uppercase tracking-wide">
                Sandbox
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
            <div className="mt-2">
              <button
                type="button"
                onClick={() => setRegenSandboxModalOpen(true)}
                className="text-sm font-medium text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear cursor-pointer"
              >
                Regenerate
              </button>
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
                <div className="flex items-center">
                  <code className="flex-1 rounded-md bg-bg-secondary px-3 py-2 text-sm font-mono text-text-primary tracking-wider">
                    rk_live_••••••••••••••••••••
                  </code>
                </div>
                <div className="mt-2">
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
                <span className="text-sm font-medium text-text-primary">Sandbox — Free</span>
              </div>
              <p className="text-xs text-text-quaternary">No credit card required.</p>
            </>
          )}

          {/* Pending */}
          {isPending && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-tertiary">Registration fee</span>
                <span className="text-sm font-medium text-text-primary">$49 paid · Mar 10, 2026</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-tertiary">Plan</span>
                <span className="text-sm font-medium text-text-primary">Sandbox — Free</span>
              </div>
              <a
                href="#"
                className="inline-block text-sm font-medium text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear"
              >
                View account billing &rarr;
              </a>
            </>
          )}

          {/* Extended Review — same as Pending */}
          {isExtendedReview && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-tertiary">Registration fee</span>
                <span className="text-sm font-medium text-text-primary">$49 paid · Mar 10, 2026</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-tertiary">Plan</span>
                <span className="text-sm font-medium text-text-primary">Sandbox — Free</span>
              </div>
              <a
                href="#"
                className="inline-block text-sm font-medium text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear"
              >
                View account billing &rarr;
              </a>
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
                <span className="text-sm text-text-tertiary">Next billing</span>
                <span className="text-sm font-medium text-text-primary">Apr 14, 2026</span>
              </div>
              <a
                href="#"
                className="inline-block text-sm font-medium text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear"
              >
                Manage billing &rarr;
              </a>
              <div className="border-t border-border-secondary pt-3">
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
                <span className="text-sm font-medium text-text-primary">Sandbox — Free</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
