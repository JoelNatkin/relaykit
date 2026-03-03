import { NextRequest, NextResponse } from "next/server";
import { generateComplianceSite } from "@/lib/compliance-site/generator";
import type { IntakeData } from "@/lib/templates/types";
import type { UseCaseId } from "@/lib/intake/use-case-data";

const VALID_PAGES = ["index.html", "privacy.html", "terms.html", "sms.html"];

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;

  // Required params
  const useCase = sp.get("use_case") as UseCaseId | null;
  const businessName = sp.get("business_name");

  if (!useCase || !businessName) {
    return NextResponse.json(
      { error: "Missing required params: use_case, business_name" },
      { status: 400 },
    );
  }

  const intake: IntakeData = {
    use_case: useCase,
    business_name: businessName,
    business_description: sp.get("business_description") ?? `${businessName} provides services to customers.`,
    email: sp.get("email") ?? "hello@example.com",
    phone: sp.get("phone") ?? "5551234567",
    contact_name: sp.get("contact_name") ?? "Owner",
    address_line1: sp.get("address_line1") ?? "123 Main St",
    address_city: sp.get("address_city") ?? "San Francisco",
    address_state: sp.get("address_state") ?? "CA",
    address_zip: sp.get("address_zip") ?? "94102",
    website_url: sp.get("website_url") ?? null,
    service_type: sp.get("service_type") ?? null,
    product_type: sp.get("product_type") ?? null,
    app_name: sp.get("app_name") ?? null,
    community_name: sp.get("community_name") ?? null,
    venue_type: sp.get("venue_type") ?? null,
    has_ein: sp.get("has_ein") === "true",
    ein: sp.get("ein") ?? null,
    business_type: sp.get("business_type") ?? null,
  };

  const site = generateComplianceSite(intake);

  // Which page to serve
  let page = sp.get("page") ?? "index.html";
  if (!page.endsWith(".html")) page += ".html";
  if (!VALID_PAGES.includes(page)) page = "index.html";

  const html = site.pages[page];

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
