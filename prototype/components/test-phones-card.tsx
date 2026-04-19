"use client";

import { useEffect, useRef, useState } from "react";
import { DotsVertical } from "@untitledui/icons";

export interface TestPhone {
  id: string;
  name: string;
  /** Full display phone number, e.g. "(555) 867-8842". */
  phone: string;
  status: "verified" | "invited";
  /** Developer's own phone — can't be removed from the list. */
  isSelf?: boolean;
}

export const INITIAL_TEST_PHONES: TestPhone[] = [
  { id: "self-joel", name: "Joel", phone: "(555) 867-8842", status: "verified", isSelf: true },
  { id: "sarah", name: "Sarah", phone: "(555) 412-5519", status: "verified" },
  { id: "mike", name: "Mike", phone: "(555) 290-3301", status: "invited" },
];

export const MAX_TEST_PHONES = 5;

const STATUS_DOT: Record<TestPhone["status"], string> = {
  verified: "bg-fg-success-primary",
  invited: "bg-fg-quaternary",
};

const STATUS_LABEL: Record<TestPhone["status"], string> = {
  verified: "Verified",
  invited: "Invited",
};

export interface TestPhonesCardProps {
  phones: TestPhone[];
  onRemove: (id: string) => void;
  onInvite: (name: string, phone: string) => void;
  onEdit: (id: string, name: string, phone: string) => void;
}

