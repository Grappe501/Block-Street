import { NextRequest, NextResponse } from "next/server";
import { assertAuthenticated, getUserProfile } from "@/lib/auth/engine";
import { authErrorResponse } from "@/lib/auth/http";

export async function GET(request: NextRequest) {
  try {
    const session = assertAuthenticated(request.headers.get("cookie"));
    const profile = getUserProfile(session.user_id, session);
    return NextResponse.json({ profile });
  } catch (e) {
    return authErrorResponse(e);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = assertAuthenticated(request.headers.get("cookie"));
    const body = await request.json();
    const { updateUserProfile } = await import("@/lib/auth/engine");
    const updated = updateUserProfile(session.user_id, body);
    if (!updated) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    const profile = getUserProfile(session.user_id, session);
    return NextResponse.json({ profile });
  } catch (e) {
    return authErrorResponse(e);
  }
}
