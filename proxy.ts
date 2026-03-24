import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  //   // Your existing root redirect
  if (pathname === "/auth") {
    return NextResponse.next();
  }

  // Clone and forward ALL incoming headers (includes Cookie, Origin, etc.)
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  return response;
}

// Broad matcher: Runs on all routes except API/static/internal files
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
