import { NextRequest, NextResponse } from "next/server";
import { assertAuthenticated, linkProviderScaffold } from "@/lib/auth/engine";
import { authErrorResponse } from "@/lib/auth/http";

export async function POST(request: NextRequest) {
  try {
    const session = assertAuthenticated(request.headers.get("cookie"));
    const body = await request.json();
    const { provider } = body as { provider: "google" | "microsoft" };
    if (!provider) return NextResponse.json({ error: "provider required" }, { status: 400 });
    const result = linkProviderScaffold(session.user_id, provider);
    return NextResponse.json(result);
  } catch (e) {
    return authErrorResponse(e);
  }
}
