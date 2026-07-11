import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "cos_session";

const PUBLIC_API_PREFIXES = [
  "/api/auth/login",
  "/api/auth/session",
  "/api/auth/register",
  "/api/auth/passwordless/request",
  "/api/auth/passwordless/verify",
  "/api/auth/password/reset-request",
  "/api/auth/password/reset",
];

const PUBLIC_PAGE_PREFIXES = [
  "/login",
  "/register",
  "/passwordless",
  "/forgot-password",
  "/reset-password",
  "/invitations/accept",
  "/access-denied",
  "/account-restricted",
];

function isPublicApi(pathname: string, method: string) {
  if (PUBLIC_API_PREFIXES.some((p) => pathname.startsWith(p))) return true;
  if (pathname.match(/^\/api\/invitations\/[^/]+$/) && !pathname.endsWith("/revoke")) return true;
  if (pathname.match(/^\/api\/invitations\/[^/]+\/accept$/)) return true;
  if (method === "GET" && pathname.startsWith("/api/content")) return true;
  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login" || pathname === "/login") {
    return NextResponse.next();
  }

  if (PUBLIC_PAGE_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin") || pathname.startsWith("/account")) {
    const session = request.cookies.get(SESSION_COOKIE)?.value;
    if (!session) {
      const login = new URL(pathname.startsWith("/admin") ? "/admin/login" : "/login", request.url);
      login.searchParams.set("next", pathname);
      return NextResponse.redirect(login);
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    if (!isPublicApi(pathname, request.method)) {
      const session = request.cookies.get(SESSION_COOKIE)?.value;
      if (!session) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/api/:path*", "/login", "/register", "/passwordless", "/forgot-password", "/reset-password", "/invitations/:path*", "/onboarding", "/select-organization", "/select-workspace"],
};
