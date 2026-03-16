"use client";

// Render the same full messages page as the public /sms/[category]/messages route.
// The component reads category from useParams (falls back to "appointments")
// and layout from searchParams (defaults to steps layout).
// We'll differentiate the logged-in vs public versions later.

import PublicMessagesPage from "@/app/sms/[category]/messages/page";

export default function AppMessages() {
  return <PublicMessagesPage />;
}
