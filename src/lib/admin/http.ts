import { NextRequest, NextResponse } from "next/server";
import { assertAuthenticated } from "@/lib/auth/engine";
import { authErrorResponse } from "@/lib/auth/http";
import { AdminError, resolveAdminContext } from "@/lib/admin/engine";
import type { AdministrativeContext } from "@/lib/admin/types";

export function withAdmin(
  handler: (ctx: AdministrativeContext, request: NextRequest) => NextResponse | Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    try {
      const session = assertAuthenticated(request.headers.get("cookie"));
      const ctx = resolveAdminContext(session);
      return await handler(ctx, request);
    } catch (e) {
      if (e instanceof AdminError) {
        return NextResponse.json({ error: e.message }, { status: e.status });
      }
      return authErrorResponse(e);
    }
  };
}

export function adminErrorResponse(e: unknown) {
  if (e instanceof AdminError) {
    return NextResponse.json({ error: e.message }, { status: e.status });
  }
  return authErrorResponse(e);
}
