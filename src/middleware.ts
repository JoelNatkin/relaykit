import { updateSession } from "@/utils/supabase/middleware";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // Run on all routes except static files, Next.js internals, and /dev/* routes
    "/((?!_next/static|_next/image|favicon.ico|icon.png|dev/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
