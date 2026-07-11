import { NextResponse } from "next/server";
import { assertAuthenticated, getAuditEvents } from "@/lib/auth/engine";

export async function GET(request: Request) {
  try {
    assertAuthenticated(request.headers.get("cookie"));
    return NextResponse.json({ events: getAuditEvents() });
  } catch (e) {
    const err = e as { status?: number; message?: string };
    return NextResponse.json({ error: err.message ?? "Unauthorized" }, { status: err.status ?? 401 });
  }
}
