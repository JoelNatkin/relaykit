"use client";

/* ── Opt-in page removed from wizard flow ──
   The opt-in step was tabled (see D-317 and WORKSPACE_DESIGN_SPEC.md).
   The layout above now redirects all /opt-in traffic to /messages
   regardless of registration state. This file renders nothing but
   is kept as a placeholder so Next.js can still resolve the route
   without 404-ing before the redirect fires. The original page
   content is preserved below for future reference.

   ── Original implementation ──

   import { useEffect } from "react";
   import { MESSAGES } from "@/data/messages";
   import { useSession } from "@/context/session-context";
   import { CatalogOptIn } from "@/components/catalog/catalog-opt-in";

   const PERSONALIZE_KEY = "relaykit_personalize";

   function loadPersonalization() {
     try {
       const stored = localStorage.getItem(PERSONALIZE_KEY);
       if (stored) return JSON.parse(stored);
     } catch {
       // localStorage unavailable
     }
     return { appName: "", website: "", serviceType: "" };
   }

   export default function OptInPreviewPage() {
     const { state, setField } = useSession();

     const categoryId = state.selectedCategory || "appointments";
     const allMessages = MESSAGES[categoryId] || [];
     const coreMessages = allMessages.filter((m) => m.tier !== "expansion");

     useEffect(() => {
       const saved = loadPersonalization();
       if (saved.appName) setField("appName", saved.appName);
       if (saved.website) setField("website", saved.website);
       if (saved.serviceType) setField("serviceType", saved.serviceType);
     }, []);

     return (
       <div className="max-w-[400px] mx-auto">
         <div className="mb-2">
           <h2 className="text-lg font-semibold text-text-primary">Message opt-in</h2>
         </div>
         <p className="mb-8 text-sm text-text-secondary">
           Opt-in, opt-out, and consent records — all handled for you.
         </p>
         <CatalogOptIn
           appName={state.appName}
           website={state.website}
           allMessages={coreMessages}
         />
       </div>
     );
   } */

export default function OptInPreviewPage() {
  return null;
}
