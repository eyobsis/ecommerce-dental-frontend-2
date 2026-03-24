// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define the domains allowed to access the application
// 'root' will handle the naked domain (localhost:3000 or domain.com)

// Regular expression to reliably find the domain part (e.g., 'localhost:3000')
const DOMAIN_PARTS_REGEX = /(?:localhost:\d+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,})$/i;

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get("host") || "";

  // 1. Determine the effective subdomain
  let subdomain: string | null = null;
  const match = hostname.match(DOMAIN_PARTS_REGEX);

  if (match) {
    const domainPart = match[0];
    const prefix = hostname.substring(0, hostname.length - domainPart.length);

    if (prefix && prefix.endsWith(".")) {
      subdomain = prefix.slice(0, -1); // e.g., 'admin'
    } else {
      subdomain = "root"; // Naked domain access (e.g., http://localhost:3000)
    }
  } else {
    subdomain = "unknown"; // Fallback
  }

  console.log(`Hostname: ${hostname}`);
  console.log(`Subdomain: ${subdomain}`);

  // 2. Define the subdomains that are authorized to proceed to the app pages
  const AUTHORIZED_SUBDOMAINS = ["admin", "designer"];
  const isAuthorized = AUTHORIZED_SUBDOMAINS.includes(subdomain as string);
  console.log("is authorizied ", isAuthorized);
  // console.log('subdomina ')
  // --- RESTRICTION LOGIC ---

  // If the subdomain is NOT one of the authorized ones, rewrite to /unauthorized.
  if (!isAuthorized) {
    // *** FIX: Rewrite to an internal path, not a full URL ***
    return NextResponse.next();
    // return NextResponse.redirect("http://admin.localhost:3000");
  }

  // --- SUBDOMAIN MAPPING LOGIC (Only runs if authorized) ---

  // For 'admin' and 'designer', rewrite the path to include the subdomain prefix.
  if (isAuthorized) {
    // e.g., admin.localhost:3000/dashboard -> /admin/dashboard
    url.pathname = `/${subdomain}${url.pathname}`;
    console.log(`Rewriting to internal path: ${url.pathname}`);
    return NextResponse.rewrite(url);
  }

  // Fallback (Should not be reached if logic is correct)
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/auth/register",
    // Ensure this matcher is correct for your routes
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
