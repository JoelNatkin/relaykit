"use client";

import { useParams, useRouter, redirect } from "next/navigation";
import { motion } from "framer-motion";
import { CATEGORIES } from "@/data/categories";
import { useSession } from "@/context/session-context";
import type { PersonalizationField } from "@/data/categories";

const containerVariants = {
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const fieldVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

type SessionFieldKey =
  | "appName"
  | "website"
  | "serviceType"
  | "productType"
  | "venueType"
  | "whatYouSell";

export default function SetupPage() {
  const params = useParams<{ categoryId: string }>();
  const router = useRouter();
  const { state, setField } = useSession();

  const category = CATEGORIES.find((c) => c.id === params.categoryId);

  if (!category) {
    redirect("/choose");
  }

  function handleContinue() {
    router.push(`/c/${params.categoryId}/plan`);
  }

  function handleSkip() {
    router.push(`/c/${params.categoryId}/plan`);
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto mt-12 max-w-lg px-4"
    >
      <div className="rounded-xl border border-secondary bg-primary p-8 shadow-sm">
        <div className="mb-6 text-center">
          <span className="text-4xl">{category.icon}</span>
          <h1 className="mt-3 text-2xl font-bold text-primary">
            Tell us about your app
          </h1>
          <p className="mt-1 text-sm text-tertiary">
            This personalizes every message preview. Takes ten seconds.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-5"
        >
          {category.personalizationFields.map((field: PersonalizationField) => (
            <motion.div key={field.key} variants={fieldVariants}>
              <label
                htmlFor={field.key}
                className="mb-1 block text-sm font-medium text-secondary"
              >
                {field.label}
              </label>
              <input
                id={field.key}
                type="text"
                placeholder={field.placeholder}
                value={state[field.key as SessionFieldKey] || ""}
                onChange={(e) => setField(field.key, e.target.value)}
                className="w-full rounded-lg border border-primary px-3 py-2 text-sm text-primary placeholder:text-placeholder focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <p className="mt-1 text-xs text-tertiary">{field.helperText}</p>
            </motion.div>
          ))}
        </motion.div>

        <button
          onClick={handleContinue}
          className="mt-8 w-full rounded-lg bg-brand-solid py-3 font-medium text-white transition duration-100 ease-linear hover:bg-brand-solid_hover"
        >
          Continue &rarr;
        </button>

        <p
          onClick={handleSkip}
          className="mt-3 cursor-pointer text-center text-sm text-tertiary transition duration-100 ease-linear hover:text-secondary"
        >
          Skip for now &rarr;
        </p>
      </div>
    </motion.div>
  );
}
