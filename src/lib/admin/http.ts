import { NextRequest, NextResponse } from "next/server";
import { assertAuthenticated } from "@/lib/auth/engine";
import { authErrorResponse } from "@/lib/auth/http";
import { AdminError, assertAdminPermission, resolveAdminContext } from "@/lib/admin/engine";
import type { AdministrativeContext } from "@/lib/admin/types";

type AdminHandlerOptions = {
  /** Require a specific admin permission key. */
  permission?: string;
};

export function withAdmin(
  handler: (ctx: AdministrativeContext, request: NextRequest) => NextResponse | Promise<NextResponse>,
  options?: AdminHandlerOptions
) {
  return async (request: NextRequest) => {
    try {
      const session = assertAuthenticated(request.headers.get("cookie"));
      const ctx = resolveAdminContext(session);
      if (ctx.effective_permissions.length === 0) {
        throw new AdminError("Administration access required", 403);
      }
      if (options?.permission) {
        assertAdminPermission(ctx, options.permission);
      }
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
