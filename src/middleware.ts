import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { applySecurityHeaders } from "@/lib/security/headers";

const SESSION_COOKIE = "cos_session";
const PLACE_COOKIE = "bs_home_place";

const PUBLIC_API_PREFIXES = [
  "/api/auth/login",
  "/api/auth/session",
  "/api/auth/register",
  "/api/auth/passwordless/request",
  "/api/auth/passwordless/verify",
  "/api/auth/password/reset-request",
  "/api/auth/password/reset",
  "/api/v1/public",
  "/api/v1/invitations/wave1/accept",
  "/api/launch/home-place",
];

const PUBLIC_PAGE_PREFIXES = [
  "/login",
  "/register",
  "/passwordless",
  "/forgot-password",
  "/reset-password",
  "/invitations/accept",
  "/invite",
  "/access-denied",
  "/account-restricted",
  "/join",
  "/start",
  "/s/",
  "/directory",
];

function isPublicApi(pathname: string, method: string) {
  if (PUBLIC_API_PREFIXES.some((p) => pathname.startsWith(p))) return true;
  if (pathname.match(/^\/api\/invitations\/[^/]+$/) && !pathname.endsWith("/revoke")) return true;
  if (pathname.match(/^\/api\/invitations\/[^/]+\/accept$/)) return true;
  if (method === "GET" && pathname.startsWith("/api/content")) return true;
  if (method === "GET" && pathname.startsWith("/api/v1/public")) return true;
  if (method === "GET" && pathname === "/api/v1/health") return true;
  if (method === "GET" && pathname === "/api/v1/deployments/health") return true;
  if (method === "GET" && pathname === "/api/v1/monitoring/health") return true;
  if (method === "GET" && pathname === "/api/v1/security/posture") return true;
  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get(SESSION_COOKIE)?.value;
  const hasPlace = Boolean(request.cookies.get(PLACE_COOKIE)?.value);

  let response: NextResponse;

  if (pathname === "/admin/login" || pathname === "/login") {
    response = NextResponse.next();
    return applySecurityHeaders(response);
  }

  if (PUBLIC_PAGE_PREFIXES.some((p) => pathname.startsWith(p))) {
    response = NextResponse.next();
    return applySecurityHeaders(response);
  }

  // After a place is committed, hide map / browse entry points (directory search stays available)
  if (session && hasPlace) {
    if (
      pathname === "/map" ||
      pathname.startsWith("/join/community") ||
      pathname === "/schools" ||
      pathname === "/high-schools" ||
      pathname === "/private-schools"
    ) {
      response = NextResponse.redirect(new URL("/network", request.url));
      return applySecurityHeaders(response);
    }
  }

  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/account") ||
    pathname.startsWith("/notifications") ||
    pathname.startsWith("/app") ||
    pathname.startsWith("/network") ||
    pathname.startsWith("/choose-place")
  ) {
    if (!session) {
      const login = new URL(pathname.startsWith("/admin") ? "/admin/login" : "/login", request.url);
      login.searchParams.set("next", pathname);
      response = NextResponse.redirect(login);
      return applySecurityHeaders(response);
    }
    response = NextResponse.next();
    return applySecurityHeaders(response);
  }

  if (pathname.startsWith("/api/")) {
    if (!isPublicApi(pathname, request.method)) {
      if (!session) {
        response = NextResponse.json({ error: "Authentication required" }, { status: 401 });
        return applySecurityHeaders(response);
      }
    }
  }

  response = NextResponse.next();
  return applySecurityHeaders(response);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/account/:path*",
    "/notifications/:path*",
    "/api/:path*",
    "/login",
    "/register",
    "/passwordless",
    "/forgot-password",
    "/reset-password",
    "/invitations/:path*",
    "/invite/:path*",
    "/onboarding",
    "/select-organization",
    "/select-workspace",
    "/map",
    "/join/:path*",
    "/schools",
    "/high-schools",
    "/private-schools",
    "/app",
    "/network",
    "/directory",
    "/s/:path*",
    "/choose-place",
    "/start",
    "/july-14",
    "/feedback",
    "/presentations/:path*",
  ],
};
