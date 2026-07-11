import { NextRequest, NextResponse } from "next/server";
import { assertAuthenticated, getUserProfile } from "@/lib/auth/engine";

export async function GET(request: NextRequest) {
  try {
    const session = assertAuthenticated(request.headers.get("cookie"));
    const profile = getUserProfile(session.user_id);
    return NextResponse.json({ profile });
  } catch (e) {
    const err = e as { status?: number; message?: string };
    return NextResponse.json({ error: err.message ?? "Unauthorized" }, { status: err.status ?? 401 });
  }
}