export function TestPhonesCard({ phones, onRemove, onInvite, onEdit }: TestPhonesCardProps) {
  // Invite-form state
  const [isInviting, setIsInviting] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Inline edit state — at most one row can be in edit mode at a time.
  const [editingPhoneId, setEditingPhoneId] = useState<string | null>(null);
  const [editNameInput, setEditNameInput] = useState("");
  const [editPhoneInput, setEditPhoneInput] = useState("");

  // Kebab menu state — at most one row's menu can be open at a time.
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuContainerRef = useRef<HTMLUListElement>(null);

  // Dismiss the kebab menu on outside click.
  useEffect(() => {
    if (openMenuId === null) return;
    function onDocClick(event: MouseEvent) {
      if (!menuContainerRef.current) return;
      if (!menuContainerRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [openMenuId]);

  const canAddMore = phones.length < MAX_TEST_PHONES;
  const canSubmitInvite =
    nameInput.trim().length > 0 && phoneInput.trim().length > 0 && !isSending;
  const canSubmitEdit =
    editNameInput.trim().length > 0 && editPhoneInput.trim().length > 0;

  function handleSendInvite() {
    if (!canSubmitInvite) return;
    setIsSending(true);
    // Stubbed 1.5s send. Production would dispatch an OTP via Twilio Verify.
    setTimeout(() => {
      onInvite(nameInput.trim(), phoneInput.trim());
      setIsSending(false);
      setIsInviting(false);
      setNameInput("");
      setPhoneInput("");
    }, 1500);
  }

  function handleCancelInvite() {
    if (isSending) return;
    setIsInviting(false);
    setNameInput("");
    setPhoneInput("");
  }

  function startEdit(phone: TestPhone) {
    setEditingPhoneId(phone.id);
    setEditNameInput(phone.name);
    setEditPhoneInput(phone.phone);
    setOpenMenuId(null);
  }

  function handleSaveEdit(id: string) {
    if (!canSubmitEdit) return;
    onEdit(id, editNameInput.trim(), editPhoneInput.trim());
    setEditingPhoneId(null);
    setEditNameInput("");
    setEditPhoneInput("");
  }

  function handleCancelEdit() {
    setEditingPhoneId(null);
    setEditNameInput("");
    setEditPhoneInput("");
  }

  function handleDelete(id: string) {
    onRemove(id);
    setOpenMenuId(null);
    if (editingPhoneId === id) handleCancelEdit();
  }

  return (
    <div className="rounded-xl border border-border-secondary p-6">
      {/* User-facing concept is "Preview list". Code-level identifiers
          (TestPhone, MAX_TEST_PHONES, onInvite, etc.) intentionally stay
          as tester/test per PM_PROJECT_INSTRUCTIONS.md's user-facing-vs-
          internal naming split — the boundary layer translates. */}
      <h3 className="text-base font-semibold text-text-primary">Preview list</h3>
      <p className="mt-1 text-sm text-text-tertiary">
        Your safe audience for sending test messages, before and after launch.
      </p>

      <ul ref={menuContainerRef} className="mt-4 divide-y divide-border-secondary">
        {phones.map((phone) => {
          const isEditing = editingPhoneId === phone.id;
          const isMenuOpen = openMenuId === phone.id;
          return (
            <li key={phone.id} className="py-3 first:pt-0 last:pb-0">
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editNameInput}
                    onChange={(e) => setEditNameInput(e.target.value)}
                    placeholder="Name"
                    className="w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-placeholder shadow-xs focus:border-border-brand focus:outline-none transition duration-100 ease-linear"
                  />
                  <input
                    type="tel"
                    value={editPhoneInput}
                    onChange={(e) => setEditPhoneInput(e.target.value)}
                    placeholder="Phone"
                    className="w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-placeholder shadow-xs focus:border-border-brand focus:outline-none transition duration-100 ease-linear"
                  />
                  <div className="flex items-center justify-end gap-3 pt-1">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="text-sm text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(phone.id)}
                      disabled={!canSubmitEdit}
                      className="rounded-lg border border-border-primary bg-bg-primary px-3 py-1.5 text-sm font-semibold text-text-secondary shadow-xs transition duration-100 ease-linear hover:bg-bg-secondary cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-text-primary truncate">
                      {phone.name}
                    </span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="inline-flex items-center gap-1.5 text-xs text-text-tertiary whitespace-nowrap">
                        <span
                          className={`inline-block size-1.5 rounded-full ${STATUS_DOT[phone.status]}`}
                        />
                        {STATUS_LABEL[phone.status]}
                      </span>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setOpenMenuId(isMenuOpen ? null : phone.id)}
                          className="p-1 -mr-1 text-fg-quaternary hover:text-fg-secondary transition duration-100 ease-linear cursor-pointer"
                          aria-label={`Open menu for ${phone.name}`}
                          aria-expanded={isMenuOpen}
                          aria-haspopup="menu"
                        >
                          <DotsVertical className="size-4" />
                        </button>
                        {isMenuOpen && (
                          <div
                            role="menu"
                            className="absolute right-0 top-full mt-1 z-20 min-w-[120px] rounded-lg border border-border-secondary bg-bg-primary py-1 shadow-lg"
                          >
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => startEdit(phone)}
                              className="w-full text-left px-3 py-1.5 text-sm text-text-secondary hover:bg-bg-secondary transition duration-100 ease-linear cursor-pointer"
                            >
                              Edit
                            </button>
                            {!phone.isSelf && (
                              <button
                                type="button"
                                role="menuitem"
                                onClick={() => handleDelete(phone.id)}
                                className="w-full text-left px-3 py-1.5 text-sm text-text-error-primary hover:bg-bg-secondary transition duration-100 ease-linear cursor-pointer"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-0.5 text-sm text-text-tertiary">{phone.phone}</div>
                </>
              )}
            </li>
          );
        })}
      </ul>

      {isInviting ? (
        <div className="mt-4 space-y-2">
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            disabled={isSending}
            placeholder="Name"
            className="w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-placeholder shadow-xs focus:border-border-brand focus:outline-none transition duration-100 ease-linear disabled:bg-bg-secondary disabled:cursor-not-allowed"
          />
          <input
            type="tel"
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            disabled={isSending}
            placeholder="Phone"
            className="w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-placeholder shadow-xs focus:border-border-brand focus:outline-none transition duration-100 ease-linear disabled:bg-bg-secondary disabled:cursor-not-allowed"
          />
          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={handleCancelInvite}
              disabled={isSending}
              className="text-sm text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSendInvite}
              disabled={!canSubmitInvite}
              className="rounded-lg border border-border-primary bg-bg-primary px-3 py-1.5 text-sm font-semibold text-text-secondary shadow-xs transition duration-100 ease-linear hover:bg-bg-secondary cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSending ? "Sending\u2026" : "Send invite"}
            </button>
          </div>
        </div>
      ) : (
        /* + Invite someone — always rendered. When the list is at the cap
           (canAddMore === false), disabled + tooltip makes the constraint
           visible rather than silently hiding the affordance, which was
           the prior behavior. Wrapper carries group-hover so the tooltip
           can fire on a disabled button (pointer events still propagate
           to the wrapper). */
        <div className="relative group inline-block mt-3">
          <button
            type="button"
            onClick={(e) => { if (!canAddMore) { e.preventDefault(); return; } setIsInviting(true); }}
            aria-disabled={!canAddMore}
            className={`text-sm font-semibold transition duration-100 ease-linear ${
              canAddMore
                ? "text-text-brand-secondary hover:text-text-brand-secondary_hover cursor-pointer"
                : "text-text-brand-secondary opacity-60 cursor-not-allowed"
            }`}
          >
            + Invite someone
          </button>
          {!canAddMore && (
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 z-[100] hidden group-hover:block rounded-lg bg-bg-primary-solid px-3 py-2 text-xs text-text-white shadow-lg whitespace-nowrap leading-relaxed pointer-events-none">
              Preview list is full. Remove someone to invite another person.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
