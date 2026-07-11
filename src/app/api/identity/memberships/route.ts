import { NextRequest, NextResponse } from "next/server";
import { assertAuthenticated, resolveMemberships } from "@/lib/auth/engine";
import { authErrorResponse } from "@/lib/auth/http";

export async function GET(request: NextRequest) {
  try {
    const session = assertAuthenticated(request.headers.get("cookie"));
    return NextResponse.json({ memberships: resolveMemberships(session.user_id) });
  } catch (e) {
    return authErrorResponse(e);
  }
}
