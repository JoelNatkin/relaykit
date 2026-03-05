"use client";

import { useState } from "react";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { CheckCircle, File06, DownloadCloud01 } from "@untitledui/icons";
import { useDashboard } from "./dashboard-context";

export function ApprovalResourcesCard() {
  const { registrationId } = useDashboard();
  const [downloadingSetup, setDownloadingSetup] = useState(false);
  const [downloadingGuidelines, setDownloadingGuidelines] = useState(false);

  async function handleDownload(
    doc: "messaging_setup" | "sms_guidelines",
    setLoading: (v: boolean) => void,
  ) {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/deliverable?registration_id=${registrationId}&doc=${doc}`,
      );
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download =
          doc === "messaging_setup"
            ? "MESSAGING_SETUP.md"
            : "SMS_GUIDELINES.md";
        a.click();
        URL.revokeObjectURL(url);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-success bg-success-primary p-6">
      <div className="flex items-start gap-4">
        <FeaturedIcon
          icon={CheckCircle}
          size="lg"
          color="success"
          theme="light"
        />
        <div className="flex-1 space-y-4">
          <div>
            <p className="text-base font-semibold text-primary">
              Your campaign is approved.
            </p>
            <p className="mt-2 text-sm text-secondary">
              You now have verified SMS infrastructure — a registered brand, an
              approved campaign, and a compliance record on file with The
              Campaign Registry. Most developers never get here. You did.
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-primary">
              {"Here\u2019s what you can build with it:"}
            </p>
            <p className="mt-1 text-sm text-secondary">
              Update{" "}
              <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs text-secondary">
                RELAYKIT_API_KEY
              </code>{" "}
              in your .env file with your live key. {"That\u2019s"} it — same
              code, same API, your app sends real texts.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() =>
                handleDownload("messaging_setup", setDownloadingSetup)
              }
              disabled={downloadingSetup}
              className="flex items-center gap-2 rounded-lg border border-secondary bg-primary px-3 py-2 text-sm font-medium text-secondary shadow-xs transition duration-100 ease-linear hover:bg-primary_hover disabled:opacity-50"
            >
              <File06 className="size-4 text-fg-quaternary" />
              MESSAGING_SETUP.md
              <DownloadCloud01 className="ml-auto size-4 text-fg-quaternary" />
            </button>
            <button
              type="button"
              onClick={() =>
                handleDownload("sms_guidelines", setDownloadingGuidelines)
              }
              disabled={downloadingGuidelines}
              className="flex items-center gap-2 rounded-lg border border-secondary bg-primary px-3 py-2 text-sm font-medium text-secondary shadow-xs transition duration-100 ease-linear hover:bg-primary_hover disabled:opacity-50"
            >
              <File06 className="size-4 text-fg-quaternary" />
              SMS_GUIDELINES.md
              <DownloadCloud01 className="ml-auto size-4 text-fg-quaternary" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
