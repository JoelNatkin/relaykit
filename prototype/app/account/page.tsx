"use client";

import { useState } from "react";
import Link from "next/link";

const DEFAULT_APP_ID = "glowstudio";
const APP_NAMES: Record<string, string> = {
  glowstudio: "GlowStudio",
};

export default function AccountSettingsPage() {
  const appId = DEFAULT_APP_ID;
  const appName = APP_NAMES[appId] || appId;

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  return (
    <div className="py-4 space-y-6 max-w-[600px] mx-auto">
      <Link
        href={`/apps/${appId}`}
        className="inline-flex items-center gap-1 text-sm font-medium text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear"
      >
        &larr; Back to {appName}
      </Link>

      <h1 className="text-2xl font-semibold text-text-primary mb-6">Account settings</h1>

      {/* Delete confirmation modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-bg-primary border border-border-secondary shadow-xl p-6">
            <h2 className="text-lg font-semibold text-text-primary">Delete your account</h2>
            <p className="mt-3 text-sm text-text-secondary leading-relaxed">
              This will permanently delete your account, all apps, and all data. Active subscriptions will be canceled and carrier registrations wound down. This cannot be undone.
            </p>
            <div className="mt-4">
              <label htmlFor="delete-confirm" className="block text-sm text-text-tertiary mb-1.5">
                Type DELETE to confirm
              </label>
              <input
                id="delete-confirm"
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                className="w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2 text-sm text-text-primary shadow-xs focus:border-border-brand focus:outline-none"
              />
            </div>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setDeleteConfirmText("");
                }}
                className="rounded-lg border border-border-primary bg-bg-primary px-4 py-2.5 text-sm font-semibold text-text-secondary transition duration-100 ease-linear hover:bg-bg-secondary cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteConfirmText !== "DELETE"}
                onClick={() => {
                  setDeleteModalOpen(false);
                  setDeleteConfirmText("");
                }}
                className="rounded-lg bg-bg-error-solid px-4 py-2.5 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-[var(--color-error-700)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Delete account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Email ── */}
      <div className="rounded-xl border border-border-secondary bg-bg-primary p-5">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Login</h3>
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-tertiary">Email</span>
          <span className="text-sm font-medium text-text-primary">jen@glowstudio.com</span>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            className="text-sm font-medium text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear cursor-pointer"
          >
            Change
          </button>
        </div>
      </div>

      {/* ── Payment method ── */}
      <div className="rounded-xl border border-border-secondary bg-bg-primary p-5">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Payment method</h3>
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-tertiary">Card on file</span>
          <span className="text-sm font-medium text-text-primary">Visa ending in 4242</span>
        </div>
        <div className="mt-4 flex justify-end">
          <a
            href="#"
            className="text-sm font-medium text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear"
          >
            Manage billing &rarr;
          </a>
        </div>
      </div>

      {/* ── Danger zone ── */}
      <div className="rounded-xl border border-red-200 bg-bg-primary p-5">
        <h3 className="text-lg font-semibold text-red-600 mb-4">Delete account</h3>
        <p className="text-sm text-text-secondary leading-relaxed">
          This will permanently delete your account, all apps, and all data. Active subscriptions will be canceled and carrier registrations wound down. This cannot be undone.
        </p>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => setDeleteModalOpen(true)}
            className="text-sm font-medium text-text-tertiary hover:text-text-error-primary transition duration-100 ease-linear cursor-pointer"
          >
            Delete account
          </button>
        </div>
      </div>
    </div>
  );
}
