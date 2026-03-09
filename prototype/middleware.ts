import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Strip all cookies to avoid 431 errors from production app cookies on localhost
  const headers = new Headers(request.headers);
  headers.delete("cookie");
  return NextResponse.next({ request: { headers } });
}
