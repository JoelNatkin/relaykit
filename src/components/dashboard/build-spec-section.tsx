"use client";

import { useState } from "react";
import { Button } from "@/components/base/buttons/button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { Code01, BookOpen01, Download01, Copy01, Check } from "@untitledui/icons";
import {
  DialogTrigger,
  ModalOverlay,
  Modal,
  Dialog,
} from "@/components/application/modals/modal";

interface BuildSpecSectionProps {
  useCase: string;
}

export function BuildSpecSection({ useCase }: BuildSpecSectionProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [buildSpec, setBuildSpec] = useState<string | null>(null);
  const [guidelines, setGuidelines] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"spec" | "guidelines">("spec");
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/build-spec", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setBuildSpec(data.buildSpec);
        setGuidelines(data.guidelines);
        setIsModalOpen(true);
      }
    } finally {
      setIsGenerating(false);
    }
  }

  function handleCopy() {
    const text = activeTab === "spec" ? buildSpec : guidelines;
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleDownload() {
    const text = activeTab === "spec" ? buildSpec : guidelines;
    const filename =
      activeTab === "spec" ? "SMS_BUILD_SPEC.md" : "SMS_GUIDELINES.md";
    if (text) {
      const blob = new Blob([text], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  return (
    <>
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-primary">Ready to build?</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Build with AI card */}
          <div className="flex flex-col gap-4 rounded-xl border border-secondary bg-primary p-5">
            <FeaturedIcon
              icon={Code01}
              size="md"
              color="brand"
              theme="light"
            />
            <div className="flex-1">
              <p className="text-sm font-semibold text-primary">
                Build with AI
              </p>
              <p className="mt-1 text-sm text-tertiary">
                Generate a build spec for your AI coding tool.
              </p>
            </div>
            <Button
              size="sm"
              color="primary"
              onClick={handleGenerate}
              isLoading={isGenerating}
              showTextWhileLoading
            >
              Generate build spec
            </Button>
          </div>

          {/* Build manually card */}
          <div className="flex flex-col gap-4 rounded-xl border border-secondary bg-primary p-5">
            <FeaturedIcon
              icon={BookOpen01}
              size="md"
              color="gray"
              theme="light"
            />
            <div className="flex-1">
              <p className="text-sm font-semibold text-primary">
                Build manually
              </p>
              <p className="mt-1 text-sm text-tertiary">
                Full API reference, endpoint docs, and code examples.
              </p>
            </div>
            <Button
              size="sm"
              color="secondary"
              href="/dashboard/api-reference"
            >
              View API docs
            </Button>
          </div>
        </div>
      </section>

      {/* Preview modal */}
      <DialogTrigger isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalOverlay isDismissable>
          <Modal className="max-w-2xl">
            <Dialog>
              <div className="w-full rounded-xl bg-primary p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-primary">
                    Your build spec is ready
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="text-sm text-tertiary hover:text-secondary"
                  >
                    Close
                  </button>
                </div>

                <p className="mt-1 text-sm text-tertiary">
                  Drop both files in your project root. Tell your AI coding
                  tool: &ldquo;Read SMS_BUILD_SPEC.md and build my SMS
                  feature.&rdquo;
                </p>

                {/* Tab switcher */}
                <div className="mt-4 flex gap-1 border-b border-secondary">
                  <button
                    type="button"
                    onClick={() => setActiveTab("spec")}
                    className={`px-3 py-2 text-sm font-medium transition duration-100 ease-linear ${
                      activeTab === "spec"
                        ? "border-b-2 border-brand text-primary"
                        : "text-tertiary hover:text-secondary"
                    }`}
                  >
                    SMS_BUILD_SPEC.md
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("guidelines")}
                    className={`px-3 py-2 text-sm font-medium transition duration-100 ease-linear ${
                      activeTab === "guidelines"
                        ? "border-b-2 border-brand text-primary"
                        : "text-tertiary hover:text-secondary"
                    }`}
                  >
                    SMS_GUIDELINES.md
                  </button>
                </div>

                {/* Content preview */}
                <div className="mt-4 max-h-80 overflow-y-auto rounded-lg border border-secondary bg-secondary p-4">
                  <pre className="whitespace-pre-wrap font-mono text-xs text-secondary">
                    {activeTab === "spec" ? buildSpec : guidelines}
                  </pre>
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <Button
                    size="sm"
                    color="primary"
                    iconLeading={Download01}
                    onClick={handleDownload}
                  >
                    Download{" "}
                    {activeTab === "spec"
                      ? "SMS_BUILD_SPEC.md"
                      : "SMS_GUIDELINES.md"}
                  </Button>
                  <Button
                    size="sm"
                    color="secondary"
                    iconLeading={copied ? Check : Copy01}
                    onClick={handleCopy}
                  >
                    {copied ? "Copied" : "Copy to clipboard"}
                  </Button>
                </div>
              </div>
            </Dialog>
          </Modal>
        </ModalOverlay>
      </DialogTrigger>
    </>
  );
}
