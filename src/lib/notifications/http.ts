import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/session";
import { getUserById } from "@/lib/auth/engine";
import { NotificationError } from "@/lib/notifications/engine";
import { loadApiFeatureFlags } from "@/lib/api/data";
import { resolveApiContext } from "@/lib/api/context";
import { assertScopedPermission } from "@/lib/authority/gateway";
import {
  notificationCampaignScopeResolver,
  selfScopeResolver,
} from "@/lib/authority/scope-resolvers";

function isCampaignMutation(pathname: string): boolean {
  return pathname.includes("/notifications/campaigns/");
}

function isSelfServiceMutation(pathname: string): boolean {
  return /\/notifications\/[^/]+\/(read|unread|dismiss|archive|snooze)$/.test(pathname);
}

export function withNotifications(
  handler: (userId: string, request: NextRequest) => NextResponse | Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    try {
      const session = getSessionFromRequest(request.headers.get("cookie"));
      if (!session) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
      const user = getUserById(session.user_id);
      if (!user || user.account_status === "suspended") {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
      }
      const flags = loadApiFeatureFlags();
      if (flags.AUTHORITY_SCOPE_ENFORCEMENT_ENABLED) {
        const ctx = resolveApiContext(request);
        const path = request.nextUrl.pathname;
        if (isCampaignMutation(path)) {
          const permission = path.endsWith("/send") ? "communications.send" : "communications.approve";
          const scope = await notificationCampaignScopeResolver(ctx, request);
          assertScopedPermission(ctx, permission, scope, request);
        } else if (isSelfServiceMutation(path)) {
          const scope = await selfScopeResolver(ctx, request);
          assertScopedPermission(ctx, "notifications.request", scope, request);
        }
      }
      return await handler(session.user_id, request);
    } catch (e) {
      if (e instanceof NotificationError) return NextResponse.json({ error: e.message }, { status: e.status });
      const err = e as { message?: string; status?: number; code?: string };
      if (err.code === "PERMISSION_DENIED") {
        return NextResponse.json({ error: err.message ?? "Permission denied" }, { status: 403 });
      }
      return NextResponse.json({ error: err.message ?? "Error" }, { status: err.status ?? 500 });
    }
  };
}

export function notificationError(e: unknown) {
  if (e instanceof NotificationError) return NextResponse.json({ error: e.message }, { status: e.status });
  const err = e as { message?: string; status?: number };
  return NextResponse.json({ error: err.message ?? "Error" }, { status: err.status ?? 500 });
}
