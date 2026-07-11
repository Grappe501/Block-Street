import { NextRequest, NextResponse } from "next/server";
import { assertAuthenticated, setActiveContext } from "@/lib/auth/engine";
import { authErrorResponse } from "@/lib/auth/http";

export async function POST(request: NextRequest) {
  try {
    const session = assertAuthenticated(request.headers.get("cookie"));
    const body = await request.json();
    const { organization_id, workspace_id } = body as { organization_id: string; workspace_id: string };
    if (!organization_id || !workspace_id) {
      return NextResponse.json({ error: "organization_id and workspace_id required" }, { status: 400 });
    }
    const context = setActiveContext(session.session_id, organization_id, workspace_id);
    if (!context) {
      return NextResponse.json({ error: "You do not have access to that workspace" }, { status: 403 });
    }
    return NextResponse.json({ context });
  } catch (e) {
    return authErrorResponse(e);
  }
}
