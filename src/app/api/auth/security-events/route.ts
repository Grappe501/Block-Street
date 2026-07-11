import { NextRequest, NextResponse } from "next/server";
import { assertAuthenticated, getAuditEvents } from "@/lib/auth/engine";
import { authErrorResponse } from "@/lib/auth/http";

export async function GET(request: NextRequest) {
  try {
    assertAuthenticated(request.headers.get("cookie"));
    return NextResponse.json({ events: getAuditEvents(100) });
  } catch (e) {
    return authErrorResponse(e);
  }
}
