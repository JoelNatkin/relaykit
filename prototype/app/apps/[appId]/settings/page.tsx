"use client";

import { useState } from "react";
import { useSession } from "@/context/session-context";
import { SAMPLE } from "@/components/dashboard/sample-data";
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
        <dt className="text-xs text-text-tertiary mb-1.5">{label}</dt>
        <dd>
          <input
            type="text"
            value={editValue}
            onChange={(e) => onEditValueChange(e.target.value)}
            className="w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2 text-xs text-text-primary shadow-xs focus:border-border-brand focus:outline-none"
            autoFocus
          />
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onSave}
              className="rounded-md bg-bg-brand-solid px-3 py-1.5 text-xs font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover cursor-pointer"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="text-xs font-medium text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear cursor-pointer"
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
      <dt className="text-xs text-text-tertiary">{label}</dt>
      <dd className="flex items-center gap-2">
        <span className="text-xs font-medium text-text-primary">{value}</span>
        <button
          type="button"
          onClick={() => onEdit(fieldKey, value)}
          className="text-xs font-medium text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear cursor-pointer"
        >
          Edit
        </button>
      </dd>
    </div>
  );
}

/* ── Cancel plan modal ── */

function CancelModal({ open, onCancel, onConfirm }: { open: boolean; onCancel: () => void; onConfirm: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-overlay">
      <div className="w-full max-w-md rounded-xl bg-bg-primary border border-border-secondary shadow-xl p-6">
        <h2 className="text-lg font-semibold text-text-primary">Cancel your plan</h2>
        <p className="mt-3 text-sm text-text-secondary leading-relaxed">
          Your live number will be released at the end of your current billing period. Messages will route through sandbox after that — same API, same code. Your sandbox never expires.
        </p>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-border-primary bg-bg-primary px-4 py-2.5 text-sm font-semibold text-text-secondary transition duration-100 ease-linear hover:bg-bg-secondary cursor-pointer"
          >
            Keep plan
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-bg-error-solid px-4 py-2.5 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-error-solid_hover cursor-pointer"
          >
            Cancel plan
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Page ── */

export default function AppSettings() {
  const { state } = useSession();
  const isLive = state.appState === "live";
  const isApproved = state.registrationState === "approved";

  const [smsNotify, setSmsNotify] = useState(true);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  // Editable field values (prototype local state)
  const [businessName, setBusinessName] = useState(SAMPLE.businessName);
  const [email, setEmail] = useState(SAMPLE.email);
  const [phone, setPhone] = useState(SAMPLE.phone);
  const [alertPhone, setAlertPhone] = useState(SAMPLE.phone);

  function startEdit(key: string, value: string) {
    setEditingField(key);
    setEditValue(value);
  }

  function saveEdit() {
    if (editingField === "businessName") setBusinessName(editValue);
    if (editingField === "email") setEmail(editValue);
    if (editingField === "phone") setPhone(editValue);
    if (editingField === "alertPhone") setAlertPhone(editValue);
    setEditingField(null);
  }

  function cancelEdit() {
    setEditingField(null);
  }

  return (
    <div className="py-4 space-y-6 max-w-[600px] mx-auto">
      <CancelModal
        open={cancelModalOpen}
        onCancel={() => setCancelModalOpen(false)}
        onConfirm={() => setCancelModalOpen(false)}
      />

      {/* SMS compliance alerts toggle */}
      <div className="rounded-xl border border-border-secondary bg-bg-primary p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text-primary">
              SMS compliance alerts
            </p>
            <p className="text-xs text-text-tertiary mt-0.5">
              Get SMS alerts when drift is detected or messages are blocked.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={smsNotify}
            onClick={() => setSmsNotify(!smsNotify)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition duration-100 ease-linear ${
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
          <div className="mt-3">
            {editingField === "alertPhone" ? (
              <div>
                <p className="text-xs text-text-tertiary mb-1.5">Alerts go to</p>
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2 text-xs text-text-primary shadow-xs focus:border-border-brand focus:outline-none"
                  autoFocus
                />
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={saveEdit}
                    className="rounded-md bg-bg-brand-solid px-3 py-1.5 text-xs font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover cursor-pointer"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="text-xs font-medium text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-text-quaternary">
                Alerts go to {alertPhone}{" "}
                <button
                  type="button"
                  onClick={() => startEdit("alertPhone", alertPhone)}
                  className="text-xs font-medium text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear cursor-pointer"
                >
                  Edit
                </button>
              </p>
            )}
          </div>
        )}
      </div>

      {/* Account info */}
      <div className="rounded-xl border border-border-secondary bg-bg-primary p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Account info</h3>
        <dl className="space-y-3">
          <EditableField
            label="Business name"
            value={businessName}
            editingField={editingField}
            fieldKey="businessName"
            onEdit={startEdit}
            onSave={saveEdit}
            onCancel={cancelEdit}
            editValue={editValue}
            onEditValueChange={setEditValue}
          />
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
            label="Phone"
            value={phone}
            editingField={editingField}
            fieldKey="phone"
            onEdit={startEdit}
            onSave={saveEdit}
            onCancel={cancelEdit}
            editValue={editValue}
            onEditValueChange={setEditValue}
          />
          <div className="flex items-center justify-between">
            <dt className="text-xs text-text-tertiary">Category</dt>
            <dd className="text-xs font-medium text-text-primary">{SAMPLE.useCase}</dd>
          </div>
          {isLive && (
            <>
              <div className="flex items-center justify-between">
                <dt className="text-xs text-text-tertiary">Registration date</dt>
                <dd className="text-xs font-medium text-text-primary">{SAMPLE.registrationDate}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-xs text-text-tertiary">Approved</dt>
                <dd className="text-xs font-medium text-text-primary">{SAMPLE.approvalDate}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-xs text-text-tertiary">Campaign ID</dt>
                <dd className="text-xs font-medium text-text-primary">{SAMPLE.campaignSid}</dd>
              </div>
            </>
          )}
        </dl>
      </div>

      {/* Registration (visible in Approved state) */}
      {isApproved && (
        <div className="rounded-xl border border-border-secondary bg-bg-primary p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Registration</h3>
          <dl className="space-y-3">
            <div className="flex items-center justify-between">
              <dt className="text-xs text-text-tertiary">Status</dt>
              <dd className="flex items-center gap-1.5 text-xs font-medium text-text-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-fg-success-primary" />
                Active
              </dd>
            </div>
            {[
              ["Phone", "+1 (555) 867-5309"],
              ["Approved", "Mar 31, 2026"],
              ["Campaign ID", "C-XXXXXX"],
              ["Plan", "$19/mo"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between">
                <dt className="text-xs text-text-tertiary">{label}</dt>
                <dd className="text-xs font-medium text-text-primary">{value}</dd>
              </div>
            ))}
          </dl>
          <a
            href="#"
            className="mt-4 inline-block text-xs font-medium text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear"
          >
            View compliance site &rarr;
          </a>
        </div>
      )}

      {/* API key management */}
      <div className="rounded-xl border border-border-secondary bg-bg-primary p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-1">API keys</h3>
        <p className="text-xs text-text-tertiary mb-4">
          Your AI coding tool will use this key automatically when it reads your SMS Blueprint.
        </p>

        <div className="space-y-4">
          {/* Sandbox key — always visible */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <p className="text-xs font-medium text-text-quaternary uppercase tracking-wide">
                Sandbox
              </p>
              {!isLive && (
                <span className="inline-flex items-center rounded-full bg-bg-brand-secondary px-2 py-0.5 text-[11px] font-medium text-text-brand-secondary">
                  Active
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded-md bg-bg-secondary px-3 py-2 text-sm font-mono text-text-primary">
                {SAMPLE.sandboxApiKey}
              </code>
              <CopyButton text={SAMPLE.sandboxApiKey} />
            </div>
            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                className="text-xs font-medium text-text-brand-secondary hover:text-text-brand-secondary_hover transition duration-100 ease-linear"
              >
                Regenerate
              </button>
            </div>
          </div>

          {/* Live key — only post-registration */}
          {isLive && (
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <p className="text-xs font-medium text-text-quaternary uppercase tracking-wide">
                  Live
                </p>
                <span className="inline-flex items-center rounded-full bg-bg-success-secondary px-2 py-0.5 text-[11px] font-medium text-text-success-primary">
                  Active
                </span>
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded-md bg-bg-secondary px-3 py-2 text-sm font-mono text-text-primary">
                  {SAMPLE.liveApiKey}
                </code>
                <CopyButton text={SAMPLE.liveApiKey} />
              </div>
              <p className="mt-1.5 text-[11px] text-text-quaternary">
                Live keys cannot be regenerated. Contact support if compromised.
              </p>
            </div>
          )}
        </div>

        <p className="mt-4 text-xs text-text-quaternary border-t border-border-secondary pt-3">
          You can also find your key in{" "}
          <span className="font-mono">
            {SAMPLE.businessName.toLowerCase()}_sms_blueprint.md
          </span>
        </p>
      </div>

      {/* Developer tools (visible in Approved state) */}
      {isApproved && (
        <div className="rounded-xl border border-border-secondary bg-bg-primary p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Developer tools</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-text-primary">Sandbox phone</p>
                <p className="text-xs text-text-tertiary mt-0.5">Messages in sandbox mode deliver to this number</p>
              </div>
              <span className="text-xs font-medium text-text-primary">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center justify-between border-t border-border-secondary pt-4">
              <div>
                <p className="text-xs font-medium text-text-primary">Send test message</p>
                <p className="text-xs text-text-tertiary mt-0.5">Send a sandbox message to your verified phone</p>
              </div>
              <button
                type="button"
                className="text-xs font-medium text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear cursor-pointer"
              >
                Send &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Billing (D-99) */}
      <div className="rounded-xl border border-border-secondary bg-bg-primary p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Billing</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-tertiary">Plan</span>
            <span className="text-xs font-medium text-text-primary">
              {isLive ? "Transactional — $19/mo" : "Sandbox — Free"}
            </span>
          </div>
          {isLive && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-tertiary">Messages this month</span>
                <span className="text-xs font-medium text-text-primary">
                  {SAMPLE.messagesThisMonth.toLocaleString()} / {SAMPLE.messagesIncluded} included
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-tertiary">Overage</span>
                <span className="text-xs font-medium text-text-primary">
                  {Math.max(0, SAMPLE.messagesThisMonth - SAMPLE.messagesIncluded).toLocaleString()} messages × $0.015
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-border-secondary pt-3">
                <span className="text-xs text-text-tertiary">Current period total</span>
                <span className="text-sm font-semibold text-text-primary">
                  ${(19 + Math.max(0, SAMPLE.messagesThisMonth - SAMPLE.messagesIncluded) * 0.015).toFixed(2)}
                </span>
              </div>
            </>
          )}
        </div>
        <button
          type="button"
          className="mt-4 text-xs font-medium text-text-brand-secondary hover:text-text-brand-secondary_hover transition duration-100 ease-linear"
        >
          View account billing →
        </button>
        {(isLive || isApproved) && (
          <div className="mt-2">
            <button
              type="button"
              onClick={() => setCancelModalOpen(true)}
              className="text-xs font-medium text-text-tertiary hover:text-text-error-primary transition duration-100 ease-linear cursor-pointer"
            >
              Cancel plan
            </button>
          </div>
        )}
      </div>

      {/* Portability */}
      <div className="rounded-xl border border-border-secondary bg-bg-primary p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Moving on?</h3>
        <div className="space-y-5">
          <div>
            <p className="text-xs font-medium text-text-primary">Transfer your phone number</p>
            <p className="mt-1 text-xs text-text-tertiary">We can transfer your dedicated number to your own Twilio account.</p>
            <a
              href="mailto:hello@relaykit.ai"
              className="mt-2 inline-block text-xs font-medium text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear"
            >
              Contact us to start a transfer
            </a>
          </div>
          <div className="border-t border-border-secondary pt-5">
            <p className="text-xs font-medium text-text-primary">Export your registration data</p>
            <p className="mt-1 text-xs text-text-tertiary">Download your business info, sample messages, and compliance site content.</p>
            <button
              type="button"
              className="mt-2 rounded-md border border-border-primary bg-bg-primary px-3 py-1.5 text-xs font-semibold text-text-secondary shadow-xs transition duration-100 ease-linear hover:bg-bg-secondary cursor-pointer"
            >
              Download export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
